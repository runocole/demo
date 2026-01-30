// types.ts

// 1. We don't need the Author object for now, as Django usually sends just the ID (e.g. 1)
// If you implement nested serializers later, you can bring this back.

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  full_content: string;
  created_at: string; 
  category: string;
  image: string | null; 
  author_username: string; 
  author_image: string | null;
}

export interface CreatePostDTO {
  title: string;
  excerpt: string;
  full_content: string;
  category: string;
  image: File | null; 
}