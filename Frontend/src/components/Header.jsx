import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="w-full top-0 z-50 blur-header bg-gradient-to-r from-[#FF9F1C] to-[#FFBF69]">
      <nav className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <BookOpen 
              className="text-[#FF9F1C] transform transition-transform group-hover:scale-110" 
              size={28} 
            />
            <span className="text-2xl font-bold text-[#121212] group-hover:text-[#FF9F1C] transition-colors">
              BookStore
            </span>
          </Link>
          
          <div className="flex items-center space-x-10">
            {['Home', 'Upload', 'Statistics', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={`nav-link text-[#121212] font-medium hover:text-[#fff] transition-all duration-300 ${
                  location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`)
                    ? 'text-[#fff]'
                    : ''
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
