import type { CartItem } from "../types/product";

const CART_COOKIE_NAME = "survey_equipment_cart";
const CART_EXPIRY_DAYS = 7;

export const saveCartToCookies = (cart: CartItem[]): void => {
  try {
    const cartJson = JSON.stringify(cart);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS);
    
    document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(cartJson)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error("Error saving cart to cookies:", error);
  }
};

export const loadCartFromCookies = (): CartItem[] => {
  try {
    const cookies = document.cookie.split("; ");
    const cartCookie = cookies.find(cookie => cookie.startsWith(`${CART_COOKIE_NAME}=`));
    
    if (!cartCookie) return [];
    
    const cartJson = decodeURIComponent(cartCookie.split("=")[1]);
    return JSON.parse(cartJson);
  } catch (error) {
    console.error("Error loading cart from cookies:", error);
    return [];
  }
};

export const clearCartCookies = (): void => {
  document.cookie = `${CART_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
};
