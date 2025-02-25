import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState({ 
    success: false, 
    error: false, 
    loading: false 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: false, error: false, loading: true });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY, // Replace with your Web3Forms access key
          ...formData,
        }),
      });

      if (response.ok) {
        setStatus({ success: true, error: false, loading: false });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ success: false, error: true, loading: false });
      }
    } catch (error) {
      setStatus({ success: false, error: true, loading: false });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-[0_20px_50px_rgba(255,_159,_28,_0.3)] transition-all duration-500">
        <div className="grid md:grid-cols-5 gap-0">
          <div className="md:col-span-2 bg-gradient-to-br from-[#FF9F1C] to-[#FFBF69] p-8 text-white rounded-t-2xl 
          md:rounded-none md:rounded-l-2xl">
            <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 hover:translate-x-2 transition-transform duration-300">
                <Mail className="text-white" size={20} />
                <p>ayushpratapds@gmail.com</p>
              </div>
              <div className="flex items-center space-x-4 hover:translate-x-2 transition-transform duration-300">
                <Phone className="text-white" size={20} />
                <p>+918457956233</p>
              </div>
              <div className="flex items-center space-x-4 hover:translate-x-2 transition-transform duration-300">
                <MapPin className="text-white" size={20} />
                <p>Lovely Professional University</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-3 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Send a Message</h2>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Name"
                  required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FF9F1C] outline-none
                    transition-all duration-300 hover:shadow-md"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Your Email"
                  required
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FF9F1C] outline-none
                    transition-all duration-300 hover:shadow-md"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Your Message"
                  required
                  rows="4"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FF9F1C] outline-none
                    transition-all duration-300 hover:shadow-md"
                ></textarea>
              </div>

              {status.success && (
                <p className="text-green-500 text-center">Message sent successfully!</p>
              )}
              {status.error && (
                <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-gradient-to-r from-[#FF9F1C] to-[#FFBF69] text-white px-6 py-3 rounded-lg
                  hover:shadow-[0_10px_20px_rgba(255,_159,_28,_0.4)] transition-all duration-300 
                  flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={20} />
                {status.loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
