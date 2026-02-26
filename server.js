const express = require('express');
const fs = require('fs');
const multer = require('multer');
const { request } = require('playwright'); // 1. Import Playwright
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const path = require('path');
const { Console, error } = require('console');
const app = express();
const uploadMiddleware = multer({ dest: 'uploads/' }).fields([
    { name: 'certificate_upload', maxCount: 1 },
    { name: 'key_upload', maxCount: 1 }
]);

app.use(express.json());
app.use(express.static('dashboard'));


function getCustomTimestamp() {
    // 1. Get current time in India (IST)
    const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(new Date());

    // Map parts to the specific Go format: "15040502012006"
    // (HHmmssDDMMYYYY)
    const p = {};
    parts.forEach(({ type, value }) => p[type] = value);

    // Ensure the structure is HH mm ss DD MM YYYY
    return `${p.hour}${p.minute}${p.second}${p.day}${p.month}${p.year}`;
}

// function generateHmacHeaders(apiSecret, mid, reference) {
//     const currTime = new Date();
//     const utcHeaderDate = currTime.toUTCString().replace("UTC", "GMT");
//     // const dateHeaderStr = currTime.toUTCString();
//     const goTimestamp = getCustomTimestamp();
//     const path = "+/pArTnErApI+";
//     const encrypt = "clientAuth" + path + goTimestamp + "+" + reference;
//     console.log(" encrypt---", encrypt)


//     const hashStr = crypto
//         .createHmac('sha256', apiSecret)
//         .update(encrypt)
//         .digest('base64');

//     console.log("hashStr ---", hashStr)

//     return {
//         "dateHeader": utcHeaderDate,
//         "Authorization": `hmac ${mid}:${reference}:${hashStr}`
//     };
// }

function generateHmacHeaders(apiSecret, mid, reference) {
    const currTime = new Date();
    const utcHeaderDate = currTime.toUTCString().replace("UTC", "GMT");
    // const dateHeaderStr = currTime.toUTCString();
    const goTimestamp = getCustomTimestamp();
    const path = "+/pArTnErApI+";
    const encrypt = "clientAuth" + path + goTimestamp + "+" + reference;

    const hashStr = crypto
        .createHmac('sha256', apiSecret)
        .update(encrypt)
        .digest('base64');

    return {
        "dateHeader": utcHeaderDate,
        "Authorization": `hmac ${mid}:${reference}:${hashStr}`
    };
}

function extractThumbprint(certContent) {
    const certString = certContent.toString();
    const baseString = certString.match(/-----BEGIN CERTIFICATE-----\s*([\s\S]+?)\s*-----END CERTIFICATE-----/i);
    if (!baseString) throw new Error("Not a valid certificate");

    const rawCert = Buffer.from(baseString[1], 'base64');
    const sha256sum = crypto.createHash('sha1').update(rawCert).digest('hex');
    return sha256sum.toUpperCase().replace(/(.{2})(?!$)/g, '$1:');
}

function encryptPayload(payloadObj, accessToken, fingerprint) {
    // Pad string with spaces to block size 16
    let source = JSON.stringify(payloadObj);
    const padLength = 16 - (source.length % 16);
    source += ' '.repeat(padLength);

    // Bitwise OR Key Derivation
    const thumbprintBytes = Buffer.from(fingerprint, 'utf8');
    const keyBytes = Buffer.from(accessToken, 'utf8');
    let keyStr = '';
    for (let i = 0; i < accessToken.length; i++) {
        keyStr += String.fromCharCode(keyBytes[i] | thumbprintBytes[i % thumbprintBytes.length]);
    }

    // Convert to CryptoJS format
    let keyHex = '';
    for (let i = 0; i < keyStr.length; i++) {
        keyHex += keyStr.charCodeAt(i).toString(16).padStart(2, '0');
    }
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(source, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.NoPadding
    });

    return iv.toString().concat(encrypted.ciphertext.toString());
}

function decryptPayload(encryptedHex, fingerprint) {
    try {
        // 1. generateDecryptKey() -> First 32 chars of the colon-string
        const decryptKeyString = fingerprint.substring(0, 32);

        if (decryptKeyString.length !== 32) {
            throw new Error(`Key length mismatch! Expected 32, got ${decryptKeyString.length}. String: ${decryptKeyString}`);
        }
        const key = Buffer.from(decryptKeyString, 'utf8');

        // 2. iv = enc.Hex.parse(data.substring(0, 32)) 
        // This takes 32 HEX characters = 16 bytes
        const iv = Buffer.from(encryptedHex.substring(0, 32), 'hex');

        // 3. payload = data.substring(32)
        const ciphertext = Buffer.from(encryptedHex.substring(32), 'hex');

        // 4. Setup Decipher with NoPadding
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        decipher.setAutoPadding(false);

        let decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

        // 5. Convert to String and apply cleanDecryptedData() logic
        const decipherFinal = decrypted.toString('utf8');

        return decipherFinal
            .replace(/[\u0000-\u001F]+/g, '') // Remove non-printable/null characters
            .trim();
    }
    catch (e) {
        console.error("Decryption failed:", e.message);
        throw e;
    }
}

