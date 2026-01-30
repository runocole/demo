import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, ChevronDown } from "lucide-react";
import { BlogFooter } from "../components/blog/BlogFooter";
import { PostCard } from "../components/blog/PostCard";
import { getBlogPosts, type BlogPost } from "../services/api";
import blogHero from "../assets/banner.jpg";

// Define Author interface locally
interface Author {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  avatar_url?: string;
  full_name?: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogPosts();
      console.log("API response data:", data); 
      setPosts(data);
    } catch (err: any) {
      console.error("Failed to fetch posts:", err);
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const publishedPosts = posts.filter((post) => post.status === "published");
  const featuredPosts = publishedPosts.filter((post) => post.is_featured);
  const featuredPost = featuredPosts.length > 0 ? featuredPosts[0] : publishedPosts[0];
  const otherPosts = publishedPosts.filter((post) => post.id !== featuredPost?.id);

  // All styles inline
  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    heroSection: {
      position: 'relative' as const,
      overflow: 'hidden',
      minHeight: '65vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroBackground: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${blogHero})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed', // Creates parallax effect
    },
    darkOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Faint dark overlay
      zIndex: 1,
    },
    heroContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '120px 24px 80px', // Increased top padding to lower content
      width: '100%',
      position: 'relative' as const,
      zIndex: 2,
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '32px',
      alignItems: 'center',
      textAlign: 'left' as const,
    },
    heroContent: {
      maxWidth: '800px',
    },
    heroTitle: {
      fontFamily: 'Georgia, serif',
      fontSize: '64px',
      fontWeight: 400,
      color: '#ffffff',
      lineHeight: 1.1,
      marginBottom: '24px',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
      letterSpacing: '-0.5px',
    },
    heroSubtitle: {
      fontSize: '20px',
      color: '#f8f8f8',
      lineHeight: 1.6,
      marginBottom: '40px',
      textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
      maxWidth: '600px',
    },
    heroButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: '#ffffff',
      color: '#1d009e',
      padding: '16px 32px',
      borderRadius: '50px',
      fontSize: '16px',
      fontWeight: 600,
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    featuredSection: {
      maxWidth: '1100px',
      margin: '-40px auto 0',
      padding: '0 24px',
      position: 'relative' as const,
      zIndex: 10,
    },
    latestSection: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '80px 24px',
    },
    sectionHeader: {
      marginBottom: '48px',
      textAlign: 'center' as const,
    },
    sectionTitle: {
      fontFamily: 'Georgia, serif',
      fontSize: '42px',
      fontWeight: 700,
      color: '#1e3a5f',
      marginBottom: '16px',
    },
    sectionSubtitle: {
      fontSize: '18px',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '32px',
    },
    loadingContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
    },
    loadingContent: {
      textAlign: 'center' as const,
    },
    errorContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
    },
    errorTitle: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#dc2626',
      marginBottom: '12px',
    },
    errorText: {
      color: '#64748b',
      marginBottom: '24px',
      fontSize: '16px',
    },
    retryButton: {
      padding: '14px 28px',
      backgroundColor: '#1e3a5f',
      color: '#ffffff',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 500,
      transition: 'background-color 0.2s',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <Loader2 
            style={{ 
              width: '40px', 
              height: '40px', 
              color: '#1e3a5f',
              animation: 'spin 1s linear infinite',
            }} 
          />
          <p style={{ marginTop: '16px', color: '#1e3a5f', fontSize: '16px' }}>Loading posts...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '32px' }}>
          <h2 style={styles.errorTitle}>Error Loading Posts</h2>
          <p style={styles.errorText}>{error}</p>
          <button
            onClick={fetchPosts}
            style={styles.retryButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2d4a6f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1e3a5f';
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (publishedPosts.length === 0) {
    return (
      <div style={styles.page}>
        <section style={styles.heroSection}>
          <div style={styles.heroBackground} />
          <div style={styles.darkOverlay} />
          <div style={styles.heroContainer}>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>
                Stories, insights, & ideas
              </h1>
              <p style={styles.heroSubtitle}>
                Practical knowledge on geosystems, training, and equipment.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.latestSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Latest Articles</h2>
            <p style={styles.sectionSubtitle}>
              Fresh perspectives and thought-provoking content
            </p>
          </div>
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 0', 
            color: '#64748b',
            fontSize: '18px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1'
          }}>
            No blog posts published yet. Check back soon!
          </div>
        </section>

        <BlogFooter />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Hero Section with Banner */}
      <section style={styles.heroSection}>
        {/* Full-size banner background */}
        <div style={styles.heroBackground} />
        
        {/* Faint dark overlay for better text readability */}
        <div style={styles.darkOverlay} />
        
        {/* Hero content container */}
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Stories, insights, & ideas
            </h1>
            <p style={styles.heroSubtitle}>
              Practical knowledge on geosystems, training, and equipment.
            </p>
            {featuredPost && (
              <Link
                to={`/blog/${featuredPost.slug}`}
                style={styles.heroButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                }}
              >
                Read Latest Article
                <ChevronDown style={{ 
                  width: '18px', 
                  height: '18px',
                  transition: 'transform 0.3s ease'
                }} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section style={styles.featuredSection}>
          <PostCard post={featuredPost} featured />
        </section>
      )}

      {/* Latest Articles */}
      <section style={styles.latestSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Latest Articles</h2>
          <p style={styles.sectionSubtitle}>
            Fresh perspectives and thought-provoking content
          </p>
        </div>
        <div style={styles.grid}>
          {otherPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <BlogFooter />

      {/* Inline responsive CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .blog-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
          }
          .hero-title { 
            font-size: 48px !important; 
          }
          .hero-subtitle { 
            font-size: 18px !important; 
          }
        }
        
        @media (max-width: 768px) {
          .blog-hero-container { 
            padding: 100px 20px 60px !important; 
            grid-template-columns: 1fr !important; 
          }
          .hero-title { 
            font-size: 36px !important; 
            margin-bottom: 16px !important;
          }
          .hero-subtitle { 
            font-size: 16px !important; 
            margin-bottom: 32px !important;
          }
          .blog-grid { 
            grid-template-columns: 1fr !important; 
          }
          .section-title {
            font-size: 32px !important;
          }
          .hero-button {
            padding: 14px 28px !important;
            font-size: 15px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title { 
            font-size: 28px !important; 
          }
          .hero-subtitle { 
            font-size: 14px !important; 
          }
          .hero-button {
            padding: 12px 24px !important;
            font-size: 14px !important;
          }
        }
        
        /* Smooth transitions */
        .hero-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        /* Banner image fixed background for parallax effect */
        @media (max-width: 768px) {
          .hero-background {
            background-attachment: scroll !important;
          }
        }
      `}</style>
    </div>
  );
}