import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Heart } from 'lucide-react';
import { DocumentContent, ContentType } from '@/types/content';
import { toggleLikeContent } from '@/lib/content';
import { AuthError } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import ContentCard from './ContentCard';

interface DocumentContentCardProps {
  content: DocumentContent;
  onLike?: () => void;
}

const DocumentContentCard: React.FC<DocumentContentCardProps> = ({ content, onLike }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localContent, setLocalContent] = useState<DocumentContent>(content);
  
  // Format the date for display
  const formattedDate = format(new Date(localContent.createdAt), 'MMM dd, yyyy');
  
  const isLiked = localContent.isLiked || false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to like documents",
        variant: "destructive",
      });
      return;
    }

    // Optimistic UI update
    const newIsLiked = !isLiked;
    const likeDelta = newIsLiked ? 1 : -1;
    setLocalContent({
      ...localContent,
      isLiked: newIsLiked,
      likes: (localContent.likes || 0) + likeDelta
    });

    try {
      await toggleLikeContent(localContent.id, ContentType.DOCUMENT);
      if (onLike) onLike();
    } catch (error) {
      // Revert the optimistic update on error
      setLocalContent({
        ...localContent,
        isLiked: !newIsLiked,
        likes: (localContent.likes || 0) - likeDelta
      });
      
      console.error("Error toggling like:", error);
      if (error instanceof AuthError) {
        console.error('AuthError caught during toggle like:', error.message);
        navigate('/login');
      } else {
        toast({
          title: "Error",
          description: "Failed to like the document. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Header action button (like button)
  const headerAction = (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`flex-shrink-0 h-8 w-8 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground/70 hover:text-red-400 hover:bg-red-500/10'}`}
      onClick={handleLike}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
    </Button>
  );

  // Footer info (creation date and likes)
  const footerInfo = (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <CalendarIcon className="h-3 w-3" />
      <span>{formattedDate}</span>
    </div>
  );

  // Footer action (read document button)
  const footerAction = (
    <Button asChild variant="outline" size="sm" className="text-xs h-7 px-2">
      <a href={`/documents/${localContent.id}`}>Read document</a>
    </Button>
  );

  return (
    <ContentCard
      content={localContent}
      headerAction={headerAction}
      footerInfo={footerInfo}
      footerAction={footerAction}
    />
  );
};

export default DocumentContentCard; 