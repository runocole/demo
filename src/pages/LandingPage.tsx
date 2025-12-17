import Header from "../components/Header";
import Footer from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { YouTubeSection } from "../components/YouTubeSection";
import { CarouselSection } from "../components/CarouselSection";
import { VideoSection } from "../components/VideoSection";
import { useYouTubeVideos } from "../hooks/useYouTubeVideos";
import CurrencyBoxes from "../components/CurrencyBoxes";
// 👇 Import the Product type so we can use it for casting
import type { Product, ProductCategory } from "../types/product"; 

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

  // 👇 FIX: We cast the result 'as Product[]' to satisfy strict TypeScript checks
  const accessoriesWithStock = ACCESSORIES.map(item => ({
    ...item,
    id: String(item.id), 
    inStock: true,
    specifications: [],
    // Ensure category exists, or provide a default fallback
    category: (item.category || "Accessories") as ProductCategory 
  })) as Product[]; // 👈 THIS IS THE KEY FIX

  const equipmentWithStock = FEATURED_EQUIPMENT.map(item => ({
    ...item,
    id: String(item.id),
    inStock: true,
    specifications: [],
    // Ensure category exists, or provide a default fallback
    category: (item.category || "Equipment") as ProductCategory
  })) as Product[]; // 👈 THIS IS THE KEY FIX

  return (
    <div className="min-h-screen bg-white">
      {/* CurrencyBoxes is now self-contained */}
      <CurrencyBoxes />

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

      {/* ACCESSORIES SECTION */}
      <div className="container mx-auto px-6">
        <div className="h-0.5 bg-gray-400 my-16 w-full"></div>
      </div>

      <CarouselSection 
        title="Accessories"
        items={accessoriesWithStock} 
        buttonText="Browse All Accessories"
        showCategory={true}
      />

      {/* EQUIPMENT SECTION */}
      <CarouselSection 
        title="Equipments"
        items={equipmentWithStock}
        buttonText="View All Equipment"
      />
       
       {/* YOUTUBE CHANNEL SECTION */}
      <YouTubeSection 
        videos={videos}
        loading={loading}
        onRefresh={refreshVideos}
        channelUrl="https://youtube.com/channel/UCoTVchJ_pVHYhb-MFOj-eQQ"
      />

      {/* FULL WIDTH VIDEO SECTION */}
      <VideoSection videoUrl="https://www.youtube.com/embed/LzsSBPmcQcA" />

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default LandingPage;