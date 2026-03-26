
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import com.gateway.encryption.Certificate;
import com.gateway.exception.ApplicationError;
import com.gateway.payment.PaymentFactory;
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
            String merchantID = data.get("merchant_id").getAsString();

            Certificate cert = new Certificate(
                    "/home/anant/Documents/Wrapper-Certificates/Payment_Routing_Copy_Dev_Cert/PCA090925001-crt.pem",
                    "/home/anant/Documents/Wrapper-Certificates/Payment_Routing_Copy_Dev_Cert/PCA090925001-key.pem");

            MerchantDTO merchant = new MerchantDTO(merchantID, customerId);

            String response = "";
            Map<String, Object> finalResponse = null;
            Object result = null;

            var paymentProcessor = PaymentFactory.getInstance(cert, merchant, "5d48540c32c4412ab39bb0fbdd0495f6").setStaging(true);

            // The Router Logic
            switch (apiName.toUpperCase()) {

                case "PLUGIN_DETAILS":

                    String currency = data.get("currency").getAsString();
                    result = paymentProcessor.getPluginDetails(currency);
                    break;

                case "Hosted Payment Page":

                    break;

                case "Without Hosted Payment Page":
                    // // Example of another API in the same JAR
                    // response = RefundFactory.getInstance(cert, merchant).;
                    break;

                default:
                    response = "{\"error\": \"API " + apiName + " not found in Java Bridge\"}";
            }

            System.out.println(result);
            System.out.println(response);

        } catch (Exception e) {
            System.out.print("{\"error\": \"" + e.toString() + "\"}");
        }
    }
}