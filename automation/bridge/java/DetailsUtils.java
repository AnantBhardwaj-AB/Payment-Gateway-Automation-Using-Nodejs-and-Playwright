import java.math.BigDecimal;

import com.gateway.authorization.AuthorizationFactory;
import com.gateway.authorization.CaptureDTO;
import com.gateway.authorization.VoidDTO;
import com.gateway.payment.AddressDTO;
import com.gateway.payment.PaymentFactory;
import com.gateway.payment.TransactionDTO;
import com.gateway.payment.UrlDTO;
import com.google.gson.JsonObject;

public class DetailsUtils {

    // Helper to safely dive into nested objects and get strings
    private static String safeGet(JsonObject parent, String key) {
        if (parent == null || !parent.has(key) || parent.get(key).isJsonNull()) {
            return "";
        }
        return parent.get(key).getAsString();
    }

    public static void paymentFactoryDetails(PaymentFactory builder, JsonObject data) {

        // Navigate to the "payload" root
        JsonObject payload = data.has("payload") ? data.getAsJsonObject("payload") : data;

        // 1. Transaction Mapping (Inside "transaction" block)
        if (payload.has("transaction")) {
            JsonObject txnObj = payload.getAsJsonObject("transaction");
            String ref = safeGet(txnObj, "txnReference");
            BigDecimal amount = new BigDecimal(safeGet(txnObj, "txnAmount"));
            String currency = safeGet(txnObj, "currencyCode");

            TransactionDTO txn = new TransactionDTO(ref, amount, currency);
            builder.setTransactionDetails(txn);
            // System.err.println("DEBUG: Mapped Transaction: " + amount + " " + currency);
        }

        // 2. Billing Mapping (Inside "customer" -> "billingAddress")
        if (payload.has("customer") && payload.getAsJsonObject("customer").has("billingAddress")) {
            JsonObject billingObj = payload.getAsJsonObject("customer").getAsJsonObject("billingAddress");

            AddressDTO billing = new AddressDTO(
                    safeGet(billingObj, "firstName"),
                    safeGet(billingObj, "lastName"),
                    safeGet(billingObj, "country"),
                    safeGet(billingObj, "mobileNo"),
                    safeGet(billingObj, "emailId"),
                    safeGet(billingObj, "addressLine1"),
                    safeGet(billingObj, "addressLine2"),
                    safeGet(billingObj, "zip"),
                    safeGet(billingObj, "city"),
                    safeGet(billingObj, "state"));
            builder.setBillingDetails(billing);
            // System.err.println("DEBUG: Mapped Billing for: " + safeGet(billingObj,
            // "firstName"));
        }

        // 3. Shipping Mapping (Inside "customer" -> "shippingAddress")
        if (payload.has("customer") && payload.getAsJsonObject("customer").has("shippingAddress")) {
            JsonObject shipObj = payload.getAsJsonObject("customer").getAsJsonObject("shippingAddress");

            AddressDTO shipping = new AddressDTO(
                    safeGet(shipObj, "sFirstName"),
                    safeGet(shipObj, "sLastName"),
                    safeGet(shipObj, "sCountry"),
                    safeGet(shipObj, "sMobileNo"),
                    safeGet(shipObj, "sEmailId"),
                    safeGet(shipObj, "sAddressLine1"),
                    safeGet(shipObj, "sAddressLine2"),
                    safeGet(shipObj, "sZip"),
                    safeGet(shipObj, "sCity"),
                    safeGet(shipObj, "sState"));
            builder.setShippingDetails(shipping);
            // System.err.println("DEBUG: Mapped Shipping for: " + safeGet(shipObj,
            // "sFirstName"));
        }

        // 4. URL Mapping (Inside "url" block)
        if (payload.has("url")) {
            JsonObject urlObj = payload.getAsJsonObject("url");
            UrlDTO urls = new UrlDTO(
                    safeGet(urlObj, "successURL"),
                    safeGet(urlObj, "failURL"),
                    safeGet(urlObj, "cancelURL"));
            builder.setUrlDetails(urls);
        }

        // 5. Lang (Top of payload)
        if (payload.has("lang")) {
            builder.setLanguage(payload.get("lang").getAsString());
        }

    }

    public static void authorizationFactoryDetails(AuthorizationFactory builder, JsonObject data) {

        JsonObject payload = data.has("payload") ? data.getAsJsonObject("payload") : data;

        // ✅ CAPTURE PAYMENT
        if (payload.has("capture")) {
            JsonObject cap = payload.getAsJsonObject("capture");

            CaptureDTO captureDTO = new CaptureDTO(safeGet(cap, "txnReference"),
                    safeGet(cap, "currencyCode"));
            captureDTO.setAmount(String.valueOf(new BigDecimal(safeGet(cap, "amount"))));

            builder.setCaptureDetails(captureDTO);
        }

        // ✅ VOID PAYMENT
        if (payload.has("void")) {
            JsonObject v = payload.getAsJsonObject("void");

            VoidDTO voidDTO = new VoidDTO(safeGet(v, "txnReference"));

            builder.setVoidDetails(voidDTO);
        }
    }
}