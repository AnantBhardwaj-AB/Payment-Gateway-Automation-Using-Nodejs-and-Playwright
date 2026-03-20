import { api } from './helper.js'

window.apiData = window.apiData || {};
window.apiData.applepay = {
    "apple-pay-sessoion":{
        path:"/payment-methods/apple-pay-session",
        apiType:"applePay",
        payload:{
            merchantID: api.merchantID,
            domain: api.applePay_domain,
            url: api.applePay_url,
            name: api.applePay_name,
            merchantIdentifier: api.applePay_merchantIdentifier
        }
    }
}
