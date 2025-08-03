
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  filter?: string;
  sort?: string;
}

const ProductGrid = ({ products, filter, sort }: ProductGridProps) => {
  // For infinite loading, we don't need client-side sorting as it's handled server-side
  // We only keep basic filtering for backward compatibility
  const filteredProducts = filter && filter !== 'all' 
    ? products.filter(product => product.category?.name === filter)
    : products;
  
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 px-4 sm:px-0">
      {filteredProducts.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
