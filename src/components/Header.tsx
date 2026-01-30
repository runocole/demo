import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowUp, MessageCircle, ShoppingCart, ChevronDown } from "lucide-react";
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
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  
  // Refs for dropdown
  const equipmentDropdownRef = useRef<HTMLDivElement>(null);
  const equipmentButtonRef = useRef<HTMLButtonElement>(null);

  // Track screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Close menu on resize to larger screens
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // For scroll to top button
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        equipmentDropdownRef.current &&
        equipmentButtonRef.current &&
        !equipmentDropdownRef.current.contains(event.target as Node) &&
        !equipmentButtonRef.current.contains(event.target as Node)
      ) {
        setIsEquipmentOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define screen categories
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;

  // Navigation items with dropdowns
  const equipmentItems = [
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
  ];

  // Basic navigation items
  const basicNavItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Training", href: "/training" },
    { name: "CORS", href: "/corsnetwork" },
    { name: "Blog", href: "/blog" },
  ];

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // WhatsApp functionality
  const openWhatsApp = () => {
    const phoneNumber = "+2349048332623";
    const message = "Hello! I'm interested in your geospatial solutions.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
    setIsEquipmentOpen(false);
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
    navigate("/cart");
    setIsMenuOpen(false);
  };

  // Toggle equipment dropdown
  const toggleEquipmentDropdown = () => {
    setIsEquipmentOpen(!isEquipmentOpen);
  };

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

  // Logo component with improved styling
  const Logo = () => (
    <div 
      className="flex items-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          {/* Logo container with subtle shadow for bold effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081748] to-blue-900 rounded-lg opacity-10 blur-sm"></div>
          <img
            src={oticLogo}
            alt="Otic logo" 
            className="relative w-auto h-auto max-h-full object-contain drop-shadow-md"
            style={{
              filter: 'contrast(1.1) brightness(1.05)',
            }}
          />
        </div>
      </div>
    </div>
  );

  // Mobile Header
  const renderMobileHeader = () => {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="h-12 w-auto flex items-center">
                <img
                  src={oticLogo}
                  alt="Otic logo" 
                  className="h-full w-auto max-w-full object-contain"
                  style={{
                    filter: 'contrast(1.1) brightness(1.05) drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Menu Buttons */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="p-2 bg-gray-100 rounded-lg relative hover:bg-gray-200 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Open menu"
            >
              <div className="flex flex-col gap-1">
                <div className="w-5 h-0.5 bg-gray-700"></div>
                <div className="w-5 h-0.5 bg-gray-700"></div>
                <div className="w-5 h-0.5 bg-gray-700"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 mt-16"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <div className="fixed top-16 left-0 right-0 z-50 bg-white shadow-xl">
              <div className="flex flex-col h-[calc(100vh-4rem)]">
                <div className="flex-1 overflow-y-auto py-2">
                  {/* Main Navigation Items */}
                  {basicNavItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className={`flex items-center w-full px-4 py-3 text-left ${
                          isActive 
                            ? 'bg-blue-50 text-[#081748] border-l-4 border-[#081748]' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium text-sm">{item.name}</span>
                      </button>
                    );
                  })}
                  
                  {/* Equipment Section */}
                  <div className="border-t border-gray-100">
                    <div className="px-4 py-3">
                      <div className="font-semibold text-gray-700 mb-2 text-sm">Equipments</div>
                      <div className="pl-3 space-y-1">
                        {equipmentItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => {
                              handleNavigation(item.href);
                            }}
                            className="block w-full text-left py-1.5 text-gray-600 hover:text-[#081748] text-xs"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Shop Button */}
                  <button
                    onClick={() => handleNavigation("/buynow")}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2 text-gray-700" />
                    <span className="font-medium text-sm">Shop</span>
                    {itemCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Contact */}
                  <button
                    onClick={() => handleNavigation("/contact")}
                    className={`flex items-center w-full px-4 py-3 text-left border-t border-gray-100 ${
                      location.pathname === "/contact" 
                        ? 'bg-blue-50 text-[#081748] border-l-4 border-[#081748]' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium text-sm">Contact</span>
                  </button>
                </div>
                
                {/* Footer with CTA */}
                <div className="border-t p-4">
                  <button
                    onClick={() => {
                      navigate("/buynow");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full p-3 bg-[#081748] text-white rounded-lg font-semibold hover:bg-blue-900 transition text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    );
  };

  // Tablet Header
  const renderTabletHeader = () => {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo - Fixed width container to prevent stretching */}
            <div className="flex-shrink-0">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="h-14 w-40 flex items-center justify-start">
                  <img
                    src={oticLogo}
                    alt="Otic logo" 
                    className="h-full w-auto max-w-full object-contain"
                    style={{
                      filter: 'contrast(1.1) brightness(1.05) drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tablet Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {basicNavItems.slice(0, 4).map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`text-xs font-semibold transition-colors px-2 py-1.5 rounded ${
                    location.pathname === item.href 
                      ? 'text-[#081748] bg-blue-50' 
                      : 'text-gray-700 hover:text-[#081748] hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* More dropdown */}
              <div className="relative">
                <button 
                  onClick={toggleEquipmentDropdown}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-[#081748] transition-colors px-2 py-1.5 rounded hover:bg-gray-50"
                >
                  More
                  <ChevronDown className={`w-3 h-3 transition-transform ${isEquipmentOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isEquipmentOpen && (
                  <div 
                    ref={equipmentDropdownRef}
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border z-50"
                  >
                    <div className="py-2">
                      {/* Remaining basic nav items */}
                      {basicNavItems.slice(4).map((item) => (
                        <button 
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#081748]"
                        >
                          {item.name}
                        </button>
                      ))}
                      
                      {/* Equipment section */}
                      <div className="border-t mt-1 pt-1 px-3 py-1">
                        <div className="font-semibold text-gray-800 text-xs mb-1">Equipments</div>
                        <div className="space-y-1">
                          {equipmentItems.slice(0, 3).map((item) => (
                            <button
                              key={item.name}
                              onClick={() => handleNavigation(item.href)}
                              className="block w-full text-left text-xs text-gray-600 hover:text-[#081748] py-1"
                            >
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Contact */}
              <button
                onClick={() => handleNavigation("/contact")}
                className={`text-xs font-semibold transition-colors px-2 py-1.5 rounded ${
                  location.pathname === "/contact" 
                    ? 'text-[#081748] bg-blue-50' 
                    : 'text-gray-700 hover:text-[#081748] hover:bg-gray-50'
                }`}
              >
                Contact
              </button>
              
              {/* Shop Button */}
              <button
                onClick={() => handleNavigation("/buynow")}
                className={`text-xs font-semibold transition-colors px-2 py-1.5 rounded ${
                  location.pathname === "/buynow" 
                    ? 'text-[#081748] bg-blue-50' 
                    : 'text-gray-700 hover:text-[#081748] hover:bg-gray-50'
                }`}
              >
                Shop
              </button>
            </nav>

            {/* Tablet CTA Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-700 hover:text-[#081748] hover:bg-gray-50 rounded transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => handleNavigation("/buynow")}
                className="px-3 py-1.5 bg-[#081748] text-white rounded-lg font-semibold hover:bg-blue-900 transition text-xs"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Desktop Header (1024px+)
  const renderDesktopHeader = () => {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white'
      }`}>
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between py-3">
            {/* Logo - Desktop with optimal sizing */}
            <div className="flex-shrink-0">
              <div 
                className="flex items-center cursor-pointer gap-3"
                onClick={() => navigate("/")}
              >
                <div className="h-16 w-48 flex items-center justify-center">
                  <img
                    src={oticLogo}
                    alt="Otic logo" 
                    className="h-full w-auto max-w-full object-contain"
                    style={{
                      filter: 'contrast(1.15) brightness(1.1) drop-shadow(0 2px 6px rgba(0,0,0,0.15))'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center gap-1">
                {basicNavItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg ${
                      location.pathname === item.href 
                        ? 'text-[#081748] bg-blue-50' 
                        : 'text-gray-700 hover:text-[#081748] hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                
                {/* Equipment dropdown */}
                <div className="relative" ref={equipmentDropdownRef}>
                  <button 
                    ref={equipmentButtonRef}
                    onClick={toggleEquipmentDropdown}
                    onMouseEnter={() => setIsEquipmentOpen(true)}
                    className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#081748] hover:bg-gray-50 transition-colors px-4 py-2 rounded-lg"
                  >
                    Equipments
                    <ChevronDown className={`w-3 h-3 transition-transform ${isEquipmentOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isEquipmentOpen && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border z-50"
                      onMouseEnter={() => setIsEquipmentOpen(true)}
                      onMouseLeave={() => setIsEquipmentOpen(false)}
                    >
                      <div className="py-2">
                        {equipmentItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#081748]"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Shop Button */}
                <button
                  onClick={() => handleNavigation("/buynow")}
                  className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg ${
                    location.pathname === "/buynow" 
                      ? 'text-[#081748] bg-blue-50' 
                      : 'text-gray-700 hover:text-[#081748] hover:bg-gray-50'
                  }`}
                >
                  Shop
                </button>
                
                {/* Contact */}
                <button
                  onClick={() => handleNavigation("/contact")}
                  className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg ${
                    location.pathname === "/contact" 
                      ? 'text-[#081748] bg-blue-50' 
                      : 'text-gray-700 hover:text-[#081748] hover:bg-gray-50'
                  }`}
                >
                  Contact
                </button>
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-700 hover:text-[#081748] hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => handleNavigation("/buynow")}
                className="px-5 py-2.5 bg-[#081748] text-white rounded-lg font-semibold hover:bg-blue-900 transition text-sm flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Render based on screen size
  if (isMobile) {
    return (
      <>
        {renderMobileHeader()}
        {/* WhatsApp Button for Mobile */}
        <button
          onClick={openWhatsApp}
          className="fixed right-4 bottom-4 z-40 w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </>
    );
  }

  if (isTablet) {
    return (
      <>
        {renderTabletHeader()}
        {/* WhatsApp Button for Tablet */}
        <button
          onClick={openWhatsApp}
          className="fixed right-6 bottom-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      </>
    );
  }

  // Desktop
  return (
    <>
      {renderDesktopHeader()}
      
      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 z-40 w-12 h-12 bg-[#081748] hover:bg-blue-900 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="fixed right-6 bottom-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </>
  );
};

export default Header;