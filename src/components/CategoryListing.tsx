
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { landingUiService } from '@/services/landingUiService';
import { BASE_URL } from '@/services';

const CategoryListing = ({category}) => {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await landingUiService.getLandingUi();
                console.log(response);
                
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }
    , []);




  return (
     <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Categories</h1> */}
        
        <div className="grid grid-cols-2 gap-1">
          {categories.map((category) => (
            <div
              key={category._id}
              className="relative h-72 cursor-pointer group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Background image */}
              <img 
                src={BASE_URL + category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>
              {/* Background blur overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 group-hover:backdrop-blur-sm transition-all duration-300"></div>
              
              {/* Category name - centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className=" text-4xl text-purple-500 text-2xl font-bold drop-shadow-lg group-hover:text-purple-300 transition-colors duration-300 text-center px-4">
                  {category.name}
                </h1>
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