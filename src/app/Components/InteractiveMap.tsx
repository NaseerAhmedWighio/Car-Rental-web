"use client";

import { useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client";

const cityCoordinates: Record<string, [number, number]> = {
  "karachi": [24.8607, 67.0011],
  "lahore": [31.5204, 74.3587],
  "islamabad": [33.6844, 73.0479],
  "quetta": [30.1798, 66.9750],
  "hyderabad": [25.3960, 68.3578],
};

const getCoordinates = (location: string): [number, number] | null => {
  const key = location?.toLowerCase()?.trim();
  return key ? cityCoordinates[key] || null : null;
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
}

interface MapMarker {
  id: string;
  position: [number, number];
  rental: Rental;
  type: "pickup" | "dropoff";
}

function MapSkeleton() {
  return (
    <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading map...</p>
    </div>
  );
}

export default function InteractiveMap() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const isClientRef = useRef(false);

  useEffect(() => {
    isClientRef.current = true;
    return () => {
      isClientRef.current = false;
    };
  }, []);

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
          rentalId
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

  useEffect(() => {
    const newMarkers: MapMarker[] = [];
    const filteredRentals = filterStatus === "all"
      ? rentals
      : rentals.filter(r => r.status === filterStatus);

    filteredRentals.forEach(rental => {
      const pickupPos = getCoordinates(rental.pickupLocation);
      const dropoffPos = getCoordinates(rental.dropoffLocation);

      if (pickupPos) {
        newMarkers.push({ id: `${rental._id}-pickup`, position: pickupPos, rental, type: "pickup" });
      }
      if (dropoffPos) {
        newMarkers.push({ id: `${rental._id}-dropoff`, position: dropoffPos, rental, type: "dropoff" });
      }
    });

    setMarkers(newMarkers);
  }, [rentals, filterStatus]);

  useEffect(() => {
    if (!isClientRef.current || !mapContainerRef.current || mapInstanceRef.current || loading) return;

    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapContainerRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const iconUrls: Record<string, string> = {
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

      const map = L.map(mapContainerRef.current, { 
        zoomControl: true,
        scrollWheelZoom: true 
      }).setView([30.0, 69.0], 5);

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      setTimeout(() => map.invalidateSize(), 200);

      markersGroupRef.current = L.layerGroup().addTo(map);

      const renderMarkers = () => {
        if (!mapInstanceRef.current || !markersGroupRef.current) return;
        markersGroupRef.current.clearLayers();

        markers.forEach(marker => {
          const color = iconUrls[marker.rental.status] || "blue";
          const icon = createIcon(color);

          const popupContent = `
            <div style="min-width:180px;padding:8px;font-family:Arial,sans-serif;">
              <h3 style="font-weight:bold;color:#1A202C;font-size:14px;margin:0 0 4px;">${marker.rental.carTitle || 'Car'}</h3>
              <p style="font-size:11px;color:#90A3BF;margin:0 0 4px;">Rental ID: ${marker.rental.rentalId || 'N/A'}</p>
              <p style="font-size:11px;color:#596780;margin:0 0 4px;">Customer: ${marker.rental.customerName || 'N/A'}</p>
              <div style="font-size:11px;margin-top:6px;">
                <p style="margin:2px 0;"><strong>${marker.type === "pickup" ? "Pickup" : "Dropoff"}:</strong> ${marker.type === "pickup" ? marker.rental.pickupLocation : marker.rental.dropoffLocation}</p>
                <p style="margin:2px 0;"><strong>Date:</strong> ${marker.type === "pickup" ? marker.rental.pickupDate : marker.rental.dropoffDate}</p>
              </div>
              <span style="display:inline-block;margin-top:6px;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;color:white;background-color:${
                marker.rental.status === "active" ? "#3b82f6" : 
                marker.rental.status === "completed" ? "#22c55e" : 
                marker.rental.status === "pending" ? "#eab308" : "#ef4444"
              }">${(marker.rental.status || 'pending').toUpperCase()}</span>
            </div>
          `;

          L.marker(marker.position, { icon })
            .bindPopup(popupContent)
            .addTo(markersGroupRef.current!);
        });
      };

      renderMarkers();
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, markers]);

  if (!isClientRef.current || loading) {
    return <MapSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#1A202C] outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="text-sm text-[#90A3BF] self-center">
          {markers.length} marker{markers.length !== 1 ? 's' : ''} showing
        </span>
      </div>
      
      <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
        <div 
          ref={mapContainerRef} 
          style={{ height: "100%", width: "100%" }} 
          className="z-0"
        />
      </div>
    </div>
  );
}