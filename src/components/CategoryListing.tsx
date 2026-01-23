
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { landingUiService } from '@/services/landingUiService';
import { BASE_URL } from '@/services';

const CategoryListing = ({ category: categories }: { category: any[] }) => {
  if (!categories || categories.length === 0) return null;




  return (
    <div className="bg-gray-50/50 py-12 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => window.location.href = `/products?category=${category._id}`}
              className="relative aspect-[16/10] cursor-pointer group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
            >
              {/* Background image */}
              <img
                src={BASE_URL + category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

              {/* Category name - positioned at bottom for better "fit" feel */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md group-hover:translate-x-2 transition-transform duration-500">
                  {category.name}
                </h3>
              </div>

              {/* Explore button on hover */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 mt-16">
                <div className="flex items-center space-x-2 bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-lg">
                  <span className="text-gray-800 font-semibold text-sm">Explore</span>
                  <ArrowRight className="w-4 h-4 text-gray-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryListing;