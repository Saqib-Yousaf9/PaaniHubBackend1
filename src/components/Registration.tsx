import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register: React.FC = () => {
  const { register } = useAuth(); // Get register method from AuthContext

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [licenceNo, setLicenceNo] = useState<string>("");
  const [carNo, setCarNo] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [picture, setPicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("city", city);
    formData.append("zipCode", zipCode);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);
    formData.append("licenceNo", licenceNo);
    formData.append("carNo", carNo);
    formData.append("gender", gender);
    if (picture) {
      formData.append("picture", picture);
    }

    try {
      await register(formData); // Call register from AuthContext
      console.log("Registration successful");
      // Optionally navigate to a different page or show success message
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data || "Registration failed. Please try again."
        );
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPicture(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mt-5"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Register
        </h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-6">
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

        <div className="mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <label
              htmlFor="firstName"
              className="block text-gray-700 font-medium mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="lastName"
              className="block text-gray-700 font-medium mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="address"
            className="block text-gray-700 font-medium mb-1"
          >
            Street Address
          </label>
          <input
            type="text"
            id="address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <label
              htmlFor="city"
              className="block text-gray-700 font-medium mb-1"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="zipCode"
              className="block text-gray-700 font-medium mb-1"
            >
              Postal / Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 font-medium mb-1"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="licenceNo"
            className="block text-gray-700 font-medium mb-1"
          >
            License Number
          </label>
          <input
            type="text"
            id="licenceNo"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={licenceNo}
            onChange={(e) => setLicenceNo(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="carNo"
            className="block text-gray-700 font-medium mb-1"
          >
            Car Number
          </label>
          <input
            type="text"
            id="carNo"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={carNo}
            onChange={(e) => setCarNo(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="gender"
            className="block text-gray-700 font-medium mb-1"
          >
            Gender
          </label>
          <select
            id="gender"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="picture"
            className="block text-gray-700 font-medium mb-1"
          >
            Profile Picture
          </label>
          <input
            type="file"
            id="picture"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handlePictureChange}
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
