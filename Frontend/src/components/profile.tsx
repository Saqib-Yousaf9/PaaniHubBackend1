import React, { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import { Skeleton } from "primereact/skeleton"; // Import PrimeReact Skeleton

interface Profile {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  city?: string;
  zipCode?: string;
  address?: string;
  licenceNo?: string;
  carNo?: string;
  gender?: string;
  picture?: File | null;
  [key: string]: any;
}

const keyframes = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`;

const ProfileForm: React.FC = () => {
  const { currentUser, updateProfile } = useProfile();
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Profile>>({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    zipCode: "",
    address: "",
    phoneNumber: "",
    licenceNo: "",
    carNo: "",
    gender: "",
    picture: null,
  });
  const [loading, setLoading] = useState(true); // Loading state for skeletons
  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit and view mode

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `${
              process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
            }/api/employee/user-profile`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data: Profile = await response.json();
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            city: data.city || "",
            zipCode: data.zipCode || "",
            address: data.address || "",
            phoneNumber: data.phoneNumber || "",
            licenceNo: data.licenceNo || "",
            carNo: data.carNo || "",
            gender: data.gender || "",
            picture: data.picture || null,
          });
          setLoading(false); // Data is fetched, stop loading
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false); // Stop loading on error
        }
      };

      fetchUserData();
    }, 100);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({ ...prevData, picture: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, formData[key] as any);
      }
    }

    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/employee/update-profile`,
        {
          method: "PUT",
          body: formDataToSend,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Profile updated successfully:", result);
      setIsEditing(false); // Exit edit mode on successful update
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Inline styles for animations
  const formStyle = {
    animation: "fadeIn 1s ease-in",
  };

  const inputStyle = {
    animation: "slideIn 0.5s ease-in-out",
  };

  return (
    <>
      <style>{keyframes}</style>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl mx-4 md:mx-8"
          style={formStyle}
        >
          <div className="flex justify-center mb-8 relative">
            <div
              className={`w-32 h-32 border-2 border-gray-300 rounded-full ${
                isHovering ? "bg-gray-200" : "bg-gray-100"
              } relative flex items-center justify-center overflow-hidden`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {formData.picture ? (
                <img
                  src={
                    typeof formData.picture === "string"
                      ? formData.picture
                      : URL.createObjectURL(formData.picture)
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Picture
                </div>
              )}
              {isHovering && isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full cursor-pointer">
                  <input
                    type="file"
                    id="picture"
                    name="picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="picture"
                    className="text-white text-xs font-semibold bg-gray-600 px-2 py-1 rounded"
                  >
                    Upload Picture
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {loading ? (
              <>
                {/* Render Skeleton Loaders */}
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
                <Skeleton className="col-span-1" height="3rem" />
              </>
            ) : (
              <>
                {/* Render Actual Form Fields */}
                <div className="col-span-1">
                  <label
                    htmlFor="firstName"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    readOnly={true}
                    style={inputStyle}
                    onMouseEnter={() => setHoveredField("email")}
                    onMouseLeave={() => setHoveredField(null)}
                  />
                  {hoveredField === "firstName" && (
                    <div className="absolute -top-8 left-0 bg-gray-700 text-white text-xs p-2 rounded-md">
                      You cannot edit this
                    </div>
                  )}{" "}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    readOnly={true}
                    style={inputStyle}
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.email || ""}
                    onChange={handleChange}
                    readOnly={true}
                    style={inputStyle}
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="city"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.city || ""}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={inputStyle}
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="zipCode"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.zipCode || ""}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={inputStyle}
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="address"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.address || ""}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={inputStyle}
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={inputStyle}
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="licenceNo"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    Licence Number
                  </label>
                  <input
                    type="text"
                    id="licenceNo"
                    name="licenceNo"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.licenceNo || ""}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={inputStyle}
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="carNo"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    Car Number
                  </label>
                  <input
                    type="text"
                    id="carNo"
                    name="carNo"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.carNo || ""}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    style={inputStyle}
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="gender"
                    className="block text-gray-700 text-sm font-medium mb-2 capitalize"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={inputStyle}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between items-center">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileForm;
