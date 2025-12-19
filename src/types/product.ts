// types/product.ts

export type ProductCategory =
  | "GNSS Receiver"
  | "Handheld GPS"
  | "Payloads"
  | "Auto-steering Systems"
  | "Accessory"
  | "Total Station"
  | "Level"
  | "Drones"
  | "EchoSounder"
  | "Laser Scanner"
  | "RTK Tablets"
  | "Other";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  images?: string[];
  inStock: boolean;
  specifications?: string[];
  
  // MOBILE-OPTIMIZED PROPERTIES (Optional)
  mobileDescription?: string; // Shorter description for mobile
  popularOnMobile?: boolean; // Flag to prioritize on mobile
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
}