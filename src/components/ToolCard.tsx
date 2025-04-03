import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Tool, toggleLikeTool } from '@/lib/tools';
import { toast } from '@/hooks/use-toast';

interface ToolCardProps {
  tool: Tool;
  onLike: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onLike }) => {
  const { user } = useAuth();
  const isLiked = user && tool.likes?.includes(user.uid);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to like tools",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleLikeTool(tool.id);
      onLike();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to like the tool. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl line-clamp-1">{tool.name}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-400'}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div>
          <Link to={`/tool/${tool.id}`}>
            <div className="aspect-video mb-3 rounded-md overflow-hidden bg-muted relative">
              {tool.imageUrl ? (
                <img 
                  src={tool.imageUrl} 
                  alt={tool.name} 
                  className="object-cover w-full h-full transition-all hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                  {tool.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{tool.description}</p>
          <div className="flex flex-wrap gap-1 mb-1">
            {tool.tags.slice(0, 2).map((tag) => (
              <Badge key={`tag-${tag}`} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {tool.likesCount || 0} {tool.likesCount === 1 ? 'like' : 'likes'}
          </span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={`/tool/${tool.id}`}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
