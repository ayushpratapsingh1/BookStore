import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
<header className="w-[90%] md:w-[80%] mx-auto justify-center items-center rounded-2xl fixed left-1/2 -translate-x-1/2 top-2 z-50 backdrop-blur-md bg-gradient-to-r from-[#FF9F1C]/90 to-[#FFBF69]/90 shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <BookOpen 
              className="text-[#fff] transform transition-transform group-hover:scale-110 duration-400" 
              size={28} 
            />
            <span className="text-2xl font-bold text-[#121212] group-hover:text-[#fff] transition-colors duration-400">
              BookStore
            </span>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
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

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-[80px] bg-[#FF9F1C] p-4 rounded-2xl shadow-lg">
            <div className="flex flex-col space-y-4">
              {['Home', 'Upload', 'Statistics', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-white py-2 px-4 hover:bg-[#FFBF69] rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
