import { NewsContent, ContentType } from '@/types/content';
import { AuthError, newsAPI } from './api';

// Base URL for the news API
const NEWS_API_BASE_URL = '/api/news';

// Fetch all news items
export async function getAllNews(): Promise<NewsContent[]> {
  try {
    return await newsAPI.getAllNews();
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

// Fetch news items by tag
export async function getNewsByTag(tag: string): Promise<NewsContent[]> {
  try {
    return await newsAPI.getNewsByTag(tag);
  } catch (error) {
    console.error('Error fetching news by tag:', error);
    throw error;
  }
}

// Fetch a single news item by ID
export async function getNewsById(id: string): Promise<NewsContent> {
  try {
    const newsItem = await newsAPI.getNewsById(id);
    if (!newsItem) {
      throw new Error(`News item with ID ${id} not found`);
    }
    return newsItem;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw error;
  }
}

// Toggle like for a news item
export async function toggleLikeNews(id: string): Promise<void> {
  try {
    await newsAPI.toggleLikeNews(id);
  } catch (error) {
    console.error('Error toggling news like:', error);
    throw error;
  }
}

// Mock news data
const mockNewsData: NewsContent[] = [
  {
    id: 'news-1',
    type: ContentType.NEWS,
    title: 'New AI Tool Released to Enhance Productivity',
    description: 'A groundbreaking AI tool has been launched that promises to revolutionize how teams collaborate and manage workflows.',
    tags: ['AI', 'Productivity', 'Technology'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    sourceUrl: 'https://example.com/news/ai-tool',
    author: 'Jane Smith',
    publishDate: new Date().toISOString(),
  },
  {
    id: 'news-2',
    type: ContentType.NEWS,
    title: 'Industry Report: The Future of Work in 2024',
    description: 'A comprehensive analysis of workplace trends and predictions for the coming year, with insights from industry experts.',
    tags: ['Future of Work', 'Industry Trends', 'Research'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sourceUrl: 'https://example.com/news/future-work-2024',
    author: 'Michael Johnson',
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'news-3',
    type: ContentType.NEWS,
    title: 'Upcoming Conference to Feature Leading Tech Innovators',
    description: 'The annual TechForward conference will showcase cutting-edge technologies and bring together thought leaders from around the world.',
    tags: ['Events', 'Conference', 'Innovation'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    sourceUrl: 'https://example.com/news/tech-conference',
    author: 'Alex Thompson',
    publishDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'news-4',
    type: ContentType.NEWS,
    title: 'Survey Reveals Top Skills Employers Are Looking For',
    description: 'New research identifies the most in-demand skills for the modern workforce, with technology and soft skills topping the list.',
    tags: ['Career Development', 'Skills', 'Employment'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    sourceUrl: 'https://example.com/news/employer-skills',
    author: 'Emily Chen',
    publishDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'news-5',
    type: ContentType.NEWS,
    title: 'Success Story: How Company X Transformed Their Operations',
    description: 'A case study on how a leading organization implemented new technologies to streamline workflows and boost productivity.',
    tags: ['Case Study', 'Digital Transformation', 'Success Story'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    sourceUrl: 'https://example.com/news/company-x-transformation',
    author: 'David Williams',
    publishDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  }
]; 