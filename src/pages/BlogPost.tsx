import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BlogPost as BlogPostType } from '../types/blog';
import { format, isFuture } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const postData: BlogPostType = {
            id: docSnap.id,
            title: data.title || '',
            content: data.content || '',
            excerpt: data.excerpt || '',
            featuredImage: data.featuredImage || '',
            publishDate: data.publishDate?.toDate().toISOString() || new Date().toISOString(),
            author: data.author || '',
            tags: data.tags || [],
            isPublished: data.isPublished || false,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
            // New fields
            isFeatured: data.isFeatured || false,
            metaTitle: data.metaTitle || '',
            metaDescription: data.metaDescription || '',
            slug: data.slug || '',
            readTime: data.readTime || 0,
            views: data.views || 0,
            category: data.category || 'general',
          };
          
          setPost(postData);
          
          // Increment view count
          await updateDoc(docRef, {
            views: increment(1)
          });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load post. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, toast]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const contentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / contentHeight) * 100;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Link copied!',
        description: 'Post link copied to clipboard.',
      });
    }
  };

  const handleLike = async () => {
    if (!post || !id) return;
    
    try {
      const docRef = doc(db, 'posts', id);
      await updateDoc(docRef, {
        likes: increment(liked ? -1 : 1)
      });
      
      setPost(prev => prev ? { 
        ...prev, 
        likes: (prev.likes || 0) + (liked ? -1 : 1) 
      } : null);
      setLiked(!liked);
      
      toast({
        title: liked ? 'Unliked' : 'Liked!',
        description: liked ? 'Removed like from post' : 'Thanks for your feedback!',
      });
    } catch (error) {
      console.error('Error updating likes:', error);
      // Fallback: Update UI even if Firebase fails
      setPost(prev => prev ? { 
        ...prev, 
        likes: (prev.likes || 0) + (liked ? -1 : 1) 
      } : null);
      setLiked(!liked);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? 'Removed bookmark' : 'Bookmarked!',
      description: bookmarked ? 'Removed from saved articles' : 'Added to saved articles',
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-950 py-12">
        <div className="container max-w-4xl">
          <Skeleton className="mb-8 h-10 w-32 bg-blue-900" />
          <Skeleton className="mb-6 aspect-[21/9] w-full rounded-xl bg-blue-900" />
          <Skeleton className="mb-4 h-12 w-3/4 bg-blue-900" />
          <Skeleton className="mb-8 h-6 w-1/2 bg-blue-900" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-blue-900" />
            <Skeleton className="h-4 w-full bg-blue-900" />
            <Skeleton className="h-4 w-3/4 bg-blue-900" />
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blue-950">
        <div className="text-center">
          <h1 className="mb-4 font-display text-4xl font-bold text-white">Post Not Found</h1>
          <p className="mb-6 text-blue-300">The post you're looking for doesn't exist.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const readingTime = post.readTime || Math.ceil(post.content.split(' ').length / 200);
  const isScheduled = isFuture(new Date(post.publishDate));

  return (
    <>
      <title>{post.metaTitle || post.title} | Blog</title>
      <meta name="description" content={post.metaDescription || post.excerpt} />
      <meta property="og:title" content={post.metaTitle || post.title} />
      <meta property="og:description" content={post.metaDescription || post.excerpt} />
      <meta property="og:image" content={post.featuredImage} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={post.publishDate} />
      <meta property="article:author" content={post.author} />
      {post.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-950">
        <Progress value={readProgress} className="h-full bg-blue-600" />
      </div>

      <main className="min-h-screen bg-blue-950 text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-900/30 to-blue-950 py-8">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-3xl" />
          </div>
          
          <div className="container relative z-10 max-w-4xl">
            <Button 
              variant="ghost" 
              asChild 
              className="mb-8 text-blue-300 hover:text-white hover:bg-blue-800"
            >
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>

        <article className="container max-w-4xl pb-8 lg:pb-12">
          {/* Featured Image */}
          <div className="mb-8 overflow-hidden rounded-xl border border-blue-800 bg-blue-900/50 shadow-2xl">
            <img
              src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200'}
              alt={post.title}
              className="aspect-[21/9] w-full object-cover"
            />
            {post.isFeatured && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-amber-900 text-amber-200 border-amber-800">
                  <Star className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              </div>
            )}
          </div>

          {/* Category & Tags */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-blue-700 bg-blue-900 text-blue-300">
                {post.category || 'General'}
              </Badge>
              {post.tags.map((tag) => (
                <Badge 
                  key={tag}
                  variant="secondary" 
                  className="bg-blue-900 text-blue-300 hover:bg-blue-800"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-blue-400 hover:text-white hover:bg-blue-800"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={`${bookmarked ? 'text-amber-400' : 'text-blue-400'} hover:bg-blue-800`}
              >
                <Bookmark className="h-4 w-4" fill={bookmarked ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta & Stats */}
          <div className="mb-8 space-y-4 border-b border-blue-800 pb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-300">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.publishDate), 'MMMM d, yyyy')}
                {isScheduled && (
                  <Badge variant="outline" className="ml-2 border-blue-600 text-blue-400">
                    <Clock className="mr-1 h-3 w-3" />
                    Scheduled
                  </Badge>
                )}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {(post.views || 0).toLocaleString()} views
              </span>
            </div>
            
            {/* Engagement Stats */}
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`${liked ? 'text-red-400' : 'text-blue-400'} hover:bg-blue-800`}
              >
                <ThumbsUp className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                {/* Note: You need to add 'likes' field to your BlogPost type */}
                {/* For now, we'll show a static number or handle it differently */}
                0 Likes
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:bg-blue-800"
                onClick={() => {
                  const commentsSection = document.getElementById('comments');
                  commentsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
              
              {/* Social Share */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-800"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-800"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-800"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8 rounded-lg border border-blue-800 bg-blue-900/30 p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-1 h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="mb-2 font-semibold text-blue-200">Key Takeaways</h3>
                  <p className="text-blue-300">{post.excerpt}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="whitespace-pre-wrap leading-relaxed text-blue-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Author Bio & Share */}
          <Separator className="my-12 bg-blue-800" />
          
          <div className="rounded-lg border border-blue-800 bg-blue-900/30 p-6">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-800 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold">{post.author}</h4>
                  <p className="text-sm text-blue-400">Blog Contributor</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <h5 className="text-sm font-medium text-blue-300">Share this article</h5>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                    className="border-blue-700 text-blue-300 hover:bg-blue-800"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="border-blue-700 text-blue-300 hover:bg-blue-800"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="border-blue-700 text-blue-300 hover:bg-blue-800"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section Placeholder */}
          <div id="comments" className="mt-12">
            <div className="rounded-lg border border-blue-800 bg-blue-900/30 p-6">
              <h3 className="mb-4 text-xl font-semibold">Comments</h3>
              <p className="text-blue-400">
                Comments feature coming soon! In the meantime, you can share your thoughts on social media.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-blue-700 text-blue-300 hover:bg-blue-800"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Thoughts on "${post.title}": `)}`, '_blank')}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Share on Twitter
              </Button>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}