
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  email: string;
  name?: string;
  businessName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check for stored auth on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("cerebroUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - would connect to Firebase in production
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // This is a mock implementation - replace with actual Firebase Auth
      if (email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo, create a mock user
        const mockUser = {
          id: "user-" + Math.random().toString(36).substring(2, 9),
          email,
          name: email.split('@')[0]
        };
        
        setUser(mockUser);
        localStorage.setItem("cerebroUser", JSON.stringify(mockUser));
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        throw new Error("Email and password are required");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // This is a mock implementation - replace with actual Firebase Auth
      if (email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo, create a mock user
        const mockUser = {
          id: "user-" + Math.random().toString(36).substring(2, 9),
          email,
          name
        };
        
        setUser(mockUser);
        localStorage.setItem("cerebroUser", JSON.stringify(mockUser));
        toast.success("Account created successfully");
        navigate("/onboarding");
      } else {
        throw new Error("All fields are required");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("cerebroUser", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully");
        return Promise.resolve();
      }
      return Promise.reject("No user logged in");
    } catch (error) {
      toast.error("Failed to update profile");
      return Promise.reject(error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cerebroUser");
    toast.info("Logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
