import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from "./Components/cartContext";
import { FavoritesProvider } from "./tracking/FavoritesContext";
import ChatWidget from "./Components/ChatWidget";
import "./globals.css";
import Footer from "./Components/Footer";
import { CategoryProvider } from "./Components/CategoryContext";
import HeaderWrapper from "./Components/HeaderWrapper";
import { jsonLd, websiteJsonLd } from "./Components/SEO";

export const metadata: Metadata = {
  metadataBase: new URL("https://morents.vercel.app"),
  title: {
    default: "Morent | Best Car Rental Service in Pakistan | Naseer Ahmed Wighio",
    template: "%s | Morent Car Rental",
  },
  description: "Morent - Premium car rental service in Pakistan. Rent cars at the best prices with Naseer Ahmed Wighio. Wide range of vehicles including SUV, Sedan, Hatchback. Free pickup & delivery. Book now!",
  keywords: ["car rental", "rent a car", "car hire", "vehicle rental", "Morent", "Naseer Ahmed Wighio", "Pakistan car rental", "cheap car rental", "rent car online", "car booking", "Hyderabad car rental", "Karachi car rental", "Lahore car rental", "Islamabad car rental"],
  authors: [{ name: "Naseer Ahmed Wighio", url: "https://morents.vercel.app" }],
  creator: "Naseer Ahmed Wighio",
  publisher: "Morent",
  applicationName: "Morent Car Rental",
  category: "automotive",
  classification: "Car Rental Services",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://morents.vercel.app",
    siteName: "Morent",
    title: "Morent | Best Car Rental Service in Pakistan",
    description: "Premium car rental service in Pakistan. Rent cars at the best prices with Naseer Ahmed Wighio. Wide range of vehicles. Book now!",
    images: [
      {
        url: "/car.png",
        width: 1200,
        height: 630,
        alt: "Morent - Best Car Rental in Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morent | Best Car Rental in Pakistan",
    description: "Premium car rental service in Pakistan. Rent cars at the best prices with Naseer Ahmed Wighio.",
    creator: "@naseerahmed",
    images: ["/car.png"],
  },
  alternates: {
    canonical: "https://morents.vercel.app",
    languages: {
      en: "https://morents.vercel.app",
    },
  },
verification: {
    google: "google0872aa93c7116795",
  },
  icons: "/favicon.ico",
};

export const viewport: Viewport = {
  themeColor: "#3563E9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          />
        </head>
        <body className="antialiased flex flex-col min-h-screen" suppressHydrationWarning>
          <CategoryProvider>
            <CartProvider>
              <FavoritesProvider>
                <HeaderWrapper />
                <div className="flex-1">
                  {children}
                </div>
                <ChatWidget />
              </FavoritesProvider>
            </CartProvider>
          </CategoryProvider>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}