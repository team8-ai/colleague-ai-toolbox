import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getAllTools, getToolsByTag, Tool } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import TagFilter from '@/components/TagFilter';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import useSWR, { mutate } from 'swr';

// Define a fetcher function for SWR
// The key will be an array like ['tools', tag] or ['tools', null]
const fetcher = async ([_, tag]: [string, string | null]): Promise<Tool[]> => {
  console.log(`SWR Fetcher called. Key: ['tools', ${tag}]`);
  if (tag) {
    return getToolsByTag(tag);
  }
  return getAllTools();
};

const HomePage: React.FC = () => {
  const { tag: routeTag } = useParams<{ tag?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(routeTag || null);

  useEffect(() => {
    setSelectedTag(routeTag || null);
  }, [routeTag]);

  // --- SWR Implementation ---
  const swrKey = useMemo(() => ['tools', selectedTag], [selectedTag]);
  const { data: tools, error, isLoading } = useSWR<Tool[], Error>(
    swrKey, // Key depends on the selected tag
    fetcher,
    {
      // Optional SWR configuration
      // revalidateOnFocus: false, // Example: disable revalidation on window focus
      // dedupingInterval: 2000, // Example: dedupe requests within 2 seconds
    }
  );

  const filteredTools = useMemo(() => {
    console.log("Filtering effect running. Search:", searchQuery, "Tag:", selectedTag, "Tools from SWR:", tools);
    if (!tools) return []; // Handle initial undefined state from SWR

    if (searchQuery.trim() === '') {
      console.log("Setting filteredTools to SWR data", tools);
      return tools; // Return all data fetched by SWR if no search query
    }

    const query = searchQuery.toLowerCase().trim();
    const searchFiltered = tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((t) => t.toLowerCase().includes(query))
    );
    console.log("Setting filteredTools after search:", searchFiltered);
    return searchFiltered;
  }, [searchQuery, tools, selectedTag]);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setSearchQuery('');
  };

  const handleToolLike = async () => {
    console.log("Tool liked, triggering SWR revalidation for key:", swrKey);
    try {
      await mutate(swrKey);
      console.log("SWR revalidation triggered successfully after like.");
    } catch (error) {
      console.error("Error during like or SWR revalidation:", error);
    }
  };

  console.log("Rendering HomePage. SWR isLoading:", isLoading, "SWR Error:", error, "Filtered Tools:", filteredTools);

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-10 p-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          AI Tools Directory
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 mx-auto md:mx-0">
          Discover the best AI tools to enhance your productivity and creativity.
        </p>
        <div className="relative w-full max-w-xl mx-auto md:mx-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search tools by name, description, or tag..."
            className="pl-10 h-12 rounded-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tools"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:sticky top-24 w-full lg:w-64 space-y-6 h-fit">
          <div className="p-5 rounded-xl border bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Explore by Tag</h2>
            <TagFilter
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
                />
              ))}
            </div>
          )}
          {error && (
             <div className="flex flex-col items-center justify-center py-16 bg-destructive/10 rounded-xl border border-dashed border-destructive/50">
                <p className="text-xl font-medium text-destructive mb-1">Error loading tools</p>
                <p className="text-sm text-destructive/80 text-center max-w-xs">{error.message}</p>
             </div>
          )}
          {!isLoading && !error && filteredTools.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onLike={handleToolLike} />
              ))}
            </div>
          )}
          {!isLoading && !error && filteredTools.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-xl border border-dashed">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xl font-medium text-foreground mb-1">No tools found</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                 {searchQuery && tools && tools.length > 0 && 'Your search did not match any tools. '}
                 {selectedTag && tools && tools.length === 0 && `No tools found for the tag "${selectedTag}". `}
                 {!selectedTag && tools && tools.length === 0 && 'There are no tools available currently. '}
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

export default HomePage;
