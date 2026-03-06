// main.js
import { updateSubFeatures, updateJsonPayload, runTest } from './ui-controller.js';

// 1. Map functions to window so HTML can find them
window.updateSubFeatures = () => updateSubFeatures(window.apiData);
window.updateJsonPayload = () => updateJsonPayload(window.apiData);
window.runTest = (event) => runTest(event, window.apiData);

// 2. ONLY initialize when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.apiData) {
        window.updateSubFeatures();
        console.log("UI Initialized with Data");
    } else {
        console.error("Data not found. Ensure payment_api-config.js is loaded.");
    }
});