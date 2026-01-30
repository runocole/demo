import { Outlet } from "react-router-dom";
import { StaffSidebar } from "././StaffSidebar";

export function StaffLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <StaffSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
