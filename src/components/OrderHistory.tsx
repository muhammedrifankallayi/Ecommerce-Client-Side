import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/services/orderService';
import { BASE_URL } from '@/services/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, PackageX, Truck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CancelOrderDialog } from './CancelOrderDialog';
import { ReturnProductDialog } from './ReturnProductDialog';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Order, OrderItem as OrderItemType } from '@/types/api';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export const OrderHistory = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [returnProduct, setReturnProduct] = useState<{ orderId: string; itemId: string; name: string } | null>(null);
  const navigate = useNavigate();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getOrders();
        if (response.success && response.data?.orders) {
          setOrders(response.data.orders);
        } else {
          throw new Error('Failed to load orders');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Cancel order API
  const handleCancelOrder = async (orderId: string, reason: string) => {
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL.replace(/\/$/, '')}/api/orders/${orderId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}`, 'x-company-id': import.meta.env.VITE_COMPANY_ID || '686e3977d861a6eff15cec67' } }
      );
      setOrders(orders => orders.map(order => order._id === orderId ? { ...order, status: 'cancelled' } : order));
      toast({ title: 'Order Cancelled', description: `Order #${orderId} has been cancelled.` });
    } catch (err: any) {
      toast({ title: 'Cancel Failed', description: err?.response?.data?.message || 'Could not cancel order.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Return item API
  const handleReturnProduct = async (orderId: string, itemId: string, reason: string, images: string[] = [], note = '') => {
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL.replace(/\/$/, '')}/api/orders/${orderId}/items/${itemId}/return`,
        { reason, images, note },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}`, 'x-company-id': import.meta.env.VITE_COMPANY_ID || '686e3977d861a6eff15cec67' } }
      );
      setOrders(orders => orders.map(order =>
        order._id === orderId
          ? {
              ...order,
              orderItems: order.orderItems.map(item =>
                item._id === itemId ? { ...item, returnRequest: { requested: true, status: 'pending' } } : item
              )
            }
          : order
      ));
      toast({ title: 'Return Requested', description: `Return request submitted for order #${orderId}.` });
    } catch (err: any) {
      toast({ title: 'Return Failed', description: err?.response?.data?.message || 'Could not request return.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper: check if order is eligible for cancel
  const canCancelOrder = (order: Order) => ['pending', 'processing'].includes(order.status) && !order.cancelled;
  
  // Helper: check if item is eligible for return (order delivered & within 2 days)
  const canReturnItem = (order: Order) => {
    if (order.status !== 'delivered' || !order.createdAt) return false;
    const deliveredDate = new Date(order.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 2;
  };

  if (loading) {
    return <div className="py-8 text-center">Loading your orders...</div>;
  }
  if (error) {
    return <div className="py-8 text-center text-destructive">{error}</div>;
  }
  if (!orders.length) {
    return <div className="py-8 text-center text-muted-foreground">You have no orders yet.</div>;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {orders.map((order) => (
        <Card key={order._id} className="w-full">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">Order #{order.orderNumber}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className={`${getStatusColor(order.status)} text-xs sm:text-sm self-start sm:self-center`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="space-y-2 sm:space-y-0">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-2">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                          {item.inventory.variantCombination.map((variant) => (
                            <span key={variant._id} className="ml-1">• {variant.value}</span>
                          ))}
                        </div>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded mt-2"
                          />
                        )}
                        {/* Return status */}
                        {item.returnRequest?.requested && (
                          <div className="mt-1 text-xs">
                            <Badge variant="secondary">Return: {item.returnRequest.status}</Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-2">
                        <div className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</div>
                      </div>
                    </div>
                    {/* Return button */}
                    {canReturnItem(order) && !item.returnRequest?.requested && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 text-xs"
                        onClick={() => setReturnProduct({ orderId: order._id, itemId: item._id, name: item.name })}
                      >
                        <PackageX className="mr-1 h-3 w-3" />
                        Request Return
                      </Button>
                    )}
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <span className="font-medium">
                        {item.name} (x{item.quantity})
                        {item.inventory.variantCombination.map((variant) => (
                          <span key={variant._id} className="ml-1 text-muted-foreground">
                            • {variant.value}
                          </span>
                        ))}
                      </span>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="inline-block w-10 h-10 object-cover rounded ml-2 align-middle"
                        />
                      )}
                      {/* Return status */}
                      {item.returnRequest?.requested && (
                        <span className="ml-2 text-xs">
                          <Badge variant="secondary">Return: {item.returnRequest.status}</Badge>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {/* Return button */}
                    {canReturnItem(order) && !item.returnRequest?.requested && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReturnProduct({ orderId: order._id, itemId: item._id, name: item.name })}
                      >
                        <PackageX className="mr-2 h-4 w-4" />
                        Request Return
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Separator className="my-3 sm:my-4" />
              
              <div className="flex justify-between items-center font-semibold text-sm sm:text-base">
                <span>Order Total</span>
                <span className="text-lg">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          {/* Cancel button if eligible */}
          <CardFooter className="pt-3 sm:pt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm font-semibold border border-primary"
              onClick={() => navigate(`/track/${order._id}`)}
            >
              <Truck className="mr-2 h-4 w-4" />
              Track Order
            </Button>
            {canCancelOrder(order) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setSelectedOrder(order._id)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Cancel Order
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      {/* Cancel dialog */}
      <CancelOrderDialog
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onConfirm={(reason) => {
          if (selectedOrder) {
            handleCancelOrder(selectedOrder, reason);
          }
        }}
        orderId={selectedOrder || ""}
      />

      {/* Return dialog */}
      {returnProduct && (
        <ReturnProductDialog
          isOpen={true}
          onClose={() => setReturnProduct(null)}
          onConfirm={(reason, images, note) => {
            handleReturnProduct(returnProduct.orderId, returnProduct.itemId, reason, images, note);
            setReturnProduct(null);
          }}
          orderId={returnProduct.orderId}
          productName={returnProduct.name}
        />
      )}
    </div>
  );
};