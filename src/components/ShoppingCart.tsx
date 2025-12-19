import { useState, useEffect } from "react";
import type { CartItem } from "../types/product";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "../components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus, X, ArrowRight, Package } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";
import { useCurrency } from "../context/CurrencyContext";

interface ShoppingCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  className?: string;
  triggerSize?: "sm" | "md" | "lg";
  position?: "left" | "right";
}

export const ShoppingCartComponent = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  className,
  triggerSize = "lg",
  position = "right"
}: ShoppingCartProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { getConvertedPrice } = useCurrency();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    onCheckout();
    setIsOpen(false);
  };

  // Mobile-optimized cart item
  const MobileCartItem = ({ item }: { item: CartItem }) => (
    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex gap-3">
        <div className="relative w-20 h-20 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg bg-white p-1"
            loading="lazy"
          />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-500 text-xs">
            {item.quantity}
          </Badge>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="pr-2">
              <h4 className="font-semibold text-sm text-white line-clamp-2">{item.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{item.category}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/30"
              onClick={() => onRemoveItem(item.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-base font-bold text-white">{getConvertedPrice(item.price)}</p>
            <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-gray-700"
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-6 text-center font-semibold text-white text-sm">{item.quantity}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-gray-700"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-700">
        <span className="text-xs text-gray-400">Item Total</span>
        <span className="font-bold text-white">{getConvertedPrice(item.price * item.quantity)}</span>
      </div>
    </div>
  );

  // Desktop cart item
  const DesktopCartItem = ({ item }: { item: CartItem }) => (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-md bg-white p-1"
            loading="lazy"
          />
          {item.quantity > 1 && (
            <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5">
              {item.quantity}
            </Badge>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div className="pr-4">
              <h4 className="font-semibold text-sm text-white">{item.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{item.category}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/30"
              onClick={() => onRemoveItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-white">{getConvertedPrice(item.price)}</p>
            <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1 border border-gray-700">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-gray-700"
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold text-white text-sm">{item.quantity}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-gray-700"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-700">
        <span className="text-sm text-gray-400">Item Total</span>
        <span className="font-bold text-white">{getConvertedPrice(item.price * item.quantity)}</span>
      </div>
    </div>
  );

  // Trigger button sizes
  const triggerSizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-11 px-6 text-base"
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          size="lg" 
          className={cn(
            "gap-2 relative bg-blue-600 text-white hover:bg-blue-700 transition-all",
            triggerSizes[triggerSize],
            className
          )}
          aria-label={`Shopping cart (${totalItems} items)`}
        >
          <ShoppingCart className={cn(
            triggerSize === "sm" ? "w-4 h-4" : "w-5 h-5"
          )} />
          <span className={cn(
            triggerSize === "sm" ? "text-xs" : ""
          )}>
            {isMobile && triggerSize !== "sm" ? "" : "Cart"}
          </span>
          {totalItems > 0 && (
            <Badge 
              variant="destructive" 
              className={cn(
                "absolute -top-1 -right-1 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-white",
                triggerSize === "sm" ? "h-4 w-4 text-[10px]" : "h-5 w-5 text-xs"
              )}
            >
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side={isMobile ? "bottom" : position}
        className={cn(
          "flex flex-col text-white border-blue-800",
          isMobile 
            ? "w-full h-[85vh] rounded-t-2xl bg-gradient-to-b from-blue-900 to-blue-950"
            : "w-full sm:max-w-md bg-gradient-to-b from-blue-900 to-blue-950"
        )}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-center mb-2">
            <div className="w-12 h-1 bg-blue-700 rounded-full"></div>
          </div>
        )}

        <SheetHeader className={cn(
          "border-b border-blue-700",
          isMobile ? "px-2 pb-3" : "pb-4"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "rounded-full bg-blue-500/20 flex items-center justify-center",
                isMobile ? "w-8 h-8" : "w-10 h-10"
              )}>
                <ShoppingCart className={cn(
                  "text-blue-300",
                  isMobile ? "w-4 h-4" : "w-5 h-5"
                )} />
              </div>
              <div>
                <SheetTitle className={cn(
                  "text-white",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  Shopping Cart
                </SheetTitle>
                <p className="text-blue-300 text-sm">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            {!isMobile && (
              <SheetClose asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-blue-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </SheetClose>
            )}
          </div>
        </SheetHeader>
        
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-800/50 flex items-center justify-center mx-auto">
                <ShoppingCart className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white mb-2">Your cart is empty</p>
                <p className="text-blue-300 text-sm">
                  Add some products from our shop to get started!
                </p>
              </div>
              <SheetClose asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
                  Browse Products
                </Button>
              </SheetClose>
            </div>
          </div>
        ) : (
          <>
            <div className={cn(
              "flex-1 overflow-y-auto",
              isMobile ? "space-y-3 py-3 px-2" : "space-y-4 py-4"
            )}>
              {cart.map((item) => (
                <div key={item.id} className={isMobile ? "mb-3" : ""}>
                  {isMobile ? (
                    <MobileCartItem item={item} />
                  ) : (
                    <DesktopCartItem item={item} />
                  )}
                </div>
              ))}
            </div>
            
            <div className={cn(
              "space-y-4 pt-4 border-t border-blue-700 bg-blue-900/30",
              isMobile ? "px-3 pb-6 rounded-t-2xl" : ""
            )}>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-white">{getConvertedPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">Tax (8%)</span>
                  <span className="font-semibold text-white">{getConvertedPrice(tax)}</span>
                </div>
                <Separator className="bg-blue-700" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="text-green-400">{getConvertedPrice(total)}</span>
                </div>
              </div>
              
              {/* Shipping Info */}
              <div className="p-3 bg-blue-800/30 rounded-lg border border-blue-700">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-300" />
                  <p className="text-sm text-blue-200">
                    Free shipping on orders over {getConvertedPrice(500)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={cn(
                "space-y-3",
                isMobile ? "grid grid-cols-1 gap-2" : ""
              )}>
                <Button
                  size={isMobile ? "lg" : "default"}
                  className={cn(
                    "w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold",
                    isMobile ? "py-6 text-base" : ""
                  )}
                  onClick={handleCheckout}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className={cn(
                    "ml-2",
                    isMobile ? "w-5 h-5" : "w-4 h-4"
                  )} />
                </Button>
                
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    size={isMobile ? "lg" : "default"}
                    className={cn(
                      "w-full border-blue-600 text-blue-400 hover:text-white hover:bg-blue-800",
                      isMobile ? "py-6" : ""
                    )}
                  >
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>

              {/* Mobile Extra Info */}
              {isMobile && (
                <div className="text-center">
                  <p className="text-xs text-blue-400">
                    Need help? Contact support
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};