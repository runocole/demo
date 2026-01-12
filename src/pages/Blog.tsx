// pages/Blog.tsx
import { useState, useEffect, useRef } from 'react';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useNavigate } from 'react-router-dom';
import type { BlogPost } from '../types/blog';
import { BlogHero } from '../components/blog/BlogHero';
import { BlogGrid } from '../components/blog/BlogGrid';
import { BlogSkeleton } from '../components/blog/BlogSkeleton';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock,
  Eye,
  FileText,
  Home,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function Blog() {
  const { posts, loading, hasMore, fetchMore } = useBlogPosts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  // Categories from admin
  const categories = [
    'all',
    'general',
    'technology',
    'design',
    'business',
    'lifestyle',
    'tutorial',
    'news'
  ];

  // Set initial loading state
  useEffect(() => {
    if (posts !== undefined) {
      // Give a small delay for better UX
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [posts]);

  // Scroll to articles section
  const scrollToArticles = () => {
    if (articlesSectionRef.current) {
      const yOffset = -80;
      const y = articlesSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Find featured post
  useEffect(() => {
    if (posts && posts.length > 0) {
      const featured = posts.find(post => post && post.isFeatured);
      if (featured) {
        setFeaturedPost(featured);
      } else if (posts[0]) {
        setFeaturedPost(posts[0]);
      } else {
        setFeaturedPost(null);
      }
    } else {
      setFeaturedPost(null);
    }
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = (posts || []).filter(post => {
    if (!post) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = post.title?.toLowerCase().includes(searchLower) || false;
      const excerptMatch = post.excerpt?.toLowerCase().includes(searchLower) || false;
      const tagMatch = post.tags?.some(tag => tag?.toLowerCase().includes(searchLower)) || false;
      
      if (!titleMatch && !excerptMatch && !tagMatch) {
        return false;
      }
    }
    
    // Category filter
    if (categoryFilter !== 'all' && post.category !== categoryFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (!a || !b) return 0;
    
    switch (sortBy) {
      case 'newest':
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateB - dateA;
      case 'oldest':
        const dateAOld = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateBOld = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateAOld - dateBOld;
      case 'popular':
        const viewsA = a.views || 0;
        const viewsB = b.views || 0;
        return viewsB - viewsA;
      case 'featured':
        const featuredA = a.isFeatured ? 1 : 0;
        const featuredB = b.isFeatured ? 1 : 0;
        return featuredB - featuredA;
      default:
        return 0;
    }
  });

  // Calculate reading time
  const calculateReadTime = (content: string) => {
    if (!content) return 0;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  // Stats
  const stats = {
    total: posts?.length || 0,
    categories: [...new Set((posts || []).map(p => p?.category).filter(Boolean))].length,
    totalViews: (posts || []).reduce((sum, post) => sum + (post?.views || 0), 0),
    totalReadTime: (posts || []).reduce((sum, post) => sum + calculateReadTime(post?.content || ''), 0),
  };

  const handleLoadMore = async () => {
    await fetchMore();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Show full page loader while initial data is loading
  if (initialLoading || (loading && posts?.length === 0)) {
    return (
      <main className="min-h-screen bg-blue-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Loading Blog</h2>
          <p className="text-blue-400">Fetching the latest articles...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <title>Blog | Fresh Insights & Ideas</title>
      <meta
        name="description"
        content="Explore thoughtful articles on design, technology, and creativity. Updated weekly with fresh perspectives and insights."
      />
      <meta property="og:title" content="Blog | Fresh Insights & Ideas" />
      <meta
        property="og:description"
        content="Explore thoughtful articles on design, technology, and creativity."
      />
      <meta property="og:type" content="website" />

      <main className="min-h-screen bg-blue-950 text-white">
        {/* Top Navigation Bar */}
        <div className="border-b border-blue-800 bg-blue-900/70 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="text-blue-300 hover:text-white hover:bg-blue-800/50"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="text-center">
                <h1 className="text-xl font-bold text-blue-100">Blog</h1>
                <p className="text-xs text-blue-400">Fresh Insights & Ideas</p>
              </div>
              
              <Button
                variant="ghost"
                onClick={handleGoHome}
                className="text-blue-300 hover:text-white hover:bg-blue-800/50"
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>

        {/* BlogHero with loading state */}
        <BlogHero 
          featuredPost={featuredPost} 
          scrollToArticles={scrollToArticles}
          loading={loading && !featuredPost}
        />

        {/* Show empty state if no posts */}
        {!loading && (posts?.length === 0) && (
          <section className="container mx-auto px-4 py-20 text-center">
            <FileText className="h-24 w-24 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-blue-300 mb-4">No Articles Yet</h2>
            <p className="text-blue-400 mb-8 max-w-md mx-auto">
              There are no blog posts available at the moment. Please check back later.
            </p>
            <Button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </section>
        )}

        {/* Filters Section - Only show if we have posts */}
        {(posts?.length || 0) > 0 && (
          <section className="container mx-auto px-4 py-8">
            <Card className="border-blue-800 bg-blue-900/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                      <Input
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-blue-950 border-blue-700 text-white placeholder:text-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[180px] bg-blue-950 border-blue-700">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-950 border-blue-700 text-white">
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] bg-blue-950 border-blue-700">
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-950 border-blue-700 text-white">
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="featured">Featured First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {searchTerm && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-blue-300">
                      Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm('')}
                      className="text-blue-400 hover:text-white"
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Blog Posts Grid with ref */}
        {(posts?.length || 0) > 0 && (
          <section 
            ref={articlesSectionRef}
            className="container mx-auto px-4 pb-16 lg:pb-24"
            id="articles-section"
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
              <p className="text-blue-300 text-lg">Browse all our latest posts and updates</p>
            </div>
            
            {loading && (posts || []).length === 0 ? (
              <BlogSkeleton />
            ) : (
              <BlogGrid
                posts={filteredPosts}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                showCategory={true}
              />
            )}
          </section>
        )}

        {/* Bottom Navigation */}
        <div className="border-t border-blue-800 bg-blue-900/50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-blue-400">
                  © {new Date().getFullYear()} Blog. All rights reserved.
                </p>
              </div>
              
              <div className="flex gap-4">
                {(posts?.length || 0) > 0 && (
                  <Button
                    variant="outline"
                    onClick={scrollToArticles}
                    className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-white"
                    size="sm"
                  >
                    Browse Articles
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-white"
                  size="sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}