import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";  
import { BlogFooter } from "../components/blog/BlogFooter";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowLeft, Loader2, Clock, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { getBlogPost, type BlogPost } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isStaff } = useAuth();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPost(slug);
        setPost(data);
        
        // TODO: Fetch related posts based on category/tags
        setRelatedPosts([]);
      } catch (err: any) {
        console.error("Failed to fetch post:", err);
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleEdit = () => {
    if (post && isStaff) {
      navigate(`/staff/posts/${post.id}/edit`);
    }
  };

  // Improved markdown to HTML converter
  const convertMarkdownToHTML = (content: string) => {
    // First, handle lists properly
    let html = content
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold text-gray-900 mt-10 mb-6">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-900 pl-4 italic text-gray-600 my-6">$1</blockquote>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Handle unordered lists
    html = html.replace(/^- (.*$)/gm, '<li class="ml-6 list-disc mb-2">$1</li>');
    html = html.replace(/(<li class="ml-6 list-disc mb-2">.*<\/li>[\s\S]*?)(?=^[^<]|$)/gm, (match) => {
      if (match.trim().startsWith('<li')) {
        return `<ul class="my-6 space-y-2">${match.trim()}</ul>`;
      }
      return match;
    });
    
    // Handle ordered lists
    html = html.replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6 list-decimal mb-2">$2</li>');
    html = html.replace(/(<li class="ml-6 list-decimal mb-2">.*<\/li>[\s\S]*?)(?=^[^<]|$)/gm, (match) => {
      if (match.trim().startsWith('<li')) {
        return `<ol class="my-6 space-y-2">${match.trim()}</ol>`;
      }
      return match;
    });
    
    // Handle paragraphs
    const lines = html.split('\n');
    let result = [];
    let inList = false;
    
    for (let line of lines) {
      if (line.trim().startsWith('<ul') || line.trim().startsWith('<ol') || line.trim().startsWith('<li')) {
        inList = true;
        result.push(line);
      } else if (line.trim().startsWith('</ul') || line.trim().startsWith('</ol')) {
        inList = false;
        result.push(line);
      } else if (line.trim() && !line.trim().startsWith('<')) {
        if (!inList) {
          result.push(`<p class="mb-6 leading-relaxed text-gray-700">${line}</p>`);
        } else {
          result.push(line);
        }
      } else {
        result.push(line);
      }
    }
    
    return result.join('\n');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-900 mx-auto" />
            <p className="mt-3 text-gray-600">Loading post...</p>
          </div>
        </main>
        <BlogFooter />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-4">
              {error ? "Error loading post" : "Post not found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The post you're looking for doesn't exist."}
            </p>
            <Link to="/blog">
              <Button variant="outline">Back to Blog</Button>
            </Link>
          </div>
        </main>
        <BlogFooter />
      </div>
    );
  }

  if (post.status !== "published" && !isStaff) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-4">
              Post unavailable
            </h1>
            <p className="text-gray-600 mb-6">
              This post is not published yet.
            </p>
            <Link to="/blog">
              <Button variant="outline">Back to Blog</Button>
            </Link>
          </div>
        </main>
        <BlogFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 1. Top Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-gray-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gray-700 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-700 truncate max-w-[200px]">
                {post.title}
              </li>
            </ol>
          </nav>

          <article className="max-w-3xl mx-auto">
            {/* 2. Category Badge */}
            {post.category?.name && (
              <div className="mb-4">
                <Badge 
                  variant="secondary" 
                  className="text-gray-600 bg-gray-100 hover:bg-gray-100 font-normal px-3 py-1 rounded-full"
                >
                  {post.category.name}
                </Badge>
              </div>
            )}

            {/* 3. Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* 4. Meta Info Row */}
            <div className="flex items-center gap-4 mb-8 text-gray-600">
              {/* Author - FIXED */}
              <div className="flex items-center gap-2">
                {post.author.avatar_url ? (
                  <img 
                    src={
                      post.author.avatar_url.startsWith('http') 
                        ? post.author.avatar_url 
                        : `http://localhost:8000${post.author.avatar_url}`
                    } 
                    alt={post.author.full_name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
               <span className="font-medium text-gray-900">
  {post.author.full_name}
</span>
              </div>
              
              <span className="text-gray-300">•</span>
              
              {/* Date */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.published_date}>
                  {format(new Date(post.published_date), "MMMM d, yyyy")}
                </time>
              </div>
              
              <span className="text-gray-300">•</span>
              
              {/* Read Time */}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.ceil((post.content || "").split(' ').length / 200)} min read</span>
              </div>
            </div>

            {/* 5. Featured Image */}
            {post.featured_image_url && (
              <div className="mb-12">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full aspect-video object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* 6. Content Body */}
            <div className="prose prose-lg max-w-none prose-img:mx-auto prose-img:my-8 prose-img:rounded-lg prose-img:shadow-md">
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(post.content) }}
              />
            </div>

            {/* 8. Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge 
                      key={tag.id} 
                      variant="outline"
                      className="text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Back to Blog Button */}
          <div className="mt-12 flex justify-center">
            <Link to="/blog">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-gray-300 hover:border-blue-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}