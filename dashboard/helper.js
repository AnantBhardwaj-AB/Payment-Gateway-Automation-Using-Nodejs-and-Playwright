

var merchantID = document.getElementById('apiKey').value;

var lang = "en";

var currencyCode = "EUR";

//  Billing Information
var billingFirstName = "John";
var billingLastName = "Doe";
var billingAddress = "123 Main St";
var billingCity = "Anytown";
var billingState = "CA";
var billingZip = "12345";
var billingCountry = "US";
var billingMobileNo = "123123123123";
var billingEmailId = "test@g.co"
var billingAddressLine1 = "123Lane st thomas";
var billingAddressLine2 = "US, NY";

// Shipping Information
var shippingFirstName = "Jane";
var shippingLastName = "Smith";
var shippingAddress = "456 Elm St";
var shippingCity = "Othertown";
var shippingState = "NY";
var shippingZip = "54321";
var shippingCountry = "US";
var shippingMobileNo = "123123123123";
var shippingEmailId = "test@g.co"
var shippingAddressLine1 = "123Lane st thomas";
var shippingAddressLine2 = "US, NY";


// Transaction  Details
var transactionAmount = 10.00;
var transactioncurrencyCode = "USD";
var transactionDescription = "Test Transaction";
var transactionReference = crypto.randomUUID();
var type = "auth";
var captureDuration = "7";
var executionDate = "2022-04-20 14:23:20";
var pageTag = "test_Page";
var midTag = "";
var fallbackMidTag = "test_fallback_midtag";
var orderId = "ORDER-" + crypto.randomUUID();
var isApp = true;
var executionDate = "2024-12-31 14:00:00";
var pageTag = "Test Page Tag";

// Recurring Payment Details
var upsell = false;
var upsellReferenceId = "UPSELL-" + crypto.randomUUID();

const RecurringSource = {
    MIT: "MIT",
    CIT: "CIT"
}

const RecurringType = {
    Recurring: "Recurring",
    Unscheduled: "Unscheduled"
}

const RecurringReason = {
    NOT_SHOW: "NOT SHOW"
}

// #3D Secure Details
var challengeIndicator = "01";
var challengeWindowSize = "05";

// DeviceFingerprint Details
var timezone = "330";
var browserColorDepth = "24";
var browserScreenHeight = "1080";
var browserScreenWidth = "1920";
var browserLanguage = "en-US";
var browserAcceptHeader = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
var browserJavaEnabled = false;
var browserJavascriptEnabled = true;
var browserUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
var osType = "Windows";
var acceptContentType = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
var browserIP = "192.168.1.1";

// Exemption Details
var lowValue = true;
var tra = true
var trustedBeneficiary = true;
var secureCorporatePayment = true;
var delegatedAuthentication = true;
var recurringMITExemptionSameAmount = true;
var recurringMITExemptionOther = true;
var vimid = "12455"

// Dynamic Descriptors
var dynamicDescriptorName = "Test Descriptor";
var dynamicDescriptorEmail = "test@example.com";
var dynamicDescriptorPhone = "1234567890";

// Url Details
var successUrl = "https://domain.com/success";
var failureUrl = "https://domain.com/failure";
var cancelUrl = "https://domain.com/cancel";
var cartURL = "https://domain.com/cart.html";
var productUrl = "https://domain.com/product.html";
var showConfirmation = "true";
var iFrame = "false";

// Details 
var subtotalAmount = 8.00;
var tax = 2.00;
var shippingCharge = 0.50;

// discount details
var discountValue = 1.00;
var couponCode = "DISCOUNT10";
var couponCodeDetails = "10% off on your next purchase";

var totalValue = 9.50;

// Industry travel Accommodation Details
var propertyName = "Hotel California";
var dateCheckIn = "2024-12-20";
var dateCheckOut = "2024-12-25";
var propertyReservationNumber = "RES-" + crypto.randomUUID();
var bookingFirstName = "Alice";
var bookingLastName = "Johnson";

// Industry Crypto Details
var walletAddress = "0x1234567890abcdef1234567890abcdef12345678";
var publicAddressIndicator = true;
var walletSanctionChecked = true;
var isWalletSanctioned = false;
var cryptoCurrency = "Bitcoin";


var customerId = crypto.randomUUID();

const api = {
    // This "get" ensures we always pull what's currently typed in the Api Key box
    merchantID,

    // Basic Info
    lang, customerId, orderId,currencyCode,

    // Billing & Shipping
    billingFirstName, billingLastName, billingAddress, billingCity, billingState, billingZip, billingCountry, billingMobileNo, billingEmailId, billingAddressLine1, billingAddressLine2,
    shippingFirstName, shippingLastName, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry, shippingMobileNo, shippingEmailId, shippingAddressLine1, shippingAddressLine2,

    // Transaction
    transactionAmount, transactioncurrencyCode, transactionDescription, isApp, executionDate, pageTag,
    subtotalAmount, tax, shippingCharge, totalValue,

    // All other variables
    upsell, upsellReferenceId, RecurringSource, RecurringType, RecurringReason,
    challengeIndicator, challengeWindowSize, timezone, browserColorDepth,
    browserScreenHeight, browserScreenWidth, browserLanguage, browserUserAgent,
    lowValue, tra, vimid, successUrl, failureUrl, cartURL,
    walletAddress, cryptoCurrency,publicAddressIndicator,walletSanctionChecked,isWalletSanctioned,propertyName,dateCheckIn,dateCheckOut,
    propertyReservationNumber,bookingFirstName,bookingLastName,discountValue,couponCode,couponCodeDetails,
    cancelUrl,showConfirmation,productUrl,dynamicDescriptorEmail,dynamicDescriptorName,dynamicDescriptorPhone,
    trustedBeneficiary, iFrame, secureCorporatePayment, delegatedAuthentication, recurringMITExemptionOther,recurringMITExemptionSameAmount,
    browserAcceptHeader, browserColorDepth, browserJavaEnabled, browserJavascriptEnabled, browserIP, osType, acceptContentType,
    transactionReference,type,captureDuration,midTag,fallbackMidTag
   
};

export { api };