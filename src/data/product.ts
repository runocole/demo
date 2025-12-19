// ============================================
// IMAGE IMPORTS
// ============================================

// Hero slides
import heroSlide1 from "../assets/hero-slide-1.jpg";
import heroSlide2 from "../assets/hero-slide-2.jpg";
import heroSlide3 from "../assets/hero-slide-3.jpg";
import heroSlide4 from "../assets/hero-slide-4.jpg";
import heroSlide5 from "../assets/hero-slide-5.jpg";

// Featured Equipment
import agrast30 from "../assets/agrast30.jpg";
import t30 from "../assets/t30.jpg";
import dji from "../assets/dji.jpg";
import ts20 from "../assets/ts20.jpg";
import gpsmap from "../assets/gpsmap.jpg";
import equipment6 from "../assets/equipment6.jpg";
import rc2 from "../assets/rc2.jpg";
import datacollector from "../assets/datacollector.jpg";
import p6 from "../assets/p6.webp";
import matrice4 from "../assets/matrice4.webp";
import djiagras from "../assets/djiagras.webp";
// GNSS Receivers
import t20 from "../assets/t20.jpg";
import n5 from "../assets/n5.jpg";
import mars from "../assets/mars.jpg";

// RTK Tablets
import p8 from "../assets/p8.webp";

// Total Stations
import comnav from "../assets/comnav.jpg";
import foif from "../assets/foif.jpg";
import leicats from "../assets/leicats.jpg";

// Drones
import matrice350 from "../assets/matrice350.jpg";
import mavic3e from "../assets/mavic3e.jpg";
import joyance from "../assets/joyance.jpg";
import agrast50 from "../assets/agrast50.jpg";

// Payloads
import amil from "../assets/amil.jpg";
import na730 from "../assets/na730.jpg";
import ds4 from "../assets/ds4.jpg";

// Echosounders
import sv600 from "../assets/sv600.webp";
import sinognss from "../assets/sinognss.jpg";

// Laser Scanners
import ls600 from "../assets/ls 600.webp";
import ls300 from "../assets/ls300.webp";

// Auto-steering Systems
import ag501 from "../assets/ag501.jpg";
import ag502 from "../assets/ag502.jpg";

// Accessories
import tripod from "../assets/tripod.jpg";
import rangingpole from "../assets/rangingpole.jpg";
import steeltape from "../assets/steeltape.jpg";
import longwhip from "../assets/longwhip.jpg";
import tribach from "../assets/tribach.jpg";
import zenmuse from "../assets/zenmuse.jpg";
import externalradio from "../assets/externalradio.jpg";
import ingco from "../assets/ingco.jpg";
import levelingstaff from "../assets/levelingstaff.jpg";
import spindle from "../assets/spindle.jpg";
import controllerbracket from "../assets/controllerbracket.jpg";
import gnsscables from "../assets/gnsscables.jpg";

// ============================================
// TYPES
// ============================================
import type { Product, ProductCategory } from "../types/product";

export interface Slide {
  image: string;
  title: string;
  subtitle: string;
  position: 'left' | 'center' | 'right';
  mobileTitle?: string; // Mobile-optimized shorter title
  mobileSubtitle?: string; // Mobile-optimized shorter subtitle
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
  mobileImage?: string; // Optional mobile-optimized image
  mobileDescription?: string; // Shorter description for mobile
  popularOnMobile?: boolean; // Flag for mobile prioritization
}

// ============================================
// MOBILE HELPER FUNCTIONS
// ============================================

// Helper to get mobile-optimized product name
const getMobileName = (name: string): string => {
  if (name.length > 25) {
    // Truncate long names for mobile
    return name.substring(0, 22) + '...';
  }
  return name;
};

// Helper to get mobile-optimized description
const getMobileDescription = (description: string): string => {
  if (description.length > 80) {
    // Truncate long descriptions for mobile cards
    return description.substring(0, 77) + '...';
  }
  return description;
};

