// hooks/useCreatePost.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface CreatePostDTO {
  title: string;
  excerpt: string;
  full_content: string;
  category: string;
  image: File | null; 
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: CreatePostDTO) => {
      const formData = new FormData();
      
      formData.append('title', newPost.title);
      formData.append('excerpt', newPost.excerpt);
      formData.append('full_content', newPost.full_content);
      formData.append('category', newPost.category);

      // Only append image if the user actually selected one
      if (newPost.image) {
        formData.append('image', newPost.image); 
      }

      // --- THE FIX IS HERE ---
      // We pass a 3rd argument to api.post to override any default headers.
      // This ensures Axios sends it as "multipart/form-data".
      const response = await api.post('/posts/', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // -----------------------
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      alert('Post created successfully!');
    },
    onError: (error: any) => {
      console.log("FULL ERROR:", error);
      if (error.response?.data) {
         // Show the specific field that failed
         alert(`Server Error: ${JSON.stringify(error.response.data)}`);
      } else {
         alert('Failed to save post.');
      }
    },
  });
};