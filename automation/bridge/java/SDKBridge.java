
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.gateway.authorization.AuthorizationFactory;
import com.gateway.encryption.Certificate;
import com.gateway.exception.ApplicationError;
import com.gateway.payment.PaymentFactory;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.gateway.payment.MerchantDTO;

public class SDKBridge {
    public static void main(String[] args) throws ApplicationError {
        try {
            String apiName = args[0];
            String jsonPath = args[1];
            // 1. Read and Parse the JSON file ONCE
            String content = new String(Files.readAllBytes(Paths.get(jsonPath)));
            JsonObject data = JsonParser.parseString(content).getAsJsonObject();

            String customerId = UUID.randomUUID().toString();
            String merchantID = "PCA090925001";
            String accessToken = "5d48540c32c4412ab39bb0fbdd0495f6";
            // System.err.println("MErchantID.............." + merchantID);

            Certificate cert = new Certificate(
                    "/home/anant/Documents/Wrapper-Certificates/Payment_Routing_Copy_Dev_Cert/PCA090925001-crt.pem",
                    "/home/anant/Documents/Wrapper-Certificates/Payment_Routing_Copy_Dev_Cert/PCA090925001-key.pem");

            MerchantDTO merchant = new MerchantDTO(merchantID, customerId);

            var paymentProcessor = PaymentFactory.getInstance(cert, merchant, accessToken)
                    .setStaging(true);

            var backOfficeProcessor = AuthorizationFactory.getInstance(cert,  merchantID,accessToken ).setStaging(true);

            Object finalResult = null;

            JsonObject root = data.has(apiName) ? data.getAsJsonObject(apiName) : data;
            JsonObject payload = root.has("payload") ? root.getAsJsonObject("payload") : root;

            // The Router Logic
            switch (apiName.toUpperCase()) {

                case "PLUGIN_DETAILS":

                    String currency = payload.has("currencyCode") ? payload.get("currencyCode").getAsString()
                            : payload.has("currency") ? payload.get("currency").getAsString() : "EUR";
                    finalResult = paymentProcessor.getPluginDetails(currency);
                    break;

                case "CREATE_PAYMENT":
                    DetailsUtils.paymentFactoryDetails(paymentProcessor, payload);

                    System.err.println(">>> Executing buildPayment...");
                    finalResult = paymentProcessor.buildPayment();
                    break;

                case "CREATE_EXPRESS_PAYMENT":

                    DetailsUtils.paymentFactoryDetails(paymentProcessor, payload);
                    finalResult = paymentProcessor.buildPayment();
                    break;

                case "CREATE_PAYMENT_ASYNC":

                    DetailsUtils.paymentFactoryDetails(paymentProcessor, payload);
                    finalResult = paymentProcessor.buildPayment();
                    break;

                case "CREATE_PAYMENT_SYNC":

                    DetailsUtils.paymentFactoryDetails(paymentProcessor, payload);
                    finalResult = paymentProcessor.buildPayment();
                    break;

                case "CAPTURE_PAYMENT":

                    DetailsUtils.authorizationFactoryDetails(backOfficeProcessor, payload);
                    finalResult = backOfficeProcessor.buildCapture();
                    break;

                case "VOID_PAYMENT":

                    DetailsUtils.authorizationFactoryDetails(backOfficeProcessor, payload);
                    finalResult = backOfficeProcessor.buildVoid();
                    break;

                default:
                    finalResult = "{\"error\": \"API " + apiName + " not found in Java Bridge\"}";
            }
            if (finalResult instanceof String) {
                // Already JSON → print directly
                System.out.println((String) finalResult);
            } else {
                // Object → convert to JSON
                System.out.println(new Gson().toJson(finalResult));
            }

        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            System.out.println(new Gson().toJson(err));
            e.printStackTrace(System.err); 
        }
    }
}