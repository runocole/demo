import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api'; 
// ✅ FIXED: Import correctly and do NOT redefine it below
import type { BlogPost } from '../data/types'; 

// ❌ DELETED: Local BlogPost interface (it caused the conflict)

// 1. READ (List all posts)
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get<BlogPost[]>('/posts/');
      return response.data;
    },
  });
};

// 2. READ ONE (For Editing)
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    enabled: !!id, 
    queryFn: async () => {
      const response = await api.get<BlogPost>(`/posts/${id}/`);
      return response.data;
    },
  });
};

// 3. CREATE Post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // ✅ Accepts FormData directly to handle images correctly
    mutationFn: async (newPostData: FormData) => {
      const response = await api.post('/posts/', newPostData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// 4. UPDATE Post (PATCH)
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // ✅ Accepts ID and FormData
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const response = await api.patch(`/posts/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // Invalidate the specific post so the edit page reflects changes
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
  });
};

// 5. DELETE Post
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/posts/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};