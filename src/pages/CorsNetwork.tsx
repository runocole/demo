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
    <div ref={elementRef} className="text-5xl font-bold text-primary">
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

// Helper function to convert DMS to decimal - SIMPLIFIED
const parseDMS = (dmsStr: string): number => {
  // Example: "6 09'25.254721" -> 6 + 9/60 + 25.254721/3600
  try {
    const parts = dmsStr.trim().split(/[^\d.]+/);
    const degrees = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    
    return degrees + (minutes / 60) + (seconds / 3600);
  } catch (error) {
    console.error('Error parsing DMS:', dmsStr, error);
    return 0;
  }
};

// Using your table data - converting DMS to decimal manually for accuracy
const corsStations: CorsStation[] = [
  // Using approximate decimal coordinates for Nigeria
  {
    id: 1,
    name: "OTIC-ONITSHA",
    position: [6.1570, 6.7845], // ~6°09'N, 6°47'E
    address: "Onitsha, Anambra",
    status: "Operational",
    coverage: "Anambra State"
  },
  {
    id: 2,
    name: "OTIC-AWKA",
    position: [6.2097, 7.0429], // ~6°12'N, 7°02'E
    address: "Awka, Anambra",
    status: "Operational",
    coverage: "Anambra State"
  },
  {
    id: 3,
    name: "OTIC-ABEOKUTA",
    position: [7.0767, 3.2910], // ~7°04'N, 3°17'E
    address: "Abeokuta, Ogun",
    status: "Operational",
    coverage: "Ogun State"
  },
  {
    id: 4,
    name: "OTIC-IBADAN",
    position: [7.3666, 3.8321], // ~7°22'N, 3°50'E
    address: "Ibadan, Oyo",
    status: "Operational",
    coverage: "Oyo State"
  },
  {
    id: 5,
    name: "OTIC-EPE",
    position: [6.6659, 4.0034], // ~6°40'N, 4°00'E
    address: "Epe, Lagos",
    status: "Operational",
    coverage: "Lagos State"
  },
  {
    id: 6,
    name: "OTIC-OYO-FSS",
    position: [7.8408, 3.9499], // ~7°50'N, 3°57'E
    address: "Oyo, Oyo",
    status: "Operational",
    coverage: "Oyo State"
  },
  {
    id: 7,
    name: "OTIC-YENAGOA",
    position: [4.9394, 6.2711], // ~4°56'N, 6°16'E
    address: "Yenagoa, Bayelsa",
    status: "Operational",
    coverage: "Bayelsa State"
  },
  {
    id: 8,
    name: "OTIC-GOMBE",
    position: [10.2963, 11.1545], // ~10°18'N, 11°09'E
    address: "Gombe, Gombe",
    status: "Operational",
    coverage: "Gombe State"
  },
  {
    id: 9,
    name: "OTIC-AJAH",
    position: [6.4412, 3.5281], // ~6°26'N, 3°32'E - AJAH, Lagos (your location!)
    address: "Ajah, Lagos",
    status: "Operational",
    coverage: "Lagos State"
  },
  {
    id: 10,
    name: "OTIC-AUCHI",
    position: [7.0547, 6.2667], // ~7°03'N, 6°16'E
    address: "Auchi, Edo",
    status: "Operational",
    coverage: "Edo State"
  },
  {
    id: 11,
    name: "OTIC-NIS-OSOGBO",
    position: [7.7526, 4.5255], // ~7°45'N, 4°31'E
    address: "Osogbo, Osun",
    status: "Operational",
    coverage: "Osun State"
  },
  {
    id: 12,
    name: "OTIC-BADAGRY",
    position: [6.4730, 2.9617], // ~6°28'N, 2°58'E
    address: "Badagry, Lagos",
    status: "Operational",
    coverage: "Lagos State"
  },
  {
    id: 13,
    name: "OTIC-AKURE",
    position: [7.2566, 5.1631], // ~7°15'N, 5°10'E
    address: "Akure, Ondo",
    status: "Operational",
    coverage: "Ondo State"
  },
  {
    id: 14,
    name: "OTIC-NIS-IWO",
    position: [7.6582, 4.2002], // ~7°39'N, 4°12'E
    address: "Iwo, Osun",
    status: "Operational",
    coverage: "Osun State"
  },
  {
    id: 15,
    name: "OTIC-OSGOF-ABJ",
    position: [9.0279, 7.4867], // ~9°02'N, 7°29'E
    address: "Abuja, FCT",
    status: "Operational",
    coverage: "Federal Capital Territory"
  },
  {
    id: 16,
    name: "OTIC-ADO-EKITI",
    position: [7.5903, 5.3039], // ~7°35'N, 5°18'E
    address: "Ado-Ekiti, Ekiti",
    status: "Operational",
    coverage: "Ekiti State"
  },
  {
    id: 17,
    name: "OTIC-ENUGU",
    position: [6.4393, 7.4952], // ~6°26'N, 7°30'E
    address: "Enugu, Enugu",
    status: "Operational",
    coverage: "Enugu State"
  },
  {
    id: 18,
    name: "OTIC-OSSG-OS",
    position: [7.7291, 4.5186], // ~7°44'N, 4°31'E
    address: "Osogbo, Osun",
    status: "Operational",
    coverage: "Osun State"
  },
  {
    id: 19,
    name: "OTIC-UYO",
    position: [5.0128, 7.9146], // ~5°01'N, 7°55'E
    address: "Uyo, Akwa Ibom",
    status: "Operational",
    coverage: "Akwa Ibom State"
  },
  {
    id: 20,
    name: "OTIC-SANGOOTA",
    position: [6.6763, 3.2243], // ~6°40'N, 3°13'E
    address: "Sango Ota, Ogun",
    status: "Operational",
    coverage: "Ogun State"
  },
  {
    id: 21,
    name: "OTIC-BENIN",
    position: [6.3566, 5.6193], // ~6°21'N, 5°37'E
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
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
   {/* Hero Section */}
<section className="relative h-[750px] flex items-center justify-center overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${heroImage})` }}
  >
    <div className="absolute inset-0 bg-primary/60" />
  </div>
  <div className="relative z-10 container mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat tracking-tight">
      Find & Log Your Nearest CORS Station
    </h1>
    <p className="text-xl md:text-2xl text-gray-800 max-w-2xl mx-auto mb-8 font-montserrat">
      Locate Continuously Operating Reference Stations instantly. 
      Access correction streams and upload RINEX data in seconds.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button
        onClick={() => navigate("/map")}
        size="lg"
        className="bg-[#081748] text-white hover:bg-blue-800 font-bold text-base px-8 py-4 shadow-xl hover:shadow-2xl transition-all"
      >
        Find Nearest CORS →
      </Button>
    </div>
  </div>
</section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-100">
        <div className="container mx-auto px-4 bg-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-70">
            {/* Left side - Stats */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-40 text-center md:text-left">
              <div className="space-y-2">
                <CountUp end={21} />
                <div className="text-xl text-muted-foreground">CORS Stations</div>
              </div>
              <div className="space-y-2">
                <CountUp end={1000} />
                <div className="text-xl text-muted-foreground">Customers</div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="max-w-md space-y-6 text-center md:text-left">
              <h2 className="text-3xl font-bold text-primary">Experience CM-Level Accuracy with Our CORS Network</h2>
              <p className="text-lg text-muted-foreground">
                With 21 CORS stations nationwide and serving 1000+ customers, 
                we deliver precise positioning solutions and reliable service.
              </p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    4.9 (127 reviews)
                  </span>
                </div>
              </div>
              
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CORS Network Section */}
      <section id="cors-map" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-primary">CORS Network Coverage</h2>
            <p className="text-lg text-gray-600">21 stations providing nationwide coverage</p>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                  <Crosshair className="w-5 h-5" />
                  Find Nearest CORS Station
                </h3>
                <p className="text-gray-600">
                  {userLocation 
                    ? `Location found! The nearest station is highlighted in orange.`
                    : `Click below to find the closest CORS station to your location.`
                  }
                </p>
              </div>
              
              <div className="flex gap-3">
                {!userLocation ? (
                  <button
                    onClick={findNearestStation}
                    disabled={isLoading}
                    className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    {isLoading ? 'Locating...' : 'Find Nearest Station'}
                  </button>
                ) : (
                  <button
                    onClick={clearLocation}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Location
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {nearestStation && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-bold text-green-800 text-lg mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Nearest Station Found!
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-green-700">{nearestStation.name}</p>
                    <p className="text-sm text-green-600">{nearestStation.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-800">
                      {nearestStation.distance?.toFixed(1)} km away
                    </p>
                    <p className="text-sm text-green-600">Coverage: {nearestStation.coverage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Width Map */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20">
              <MapContainer 
                center={mapCenter}
                zoom={selectedStation || userLocation ? 10 : 7}
                style={{ height: '500px', width: '100%' }}
                key={selectedStation?.id || 'default'}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                
                {/* User Location Marker */}
                {userLocation && (
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-green-600">Your Location</h3>
                        <p className="text-sm">Lat: {userLocation[0].toFixed(6)}°</p>
                        <p className="text-sm">Lng: {userLocation[1].toFixed(6)}°</p>
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
                        click: () => handleStationSelect(station)
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <h3 className={`font-bold ${isNearest ? 'text-orange-600' : 'text-blue-600'} text-lg`}>
                            {station.name} {isNearest && '⭐'}
                          </h3>
                          <p className="text-sm text-gray-600">{station.address}</p>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Coordinates:</p>
                            <div className="text-xs font-mono">
                              {station.position[0].toFixed(6)}°, {station.position[1].toFixed(6)}°
                            </div>
                          </div>
                          {userLocation && (
                            <p className="text-sm font-semibold text-green-600 mt-2">
                              Distance: {calculateDistance(
                                userLocation[0], userLocation[1],
                                station.position[0], station.position[1]
                              ).toFixed(1)} km
                            </p>
                          )}
                          <p className={`text-sm font-semibold mt-2 inline-block px-2 py-1 rounded ${
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

      {/* What is CORS Network Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-bold text-primary">What is CORS Network?</h2>
              <p className="text-lg text-gray-600">
                A Continuously Operating Reference Station (CORS) network provides high-precision 
                positioning data 24/7, delivering real-time centimeter-level accuracy for 
                surveying, construction, and geospatial applications.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "High Precision Positioning", desc: "Achieve centimeter-level accuracy for surveying and mapping" },
                  { title: "Real-time Data", desc: "Access continuous GNSS data streams for immediate corrections" },
                  { title: "Nationwide Coverage", desc: "21 stations ensuring reliable service across Nigeria" },
                  { title: "Multiple Applications", desc: "Ideal for surveying, construction, agriculture, and GIS" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <img 
                src={heroImage} 
                alt="CORS Network Station" 
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-gray-800">
            Need a quotation or further inquiries? Call{" "}
            <a 
              href="tel:+234987654234534" 
              className="font-bold text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              +234 987 654 2345 34
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorsNetwork;