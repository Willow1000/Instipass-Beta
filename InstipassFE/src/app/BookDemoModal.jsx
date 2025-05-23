import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';

const BookDemoModal = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    size: '',
    date: '',
    time: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Simulate submission success
    setTimeout(() => {
      setIsOpen(false);
      setStep(1);
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        institution: '',
        size: '',
        date: '',
        time: ''
      });
    }, 3000);
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Animation for the "Book a Demo" button
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const controls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: {
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      });
    }
  }, [controls, inView]);
  
  return (
    <>
      {/* Animated "Book a Demo" button */}
      <motion.div
        ref={ref}
        animate={controls}
        className="text-center my-16"
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-4 rounded-full text-lg font-bold ${
            darkMode 
              ? 'bg-[#2A9D8F] text-white hover:bg-opacity-90' 
              : 'bg-[#1D3557] text-white hover:bg-opacity-90'
          } shadow-lg`}
        >
          <div className="flex items-center">
            <Calendar className="mr-2" size={20} />
            <span>Book a Demo</span>
          </div>
        </motion.button>
      </motion.div>
      
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full max-w-md p-8 rounded-xl shadow-xl ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
              aria-label="Close demo booking"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
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
                <h4 className="text-xl font-medium mb-2">Demo Scheduled!</h4>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  We've sent a confirmation email with all the details.
                </p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Looking forward to showing you Instipass in action!
                </p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Book a Demo</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    See how Instipass can transform your institution's ID management.
                  </p>
                </div>
                
                {/* Progress indicator */}
                <div className="flex justify-between mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= i 
                          ? 'bg-[#2A9D8F] text-white' 
                          : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {i}
                      </div>
                      <span className={`text-xs mt-1 ${
                        step >= i 
                          ? darkMode ? 'text-white' : 'text-gray-800' 
                          : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {i === 1 ? 'Info' : i === 2 ? 'Institution' : 'Schedule'}
                      </span>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2A9D8F]' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1D3557]'
                          } focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#2A9D8F]`}
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
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
                        type="button"
                        onClick={nextStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-4 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center"
                      >
                        <span>Next</span>
                        <ArrowRight size={16} className="ml-2" />
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Institution Info */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="mb-4">
                        <label htmlFor="institution" className="block text-sm font-medium mb-2">Institution Name</label>
                        <input
                          type="text"
                          id="institution"
                          name="institution"
                          value={formData.institution}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2A9D8F]' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1D3557]'
                          } focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#2A9D8F]`}
                          placeholder="University of Excellence"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="size" className="block text-sm font-medium mb-2">Institution Size</label>
                        <select
                          id="size"
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2A9D8F]' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1D3557]'
                          } focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#2A9D8F]`}
                        >
                          <option value="">Select size</option>
                          <option value="small">Small (Under 1,000 students)</option>
                          <option value="medium">Medium (1,000-5,000 students)</option>
                          <option value="large">Large (5,000-15,000 students)</option>
                          <option value="xlarge">Very Large (15,000+ students)</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-4">
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-1/2 py-3 px-4 rounded-lg font-medium transition-colors border ${
                            darkMode 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Back
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          onClick={nextStep}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-1/2 py-3 px-4 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center"
                        >
                          <span>Next</span>
                          <ArrowRight size={16} className="ml-2" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Schedule */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium mb-2">Preferred Date</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                          </div>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2A9D8F]' 
                                : 'bg-white border-gray-300 text-gray-900 focus:border-[#1D3557]'
                            } focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#2A9D8F]`}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="time" className="block text-sm font-medium mb-2">Preferred Time</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                          </div>
                          <select
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-[#2A9D8F]' 
                                : 'bg-white border-gray-300 text-gray-900 focus:border-[#1D3557]'
                            } focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#2A9D8F]`}
                          >
                            <option value="">Select time</option>
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-1/2 py-3 px-4 rounded-lg font-medium transition-colors border ${
                            darkMode 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Back
                        </motion.button>
                        
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-1/2 py-3 px-4 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                        >
                          Schedule Demo
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default BookDemoModal;
