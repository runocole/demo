import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { PenLine, Search, MoreVertical, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { getBlogPosts, deleteBlogPost, type BlogPost as ApiBlogPost } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/use-toast";
import type { BlogPost as PostCardType, Author } from "../../types/blog";

export default function PostsList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Map API response to PostCard format
  const mapToPostCardFormat = (apiPost: ApiBlogPost): PostCardType => {
    const author: Author = {
      id: apiPost.author.id.toString(),
      name: apiPost.author.username,
      avatar: `https://ui-avatars.com/api/?name=${apiPost.author.username}&background=random`,
    };

    return {
      id: apiPost.id.toString(),
      title: apiPost.title,
      slug: apiPost.slug,
      excerpt: apiPost.excerpt || apiPost.content.substring(0, 150) + "...",
      content: apiPost.content,
      coverImage: apiPost.featured_image_url || "",
      author: author,
      category: apiPost.category?.name || "Uncategorized",
      tags: apiPost.tags.map(tag => tag.name),
      status: apiPost.status,
      isFeatured: apiPost.is_featured,
      publishedAt: apiPost.published_date || apiPost.created_at,
      viewCount: apiPost.view_count,
      readTime: Math.ceil((apiPost.content || "").split(' ').length / 200),
    };
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      const mappedPosts = data.map(mapToPostCardFormat);
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    try {
      await deleteBlogPost(parseInt(postId));
      
      // Update local state
      setPosts(posts.filter(post => post.id !== postId));
      
      toast({
        title: "Post deleted",
        description: `"${postTitle}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter posts based on search and status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto" />
            <p className="mt-3 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900">All Posts</h1>
          <p className="text-gray-600 mt-1">Manage and organize your blog content.</p>
        </div>
        <Link to="/staff/posts/new">
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
            <PenLine className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6 border-amber-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search posts..." 
                className="pl-9 border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                className={filterStatus === "all" ? "bg-amber-600 text-white" : "border-gray-300"}
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button 
                variant={filterStatus === "published" ? "default" : "outline"}
                size="sm"
                className={filterStatus === "published" ? "bg-green-600 text-white" : "border-gray-300"}
                onClick={() => setFilterStatus("published")}
              >
                Published
              </Button>
              <Button 
                variant={filterStatus === "draft" ? "default" : "outline"}
                size="sm"
                className={filterStatus === "draft" ? "bg-amber-600 text-white" : "border-gray-300"}
                onClick={() => setFilterStatus("draft")}
              >
                Drafts
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card className="border-amber-200 shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-gray-900">{filteredPosts.length} Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all" 
                  ? "No posts match your filters." 
                  : "No posts yet. Create your first one!"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Link to="/staff/posts/new" className="mt-2 inline-block">
                  <Button variant="outline" size="sm" className="mt-2 border-amber-300">
                    Create First Post
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="w-[50%] font-medium text-gray-900">Title</TableHead>
                  <TableHead className="font-medium text-gray-900">Author</TableHead>
                  <TableHead className="font-medium text-gray-900">Status</TableHead>
                  <TableHead className="font-medium text-gray-900">Date</TableHead>
                  <TableHead className="w-[50px] font-medium text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} className="border-gray-200 hover:bg-amber-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <img 
                            src={post.coverImage} 
                            alt="" 
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-amber-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{post.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {post.excerpt}
                          </p>
                          {post.category && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {post.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div className="flex items-center gap-2">
                        {post.author.avatar && (
                          <img 
                            src={post.author.avatar} 
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        {post.author.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={post.status === "published" ? "default" : "secondary"}
                        className={`capitalize ${
                          post.status === "published" 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        }`}
                      >
                        {post.status}
                      </Badge>
                      {post.isFeatured && (
                        <Badge className="ml-2 bg-amber-600 hover:bg-amber-600">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-gray-200">
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <Link to={`/staff/posts/${post.id}/edit`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDelete(post.id, post.title)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing import
import { FileText } from "lucide-react";