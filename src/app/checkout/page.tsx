// "use client"; // This directive ensures the component runs only on the client side in a Next.js app.
// // Install @stripe/stripe-js & @stripe/react-stripe-js
// import React, { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { createPaymentIntent } from "../billing/[slug]/action";

// // Initialize Stripe with the public key from environment variables
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

// export default function CheckoutPage() {
//   // State to store the client secret, which is required for processing the payment
//   const [clientSecret, setClientSecret] = useState<string | null>(null);

//   useEffect(() => {
//     // When the component mounts, request a new PaymentIntent from the server
//     createPaymentIntent()
//       .then((res) => {
//           setClientSecret(res.clientSecret); // Save the client secret to state
//       })
//   }, []);
//   console.log(clientSecret);

//   // While waiting for the client secret, show a loading message
//   if (!clientSecret) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ maxWidth: 400, margin: "0 auto" }}>
//       <h1>Checkout</h1>
//       {/* Wrap the payment form inside the Elements provider with Stripe instance and client secret */}
//       <Elements stripe={stripePromise} 
//       options={{ clientSecret }}>
//         <PaymentForm />
//       </Elements>
//     </div>
//   );
// }

// // Component that handles the payment form
// function PaymentForm() {
//   const stripe = useStripe(); // Hook to access Stripe methods
//   const elements = useElements(); // Hook to access Stripe elements
//   const [isProcessing, setIsProcessing] = useState(false); // State to manage loading state while processing
//   const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to show error messages

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent page refresh when submitting the form

//     if (!stripe || !elements) return; // Ensure Stripe is loaded before proceeding

//     setIsProcessing(true); // Indicate that the payment is being processed

//     // Attempt to confirm the payment
//     const { error } = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required", // Redirect if required by the payment method
//     });

//     if (error) {
//       setErrorMessage(error.message || "An unknown error occurred"); // Display error message if payment fails
//       setIsProcessing(false);
//     } else {
//       // Payment was successful
//       setErrorMessage(null);
//       alert("Payment successful!"); // Notify the user
//       setIsProcessing(false);
//       // You can optionally redirect the user to a success page here
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Stripe's payment element (handles input fields for card details, etc.) */}
//       <PaymentElement />
//       <button type="submit" 
//       disabled={!stripe || isProcessing}>
//         {isProcessing ? "Processing..." : "Pay Now"} {/* Show dynamic button text */}
//       </button>
//       {/* Display any error messages if they occur */}
//       {errorMessage && <div style={{ color: "red", marginTop: 8 }}>{errorMessage}</div>}
//     </form>
//   );
// }




















// // "use client"; // Ensures the component runs only on the client side in a Next.js app

// // import React, { useState, useEffect } from "react";
// // import { loadStripe } from "@stripe/stripe-js";
// // import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
// // import { createPaymentIntent } from "../action"; // Replace with your server-side action to create a PaymentIntent

// // // Initialize Stripe with the public key from environment variables
// // const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

// // export default function CheckoutPage() {
// //   const [clientSecret, setClientSecret] = useState<string | null>(null);

// //   useEffect(() => {
// //     // Fetch the client secret from your server
// //     createPaymentIntent()
// //       .then((res) => {
// //         setClientSecret(res.clientSecret); // Save the client secret to state
// //       })
// //       .catch((error) => {
// //         console.error("Error creating PaymentIntent:", error);
// //       });
// //   }, []);

// //   // Show a loading state while waiting for the client secret
// //   if (!clientSecret) {
// //     return <div>Loading...</div>;
// //   }

// //   return (
// //     <div className="w-full h-auto bg-white rounded-lg shadow-md pt-4 px-4">
// //       <div className="flex justify-between items-center">
// //         <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Payment Method</h1>
// //         <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 3 of 4</p>
// //       </div>
// //       <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
// //         <p>Please enter your payment method</p>
// //         <p className="hidden lg:block text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 3 of 4</p>
// //       </div>
// //       <div className="gap-5 pt-10">
// //         <div className="w-full rounded-lg p-4 bg-[#F6F7F9]">
// //           <div className="flex justify-between py-5">
// //             <div className="flex gap-4">
// //               <input
// //                 type="radio"
// //                 id="credit-card"
// //                 checked={true} // Always selected since Stripe handles credit card payments
// //                 onChange={() => {}}
// //               />
// //               <label htmlFor="credit-card" className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold">
// //                 Credit Card
// //               </label>
// //             </div>
// //             <div className="flex gap-4">
// //               {/* Credit card icons */}
// //               <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                 {/* SVG paths for credit card icons */}
// //               </svg>
// //               <svg className="pb-1" width="35" height="22" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                 {/* SVG paths for credit card icons */}
// //               </svg>
// //             </div>
// //           </div>

// //           {/* Stripe PaymentElement */}
// //           <Elements stripe={stripePromise} options={{ clientSecret }}>
// //             <PaymentForm />
// //           </Elements>
// //         </div>

// //         {/* Other payment methods (PayPal, Bitcoin, etc.) */}
// //         <div className="space-y-5 py-7">
// //           <div className="flex justify-between items-center rounded-lg w-full h-16 bg-[#F6F7F9] px-4">
// //             <div className="flex gap-4">
// //               <input type="radio" id="paypal" checked={false} onChange={() => {}} />
// //               <label htmlFor="paypal" className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold">
// //                 PayPal
// //               </label>
// //             </div>
// //             <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //               {/* SVG paths for PayPal icon */}
// //             </svg>
// //           </div>
// //           <div className="flex justify-between items-center rounded-lg w-full h-16 bg-[#F6F7F9] px-4">
// //             <div className="flex gap-4">
// //               <input type="radio" id="bitcoin" checked={false} onChange={() => {}} />
// //               <label htmlFor="bitcoin" className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold">
// //                 Bitcoin
// //               </label>
// //             </div>
// //             <svg width="94" height="20" viewBox="0 0 94 20" fill="none" xmlns="http://www.w3.org/2000/svg">
// //               {/* SVG paths for Bitcoin icon */}
// //             </svg>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // PaymentForm component for Stripe
// // function PaymentForm() {
// //   const stripe = useStripe();
// //   const elements = useElements();
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [errorMessage, setErrorMessage] = useState<string | null>(null);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!stripe || !elements) return;

// //     setIsProcessing(true);

// //     const { error } = await stripe.confirmPayment({
// //       elements,
// //       confirmParams: {
// //         return_url: `${window.location.origin}/success`, // Redirect URL after successful payment
// //       },
// //     });

// //     if (error) {
// //       setErrorMessage(error.message || "An unknown error occurred");
// //     } else {
// //       alert("Payment successful!");
// //     }

// //     setIsProcessing(false);
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <PaymentElement />
// //       <button type="submit" disabled={!stripe || isProcessing} className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg">
// //         {isProcessing ? "Processing..." : "Pay Now"}
// //       </button>
// //       {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
// //     </form>
// //   );
// // }