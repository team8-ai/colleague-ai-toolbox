import { Timestamp } from "./types";
import { toolsAPI } from "./api";
import { DEV_CONFIG } from "./config";
import { mockDataService } from "./mockData";

export interface Tool {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  url: string;
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
    if (DEV_CONFIG.mockData) {
      return await mockDataService.getAllTools();
    }
    return await toolsAPI.getAllTools();
  } catch (error) {
    console.error("Error fetching tools: ", error);
    throw error;
  }
};

export const getToolsByTag = async (tag: string): Promise<Tool[]> => {
  try {
    if (DEV_CONFIG.mockData) {
      return await mockDataService.getToolsByTag(tag);
    }
    return await toolsAPI.getToolsByTag(tag);
  } catch (error) {
    console.error(`Error fetching tools by tag ${tag}: `, error);
    throw error;
  }
};

export const getToolById = async (id: string): Promise<Tool | null> => {
  try {
    if (DEV_CONFIG.mockData) {
      return await mockDataService.getToolById(id);
    }
    return await toolsAPI.getToolById(id);
  } catch (error) {
    console.error(`Error fetching tool ${id}: `, error);
    throw error;
  }
};

export const toggleLikeTool = async (toolId: string): Promise<void> => {
  try {
    if (DEV_CONFIG.mockData) {
      await mockDataService.toggleLikeTool(toolId);
      return;
    }
    await toolsAPI.toggleLikeTool(toolId);
  } catch (error) {
    console.error(`Error toggling like for tool ${toolId}: `, error);
    throw error;
  }
};

export const addComment = async (toolId: string, text: string): Promise<void> => {
  try {
    if (DEV_CONFIG.mockData) {
      await mockDataService.addComment(toolId, text);
      return;
    }
    await toolsAPI.addComment(toolId, text);
  } catch (error) {
    console.error(`Error adding comment to tool ${toolId}: `, error);
    throw error;
  }
};

export const getCommentsByToolId = async (toolId: string): Promise<Comment[]> => {
  try {
    if (DEV_CONFIG.mockData) {
      return await mockDataService.getCommentsByToolId(toolId);
    }
    return await toolsAPI.getCommentsByToolId(toolId);
  } catch (error) {
    console.error(`Error fetching comments for tool ${toolId}: `, error);
    throw error;
  }
};

export const getAllTags = async (): Promise<string[]> => {
  try {
    if (DEV_CONFIG.mockData) {
      return await mockDataService.getAllTags();
    }
    return await toolsAPI.getAllTags();
  } catch (error) {
    console.error("Error fetching tags: ", error);
    throw error;
  }
};
