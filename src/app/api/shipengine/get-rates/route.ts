// import { shipEngine } from "@/helper/shipEngine";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//   const { shipToAddress, packages } = await req.json();
//   try {
//     const shipmentDetails = await shipEngine.getRatesWithShipmentDetails({
//       shipment: {
//         shipTo: shipToAddress,
//         shipFrom: {
//           name: "John Doe",
//           phone: "+1 555 123 4567",
//           addressLine1: "742 Evergreen Terrace",
//           addressLine2: "Apt 101",
//           cityLocality: "Springfield",
//           stateProvince: "IL",
//           postalCode: "62701",
//           countryCode: "US",
//           addressResidentialIndicator: "no",
//         },
//         packages: packages,
//       },
//       rateOptions: {
//         carrierIds: [
//           process.env.SHIPENGINE_FIRST_COURIER || "",
//           process.env.SHIPENGINE_SECOND_COURIER || "",
//           process.env.SHIPENGINE_THIRD_COURIER || "",
//           process.env.SHIPENGINE_FOURTH_COURIER || "",
//         ].filter(Boolean),
//       },
//     });

//     return new Response(JSON.stringify(shipmentDetails), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "error" }), { status: 500 });
//   }
// }

///////////////////////////////////////////////////////////////////////////////////////////////


import { shipEngine as shipengine } from "../../../../helper/shipEngine"; // Import ShipEngine client
import { Address, Package } from "../../../../../type"; // Import custom types
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      shipeToAddress,
      packages,
    }: { shipeToAddress: Address; packages: Package[] } = await req.json();

    // Validate required fields
    if (!shipeToAddress || !packages) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: shipeToAddress and packages",
        }),
        { status: 400 }
      );
    }
// in testing api you can use your  address which you have selected in create account
// Define the "ship from" address (e.g., your warehouse or business address)
    const shipFromAddress: Address = {
      name: "Michael Smith",
      phone: "+1 555 987 6543",
      addressLine1: "456 Oak Avenue",
      addressLine2: "Suite 200",
      cityLocality: "Los Angeles",
      stateProvince: "CA",
      postalCode: "90001",
      countryCode: "US",
      addressResidentialIndicator: "no", // Indicates a commercial address
    };

    // Fetch shipping rates from ShipEngine
    const shipmentDetails = await shipengine.getRatesWithShipmentDetails({
      shipment: {
        shipTo: shipeToAddress,
        shipFrom: shipFromAddress,
        packages: packages,
      },
      rateOptions: {
        carrierIds: [
          process.env.SHIPENGINE_FIRST_COURIER || "",
          process.env.SHIPENGINE_SECOND_COURIER || "",
          process.env.SHIPENGINE_THIRD_COURIER || "",
          process.env.SHIPENGINE_FOURTH_COURIER || "",
        ].filter(Boolean), // Remove empty strings
      },
    });

    // Log details for debugging
    console.log("Ship To Address:", shipeToAddress);
    console.log("Packages:", packages);
    console.log("Shipment Details:", shipmentDetails);

    // Return the response with shipment details
    return new Response(
      JSON.stringify({ shipeToAddress, packages, shipmentDetails }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching shipping rates:", error)
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////


// import { shipEngine as shipengine } from "../../../../helper/shipEngine"; // Import ShipEngine client
// import { Address, Package } from "../../../../../type"; // Import custom types
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const {
//       shipToAddress, // Fixed typo (was "shipeToAddress")
//       packages,
//     }: { shipToAddress: Address; packages: Package[] } = await req.json();

//     // Validate required fields
//     if (!shipToAddress || !packages || packages.length === 0) {
//       return NextResponse.json(
//         { error: "Missing required fields: shipToAddress and packages" },
//         { status: 400 }
//       );
//     }

//     // Ensure ShipEngine API key is available
//     const apiKey = process.env.SHIPENGINE_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { error: "ShipEngine API Key is missing. Check your environment variables." },
//         { status: 500 }
//       );
//     }

//     // Define the "ship from" address (your warehouse or business address)
//     const shipFromAddress: Address = {
//       name: "Michael Smith",
//       phone: "+1 555 987 6543",
//       addressLine1: "456 Oak Avenue",
//       addressLine2: "Suite 200",
//       cityLocality: "Los Angeles",
//       stateProvince: "CA",
//       postalCode: "90001",
//       countryCode: "US",
//       addressResidentialIndicator: "no", // Commercial address
//     };

//     // Fetch carrier IDs from environment variables (remove empty ones)
//     const carrierIds = [
//       process.env.SHIPENGINE_FIRST_COURIER,
//       process.env.SHIPENGINE_SECOND_COURIER,
//       process.env.SHIPENGINE_THIRD_COURIER,
//       process.env.SHIPENGINE_FOURTH_COURIER,
//     ].filter((id) => !!id); // Ensures no undefined values

//     if (carrierIds.length === 0) {
//       return NextResponse.json(
//         { error: "No valid carrier IDs found. Check your .env file." },
//         { status: 500 }
//       );
//     }

//     // Fetch shipping rates from ShipEngine
//     const shipmentDetails = await shipengine.getRatesWithShipmentDetails({
//       shipment: {
//         shipTo: shipToAddress,
//         shipFrom: shipFromAddress,
//         packages: packages,
//       },
//       rateOptions: {
//         carrierIds: carrierIds.filter(Boolean) as string[],
//       },
//     });

//     // Log details for debugging
//     console.log("Ship To Address:", shipToAddress);
//     console.log("Packages:", packages);
//     console.log("Shipment Details:", shipmentDetails);

//     // Return the response with shipment details
//     return NextResponse.json(
//       { shipToAddress, packages, shipmentDetails },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error fetching shipping rates:", error);

//     return NextResponse.json(
//       { error: error.message || "An unknown error occurred" },
//       { status: 500 }
//     );
//   }
// }
