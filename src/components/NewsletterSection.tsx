import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Gift, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate subscription
    setIsSubscribed(true);
    toast({
      title: "Welcome to our community! 🎉",
      description: "Check your email for exclusive offers and style tips.",
    });
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-glow" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 floating-animation opacity-20" />
        <div className="absolute bottom-20 right-32 w-24 h-24 rounded-full bg-white/10 floating-animation opacity-30" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-white/10 floating-animation opacity-25" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gift className="w-4 h-4" />
              Exclusive Benefits
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Join Our Style <br />
              <span className="text-yellow-300">Community</span>
            </h2>
            <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
              Get exclusive access to new collections, styling tips, and members-only discounts delivered straight to your inbox
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Early Access</h3>
              <p className="text-sm opacity-80">Be the first to shop new collections before anyone else</p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Gift className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exclusive Offers</h3>
              <p className="text-sm opacity-80">Member-only discounts and special promotions</p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Style Tips</h3>
              <p className="text-sm opacity-80">Curated styling advice from fashion experts</p>
            </div>
          </div>

          {/* Subscription Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 rounded-full px-6 py-3 text-lg focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                >
                  Join Now
                </Button>
              </div>
              <p className="text-sm opacity-70 mt-4">
                No spam, unsubscribe at any time. By signing up, you agree to our terms.
              </p>
            </form>
          ) : (
            <div className="glass-card rounded-2xl p-8 backdrop-blur-sm max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome Aboard! 🎉</h3>
              <p className="opacity-80">Check your email for your welcome gift and styling tips!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;