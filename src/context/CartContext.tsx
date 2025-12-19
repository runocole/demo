import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "../types/product";
import { loadCartFromCookies, saveCartToCookies } from "../lib/cookies";
import { useToast } from "../hooks/use-toast";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  cartTotal: number;
  isMobile?: boolean; // Mobile detection
  showMobileCart?: boolean; // Mobile cart visibility
  toggleMobileCart?: () => void; // Toggle mobile cart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const { toast } = useToast();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load cart from cookies on initial render
  useEffect(() => {
    const savedCart = loadCartFromCookies();
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
  }, []);

  // Save cart to cookies whenever cart changes
  useEffect(() => {
    saveCartToCookies(cart);
  }, [cart]);

  const toggleMobileCart = useCallback(() => {
    setShowMobileCart(prev => !prev);
  }, []);

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Mobile toast with vibration
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50); // Gentle vibration feedback
    }

    // Mobile-optimized toast
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      className: isMobile 
        ? "fixed top-4 left-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4"
        : "bg-white dark:bg-gray-900",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );

    // Mobile feedback
    if (isMobile && quantity > 0) {
      // Gentle feedback for quantity change
      if ('vibrate' in navigator) {
        navigator.vibrate(30);
      }
    }
  };

  const removeFromCart = (productId: string) => {
    const removedItem = cart.find(item => item.id === productId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    // Mobile toast
    if (removedItem && isMobile) {
      toast({
        title: "Removed",
        description: `${removedItem.name} removed from cart`,
        className: "fixed top-4 left-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4",
      });
    }
  };

  const clearCart = () => {
    const hadItems = cart.length > 0;
    setCart([]);
    
    if (hadItems && isMobile) {
      toast({
        title: "Cart cleared",
        description: "All items have been removed",
        className: "fixed top-4 left-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4",
      });
    }
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Mobile optimization: Auto-close mobile cart after checkout
  const contextValue: CartContextType = {
    cart,
    addToCart: (product) => {
      addToCart(product);
      // On mobile, don't auto-show cart when adding items
    },
    updateQuantity,
    removeFromCart,
    clearCart: () => {
      clearCart();
      if (isMobile) {
        setShowMobileCart(false);
      }
    },
    itemCount,
    cartTotal,
    isMobile,
    showMobileCart,
    toggleMobileCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};