function finalResponse(decryptedUrl, responseData, fingerprint, accessToken, merchantID, apiType) {
    try {

        // 1. Check if we actually have the payLoad (Capital L)
        if (!responseData || !responseData.payLoad) {
            throw new Error("responseData.payLoad is missing or undefined");
        }

        // 2. The URL logic
        var endpoint = decryptedUrl;
        var updatedUrl = endpoint.replace("//", "/");
        var urlParts = updatedUrl.split("/");

        if (urlParts.length > 1) {
            const txnReference = crypto.randomUUID();

            // Generate HMAC for the second step
            const authObj = generateHmacHeaders(apiType, txnReference, accessToken, merchantID);

            const reqBody = {
                "gatewayReference": urlParts[urlParts.length - 1], // The GUID from the URL
                "merchantID": merchantID,
                ...authObj
            };

            // Encrypt the new request
            var payloadData = encryptPayload(reqBody, accessToken, fingerprint);

            var finalData = {
                "data": JSON.stringify({
                    payLoad: payloadData,
                    "apiKey": merchantID
                }),
                "endpoint": endpoint
            };

            return finalData;
        }
    } catch (err) {
        console.log("Error in finalResponse logic:", err.message);
        return { error: err.message };
    }
}

app.post('/run-direct-test', (req, res) => {
    console.log(">>> [1] Connection established");

    // Execute Multer manually to catch errors
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error("Multer Middleware Error:", err);
            return res.status(400).json({ success: false, output: err.message });
        }

        console.log("--- Playwright API Request Received ---");
        let certPath;
        let keyPath;

        try {
            const { mid, apiSecret, payload, fullUrl, apiType } = req.body;

            const certFile = req.files['certificate_upload']?.[0];
            const keyFile = req.files['key_upload']?.[0];

            if (!certFile || !keyFile) throw new Error("Missing Certificate or Key file");

            const certPath = certFile.path;
            const keyPath = keyFile.path;

            // 1. Encryption
            const certBuffer = fs.readFileSync(certPath);
            const fingerprint = extractThumbprint(certBuffer);
            const encryptedText = encryptPayload(JSON.parse(payload), apiSecret, fingerprint);

            // 2. Create the final object the server expects
            const finalBody = {
                apiKey: mid,
                payLoad: encryptedText,
            };

            console.log("Which Certificate is being used? ", certFile.originalname);
            console.log("Which AccessToken is being used? ", apiSecret);
            console.log("Which MID is being used? ", mid);

            const finalBodyStr = JSON.stringify(finalBody);
            const reference = crypto.randomUUID();
            const hmacData = generateHmacHeaders(apiSecret, mid, reference, finalBodyStr, fullUrl);
            // const hmacData = generateHmacHeaders(apiType, reference, finalBodyStr, fullUrl);

            console.log(">>> [3] HMAC Headers generated:", hmacData);

            // 1. Initialize Playwright Request Context with mTLS
            const origin = new URL(fullUrl).origin;
            const requestContext = await request.newContext({
                ignoreHTTPSErrors: true,
                clientCertificates: [{
                    origin: origin,
                    certPath: certPath,
                    keyPath: keyPath
                }]
            });

            console.log(`Sending Playwright POST to: ${fullUrl}`);

            // 2. Execute Request
            const response = await requestContext.post(fullUrl, {
                data: finalBodyStr,
                headers: {
                    ...hmacData,
                    "Content-Type": "application/json"
                }
            });

            const status = response.status();
            console.log(`>>> [4] Playwright received response with status: ${status}`);
            const responseData = await response.json();
            console.log("ResonseData-----", responseData);

            if (responseData.payLoad && responseData.status == "Successful") {
                try {
                    console.log(">>> [5] Starting Decryption...")

                    const decryptedString = decryptPayload(responseData.payLoad, fingerprint);
                    console.log(">>> Decrypted Content:", decryptedString);

                    const result = finalResponse(decryptedString, responseData, fingerprint, apiSecret, mid, apiType);

                    res.json ({
                        success:true,
                        status: response.status(),
                        output: responseData,
                        finalStep: result
                    })
                } catch (error) {
                    console.error("!!! Decryption Failed !!!", error.message);
                }

            }
            await requestContext.dispose();

        } catch (error) {
            console.error("!!! PLAYWRIGHT ERROR !!!", error.message);

            // Cleanup on error if files exist
            if (!res.headersSent) res.status(500).json({ success: false, output: error.message });
        } finally {
            if (certPath && fs.existsSync(certPath)) fs.unlinkSync(certPath);
            if (keyPath && fs.existsSync(keyPath)) fs.unlinkSync(keyPath);
        }
    });
});

// ADD THIS TO THE VERY BOTTOM OF server.js
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("!!! MULTER ERROR:", err.message, "Field:", err.field);
        return res.status(400).json({ success: false, output: `Multer Error: ${err.message}` });
    }
    console.error("SERVER ERROR:", err.stack);
    res.status(500).send(err.message);
});

app.listen(3001, () => console.log('Dashboard running on http://localhost:3001'));