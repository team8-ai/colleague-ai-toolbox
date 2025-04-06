// Base interface for all content types
export interface BaseContent {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl?: string;
  createdAt: string;
}

// Content type enum to identify different content types
export enum ContentType {
  TOOL = 'tool',
  DOCUMENT = 'document',
  NEWS = 'news',
  PODCAST = 'podcast'
}

// Tool specific content
export interface ToolContent extends BaseContent {
  type: ContentType.TOOL;
  url: string;
  likes: number;
  isLiked?: boolean;
}

// Document specific content
export interface DocumentContent extends BaseContent {
  type: ContentType.DOCUMENT;
  fileUrl?: string;
  fileType?: string;
  likes: number;
  isLiked?: boolean;
}

// News specific content (for future use)
export interface NewsContent extends BaseContent {
  type: ContentType.NEWS;
  sourceUrl: string;
  author?: string;
  publishDate: string;
  content?: string; // HTML content of the news article
  isLiked?: boolean;
}

// Podcast specific content (for future use)
export interface PodcastContent extends BaseContent {
  type: ContentType.PODCAST;
  audioUrl: string;
  duration: number;
  host?: string;
  episodeNumber?: number;
}

// Union type for all content types
export type Content = ToolContent | DocumentContent | NewsContent | PodcastContent;

// Generic content fetching response
export interface ContentResponse<T extends BaseContent> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
} 