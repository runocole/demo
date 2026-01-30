import { CheckCircle2, Star, MapPin, Navigation, Crosshair, Search, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage from "../assets/corshero.jpg";
// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const CountUp = ({ end, duration = 800, suffix = "+" }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          let start = 0;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [end, duration]);

  return (
    <div ref={elementRef} className="text-5xl font-bold text-blue-900">
      {count}{suffix}
    </div>
  );
};

interface CorsStation {
  id: number;
  name: string;
  position: [number, number];
  address: string;
  status: 'Operational' | 'Maintenance' | 'Planned';
  coverage: string;
  distance?: number;
}

// Using your table data - converting DMS to decimal manually for accuracy
const corsStations: CorsStation[] = [
  // Using approximate decimal coordinates for Nigeria
  {
    id: 1,
    name: "OTIC-ONITSHA",
    position: [6.1570, 6.7845],
    address: "Onitsha, Anambra",
    status: "Operational",
    coverage: "Anambra State"
  },
  {
    id: 2,
    name: "OTIC-AWKA",
    position: [6.2097, 7.0429],
    address: "Awka, Anambra",
    status: "Operational",
    coverage: "Anambra State"
  },
  {
    id: 3,
    name: "OTIC-ABEOKUTA",
    position: [7.0767, 3.2910],
    address: "Abeokuta, Ogun",
    status: "Operational",
    coverage: "Ogun State"
  },
  {
    id: 4,
    name: "OTIC-IBADAN",
    position: [7.3666, 3.8321],
    address: "Ibadan, Oyo",
    status: "Operational",
    coverage: "Oyo State"
  },
  {
    id: 5,
    name: "OTIC-EPE",
    position: [6.6659, 4.0034],
    address: "Epe, Lagos",
    status: "Operational",
    coverage: "Lagos State"
  },
  {
    id: 6,
    name: "OTIC-OYO-FSS",
    position: [7.8408, 3.9499],
    address: "Oyo, Oyo",
    status: "Operational",
    coverage: "Oyo State"
  },
  {
    id: 7,
    name: "OTIC-YENAGOA",
    position: [4.9394, 6.2711],
    address: "Yenagoa, Bayelsa",
    status: "Operational",
    coverage: "Bayelsa State"
  },
  {
    id: 8,
    name: "OTIC-GOMBE",
    position: [10.2963, 11.1545],
    address: "Gombe, Gombe",
    status: "Operational",
    coverage: "Gombe State"
  },
  {
    id: 9,
    name: "OTIC-AJAH",
    position: [6.4412, 3.5281],
    address: "Ajah, Lagos",
    status: "Operational",
    coverage: "Lagos State"
  },
  {
    id: 10,
    name: "OTIC-AUCHI",
    position: [7.0547, 6.2667],
    address: "Auchi, Edo",
    status: "Operational",
    coverage: "Edo State"
  },
  {
    id: 11,
    name: "OTIC-NIS-OSOGBO",
    position: [7.7526, 4.5255],
    address: "Osogbo, Osun",
    status: "Operational",
    coverage: "Osun State"
  },
  {
    id: 12,
    name: "OTIC-BADAGRY",
    position: [6.4730, 2.9617],
    address: "Badagry, Lagos",
    status: "Operational",
    coverage: "Lagos State"
  },
  {
    id: 13,
    name: "OTIC-AKURE",
    position: [7.2566, 5.1631],
    address: "Akure, Ondo",
    status: "Operational",
    coverage: "Ondo State"
  },
  {
    id: 14,
    name: "OTIC-NIS-IWO",
    position: [7.6582, 4.2002],
    address: "Iwo, Osun",
    status: "Operational",
    coverage: "Osun State"
  },
  {
    id: 15,
    name: "OTIC-OSGOF-ABJ",
    position: [9.0279, 7.4867],
    address: "Abuja, FCT",
    status: "Operational",
    coverage: "Federal Capital Territory"
  },
  {
    id: 16,
    name: "OTIC-ADO-EKITI",
    position: [7.5903, 5.3039],
    address: "Ado-Ekiti, Ekiti",
    status: "Operational",
    coverage: "Ekiti State"
  },
  {
    id: 17,
    name: "OTIC-ENUGU",
    position: [6.4393, 7.4952],
    address: "Enugu, Enugu",
    status: "Operational",
    coverage: "Enugu State"
  },
  {
    id: 18,
    name: "OTIC-OSSG-OS",
    position: [7.7291, 4.5186],
    address: "Osogbo, Osun",
    status: "Operational",
    coverage: "Osun State"
  },
  {
    id: 19,
    name: "OTIC-UYO",
    position: [5.0128, 7.9146],
    address: "Uyo, Akwa Ibom",
    status: "Operational",
    coverage: "Akwa Ibom State"
  },
  {
    id: 20,
    name: "OTIC-SANGOOTA",
    position: [6.6763, 3.2243],
    address: "Sango Ota, Ogun",
    status: "Operational",
    coverage: "Ogun State"
  },
  {
    id: 21,
    name: "OTIC-BENIN",
    position: [6.3566, 5.6193],
    address: "Benin, Edo",
    status: "Operational",
    coverage: "Edo State"
  }
];

