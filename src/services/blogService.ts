// services/blogService.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit,
  orderBy,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BlogPost, BlogPostInput } from '../types/blog';

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    console.log('🔍 Looking for post with slug:', slug);
    
    const q = query(
      collection(db, 'posts'),
      where('slug', '==', slug),
      where('isPublished', '==', true),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ No post found with slug:', slug);
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    
    console.log('✅ Found post:', data.title);
    
    return {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      featuredImage: data.featuredImage || '',
      publishDate: data.publishDate?.toDate().toISOString() || new Date().toISOString(),
      author: data.author,
      tags: data.tags || [],
      isPublished: data.isPublished ?? true,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
      isFeatured: data.isFeatured || false,
      views: data.views || 0,
      likes: data.likes || 0,
      category: data.category || 'general'
    } as BlogPost;
  } catch (error) {
    console.error('🔥 Error fetching post by slug:', error);
    return null;
  }
};

// View increment function
export const incrementPostViews = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      views: increment(1),
      updatedAt: serverTimestamp()
    });
    console.log('📈 Incremented views for post:', postId);
  } catch (error) {
    console.error('Error incrementing post views:', error);
    throw new Error('Failed to increment views');
  }
};

// Like increment function
export const incrementPostLikes = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
      updatedAt: serverTimestamp()
    });
    console.log('👍 Incremented likes for post:', postId);
  } catch (error) {
    console.error('Error incrementing post likes:', error);
    throw new Error('Failed to increment likes');
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    console.log('🔍 Looking for post with ID:', id);
    
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('❌ No post found with ID:', id);
      return null;
    }
    
    const data = docSnap.data();
    
    console.log('✅ Found post by ID:', data.title);
    
    return {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      featuredImage: data.featuredImage || '',
      publishDate: data.publishDate?.toDate().toISOString() || new Date().toISOString(),
      author: data.author,
      tags: data.tags || [],
      isPublished: data.isPublished ?? true,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
      isFeatured: data.isFeatured || false,
      views: data.views || 0,
      likes: data.likes || 0,
      category: data.category || 'general'
    } as BlogPost;
  } catch (error) {
    console.error('🔥 Error fetching post by ID:', error);
    return null;
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage || '',
        publishDate: data.publishDate?.toDate().toISOString() || new Date().toISOString(),
        author: data.author,
        tags: data.tags || [],
        isPublished: data.isPublished ?? true,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
        isFeatured: data.isFeatured || false,
        views: data.views || 0,
        likes: data.likes || 0,
        category: data.category || 'general'
      } as BlogPost;
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getAllBlogSlugs = async (): Promise<Array<{id: string, slug: string, title: string}>> => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        slug: data.slug || 'NO SLUG',
        title: data.title
      };
    });
  } catch (error) {
    console.error('Error getting slugs:', error);
    return [];
  }
};

export const createBlogPost = async (postData: BlogPostInput): Promise<string> => {
  try {
    const firestoreData = {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      featuredImage: postData.featuredImage || '',
      publishDate: Timestamp.fromDate(new Date(postData.publishDate)),
      author: postData.author,
      tags: postData.tags || [],
      isPublished: postData.isPublished ?? false,
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isFeatured: postData.isFeatured || false,
      views: 0,
      likes: 0,
      category: postData.category || 'general',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'posts'), firestoreData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw new Error('Failed to create blog post');
  }
};

export const updateBlogPost = async (id: string, postData: Partial<BlogPostInput>): Promise<void> => {
  try {
    const updateData: Record<string, unknown> = {
      ...postData,
      updatedAt: serverTimestamp()
    };
    
    if (postData.publishDate) {
      updateData.publishDate = Timestamp.fromDate(new Date(postData.publishDate));
    }
    
    await updateDoc(doc(db, 'posts', id), updateData);
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw new Error('Failed to update blog post');
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'posts', id));
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw new Error('Failed to delete blog post');
  }
};