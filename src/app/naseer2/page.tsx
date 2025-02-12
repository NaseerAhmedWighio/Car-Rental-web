// // "use client";

// // import React, { useRef } from "react";
// // import Header from "../Components/Header2";

// // export default function Naseer() {
// //   const getName = useRef<HTMLInputElement>(null);
// //   const getPhone = useRef<HTMLInputElement>(null);
// //   const getAd1 = useRef<HTMLInputElement>(null);
// //   const getAd2 = useRef<HTMLInputElement>(null);
// //   const getCity = useRef<HTMLInputElement>(null);
// //   const getProvince = useRef<HTMLInputElement>(null);
// //   const getPostalCode = useRef<HTMLInputElement>(null);
// //   const getCountry = useRef<HTMLInputElement>(null);
// //   const getAddressResidental = useRef<HTMLSelectElement>(null);

// //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
// //     event.preventDefault(); // Prevents page refresh
// //     const payload = {
// //       shipToAddress: {
// //         name: getName.current?.value,
// //         phone: getPhone.current?.value,
// //         addressResidental: getAddressResidental.current?.value,
// //         ad1: getAd1.current?.value,
// //         ad2: getAd2.current?.value,
// //         city: getCity.current?.value,
// //         province: getProvince.current?.value,
// //         postalCode: getPostalCode.current?.value,
// //         country: getCountry.current?.value,
// //       },
// //       packages: [
// //         {
// //           weight: { value: 5, unit: "ounce" },
// //           dimensions: { height: 3, width: 15, length: 10, unit: "inch" },
// //         },
// //       ],
// //   };


// //     console.log("Payload:", payload);

// //     try {
// //         const response = await fetch("http://localhost:3000/api/shipengine/get-rates", {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //               shipToAddress: {
// //                 name: "Michael Smith",
// //                 phone: "+1 555 987 6543",
// //                 addressLine1: "456 Oak Avenue",
// //                 addressLine2: "Suite 200",
// //                 cityLocality: "Los Angeles",
// //                 stateProvince: "CA",
// //                 postalCode: "90001",
// //                 countryCode: "US",
// //                 addressResidentialIndicator: "no",
// //               },
// //               packages: [
// //                 { weight: { value: 5, unit: "ounce" }, dimensions: { height: 3, width: 15, length: 10, unit: "inch" } },
// //               ],
// //             }),
// //           });
          
// //           const data = await response.json();
// //           console.log(data);
// //     //   const res = await fetch(`http://localhost:3000/api/shipengine`, {
// //     //     method: "POST",
// //     //     headers: {
// //     //       "Content-Type": "application/json",
// //     //     },
// //     //     body: JSON.stringify({ shipment: payload }),
// //     //   });

// //     //   const result = await res.json();
// //     //   console.log("Result:", result);
// //     } catch (error) {
// //       console.error("Error:", error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <Header />
// //       <div className="w-full h-auto bg-white">
// //         <h1 className="py-10 text-center text-4xl font-semibold">
// //           This is Get Rates Page
// //         </h1>
// //         <form
// //           className="grid grid-cols-2 gap-10 mx-10"
// //           onSubmit={handleSubmit} // Correctly set the `onSubmit` event
// //         >
// //           <div>
// //             <label>Name</label>
// //             <input
// //               ref={getName}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //               type="text"
// //             />
// //           </div>
// //           <div>
// //             <label>Phone</label>
// //             <input
// //               ref={getPhone}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //               type="text"
// //             />
// //           </div>
// //           <div>
// //             <label>AddressLine1</label>
// //             <input
// //               ref={getAd1}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //               type="text"
// //             />
// //           </div>
// //           <div>
// //             <label>AddressLine2</label>
// //             <input
// //               ref={getAd2}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //               type="text"
// //             />
// //           </div>
// //           <div>
// //             <label>City</label>
// //             <input
// //               ref={getCity}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //               type="text"
// //             />
// //           </div>
// //           <div>
// //             <label>State | Province</label>
// //             <input
// //               ref={getProvince}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //               type="text"
// //             />
// //           </div>
// //           <div>
// //             <label>Postal Code</label>
// //             <input
// //               ref={getPostalCode}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //               type="text"
// //             />
// //           </div>
// //           <div>
// //             <label>Country Code</label>
// //             <input
// //               ref={getCountry}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //               type="text"
// //             />
// //           </div>
// //           <div>
// //             <label>Address Residental</label>
// //             <select
// //               ref={getAddressResidental}
// //               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
// //             >
// //               <option value="yes">Yes</option>
// //               <option value="no">No</option>
// //             </select>
// //           </div>
// //           <button
// //             className="bg-blue-400 rounded-lg shadow-lg px-6 py-3"
// //             type="submit"
// //           >
// //             Submit
// //           </button>
// //         </form>
// //         <div className="h-full flex flex-col space-y-5 bg-red-600">
// //         <li>{getName.current?.value}</li>
// //         <li>{getPhone.current?.value}</li>
// //         <li>{getAd1.current?.value}</li>
// //         <li>{getAd2.current?.value}</li>
// //         <li>{getCity.current?.value}</li>
// //         <li>{getPostalCode.current?.value}</li>
// //         <li>{getCountry.current?.value}</li>
// //         <li>{getProvince.current?.value}</li>
// //         <li>{getAddressResidental.current?.value}</li>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// "use client";

