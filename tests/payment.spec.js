import { test, expect } from '@playwright/test';
import { PaymentController } from '../controllers/paymentController';

test('Unified Payment API Test', async ({ request }) => {
    const sdkUrl = process.env.SELECTED_SDK_URL;
    const endpoint = process.env.ENDPOINT; // from 'subFeature'
    const payload = JSON.parse(process.env.FEATURE_PAYLOAD);

    const payment = new PaymentController(request, sdkUrl);
    let response;

    // Route to the correct controller method based on subFeature
    if (endpoint === 'hosted-payment') {
        response = await payment.createHostedPayment(payload);
    } else if (endpoint === 'plugin-details') {
        response = await payment.getPluginDetails(payload.pluginId);
    }

    const result = await response.json();
    console.log(`SDK Origin: ${result.sdkOrigin}`); // This shows in Dashboard result
    expect(response.ok()).toBeTruthy();
    expect(result.sdkOrigin).toBeDefined();
});