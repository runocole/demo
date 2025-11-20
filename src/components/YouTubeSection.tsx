import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { RefreshCw, Calendar, ArrowRight, Play } from "lucide-react";

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

const YouTubeCard = ({ video }: { video: YouTubeVideo }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-gray-200 flex-shrink-0">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{video.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
          {video.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <Button 
            variant="link" 
            className="p-0 text-red-600 hover:text-red-800 font-semibold text-sm"
            onClick={() => window.open(video.url, '_blank')}
          >
            Watch Video <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {formatDate(video.publishedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const YouTubeSection = ({ videos, loading, onRefresh, channelUrl }: YouTubeSectionProps) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore our Tutorials
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Stay updated with our latest tutorials, equipment reviews, and industry insights
          </p>
          
          <div className="flex justify-center gap-4 items-center">
            <Button 
              onClick={onRefresh}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? 'Loading...' : 'Refresh Videos'}
            </Button>
            
            <Button 
              className="bg-blue-900 hover:bg-red-700 text-white"
              onClick={() => window.open(channelUrl, '_blank')}
            >
              Subscribe to Channel
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading latest videos from GeoSSOS...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((video) => (
              <YouTubeCard key={video.id} video={video} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-blue-900 hover:bg-red-700 text-white font-bold px-8 py-6 text-lg transition-all"
            onClick={() => window.open(channelUrl, '_blank')}
          >
            Visit our YouTube Channel
          </Button>
        </div>
      </div>
    </section>
  );
};