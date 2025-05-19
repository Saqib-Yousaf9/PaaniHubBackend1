import React from "react";
import axios from "axios";
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
import { AuthProvider, useAuth } from "./context/AuthContext";
import Logout from "./components/Logout";

const App: React.FC = () => {
  const handleEmailSubmit = async (email: string): Promise<boolean> => {
    console.log("Email submitted:", email);
    return true;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes under AuthLayout */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/auth/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="forgot"
              element={<ForgotPassword onEmailSubmit={handleEmailSubmit} />}
            />
          </Route>

          {/* Protected Routes under RootLayout */}
          <Route path="/" element={<RootLayout />}>
            <Route
              path="home"
              element={<ProtectedRoute component={<Home />} />}
            />

            <Route
              path="admin"
              element={<ProtectedRoute component={<Index />} />}
            />
            <Route
              path="root/Logout"
              element={<ProtectedRoute component={<Logout />} />}
            />
            <Route
              path="dashboard"
              element={<ProtectedRoute component={<Dashboard />} />}
            />
          </Route>

          {/* Catch-all Route for undefined paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const ProtectedRoute: React.FC<{ component: JSX.Element }> = ({
  component,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optional: Show a loading spinner or similar
  }

  return isAuthenticated ? component : <Navigate to="/login" />;
};
export default App;
