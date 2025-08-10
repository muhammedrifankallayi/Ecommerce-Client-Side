import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, Loader2 } from 'lucide-react';
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
      active:1
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
      
      
      const newProducts = response.products ? response.products : (response as any).data.products;


      if (append && page > 1) {
        // Append new products for infinite loading
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        // Replace products for new search/filter
        setProducts(newProducts);
      }
      
      // Update pagination info
      const totalCount = response.total ? response.total : (response as any).data.total;
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
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for products, brands, categories..."
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter and Sort Controls */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-2">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              
              {activeFilterCount > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <p className="text-muted-foreground text-sm">
                {products.length} products found
              </p>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-primary">
              Search results for "<strong>{searchQuery}</strong>" - {totalProducts} products found
            </p>
          </div>
        )}

        {/* Loading State (Initial Load) */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-card rounded-2xl border border-border p-12 max-w-md mx-auto shadow-sm">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => fetchProducts(1, false)} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Product Grid with Infinite Scroll */}
        
        {!loading && !error && (
          <InfiniteScroll
            dataLength={products.length}
            next={loadMoreProducts}
            hasMore={hasMore}
            loader={
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground text-sm">Loading more products...</p>
              </div>
            }
            endMessage={
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You've reached the end! No more products to load.
                </p>
              </div>
            }
            scrollThreshold={0.8}
            style={{ overflow: 'visible' }}
          >
            <ProductGrid 
              products={products} 
              sort={sort}
            />
          </InfiniteScroll>
        )}

        {/* No Results */}
        {!loading && !error && products && products?.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-card rounded-2xl border border-border p-12 max-w-md mx-auto shadow-sm">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-3">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button 
                onClick={clearAllFilters} 
                variant="outline"
              >
                Clear all filters
              </Button>
            </div>
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