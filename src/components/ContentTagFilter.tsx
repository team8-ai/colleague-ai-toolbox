import React, { useState, useEffect } from 'react';
import { getAllTags } from '@/lib/tools';
import { getAllDocumentTags } from '@/lib/documents';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { ContentType } from '@/types/content';
import { Badge } from '@/components/ui/badge';

interface ContentTagFilterProps {
  selectedTag?: string | null;
  onChange?: (tag: string | null) => void;
  contentType?: ContentType;
  // For multi-select mode
  multiSelect?: boolean;
  tags?: string[];
  selectedTags?: string[];
  onTagSelect?: (tags: string[]) => void;
}

const ContentTagFilter: React.FC<ContentTagFilterProps> = ({
  selectedTag,
  onChange,
  contentType,
  // Multi-select props
  multiSelect = false,
  tags: providedTags,
  selectedTags = [],
  onTagSelect
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(!providedTags);

  useEffect(() => {
    // If tags are provided directly, use those
    if (providedTags) {
      setTags(providedTags);
      setLoading(false);
      return;
    }
    
    // Otherwise fetch them based on content type
    const fetchTags = async () => {
      try {
        let fetchedTags: string[] = [];
        
        // Fetch tags based on content type
        if (contentType) {
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
        }
        
        setTags(fetchedTags);
      } catch (error) {
        console.error(`Error fetching tags:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [contentType, providedTags]);

  // Handle tag selection for multi-select mode
  const toggleTag = (tag: string) => {
    if (!onTagSelect) return;
    
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    onTagSelect(newSelectedTags);
  };

  // Handle clearing all selected tags
  const clearAllTags = () => {
    if (onTagSelect) {
      onTagSelect([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  // Multi-select mode
  if (multiSelect) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium">Filter by tags</h3>
          {selectedTags.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={clearAllTags}
            >
              Clear all
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer ${selectedTags.includes(tag) ? '' : 'hover:bg-secondary'}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground">No tags available</p>
          )}
        </div>
      </div>
    );
  }

  // Single-select mode (original behavior)
  return (
    <div className="flex flex-col gap-1">
      <Button
        variant={selectedTag === null ? "default" : "ghost"}
        size="sm"
        className={`justify-start ${
          selectedTag === null ? "bg-primary/90 text-primary-foreground" : ""
        }`}
        onClick={() => onChange && onChange(null)}
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
          onClick={() => onChange && onChange(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default ContentTagFilter; 