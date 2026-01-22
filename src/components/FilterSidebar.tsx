
import { useState, useEffect } from 'react';
import { X, ListFilter, DollarSign, Loader2, Star } from 'lucide-react';
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

import { variantService } from '@/services/variantService';

const FilterSidebar = ({ isOpen, onClose, onFiltersChange, currentFilters }: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const maxPrice = 10000; // Updated max price limit

  // Fetch categories, brands and variants from API
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories, brands and variants in parallel
        const [categoriesData, brandsData, variantsData] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands(),
          variantService.getVariants({ limit: 100 })
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);

        // Extract colors and sizes from variants
        if (variantsData.success && variantsData.data?.data) {
          const allVariants = variantsData.data.data;

          const colorVariant = allVariants.find(v => v.type.toLowerCase() === 'color' || v.name.toLowerCase() === 'color');
          if (colorVariant && (colorVariant as any).values) {
            setColors((colorVariant as any).values);
          }

          const sizeVariant = allVariants.find(v => v.type.toLowerCase() === 'size' || v.name.toLowerCase() === 'size');
          if (sizeVariant && (sizeVariant as any).values) {
            setSizes((sizeVariant as any).values);
          }
        }
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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Sidebar - Enhanced minimalist glass design */}
      <div className={`fixed top-0 right-0 h-full w-[380px] bg-white/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-y-auto border-l border-black/[0.03] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10">
          {/* Header - Minimalist */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black text-white rounded-xl shadow-lg -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <ListFilter className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Filters</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-black/5">
              <X className="h-6 w-6 text-gray-400" />
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
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 mb-6">Categories</h3>
            {loading ? (
              <div className="flex items-center gap-3 py-4 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Assembling...</span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-400 py-2">{error}</div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(category => (
                  <div key={category._id} className="group flex items-center justify-between">
                    <Label
                      htmlFor={`category-${category._id}`}
                      className="text-base font-medium text-gray-700 cursor-pointer group-hover:text-black transition-colors"
                    >
                      {category.name}
                    </Label>
                    <Checkbox
                      id={`category-${category._id}`}
                      checked={localFilters.categories.includes(category._id)}
                      onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
                      className="h-5 w-5 rounded-md border-black/10 data-[state=checked]:bg-black data-[state=checked]:border-black transition-all"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Brands */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 mb-6">Brands</h3>
            {loading ? (
              <div className="flex items-center gap-3 py-4 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Loading brands...</span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-400 py-2">{error}</div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {brands.map(brand => (
                  <div key={brand._id} className="group flex items-center justify-between">
                    <Label
                      htmlFor={`brand-${brand._id}`}
                      className="text-base font-medium text-gray-700 cursor-pointer group-hover:text-black transition-colors"
                    >
                      {brand.name}
                    </Label>
                    <Checkbox
                      id={`brand-${brand._id}`}
                      checked={localFilters.brands.includes(brand._id)}
                      onCheckedChange={(checked) => handleBrandChange(brand._id, checked as boolean)}
                      className="h-5 w-5 rounded-md border-black/10 data-[state=checked]:bg-black data-[state=checked]:border-black transition-all"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 mb-6">Price Range</h3>
            <div className="space-y-6 px-1">
              <Slider
                value={localFilters.priceRange}
                min={0}
                max={Math.ceil(maxPrice)}
                step={1}
                onValueChange={handlePriceRangeChange}
                className="w-full h-1"
              />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-300">Minimum</span>
                  <span className="text-xl font-bold tracking-tight text-gray-900">${localFilters.priceRange[0]}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-gray-300">Maximum</span>
                  <span className="text-xl font-bold tracking-tight text-gray-900">${localFilters.priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 mb-6">Palette</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => {
                  const isChecked = localFilters.colors.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color, !isChecked)}
                      className={`h-10 px-4 rounded-xl text-sm font-medium border transition-all duration-300 ${isChecked
                        ? 'bg-black text-white border-black shadow-lg shadow-black/20'
                        : 'bg-white text-gray-600 border-black/5 hover:border-black/20'
                        }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 mb-6">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(size => {
                  const isChecked = localFilters.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size, !isChecked)}
                      className={`h-12 rounded-xl text-xs font-bold transition-all duration-300 border ${isChecked
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-400 border-black/5 hover:border-black/20'
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[600ms]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 mb-6">Review</h3>
            <RadioGroup
              value={localFilters.rating.toString()}
              onValueChange={(value) => {
                const newFilters = { ...localFilters, rating: parseInt(value) };
                setLocalFilters(newFilters);
                onFiltersChange(newFilters);
              }}
              className="gap-3"
            >
              {[4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center justify-between group cursor-pointer">
                  <Label htmlFor={`rating-${rating}`} className="text-base font-medium text-gray-700 cursor-pointer group-hover:text-black">
                    {rating}+ Stars
                  </Label>
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="border-black/10 text-black" />
                </div>
              ))}
              <div className="flex items-center justify-between group cursor-pointer">
                <Label htmlFor="rating-0" className="text-base font-medium text-gray-700 cursor-pointer group-hover:text-black">All Ratings</Label>
                <RadioGroupItem value="0" id="rating-0" className="border-black/10 text-black" />
              </div>
            </RadioGroup>
          </div>

          {/* In Stock */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[700ms]">
            <div className="flex items-center justify-between p-6 bg-black/[0.02] rounded-3xl border border-black/[0.03]">
              <div className="space-y-0.5">
                <Label htmlFor="in-stock" className="text-base font-bold text-gray-900">Availability</Label>
                <p className="text-xs font-medium text-gray-400 text-nowrap">Show in-stock only</p>
              </div>
              <Checkbox
                id="in-stock"
                checked={localFilters.inStock}
                onCheckedChange={(checked) => {
                  const newFilters = { ...localFilters, inStock: checked as boolean };
                  setLocalFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
                className="h-6 w-6 rounded-full border-black/10 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
