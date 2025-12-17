// hooks/useBlogPosts.ts
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  startAfter,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BlogPost, BlogPostInput } from '../types/blog';

const POSTS_PER_PAGE = 6;

// Type for Firestore document data
interface FirestorePost {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishDate: Timestamp;
  author: string;
  tags: string[];
  isPublished: boolean;
  slug?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  views?: number;
  likes?: number;
  category?: string;
  isFeatured?: boolean;
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Helper function to transform Firestore data to BlogPost
  const transformToBlogPost = (id: string, data: FirestorePost): BlogPost => ({
    id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    featuredImage: data.featuredImage,
    publishDate: data.publishDate?.toDate().toISOString() || new Date().toISOString(),
    author: data.author,
    tags: data.tags || [],
    isPublished: data.isPublished ?? true,
    // Include all optional fields
    slug: data.slug || '',
    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
    views: data.views || 0,
    likes: data.likes || 0,
    category: data.category || 'general',
    isFeatured: data.isFeatured || false
  });

  const fetchPosts = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      let q = query(
        collection(db, 'posts'),
        orderBy('publishDate', 'desc'),
        limit(POSTS_PER_PAGE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, 'posts'),
          orderBy('publishDate', 'desc'),
          startAfter(lastDoc),
          limit(POSTS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      
      const newPosts = snapshot.docs.map(doc => 
        transformToBlogPost(doc.id, doc.data() as FirestorePost)
      );

      if (loadMore) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (post: BlogPostInput) => {
    try {
      // Prepare Firestore data
      const firestoreData = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        publishDate: Timestamp.fromDate(new Date(post.publishDate)),
        author: post.author,
        tags: post.tags || [],
        isPublished: post.isPublished ?? false,
        slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        views: 0,
        likes: 0,
        category: post.category || 'general',
        isFeatured: post.isFeatured || false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'posts'), firestoreData);
      
      // Update local state with the new post
      const newBlogPost: BlogPost = {
        id: docRef.id,
        ...post,
        publishDate: post.publishDate,
        slug: firestoreData.slug,
        views: 0,
        likes: 0,
        category: post.category || 'general',
        isFeatured: post.isFeatured || false,
        createdAt: firestoreData.createdAt.toDate().toISOString(),
        updatedAt: firestoreData.updatedAt.toDate().toISOString(),
      };
      
      setPosts(prev => [newBlogPost, ...prev]);
      return docRef.id;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to add post');
    }
  };

  const updatePost = async (id: string, post: Partial<BlogPostInput>) => {
    try {
      const updateData: Record<string, unknown> = {
        ...post,
        updatedAt: Timestamp.now(),
      };
      
      if (post.publishDate) {
        updateData.publishDate = Timestamp.fromDate(new Date(post.publishDate));
      }
      
      await updateDoc(doc(db, 'posts', id), updateData);
      
      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === id 
          ? { 
              ...p, 
              ...post,
              updatedAt: new Date().toISOString(),
              publishDate: post.publishDate || p.publishDate
            } 
          : p
      ));
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update post');
    }
  };

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete post');
    }
  };

  const exportPosts = async () => {
    return posts;
  };

  const importPosts = async (importedData: BlogPost[]) => {
    setPosts(importedData);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchMore: () => fetchPosts(true),
    addPost,
    updatePost,
    deletePost,
    refetch: () => fetchPosts(),
    exportPosts,
    importPosts
  };
}