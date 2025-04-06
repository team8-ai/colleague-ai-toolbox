import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { documentsFetcher } from '@/lib/documents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthError } from '@/lib/api';
import { ArrowLeft, CalendarIcon, UserIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import useSWR from 'swr';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // SWR fetch for the document
  const { data: documents, error, isLoading } = useSWR<any[], Error>(
    id ? `/documents/${id}` : null,
    documentsFetcher
  );

  // Handle AuthError
  React.useEffect(() => {
    if (error instanceof AuthError) {
      console.error('AuthError caught from SWR:', error.message);
      navigate('/login');
    }
  }, [error, navigate]);

  // Get the single document from the array
  const document = documents && documents.length > 0 ? documents[0] : null;
  
  // Display error state, but not if it's an AuthError (we navigate away)
  const displayError = error && !(error instanceof AuthError) ? error : null;

  if (isLoading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  if (displayError || (!isLoading && !document)) {
    return (
      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-destructive/10 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Document Not Found</h1>
            <p className="text-destructive/80 mb-6">
              {displayError ? displayError.message : "The document you're looking for doesn't exist or has been removed."}
            </p>
            <Button asChild>
              <Link to="/documents">Back to Documents</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return null; // This shouldn't happen given the checks above, but TypeScript likes it
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/documents" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Link>
        </Button>

        {/* Document header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{document.title}</h1>
          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <UserIcon className="mr-1 h-4 w-4" />
              {document.author.displayName}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              {format(new Date(document.createdAt), 'MMMM dd, yyyy')}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {document.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Document content */}
        <MarkdownRenderer content={document.content} size="lg" />
      </div>
    </div>
  );
};

export default DocumentDetailPage; 