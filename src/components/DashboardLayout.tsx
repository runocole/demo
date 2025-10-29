import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { LogOut } from "lucide-react";
import { Button } from "../components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simple logout handler
  const handleLogout = () => {
    // Clear any stored user/session data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-gray-100">
        {/* Sidebar */}
        <AppSidebar isOpen={isSidebarOpen} />

        {/* Main area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          {/* Header */}
          <header className="h-16 border-b border-gray-700 bg-[#1E293B]/70 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
              <h1 className="text-lg font-semibold text-white tracking-wide">
                Inventory Management
              </h1>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full text-gray-300 hover:text-white hover:bg-gray-700/40 transition"
              title="Log out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
