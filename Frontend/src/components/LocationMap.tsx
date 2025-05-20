import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface LocationMapProps {
  location: string | { lat: number; lng: number }; // Allow flexibility with string or lat/lng object
  zoom?: number; // Optional zoom level prop
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Example coordinates for predefined locations
const predefinedCoordinates: Record<string, { lat: number; lng: number }> = {
  Downtown: { lat: 33.6995, lng: 73.0363 },
  Uptown: { lat: 33.5651, lng: 73.0169 },
};

const defaultPosition = { lat: 30.3753, lng: 69.3451 }; // Default to a neutral location (e.g., Pakistan center)

const LocationMap: React.FC<LocationMapProps> = ({ location, zoom = 16 }) => {
  // Determine position based on input
  const position =
    typeof location === "string"
      ? predefinedCoordinates[location] || defaultPosition
      : location;

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={position}
        zoom={zoom} // Zoom level is adjustable
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationMap;
