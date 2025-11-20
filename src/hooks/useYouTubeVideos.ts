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
  const [hasMore, setHasMore] = useState(true);

  // Your existing credentials
  const YOUTUBE_API_KEY = "AIzaSyBNAOykwGuMIXSlLxpYlPLu4Jks5StVnIw";
  const YOUTUBE_CHANNEL_ID = "UCoTVchJ_pVHYhb-MFOj-eQQ";

  // Fallback videos in case API fails
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
    }
  ];

  const fetchYouTubeVideos = useCallback(async (loadMore = false) => {
    if (!loadMore) {
      setLoading(true);
      setVideos([]);
      setError(null);
    }
    
    try {
      console.log('Fetching YouTube videos...');
      
      let url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=6&type=video`;
      
      if (loadMore && nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
      }

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
      
      const newVideos = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));

      console.log('Processed videos:', newVideos);

      if (loadMore) {
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setVideos(newVideos);
      }

      setNextPageToken(data.nextPageToken || null);
      setHasMore(!!data.nextPageToken);
      
    } catch (err) {
      console.error('YouTube API Error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      // Use fallback videos if initial load fails
      if (!loadMore) {
        console.log('Using fallback videos');
        setVideos(fallbackVideos);
      }
    } finally {
      setLoading(false);
    }
  }, [nextPageToken]);

  useEffect(() => {
    fetchYouTubeVideos();
  }, []);

  const refreshVideos = () => {
    setNextPageToken(null);
    setHasMore(true);
    fetchYouTubeVideos();
  };

  const loadMoreVideos = () => {
    if (hasMore && !loading) {
      fetchYouTubeVideos(true);
    }
  };

  return { 
    videos, 
    loading, 
    error, 
    refreshVideos, 
    loadMoreVideos, 
    hasMore 
  };
};