"use client";

import { useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client";

// Pakistan city coordinates
const cityCoordinates: Record<string, [number, number]> = {
  "khi": [24.8607, 67.0011],
  "hyd": [25.3960, 68.3578],
  "lhr": [31.5204, 74.3587],
  "qta": [30.1798, 66.9750],
  "isb": [33.6844, 73.0479],
  "nbs": [26.2442, 68.3990],
  "karachi": [24.8607, 67.0011],
  "lahore": [31.5204, 74.3587],
  "islamabad": [33.6844, 73.0479],
  "quetta": [30.1798, 66.9750],
  "nawabshah": [26.2442, 68.3990],
};

const getCoordinates = (location: string): [number, number] | null => {
  const key = location.toLowerCase();
  return cityCoordinates[key] || null;
};

interface Rental {
  _id: string;
  carTitle: string;
  customerName: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  totalPrice: number;
  pickupDate: string;
  dropoffDate: string;
  rentalId: string;
  pickupCoordinates?: { lat: number; lng: number };
  dropoffCoordinates?: { lat: number; lng: number };
}

interface MapMarker {
  id: string;
  position: [number, number];
  rental: Rental;
  type: "pickup" | "dropoff";
}

function MapSkeleton() {
  return (
    <div className="w-full h-[400px] sm:h-[450px] lg:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading map...</p>
    </div>
  );
}

export default function InteractiveMap() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isClient, setIsClient] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  // Mount Leaflet on client only
  useEffect(() => {
    setIsClient(true);
    return () => {
      setIsClient(false);
    };
  }, []);

  // Fetch rentals
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const query = `*[_type == "rental"] | order(rentedAt desc) {
          _id,
          carTitle,
          customerName,
          pickupLocation,
          dropoffLocation,
          status,
          totalPrice,
          pickupDate,
          dropoffDate,
          rentalId,
          "pickupCoordinates": pickupCoordinates { "lat": latitude, "lng": longitude },
          "dropoffCoordinates": dropoffCoordinates { "lat": latitude, "lng": longitude }
        }`;
        const data = await client.fetch(query);
        setRentals(data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  // Build markers data
  useEffect(() => {
    const newMarkers: MapMarker[] = [];
    const filteredRentals = filterStatus === "all"
      ? rentals
      : rentals.filter(r => r.status === filterStatus);

    filteredRentals.forEach(rental => {
      const pickupPos = rental.pickupCoordinates
        ? [rental.pickupCoordinates.lat, rental.pickupCoordinates.lng] as [number, number]
        : getCoordinates(rental.pickupLocation);

      const dropoffPos = rental.dropoffCoordinates
        ? [rental.dropoffCoordinates.lat, rental.dropoffCoordinates.lng] as [number, number]
        : getCoordinates(rental.dropoffLocation);

      if (pickupPos) {
        newMarkers.push({ id: `${rental._id}-pickup`, position: pickupPos, rental, type: "pickup" });
      }
      if (dropoffPos) {
        newMarkers.push({ id: `${rental._id}-dropoff`, position: dropoffPos, rental, type: "dropoff" });
      }
    });

    setMarkers(newMarkers);
  }, [rentals, filterStatus]);

  // Initialize and render the map imperatively
  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapInstanceRef.current || loading) return;

    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapContainerRef.current) return;


      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const markerColors: Record<string, string> = {
        active: "blue",
        completed: "green",
        pending: "yellow",
        cancelled: "red",
      };

      const createIcon = (color: string) => {
        return new L.Icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
      };

      const iconUrls: Record<string, string> = {
        active: "blue",
        completed: "green",
        pending: "yellow",
        cancelled: "red",
      };

      // Create map
      const map = L.map(mapContainerRef.current, { zoomControl: true }).setView([24.8607, 67.0011], 10);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Invalidate size after a tick
      setTimeout(() => map.invalidateSize(), 100);

      markersGroupRef.current = L.layerGroup().addTo(map);

      return { L, createIcon, iconUrls };
    })().then((result) => {
      if (cancelled || !result) return;
      const { L, createIcon, iconUrls } = result;

      // Function to render markers
      const renderMarkers = () => {
        if (!mapInstanceRef.current || !markersGroupRef.current) return;
        markersGroupRef.current.clearLayers();

        markers.forEach(marker => {
          const color = iconUrls[marker.rental.status] || "blue";
          const icon = createIcon(color);

          const popupContent = `
            <div style="min-width:200px;padding:4px;">
              <h3 style="font-weight:bold;color:#1A202C;font-size:14px;margin:0 0 4px;">${marker.rental.carTitle}</h3>
              <p style="font-size:12px;color:#90A3BF;margin:0 0 4px;">Rental ID: ${marker.rental.rentalId}</p>
              <p style="font-size:12px;color:#596780;margin:0 0 8px;">Customer: ${marker.rental.customerName}</p>
              <div style="font-size:12px;">
                <p style="margin:2px 0;"><strong>${marker.type === "pickup" ? "Pickup" : "Drop-off"}:</strong> ${marker.type === "pickup" ? marker.rental.pickupLocation : marker.rental.dropoffLocation}</p>
                <p style="margin:2px 0;"><strong>Date:</strong> ${marker.type === "pickup" ? marker.rental.pickupDate : marker.rental.dropoffDate}</p>
              </div>
              <span style="display:inline-block;margin-top:8px;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:600;color:white;background-color:${marker.rental.status === "active" ? "#3b82f6" : marker.rental.status === "completed" ? "#22c55e" : marker.rental.status === "pending" ? "#eab308" : "#ef4444"}">${marker.rental.status.toUpperCase()}</span>
            </div>
          `;

          L.marker(marker.position, { icon })
            .bindPopup(popupContent)
            .addTo(markersGroupRef.current!);
        });
      };

      renderMarkers();
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
      }
    };
  }, [isClient, loading, markers]);

  if (!isClient || loading) {
    return <MapSkeleton />;
  }

  return (
    <div className="w-full">
      {/* Map */}
      <div className="w-full h-[180px] sm:h-[200px] lg:h-[220px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}
