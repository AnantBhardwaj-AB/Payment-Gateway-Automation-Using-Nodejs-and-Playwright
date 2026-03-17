import { api } from "./helper.js";

window.apiData = window.apiData || {};

window.apiData.paymentlink = {
    "create-payment-link": {
        path: `/paymentLink/${api.merchantID}`,
        apiType: "generateLink",
        payload: {
            lang: api.lang,
            merchant: {
                merchantID: api.merchantID,
                customerID: api.customerId
            },
            customer: {
                dob: api.dob,
                ipAddress: api.ip,
                billingAddress: {
                    firstName: api.billingFirstName,
                    lastName: api.billingLastName,
                    mobileNo: api.billingMobileNo,
                    emailId: api.billingEmailId
                },
                shippingAddress: {
                    sFirstName: api.shippingFirstName,
                    sLastName: api.shippingLastName,
                    sMobileNo: api.shippingMobileNo,
                    sEmailId: api.shippingEmailId
                },
                notificationChannels: [
                    {
                        name: api.notificationChannelName,
                        value: api.notificationChannelValue
                    }
                ]
            },
            transaction: {
                txnReference: api.transactionReference,
                orderId: api.orderId,
                txnAmount: api.transactionAmount,
                currencyCode: api.currencyCode,
                allow3D: api.allow3D,
                allowBillShip: api.allowBillShip,
                paymentLink: api.paymentLink,
                paymentLinkDescription: api.paymentLinkDescription,
                pageTag: api.pageTag
            },
            dynamicDescriptor: {
                name: api.dynamicDescriptorName,
                email: api.dynamicDescriptorEmail,
                mobile: api.dynamicDescriptorPhone
            },
            summary: {
                totalValue: api.totalValue,
                details: {
                    subtotal: api.subTotal,
                    tax: api.tax,
                    shippingCharfes: api.shippingCharge
                },
                discount: {
                    discountValue: api.discountValue,
                    couponCode: api.couponCode,
                    couponCodeDetails: api.couponCodeDetails
                },
            },
            items: [
                {
                    itemName: api.itemName,
                    itemId: api.itemId,
                    itemPricePerUnit: api.itemPricePerUnit,
                    itemQuantity: api.itemQuantity
                }
            ],
            url: {
                successURL: api.successUrl,
                failURL: api.failureUrl,
                cancelURL: api.cancelUrl,
                privacyURL: api.privacyURL,
                termsURL: api.termsURL,
                showConfirmationPage: api.showConfirmation,
                iFrame: api.iFrame
            },
            expiryDate: "2026-03-22 17:49"
        }
    },
    "update-payment-link": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const lID = api.linkId || '{linkId}'
            return `/paymentLink/${mID}/${lID}`;
        },
        payload: {
            lang: api.lang,
            merchant: {
                merchantID: api.merchantID,
                customerID: api.customerId
            },
            customer: {
                billingAddress: {
                    firstName: api.updatePaymentLink_FirstName,
                    lastName: api.billingLastName,
                },
            },
            transaction: {
                txnReference: api.transactionReference,
                txnAmount: api.updatePaymentLink_TransactionAmount,
                currencyCode: api.currencyCode
            },
        }
    },
    "retrieve-payment-link": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const lID = api.linkId || '{linkId}'
            return `/paymentLink/${mID}/${lID}`;
        },
        payload: {
            apiKey: api.merchantID,

        }
    },
    "Deactivate-payment-link": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const lID = api.linkId || '{linkId}'
            return `/paymentLink/${mID}/${lID}`;
        },
        payload: {
            apiKey: api.merchantID,
        }
    }
}