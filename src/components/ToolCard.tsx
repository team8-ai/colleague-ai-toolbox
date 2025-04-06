import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Tool, toggleLikeTool } from '@/lib/tools';
import { AuthError } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface ToolCardProps {
  tool: Tool;
  onLike: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onLike }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localTool, setLocalTool] = useState(tool);
  
  // Note: The backend currently doesn't provide information on *who* liked a tool,
  // only the count. So, we cannot display a specific "liked" state per user yet.
  // We'll assume isLiked is false for now, but keep the handleLike functionality.
  // You might need to adjust the backend to return user-specific like status.
  const isLiked = localTool.isLiked;

  const handleLike = async () => {
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
    setLocalTool({
      ...localTool,
      isLiked: newIsLiked,
      likes: localTool.likes + likeDelta
    });

    try {
      await toggleLikeTool(localTool.id);
      onLike();
    } catch (error) {
      // Revert the optimistic update on error
      setLocalTool({
        ...localTool,
        isLiked: !newIsLiked,
        likes: localTool.likes - likeDelta
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

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-lg border-transparent hover:border-primary/20 bg-background/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Link to={`/tool/${localTool.id}`} className="flex-grow mr-2">
            <CardTitle className="text-lg font-semibold line-clamp-1 hover:text-primary transition-colors">
              {localTool.name}
            </CardTitle>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`flex-shrink-0 h-8 w-8 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground/70 hover:text-red-400 hover:bg-red-500/10'}`}
            onClick={(e) => { e.preventDefault(); handleLike(); }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <Link to={`/tool/${localTool.id}`} className="block mb-3">
          <div className="aspect-video rounded-md overflow-hidden bg-muted relative group">
            {localTool.image_url ? (
              <img 
                src={localTool.image_url}
                alt={localTool.name} 
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                <span className="text-2xl font-semibold">{localTool.name.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{localTool.description}</p>
        <div className="flex flex-wrap gap-1">
          {localTool.tags.slice(0, 3).map((tag) => (
            <Badge key={`tag-${tag}`} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart className={`h-3 w-3 ${localTool.likes > 0 ? 'text-red-500/80 fill-current' : ''}`} />
          <span>
            {localTool.likes || 0} {localTool.likes === 1 ? 'like' : 'likes'}
          </span>
        </div>
        <Button asChild variant="outline" size="sm" className="text-xs h-7 px-2">
          <Link to={`/tool/${localTool.id}`}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
