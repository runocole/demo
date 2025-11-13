import type { Product } from "../types/product";
import totalStationImg from "../assets/total-station.jpg";
import receiverImg from "../assets/receiver.jpg";
import droneImg from "../assets/drone.jpg";
import levelImg from "../assets/level.jpg";
import laserScannerImg from "../assets/laser-scanner.jpg";

export const PRODUCTS: Product[] = [
  {
    id: "ts-001",
    name: "ProStation 5000 Total Station",
    category: "Total Station",
    price: 15999,
    description: "High-precision robotic total station with 5\" accuracy and 500m range. Perfect for construction and surveying applications.",
    image: totalStationImg,
    inStock: true,
    specifications: ["5\" accuracy", "500m range", "Bluetooth connectivity", "IP66 rated"]
  },
  {
    id: "ts-002",
    name: "SmartStation 3000",
    category: "Total Station",
    price: 12499,
    description: "Advanced total station with integrated GPS for enhanced positioning accuracy.",
    image: totalStationImg,
    inStock: true,
    specifications: ["3\" accuracy", "350m range", "GPS integrated", "Touchscreen display"]
  },
  {
    id: "rec-001",
    name: "GPS Pro Receiver X9",
    category: "GNSS Receiver",
    price: 8999,
    description: "Professional GNSS receiver with multi-constellation support and RTK capabilities.",
    image: receiverImg,
    inStock: true,
    specifications: ["Multi-GNSS", "RTK support", "Real-time corrections", "12-hour battery"]
  },
   {
    id: "rec-001",
    name: "GPS Pro Receiver X9",
    category: "Payloads",
    price: 8999,
    description: "Professional GNSS receiver with multi-constellation support and RTK capabilities.",
    image: receiverImg,
    inStock: true,
    specifications: ["Multi-GNSS", "RTK support", "Real-time corrections", "12-hour battery"]
  },
  {
    id: "rec-002",
    name: "RTK Base Station",
    category: "GNSS Receiver",
    price: 6499,
    description: "Reliable RTK base station for establishing reference points with centimeter accuracy.",
    image: receiverImg,
    inStock: true,
    specifications: ["Centimeter accuracy", "Dual frequency", "Long range transmission"]
  },
  {
    id: "drn-001",
    name: "SurveyMaster Drone Pro",
    category: "Drones",
    price: 18500,
    description: "Professional surveying drone with LiDAR and photogrammetry capabilities.",
    image: droneImg,
    inStock: true,
    specifications: ["4K camera", "LiDAR sensor", "45min flight time", "Automated missions"]
  },
  {
    id: "drn-002",
    name: "AeroScan Mapping Drone",
    category: "Drones",
    price: 13999,
    description: "High-resolution mapping drone with precision positioning and automated flight planning.",
    image: droneImg,
    inStock: true,
    specifications: ["Precision GPS", "30MP camera", "60min flight time", "Obstacle avoidance"]
  },
  {
    id: "lvl-001",
    name: "DigiLevel Pro 400",
    category: "Level",
    price: 4299,
    description: "Digital level with automatic leveling and high-precision measurements.",
    image: levelImg,
    inStock: true,
    specifications: ["±0.3mm accuracy", "Auto leveling", "Digital display", "Data logging"]
  },
  {
    id: "lvl-002",
    name: "LaserLevel Elite",
    category: "Level",
    price: 3599,
    description: "Rotating laser level ideal for construction and grading projects.",
    image: levelImg,
    inStock: true,
    specifications: ["Self-leveling", "800m range", "Outdoor mode", "Remote control"]
  },
  {
    id: "ls-001",
    name: "3D Scanner Ultimate",
    category: "Laser Scanner",
    price: 35999,
    description: "High-speed 3D laser scanner for detailed reality capture and BIM integration.",
    image: laserScannerImg,
    inStock: true,
    specifications: ["1M points/sec", "360° scanning", "HDR imaging", "BIM compatible"]
  },
  {
    id: "ls-002",
    name: "TerraScanner 500",
    category: "Laser Scanner",
    price: 28999,
    description: "Portable 3D laser scanner with long-range capabilities for large-scale projects.",
    image: laserScannerImg,
    inStock: true,
    specifications: ["500m range", "Point cloud processing", "IP54 rated", "WiFi/Bluetooth"]
  },
  {
    id: "acc-001",
    name: "Heavy Duty Tripod",
    category: "Accessory",
    price: 449,
    description: "Professional aluminum tripod with quick-release system and adjustable legs.",
    image: totalStationImg,
    inStock: true,
    specifications: ["Aluminum construction", "Quick release", "Max load 10kg"]
  },
  {
    id: "acc-002",
    name: "Survey Prism Set",
    category: "Accessory",
    price: 299,
    description: "High-quality prism set with pole and target for total station measurements.",
    image: totalStationImg,
    inStock: true,
    specifications: ["360° prism", "Carbon fiber pole", "Target included"]
  },
  {
    id: "oth-001",
    name: "Field Data Controller",
    category: "Other",
    price: 2499,
    description: "Rugged handheld controller with survey software and long battery life.",
    image: receiverImg,
    inStock: true,
    specifications: ["Windows-based", "IP67 rated", "10-hour battery", "Sunlight-readable"]
  },
  {
    id: "ech-001",
    name: "HydroScan Pro Echo Sounder",
    category: "EchoSounder",
    price: 7999,
    description: "Professional single-beam echo sounder for bathymetric surveys and underwater mapping.",
    image: receiverImg,
    inStock: true,
    specifications: ["200kHz frequency", "300m depth", "GPS integrated", "Real-time display"]
  }
];
