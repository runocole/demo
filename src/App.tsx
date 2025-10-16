import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/StaffDashboard"; // Staff dashboard
import Tools from "./pages/Tools";
import Payments from "./pages/Payments";
import StaffPage from "./pages/StaffPage";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import SalesPage from "./pages/SalesPage";
import AdminDashboard from "./pages/DashboardPage";

const queryClient = new QueryClient();

// ✅ Secure route wrapper
interface PrivateRouteProps {
  element: React.ReactElement;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const token = localStorage.getItem("access");
  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Role-based restriction
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect user to their home dashboard
    if (role === "admin") return <Navigate to="/dashboard" replace />;
    if (role === "staff") return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return element;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* --- Public --- */}
          <Route path="/login" element={<Login />} />

          {/* --- Staff Routes --- */}
          <Route
            path="/staff/dashboard"
            element={
              <PrivateRoute
                element={<Dashboard />}
                allowedRoles={["staff", "admin"]}
              />
            }
          />
          <Route
            path="/tools"
            element={
              <PrivateRoute
                element={<Tools />}
                allowedRoles={["staff", "admin"]}
              />
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute
                element={<Payments />}
                allowedRoles={["staff", "admin"]}
              />
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute
                element={<StaffPage />}
                allowedRoles={["staff", "admin"]}
              />
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute
                element={<SalesPage />}
                allowedRoles={["staff", "admin"]}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute
                element={<Settings />}
                allowedRoles={["staff", "admin"]}
              />
            }
          />

          {/* --- Admin Routes --- */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />

          {/* --- Default redirect --- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
