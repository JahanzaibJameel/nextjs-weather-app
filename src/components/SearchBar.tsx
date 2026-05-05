import { useState, KeyboardEvent } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  isLoading = false,
  placeholder = 'Enter city or country' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container" role="search">
      <label htmlFor="weather-search" className="sr-only">
        Search for weather by city or country
      </label>
      <input
        id="weather-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="search-input"
        disabled={isLoading}
        aria-label="Search for weather by city or country"
        aria-describedby="search-help"
      />
      <button 
        onClick={handleSearch} 
        className="search-button"
        disabled={isLoading || !query.trim()}
        aria-label="Search weather"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      <div id="search-help" className="sr-only">
        Enter a city name or country to get current weather information
      </div>
    </div>
  );
}
