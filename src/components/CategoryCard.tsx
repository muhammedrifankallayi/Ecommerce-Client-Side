
import { Link } from 'react-router-dom';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link 
      to={`/products?category=${category.id}`}
      className="relative overflow-hidden rounded-lg group"
    >
      <div className="h-64 w-full">
        <img 
          src={category.image} 
          alt={category.name} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
        <p className="text-sm opacity-90">{category.description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
