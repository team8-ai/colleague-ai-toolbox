import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllTools, getToolsByTag, Tool } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import TagFilter from '@/components/TagFilter';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

const CACHE_KEY_PREFIX = 'toolCache_';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  timestamp: number;
  tools: Tool[];
}

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
      const cacheKey = `${CACHE_KEY_PREFIX}${selectedTag || 'all'}`;
      console.log(`Fetching tools... Tag: ${selectedTag}, Cache Key: ${cacheKey}`);

      // 1. Check cache
      try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
          const { timestamp, tools: cachedTools } = JSON.parse(cachedItem) as CachedData;
          const now = Date.now();
          if (now - timestamp < CACHE_DURATION_MS) {
            console.log("Using cached tools:", cachedTools);
            setTools(cachedTools);
            setFilteredTools(cachedTools); // Apply initial filter based on cached data
            setLoading(false);
            // Optional: Fetch in background to update cache without showing loader
            // fetchFreshDataAndUpdateCache(selectedTag, cacheKey);
            return; // Exit early, used cached data
          } else {
            console.log("Cache expired");
            localStorage.removeItem(cacheKey); // Remove expired item
          }
        }
      } catch (error) {
        console.error("Error reading from cache:", error);
        localStorage.removeItem(cacheKey); // Clear potentially corrupted cache item
      }

      // 2. Fetch from network if cache miss or expired
      console.log("Fetching from network...");
      try {
        let fetchedTools: Tool[];
        if (selectedTag) {
          fetchedTools = await getToolsByTag(selectedTag);
        } else {
          fetchedTools = await getAllTools();
        }
        console.log("Fetched tools from network:", fetchedTools);
        setTools(fetchedTools);
        setFilteredTools(fetchedTools); // Apply initial filter based on fetched data

        // 3. Store in cache
        const dataToCache: CachedData = { timestamp: Date.now(), tools: fetchedTools };
        try {
          localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
          console.log("Stored fetched tools in cache.");
        } catch (cacheError) {
          console.error("Error writing to cache:", cacheError);
        }

      } catch (error) {
        console.error("Error fetching tools:", error);
        // Consider setting an error state here
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [selectedTag]); // Keep dependency only on selectedTag for fetching logic

  useEffect(() => {
    setSelectedTag(tag || null);
  }, [tag]);

  useEffect(() => {
    console.log("Filtering effect running. Search:", searchQuery, "Tag:", selectedTag, "Tools:", tools);
    if (searchQuery.trim() === '' && !selectedTag) {
        console.log("Setting filteredTools to all tools", tools);
        setFilteredTools(tools);
    } else {
        const query = searchQuery.toLowerCase().trim();
        const baseFiltered = selectedTag
            ? tools.filter(tool => tool.tags.includes(selectedTag))
            : tools;

        const searchFiltered = baseFiltered.filter(
            (tool) =>
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query) ||
                tool.tags.some((t) => t.toLowerCase().includes(query))
        );
        console.log("Setting filteredTools after search/tag:", searchFiltered);
        setFilteredTools(searchFiltered);
    }
}, [searchQuery, tools, selectedTag]); // Keep dependencies for filtering logic

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setSearchQuery('');
  };

  const handleToolLike = async () => {
    // We could invalidate cache here, but for simplicity,
    // let's rely on the time-based expiry or the user refreshing.
    // A more robust solution might clear the specific cache key
    // or re-fetch and update the cache immediately after liking.
    // localStorage.removeItem(`${CACHE_KEY_PREFIX}${selectedTag || 'all'}`);

    setLoading(true); // Show loading maybe? Or handle update more smoothly
    try {
      let updatedTools: Tool[];
      if (selectedTag) {
        updatedTools = await getToolsByTag(selectedTag);
      } else {
        updatedTools = await getAllTools();
      }
      setTools(updatedTools);
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const searchFiltered = updatedTools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.tags.some((t) => t.toLowerCase().includes(query))
        );
        setFilteredTools(searchFiltered);
      } else {
        setFilteredTools(updatedTools);
      }

      // Optionally update cache after like
      const cacheKey = `${CACHE_KEY_PREFIX}${selectedTag || 'all'}`;
      const dataToCache: CachedData = { timestamp: Date.now(), tools: updatedTools };
      try {
          localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
          console.log("Updated cache after like.");
      } catch (cacheError) {
          console.error("Error writing to cache after like:", cacheError);
      }

    } catch (error) {
      console.error("Error refreshing tools after like:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Rendering HomePage. Loading:", loading, "Filtered Tools:", filteredTools);

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
            aria-label="Search tools" // Added for accessibility
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
              // Consider fetching tags dynamically if they change often
            />
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/10 p-6 h-[300px] animate-pulse bg-muted/50"
                />
              ))}
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onLike={handleToolLike} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-xl border border-dashed">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xl font-medium text-foreground mb-1">No tools found</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs"> {/* Added max-width */}
                {searchQuery ? 'Try refining your search or ' : ''}
                {selectedTag ? `clear the "${selectedTag}" tag filter.` : 'Try searching or selecting a tag.'}
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
