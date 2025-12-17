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
  Trash2, Plus, Minus, Filter, Grid3x3, List, ChevronRight
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

  return (
    <div className="min-h-screen bg-blue-100 text-white">
      <Header />   
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-100 from-primary/10 via-black to-secondary/10 border-b border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4 text-black mt-30"
            >
              Shop
            </motion.h1>
            
            {/* Buttons - First after title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 text-black mb-6"
            >
              <Button onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}>
                Browse Products
              </Button>
              <Button variant="outline" onClick={() => navigate("/contact")}>
                Request Demo
              </Button>
            </motion.div>

            {/* Breadcrumb - Last */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black font-medium">Shop</span>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Main Content with Cart Sidebar */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Products and Filters */}
          <div className="lg:w-3/4">
            {/* Search and Filters Bar */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#081748] border-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden border-gray-700 text-white hover:bg-gray-800">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {selectedCategories.length > 0 && (
                          <Badge className="ml-2 bg-primary">
                            {selectedCategories.length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-gray-900 border-gray-800 text-white">
                      <SheetHeader>
                        <SheetTitle className="text-white">Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <h3 className="font-semibold text-white">Categories</h3>
                        <div className="space-y-2">
                          {TOOL_CATEGORIES.map((category) => (
                            <button
                              key={category}
                              onClick={() => toggleCategory(category)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                                selectedCategories.includes(category)
                                  ? "bg-primary text-white"
                                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                              }`}
                            >
                              {category}
                              <span className="float-right text-xs opacity-60">
                                ({PRODUCTS.filter((p) => p.category === category).length})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="appearance-none bg-[#081748] border border-gray-700 text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="hidden md:flex border border-gray-700 rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Pills - Desktop */}
              <div className="hidden lg:flex items-center gap-2 mt-4 flex-wrap">
                {TOOL_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedCategories.includes(category)
                        ? "bg-primary text-white shadow-lg"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {category}
                    <span className="ml-2 text-xs opacity-60">
                      ({PRODUCTS.filter((p) => p.category === category).length})
                    </span>
                  </button>
                ))}
                {(selectedCategories.length > 0 || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-black">
                Showing <span className="font-semibold text-black">{filteredProducts.length}</span> of{" "}
                <span className="font-semibold text-black">{PRODUCTS.length}</span> products
              </p>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2 text-white">No products found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search or filters
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Right Column: Shopping Cart */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Shopping Cart</h3>
                  <Badge className="bg-primary">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </Badge>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Add items from the products list
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items */}
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 p-3 bg-gray-800 rounded-lg mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate text-white">{item.name}</h4>
                            <p className="text-primary font-bold text-sm mt-1">
                              {getConvertedPrice(item.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 border-gray-600 text-white hover:bg-gray-700"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center text-white">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 border-gray-600 text-white hover:bg-gray-700"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 ml-auto text-destructive hover:bg-gray-700"
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
                    <div className="border-t border-gray-700 pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Subtotal:</span>
                        <span className="font-semibold text-white">
                          {getConvertedPrice(calculateCartTotal())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-300">Tax (VAT):</span>
                        <span className="text-gray-300">Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-semibold text-white">Total:</span>
                        <span className="text-2xl font-bold text-primary">
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

              {/* Mobile Cart Toggle (Hidden on desktop) */}
              <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                  <SheetTrigger asChild>
                    <Button className="rounded-full h-14 w-14 shadow-lg relative">
                      <ShoppingCart className="w-6 h-6" />
                      {cart.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 bg-primary">
                          {itemCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-gray-900 border-gray-800 text-white">
                    <SheetHeader>
                      <SheetTitle className="text-white">Shopping Cart ({itemCount} items)</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
                      {cart.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-center">
                          <div>
                            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-400">Your cart is empty</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 overflow-y-auto space-y-4">
                            {cart.map((item) => (
                              <div key={item.id} className="flex gap-4 p-4 bg-gray-800 rounded-lg">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate text-white">{item.name}</h4>
                                  <p className="text-primary font-bold mt-1">
                                    {getConvertedPrice(item.price)}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 border-gray-600 text-white hover:bg-gray-700"
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-sm font-medium w-8 text-center text-white">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 border-gray-600 text-white hover:bg-gray-700"
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 ml-auto text-destructive hover:bg-gray-700"
                                      onClick={() => handleRemoveItem(item.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-700 pt-4 mt-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-lg font-semibold text-white">Total:</span>
                              <span className="text-2xl font-bold text-primary">
                                {getConvertedPrice(calculateCartTotal())}
                              </span>
                            </div>
                            <Button onClick={handleCheckout} className="w-full" size="lg">
                              Proceed to Checkout
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </main>

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
      
      <CurrencyBoxes />
    </div>
  );
};

export default BuyNow;