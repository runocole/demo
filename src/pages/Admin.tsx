import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  DialogFooter,
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
  RefreshCw,
  MoreHorizontal,
} from 'lucide-react';
import { createGlobalStyle } from 'styled-components';

// Create Global Styles with your CSS variables
const GlobalStyles = createGlobalStyle`
  :root {
    /* Dark blue admin theme */
    --background: 220 50% 12%;
    --foreground: 210 40% 98%;

    --card: 220 45% 16%;
    --card-foreground: 210 40% 98%;

    --popover: 220 45% 16%;
    --popover-foreground: 210 40% 98%;

    --primary: 217 91% 60%;
    --primary-foreground: 210 40% 98%;

    --secondary: 220 40% 20%;
    --secondary-foreground: 210 40% 98%;

    --muted: 220 35% 22%;
    --muted-foreground: 215 25% 60%;

    --accent: 220 40% 25%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 70% 50%;
    --destructive-foreground: 210 40% 98%;

    --success: 142 70% 45%;
    --success-foreground: 210 40% 98%;

    --warning: 38 92% 50%;
    --warning-foreground: 220 50% 12%;

    --border: 220 35% 25%;
    --input: 220 40% 20%;
    --ring: 217 91% 60%;

    --radius: 0.75rem;

    --sidebar-background: 220 45% 16%;
    --sidebar-foreground: 215 25% 70%;
    --sidebar-primary: 217 91% 60%;
    --sidebar-primary-foreground: 210 40% 98%;
    --sidebar-accent: 220 40% 22%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 220 35% 25%;
    --sidebar-ring: 217 91% 60%;
  }

  .dark {
    --background: 220 50% 12%;
    --foreground: 210 40% 98%;
    --card: 220 45% 16%;
    --card-foreground: 210 40% 98%;
    --popover: 220 45% 16%;
    --popover-foreground: 210 40% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 210 40% 98%;
    --secondary: 220 40% 20%;
    --secondary-foreground: 210 40% 98%;
    --muted: 220 35% 22%;
    --muted-foreground: 215 25% 60%;
    --accent: 220 40% 25%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 70% 50%;
    --destructive-foreground: 210 40% 98%;
    --success: 142 70% 45%;
    --success-foreground: 210 40% 98%;
    --warning: 38 92% 50%;
    --warning-foreground: 220 50% 12%;
    --border: 220 35% 25%;
    --input: 220 40% 20%;
    --ring: 217 91% 60%;
    --sidebar-background: 220 45% 16%;
    --sidebar-foreground: 215 25% 70%;
    --sidebar-primary: 217 91% 60%;
    --sidebar-primary-foreground: 210 40% 98%;
    --sidebar-accent: 220 40% 22%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 220 35% 25%;
    --sidebar-ring: 217 91% 60%;
  }

  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
`;

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
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

const categories = ['general', 'technology', 'design', 'business', 'lifestyle', 'tutorial', 'news'];

