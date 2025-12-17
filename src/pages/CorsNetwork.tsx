import { CheckCircle2, Star, MapPin, Navigation, Crosshair } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage from "../assets/hero-training.jpg";
import safetyImage from "../assets/safety-training.jpg";

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
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
          const increment = end / (duration / 16); // 60fps
          
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

const corsStations: CorsStation[] = [
  {
    id: 1,
    name: "Ibadan CORS Station",
    position: [7.377376545600103, 3.944538973354917],
    address: "No. 3, Bello Close, Chevyview Estate, Lekki, Ibadan",
    status: "Operational",
    coverage: "Ibadan State"
  },
  {
    id: 2,
    name: "Ajah CORS Station", 
    position: [6.468422794327221, 3.564924256728106],
    address: "Central Business District, Ajah",
    status: "Operational",
    coverage: "Lagos & Surrounding States"
  },
  {
    id: 3,
    name: "Port Harcourt CORS Station",
    position: [4.8156, 7.0498],
    address: "GRA Phase 2, Port Harcourt",
    status: "Operational",
    coverage: "Rivers & Bayelsa States"
  },
  {
    id: 4,
    name: "Abuja CORS Station",
    position: [9.0765, 7.3986],
    address: "Central Area, Abuja",
    status: "Operational",
    coverage: "FCT & Northern States"
  },
  {
    id: 5,
    name: "Kano CORS Station",
    position: [12.0022, 8.5920],
    address: "Nassarawa GRA, Kano",
    status: "Operational",
    coverage: "Kano & Northern States"
  }
];

