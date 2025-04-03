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
    id: 'tool-litllm',
    name: 'LitLLM',
    description: 'A powerful AI toolkit that transforms how researchers write literature reviews, using advanced Retrieval-Augmented Generation (RAG) to create accurate, well-structured related work sections in seconds rather than days.',
    imageUrl: 'https://litllm.github.io/static/images/litllm.png',
    url: 'https://litllm.github.io/',
    tags: ['AI', 'Research', 'Literature Review', 'Academic', 'RAG'],
    likes: ['user1', 'user2'],
    likesCount: 2,
    createdAt: createRecentTimestamp(5),
    createdBy: mockUsers[0],
  },
  {
    id: 'simular',
    name: 'Agent S2',
    description: 'An open, modular, and scalable framework for computer-use agents that can observe, reason, and perform tasks by directly interacting with graphical user interfaces. These autonomous AI agents function as intelligent intermediaries between human users and their digital tools.',
    imageUrl: 'https://github.com/simular-ai/Agent-S/raw/main/images/agent_s2_teaser.png',
    url: 'https://www.simular.ai/',
    tags: ['AI', 'Automation', 'Computer Use', 'Framework'],
    likes: ['user2', 'user3'],
    likesCount: 2,
    createdAt: createRecentTimestamp(45),
    createdBy: mockUsers[1],
  },
  {
    id: 'tool-builder',
    name: 'Builder.io',
    description: 'AI-powered visual development platform that accelerates digital teams with design-to-code conversion, visual editing, and enterprise CMS capabilities. Turn Figma designs into production-ready code and enable marketers to build pages without engineering.',
    imageUrl: 'https://camo.githubusercontent.com/f4fd0404b33a2a3189702359b45ce2297972d63235e158bf18670bb539b84be8/68747470733a2f2f63646e2e6275696c6465722e696f2f6170692f76312f696d6167652f617373657473253246594a494762346930316a7677305352644c3542742532463936666139366637663561303431356639646666343062343164373862366137',
    url: 'https://www.builder.io/',
    tags: ['AI', 'Visual Development', 'Design to Code', 'CMS', 'Headless'],
    likes: ['user1', 'user3', 'user4'],
    likesCount: 3,
    createdAt: createRecentTimestamp(2),
    createdBy: mockUsers[1],
  },
  {
    id: 'tool-mermaid',
    name: 'Mermaid Chart',
    description: 'A collaborative diagramming tool that lets you create and share diagrams using text and code. Create flowcharts, sequence diagrams, Gantt charts, and more using Mermaid\'s simple markdown-like syntax.',
    imageUrl: 'https://static.mermaidchart.dev/assets/logo-mermaid.svg',
    url: 'https://www.mermaidchart.com/',
    tags: ['Diagramming', 'Documentation', 'Developer Tools', 'Markdown', 'Collaboration'],
    likes: ['user2', 'user4'],
    likesCount: 2,
    createdAt: createRecentTimestamp(3),
    createdBy: mockUsers[2],
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

// Mock tags
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
  
  // Tags
  getAllTags: async () => {
    await delay(300);
    return mockTags;
  },
};
