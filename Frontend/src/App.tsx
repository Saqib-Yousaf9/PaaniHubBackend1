import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./components/Login";
import Register from "./components/Registration";
import ForgotPassword from "./components/forgot";
import Home from "./components/Home";
import Index from "./components/Users/index";
import Dashboard from "./components/Dashboard";
import RootLayout from "./Layouts/RootLayout";

import ComplaintTracker from "./components/ComplaintTracker";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Logout from "./components/Logout";
import { ProfileProvider } from "./context/ProfileContext";
import ProfileForm from "./components/profile";
import { PrimeReactProvider } from "primereact/api";
import Map from "./components/PlaceOrder";
import Order from "./components/Order";
import OrderReviewsPage from "./components/review";
import DriverSupport from "./components/DriverSupport";
import ChatWithUs from "./components/ChatWithUs";
import VerifyEmail from "./components/VerifyEmail";
import AllOrders from "./components/AllOrders";
const App: React.FC = () => {
  const handleEmailSubmit = async (email: string): Promise<boolean> => {
    console.log("Email submitted:", email);
    return true;
  };

  return (
    <PrimeReactProvider>
      <AuthProvider>
        <ProfileProvider>
          <Router>
            <Routes>
              {/* Public Routes under AuthLayout */}
              <Route path="/" element={<Home />} />
              <Route path="/auth/" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Protected Routes under RootLayout */}
              <Route path="/root/" element={<RootLayout />}>
                <Route
                  path="home"
                  element={<ProtectedRoute component={<Home />} />}
                />
                <Route
                  path="admin"
                  element={<ProtectedRoute component={<Index />} />}
                />
                <Route
                  path="profile"
                  element={<ProtectedRoute component={<ProfileForm />} />}
                />
                <Route
                  path="logout"
                  element={<ProtectedRoute component={<Logout />} />}
                />
                <Route
                  path="order"
                  element={<ProtectedRoute component={<Order />} />}
                />
                <Route
                  path="dashboard"
                  element={<ProtectedRoute component={<Dashboard />} />}
                />
                <Route
                  path="DriverSupport"
                  element={<ProtectedRoute component={<DriverSupport />} />}
                />
                <Route
                  path="OrderReviews"
                  element={<ProtectedRoute component={<OrderReviewsPage />} />}
                />

                <Route
                  path="ChatWithUs"
                  element={<ProtectedRoute component={<ChatWithUs />} />}
                />

                <Route
                  path="ComplaintTracker"
                  element={<ProtectedRoute component={<ComplaintTracker />} />}
                />

                <Route
                  path="AllOrders"
                  element={<ProtectedRoute component={<AllOrders />} />}
                />
              </Route>

              {/* Catch-all Route for undefined paths */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </ProfileProvider>
      </AuthProvider>
    </PrimeReactProvider>
  );
};

const ProtectedRoute: React.FC<{ component: JSX.Element }> = ({
  component,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optional: Show a loading spinner or similar
  }

  return isAuthenticated ? component : <Navigate to="/auth/login" />;
};

export default App;
