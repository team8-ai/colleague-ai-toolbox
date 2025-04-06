import { Timestamp } from "./types";

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
}

// Mock documents data for now - replace with API calls later
const mockDocuments: Document[] = [
  {
    id: "doc1",
    title: "Getting Started with AI Tools",
    description: "A beginner's guide to using artificial intelligence tools effectively.",
    thumbnail_url: null,
    content: `# Getting Started with AI Tools

## Introduction
This document will guide you through the basics of using AI tools effectively.

## Key Concepts
- Understanding AI limitations
- Prompt engineering basics
- Data privacy considerations

## Best Practices
1. Be specific in your requests
2. Review AI outputs carefully
3. Maintain human oversight
`,
    author: {
      uid: "user1",
      displayName: "Jane Doe",
      email: "jane@example.com",
      photoURL: null,
    },
    createdAt: new Date().toISOString(),
    tags: ["beginners", "guide", "ai"],
  },
  {
    id: "doc2",
    title: "Advanced Prompt Engineering",
    description: "Learn techniques for creating effective prompts for language models.",
    thumbnail_url: null,
    content: `# Advanced Prompt Engineering

## Introduction
Prompt engineering is the art of communicating effectively with language models.

## Techniques
- Chain-of-thought prompting
- Few-shot learning
- Instruction fine-tuning

## Case Studies
Examples of before/after prompts and their results.
`,
    author: {
      uid: "user2",
      displayName: "John Smith",
      email: "john@example.com",
      photoURL: null,
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    tags: ["prompt-engineering", "advanced", "techniques"],
  },
];

// Get all unique document tags
export const getAllDocumentTags = async (): Promise<string[]> => {
  // Extract all tags from all documents
  const allTags = mockDocuments.flatMap(doc => doc.tags);
  
  // Filter for unique tags
  const uniqueTags = [...new Set(allTags)];
  
  return uniqueTags;
};

// Fetcher function for SWR
export const documentsFetcher = async (url: string): Promise<Document[]> => {
  console.log(`SWR Documents Fetcher called: ${url}`);
  
  // Mock API logic based on URL pattern
  if (url.includes('/tag/')) {
    const tag = url.split('/tag/')[1];
    return mockDocuments.filter(doc => doc.tags.includes(tag));
  }
  
  if (url.includes('/documents/') && !url.endsWith('/documents/')) {
    const id = url.split('/documents/')[1];
    const document = mockDocuments.find(doc => doc.id === id);
    return document ? [document] : [];
  }
  
  // Default: return all documents
  return mockDocuments;
}; 