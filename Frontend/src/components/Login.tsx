import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Messages } from "primereact/messages";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const msgs = useRef<Messages>(null);
  const toast = useRef<Toast>(null); // Reference to Toast

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        navigate("/root/dashboard");
      }, 1000); // Delay the navigation for 1 second after authentication
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      if (toast.current) {
        toast.current.show({
          severity: "success",
          summary: "Login Successful",
          detail: "You have logged in successfully.",
          life: 3000,
        });
      }
      setTimeout(() => {
        navigate("/root/dashboard");
      }, 3000);
    } catch (err: any) {
      // Check for unverified email error
      if (
        err.response &&
        err.response.status === 403 &&
        err.response.data?.message?.includes("verify your email")
      ) {
        setError("Please verify your email before logging in.");
        setTimeout(() => {
          navigate("/auth/verify-email", { state: { email } }); // Pass email to verification page
        }, 2000);
      } else {
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Login Failed",
            detail: "Invalid email or password.",
            life: 3000,
          });
        }
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toast ref={toast} position="top-center" /> {/* Toast component */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <Messages ref={msgs} className="custom-messages" />
        {isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Login
          </h2>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <div className="text-center mt-2">
            <Link
              to="/auth/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
