
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
  const [isFocused, setIsFocused] = useState(false);
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
    <div className={`relative flex items-center w-full transition-all duration-500 ${className}`}>
      <div
        className={`relative flex items-center w-full group transition-all duration-500 rounded-2xl overflow-hidden border ${isFocused ? 'bg-white border-black/10 shadow-xl shadow-black/[0.02]' : 'bg-black/[0.03] border-transparent'
          }`}
      >
        <div className="pl-4 text-black/30 group-focus-within:text-black/60 transition-colors">
          <Search className="h-5 w-5" />
        </div>

        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-black/30 text-base h-12 w-full pl-3 pr-10 font-medium"
        />

        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 p-1 rounded-full bg-black/5 hover:bg-black/10 transition-all text-black/40"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
