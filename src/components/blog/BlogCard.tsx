import type { BlogPost } from '../../types/blog';
import { Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <Link 
      to={`/blog/${post.id}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article className="relative overflow-hidden rounded-xl bg-gradient-card border border-border/50 shadow-card transition-all duration-500 hover:shadow-glow hover:border-primary/30 hover:-translate-y-1">
        {/* Featured Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative p-6">
          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="mb-3 font-display text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {format(post.publishDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Hover Accent */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-accent transition-all duration-500 group-hover:w-full" />
      </article>
    </Link>
  );
}
