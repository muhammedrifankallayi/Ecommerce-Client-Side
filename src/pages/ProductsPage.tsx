import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, Loader2, X, ListFilter } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProductGrid from '@/components/ProductGrid';
import SearchBar from '@/components/SearchBar';
import FilterSidebar, { FilterState } from '@/components/FilterSidebar';
import { productService, ProductsResponse } from '@/services/productService';
import { Product } from '@/types';
import { ProductFilters } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sort, setSort] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const maxPrice = 1000; // Default max price, will be updated when products load

  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, maxPrice],
    rating: 0,
    inStock: false
  });

  // Build API filters object
  const buildApiFilters = useCallback((page: number): ProductFilters => {
    const apiFilters: ProductFilters = {
      page,
      size: 12, // Products per page,
      active: 1
    };

    // Add search query
    if (searchQuery.trim()) {
      apiFilters.search = searchQuery.trim();
    }

    // Add category filter
    if (filters.categories.length > 0) {
      apiFilters.category = filters.categories[0];
    }

    // Add brand filter
    if (filters.brands.length > 0) {
      apiFilters.brand = filters.brands[0];
    }

    // Add price range filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) {
      apiFilters.minPrice = filters.priceRange[0];
      apiFilters.maxPrice = filters.priceRange[1];
    }

    // Add color filter
    if (filters.colors.length > 0) {
      (apiFilters as any).colors = filters.colors;
    }

    // Add size filter
    if (filters.sizes.length > 0) {
      (apiFilters as any).sizes = filters.sizes;
    }

    // Add rating filter
    if (filters.rating > 0) {
      (apiFilters as any).rating = filters.rating;
    }

    // Add stock filter
    if (filters.inStock) {
      apiFilters.inStock = true;
    }

    // Add sorting
    if (sort) {
      switch (sort) {
        case 'price-low-high':
          apiFilters.sort = 'price';
          break;
        case 'price-high-low':
          apiFilters.sort = '-price';
          break;
        case 'newest':
          apiFilters.sort = '-createdAt';
          break;
        case 'rating':
          apiFilters.sort = '-rating';
          break;
        default:
          break;
      }
    }

    return apiFilters;
  }, [searchQuery, filters, sort, maxPrice]);

  // Fetch products from API
  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      }
      setError(null);

      const apiFilters = buildApiFilters(page);
      const response = await productService.getProducts(apiFilters);


      const newProducts = response.products || response.data?.products || [];


      if (append && page > 1) {
        // Append new products for infinite loading
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        // Replace products for new search/filter
        setProducts(newProducts);
      }

      // Update pagination info
      const totalCount = response.total ?? response.data?.total ?? 0;
      setTotalProducts(totalCount);
      setCurrentPage(page);

      // Check if there are more products to load
      const totalPages = Math.ceil(totalCount / 12);
      setHasMore(page < totalPages);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Load more products for infinite scroll
  const loadMoreProducts = () => {
    if (hasMore && !loading) {
      fetchProducts(currentPage + 1, true);
    }
  };

  // Reset to first page when filters, search, or sort changes
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, false);
  }, [searchQuery, filters, sort]);

  // Update URL params based on search and filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (filters.categories.length > 0) {
      params.set('category', filters.categories[0]); // This will be the category ID
    }
    if (filters.brands.length > 0) {
      params.set('brand', filters.brands[0]); // This will be the brand ID
    }
    setSearchParams(params);
  }, [searchQuery, filters.categories, filters.brands, setSearchParams]);



  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: [0, maxPrice],
      rating: 0,
      inStock: false
    });
    setSearchQuery('');
  };

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      {/* Apple-style Integrated Header - Sticky on scroll */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-[72px] z-40 border-b border-black/[0.05] transition-all duration-500">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="space-y-1 text-center lg:text-left">
              <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight">Collection</h1>
              <p className="text-gray-400 font-bold text-[10px] tracking-[0.2em] uppercase">
                {totalProducts} Curated Pieces
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Search Bar Integrated */}
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search pieces..."
                className="w-full md:w-[320px]"
              />

              <div className="flex items-center p-1.5 bg-black/[0.03] rounded-[24px] border border-black/[0.02] shadow-sm">
                <Button
                  onClick={() => setIsFilterOpen(true)}
                  variant="ghost"
                  className="flex items-center gap-2 h-11 px-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-700 font-bold text-sm text-gray-400 hover:text-black"
                >
                  <ListFilter className="h-4 w-4" />
                  Parameters
                  {activeFilterCount > 0 && (
                    <span className="bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1 font-black animate-in zoom-in duration-300">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                <div className="w-px h-6 bg-black/10 mx-2"></div>

                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="h-11 w-auto border-none bg-transparent shadow-none focus:ring-0 gap-2 px-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-700 font-bold text-sm text-gray-400 hover:text-black">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/5 shadow-2xl bg-white/80 backdrop-blur-2xl">
                    <SelectItem value="relevance" className="rounded-xl font-bold text-xs uppercase tracking-widest">Relevance</SelectItem>
                    <SelectItem value="newest" className="rounded-xl font-bold text-xs uppercase tracking-widest">Arrivals</SelectItem>
                    <SelectItem value="price-low-high" className="rounded-xl font-bold text-xs uppercase tracking-widest">Pricing Low</SelectItem>
                    <SelectItem value="price-high-low" className="rounded-xl font-bold text-xs uppercase tracking-widest">Pricing High</SelectItem>
                    <SelectItem value="rating" className="rounded-xl font-bold text-xs uppercase tracking-widest">Ratings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-24">
        {/* Subtle Search Badge */}
        {searchQuery && (
          <div className="mb-12 inline-flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-black/[0.03] shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
            <span className="text-sm text-gray-400 uppercase tracking-widest font-bold">Inquiry</span>
            <span className="font-semibold text-gray-900 tracking-tight">"{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-black/5 hover:bg-black hover:text-white transition-all ml-4"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Loading - Minimal Progress */}
        {loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-12 h-1 overflow-hidden bg-black/5 rounded-full">
              <div className="h-full bg-primary w-1/2 animate-[shimmer_1.5s_infinite] rounded-full"></div>
            </div>
            <p className="text-black/30 font-bold text-xs tracking-[0.2em] uppercase">Curating</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-24 animate-in fade-in duration-700">
            <div className="max-w-xs mx-auto space-y-6">
              <p className="text-red-500 font-bold tracking-tight">{error}</p>
              <Button
                onClick={() => fetchProducts(1, false)}
                variant="outline"
                className="rounded-full px-12 h-14 border-black/5 bg-white shadow-sm hover:shadow-xl transition-all font-bold"
              >
                Reconnect
              </Button>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        {!loading && !error && products.length > 0 && (
          <InfiniteScroll
            dataLength={products.length}
            next={loadMoreProducts}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-24">
                <div className="h-10 w-10 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin"></div>
              </div>
            }
            endMessage={
              <div className="text-center py-32 space-y-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-black/10 to-transparent mx-auto"></div>
                <p className="text-gray-300 text-sm font-medium tracking-wide">You've reached the end of this selection</p>
              </div>
            }
            scrollThreshold={0.9}
            style={{ overflow: 'visible' }}
          >
            <ProductGrid
              products={products}
              sort={sort}
            />
          </InfiniteScroll>
        )}

        {/* No Results - Apple Zero State */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in duration-1000">
            <div className="mb-10 text-gray-200">
              <Search className="h-24 w-24 stroke-[1.2]" />
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">No results</h3>
            <p className="text-gray-400 mb-12 max-w-sm mx-auto font-medium text-lg leading-relaxed">
              We couldn't find any products in our current collection matching your filters.
            </p>
            <Button
              onClick={clearAllFilters}
              className="h-16 px-14 rounded-2xl bg-black text-white hover:bg-black/90 transition-all shadow-2xl font-bold text-lg tracking-tight"
            >
              Refresh Collection
            </Button>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
      />
    </div>
  );
};

export default ProductsPage;