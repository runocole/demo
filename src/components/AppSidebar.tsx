import {
  LayoutDashboard,
  Package,
  DollarSign,
  Users,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar";
import logo from "../assets/image.png";
// 🧩 Props
interface AppSidebarProps {
  isOpen?: boolean;
}

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Tools", url: "/tools", icon: Package },
  { title: "Payments", url: "/payments", icon: DollarSign },
  { title: "Users", url: "/customers", icon: Users },
  { title: "Sales", url: "/sales", icon: ShoppingCart },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar({ isOpen: externalIsOpen }: AppSidebarProps) {
  const { state } = useSidebar();
  const isSidebarExpanded = state === "expanded";

  // ✅ prefer external state if provided, otherwise use context
  const isOpen = externalIsOpen ?? isSidebarExpanded;

  // 🎨 Control width values here
  const expandedWidth = "w-64"; // Tailwind = 16rem → change to w-72 for 18rem, w-80 for 20rem
  const collapsedWidth = "w-16"; // 4rem

  return (
    <Sidebar
      collapsible="icon"
      className={`border-r border-blue-800/30 bg-blue-950 text-white transition-all duration-300 ease-in-out ${
        isOpen ? expandedWidth : collapsedWidth
      }`}
    >
      <SidebarContent>
      <div className="flex items-center justify-center py-6 border-b border-blue-800/40">
    {isOpen ? (
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="OTIC Logo"
          className="h-8 w-8 object-contain"
        />
        <h2 className="font-bold text-xl text-white tracking-wide">
          OTIC SURVEYS
        </h2>
      </div>
    ) : (
      <img
        src={logo}
        alt="OTIC Logo"
        className="h-8 w-8 object-contain"
      />
    )}
  </div>

        {/* --- Menu --- */}
        <SidebarGroup>
          {isOpen && (
            <SidebarGroupLabel className="px-4 py-2 text-xs uppercase text-blue-200/80 tracking-wide">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `
                          flex items-center gap-3 rounded-md px-3 py-2 transition-colors
                          ${
                            isActive
                              ? "bg-blue-700 text-white font-medium border-l-2 border-white"
                              : "text-blue-100 hover:bg-blue-800 hover:text-white"
                          }
                        `
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {isOpen && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}