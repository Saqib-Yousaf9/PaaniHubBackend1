import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const RootLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="relative h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bg-gradient-to-r from-blue-900 to-teal-700 text-white h-full transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "250px", zIndex: 50 }}
      >
        <div className="p-4 relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white transition-transform duration-300 ease-in-out transform hover:scale-110"
            onClick={handleSidebarToggle}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <h2 className="text-2xl font-bold">PaaniHub</h2>
          <nav className="mt-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/root/Profile"
                  className="text-lg transition-colors duration-300 hover:text-teal-300"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-lg transition-colors duration-300 hover:text-teal-300"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/root/Orders"
                  className="text-lg transition-colors duration-300 hover:text-teal-300"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/root/PlaceOrder"
                  className="text-lg transition-colors duration-300 hover:text-teal-300"
                >
                  Place Order
                </Link>
              </li>
              <li>
                <Link
                  to="/root/DriverSupport"
                  className="text-lg transition-colors duration-300 hover:text-teal-300"
                >
                  Driver Support
                </Link>
              </li>
              <li>
                <Link
                  to="/root/RatingReview"
                  className="text-lg transition-colors duration-300 hover:text-teal-300"
                >
                  Rating Review
                </Link>
              </li>
              <li>
                <Link
                  to="/root/Logout"
                  className="text-lg transition-colors duration-300 hover:text-teal-300"
                >
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          showSidebar ? "ml-[250px]" : "ml-0"
        }`}
      >
        {/* Top Navbar */}
        <nav className="bg-gradient-to-r from-blue-900 to-teal-700 text-white p-4 flex items-center justify-between">
          {/* Show button only when sidebar is not open */}
          {!showSidebar && (
            <button
              className="text-white transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={handleSidebarToggle}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          )}
          <div className="flex-grow text-center text-xl font-bold">
            PaaniHub
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/messages"
              className="text-white transition-transform duration-300 hover:scale-110"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
            <Link
              to="/notifications"
              className="text-white transition-transform duration-300 hover:scale-110"
            >
              <FontAwesomeIcon icon={faBell} />
            </Link>
            <Link
              to="/profile"
              className="text-white transition-transform duration-300 hover:scale-110"
            >
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="rounded-full"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-4 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