// Helper to check if product should be prioritized on mobile
const isPopularOnMobile = (product: CarouselItem): boolean => {
  // Flag popular/essential items for mobile display
  const mobilePopularCategories = [
    "GNSS Receiver",
    "Handheld GPS",
    "Accessory",
    "Drones",
    "Total Station"
  ];
  
  const mobilePopularNames = [
    "T30 GNSS Receiver",
    "GPSMAP 67i",
    "Survey Tripod",
    "DJI MAVIC 2 PRO",
    "AGRAS T30"
  ];
  
  return (
    mobilePopularCategories.includes(product.category || "") ||
    mobilePopularNames.includes(product.name) ||
    product.price <= 1000 // Affordable items popular on mobile
  );
};

// ============================================
// CONSTANTS
// ============================================
export const SLIDES: Slide[] = [
  { 
    image: heroSlide1, 
    title: "L3 LiDAR System", 
    subtitle: "High-Density Point Cloud Data for Mapping and Analysis",
    mobileTitle: "L3 LiDAR System",
    mobileSubtitle: "Advanced mapping technology",
    position: 'left'
  },
  { 
    image: heroSlide2, 
    title: "TS-07 Total Station", 
    subtitle: "Automated Measurements for Survey and Engineering Work",
    mobileTitle: "TS-07 Total Station",
    mobileSubtitle: "Precision survey equipment",
    position: 'left'
  },
  { 
    image: heroSlide3, 
    title: "Matrice 400 Drone", 
    subtitle: "Aerial Data Capture for Mapping, Inspection, and Monitoring",
    mobileTitle: "Matrice 400 Drone",
    mobileSubtitle: "Aerial survey solutions",
    position: 'left'
  },
  { 
    image: heroSlide4, 
    title: "Jupiter Laser RTK", 
    subtitle: "Reliable Positioning for Surveying and Mapping Operations",
    mobileTitle: "Jupiter Laser RTK",
    mobileSubtitle: "High-precision positioning",
    position: 'left'
  },
  { 
    image: heroSlide5, 
    title: "Unbeatable GNSS Receivers",
    subtitle: "T10, T30 & MARS Series for High-Precision Positioning",
    mobileTitle: "GNSS Receivers",
    mobileSubtitle: "T10, T30 & MARS Series",
    position: 'left'
  },
];

// Mobile-optimized slides (shorter for mobile)
export const MOBILE_SLIDES: Slide[] = SLIDES.map(slide => ({
  ...slide,
  title: slide.mobileTitle || slide.title,
  subtitle: slide.mobileSubtitle || slide.subtitle
}));

// ============================================
// CONSTANTS - FEATURED_EQUIPMENT Section
// ============================================

