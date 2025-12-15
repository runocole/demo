import type { BlogPost } from '../../types/blog';
import { BlogCard } from './BlogCard';
import { Button } from '../../components/ui/button';
import { Loader2, FileText } from 'lucide-react';

interface BlogGridProps {
  posts: BlogPost[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function BlogGrid({ posts, loading, hasMore, onLoadMore }: BlogGridProps) {
  if (!loading && posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 font-display text-xl font-semibold text-foreground">No posts yet</h3>
        <p className="text-muted-foreground">Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[200px] border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
