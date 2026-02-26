// api-config.js
import { api } from './helper.js'

window.apiData = {

    payment: {
        "create-payment": {
            path: "/partnerApi",
            apiType: "withHpp",
            payload: {
                lang: api.lang,
                merchant: {
                    merchantID: api.merchantID,
                    customerID: api.customerId
                },

                customer: {
                    billingAddress: {
                        firstName: api.billingFirstName,
                        lastName: api.billingLastName,
                        mobileNo: api.billingMobileNo,
                        emailId: api.billingEmailId,
                        addressLine1: api.billingAddressLine1,
                        addressLine2: api.billingAddressLine2,
                        city: api.billingCity,
                        state: api.billingState,
                        zip: api.billingZip,
                        country: api.billingCountry
                    },
                    shippingAddress: {
                        sFirstName: api.shippingFirstName,
                        sLastName: api.shippingLastName,
                        sMobileNo: api.shippingMobileNo,
                        sEmailId: api.shippingEmailId,
                        sAddressLine1: api.shippingAddressLine1,
                        sAddressLine2: api.shippingAddressLine2,
                        sCity: api.shippingCity,
                        sState: api.shippingState,
                        sZip: api.shippingZip,
                        sCountry: api.shippingCountry

                    },
                },
                transaction: {
                    txnAmount: api.transactionAmount,
                    currencyCode: api.currencyCode,
                    txnReference: api.transactionReference,
                    orderId: api.orderId,
                    isApp: api.isApp,
                    type: api.type,
                    captureDuration: api.captureDuration,
                    executionDate: api.executionDate,
                    pageTag: api.pageTag,
                    midTag: api.midTag,
                    fallbackMidTag: api.fallbackMidTag,
                    // recurring:{
                    //     upsell: api.upsell,
                    //     upsellReference: api.upsellReferenceId,
                    //     source: api.RecurringSource.CIT,
                    //     recurringType: api.RecurringType.Recurring,
                    //     reason: api.RecurringReason.NOT_SHOW
                    // },
                    // "3DSecure":{
                    //     deviceFingerprint:{
                    //         timezone: api.timezone,
                    //         browserColorDepth: api.browserColorDepth,
                    //         browserLanguage: api.browserLanguage,
                    //         browserScreenHeight: api. browserScreenHeight,
                    //         browserScreenWidth: api.browserScreenWidth,
                    //         os: api.os,
                    //         browserAcceptHeader: api.browserAcceptHeader,
                    //         userAgent: api.userAgent,
                    //         browserJavascriptEnabled: api.browserJavascriptEnabled,
                    //         browserJavaEnabled: api.browserJavaEnabled,
                    //         acceptContent: api.acceptContentType,
                    //         browserIP: api.browserIP
                    //     },
                    //     exemptions:{
                    //         lowValue: api.lowValue,
                    //         tra: api.tra,
                    //         trustedBeneficiary: api.trustedBeneficiary,
                    //         secureCorporatePayment: api.secureCorporatePayment,
                    //         delegatedAuthentication: api.delegatedAuthentication,
                    //         recurringMITExemptionSameAmount: api.recurringMITExemptionSameAmount,
                    //         recurringMITExemptionOther: api.recurringMITExemptionOther,
                    //         vmid: api.vimid
                    //     },
                    //     challengeIndicator: api.challengeIndicator,
                    //     challengeWindowSize: api.challengeWindowSize
                    // },
                },
                dynamicDescriptor: {
                    name: api.dynamicDescriptorName,
                    email: api.dynamicDescriptorEmail,
                    mobile: api.dynamicDescriptorPhone
                },
                url: {
                    successURL: api.successUrl,
                    failURL: api.failureUrl,
                    cancelURL: api.cancelUrl,
                    showConfirmationPage: api.showConfirmation,
                    cartURL: api.cartURL,
                    productURL: api.productUrl,
                    iFrame: api.iFrame
                },

            }
        },
        "plugin-details": {
            path: "/partnerApi",
            payload: {
                merchantID: api.merchantID,
                currencyCode: api.currencyCode
            }
        },
        "create-express-payment": {
            path: "/partnerApi",
            payload: { amount: 50, customerId: "CUST_123" }
        }
    },
    payout: {
        "create-payout": {
            path: "/payout/create",
            payload: { amount: 500, beneficiary: "John Doe" }
        }
    },
    subscription: {
        "create-plan": {
            path: "/plans",
            payload: { planName: "Monthly Gold", price: 29.99 }
        }
    }
    // You can add 100 more APIs here without cluttering your HTML
};


