
import { useState, useEffect } from 'react';
import { X, Filter, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/types';
import { Brand } from '@/services/brandService';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

const FilterSidebar = ({ isOpen, onClose, onFiltersChange, currentFilters }: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for colors and sizes (these would come from API in a real implementation)
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const maxPrice = 1000; // Default max price

  // Fetch categories and brands from API
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories and brands in parallel
        const [categoriesData, brandsData] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands()
        ]);
        
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (err) {
        console.error('Error fetching filter data:', err);
        setError('Failed to load filter options');
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...localFilters.categories, category]
      : localFilters.categories.filter(c => c !== category);
    
    const newFilters = { ...localFilters, categories: updatedCategories };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const updatedBrands = checked
      ? [...localFilters.brands, brand]
      : localFilters.brands.filter(b => b !== brand);
    
    const newFilters = { ...localFilters, brands: updatedBrands };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const updatedColors = checked
      ? [...localFilters.colors, color]
      : localFilters.colors.filter(c => c !== color);
    
    const newFilters = { ...localFilters, colors: updatedColors };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const updatedSizes = checked
      ? [...localFilters.sizes, size]
      : localFilters.sizes.filter(s => s !== size);
    
    const newFilters = { ...localFilters, sizes: updatedSizes };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (range: number[]) => {
    const newFilters = { ...localFilters, priceRange: [range[0], range[1]] as [number, number] };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters: FilterState = {
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: [0, maxPrice],
      rating: 0,
      inStock: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Clear All Filters */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="w-full mb-4"
          >
            Clear All Filters
          </Button>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Categories</h3>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-500 py-2">{error}</div>
            ) : categories.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">No categories available</div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map(category => (
                  <div key={category._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category._id}`}
                      checked={localFilters.categories.includes(category._id)}
                      onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category._id}`} className="text-sm capitalize">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Brands */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Brands</h3>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">Loading brands...</span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-500 py-2">{error}</div>
            ) : brands.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">No brands available</div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <div key={brand._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand._id}`}
                      checked={localFilters.brands.includes(brand._id)}
                      onCheckedChange={(checked) => handleBrandChange(brand._id, checked as boolean)}
                      />
                    <Label htmlFor={`brand-${brand._id}`} className="text-sm">
                      {brand.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Separator className="my-4" />

          {/* Price Range */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4" />
              <h3 className="font-medium">Price Range</h3>
            </div>
            <div className="space-y-4">
              <Slider
                value={localFilters.priceRange}
                min={0}
                max={Math.ceil(maxPrice)}
                step={1}
                onValueChange={handlePriceRangeChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${localFilters.priceRange[0]}</span>
                <span>${localFilters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Colors */}
          {colors.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="font-medium mb-3">Colors</h3>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={localFilters.colors.includes(color)}
                        onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                      />
                      <Label htmlFor={`color-${color}`} className="text-sm capitalize">
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="font-medium mb-3">Sizes</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={localFilters.sizes.includes(size)}
                        onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Minimum Rating</h3>
            <RadioGroup
              value={localFilters.rating.toString()}
              onValueChange={(value) => {
                const newFilters = { ...localFilters, rating: parseInt(value) };
                setLocalFilters(newFilters);
                onFiltersChange(newFilters);
              }}
            >
              {[4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="text-sm">
                    {rating}+ Stars
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="rating-0" />
                <Label htmlFor="rating-0" className="text-sm">All Ratings</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-4" />

          {/* In Stock Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={localFilters.inStock}
                onCheckedChange={(checked) => {
                  const newFilters = { ...localFilters, inStock: checked as boolean };
                  setLocalFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
              />
              <Label htmlFor="in-stock" className="text-sm">
                In Stock Only
              </Label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
