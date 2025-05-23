import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Bell } from 'lucide-react';

const NewsletterSignup = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
  };
  
  return (
    <>
      {/* Floating action button */}
      <motion.button
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${darkMode ? 'bg-[#2A9D8F]' : 'bg-[#1D3557]'} text-white shadow-lg flex items-center justify-center z-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        aria-label="Subscribe to newsletter"
      >
        <Mail size={24} />
      </motion.button>
      
      {/* Newsletter modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-md p-8 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
                aria-label="Close newsletter signup"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-[#2A9D8F]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Subscribe to our newsletter for the latest updates, features, and tips.
                </p>
              </div>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-medium mb-2">Thank You!</h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    You've been successfully subscribed to our newsletter.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2A9D8F]' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-[#1D3557]'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#2A9D8F]`}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Subscribe
                  </motion.button>
                  
                  <p className="text-xs text-center mt-4 text-gray-500">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterSignup;
