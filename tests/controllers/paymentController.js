export class PaymentController {
    constructor(request, sdkUrl) {
        this.request = request;
        this.sdkUrl = sdkUrl;
    }

    async createHostedPayment(payload) {
        return await this.request.post(`${this.sdkUrl}/api/payment/hosted`, {
            data: payload
        });
    }

    async getPluginDetails(pluginId) {
        return await this.request.get(`${this.sdkUrl}/api/payment/plugin/${pluginId}`);
    }
}