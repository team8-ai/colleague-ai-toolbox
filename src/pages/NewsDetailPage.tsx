import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NewsContent } from '@/types/content';
import { Calendar, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { getNewsById } from '@/lib/news';
import { AuthError } from '@/lib/api';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<NewsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getNewsById(id);
        setNewsItem(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching news item:', err);
        if (err instanceof AuthError) {
          navigate('/login');
        } else {
          setError('Failed to load news item. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading news article...</p>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/30 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error || 'News item not found'}</p>
          <Button onClick={() => navigate('/news')}>
            Return to News Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/news" 
          className="text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to News Feed</span>
        </Link>
      </div>

      <article className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {newsItem.thumbnailUrl && (
          <div className="w-full overflow-hidden aspect-[21/9]">
            <img
              src={newsItem.thumbnailUrl}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {newsItem.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {newsItem.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 border-b pb-6">
            {newsItem.author && (
              <div className="flex items-center gap-1">
                <span className="font-medium">By</span> {newsItem.author}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(newsItem.publishDate), 'MMMM d, yyyy')}</span>
            </div>
            {newsItem.sourceUrl && (
              <a 
                href={newsItem.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 hover:text-primary"
              >
                <span>Source</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              {newsItem.description}
            </p>
            {/* Content would be rendered here */}
            <div dangerouslySetInnerHTML={{ __html: newsItem.content || '' }} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage; 