// 2. Add the UI Update Functions
function updateSubFeatures() {
    const category = document.getElementById('feature').value;
    const subSelect = document.getElementById('subFeature');
    subSelect.innerHTML = "";

    if (apiData[category]) {
        Object.keys(apiData[category]).forEach(api => {
            const opt = document.createElement('option');
            opt.value = api;
            opt.innerHTML = api.replace(/-/g, ' ').toUpperCase();
            subSelect.appendChild(opt);
        });
        updateJsonPayload();
    }
}

function updateJsonPayload() {
    const category = document.getElementById('feature').value;
    const subFeature = document.getElementById('subFeature').value;
    const jsonArea = document.getElementById('payload');

    const selectedApi = window.apiData[category][subFeature]

    if (apiData[category] && apiData[category][subFeature]) {
        jsonArea.value = JSON.stringify(selectedApi.payload, null, 2);
    }
}

// 3. Your existing runTest function (Updated to include subFeature)
async function runTest(event) {
    alert("Function started. Check console for progress logs.");

    if (event) {
        event.preventDefault();

    }

    // 1. Grab UI elements
    const statusDiv = document.getElementById('status');
    const resultsArea = document.getElementById('results-area');
    const finalStepContainer = document.getElementById('final-step-container');
    const finalStepDisplay = document.getElementById('final-step-display');

    // 2. Setup initial UI state
    resultsArea.style.display = 'block';
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = "Processing mTLS Handshake & Encryption...";
    statusDiv.style.background = "#fff3cd"; // Yellow
    if (finalStepContainer) finalStepContainer.style.display = 'none';

    // 3. Get configuration and files
    const selectedCat = document.getElementById('feature').value;
    const selectedSub = document.getElementById('subFeature').value;
    const apiConfig = window.apiData[selectedCat][selectedSub];

    const certFile = document.getElementById('certificate_upload').files[0];
    const keyFile = document.getElementById('key_upload').files[0];

    if (!certFile || !keyFile) {
        statusDiv.innerHTML = "Error: Both Certificate and Private Key files are required.";
        statusDiv.style.background = "#ffcdd2";
        return;
    }

    // 2. Build FormData
    const formData = new FormData();
    formData.append('certificate_upload', certFile);
    formData.append('key_upload', keyFile);
    formData.append('mid', document.getElementById('apiKey').value);
    formData.append('apiSecret', document.getElementById('accessToken').value);
    formData.append('reqType', document.getElementById('apiMethod').value);
    formData.append('payload', document.getElementById('payload').value);

    formData.append('apiType', apiConfig.apiType);

    // Construct URL
    const baseUrl = document.getElementById('environment').value;
    const category = document.getElementById('feature').value;
    const subFeature = document.getElementById('subFeature').value;
    const path = window.apiData[category][subFeature].path;
    formData.append('fullUrl', `${baseUrl}${path}`);

    try {

        const response = await fetch('/run-direct-test', {
            method: 'POST',
            body: formData
        });

        console.log("Raw Response:", response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.json();
        statusDiv.innerHTML = `<pre>${JSON.stringify(result.output, null, 2)}</pre>`;
        statusDiv.style.background = "#c8e6c9"; // Green for success

        //  6. Display Step 2: Final Payload (If it exists)
        if (result.finalStep) {
            if (finalStepContainer) {
                finalStepContainer.style.display = 'block';
                finalStepDisplay.innerHTML = `<pre>${JSON.stringify(result.finalStep, null, 2)}</pre>`;
            }
            console.log("Final Step Payload Prepared:", result.finalStep);
        }

    } catch (e) {
        console.error("Request failed:", e);
        statusDiv.innerHTML = `Request Failed: ${e.message}. Check Server Console.`;
        statusDiv.style.background = "#ffcdd2";
    }
}

// 4. Initialize the dropdown on page load
updateSubFeatures();
window.runTest = runTest;
window.updateJsonPayload = updateJsonPayload;
window.updateSubFeatures = updateSubFeatures;