import { api } from "./helper.js";

window.apiData = window.apiData || {};
window.apiData.backOffice = {
    "capture-payment": {
        path: "/partnerApi",
        apiType: "capturePayment",
        payload: {
            merchantID: api.merchantID,
            capture:{
                txnReference: "",
                currencyCode: "",
                amount: ""
            },
            dynamicDescriptor:{},
        }

    },
    "update-plan": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const pID = api.planId || '{planId}'
            return `/${mID}/plans/${pID}`;
        },
        apiType: "updatePlan",
        payload: {
            name: api.updatePlanName,
            description: api.updatePlanDescription,
            code: api.updatePlanCode,
            automaticDebit: api.automaticDebit,
            dynamicDescriptor: {
                name: api.dynamicDescriptorName,
                email: api.dynamicDescriptorEmail,
                mobile: api.dynamicDescriptorPhone
            },
            installments: [
                {
                    period: api.updateinstallmentperiod,
                    frequency: api.installmentsFrequency,
                    totalInstallments: api.installmentsTotalInstallments,
                    type: api.updateinstallmentsType,
                    sequence: api.installmentsSequence,
                    amount: api.installmentsAmount,
                    currencyCode: api.installmentsCurrencyCode
                }
            ],
            carryForwardAmount: api.planCarryForwardAmount,
            paymentFailureThreshold: api.planPaymentFailureThreshold,
            retry: [
                {
                    sequence: api.retrySequence,
                    frequency: api.retryFrequency,
                    period: api.updateretryPeriod,
                    totalRetry: api.retryTotalRetry,
                    fee: {
                        type: api.feeType,
                        value: api.feeValue
                    }
                }
            ],
            retryPolicy: {
                cancelSubscription: api.retryPolicyCancelSubscription,
                cutoff: {
                    period: api.cutoffPeriod,
                    frequency: api.cutoffFrequency
                },
                blacklistDates: api.retryPolicyblacklistDates
            },
        }

    },
    "retrieve-Plan": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const pID = api.planId || '{planId}'
            return `/${mID}/plans/${pID}`;
        },
        apiType: "getPlanDetails",
        payload: {
            apikey: api.merchantID
        },
    },
    "deactivate-Plan": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const pID = api.planId || '{planId}'
            return `/${mID}/plans/${pID}`;
        },
        apiType: "deactivatePlan",
        payload: {
            apikey: api.merchantID
        },
    },
    "create-Subscription": {
        path: `/${api.merchantID}/subscriptions`,
        apiType: "createSubscription",
        payload: {
            lang: api.lang,
            merchant: {
                merchantID: api.merchantID,
                customerID: api.customerId
            },
            planId: api.planId || '{planId}',
            startDate: api.startDate,
            description: api.subscriptionDescription,
            totalCycles: api.subscriptionTotalCycles,
            quantity: api.subscriptionQuantity,
            expireIn: api.subscriptionExpireIn,
            external: api.subscriptionExternal,
            customer: {
                billingAddress: {
                    firstName: api.billingFirstName,
                    lastName: api.billingLastName,
                    mobileNo: api.billingMobileNo,
                    emailId: api.billingEmailId
                },
                shippingAddress: {
                    firstName: api.shippingFirstName,
                    lastName: api.shippingLastName,
                    mobileNo: api.shippingMobileNo,
                    emailId: api.shippingEmailId
                },
                notificationChannels: [
                    {
                        name: api.notificationChannelName,
                        value: api.notificationChannelValue
                    }
                ],
            },
            transaction: {
                txnReference: api.transactionReference,
                automaticDebit: api.automaticDebit,
                recurring: {
                    upsell: api.upsell,
                    upsellReference: api.upsellReferenceId,
                    source: api.RecurringSource,
                    recurringType: api.RecurringType,
                    reason: api.RecurringReason
                },
            },
            url: {
                showConfirmationPage: api.showConfirmation,
                privacyURL: api.privacyURL,
                termsURL: api.termsURL
            },
        },
    },
    "update-Subscription": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const sID = api.subscriptionId || '{subscriptionId}'
            return `/${mID}/subscriptions/${sID}`;
        },
        apiType: "updateSubscription",
        payload: {
            merchant: {
                merchantID: api.merchantID,
                customerID: api.customerId
            },
            startDate: api.startDate,
            description: api.subscriptionDescription,
            totalCycles: api.updateSubscriptionTotalCycles,
            quantity: api.updateSubscriptionQuantity,
            expireIn: api.updateSubscriptionExpireIn,
            customer: {
                notificationChannels: [{
                    name: api.updateSubscriptionNotificationChannelName,
                    value: api.updateSubscriptionNotificationChannelValue
                }],
            },
            transaction: {
                txnReference: api.transactionReference
            },
            url: {
                showConfirmationPage: api.showConfirmation,
                privacyURL: api.privacyURL,
                termsURL: api.termsURL
            },
        },
    },
    "retrieve-Subscription-Details": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const sID = api.subscriptionId || '{subscriptionId}'
            return `/${mID}/subscriptions/${sID}`;
        },
        apiType: "getSubscriptionDetails",
        payload: {
            apikey: api.merchantID
        },
    },
    "deactivate-Subscription": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const sID = api.subscriptionId || '{subscriptionId}'
            return `/${mID}/subscriptions/${sID}`;
        },
        apiType: "deactivateSubscription",
        payload: {
            apikey: api.merchantID
        },
    },
    "reactivate-Subscription": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const sID = api.subscriptionId || '{subscriptionId}'
            return `/${mID}/subscriptions/${sID}/reactivate`;
        },
        apiType: "reactivateSubscription",
        payload: {
            apikey: api.merchantID
        },
    },
    "schedule-Update-Subscription": {
        get path() {
            const mID = api.merchantID || 'MISSING_MID'
            const sID = api.subscriptionId || '{subscriptionId}'
            return `/${mID}/subscriptions/${sID}`;
        },
        apiType: "scheduleUpdateSubscription",
        payload: {
            lang: api.lang,
            description: api.planDescription,
            totalCycles: api.subscriptionTotalCycles,
            quantity: api.subscriptionQuantity,
            applyDate: api.applyDate,
            startDate: api.startDate,
            expireIn: api.subscriptionExpireIn,
            automaticDebit: api.automaticDebit,
            planId: api.planId || '{planId}'
        },
    },
};