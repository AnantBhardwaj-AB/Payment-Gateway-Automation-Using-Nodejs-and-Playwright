// api-config.js
import { api } from './helper.js'

window.apiData = window.apiData || {};
window.apiData.payout = {
    "create-hosted-payout": {
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
                },
            },
            transaction: {
                txnAmount: api.transactionAmount,
                currencyCode: api.currencyCode,
                txnReference: api.transactionReference,
                customerEmail: api.customerEmail,
                hostedPage: api.hostedPage,
                payout: api.payout,
                pageTag: api.pageTag
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
    "create-express-payout": {
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
                },
            },
            transaction: {
                txnAmount: api.transactionAmount,
                currencyCode: api.currencyCode,
                txnReference: api.transactionReference,
                customerEmail: api.customerEmail,
                hostedPage: api.hostedPage,
                paymentMode: api.paymentMode.credit_card,
                payout: api.payout
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
    "create payout (Async)": {
        path: "/partnerApi",
        apiType: "withoutHpp",
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
                },
            },
            transaction: {
                txnAmount: api.transactionAmount,
                currencyCode: api.currencyCode,
                txnReference: api.transactionReference,
                customerEmail: api.customerEmail,
                hostedPage: api.hostedPage,
                async: true,
                paymentMode: api.paymentMode.credit_card,
                paymentDetail: {
                    cardNumber: api.cardNumber,
                    expMonth: api.expMonth,
                    expYear: api.expYear,
                    nameOnCard: api.nameOnCard,
                    saveDetails: api.saveDetails
                },
                payout: api.payout

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
    "create-payout(Sync)": {
        path: "/partnerApi",
        apiType: "withoutHpp",
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
                },
            },
            transaction: {
                txnAmount: api.transactionAmount,
                currencyCode: api.currencyCode,
                txnReference: api.transactionReference,
                customerEmail: api.customerEmail,
                hostedPage: api.hostedPage,
                async: false,
                paymentMode: api.paymentMode.credit_card,
                paymentDetail: {
                    cardNumber: api.cardNumber,
                    expMonth: api.expMonth,
                    expYear: api.expYear,
                    nameOnCard: api.nameOnCard,
                    saveDetails: api.saveDetails
                },
                payout: api.payout

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
};