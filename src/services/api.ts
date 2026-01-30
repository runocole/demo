import axios from "axios";

export const API_URL = "http://localhost:8000/api";

// ----------------------------
// HELPER FUNCTIONS
// ----------------------------
const getCSRFToken = (): string => {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) return value;
  }
  return "";
};

// ----------------------------
// BLOG TYPES - UPDATED AUTHOR INTERFACE
// ----------------------------
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_description?: string;
  seo_keywords?: string;
  featured_image_url?: string;
  author: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    is_staff?: boolean;
    is_superuser?: boolean;
    avatar_url?: string;      // ← ADDED THIS
    full_name?: string;       // ← ADDED THIS
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  status: "draft" | "published" | "scheduled";
  view_count: number;
  is_featured: boolean;
  published_date: string;
  scheduled_publish_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
  };
  is_approved: boolean;
  created_at: string;
}

// ----------------------------
// BLOG API FUNCTIONS
// ----------------------------

// Get all blog posts (public)
export const getBlogPosts = async (params?: {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}): Promise<BlogPost[]> => {
  const response = await axios.get(`${API_URL}/posts/`, {
    params,
  });
  return response.data;
};

// Get single blog post by slug or id
export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  const response = await axios.get(`${API_URL}/posts/${slug}/`);
  return response.data;
};

// Create new blog post (staff only - uses CSRF auth)
export const createBlogPost = async (postData: {
  title: string;
  content: string;
  excerpt?: string;
  meta_description?: string;
  seo_keywords?: string;
  featured_image_url?: string;
  category?: number;
  tags?: number[];
  status?: "draft" | "published" | "scheduled";
  is_featured?: boolean;
  scheduled_publish_date?: string;
}): Promise<BlogPost> => {
  const token = localStorage.getItem('access_token');
  const headers: any = {
    "X-CSRFToken": getCSRFToken(),
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await axios.post(`${API_URL}/posts/`, postData, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

// Update blog post (staff only - uses CSRF auth)
export const updateBlogPost = async (
  id: number,
  postData: Partial<{
    title: string;
    content: string;
    excerpt: string;
    meta_description: string;
    seo_keywords: string;
    featured_image_url: string;
    category: number;
    tags: number[];
    status: "draft" | "published" | "scheduled";
    is_featured: boolean;
    scheduled_publish_date: string;
  }>
): Promise<BlogPost> => {
  const token = localStorage.getItem('access_token');
  const headers: any = {
    "X-CSRFToken": getCSRFToken(),
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await axios.put(`${API_URL}/posts/${id}/`, postData, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

// Delete blog post (staff only - uses CSRF auth)
export const deleteBlogPost = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/posts/${id}/`, {
    headers: {
      "X-CSRFToken": getCSRFToken(),
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

// Get categories (public)
export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/categories/`);
  return response.data;
};

// Get tags (public)
export const getTags = async (): Promise<Tag[]> => {
  const response = await axios.get(`${API_URL}/tags/`);
  return response.data;
};

// Get comments for a post (public)
export const getPostComments = async (postId: number): Promise<Comment[]> => {
  const response = await axios.get(`${API_URL}/comments/?post=${postId}`);
  return response.data;
};

// Create comment (public - no auth needed for comments)
export const createComment = async (
  postId: number,
  content: string
): Promise<Comment> => {
  const response = await axios.post(`${API_URL}/comments/`, {
    post: postId,
    content,
  });
  return response.data;
};

// Like a post (public - no auth needed for likes)
export const likePost = async (postId: number): Promise<void> => {
  await axios.post(`${API_URL}/posts/${postId}/like/`, {});
};

// Publish a post (staff only - uses CSRF auth)
export const publishPost = async (postId: number): Promise<void> => {
  await axios.post(
    `${API_URL}/posts/${postId}/publish/`,
    {},
    {
      headers: {
        "X-CSRFToken": getCSRFToken(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

// Image upload function (staff only - uses CSRF auth)
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}/upload/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": getCSRFToken(),
    },
    withCredentials: true,
  });

  return response.data;
};

// Check if user is authenticated (for blog)
export const checkBlogAuth = async (): Promise<{
  isAuthenticated: boolean;
  user?: any;
}> => {
  try {
    const response = await axios.get(`${API_URL}/auth/user/`, {
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      withCredentials: true,
    });
    return { isAuthenticated: true, user: response.data };
  } catch (error) {
    return { isAuthenticated: false };
  }
};

// Blog login function (if you need separate blog login)
export const blogLogin = async (username: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/auth/login/`,
    { username, password },
    {
      headers: {
        "X-CSRFToken": getCSRFToken(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// Blog logout function
export const blogLogout = async () => {
  await axios.post(
    `${API_URL}/auth/logout/`,
    {},
    {
      headers: {
        "X-CSRFToken": getCSRFToken(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};