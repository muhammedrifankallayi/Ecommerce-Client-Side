
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
  const [featuredProducts,setFeaturedProducts] = useState([]);

      useEffect(() => {
          const fetchCategories = async () => {
              try {
                  const response = await landingUiService.getLandingUi();
                  console.log(response);
                  
                  setCategories(response.data.categories);
                  setFeaturedProducts(response.data.featuredProducts);
              } catch (error) {
                  console.error("Error fetching categories:", error);
              }
          };
  
          fetchCategories();
      }
      , []);
  return (
    <div className="w-full overflow-hidden">
      <ModernHero />
      <StatsSection />
      <CategoryListing   category={categories}  />
      <FeaturedProducts  featuredProducts={featuredProducts} />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
