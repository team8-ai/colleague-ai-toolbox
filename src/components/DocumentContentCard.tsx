import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { DocumentContent } from '@/types/content';
import { format } from 'date-fns';
import ContentCard from './ContentCard';

interface DocumentContentCardProps {
  content: DocumentContent;
}

const DocumentContentCard: React.FC<DocumentContentCardProps> = ({ content }) => {
  // Format the date for display
  const formattedDate = format(new Date(content.createdAt), 'MMM dd, yyyy');

  // Footer info (creation date)
  const footerInfo = (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <CalendarIcon className="h-3 w-3" />
      <span>{formattedDate}</span>
    </div>
  );

  // Footer action (read document button)
  const footerAction = (
    <Button asChild variant="outline" size="sm" className="text-xs h-7 px-2">
      <a href={`/documents/${content.id}`}>Read document</a>
    </Button>
  );

  return (
    <ContentCard
      content={content}
      footerInfo={footerInfo}
      footerAction={footerAction}
    />
  );
};

export default DocumentContentCard; 