import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { BlogPost } from "../../services/api";

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
}

// Category color mapping
const getCategoryStyle = (category: string): React.CSSProperties => {
  const categoryColors: Record<string, { bg: string; text: string }> = {
    'Training': { bg: '#1e5631', text: '#ffffff' },
    'Equipment': { bg: '#2563eb', text: '#ffffff' },
    'Insight': { bg: '#7c3aed', text: '#ffffff' },
    'News': { bg: '#dc2626', text: '#ffffff' },
    'Tutorial': { bg: '#0891b2', text: '#ffffff' },
    'default': { bg: '#1e3a5f', text: '#ffffff' },
  };
  
  const colors = categoryColors[category] || categoryColors.default;
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderRadius: '4px',
    position: 'absolute' as const,
    top: '16px',
    left: '16px',
  };
};

export function PostCard({ post, featured = false }: PostCardProps) {
  // Styles
  const styles = {
    featuredCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      padding: '32px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '32px',
      alignItems: 'center',
      maxWidth: '900px',
      margin: '0 auto',
    } as React.CSSProperties,
    featuredBadge: {
      backgroundColor: '#e8f4fc',
      color: '#1e3a5f',
      padding: '8px 20px',
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      borderRadius: '4px',
      display: 'inline-block',
    } as React.CSSProperties,
    featuredMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#64748b',
      marginTop: '16px',
    } as React.CSSProperties,
    authorPhoto: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      objectFit: 'cover' as const,
    } as React.CSSProperties,
    featuredTitle: {
      fontFamily: 'Georgia, serif',
      fontSize: '32px',
      fontWeight: 700,
      color: '#1e3a5f',
      lineHeight: 1.2,
      marginTop: '16px',
      marginBottom: '16px',
    } as React.CSSProperties,
    featuredExcerpt: {
      fontSize: '16px',
      lineHeight: 1.7,
      color: '#475569',
    } as React.CSSProperties,
    readMore: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '24px',
      fontSize: '15px',
      fontWeight: 500,
      color: '#1e3a5f',
      textDecoration: 'none',
    } as React.CSSProperties,
    // Regular card styles
    card: {
      display: 'block',
      textDecoration: 'none',
    } as React.CSSProperties,
    imageWrapper: {
      position: 'relative' as const,
      aspectRatio: '16/10',
      overflow: 'hidden',
      borderRadius: '12px',
      marginBottom: '16px',
    } as React.CSSProperties,
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      transition: 'transform 0.5s ease',
    } as React.CSSProperties,
    cardDate: {
      fontSize: '13px',
      color: '#64748b',
      marginBottom: '8px',
    } as React.CSSProperties,
    cardTitle: {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      fontWeight: 600,
      color: '#1e3a5f',
      lineHeight: 1.4,
      marginBottom: '8px',
    } as React.CSSProperties,
    cardExcerpt: {
      fontSize: '14px',
      lineHeight: 1.6,
      color: '#64748b',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical' as const,
      overflow: 'hidden',
    } as React.CSSProperties,
  };

  if (featured) {
    return (
      <article style={styles.featuredCard}>
        <div>
          <span style={styles.featuredBadge}>FEATURED</span>
          <div style={styles.featuredMeta}>
            {/* Author photo - FIXED */}
            {post.author.avatar_url && (
              <img 
                src={
                  post.author.avatar_url.startsWith('http') 
                    ? post.author.avatar_url 
                    : `http://localhost:8000${post.author.avatar_url}`
                } 
                alt={post.author.full_name}
                style={styles.authorPhoto}
              />
            )}
            <span>{post.author.full_name}</span>
            <span>·</span>
            <time dateTime={post.published_date}>
              {format(new Date(post.published_date), "MMMM d, yyyy")}
            </time>
          </div>
          <h2 style={styles.featuredTitle}>{post.title}</h2>
          <p style={styles.featuredExcerpt}>{post.excerpt}</p>
          <Link to={`/blog/${post.slug}`} style={styles.readMore}>
            <span style={{ marginRight: '4px' }}>→</span> Read More
          </Link>
        </div>
      </article>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} style={styles.card}>
      <article>
        <div 
          style={styles.imageWrapper}
          onMouseEnter={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
          }}
        >
          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              style={styles.image}
            />
          )}
          {post.category?.name && (
            <span style={getCategoryStyle(post.category.name)}>
              {post.category.name}
            </span>
          )}
        </div>
        <div>
          <p style={styles.cardDate}>
            {format(new Date(post.published_date), "MMMM d, yyyy")}
          </p>
          <h3 style={styles.cardTitle}>{post.title}</h3>
          <p style={styles.cardExcerpt}>{post.excerpt}</p>
        </div>
      </article>
    </Link>
  );
}