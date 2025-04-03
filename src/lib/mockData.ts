
import { createTimestamp, Timestamp } from './types';
import { Tool, Comment } from './tools';

// Helper function to create a mock timestamp (more recent than the base date)
const createRecentTimestamp = (daysAgo = 0): Timestamp => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return createTimestamp(date.toISOString());
};

// Mock user data
export const mockUsers = [
  {
    uid: 'user1',
    email: 'user1@example.com',
    displayName: 'Alex Johnson',
    photoURL: 'https://i.pravatar.cc/150?u=user1@example.com',
  },
  {
    uid: 'user2',
    email: 'user2@example.com',
    displayName: 'Sam Rodriguez',
    photoURL: 'https://i.pravatar.cc/150?u=user2@example.com',
  },
  {
    uid: 'user3',
    email: 'user3@example.com',
    displayName: 'Taylor Kim',
    photoURL: 'https://i.pravatar.cc/150?u=user3@example.com',
  },
  {
    uid: 'user4',
    email: 'user4@example.com',
    displayName: 'Jordan Patel',
    photoURL: null,
  },
];

// Mock tool data
export const mockTools: Tool[] = [
  {
    id: 'tool1',
    name: 'ChatGPT',
    description: 'Advanced AI language model that can have natural conversations and assist with various tasks.',
    imageUrl: 'https://i.imgur.com/hepj9ZS.png',
    url: 'https://chat.openai.com/',
    categories: ['AI Chatbots', 'Writing Assistant'],
    tags: ['AI', 'NLP', 'Assistant', 'Text Generation'],
    likes: ['user1', 'user2', 'user3'],
    likesCount: 3,
    createdAt: createRecentTimestamp(60),
    createdBy: mockUsers[0],
  },
  {
    id: 'tool2',
    name: 'DALL-E',
    description: 'An AI system that creates realistic images and art from natural language descriptions.',
    imageUrl: 'https://i.imgur.com/Ld5F2K3.png',
    url: 'https://openai.com/dall-e-2/',
    categories: ['Image Generation', 'AI Art'],
    tags: ['AI', 'Art', 'Image Generation'],
    likes: ['user2', 'user3'],
    likesCount: 2,
    createdAt: createRecentTimestamp(45),
    createdBy: mockUsers[1],
  },
  {
    id: 'tool3',
    name: 'Midjourney',
    description: 'AI art generator that creates stunning images from text prompts.',
    imageUrl: 'https://i.imgur.com/8BfrqUr.jpg',
    url: 'https://www.midjourney.com/',
    categories: ['Image Generation', 'AI Art'],
    tags: ['AI', 'Art', 'Design', 'Creative'],
    likes: ['user1'],
    likesCount: 1,
    createdAt: createRecentTimestamp(30),
    createdBy: mockUsers[2],
  },
  {
    id: 'tool4',
    name: 'GitHub Copilot',
    description: 'AI pair programming tool that helps you write code faster with suggestions based on comments and context.',
    imageUrl: 'https://i.imgur.com/jcfr5gn.png',
    url: 'https://github.com/features/copilot',
    categories: ['Development', 'Coding Assistant'],
    tags: ['AI', 'Coding', 'Productivity', 'Developer Tools'],
    likes: ['user1', 'user2', 'user3', 'user4'],
    likesCount: 4,
    createdAt: createRecentTimestamp(20),
    createdBy: mockUsers[3],
  },
  {
    id: 'tool5',
    name: 'Notion AI',
    description: 'AI writing assistant integrated into Notion to help with drafting, editing, and summarizing content.',
    imageUrl: 'https://i.imgur.com/MCXrrF3.png',
    url: 'https://www.notion.so/product/ai',
    categories: ['Writing Assistant', 'Productivity'],
    tags: ['AI', 'Writing', 'Note-taking', 'Organization'],
    likes: ['user2'],
    likesCount: 1,
    createdAt: createRecentTimestamp(15),
    createdBy: mockUsers[0],
  },
  {
    id: 'tool6',
    name: 'Jasper',
    description: 'AI content generation platform for marketers and content creators.',
    imageUrl: 'https://i.imgur.com/pscyjPa.png',
    url: 'https://www.jasper.ai/',
    categories: ['Content Creation', 'Writing Assistant'],
    tags: ['AI', 'Marketing', 'Content', 'Writing'],
    likes: [],
    likesCount: 0,
    createdAt: createRecentTimestamp(10),
    createdBy: mockUsers[1],
  },
];

