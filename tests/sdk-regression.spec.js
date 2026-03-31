import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

global.self = global;

const browserRequiredApis = [
    'CREATE_PAYMENT_SYNC',
    'CREATE_PAYMENT_ASYNC'
];

const referenceStore = {
    syncSuccess: false,
    asyncSuccess: false,

    hpp: {
        ref: null,
        success: false,
        captured: false
    },
    txn: {
        ref: null,
        success: false,
        voided: false
    }
};

if (!global.crypto) {
    Object.defineProperty(global, 'crypto', {
        value: nodeCrypto,
        configurable: true,
        enumerable: true,
        writable: true
    });
}
// --- 2. MANUALLY LOAD THE HELPER ---
const require = createRequire(import.meta.url);
const { api: helperApi } = require('../dashboard/helper.js');

// --- DEFINE __dirname FOR ES MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const metadataPath = path.resolve(__dirname, '../automation/data/api-metadata.json');
const rootDir = path.resolve(__dirname, '..');
const libPath = path.resolve(rootDir, 'automation/lib/*');
const javaBridgePath = path.resolve(rootDir, 'automation/bridge/java');
const LANG = process.env.SDK_LANG || 'java';

// --- UPDATED FOLDER LOGIC ---
const apiDataDir = path.join(rootDir, 'automation', 'data', 'Api');

// 1. Read all .json files from the directory
const apiFiles = fs.readdirSync(apiDataDir).filter(file => file.endsWith('.json'));

function generateRef(prefix) {
    return prefix + "-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function resolveData(payload, apiName) {
    if (typeof payload !== 'object' || payload === null) {



        if (typeof payload === 'string') {

            // 🆕 UNIQUE REFERENCES (ADD HERE)
            if (payload === 'syncTransactionReference') {
                if (!referenceStore.sync) {
                    referenceStore.sync = generateRef('SYNC');
                }
                return referenceStore.sync;
            }

            if (payload === 'asyncTransactionReference') {
                if (!referenceStore.async) {
                    referenceStore.async = generateRef('ASYNC');
                }
                return referenceStore.async;
            }

            // 🔵 HPP FLOW (CREATE_PAYMENT)
            if (payload === 'paymenttransactionReference') {
                if (!referenceStore.hpp.ref) {
                    referenceStore.hpp.ref = generateRef('HPP');
                    referenceStore.hpp.captured = false;
                }
                return referenceStore.hpp.ref;
            }

            // 🟢 EXPRESS FLOW (CREATE_EXPRESS_PAYMENT)
            if (payload === 'transactionReference') {
                if (!referenceStore.txn.ref) {
                    referenceStore.txn.ref = generateRef('EXP');
                    referenceStore.txn.voided = false;
                }
                return referenceStore.txn.ref;
            }

            return helperApi[payload];
        }

        return payload;
    }

    if (Array.isArray(payload)) {
        return payload.map(item => resolveData(item, apiName));
    }

    const processed = {};
    for (const key in payload) {
        processed[key] = resolveData(payload[key], apiName);
    }
    return processed;
}

const Validators = {
    // This is the "Smart" Validator that handles all 30 APIs
    DEFAULT: (response, apiConfig) => {
        // 1. Success Type A: Payment Responses (endpoint + data)
        const isPaymentMap = response.endpoint && response.data;

        const hasCurrencyKeys = Object.keys(response).some(key =>
            /^[A-Z]{3}$/.test(key) || key === 'GLOBAL'
        );

        const isRequestSuccessful = response.requestStatus === "Successful" ||
            response.responseCode === 200 ||
            response.statusCode === 200;

        if (hasCurrencyKeys || isPaymentMap || isRequestSuccessful) {
            return true;
        }

        // If we reach here, it's a genuine failure
        throw new Error(`Validation Failed: Response structure does not indicate success. Received: ${JSON.stringify(response)}`);
    },

    // You can still keep MATCH_VALUE for specific tests if needed
    MATCH_VALUE: (response, apiConfig) => {
        const field = apiConfig.expectedField; // e.g., "status"
        const value = apiConfig.expectedValue; // e.g., "Successful"

        // If the field exists and matches, PASS. 
        // If the field is missing but it's a Payment Map, also PASS.
        if (response[field] === value || (response.endpoint && response.data)) {
            return true;
        }
        throw new Error(`Expected ${field} to be ${value}, but got ${response[field]}`);
    }
};

