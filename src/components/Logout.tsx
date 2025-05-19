import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout(); // Call the logout method from AuthContext
        navigate("/login"); // Redirect to login page after successful logout
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Logging out...
        </h2>
      </div>
    </div>
  );
};

export default Logout;
