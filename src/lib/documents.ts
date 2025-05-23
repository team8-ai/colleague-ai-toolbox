import { Timestamp } from "./types";
import { documentsAPI } from "./api";

export interface Document {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  content: string; // Markdown content
  author: {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
  };
  createdAt: string;
  tags: string[];
  likes?: number;
  isLiked?: boolean;
}

// Get all unique document tags
export const getAllDocumentTags = async (): Promise<string[]> => {
  return documentsAPI.getAllDocumentTags();
};

// Toggle like status for a document
export const toggleLikeDocument = async (id: string): Promise<void> => {
  try {
    await documentsAPI.toggleLikeDocument(id);
  } catch (error) {
    console.error(`Error toggling like for document ${id}: `, error);
    throw error;
  }
};

// Fetcher function for SWR
export const documentsFetcher = async (url: string): Promise<Document[]> => {
  console.log(`SWR Documents Fetcher called: ${url}`);
  
  // Parse the URL to determine which API endpoint to call
  if (url.includes('/tag/')) {
    const tag = url.split('/tag/')[1];
    return documentsAPI.getDocumentsByTag(tag);
  }
  
  if (url.includes('/documents/') && !url.endsWith('/documents/')) {
    const id = url.split('/documents/')[1];
    const document = await documentsAPI.getDocumentById(id);
    return document ? [document] : [];
  }
  
  // Default: return all documents
  return documentsAPI.getAllDocuments();
}; 