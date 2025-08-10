
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ListOrdered, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderHistory } from '@/components/OrderHistory';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { BASE_URL } from '@/services/config';
import { couponService } from '@/services/couponService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CartItem } from '@/types/api';
import { authService } from '@/services';

const CartPage = () => {
  const { items, loading, error, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("cart");
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [removeCouponId, setRemoveCouponId] = useState<string | null>(null);

useEffect(()=>{
getCartDiscounts();
},[discountAmount])

  // Coupon apply handle
  const handleApplyCoupon = async () => {
    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);
    try {
      const res = await couponService.validateCoupon({
        code: couponInput.trim(),
        purchaseAmount: computedSubtotal
      });
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discountAmount);
      setCouponSuccess(`Coupon applied! You saved $${res.discountAmount}`);
    } catch (err: any) {
      setCouponError(err?.response?.data?.message || 'Invalid or expired coupon');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setCouponLoading(false);
    }
  };
  
  const handleQuantityDecrease = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      await updateQuantity(itemId, currentQuantity - 1);
    }
  };
  
  const handleQuantityIncrease = async (itemId: string, currentQuantity: number, maxStock: number) => {
    if (currentQuantity < maxStock) {
      await updateQuantity(itemId, currentQuantity + 1);
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Calculate cart summary
  const cartSummary = {
    totalItems: items.reduce((sum, item) => sum + (item?.quantity || 0), 0),
    subtotal: items.reduce((sum, item) => sum + ((item?.inventoryId?.price || 0) * (item?.quantity || 0)), 0),
    itemCount: items.length
  };

  const getCartDiscounts = async () => {
    try {
      const userResponse = await authService.getUserProfile();
      const activeCoupon = (userResponse as any)?.discountCoupons.find(c => c.status === 'active' && c.couponId);
      console.log(userResponse,"ACTIVE COUPON");
      
      
      if (activeCoupon?.couponId) {
        try {
          const couponResponse = await couponService.getCouponById(activeCoupon.couponId);
          if (couponResponse) {
            const coupon = couponResponse;
            let calculatedDiscount = 0;
            
            if (coupon.discountType === 'percentage') {
              calculatedDiscount = (cartSummary.subtotal * coupon.discountValue) / 100;
            } else {
              calculatedDiscount = coupon.discountValue;
            }
            
            setDiscountAmount(calculatedDiscount);
            setAppliedCoupon(coupon);
            setCouponSuccess(`Coupon applied! You saved $${calculatedDiscount.toFixed(2)}`);
          }
        } catch (err) {
          console.error('Error fetching coupon:', err);
          setCouponError('Failed to apply coupon');
          setDiscountAmount(0);
          setAppliedCoupon(null);
        }
      } else {
        setDiscountAmount(0);
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setCouponError('Failed to fetch user coupons');
      setDiscountAmount(0);
      setAppliedCoupon(null);
    }
  }

  // Helper to compute image URL for a cart item
  const getCartItemImageUrl = (item: CartItem) => {
    let imageUrl = item.inventoryId?.productId?.images?.[0] || '/placeholder.svg';
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = BASE_URL.replace(/\/$/, '') + '/' + imageUrl.replace(/^\//, '');
    }
    return imageUrl;
  };


  const hadleCoupenRemove = async (couponId: string) => {
          
    try {
      

     await couponService.removeAppliedCoupon(couponId).then((res:any)=>{
                if(res.success){
                  setAppliedCoupon(null);
                  setDiscountAmount(0);
                  setCouponInput("");
                  setCouponSuccess("Coupon removed successfully");
                }
     });
      
    } catch (error) {
      console.error('Error removing coupon:', error);
      setCouponError('Failed to remove coupon');
      
    }


  }

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-3xl font-bold mb-4">Sign in to view your cart</h1>
          <p className="text-muted-foreground mb-8">Please log in to access your shopping cart and saved items.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && !items.length) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Compute totals
  const computedSubtotal = cartSummary.subtotal;
  const shipping = computedSubtotal > 50 ? 0 : 5.99;
  const total = computedSubtotal + shipping - discountAmount;
  
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      <Tabs defaultValue="cart" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
          <TabsTrigger value="cart" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Shopping </span>Cart
            {cartSummary && (
              <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {cartSummary.itemCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <ListOrdered className="h-3 w-3 sm:h-4 sm:w-4" />
            My Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cart">
          {items.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <div className="max-w-md mx-auto px-4">
                <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-primary" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Your cart is empty</h1>
                <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">Looks like you haven't added any products to your cart yet.</p>
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-8">
                <Card className="p-3 sm:p-6">
                  <div className="hidden md:grid md:grid-cols-12 text-sm font-medium text-gray-500 mb-4">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  
                  <ScrollArea className="h-[calc(100vh-300px)] sm:h-[calc(100vh-400px)] pr-2 sm:pr-4">
                    <div className="space-y-4 sm:space-y-6">
                      {items.filter(item => item && item._id).map((item) => (
                        <div key={item._id}>
                            {/* Mobile Layout */}
                            <div className="block md:hidden">
                              <div className="flex gap-3 sm:gap-4">
                                <Link to={`/product/${item?.inventoryId?.productId?._id}`} className="shrink-0">
                                  <img 
                                    src={getCartItemImageUrl(item)} 
                                    alt={item?.inventoryId?.productId?.name || 'Product'} 
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                                  />
                                </Link>
                                <div className="flex-1 min-w-0">
                                  <Link to={`/product/${item?.inventoryId?.productId?._id}`} className="font-medium hover:text-primary text-sm sm:text-base line-clamp-2">
                                    {item?.inventoryId?.productId?.name || 'Unnamed Product'}
                                  </Link>
                                  <p className="text-xs sm:text-sm text-muted-foreground capitalize mb-2">
                                    {item?.inventoryId?.productId?.category?.name || 'Uncategorized'}
                                  </p>
                                  
                                  {/* Variant Combinations */}
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {item?.inventoryId?.variantCombination?.map((combo) => (
                                      <Badge key={combo?.variantId?._id} variant="secondary" className="text-xs">
                                        {combo?.variantId?.name}: {combo?.value}
                                      </Badge>
                                    )) || null}
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <button 
                                        className="w-7 h-7 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-50"
                                        onClick={() => handleQuantityDecrease(item._id, item.quantity)}
                                        disabled={loading || !item?.quantity || item.quantity <= 1}
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <span className="w-8 text-center text-sm font-medium">{item?.quantity || 0}</span>
                                      <button 
                                        className="w-7 h-7 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-50"
                                        onClick={() => handleQuantityIncrease(item._id, item.quantity, item?.inventoryId?.stock || 0)}
                                        disabled={loading || !item?.inventoryId?.stock || item.quantity >= item.inventoryId.stock}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-muted-foreground">${item?.inventoryId?.price?.toFixed(2) || '0.00'} each</div>
                                      <div className="font-semibold text-sm">${((item?.inventoryId?.price || 0) * (item?.quantity || 0)).toFixed(2)}</div>
                                    </div>
                                  </div>
                                  
                                  <button 
                                    className="text-xs text-destructive flex items-center mt-2 hover:text-destructive/80 disabled:opacity-50"
                                    onClick={() => removeItem(item._id)}
                                    disabled={loading}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                              <div className="col-span-6 flex items-center space-x-4">
                                <Link to={`/product/${item?.inventoryId?.productId?._id}`} className="shrink-0">
                                  <img 
                                    src={getCartItemImageUrl(item)} 
                                    alt={item?.inventoryId?.productId?.name || 'Product'} 
                                    className="w-20 h-20 object-cover rounded-md"
                                  />
                                </Link>
                                <div>
                                  <Link to={`/product/${item?.inventoryId?.productId?._id}`} className="font-medium hover:text-primary">
                                    {item?.inventoryId?.productId?.name || 'Unnamed Product'}
                                  </Link>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {item?.inventoryId?.productId?.category?.name || 'Uncategorized'}
                                  </p>
                                  
                                  {/* Variant Combinations */}
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item?.inventoryId?.variantCombination?.map((combo) => (
                                      <Badge key={combo?.variantId?._id} variant="secondary" className="text-xs">
                                        {combo?.variantId?.name}: {combo?.value}
                                      </Badge>
                                    )) || null}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-span-2 text-center">
                                <div>${item?.inventoryId?.price?.toFixed(2) || '0.00'}</div>
                              </div>
                              
                              <div className="col-span-2 text-center">
                                <div className="flex items-center justify-center max-w-[120px] mx-auto">
                                  <button 
                                    className="w-8 h-8 rounded-l-md border flex items-center justify-center hover:bg-accent disabled:opacity-50"
                                    onClick={() => handleQuantityDecrease(item._id, item.quantity)}
                                    disabled={loading || !item?.quantity || item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <div className="w-10 h-8 border-t border-b flex items-center justify-center">
                                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : item?.quantity || 0}
                                  </div>
                                  <button 
                                    className="w-8 h-8 rounded-r-md border flex items-center justify-center hover:bg-accent disabled:opacity-50"
                                    onClick={() => handleQuantityIncrease(item._id, item.quantity, item?.inventoryId?.stock || 0)}
                                    disabled={loading || !item?.inventoryId?.stock || item.quantity >= item.inventoryId.stock}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                {item?.inventoryId?.stock < 5 && (
                                  <p className="text-xs text-warning mt-1">Only {item.inventoryId.stock} left!</p>
                                )}
                              </div>
                              
                              <div className="col-span-2 flex justify-end items-center gap-4">
                                <div className="font-medium">${((item?.inventoryId?.price || 0) * (item?.quantity || 0)).toFixed(2)}</div>
                                <button 
                                  className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                                  onClick={() => removeItem(item._id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            
                            <Separator className="mt-4 sm:mt-6" />
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-4 sm:mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <Link to="/products">
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Continue Shopping
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      onClick={clearCart}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                </Card>
              </div>
              
              <div className="lg:col-span-4">
                <Card className="lg:sticky lg:top-24">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                    <CardDescription className="text-sm">Review your order details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-muted-foreground">Subtotal ({cartSummary.itemCount} items)</span>
                      <span className="font-medium">${computedSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-base sm:text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                      <div className="flex flex-col gap-2">
                        {appliedCoupon ? (
                          <div className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium text-green-600">{appliedCoupon.code}</div>
                                <div className="text-xs">
                                  Discount applied: <span className="font-bold text-green-600">-${discountAmount.toFixed(2)}</span>
                                </div>
                              </div>
                              <AlertDialog open={removeCouponId === appliedCoupon._id}>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setRemoveCouponId(appliedCoupon._id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Coupon</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove this coupon? This will affect your total order amount.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setRemoveCouponId(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => {
                                        if (removeCouponId) {
                                          hadleCoupenRemove(removeCouponId);
                                          setRemoveCouponId(null);
                                        }
                                      }}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input 
                              placeholder="Enter coupon code" 
                              className="flex-1 text-sm"
                              value={couponInput}
                              onChange={e => setCouponInput(e.target.value)}
                              disabled={couponLoading}
                            />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="sm:px-4"
                              onClick={handleApplyCoupon}
                              disabled={couponLoading || !couponInput.trim()}
                            >
                              {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                            </Button>
                          </div>
                        )}
                        
                        {couponSuccess && !appliedCoupon && (
                          <div className="text-green-600 text-xs font-semibold bg-green-50 p-2 rounded-md">{couponSuccess}</div>
                        )}
                        {couponError && (
                          <div className="text-red-600 text-xs font-medium">{couponError}</div>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={handleCheckout}
                        size="lg"
                        disabled={loading || items.length === 0}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Proceed to Checkout'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start text-xs sm:text-sm text-muted-foreground space-y-1">
                    <p>• Free shipping on orders over $50</p>
                    <p>• 30-day easy returns</p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CartPage;
