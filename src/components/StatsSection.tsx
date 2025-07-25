import { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, Globe } from 'lucide-react';

const StatsSection = () => {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    countries: 0,
    satisfaction: 0
  });

  const finalStats = {
    customers: 50000,
    products: 2500,
    countries: 85,
    satisfaction: 98
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        customers: Math.floor(finalStats.customers * progress),
        products: Math.floor(finalStats.products * progress),
        countries: Math.floor(finalStats.countries * progress),
        satisfaction: Math.floor(finalStats.satisfaction * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(finalStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const statsData = [
    {
      icon: Users,
      value: stats.customers.toLocaleString(),
      suffix: '+',
      label: 'Happy Customers',
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      value: stats.products.toLocaleString(),
      suffix: '+',
      label: 'Premium Products',
      color: 'text-green-500'
    },
    {
      icon: Globe,
      value: stats.countries,
      suffix: '+',
      label: 'Countries Served',
      color: 'text-purple-500'
    },
    {
      icon: Award,
      value: stats.satisfaction,
      suffix: '%',
      label: 'Satisfaction Rate',
      color: 'text-orange-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {statsData.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
              style={{ 
                animationDelay: `${index * 200}ms`,
                animation: 'fade-in 0.8s ease-out forwards'
              }}
            >
              <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-8 hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-2 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 gradient-text">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;