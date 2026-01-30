import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  FileText,
  Eye,
  PenLine,
  TrendingUp,
  BookOpen,
  LogOut,
} from "lucide-react";
import { format } from "date-fns";
import { getBlogPosts, type BlogPost as ApiBlogPost } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import type { BlogPost as PostCardType, Author } from "../../types/blog";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const [posts, setPosts] = useState<PostCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedCount: 0,
    draftCount: 0,
    totalViews: 0,
  });

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
      excerpt:
        apiPost.excerpt || apiPost.content.substring(0, 150) + "...",
      content: apiPost.content,
      coverImage: apiPost.featured_image_url || "",
      author,
      category: apiPost.category?.name || "Uncategorized",
      tags: apiPost.tags.map((tag) => tag.name),
      status: apiPost.status,
      isFeatured: apiPost.is_featured,
      publishedAt: apiPost.published_date || apiPost.created_at,
      viewCount: apiPost.view_count,
      readTime: Math.ceil((apiPost.content || "").split(" ").length / 200),
    };
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getBlogPosts();
        const mappedPosts = data.map(mapToPostCardFormat);
        setPosts(mappedPosts);

        const publishedCount = mappedPosts.filter(
          (p) => p.status === "published"
        ).length;
        const draftCount = mappedPosts.filter(
          (p) => p.status === "draft"
        ).length;
        const totalViews = mappedPosts.reduce(
          (sum, post) => sum + (post.viewCount || 0),
          0
        );

        setStats({
          totalPosts: mappedPosts.length,
          publishedCount,
          draftCount,
          totalViews,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const recentPosts = posts.slice(0, 3);

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts, icon: FileText },
    { label: "Published", value: stats.publishedCount, icon: Eye },
    { label: "Drafts", value: stats.draftCount, icon: PenLine },
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: TrendingUp,
    },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-blue-800 rounded-lg">
              <img
                src="/otic-logo.png"
                alt="Otic Logo"
                className="h-8 w-8"
              />
            </div>
            <h1 className="font-serif text-xl text-white font-semibold">
             OTIC Blog
            </h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/staff/dashboard"
            className="flex items-center gap-3 p-3 bg-blue-800 text-white rounded-lg"
          >
            <div className="h-2 w-2 bg-white rounded-sm" />
            Dashboard
          </Link>

          <Link
            to="/staff/posts"
            className="flex items-center gap-3 p-3 text-blue-100 hover:bg-blue-800 rounded-lg"
          >
            <FileText className="h-5 w-5" />
            All Posts
          </Link>

          <Link
            to="/staff/posts/new"
            className="flex items-center gap-3 p-3 text-blue-100 hover:bg-blue-800 rounded-lg"
          >
            <PenLine className="h-5 w-5" />
            New Post
          </Link>
        </nav>

        <div className="p-4 border-t border-blue-800 space-y-2">
          <Link
            to="/blog"
            target="_blank"
            className="flex items-center gap-3 p-3 text-blue-100 hover:bg-blue-800 rounded-lg"
          >
            <BookOpen className="h-5 w-5" />
            View Blog
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-blue-100 hover:bg-blue-800 rounded-lg w-full"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-10">
        {/* Soft content container */}
        <div className="max-w-[1400px] mx-auto space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-slate-900">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Welcome back{user ? `, ${user.username}` : ""}.
              </p>
            </div>
            <Link to="/staff/posts/new">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <PenLine className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <Card key={stat.label} className="shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Posts */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif">
                  Recent Posts
                </CardTitle>
                <CardDescription>
                  Your latest articles
                </CardDescription>
              </div>
              <Link to="/staff/posts">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p className="text-center text-slate-500 py-10">
                  Loading posts…
                </p>
              ) : recentPosts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500">
                    No posts yet.
                  </p>
                  <Link to="/staff/posts/new">
                    <Button variant="outline" className="mt-4">
                      Create First Post
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50"
                    >
                      <div>
                        <h3 className="font-medium">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {format(
                            new Date(post.publishedAt),
                            "MMM d, yyyy"
                          )}{" "}
                          · {post.status}
                        </p>
                      </div>
                      <Link to={`/staff/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}