export const FEATURED_EQUIPMENT: CarouselItem[] = [
  // GNSS RECEIVERS → "GNSS Receiver" (Existing + New)
  {
    id: 2,
    name: "T30 GNSS Receiver",
    category: "GNSS Receiver",
    image: t30, 
    description: "Professional GNSS receiver with high precision",
    mobileDescription: "High-precision GNSS receiver",
    price: 3799,
    inStock: true,
    popularOnMobile: true
  },
  {
    id: 6,
    name: "Jupiter Laser RTK",
    category: "GNSS Receiver",
    image: equipment6, 
    description: "High-precision GNSS receiver with multi-frequency technology",
    mobileDescription: "Multi-frequency GNSS receiver",
    price: 4999,
    inStock: true,
    popularOnMobile: true
  },
  // New GNSS Receivers
  {
    id: 12,
    name: "T20",
    category: "GNSS Receiver",
    image: t20, 
    description: "Reliable GNSS receiver for surveying operations",
    mobileDescription: "Reliable surveying GNSS",
    price: 3799, 
    inStock: true
  },
  {
    id: 13,
    name: "N5",
    category: "GNSS Receiver",
    image: n5, 
    description: "Compact GNSS receiver with advanced features",
    mobileDescription: "Compact advanced GNSS",
    price: 3799,
    inStock: true
  },
  {
    id: 14,
    name: "Mars Laser RTK",
    category: "GNSS Receiver",
    image: mars, 
    description: "Professional RTK GNSS receiver",
    mobileDescription: "Professional RTK receiver",
    price: 3799,
    inStock: true
  },

  // RTK TABLETS → "RTK Tablets" (New Category)
  {
    id: 15,
    name: "P6 Handheld",
    category: "RTK Tablets",
    image: p6, 
    description: "Handheld RTK tablet for field operations",
    mobileDescription: "Handheld field tablet",
    price: 1344,
    inStock: true
  },
  {
    id: 16,
    name: "P8 Handheld",
    category: "RTK Tablets",
    image: p8, 
    description: "Advanced handheld RTK tablet",
    mobileDescription: "Advanced handheld tablet",
    price: 1793,
    inStock: true
  },

  // TOTAL STATIONS → "Total Station" (Existing + New)
  {
    id: 4,
    name: "Leica TS20",
    category: "Total Station",
    image: ts20, 
    description: "Professional survey total station",
    mobileDescription: "Professional total station",
    price: 15000,
    inStock: true,
    popularOnMobile: true
  },
  // New Total Stations
  {
    id: 17,
    name: "COMNAV TS-C200",
    category: "Total Station",
    image: comnav, 
    description: "Professional total station",
    mobileDescription: "Survey total station",
    price: 3799,
    inStock: true
  },
  {
    id: 18,
    name: "FOIF RTS 332",
    category: "Total Station",
    image: foif, 
    description: "Robotic total station",
    mobileDescription: "Robotic total station",
    price: 3799,
    inStock: true
  },
  {
    id: 19,
    name: "LEICA FLEXLINE TS07",
    category: "Total Station",
    image: leicats, 
    description: "Advanced robotic total station",
    mobileDescription: "Advanced robotic station",
    price: 14482,
    inStock: true
  },

  // DRONES → "Drones" (Existing + New)
  {
    id: 1,
    name: "AGRAS T30",
    category: "Drones",
    image: agrast30, 
    description: "Agricultural spray drone",
    mobileDescription: "Agricultural spray drone",
    price: 4999,
    inStock: true,
    popularOnMobile: true
  },
  {
    id: 3,
    name: "DJI MAVIC 2 PRO",
    category: "Drones",
    image: dji, 
    description: "Professional photography drone",
    mobileDescription: "Professional photography drone",
    price: 12999,
    inStock: true,
    popularOnMobile: true
  },
  {
    id: 7,
    name: "AIR 35C RC2",
    category: "Drones",
    image: rc2, 
    description: "Portable survey drone",
    mobileDescription: "Portable survey drone",
    price: 6999,
    inStock: true
  },
  {
    id: 10,
    name: "Matrice 4 Thermal",
    category: "Drones",
    image: matrice4, 
    description: "Thermal imaging drone",
    mobileDescription: "Thermal imaging drone",
    price: 12068,
    inStock: true
  },
  {
    id: 11,
    name: "DJI Agras",
    category: "Drones",
    image: djiagras, 
    description: "Agricultural drone system",
    mobileDescription: "Agricultural drone system",
    price: 6999,
    inStock: true
  },
  // New Drones
  {
    id: 20,
    name: "DJI MATRICE 350",
    category: "Drones",
    image: matrice350, 
    description: "Professional survey drone",
    mobileDescription: "Professional survey drone",
    price: 14482,
    inStock: true
  },
  {
    id: 21,
    name: "MAVIC 3 ENTERPRISE",
    category: "Drones",
    image: mavic3e, 
    description: "Enterprise-grade drone",
    mobileDescription: "Enterprise-grade drone",
    price: 6896,
    inStock: true
  },
  {
    id: 22,
    name: "JOYANCE JT50-404",
    category: "Drones",
    image: joyance, 
    description: "Industrial drone platform",
    mobileDescription: "Industrial drone platform",
    price: 24137,
    inStock: true
  },
  {
    id: 23,
    name: "DJI AGRAS T50",
    category: "Drones",
    image: agrast50, 
    description: "Advanced agricultural drone",
    mobileDescription: "Advanced agricultural drone",
    price: 35862,
    inStock: true
  },

  // PAYLOADS → "Payloads" (Existing + New)
  {
    id: 24,
    name: "ZENMUSE L2",
    category: "Payloads",
    image: zenmuse, 
    description: "LiDAR payload for drones",
    mobileDescription: "LiDAR drone payload",
    price: 15865,
    inStock: true
  },
  // New Payloads
  {
    id: 25,
    name: "FOIF AMIL 1 LASER",
    category: "Payloads",
    image: amil, 
    description: "Laser scanning payload",
    mobileDescription: "Laser scanning payload",
    price: 620, 
    inStock: true
  },
  {
    id: 26,
    name: "LEICA NA730",
    category: "Payloads",
    image: na730, 
    description: "GNSS antenna",
    mobileDescription: "GNSS antenna",
    price: 1344,
    inStock: true
  },
  {
    id: 27,
    name: "COMNAV DS4",
    category: "Payloads",
    image: ds4, 
    description: "Data collector",
    mobileDescription: "Data collector",
    price: 379,
    inStock: true
  },

  // ECHOSOUNDERS → "Echosounder" (New Category)
  {
    id: 28,
    name: "SV600 UNMANNED VESSEL",
    category: "EchoSounder",
    image: sv600, 
    description: "Unmanned survey vessel with echosounder",
    mobileDescription: "Unmanned survey vessel",
    price: 25517,
    inStock: true
  },
  {
    id: 29,
    name: "SINOGNSS ECHOSOUNDER",
    category: "EchoSounder",
    image: sinognss, 
    description: "Professional echosounder system",
    mobileDescription: "Professional echosounder",
    price: 9310,
    inStock: true
  },

  // LASER SCANNERS → "Laser Scanner" (New Category)
  {
    id: 30,
    name: "LS600",
    category: "Laser Scanner",
    image: ls600, 
    description: "High-precision laser scanner",
    mobileDescription: "High-precision laser scanner",
    price: 22068,
    inStock: true
  },
  {
    id: 31,
    name: "LS300",
    category: "Laser Scanner",
    image: ls300, 
    description: "Professional laser scanner",
    mobileDescription: "Professional laser scanner",
    price: 20689,
    inStock: true
  },

  // AUTO-STEERING SYSTEMS → "Auto-steering Systems" (New Category)
  {
    id: 32,
    name: "AG 501 PRO",
    category: "Auto-steering Systems",
    image: ag501, 
    description: "Agricultural auto-steering system",
    mobileDescription: "Auto-steering system",
    price: 4413,
    inStock: true
  },
  {
    id: 33,
    name: "AG 502",
    category: "Auto-steering Systems",
    image: ag502, 
    description: "Advanced auto-steering system",
    mobileDescription: "Advanced auto-steering",
    price: 5517,
    inStock: true
  },

  // FIELD EQUIPMENT → "Handheld GPS" (Existing - Preserved)
  {
    id: 5,
    name: "GPSMAP 67i",
    category: "Handheld GPS",
    image: gpsmap, 
    description: "Portable GPS rover for field data collection",
    mobileDescription: "Portable GPS rover",
    price: 6999,
    inStock: true,
    popularOnMobile: true
  },

  // DATA COLLECTORS → "Other" (Existing - Preserved)
  {
    id: 8,
    name: "GNSS Data Collector",
    category: "Other",
    image: datacollector, 
    description: "Portable GPS rover for field data collection",
    mobileDescription: "GNSS data collector",
    price: 6999,
    inStock: true
  }
];

