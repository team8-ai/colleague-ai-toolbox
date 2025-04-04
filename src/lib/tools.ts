import { Timestamp } from "./types";
import { toolsAPI } from "./api";

export interface Tool {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  url: string;
  tags: string[];
  likes: number;
}

export interface Comment {
  id: string;
  toolId: string;
  text: string;
  createdAt: string;
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

interface TagObject {
  id: number; // Or string, depending on your backend ID type
  name: string;
}

export const getAllTags = async (): Promise<string[]> => {
  try {
    // Fetch the array of tag objects from the API
    const tagObjects = await toolsAPI.getAllTags() as TagObject[]; 
    // Map the array of objects to an array of strings (tag names)
    if (Array.isArray(tagObjects)) {
      return tagObjects.map(tag => tag.name);
    } else {
      console.error("getAllTags did not receive an array:", tagObjects);
      return []; // Return empty array if the response is not as expected
    }
  } catch (error) {
    console.error("Error fetching tags: ", error);
    throw error; // Re-throw error
  }
};
