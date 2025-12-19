import { useState, useEffect, useCallback } from "react";

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
}

export const useYouTubeVideos = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  // Your existing credentials
  const YOUTUBE_API_KEY = "AIzaSyBNAOykwGuMIXSlLxpYlPLu4Jks5StVnIw";
  const YOUTUBE_CHANNEL_ID = "UCoTVchJ_pVHYhb-MFOj-eQQ";

  // Fallback videos in case API fails - limited to 6
  const fallbackVideos: YouTubeVideo[] = [
    {
      id: "t2ZC7ReBJ5c",
      title: "GeoSSOTech Survey Solutions",
      thumbnail: "https://i.ytimg.com/vi/t2ZC7ReBJ5c/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=t2ZC7ReBJ5c",
      channelTitle: "GeoSSOTech",
      publishedAt: new Date().toISOString(),
      description: "Professional surveying and geospatial solutions"
    },
    {
      id: "Xg_0syy9CGs",
      title: "Advanced Drone Mapping",
      thumbnail: "https://i.ytimg.com/vi/Xg_0syy9CGs/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=Xg_0syy9CGs",
      channelTitle: "GeoSSOTech",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Cutting-edge drone mapping technologies and applications"
    },
    {
      id: "zrFfxnD2wQg",
      title: "GNSS Equipment Guide",
      thumbnail: "https://i.ytimg.com/vi/zrFfxnD2wQg/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=zrFfxnD2wQg",
      channelTitle: "GeoSSOTech",
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Comprehensive guide to GNSS surveying equipment"
    },
    {
      id: "fallback-4",
      title: "Total Station Training",
      thumbnail: "https://i.ytimg.com/vi/dummy/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=dummy4",
      channelTitle: "GeoSSOTech",
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Learn how to use total stations effectively"
    },
    {
      id: "fallback-5",
      title: "CORS Network Setup",
      thumbnail: "https://i.ytimg.com/vi/dummy/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=dummy5",
      channelTitle: "GeoSSOTech",
      publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Setting up Continuously Operating Reference Stations"
    },
    {
      id: "fallback-6",
      title: "Hydrographic Surveying",
      thumbnail: "https://i.ytimg.com/vi/dummy/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=dummy6",
      channelTitle: "GeoSSOTech",
      publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Underwater surveying techniques and equipment"
    }
  ];

  const fetchYouTubeVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching YouTube videos...');
      
      // Always fetch exactly 6 videos
      const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=6&type=video`;
      
      console.log('API URL:', url.replace(YOUTUBE_API_KEY, 'HIDDEN_KEY'));

      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = 'Failed to load videos';
        if (response.status === 403) {
          errorMessage = 'YouTube API quota exceeded or access denied';
        } else if (response.status === 400) {
          errorMessage = 'Invalid API request - check channel ID';
        }
        
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (!data.items || data.items.length === 0) {
        throw new Error('No videos found on this channel');
      }
      
      // Process videos and ensure we have exactly 6
      let processedVideos = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));

      // If API returns fewer than 6 videos, pad with fallbacks
      if (processedVideos.length < 6) {
        console.log(`API returned only ${processedVideos.length} videos, padding with fallbacks`);
        const neededFallbacks = fallbackVideos.slice(0, 6 - processedVideos.length);
        processedVideos = [...processedVideos, ...neededFallbacks];
      }

      // Take only the first 6 to be absolutely sure
      const finalVideos = processedVideos.slice(0, 6);
      
      console.log('Final videos (6 max):', finalVideos);
      setVideos(finalVideos);
      setNextPageToken(data.nextPageToken || null);
      
    } catch (err) {
      console.error('YouTube API Error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      // Always return exactly 6 videos (from fallback)
      console.log('Using fallback videos (6 max)');
      setVideos(fallbackVideos.slice(0, 6));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYouTubeVideos();
  }, [fetchYouTubeVideos]);

  const refreshVideos = () => {
    fetchYouTubeVideos();
  };

  return { 
    videos,  
    loading, 
    error, 
    refreshVideos
  };
};