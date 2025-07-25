import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles, TrendingUp, Users } from 'lucide-react';

const ModernHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Classic Elegance",
      highlight: "Timeless Style",
      subtitle: "Discover our exclusive collection for the modern gentleman.",
      image: "/banners/banner-1.jpg",
      cta: "Shop Now"
    },
    {
      title: "New Arrivals",
      highlight: "Fresh Looks",
      subtitle: "Upgrade your wardrobe with the latest trends in men's fashion.",
      image: "/banners/banner-2.jpg",
      cta: "Explore Collection"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${currentHero.image}')`,
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-primary/20 to-black/50" />
      
      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-12 h-12 sm:w-32 sm:h-32 rounded-full glass-card floating-animation opacity-20" />
        <div className="absolute bottom-20 sm:bottom-40 right-8 sm:right-32 w-8 h-8 sm:w-24 sm:h-24 rounded-full glass-card floating-animation opacity-30" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-4 sm:right-20 w-6 h-6 sm:w-16 sm:h-16 rounded-full glass-card floating-animation opacity-25" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 md:mb-6 px-2 sm:px-0">
            {currentHero.title}<br />
            <span className="gradient-text">{currentHero.highlight}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            {currentHero.subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 md:mb-16 px-4 sm:px-0">
            <Button 
              className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-semibold px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow"
              asChild
            >
              <Link to="/products">{currentHero.cta}</Link>
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto glass-card border-white/30 text-white bg-white/10 text-white px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-full backdrop-blur-sm"
              asChild
            >
              <Link to="/products?featured=true" className="text-white">View Trending</Link>
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </section>
  );
};

export default ModernHero;