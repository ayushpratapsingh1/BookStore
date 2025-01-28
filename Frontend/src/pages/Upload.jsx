import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
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
    const data = new FormData();
    
    // Match field names with backend multer config
    data.append('pdf', formData.pdf);                // Changed from 'bookPdf'
    data.append('coverImage', formData.coverImage);  // Changed from 'bookCover'
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('description', formData.description);
    data.append('genre', formData.genre);
    data.append('uploader', formData.uploader);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/books/upload`, {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        alert('Book uploaded successfully! Waiting for approval.');
        navigate('/');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Failed to upload book. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-8 shadow-[0_20px_50px_rgba(255,_159,_28,_0.3)]
      hover:shadow-[0_20px_100px_rgba(255,_159,_28,_0.3)] duration-300">
        <h2 className="text-2xl font-semibold text-[#212121] mb-8">Share a Book</h2>
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
            className="w-full bg-[#FFC107] text-[#212121] py-3 rounded-md hover:bg-[#1A237E] hover:text-[#F5F5F5] transition-colors font-medium mt-8"
          >
            Upload Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
