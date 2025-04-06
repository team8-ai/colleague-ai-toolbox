import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsContent } from '@/types/content';
import { Calendar, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsContentCardProps {
  content: NewsContent;
}

const NewsContentCard: React.FC<NewsContentCardProps> = ({ content }) => {
  const formattedDate = formatDistanceToNow(new Date(content.publishDate), { addSuffix: true });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="p-0">
        {content.thumbnailUrl && (
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className="object-cover h-full w-full transition-transform hover:scale-105"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {content.author && <span>{content.author}</span>}
          {content.author && <span>•</span>}
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>
        <Link to={`/news/${content.id}`} className="block group">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary line-clamp-2">
            {content.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {content.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {content.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs">
              {tag}
            </Badge>
          ))}
          {content.tags.length > 3 && (
            <Badge variant="outline" className="px-2 py-0.5 text-xs">
              +{content.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto">
        <div className="flex justify-between w-full items-center">
          <Link 
            to={`/news/${content.id}`} 
            className="text-sm font-medium text-primary hover:underline"
          >
            Read more
          </Link>
          {content.sourceUrl && (
            <a 
              href={content.sourceUrl} 
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