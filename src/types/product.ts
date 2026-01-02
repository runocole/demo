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
  specifications: string[];
  featured?: boolean;
  discount?: number;
  tags?: string[];
  brand?: string;
  model?: string;
  warranty?: string;
  
  // MOBILE-OPTIMIZED PROPERTIES (Optional)
  mobileDescription?: string; // Shorter description for mobile
  popularOnMobile?: boolean; // Flag to prioritize on mobile
}

export interface CartItem extends Product {
  quantity: number;
  firstName: string;
  lastName: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
}