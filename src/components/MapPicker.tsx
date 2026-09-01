"use client";

import { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";

declare global {
  interface Window {
    google: any;
  }
}

interface MapPickerProps {
  onChange: (data: { lat: number; lng: number; areaSqFt: number }) => void;
}

// Loads the Google Maps JS SDK once and lets the owner drop a pin, then
// draw a boundary polygon. Area is computed client-side with Turf.js so no
// backend GIS work is needed for MVP.
export default function MapPicker({ onChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [areaSqFt, setAreaSqFt] = useState<number | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.");
      return;
    }
    if (window.google) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 18.5204, lng: 73.8567 }, // Pune default center
      zoom: 15,
      mapTypeId: "satellite",
    });

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: "#D9622B",
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: "#D9622B",
      },
    });
    drawingManager.setMap(map);

    window.google.maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      (polygon: any) => {
        const path = polygon.getPath();
        const coords: [number, number][] = [];
        for (let i = 0; i < path.getLength(); i++) {
          const point = path.getAt(i);
          coords.push([point.lng(), point.lat()]);
        }
        coords.push(coords[0]); // close the polygon

        const turfPolygon = turf.polygon([coords]);
        const areaSqM = turf.area(turfPolygon);
        const sqFt = Math.round(areaSqM * 10.7639);
        setAreaSqFt(sqFt);

        const centroid = turf.centroid(turfPolygon);
        const [lng, lat] = centroid.geometry.coordinates;

        onChange({ lat, lng, areaSqFt: sqFt });
      }
    );

    return () => {
      drawingManager.setMap(null);
    };
  }, [scriptLoaded, onChange]);

  return (
    <div className="space-y-2">
      <div ref={mapRef} className="w-full h-80 rounded-lg border bg-gray-100" />
      <p className="text-sm text-gray-500">
        Draw the plot boundary on the map. Area is calculated automatically.
      </p>
      {areaSqFt && (
        <p className="text-sm font-medium">
          Calculated area: {areaSqFt.toLocaleString()} sq. ft.
        </p>
      )}
    </div>
  );
}
