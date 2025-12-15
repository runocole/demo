import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Product, CartItem, CustomerInfo, ProductCategory } from "../types/product";
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
import { saveCartToCookies, loadCartFromCookies, clearCartCookies } from "../lib/cookies";
import { useToast } from "../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState<CartItem[]>([]);
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

  useEffect(() => {
    const savedCart = loadCartFromCookies();
    if (savedCart.length > 0) setCart(savedCart);
  }, []);

  useEffect(() => {
    saveCartToCookies(cart);
  }, [cart]);

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
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      className: "bg-white dark:bg-gray-900",
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
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

  const handleCheckoutComplete = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setOrderNumber(
      `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    );
    setCheckoutOpen(false);
    setReceiptOpen(true);
  };

  const handleReceiptClose = () => {
    setReceiptOpen(false);
    setCart([]);
    clearCartCookies();
    toast({
      title: "Order Complete",
      description: "Thank you for your purchase!",
      className: "bg-white dark:bg-gray-900",
    });
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
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
      {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
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

              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button className="relative">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-primary">
                        {calculateItemCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-900 border-gray-800 text-white">
                  <SheetHeader>
                    <SheetTitle className="text-white">Shopping Cart ({calculateItemCount()} items)</SheetTitle>
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
                                  ${item.price.toLocaleString()}
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
                              ${calculateCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
        />
      )}
    </div>
  );
};

export default BuyNow;