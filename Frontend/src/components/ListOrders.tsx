import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LocationMap from "./LocationMap"; // Import the LocationMap component
import { useProfile } from "../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import Order from "./Order"; // For order details

interface Request {
  orderId: string;
  customerId: string;
  customerName: string;
  to: {
    lat: number;
    lng: number;
    address?: string;
  };
  bidAmount: string;
  status: string;
}

const ListOrders: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const { currentUser } = useProfile();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  type LocationObj = { lat: number; lng: number; address: string };

  // Update the state definition:
  const [fromLocation, setFromLocation] = useState<LocationObj | null>(null);
  const [isOrderStarted, setIsOrderStarted] = useState(false); // Track if order has started
  const navigate = useNavigate(); // For page navigation

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
          }/api/requests/pending`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched requests:", data);
          setRequests(
            data.map((req: any) => ({
              ...req,
              orderId: req.orderId || req._id,
              to: req.to || req.toLocation,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    fetchRequests();

    const socket = io(
      process.env.REACT_APP_SOCKET_URL || "http://localhost:3001",
      {
        withCredentials: true, // If needed to send credentials (e.g., session cookie)
      }
    );

    socket.on("newRequestBroadcast", (newRequest: any) => {
      setRequests((prevRequests) => [
        ...prevRequests,
        {
          ...newRequest,
          orderId: newRequest.orderId || newRequest._id,
          to: newRequest.to || newRequest.toLocation,
        },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleViewLocation = async (request: Request) => {
    try {
      // Make the API request to Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          request.to.lat
        },${request.to.lng}&key=${
          process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
        }`
      );

      // Parse the response data
      const data = await response.json();

      // Check if the geocoding request was successful
      if (data.status === "OK") {
        // Extract latitude and longitude from the response
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ lat, lng }); // Set the coordinates in state
      } else {
        console.error("Geocoding failed:", data.status);
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }

    // Set the selected request after the location is found
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setCoordinates(null);
  };

  const handleAcceptRequest = (request: Request) => {
    const hasActiveOrder = requests.some(
      (req) => req.status === "inprogress" || req.status === "running"
    );
    if (hasActiveOrder) {
      alert(
        "You already have an order in progress. Please complete it before accepting a new one."
      );
      return;
    }
    setIsOrderStarted(true);
    setSelectedRequest(request);
  };

  const handleDeclineRequest = async (request: Request) => {
    try {
      const params = new URLSearchParams();
      if (request.customerId) params.append("customerId", request.customerId);
      if (currentUser?.userId) params.append("driverId", currentUser.userId);

      const response = await fetch(
        `http://localhost:3001/api/requests/pending/${
          request.orderId
        }?${params.toString()}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        setRequests((prev) =>
          prev.filter((req) => req.orderId !== request.orderId)
        );
      } else {
        const errorText = await response.text();
        console.error("Failed to decline request:", errorText);
      }
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };
  const startOrder = () => {
    if (selectedRequest && currentUser) {
      // Emit the order start to the backend
      const socket = io(
        process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
      );

      socket.emit("acceptRequest", {
        orderId: selectedRequest.orderId,
        driverId: currentUser?.profileId,
        fromLocation: fromLocation || {
          lat: 0,
          lng: 0,
          address: "Unknown",
        },
      });

      // Instead of removing, update the status to "inprogress"
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.orderId === selectedRequest.orderId
            ? { ...req, status: "inprogress" }
            : req
        )
      );

      setIsOrderStarted(false);
    }
  };
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Optionally, reverse geocode to get address
          let address = "";
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
                process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
              }`
            );
            const data = await response.json();
            if (data.status === "OK" && data.results[0]) {
              address = data.results[0].formatted_address;
            }
          } catch {}

          setFromLocation({
            lat: latitude,
            lng: longitude,
            address,
          });
          setCoordinates({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation(); // Get current location when the component mounts
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
      <div className="w-full max-w-screen-lg mx-auto bg-white p-2 sm:p-4 md:p-6 lg:p-8 rounded-lg shadow-lg">
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600">
            PaaniHub Driver Dashboard
          </h1>
        </header>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4 border-b-2 border-blue-600 pb-2">
            Incoming Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] table-auto bg-white">
              <thead>
                <tr>
                  <th className="px-2 py-1 sm:px-4 sm:py-2 border-b text-blue-600 text-xs sm:text-sm md:text-base">
                    #
                  </th>
                  <th className="px-2 py-1 sm:px-4 sm:py-2 border-b text-blue-600 text-xs sm:text-sm md:text-base">
                    Customer Name
                  </th>
                  <th className="px-2 py-1 sm:px-4 sm:py-2 border-b text-blue-600 text-xs sm:text-sm md:text-base">
                    Location
                  </th>
                  <th className="px-2 py-1 sm:px-4 sm:py-2 border-b text-blue-600 text-xs sm:text-sm md:text-base">
                    Bid Amount
                  </th>
                  <th className="px-2 py-1 sm:px-4 sm:py-2 border-b text-blue-600 text-xs sm:text-sm md:text-base">
                    Status
                  </th>
                  <th className="px-2 py-1 sm:px-4 sm:py-2 border-b text-blue-600 text-xs sm:text-sm md:text-base">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr
                    key={request.orderId}
                    className="text-center hover:bg-gray-50 transition-transform duration-300"
                  >
                    <td className="px-2 py-1 sm:px-4 sm:py-2 border-b text-gray-700 text-xs sm:text-sm md:text-base">
                      {index + 1}
                    </td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 border-b text-gray-700 text-xs sm:text-sm md:text-base">
                      {request.customerName}
                    </td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 border-b text-gray-700 text-xs sm:text-sm md:text-base">
                      {request.to?.address ||
                        `${request.to?.lat}, ${request.to?.lng}` ||
                        "No address"}
                    </td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 border-b text-gray-700 text-xs sm:text-sm md:text-base">
                      {request.bidAmount}
                    </td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 border-b text-gray-700 text-xs sm:text-sm md:text-base">
                      {request.status}
                    </td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 border-b">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button className="bg-yellow-400 text-gray-800 px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-300 text-xs sm:text-sm md:text-base">
                          + Bid
                        </button>
                        <button
                          className="bg-green-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors duration-300 text-xs sm:text-sm md:text-base"
                          onClick={() => handleAcceptRequest(request)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-red-400 transition-colors duration-300 text-xs sm:text-sm md:text-base"
                          onClick={() => handleDeclineRequest(request)}
                        >
                          Decline
                        </button>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-blue-400 transition-colors duration-300 text-xs sm:text-sm md:text-base"
                          onClick={() => handleViewLocation(request)}
                        >
                          View Location
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Popup for order start confirmation */}
      {isOrderStarted && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Confirm Order Start
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to start this order?
            </p>
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <button
                onClick={startOrder}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors duration-300"
              >
                Yes, Start Order
              </button>
              <button
                onClick={() => setIsOrderStarted(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-400 transition-colors duration-300"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
