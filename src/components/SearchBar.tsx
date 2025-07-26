
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search for products...", className }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`relative flex items-center w-full max-w-2xl ${className}`}>
      <div className="relative flex-1">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pl-4 pr-10 py-2 w-full border-2 border-gray-200 rounded-none focus:outline-none focus:ring-0"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 rounded-none focus:outline-none focus:ring-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        onClick={handleSearch}
        className="bg-shop-primary hover:bg-shop-primary/90 text-white border-2 border-shop-primary rounded-none focus:outline-none focus:ring-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBar;
