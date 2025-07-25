
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">EcoShop</h3>
            <p className="text-gray-600 mb-4">Sustainable and eco-friendly products for a better planet.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-shop-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-shop-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-shop-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=electronics" className="text-gray-600 hover:text-shop-primary transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=clothing" className="text-gray-600 hover:text-shop-primary transition-colors">Clothing</Link>
              </li>
              <li>
                <Link to="/products?category=home" className="text-gray-600 hover:text-shop-primary transition-colors">Home & Kitchen</Link>
              </li>
              <li>
                <Link to="/products?category=beauty" className="text-gray-600 hover:text-shop-primary transition-colors">Beauty</Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-shop-primary transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-shop-primary transition-colors">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-shop-primary transition-colors">Returns & Refunds</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-shop-primary transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-shop-primary flex-grow"
              />
              <button className="bg-shop-primary text-white px-4 py-2 rounded-r-md hover:bg-shop-secondary transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">&copy; 2025 EcoShop. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-shop-primary text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-shop-primary text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-shop-primary text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
