import React from "react";
import { useNavigate } from "react-router-dom";
import ListOrders from "./ListOrders";
import Map from "./PlaceOrder";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { Toast } from "primereact/toast";

const Dashboard: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { currentUser, isProfileComplete } = useProfile();
  const navigate = useNavigate();
  const toastRef = React.useRef<Toast>(null);

  React.useEffect(() => {
    if (toastRef.current) {
      toastRef.current.show({
        severity: "info",
        summary: "Dashboard Loaded",
        detail: "Welcome to your dashboard!",
        life: 3000,
      });
    }
    console.log("Current User:", currentUser);
    console.log("Loading State:", loading);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-gray-600">
          Please log in to view this page.
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-gray-600">
          No profile information found.
        </div>
      </div>
    );
  }

  if (currentUser.role === "driver") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
        {isProfileComplete ? (
          <ListOrders />
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              To become a supplier, please complete your profile.
            </p>
            <button
              onClick={() => navigate("/root/profile")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Complete Profile
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-10 flex justify-center">
      <div className="container px-4">
        <Toast ref={toastRef} />
        <Map />
      </div>
    </div>
  );
};

export default Dashboard;
