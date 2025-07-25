import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import NotFound from "@/pages/NotFound";
import { OrderHistory } from "@/components/OrderHistory";
import ProfilePage from "@/pages/ProfilePage";
import HelpDeskPage from "@/pages/HelpDeskPage";
import FAQPage from "@/pages/FAQPage";
import ChatSupportPage from "@/pages/ChatSupportPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import OTPPage from "@/pages/OTPPage";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import ResendVerificationPage from "@/pages/ResendVerificationPage";
import VerificationSuccessPage from "@/pages/VerificationSuccessPage";
import TrackOrderPage from '@/pages/TrackOrderPage';

const queryClient = new QueryClient();

const App = () => {
  const isAuthPage = (pathname: string) => {
    return ['/login', '/register', '/otp', '/verify-email', '/resend-verification', '/verification-success'].includes(pathname);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Routes>
                {/* Auth pages without navbar/footer */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/otp" element={<OTPPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="/resend-verification" element={<ResendVerificationPage />} />
                <Route path="/verification-success" element={<VerificationSuccessPage />} />
                
                {/* Regular pages with navbar/footer */}
                <Route path="/*" element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/help" element={<HelpDeskPage />} />
                        <Route path="/help/faq" element={<FAQPage />} />
                        <Route path="/help/chat" element={<ChatSupportPage />} />
                        <Route path="/track/:orderId" element={<TrackOrderPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </div>
          </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
