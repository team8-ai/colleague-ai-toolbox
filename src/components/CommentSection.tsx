
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addComment, getCommentsByToolId, Comment } from '@/lib/tools';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  toolId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ toolId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await getCommentsByToolId(toolId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error loading comments:", error);
        toast({
          title: "Error loading comments",
          description: "Please refresh the page to try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [toolId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to post comments",
        variant: "destructive",
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      await addComment(toolId, newComment);
      
      // Refresh comments
      const updatedComments = await getCommentsByToolId(toolId);
      setComments(updatedComments);
      setNewComment('');
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error posting comment",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      
      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts about this tool..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}
      
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-border pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.createdBy.photoURL || undefined} alt={comment.createdBy.displayName} />
                  <AvatarFallback>{getInitials(comment.createdBy.displayName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{comment.createdBy.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {comment.createdAt && 
                          formatDistanceToNow(new Date(comment.createdAt.toDate()), { addSuffix: true })
                        }
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
