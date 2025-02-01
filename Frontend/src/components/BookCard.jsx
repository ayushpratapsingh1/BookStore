import { useState } from 'react';
import { BookOpen, Download, X, Clock, User, Tag, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BookDetails = ({ book, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`${API_URL}${book.pdfUrl}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl w-full max-w-4xl overflow-auto md:h-auto transform scale-100 transition-transform duration-300 shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-xl md:text-2xl font-bold text-[#121212]">{book.title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="text-gray-500 hover:text-[#FF9F1C]" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:grid md:grid-cols-5 gap-6 mt-4">
          {/* Left Side - Image */}
          <div className="md:col-span-2 flex justify-center">
            <div className="hidden md:block relative w-full max-w-xs md:max-w-md border-2 border-[#FF9F1C]/50 rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <img
                src={`${API_URL}${book.coverImage}` || '/images/default-book.jpg'}
                alt={book.title}
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="md:col-span-3 space-y-4">
            {/* Genre */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Tag size={14} />
                <span>Genre</span>
              </div>
              <span className="bg-[#FF9F1C] text-white px-4 py-1.5 rounded-full text-sm">
                {book.genre}
              </span>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <FileText size={14} />
                <span>Description</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User size={14} />
                  <span>Author</span>
                </div>
                <p className="font-medium text-[#121212]">{book.author}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Clock size={14} />
                  <span>Uploaded</span>
                </div>
                <p className="font-medium text-[#121212]">
                  {new Date(book.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User size={14} />
                  <span>Uploaded by</span>
                </div>
                <p className="font-medium text-[#121212]">{book.uploader}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => window.open(`${API_URL}${book.pdfUrl}`, '_blank')}
                className="flex-1 bg-[#FF9F1C] text-white px-4 py-3 rounded-full hover:bg-[#FFBF69] 
                transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen size={20} />
                Read Online
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 bg-[#121212] text-white px-4 py-3 rounded-full 
                hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookCard = ({ book }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-[0_20px_50px_rgba(255,_159,_28,_0.7)]
          transition-all duration-300 w-full max-w-[260px] mx-auto md:max-w-[300px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowDetails(true)}
      >
        <div className="relative pb-[140%] overflow-hidden">
          <img
            src={`${API_URL}${book.coverImage}` || '/images/default-book.jpg'}
            alt={book.title}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110 brightness-50' : 'scale-100'
            }`}
          />
          <div 
            className={`absolute inset-0 flex flex-col justify-between p-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="bg-[#FF9F1C] text-white px-2 py-0.5 rounded-full text-xs self-end">
              {book.genre}
            </span>
            <div className="space-y-2 mt-auto">
              <p className="text-white text-sm line-clamp-3">{book.description}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-[#121212] text-base mb-1 line-clamp-1">{book.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-1">by {book.author}</p>
        </div>
      </div>

      {showDetails && <BookDetails book={book} onClose={() => setShowDetails(false)} />}
    </>
  );
};

export default BookCard;
