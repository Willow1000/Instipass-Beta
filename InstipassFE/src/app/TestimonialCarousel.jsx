import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialCarousel = ({ darkMode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  
  const testimonials = [
    {
      quote: "The dashboard provides incredible insights. We've improved our ID management efficiency significantly.",
      author: "IT Director",
      institution: "Rift Valley Institute",
      rating: 4.5,
      initials: "RV"
    },
    {
      quote: "Instipass has revolutionized how we handle student identification. The digital IDs are secure, easy to verify, and our students love them.",
      author: "Dean of Students",
      institution: "Westlake University",
      rating: 5,
      initials: "WU"
    },
    {
      quote: "The implementation was seamless and the support team was exceptional. Our campus security has improved dramatically since adopting Instipass.",
      author: "Security Administrator",
      institution: "Northridge College",
      rating: 4.5,
      initials: "NC"
    },
    {
      quote: "We've reduced our ID production costs by 75% while providing a more convenient solution for our students. It's been a win-win for everyone.",
      author: "Finance Director",
      institution: "Eastern Technical Institute",
      rating: 5,
      initials: "ET"
    }
  ];
  
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, activeIndex]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  return (
    <section id="testimonials" className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Hear from institutions that have transformed their ID management with Instipass.
          </p>
        </motion.div>
        
        <div 
          className="max-w-3xl mx-auto relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mx-4`}>
                    <div className="flex mb-4">
                      {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                        <Star key={i} size={20} className="text-yellow-400" fill="currentColor" />
                      ))}
                      {testimonial.rating % 1 === 0.5 && (
                        <div className="relative">
                          <Star size={20} className="text-yellow-400" fill="currentColor" />
                          <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-100 opacity-80"></div>
                        </div>
                      )}
                    </div>
                    <blockquote className="mb-6 text-lg italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[#1D3557] text-white flex items-center justify-center mr-4">
                        <span className="font-bold">{testimonial.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.author}</h4>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{testimonial.institution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className={`absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            } shadow-lg flex items-center justify-center z-10 focus:outline-none`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} className="text-[#1D3557]" />
          </button>
          
          <button 
            onClick={nextSlide}
            className={`absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            } shadow-lg flex items-center justify-center z-10 focus:outline-none`}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} className="text-[#1D3557]" />
          </button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === activeIndex 
                    ? 'bg-[#2A9D8F]' 
                    : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
