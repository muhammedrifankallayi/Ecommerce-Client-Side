
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="bg-shop-background">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-shop-foreground">
              Sustainable Products for a <span className="text-shop-primary">Better Planet</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover our collection of eco-friendly and sustainable products 
              that help reduce waste and protect our environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-shop-primary hover:bg-shop-secondary text-white"
                size="lg"
                asChild
              >
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-shop-primary text-shop-primary hover:bg-shop-primary hover:text-white"
                asChild
              >
                <Link to="/products?featured=true">Featured Items</Link>
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09" 
                alt="Eco-friendly products" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
