import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = React.useRef<Toast>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/employee/verify-email`,
        { email, code }
      );
      setMessage("Email verified! You can now log in.");
      toast.current?.show({
        severity: "success",
        summary: "Verified",
        detail: "Your email has been verified. Please log in.",
        life: 3000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Verification failed. Please check your code.");
      toast.current?.show({
        severity: "error",
        summary: "Verification Failed",
        detail: "Invalid code or server error.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-2">
      <Toast ref={toast} />
      <Card
        title={
          <div className="text-center text-2xl font-bold text-blue-700 mb-2">
            Email Verification
          </div>
        }
        subTitle={
          <div className="text-center text-gray-500 text-base mb-4">
            Enter the verification code sent to your email
          </div>
        }
        className="w-full max-w-md rounded-2xl shadow-xl border border-blue-100"
      >
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Email
            </label>
            <InputText
              value={email}
              disabled
              className="w-full p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-100 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Verification Code
            </label>
            <InputText
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              required
              className="w-full p-3 border border-gray-200 rounded-lg shadow-sm"
            />
          </div>
          <Button
            type="submit"
            label={loading ? "Verifying..." : "Verify"}
            icon="pi pi-check"
            className="w-full p-3 bg-blue-600 border-0 text-white rounded-lg text-base font-semibold shadow hover:bg-blue-700 transition"
            loading={loading}
            disabled={loading}
          />
          {message && (
            <div
              className={`text-center mt-2 text-base font-medium ${
                message.includes("verified") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default VerifyEmail;
