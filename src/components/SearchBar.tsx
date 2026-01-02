import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, debounce } from "@/lib/utils";
import type { AutocompleteItem } from "@/types";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onAutocomplete?: (query: string) => Promise<AutocompleteItem[]>;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onAutocomplete,
  placeholder = "Search across offers, purchases, transports...",
  isLoading = false,
}: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = debounce(async (query: string) => {
    if (!query.trim() || !onAutocomplete) {
      setSuggestions([]);
      return;
    }

    try {
      const results = await onAutocomplete(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Autocomplete error:", error);
      setSuggestions([]);
    }
  }, 300);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setSelectedIndex(-1);
    fetchSuggestions(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        onSearch();
        setShowSuggestions(false);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectSuggestion = (suggestion: AutocompleteItem) => {
    onChange(suggestion.value);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    setTimeout(() => onSearch(), 100);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      vin: "🚗",
      id: "🔢",
      location: "📍",
      make: "🏭",
      model: "🚙",
      phone: "📞",
    };
    return icons[type] || "🔍";
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              value && suggestions.length > 0 && setShowSuggestions(true)
            }
            placeholder={placeholder}
            className="pl-10 pr-10 h-12 text-base shadow-md border-2 focus-visible:ring-2 focus-visible:ring-primary"
          />
          {value && (
            <button
              onClick={() => {
                onChange("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          onClick={onSearch}
          size="lg"
          className="h-12 px-6 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border-2 border-border max-h-96 overflow-y-auto animate-fade-in">
          <div className="p-2">
            <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-md transition-colors flex items-center gap-3",
                  "hover:bg-accent hover:text-accent-foreground",
                  selectedIndex === index && "bg-accent text-accent-foreground"
                )}
              >
                <span className="text-xl">{getTypeIcon(suggestion.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{suggestion.label}</div>
                  {suggestion.highlight && (
                    <div className="text-xs text-muted-foreground truncate">
                      {suggestion.highlight}
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase">
                  {suggestion.type}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
