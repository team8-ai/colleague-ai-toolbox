import React, { useState, useEffect } from 'react';
import { getAllTags } from '@/lib/tools';
import { getAllDocumentTags } from '@/lib/documents';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ContentType } from '@/types/content';

interface ContentTagFilterProps {
  selectedTag: string | null;
  onChange: (tag: string | null) => void;
  contentType: ContentType;
}

const ContentTagFilter: React.FC<ContentTagFilterProps> = ({
  selectedTag,
  onChange,
  contentType
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        let fetchedTags: string[] = [];
        
        // Fetch tags based on content type
        switch (contentType) {
          case ContentType.TOOL:
            fetchedTags = await getAllTags();
            break;
          case ContentType.DOCUMENT:
            fetchedTags = await getAllDocumentTags();
            break;
          case ContentType.NEWS:
          case ContentType.PODCAST:
            // For future implementation
            fetchedTags = [];
            break;
        }
        
        setTags(fetchedTags);
      } catch (error) {
        console.error(`Error fetching ${contentType} tags:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [contentType]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant={selectedTag === null ? "default" : "ghost"}
        size="sm"
        className={`justify-start ${
          selectedTag === null ? "bg-primary/90 text-primary-foreground" : ""
        }`}
        onClick={() => onChange(null)}
      >
        All
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={selectedTag === tag ? "default" : "ghost"}
          size="sm"
          className={`justify-start ${
            selectedTag === tag ? "bg-primary/90 text-primary-foreground" : ""
          }`}
          onClick={() => onChange(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default ContentTagFilter; 