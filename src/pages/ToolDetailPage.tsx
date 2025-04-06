import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getToolById, toggleLikeTool, Tool } from '@/lib/tools';
import { AuthError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import CommentSection from '@/components/CommentSection';
import { toast } from '@/hooks/use-toast';
import { Heart, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';

const ToolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    const fetchTool = async () => {
      try {
        const fetchedTool = await getToolById(id);
        if (!fetchedTool) {
          toast({
            title: "Tool not found",
            description: "The requested tool couldn't be found",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        setTool(fetchedTool);
      } catch (error) {
        console.error("Error fetching tool:", error);
        if (error instanceof AuthError) {
           console.error('AuthError caught fetching tool:', error.message);
           navigate('/login');
        } else {
          toast({
            title: "Error",
            description: "Failed to load tool details",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTool();
  }, [id, navigate]);

  // We changed tool.likes to be a number (count) based on backend response.
  // The .includes() method doesn't exist on numbers.
  // We cannot determine if the *current* user liked the tool from this data alone.
  // We set isLiked to false as a placeholder.
  // Backend needs to be updated to provide user-specific like status for this page.
  const isLiked = tool?.isLiked || false;

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to like tools",
        variant: "destructive",
      });
      return;
    }

    if (!id || !tool) return;

    // Optimistic UI update
    const newIsLiked = !isLiked;
    const likeDelta = newIsLiked ? 1 : -1;
    setTool({
      ...tool,
      isLiked: newIsLiked,
      likes: tool.likes + likeDelta
    });

    try {
      await toggleLikeTool(id);
      // No need to refresh immediately since we already updated the UI
    } catch (error) {
      // Revert the optimistic update on error
      setTool({
        ...tool,
        isLiked: !newIsLiked,
        likes: tool.likes - likeDelta
      });
      
      console.error("Error toggling like:", error);
      if (error instanceof AuthError) {
        console.error('AuthError caught toggling like:', error.message);
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

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading tool details...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
          <p className="text-muted-foreground mb-6">
            The requested tool could not be found or may have been removed.
          </p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">About this tool</h2>
            <div className="prose max-w-none">
              <p>{tool.description}</p>
              {/* Here you can add more detailed content about the tool */}
            </div>
          </div>

          <Separator />

          <CommentSection toolId={tool.id} />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border overflow-hidden">
            <div className="aspect-video bg-muted">
              {tool.image_url ? (
                <img
                  src={tool.image_url}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground text-2xl font-bold">
                  {tool.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tool.likes || 0} {tool.likes === 1 ? 'like' : 'likes'}
                  </p>
                </div>
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  className={isLiked ? "text-primary-foreground" : ""}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
              </div>

              <Button className="w-full" asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  Visit Tool
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {tool.tags.map((tag) => (
                <Badge key={`tag-${tag}`} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
