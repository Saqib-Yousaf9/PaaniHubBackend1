import React, { useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = React.useRef<Toast>(null);

  // Step 1: Request reset code
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/employee/forgot-password`,
        { email }
      );
      setMessage("A reset code has been sent to your email.");
      toast.current?.show({
        severity: "success",
        summary: "Reset Email Sent",
        detail: "Check your inbox for the reset code.",
        life: 4000,
      });
      setStep("verify");
    } catch (err) {
      setMessage("Failed to send reset email. Please try again.");
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Could not send reset email.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/employee/verify-reset-code`,
        { email, code }
      );
      setMessage("Code verified! You can now reset your password.");
      toast.current?.show({
        severity: "success",
        summary: "Code Verified",
        detail: "You can now reset your password.",
        life: 4000,
      });
      setStep("reset");
    } catch (err) {
      setMessage("Verification failed. Please check your code.");
      toast.current?.show({
        severity: "error",
        summary: "Verification Failed",
        detail: "Invalid code or server error.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/employee/reset-password`,
        { email, code, newPassword }
      );
      setMessage("Password reset successful! You can now log in.");
      toast.current?.show({
        severity: "success",
        summary: "Password Reset",
        detail: "Your password has been reset.",
        life: 4000,
      });
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err) {
      setMessage("Failed to reset password. Please try again.");
      toast.current?.show({
        severity: "error",
        summary: "Reset Failed",
        detail: "Could not reset password.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toast ref={toast} />
      <form
        onSubmit={
          step === "request"
            ? handleRequest
            : step === "verify"
            ? handleVerify
            : handleReset
        }
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Forgot Password
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Enter your email address
          </label>
          <InputText
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={step !== "request"}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
          />
        </div>
        {step !== "request" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Enter the code sent to your email
            </label>
            <InputText
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={step === "reset"}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        )}
        {step === "reset" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              New Password
            </label>
            <InputText
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        )}
        <Button
          type="submit"
          label={
            loading
              ? step === "request"
                ? "Sending..."
                : step === "verify"
                ? "Verifying..."
                : "Resetting..."
              : step === "request"
              ? "Send Reset Code"
              : step === "verify"
              ? "Verify Code"
              : "Reset Password"
          }
          className="w-full p-3 bg-blue-500 text-white rounded-lg"
          loading={loading}
          disabled={loading}
        />
        {message && (
          <div className="text-center mt-4 text-blue-600">{message}</div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