// Mobile-optimized featured equipment (prioritized for mobile)
export const MOBILE_FEATURED_EQUIPMENT: CarouselItem[] = FEATURED_EQUIPMENT
  .map(item => ({
    ...item,
    popularOnMobile: isPopularOnMobile(item),
    mobileDescription: item.mobileDescription || getMobileDescription(item.description)
  }))
  .sort((a, b) => {
    // Sort by: popular items first, then price (affordable first), then name
    if (a.popularOnMobile && !b.popularOnMobile) return -1;
    if (!a.popularOnMobile && b.popularOnMobile) return 1;
    if (a.price !== b.price) return a.price - b.price;
    return a.name.localeCompare(b.name);
  });

// Accessories → "Accessory"
export const ACCESSORIES: CarouselItem[] = [
  // Support Equipment
  {
    id: 1,
    name: "Survey Tripod",
    category: "Accessory",
    image: tripod,
    description: "Professional survey tripod for stable measurements",
    mobileDescription: "Professional survey tripod",
    price: 299,
    inStock: true,
    popularOnMobile: true
  },
  {
    id: 5,
    name: "Tribach",
    category: "Accessory",
    image: tribach,
    description: "Rugged data collector for field operations",
    mobileDescription: "Survey tribach",
    price: 599,
    inStock: true
  },

  // Measurement Tools
  {
    id: 2,
    name: "Ranging Pole",
    category: "Accessory",
    image: rangingpole,
    description: "Long-lasting lithium batteries for field equipment",
    mobileDescription: "Ranging pole",
    price: 149,
    inStock: true,
    popularOnMobile: true
  },
  {
    id: 3,
    name: "Steel Tape",
    category: "Accessory",
    image: steeltape,
    description: "Durable carrying case for equipment protection",
    mobileDescription: "Steel measuring tape",
    price: 89,
    inStock: true,
    popularOnMobile: true
  },
  {
    id: 6,
    name: "ZENMUSE L2",
    category: "Accessory",
    image: zenmuse,
    description: "Laser target for accurate distance measurements",
    mobileDescription: "ZENMUSE L2 payload",
    price: 79,
    inStock: true
  },
  {
    id: 9,
    name: "Leveling Staff",
    category: "Accessory",
    image: levelingstaff,
    description: "Laser target for accurate distance measurements",
    mobileDescription: "Leveling staff",
    price: 79,
    inStock: true
  },
  {
    id: 10,
    name: "Spindle",
    category: "Accessory",
    image: spindle,
    description: "Laser target for accurate distance measurements",
    mobileDescription: "Survey spindle",
    price: 79,
    inStock: true
  },
  {
    id: 8,
    name: "INGCO Measuring Wheel",
    category: "Accessory",
    image: ingco,
    description: "Professional calibration kit for survey instruments",
    mobileDescription: "Measuring wheel",
    price: 159,
    inStock: true
  },

  // Signal Equipment
  {
    id: 4,
    name: "Long Whip Antenna",
    category: "Accessory",
    image: longwhip,
    description: "High-precision GPS antenna for better signal reception",
    mobileDescription: "Long whip antenna",
    price: 199,
    inStock: true
  },
  {
    id: 7,
    name: "External Radio",
    category: "Accessory",
    image: externalradio,
    description: "Extended flight time batteries for survey drones",
    mobileDescription: "External radio",
    price: 249,
    inStock: true
  },
  {
    id: 12,
    name: "GNSS Data Link Cables",
    category: "Accessory",
    image: gnsscables,
    description: "Laser target for accurate distance measurements",
    mobileDescription: "GNSS cables",
    price: 79,
    inStock: true
  },

  // Mounting Hardware
  {
    id: 11,
    name: "Controller Bracket",
    category: "Accessory",
    image: controllerbracket,
    description: "Laser target for accurate distance measurements",
    mobileDescription: "Controller bracket",
    price: 79,
    inStock: true
  }
];

