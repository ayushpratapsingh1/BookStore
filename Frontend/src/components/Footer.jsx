import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Heart, BookOpen, Navigation, MapPin, Phone } from 'lucide-react';

function Footer() {
  const socialLinks = [
    { name: 'Github', icon: <Github size={20} />, url: 'https://github.com/ayushpratapsingh1' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com/in/ayushpratapsingh1' },
    { name: 'Email', icon: <Mail size={20} />, url: 'mailto:ayushpratapds@gmail.com' }
  ];

  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-[#FF9F1C]" size={28} />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF9F1C] to-[#FFBF69] bg-clip-text text-transparent">
                BookStore
              </h2>
            </div>
            <p className="text-[#FFBF69] text-sm leading-relaxed mb-4">
              Your premier destination for digital literature.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FFE8D6]/10 p-3 rounded-lg hover:bg-[#FF9F1C] hover:scale-110 transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 md:flex md:justify-center">
            <div className="bg-black/30 p-6 rounded-xl backdrop-blur-sm shadow-xl w-full">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Navigation className="text-[#FF9F1C]" size={20} />
                Quick Links
              </h3>
              <div className="flex flex-col space-y-4">
                {['Home', 'Upload', 'Statistics', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                    className="text-[#FFE8D6]/80 hover:text-[#FF9F1C] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 bg-[#FF9F1C] rounded-full transform scale-0 group-hover:scale-100 transition-transform"></span>
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="bg-black/30 p-6 rounded-xl backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-bold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <a href="mailto:ayushpratapds@gmail.com" 
                   className="flex items-center gap-3 text-[#FFE8D6]/80 hover:text-[#FF9F1C] transition-colors">
                  <Mail size={20} />
                  ayushpratapds@gmail.com
                </a>
                <p className="flex items-center gap-3 text-[#FFE8D6]/80">
                  <Phone size={20} className="text-[#FF9F1C]" />
                  +918457956233
                </p>
                <p className="flex items-center gap-3 text-[#FFE8D6]/80">
                  <MapPin size={20} className="text-[#FF9F1C]" />
                  Lovely Professional University
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FFE8D6]/10 pt-4 text-center">
          <div className="flex items-center justify-center gap-2">
            Made by
            <a href="https://github.com/ayushpratapsingh1" target="_blank" rel="noopener noreferrer" 
               className="text-[#FF9F1C] hover:text-[#FFBF69] transition-colors">
              Ayush Pratap Singh
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
