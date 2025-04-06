import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Document } from '@/lib/documents';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-lg border-transparent hover:border-primary/20 bg-background/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <Link to={`/documents/${document.id}`}>
          <CardTitle className="text-lg font-semibold line-clamp-1 hover:text-primary transition-colors">
            {document.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <Link to={`/documents/${document.id}`} className="block mb-3">
          <div className="aspect-video rounded-md overflow-hidden bg-muted relative group">
            {document.thumbnail_url ? (
              <img 
                src={document.thumbnail_url}
                alt={document.title} 
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                <span className="text-2xl font-semibold">{document.title.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{document.description}</p>
        <div className="flex flex-wrap gap-1">
          {document.tags.slice(0, 3).map((tag) => (
            <Badge key={`tag-${tag}`} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="h-3 w-3" />
          <span>
            {format(new Date(document.createdAt), 'MMM dd, yyyy')}
          </span>
        </div>
        <Button asChild variant="outline" size="sm" className="text-xs h-7 px-2">
          <Link to={`/documents/${document.id}`}>Read document</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard; 