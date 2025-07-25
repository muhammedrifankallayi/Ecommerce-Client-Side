
import ModernHero from '@/components/ModernHero';
import FeaturedProducts from '@/components/FeaturedProducts';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';

const HomePage = () => {
  return (
    <div className="w-full overflow-hidden">
      <ModernHero />
      <StatsSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
