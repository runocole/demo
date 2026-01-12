// pages/BlogPost.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPostBySlug, incrementPostViews, incrementPostLikes } from '../services/blogService';
import type { BlogPost } from '../types/blog';
import { 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Tag, 
  BookOpen,
  AlertCircle,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/skeleton';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [userLiked, setUserLiked] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      if (error?.includes('offline')) {
        fetchPost();
      }
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, slug]);

  // Check if user already liked this post
  useEffect(() => {
    if (post) {
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      setUserLiked(likedPosts.includes(post.id));
    }
  }, [post]);

  // Track view when post is loaded
  useEffect(() => {
    if (post && !hasTrackedView && !offline) {
      const trackView = async () => {
        try {
          await incrementPostViews(post.id);
          setHasTrackedView(true);
          
          // Update local state to show incremented view count
          setPost(prev => prev ? {
            ...prev,
            views: (prev.views || 0) + 1
          } : null);
          
          console.log('✅ View tracked for post:', post.id);
        } catch (error) {
          console.error('Failed to track view:', error);
        }
      };

      // Track view after a short delay
      const timer = setTimeout(() => {
        trackView();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [post, hasTrackedView, offline]);

  const fetchPost = async () => {
    if (!slug) {
      setError('No post specified');
      setLoading(false);
      return;
    }

    if (!navigator.onLine) {
      setOffline(true);
      setError('You are offline. Please check your internet connection and try again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasTrackedView(false);
    
    try {
      const data = await getBlogPostBySlug(slug);
      
      if (!data) {
        setError('Post not found');
        toast.error('Blog post not found or may have been removed');
        setTimeout(() => navigate('/blog'), 3000);
      } else {
        setPost(data);
        
        // Cache the post for offline viewing
        localStorage.setItem(`blog_post_${slug}`, JSON.stringify(data));
      }
    } catch (error: any) {
      console.error('Error fetching post:', error);
      
      if (error.code === 'failed-precondition' || 
          error.code === 'unavailable' || 
          error.message?.includes('offline')) {
        setOffline(true);
        setError('Unable to load post while offline. Please check your internet connection.');
        
        // Try to load from cache
        const cachedPost = localStorage.getItem(`blog_post_${slug}`);
        if (cachedPost) {
          try {
            setPost(JSON.parse(cachedPost));
            toast.info('Showing cached version of this post');
          } catch (e) {
            console.error('Error parsing cached post:', e);
          }
        }
      } else if (error.code === 'not-found') {
        setError('This blog post could not be found.');
        toast.error('Blog post not found');
      } else {
        setError('Failed to load the blog post. Please try again later.');
        toast.error('Failed to load post');
      }
      
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch post on component mount or slug change
  useEffect(() => {
    fetchPost();
  }, [slug]);

  // Auto-retry with exponential backoff
  useEffect(() => {
    if (error && retryCount > 0 && retryCount <= 3) {
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
      const timer = setTimeout(() => {
        if (navigator.onLine) {
          fetchPost();
        }
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchPost();
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
        toast.success('Post shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleLike = async () => {
    if (!post) return;

    if (offline) {
      toast.error('Cannot like while offline');
      return;
    }

    if (userLiked) {
      toast.info('You already liked this post');
      return;
    }

    try {
      await incrementPostLikes(post.id);
      
      // Update local state
      setPost(prev => prev ? {
        ...prev,
        likes: (prev.likes || 0) + 1
      } : null);
      
      // Mark as liked in localStorage
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      likedPosts.push(post.id);
      localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
      setUserLiked(true);
      
      toast.success('Post liked!');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const calculateReadTime = (content: string) => {
    if (!content) return 0;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white">
        <div className="container mx-auto px-4 py-16">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-8 text-blue-300 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <Skeleton className="w-full h-[400px] rounded-xl mb-8 bg-blue-900/50" />
            <Skeleton className="h-12 w-3/4 mb-4 bg-blue-900/50" />
            <div className="flex flex-wrap gap-4 mb-8">
              <Skeleton className="h-6 w-24 bg-blue-900/50" />
              <Skeleton className="h-6 w-24 bg-blue-900/50" />
              <Skeleton className="h-6 w-24 bg-blue-900/50" />
              <Skeleton className="h-6 w-24 bg-blue-900/50" />
            </div>
            {[...Array(10)].map((_, i) => (
              <Skeleton 
                key={i} 
                className={`h-4 mb-4 ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-4/5' : 'w-3/4'} bg-blue-900/50`}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white">
        <div className="container mx-auto px-4 py-16">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-8 text-blue-300 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          <div className="max-w-2xl mx-auto text-center">
            {offline ? (
              <>
                <WifiOff className="h-24 w-24 text-blue-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
                <p className="text-blue-300 mb-6">
                  Please check your internet connection to view this blog post.
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Unable to Load Post</h1>
                <p className="text-blue-300 mb-6">
                  {error || 'The blog post could not be loaded.'}
                </p>
              </>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleRetry}
                disabled={offline}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {offline ? 'Waiting for Connection...' : 'Try Again'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/blog')}
                className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse All Posts
              </Button>
            </div>
            
            {retryCount > 0 && (
              <p className="mt-6 text-sm text-blue-400">
                Attempt {retryCount} of 3
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  const readTime = calculateReadTime(post.content);

  return (
    <>
      <title>{post.metaTitle || post.title} | Blog</title>
      <meta
        name="description"
        content={post.metaDescription || post.excerpt}
      />
      <meta property="og:title" content={post.metaTitle || post.title} />
      <meta property="og:description" content={post.metaDescription || post.excerpt} />
      {post.featuredImage && (
        <meta property="og:image" content={post.featuredImage} />
      )}
      <meta property="og:type" content="article" />

      <main className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white">
        {offline && (
          <div className="bg-yellow-900/50 border-b border-yellow-700">
            <div className="container mx-auto px-4 py-2 flex items-center justify-center">
              <WifiOff className="h-4 w-4 mr-2 text-yellow-400" />
              <span className="text-sm text-yellow-300">
                You are viewing in offline mode. Some features may be limited.
              </span>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/blog')}
              className="text-blue-300 hover:text-white group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Button>
          </div>

          {/* Featured Image */}
          {post.featuredImage && post.featuredImage.trim() !== '' ? (
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                        <div class="text-center">
                          <BookOpen class="w-16 h-16 text-blue-600 mx-auto mb-4" />
                          <p class="text-lg text-blue-400">No image available</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                <p className="text-xl text-blue-400">No featured image</p>
              </div>
            </div>
          )}

          <article className="max-w-4xl mx-auto">
            {post.category && (
              <span className="inline-block px-4 py-2 rounded-full bg-blue-800 text-blue-200 text-sm font-medium mb-4">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-blue-300 mb-8 pb-8 border-b border-blue-800">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.views?.toLocaleString() || 0} views</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Heart className={`h-4 w-4 ${userLiked ? 'text-red-500 fill-red-500' : ''}`} />
                <span>{post.likes?.toLocaleString() || 0} likes</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm hover:bg-blue-800 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {post.excerpt && (
              <div className="mb-8 p-6 bg-blue-900/20 rounded-xl border border-blue-800">
                <p className="text-xl text-blue-200 italic">{post.excerpt}</p>
              </div>
            )}

            <div className="prose prose-lg prose-invert max-w-none mb-12">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-blue-200 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 py-8 border-t border-blue-800">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-white"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleLike}
                  disabled={offline || userLiked}
                  className={`border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-white ${userLiked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart className={`mr-2 h-4 w-4 ${userLiked ? 'text-red-500 fill-red-500' : ''}`} />
                  {userLiked ? 'Liked' : 'Like'} ({post.likes || 0})
                </Button>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/blog')}
                className="text-blue-300 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all articles
              </Button>
            </div>
          </article>

          <section className="mt-16 pt-12 border-t border-blue-800">
            <h2 className="text-2xl font-bold mb-8 text-center">
              More articles you might like
            </h2>
            <div className="text-center">
              <Button
                onClick={() => navigate('/blog')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Browse All Articles
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}