import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      image: "https://images.unsplash.com/photo-1494790108755-2616c041a5c1?q=80&w=400&auto=format&fit=crop",
      content: "The quality and attention to detail in every piece is absolutely outstanding. I've never experienced such premium fashion at this level.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
      content: "From the moment I discovered this brand, I knew I found something special. The craftsmanship is unparalleled.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Style Consultant",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
      content: "Every purchase feels like an investment in timeless style. The customer service is as exceptional as the products.",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 px-4 sm:px-0">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Quote className="w-3 h-3 sm:w-4 sm:h-4" />
            Customer Stories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it - hear from the fashion enthusiasts who trust us
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 sm:top-8 right-4 sm:right-8">
                <Quote className="w-16 h-16 sm:w-32 sm:h-32 text-primary" />
              </div>
            </div>

            <div className="relative z-10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === currentTestimonial 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                  }`}
                >
                  {/* Rating Stars */}
                  <div className="flex justify-center gap-1 mb-4 sm:mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Content */}
                  <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl text-center font-medium leading-relaxed mb-6 sm:mb-8 text-foreground px-2 sm:px-0">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-primary/20"
                    />
                    <div className="text-center">
                      <div className="font-semibold text-base sm:text-lg">{testimonial.name}</div>
                      <div className="text-sm sm:text-base text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-primary scale-125' 
                        : 'bg-muted hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;