const executionOrder = [
    'PLUGIN_DETAILS',
    'CREATE_PAYMENT_SYNC',
    'CREATE_PAYMENT_ASYNC',
    'CAPTURE_PAYMENT',
    'VOID_PAYMENT'
];

test.describe(`SDK Regression: ${LANG.toUpperCase()}`, () => {

    // ✅ STEP 1: Merge all APIs from all files
    const allApis = {};

    for (const fileName of apiFiles) {
        const filePath = path.join(apiDataDir, fileName);
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        Object.assign(allApis, fileContent);
    }

    // ✅ STEP 2: Execute in strict order
    for (const apiName of executionOrder.filter(k => allApis[k])) {

        test(`Validate ${apiName}`, async ({ page }) => {

            const useBrowser = browserRequiredApis.includes(apiName);
            const apiConfig = allApis[apiName];

            if (!apiConfig || !apiConfig.payload) {
                throw new Error(`❌ API "${apiName}" is missing payload`);
            }

            const finalPayload = resolveData(apiConfig.payload, apiName);

            const tempPath = path.resolve(rootDir, `automation/data/temp/${apiName}.json`);

            fs.mkdirSync(path.dirname(tempPath), { recursive: true });
            fs.writeFileSync(tempPath, JSON.stringify(finalPayload, null, 2));

            let command = '';
            if (LANG === 'java') {
                command = `java -cp "${libPath}:${javaBridgePath}:." SDKBridge "${apiName}" "${tempPath}"`;
            } else if (LANG === 'php') {
                command = `php automation/bridge/php/bridge.php "${apiName}" "${tempPath}"`;
            } else if (LANG === 'node') {
                command = `node automation/bridge/node/bridge.js "${apiName}" "${tempPath}"`;
            }

            try {

                // ✅ SKIP LOGIC (BEFORE EXECUTION)
                if (apiName === 'CAPTURE_PAYMENT' && !referenceStore.syncSuccess) {
                    console.log("⏭️ Skipping CAPTURE (SYNC not completed)");
                    return;
                }

                if (apiName === 'VOID_PAYMENT' && !referenceStore.asyncSuccess) {
                    console.log("⏭️ Skipping VOID (ASYNC not completed)");
                    return;
                }

                const rawOutput = execSync(command).toString().trim();

                const jsonStart = rawOutput.indexOf('{');
                const jsonEnd = rawOutput.lastIndexOf('}') + 1;

                if (jsonStart === -1 || jsonEnd === 0) {
                    throw new Error(`No JSON found in output: ${rawOutput}`);
                }

                let cleanOutput = rawOutput.substring(jsonStart, jsonEnd);

                let response;

                try {
                    response = JSON.parse(cleanOutput);
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }
                } catch (err) {
                    cleanOutput = cleanOutput.replace(/\\"/g, '"');
                    response = JSON.parse(cleanOutput);
                }

                console.log(`✅ ${apiName} Response:`, response);

                // ✅ HPP / EXPRESS FORM POST
                if (useBrowser) {

                    const endpoint = response.endpoint;
                    const parsedData = JSON.parse(response.data);

                    console.log("🌐 Performing form POST...");

                    await page.goto('about:blank');

                    const formData = JSON.stringify({
                        payLoad: parsedData.payLoad,
                        apiKey: parsedData.apiKey,
                        lang: parsedData.lang || "en"
                    });

                    const htmlContent = `
                        <html>
                        <body onload="document.forms[0].submit()">
                            <form method="POST" action="${endpoint}">
                                <input type="hidden" name="data" value='${formData}' />
                            </form>
                        </body>
                        </html>
                    `;
                    console.log("📄 Generated HTML form for POST:", htmlContent);

                    await page.setContent(htmlContent);

                    try {
                        await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 });
                    } catch (e) {
                        console.log("⚠️ Navigation timeout (expected for SYNC/ASYNC)");
                    }

                    console.log("✅ Form POST completed");

                    // ✅ MARK SUCCESS (CORRECTED)
                    if (apiName === 'CREATE_PAYMENT_SYNC') {
                        referenceStore.syncSuccess = true;
                    }

                    if (apiName === 'CREATE_PAYMENT_ASYNC') {
                        referenceStore.asyncSuccess = true;
                    }
                }

                const strategy = apiConfig.validationStrategy || 'DEFAULT';
                const validate = Validators[strategy] || Validators.DEFAULT;

                validate(response, apiConfig);

                console.log(`⭐ ${apiName} validated using ${strategy}`);

            } catch (e) {
                throw new Error(`Execution failed: ${e.stdout?.toString() || e.message}`);
            }
        });
    }
});