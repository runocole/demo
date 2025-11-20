// Import all images
import heroSlide1 from "../assets/hero-slide-1.jpg";
import heroSlide2 from "../assets/hero-slide-2.jpg";
import heroSlide3 from "../assets/hero-slide-3.jpg";
import heroSlide4 from "../assets/hero-slide-4.jpg";
import arrival1 from "../assets/arrival1.jpg";
import arrival2 from "../assets/arrival2.jpg";
import arrival3 from "../assets/arrival3.jpg";
import equipment1 from "../assets/equipment1.jpg";
import equipment2 from "../assets/equipment2.jpg";
import equipment3 from "../assets/equipment3.jpg";
import equipment4 from "../assets/equipment4.jpg";
import equipment6 from "../assets/equipment6.jpg";

// Import types from your product types file
import type { Product, ProductCategory } from "../types/product";

// Export types
export interface Slide {
  image: string;
  title: string;
  subtitle: string;
  position: 'left' | 'center' | 'right';
}

export interface CarouselItem {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category?: string;
}

// Export constants
export const SLIDES: Slide[] = [
  { 
    image: heroSlide1, 
    title: "Precision Survey Solutions", 
    subtitle: "Advanced Total Station & GPS Equipment",
    position: 'left'
  },
  { 
    image: heroSlide2, 
    title: "Drone Survey Technology", 
    subtitle: "UAV Mapping & Aerial Surveying Solutions",
    position: 'right'
  },
  { 
    image: heroSlide3, 
    title: "Underwater Drone Services", 
    subtitle: "Marine & Subsea Survey Technology",
    position: 'center'
  },
  { 
    image: heroSlide4, 
    title: "Expert Survey Teams", 
    subtitle: "Professional Geospatial Solutions Across Africa",
    position: 'left'
  },
];

export const ACCESSORIES: CarouselItem[] = [
  {
    id: 1,
    name: "Survey Tripod",
    category: "Support Equipment",
    image: arrival1,
    description: "Professional survey tripod for stable measurements",
    price: 299
  },
  {
    id: 2,
    name: "Lithium Batteries",
    category: "Power Solutions",
    image: arrival2,
    description: "Long-lasting lithium batteries for field equipment",
    price: 149
  },
  {
    id: 3,
    name: "Carrying Case",
    category: "Protection Gear",
    image: arrival3,
    description: "Durable carrying case for equipment protection",
    price: 89
  },
  {
    id: 4,
    name: "GPS Antenna",
    category: "Signal Equipment",
    image: equipment1,
    description: "High-precision GPS antenna for better signal reception",
    price: 199
  },
  {
    id: 5,
    name: "Data Collector",
    category: "Field Computing",
    image: equipment2,
    description: "Rugged data collector for field operations",
    price: 599
  },
  {
    id: 6,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79
  },
  {
    id: 7,
    name: "Drone Batteries",
    category: "UAV Accessories",
    image: equipment4,
    description: "Extended flight time batteries for survey drones",
    price: 249
  },
  {
    id: 8,
    name: "Calibration Kit",
    category: "Maintenance Tools",
    image: arrival1,
    description: "Professional calibration kit for survey instruments",
    price: 159
  },
  {
    id: 9,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79
  },
  {
    id: 10,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79
  },
  {
    id: 11,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79
  },
  {
    id: 12,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79
  }
];

export const FEATURED_EQUIPMENT: CarouselItem[] = [
  {
    id: 1,
    name: "GNSS Receiver X5 Pro",
    category: "GPS Equipment",
    image: equipment1, 
    description: "High-precision GNSS receiver with multi-frequency technology",
    price: 4999
  },
  {
    id: 2,
    name: "Total Station T7 Elite",
    category: "Survey Instruments",
    image: equipment2, 
    description: "Robotic total station with advanced tracking technology",
    price: 8999
  },
  {
    id: 3,
    name: "3D Laser Scanner L3",
    category: "Scanning Equipment",
    image: equipment3, 
    description: "High-speed 3D laser scanner for detailed mapping",
    price: 12999
  },
  {
    id: 4,
    name: "Survey Drone D8 Pro",
    category: "UAV Equipment",
    image: equipment4, 
    description: "Professional survey drone with RTK positioning",
    price: 15999
  },
  {
    id: 5,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999
  },{
    id: 6,
    name: "Jupiter Laser",
    category: "GNSS Equipment",
    image: equipment6, 
    description: "High-precision GNSS receiver with multi-frequency technology",
    price: 4999
  },{
    id: 7,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999
  },{
    id: 8,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999
  },{
    id: 9,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999
  },{
    id: 10,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999
  },{
    id: 11,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999
  }
];

// Add PRODUCTS export for your BuyNow page
export const PRODUCTS: Product[] = [
  // Combine accessories and equipment into one products array
  ...ACCESSORIES.map(item => ({
    id: `acc-${item.id}`,
    name: item.name,
    category: (item.category ?? "Accessory") as ProductCategory,
    price: item.price,
    description: item.description,
    image: item.image,
    inStock: true
  })),
  ...FEATURED_EQUIPMENT.map(item => ({
    id: `eq-${item.id}`,
    name: item.name,
    category: (item.category ?? "Equipment") as ProductCategory,
    price: item.price,
    description: item.description,
    image: item.image,
    inStock: true
  }))
];

export const ABOUT_CONTENT = {
  title: "Precision from the Ground Up and the Sky Down",
  description: [
    "We are a leading provider of professional geospatial technology, empowering surveyors, engineers, and mapping professionals with the industry's most reliable tools. While renowned for our best-selling GNSS receivers and total stations, we offer a complete ecosystem of cutting-edge solutions, including professional drones.",
    "Our expertise extends beyond the sale. We provide the technology and the specialized drone services—such as aerial surveying, mapping, and inspection—to ensure you capture accurate data from every perspective. Whether you need the premier receiver for your field crew or a comprehensive aerial survey, we are your single source for precision."
  ],
  videoUrl: "https://www.youtube.com/embed/2SrceTLF5MU?autoplay=1"
};