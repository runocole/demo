import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { YouTubeSection } from "../components/YouTubeSection";
import { CarouselSection } from "../components/CarouselSection";
import { VideoSection } from "../components/VideoSection";
import { useYouTubeVideos } from "../hooks/useYouTubeVideos";
import CurrencyBoxes from "../components/CurrencyBoxes";
import type { Product, ProductCategory } from "../types/product"; 
import type { Slide as HeroSlide } from "../components/HeroSection"; // Import HeroSection Slide type
import {
  SLIDES as PRODUCT_SLIDES, // Rename to avoid conflict
  ACCESSORIES,
  FEATURED_EQUIPMENT,
  ABOUT_CONTENT,
  MOBILE_ABOUT_CONTENT 
} from "../data/product";

// Define the Slide interface from product.ts to ensure compatibility
interface ProductSlide {
  image: string;
  mobileImage: string; // This is optional in product.ts but required in HeroSection
  title: string;
  subtitle: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  position: 'left' | 'center' | 'right';
}

// Type guard to check if slides have mobileImage
const hasMobileImage = (slide: any): slide is HeroSlide => {
  return slide.mobileImage !== undefined && slide.mobileImage !== null;
};

// Convert product slides to HeroSection slides (ensuring mobileImage exists)
const convertToHeroSlides = (slides: ProductSlide[]): HeroSlide[] => {
  return slides.map(slide => ({
    ...slide,
    // Ensure mobileImage exists - if not, use the regular image as fallback
    mobileImage: slide.mobileImage || slide.image
  }));
};

// Main Component
const LandingPage: React.FC = () => {
  const { videos, loading, refreshVideos } = useYouTubeVideos();
  const [isMobile, setIsMobile] = useState(false);
  
  // Convert slides to HeroSection format
  const heroSlides = convertToHeroSlides(PRODUCT_SLIDES);
  
  const accessoriesWithStock = ACCESSORIES.map(item => ({
    ...item,
    id: `acc-${item.id}`, 
    inStock: true,
    specifications: [],
    category: (item.category || "Accessories") as ProductCategory 
  })) as Product[];

  const equipmentWithStock = FEATURED_EQUIPMENT.map(item => ({
    ...item,
    id: `eq-${item.id}`, 
    inStock: true,
    specifications: [],
    category: (item.category || "Equipment") as ProductCategory
  })) as Product[];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get the appropriate about content based on device
  const aboutTitle = isMobile ? MOBILE_ABOUT_CONTENT.title : ABOUT_CONTENT.title;
  const aboutDescription = isMobile ? MOBILE_ABOUT_CONTENT.description : ABOUT_CONTENT.description;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* CurrencyBoxes is now self-contained */}
      <div className={`${isMobile ? 'px-2' : ''}`}>
        <CurrencyBoxes />
      </div>

      {/* HEADER WITH STAFF LOGIN */}
      <div className="relative">
        <Header />
      </div>

      {/* Mobile Spacing */}
      {isMobile && <div className="h-20" />}

      {/* HERO SECTION */}
      <div className={`${isMobile ? 'mt-4' : ''}`}>
        <HeroSection slides={heroSlides} />
      </div>
      
     {/* ABOUT PREVIEW SECTION */}
     <div className={`${isMobile ? 'px-4' : ''}`}>
     <AboutSection 
    title={<span className="text-blue-900">{aboutTitle}</span>} 
    description={aboutDescription}
    videoUrl={ABOUT_CONTENT.videoUrl}
      />
     </div>
      {/* ACCESSORIES SECTION */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="h-0.5 bg-blue-900 my-8 sm:my-16 w-full"></div>
      </div>

      <div className={`${isMobile ? 'px-2' : ''}`}>
        <CarouselSection 
          title="Accessories"
          items={accessoriesWithStock} 
          buttonText="Browse All Accessories"
        />
      </div>

      {/* EQUIPMENT SECTION */}
      <div className={`mt-8 ${isMobile ? 'px-2' : ''}`}>
        <CarouselSection 
          title="Equipments"
          items={equipmentWithStock}
          buttonText="View All Equipment"
        />
      </div>
       
      {/* YOUTUBE CHANNEL SECTION */}
      <div className={`mt-8 ${isMobile ? 'px-4' : ''}`}>
        <YouTubeSection 
          videos={videos}
          loading={loading}
          onRefresh={refreshVideos}
          channelUrl="https://youtube.com/channel/UCoTVchJ_pVHYhb-MFOj-eQQ"
        />
      </div>

      {/* FULL WIDTH VIDEO SECTION */}
      <div className="mt-8">
        <VideoSection videoUrl="https://youtu.be/t2ZC7ReBJ5c?si=GJYeXFYh49xJ01ME" />
      </div>

      {/* FOOTER */}
      <div className="mt-8">
        <Footer />
      </div>

      {/* Mobile Bottom Spacing for Navigation */}
      {isMobile && <div className="h-16" />}
    </div>
  );
};

export default LandingPage;