import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBlogPosts } from '../hooks/useBlogPosts';
import type { BlogPostInput } from '../types/blog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { format, isFuture } from 'date-fns';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Loader2, 
  FileText,
  Calendar,
  User,
  Image,
  Tag,
  Search,
  Eye,
  Send,
  Clock,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Download,
  Upload,
  Zap,
  Save,
  CheckSquare,
  Square,
  ImagePlus,
  X,
  AlertCircle,
  Copy,
  History,
  Star,
  Bell,
  RefreshCw
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';

// Types
interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

interface Activity {
  id: string;
  action: string;
  postTitle: string;
  timestamp: Date;
  user: string;
}

const defaultPost: BlogPostInput = {
  title: '',
  content: '',
  excerpt: '',
  featuredImage: '',
  publishDate: new Date().toISOString(),
  author: '',
  tags: [],
  isPublished: false,
  isFeatured: false,
  metaTitle: '',
  metaDescription: '',
  slug: '',
  readTime: 0,
  category: 'general',
};

const categories = [
  'general',
  'technology',
  'design',
  'business',
  'lifestyle',
  'tutorial',
  'news'
];

export default function Admin() {
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const { 
    posts, 
    loading: postsLoading, 
    addPost, 
    updatePost, 
    deletePost,
    exportPosts,
    importPosts 
  } = useBlogPosts();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogPostInput>(defaultPost);
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Stats
  const [activityLog, setActivityLog] = useState<Activity[]>([
    { id: '1', action: 'created', postTitle: 'Getting Started with React', timestamp: new Date(), user: user?.email || 'Admin' },
    { id: '2', action: 'updated', postTitle: 'CSS Grid Masterclass', timestamp: new Date(Date.now() - 3600000), user: user?.email || 'Admin' },
    { id: '3', action: 'published', postTitle: 'TypeScript Best Practices', timestamp: new Date(Date.now() - 7200000), user: user?.email || 'Admin' },
  ]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      ImageExtension.configure({
        inline: true,
      }),
    ],
    content: formData.content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content: editor.getHTML() });
    },
  });

  // Sync editor content with form data
  useEffect(() => {
    if (editor && editor.getHTML() !== formData.content) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  // Auto-save effect
  useEffect(() => {
    if (!editingId && formData.title) {
      const timer = setTimeout(() => {
        setAutoSaving(true);
        // Simulate auto-save
        setTimeout(() => setAutoSaving(false), 1000);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [formData, editingId]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];
    
    // Search
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => {
        if (statusFilter === 'published') return post.isPublished;
        if (statusFilter === 'draft') return !post.isPublished;
        if (statusFilter === 'scheduled') return isFuture(new Date(post.publishDate));
        if (statusFilter === 'featured') return post.isFeatured;
        return true;
      });
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [posts, searchTerm, statusFilter, categoryFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter(p => p.isPublished).length,
    drafts: posts.filter(p => !p.isPublished).length,
    scheduled: posts.filter(p => isFuture(new Date(p.publishDate))).length,
    featured: posts.filter(p => p.isFeatured).length,
    monthly: posts.filter(p => 
      new Date(p.publishDate) > new Date(new Date().setDate(new Date().getDate()-30))
    ).length,
    totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    avgReadTime: posts.length > 0 
      ? Math.round(posts.reduce((sum, post) => sum + (post.readTime || 0), 0) / posts.length)
      : 0,
  }), [posts]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenDialog = useCallback((post?: typeof posts[0]) => {
    if (post) {
      setEditingId(post.id);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        publishDate: post.publishDate,
        author: post.author,
        tags: post.tags,
        isPublished: post.isPublished,
        isFeatured: post.isFeatured || false,
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        slug: post.slug || '',
        readTime: post.readTime || 0,
        category: post.category || 'general',
      });
      setTagsInput(post.tags.join(', '));
    } else {
      setEditingId(null);
      setFormData(defaultPost);
      setTagsInput('');
    }
    setIsDialogOpen(true);
  }, [posts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, featuredImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);
  };

  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 200); // 200 words per minute
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const readTime = calculateReadTime(formData.content);
    const slug = formData.slug || generateSlug(formData.title);

    const postData: BlogPostInput = {
      ...formData,
      tags,
      readTime,
      slug,
    };

    try {
      if (editingId) {
        await updatePost(editingId, postData);
        toast({
          title: 'Post updated',
          description: 'Your blog post has been updated successfully.',
        });
        setActivityLog(prev => [{
          id: Date.now().toString(),
          action: 'updated',
          postTitle: formData.title,
          timestamp: new Date(),
          user: user?.email || 'Admin'
        }, ...prev]);
      } else {
        await addPost(postData);
        toast({
          title: 'Post created',
          description: 'Your new blog post has been published.',
        });
        setActivityLog(prev => [{
          id: Date.now().toString(),
          action: 'created',
          postTitle: formData.title,
          timestamp: new Date(),
          user: user?.email || 'Admin'
        }, ...prev]);
      }
      setIsDialogOpen(false);
      setFormData(defaultPost);
      setTagsInput('');
      setEditingId(null);
      setImagePreview('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    const postToDelete = posts.find(p => p.id === deleteId);
    
    try {
      await deletePost(deleteId);
      toast({
        title: 'Post deleted',
        description: 'The blog post has been removed.',
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              // This would typically call an undo API
              toast({
                title: 'Undo not implemented',
                description: 'This feature is coming soon!',
              });
            }}
          >
            Undo
          </Button>
        ),
      });
      setActivityLog(prev => [{
        id: Date.now().toString(),
        action: 'deleted',
        postTitle: postToDelete?.title || 'Unknown Post',
        timestamp: new Date(),
        user: user?.email || 'Admin'
      }, ...prev]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete' | 'feature') => {
    if (selectedPosts.size === 0) return;

    try {
      switch (action) {
        case 'delete':
          if (confirm(`Are you sure you want to delete ${selectedPosts.size} posts?`)) {
            for (const id of selectedPosts) {
              await deletePost(id);
            }
            toast({
              title: 'Posts deleted',
              description: `${selectedPosts.size} posts have been deleted.`,
            });
            setSelectedPosts(new Set());
          }
          break;
        case 'publish':
          for (const id of selectedPosts) {
            await updatePost(id, { isPublished: true });
          }
          toast({
            title: 'Posts published',
            description: `${selectedPosts.size} posts have been published.`,
          });
          break;
        case 'unpublish':
          for (const id of selectedPosts) {
            await updatePost(id, { isPublished: false });
          }
          toast({
            title: 'Posts unpublished',
            description: `${selectedPosts.size} posts have been unpublished.`,
          });
          break;
        case 'feature':
          for (const id of selectedPosts) {
            await updatePost(id, { isFeatured: true });
          }
          toast({
            title: 'Posts featured',
            description: `${selectedPosts.size} posts have been marked as featured.`,
          });
          break;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportPosts();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blog-posts-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export successful',
        description: 'All posts have been exported.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export posts.',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importPosts(data);
      
      toast({
        title: 'Import successful',
        description: 'Posts have been imported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Failed to import posts. Check the file format.',
        variant: 'destructive',
      });
    }
  };

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, color = "bg-blue-800" }) => (
    <Card className={`${color} border-blue-700 text-white`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-200">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {trend && <p className="text-xs text-blue-300 mt-1">{trend}</p>}
          </div>
          <div className="p-3 rounded-full bg-blue-950/50">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Toolbar = () => {
    if (!editor) return null;

    return (
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-blue-700 bg-blue-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          title="Bold"
        >
          <strong className="text-sm">B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          title="Italic"
        >
          <em className="text-sm">I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${editor.isActive('underline') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          title="Underline"
        >
          <u className="text-sm">U</u>
        </button>
        <div className="w-px h-6 bg-blue-700 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px h-6 bg-blue-700 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded ${editor.isActive('link') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          title="Insert Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-2 rounded hover:bg-blue-700"
          title="Insert Image"
        >
          🖼️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:bg-blue-700"
          title="Insert Horizontal Rule"
        >
          —
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="p-2 rounded hover:bg-blue-700"
          title="Insert Line Break"
        >
          ↵
        </button>
      </div>
    );
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blue-950">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <title>Admin Panel | Blog</title>
      <meta name="robots" content="noindex, nofollow" />

      <main className="min-h-screen bg-blue-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-blue-800 bg-blue-950/95 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800">
                <FileText className="h-5 w-5 text-blue-200" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold">Blog Admin Dashboard</h1>
                <p className="text-xs text-blue-300">{user?.email} • Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-blue-300 hover:text-white"
                onClick={() => toast({
                  title: 'Refreshing...',
                  description: 'Fetching latest data.',
                })}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-blue-300 hover:text-white"
                onClick={() => toast({
                  title: 'Notifications',
                  description: 'No new notifications.',
                })}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="text-blue-300 hover:text-white hover:bg-blue-800"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container py-8">
          {/* Dashboard Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Total Posts" 
              value={stats.total}
              icon={<FileText className="h-6 w-6 text-blue-300" />}
              trend={`${stats.monthly} this month`}
            />
            <MetricCard 
              title="Published" 
              value={stats.published}
              icon={<CheckCircle className="h-6 w-6 text-green-400" />}
              color="bg-green-900"
              trend={`${Math.round((stats.published / stats.total) * 100) || 0}% of total`}
            />
            <MetricCard 
              title="Total Views" 
              value={stats.totalViews.toLocaleString()}
              icon={<BarChart3 className="h-6 w-6 text-purple-300" />}
              color="bg-purple-900"
              trend="+24% from last month"
            />
            <MetricCard 
              title="Avg. Read Time" 
              value={`${stats.avgReadTime}m`}
              icon={<Clock className="h-6 w-6 text-amber-300" />}
              color="bg-amber-900"
            />
          </div>

          {/* Quick Actions Bar */}
          <Card className="mb-8 border-blue-800 bg-blue-800/50">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button 
                    variant="default" 
                    onClick={() => handleOpenDialog()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Button>
                  
                  {selectedPosts.size > 0 && (
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="secondary" className="bg-blue-700">
                        {selectedPosts.size} selected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('publish')}
                        className="border-blue-600 text-blue-300 hover:bg-blue-700"
                      >
                        <Send className="mr-2 h-3 w-3" />
                        Publish
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('unpublish')}
                        className="border-blue-600 text-blue-300 hover:bg-blue-700"
                      >
                        <Clock className="mr-2 h-3 w-3" />
                        Unpublish
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('feature')}
                        className="border-blue-600 text-blue-300 hover:bg-blue-700"
                      >
                        <Star className="mr-2 h-3 w-3" />
                        Feature
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBulkAction('delete')}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="border-blue-600 text-blue-300 hover:bg-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <label htmlFor="import-file">
                    <Button
                      variant="outline"
                      asChild
                      className="border-blue-600 text-blue-300 hover:bg-blue-700 cursor-pointer"
                    >
                      <div>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </div>
                    </Button>
                    <input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card className="mb-8 border-blue-800 bg-blue-800/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                    <Input
                      placeholder="Search posts by title, content, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-blue-950 border-blue-700 text-white placeholder:text-blue-400"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-blue-950 border-blue-700">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-950 border-blue-700 text-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Drafts</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px] bg-blue-950 border-blue-700">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-950 border-blue-700 text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-blue-950 border-blue-700">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-950 border-blue-700 text-white">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {searchTerm && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-blue-300">
                    Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} for "{searchTerm}"
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

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Posts List */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Posts ({filteredPosts.length})</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="text-blue-300 hover:text-white"
                >
                  {showBulkActions ? 'Hide' : 'Show'} Bulk Actions
                </Button>
              </div>
              
              {postsLoading && posts.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-300" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card className="border-dashed border-blue-700 bg-blue-800/30">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-950">
                      <FileText className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-semibold">No posts found</h3>
                    <p className="mb-6 text-sm text-blue-300">
                      {searchTerm ? 'Try a different search term' : 'Create your first blog post to get started.'}
                    </p>
                    <Button 
                      onClick={() => handleOpenDialog()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card 
                      key={post.id} 
                      className={`overflow-hidden border-blue-800 transition-all hover:border-blue-600 ${
                        selectedPosts.has(post.id) ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {showBulkActions && (
                            <button
                              onClick={() => {
                                const newSelected = new Set(selectedPosts);
                                if (newSelected.has(post.id)) {
                                  newSelected.delete(post.id);
                                } else {
                                  newSelected.add(post.id);
                                }
                                setSelectedPosts(newSelected);
                              }}
                              className="mt-1"
                            >
                              {selectedPosts.has(post.id) ? (
                                <CheckSquare className="h-5 w-5 text-blue-400" />
                              ) : (
                                <Square className="h-5 w-5 text-blue-700" />
                              )}
                            </button>
                          )}
                          
                          {/* Thumbnail */}
                          <div className="hidden sm:block">
                            <img
                              src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&q=80'}
                              alt={post.title}
                              className="h-20 w-32 rounded-lg object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="mb-1 font-display text-lg font-semibold">
                                  {post.title}
                                </h3>
                                <p className="mb-2 line-clamp-1 text-sm text-blue-300">
                                  {post.excerpt}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {post.isFeatured && (
                                  <Badge className="bg-amber-900 text-amber-200 border-amber-800">
                                    <Star className="mr-1 h-3 w-3" />
                                    Featured
                                  </Badge>
                                )}
                                {post.isPublished ? (
                                  <Badge className="bg-green-900 text-green-200 border-green-800">
                                    Published
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-blue-600 text-blue-400">
                                    Draft
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-blue-400">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(post.publishDate), 'MMM d, yyyy')}
                                {isFuture(new Date(post.publishDate)) && (
                                  <Clock className="ml-1 h-3 w-3 text-amber-400" />
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTime || 5}m read
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views?.toLocaleString() || 0} views
                              </span>
                              {post.category && (
                                <Badge variant="outline" className="border-blue-700 text-blue-300">
                                  {post.category}
                                </Badge>
                              )}
                            </div>
                            
                            {post.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map(tag => (
                                  <Badge 
                                    key={tag} 
                                    variant="secondary"
                                    className="bg-blue-950 text-blue-300"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                  <Badge variant="outline" className="border-blue-700 text-blue-400">
                                    +{post.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDialog(post)}
                              className="text-blue-400 hover:text-white hover:bg-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(post.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(`/blog/${post.slug || post.id}`);
                                toast({
                                  title: 'Link copied',
                                  description: 'Post link copied to clipboard.',
                                });
                              }}
                              className="text-blue-400 hover:text-white hover:bg-blue-800"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Activity & Quick Stats */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="border-blue-800 bg-blue-800/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-300">Published</span>
                        <span className="text-blue-200">{stats.published} / {stats.total}</span>
                      </div>
                      <Progress 
                        value={(stats.published / stats.total) * 100} 
                        className="h-2 bg-blue-950"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-300">Drafts</span>
                        <span className="text-blue-200">{stats.drafts}</span>
                      </div>
                      <Progress 
                        value={(stats.drafts / stats.total) * 100} 
                        className="h-2 bg-blue-950"
                      />
                    </div>
                    <div className="pt-4 border-t border-blue-700">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-200">{stats.scheduled}</div>
                          <div className="text-blue-400">Scheduled</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-200">{stats.featured}</div>
                          <div className="text-blue-400">Featured</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-blue-800 bg-blue-800/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {activityLog.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          activity.action === 'created' ? 'bg-green-900/50' :
                          activity.action === 'updated' ? 'bg-blue-950/50' :
                          'bg-red-900/50'
                        }`}>
                          {activity.action === 'created' && <Plus className="h-3 w-3 text-green-400" />}
                          {activity.action === 'updated' && <Edit className="h-3 w-3 text-blue-400" />}
                          {activity.action === 'deleted' && <Trash2 className="h-3 w-3 text-red-400" />}
                          {activity.action === 'published' && <Send className="h-3 w-3 text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium text-blue-200">{activity.user}</span>
                            {' '}{activity.action} "{activity.postTitle}"
                          </p>
                          <p className="text-xs text-blue-400">
                            {format(activity.timestamp, 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="border-blue-800 bg-blue-800/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-400" />
                    Quick Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Use keywords in your title for better SEO
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Add featured images to increase engagement
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Schedule posts for optimal publishing times
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Use 3-5 relevant tags per post
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Create/Edit Post Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl bg-blue-950 border-blue-800 text-white">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingId ? 'Edit Post' : 'Create New Post'}
              </DialogTitle>
              <DialogDescription className="text-blue-300">
                {editingId ? 'Update your blog post details.' : 'Fill in the details for your new blog post.'}
                {autoSaving && (
                  <span className="ml-2 inline-flex items-center text-amber-400">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Auto-saving...
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="content" className="mt-4">
              <TabsList className="grid w-full grid-cols-4 bg-blue-800 border-blue-700">
                <TabsTrigger value="content" className="data-[state=active]:bg-blue-700">Content</TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-blue-700">SEO</TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-blue-700">Media</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-blue-700">Settings</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-blue-200">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (!formData.slug) {
                          setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                        }
                      }}
                      placeholder="Enter post title"
                      className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-400"
                      required
                    />
                    <p className="text-xs text-blue-400">
                      URL Slug: {formData.slug || generateSlug(formData.title)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-blue-200">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description of the post (used in listings)"
                      rows={3}
                      className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-blue-200">Content</Label>
                    <div className="bg-blue-800 rounded-md border border-blue-700 overflow-hidden">
                      <Toolbar />
                      <EditorContent editor={editor} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-blue-400">
                      <span>Word count: {editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0}</span>
                      <span>Read time: ~{calculateReadTime(formData.content)} minutes</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle" className="text-blue-200">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="SEO title (leave empty to use post title)"
                      className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-400"
                    />
                    <p className="text-xs text-blue-400">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-blue-200">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="SEO description"
                      rows={3}
                      className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-400"
                    />
                    <p className="text-xs text-blue-400">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-blue-200">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="post-url-slug"
                      className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-400"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-blue-200">Featured Image</Label>
                    {imagePreview || formData.featuredImage ? (
                      <div className="relative">
                        <img
                          src={imagePreview || formData.featuredImage}
                          alt="Preview"
                          className="h-48 w-full rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-8 w-8"
                          onClick={() => {
                            setImagePreview('');
                            setFormData({ ...formData, featuredImage: '' });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-700 bg-blue-800/50 p-8 transition-colors hover:border-blue-600"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <ImagePlus className="mb-2 h-12 w-12 text-blue-400" />
                        <p className="text-sm text-blue-300">Click to upload or drag and drop</p>
                        <p className="text-xs text-blue-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featuredImage" className="text-blue-200">Or use image URL</Label>
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                      <Input
                        id="featuredImage"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-400"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-blue-200">Author</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          placeholder="Author name"
                          className="pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-blue-200">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="bg-blue-800 border-blue-700 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-900 border-blue-700 text-white">
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="publishDate" className="text-blue-200">Publish Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                        <Input
                          id="publishDate"
                          type="datetime-local"
                          value={format(new Date(formData.publishDate), "yyyy-MM-dd'T'HH:mm")}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            publishDate: new Date(e.target.value).toISOString() 
                          })}
                          className="pl-10 bg-blue-800 border-blue-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-blue-200">Status</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={formData.isPublished ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, isPublished: true })}
                          className={`flex-1 ${formData.isPublished ? 'bg-green-600 hover:bg-green-700' : 'border-blue-700'}`}
                        >
                          Published
                        </Button>
                        <Button
                          type="button"
                          variant={!formData.isPublished ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, isPublished: false })}
                          className={`flex-1 ${!formData.isPublished ? 'bg-blue-700' : 'border-blue-700'}`}
                        >
                          Draft
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-blue-200">Tags (comma separated)</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                      <Input
                        id="tags"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="design, technology, creativity"
                        className="pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-400"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tagsInput.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-blue-800 text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="h-4 w-4 rounded border-blue-700 bg-blue-800 text-blue-600"
                    />
                    <Label htmlFor="featured" className="text-blue-200">
                      Mark as featured post
                    </Label>
                  </div>
                </TabsContent>

                <DialogFooter className="mt-6">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-xs text-blue-400">
                      {editingId ? 'Last updated: ' : 'Created: '}
                      {format(new Date(), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className="border-blue-700 text-blue-300 hover:bg-blue-800"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : editingId ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Post
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Publish Post
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-blue-900 border-blue-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                Delete Post
              </AlertDialogTitle>
              <AlertDialogDescription className="text-blue-300">
                Are you sure you want to delete this post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-blue-700 text-blue-300 hover:bg-blue-800"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  );
}