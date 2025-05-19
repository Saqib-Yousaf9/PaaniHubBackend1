import React, { useState, useEffect } from "react";

interface ForgotPasswordProps {
  onEmailSubmit: (email: string) => Promise<boolean>;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onEmailSubmit }) => {
  useEffect(() => {
    // Lock scroll when the component is mounted
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return () => {
      // Unlock scroll when the component is unmounted
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  const [email, setEmail] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const success = await onEmailSubmit(email);
      if (success) {
        setSuccessMessage(
          "If an account with that email exists, a password reset link has been sent."
        );
      } else {
        setErrorMessage(
          "There was an error sending the reset email. Please try again."
        );
      }
    } catch (error) {
      console.error("Password reset error:", error); // Log the error for debugging
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>
        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 p-4 mb-4 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 mb-4 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
