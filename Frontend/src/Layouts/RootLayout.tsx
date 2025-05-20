import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faList,
  faEnvelope,
  faBell,
  faMapMarkerAlt,
  faHeadset,
  faStar,
  faSignInAlt,
  faUserPlus,
  faUserCircle,
  faShoppingCart,
  faSignOutAlt,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { useProfile } from "../context/ProfileContext";

const RootLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { currentUser, updateRole } = useProfile(); // Get currentUser and updateRole from context
  const [userRole, setUserRole] = useState<"user" | "driver" | null>(null);
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [showNotificationMenu, setshowNotificationMenu] = useState(false);
  useEffect(() => {
    if (currentUser?.role) {
      setUserRole(currentUser.role); // Set the role based on the currentUser
    }
  }, [currentUser]);

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  // Toggle role and send the update to the backend
  const handleRoleToggle = async () => {
    const newRole = userRole === "user" ? "driver" : "user";
    setUserRole(newRole);
    try {
      await updateRole(newRole);
      // Update role in the backend
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/root/Logout");
  };
  const toggleMessageMenu = () => {
    setshowNotificationMenu(false);
    setShowMessageMenu((prevState) => !prevState); // Toggle message menu visibility
  };
  const toggleNotificationMenu = () => {
    setShowMessageMenu(false);
    setshowNotificationMenu((prevState) => !prevState); // Toggle notification menu visibility
  };

  const closeMessageMenu = () => {
    setShowMessageMenu(false); // Close message menu
  };
  const closeNotificationMenu = () => {
    setshowNotificationMenu(false); //
  };
  useEffect(() => {
    if (currentUser?.picture instanceof File) {
      try {
        const objectURL = URL.createObjectURL(currentUser.picture);
        setProfilePicURL(objectURL);

        return () => {
          URL.revokeObjectURL(objectURL);
        };
      } catch (error) {
        console.error("Error creating object URL:", error);
        setProfilePicURL(null);
      }
    } else if (typeof currentUser?.picture === "string") {
      setProfilePicURL(currentUser.picture);
    } else {
      setProfilePicURL(null);
    }
  }, [currentUser?.picture]);

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}

      <div
        className={`fixed top-0 left-0 bg-gradient-to-r from-blue-900 to-teal-700 text-white h-full transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "250px", zIndex: 50 }}
      >
        <div className="p-4 relative h-full flex flex-col justify-between">
          {/* Sidebar Top */}

          <div>
            {/* Close Button */}
            <button
              aria-label="Close sidebar"
              title="Close sidebar"
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
                {userRole === "driver"
                  ? [
                      {
                        label: "Dashboard",
                        to: "/root/dashboard",
                        icon: faHome,
                      },
                      {
                        label: "Profile",
                        to: "/root/profile",
                        icon: faUserCircle,
                      },
                      {
                        label: "Running Order",
                        to: "/root/order",
                        icon: faShoppingCart,
                      },
                      {
                        label: "Orders",
                        to: "/root/AllOrders",
                        icon: faList,
                      },
                      {
                        label: "Driver Support",
                        to: "/root/DriverSupport",
                        icon: faHeadset,
                      },
                      {
                        label: "Rating Review",
                        to: "/root/OrderReviews",
                        icon: faStar,
                      },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="text-lg flex items-center space-x-2 transition-colors duration-300 hover:text-teal-300"
                        >
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="w-5 h-5"
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))
                  : userRole === "user"
                  ? [
                      {
                        label: "Profile",
                        to: "/root/profile",
                        icon: faUserCircle,
                      },
                      {
                        label: "Dashboard",
                        to: "/root/dashboard",
                        icon: faHome,
                      },
                      { label: "Orders", to: "/root/order", icon: faList },
                      {
                        label: "Place Order",
                        to: "/root/placeOrder",
                        icon: faShoppingCart,
                      },
                      {
                        label: "Chat with Us",
                        to: "/root/ChatWithUs",
                        icon: faHeadset,
                      },

                      {
                        label: "Complaint Tracker",
                        to: "/root/ComplaintTracker",
                        icon: faClipboardList,
                      },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="text-lg flex items-center space-x-2 transition-colors duration-300 hover:text-teal-300"
                        >
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="w-5 h-5"
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))
                  : [
                      { label: "Login", to: "/login", icon: faSignInAlt },
                      { label: "Register", to: "/register", icon: faUserPlus },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="text-lg flex items-center space-x-2 transition-colors duration-300 hover:text-teal-300"
                        >
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="w-5 h-5"
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                <li>
                  <button
                    onClick={handleRoleToggle}
                    className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon
                      icon={userRole === "user" ? faSignOutAlt : faSignInAlt}
                      className="w-5 h-5"
                    />
                    <span>{userRole === "user" ? "Driver" : "User"} Mode</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Sidebar Bottom - Logout Button */}
          <div>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          showSidebar ? "ml-[250px]" : "ml-0"
        }`}
      >
        {/* Top Navbar */}
        <nav className="bg-gradient-to-r from-blue-900 to-teal-700 text-white p-4 flex items-center justify-between  ">
          {!showSidebar && (
            <button
              aria-label="Open sidebar"
              title="Open sidebar"
              className="text-white transition-transform duration-300 hover:scale-110"
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
            {/* Messages */}
            <div className="relative">
              <button
                className="text-white transition-transform duration-300 hover:scale-110"
                onClick={toggleMessageMenu}
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </button>

              {showMessageMenu && (
                <div
                  className="absolute top-10 right-0 w-64 bg-white text-gray-700 transition-transform duration-200 shadow-lg rounded-lg z-50 border border-gray-200"
                  onMouseLeave={closeMessageMenu}
                >
                  <h2 className="font-medium text-lg px-4 py-2 border-b bg-gray-50 text-gray-600">
                    Messages
                  </h2>
                  <ul className="p-2 space-y-2">
                    <li className="hover:bg-blue-50 px-4 py-2 rounded-md cursor-pointer flex items-center">
                      <span className="font-semibold mr-2">John:</span>
                      "Your appointment is confirmed!"
                    </li>
                    <li className="hover:bg-blue-50 px-4 py-2 rounded-md cursor-pointer flex items-center">
                      <span className="font-semibold mr-2">Admin:</span>
                      "System update scheduled."
                    </li>
                    <li className="hover:bg-blue-50 px-4 py-2 rounded-md cursor-pointer flex items-center">
                      <span className="font-semibold mr-2">Driver:</span>
                      "Your order is ready!"
                    </li>
                    <li className="hover:bg-blue-50 px-4 py-2 rounded-md cursor-pointer flex items-center">
                      <span className="font-semibold mr-2">Support:</span>
                      "Contact us for assistance."
                    </li>
                  </ul>
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-b-lg hover:bg-blue-700 transition-colors duration-200"
                    onClick={closeMessageMenu}
                  >
                    View All
                  </button>
                </div>
              )}
            </div>

            <button
              className="text-white transition-transform duration-300 hover:scale-110"
              onClick={toggleNotificationMenu}
            >
              <FontAwesomeIcon icon={faBell} />
            </button>
            {showNotificationMenu && (
              <div
                className="absolute top-10 right-0 w-80 bg-white text-gray-800 transition-transform duration-200 shadow-xl rounded-lg z-50 border border-gray-300"
                onMouseLeave={closeNotificationMenu}
              >
                <h2 className="font-semibold text-lg px-5 py-3 border-b bg-gray-100 text-gray-700">
                  Notification
                </h2>
                <ul className="p-4 space-y-3">
                  <li className="hover:bg-gray-50 px-4 py-3 rounded-md cursor-pointer flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 text-blue-600 w-10 h-10 flex items-center justify-center rounded-full font-bold">
                      BK
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Booking #12345</p>
                      <p className="text-sm text-gray-500">
                        "Your tanker is scheduled for 10:00 AM tomorrow."
                      </p>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                  </li>
                  <li className="hover:bg-gray-50 px-4 py-3 rounded-md cursor-pointer flex items-start">
                    <div className="flex-shrink-0 bg-green-100 text-green-600 w-10 h-10 flex items-center justify-center rounded-full font-bold">
                      PM
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Payment Received</p>
                      <p className="text-sm text-gray-500">
                        "Payment for Booking #12344 has been confirmed."
                      </p>
                      <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                  </li>
                  <li className="hover:bg-gray-50 px-4 py-3 rounded-md cursor-pointer flex items-start">
                    <div className="flex-shrink-0 bg-yellow-100 text-yellow-600 w-10 h-10 flex items-center justify-center rounded-full font-bold">
                      DR
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Driver Assigned</p>
                      <p className="text-sm text-gray-500">
                        "Driver Ali has been assigned to your booking #12343."
                      </p>
                      <span className="text-xs text-gray-400">3 days ago</span>
                    </div>
                  </li>
                  <li className="hover:bg-gray-50 px-4 py-3 rounded-md cursor-pointer flex items-start">
                    <div className="flex-shrink-0 bg-red-100 text-red-600 w-10 h-10 flex items-center justify-center rounded-full font-bold">
                      CN
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Cancellation Notice</p>
                      <p className="text-sm text-gray-500">
                        "Booking #12342 has been canceled due to
                        unavailability."
                      </p>
                      <span className="text-xs text-gray-400">5 days ago</span>
                    </div>
                  </li>
                </ul>
                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-b-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={closeNotificationMenu}
                >
                  View All Notification
                </button>
              </div>
            )}
            <button
              aria-label="Profile"
              title="Profile"
              onClick={() => navigate("/root/profile")}
              className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
            >
              {profilePicURL ? (
                <div
                  style={{ backgroundImage: `url(${profilePicURL})` }}
                  className="w-full h-full bg-cover bg-center"
                ></div>
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="w-full h-full text-gray-300"
                />
              )}
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