// Create custom icons
const createIcon = (color: string = '#3388ff') => L.divIcon({
  html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  className: 'custom-marker'
});

const userIcon = createIcon('#4CAF50');
const nearestIcon = createIcon('#FF5722');
const stationIcon = createIcon('#2196F3');

// Station List Component
const StationList = ({ stations, onStationSelect, searchQuery, onSearchChange, nearestStationId }: { 
  stations: CorsStation[], 
  onStationSelect: (station: CorsStation) => void,
  searchQuery: string,
  onSearchChange: (query: string) => void,
  nearestStationId?: number
}) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search stations by name or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>

    <div className="h-[300px] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <div
            key={station.id}
            onClick={() => onStationSelect(station)}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              nearestStationId === station.id 
                ? 'border-orange-400 bg-orange-50 hover:bg-orange-100' 
                : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                station.status === 'Operational' ? 'bg-green-500' : 
                station.status === 'Maintenance' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-gray-800 truncate">{station.name}</h4>
                  {nearestStationId === station.id && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                      Nearest
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">{station.address}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {station.coverage}
                  </span>
                  {station.distance && (
                    <span className="text-xs font-medium text-green-600">
                      {station.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CorsNetwork = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestStation, setNearestStation] = useState<CorsStation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<CorsStation | null>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the map section
  const scrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Calculate distance function
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Filter stations based on search query
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return corsStations;
    
    const query = searchQuery.toLowerCase();
    return corsStations.filter(station => 
      station.name.toLowerCase().includes(query) ||
      station.address.toLowerCase().includes(query) ||
      station.coverage.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Find nearest station
  const findNearestStation = useCallback(() => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userPos: [number, number] = [userLat, userLng];
        
        setUserLocation(userPos);

        // Calculate distances to all stations
        const stationsWithDistance = corsStations.map(station => ({
          ...station,
          distance: calculateDistance(userLat, userLng, station.position[0], station.position[1])
        }));

        // Find the nearest station
        const nearest = stationsWithDistance.reduce((prev, current) => 
          (prev.distance! < current.distance!) ? prev : current
        );

        setNearestStation(nearest);
        setSelectedStation(nearest);
        setIsLoading(false);
        // Scroll to map after finding location
        scrollToMap();
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please allow location access to find nearest station.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
            break;
        }
      }
    );
  }, [calculateDistance]);

  const clearLocation = useCallback(() => {
    setUserLocation(null);
    setNearestStation(null);
    setSelectedStation(null);
    setError('');
  }, []);

  const handleStationSelect = useCallback((station: CorsStation) => {
    setSelectedStation(station);
    if (userLocation) {
      station.distance = calculateDistance(
        userLocation[0], userLocation[1],
        station.position[0], station.position[1]
      );
    }
  }, [userLocation, calculateDistance]);

  // Default center for the map
  const mapCenter = useMemo(() => {
    if (selectedStation) return selectedStation.position;
    if (userLocation) return userLocation;
    return [8.6753, 9.0820] as [number, number];
  }, [selectedStation, userLocation]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Hero Section - Fixed with all improvements */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {/* Hero image with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Gradient overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg leading-tight pt-30">
              Nationwide GNSS CORS Network for Surveyors & Engineers
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
              Achieve centimeter-level positioning anywhere in Nigeria—without setting up your own base station.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={scrollToMap}
                size="lg"
                className="bg-blue-900 text-white hover:bg-blue-800 font-bold text-base px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                Find Nearest CORS →
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 font-bold text-base px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Request Access
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Premium redesign */}
      <section className="py-16 bg-white relative">
        {/* Curved separator */}
        <div className="absolute top-0 left-0 right-0 h-8 -translate-y-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M1200 120L0 0 0 0 1200 0 1200 120z" fill="white" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-16">
            {/* Stats Cards */}
            <div className="flex flex-col sm:flex-row gap-8 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 min-w-[200px]">
                <div className="flex flex-col items-center">
                  <CountUp end={23} />
                  <div className="text-lg font-semibold text-blue-900 mt-4">CORS Stations</div>
                  <p className="text-sm text-gray-600 mt-2">Nationwide coverage</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 min-w-[200px]">
                <div className="flex flex-col items-center">
                  <CountUp end={1000} />
                  <div className="text-lg font-semibold text-blue-900 mt-4">Customers</div>
                  <p className="text-sm text-gray-600 mt-2">Trusted by professionals</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 min-w-[200px]">
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-blue-900">99.7%</div>
                  <div className="text-lg font-semibold text-blue-900 mt-4">Uptime</div>
                  <p className="text-sm text-gray-600 mt-2">Reliable service</p>
                </div>
              </div>
            </div>
            
            {/* Value Proposition */}
            <div className="max-w-lg space-y-6 text-center md:text-left">
              <h2 className="text-3xl font-bold text-blue-900 leading-tight">
                Experience CM-Level Accuracy with Our CORS Network
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Trusted by surveyors across 15+ states in Nigeria. With 23 CORS stations nationwide 
                and serving 1000+ customers, we deliver precise positioning solutions and reliable service.
              </p>
              
              {/* Ratings moved up below headline */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-blue-900">4.9</span>
                  <span className="ml-1 text-sm text-gray-500 opacity-75">(127 reviews)</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-blue-900">Active users:</span> 250+ institutions
                </div>
              </div>
              
              <button 
                onClick={() => navigate("/contact")}
                className="bg-blue-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Using OTIC CORS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CORS Network Section */}
      <section id="cors-map" ref={mapSectionRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-blue-900">Interactive Station Finder</h2>
            <p className="text-lg text-gray-600">Locate and connect to the nearest CORS station instantly</p>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-3">
                  <Crosshair className="w-6 h-6" />
                  Find Nearest CORS Station
                </h3>
                <p className="text-gray-600">
                  {userLocation 
                    ? `Location found! The nearest station is highlighted in orange.`
                    : `Click below to find the closest CORS station to your location.`
                  }
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {!userLocation ? (
                  <button
                    onClick={findNearestStation}
                    disabled={isLoading}
                    className="bg-blue-900 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Navigation className="w-5 h-5" />
                    {isLoading ? 'Locating...' : 'Find Nearest Station'}
                  </button>
                ) : (
                  <button
                    onClick={clearLocation}
                    className="bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <X className="w-5 h-5" />
                    Clear Location
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {nearestStation && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <h4 className="font-bold text-green-800 text-xl mb-4 flex items-center gap-3">
                  <MapPin className="w-6 h-6" />
                  Nearest Station Found!
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-2xl font-bold text-green-900">{nearestStation.name}</p>
                    <p className="text-green-700">{nearestStation.address}</p>
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        ● {nearestStation.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-900">
                      {nearestStation.distance?.toFixed(1)} km away
                    </p>
                    <p className="text-green-700">Coverage: {nearestStation.coverage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Width Map */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-900/10 hover:border-blue-900/20 transition-all duration-300">
              <MapContainer 
                center={mapCenter}
                zoom={selectedStation || userLocation ? 10 : 7}
                style={{ height: '500px', width: '100%' }}
                key={selectedStation?.id || 'default'}
                className="transition-all duration-300"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                
                {/* User Location Marker */}
                {userLocation && (
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <div className="p-3">
                        <h3 className="font-bold text-green-600 text-lg">Your Location</h3>
                        <p className="text-sm text-gray-600">Lat: {userLocation[0].toFixed(6)}°</p>
                        <p className="text-sm text-gray-600">Lng: {userLocation[1].toFixed(6)}°</p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Station Markers */}
                {corsStations.map(station => {
                  const isNearest = nearestStation?.id === station.id;
                  
                  return (
                    <Marker 
                      key={station.id} 
                      position={station.position}
                      icon={isNearest ? nearestIcon : stationIcon}
                      eventHandlers={{
                        click: () => handleStationSelect(station),
                        mouseover: (e) => e.target.openPopup(),
                        mouseout: (e) => e.target.closePopup()
                      }}
                    >
                      <Popup className="rounded-lg">
                        <div className="p-3 min-w-[220px]">
                          <h3 className={`font-bold text-lg ${isNearest ? 'text-orange-600' : 'text-blue-900'}`}>
                            {station.name} {isNearest && '⭐'}
                          </h3>
                          <p className="text-gray-600">{station.address}</p>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">Coordinates:</p>
                            <div className="text-xs font-mono bg-gray-100 p-2 rounded mt-1">
                              {station.position[0].toFixed(6)}°, {station.position[1].toFixed(6)}°
                            </div>
                          </div>
                          {userLocation && (
                            <p className="text-sm font-semibold text-green-600 mt-3">
                              Distance: {calculateDistance(
                                userLocation[0], userLocation[1],
                                station.position[0], station.position[1]
                              ).toFixed(1)} km
                            </p>
                          )}
                          <p className={`text-sm font-semibold mt-3 inline-block px-3 py-1 rounded-full ${
                            station.status === "Operational" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            ● {station.status}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          {/* Station List Below Map */}
          <div className="mt-8">
            <StationList 
              stations={filteredStations}
              onStationSelect={handleStationSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              nearestStationId={nearestStation?.id}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section - Improved content flow */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold text-blue-900">
                How It Works: Visualizing Precision
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Achieve centimeter-level positioning anywhere in Nigeria—without setting up your own base station. 
                Our CORS network provides real-time GNSS corrections for instant accuracy.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "High Precision Positioning", desc: "Achieve centimeter-level accuracy for surveying and mapping with real-time corrections" },
                  { title: "Real-time Data Streams", desc: "Access continuous GNSS data streams for immediate positioning corrections" },
                  { title: "Nationwide Coverage", desc: "23 strategically located stations ensuring reliable service across Nigeria" },
                  { title: "Multiple Applications", desc: "Ideal for land surveying, construction, precision agriculture, and GIS mapping" }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                      <CheckCircle2 className="w-6 h-6 text-blue-900 flex-shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-blue-900">{item.title}</h4>
                      <p className="text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Client Logos - Trust signals */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Trusted by leading firms:</p>
                <div className="flex flex-wrap items-center gap-6 opacity-70">
                  <div className="bg-gray-100 px-6 py-3 rounded-lg text-gray-600 font-semibold">CraneBurg</div>
                  <div className="bg-gray-100 px-6 py-3 rounded-lg text-gray-600 font-semibold">Julius Berger</div>
                  <div className="bg-gray-100 px-6 py-3 rounded-lg text-gray-600 font-semibold">National Oil</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-8 rounded-2xl shadow-xl border border-blue-100">
                <img 
                  src={heroImage} 
                  alt="CORS Network Diagram" 
                  className="w-full h-auto rounded-xl shadow-lg object-cover"
                />
                <div className="mt-6 p-4 bg-blue-900/5 rounded-lg border border-blue-900/10">
                  <p className="text-sm text-blue-900 font-semibold">
                    <span className="text-lg">📡</span> Real-time correction flow: Base Station → Network → Your Rover
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-blue-900">
              Ready to Achieve Centimeter Accuracy?
            </h2>
            <p className="text-xl text-blue-900">
              Join 100+ surveyors and engineers using Nigeria's most reliable CORS network.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
              <button 
                onClick={() => navigate("/contact")}
                className="bg-blue-900 text-white px-10 py-5 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 text-lg"
              >
                Start Using OTIC CORS
              </button>
              <button 
                onClick={() => navigate("/contact")}
                className="bg-blue-900 text-white px-10 py-5 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Request Demo
              </button>
            </div>
            <p className="text-blue-900 pt-6">
              Need immediate assistance? Call{" "}
              <a 
                href="tel:+2349026194016" 
                className="font-bold text-blue-900 hover:text-blue-200 underline transition-colors"
              >
                +234 902 6194 016
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorsNetwork;