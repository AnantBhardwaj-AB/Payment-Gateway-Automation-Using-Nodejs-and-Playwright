import { api } from './helper.js'


window.apiData = window.apiData || {};
window.apiData.token = {
    "create-token": {
        path: "/partnerApi",
        payload: {
            customerID: api.token_customerId,
            merchantID: api.merchantID,
            customer: {
                billingAddress: {
                    firstName: api.billingFirstName,
                    lastName: api.billingLastName,
                    mobileNo: api.billingMobileNo,
                    emailId: api.billingEmailId
                }
            },
            card: {
                cardNumber: api.cardNumber,
                cardType: api.cardType,
                expMonth: api.expMonth,
                expYear: api.expYear,
                nameOnCard: api.nameOnCard
            }
        }
    },
    "verify-token": {
        path: "/partnerApi",
        payload: {
            merchantID: api.merchantID,
            showAllCards: true,
            tokenID: api.tokenID || '{tokenID}'
        }
    },
    "retrieve-token": {
        path: "/partnerApi",
        payload: {
            customerID: api.token_customerId || '{token_customerId}',
            merchantID: api.merchantID,
            cartType: api.tokenId_cardType,
            paymentMode: api.tokenId_paymentMode,
            showAllCards: api.showAllCards
        }
    },
    "deactivate-token": {
        path: "/partnerApi",
        payload: {
            customerID: api.token_customerId || '{token_customerId}',
            merchantID: api.merchantID,
            tokenID: api.tokenID || '{tokenID}'
        }
    },
    "store-acquirer-token": {
        path: "/partnerApi",
        payload: {
            merchantID:api.merchantID,
            customerID: api.acquirertoken_customerId,
            token: {
                "acquirer": api.acquirer.Checkout,
                "acquirerToken": api.acquirerToken,
                "schemeTransactionId": api.schemeTransactionId,
                "expMonth": "11",
                "expYear": "2027",
                "nameOnCard": api.acquirer_nameOnCard,
                "bin": api.acquirer_bin,
                "last4": api.acquirer_last4
            }
        }
    },
    "retrieve-acquirer-token":{
        path:"/partnerApi",
        payload:{
            merchantID: api.merchantID,
            customerID: api.acquirertoken_customerId,
            showAllCards: api.showAllCards
        }
    }
}