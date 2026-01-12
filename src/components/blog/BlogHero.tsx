// components/blog/BlogHero.tsx
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import type { BlogPost } from '../../types/blog';
import { useState, useEffect } from 'react';

interface BlogHeroProps {
  featuredPost?: BlogPost | null;
  scrollToArticles: () => void;
  loading?: boolean; // Add loading prop
}

export const BlogHero = ({ featuredPost, scrollToArticles, loading = false }: BlogHeroProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading skeleton if loading
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
        <div className="space-y-6">
          {/* Loading skeleton for featured post */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 w-32 bg-blue-900/50 rounded-lg animate-pulse"></div>
              <div className="h-16 md:h-20 bg-blue-900/50 rounded-lg animate-pulse"></div>
              <div className="h-6 bg-blue-900/50 rounded-lg animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-10 w-32 bg-blue-900/50 rounded-lg animate-pulse"></div>
                <div className="h-10 w-40 bg-blue-900/50 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="aspect-[4/3] bg-blue-900/50 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Don't show anything if no featured post
  if (!featuredPost) {
    return null;
  }

  const readTime = Math.ceil(featuredPost.content.trim().split(/\s+/).length / 200);

  return (
    <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
      {isMobile ? (
        // Mobile Layout
        <div className="space-y-6">
          {/* Mobile Featured Badge */}
          <div className="flex items-center justify-between">
            <span className="inline-block px-3 py-1 text-xs md:text-sm font-medium rounded-full bg-blue-800 text-blue-200">
              Featured
            </span>
            <button 
              onClick={scrollToArticles}
              className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          {/* Mobile Image */}
          <div className="relative">
            <div className="aspect-[16/9] rounded-xl md:rounded-2xl overflow-hidden border border-blue-800">
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-blue-600 rounded-xl rotate-12 opacity-20"></div>
          </div>
          
          {/* Mobile Content */}
          <div className="space-y-4">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold leading-tight`}>
              {featuredPost.title}
            </h1>
            
            <p className="text-base text-blue-300 line-clamp-3">
              {featuredPost.excerpt}
            </p>
            
            {/* Mobile Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-blue-400">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[80px]">{featuredPost.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(featuredPost.publishDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readTime} min</span>
              </div>
            </div>
            
            {/* Mobile CTA Buttons */}
            <div className="flex flex-col gap-3">
              <Link to={`/blog/${featuredPost.slug}`} className="w-full">
                <Button className="w-full gap-2 py-3">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full border-blue-700 text-blue-300 hover:bg-blue-800 py-3"
                onClick={scrollToArticles}
              >
                View All Articles
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Desktop Layout
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-800 text-blue-200 mb-4">
                Featured
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                {featuredPost.title}
              </h1>
              <p className="text-xl text-blue-300 mb-6">
                {featuredPost.excerpt}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{featuredPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(featuredPost.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime} min read</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to={`/blog/${featuredPost.slug}`}>
                <Button className="gap-2">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-blue-700 text-blue-300 hover:bg-blue-800"
                onClick={scrollToArticles}
              >
                View All Articles
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-blue-800">
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-2xl rotate-12 opacity-20"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-400 rounded-full opacity-10"></div>
          </div>
        </div>
      )}
    </section>
  );
};