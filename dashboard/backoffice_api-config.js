import { api } from "./helper.js";

window.apiData = window.apiData || {};
window.apiData.backoffice = {
    "capture-payment": {
        path: "/partnerApi",
        apiType: "capturePayment",
        payload: {
            merchantID: api.merchantID,
            capture: {
                txnReference: api.paymenttransactionReference || '{paymenttransactionReference}',
                currencyCode: api.transactioncurrencyCode || '{transactioncurrencyCode}',
                amount: 5
            },
            dynamicDescriptor: {
                name: api.dynamicDescriptorName,
                email: api.dynamicDescriptorEmail,
                mobile: api.dynamicDescriptorPhone
            },
        }
    },
    "void-payment": {
        path: "/partnerApi",
        apiType:"voidPayment",
        payload: {
            merchantID: api.merchantID,
            void: {
                txnReference: api.paymenttransactionReference || '{paymenttransactionReference}'
            },
            dynamicDescriptor: {
                name: api.dynamicDescriptorName,
                email: api.dynamicDescriptorEmail,
                mobile: api.dynamicDescriptorPhone
            },
        }
    },
    "refund-payment": {
        path: "/partnerApi",
        apiType:"refund",
        payload: {
            merchantID: api.merchantID,
            refund: {
                txnReference: api.paymenttransactionReference || '{paymenttransactionReference}',
                refundInvoiceNo: api.refundInvoiceNo,
                refundAmount: 2,
                comments: api.comments
            },
            dynamicDescriptor: {
                name: api.dynamicDescriptorName,
                email: api.dynamicDescriptorEmail,
                mobile: api.dynamicDescriptorPhone
            },
        }
    },
    "transaction-status": {
        path: "/partnerApi",
        apiType:"transactionStatus",
        payload: {
            merchantID: api.merchantID,
            txnReference: api.paymenttransactionReference || '{paymenttransactionReference}',
        }
    },
    "report": {
        path: "/partnerApi",
        payload: {
            local: api.local,
            fromDate: "2026-03-16",
            reportType: api.reportType.transactionReport,
            toDate: "2026-03-16",
            sortOrder: api.sortOrder.ascending,
            sortColumn: api.sortColumn.transactionDate,
            merchant: {
                merchantID: api.merchantID
            },
            filters: [
                {
                    fieldName: api.fieldName.status,
                    fieldValue: api.fieldValue.success
                },
                {
                    fieldName: api.fieldName.paymentMode,
                    fieldValue: api.fieldValue.cards
                }
            ],
            fromCount: api.fromCount,
            limit: api.limit,
            showCustomData: api.showConfirmation
        }
    },
    "refund-status": {
        path: "/partnerApi",
        apiType:"refundDetails",
        payload: {
            merchantID: api.merchantID,
            refundStatus: {
                txnReference: api.paymenttransactionReference || '{paymenttransactionReference}',
            }
        }
    },
    "retrieve-account-configuration": {
        path: "/partnerApi",
        payload: {
            merchantID: api.merchantID,
            currencyCode: api.currencyCode
        }
    },
};