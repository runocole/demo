import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
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

const CartPage = () => {
  const navigate = useNavigate();
  const { getConvertedPrice } = useCurrency();
  const { toast } = useToast();
  const { cart, updateQuantity, removeFromCart, clearCart, itemCount } = useCart();

  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo | null>(null);
  const [orderNumber, setOrderNumber] = React.useState("");

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb and Back Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mt-30">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Shopping Cart</h1>
              <p className="text-gray-600 mt-2">
                Review your items and proceed to checkout
              </p>
            </div>
            
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:w-2/3">
            {cart.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">
                  Add some products from our shop to get started!
                </p>
                <Button onClick={() => navigate("/buynow")} size="lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-32 h-32 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-gray-600 text-sm mt-1">{item.category}</p>
                              <p className="text-primary font-bold text-xl mt-2">
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
                 {/* Back to Shop Button - Add this block */}
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
</div>
          {/* Order Summary - Right Column */}
          {cart.length > 0 && (
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
                      <span className="text-primary">{getConvertedPrice(total)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <Button
                      onClick={handleCheckout}
                      size="lg"
                      className="w-full"
                      disabled={cart.length === 0}
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

export default CartPage;