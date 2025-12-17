// components/blog/BlogGrid.tsx
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Eye, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import type { BlogPost } from '../../types/blog';

interface BlogGridProps {
  posts: BlogPost[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => Promise<void>;
  showCategory?: boolean;
}

export const BlogGrid = ({ 
  posts, 
  loading, 
  hasMore, 
  onLoadMore,
  showCategory = false 
}: BlogGridProps) => {
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-bold mb-2">No articles found</h3>
        <p className="text-blue-300">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((post) => {
          const readTime = calculateReadTime(post.content);
          const hasFeaturedImage = post.featuredImage && post.featuredImage.trim() !== '';
          
          return (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="group block"
            >
              <Card className="h-full border-blue-800 bg-blue-900/20 hover:bg-blue-900/40 transition-all duration-300 hover:border-blue-700 overflow-hidden">
                <CardContent className="p-0">
                  {/* Cover Image - Fixed: Only render if image exists */}
                  <div className="aspect-[16/9] overflow-hidden bg-blue-950/50">
                    {hasFeaturedImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = 'none';
                          // Show placeholder instead
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-blue-900/50">
                                <div class="text-center">
                                  <div class="text-4xl mb-2">📝</div>
                                  <p class="text-xs text-blue-400">No image available</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      // Image placeholder when no image exists
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-400">No image available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    {showCategory && post.category && (
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-800 text-blue-200 mb-3">
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                      </span>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {post.title || 'Untitled Post'}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-blue-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt || 'No excerpt available...'}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-blue-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            }) : 'Date unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{readTime || 0} min</span>
                        </div>
                      </div>
                      
                      {post.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Read More */}
                    <div className="mt-4 pt-4 border-t border-blue-800 flex items-center justify-between">
                      <span className="text-sm text-blue-300 group-hover:text-white transition-colors">
                        Read article
                      </span>
                      <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Loading...
              </>
            ) : (
              'Load More Articles'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};