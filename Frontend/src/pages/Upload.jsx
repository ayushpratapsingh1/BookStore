import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';

const ConfettiEffect = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create confetti particles
    const colors = ['#FF9F1C', '#FFBF69', '#FFE8D6', '#FFC107', '#ffffff'];
    const shapes = ['square', 'circle'];
    const newParticles = Array.from({ length: 500}, (_, i) => ({
      id: i,
      x: Math.random() * 100, // % position
      y: -10, // start above viewport
      size: Math.random() * 10 + 3, // between 3-13px
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      velocity: Math.random() * 3 + 2,
      delay: Math.random() * 3
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '0',
            transform: `rotate(${p.rotation}deg)`,
            animation: `fall ${p.velocity}s linear forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <style jsx="true">{`
        @keyframes fall {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const Upload = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [uploaded, setUploaded] = useState(false); 
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    pdf: null,
    isApproved: false,
    coverImage: null,
    uploader: ''
  });

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Redirect after success with delay
  useEffect(() => {
    if (uploaded) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [uploaded, navigate]);

  const handleBoxClick = (inputRef) => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.author || !formData.genre || 
        !formData.description || !formData.pdf || !formData.coverImage) {
      alert("Please fill all required fields");
      return;
    }
    
    const data = new FormData();
    
    // Add form data
    data.append('pdf', formData.pdf);
    data.append('coverImage', formData.coverImage);
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('description', formData.description);
    data.append('genre', formData.genre);
    data.append('uploader', formData.uploader);

    try {
      setIsUploading(true); // Start loading
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/books/upload`, {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        setUploaded(true); // This will trigger the success screen
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Failed to upload book. Please try again.');
    } finally {
      setIsUploading(false); // End loading regardless of outcome
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 mt-16 relative">
      {uploaded && (
        <>
          <ConfettiEffect />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => navigate('/')}></div>
            
            <div className="relative z-50 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md mx-auto text-center animate-fadeIn">
              <div className="mb-6">
                <div className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                  <CheckCircle size={48} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Success!</h2>
              <p className="text-xl text-white/90 mb-6">
                Your book has been uploaded successfully!
              </p>
              <p className="text-white/75 mb-6">
                You will be redirected to the home page in a few seconds...
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="bg-[#FF9F1C] hover:bg-[#FFBF69] text-white px-6 py-3 rounded-lg transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </>
      )}
      <div className={`max-w-3xl mx-auto bg-white rounded-lg p-8 shadow-[0_20px_50px_rgba(255,_159,_28,_0.3)]
      hover:shadow-[0_20px_100px_rgba(255,_159,_28,_0.3)] duration-300 ${uploaded ? 'opacity-20 pointer-events-none' : ''}`}>
        <h2 className="text-2xl font-semibold text-[#212121] mb-8">Share a Book</h2>
        
        {isUploading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
            <Loader className="h-12 w-12 text-[#FF9F1C] animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Uploading your book...
            </p>
            <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-[#FF9F1C] animate-pulse rounded-full"></div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full p-3 border border-[#B0BEC5] rounded-md focus:ring-2 focus:ring-[#FF9F1C] bg-[#F5F5F5]"
                  onChange={(e) => setFormData({...formData, uploader: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2">Book Title</label>
                <input
                  type="text"
                  className="w-full p-3 border border-[#B0BEC5] rounded-md focus:ring-2 focus:ring-[#FFC107] bg-[#F5F5F5]"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2">Author Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-[#B0BEC5] rounded-md focus:ring-2 focus:ring-[#FFC107] bg-[#F5F5F5]"
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2">Genre</label>
                <select
                  className="w-full p-3 border border-[#B0BEC5] rounded-md focus:ring-2 focus:ring-[#FFC107] bg-[#F5F5F5]"
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                >
                  <option value="">Select Genre</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                  <option value="technology">Technology</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  className="w-full p-3 border border-[#B0BEC5] rounded-md focus:ring-2 focus:ring-[#FFC107] bg-[#F5F5F5]"
                  rows="4"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block mb-2">Upload PDF</label>
                <div
                  onClick={() => handleBoxClick(fileInputRef)}
                  className="w-full p-8 border-2 border-dashed border-[#B0BEC5] rounded-lg bg-[#F5F5F5] cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <input
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setFormData({...formData, pdf: e.target.files[0]})}
                  />
                  <div className="text-[#B0BEC5] text-center">
                    <i className="fas fa-file-pdf text-3xl mb-2"></i>
                    <p>{formData.pdf ? formData.pdf.name : 'Click to upload PDF'}</p>
                    <p className="text-sm">Maximum size: 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <label className="block mb-2 font-medium">Book Cover</label>
              <div
                onClick={() => handleBoxClick(coverInputRef)}
                className="aspect-[3/4] rounded-lg border-2 border-dashed border-[#B0BEC5] bg-[#F5F5F5] overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[#B0BEC5] p-4">
                    <i className="fas fa-image text-3xl mb-2"></i>
                    <p className="text-center">Click to upload cover image</p>
                    <p className="text-sm text-center">Recommended size: 800x1200px</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className={`w-full cursor-pointer py-3 rounded-md font-medium mt-8 transition-colors 
              ${isUploading 
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#FFC107] text-[#212121] hover:bg-[#1A237E] hover:text-[#F5F5F5]'
              }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader size={20} className="animate-spin" />
                Uploading...
              </span>
            ) : (
              'Upload Book'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
