export type ProductCategory = 
  | "GNSS Receiver"
  | "Payloads"
  | "Accessory"
  | "Handheld GPS"
  | "Total Station"
  | "Level"
  | "Drones"
  | "EchoSounder"
  | "Laser Scanner"
  | "Auto-steering Systems"
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
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  state: string;
  phone: string;
  email: string;
}

export const ACCESSORIES = [];
export const FEATURED_EQUIPMENT = [];