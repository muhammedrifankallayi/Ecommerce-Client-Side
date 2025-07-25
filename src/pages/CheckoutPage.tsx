
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addressService } from "@/services/addressService";
import type { UserAddress, CartItem, OrderShippingAddress, OrderItemPayload } from "@/types/api";
import { BASE_URL } from "@/services/config";
import { useAuth } from "@/contexts/AuthContext";
import { COMPANY_ID } from "@/services/config";
import { orderService, CreateOrderPayload } from "@/services/orderService";
import { toast as sonnerToast } from "sonner";
import axios from 'axios';

// Dynamically load Razorpay SDK
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

async function createRazorpayOrder(amount: number, token: string) {
  // Use BASE_URL from config
  const url = BASE_URL.replace(/\/$/, '') + '/api/orders/payments/razorpay-order';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-company-id': COMPANY_ID,
    },
    body: JSON.stringify({ amount }),
  });
  return res.json(); // Should return { orderId, amount, currency }
}

const CheckoutPage = () => {
  const { items: cartItems, loading: cartLoading } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: user?.email || "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    addressService.getAddresses().then(setAddresses);
  }, []);

  // When an address is selected, auto-fill the form
  useEffect(() => {
    if (!selectedAddressId) return;
    const addr = addresses.find(a => a._id === selectedAddressId);
    if (addr) {
      setShippingInfo({
        name: addr.name,
        email: user?.email || "",
        address: addr.address.street,
        city: addr.address.city,
        zipCode: addr.address.postalCode,
        phone: addr.phone,
      });
    }
  }, [selectedAddressId, addresses, user]);

  // Calculate order summary
  const computedSubtotal = cartItems.reduce((sum, item) => 
    sum + ((item?.inventoryId?.price ?? 0) * (item?.quantity ?? 1)), 0
  );
  const shipping = computedSubtotal > 50 ? 0 : 5.99;
  const total = computedSubtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(total * 100, token);
      if (!razorpayOrder?.orderId) {
        throw new Error('Failed to create payment order');
      }

      // Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Configure Razorpay
      const options = {
        key: "rzp_test_64ZZAJ9CmqeyzZ",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: razorpayOrder.orderId,
        handler: async function (response: any) {
          try {
            // Build order items - simplified to just inventory ID and quantity
            const orderItems: OrderItemPayload[] = cartItems.map(item => ({
              inventory: item.inventoryId._id,
              quantity: item.quantity
            }));

            // Build shipping address
            const country = selectedAddressId 
              ? addresses.find(a => a._id === selectedAddressId)?.address.country || "India"
              : "India";

            const shippingAddress: OrderShippingAddress = {
              address: shippingInfo.address,
              city: shippingInfo.city,
              postalCode: shippingInfo.zipCode,
              country,
              phone: shippingInfo.phone,
              _id: selectedAddressId || ""
            };

            // Remove tax calculation
            // const taxRate = 0.05; // 5% tax
            // const taxPrice = computedSubtotal * taxRate;
            const taxPrice = 0;

            // Create order with updated payload structure
            const orderPayload: CreateOrderPayload = {
              orderItems,
              shippingAddress,
              paymentMethod: "razorpay",
              taxPrice: 0,
              shippingPrice: parseFloat(shipping.toFixed(2)),
              totalPrice: parseFloat((computedSubtotal + shipping).toFixed(2))
            };

            const orderResponse = await orderService.createOrder(orderPayload);
            if (!orderResponse.success || !orderResponse.data) {
              throw new Error('Failed to create order');
            }
            
            // Verify payment
            await axios.post(
              `${BASE_URL}/api/orders/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderResponse.data._id,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'x-company-id': COMPANY_ID,
                },
              }
            );

            toast({
              title: "Order Placed Successfully!",
              description: "Thank you for your purchase. Payment confirmed.",
            });
            sonnerToast.success("Order saved and paid!");
            navigate("/profile");

          } catch (err: any) {
            toast({
              title: "Order Failed",
              description: err?.message || "Could not complete your order.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      toast({
        title: "Checkout Error",
        description: err?.message || "Failed to process checkout.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading checkout information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <Card className="md:col-span-2 flex flex-col h-fit">
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 && (
              <div className="mb-2">
                <h3 className="font-medium mb-2">Select a saved address</h3>
                <div className="space-y-2">
                  {addresses.map(addr => (
                    <label key={addr._id} className="flex items-start gap-2 cursor-pointer border rounded p-2 hover:bg-accent/30">
                      <input
                        type="radio"
                        name="deliveryAddress"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1 accent-primary"
                      />
                      <span>
                        <span className="font-semibold">{addr.name}</span> <span className="text-xs text-muted-foreground">({addr.type})</span>
                        <br />
                        {addr.address.street}, {addr.address.city}, {addr.address.state} {addr.address.postalCode}, {addr.address.country}
                        <br />
                        <span className="text-xs">Phone: {addr.phone}</span>
                        {addr.isDefault && <span className="ml-2 text-xs text-primary">(Default)</span>}
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value="manual"
                      checked={!selectedAddressId}
                      onChange={() => setSelectedAddressId("")}
                      className="accent-primary"
                    />
                    <span>Enter a new address</span>
                  </label>
                </div>
                <Separator className="my-4" />
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                <Input
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-1">ZIP Code</label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <CardFooter className="p-0 pt-4">
                <Button type="submit" className="w-full text-lg font-semibold" disabled={loading}>
                  {loading ? "Processing..." : `Place Order ($${total.toFixed(2)})`}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between py-2 border-b last:border-b-0">
                <div className="flex-1 pr-4">
                  <p className="font-medium">{item.inventoryId.productId.name}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Qty: {item.quantity}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.inventoryId.variantCombination?.map((combo) => (
                        <span key={combo._id} className="inline-flex items-center">
                          {combo.variantId.name}: {combo.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="font-medium whitespace-nowrap">
                  ${(item.inventoryId.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between text-base">
              <span>Subtotal</span>
              <span>${computedSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
