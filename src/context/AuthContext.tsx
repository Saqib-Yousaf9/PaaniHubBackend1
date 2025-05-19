import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>; // Updated to async for consistency
  register: (formData: FormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/employee/protected",
          { withCredentials: true }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserRole(response.data.role || "driver"); // Use actual role if available
        }
      } catch (error) {
        console.error("Session check failed", error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/employee/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUserRole(response.data.role || "driver"); // Use actual role if available
      }
    } catch (error) {
      console.error("Login failed", error);
      setIsAuthenticated(false);
      throw new Error("Login failed. Please check your email and password.");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/employee/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      console.error("Logout failed", error);
      throw new Error("Logout failed. Please try again.");
    }
  };

  const register = async (formData: FormData) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/employee/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        console.log("Registration successful");
      }
    } catch (error) {
      console.error("Registration failed", error);
      throw new Error("Registration failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
