import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDocumentTags } from '@/lib/documents';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import useSWR from 'swr';

interface DocumentTagFilterProps {
  selectedTag: string | null;
  onChange: (tag: string | null) => void;
}

const documentTagsFetcher = async (): Promise<string[]> => {
  console.log("SWR Fetcher called for document tags");
  return getAllDocumentTags();
};

const DocumentTagFilter: React.FC<DocumentTagFilterProps> = ({ selectedTag, onChange }) => {
  const navigate = useNavigate();

  const { data: tags, error, isLoading } = useSWR<string[], Error>(
    'document-tags',
    documentTagsFetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  if (isLoading) {
    return (
      <div className="p-4 border rounded-md w-full">
        <p className="text-sm text-muted-foreground mb-2">Loading tags...</p>
        <div className="flex overflow-x-auto pb-2 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
     return (
       <div className="p-4 border border-destructive/50 rounded-md w-full">
          <p className="text-sm text-destructive">Error loading tags: {error.message}</p>
       </div>
     );
  }

  if (!tags || tags.length === 0) {
      return (
       <div className="p-4 border rounded-md w-full">
          <p className="text-sm text-muted-foreground">No tags available.</p>
       </div>
     );
  }

  const handleTagClick = (tag: string | null) => {
    const newSelectedTag = selectedTag === tag ? null : tag;
    onChange(newSelectedTag);
    
    if (newSelectedTag === null) {
      navigate('/documents');
    }
    // For selected tags, we remain on the same page and let SWR handle data fetching
  };

  return (
    <ScrollArea className="w-full h-48">
      <div className="flex flex-wrap gap-2 pr-4">
        <Badge
          variant={selectedTag === null ? "default" : "secondary"}
          className="cursor-pointer transition-colors hover:bg-primary/10"
          onClick={() => handleTagClick(null)}
        >
          All Documents
        </Badge>
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            className="cursor-pointer transition-colors hover:bg-primary/10"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DocumentTagFilter; 