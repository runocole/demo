import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { RefreshCw, Calendar, ArrowRight, Play, ExternalLink, Users } from "lucide-react";
import { cn } from "../lib/utils";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
}

interface YouTubeSectionProps {
  videos: YouTubeVideo[];
  loading: boolean;
  onRefresh: () => void;
  channelUrl: string;
}

const YouTubeCard = ({ video, isMobile }: { video: YouTubeVideo, isMobile: boolean }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: diffDays > 365 ? 'numeric' : undefined
    });
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(video.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col border-gray-200",
        "hover:border-blue-300 hover:scale-[1.02]",
        isMobile ? "shadow-sm" : "shadow-md"
      )}
      onClick={handleVideoClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
        {!imageError ? (
          <>
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">{video.channelTitle}</p>
            </div>
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "bg-red-600 rounded-full flex items-center justify-center transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-lg",
            isMobile ? "w-12 h-12" : "w-16 h-16"
          )}>
            <Play className={cn(
              "text-white",
              isMobile ? "w-5 h-5 ml-0.5" : "w-7 h-7 ml-1"
            )} />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          15:30
        </div>
      </div>
      
      <CardContent className={cn(
        "p-4 flex flex-col flex-grow",
        isMobile ? "p-3" : "p-4"
      )}>
        <h3 className={cn(
          "font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors",
          isMobile ? "text-sm" : "text-base"
        )}>
          {video.title}
        </h3>
        
        <div className="mb-2">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Users className="w-3 h-3" />
            <span>{video.channelTitle}</span>
          </div>
        </div>

        <p className={cn(
          "text-gray-600 line-clamp-2 mb-3 flex-grow",
          isMobile ? "text-xs" : "text-sm"
        )}>
          {video.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(video.publishedAt)}</span>
          </div>
          
          <Button 
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            className={cn(
              "text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto",
              isMobile ? "text-xs" : "text-sm"
            )}
            onClick={(e) => {
              e.stopPropagation();
              window.open(video.url, '_blank', 'noopener,noreferrer');
            }}
          >
            Watch
            {!isMobile && <ArrowRight className="w-3 h-3 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ALL_VIDEOS_POOL: YouTubeVideo[] = [
  {
    id: "OMyWNWkmPJ8",
    title: "Getting started with SNAP for satellite image processing",
    thumbnail: "https://img.youtube.com/vi/OMyWNWkmPJ8/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=OMyWNWkmPJ8",
    channelTitle: "GeoSSOS",
    publishedAt: "2022-08-10",
    description: "Learn how to get started with SNAP (Sentinel Application Platform) for satellite image processing."
  },
  {
    id: "85-hsfRTLT8",
    title: "Remote Sensing basics and applications",
    thumbnail: "https://img.youtube.com/vi/85-hsfRTLT8/maxresdefault.jpg",
    url: "https://youtu.be/85-hsfRTLT8",
    channelTitle: "GeoSSOS",
    publishedAt: "2022-09-15",
    description: "Introduction to remote sensing concepts and applications in geospatial analysis."
  },
  {
    id: "ZOoLZPsJzek",
    title: "GIS Tutorial for Beginners - Complete guide",
    thumbnail: "https://img.youtube.com/vi/ZOoLZPsJzek/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=ZOoLZPsJzek",
    channelTitle: "GeoSSOS",
    publishedAt: "2023-01-20",
    description: "Complete GIS tutorial for beginners covering essential tools and techniques."
  },
  {
    id: "0Oi0T5pwJpc",
    title: "Satellite Image Processing Guide",
    thumbnail: "https://img.youtube.com/vi/0Oi0T5pwJpc/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=0Oi0T5pwJpc",
    channelTitle: "GeoSSOS",
    publishedAt: "2023-03-05",
    description: "Step-by-step guide to processing satellite imagery for various applications."
  },
  {
    id: "nyUFQk9TK_s",
    title: "Advanced Geospatial Data Analysis",
    thumbnail: "https://img.youtube.com/vi/nyUFQk9TK_s/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=nyUFQk9TK_s",
    channelTitle: "GeoSSOS",
    publishedAt: "2023-05-12",
    description: "Advanced techniques for analyzing geospatial data using modern tools."
  },
  {
    id: "8QsvNGoQrto",
    title: "Drone Mapping Techniques and Applications",
    thumbnail: "https://img.youtube.com/vi/8QsvNGoQrto/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=8QsvNGoQrto",
    channelTitle: "GeoSSOS",
    publishedAt: "2023-07-18",
    description: "Learn how to use drones for mapping and 3D modeling applications."
  },
  {
    id: "WmBwDUbjZ2I",
    title: "Environmental Monitoring with GIS Tools",
    thumbnail: "https://img.youtube.com/vi/WmBwDUbjZ2I/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=WmBwDUbjZ2I",
    channelTitle: "GeoSSOS",
    publishedAt: "2023-09-22",
    description: "Using GIS for environmental monitoring and conservation efforts."
  },
  {
    id: "additional1",
    title: "QGIS Complete Tutorial Series",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channelTitle: "GeoSSOS",
    publishedAt: "2023-11-30",
    description: "Master QGIS from beginner to advanced level with practical examples."
  },
  {
    id: "additional2",
    title: "Python for Geospatial Data Analysis",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channelTitle: "GeoSSOS",
    publishedAt: "2024-01-15",
    description: "Learn Python programming specifically for geospatial data processing and analysis."
  },
  {
    id: "additional3",
    title: "3D Terrain Modeling with DEM Data",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channelTitle: "GeoSSOS",
    publishedAt: "2024-02-28",
    description: "Create stunning 3D terrain models using DEM data and visualization tools."
  }
];

const YOUR_CHANNEL_URL = "https://www.youtube.com/channel/UCoTVchJ_pVHYhb-MFOj-eQQ";

export const YouTubeSection = ({
  videos: externalVideos = [],
  loading: externalLoading = false,
  onRefresh: externalOnRefresh,
  channelUrl = YOUR_CHANNEL_URL
}: Partial<YouTubeSectionProps> = {}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [internalVideos, setInternalVideos] = useState<YouTubeVideo[]>(ALL_VIDEOS_POOL.slice(0, 6));
  const [internalLoading, setInternalLoading] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use external props if provided, otherwise use internal state
  const videos = externalVideos.length > 0 ? externalVideos : internalVideos;
  const loading = externalLoading || internalLoading;

  const handleRefresh = () => {
    if (externalOnRefresh) {
      externalOnRefresh();
    } else {
      setInternalLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Shuffle the videos and take first 6
        const shuffled = [...ALL_VIDEOS_POOL]
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        setInternalVideos(shuffled);
        setInternalLoading(false);
      }, 800);
    }
  };

  const handleChannelClick = () => {
    window.open(channelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-8 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Explore Our Tutorials
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8">
            Stay updated with our latest tutorials, equipment reviews, and industry insights
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              disabled={loading}
              size={isMobile ? "default" : "lg"}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Loading...' : 'Refresh Videos'}
            </Button>
            
            <Button 
              className="bg-blue-900 hover:bg-blue-700 text-white"
              onClick={handleChannelClick}
              size={isMobile ? "default" : "lg"}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Subscribe to Channel
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-40 space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-gray-600 text-sm md:text-base">
              Loading latest videos from GeossoTech...
            </span>
          </div>
        ) : (
          <>
            {/* Videos Grid */}
            <div className={cn(
              "grid gap-4 md:gap-6 lg:gap-8",
              isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}>
              {videos.map((video) => (
                <YouTubeCard 
                  key={video.id} 
                  video={video} 
                  isMobile={isMobile} 
                />
              ))}
            </div>

            {/* Empty State */}
            {videos.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos available</h3>
                <p className="text-gray-600 mb-6">Check back later for new content</p>
                <Button onClick={handleRefresh}>
                  Try Again
                </Button>
              </div>
            )}

            {/* View More Button */}
            <div className="text-center mt-10 md:mt-12 lg:mt-16">
              <Button 
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold transition-all group",
                  isMobile ? "w-full px-6 py-5" : "px-10 py-7 text-lg"
                )}
                onClick={handleChannelClick}
              >
                <span className="flex items-center gap-2">
                  Visit our YouTube Channel
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Gradient Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mt-8 md:mt-12"></div>
    </section>
  );
};