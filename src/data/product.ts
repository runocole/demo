// Import all images
import heroSlide1 from "../assets/hero-slide-1.jpg";
import heroSlide2 from "../assets/hero-slide-2.jpg";
import heroSlide3 from "../assets/hero-slide-3.jpg";
import heroSlide4 from "../assets/hero-slide-4.jpg";
import t30 from "../assets/t30.jpg";
import arrival1 from "../assets/arrival1.jpg";
import agrast30 from "../assets/agrast30.jpg";
import steeltape from "../assets/steeltape.jpg";
import equipment1 from "../assets/equipment1.jpg";
import equipment3 from "../assets/equipment3.jpg";
import externalradio from "../assets/externalradio.jpg";
import equipment6 from "../assets/equipment6.jpg";
import rangingpole from "../assets/rangingpole.jpg";
import dji from "../assets/dji.jpg";
import longwhip from "../assets/longwhip.jpg";
import tribach from "../assets/tribach.jpg";
import ts20 from "../assets/ts20.jpg";
import zenmuse from "../assets/zenmuse.jpg";
import gpsmap from "../assets/gpsmap.jpg";
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
  inStock?: boolean;
  specifications?: string[];
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
    price: 299,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 2,
    name: "Ranging Pole",
    category: "Power Solutions",
    image: rangingpole,
    description: "Long-lasting lithium batteries for field equipment",
    price: 149,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 3,
    name: "Steel Tape",
    category: "Protection Gear",
    image: steeltape,
    description: "Durable carrying case for equipment protection",
    price: 89,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 4,
    name: "Long Whip Antenna",
    category: "Signal Equipment",
    image: longwhip,
    description: "High-precision GPS antenna for better signal reception",
    price: 199,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 5,
    name: "Tribach",
    category: "Field Computing",
    image: tribach,
    description: "Rugged data collector for field operations",
    price: 599,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 6,
    name: "ZENMUSE L2",
    category: "Measurement Tools",
    image: zenmuse,
    description: "Laser target for accurate distance measurements",
    price: 79,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 7,
    name: "External Radio",
    category: "UAV Accessories",
    image: externalradio,
    description: "Extended flight time batteries for survey drones",
    price: 249,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 8,
    name: "Calibration Kit",
    category: "Maintenance Tools",
    image: arrival1,
    description: "Professional calibration kit for survey instruments",
    price: 159,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 9,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 10,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 11,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 12,
    name: "Laser Target",
    category: "Measurement Tools",
    image: equipment3,
    description: "Laser target for accurate distance measurements",
    price: 79,
    inStock: true, 
    specifications: [] 
  }
];

export const FEATURED_EQUIPMENT: CarouselItem[] = [
  {
    id: 1,
    name: "AGRAS T30",
    category: "DRONES",
    image: agrast30, 
    description: "High-precision GNSS receiver with multi-frequency technology",
    price: 4999,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 2,
    name: "T30 GNSS Receiver",
    category: "Survey Instruments",
    image: t30, 
    description: "Robotic total station with advanced tracking technology",
    price: 8999,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 3,
    name: "DJI MAVIC 2 PRO",
    category: "Scanning Equipment",
    image: dji, 
    description: "High-speed 3D laser scanner for detailed mapping",
    price: 12999,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 4,
    name: "Leica TS20",
    category: "UAV Equipment",
    image: ts20, 
    description: "Professional survey drone with RTK positioning",
    price: 15999,
    inStock: true, 
    specifications: [] 
  },
  {
    id: 5,
    name: "GPSMAP 67i",
    category: "Field Equipment",
    image: gpsmap, 
    description: "Portable GPS rover for field data collection",
    price: 6999,
    inStock: true, 
    specifications: [] 
  },{
    id: 6,
    name: "Jupiter Laser",
    category: "GNSS Equipment",
    image: equipment6, 
    description: "High-precision GNSS receiver with multi-frequency technology",
    price: 4999,
    inStock: true, 
    specifications: [] 
  },{
    id: 7,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999,
    inStock: true, 
    specifications: [] 
  },{
    id: 8,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999,
    inStock: true,  
    specifications: [] 
  },{
    id: 9,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999,
    inStock: true,  
    specifications: [] 
  },{
    id: 10,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999,
    inStock: true,  
    specifications: [] 
  },{
    id: 11,
    name: "GPS Rover System",
    category: "Field Equipment",
    image: equipment1, 
    description: "Portable GPS rover for field data collection",
    price: 6999,
    inStock: true,  
    specifications: [] 
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
    "Geossotech is a trusted provider of advanced geospatial technology, supporting professionals across geospatial and surveying, engineering and construction, agriculture and aggrotech, oil and gas / energy, real estate and infrastructure, government agencies, surveying institutions, and hydrographic operations.",
    "We deliver a complete geospatial ecosystem, supplying high-performance GNSS receivers, total stations, 3D laser scanners, professional drones, side scan sonars, echo sounders, autosteering systems, CORS network services, and a wide range of supporting accessories and GIS software's.",
    "We go beyond equipment supply. We calibrate and repair equipment, provide professional training, offer equipment rental, and deliver advanced services including aerial surveying, mapping, inspection, agricultural monitoring, hydrographic data acquisition, and 3D scanning, ensuring reliable data capture across land, water, and air.",
    "From equipping field crews, institutions, and agencies to supporting large-scale infrastructure, energy, agricultural, and marine projects, we stand as a single, dependable source for end-to-end geospatial solutions. We are the ecosystem.",
  ],
  videoUrl: "https://www.youtube.com/embed/2SrceTLF5MU?autoplay=1"
};