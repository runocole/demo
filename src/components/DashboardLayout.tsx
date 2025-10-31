import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Bell, LogOut, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useNotifications } from "../hooks/useNotifications";
import type { Notification, Tool } from "../hooks/useNotifications";

interface DashboardLayoutProps {
  children: React.ReactNode;
  tools?: Tool[];
  onNotificationClick?: (notification: Notification) => void;
}

// --------------------
// NOTIFICATION BELL COMPONENT
// --------------------
interface NotificationBellProps {
  notificationState: {
    notifications: Notification[];
    unreadCount: number;
    showDropdown: boolean;
  };
  onToggle: () => void;
  onMarkAllRead: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  notificationState, 
  onToggle, 
  onMarkAllRead, 
  onNotificationClick 
}) => (
  <div className="relative">
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="rounded-full text-gray-300 hover:text-white hover:bg-gray-700/40 transition relative"
      title="Notifications"
    >
      <Bell className="h-5 w-5" />
      {notificationState.unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
          {notificationState.unreadCount > 9 ? '9+' : notificationState.unreadCount}
        </span>
      )}
    </Button>

    {/* Notification Dropdown */}
    {notificationState.showDropdown && (
      <div className="absolute right-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
        <div className="p-3 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold">Alerts</h3>
          {notificationState.unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-80">
          {notificationState.notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              No alerts at this time
            </div>
          ) : (
            notificationState.notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 border-b border-slate-700 cursor-pointer hover:bg-slate-700/50 transition ${
                  !notification.read ? 'bg-slate-700/30' : ''
                }`}
                onClick={() => onNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 ${
                    notification.priority === 'high' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {notification.type === 'low_stock' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {notification.toolName}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )}
  </div>
);

export function DashboardLayout({ children, tools = [], onNotificationClick }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {
    notificationState,
    toggleNotificationDropdown,
    markAsRead,
    markAllAsRead,
    closeDropdown
  } = useNotifications(tools);

  // Enhanced notification handler
  const handleNotificationClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    markAsRead(notification.id);
    closeDropdown();
  };

  // Logout handler
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

            {/* Notification and Logout Button */}
            <div className="flex items-center gap-2">
              {/* Notification Button */}
              <NotificationBell
                notificationState={notificationState}
                onToggle={toggleNotificationDropdown}
                onMarkAllRead={markAllAsRead}
                onNotificationClick={handleNotificationClick}
              />

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
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}