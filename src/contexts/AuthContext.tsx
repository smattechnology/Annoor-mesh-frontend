"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // update this path based on your file structure

// Define your user structure
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

// Context value interface
interface AuthContextType {
  user: User | null;
  logout: () => void;
  getAuth: () => void;
  isLoading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch current user using credentials (cookies)
  const getAuth = async () => {
    try {
      setIsLoading(true);

      const res = await api.get("/auth/");
      setUser(res.data.client);
    } catch (err) {
      setUser(null); // user not authenticated or request failed
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);

      const res = await api.get("/auth/logout");
      console.log("Logout success:", res.data?.message || res.data);

      setUser(null);
      router.push("/auth");
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, getAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy context use
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
