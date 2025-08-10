
import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '@/services/cartService';
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

  // Fetch cart items on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
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
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
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
    if (!isAuthenticated) return;

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
    if (!isAuthenticated || quantity < 1) return;

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
    if (!isAuthenticated) return;

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
