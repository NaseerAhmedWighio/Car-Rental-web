// import ShipEngine from "shipengine";

// export const shipEngine = new ShipEngine({
//   apiKey: process.env.SHIPENGINE_API_KEY as string
// });




import ShipEngine from "shipengine";

console.log("Loaded API Key:", process.env.SHIPENGINE_API_KEY); // Debugging log

if (!process.env.SHIPENGINE_API_KEY) {
  throw new Error("ShipEngine API Key is missing! Check your .env.local file.");
}

export const shipEngine = new ShipEngine({
  apiKey: process.env.SHIPENGINE_API_KEY as string,
});
