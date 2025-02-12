import { shipEngine } from "@/helper/shipEngine";
import { NextRequest } from "next/server";

// export async function GET(request:NextRequest){
//     // return new Response(JSON.stringify({message:"shipengine Testing"}));
// }

export async function POST(req: NextRequest) {
     const { shipToAddress, packages } = await req.json();
    try {
      const shipmentDetails = await shipEngine.getRatesWithShipmentDetails({
        shipment: {
          shipTo: shipToAddress,
          shipFrom: {
            name: "Naseer Ahmed",
            phone: "03113867522",
            addressLine1: "Gulshan E Maymar",
            addressLine2: "Gadap, Karachi",
            cityLocality: "Karachi",
            stateProvince: "Sindh",
            postalCode: "12345",
            countryCode: "PK",
            addressResidentialIndicator: "no",
          },
          packages: packages,
        },
        rateOptions: {
          carrierIds: [
            process.env.SHIPENGINE_FIRST_COURIER || "",
            process.env.SHIPENGINE_SECOND_COURIER || "",
            process.env.SHIPENGINE_THIRD_COURIER || "",
            process.env.SHIPENGINE_FOURTH_COURIER || "",
          ].filter(Boolean),
        },
      });
  
      return new Response(JSON.stringify(shipmentDetails), { status: 200 });
    } catch (error) {
      console.log(error)
      return new Response(JSON.stringify({ error: "error" }), { status: 500 });
    }
  }