export default function Admin() {
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const { posts, loading: postsLoading, addPost, updatePost, deletePost, exportPosts, importPosts } = useBlogPosts();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogPostInput>(defaultPost);
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  const { toast } = useToast();

  const [activityLog, setActivityLog] = useState<Activity[]>([
    { id: '1', action: 'created', postTitle: 'Getting Started with React', timestamp: new Date(), user: 'Admin' },
    { id: '2', action: 'updated', postTitle: 'CSS Grid Masterclass', timestamp: new Date(Date.now() - 60000), user: 'Admin' },
    { id: '3', action: 'published', postTitle: 'TypeScript Best Practices', timestamp: new Date(Date.now() - 120000), user: 'Admin' },
  ]);

  useEffect(() => {
    if (!editingId && formData.title) {
      const timer = setTimeout(() => {
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [formData, editingId]);

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((post) => {
        if (statusFilter === 'published') return post.isPublished;
        if (statusFilter === 'draft') return !post.isPublished;
        if (statusFilter === 'scheduled') return isFuture(new Date(post.publishDate));
        if (statusFilter === 'featured') return post.isFeatured;
        return true;
      });
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

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

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.isPublished).length;
    const drafts = posts.filter((p) => !p.isPublished).length;
    const scheduled = posts.filter((p) => isFuture(new Date(p.publishDate)) && p.isPublished).length;
    const featured = posts.filter((p) => p.isFeatured).length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const avgReadTime =
      posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + (post.readTime || 5), 0) / posts.length) : 5;

    return { total, published, drafts, scheduled, featured, totalViews, avgReadTime };
  }, [posts]);

  const handleOpenDialog = useCallback(
    (post?: (typeof posts)[0]) => {
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
    },
    [posts]
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, featuredImage: reader.result as string }));
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
    return Math.ceil(words / 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
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
        toast({ title: 'Post updated', description: 'Your blog post has been updated successfully.' });
        setActivityLog((prev) => [
          { id: Date.now().toString(), action: 'updated', postTitle: formData.title, timestamp: new Date(), user: user?.email || 'Admin' },
          ...prev,
        ]);
      } else {
        await addPost(postData);
        toast({ title: 'Post created', description: 'Your new blog post has been published.' });
        setActivityLog((prev) => [
          { id: Date.now().toString(), action: 'created', postTitle: formData.title, timestamp: new Date(), user: user?.email || 'Admin' },
          ...prev,
        ]);
      }
      setIsDialogOpen(false);
      setFormData(defaultPost);
      setTagsInput('');
      setEditingId(null);
      setImagePreview('');
    } catch {
      toast({ title: 'Error', description: 'Failed to save post. Please try again.', variant: 'destructive' });
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

    const postToDelete = posts.find((p) => p.id === deleteId);

    try {
      await deletePost(deleteId);
      toast({ title: 'Post deleted', description: 'The blog post has been removed.' });
      setActivityLog((prev) => [
        { id: Date.now().toString(), action: 'deleted', postTitle: postToDelete?.title || 'Unknown Post', timestamp: new Date(), user: user?.email || 'Admin' },
        ...prev,
      ]);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete post. Please try again.', variant: 'destructive' });
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
            toast({ title: 'Posts deleted', description: `${selectedPosts.size} posts have been deleted.` });
            setSelectedPosts(new Set());
          }
          break;
        case 'publish':
          for (const id of selectedPosts) {
            await updatePost(id, { isPublished: true });
          }
          toast({ title: 'Posts published', description: `${selectedPosts.size} posts have been published.` });
          break;
        case 'unpublish':
          for (const id of selectedPosts) {
            await updatePost(id, { isPublished: false });
          }
          toast({ title: 'Posts unpublished', description: `${selectedPosts.size} posts have been unpublished.` });
          break;
        case 'feature':
          for (const id of selectedPosts) {
            await updatePost(id, { isFeatured: true });
          }
          toast({ title: 'Posts featured', description: `${selectedPosts.size} posts have been marked as featured.` });
          break;
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to perform bulk action. Please try again.', variant: 'destructive' });
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
      toast({ title: 'Export successful', description: 'All posts have been exported.' });
    } catch {
      toast({ title: 'Export failed', description: 'Failed to export posts.', variant: 'destructive' });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importPosts(data);
      toast({ title: 'Import successful', description: 'Posts have been imported successfully.' });
    } catch {
      toast({ title: 'Import failed', description: 'Failed to import posts. Check the file format.', variant: 'destructive' });
    }
  };

  const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-4xl font-bold mt-2 text-foreground">{value}</h3>
            {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
          </div>
          <div className="p-3 rounded-full bg-secondary/50">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </main>
    );
  }

  return (
    <>
      <GlobalStyles />
      <main className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border bg-background">
          <div className="container mx-auto flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Blog Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">{user?.email} • Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground">
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto py-8 px-6">
          {/* Dashboard Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Posts"
              value={stats.total}
              icon={<FileText className="h-7 w-7 text-muted-foreground" />}
              trend={`+${stats.total} this month`}
            />
            <MetricCard
              title="Published"
              value={stats.published}
              icon={<CheckCircle className="h-7 w-7 text-success" />}
              trend={stats.total > 0 ? `${Math.round((stats.published / stats.total) * 100)}% of total` : '0% of total'}
            />
            <MetricCard title="Total Views" value={stats.totalViews} icon={<BarChart3 className="h-7 w-7 text-muted-foreground" />} />
            <MetricCard title="Avg. Read Time" value={`${stats.avgReadTime}m`} icon={<Clock className="h-7 w-7 text-muted-foreground" />} />
          </div>

          {/* Quick Actions Bar */}
          <Card className="mb-6 border-border bg-card">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Button>

                  {selectedPosts.size > 0 && (
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="secondary" className="bg-secondary">
                        {selectedPosts.size} selected
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('publish')} className="border-border text-muted-foreground hover:bg-accent">
                        <Send className="mr-2 h-3 w-3" />
                        Publish
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('unpublish')} className="border-border text-muted-foreground hover:bg-accent">
                        <Clock className="mr-2 h-3 w-3" />
                        Unpublish
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('feature')} className="border-border text-muted-foreground hover:bg-accent">
                        <Star className="mr-2 h-3 w-3" />
                        Feature
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleExport} className="border-border text-muted-foreground hover:bg-accent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <label htmlFor="import-file">
                    <Button variant="outline" asChild className="border-border text-muted-foreground hover:bg-accent cursor-pointer">
                      <div>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </div>
                    </Button>
                    <input id="import-file" type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card className="mb-6 border-border bg-card">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search posts by title, content, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-secondary border-border">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Drafts</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px] bg-secondary border-border">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] bg-secondary border-border">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
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
                  <p className="text-sm text-muted-foreground">
                    Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} for "{searchTerm}"
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="text-muted-foreground hover:text-foreground">
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
                <h2 className="text-lg font-semibold">Posts ({filteredPosts.length})</h2>
                <Button variant="link" onClick={() => setShowBulkActions(!showBulkActions)} className="text-primary hover:text-primary/80 p-0">
                  {showBulkActions ? 'Hide' : 'Show'} Bulk Actions
                </Button>
              </div>

              {postsLoading && posts.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card className="border-dashed border-border bg-card/50">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No posts found</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                      {searchTerm ? 'Try a different search term' : 'Create your first blog post to get started.'}
                    </p>
                    <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
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
                      className={`overflow-hidden border-border bg-card transition-all hover:border-primary/50 ${selectedPosts.has(post.id) ? 'ring-2 ring-primary' : ''}`}
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
                                <CheckSquare className="h-5 w-5 text-primary" />
                              ) : (
                                <Square className="h-5 w-5 text-muted-foreground" />
                              )}
                            </button>
                          )}

                          {/* Thumbnail */}
                          <div className="hidden sm:block">
                            <img
                              src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&q=80'}
                              alt={post.title}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="mb-1 text-lg font-semibold">{post.title}</h3>
                                <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">{post.excerpt}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {post.isFeatured && (
                                  <Badge className="bg-warning/20 text-warning border-warning/30 hover:bg-warning/30">
                                    <Star className="mr-1 h-3 w-3" />
                                    Featured
                                  </Badge>
                                )}
                                {post.isPublished ? (
                                  <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/30">Published</Badge>
                                ) : (
                                  <Badge variant="outline" className="border-border text-muted-foreground">
                                    Draft
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(post.publishDate), 'MMM d, yyyy')}
                                {isFuture(new Date(post.publishDate)) && <Clock className="ml-1 h-3 w-3 text-warning" />}
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
                                <Badge variant="outline" className="border-border text-muted-foreground">
                                  {post.category}
                                </Badge>
                              )}
                            </div>

                            {post.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="bg-secondary text-muted-foreground">
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                  <Badge variant="outline" className="border-border text-muted-foreground">
                                    +{post.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(post)} className="text-muted-foreground hover:text-foreground hover:bg-accent">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(`/blog/${post.slug || post.id}`);
                                toast({ title: 'Link copied', description: 'Post link copied to clipboard.' });
                              }}
                              className="text-muted-foreground hover:text-foreground hover:bg-accent"
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Published</span>
                        <span className="text-foreground">
                          {stats.published} / {stats.total}
                        </span>
                      </div>
                      <Progress value={stats.total > 0 ? (stats.published / stats.total) * 100 : 0} className="h-2 bg-secondary" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Drafts</span>
                        <span className="text-foreground">{stats.drafts}</span>
                      </div>
                      <Progress value={stats.total > 0 ? (stats.drafts / stats.total) * 100 : 0} className="h-2 bg-secondary" />
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-3 gap-4 text-sm text-center">
                        <div>
                          <div className="text-2xl font-bold text-foreground">{stats.scheduled}</div>
                          <div className="text-muted-foreground">Scheduled</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">{stats.drafts}</div>
                          <div className="text-muted-foreground">Drafts</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">{stats.featured}</div>
                          <div className="text-muted-foreground">Featured</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {activityLog.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            activity.action === 'created'
                              ? 'bg-success/20'
                              : activity.action === 'updated'
                              ? 'bg-primary/20'
                              : activity.action === 'published'
                              ? 'bg-success/20'
                              : 'bg-destructive/20'
                          }`}
                        >
                          {activity.action === 'created' && <Plus className="h-3 w-3 text-success" />}
                          {activity.action === 'updated' && <Edit className="h-3 w-3 text-primary" />}
                          {activity.action === 'deleted' && <Trash2 className="h-3 w-3 text-destructive" />}
                          {activity.action === 'published' && <Send className="h-3 w-3 text-success" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium text-foreground">{activity.user}</span> {activity.action} "{activity.postTitle}"
                          </p>
                          <p className="text-xs text-muted-foreground">{format(activity.timestamp, 'MMM d, h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      Use keywords in your title for better SEO
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      Add featured images to increase engagement
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      Schedule posts for optimal publishing times
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
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
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingId ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingId ? 'Update your blog post details.' : 'Fill in the details for your new blog post.'}
                {autoSaving && (
                  <span className="ml-2 inline-flex items-center text-warning">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Auto-saving...
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="content" className="mt-4">
              <TabsList className="grid w-full grid-cols-4 bg-secondary border-border">
                <TabsTrigger value="content" className="data-[state=active]:bg-accent">
                  Content
                </TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-accent">
                  SEO
                </TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-accent">
                  Media
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-accent">
                  Settings
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (!formData.slug) {
                          setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                        }
                      }}
                      placeholder="Enter post title"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                    <p className="text-xs text-muted-foreground">URL Slug: {formData.slug || generateSlug(formData.title)}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-foreground">
                      Excerpt
                    </Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description of the post (used in listings)"
                      rows={3}
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-foreground">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your blog post content here..."
                      rows={10}
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Word count: {formData.content.split(/\s+/).filter(Boolean).length}</span>
                      <span>Read time: ~{calculateReadTime(formData.content)} minutes</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle" className="text-foreground">
                      Meta Title
                    </Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="SEO title (leave empty to use post title)"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-foreground">
                      Meta Description
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="SEO description"
                      rows={3}
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-foreground">
                      URL Slug
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="post-url-slug"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Featured Image</Label>
                    {imagePreview || formData.featuredImage ? (
                      <div className="relative">
                        <img src={imagePreview || formData.featuredImage} alt="Preview" className="h-48 w-full rounded-lg object-cover" />
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
                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-8 transition-colors hover:border-primary"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <ImagePlus className="mb-2 h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featuredImage" className="text-foreground">
                      Or use image URL
                    </Label>
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="featuredImage"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-foreground">
                        Author
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          placeholder="Author name"
                          className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-foreground">
                        Category
                      </Label>
                      <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {categories.map((cat) => (
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
                      <Label htmlFor="publishDate" className="text-foreground">
                        Publish Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="publishDate"
                          type="datetime-local"
                          value={format(new Date(formData.publishDate), "yyyy-MM-dd'T'HH:mm")}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              publishDate: new Date(e.target.value).toISOString(),
                            })
                          }
                          className="pl-10 bg-secondary border-border text-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Status</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={formData.isPublished ? 'default' : 'outline'}
                          onClick={() => setFormData({ ...formData, isPublished: true })}
                          className={`flex-1 ${formData.isPublished ? 'bg-success hover:bg-success/90' : 'border-border'}`}
                        >
                          Published
                        </Button>
                        <Button
                          type="button"
                          variant={!formData.isPublished ? 'default' : 'outline'}
                          onClick={() => setFormData({ ...formData, isPublished: false })}
                          className={`flex-1 ${!formData.isPublished ? 'bg-secondary' : 'border-border'}`}
                        >
                          Draft
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-foreground">
                      Tags (comma separated)
                    </Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="tags"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="design, technology, creativity"
                        className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tagsInput
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-secondary text-muted-foreground">
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
                      className="h-4 w-4 rounded border-border bg-secondary text-primary"
                    />
                    <Label htmlFor="featured" className="text-foreground">
                      Mark as featured post
                    </Label>
                  </div>
                </TabsContent>

                <DialogFooter className="mt-6">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {editingId ? 'Last updated: ' : 'Created: '}
                      {format(new Date(), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-muted-foreground hover:bg-accent">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
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
          <AlertDialogContent className="bg-card border-border text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Delete Post
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Are you sure you want to delete this post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} className="border-border text-muted-foreground hover:bg-accent">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
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