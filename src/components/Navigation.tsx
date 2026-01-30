import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/otic-logo.png"; 

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "SERVICES", href: "/services" },
    { name: "PROJECTS", href: "/projects" },  
    { name: "BLOG", href: "/blog" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    // 1. INCREASE NAVBAR HEIGHT
    // h-[140px] makes the bar tall enough to hold a big logo.
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-[140px] flex items-center">
      
      <div className="w-full px-0 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* --- LOGO SECTION --- */}
          <Link to="/" className="flex items-center">
            {/* 2. INCREASE LOGO HEIGHT
                h-[120px] gives you a very large logo while keeping 
                a small buffer inside the 140px bar. 
            */}
            <img 
              src={logo} 
              alt="Geo Survey Tech Logo" 
              className="h-[500px] w-100 object-contain" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute top-[140px] left-0 right-0 bg-background border-b border-border py-4 px-4 shadow-lg">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-3 text-sm font-medium border-b border-border/50 last:border-0 ${
                    isActive
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;