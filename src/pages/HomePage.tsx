
import ModernHero from '@/components/ModernHero';
import FeaturedProducts from '@/components/FeaturedProducts';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';
import CategoryListing from '@/components/CategoryListing';
import { landingUiService } from '@/services/landingUiService';
import { useEffect, useState } from 'react';

const HomePage = () => {

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await landingUiService.getLandingUi();
        if (response.success && response.data) {
          setCategories(response.data.categories || []);
          setFeaturedProducts(response.data.featuredProducts || []);
        }
      } catch (error) {
        console.error("Error fetching landing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <ModernHero />
      <StatsSection />

      {categories && categories.length > 0 && (
        <CategoryListing category={categories} />
      )}

      {featuredProducts && featuredProducts.length > 0 && (
        <FeaturedProducts featuredProducts={featuredProducts} />
      )}

      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
