// api-config.js
import { api } from './helper.js'

window.apiData = window.apiData || {};
window.apiData.payment = {
    "create-payment": {
        path: "/partnerApi",
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
                currencyCode: api.transactioncurrencyCode,
                txnReference: api.paymenttransactionReference,
            },
            url: {
                successURL: api.successUrl,
                failURL: api.failureUrl,
                cancelURL: api.cancelUrl,
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
    "withoutHpp(Async)": {
        path: "/partnerApi",
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
                paymentDetail: {
                    cardNumber: api.cardNumber,
                    cardType: api.cardType,
                    expYear: api.expYear,
                    expMonth: api.expMonth,
                    nameOnCard: api.nameOnCard,
                    saveDetails: api.saveDetails,
                    cvv: api.cvv
                },
                isApp: api.isApp,
                type: api.type,
                captureDuration: api.captureDuration,
                executionDate: api.executionDate,
                pageTag: api.pageTag,
                midTag: api.midTag,
                fallbackMidTag: api.fallbackMidTag,
                recurring: {
                    upsell: api.upsell,
                    upsellReference: api.upsellReferenceId,
                    source: api.RecurringSource.CIT,
                    recurringType: api.RecurringType.Recurring,
                    reason: api.RecurringReason.NOT_SHOW
                },
                "3DSecure": {
                    deviceFingerprint: {
                        timezone: api.timezone,
                        browserColorDepth: api.browserColorDepth,
                        browserLanguage: api.browserLanguage,
                        browserScreenHeight: api.browserScreenHeight,
                        browserScreenWidth: api.browserScreenWidth,
                        os: api.os,
                        browserAcceptHeader: api.browserAcceptHeader,
                        userAgent: api.userAgent,
                        browserJavascriptEnabled: api.browserJavascriptEnabled,
                        browserJavaEnabled: api.browserJavaEnabled,
                        acceptContent: api.acceptContentType,
                        browserIP: api.browserIP
                    },
                    exemptions: {
                        lowValue: api.lowValue,
                        tra: api.tra,
                        trustedBeneficiary: api.trustedBeneficiary,
                        secureCorporatePayment: api.secureCorporatePayment,
                        delegatedAuthentication: api.delegatedAuthentication,
                        recurringMITExemptionSameAmount: api.recurringMITExemptionSameAmount,
                        recurringMITExemptionOther: api.recurringMITExemptionOther,
                        vmid: api.vimid
                    },
                    challengeIndicator: api.challengeIndicator,
                    challengeWindowSize: api.challengeWindowSize
                },
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
    "plugin-checkout(Cards)": {
        path: "/partnerApi",
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
                paymentMode: api.paymentMode.credit_card,
                cardType: api.cardType,
                isApp: api.isApp,
                type: api.type,
                captureDuration: api.captureDuration,
                executionDate: api.executionDate,
                pageTag: api.pageTag,
                midTag: api.midTag,
                fallbackMidTag: api.fallbackMidTag,
                recurring: {
                    upsell: api.upsell,
                    upsellReference: api.upsellReferenceId,
                    source: api.RecurringSource.CIT,
                    recurringType: api.RecurringType.Recurring,
                    reason: api.RecurringReason.NOT_SHOW
                },
                "3DSecure": {
                    deviceFingerprint: {
                        timezone: api.timezone,
                        browserColorDepth: api.browserColorDepth,
                        browserLanguage: api.browserLanguage,
                        browserScreenHeight: api.browserScreenHeight,
                        browserScreenWidth: api.browserScreenWidth,
                        os: api.os,
                        browserAcceptHeader: api.browserAcceptHeader,
                        userAgent: api.userAgent,
                        browserJavascriptEnabled: api.browserJavascriptEnabled,
                        browserJavaEnabled: api.browserJavaEnabled,
                        acceptContent: api.acceptContentType,
                        browserIP: api.browserIP
                    },
                    exemptions: {
                        lowValue: api.lowValue,
                        tra: api.tra,
                        trustedBeneficiary: api.trustedBeneficiary,
                        secureCorporatePayment: api.secureCorporatePayment,
                        delegatedAuthentication: api.delegatedAuthentication,
                        recurringMITExemptionSameAmount: api.recurringMITExemptionSameAmount,
                        recurringMITExemptionOther: api.recurringMITExemptionOther,
                        vmid: api.vimid
                    },
                    challengeIndicator: api.challengeIndicator,
                    challengeWindowSize: api.challengeWindowSize
                },
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
    "withoutHpp(Sync)": {
        path: "/partnerApi",
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
                paymentDetail: {
                    cardNumber: api.cardNumber,
                    cardType: api.cardType,
                    expYear: api.expYear,
                    expMonth: api.expMonth,
                    nameOnCard: api.nameOnCard,
                    saveDetails: api.saveDetails,
                    cvv: api.cvv
                },
                isApp: api.isApp,
                type: api.type,
                captureDuration: api.captureDuration,
                executionDate: api.executionDate,
                pageTag: api.pageTag,
                midTag: api.midTag,
                fallbackMidTag: api.fallbackMidTag,
                recurring: {
                    upsell: api.upsell,
                    upsellReference: api.upsellReferenceId,
                    source: api.RecurringSource.CIT,
                    recurringType: api.RecurringType.Recurring,
                    reason: api.RecurringReason.NOT_SHOW
                },
                "3DSecure": {
                    deviceFingerprint: {
                        timezone: api.timezone,
                        browserColorDepth: api.browserColorDepth,
                        browserLanguage: api.browserLanguage,
                        browserScreenHeight: api.browserScreenHeight,
                        browserScreenWidth: api.browserScreenWidth,
                        os: api.os,
                        browserAcceptHeader: api.browserAcceptHeader,
                        userAgent: api.userAgent,
                        browserJavascriptEnabled: api.browserJavascriptEnabled,
                        browserJavaEnabled: api.browserJavaEnabled,
                        acceptContent: api.acceptContentType,
                        browserIP: api.browserIP
                    },
                    exemptions: {
                        lowValue: api.lowValue,
                        tra: api.tra,
                        trustedBeneficiary: api.trustedBeneficiary,
                        secureCorporatePayment: api.secureCorporatePayment,
                        delegatedAuthentication: api.delegatedAuthentication,
                        recurringMITExemptionSameAmount: api.recurringMITExemptionSameAmount,
                        recurringMITExemptionOther: api.recurringMITExemptionOther,
                        vmid: api.vimid
                    },
                    challengeIndicator: api.challengeIndicator,
                    challengeWindowSize: api.challengeWindowSize
                },
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
    "Get-Payment-Token": {
        path: "/payment-methods/get-payment-token",
        payload: {
            merchantID: api.merchantID,
            paymentToken: api.paymentToken,
            paymentMode: api.paymentToken_PaymentMode,
            merchantIdentifier: api.merchantIdentifier
        }
    },
    "hosted Fields": {
        path: "/partnerApi",
        payload: {
            merchantID: api.merchantID,
            customerID: api.customerId,
            columns: [
                "cardNumber",
                "cardCvv",
                "cardHolderName",
                "expiryDate"
            ]

        }
    },
};
