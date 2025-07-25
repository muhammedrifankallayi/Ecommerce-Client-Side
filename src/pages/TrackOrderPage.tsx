import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, Truck, Package, MapPin, Clock } from 'lucide-react';
import { BASE_URL } from '@/services/config';
import { orderService } from '@/services/orderService';

const getTrackingSteps = (order: any) => {
  const steps = [
    { label: 'Order Placed', date: order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : null, icon: <CheckCircle className="text-green-500" /> },
    { label: 'Processing', date: null, icon: <Clock className="text-blue-500" /> },
    { label: 'Shipped', date: null, icon: <Truck className="text-orange-500" /> },
    { label: 'Out for Delivery', date: null, icon: <MapPin className="text-yellow-500" /> },
    { label: 'Delivered', date: null, icon: <Package className="text-gray-400" /> },
  ];
  // Mark steps as completed based on order.status
  if (order?.status === 'processing' || order?.status === 'shipped' || order?.status === 'delivered') steps[1].date = order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : null;
  if (order?.status === 'shipped' || order?.status === 'delivered') steps[2].date = order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : null;
  if (order?.status === 'delivered') steps[4].date = order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : null;
  return steps;
};

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await orderService.getOrderById(orderId);
        setOrder(res?.data || res);
      } catch (err: any) {
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 max-w-2xl text-center">Loading order...</div>;
  }
  if (error || !order) {
    return <div className="container mx-auto px-4 py-8 max-w-2xl text-center text-destructive">{error || 'Order not found.'}</div>;
  }
  const steps = getTrackingSteps(order);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        &larr; Back to Orders
      </Button>
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Tracking Order <span className="text-primary">#{order.orderNumber || order._id}</span>
            <Badge className="ml-2" variant="outline">{order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : ''}</Badge>
          </CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {/* Optionally show estimated delivery if available */}
            {order.estimatedDelivery && (
              <>
                Estimated Delivery: <span className="font-semibold text-primary">{order.estimatedDelivery}</span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Tracking Timeline */}
            <div>
              <h3 className="font-semibold mb-3">Tracking Progress</h3>
              <ol className="relative border-l-2 border-primary/20 ml-4">
                {steps.map((step, idx) => (
                  <li key={idx} className="mb-8 ml-6 flex items-start">
                    <span className="absolute -left-5 flex items-center justify-center w-8 h-8 bg-white rounded-full ring-2 ring-primary/20">
                      {step.icon}
                    </span>
                    <div>
                      <span className="block font-medium text-base">{step.label}</span>
                      {step.date && <span className="text-xs text-muted-foreground">{step.date}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <Separator />
            {/* Order Summary */}
            <div>
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="flex flex-col gap-3">
                {(order.orderItems || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.image && !item.image.startsWith('http') ? `${BASE_URL.replace(/\/$/, '')}/${item.image.replace(/^\//, '')}` : item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total</span>
                  <span>${order.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
            <Separator />
            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <div className="text-sm">
                <div>{order.shippingAddress?.name || ''}</div>
                <div>{order.shippingAddress?.address}, {order.shippingAddress?.city}</div>
                <div>{order.shippingAddress?.country} - {order.shippingAddress?.postalCode}</div>
                <div>Phone: {order.shippingAddress?.phone}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackOrderPage; 