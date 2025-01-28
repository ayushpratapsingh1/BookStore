import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';

const Store = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');

  const genres = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Technology'];

  useEffect(() => {
    // Fetch books from backend
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/books`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      setFilteredBooks([]);
    }
  };

  const filterBooks = (searchTerm, selectedGenre) => {
    let filtered = books;
    
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGenre && selectedGenre !== 'all') {
      filtered = filtered.filter(book => 
        book.genre.toLowerCase() === selectedGenre
      );
    }
    
    setFilteredBooks(filtered);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    filterBooks(e.target.value, genre);
  };

  const handleGenreFilter = (selectedGenre) => {
    setGenre(selectedGenre);
    filterBooks(search, selectedGenre);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search books..."
              className="w-full p-3 pl-4 pr-10 rounded-lg border-2 border-[#FFBF69] focus:border-[#FF9F1C] outline-none"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => handleGenreFilter(g.toLowerCase())}
                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  genre === g.toLowerCase()
                    ? 'bg-[#FF9F1C] text-white'
                    : 'bg-[#FFBF69] text-[#121212] hover:bg-[#FF9F1C] hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
            <button
              onClick={() => {
                setGenre('all');
                setSearch('');
                setFilteredBooks(books);
              }}
              className="px-4 py-2 rounded-lg bg-[#121212] text-white hover:bg-[#2A2A2A] transition-all duration-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Store;
