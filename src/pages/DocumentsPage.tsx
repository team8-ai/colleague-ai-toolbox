import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, documentsFetcher } from '@/lib/documents';
import DocumentCard from '@/components/DocumentCard';
import DocumentTagFilter from '@/components/DocumentTagFilter';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { AuthError } from '@/lib/api';
import useSWR from 'swr';

const DocumentsPage: React.FC = () => {
  const { tag: routeTag } = useParams<{ tag?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(routeTag || null);

  useEffect(() => {
    setSelectedTag(routeTag || null);
  }, [routeTag]);

  // SWR implementation
  const swrKey = selectedTag ? `/documents/tag/${selectedTag}` : '/documents';
  const { data: documents, error, isLoading } = useSWR<Document[], Error>(swrKey, documentsFetcher, {
    revalidateOnFocus: false,
  });

  // Handle AuthError
  useEffect(() => {
    if (error instanceof AuthError) {
      console.error('AuthError caught from SWR:', error.message);
      navigate('/login');
    }
  }, [error, navigate]);

  const filteredDocuments = useMemo(() => {
    console.log("Filtering documents. Search:", searchQuery, "Documents:", documents);
    if (!documents) return [];

    if (searchQuery.trim() === '') {
      return documents;
    }

    const query = searchQuery.toLowerCase().trim();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.tags.some((t) => t.toLowerCase().includes(query))
    );
  }, [searchQuery, documents]);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setSearchQuery('');
  };

  // Display error state, but not if it's an AuthError (we navigate away)
  const displayError = error && !(error instanceof AuthError) ? error : null;

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-10 p-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Document Library
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 mx-auto md:mx-0">
          Explore our collection of guides, tutorials and documentation.
        </p>
        <div className="relative w-full max-w-xl mx-auto md:mx-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search documents by title, description, or tag..."
            className="pl-10 h-12 rounded-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search documents"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:sticky top-24 w-full lg:w-64 space-y-6 h-fit">
          <div className="p-5 rounded-xl border bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Explore by Tag</h2>
            <DocumentTagFilter
              selectedTag={selectedTag}
              onChange={handleTagChange}
            />
          </div>
        </div>

        <div className="flex-1">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/10 p-6 h-[300px] animate-pulse bg-muted/50"
                >
                  <div className="h-5 w-3/4 bg-muted/80 rounded mb-4"></div>
                  <div className="aspect-video bg-muted rounded-md mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted/80 rounded w-full"></div>
                    <div className="h-3 bg-muted/80 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {displayError && (
             <div className="flex flex-col items-center justify-center py-16 bg-destructive/10 rounded-xl border border-dashed border-destructive/50">
                <p className="text-xl font-medium text-destructive mb-1">Error loading documents</p>
                <p className="text-sm text-destructive/80 text-center max-w-xs">{displayError.message}</p>
             </div>
          )}
          {!isLoading && !displayError && filteredDocuments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}
          {!isLoading && !displayError && filteredDocuments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-xl border border-dashed">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xl font-medium text-foreground mb-1">No documents found</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                {searchQuery && documents && documents.length > 0 && 'Your search did not match any documents. '}
                {selectedTag && documents && documents.length === 0 && `No documents found for the tag "${selectedTag}". `}
                {!selectedTag && documents && documents.length === 0 && 'There are no documents available currently. '}
                {(searchQuery || selectedTag) ? 'Try clearing filters.' : ''}
              </p>
              {(searchQuery || selectedTag) && (
                <button
                  onClick={() => { setSearchQuery(''); handleTagChange(null); }}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage; 