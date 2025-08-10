import { useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  filter?: string;
  sort?: string;
  lastProductRef?: (node: HTMLDivElement | null) => void;
}

const ProductGrid = ({ products, filter, sort, lastProductRef }: ProductGridProps) => {
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    
    // Apply filtering (kept for backward compatibility)
    if (filter && filter !== 'all') {
      result = result.filter(product => product.category?.name === filter);
    }
    
    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price-low-high':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // Sort by creation date
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popular':
          // Sort by a combination of rating and sales (simulated using stock)
          result.sort((a, b) => (b.rating * 20 + (b.totalStock > 50 ? 100 : b.totalStock)) - (a.rating * 20 + (a.totalStock > 50 ? 100 : a.totalStock)));
          break;
        case 'relevance':
        default:
          // Keep original order for relevance
          break;
      }
    }
    
    return result;
  }, [products, filter, sort]);
  
  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 px-4 sm:px-0">
      {filteredAndSortedProducts.map((product, index) => {
        // Attach ref to the last product for infinite loading
        const isLastProduct = filteredAndSortedProducts.length === index + 1;
        
        return (
          <div 
            key={product._id}
            ref={isLastProduct && lastProductRef ? lastProductRef : null}
          >
            <ProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;