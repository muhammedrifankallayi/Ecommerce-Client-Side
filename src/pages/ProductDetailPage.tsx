
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Inventory, VariantCombination } from '@/types';
import { Review } from '@/services/reviewService';
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, Loader2, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import ReviewSection from '@/components/ReviewSection';
import ReviewModal, { ReviewData } from '@/components/ReviewModal';
import { productService, ProductWithInventory } from '@/services/productService';
import { reviewService } from '@/services/reviewService';
import { transformProduct, getProductImage } from '@/lib/productUtils';
import { useAuth } from '@/contexts/AuthContext';
import { BASE_URL } from '@/services/config';

// Helper function to get unique variant types and values
const getUniqueVariants = (inventories: Inventory[]) => {
  const variantMap = new Map<string, Set<string>>();
  
  inventories.forEach(inventory => {
    inventory.variantCombination.forEach(combo => {
      const type = combo.variantId.name;
      if (!variantMap.has(type)) {
        variantMap.set(type, new Set());
      }
      variantMap.get(type)?.add(combo.value);
    });
  });
  
  return Array.from(variantMap.entries()).map(([type, values]) => ({
    type,
    values: Array.from(values)
  }));
};

// Helper function to find matching inventory
const findMatchingInventory = (inventories: Inventory[], selectedVariants: Record<string, string>) => {
  return inventories.find(inventory => {
    return inventory.variantCombination.every(combo => 
      selectedVariants[combo.variantId.name] === combo.value
    );
  });
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<ProductWithInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviewPagination, setReviewPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [availableVariants, setAvailableVariants] = useState<Array<{type: string, values: string[]}>>([]);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  
  const { isAuthenticated } = useAuth();
  
  // Helper function to get full image URL
  const getFullImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };
  
  // Product images for gallery
  const productImages = product?.images?.map(getFullImageUrl) || [];

  // Group variants by type
  const variantTypes = product?.inventories?.reduce((acc: Record<string, Set<string>>, inv) => {
    inv.variantCombination.forEach(combo => {
      const type = combo.variantId.type;
      if (!acc[type]) {
        acc[type] = new Set();
      }
      acc[type].add(combo.value);
    });
    return acc;
  }, {}) || {};

  // Find matching inventory based on selected variants
  useEffect(() => {
    if (!product?.inventories) return;

    const matchingInventory = product.inventories.find(inv => {
      return inv.variantCombination.every(combo => 
        selectedVariants[combo.variantId.type] === combo.value
      );
    });

    setSelectedInventory(matchingInventory || null);
  }, [selectedVariants, product]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate('/products');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch product by ID
        const productData = await productService.getProductById(id);
        if (!productData) throw new Error('Product not found');
        
        // Get unique variants from inventories
        const variants = getUniqueVariants(productData.inventories || []);
        setAvailableVariants(variants);
        
        // Initialize with first available option for each variant type
        const initialVariants: Record<string, string> = {};
        variants.forEach(variant => {
          if (variant.values.length > 0) {
            initialVariants[variant.type] = variant.values[0];
          }
        });
        setSelectedVariants(initialVariants);
        
        setProduct(productData);
        
        // Fetch related products (same category)
        if (productData.category?._id) {
          const relatedProducts = await productService.getProducts({
            category: productData.category._id,
            limit: 4
          });
          setRelatedProducts(relatedProducts.products.filter(p => p._id !== id));
        }

        // Fetch reviews for the product
        await fetchReviews();
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Update selected inventory when variants change
  useEffect(() => {
    if (!product?.inventories) return;
    const matchingInventory = findMatchingInventory(product.inventories, selectedVariants);
    setSelectedInventory(matchingInventory || null);
  }, [selectedVariants, product]);

  const increaseQuantity = () => {
    if (selectedInventory && quantity < selectedInventory.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = async () => {
    if (product && selectedInventory) {
      await addToCart(product._id, quantity, selectedInventory._id);
    }
  };

  // Fetch reviews for the product (with pagination)
  const fetchReviews = async (page = 1) => {
    if (!id) return;
    try {
      setReviewsLoading(true);
      const response = await reviewService.getProductReviews(id, page, 10, '-createdAt');
      if (response && response.success && response.data) {
        setReviews(response.data.reviews || []);
        setReviewStats(response.data.stats || { averageRating: 0, totalReviews: 0 });
        setReviewPagination(response.data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
      } else {
        setReviews([]);
        setReviewStats({ averageRating: 0, totalReviews: 0 });
        setReviewPagination({ page: 1, limit: 10, total: 0, pages: 1 });
      }
    } catch (err) {
      setReviews([]);
      setReviewStats({ averageRating: 0, totalReviews: 0 });
      setReviewPagination({ page: 1, limit: 10, total: 0, pages: 1 });
    } finally {
      setReviewsLoading(false);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (reviewData: ReviewData) => {
    if (!id || !product?.companyId) throw new Error('Product or company ID not found');
    await reviewService.createReview({
      productId: id,
      companyId: product.companyId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      images: reviewData.images,
    });
    await fetchReviews(reviewPagination.page); // Re-fetch reviews after submitting
  };

  // Add pagination controls for reviews
  const handleReviewPageChange = (newPage: number) => {
    fetchReviews(newPage);
  };

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded"></div>
            <div className="w-full md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{error ? 'Error Loading Product' : 'Product Not Found'}</h1>
        <p className="mb-6">{error || "Sorry, the product you're looking for doesn't exist."}</p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
            <img 
              src={productImages[selectedImage]} 
              alt={product?.name} 
              className="w-full h-96 object-contain"
            />
          </div>
          
          <div className="flex gap-2">
            {productImages.map((img, index) => (
              <button
                key={index}
                className={`border-2 rounded-md overflow-hidden w-20 h-20 ${selectedImage === index ? 'border-shop-primary' : 'border-gray-200'}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={img}
                  alt={`${product?.name} thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* Reviews section */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(reviewStats.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-gray-600">
                {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews} reviews)
              </span>
            </div>
          </div>
          
          {/* Price */}
          <p className="text-2xl font-semibold mb-6">
            ${selectedInventory ? selectedInventory.price.toFixed(2) : product.price?.toFixed(2)}
          </p>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Variant Selection */}
          {availableVariants.map(variant => (
            <div key={variant.type} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {variant.type}
              </label>
              <div className="flex flex-wrap gap-2">
                {variant.values.map(value => {
                  const isSelected = selectedVariants[variant.type] === value;
                  const matchingInventory = product.inventories?.find(inv => 
                    inv.variantCombination.some(combo => 
                      combo.variantId.name === variant.type && combo.value === value
                    )
                  );
                  const isAvailable = matchingInventory && matchingInventory.stock > 0;
                  
                  return (
                    <Badge
                      key={value}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer ${!isAvailable ? 'opacity-50' : ''} ${isSelected ? 'bg-shop-primary' : ''}`}
                      onClick={() => isAvailable && handleVariantSelect(variant.type, value)}
                    >
                      {value}
                      {isSelected && <Check className="ml-1 h-3 w-3" />}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Stock Status */}
          {selectedInventory && (
            <p className="text-sm mb-4">
              {selectedInventory.stock > 0 ? (
                <span className="text-green-600">
                  In Stock ({selectedInventory.stock} available)
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          )}
          
          {/* Quantity Selection */}
          <div className="mb-6">
            <div className="font-medium mb-2">Quantity</div>
            <div className="flex items-center">
              <button 
                className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                {quantity}
              </div>
              <button 
                className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center"
                onClick={increaseQuantity}
                disabled={!selectedInventory || quantity >= selectedInventory.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              className="bg-shop-primary hover:bg-shop-secondary text-white flex-grow"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedInventory || selectedInventory.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {!selectedInventory ? 'Select options' : 
               selectedInventory.stock === 0 ? 'Out of Stock' : 
               'Add to Cart'}
            </Button>
            
            <Button variant="outline" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Product Details Tabs */}
          <div className="border-t border-gray-200 pt-6">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <p className="text-gray-600">{product.description}</p>
              </TabsContent>
              <TabsContent value="specifications" className="pt-4">
                <ul className="space-y-2 text-gray-600">
                  <li><span className="font-medium">Category:</span> {product.category?.name || 'Uncategorized'}</li>
                  <li><span className="font-medium">Brand:</span> {product.brand?.name || 'Generic'}</li>
                  {selectedInventory && (
                    <li><span className="font-medium">SKU:</span> {selectedInventory.sku}</li>
                  )}
                </ul>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <p className="text-gray-600">
                  We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {isAuthenticated && (
            <Button onClick={() => setIsReviewModalOpen(true)}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Write a Review
            </Button>
          )}
        </div>
        
        <ReviewSection
          productId={product._id}
          reviews={reviews}
          loading={reviewsLoading}
          pagination={reviewPagination}
          onPageChange={handleReviewPageChange}
        />
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={{
                  ...product,
                  images: product.images.map(getFullImageUrl)
                }} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={id || ''}
        productName={product.name}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default ProductDetailPage;
