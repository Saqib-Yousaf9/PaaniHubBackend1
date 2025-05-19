import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const AuthLayout: React.FC = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (isSmallScreen) {
      document.body.style.overflow = isMenuOpen ? "hidden" : "";
      document.body.style.position = isMenuOpen ? "fixed" : "";
      document.body.style.width = isMenuOpen ? "100%" : "";
    }
  }, [isMenuOpen, isSmallScreen]);

  useEffect(() => {
    if (isSmallScreen) {
      setIsMenuOpen(false); // Close the sidebar when the route changes
    }
  }, [location, isSmallScreen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`bg-gradient-to-r from-blue-900 to-teal-700 p-4 ${
          isSmallScreen ? "fixed top-0 w-full z-50" : "relative"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-white text-2xl font-bold transition-transform duration-300 hover:scale-110"
          >
            PaaniHub
          </Link>
          {isSmallScreen ? (
            <>
              <button
                className="text-white transition-transform duration-300 hover:scale-110"
                onClick={toggleMenu}
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
              <div
                className={`fixed inset-0 left-0 bg-gradient-to-r from-blue-900 to-teal-700 p-4 z-40 transform ${
                  isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300`}
                style={{ width: "200px" }} // Adjust width for small screens
              >
                <button
                  className="absolute top-4 right-4 text-white transition-transform duration-300 hover:scale-110"
                  onClick={toggleMenu}
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
                <div className="text-white mt-8">
                  <ul className="space-y-4">
                    <li>
                      <Link
                        to="/login"
                        className="text-lg transition-colors duration-300 hover:text-teal-300"
                        onClick={toggleMenu}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="text-lg transition-colors duration-300 hover:text-teal-300"
                        onClick={toggleMenu}
                      >
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/forgot"
                        className="text-lg transition-colors duration-300 hover:text-teal-300"
                        onClick={toggleMenu}
                      >
                        Forget Password
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="space-x-4">
              <Link
                to="auth/login"
                className="text-white text-lg transition-colors duration-300 hover:text-teal-300"
              >
                Login
              </Link>
              <Link
                to="auth//register"
                className="text-white text-lg transition-colors duration-300 hover:text-teal-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Outlet /> {/* Renders the child routes (Signin, Signup, etc.) */}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
