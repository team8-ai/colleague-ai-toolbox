import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PodcastContent } from '@/types/content';
import { ArrowLeft, Clock, Headphones, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';
import { getPodcastById } from '@/lib/podcasts';
import { AuthError } from '@/lib/api';

const PodcastDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState<PodcastContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getPodcastById(id);
        setPodcast(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching podcast:', err);
        if (err instanceof AuthError) {
          navigate('/login');
        } else {
          setError('Failed to load podcast. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id, navigate]);

  // Format the duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading podcast...</p>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/30 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error || 'Podcast not found'}</p>
          <Button onClick={() => navigate('/podcasts')}>
            Return to Podcast Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/podcasts" 
          className="text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Podcast Library</span>
        </Link>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-6 md:p-8">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted/50 flex-shrink-0">
            {podcast.thumbnailUrl ? (
              <img
                src={podcast.thumbnailUrl}
                alt={podcast.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Headphones className="h-16 w-16 text-primary/70" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {podcast.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {podcast.title}
            </h1>

            <div className="text-lg text-muted-foreground mb-6">
              {podcast.description}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              {podcast.host && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Hosted by <span className="font-medium">{podcast.host}</span></span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(podcast.duration)}</span>
              </div>
              {podcast.episodeNumber && (
                <div>
                  Episode {podcast.episodeNumber}
                </div>
              )}
              <div>
                Posted {format(new Date(podcast.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-center">
                <Button className="gap-2">
                  <Headphones className="h-4 w-4" />
                  <span>Play Episode</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t">
          <h2 className="text-xl font-bold mb-4">Show Notes</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Content would be rendered here */}
            <div dangerouslySetInnerHTML={{ __html: podcast.content || '<p>No show notes available for this episode.</p>' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastDetailPage; 