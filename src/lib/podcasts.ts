import { PodcastContent, ContentType } from '@/types/content';
import { AuthError } from './api';

// Fetch all podcasts
export async function getAllPodcasts(): Promise<PodcastContent[]> {
  try {
    // This would be replaced with actual API call in production
    // For now, return mock data
    return mockPodcastData;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    if (error instanceof Response && error.status === 401) {
      throw new AuthError('Authentication required to fetch podcasts');
    }
    throw error;
  }
}

// Fetch podcasts by tag
export async function getPodcastsByTag(tag: string): Promise<PodcastContent[]> {
  try {
    // This would be replaced with actual API call in production
    // For now, filter mock data
    return mockPodcastData.filter(podcast => podcast.tags.includes(tag));
  } catch (error) {
    console.error('Error fetching podcasts by tag:', error);
    if (error instanceof Response && error.status === 401) {
      throw new AuthError('Authentication required to fetch podcasts');
    }
    throw error;
  }
}

// Fetch a single podcast by ID
export async function getPodcastById(id: string): Promise<PodcastContent> {
  try {
    // This would be replaced with actual API call in production
    // For now, find in mock data
    const podcast = mockPodcastData.find(item => item.id === id);
    
    if (!podcast) {
      throw new Error(`Podcast with ID ${id} not found`);
    }
    
    return {
      ...podcast,
      content: `<p>${podcast.description}</p>
                <h3>Episode Highlights:</h3>
                <ul>
                  <li>Introduction to the topic (00:00 - 03:45)</li>
                  <li>Key insights from industry experts (03:46 - 12:30)</li>
                  <li>Practical applications and examples (12:31 - 20:15)</li>
                  <li>Q&A and discussion (20:16 - ${Math.floor(podcast.duration / 60)}:${(podcast.duration % 60).toString().padStart(2, '0')})</li>
                </ul>
                <p>This episode explores the latest trends and innovations in the field. Our host and guests discuss real-world applications and provide valuable insights for listeners at all experience levels.</p>
                <p>Resources mentioned in this episode:</p>
                <ul>
                  <li><a href="#">Resource Guide</a></li>
                  <li><a href="#">Research Paper</a></li>
                  <li><a href="#">Community Forum</a></li>
                </ul>`
    };
  } catch (error) {
    console.error('Error fetching podcast by ID:', error);
    if (error instanceof Response && error.status === 401) {
      throw new AuthError('Authentication required to fetch podcast');
    }
    throw error;
  }
}

// Toggle like for a podcast
export async function toggleLikePodcast(id: string): Promise<void> {
  try {
    // This would be replaced with actual API call in production
    // For now, just mock the toggle in memory
    const podcastIndex = mockPodcastData.findIndex(item => item.id === id);
    
    if (podcastIndex !== -1) {
      // Toggle the like status
      mockPodcastData[podcastIndex].isLiked = !mockPodcastData[podcastIndex].isLiked;
    }
  } catch (error) {
    console.error('Error toggling podcast like:', error);
    if (error instanceof Response && error.status === 401) {
      throw new AuthError('Authentication required to like podcast');
    }
    throw error;
  }
}

// Mock podcast data
const mockPodcastData: PodcastContent[] = [
  {
    id: 'podcast-1',
    type: ContentType.PODCAST,
    title: 'The Future of AI in Everyday Work',
    description: 'In this episode, we discuss how artificial intelligence is transforming daily work routines and what to expect in the coming years.',
    tags: ['AI', 'Technology', 'Future of Work'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    audioUrl: 'https://example.com/podcasts/future-ai.mp3',
    duration: 1845, // 30:45 in seconds
    host: 'Dr. Emma Chen',
  },
  {
    id: 'podcast-2',
    type: ContentType.PODCAST,
    title: 'Productivity Strategies for Remote Teams',
    description: 'Learn effective strategies to boost productivity and collaboration in distributed and remote work environments.',
    tags: ['Remote Work', 'Productivity', 'Team Management'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    audioUrl: 'https://example.com/podcasts/remote-productivity.mp3',
    duration: 2520, // 42:00 in seconds
    host: 'Michael Rivers',
  },
  {
    id: 'podcast-3',
    type: ContentType.PODCAST,
    title: 'Cybersecurity Essentials for Modern Businesses',
    description: 'This episode covers fundamental cybersecurity practices that every business should implement to protect sensitive data.',
    tags: ['Cybersecurity', 'Business', 'Technology'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    audioUrl: 'https://example.com/podcasts/cybersecurity.mp3',
    duration: 1980, // 33:00 in seconds
    host: 'Alex Morgan',
  },
  {
    id: 'podcast-4',
    type: ContentType.PODCAST,
    title: 'Leadership in Times of Disruption',
    description: 'Senior executives share their insights on effective leadership strategies during periods of organizational and market disruption.',
    tags: ['Leadership', 'Management', 'Business Strategy'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1472&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    audioUrl: 'https://example.com/podcasts/leadership-disruption.mp3',
    duration: 3300, // 55:00 in seconds
    host: 'Sarah Williams',
  },
  {
    id: 'podcast-5',
    type: ContentType.PODCAST,
    title: 'Digital Transformation Success Stories',
    description: 'Case studies exploring how organizations successfully implemented digital transformation initiatives and the lessons learned.',
    tags: ['Digital Transformation', 'Case Study', 'Innovation'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1470&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    audioUrl: 'https://example.com/podcasts/digital-transformation.mp3',
    duration: 2700, // 45:00 in seconds
    host: 'David Thompson',
  }
]; 