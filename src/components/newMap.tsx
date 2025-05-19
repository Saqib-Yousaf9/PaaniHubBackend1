import React, { useRef, useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import "tailwindcss/tailwind.css";

const center = { lat: 33.6844, lng: 73.0479 };
const bounds = {
  north: 37.2846,
  south: 23.6345,
  east: 77.0841,
  west: 60.8728,
};

const Map: React.FC = () => {
  const nwlibraries = "places";
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB5UH0ybq9FHal3ZBP9wo6heqUaEZnzVkk",
    libraries: [nwlibraries],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<string>("");
  const [startMarkerPosition, setStartMarkerPosition] =
    useState<google.maps.LatLng | null>(null);
  const [endMarkerPosition, setEndMarkerPosition] =
    useState<google.maps.LatLng | null>(null);
  const [requestActive, setRequestActive] = useState<boolean>(false);
  const [startMarker, setStartMarker] = useState<google.maps.Marker | null>(
    null
  );
  const [endMarker, setEndMarker] = useState<google.maps.Marker | null>(null);

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (map && startMarkerPosition) {
      const marker = new google.maps.Marker({
        map: map,
        position: startMarkerPosition,
        // Add other necessary options here
      });
      setStartMarker(marker);

      return () => {
        marker.setMap(null);
      };
    }
  }, [map, startMarkerPosition]);

  useEffect(() => {
    if (map && endMarkerPosition) {
      const marker = new google.maps.Marker({
        map: map,
        position: endMarkerPosition,
        // Add other necessary options here
      });
      setEndMarker(marker);

      return () => {
        marker.setMap(null);
      };
    }
  }, [map, endMarkerPosition]);

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            const results = await geocoder.geocode({
              location: { lat: latitude, lng: longitude },
            });

            if (results.results[0]) {
              originRef.current!.value = results.results[0].formatted_address;
              setStartMarkerPosition(
                new window.google.maps.LatLng(latitude, longitude)
              );
              if (destinationRef.current?.value) {
                calculateRoute();
              }
            }
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng || requestActive) return;

    const latLng = event.latLng.toJSON();

    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      const results = await geocoder.geocode({
        location: latLng,
      });

      if (results.results[0]) {
        if (!startMarkerPosition) {
          originRef.current!.value = results.results[0].formatted_address;
          setStartMarkerPosition(event.latLng);
          if (destinationRef.current?.value) {
            calculateRoute();
          }
        } else if (!endMarkerPosition) {
          destinationRef.current!.value = results.results[0].formatted_address;
          setEndMarkerPosition(event.latLng);
          calculateRoute();
        } else {
          setStartMarkerPosition(event.latLng);
          setEndMarkerPosition(null);
          originRef.current!.value = results.results[0].formatted_address;
          destinationRef.current!.value = "";
          calculateRoute();
        }
      }
    }
  };

  const calculateRoute = async () => {
    const originValue = originRef.current?.value;
    const destinationValue = destinationRef.current?.value;

    if (!originValue || !destinationValue) return;

    if (window.google && window.google.maps) {
      setRequestActive(true);

      const directionsService = new window.google.maps.DirectionsService();
      try {
        const results = await directionsService.route({
          origin: originValue,
          destination: destinationValue,
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance?.text || "");
        setDuration(results.routes[0].legs[0].duration?.text || "");
      } catch (error) {
        console.error("Error calculating route:", error);
      } finally {
        setRequestActive(false);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (originRef.current?.value && destinationRef.current?.value) {
      setRequestActive(true);
      calculateRoute();
    } else {
      console.error("Both origin and destination must be specified.");
    }
  };

  const handleCancelRequest = () => {
    setRequestActive(false);
    setStartMarkerPosition(null);
    setEndMarkerPosition(null);
    originRef.current!.value = "";
    destinationRef.current!.value = "";
    setBidAmount("");
  };

  if (!isLoaded) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-stretch min-h-screen bg-gray-100 p-4 md:p-6 overflow-hidden">
      <div className="relative w-full h-64 md:h-[400px] rounded-lg shadow-lg overflow-hidden">
        <GoogleMap
          center={center}
          zoom={10}
          mapContainerClassName="w-full h-full"
          onLoad={(mapInstance) => setMap(mapInstance)}
          onClick={handleMapClick}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>

      <div className="bg-white p-4 md:p-5 rounded-lg shadow-lg border border-gray-200 max-w-md flex flex-col justify-between h-full md:h-[400px] mt-4 md:mt-0 md:ml-4">
        <h1 className="text-xl font-semibold mb-3 text-center text-gray-800">
          Place Order
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between h-full space-y-2"
        >
          <div className="relative flex flex-col md:flex-row md:items-center">
            <Autocomplete
              options={{
                componentRestrictions: { country: "pk" },
                bounds: bounds,
                strictBounds: true,
              }}
            >
              <input
                id="origin"
                ref={originRef}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ease-in-out transform hover:scale-105"
                placeholder="From Address"
                required
                disabled={requestActive}
              />
            </Autocomplete>
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="mt-2 md:mt-0 md:ml-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 ease-in-out"
              disabled={requestActive}
            >
              Current Location
            </button>
          </div>
          <div className="relative">
            <Autocomplete
              options={{
                componentRestrictions: { country: "pk" },
                bounds: bounds,
                strictBounds: true,
              }}
            >
              <input
                id="destination"
                ref={destinationRef}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ease-in-out transform hover:scale-105"
                placeholder="To Address"
                required
                disabled={requestActive}
              />
            </Autocomplete>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="bidAmount" className="text-gray-700">
              Bid Amount
            </label>
            <input
              id="bidAmount"
              type="number"
              min="0"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ease-in-out transform hover:scale-105"
              disabled={requestActive}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 ease-in-out"
              disabled={requestActive}
            >
              {requestActive ? "Processing..." : "Place Request"}
            </button>
            {requestActive && (
              <button
                type="button"
                onClick={handleCancelRequest}
                className="w-full py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 ease-in-out"
              >
                Cancel Request
              </button>
            )}
          </div>

          {distance && duration && (
            <div className="text-gray-800">
              <p>
                <strong>Distance:</strong> {distance}
              </p>
              <p>
                <strong>Duration:</strong> {duration}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Map;
