import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BaseContent, ContentType } from '@/types/content';

interface ContentCardProps {
  content: BaseContent;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
  footerAction?: React.ReactNode;
  footerInfo?: React.ReactNode;
}

// Base Content Card component that can be extended by specialized content cards
const ContentCard: React.FC<ContentCardProps> = ({
  content,
  children,
  headerAction,
  footerAction,
  footerInfo
}) => {
  // Determine the route based on content type
  const getContentRoute = () => {
    switch ((content as any).type) {
      case ContentType.TOOL:
        return `/tool/${content.id}`;
      case ContentType.DOCUMENT:
        return `/documents/${content.id}`;
      case ContentType.NEWS:
        return `/news/${content.id}`;
      case ContentType.PODCAST:
        return `/podcasts/${content.id}`;
      default:
        return '#';
    }
  };

  const contentRoute = getContentRoute();

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md border bg-background/60 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-10">
        <div className="flex justify-between items-start">
          <Link to={contentRoute} className="flex-grow mr-2">
            <CardTitle className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors">
              {content.title}
            </CardTitle>
          </Link>
          {headerAction}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <Link to={contentRoute} className="block mb-3">
          <div className="aspect-video rounded-md overflow-hidden bg-white relative group">
            {content.thumbnailUrl ? (
              <img 
                src={content.thumbnailUrl}
                alt={content.title} 
                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                <span className="text-2xl font-semibold">{content.title.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{content.description}</p>
        <div className="flex flex-wrap gap-1">
          {content.tags.slice(0, 3).map((tag) => (
            <Badge key={`tag-${tag}`} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        {children}
      </CardContent>
      <CardFooter className="pt-3 flex justify-between items-center">
        {footerInfo}
        {footerAction || (
          <Link 
            to={contentRoute}
            className="text-xs px-2 py-1 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
          >
            View details
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContentCard; 