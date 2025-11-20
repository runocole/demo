import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { YouTubeSection } from "../components/YouTubeSection";
import { CarouselSection } from "../components/CarouselSection";
import { VideoSection } from "../components/VideoSection";
import { useYouTubeVideos } from "../hooks/useYouTubeVideos";
import CurrencyBoxes from "../components/CurrencyBoxes";
import type { CurrencyType } from "../types/currency";

// Import everything from the data file
import {
  SLIDES,
  ACCESSORIES,
  FEATURED_EQUIPMENT,
  ABOUT_CONTENT
} from "../data/product";

// Main Component
const LandingPage: React.FC = () => {
  const { videos, loading, refreshVideos } = useYouTubeVideos();
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyType>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1500);

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/exchange-rate');
        const data = await response.json();
        setExchangeRate(data.rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        // Fallback rate
        setExchangeRate(1500);
      }
    };

    fetchExchangeRate();
    
    // Optional: Refresh rate every hour
    const interval = setInterval(fetchExchangeRate, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleCurrencyChange = (currency: CurrencyType) => {
    setCurrentCurrency(currency);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* CURRENCY BOXES - CENTER OF PAGE */}
      <CurrencyBoxes
        currentCurrency={currentCurrency}
        exchangeRate={exchangeRate}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* HEADER WITH STAFF LOGIN */}
      <div className="relative">
        <Header />
      </div>

      {/* HERO SECTION */}
      <HeroSection slides={SLIDES} />
      
      {/* ABOUT PREVIEW SECTION */}
      <AboutSection 
        title={ABOUT_CONTENT.title}
        description={ABOUT_CONTENT.description}
        videoUrl={ABOUT_CONTENT.videoUrl}
      />

      {/* YOUTUBE CHANNEL SECTION */}
      <YouTubeSection 
        videos={videos}
        loading={loading}
        onRefresh={refreshVideos}
        channelUrl="https://youtube.com/channel/UCoTVchJ_pVHYhb-MFOj-eQQ"
      />

      {/* ACCESSORIES SECTION */}
      <div className="container mx-auto px-6">
        <div className="h-0.5 bg-gray-400 my-16 w-full"></div>
      </div>

      <CarouselSection 
        title="Accessories"
        items={ACCESSORIES}
        buttonText="Browse All Accessories"
        showCategory={true}
      />

      {/* EQUIPMENT SECTION */}
      <CarouselSection 
        title="Equipments"
        items={FEATURED_EQUIPMENT}
        buttonText="View All Equipment"
      />

      {/* FULL WIDTH VIDEO SECTION */}
      <VideoSection videoUrl="https://www.youtube.com/embed/LzsSBPmcQcA" />

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default LandingPage;