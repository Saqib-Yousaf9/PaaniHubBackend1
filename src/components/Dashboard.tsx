import React, { useState, useEffect } from "react";

import ListOrders from "./ListOrders";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Map from "./newMap";
const Dashboard: React.FC = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // useEffect(() => {
  //   if (!loading && !isAuthenticated) {
  //     navigate("/login"); // Redirect to login if not authenticated
  //   }
  // }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center text-gray-600">
        Please log in to view this page
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {userRole === "user" ? (
          <Map />
        ) : userRole === "driver" ? (
          <ListOrders />
        ) : (
          <div className="text-center text-gray-600">Role not recognized</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
