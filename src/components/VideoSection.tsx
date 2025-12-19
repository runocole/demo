import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface VideoSectionProps {
  videoUrl: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showControls?: boolean;
  className?: string;
}

export const VideoSection = ({ 
  videoUrl, 
  title = "YouTube video player",
  autoPlay = true,
  muted = true,
  loop = true,
  showControls = true,
  className = ""
}: VideoSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreenToggle = () => {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Construct YouTube embed URL with parameters
  const constructYouTubeUrl = () => {
    const url = new URL(videoUrl);
    
    // Add parameters
    url.searchParams.set('autoplay', isPlaying ? '1' : '0');
    url.searchParams.set('mute', isMuted ? '1' : '0');
    url.searchParams.set('loop', loop ? '1' : '0');
    url.searchParams.set('playsinline', '1'); // For iOS
    url.searchParams.set('rel', '0'); // Don't show related videos
    url.searchParams.set('modestbranding', '1'); // Minimal YouTube branding
    url.searchParams.set('showinfo', '0'); // Hide video info
    
    if (showControls) {
      url.searchParams.set('controls', '1');
    } else {
      url.searchParams.set('controls', '0');
    }

    return url.toString();
  };

  // Responsive height calculation
  const getVideoHeight = () => {
    if (isMobile) {
      return isFullscreen ? '100vh' : '56.25vw'; // 16:9 aspect ratio on mobile
    }
    return isFullscreen ? '100vh' : '600px';
  };

  return (
    <section className={cn(
      "bg-white py-6 md:py-12",
      isFullscreen && "fixed inset-0 z-50 bg-black",
      className
    )}>
      <div className={cn(
        "container mx-auto px-4 sm:px-6",
        isFullscreen && "h-full p-0"
      )}>
        {!isFullscreen && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              Watch Our Latest Demo
            </h2>
            <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">
              See our equipment in action with detailed demonstrations
            </p>
          </div>
        )}

        <div className="relative rounded-lg md:rounded-xl overflow-hidden shadow-lg md:shadow-2xl bg-gray-900 group">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                <p className="text-white">Loading video...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Video Unavailable</h3>
                  <p className="text-gray-300">
                    The video couldn't be loaded. Please check your connection or try again later.
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* YouTube Iframe */}
          <iframe
            className={cn(
              "w-full transition-all duration-300",
              isFullscreen ? "h-screen" : "h-[50vh] sm:h-[56.25vw] max-h-[600px]"
            )}
            style={{ height: getVideoHeight() }}
            src={constructYouTubeUrl()}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />

          {/* Custom Controls Overlay (Desktop) */}
          {!isMobile && showControls && !isFullscreen && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white"
                  onClick={handleFullscreenToggle}
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Controls Info */}
          {isMobile && !isFullscreen && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
              Tap to play
            </div>
          )}

          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <Button
              onClick={handleFullscreenToggle}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white z-20"
              size="sm"
            >
              Exit Fullscreen
            </Button>
          )}
        </div>

        {/* Video Info (Desktop only) */}
        {!isMobile && !isFullscreen && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Product Demonstration</h3>
                <p className="text-sm text-gray-600">
                  Watch our latest equipment in action
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>YouTube</span>
                <span>•</span>
                <span>HD Quality</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Instructions */}
        {isMobile && !isFullscreen && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Tap the video to play. Rotate phone for fullscreen.
            </p>
          </div>
        )}

        {/* Video Actions */}
        {!isFullscreen && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={handleFullscreenToggle}
            >
              <Maximize className="w-4 h-4" />
              Fullscreen View
            </Button>
            <a
              href={videoUrl.replace('/embed/', '/watch?v=')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <span>Watch on YouTube</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};