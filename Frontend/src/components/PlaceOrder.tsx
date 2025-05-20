import React, { useRef, useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import "tailwindcss/tailwind.css";
import { io } from "socket.io-client";
import { useProfile } from "../context/ProfileContext"; // Import the profile context

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
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: [nwlibraries],
  });
  const [toLocation, setToLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { currentUser } = useProfile(); // Access the current user's profile
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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const originRef = useRef<HTMLInputElement>(null);
  const socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports: ["websocket"],
  });
  useEffect(() => {
    socket.on("connect", () => {
      socket.on("orderStatusUpdate", (data) => {
        console.log("orderStatusUpdate received:", data);
        if (data.fromLocation) {
          const newEndPosition = new google.maps.LatLng(
            data.fromLocation.lat,
            data.fromLocation.lng
          );
          setEndMarkerPosition(newEndPosition);
          console.log("Location:", {
            lat: newEndPosition.lat(),
            lng: newEndPosition.lng(),
          });
          setModalOpen(false);
        }
      });
    });
    if (endMarkerPosition && originRef.current?.value) {
      calculateRoute();
    }

    return () => {
      socket.disconnect();
    };
    if (endMarkerPosition && originRef.current?.value) {
      calculateRoute();
    }
  }, [startMarkerPosition, endMarkerPosition]);

  const calculateRoute = async () => {
    const originValue = originRef.current?.value;

    if (!originValue || !endMarkerPosition) {
      console.error("Both origin and destination must be specified.");
      return;
    }

    if (window.google && window.google.maps) {
      setRequestActive(true);

      const directionsService = new window.google.maps.DirectionsService();

      try {
        const results = await directionsService.route({
          origin: endMarkerPosition.toJSON(),
          destination: originValue, // Convert LatLng to JSON
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

        if (results.routes.length === 0) {
          throw new Error("No routes found.");
        }

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
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (originRef.current?.value && currentUser) {
      // Geocode the address to get coordinates
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: originRef.current.value },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            const coords = {
              lat: location.lat(),
              lng: location.lng(),
              address: results[0].formatted_address,
            };
            setToLocation(coords);

            const requestData = {
              customerName: currentUser.firstName,
              customerId: currentUser.profileId,
              toLocation: coords, // Send as coordinates
              bidAmount,
            };
            console.log("Request Data:", requestData);

            socket.emit("newRequest", requestData);
            setRequestActive(true);
            setModalOpen(true);
          } else {
            console.error("Geocoding failed:", status);
          }
        }
      );
    } else {
      console.error("Origin must be specified.");
    }
  };

  const handleCancelRequest = () => {
    setRequestActive(false);
    setStartMarkerPosition(null);
    setEndMarkerPosition(null);
    originRef.current!.value = "";
    setBidAmount("");
    setModalOpen(false); // Close the modal when request is cancelled
  };
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const latLng = new google.maps.LatLng(lat, lng);

          // Set the start and end markers to the user's current location
          setStartMarkerPosition(latLng);
          setEndMarkerPosition(latLng); // Optional: set the destination to the same location

          // Update the map view to the user's current location
          setMap((prevMap) => {
            prevMap?.panTo(latLng);
            prevMap?.setZoom(14);
            return prevMap;
          });

          // Show a marker at the current position
          const marker = new google.maps.Marker({
            position: latLng,
            map: map, // You can also store the map in a state variable if needed
            title: "You are here",
          });

          // Optionally, show info window on the marker
          const infoWindow = new google.maps.InfoWindow({
            content: "Your current location",
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          // Automatically fill the origin input field with the location name
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              if (originRef.current) {
                originRef.current.value = results[0].formatted_address;
              }
            } else {
              console.error("Geocoder failed due to:", status);
            }
          });
        },
        (error) => {
          console.error("Error fetching current location:", error);
        }
      );
    } else {
      console.error("Geolocation not available");
    }
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
          // onClick={handleMapClick}
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
          <div className="relative">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="w-full p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
              disabled={requestActive}
            >
              Use Current Location
            </button>
            <input
              id="origin"
              ref={originRef}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              placeholder="Origin (From Address)"
              required
              disabled={requestActive}
            />
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
          </div>
        </form>
      </div>

      {/* Modal for "Searching for driver" */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Searching for driver...
            </h2>
            <button
              onClick={handleCancelRequest}
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