// import React, { useRef, useState } from "react";
// import Header from "../Components/Header2";

// export default function Naseer() {
//   const getName = useRef<HTMLInputElement>(null);
//   const getPhone = useRef<HTMLInputElement>(null);
//   const getAd1 = useRef<HTMLInputElement>(null);
//   const getAd2 = useRef<HTMLInputElement>(null);
//   const getCity = useRef<HTMLInputElement>(null);
//   const getProvince = useRef<HTMLInputElement>(null);
//   const getPostalCode = useRef<HTMLInputElement>(null);
//   const getCountry = useRef<HTMLInputElement>(null);
//   const getAddressResidental = useRef<HTMLSelectElement>(null);

//   const [submittedData, setSubmittedData] = useState<any>(null);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault(); // Prevents page refresh

//     const payload = {
//       shipToAddress: {
//         name: getName.current?.value,
//         phone: getPhone.current?.value,
//         addressResidental: getAddressResidental.current?.value,
//         ad1: getAd1.current?.value,
//         ad2: getAd2.current?.value,
//         city: getCity.current?.value,
//         province: getProvince.current?.value,
//         postalCode: getPostalCode.current?.value,
//         country: getCountry.current?.value,
//       },
//       packages: [
//         {
//           weight: { value: 5, unit: "ounce" },
//           dimensions: { height: 3, width: 15, length: 10, unit: "inch" },
//         },
//       ],
//     };

//     // Update state with the submitted data
//     setSubmittedData(payload.shipToAddress);

//     console.log("Payload:", payload);

//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/shipengine/get-rates",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();
//       console.log("Response Data:", data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="w-full h-auto bg-white">
//         <h1 className="py-10 text-center text-4xl font-semibold">
//           This is Get Rates Page
//         </h1>
//         <form
//           className="grid grid-cols-2 gap-10 mx-10"
//           onSubmit={handleSubmit}
//         >
//           <div>
//             <label>Name</label>
//             <input
//               ref={getName}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//               type="text"
//             />
//           </div>
//           <div>
//             <label>Phone</label>
//             <input
//               ref={getPhone}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//               type="tel"
//             />
//           </div>
//           <div>
//             <label>AddressLine1</label>
//             <input
//               ref={getAd1}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//               type="text"
//             />
//           </div>
//           <div>
//             <label>AddressLine2</label>
//             <input
//               ref={getAd2}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//               type="text"
//             />
//           </div>
//           <div>
//             <label>City</label>
//             <input
//               ref={getCity}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//               type="text"
//             />
//           </div>
//           <div>
//             <label>State | Province</label>
//             <input
//               ref={getProvince}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//               type="text"
//             />
//           </div>
//           <div>
//             <label>Postal Code</label>
//             <input
//               ref={getPostalCode}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//               type="text"
//             />
//           </div>
//           <div>
//             <label>Country Code</label>
//             <input
//               ref={getCountry}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//               type="text"
//             />
//           </div>
//           <div>
//             <label>Address Residental</label>
//             <select
//               ref={getAddressResidental}
//               className="w-full h-14 bg-slate-200 outline-none border-none px-5 rounded-lg shadow-lg"
//             >
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>
//           </div>
//           <button
//             className="bg-blue-400 rounded-lg shadow-lg px-6 py-3"
//             type="submit"
//           >
//             Submit
//           </button>
//         </form>

//         {submittedData && (
//           <div className="mt-10 bg-gray-100 p-5 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4">Submitted Data:</h2>
//             <ul className="list-disc ml-5 space-y-2">
//               <li>Name: {submittedData.name}</li>
//               <li>Phone: {submittedData.phone}</li>
//               <li>Address Line 1: {submittedData.ad1}</li>
//               <li>Address Line 2: {submittedData.ad2}</li>
//               <li>City: {submittedData.city}</li>
//               <li>State/Province: {submittedData.province}</li>
//               <li>Postal Code: {submittedData.postalCode}</li>
//               <li>Country Code: {submittedData.country}</li>
//               <li>
//                 Address Residental: {submittedData.addressResidental}
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

