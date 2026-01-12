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

// Custom icon for locations with enhanced design
const createCustomIcon = (color: string = "#ea580c", isHQ: boolean = false) => {
  const size = isHQ ? 32 : 28;
  const innerSize = isHQ ? 10 : 8;
  
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
      cursor: pointer;
    ">
      <div style="
        width: ${innerSize}px;
        height: ${innerSize}px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      "></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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
      const isHQ = index === 0;
      const icon = createCustomIcon(isHQ ? "#ea580c" : "#0284c7", isHQ);
      
      const popupContent = `
        <div style="text-align: center; padding: 12px 16px; min-width: 180px;">
          <h3 style="font-weight: 700; font-size: 19px; color: #111827; margin-bottom: 6px; letter-spacing: -0.01em;">
            ${location.city}
          </h3>
          <p style="font-size: 14px; color: #6b7280; margin: 0; font-weight: 500;">
            ${location.state}
          </p>
          ${
            isHQ
              ? `<div style="margin-top: 12px; padding: 6px 12px; background: linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(234, 88, 12, 0.08) 100%); color: #ea580c; font-size: 12px; font-weight: 700; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(234, 88, 12, 0.2);">
                  <span style="display: inline-block; margin-right: 4px;">⭐</span>Headquarters
                </div>`
              : ""
          }
        </div>
      `;

      const marker = L.marker([location.lat, location.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent, {
          className: 'custom-popup',
          closeButton: true,
          maxWidth: 300,
          offset: [0, -10]
        });

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
    <div className="w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .custom-marker:hover > div {
          transform: scale(1.15);
        }
        .leaflet-container {
          background: #f8fafc;
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

// Demo component with sample data
export default function App() {
  const sampleLocations = [
    { city: "San Francisco", state: "California", lat: 37.7749, lng: -122.4194 },
    { city: "New York", state: "New York", lat: 40.7128, lng: -74.0060 },
    { city: "Austin", state: "Texas", lat: 30.2672, lng: -97.7431 },
    { city: "Seattle", state: "Washington", lat: 47.6062, lng: -122.3321 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Our Locations
          </h1>
          <p className="text-lg text-slate-600">
            Explore our offices across the United States
          </p>
        </div>
        <InteractiveMap locations={sampleLocations} />
      </div>
    </div>
  );
}