
import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '@/services/cartService';
import { productService } from '@/services/productService';
import { CartItem } from '@/types/api';
import { useAuth } from './AuthContext';
import { toast } from "@/components/ui/use-toast";

interface CartSummary {
  itemCount: number;
  totalAmount: number;
}

// Define the shape of the API responses
interface CartApiResponse {
  success: boolean;
  data?: {
    items: CartItem[];
  };
  message?: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  cartSummary: CartSummary;
  addToCart: (productId: string, quantity: number, inventoryId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartSummary = {
    itemCount: items.reduce((total, item) => total + (item.quantity || 0), 0),
    totalAmount: items.reduce((total, item) => total + ((item.quantity || 0) * (item.inventoryId?.price || 0)), 0)
  };

  // Helper for Guest Cart
  const getGuestItems = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('guest_cart');
    return saved ? JSON.parse(saved) : [];
  };

  const setGuestItems = (newItems: CartItem[]) => {
    localStorage.setItem('guest_cart', JSON.stringify(newItems));
    setItems(newItems);
  };

  // Fetch cart items or load from guest cart
  useEffect(() => {
    if (isAuthenticated) {
      syncAndFetchCart();
    } else {
      setItems(getGuestItems());
    }
  }, [isAuthenticated]);

  const syncAndFetchCart = async () => {
    const guestItems = getGuestItems();
    if (guestItems.length > 0) {
      setLoading(true);
      try {
        // Sync each item to backend
        for (const item of guestItems) {
          try {
            await cartService.addToCart(
              item.inventoryId.productId._id,
              item.quantity,
              item.inventoryId._id
            );
          } catch (syncErr) {
            console.error('Failed to sync item:', item, syncErr);
          }
        }
        // Clear guest cart after successful sync attempt
        localStorage.removeItem('guest_cart');
      } catch (err) {
        console.error('Error syncing guest cart:', err);
      }
    }
    await fetchCart();
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart() as CartApiResponse;
      setItems(response.data?.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number, inventoryId: string) => {
    if (!isAuthenticated) {
      // Guest mode
      setLoading(true);
      try {
        const guestItems = getGuestItems();
        const existingItem = guestItems.find(item => item.inventoryId._id === inventoryId);

        if (existingItem) {
          existingItem.quantity += quantity;
          setGuestItems([...guestItems]);
        } else {
          // Fetch product & inventory details for guest display
          const productResponse = await productService.getProductById(productId);
          if (productResponse.success) {
            const product = productResponse.data;
            const inventory = product.inventories?.find(inv => inv._id === inventoryId);

            if (!inventory) throw new Error('Inventory not found');

            const newItem: CartItem = {
              _id: `guest_${Date.now()}_${Math.random()}`,
              userId: 'guest',
              companyId: product.companyId,
              inventoryId: {
                ...inventory,
                productId: {
                  _id: product._id,
                  name: product.name,
                  images: product.images,
                  category: product.category,
                  brand: product.brand
                }
              } as any,
              quantity,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setGuestItems([...guestItems, newItem]);
          }
        }
        toast({
          title: "Added to cart",
          description: "Item added to your temporary cart.",
        });
      } catch (err) {
        console.error('Error adding to guest cart:', err);
        toast({
          title: "Error",
          description: "Could not add item to cart.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await cartService.addToCart(productId, quantity, inventoryId) as CartApiResponse;
      if (response.success) {
        toast({
          title: "Item added",
          description: "Item successfully added to your cart.",
        });
        await fetchCart();
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
      toast({
        title: "Error",
        description: 'Failed to add item to cart',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!isAuthenticated) {
      const guestItems = getGuestItems().filter(item => item._id !== itemId);
      setGuestItems(guestItems);
      toast({
        title: "Item removed",
        description: "Item removed from your temporary cart.",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cartService.removeFromCart(itemId);
      toast({
        title: "Item removed",
        description: "Item removed from your cart.",
      });
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
      toast({
        title: "Error",
        description: 'Failed to remove item from cart',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    if (!isAuthenticated) {
      const guestItems = getGuestItems();
      const item = guestItems.find(i => i._id === itemId);
      if (item) {
        item.quantity = quantity;
        setGuestItems([...guestItems]);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cartService.updateCartItemQuantity(itemId, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
      toast({
        title: "Error",
        description: 'Failed to update quantity',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem('guest_cart');
      setItems([]);
      toast({
        title: "Cart cleared",
        description: "Temporary cart cleared.",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cartService.clearCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
      setItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      toast({
        title: "Error",
        description: 'Failed to clear cart',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        cartSummary,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
