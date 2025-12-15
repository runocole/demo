import { 
  collection, 
  doc, 
  getDocs,  
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { BlogPost, BlogPostInput } from "../types/blog";

const BLOG_POSTS_COLLECTION = "blogPosts";

// Get all published blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const q = query(
    collection(db, BLOG_POSTS_COLLECTION),
    where("isPublished", "==", true),
    orderBy("publishDate", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];
};

// Get a single blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const q = query(
    collection(db, BLOG_POSTS_COLLECTION),
    where("slug", "==", slug),
    where("isPublished", "==", true)
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as BlogPost;
};

// Create a new blog post (for admin)
export const createBlogPost = async (postData: BlogPostInput): Promise<string> => {
  const docRef = await addDoc(collection(db, BLOG_POSTS_COLLECTION), {
    ...postData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    readTime: Math.ceil(postData.content.split(' ').length / 200) // ~200 words per minute
  });
  return docRef.id;
};

// Update a blog post (for admin)
export const updateBlogPost = async (id: string, postData: Partial<BlogPostInput>): Promise<void> => {
  await updateDoc(doc(db, BLOG_POSTS_COLLECTION, id), {
    ...postData,
    updatedAt: serverTimestamp()
  });
};

// Delete a blog post (for admin)
export const deleteBlogPost = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, BLOG_POSTS_COLLECTION, id));
};