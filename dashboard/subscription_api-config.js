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
};