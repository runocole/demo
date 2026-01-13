import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowUp, MessageCircle, ShoppingCart, Menu, X, Home, Info, BookOpen, Globe, FileText, ChevronDown } from "lucide-react";
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
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Track screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
      
      // Check if we need compact mode (1024px - 1280px range)
      setIsCompact(width >= 1024 && width <= 1280);
      
      // Close menu on resize to larger screens
      if (width > 1024) {
        setIsMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  // Define screen categories with better breakpoints
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1324;
  const isDesktop = screenSize.width >= 1024;
  const isLargeDesktop = screenSize.width >= 1280;

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

  // Basic navigation items for compact mode
  const basicNavItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/buynow" },
    { name: "About", href: "/about" },
    { name: "Training", href: "/training" },
    { name: "CORS", href: "/corsnetwork" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

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

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
    navigate("/cart");
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

  // Mobile Header
  const renderMobileHeader = () => {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={oticLogo}
              alt="Otic logo" 
              className="w-14 h-14"
            />
          </div>
          
          {/* Menu Buttons */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="p-3 bg-gray-100 rounded-lg relative"
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
              className="p-3 bg-gray-100 rounded-lg"
              aria-label="Open menu"
            >
              <div className="flex flex-col gap-1">
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
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
                  {[
                    { icon: Home, label: "Home", path: "/" },
                    { icon: ShoppingCart, label: "Shop", path: "/buynow" },
                    { icon: Info, label: "About", path: "/about" },
                    { icon: BookOpen, label: "Training", path: "/training" },
                    { icon: Globe, label: "CORS Network", path: "/corsnetwork" },
                    { icon: FileText, label: "Blog", path: "/blog" },
                    { icon: Mail, label: "Contact", path: "/contact" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNavigation(item.path)}
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
                  
                  {/* Navigation Items with Dropdowns */}
                  {navigationItems.map((section) => (
                    <div key={section.name} className="border-t border-gray-100">
                      <div className="px-6 py-4">
                        <button
                          onClick={() => {
                            handleNavigation(section.href);
                            setIsMenuOpen(false);
                          }}
                          className="font-bold text-gray-700 mb-2 hover:text-[#081748] text-left w-full"
                        >
                          {section.name}
                        </button>
                        
                        <div className="pl-4 space-y-2">
                          {section.items.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                handleNavigation(item.href);
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
                  ))}
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
                    Shop
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={oticLogo}
                alt="Otic logo" 
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Tablet Navigation - More compact */}
            <nav className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className={`text-sm font-semibold transition-colors px-2 py-1.5 ${
                  location.pathname === "/" 
                    ? 'text-[#081748] border-b-2 border-[#081748]' 
                    : 'text-gray-700 hover:text-[#081748]'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => handleNavigation("/buynow")}
                className={`text-sm font-semibold transition-colors px-2 py-1.5 ${
                  location.pathname === "/buynow" 
                    ? 'text-[#081748] border-b-2 border-[#081748]' 
                    : 'text-gray-700 hover:text-[#081748]'
                }`}
              >
                Shop
              </button>
              
              <button
                onClick={() => handleNavigation("/about")}
                className={`text-sm font-semibold transition-colors px-2 py-1.5 ${
                  location.pathname === "/about" 
                    ? 'text-[#081748] border-b-2 border-[#081748]' 
                    : 'text-gray-700 hover:text-[#081748]'
                }`}
              >
                About
              </button>

              {/* More dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#081748] transition-colors px-2 py-1.5">
                  More
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <button onClick={() => handleNavigation("/training")} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#081748]">
                      Training
                    </button>
                    <button onClick={() => handleNavigation("/corsnetwork")} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#081748]">
                      CORS Network
                    </button>
                    <button onClick={() => handleNavigation("/blog")} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#081748]">
                      Blog
                    </button>
                    <button onClick={() => handleNavigation("/contact")} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#081748]">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </nav>

            {/* Tablet CTA Buttons - More compact */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-700 hover:text-[#081748]"
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
                className="px-4 py-2 bg-[#081748] text-white rounded-lg font-semibold hover:bg-blue-900 transition text-xs"
              >
                Shop
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // COMPACT Desktop Header (1024px - 1280px)
  const renderCompactHeader = () => {
    return (
      <header className="absolute top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo - Smaller */}
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={oticLogo}
                alt="Otic logo" 
                className="w-16 h-16 object-contain"
              />
            </div>

            {/* Compact Navigation - Smaller text, tighter spacing */}
            <nav className="hidden lg:flex items-center gap-2">
              {basicNavItems.slice(0, 5).map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`text-sm font-semibold transition-colors px-2 py-1.5 whitespace-nowrap ${
                    location.pathname === item.href 
                      ? 'text-[#081748] border-b-2 border-[#081748]' 
                      : 'text-gray-700 hover:text-[#081748]'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* More dropdown for remaining items */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#081748] transition-colors px-2 py-1.5">
                  More
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {/* Remaining basic items */}
                    {basicNavItems.slice(5).map((item) => (
                      <button 
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#081748]"
                      >
                        {item.name}
                      </button>
                    ))}
                    
                    {/* Equipment dropdown */}
                    {navigationItems.map((section) => (
                      <div key={section.name} className="border-t mt-2 pt-2">
                        <div className="px-3">
                          <div className="font-semibold text-gray-800 text-xs mb-1">{section.name}</div>
                          <div className="space-y-1">
                            {section.items.slice(0, 3).map((item) => (
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
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Compact CTA Buttons - Smaller */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-700 hover:text-[#081748]"
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
                className="px-3 py-2 bg-[#081748] text-white rounded-lg font-semibold hover:bg-blue-900 transition text-xs whitespace-nowrap"
              >
                Shop
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // FULL Desktop Header (1280px+)
  const renderFullDesktopHeader = () => {
    return (
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        {/* Logo at extreme left viewport edge */}
        <div className="absolute left-8 top-0 flex items-start gap-4">
          <div className="flex flex-col items-start">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={oticLogo}
                alt="Otic logo" 
                className="w-20 h-20 object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Center navigation */}
        <div className="flex items-center justify-center pt-12">
          {isHomePage ? (
            // Original header with background on hover (for home page)
            <div 
              className={`hidden xl:flex items-center gap-2 px-8 py-4 rounded-full transition-all duration-300 ${
                isNavHovered 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/10 backdrop-blur-sm'
              }`}
              onMouseEnter={() => setIsNavHovered(true)}
              onMouseLeave={() => setIsNavHovered(false)}
            >
              <nav className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/")}
                  className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                    isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => handleNavigation("/about")}
                  className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                    isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                  }`}
                >
                  About
                </button>

                <button
                  onClick={() => handleNavigation("/training")}
                  className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                    isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                  }`}
                >
                  Training
                </button>

                <button
                  onClick={() => handleNavigation("/corsnetwork")}
                  className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                    isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                  }`}
                >
                  CORS Network
                </button>

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
                    
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {item.items.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => handleNavigation(subItem.href)}
                            className="block w-full text-left px-4 py-2 text-base text-gray-800 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => handleNavigation("/blog")}
                  className={`text-lg font-bold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 ${
                    isNavHovered ? 'text-black hover:text-blue-900' : 'text-white hover:text-blue-200'
                  }`}
                >
                  Blog
                </button>
                
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
          ) : (
            // New header without backgrounds (for all other pages)
            <nav className="hidden xl:flex items-center gap-6">
              <button
                onClick={() => navigate("/")}
                className="text-lg font-bold text-white hover:text-blue-200 transition-colors px-4 py-2"
              >
                Home
              </button>

              <button
                onClick={() => handleNavigation("/about")}
                className="text-lg font-bold text-white hover:text-blue-200 transition-colors px-4 py-2"
              >
                About
              </button>

              <button
                onClick={() => handleNavigation("/training")}
                className="text-lg font-bold text-white hover:text-blue-200 transition-colors px-4 py-2"
              >
                Training
              </button>

              <button
                onClick={() => handleNavigation("/corsnetwork")}
                className="text-lg font-bold text-white hover:text-blue-200 transition-colors px-4 py-2"
              >
                CORS Network
              </button>

              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <button 
                    onClick={() => handleNavigation(item.href)}
                    className="text-lg font-bold text-white hover:text-blue-200 transition-colors px-4 py-2 flex items-center gap-1"
                  >
                    {item.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.items.map((subItem) => (
                        <button
                          key={subItem.name}
                          onClick={() => handleNavigation(subItem.href)}
                          className="block w-full text-left px-4 py-2 text-base text-white hover:bg-white/10 hover:text-blue-200 transition-colors"
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleNavigation("/blog")}
                className="text-lg font-bold text-white hover:text-blue-200 transition-colors px-4 py-2"
              >
                Blog
              </button>
              
              <button
                onClick={() => handleNavigation("/contact")}
                className="text-lg font-bold text-white hover:text-blue-200 transition-colors px-4 py-2"
              >
                Contact
              </button>
            </nav>
          )}
        </div>

        {/* CTA and Cart Buttons */}
        <div className="absolute right-30 top-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/buynow")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#081748] text-white rounded-full shadow-lg hover:bg-blue-900 transition text-lg font-bold"
            >
              <Mail className="w-5 h-5" />
              Shop
            </button>
            </div>
            </div>
 <div className="fixed right-1 top-1">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCartClick}
              className="relative inline-flex items-center gap-2 px-6 py-3 bg-white text-[#081748] border-2 border-[#081748] rounded-full shadow-lg hover:bg-gray-50 transition text-lg font-bold"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
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
  };

  // Render based on screen size
  if (isMobile) {
    return (
      <>
        {renderMobileHeader()}
        {/* WhatsApp Button for Mobile */}
        <button
          onClick={openWhatsApp}
          className="fixed right-4 bottom-4 z-50 w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -left-1 -top-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            Live
          </span>
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
          className="fixed right-6 bottom-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -left-2 -top-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            Live
          </span>
        </button>
      </>
    );
  }

  if (isCompact) {
    // Compact mode for 1024px - 1280px screens
    return (
      <>
        {renderCompactHeader()}
        
        {/* Scroll to Top Button */}
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="fixed right-6 bottom-20 z-50 w-10 h-10 bg-[#081748] hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={openWhatsApp}
          className="fixed right-6 bottom-6 z-50 w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -left-1 -top-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            Live
          </span>
        </button>
      </>
    );
  }

  // Full Desktop (1280px+)
  return (
    <>
      {renderFullDesktopHeader()}
      
      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 z-50 w-12 h-12 bg-[#081748] hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="fixed right-6 bottom-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
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