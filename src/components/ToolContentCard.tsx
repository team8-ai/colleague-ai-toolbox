import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { ToolContent, ContentType } from '@/types/content';
import { toggleLikeContent } from '@/lib/content';
import { AuthError } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import ContentCard from './ContentCard';

interface ToolContentCardProps {
  content: ToolContent;
  onLike: () => void;
}

const ToolContentCard: React.FC<ToolContentCardProps> = ({ content, onLike }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localContent, setLocalContent] = useState<ToolContent>(content);
  
  const isLiked = localContent.isLiked || false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to like tools",
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
      likes: localContent.likes + likeDelta
    });

    try {
      await toggleLikeContent(localContent.id, ContentType.TOOL);
      onLike();
    } catch (error) {
      // Revert the optimistic update on error
      setLocalContent({
        ...localContent,
        isLiked: !newIsLiked,
        likes: localContent.likes - likeDelta
      });
      
      console.error("Error toggling like:", error);
      if (error instanceof AuthError) {
        console.error('AuthError caught during toggle like:', error.message);
        navigate('/login');
      } else {
        toast({
          title: "Error",
          description: "Failed to like the tool. Please try again.",
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

  // Footer info (likes count)
  const footerInfo = (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Heart className={`h-3 w-3 ${localContent.likes > 0 ? 'text-red-500/80 fill-current' : ''}`} />
      <span>
        {localContent.likes || 0} {localContent.likes === 1 ? 'like' : 'likes'}
      </span>
    </div>
  );

  // Footer action (view details button)
  const footerAction = (
    <Button asChild variant="outline" size="sm" className="text-xs h-7 px-2">
      <a href={`/tool/${content.id}`}>View details</a>
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

export default ToolContentCard; 