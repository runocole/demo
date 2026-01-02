// components/blog/BlogHero.tsx
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import type { BlogPost } from '../../types/blog';
import { useState, useEffect } from 'react';

interface BlogHeroProps {
  featuredPost?: BlogPost | null;
}

export const BlogHero = ({ featuredPost }: BlogHeroProps) => {
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

  if (!featuredPost) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
        <div className="text-center">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold mb-4 md:mb-6`}>
            Welcome to Our Blog
          </h1>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-blue-300 mb-6 md:mb-8 max-w-3xl mx-auto`}>
            Discover insights, tutorials, and stories from our team.
          </p>
        </div>
      </section>
    );
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
            <Link 
              to="/blog" 
              className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          {/* Mobile Image - Top on mobile */}
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
            
            {/* Mobile Metadata - Compact */}
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
                asChild
              >
                <Link to="/blog">
                  View All Articles
                </Link>
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
              <Button variant="outline" className="border-blue-700 text-blue-300 hover:bg-blue-800" asChild>
                <Link to="/blog">
                  View All Articles
                </Link>
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