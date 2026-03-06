
// 2. Add the UI Update Functions
export function updateSubFeatures(allData) {
    const category = document.getElementById('feature').value;
    const subSelect = document.getElementById('subFeature');
    // const selectedCategory = category.value;
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

    const formData = new FormData();
    formData.append('certificate_upload', certFile);
    formData.append('key_upload', keyFile);
    formData.append('mid', document.getElementById('apiKey').value);
    formData.append('apiSecret', document.getElementById('accessToken').value);
    formData.append('reqType', document.getElementById('apiMethod').value);
    formData.append('payload', document.getElementById('payload').value);
    formData.append('apiType', apiConfig.apiType || "default");

    const baseUrl = document.getElementById('environment').value;
    formData.append('fullUrl', `${baseUrl}${apiConfig.path}`);

    try {
        const response = await fetch('/run-direct-test', { method: 'POST', body: formData });
        if (!response.ok) throw new Error(await response.text());

        const result = await response.json();
        if (result.success) {
            statusDiv.innerHTML = `<b style="color: green;">✔ API Call Successful</b>`;
            finalStepDisplay.textContent = JSON.stringify(result.output, null, 2);
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