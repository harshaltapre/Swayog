import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

// Custom icon for locations
const createCustomIcon = (color: string = "#ea580c") => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
      "></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface Location {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  locations: Location[];
}

export function InteractiveMap({ locations }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    // Calculate center point (average of all locations)
    const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: 5,
        scrollWheelZoom: true,
      });

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each location
    locations.forEach((location, index) => {
      const icon = createCustomIcon(index === 0 ? "#ea580c" : "#0284c7");
      
      const popupContent = `
        <div style="text-align: center; padding: 8px;">
          <h3 style="font-weight: bold; font-size: 18px; color: #1f2937; margin-bottom: 4px;">
            ${location.city}
          </h3>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">
            ${location.state}
          </p>
          ${
            index === 0
              ? '<span style="display: inline-block; margin-top: 8px; padding: 4px 8px; background-color: rgba(234, 88, 12, 0.1); color: #ea580c; font-size: 12px; font-weight: 600; border-radius: 4px;">Headquarters</span>'
              : ""
          }
        </div>
      `;

      const marker = L.marker([location.lat, location.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((loc) => [loc.lat, loc.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach((marker) => {
          mapInstanceRef.current?.removeLayer(marker);
        });
        markersRef.current = [];
      }
    };
  }, [locations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
