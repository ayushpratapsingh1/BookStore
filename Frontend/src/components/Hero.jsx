import { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const slides = [
    { 
      image: '/images/1.jpg', 
      title: 'Discover Amazing Books',
      subtitle: 'Your gateway to endless knowledge and entertainment'
    },
    { 
      image: '/images/2.jpg', 
      title: 'Share Your Knowledge',
      subtitle: 'Upload and share your favorite books with the community'
    },
    { 
      image: '/images/3.jpg', 
      title: 'Read Anywhere',
      subtitle: 'Access your books anytime, anywhere'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches ? e.touches[0].pageX : e.pageX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.touches ? e.touches[0].pageX : e.pageX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
      }
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative pt-[56.25%] md:pt-[50%] lg:pt-[40%]"> {/* Responsive aspect ratio */}
        <div 
          ref={sliderRef}
          className="absolute inset-0 flex cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 transform transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy" // Add lazy loading
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent">
                  <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center w-full max-w-4xl px-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#FFE8D6] mb-4">{slide.title}</h1>
                    <p className="text-base md:text-lg lg:text-xl text-[#E0E0E0]/80">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-[#FF9F1C] w-8' 
                  : 'bg-[#FFBF69]/50 hover:bg-[#FFBF69]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
