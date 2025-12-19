import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Product, CustomerInfo, ProductCategory } from "../types/product";
import { PRODUCTS } from "../data/product";
import { ProductCard } from "../components/ProductCard";
import { CheckoutModal } from "../components/CheckoutModal";
import { ReceiptModal } from "../components/ReceiptModal";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Search, X, ChevronDown, Home, ShoppingCart, 
  Trash2, Plus, Minus, Filter, Grid3x3, List, ChevronRight,
  Menu
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import CurrencyBoxes from "../components/CurrencyBoxes";
import { useCurrency } from "../context/CurrencyContext"; 
import { generateWhatsAppUrl } from "../config/whatsapp";
import { useCart } from "../context/CartContext";

const TOOL_CATEGORIES: ProductCategory[] = [
  "GNSS Receiver",
  "Handheld GPS",
  "Payloads",
  "Auto-steering Systems",
  "Accessory",
  "Total Station",
  "Level",
  "Drones",
  "EchoSounder",
  "Laser Scanner",
  "RTK Tablets",
  "Other",
];

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";
type ViewMode = "grid" | "list";

const BuyNow = () => {
  const { getConvertedPrice } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, addToCart, updateQuantity, removeFromCart, itemCount } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle category from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlCategory = searchParams.get('category') as ProductCategory | null;
    
    if (urlCategory && TOOL_CATEGORIES.includes(urlCategory)) {
      setSelectedCategories([urlCategory]);
    }
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const base = PRODUCTS.filter((product) => {
      const matchesSearch =
        q === "" ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      return matchesSearch && matchesCategory;
    });

    const sorted = [...base].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedCategories, sortOption]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      className: "bg-white dark:bg-gray-900",
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
      className: "bg-white dark:bg-gray-900"
    });
  };

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    setSortOption("featured");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
        className: "bg-red-500 dark:bg-red-900",
      });
      return;
    }
    setCheckoutOpen(true);
    setCartOpen(false);
  };

  const handleCheckoutComplete = (info: CustomerInfo, orderNum: string) => {
    setCustomerInfo(info);
    setOrderNumber(orderNum);
    setReceiptOpen(true);
    
    toast({
      title: "Order Confirmed!",
      description: "Review your receipt and complete payment via WhatsApp.",
      className: "bg-white dark:bg-gray-900",
    });
    
    setTimeout(() => {
      if (cart.length > 0 && info) {
        const whatsappUrl = generateWhatsAppUrl(cart, info, orderNum);
        window.open(whatsappUrl, '_blank');
      }
    }, 3000);
  };

  const handleReceiptClose = () => {
    setReceiptOpen(false);
    toast({
      title: "Order Submitted",
      description: "Please check WhatsApp to complete payment.",
      className: "bg-white dark:bg-gray-900",
    });
  };

  const handleWhatsAppRedirect = () => {
    if (customerInfo && cart.length > 0) {
      const whatsappUrl = generateWhatsAppUrl(cart, customerInfo, orderNumber);
      window.open(whatsappUrl, '_blank');
    }
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Mobile cart items count for badge
  const mobileCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900">
      <Header />   
      
      {/* Hero Section - Responsive */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-4 text-gray-900 mt-${isMobile ? '20' : '30'}`}
            >
              Shop
            </motion.h1>
            
            {/* Buttons - First after title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <Button 
                onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
                size={isMobile ? "default" : "lg"}
                className="flex-1 sm:flex-none"
              >
                Browse Products
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/contact")}
                size={isMobile ? "default" : "lg"}
                className="flex-1 sm:flex-none"
              >
                Request Demo
              </Button>
            </motion.div>

            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-gray-600 flex-wrap"
            >
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Shop</span>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Main Content with Cart Sidebar */}
      <main className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Column: Products and Filters */}
          <div className="lg:w-3/4">
            {/* Search and Filters Bar - Mobile Optimized */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 mb-6 md:mb-8 shadow-sm">
              {/* Mobile Filter Toggle */}
              <div className="flex items-center justify-between mb-4 md:hidden">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      <Menu className="w-4 h-4 mr-2" />
                      Categories
                      {selectedCategories.length > 0 && (
                        <Badge className="ml-2 bg-blue-600">
                          {selectedCategories.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-white border-gray-200 text-gray-900 w-[300px] sm:w-[350px]">
                    <SheetHeader className="mb-4">
                      <SheetTitle className="text-gray-900">Categories</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {TOOL_CATEGORIES.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              toggleCategory(category);
                              if (isMobile) setMobileFiltersOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                              selectedCategories.includes(category)
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{category}</span>
                              <span className="text-xs opacity-75">
                                ({PRODUCTS.filter((p) => p.category === category).length})
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {(selectedCategories.length > 0 || searchQuery) && (
                        <Button 
                          onClick={clearFilters} 
                          variant="outline" 
                          className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Sort and View Controls */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="appearance-none bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 pr-8 md:pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                    <ChevronDown className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Mode Toggle - Desktop Only */}
                  <div className="hidden md:flex border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-r-none ${viewMode === "grid" ? "bg-gray-100 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={`rounded-l-none ${viewMode === "list" ? "bg-gray-100 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Pills - Desktop */}
              <div className="hidden md:flex items-center gap-2 mt-4 flex-wrap">
                {TOOL_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      selectedCategories.includes(category)
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                    <span className="ml-1 md:ml-2 text-xs opacity-60">
                      ({PRODUCTS.filter((p) => p.category === category).length})
                    </span>
                  </button>
                ))}
                {(selectedCategories.length > 0 || searchQuery) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Mobile Selected Categories */}
              {isMobile && selectedCategories.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">Selected:</span>
                    {selectedCategories.map(category => (
                      <Badge key={category} className="bg-blue-100 text-blue-700">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
              <p className="text-gray-700 text-sm md:text-base">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{PRODUCTS.length}</span> products
              </p>
              <div className="text-sm text-gray-500">
                {selectedCategories.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {selectedCategories.length} filter{selectedCategories.length !== 1 ? 's' : ''} active
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 md:py-20 bg-white rounded-xl border border-gray-200">
                <Search className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto px-4">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button onClick={clearFilters} size={isMobile ? "default" : "lg"}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    : "space-y-4 md:space-y-6"
                }
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart} 
                        variant={isMobile ? "compact" : "split"}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Right Column: Shopping Cart - Desktop Only */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Shopping Cart</h3>
                  <Badge className="bg-blue-600">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </Badge>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Add items from the products list
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items */}
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate text-gray-900">{item.name}</h4>
                            <p className="text-blue-600 font-bold text-sm mt-1">
                              {getConvertedPrice(item.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center text-gray-900">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 ml-auto text-red-600 hover:bg-red-50"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Total */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold text-gray-900">
                          {getConvertedPrice(calculateCartTotal())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Tax (VAT):</span>
                        <span className="text-gray-500 text-sm">Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {getConvertedPrice(calculateCartTotal())}
                        </span>
                      </div>
                      
                      <Button onClick={handleCheckout} className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Cart Button */}
      {isMobile && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full h-14 w-14 shadow-xl relative bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="w-6 h-6" />
                {mobileCartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 bg-red-500">
                    {mobileCartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-white border-gray-200 text-gray-900 rounded-t-2xl h-[85vh]">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-gray-900">
                  Shopping Cart ({mobileCartCount} {mobileCartCount === 1 ? 'item' : 'items'})
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-[calc(85vh-80px)]">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <ShoppingCart className="w-20 h-20 mb-6 text-gray-300" />
                    <p className="text-gray-600 text-lg mb-2">Your cart is empty</p>
                    <p className="text-gray-500 mb-8">
                      Browse products and add items to get started
                    </p>
                    <Button 
                      onClick={() => {
                        setCartOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      size="lg"
                      className="w-full max-w-xs"
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h4>
                            <p className="text-blue-600 font-bold text-lg mb-3">
                              {getConvertedPrice(item.price)}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 border-gray-300 text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-base font-medium w-8 text-center text-gray-900">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 border-gray-300 text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4 bg-white">
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold text-gray-900">
                            {getConvertedPrice(calculateCartTotal())}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tax (VAT):</span>
                          <span className="text-gray-500">Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-xl font-semibold text-gray-900">Total:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {getConvertedPrice(calculateCartTotal())}
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          handleCheckout();
                          setCartOpen(false);
                        }} 
                        className="w-full" 
                        size="lg"
                      >
                        Proceed to Checkout
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setCartOpen(false)} 
                        className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <Footer />

      {/* Modals */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onComplete={handleCheckoutComplete}
        cart={cart}
      />
      
      {customerInfo && (
        <ReceiptModal
          open={receiptOpen}
          onClose={handleReceiptClose}
          cart={cart}
          customerInfo={customerInfo}
          orderNumber={orderNumber}
          onWhatsAppRedirect={handleWhatsAppRedirect}
        />
      )}
      
      {/* Currency Boxes - Mobile Optimized */}
      <div className={`${isMobile ? 'px-3 py-2' : ''}`}>
        <CurrencyBoxes />
      </div>

      {/* Mobile Bottom Spacing for Cart Button */}
      {isMobile && <div className="h-20" />}
    </div>
  );
};

export default BuyNow;