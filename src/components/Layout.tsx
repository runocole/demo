import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      setIsDesktop(width > 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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

  // Check if this is a public website page or admin page
  const isPublicPage = !location.pathname.startsWith('/dashboard') && 
                      !location.pathname.startsWith('/admin') && 
                      !location.pathname.startsWith('/staff') &&
                      !location.pathname.startsWith('/tools') &&
                      !location.pathname.startsWith('/payments') &&
                      !location.pathname.startsWith('/settings') &&
                      !location.pathname.startsWith('/sales') &&
                      !location.pathname.startsWith('/customers') &&
                      location.pathname !== '/login';

  // Don't show Layout header on public pages (they have their own Header)
  // Only show Layout header on admin/staff pages
  const shouldShowLayoutHeader = !isPublicPage && isDesktop;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Layout Header - Only shown on desktop admin/staff pages */}
      {shouldShowLayoutHeader && (
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
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
                    OTIC Geosystems Ltd
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
      <main className={`${shouldShowLayoutHeader ? 'pt-4' : ''} ${isMobile ? 'pb-16' : 'pb-0'}`}>
        {children}
      </main>

      {/* Footer - Only show on public pages */}
      {isPublicPage && (
        <footer className="bg-card border-t border-border mt-8">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} OTIC Geosystems  — All rights reserved
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
      )}
    </div>
  );
};

export default Layout;