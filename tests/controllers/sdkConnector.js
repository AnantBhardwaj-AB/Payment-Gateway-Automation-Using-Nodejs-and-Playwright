export async function performSdkAction(request, sdkUrl, endpoint, payload) {
    const response = await request.post(`${sdkUrl}${endpoint}`, {
        data: payload
    });
    
    const result = await response.json();
    
    // Step 4 Verification: Ensure the SDK identifies itself
    if (!result.sdkOrigin) {
        throw new Error("Target SDK did not provide an origin ID");
    }
    
    return result; 
}