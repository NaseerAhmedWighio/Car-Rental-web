export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Morent Car Rental",
  "description": "Premium car rental service in Pakistan. Rent cars at the best prices with Naseer Ahmed Wighio.",
  "url": "https://morents.vercel.app",
  "telephone": "+92-XXX-XXXXXXX",
  "email": "info@morent.com",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PK",
    "addressRegion": "Sindh",
    "addressLocality": "Hyderabad"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "25.3960",
    "longitude": "68.3668"
  },
  "openingHours": "Mo-Su 00:00-24:00",
  "priceRange": "$$",
  "image": "https://morents.vercel.app/car.png",
  "creator": {
    "@type": "Person",
    "name": "Naseer Ahmed Wighio",
    "url": "https://naseerahmedwighio.com"
  },
  "serviceType": "Car Rental",
  "areaServed": ["Pakistan", "Karachi", "Hyderabad", "Lahore", "Islamabad", "Quetta"],
  "sameAs": [
    "https://facebook.com/morent",
    "https://instagram.com/morent",
    "https://twitter.com/morent"
  ]
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Morent Car Rental",
  "url": "https://morents.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://morents.vercel.app/category?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};
