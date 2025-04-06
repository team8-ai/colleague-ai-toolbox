import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseContent, ContentType } from '@/types/content';
import ToolContentCard from '@/components/ToolContentCard';
import DocumentContentCard from '@/components/DocumentContentCard';
import ContentTagFilter from '@/components/ContentTagFilter';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { AuthError } from '@/lib/api';
import { contentFetcher } from '@/lib/content';
import useSWR, { mutate } from 'swr';

// Props for the ContentFeedPage
interface ContentFeedPageProps {
  contentType: ContentType;
  title: string;
  description: string;
}

// Content Feed Page component that can be used for all content types
const ContentFeedPage: React.FC<ContentFeedPageProps> = ({ 
  contentType, 
  title, 
  description 
}) => {
  const { tag: routeTag } = useParams<{ tag?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(routeTag || null);

  useEffect(() => {
    setSelectedTag(routeTag || null);
  }, [routeTag]);

  // SWR implementation
  const swrKey = useMemo(() => ['content', contentType, selectedTag], [contentType, selectedTag]);
  const { data: content, error, isLoading } = useSWR<BaseContent[], Error>(
    swrKey,
    contentFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // Handle AuthError
  useEffect(() => {
    if (error instanceof AuthError) {
      console.error('AuthError caught from SWR:', error.message);
      navigate('/login');
    }
  }, [error, navigate]);

  const filteredContent = useMemo(() => {
    console.log(`Filtering ${contentType} content. Search:`, searchQuery, "Content:", content);
    if (!content) return [];

    if (searchQuery.trim() === '') {
      return content;
    }

    const query = searchQuery.toLowerCase().trim();
    return content.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
    );
  }, [searchQuery, content, contentType]);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setSearchQuery('');
  };

  const handleContentLike = async () => {
    console.log("Content liked, will trigger SWR revalidation after delay");
    
    // Delay the revalidation to allow UI to be responsive
    setTimeout(async () => {
      try {
        await mutate(swrKey);
        console.log("SWR revalidation triggered successfully after like.");
      } catch (err) {
        console.error("Error during SWR revalidation after like:", err);
        if (err instanceof AuthError) {
          console.error('AuthError caught during like/revalidation:', err.message);
          navigate('/login');
        } else {
          // Handle other potential errors from mutate if necessary
          console.error("An unexpected error occurred during revalidation:", err);
        }
      }
    }, 500); // 500ms delay to ensure UI feels responsive
  };

  // Display error state, but not if it's an AuthError (we navigate away)
  const displayError = error && !(error instanceof AuthError) ? error : null;

  // Render a content card based on its type
  const renderContentCard = (item: BaseContent) => {
    switch ((item as any).type) {
      case ContentType.TOOL:
        return <ToolContentCard key={item.id} content={item as any} onLike={handleContentLike} />;
      case ContentType.DOCUMENT:
        return <DocumentContentCard key={item.id} content={item as any} />;
      case ContentType.NEWS:
        // Future implementation
        return null;
      case ContentType.PODCAST:
        // Future implementation
        return null;
      default:
        return null;
    }
  };

  // Get the correct page title based on content type
  const getPageTitle = () => {
    return title || {
      [ContentType.TOOL]: 'Tool Library',
      [ContentType.DOCUMENT]: 'Document Library',
      [ContentType.NEWS]: 'News Feed',
      [ContentType.PODCAST]: 'Podcast Library',
    }[contentType];
  };

  // Get the correct page description based on content type
  const getPageDescription = () => {
    return description || {
      [ContentType.TOOL]: 'Explore our collection of helpful tools and utilities.',
      [ContentType.DOCUMENT]: 'Browse our documentation, guides, and tutorials.',
      [ContentType.NEWS]: 'Stay updated with the latest news and announcements.',
      [ContentType.PODCAST]: 'Listen to our podcast episodes and interviews.',
    }[contentType];
  };

  // Get the correct search placeholder text based on content type
  const getSearchPlaceholder = () => {
    return {
      [ContentType.TOOL]: 'Search tools by name, description, or tag...',
      [ContentType.DOCUMENT]: 'Search documents by title, description, or tag...',
      [ContentType.NEWS]: 'Search news by title, description, or tag...',
      [ContentType.PODCAST]: 'Search podcasts by title, description, or tag...',
    }[contentType];
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-10 p-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          {getPageTitle()}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 mx-auto md:mx-0">
          {getPageDescription()}
        </p>
        <div className="relative w-full max-w-xl mx-auto md:mx-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder={getSearchPlaceholder()}
            className="pl-10 h-12 rounded-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={`Search ${contentType.toLowerCase()}s`}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:sticky top-24 w-full lg:w-64 space-y-6 h-fit">
          <div className="p-5 rounded-xl border bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Explore by Tag</h2>
            <ContentTagFilter
              selectedTag={selectedTag}
              onChange={handleTagChange}
              contentType={contentType}
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
                <p className="text-xl font-medium text-destructive mb-1">Error loading content</p>
                <p className="text-sm text-destructive/80 text-center max-w-xs">{displayError.message}</p>
             </div>
          )}
          {!isLoading && !displayError && filteredContent.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredContent.map((item) => renderContentCard(item))}
            </div>
          )}
          {!isLoading && !displayError && filteredContent.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-xl border border-dashed">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xl font-medium text-foreground mb-1">No content found</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                {searchQuery && content && content.length > 0 && 'Your search did not match any content. '}
                {selectedTag && content && content.length === 0 && `No content found for the tag "${selectedTag}". `}
                {!selectedTag && content && content.length === 0 && `There is no ${contentType.toLowerCase()} content available currently. `}
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

export default ContentFeedPage; 