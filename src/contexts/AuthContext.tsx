"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
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
  // Fetch current user using token from localStorage
  const getAuth = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("https://api.nuraloom.xyz/auth/", {
        method: "GET", // or "POST" if needed
        credentials: "include", // 👈 this includes cookies in cross-origin requests
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUser(data.client);
    } catch (err: any) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  // Logout function (remove token & user)
  const logout = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("https://api.nuraloom.xyz/auth/logout", {
        method: "GET",
        credentials: "include", // 👈 include cookies
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // Optionally read the server response
      const data = await res.json();
      console.log("Logout success:", data.message || data);

      // Clear user from context/state
      setUser(null);

      // Optional: Redirect to login page
      router.push("/auth");
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null); // Make sure to clear state even on error
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
