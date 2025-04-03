
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { getCurrentUser } from "./auth";

export interface Tool {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  url: string;
  categories: string[];
  tags: string[];
  likes: string[];
  likesCount: number;
  createdAt: Timestamp;
  createdBy: {
    uid: string;
    displayName: string;
    email: string;
  };
}

export interface Comment {
  id: string;
  toolId: string;
  text: string;
  createdAt: Timestamp;
  createdBy: {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
  };
}

export const getAllTools = async (): Promise<Tool[]> => {
  try {
    const toolsQuery = query(collection(db, "tools"), orderBy("createdAt", "desc"));
    const toolsSnapshot = await getDocs(toolsQuery);
    return toolsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
  } catch (error) {
    console.error("Error fetching tools: ", error);
    throw error;
  }
};

export const getToolsByCategory = async (category: string): Promise<Tool[]> => {
  try {
    const toolsQuery = query(
      collection(db, "tools"), 
      where("categories", "array-contains", category),
      orderBy("createdAt", "desc")
    );
    const toolsSnapshot = await getDocs(toolsQuery);
    return toolsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
  } catch (error) {
    console.error(`Error fetching tools by category ${category}: `, error);
    throw error;
  }
};

export const getToolsByTag = async (tag: string): Promise<Tool[]> => {
  try {
    const toolsQuery = query(
      collection(db, "tools"), 
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc")
    );
    const toolsSnapshot = await getDocs(toolsQuery);
    return toolsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
  } catch (error) {
    console.error(`Error fetching tools by tag ${tag}: `, error);
    throw error;
  }
};

export const getToolById = async (id: string): Promise<Tool | null> => {
  try {
    const toolDoc = await getDoc(doc(db, "tools", id));
    if (!toolDoc.exists()) {
      return null;
    }
    return { id: toolDoc.id, ...toolDoc.data() } as Tool;
  } catch (error) {
    console.error(`Error fetching tool ${id}: `, error);
    throw error;
  }
};

export const toggleLikeTool = async (toolId: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be authenticated to like a tool");
    
    const toolRef = doc(db, "tools", toolId);
    const toolDoc = await getDoc(toolRef);
    if (!toolDoc.exists()) throw new Error("Tool not found");
    
    const toolData = toolDoc.data();
    const likes = toolData.likes || [];
    
    if (likes.includes(user.uid)) {
      // User already liked the tool, so unlike it
      await updateDoc(toolRef, {
        likes: arrayRemove(user.uid),
        likesCount: (toolData.likesCount || likes.length) - 1
      });
    } else {
      // User hasn't liked the tool yet, so like it
      await updateDoc(toolRef, {
        likes: arrayUnion(user.uid),
        likesCount: (toolData.likesCount || likes.length) + 1
      });
    }
  } catch (error) {
    console.error(`Error toggling like for tool ${toolId}: `, error);
    throw error;
  }
};

export const addComment = async (toolId: string, text: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be authenticated to comment");
    
    await addDoc(collection(db, "comments"), {
      toolId,
      text,
      createdAt: serverTimestamp(),
      createdBy: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }
    });
  } catch (error) {
    console.error(`Error adding comment to tool ${toolId}: `, error);
    throw error;
  }
};

export const getCommentsByToolId = async (toolId: string): Promise<Comment[]> => {
  try {
    const commentsQuery = query(
      collection(db, "comments"),
      where("toolId", "==", toolId),
      orderBy("createdAt", "desc")
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    return commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
  } catch (error) {
    console.error(`Error fetching comments for tool ${toolId}: `, error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<string[]> => {
  try {
    // In a real app, you might want to store categories in a separate collection
    // For simplicity, we'll extract unique categories from all tools
    const toolsSnapshot = await getDocs(collection(db, "tools"));
    const categories = new Set<string>();
    
    toolsSnapshot.docs.forEach(doc => {
      const toolCategories = doc.data().categories || [];
      toolCategories.forEach((category: string) => categories.add(category));
    });
    
    return Array.from(categories);
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw error;
  }
};

export const getAllTags = async (): Promise<string[]> => {
  try {
    // Similar to categories, extract unique tags from all tools
    const toolsSnapshot = await getDocs(collection(db, "tools"));
    const tags = new Set<string>();
    
    toolsSnapshot.docs.forEach(doc => {
      const toolTags = doc.data().tags || [];
      toolTags.forEach((tag: string) => tags.add(tag));
    });
    
    return Array.from(tags);
  } catch (error) {
    console.error("Error fetching tags: ", error);
    throw error;
  }
};
