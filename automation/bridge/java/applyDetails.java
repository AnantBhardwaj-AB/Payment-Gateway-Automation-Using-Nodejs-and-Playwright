private static void applyDetails(Object builder, JsonObject data) {
    // We use a Map or simple If-checks to see what's in the JSON
    if (data.has("transactionDetails")) {
        builder.setTransactionDetails(parseTransaction(data.get("transactionDetails")));
    }
    if (data.has("billingDetails")) {
        builder.setBillingDetails(parseBilling(data.get("billingDetails")));
    }
    if (data.has("urlDetails")) {
        builder.setUrlDetails(parseUrls(data.get("urlDetails")));
    }
    // ... add all possible setters here ONCE ...
}