// Mobile-optimized accessories (prioritized for mobile)
export const MOBILE_ACCESSORIES: CarouselItem[] = ACCESSORIES
  .map(item => ({
    ...item,
    popularOnMobile: isPopularOnMobile(item),
    mobileDescription: item.mobileDescription || getMobileDescription(item.description)
  }))
  .sort((a, b) => {
    // Sort by: popular items first, then price (affordable first), then name
    if (a.popularOnMobile && !b.popularOnMobile) return -1;
    if (!a.popularOnMobile && b.popularOnMobile) return 1;
    if (a.price !== b.price) return a.price - b.price;
    return a.name.localeCompare(b.name);
  });

// Combined Products for BuyNow Page
export const PRODUCTS: Product[] = [
  ...ACCESSORIES.map(item => ({
    id: `acc-${item.id}`,
    name: item.name,
    category: "Accessory" as ProductCategory,
    price: item.price,
    description: item.description,
    mobileDescription: item.mobileDescription,
    image: item.image,
    inStock: true,
    popularOnMobile: item.popularOnMobile
  })),
  ...FEATURED_EQUIPMENT.map(item => ({
    id: `eq-${item.id}`,
    name: item.name,
    category: (item.category ?? "Other") as ProductCategory,
    price: item.price,
    description: item.description,
    mobileDescription: item.mobileDescription,
    image: item.image,
    inStock: true,
    popularOnMobile: item.popularOnMobile
  }))
];

// Mobile-optimized products (for mobile views)
export const MOBILE_PRODUCTS: Product[] = PRODUCTS
  .map(product => ({
    ...product,
    name: getMobileName(product.name),
    description: product.mobileDescription || getMobileDescription(product.description)
  }))
  .sort((a, b) => {
    // Sort mobile products: popular items first, then affordable, then category
    const aPopular = a.popularOnMobile || false;
    const bPopular = b.popularOnMobile || false;
    
    if (aPopular && !bPopular) return -1;
    if (!aPopular && bPopular) return 1;
    if (a.price !== b.price) return a.price - b.price;
    return a.category.localeCompare(b.category);
  });

// About Content
export const ABOUT_CONTENT = {
  title: "Precision from the Ground Up and the Sky Down",
  mobileTitle: "Precision Survey Solutions",
  description: [
    "Geossotech is a trusted provider of advanced geospatial technology, supporting professionals across geospatial and surveying, engineering and construction, agriculture and aggrotech, oil and gas / energy, real estate and infrastructure, government agencies, surveying institutions, and hydrographic operations.",
    "We deliver a complete geospatial ecosystem, supplying high-performance GNSS receivers, total stations, 3D laser scanners, professional drones, side scan sonars, echo sounders, autosteering systems, CORS network services, and a wide range of supporting accessories and GIS software's.",
    "We go beyond equipment supply. We calibrate and repair equipment, provide professional training, offer equipment rental, and deliver advanced services including aerial surveying, mapping, inspection, agricultural monitoring, hydrographic data acquisition, and 3D scanning, ensuring reliable data capture across land, water, and air.",
    "From equipping field crews, institutions, and agencies to supporting large-scale infrastructure, energy, agricultural, and marine projects, we stand as a single, dependable source for end-to-end geospatial solutions. We are the ecosystem.",
  ],
  mobileDescription: [
    "Trusted provider of geospatial technology for surveying, engineering, agriculture, energy, and infrastructure.",
    "Complete ecosystem: GNSS, total stations, drones, laser scanners, CORS network, and support services.",
    "Beyond equipment: calibration, training, rental, and advanced surveying services.",
    "Your single source for end-to-end geospatial solutions across land, water, and air.",
  ],
  videoUrl: "https://www.youtube.com/embed/2SrceTLF5MU?autoplay=1"
};

// Mobile-optimized about content
export const MOBILE_ABOUT_CONTENT = {
  ...ABOUT_CONTENT,
  title: ABOUT_CONTENT.mobileTitle || ABOUT_CONTENT.title,
  description: ABOUT_CONTENT.mobileDescription || ABOUT_CONTENT.description
};

// ============================================
// MOBILE-SPECIFIC UTILITIES
// ============================================

// Get mobile-optimized product list (for mobile screens)
export const getMobileProductList = (category?: ProductCategory): Product[] => {
  const products = MOBILE_PRODUCTS;
  
  if (category) {
    return products.filter(p => p.category === category);
  }
  
  return products;
};

// Get popular mobile products (for featured section on mobile)
export const getPopularMobileProducts = (limit: number = 6): Product[] => {
  return MOBILE_PRODUCTS
    .filter(p => p.popularOnMobile)
    .slice(0, limit);
};

// Get affordable products for mobile (under $1000)
export const getAffordableMobileProducts = (limit: number = 8): Product[] => {
  return MOBILE_PRODUCTS
    .filter(p => p.price <= 1000)
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
};

// Get products by category for mobile (with mobile optimization)
export const getMobileProductsByCategory = (category: ProductCategory): Product[] => {
  return MOBILE_PRODUCTS.filter(p => p.category === category);
};