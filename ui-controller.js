import { api } from "./dashboard/helper.js";

// 2. Add the UI Update Functions
export function updateSubFeatures(allData) {
    const category = document.getElementById('feature').value;
    const subSelect = document.getElementById('subFeature');
    subSelect.innerHTML = ""; // Clear existing options

    if (allData && allData[category]) {
        Object.keys(apiData[category]).forEach(api => {
            const opt = document.createElement('option');
            opt.value = api;
            opt.innerHTML = api.replace(/-/g, ' ').toUpperCase();
            subSelect.appendChild(opt);
        });
        updateJsonPayload(allData);
    }
}

export function updateJsonPayload(allData) {
    const category = document.getElementById('feature').value;
    const subFeature = document.getElementById('subFeature').value;
    const jsonArea = document.getElementById('payload');

    if (allData[category] && allData[category][subFeature]) {

        const data = allData[category][subFeature];
        jsonArea.value = JSON.stringify(data.payload, null, 2);

    }
}

function resolveDynamicPath(path, state) {
    // This regex looks for anything inside curly braces: {variableName}
    return path.replace(/\{(\w+)\}/g, (match, key) => {
        // If api[key] exists (e.g., api.planId), use it. Otherwise, keep the placeholder.
        return state[key] !== undefined ? state[key] : match;
    });
}

// 3. Your existing runTest function (Updated to include subFeature)
export async function runTest(event, allData) {
    if (event) event.preventDefault();

    const selectedCat = document.getElementById('feature').value;
    const selectedSub = document.getElementById('subFeature').value;

    const statusDiv = document.getElementById('status');
    const resultsArea = document.getElementById('results-area');
    const finalStepContainer = document.getElementById('final-step-container');
    const finalStepDisplay = document.getElementById('final-step-display');
    statusDiv.textContent = "Executive API Call";

    // FIX: Define these variables BEFORE checking them

    if (!allData || !allData[selectedCat] || !allData[selectedCat][selectedSub]) {
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = "Error: Invalid API configuration selected.";
        return;
    }

    const apiConfig = allData[selectedCat][selectedSub];
    const certFile = document.getElementById('certificate_upload').files[0];
    const keyFile = document.getElementById('key_upload').files[0];

    if (!certFile || !keyFile) {
        statusDiv.innerHTML = "Error: Both Certificate and Private Key files are required.";
        statusDiv.style.background = "#ffcdd2";
        return;
    }

    resultsArea.style.display = 'block';
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = "Processing mTLS Handshake & Encryption...";
    statusDiv.style.background = "#fff3cd";
    finalStepContainer.style.display = 'none';
    finalStepDisplay.textContent = "";

    const formData = new FormData();

    const method = document.getElementById('apiMethod').value;

    let rawPayload = document.getElementById('payload').value;
    const resolvedPayload = resolveDynamicPath(rawPayload, api);

    let txnRefForHmac = "";
    try {
        const parsedPayload = JSON.parse(resolvedPayload);
        // Navigate the object: transaction -> txnReference
        txnRefForHmac = parsedPayload.transaction?.txnReference || "";
    } catch (e) {
        console.warn("Could not parse payload for reference, fallback to default.");
    }

    formData.append('certificate_upload', certFile);
    formData.append('key_upload', keyFile);
    formData.append('mid', document.getElementById('apiKey').value);
    formData.append('apiSecret', document.getElementById('accessToken').value);
    formData.append('reqType', method);
    formData.append('payload', resolvedPayload);
    formData.append('apiType', apiConfig.apiType || "clientAuth");
    formData.append('reference', txnRefForHmac);

    const baseUrl = document.getElementById('environment').value;

    const resolvedPath = resolveDynamicPath(apiConfig.path, api);

    const finalUrl = `${baseUrl}${resolvedPath}`;
    formData.append('fullUrl', finalUrl);

    try {
        const response = await fetch('/run-direct-test', { method: 'POST', body: formData });
        if (!response.ok) throw new Error(await response.text());

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Server returned HTML instead of JSON. Check terminal!`);
        }

        const result = await response.json();
        if (result.success && result.output) {

            const keyToSave = ['planId', 'subscriptionId', 'paymenttransactionReference'];
            keyToSave.forEach(key => {
                if (result.output[key]) {
                    api[key] = result.output[key];
                    console.log(`Saved ${key}:`, api[key]);
                }
            });
            updateJsonPayload(allData);
            statusDiv.innerHTML = `<b style="color: green;">✔ API Call Successful</b>`;
            let displayText = "--- API RESPONSE ---\n" + JSON.stringify(result.output, null, 2);
            if (result.finalStep) {
                displayText += "\n\n--- Data after Decrypted ---\n" + JSON.stringify(result.finalStep, null, 2);
                const { endpoint, data } = result.finalStep;

                let cleanData = (typeof data === 'string') ? data : JSON.stringify(data);
                console.log("cleanData.......", cleanData);


                const form = document.createElement('form');
                form.method = 'POST';
                form.action = endpoint;
                form.target = '_top';

                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'data';
                input.value = cleanData;

                form.appendChild(input);
                document.body.appendChild(form);

                console.log("DEBUG: Posting to", endpoint);
                console.log("DEBUG: Data value", cleanData);
                console.log("Form is ...", form);

                form.submit();
            }
            finalStepDisplay.textContent = displayText;
            finalStepContainer.style.display = 'block';
            console.log("Full Server Result:", result);
        } else {
            statusDiv.innerHTML = `<b style="color: red;">✘ Error: ${result.output}</b>`;
            finalStepContainer.style.display = 'none';
        }
    } catch (e) {
        statusDiv.innerHTML = `Request Failed: ${e.message}`;
        statusDiv.style.background = "#ffcdd2";
    }
}