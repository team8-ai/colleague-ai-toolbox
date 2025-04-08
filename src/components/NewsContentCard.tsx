import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NewsContent, ContentType } from '@/types/content';
import { Calendar, ExternalLink, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toggleLikeContent } from '@/lib/content';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AuthError } from '@/lib/api';

interface NewsContentCardProps {
  content: NewsContent;
  onLike?: () => void;
}

const NewsContentCard: React.FC<NewsContentCardProps> = ({ content, onLike }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localContent, setLocalContent] = useState<NewsContent>(content);
  const formattedDate = formatDistanceToNow(new Date(localContent.publishDate), { addSuffix: true });
  const isLiked = localContent.isLiked || false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to like news items",
        variant: "destructive",
      });
      return;
    }

    // Optimistic UI update
    const newIsLiked = !isLiked;
    setLocalContent({
      ...localContent,
      isLiked: newIsLiked
    });

    try {
      await toggleLikeContent(localContent.id, ContentType.NEWS);
      if (onLike) onLike();
    } catch (error) {
      // Revert the optimistic update on error
      setLocalContent({
        ...localContent,
        isLiked: !newIsLiked
      });
      
      console.error("Error toggling like:", error);
      if (error instanceof AuthError) {
        console.error('AuthError caught during toggle like:', error.message);
        navigate('/login');
      } else {
        toast({
          title: "Error",
          description: "Failed to like the news item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="p-0">
        {localContent.thumbnailUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-white">
            <Link to={`/news/${localContent.id}`}>
              <img
                src={localContent.thumbnailUrl}
                alt={localContent.title}
                className="object-contain h-full w-full transition-transform hover:scale-105"
              />
            </Link>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-2">
            {localContent.author && <span>{localContent.author}</span>}
            {localContent.author && <span>•</span>}
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`flex-shrink-0 h-8 w-8 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground/70 hover:text-red-400 hover:bg-red-500/10'}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <Link to={`/news/${localContent.id}`} className="block group">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary line-clamp-2">
            {localContent.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {localContent.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {localContent.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs">
              {tag}
            </Badge>
          ))}
          {localContent.tags.length > 3 && (
            <Badge variant="outline" className="px-2 py-0.5 text-xs">
              +{localContent.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto">
        <div className="flex justify-between w-full items-center">
          <Link 
            to={`/news/${localContent.id}`} 
            className="text-sm font-medium text-primary hover:underline"
          >
            Read more
          </Link>
          {localContent.sourceUrl && (
            <a 
              href={localContent.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
              aria-label="Visit original source"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsContentCard; 