import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const mobileMenuItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/buynow" },
    { name: "About", path: "/about" },
    { name: "Training", path: "/training" },
    { name: "CORS Network", path: "/corsnetwork" },
    { name: "Equipments", path: "/buynow?category=survey-equipment" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "My Cart", path: "/cart" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              aria-label="Back to shop"
              className="p-2 rounded-md hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex items-center gap-3">
              <div className="leading-tight">
                <h1 className="font-extrabold text-lg md:text-2xl text-foreground">
                  GEOSSO TECHNOLOGIES
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Precision surveying equipment
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          {isMobile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-md hover:bg-muted transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-muted transition-colors menu-toggle"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-card border-b border-border mobile-menu">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-2">
              {mobileMenuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-md hover:bg-muted transition-colors font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-16 md:pb-0">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Geosso Technologies — All rights reserved
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                href="/privacy"
              >
                Privacy Policy
              </a>
              <span className="text-muted-foreground hidden md:inline">|</span>
              <a
                className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                href="/terms"
              >
                Terms of Service
              </a>
              <span className="text-muted-foreground hidden md:inline">|</span>
              <a
                className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                href="/contact"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-4 text-center md:text-left">
            <p className="text-xs text-muted-foreground">
              Specialists in GNSS, Total Stations, and Surveying Solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;