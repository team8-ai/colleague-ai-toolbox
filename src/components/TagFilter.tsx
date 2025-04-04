import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTags } from '@/lib/tools';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface TagFilterProps {
  selectedTag: string | null;
  onChange: (tag: string | null) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTag, onChange }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getAllTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-md w-full">
        <div className="flex overflow-x-auto pb-2 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      onChange(null);
      navigate('/');
    } else {
      onChange(tag);
      navigate(`/tag/${tag}`);
    }
  };

  return (
    <ScrollArea className="w-full h-48">
      <div className="flex flex-wrap gap-2 pr-4">
        <Badge
          variant={selectedTag === null ? "default" : "secondary"}
          className="cursor-pointer transition-colors hover:bg-primary/10"
          onClick={() => handleTagClick(null)}
        >
           All Tools
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

export default TagFilter;