// Mock comments data
export const mockComments: Comment[] = [
  {
    id: 'comment1',
    toolId: 'tool1',
    text: 'ChatGPT has completely transformed how I work. The responses are incredibly helpful!',
    createdAt: createRecentTimestamp(50),
    createdBy: mockUsers[1],
  },
  {
    id: 'comment2',
    toolId: 'tool1',
    text: 'Great for brainstorming ideas, but sometimes it makes up information.',
    createdAt: createRecentTimestamp(40),
    createdBy: mockUsers[2],
  },
  {
    id: 'comment3',
    toolId: 'tool2',
    text: 'DALL-E creates amazing images! I use it for all my creative projects now.',
    createdAt: createRecentTimestamp(30),
    createdBy: mockUsers[0],
  },
  {
    id: 'comment4',
    toolId: 'tool4',
    text: 'GitHub Copilot has made me much more productive. Highly recommended for developers!',
    createdAt: createRecentTimestamp(20),
    createdBy: mockUsers[3],
  },
  {
    id: 'comment5',
    toolId: 'tool4',
    text: 'It sometimes suggests code that doesn\'t quite work, but overall it\'s a huge time-saver.',
    createdAt: createRecentTimestamp(15),
    createdBy: mockUsers[0],
  },
  {
    id: 'comment6',
    toolId: 'tool5',
    text: 'Notion AI has made taking notes and drafting documents so much faster.',
    createdAt: createRecentTimestamp(10),
    createdBy: mockUsers[2],
  },
];

// Mock categories and tags
export const mockCategories = Array.from(new Set(mockTools.flatMap(tool => tool.categories)));
export const mockTags = Array.from(new Set(mockTools.flatMap(tool => tool.tags)));

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data service
export const mockDataService = {
  // Tools
  getAllTools: async () => {
    await delay(800); // Simulate network delay
    return [...mockTools];
  },
  
  getToolById: async (id: string) => {
    await delay(500);
    return mockTools.find(tool => tool.id === id) || null;
  },
  
  getToolsByCategory: async (category: string) => {
    await delay(600);
    return mockTools.filter(tool => tool.categories.includes(category));
  },
  
  getToolsByTag: async (tag: string) => {
    await delay(600);
    return mockTools.filter(tool => tool.tags.includes(tag));
  },
  
  // Comments
  getCommentsByToolId: async (toolId: string) => {
    await delay(700);
    return mockComments.filter(comment => comment.toolId === toolId);
  },
  
  addComment: async (toolId: string, text: string) => {
    await delay(500);
    const newComment: Comment = {
      id: `comment${mockComments.length + 1}`,
      toolId,
      text,
      createdAt: createRecentTimestamp(0),
      createdBy: mockUsers[0], // Assume current user is the first mock user
    };
    mockComments.push(newComment);
    return newComment;
  },
  
  // Likes
  toggleLikeTool: async (toolId: string) => {
    await delay(500);
    const tool = mockTools.find(t => t.id === toolId);
    if (!tool) throw new Error('Tool not found');
    
    const currentUserId = 'user1'; // Assume current user is the first mock user
    
    // Toggle like
    if (tool.likes.includes(currentUserId)) {
      tool.likes = tool.likes.filter(id => id !== currentUserId);
      tool.likesCount--;
    } else {
      tool.likes.push(currentUserId);
      tool.likesCount++;
    }
    
    return tool;
  },
  
  // Categories and Tags
  getAllCategories: async () => {
    await delay(300);
    return mockCategories;
  },
  
  getAllTags: async () => {
    await delay(300);
    return mockTags;
  },
};
