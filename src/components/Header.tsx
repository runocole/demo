import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowUp, MessageCircle, ShoppingCart, X, Home, Info, BookOpen, Phone, Globe, FileText } from "lucide-react";
import oticLogo from "../assets/otic-logo.png";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
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

  // Mobile Navigation Items
  const mobileNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingCart, label: "Shop", path: "/buynow" },
    { icon: Info, label: "About", path: "/about" },
    { icon: BookOpen, label: "Training", path: "/training" },
    { icon: Globe, label: "CORS Network", path: "/corsnetwork" },
    { icon: Phone, label: "Contact", path: "/contact" },
    { icon: FileText, label: "Blog", path: "/blog" },
  ];

  // Desktop Header - Only shown on desktop
  const DesktopHeader = () => (
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
  );

  // Mobile Header - Only shown on mobile
  const MobileHeader = () => (
    <>
      {/* Logo and Cart on mobile */}
      <div className="fixed left-4 top-4 z-40">
        <div 
          className="cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={oticLogo}
            alt="Otic logo" 
            className="w-24 h-24 object-contain drop-shadow-lg"
          />
        </div>
      </div>
      
      {/* Cart button */}
      <div className="fixed right-4 top-8 z-40">
        <button
          onClick={handleCartClick}
          className="relative p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Hamburger Menu Button */}
      <div className="fixed right-20 top-8 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
          aria-label="Open menu"
        >
          <div className="flex flex-col gap-1">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        </button>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar from LEFT */}
          <div className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Logo and Close button */}
              <div className="flex items-center justify-between p-4 border-b">
                <div 
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                >
                  <img
                    src={oticLogo}
                    alt="Otic logo" 
                    className="w-20 h-20 object-contain"
                  />
                </div>
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
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-6 py-4 text-left ${
                        isActive 
                          ? 'bg-blue-50 text-[#081748] border-l-4 border-[#081748]' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
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
                      {navigationItems[0].items.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            navigate(item.href);
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left py-2 text-gray-600 hover:text-[#081748]"
                        >
                          {item.name}
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
                      {navigationItems[1].items.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            navigate(item.href);
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left py-2 text-gray-600 hover:text-[#081748]"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer with CTA */}
              <div className="border-t p-6 space-y-3">
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
                
                <button
                  onClick={handleCartClick}
                  className="flex items-center justify-center w-full p-3 bg-white text-[#081748] border-2 border-[#081748] rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  My Cart
                  {itemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Render appropriate header based on screen size */}
      {isMobile ? <MobileHeader /> : <DesktopHeader />}

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