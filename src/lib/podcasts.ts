import { PodcastContent, ContentType } from '@/types/content';
import { AuthError, podcastAPI } from './api';

// Fetch all podcasts
export async function getAllPodcasts(): Promise<PodcastContent[]> {
  try {
    return await podcastAPI.getAllPodcasts();
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
}

// Fetch podcasts by tag
export async function getPodcastsByTag(tag: string): Promise<PodcastContent[]> {
  try {
    return await podcastAPI.getPodcastsByTag(tag);
  } catch (error) {
    console.error('Error fetching podcasts by tag:', error);
    throw error;
  }
}

// Fetch a single podcast by ID
export async function getPodcastById(id: string): Promise<PodcastContent> {
  try {
    const podcast = await podcastAPI.getPodcastById(id);
    if (!podcast) {
      throw new Error(`Podcast with ID ${id} not found`);
    }
    return podcast;
  } catch (error) {
    console.error('Error fetching podcast by ID:', error);
    throw error;
  }
}

// Toggle like for a podcast
export async function toggleLikePodcast(id: string): Promise<void> {
  try {
    await podcastAPI.toggleLikePodcast(id);
  } catch (error) {
    console.error('Error toggling podcast like:', error);
    throw error;
  }
} 