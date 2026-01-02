import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Remove the entire header section since you have MobileNavigation */}
      {/* Only show this Layout header on desktop */}
      {!isMobile && (
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

            {/* Desktop buttons in Layout */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop
              </button>
            </div>
          </div>
        </header>
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