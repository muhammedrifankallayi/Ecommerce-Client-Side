
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
  const hasStock = defaultInventory ? defaultInventory.stock > 0 : (product.totalStock ?? 0) > 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Get the first product image or placeholder
  const productImage = product?.images?.[0] || '/placeholder.svg';
  const imageUrl = productImage.startsWith('http') ? productImage : `${BASE_URL}/${productImage.replace(/^\//, '')}`;

  return (
    <div className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-50 border border-black/[0.03]">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>

        {/* Fav Action - Glass effect */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
              }`}
          />
        </button>

        {!hasStock && (
          <div className="absolute bottom-4 left-4 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            Out of Stock
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <Button
            className="w-full h-12 rounded-2xl bg-black/80 backdrop-blur-md text-white hover:bg-black transition-all font-bold tracking-tight shadow-xl"
            onClick={() => defaultInventory && addToCart(product._id, 1, defaultInventory._id)}
            disabled={!hasStock}
          >
            Quick Add
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start px-2">
        <div className="flex justify-between items-start w-full gap-4">
          <Link to={`/product/${product._id}`} className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          </Link>
          <span className="text-lg font-bold text-gray-900 tracking-tight">${displayPrice.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-[11px] font-bold text-gray-400"> {product.averageRating} </span>
          </div>
          <span className="text-[11px] font-bold text-gray-200">/</span>
          <span className="text-[11px] font-bold text-gray-400"> {product.totalReviews} REVIEWS</span>
        </div>

        {product.brand && (
          <span className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-300">{product.brand.name}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
