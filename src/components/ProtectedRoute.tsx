import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Attempt to refresh token if access has expired
  const refreshToken = async (): Promise<boolean> => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!refresh) return false;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem(ACCESS_TOKEN, data.access);
      return true;
    } catch (error) {
      console.error("🔁 Token refresh error:", error);
      return false;
    }
  };

  // ✅ Validate or refresh access token
  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        const refreshed = await refreshToken();
        return refreshed;
      }

      return true;
    } catch (error) {
      console.error("⚠️ Token decode error:", error);
      return false;
    }
  };

  useEffect(() => {
    const authenticate = async () => {
      try {
        const valid = await checkAuth();
        setIsAuthenticated(valid);
      } catch (err) {
        console.error("Auth error:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-blue-950">
        <div className="animate-pulse text-lg">Verifying session...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
