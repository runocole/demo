import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { ArrowLeft, Save, Eye, Loader2, Tag, Folder, Upload, Image as ImageIcon, Paperclip, Plus, X, FileText, BookOpen, LogOut, Menu, X as XIcon, Calendar } from "lucide-react";
import { getBlogPost, createBlogPost, updateBlogPost, getCategories, getTags, uploadImage, type BlogPost as ApiBlogPost } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import type { Category, Tag as ApiTag } from "../../services/api";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
}

export default function PostEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("published");
  const [isFeatured, setIsFeatured] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // Available categories and tags
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<ApiTag[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, tags] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        setCategories(cats);
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to load categories/tags:", error);
        toast({
          title: "Error",
          description: "Failed to load categories and tags.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, []);

  // Load post if editing
  useEffect(() => {
    if (!isEditing || !id) return;

    const loadPost = async () => {
      try {
        setLoading(true);
        const post = await getBlogPost(id);
        
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || "");
        setMetaDescription(post.meta_description || "");
        setSeoKeywords(post.seo_keywords || "");
        setContent(post.content);
        setFeaturedImage(post.featured_image_url || "");
        setCategoryId(post.category?.id.toString() || "");
        setSelectedTagIds(post.tags.map(tag => tag.id.toString()));
        setStatus(post.status);
        setIsFeatured(post.is_featured);
        setScheduledDate(post.scheduled_publish_date || "");
        
        // Load uploaded files from content (parse image URLs)
        const imageUrls = extractImageUrls(post.content);
        if (post.featured_image_url) {
          imageUrls.unshift(post.featured_image_url);
        }
        const files = imageUrls.map((url, index) => ({
          id: `file-${index}`,
          name: `image-${index}.jpg`,
          url,
          type: 'image' as const
        }));
        setUploadedFiles(files);
      } catch (error) {
        console.error("Failed to load post:", error);
        toast({
          title: "Error",
          description: "Failed to load post. Please try again.",
          variant: "destructive",
        });
        navigate("/staff/blog/posts");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, isEditing, navigate, toast]);

  const extractImageUrls = (text: string): string[] => {
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const urls: string[] = [];
    let match;
    while ((match = imgRegex.exec(text)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await uploadImage(file);
        
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + i,
          name: file.name,
          url: response.url,
          type
        };
        
        setUploadedFiles(prev => [...prev, uploadedFile]);
        
        // If it's an image and no featured image set yet, suggest it
        if (type === 'image' && !featuredImage) {
          setFeaturedImage(response.url);
        }
        
        toast({
          title: "Upload successful",
          description: `${file.name} uploaded successfully.`,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const insertImageToContent = (url: string) => {
    const markdownImage = `\n\n![Image description](${url})\n\n`;
    setContent(prev => prev + markdownImage);
  };

  const insertFileLink = (file: UploadedFile) => {
    const markdownLink = `\n\n[${file.name}](${file.url})\n\n`;
    setContent(prev => prev + markdownLink);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Content is required.",
        variant: "destructive",
      });
      return;
    }

   
  setSaving(true);

  try {
    const postData = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      content: content.trim(),
      excerpt: excerpt.trim() || content.substring(0, 150) + "...",
      meta_description: metaDescription.trim() || undefined,
      seo_keywords: seoKeywords.trim() || undefined,
      featured_image_url: featuredImage.trim() ? 
  (featuredImage.trim().startsWith('http') ? 
    featuredImage.trim() : 
    `http://localhost:8000${featuredImage.trim()}`) 
  : undefined,
      category: categoryId ? parseInt(categoryId) : undefined,
      tags: selectedTagIds.map(id => parseInt(id)),
      status: status,
      is_featured: isFeatured,
      scheduled_publish_date: scheduledDate || undefined,
    };

    // ADD THESE 2 LINES:
    console.log("DEBUG - postData being sent:", JSON.stringify(postData, null, 2));
    console.log("DEBUG - featured_image_url value:", postData.featured_image_url);

      if (isEditing && id) {
        await updateBlogPost(parseInt(id), postData);
        toast({
          title: "Post updated",
          description: "Your post has been updated successfully.",
        });
      } else {
      await createBlogPost(postData); 
        toast({
          title: "Post created",
          description: "Your post has been created successfully.",
        });
      }

      navigate("/blog/dashboard");
    } catch (error: any) {
      console.error("Failed to save post:", error);
      
      let errorMessage = "Failed to save post. Please try again.";
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
          const errors = Object.entries(data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages[0] : messages}`)
            .join(', ');
          errorMessage = errors;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-3 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Left Sidebar - Deep Blue */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-blue-900 flex flex-col transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-blue-100 hover:text-white"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Branding with horizontal line */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Horizontal line above logo */}
              <div className="absolute -top-4 left-0 right-0 h-px bg-blue-700"></div>
              {/* Otic Logo */}
              <div className="p-1 bg-blue-800 rounded-lg">
                <img 
                  src="/otic-logo.png" 
                  alt="Otic Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
            </div>
            <h1 className="font-serif text-xl font-semibold text-white">The Journal</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Link
              to="/staff/blog/dashboard"
              className="flex items-center gap-3 p-3 text-blue-100 hover:bg-blue-800 rounded-lg transition-colors"
            >
              <div className="grid h-5 w-5 place-items-center">
                <div className="h-3 w-3 rounded-sm bg-white"></div>
              </div>
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              to="/staff/blog/posts"
              className="flex items-center gap-3 p-3 text-blue-100 hover:bg-blue-800 rounded-lg transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">All Posts</span>
            </Link>
            
            {/* Highlighted "Create New Post" */}
            <div className="relative">
              {/* Vertical line on left */}
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-400 rounded-r"></div>
              <Link
                to="/staff/blog/posts/new"
                className="flex items-center gap-3 p-3 bg-blue-800 text-white rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Create New Post</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blue-700 space-y-2">
          <Link
            to="/blog"
            target="_blank"
            className="flex items-center gap-3 p-3 text-blue-100 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">View Blog</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-blue-100 hover:bg-blue-800 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Lighter Blue */}
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/staff/blog/dashboard"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="font-serif text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Post" : "New Post"}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="featured" 
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="featured" className="text-sm text-gray-700">
                  Featured
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  id="published" 
                  checked={status === "published"}
                  onCheckedChange={(checked) => setStatus(checked ? "published" : "draft")}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="published" className="text-sm text-gray-700">
                  {status === "published" ? "Published" : "Draft"}
                </Label>
              </div>
              
              {isEditing && slug && (
                <Link to={`/blog/${slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </Link>
              )}
              
              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </header>

        {/* Editor Content */}
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          <div className="space-y-6">
            {/* Title */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-900 font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title..."
                    className="text-lg font-serif border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Slug */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-gray-900 font-medium">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">/blog/</span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="post-url-slug"
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two-column layout for Category and Featured Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <Card className="border-blue-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-900 font-medium">
                      <Folder className="inline h-4 w-4 mr-2 text-blue-600" />
                      Category
                    </Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image Upload */}
              <Card className="border-blue-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage" className="text-gray-900 font-medium">Featured Image</Label>
                    <div className="space-y-4">
                      <Input
                        id="featuredImage"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="https://example.com/image.jpg or upload below"
                        className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={imageInputRef}
                          onChange={(e) => handleFileUpload(e, 'image')}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={uploadingFile}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        <span className="text-sm text-gray-600">or paste URL above</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Excerpt */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-gray-900 font-medium">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A brief summary of your post..."
                    rows={3}
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Meta Description */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className="text-gray-900 font-medium">
                    Meta Description (SEO)
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Brief description for search engines (150-300 characters)..."
                    rows={2}
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                  <p className="text-sm text-gray-600">
                    This appears in search results. Keep it between 150-300 characters.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SEO Keywords */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="seoKeywords" className="text-gray-900 font-medium">
                    SEO Keywords
                  </Label>
                  <Textarea
                    id="seoKeywords"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="keyword1, keyword2, keyword3..."
                    rows={2}
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                  <p className="text-sm text-gray-600">
                    Comma-separated keywords for search engines.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Post */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-900 font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Schedule Publication
                    </Label>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={status === "scheduled"}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStatus("scheduled");
                          } else {
                            setStatus("published");
                          }
                        }}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <Label className="text-sm text-gray-700">
                        {status === "scheduled" ? "Scheduled" : "Schedule"}
                      </Label>
                    </div>
                  </div>
                  
                  {status === "scheduled" && (
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate" className="text-gray-900 font-medium">
                        Publish Date & Time
                      </Label>
                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                      <p className="text-sm text-gray-600">
                        Post will be automatically published at this date and time.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files & Attachments Section */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-900 font-medium">
                      <Paperclip className="inline h-4 w-4 mr-2 text-blue-600" />
                      Files & Attachments
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, 'file')}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingFile}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  </div>
                  
                  {uploadingFile && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}

                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="group relative border border-blue-200 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                            <button
                              onClick={() => removeFile(file.id)}
                              className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${file.type === 'image' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                {file.type === 'image' ? (
                                  <ImageIcon className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {file.type === 'image' ? 'Image' : 'File'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (file.type === 'image') {
                                    insertImageToContent(file.url);
                                  } else {
                                    insertFileLink(file);
                                  }
                                }}
                                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 text-xs"
                              >
                                Insert
                              </Button>
                              {file.type === 'image' && !featuredImage && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setFeaturedImage(file.url)}
                                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 text-xs"
                                >
                                  Set Featured
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Click "Insert" to add files/images to your content. Images can also be set as featured.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-blue-300 rounded-lg">
                      <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-gray-600">No files uploaded yet</p>
                      <p className="text-sm text-gray-500 mt-1">Upload images and files to insert into your post</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-gray-900 font-medium">Content * (Markdown supported)</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2 mb-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setContent(prev => prev + '# Heading 1\n')}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg text-xs"
                      >
                        H1
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setContent(prev => prev + '## Heading 2\n')}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg text-xs"
                      >
                        H2
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setContent(prev => prev + '**bold text**')}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg text-xs"
                      >
                        Bold
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setContent(prev => prev + '*italic text*')}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg text-xs"
                      >
                        Italic
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setContent(prev => prev + '\n- List item\n')}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg text-xs"
                      >
                        List
                      </Button>
                    </div>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="# Write your post content here...\n\nUse the buttons above for formatting or write Markdown directly.\n\nYou can also insert uploaded images/files from the attachments section."
                      rows={20}
                      className="font-mono text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Markdown tips:</span>
                    <code className="px-2 py-1 bg-blue-100 text-blue-700 rounded"># Heading</code>
                    <code className="px-2 py-1 bg-blue-100 text-blue-700 rounded">**bold**</code>
                    <code className="px-2 py-1 bg-blue-100 text-blue-700 rounded">*italic*</code>
                    <code className="px-2 py-1 bg-blue-100 text-blue-700 rounded">- list</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label className="text-gray-900 font-medium">
                    <Tag className="inline h-4 w-4 mr-2 text-blue-600" />
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Button
                        key={tag.id}
                        type="button"
                        variant={selectedTagIds.includes(tag.id.toString()) ? "default" : "outline"}
                        size="sm"
                        className={
                          selectedTagIds.includes(tag.id.toString())
                            ? "bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                            : "border-blue-300 text-blue-700 hover:border-blue-500 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                        }
                        onClick={() => handleTagToggle(tag.id.toString())}
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </div>
                  {selectedTagIds.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedTagIds.map(id => 
                        availableTags.find(t => t.id.toString() === id)?.name
                      ).filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}