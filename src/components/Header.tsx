import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowUp, MessageCircle, ShoppingCart } from "lucide-react";
import oticLogo from "../assets/otic-logo.png";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Add back mobile check

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top functionality
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // WhatsApp functionality
  const openWhatsApp = () => {
    const phoneNumber = "+2347061739934";
    const message = "Hello! I'm interested in your geospatial solutions.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Navigation items with dropdowns
  const navigationItems = [
    {
      name: "Equipments",
      href: "/buynow?category=survey-equipment",
      items: [
        { name: "Total Stations", href: "/buynow?category=Total Station" },
        { name: "GNSS Receivers", href: "/buynow?category=GNSS Receiver" },
        { name: "EchoSounders & USV", href: "/buynow?category=EchoSounder" },
        { name: "Payloads", href: "/buynow?category=Payloads" },
        { name: "Auto-steering Systems", href: "/buynow?category=Auto-steering Systems" },
        { name: "Handheld GPS", href: "/buynow?category=Handheld GPS" },
        { name: "Laser Scanners", href: "/buynow?category=Laser Scanner" },
        { name: "Drones", href: "/buynow?category=Drones" },
        { name: "Levels", href: "/buynow?category=Level" },
        { name: "RTK Tablets", href: "/buynow?category=RTK Tablets" },
      ],
    },
    {
      name: "Support & Services",
      href: "/contact",
      items: [
        { name: "Technical Support", href: "/contact?service=technical-support" },
        { name: "Maintenance", href: "/contact?service=maintenance" },
        { name: "Calibration", href: "/contact?service=calibration" },
      ],
    },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleSubItemClick = (href: string) => {
    navigate(href);
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
    navigate("/cart");
  };

  // Don't render anything on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Desktop Header - Only shown on desktop */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        {/* Logo at extreme left viewport edge */}
        <div className="fixed left-6 top-0 flex items-start gap-4">
          <div className="flex flex-col items-start">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={oticLogo}
                alt="Otic logo" 
                className="w-32 h-32 object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Center navigation with dropdowns */}
        <div className="flex items-center justify-center pt-12">
          <div 
            className={`hidden md:flex items-center gap-2 px-8 py-4 rounded-full transition-all duration-300 ${
              isNavHovered 
                ? 'bg-white shadow-lg' 
                : 'bg-white/10 backdrop-blur-sm'
            }`}
            onMouseEnter={() => setIsNavHovered(true)}
            onMouseLeave={() => setIsNavHovered(false)}
          >
            <nav className="flex items-center gap-6">
              {/* Home */}
              <button
                onClick={() => navigate("/")}
                className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                  isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                }`}
              >
                Home
              </button>

              {/* About */}
              <button
                onClick={() => handleNavigation("/about")}
                className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                  isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                }`}
              >
                About
              </button>

              {/* Training */}
              <button
                onClick={() => handleNavigation("/training")}
                className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                  isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                }`}
              >
                Training
              </button>

              {/* Cors Network */}
              <button
                onClick={() => handleNavigation("/corsnetwork")}
                className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                  isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                }`}
              >
                CORS Network
              </button>

              {/* Other navigation items with dropdowns */}
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <button 
                    onClick={() => handleNavigation(item.href)}
                    className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-1 ${
                      isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                    }`}
                  >
                    {item.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.items.map((subItem) => (
                        <button
                          key={subItem.name}
                          onClick={() => handleSubItemClick(subItem.href)}
                          className="block w-full text-left px-4 py-2 text-base text-gray-800 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Blog */}
              <button
                onClick={() => handleNavigation("/blog")}
                className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                  isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                }`}
              >
                Blog
              </button>
              
              {/* Contact */}
              <button
                onClick={() => handleNavigation("/contact")}
                className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                  isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                }`}
              >
                Contact
              </button>
            </nav>
          </div>
        </div>

        {/* CTA and Cart Buttons */}
        <div className="fixed right-6 top-4">
          <div className="flex items-center gap-3 mt-5">
            {/* Buy Now Button */}
            <button
              onClick={() => navigate("/buynow")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#081748] text-white rounded-full shadow-lg hover:bg-blue-100/90 transition text-lg font-bold"
            >
              <Mail className="w-5 h-5" />
              Buy Now
            </button>

            {/* My Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative inline-flex items-center gap-2 px-6 py-3 bg-white text-[#081748] border-2 border-[#081748] rounded-full shadow-lg hover:bg-gray-50 transition text-lg font-bold"
            >
              <ShoppingCart className="w-5 h-5" />
              My Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Scroll to Top Button - Fixed position */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 z-50 w-12 h-12 bg-[#081748] hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* WhatsApp Button - Always visible, fixed position */}
      <button
        onClick={openWhatsApp}
        className="fixed right-6 bottom-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -left-2 -top-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          Live
        </span>
      </button>
    </>
  );
};

export default Header;