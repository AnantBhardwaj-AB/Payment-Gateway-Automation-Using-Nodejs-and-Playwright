// api-config.js
import { api } from './helper.js'


window.apiData = window.apiData || {};
window.apiData.webhook = {
    "register-webhook-config": {
        path: "/partnerApi",
        payload: {
            merchantID: api.merchantID,
            webhook: {
                events: api.events,
                url: api.url
            }
        }
    },
    "update-webhook-config": {
        path: "/partnerApi",
        payload: {
            merchantID: api.merchantID,
            webhook: {
                webhookId: api.webhookId || '{webhookId}',
                events: api.events,
                url: api.updatewebhook_url
            }
        }
    },
    "retrieve-webhook-config": {
        path: "/partnerApi",
        payload: {
            merchantID: api.merchantID,
            webhook: {
                webhookId: api.webhookId || '{webhookId}',
            }
        }
    },
    "deactivate-webhook-config": {
        path: "/partnerApi",
        payload: {
            merchantID: api.merchantID,
            webhook: {
                webhookId: api.webhookId || '{webhookId}',
                status: api.status.INACTIVE
            }
        }
    },
    "push-webhook": {
        path: "/partnerApi",
        payload: {
            merchantID: api.merchantID,
            txnReference: api.paymenttransactionReference || 'paymenttransactionReference',
            webhookConfig: [
                {
                    webhookId: api.webhookId || '{webhookId}',
                    events: api.events
                }
            ],
        }
    }

};