import ShipEngine from "shipengine";

// Lazy initialization - only create client when needed
let shipEngineClient: ShipEngine | null = null;

export function getShipEngine(): ShipEngine {
  if (!shipEngineClient) {
    const apiKey = process.env.SHIPENGINE_API_KEY;

    if (!apiKey) {
      console.error("❌ ERROR: SHIPENGINE_API_KEY is missing!");
      throw new Error("ShipEngine API Key is missing! Check your environment variables.");
    }

    console.log("✅ ShipEngine API Key loaded successfully.");
    shipEngineClient = new ShipEngine({ apiKey });
  }

  return shipEngineClient;
}

// Backwards compatibility - export a proxy object that lazily initializes
export const shipEngine = {
  getRatesWithShipmentDetails: (params: any) => {
    const client = getShipEngine();
    return client.getRatesWithShipmentDetails(params);
  },
  createLabelFromRate: (params: any) => {
    const client = getShipEngine();
    return client.createLabelFromRate(params);
  },
  trackUsingLabelId: (labelId: string) => {
    const client = getShipEngine();
    return client.trackUsingLabelId(labelId);
  },
};
