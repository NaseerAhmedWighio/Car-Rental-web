import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from "./Components/cartContext";
import "./globals.css";
import { Plus_Jakarta_Sans } from 'next/font/google';
import Footer from "./Components/Footer";
import { CategoryProvider } from "./Components/CategoryContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Car Rental Web",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={`${plusJakartaSans.variable} antialiased`}>
          <CategoryProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </CategoryProvider>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}