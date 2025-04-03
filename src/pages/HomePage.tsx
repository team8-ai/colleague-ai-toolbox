import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllTools, getToolsByTag, Tool } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import TagFilter from '@/components/TagFilter';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const { tag } = useParams<{ tag?: string }>();
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(tag || null);

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      try {
        let fetchedTools: Tool[];

        if (tag) {
          fetchedTools = await getToolsByTag(tag);
          setSelectedTag(tag);
        } else {
          fetchedTools = await getAllTools();
        }

        setTools(fetchedTools);
        setFilteredTools(fetchedTools);
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [tag]);

  useEffect(() => {
    // Filter tools by search query
    if (searchQuery.trim() === '') {
      setFilteredTools(tools);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some((t) => t.toLowerCase().includes(query))
      );
      setFilteredTools(filtered);
    }
  }, [searchQuery, tools]);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleToolLike = async () => {
    // Refresh tools after a like
    try {
      let updatedTools: Tool[];
      if (selectedTag) {
        updatedTools = await getToolsByTag(selectedTag);
      } else {
        updatedTools = await getAllTools();
      }
      setTools(updatedTools);
    } catch (error) {
      console.error("Error refreshing tools after like:", error);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="space-y-4">
            <TagFilter
              selectedTag={selectedTag}
              onChange={handleTagChange}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">
               {selectedTag ? `Tools tagged with "${selectedTag}"` : 'Tools'}
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tools by name, description, or tag"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Separator className="mb-6" />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-md border p-4 h-[300px] animate-pulse bg-muted"
                />
              ))}
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="tool-grid">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onLike={handleToolLike} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-xl text-muted-foreground">No tools found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
