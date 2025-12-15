export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishDate: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  createdAt?: string;     
  updatedAt?: string;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  readTime?: number;
  views?: number;
  likes?: number;
  category?: string;
}

export interface BlogPostInput {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishDate: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  readTime?: number;
  category?: string;
}