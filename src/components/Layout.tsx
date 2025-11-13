import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

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
                <p className="text-xs text-muted-foreground">
                  Precision surveying equipment
                </p>
              </div>
            </div>
          </div>

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

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Geosso Technologies — All rights reserved
          </div>
          <div className="flex items-center gap-4">
            <a
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="/privacy"
            >
              Privacy
            </a>
            <a
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="/terms"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
