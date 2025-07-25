import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, UserRound, LogIn, LogOut, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  const { cart, cartSummary } = useCart();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoriesError('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="w-full glass-card backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl gradient-text">EcoShop</Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full">Home</Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="font-medium hover:bg-primary/10 rounded-full"
                  disabled={categoriesLoading}
                >
                  {categoriesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Categories
                    </div>
                  ) : categoriesError ? (
                    'Categories'
                  ) : (
                    'Categories'
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-card backdrop-blur-md border-white/20">
                {categoriesLoading ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Loading categories...
                  </div>
                ) : categoriesError ? (
                  <div className="p-2 text-center text-sm text-red-500">
                    Failed to load categories
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No categories available
                  </div>
                ) : (
                  categories.map((category) => (
                    <DropdownMenuItem key={category._id} asChild className="hover:bg-primary/10 rounded-lg">
                      <Link to={`/products?category=${category._id}`}>{category.name}</Link>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/products" className="font-medium hover:text-primary transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full">All Products</Link>
            <Link to="/help" className="font-medium hover:text-primary transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full">Help</Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-primary/10 transition-all duration-300">
              <ShoppingCart className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
              {cartSummary && cartSummary.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-glow">
                  {cartSummary.itemCount}
                </span>
              )}
            </Link>
            
            {isLoading ? (
              // Show loader while checking authentication
              <div className="hidden md:flex items-center gap-2 p-2 rounded-full">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : !isAuthenticated ? (
              // Show login button if not authenticated
              <Button 
                className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            ) : (
              // Show user dropdown if authenticated
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-2 p-2 rounded-full hover:bg-primary/10 transition-all duration-300">
                    <UserRound className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass-card backdrop-blur-md border-white/20">
                  <DropdownMenuItem asChild className="hover:bg-primary/10 rounded-lg">
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-primary/10 rounded-lg">
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={logout}
                    className="hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-foreground p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 glass-card rounded-2xl p-6 backdrop-blur-md bg-white/50 border border-white/20 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="font-medium py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="font-medium py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              {categoriesLoading ? (
                <div className="flex items-center gap-2 py-3 px-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading categories...</span>
                </div>
              ) : categoriesError ? (
                <div className="py-3 px-4 text-sm text-red-500">
                  Failed to load categories
                </div>
              ) : categories.length === 0 ? (
                <div className="py-3 px-4 text-sm text-muted-foreground">
                  No categories available
                </div>
              ) : (
                categories.map((category) => (
                  <Link 
                    key={category._id}
                    to={`/products?category=${category._id}`} 
                    className="font-medium py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              )}
              {isLoading ? (
                // Show loader while checking authentication
                <div className="flex items-center gap-2 py-3 px-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : !isAuthenticated ? (
                // Show login button if not authenticated
                <Link 
                  to="/login" 
                  className="font-medium py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              ) : (
                // Show user menu if authenticated
                <>
                  <div className="py-3 px-4 border-b border-gray-200">
                    <p className="text-sm text-muted-foreground">Welcome back,</p>
                    <p className="font-medium">{user?.name || 'User'}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="font-medium py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="font-medium py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left font-medium py-3 px-4 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
              <Link 
                to="/help" 
                className="font-medium py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
