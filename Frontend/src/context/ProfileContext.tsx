import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
// Define the Profile interface
export interface Profile {
  profileId: string;
  userId: string;
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
  role: "user" | "driver"; // Role field
}

// Define the context properties
interface ProfileContextProps {
  currentUser: Profile | null;
  updateProfile: (updatedInfo: Partial<Profile>) => void;
  updateRole: (role: "user" | "driver") => void;
  isProfileComplete: boolean; // New flag to check profile completeness
}

// Create the context
const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined
);

// Hook to use the ProfileContext
export const useProfile = (): ProfileContextProps => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const { isAuthenticated } = useAuth(); // Access isAuthenticated from AuthContext

  // Fetch profile data from the backend on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      if (isAuthenticated) {
        try {
          const response = await axios.get(
            `${
              process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
            }/api/employee/user-profile`,
            { withCredentials: true }
          );

          setCurrentUser(response.data);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated]);
  // Function to update the profile locally
  const updateProfile = (updatedInfo: Partial<Profile>) => {
    setCurrentUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...updatedInfo };
    });
  };

  // Function to update the role and send it to the backend
  const updateRole = async (role: "user" | "driver") => {
    if (!currentUser) return;

    try {
      // Update the role in the backend
      await axios.put(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/employee/update-profile`,
        { role },
        { withCredentials: true }
      );

      // If the backend update is successful, update it locally
      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        return { ...prevUser, role };
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  }; // Function to check if the profile is complete
  const isProfileComplete = (): boolean => {
    if (!currentUser) return false;

    // Define required fields based on role
    const requiredFields =
      currentUser.role === "driver"
        ? [
            "firstName",
            "lastName",
            "phoneNumber",
            "licenceNo",
            "carNo",
            "email",
            "city",
            "zipCode",
            "address",
            "gender",
          ]
        : ["firstName", "lastName", "email"];

    // Check if all required fields are present and not empty
    return requiredFields.every(
      (field) =>
        currentUser[field as keyof Profile] !== undefined &&
        currentUser[field as keyof Profile] !== ""
    );
  };

  return (
    <ProfileContext.Provider
      value={{
        currentUser,
        updateProfile,
        updateRole,
        isProfileComplete: isProfileComplete(),
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
