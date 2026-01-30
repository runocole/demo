export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Author;
  publishedAt: string;
  status: 'draft' | 'published' | 'scheduled';
  tags?: string[];
  category?: string; 
  metaDescription?: string;
  isFeatured?: boolean; 
  seo_keywords?: string[];
  viewCount?: number; 
  scheduled_publish_date?: string;
  readTime?: number; 
}