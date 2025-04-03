
import { Timestamp } from "./types";
import { toolsAPI } from "./api";

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
    return await toolsAPI.getAllTools();
  } catch (error) {
    console.error("Error fetching tools: ", error);
    throw error;
  }
};

export const getToolsByCategory = async (category: string): Promise<Tool[]> => {
  try {
    return await toolsAPI.getToolsByCategory(category);
  } catch (error) {
    console.error(`Error fetching tools by category ${category}: `, error);
    throw error;
  }
};

export const getToolsByTag = async (tag: string): Promise<Tool[]> => {
  try {
    return await toolsAPI.getToolsByTag(tag);
  } catch (error) {
    console.error(`Error fetching tools by tag ${tag}: `, error);
    throw error;
  }
};

export const getToolById = async (id: string): Promise<Tool | null> => {
  try {
    return await toolsAPI.getToolById(id);
  } catch (error) {
    console.error(`Error fetching tool ${id}: `, error);
    throw error;
  }
};

export const toggleLikeTool = async (toolId: string): Promise<void> => {
  try {
    await toolsAPI.toggleLikeTool(toolId);
  } catch (error) {
    console.error(`Error toggling like for tool ${toolId}: `, error);
    throw error;
  }
};

export const addComment = async (toolId: string, text: string): Promise<void> => {
  try {
    await toolsAPI.addComment(toolId, text);
  } catch (error) {
    console.error(`Error adding comment to tool ${toolId}: `, error);
    throw error;
  }
};

export const getCommentsByToolId = async (toolId: string): Promise<Comment[]> => {
  try {
    return await toolsAPI.getCommentsByToolId(toolId);
  } catch (error) {
    console.error(`Error fetching comments for tool ${toolId}: `, error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<string[]> => {
  try {
    return await toolsAPI.getAllCategories();
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw error;
  }
};

export const getAllTags = async (): Promise<string[]> => {
  try {
    return await toolsAPI.getAllTags();
  } catch (error) {
    console.error("Error fetching tags: ", error);
    throw error;
  }
};
