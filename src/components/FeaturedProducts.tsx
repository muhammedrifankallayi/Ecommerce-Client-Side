import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { transformProducts } from '@/lib/productUtils';
import { ArrowRight, Filter, Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'formal', name: 'Formal Wear' },
    { id: 'casual', name: 'Casual' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'shoes', name: 'Footwear' }
  ];

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch featured products from API
        const featuredProducts = await productService.getFeaturedProducts();
        const transformedProducts = transformProducts(featuredProducts);
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const filteredProducts = products
    .filter(p => p.featured)
    .filter(p => activeCategory === 'all' || p.category?.name === activeCategory)
    .slice(0, 8);

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-background to-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 px-4 sm:px-0">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
            Curated Selection
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Featured <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium fashion pieces, carefully curated for the modern trendsetter
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4 sm:px-0">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'hover:scale-105 glass-card'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading featured products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id || product._id} 
                className="scale-hover"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fade-in 0.6s ease-out forwards'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center px-4 sm:px-0">
          <Button 
            className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            asChild
          >
            <Link to="/products" className="flex items-center justify-center gap-2">
              View All Products
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;