import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface LocationMapProps {
  location: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Define some example coordinates for different locations
const coordinates = {
  Downtown: { lat: 33.6995, lng: 73.0363 }, 
  Uptown: { lat: 33.5651, lng: 73.0169 } 
};

const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  // Type assertion to inform TypeScript that 'location' is one of the keys in 'coordinates'
  const position = coordinates[location as keyof typeof coordinates] || { lat: 30.3753, lng: 69.3451};

  return (
    <LoadScript googleMapsApiKey="AIzaSyB5UH0ybq9FHal3ZBP9wo6heqUaEZnzVkk">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={position}
        zoom={13}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationMap;
