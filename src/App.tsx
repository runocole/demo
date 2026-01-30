import React from "react";
import axios from "axios";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from './hooks/useAuth';
import DashboardStaff from "./pages/StaffDashboard"; // Staff dashboard
import Tools from "./pages/Tools";
import Payments from "./pages/Payments";
import StaffPage from "./pages/StaffPage";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import SalesPage from "./pages/SalesPage";
import AdminDashboard from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import ToolsSummary from "./pages/ToolsSummary";
import AdminSalesPage from "./pages/AdminSalesPage";
import LandingPage from "./pages/LandingPage";
import CustomerOwing from "./pages/CustomerOwing";
import StaffSalesPage from "./pages/StaffSalesPage";
import BuyNow from "./pages/BuyNow";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Training from "./pages/Training";
import CorsNetwork from "./pages/CorsNetwork";
import CourseDetail from "./pages/CourseDetail";
import CartPage from "./pages/CartPage";
import ProductDemo from "./pages/ProductDemo";
import ProductSupport from "./pages/ProductSupport";
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext'; 
import ProductDetailPage from "./pages/ProductDetailPage";
import MobileNavigation from "./components/MobileNavigation"; 
import Header from "./components/Header"; 
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import StaffLogin from "./pages/StaffLogin";
import { StaffLayout } from "./components/staff/StaffLayout";
import Dashboard from "./pages/staff/Dashboard";
import PostsList from "./pages/staff/PostsList";
import PostEditor from "./pages/staff/PostEditor";
import OrderConfirmation from "./pages/OrderConfirmation";

const queryClient = new QueryClient();
axios.defaults.withCredentials = true;

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
    if (role === "customer") return <Navigate to="/customer/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return element;
};
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard') || 
                       location.pathname.startsWith('/admin') || 
                       location.pathname.startsWith('/staff') ||
                       location.pathname.startsWith('/blog/dashboard')
                       location.pathname.startsWith('/tools') ||
                       location.pathname.startsWith('/payments') ||
                       location.pathname.startsWith('/settings') ||
                       location.pathname.startsWith('/sales') ||
                       location.pathname.startsWith('/customers');
                       location.pathname.startsWith('/order-confirmation');
  
  return (
    <>
      {/* Show main Header only on public website pages, excluding admin routes */}
      {!isAdminRoute && <Header />}
      
      {children}
      
      {/* Show MobileNavigation only on public website pages, excluding admin routes */}
      {!isAdminRoute && <MobileNavigation />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout>
                <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />

                {/* --- Staff Routes --- */}
                <Route
                  path="/staff/dashboard"
                  element={
                    <PrivateRoute
                      element={<DashboardStaff />}
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
                  path="/tools-summary"
                  element={
                    <PrivateRoute
                      element={<ToolsSummary />}
                      allowedRoles={["staff", "admin"]}
                    />
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <PrivateRoute
                      element={<StaffPage />}
                      allowedRoles={["staff", "admin"]}
                    />
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <PrivateRoute
                      element={<CustomersPage />}
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
                <Route
                  path="/customer/owing"
                  element={
                    <PrivateRoute
                      element={<CustomerOwing />}
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
                <Route
                  path="/admin/sales"
                  element={ 
                    <PrivateRoute
                      element={<AdminSalesPage />}
                      allowedRoles={["admin"]}
                    />
                  }
                />
                
                {/* --- Public Website Routes --- */}
                <Route path="/about" element={<About />} />
                <Route path="/training" element={<Training />} />
                <Route path="/corsnetwork" element={<CorsNetwork />} />
                <Route path="/buynow" element={<BuyNow />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/product-demo" element={<ProductDemo />} />
                <Route path="/product-support" element={<ProductSupport />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/staff/login" element={<StaffLogin />} />
                <Route path="/staff" element={<StaffLayout />}/>
                <Route path="/blog/dashboard" element={<Dashboard />} />
                <Route path="/staff/posts" element={<PostsList />} />
                <Route path="/staff/posts/new" element={<PostEditor />} />
                <Route path="/staff/posts/:id/edit" element={<PostEditor />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                {/* --- Public Course Route --- */}
                <Route path="/course/:courseId" element={<CourseDetail />} />
                
                {/* --- Staff Sales Route --- */}
                <Route path="/sales/staff/:staffId" element={<StaffSalesPage />} />

                {/* --- Fallback redirect --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;