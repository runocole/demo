import { useState, useEffect } from 'react';
import { useBlogPosts } from '../hooks/useBlogPosts';
import type { BlogPost } from '../types/blog';
import { BlogHero } from '../components/blog/BlogHero';
import { BlogGrid } from '../components/blog/BlogGrid';
import { BlogSkeleton } from '../components/blog/BlogSkeleton';
import { 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp,
  Clock,
  Eye,
  User,
  Tag,
  ChevronDown
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';

export default function Blog() {
  const { posts, loading, hasMore, fetchMore } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

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

  // Find featured post
  useEffect(() => {
    if (posts.length > 0) {
      const featured = posts.find(post => post.isFeatured);
      if (featured) {
        setFeaturedPost(featured);
      } else {
        setFeaturedPost(posts[0]); // Fallback to first post
      }
    }
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    // Search filter
    if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && post.category !== categoryFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      case 'oldest':
        return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      case 'featured':
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      default:
        return 0;
    }
  });

  // Calculate reading time
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  // Stats
  const stats = {
    total: posts.length,
    categories: [...new Set(posts.map(p => p.category).filter(Boolean))].length,
    totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    totalReadTime: posts.reduce((sum, post) => sum + calculateReadTime(post.content), 0),
  };

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
        {/* Stats Banner */}
        <div className="border-b border-blue-800 bg-blue-900/50">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-800 p-2">
                    <FileText className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Total Posts</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-800 p-2">
                    <Eye className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Total Views</p>
                    <p className="text-xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-800 p-2">
                    <Clock className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Reading Time</p>
                    <p className="text-xl font-bold">{Math.round(stats.totalReadTime / 60)}h</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-white"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Top Articles
              </Button>
            </div>
          </div>
        </div>

        <BlogHero featuredPost={featuredPost} />

        {/* Filters Section */}
        <section className="container mx-auto py-8">
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

        <section className="container mx-auto pb-16 lg:pb-24">
          {loading && posts.length === 0 ? (
            <BlogSkeleton />
          ) : (
            <BlogGrid
              posts={filteredPosts}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={fetchMore}
              showCategory={true}
            />
          )}
        </section>
      </main>
    </>
  );
}

// Add missing FileText import at the top with other imports
import { FileText } from 'lucide-react';