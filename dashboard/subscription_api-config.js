import { api } from "./helper.js";

window.apiData = window.apiData || {};
window.apiData.subscription = {
    "create-plan": {
        path: `/${api.merchantID}/plans`,
        apiType: "createPlan",
        payload: {
            name: api.planName,
            description: api.planDescription,
            code: api.planCode,
            automaticDebit: api.automaticDebit,
            dynamicDescriptor: {
                name: api.dynamicDescriptorName,
                email: api.dynamicDescriptorEmail,
                mobile: api.dynamicDescriptorPhone
            },
            installments: [
                {
                    period: api.installmentsPeriod,
                    frequency: api.installmentsFrequency,
                    totalInstallments: api.installmentsTotalInstallments,
                    type: api.installmentsType,
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
                    period: api.retryPeriod,
                    totalRetry: api.retryTotalRetry,
                    time: api.retryTime,
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
                recurring:{
                    upsell: api.upsell,
                    upsellReference: api.upsellReferenceId,
                    source: api.RecurringSource,
                    recurringType: api.RecurringType,
                    reason: api.RecurringReason
                },
            },
            url:{
                showConfirmationPage: api.showConfirmation,
                privacyURL: api.privacyURL,
                termsURL: api.termsURL
            },
        },
    },
    "update-Subscription": {},
    "retrieve-Subscription-Details": {},
    "deactivate-Subscription": {},
    "reactivate-Subscription": {},
    "schedule-Update-Subscription": {},
};