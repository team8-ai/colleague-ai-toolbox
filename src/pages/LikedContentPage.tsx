import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseContent, ContentType, Content } from '@/types/content';
import ToolContentCard from '@/components/ToolContentCard';
import DocumentContentCard from '@/components/DocumentContentCard';
import NewsContentCard from '@/components/NewsContentCard';
import PodcastContentCard from '@/components/PodcastContentCard';
import ContentTagFilter from '@/components/ContentTagFilter';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Loader2, 
  FileText, 
  Wrench, 
  Radio, 
  Newspaper,
  Filter,
  Heart
} from 'lucide-react';
import { AuthError, likesAPI } from '@/lib/api';
import { mutate } from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const fetchLikedContent = async (): Promise<Content[]> => {
  try {
    return await likesAPI.getLikedContent();
  } catch (error) {
    console.error('Error fetching liked content:', error);
    throw error;
  }
};

const LikedContentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedContent, setLikedContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [allTags, setAllTags] = useState<string[]>([]);

  // SWR key for mutating content
  const swrKey = '/likes/';

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const loadContent = async () => {
      setIsLoading(true);
      try {
        const content = await fetchLikedContent();
        console.log('Fetched liked content:', content);
        setLikedContent(content);
        
        // Extract all unique tags
        const tags = Array.from(new Set(
          content.flatMap(item => item.tags || [])
        )).sort();
        setAllTags(tags);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading liked content:', error);
        if (error instanceof AuthError) {
          navigate('/login');
        } else {
          setError(error as Error);
          setIsLoading(false);
        }
      }
    };

    loadContent();
  }, [user, navigate]);

  // Transform API data to match expected component interfaces
  const adaptContent = (item: any): Content => {
    // Common properties
    const baseContent = {
      id: item.id,
      title: item.title,
      description: item.description,
      tags: item.tags || [],
      thumbnailUrl: item.icon || undefined,
      createdAt: item.publishedDate || new Date().toISOString(),
      likes: 1, // This item is liked
      isLiked: true,
    };

    // Type-specific properties
    const normalizedType = item.type.toLowerCase();
    
    switch (normalizedType) {
      case ContentType.TOOL:
        return {
          ...baseContent,
          type: ContentType.TOOL,
          url: item.url || '#',
        };
      case ContentType.DOCUMENT:
        return {
          ...baseContent,
          type: ContentType.DOCUMENT,
          fileUrl: item.url || '#',
          fileType: 'pdf',
        };
      case ContentType.NEWS:
        return {
          ...baseContent,
          type: ContentType.NEWS,
          sourceUrl: item.url || '#',
          author: item.author || 'Unknown',
          publishDate: item.publishedDate || new Date().toISOString(),
        };
      case ContentType.PODCAST:
        return {
          ...baseContent,
          type: ContentType.PODCAST,
          audioUrl: item.url || '#',
          duration: 0,
          host: item.author || 'Unknown',
        };
      default:
        return {
          ...baseContent,
          type: ContentType.TOOL,
          url: item.url || '#',
        };
    }
  };

  // Filter content based on search, tags, and content type
  useEffect(() => {
    // Transform API data to match expected component interfaces
    const adaptedContent = likedContent.map(adaptContent);
    
    let result = [...adaptedContent];
    console.log('Filtering from liked content:', adaptedContent.length); // Debug log

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(term) || 
          item.description.toLowerCase().includes(term) || 
          item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      result = result.filter(
        item => selectedTags.some(tag => item.tags.includes(tag))
      );
    }

    // Filter by content type
    if (selectedType !== 'all') {
      result = result.filter(item => item.type === selectedType);
    }

    console.log('Filtered content:', result.length); // Debug log
    setFilteredContent(result);
  }, [likedContent, searchTerm, selectedTags, selectedType]);

  const handleContentLike = async () => {
    try {
      await mutate(swrKey);
    } catch (err) {
      console.error("Error during SWR revalidation after like:", err);
      if (err instanceof AuthError) {
        navigate('/login');
      }
    }
  };

  const handleTagFilter = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
  };

  // Get content type icon component
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.TOOL:
        return <Wrench className="h-3 w-3" />;
      case ContentType.DOCUMENT:
        return <FileText className="h-3 w-3" />;
      case ContentType.NEWS:
        return <Newspaper className="h-3 w-3" />;
      case ContentType.PODCAST:
        return <Radio className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Render a type-specific badge for each card
  const renderTypeBadge = (type: ContentType) => {
    const labels = {
      [ContentType.TOOL]: 'Tool',
      [ContentType.DOCUMENT]: 'Document',
      [ContentType.NEWS]: 'News',
      [ContentType.PODCAST]: 'Podcast',
    };

    return (
      <Badge 
        variant="outline" 
        className="absolute top-4 left-6 down-14 flex items-center gap-1 bg-background/80 backdrop-blur-sm"
      >
        {getContentTypeIcon(type)}
        <span>{labels[type] || type}</span>
      </Badge>
    );
  };

  // Render a content card based on its type
  const renderContentCard = (item: any) => {
    console.log('Rendering content card:', item); // Debug log
    
    // Create a wrapper to add type badge to each card
    const WrappedCard = () => {
      let card;
      
      switch (item.type) {
        case ContentType.TOOL:
          card = <ToolContentCard content={item} onLike={handleContentLike} />; 
          break;
        case ContentType.DOCUMENT:
          card = <DocumentContentCard content={item} onLike={handleContentLike} />; 
          break;
        case ContentType.NEWS:
          card = <NewsContentCard content={item} onLike={handleContentLike} />; 
          break;
        case ContentType.PODCAST:
          card = <PodcastContentCard content={item} onLike={handleContentLike} />; 
          break;
        default:
          console.warn('Unknown content type:', item.type);
          return null;
      }
      
      return (
        <div className="relative" key={item.id}>
          {card}
          {renderTypeBadge(item.type)}
        </div>
      );
    };
    
    return <WrappedCard key={item.id} />;
  };

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Heart className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-medium mb-2">No liked content yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        You haven't liked any content yet. Explore the app and like items to see them here.
      </p>
      <Button onClick={() => navigate('/')}>Explore content</Button>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Liked Content</h1>
          <p className="text-muted-foreground">All your favorite content in one place</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search input */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search liked content..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Content type filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Content Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedType} onValueChange={handleTypeFilter}>
                <DropdownMenuRadioItem value="all">All types</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={ContentType.TOOL}>
                  <Wrench className="h-4 w-4 mr-2" /> Tools
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={ContentType.DOCUMENT}>
                  <FileText className="h-4 w-4 mr-2" /> Documents
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={ContentType.NEWS}>
                  <Newspaper className="h-4 w-4 mr-2" /> News
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={ContentType.PODCAST}>
                  <Radio className="h-4 w-4 mr-2" /> Podcasts
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <ContentTagFilter 
            tags={allTags} 
            selectedTags={selectedTags} 
            onTagSelect={handleTagFilter}
            multiSelect={true}
          />
        </div>
      )}

      {/* Content grid */}
      {filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map(renderContentCard)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default LikedContentPage; 