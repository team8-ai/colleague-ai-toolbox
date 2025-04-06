import { AuthError } from './api';
import { 
  BaseContent, 
  Content, 
  ContentType, 
  ToolContent, 
  DocumentContent 
} from '@/types/content';
import { getAllTools, getToolsByTag } from './tools';
import { documentsFetcher, Document } from './documents';

// Generic content fetcher based on content type
export async function fetchContent(
  contentType: ContentType,
  tag?: string | null
): Promise<BaseContent[]> {
  switch (contentType) {
    case ContentType.TOOL:
      const tools = tag ? await getToolsByTag(tag) : await getAllTools();
      return tools.map(transformToolToContent);
    case ContentType.DOCUMENT:
      const url = tag ? `/documents/tag/${tag}` : '/documents';
      const documents = await documentsFetcher(url);
      return documents.map(transformDocumentToContent);
    case ContentType.NEWS:
      // To be implemented in future
      return [];
    case ContentType.PODCAST:
      // To be implemented in future
      return [];
    default:
      throw new Error('Unsupported content type');
  }
}

// Transform tool data to standardized content format
function transformToolToContent(tool: any): ToolContent {
  return {
    id: tool.id,
    type: ContentType.TOOL,
    title: tool.name,
    description: tool.description,
    tags: tool.tags,
    thumbnailUrl: tool.image_url,
    createdAt: tool.createdAt || new Date().toISOString(),
    url: tool.url,
    likes: tool.likes || 0,
    isLiked: tool.isLiked || false
  };
}

// Transform document data to standardized content format
function transformDocumentToContent(doc: Document): DocumentContent {
  return {
    id: doc.id,
    type: ContentType.DOCUMENT,
    title: doc.title,
    description: doc.description,
    tags: doc.tags,
    thumbnailUrl: doc.thumbnail_url,
    createdAt: doc.createdAt,
    fileUrl: undefined, // Not present in current Document interface
    fileType: undefined // Not present in current Document interface
  };
}

// SWR fetcher for content
export const contentFetcher = async ([_, contentType, tag]: [string, ContentType, string | null]): Promise<BaseContent[]> => {
  console.log(`Content Fetcher called. ContentType: ${contentType}, Tag: ${tag}`);
  return fetchContent(contentType, tag);
};

// Toggle like for tool content
export async function toggleLikeContent(id: string, contentType: ContentType): Promise<void> {
  if (contentType === ContentType.TOOL) {
    const { toggleLikeTool } = await import('./tools');
    await toggleLikeTool(id);
  }
  // Other content types don't support likes yet
} 