import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  PenLine, 
  LogOut,
  BookOpen
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

const navItems = [
  { title: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
  { title: "All Posts", href: "/staff/posts", icon: FileText },
  { title: "New Post", href: "/staff/posts/new", icon: PenLine },
];

export function StaffSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/staff/dashboard" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold">The Journal</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link to="/blog" target="_blank">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            View Blog
          </Button>
        </Link>
        <Link to="/staff/login">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </Link>
      </div>
    </aside>
  );
}
