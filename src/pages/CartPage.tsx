import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { 
  ArrowLeft, ShoppingCart, Trash2, Plus, Minus, 
  CreditCard, Home, ChevronRight, Package
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CurrencyBoxes from "../components/CurrencyBoxes";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../hooks/use-toast";
import { CheckoutModal } from "../components/CheckoutModal";
import { ReceiptModal } from "../components/ReceiptModal";
import type { CustomerInfo } from "../types/product";
import { generateWhatsAppUrl } from "../config/whatsapp";
import { useCart } from "../context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

const CartPage = () => {
  const navigate = useNavigate();
  const { getConvertedPrice } = useCurrency();
  const { toast } = useToast();
  const { cart, updateQuantity, removeFromCart, clearCart, itemCount } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
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
      
      setTimeout(() => {
        clearCart();
        setReceiptOpen(false);
      }, 1000);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Mobile breadcrumb
  const MobileBreadcrumb = () => (
    <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1 px-4">
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-medium">Cart ({itemCount})</span>
          </nav>
        </div>
        
        <Badge variant="secondary" className="px-3 py-1">
          {itemCount}
        </Badge>
      </div>
    </div>
  );

  // Mobile cart item component
  const MobileCartItem = ({ item }: { item: typeof cart[0] }) => (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="pr-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                {item.name}
              </h3>
              <p className="text-gray-500 text-xs mt-1">{item.category}</p>
              <p className="text-blue-600 font-bold text-base mt-2">
                {getConvertedPrice(item.price)}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => handleRemoveItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center font-semibold text-gray-900 text-sm">
                  {item.quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-gray-500 text-xs">Item Total</p>
              <p className="text-base font-bold text-gray-900">
                {getConvertedPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb - Desktop */}
      {!isMobile && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => navigate("/buynow")}
                className="text-gray-600 hover:text-gray-900"
              >
                Shop
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </nav>
          </div>
        </div>
      )}

      {/* Breadcrumb - Mobile */}
      {isMobile && <MobileBreadcrumb />}

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Review your items and proceed to checkout
              </p>
            </div>
            
            {!isMobile && (
              <Badge variant="secondary" className="text-lg px-4 py-2 hidden sm:block">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items - Left Column */}
          <div className="lg:w-2/3">
            {/* Mobile: Order Summary Toggle Button */}
            {isMobile && cart.length > 0 && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setOrderSummaryOpen(true)}
                >
                  <span className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    View Order Summary
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
                <ShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4 sm:mb-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                  Add some products from our shop to get started!
                </p>
                <Button 
                  onClick={() => navigate("/buynow")} 
                  size={isMobile ? "default" : "lg"}
                  className="w-full sm:w-auto"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Browse Products
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items List - Desktop */}
                {!isMobile && (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {cart.map((item) => (
                        <div key={item.id} className="p-6">
                          <div className="flex gap-6">
                            {/* Product Image */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div className="pr-4">
                                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                  <p className="text-gray-600 text-sm mt-1">{item.category}</p>
                                  <p className="text-blue-600 font-bold text-xl mt-2">
                                    {getConvertedPrice(item.price)}
                                  </p>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-700 font-medium">Quantity:</span>
                                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-9 w-9"
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-12 text-center font-semibold text-gray-900">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-9 w-9"
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-gray-600 text-sm">Item Total</p>
                                  <p className="text-xl font-bold text-gray-900">
                                    {getConvertedPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Back to Shop Button */}
                    <div className="p-6 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/buynow")}
                        className="w-full"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Shop
                      </Button>
                    </div>
                  </div>
                )}

                {/* Cart Items List - Mobile */}
                {isMobile && cart.length > 0 && (
                  <div className="mb-20">
                    {cart.map((item) => (
                      <MobileCartItem key={item.id} item={item} />
                    ))}
                    
                    {/* Back to Shop Button - Mobile */}
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/buynow")}
                        className="w-full"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Order Summary - Desktop */}
          {!isMobile && cart.length > 0 && (
            <div className="lg:w-1/3">
              <div className="sticky top-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                      <span className="font-semibold text-gray-900">{getConvertedPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (VAT 8%)</span>
                      <span className="font-semibold text-gray-900">{getConvertedPrice(tax)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total Amount</span>
                      <span className="text-blue-600">{getConvertedPrice(total)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <Button
                      onClick={handleCheckout}
                      size="lg"
                      className="w-full"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate("/buynow")}
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">Free shipping</span> on orders over {getConvertedPrice(500)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Order Summary Bottom Sheet & Checkout Button */}
      {isMobile && cart.length > 0 && (
        <>
          {/* Floating Checkout Button - FIXED: Direct click handler */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total ({itemCount} items)</p>
                  <p className="text-xl font-bold text-gray-900">
                    {getConvertedPrice(total)}
                  </p>
                </div>
                
                {/* Direct Checkout Button */}
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  onClick={handleCheckout}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Checkout
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order Summary Sheet - Separate from checkout button */}
          <Sheet open={orderSummaryOpen} onOpenChange={setOrderSummaryOpen}>
            <SheetContent side="bottom" className="bg-white border-gray-200 text-gray-900 rounded-t-2xl h-[70vh] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                  <button
                    onClick={() => setOrderSummaryOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                      <span className="font-semibold text-gray-900">{getConvertedPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (VAT 8%)</span>
                      <span className="font-semibold text-gray-900">{getConvertedPrice(tax)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold pt-2">
                      <span>Total Amount</span>
                      <span className="text-blue-600">{getConvertedPrice(total)}</span>
                    </div>
                  </div>
                  
                  {/* Shipping Info */}
                  <div className="p-4 bg-blue-50 rounded-lg mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-700 font-medium">Free Shipping Available</p>
                    </div>
                    <p className="text-xs text-blue-600">
                      Free shipping on orders over {getConvertedPrice(500)}
                    </p>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setOrderSummaryOpen(false);
                      // Small delay to ensure sheet closes before modal opens
                      setTimeout(() => handleCheckout(), 100);
                    }}
                    size="lg"
                    className="w-full mb-3"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setOrderSummaryOpen(false)}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Bottom spacing for floating button */}
          <div className="h-20" />
        </>
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
      
      {/* Currency Boxes - Desktop only */}
      {!isMobile && <CurrencyBoxes />}
    </div>
  );
};

export default CartPage;