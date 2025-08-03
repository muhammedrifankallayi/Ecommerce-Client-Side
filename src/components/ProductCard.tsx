
import { Link } from 'react-router-dom';
import { Star, Shirt, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BASE_URL } from '@/services/config';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Get the default inventory (first active one with stock) if using new format
  const defaultInventory = product.inventories?.find(inv => inv.isActive && inv.stock > 0);
  
  // Calculate price based on product format
  const displayPrice = defaultInventory?.price || product.price || 0;

  // Check if product is in stock
  const hasStock = defaultInventory ? defaultInventory.stock > 0 : (product.stock ?? 0) > 0;
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Get the first product image or placeholder
  const productImage = product.images[0] || '/placeholder.svg';
  const imageUrl = productImage.startsWith('http') ? productImage : `${BASE_URL}/${productImage.replace(/^\//, '')}`;
  
  return (
    <div className="product-card group relative">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Favorite Heart Icon - appears on hover */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>
        
        {!hasStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-medium text-sm sm:text-base lg:text-lg mb-1 hover:text-shop-primary transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        
        <div className="flex items-center mt-1 mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-xs sm:text-sm font-medium">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-xs sm:text-sm text-gray-600">
            {product.reviews || 0} reviews
          </span>
        </div>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{product.description}</p>
        
        {/* Display category */}
        {product.category && (
          <div className="mb-2">
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
              {product.category.name}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base lg:text-lg">${displayPrice.toFixed(2)}</span>
            {product.brand && (
              <span className="text-xs text-gray-500">{product.brand.name}</span>
            )}
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            className="text-shop-primary border-shop-primary hover:bg-shop-primary hover:text-white text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => defaultInventory && addToCart(product._id, 1, defaultInventory._id)}
            disabled={!hasStock}
          >
            <Shirt className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
