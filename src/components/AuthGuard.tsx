
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      const isLoggedIn = !!user;
      
      // If auth is required and user is not logged in, redirect to login
      if (requireAuth && !isLoggedIn) {
        navigate("/login", { state: { from: location.pathname } });
        return;
      }
      
      // If auth is not required and user is logged in, redirect to dashboard
      // This is for pages like login/signup that shouldn't be accessible when logged in
      if (!requireAuth && isLoggedIn) {
        navigate("/dashboard");
        return;
      }
    }
  }, [user, loading, requireAuth, navigate, location]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cerebro-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cerebro-purple border-t-transparent"></div>
          <p className="text-cerebro-soft">Loading...</p>
        </div>
      </div>
    );
  }

  // Show children if auth state is correct for this route
  if ((requireAuth && user) || (!requireAuth && !user) || !requireAuth) {
    return <>{children}</>;
  }

  // This should never happen due to the redirect in useEffect
  return null;
};

export default AuthGuard;
