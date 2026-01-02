import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Info, BookOpen, Phone, X, Mail, Globe, FileText } from "lucide-react";
import { useCart } from "../context/CartContext";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  if (!isMobile) return null;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingCart, label: "Shop", path: "/buynow" },
    { icon: Info, label: "About", path: "/about" },
    { icon: BookOpen, label: "Training", path: "/training" },
    { icon: Globe, label: "CORS Network", path: "/corsnetwork" },
    { icon: Phone, label: "Contact", path: "/contact" },
    { icon: FileText, label: "Blog", path: "/blog" },
  ];

  const equipmentItems = [
    "Total Stations",
    "GNSS Receivers", 
    "EchoSounders & USV",
    "Payloads",
    "Auto-steering Systems",
    "Handheld GPS",
    "Laser Scanners",
    "Drones",
    "Levels",
    "RTK Tablets",
  ];

  const supportItems = [
    "Technical Support",
    "Maintenance",
    "Calibration",
  ];

  return (
    <>
      {/* Mobile Menu Buttons - Hamburger and Cart side by side */}
      <div className="fixed top-6 right-4 z-50 lg:hidden flex items-center gap-2">
        {/* Cart Button */}
        <button
          onClick={() => navigate("/cart")}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 relative"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-5 h-5 text-black" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
        
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
          aria-label="Open menu"
        >
          <div className="flex flex-col gap-1">
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
            <div className="w-6 h-0.5 bg-black"></div>
          </div>
        </button>
      </div>

      {/* Slide-in Sidebar from LEFT */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar from LEFT */}
          <div className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 lg:hidden">
            <div className="flex flex-col h-full">
              {/* Close button at top right */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-2">
                {/* Main Navigation Items */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center w-full px-6 py-4 text-left ${
                        isActive 
                          ? 'bg-blue-50 text-[#081748] border-l-4 border-[#081748]' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0 text-black" />
                      <span className="font-medium text-base">{item.label}</span>
                      {item.label === "Shop" && itemCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </button>
                  );
                })}
                
                {/* Equipments Dropdown */}
                <div className="border-t border-gray-100">
                  <div className="px-6 py-4">
                    <h3 className="font-bold text-gray-700 mb-2">Equipments</h3>
                    <div className="pl-4 space-y-2">
                      {equipmentItems.map((item) => (
                        <button
                          key={item}
                          onClick={() => navigate(`/buynow?category=${encodeURIComponent(item)}`)}
                          className="block w-full text-left py-2 text-gray-600 hover:text-[#081748]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Support & Services Dropdown */}
                <div className="border-t border-gray-100">
                  <div className="px-6 py-4">
                    <h3 className="font-bold text-gray-700 mb-2">Support & Services</h3>
                    <div className="pl-4 space-y-2">
                      {supportItems.map((item) => (
                        <button
                          key={item}
                          onClick={() => navigate(`/contact?service=${encodeURIComponent(item.toLowerCase().replace(/\s+/g, '-'))}`)}
                          className="block w-full text-left py-2 text-gray-600 hover:text-[#081748]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Cart Item in Menu */}
                <button
                  onClick={() => navigate("/cart")}
                  className="flex items-center w-full px-6 py-4 text-left text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                >
                  <ShoppingCart className="w-5 h-5 mr-3 text-black" />
                  <span className="font-medium text-base">My Cart</span>
                  {itemCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Footer with CTA */}
              <div className="border-t p-6">
                <button
                  onClick={() => {
                    navigate("/buynow");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-full p-3 bg-[#081748] text-white rounded-lg font-semibold hover:bg-blue-900 transition"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNavigation;