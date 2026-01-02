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
    description: "High-precision GNSS receiver with multi-frequency support for RTK positioning",
    mobileDescription: "Multi-frequency GNSS RTK receiver",
    price: 3799,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "Multi-frequency support: GPS L1/L2, GLONASS L1/L2, Galileo E1/E5, BeiDou B1/B2",
      "Positioning accuracy: Horizontal 8mm + 1ppm, Vertical 15mm + 1ppm",
      "RTK initialization time: <10 seconds",
      "IP rating: IP67 waterproof and dustproof",
      "Battery life: Up to 10 hours continuous operation",
      "Communication: Bluetooth 5.0, Wi-Fi, UHF radio",
      "Operating temperature: -40°C to 65°C"
    ]
  },
  {
    id: 6,
    name: "Jupiter Laser RTK",
    category: "GNSS Receiver",
    image: equipment6, 
    description: "GNSS receiver with integrated laser for high-accuracy positioning solutions",
    mobileDescription: "GNSS with integrated laser",
    price: 4999,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "Dual-sensor system: GNSS + 1000m laser rangefinder",
      "GNSS channels: 672 parallel channels",
      "Laser accuracy: ±1.5mm at 100m",
      "Angle accuracy: 1 arcsecond tilt sensor",
      "Communication: Built-in 4G, Wi-Fi, Bluetooth",
      "Data collector: Integrated Android tablet",
      "Applications: Construction layout, topographic surveys"
    ]
  },
  // New GNSS Receivers
  {
    id: 12,
    name: "T20",
    category: "GNSS Receiver",
    image: t20, 
    description: "Compact GNSS receiver offering reliable centimeter-level positioning accuracy",
    mobileDescription: "Compact centimeter-level GNSS",
    price: 3799, 
    inStock: true,
    specifications: [
      "Dual-frequency GNSS: GPS L1/L2, GLONASS L1/L2",
      "Positioning accuracy: Horizontal 10mm + 1ppm, Vertical 20mm + 1ppm",
      "RTK initialization: Typically <15 seconds",
      "IP rating: IP66 water and dust resistant",
      "Battery: Removable 4500mAh battery (8 hours)",
      "Connectivity: Bluetooth 4.2, external UHF support",
      "Weight: 1.2kg including battery"
    ]
  },
  {
    id: 13,
    name: "N5",
    category: "GNSS Receiver",
    image: n5, 
    description: "Multi-constellation GNSS receiver with built-in UHF radio for RTK corrections",
    mobileDescription: "Multi-constellation GNSS with UHF",
    price: 3799,
    inStock: true,
    specifications: [
      "All constellations: GPS, GLONASS, Galileo, BeiDou, QZSS, IRNSS",
      "Accuracy: 8mm + 1ppm RTK, 1.5m SBAS",
      "Built-in UHF radio: 410-470MHz, up to 20km range",
      "Data storage: 16GB internal memory",
      "Display: 2.4-inch sunlight-readable LCD",
      "Operating system: Custom Linux-based",
      "Communication: 4G, Wi-Fi, Bluetooth 5.1"
    ]
  },
  {
    id: 14,
    name: "Mars Laser RTK",
    category: "GNSS Receiver",
    image: mars, 
    description: "Professional RTK GNSS system with laser ranging capabilities",
    mobileDescription: "RTK GNSS with laser ranging",
    price: 3799,
    inStock: true,
    specifications: [
      "Integrated laser rangefinder: Up to 1000m range",
      "GNSS accuracy: 5mm + 0.5ppm (H), 10mm + 0.5ppm (V)",
      "Laser accuracy: ±2mm at 100m",
      "Multi-frequency: All major constellations",
      "IMU tilt compensation: Up to 15°",
      "Battery: Hot-swappable dual batteries",
      "Applications: Powerline, forestry, mining surveys"
    ]
  },

  // RTK TABLETS → "RTK Tablets" (New Category)
  {
    id: 15,
    name: "P6 Handheld",
    category: "RTK Tablets",
    image: p6, 
    description: "Rugged handheld RTK tablet with Android OS for field surveying",
    mobileDescription: "Rugged Android RTK tablet",
    price: 1344,
    inStock: true,
    specifications: [
      "Display: 6-inch sunlight-readable touchscreen (1280×720)",
      "Processor: Octa-core 2.0GHz",
      "RAM/Storage: 4GB RAM, 64GB storage (expandable)",
      "Battery: 6000mAh (10+ hours)",
      "GNSS: Built-in multi-frequency receiver",
      "OS: Android 11 with custom survey software",
      "Durability: IP68, MIL-STD-810G"
    ]
  },
  {
    id: 16,
    name: "P8 Handheld",
    category: "RTK Tablets",
    image: p8, 
    description: "High-performance handheld RTK tablet with large display for field operations",
    mobileDescription: "High-performance RTK tablet",
    price: 1793,
    inStock: true,
    specifications: [
      "Display: 8-inch HD touchscreen (1920×1200)",
      "Processor: Octa-core 2.4GHz with dedicated GPU",
      "RAM/Storage: 6GB RAM, 128GB storage",
      "Battery: 8000mAh (12+ hours)",
      "GNSS: High-precision multi-constellation",
      "Camera: 13MP rear, 8MP front",
      "Connectivity: 5G, Wi-Fi 6, Bluetooth 5.2"
    ]
  },

  // TOTAL STATIONS → "Total Station" (Existing + New)
  {
    id: 4,
    name: "Leica TS20",
    category: "Total Station",
    image: ts20, 
    description: "High-accuracy robotic total station with automatic target recognition",
    mobileDescription: "Robotic total station",
    price: 15000,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "Angle accuracy: 1\" (0.3 mgon)",
      "Distance measurement: 0.6mm + 1ppm (prism), 2mm + 2ppm (reflectorless)",
      "Range: Up to 3500m to prism, 1000m reflectorless",
      "ATR: Automatic target recognition and tracking",
      "Motorized: Full servo drive for robotic operation",
      "Display: Color touchscreen with sunlight readability",
      "Software: Leica Captivate field software"
    ]
  },
  // New Total Stations
  {
    id: 17,
    name: "COMNAV TS-C200",
    category: "Total Station",
    image: comnav, 
    description: "Digital total station with angle measurement accuracy up to 2 seconds",
    mobileDescription: "Digital total station",
    price: 3799,
    inStock: true,
    specifications: [
      "Angle accuracy: 2\"",
      "Distance accuracy: 2mm + 2ppm",
      "Measurement range: 3000m to prism, 500m reflectorless",
      "Display: Dual-line LCD with backlight",
      "Data storage: 10,000 points internal memory",
      "Battery: 7.4V Li-ion (8 hours continuous)",
      "Weight: 5.5kg (with battery)"
    ]
  },
  {
    id: 18,
    name: "FOIF RTS 332",
    category: "Total Station",
    image: foif, 
    description: "Robotic total station with reflectorless measurement up to 500 meters",
    mobileDescription: "Robotic total station",
    price: 3799,
    inStock: true,
    specifications: [
      "Angle accuracy: 2\"",
      "Distance: 3mm + 2ppm (prism), 5mm + 2ppm (reflectorless)",
      "Reflectorless range: Up to 500m",
      "Motorization: Servo motors for automatic targeting",
      "Software: Windows CE based data collector",
      "Communication: Bluetooth, USB, RS232",
      "Applications: Construction, monitoring, topographic surveys"
    ]
  },
  {
    id: 19,
    name: "LEICA FLEXLINE TS07",
    category: "Total Station",
    image: leicats, 
    description: "Professional robotic total station with advanced tracking technology",
    mobileDescription: "Advanced robotic station",
    price: 14482,
    inStock: true,
    specifications: [
      "Angle accuracy: 1\", 3\", or 5\" options",
      "Distance: 1.5mm + 2ppm (prism), 2mm + 2ppm (RL)",
      "Range: Up to 3500m with prism",
      "PowerDrive technology: Fast and precise automatic aiming",
      "Lock-in time: <1 second for moving prism",
      "Display: High-resolution color touchscreen",
      "Compatibility: Works with all Leica accessories"
    ]
  },

  // DRONES → "Drones" (Existing + New)
  {
    id: 1,
    name: "AGRAS T30",
    category: "Drones",
    image: agrast30, 
    description: "Agricultural spraying drone with 30kg payload capacity for precision farming",
    mobileDescription: "Agricultural spray drone",
    price: 4999,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "Spraying system: 30kg payload, 16L spray tank",
      "Spray width: 7-9m (adjustable)",
      "Coverage: Up to 16 hectares per hour",
      "Battery: 15,000mAh (15-20 minutes flight time)",
      "Radar system: Dual-phased array radar for terrain following",
      "Camera: 4K FPV camera with night vision",
      "Applications: Agriculture, forestry, pest control"
    ]
  },
  {
    id: 3,
    name: "DJI MAVIC 2 PRO",
    category: "Drones",
    image: dji, 
    description: "Compact professional drone with Hasselblad camera for aerial photography",
    mobileDescription: "Professional photography drone",
    price: 12999,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "Camera: Hasselblad L1D-20c, 1\" CMOS, 20MP",
      "Video: 4K HDR at 30fps",
      "Flight time: Up to 31 minutes",
      "Range: 8km transmission (FCC), 18km max flight distance",
      "Sensors: Omnidirectional obstacle sensing",
      "Gimbal: 3-axis mechanical (pitch, roll, yaw)",
      "Weight: 907g (including battery)"
    ]
  },
  {
    id: 7,
    name: "AIR 35C RC2",
    category: "Drones",
    image: rc2, 
    description: "Portable survey drone with RTK module for high-precision mapping",
    mobileDescription: "Portable survey drone",
    price: 6999,
    inStock: true,
    specifications: [
      "Camera: 35mm full-frame, 45MP",
      "RTK module: Integrated centimeter-level positioning",
      "Flight time: Up to 35 minutes",
      "Mapping accuracy: 1.5cm horizontal, 2.5cm vertical",
      "Coverage: 2.5 km² per flight (120m altitude)",
      "Software: DJI Terra for processing",
      "Applications: Surveying, mapping, inspection"
    ]
  },
  {
    id: 10,
    name: "Matrice 4 Thermal",
    category: "Drones",
    image: matrice4, 
    description: "Industrial drone with dual thermal and visual cameras for inspections",
    mobileDescription: "Thermal imaging drone",
    price: 12068,
    inStock: true,
    specifications: [
      "Thermal camera: Radiometric FLIR, 640×512 resolution",
      "Visual camera: 48MP, 1/2\" CMOS",
      "Flight time: Up to 45 minutes",
      "IP rating: IP45 water and dust resistant",
      "Obstacle sensing: Omnidirectional with spotlights",
      "Heating system: Battery heating for cold weather",
      "Applications: Infrastructure inspection, search & rescue"
    ]
  },
  {
    id: 11,
    name: "DJI Agras",
    category: "Drones",
    image: djiagras, 
    description: "Agricultural drone platform for spraying and spreading applications",
    mobileDescription: "Agricultural drone system",
    price: 6999,
    inStock: true,
    specifications: [
      "Spraying system: 30kg payload, 16L spray tank",
      "Spreading system: 25kg payload (granular materials)",
      "Flight time: Up to 25 minutes with full load",
      "Radar: Binocular vision system for terrain following",
      "Camera: 4K FPV with 10x digital zoom",
      "Applications: Precision agriculture, forestry management"
    ]
  },
  // New Drones
  {
    id: 20,
    name: "DJI MATRICE 350",
    category: "Drones",
    image: matrice350, 
    description: "Enterprise-grade drone platform with triple redundancy and 55 min flight time",
    mobileDescription: "Enterprise survey drone",
    price: 14482,
    inStock: true,
    specifications: [
      "Flight time: Up to 55 minutes with TB65 batteries",
      "Payload: Triple payload capacity (2.7kg each)",
      "Redundancy: Triple IMU, compass, and barometer",
      "Transmission: O3 Enterprise, 20km range",
      "IP rating: IP55 for all-weather operation",
      "RTK: Integrated high-precision GNSS module",
      "Applications: Power inspection, public safety, surveying"
    ]
  },
  {
    id: 21,
    name: "MAVIC 3 ENTERPRISE",
    category: "Drones",
    image: mavic3e, 
    description: "Compact enterprise drone with 4/3 CMOS camera and RTK module",
    mobileDescription: "Compact enterprise drone",
    price: 6896,
    inStock: true,
    specifications: [
      "Camera: 4/3 CMOS, 20MP, mechanical shutter",
      "RTK module: Plug-in centimeter-level positioning",
      "Flight time: Up to 45 minutes",
      "Mapping accuracy: 3cm horizontal, 5cm vertical",
      "Zoom camera: 56× hybrid zoom (12MP tele)",
      "Spotlight: 2400 lumens for night operations",
      "Speaker: 100dB for audible announcements"
    ]
  },
  {
    id: 22,
    name: "JOYANCE JT50-404",
    category: "Drones",
    image: joyance, 
    description: "Heavy-lift industrial drone platform with 50kg payload capacity",
    mobileDescription: "Heavy-lift industrial drone",
    price: 24137,
    inStock: true,
    specifications: [
      "Payload capacity: 50kg maximum takeoff weight",
      "Flight time: Up to 40 minutes with 20kg payload",
      "Frame: Carbon fiber composite construction",
      "Power: 12S LiPo battery system",
      "Control: Professional remote controller with telemetry",
      "Applications: Heavy lifting, industrial inspections, cargo transport"
    ]
  },
  {
    id: 23,
    name: "DJI AGRAS T50",
    category: "Drones",
    image: agrast50, 
    description: "Advanced agricultural drone with 50kg spraying capacity and active phased array radar",
    mobileDescription: "Advanced agricultural drone",
    price: 35862,
    inStock: true,
    specifications: [
      "Spraying capacity: 50kg payload, 40L spray tank",
      "Spreading capacity: 75kg payload (seeds, fertilizer)",
      "Radar: Active phased array for 3D obstacle avoidance",
      "Coverage: Up to 21 hectares per hour",
      "Battery: Dual battery system with fast charging",
      "Camera: 4K FPV with night vision",
      "Applications: Large-scale agriculture, forestry"
    ]
  },

  // PAYLOADS → "Payloads" (Existing + New)
  {
    id: 24,
    name: "ZENMUSE L2",
    category: "Payloads",
    image: zenmuse, 
    description: "Integrated LiDAR payload with RGB camera for 3D mapping applications",
    mobileDescription: "Integrated LiDAR payload",
    price: 15865,
    inStock: true,
    specifications: [
      "LiDAR: 3 returns, 240,000 points/second",
      "RGB camera: 20MP, 4/3\" CMOS",
      "Accuracy: 3cm vertical, 5cm horizontal",
      "Range: Up to 250m (reflectivity ≥ 80%)",
      "FOV: 70.4° (horizontal) × 4.5° (vertical)",
      "Weight: 930g (including gimbal)",
      "Compatibility: DJI Matrice 300/350 series"
    ]
  },
  // New Payloads
  {
    id: 25,
    name: "FOIF AMIL 1 LASER",
    category: "Payloads",
    image: amil, 
    description: "Compact laser rangefinder module for distance measurement applications",
    mobileDescription: "Laser rangefinder module",
    price: 620, 
    inStock: true,
    specifications: [
      "Measurement range: 0.05m to 1000m",
      "Accuracy: ±2mm at 100m",
      "Laser class: Class 1 (eye-safe)",
      "Measurement time: 0.3-3 seconds",
      "Communication: RS232, Bluetooth optional",
      "Power: 5V DC, <1W consumption",
      "Applications: Construction, forestry, surveying"
    ]
  },
  {
    id: 26,
    name: "LEICA NA730",
    category: "Payloads",
    image: na730, 
    description: "High-performance GNSS antenna with multi-frequency support",
    mobileDescription: "Multi-frequency GNSS antenna",
    price: 1344,
    inStock: true,
    specifications: [
      "Frequencies: GPS L1/L2/L5, GLONASS L1/L2, Galileo E1/E5, BeiDou B1/B2",
      "Phase center stability: <1mm",
      "Noise figure: <2.0dB",
      "Axial ratio: <3dB",
      "Connector: TNC female",
      "Cable length: 5m standard",
      "Applications: High-precision surveying, reference stations"
    ]
  },
  {
    id: 27,
    name: "COMNAV DS4",
    category: "Payloads",
    image: ds4, 
    description: "Compact data collector with Android OS for field surveying applications",
    mobileDescription: "Android data collector",
    price: 379,
    inStock: true,
    specifications: [
      "Display: 5-inch HD touchscreen (1280×720)",
      "Processor: Quad-core 1.8GHz",
      "RAM/Storage: 2GB RAM, 16GB storage",
      "Battery: 4000mAh (8+ hours)",
      "OS: Android 10",
      "Connectivity: Bluetooth, Wi-Fi, USB-C",
      "Durability: IP67 waterproof and dustproof"
    ]
  },

  // ECHOSOUNDERS → "EchoSounder" (New Category)
  {
    id: 28,
    name: "SV600 UNMANNED VESSEL",
    category: "EchoSounder",
    image: sv600, 
    description: "Autonomous surface vessel with integrated single-beam echosounder for bathymetry",
    mobileDescription: "Autonomous survey vessel",
    price: 25517,
    inStock: true,
    specifications: [
      "Vessel length: 1.2m",
      "Max speed: 5 m/s",
      "Endurance: 4-6 hours",
      "Echosounder frequency: 200kHz",
      "Depth range: 0.3-150m",
      "Accuracy: ±2cm + 0.1% of depth",
      "Applications: Bathymetric surveys, reservoir monitoring"
    ]
  },
  {
    id: 29,
    name: "SINOGNSS ECHOSOUNDER",
    category: "EchoSounder",
    image: sinognss, 
    description: "Professional single-beam echosounder system for hydrographic surveying",
    mobileDescription: "Single-beam echosounder",
    price: 9310,
    inStock: true,
    specifications: [
      "Frequency: Dual-frequency 200kHz/33kHz",
      "Depth range: 0.5-500m (200kHz), 2-1000m (33kHz)",
      "Accuracy: ±1cm + 0.1% of depth",
      "Beam width: 6° (200kHz), 12° (33kHz)",
      "Data output: RS232, NMEA 0183",
      "Power: 12-24V DC",
      "Applications: Hydrographic surveying, dredging, navigation"
    ]
  },

  // LASER SCANNERS → "Laser Scanner" (New Category)
  {
    id: 30,
    name: "LS600",
    category: "Laser Scanner",
    image: ls600, 
    description: "High-speed 3D laser scanner with 600m range for large-scale surveying",
    mobileDescription: "Long-range 3D scanner",
    price: 22068,
    inStock: true,
    specifications: [
      "Measurement range: 0.4-600m",
      "Scanning speed: Up to 1,000,000 points/second",
      "Accuracy: ±2mm at 50m",
      "Field of view: 360° horizontal, 300° vertical",
      "Camera: Integrated 150MP panoramic camera",
      "Weight: 9.8kg (including battery)",
      "Applications: Mining, construction, cultural heritage"
    ]
  },
  {
    id: 31,
    name: "LS300",
    category: "Laser Scanner",
    image: ls300, 
    description: "Mid-range 3D laser scanner with 300m range for detailed point cloud capture",
    mobileDescription: "Mid-range 3D scanner",
    price: 20689,
    inStock: true,
    specifications: [
      "Measurement range: 0.3-300m",
      "Scanning speed: Up to 500,000 points/second",
      "Accuracy: ±3mm at 50m",
      "Field of view: 360° horizontal, 270° vertical",
      "Camera: Integrated 75MP panoramic camera",
      "Weight: 5.2kg (including battery)",
      "Applications: Building documentation, BIM, as-built surveys"
    ]
  },

  // AUTO-STEERING SYSTEMS → "Auto-steering Systems" (New Category)
  {
    id: 32,
    name: "AG 501 PRO",
    category: "Auto-steering Systems",
    image: ag501, 
    description: "GNSS-based auto-steering system for agricultural machinery with ±2.5cm accuracy",
    mobileDescription: "Agricultural auto-steering",
    price: 4413,
    inStock: true,
    specifications: [
      "Accuracy: ±2.5cm with RTK, ±10cm with SBAS",
      "Update rate: 10Hz",
      "Display: 7-inch sunlight-readable touchscreen",
      "Steering modes: Straight, curve, contour, pivot",
      "Compatibility: Tractors, sprayers, harvesters",
      "Power: 12-24V vehicle power",
      "Applications: Precision agriculture, land leveling"
    ]
  },
  {
    id: 33,
    name: "AG 502",
    category: "Auto-steering Systems",
    image: ag502, 
    description: "Advanced auto-steering system with dual-antenna for heading and roll compensation",
    mobileDescription: "Dual-antenna auto-steering",
    price: 5517,
    inStock: true,
    specifications: [
      "Dual-antenna: Provides true heading and roll compensation",
      "Accuracy: ±1cm with RTK",
      "Update rate: 20Hz",
      "Display: 10.1-inch HD touchscreen",
      "IMU: Integrated inertial measurement unit",
      "Communication: 4G, Wi-Fi, Bluetooth",
      "Applications: High-precision agriculture, construction"
    ]
  },

  // FIELD EQUIPMENT → "Handheld GPS" (Existing - Preserved)
  {
    id: 5,
    name: "GPSMAP 67i",
    category: "Handheld GPS",
    image: gpsmap, 
    description: "Rugged handheld GPS device with inReach satellite communication capabilities",
    mobileDescription: "Satellite GPS communicator",
    price: 6999,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "GNSS: Multi-band GPS, GLONASS, Galileo",
      "Satellite communication: inReach two-way messaging",
      "Display: 3-inch sunlight-readable color touchscreen",
      "Battery: Up to 180 hours in expedition mode",
      "Topo maps: Preloaded worldwide basemap",
      "Sensors: Barometric altimeter, 3-axis compass",
      "Durability: IPX7 waterproof, MIL-STD-810 rated"
    ]
  },

  // DATA COLLECTORS → "Other" (Existing - Preserved)
  {
    id: 8,
    name: "GNSS Data Collector",
    category: "Other",
    image: datacollector, 
    description: "Field data collector with GNSS connectivity for surveying and mapping applications",
    mobileDescription: "Field data collector",
    price: 6999,
    inStock: true,
    specifications: [
      "Processor: Quad-core 2.0GHz",
      "Display: 7-inch HD touchscreen (1280×800)",
      "RAM/Storage: 4GB RAM, 64GB storage",
      "GNSS: External connection via Bluetooth",
      "OS: Windows 10 IoT or Android 11 options",
      "Battery: 8000mAh (10+ hours)",
      "Ports: USB-C, USB-A, HDMI, RS232"
    ]
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
    description: "Heavy-duty aluminum tripod for surveying instruments",
    mobileDescription: "Professional survey tripod",
    price: 299,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "Material: Aluminum alloy with stainless steel fittings",
      "Max height: 1.8m, Min height: 0.8m",
      "Load capacity: 15kg",
      "Leg sections: 3 sections with quick locks",
      "Head type: Standard 5/8\" survey thread",
      "Weight: 4.5kg",
      "Features: Adjustable leg angles, bubble level"
    ]
  },
  {
    id: 5,
    name: "Tribach",
    category: "Accessory",
    image: tribach,
    description: "Universal tribrach with optical plummet for instrument leveling",
    mobileDescription: "Survey tribach",
    price: 599,
    inStock: true,
    specifications: [
      "Type: Forced centering tribrach",
      "Accuracy: ±0.5mm optical plummet",
      "Material: Aluminum alloy with brass inserts",
      "Compatibility: Standard 5/8\" instruments",
      "Leveling: 3 leveling screws with locking mechanism",
      "Features: Carrying case included",
      "Applications: Total station, GNSS receiver setup"
    ]
  },

  // Measurement Tools
  {
    id: 2,
    name: "Ranging Pole",
    category: "Accessory",
    image: rangingpole,
    description: "Telescopic ranging pole with bubble level for GNSS receivers",
    mobileDescription: "Ranging pole",
    price: 149,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "Material: Fiberglass with aluminum fittings",
      "Extended length: 2.0m",
      "Collapsed length: 1.2m",
      "Sections: 3 telescopic sections",
      "Weight: 1.8kg",
      "Features: Bubble level, carrying strap",
      "Compatibility: Standard survey thread"
    ]
  },
  {
    id: 3,
    name: "Steel Tape",
    category: "Accessory",
    image: steeltape,
    description: "30m steel measuring tape for distance measurement",
    mobileDescription: "Steel measuring tape",
    price: 89,
    inStock: true,
    popularOnMobile: true,
    specifications: [
      "Length: 30 meters",
      "Width: 13mm",
      "Material: Steel blade with nylon coating",
      "Case: ABS plastic with rubber grip",
      "Accuracy: Class II (±2.3mm at 10m)",
      "Features: Locking mechanism, belt clip",
      "Applications: Construction, surveying, DIY"
    ]
  },
  {
    id: 9,
    name: "Leveling Staff",
    category: "Accessory",
    image: levelingstaff,
    description: "Aluminum leveling staff with metric graduations",
    mobileDescription: "Leveling staff",
    price: 79,
    inStock: true,
    specifications: [
      "Material: Aluminum alloy",
      "Length: 3m or 5m options",
      "Graduations: Metric (mm) with reverse reading",
      "Sections: Telescopic with locking mechanism",
      "Weight: 2.5kg (3m)",
      "Accuracy: ±1mm over full length",
      "Applications: Leveling, height measurement"
    ]
  },
  {
    id: 10,
    name: "Spindle",
    category: "Accessory",
    image: spindle,
    description: "Survey spindle for precise point marking and centering",
    mobileDescription: "Survey spindle",
    price: 79,
    inStock: true,
    specifications: [
      "Material: Stainless steel with hardened tip",
      "Length: 300mm",
      "Diameter: 10mm",
      "Tip: Tungsten carbide for durability",
      "Features: Graduated markings every 10mm",
      "Weight: 0.3kg",
      "Applications: Point marking, center finding"
    ]
  },
  {
    id: 8,
    name: "INGCO Measuring Wheel",
    category: "Accessory",
    image: ingco,
    description: "Digital measuring wheel for accurate distance measurement",
    mobileDescription: "Measuring wheel",
    price: 159,
    inStock: true,
    specifications: [
      "Measurement range: 0-9999.9m",
      "Accuracy: ±0.1%",
      "Wheel diameter: 318mm",
      "Display: LCD with backlight",
      "Memory: Stores up to 9 measurements",
      "Units: Meters, feet, inches",
      "Applications: Road surveys, property measurement"
    ]
  },

  // Signal Equipment
  {
    id: 4,
    name: "Long Whip Antenna",
    category: "Accessory",
    image: longwhip,
    description: "Extended range UHF antenna for RTK radio communication",
    mobileDescription: "Long whip antenna",
    price: 199,
    inStock: true,
    specifications: [
      "Frequency range: 410-470MHz",
      "Gain: 3dBi",
      "Length: 1.2m",
      "Connector: SMA male",
      "Cable: RG-58 with 3m length",
      "VSWR: <1.5:1",
      "Applications: RTK base station, radio modem"
    ]
  },
  {
    id: 7,
    name: "External Radio",
    category: "Accessory",
    image: externalradio,
    description: "UHF radio modem for long-range RTK corrections",
    mobileDescription: "External radio",
    price: 249,
    inStock: true,
    specifications: [
      "Frequency: 410-470MHz (programmable)",
      "Power output: 2W/5W/10W selectable",
      "Range: Up to 15km line-of-sight",
      "Protocols: Trimble, Leica, Topcon compatible",
      "Battery: Internal Li-ion (8+ hours)",
      "Channels: 256 programmable channels",
      "Applications: RTK surveying, machine control"
    ]
  },
  {
    id: 12,
    name: "GNSS Data Link Cables",
    category: "Accessory",
    image: gnsscables,
    description: "Complete set of cables for GNSS receiver connections",
    mobileDescription: "GNSS cables",
    price: 79,
    inStock: true,
    specifications: [
      "Included: Power cable, data cable, radio cable",
      "Connectors: LEMO, RS232, USB-C adapters",
      "Length: 3m each cable",
      "Shielding: Double-shielded for RFI protection",
      "Material: PVC jacket, copper conductors",
      "Color coding: Different colors for easy identification",
      "Compatibility: Universal for most GNSS receivers"
    ]
  },

  // Mounting Hardware
  {
    id: 11,
    name: "Controller Bracket",
    category: "Accessory",
    image: controllerbracket,
    description: "Adjustable bracket for mounting tablets or controllers on survey equipment",
    mobileDescription: "Controller bracket",
    price: 79,
    inStock: true,
    specifications: [
      "Material: Aluminum alloy with plastic padding",
      "Adjustable: 360° rotation, multiple angles",
      "Mounting: Universal 1/4\"-20 thread",
      "Compatibility: Tablets 7-10\", most controllers",
      "Weight: 0.4kg",
      "Features: Quick release, vibration damping",
      "Applications: Data collector mounting, drone controller"
    ]
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
// EXPORT PRODUCTS FOR PRODUCT DETAIL PAGE
// ============================================

// Convert CarouselItems to Products for ProductDetailPage
export const PRODUCTS: Product[] = [
  ...ACCESSORIES.map(item => ({
    id: `acc-${item.id}`,
    name: item.name,
    category: "Accessory" as ProductCategory,
    price: item.price,
    description: item.description,
    image: item.image,
    inStock: item.inStock || true,
    specifications: item.specifications || [],
    brand: item.name.includes("INGCO") ? "INGCO" : "Generic",
    model: item.name,
    warranty: "1 year"
  })),
  ...FEATURED_EQUIPMENT.map(item => ({
    id: `eq-${item.id}`,
    name: item.name,
    category: (item.category ?? "Other") as ProductCategory,
    price: item.price,
    description: item.description,
    image: item.image,
    inStock: item.inStock || true,
    specifications: item.specifications || [],
    brand: getBrandFromName(item.name),
    model: item.name,
    warranty: item.category === "Drones" ? "6 months" : "2 years"
  }))
];

// Helper function to extract brand from product name
function getBrandFromName(name: string): string {
  if (name.includes("DJI")) return "DJI";
  if (name.includes("Leica") || name.includes("LEICA")) return "Leica";
  if (name.includes("Garmin")) return "Garmin";
  if (name.includes("FOIF")) return "FOIF";
  if (name.includes("COMNAV")) return "COMNAV";
  if (name.includes("Sinognss") || name.includes("SINOGNSS")) return "Sinognss";
  return "Generic";
}

// Mobile-optimized products (for mobile views)
export const MOBILE_PRODUCTS: Product[] = PRODUCTS
  .map(product => ({
    ...product,
    name: getMobileName(product.name),
    description: getMobileDescription(product.description)
  }))
  .sort((a, b) => {
    // Sort mobile products: popular items first, then affordable, then category
    const aPopular = a.name.includes("T30") || a.name.includes("GPSMAP") || a.name.includes("Tripod") || a.price <= 1000;
    const bPopular = b.name.includes("T30") || b.name.includes("GPSMAP") || b.name.includes("Tripod") || b.price <= 1000;
    
    if (aPopular && !bPopular) return -1;
    if (!aPopular && bPopular) return 1;
    if (a.price !== b.price) return a.price - b.price;
    return a.category.localeCompare(b.category);
  });

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
    .filter(p => p.name.includes("T30") || p.name.includes("GPSMAP") || p.name.includes("Tripod") || p.price <= 1000)
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