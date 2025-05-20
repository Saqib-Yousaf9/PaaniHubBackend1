import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const toast = React.useRef<Toast>(null);
  const navigate = useNavigate();

  // Registration handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      email,
      password,
      firstName,
      lastName,
    };

    try {
      await axios.post(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/employee/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      setVerificationStep(true);
      toast.current?.show({
        severity: "info",
        summary: "Check your email",
        detail: "A verification code has been sent to your email.",
        life: 4000,
      });
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  // Verification handler (unchanged)
  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/employee/verify-email`,
        { email, code: verificationCode }
      );
      toast.current?.show({
        severity: "success",
        summary: "Email Verified",
        detail: "Your email has been verified. Please log in.",
        life: 3000,
      });
      navigate("/auth/login");
    } catch (error) {
      setError("Verification failed. Please check your code and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Toast ref={toast} />
      {!verificationStep ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-0"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Register
          </h2>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <div className="mb-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 mb-2 text-sm font-medium"
                >
                  First Name
                </label>
                <InputText
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 mb-2 text-sm font-medium"
                >
                  Last Name
                </label>
                <InputText
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 mb-2 text-sm font-medium"
              >
                Email
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 mb-2 text-sm font-medium"
              >
                Password
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                feedback={false}
              />
            </div>
          </div>
          <Button
            type="submit"
            label="Register"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </form>
      ) : (
        <form
          onSubmit={handleVerify}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-0"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Verify Email
          </h2>
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-gray-700 mb-2 text-sm font-medium"
            >
              Verification Code
            </label>
            <InputText
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            label="Verify Email"
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          />
        </form>
      )}
    </div>
  );
};

export default Register;
