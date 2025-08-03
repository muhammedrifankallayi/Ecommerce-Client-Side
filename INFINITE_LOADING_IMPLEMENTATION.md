# Infinite Loading Implementation

This document describes the infinite loading implementation for the product listing page.

## Overview

The infinite loading feature allows users to continuously scroll through products without traditional pagination. As the user scrolls near the bottom of the page, new products are automatically loaded and appended to the existing list.

## Components

### 1. useInfiniteScroll Hook (`src/hooks/useInfiniteScroll.ts`)

A custom React hook that handles the intersection observer logic for detecting when the user scrolls near the bottom of the page.

**Features:**
- Uses Intersection Observer API for efficient scroll detection
- Configurable threshold for when to trigger loading
- Prevents multiple simultaneous loading requests
- Automatically cleans up observers on unmount

**Usage:**
```typescript
const loadingRef = useInfiniteScroll({
  onLoadMore: loadMoreProducts,
  hasMore: hasMoreProducts,
  loading: isLoadingMore,
  threshold: 200 // pixels from bottom
});
```

### 2. Updated ProductsPage (`src/pages/ProductsPage.tsx`)

The main product listing page has been updated to support infinite loading.

**Key Changes:**
- Added `loadingMore` state for tracking additional loading
- Added `hasMore` state to track if more products are available
- Modified `fetchProducts` to support appending new products
- Replaced pagination with infinite scroll loading indicator
- Added end-of-results indicator

**API Integration:**
- Sends queries with product GET URL parameters
- Supports all existing filters (search, category, brand, price, etc.)
- Maintains sorting functionality
- Handles server-side pagination with `page` and `limit` parameters

### 3. Updated ProductGrid (`src/components/ProductGrid.tsx`)

Simplified to focus on rendering products without client-side sorting (now handled server-side).

## API Endpoints

The implementation uses the existing product service endpoints:

- **Public endpoint**: `/api/public/products`
- **Authenticated endpoint**: `/api/products`

**Query Parameters:**
- `page`: Current page number
- `limit`: Number of products per page (default: 12)
- `search`: Search query
- `category`: Category filter
- `brand`: Brand filter
- `minPrice`/`maxPrice`: Price range filter
- `inStock`: Stock availability filter
- `sort`: Sorting options (price, -price, -createdAt, -rating)

## User Experience

### Loading States
1. **Initial Loading**: Shows spinner and "Loading products..." message
2. **Infinite Scroll Loading**: Shows "Loading more products..." with spinner at bottom
3. **End of Results**: Shows "You've reached the end of the results" message

### Error Handling
- Network errors show retry button
- Maintains existing products if additional loading fails
- Graceful degradation to traditional pagination if needed

### Performance Optimizations
- Uses Intersection Observer for efficient scroll detection
- Prevents duplicate API calls during loading
- Server-side sorting reduces client-side processing
- Configurable threshold prevents premature loading

## Implementation Details

### State Management
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
```

### Product Loading Logic
```typescript
const fetchProducts = async (page: number = 1, append: boolean = false) => {
  // ... API call logic ...
  
  if (append) {
    setProducts(prev => [...prev, ...newProducts]);
  } else {
    setProducts(newProducts);
  }
  
  setHasMore(response.page < response.pages);
};
```

### Infinite Scroll Trigger
```typescript
const loadMoreProducts = useCallback(() => {
  if (hasMore && !loadingMore && !loading) {
    fetchProducts(currentPage + 1, true);
  }
}, [hasMore, loadingMore, loading, currentPage]);
```

## Browser Compatibility

- **Modern Browsers**: Full support with Intersection Observer API
- **Older Browsers**: Falls back to traditional pagination
- **Mobile**: Optimized for touch scrolling

## Testing

The implementation includes unit tests for the `useInfiniteScroll` hook to ensure:
- Intersection Observer is properly created
- Loading states prevent duplicate calls
- Callback is triggered when conditions are met

## Future Enhancements

Potential improvements for the infinite loading feature:

1. **Virtual Scrolling**: For very large product lists
2. **Prefetching**: Load next page before user reaches bottom
3. **Caching**: Cache loaded products for better performance
4. **Search Highlighting**: Highlight search terms in product names
5. **Lazy Loading Images**: Optimize image loading for better performance

## Usage Example

```typescript
// In a component
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const loadMore = useCallback(() => {
    // Load more products logic
  }, []);
  
  const loadingRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading: loadingMore,
    threshold: 200
  });
  
  return (
    <div>
      <ProductGrid products={products} />
      <div ref={loadingRef}>
        {loadingMore && <LoadingSpinner />}
      </div>
    </div>
  );
};
```