// Function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const Training = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [nearestStation, setNearestStation] = useState<CorsStation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const findNearestStation = () => {
    setIsLoading(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude
        const userLng = position.coords.longitude
        const userPos: [number, number] = [userLat, userLng]
        
        setUserLocation(userPos)

        // Calculate distances to all stations
        const stationsWithDistance = corsStations.map(station => ({
          ...station,
          distance: calculateDistance(userLat, userLng, station.position[0], station.position[1])
        }))

        // Find the nearest station
        const nearest = stationsWithDistance.reduce((prev, current) => 
          (prev.distance! < current.distance!) ? prev : current
        )

        setNearestStation(nearest)
        setIsLoading(false)
      },
      (error) => {
        setIsLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please allow location access to find nearest station.')
            break
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable.')
            break
          case error.TIMEOUT:
            setError('Location request timed out.')
            break
          default:
            setError('An unknown error occurred.')
            break
        }
      }
    )
  }

  const clearLocation = () => {
    setUserLocation(null)
    setNearestStation(null)
    setError('')
  }

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
        <div className="relative z-10 container mx-auto px-4 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 font-montserrat tracking-tight">
            GeossoTech Academy 
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-0 mb-10 font-montserrat font-bold">
            We train professionals worldwide to safely and efficiently operate
            in their field with comprehensive training programs
          </p>
          <div className="flex justify-start">
            <Button
              onClick={() => navigate("/contact")}
              size="lg"
              className="bg-[#081748] text-white hover:bg-[#081748] font-bold text-base px-8 py-4 shadow-xl hover:shadow-2xl transition-all mt-0"
            >
              Get Started →
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary bg-blue-100">
        <div className="container mx-auto px-4 bg-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-center gap-70">
            {/* Left side - Stats */}
            <div className="flex flex-col md:flex-row gap-40 text-center md:text-left">
              <div className="space-y-2">
                <CountUp end={20} />
                <div className="text-xl text-muted-foreground">CORS Station</div>
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
                With over 20 CORS stations across the region and serving 1000+ customers, 
                we're proud to deliver precise positioning solutions and reliable service 
                to communities and businesses nationwide.
              </p>
              
              {/* Star Rating */}
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
              
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>
{/* CORS Network Map Section */}
<section id="cors-map" className="bg-secondary/20 py-16">
  <div className="container mx-auto px-6">
    <div className="text-center space-y-4 mb-8">
      <h2 className="text-4xl font-bold text-primary">Our CORS Network Coverage</h2>
      <p className="text-lg text-muted-foreground">Locate CORS stations across Nigeria</p>
    </div>
{/* Find Nearest Station Section */}
<div className="bg-white rounded-2xl p-6 shadow-lg border border-primary/10 mb-8">
  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="flex-1">
      <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
        <Crosshair className="w-5 h-5" />
        Find Nearest CORS Station
      </h3>
      <p className="text-muted-foreground">
        {userLocation 
          ? `We found your location! Check the map for the nearest station.`
          : `Click the button below to find the closest CORS station to your current location.`
        }
      </p>
    </div>
    
    <div className="flex gap-3">
      {!userLocation ? (
        <button
          onClick={findNearestStation}
          disabled={isLoading}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          {isLoading ? 'Locating...' : 'Find Nearest Station'}
        </button>
      ) : (
        <button
          onClick={clearLocation}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <Crosshair className="w-4 h-4" />
          Clear Location
        </button>
      )}
    </div> {/* THIS CLOSING DIV WAS MISSING */}
  </div>

  {error && (
    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
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
    {/* Map Container - SIMPLIFIED VERSION */}
    <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20">
      <MapContainer 
        center={userLocation || [9.0820, 8.6753]} 
        zoom={userLocation ? 8 : 6}
        style={{ height: '500px', width: '100%' }}
        key={userLocation ? 'with-location' : 'without-location'} // Add key to force re-render
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-blue-600">Your Location</h3>
                <p className="text-sm">We'll show the nearest CORS station</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* CORS Station Markers - SIMPLIFIED WITHOUT CUSTOM ICONS */}
        {corsStations.map(station => (
          <Marker 
            key={station.id} 
            position={station.position}
          >
            <Popup>
              <div className="p-2">
                <h3 className={`font-bold ${nearestStation?.id === station.id ? 'text-green-600 text-lg' : 'text-primary'}`}>
                  {station.name} {nearestStation?.id === station.id && '⭐ (Nearest)'}
                </h3>
                <p className="text-sm">{station.address}</p>
                <p className="text-sm text-blue-600 font-medium">
                  Coverage: {station.coverage}
                </p>
                {userLocation && (
                  <p className="text-sm font-semibold text-green-600 mt-1">
                    Distance: {calculateDistance(
                      userLocation[0], userLocation[1],
                      station.position[0], station.position[1]
                    ).toFixed(1)} km
                  </p>
                )}
                <p className={`text-sm font-semibold mt-1 ${
                  station.status === "Operational" ? "text-green-600" : "text-red-600"
                }`}>
                  ● {station.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>

    {/* Station List */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {corsStations.map((station) => (
        <div 
          key={station.id} 
          className={`bg-white p-6 rounded-lg shadow-lg border transition-all duration-300 ${
            nearestStation?.id === station.id 
              ? 'border-green-400 shadow-xl ring-2 ring-green-200' 
              : 'border-primary/10 hover:shadow-xl'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-primary mb-2">{station.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{station.address}</p>
              <p className="text-sm text-blue-600 font-medium mb-2">
                Coverage: {station.coverage}
              </p>
              {userLocation && (
                <p className="text-sm font-semibold text-green-600">
                  {calculateDistance(
                    userLocation[0], userLocation[1],
                    station.position[0], station.position[1]
                  ).toFixed(1)} km away
                </p>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              station.status === "Operational" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {station.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

     {/* What is CORS Network Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="flex flex-col lg:flex-row items-center gap-12">
      {/* Left side - Content */}
      <div className="flex-1 space-y-6">
        <h2 className="text-4xl font-bold text-primary">What is CORS Network?</h2>
        <p className="text-lg text-muted-foreground">
          A Continuously Operating Reference Station (CORS) network is a system of GPS/GNSS 
          stations that provide continuous, high-precision positioning data 24/7. These stations 
          serve as fixed reference points to deliver real-time centimeter-level accuracy for 
          various applications.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">High Precision Positioning</h4>
              <p className="text-muted-foreground">Achieve centimeter-level accuracy for surveying, mapping, and construction projects</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">Real-time Data</h4>
              <p className="text-muted-foreground">Access continuous GNSS data streams for immediate positioning corrections</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">Nationwide Coverage</h4>
              <p className="text-muted-foreground">Our network spans multiple states, ensuring reliable service across Nigeria</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">Multiple Applications</h4>
              <p className="text-muted-foreground">Ideal for surveying, construction, agriculture, GIS, and environmental monitoring</p>
            </div>
          </div>
        </div>
        
        <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-4">
          Learn More About CORS
        </button>
      </div>
      
      {/* Right side - Photo */}
      <div className="flex-1">
        <img 
          src={safetyImage} 
          alt="CORS Network Station" 
          className="w-full h-96 object-cover rounded-2xl shadow-lg"
        />
      </div>
    </div>
  </div>
</section>
{/* Quotation & Inquiries Section */}
{/* Simple Quotation Section */}
<section className="py-12 bg-gray-50">
  <div className="container mx-auto px-4 text-center">
    <p className="text-lg text-black">
      Need a quotation or further inquiries? Call{" "}
      <a 
        href="tel:+234987654234534" 
        className="font-bold text-blue-600 hover:text-blue-800 underline"
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

export default Training;