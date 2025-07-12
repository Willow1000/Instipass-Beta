"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown, ChevronUp, Users, Eye, Mail, MessageSquare, Check, Shield, Clock, Zap, Award, Star, BarChart, Building, Phone, Calendar, AlertCircle } from 'lucide-react';
import Navbar from '../components/aboutNavbar';
import Footer from '../components/aboutFooter';
import dynamic from 'next/dynamic';

// Dynamically import BookDemoModal with ssr: false to prevent hydration issues
const BookDemoModal = dynamic(() => import('../BookDemoModal'), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 rounded-lg shadow-xl bg-white animate-pulse">
        <div className="h-64 w-full"></div>
      </div>
    </div>
  )
});

const AboutPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    fingerprint: null // Added fingerprint field
  });
  const [formErrors, setFormErrors] = useState({});
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const contactRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Added states for form submission status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', or null
  const [submissionMessage, setSubmissionMessage] = useState('');
  
  // Particle animation
  const particlesRef = useRef(null);
  const fingerprintScriptLoaded = useRef(false); // Track if fingerprint script is loaded

  // Load FingerprintJS and generate fingerprint
  useEffect(() => {
    const loadFingerprintJS = () => {
      if (fingerprintScriptLoaded.current) return;
      
      // Create script element
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js';
      script.async = true;
      
      script.onload = async () => {
        fingerprintScriptLoaded.current = true;
        try {
          // Initialize FingerprintJS
          const FingerprintJS = window.FingerprintJS;
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          
          // Update form data with fingerprint
          setFormData(prevData => ({
            ...prevData,
            fingerprint: result.visitorId
          }));
          
          console.log('Fingerprint generated successfully');
        } catch (error) {
          console.warn('Fingerprinting failed, continuing without fingerprint:', error);
        }
      };
      
      script.onerror = () => {
        console.warn('Failed to load fingerprint script');
      };
      
      // Add script to document
      document.head.appendChild(script);
    };
    
    loadFingerprintJS();
    
    // Cleanup function
    return () => {
      if (fingerprintScriptLoaded.current) {
        const script = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"]');
        if (script) {
          document.head.removeChild(script);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!particlesRef.current) return;
    
    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create particles
    const particlesArray = [];
    const numberOfParticles = 30;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(42, 157, 143, 0.2)';
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [darkMode]);
  
  // Initialize dark mode from localStorage and listen for theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
      
      // Listen for theme changes from Navbar
      const handleThemeChange = (event) => {
        setDarkMode(event.detail.darkMode);
      };
      
      window.addEventListener('themeChange', handleThemeChange);
      return () => {
        window.removeEventListener('themeChange', handleThemeChange);
      };
    }
  }, []);
  
  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: ''
      });
    }
  };
  
  // Function to send message to the API endpoint
  const sendMessageToAPI = async (messageData) => {
    try {
      // Set up timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch("http://127.0.0.1:8000/super/api/contactus/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
        signal: controller.signal
      }).finally(() => {
        clearTimeout(timeoutId);
      });
      
      // Parse the response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Server returned an invalid response. Please try again later.');
      }
      
      // Check if the request was successful
      if (!response.ok) {
        // Handle specific API error responses
        if (response.status === 400) {
          if (data.detail) {
            throw new Error(data.detail);
          } else if (data.error) {
            throw new Error(data.error);
          } else if (data.message) {
            throw new Error(data.message);
          } else {
            throw new Error('Invalid form data. Please check your inputs and try again.');
          }
        } else if (response.status === 401 || response.status === 403) {
          throw new Error('You do not have permission to submit this form.');
        } else if (response.status === 404) {
          throw new Error('Contact service not found. Please try again later.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later or contact support.');
        } else {
          throw new Error('An error occurred while submitting your message. Please try again.');
        }
      }
      
      return data;
    } catch (error) {
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      } else if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection.');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please try again later.');
      } else {
        throw error; // Re-throw the error to be handled by the caller
      }
    }
  };
  
  const validateForm = async (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    if (Object.keys(errors).length === 0) {
      // Form is valid, proceed with submission
      setIsSubmitting(true);
      setSubmissionStatus(null);
      setSubmissionMessage('');
      
      try {
        // Send the message to the API
        const dataToSend = {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          fingerprint: formData.fingerprint // Added fingerprint to dataToSend
        };
        const result = await sendMessageToAPI(dataToSend);
        
        // Handle successful submission
        setSubmissionStatus('success');
        setSubmissionMessage(result.message || 'Your message has been sent successfully! We will get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          fingerprint: formData.fingerprint // Keep the fingerprint
        });
        
        // Set form as submitted for UI feedback
        setFormSubmitted(true);
        
        // Reset form submission status after 5 seconds
        setTimeout(() => {
          setFormSubmitted(false);
          setSubmissionStatus(null);
          setSubmissionMessage('');
        }, 5000);
      } catch (error) {
        // Handle submission error
        console.error('Form submission error:', error);
        setSubmissionStatus('error');
        setSubmissionMessage(error.message || 'An error occurred while submitting your message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };
  
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Product features data
  const features = [
    {
      title: "Digital Pass Management",
      description: "Create, distribute, and validate digital passes for students, staff, and visitors with QR code technology that eliminates paper waste and reduces administrative overhead by up to 85%.",
      icon: <Eye size={24} />,
      color: "#2A9D8F",
      image: "/images/digital-pass-demo.png"
    },
    {
      title: "Real-time Analytics Dashboard",
      description: "Track pass usage patterns, peak times, and facility utilization with comprehensive analytics that help institutions optimize resource allocation and improve security protocols.",
      icon: <BarChart size={24} />,
      color: "#1D3557",
      image: "/images/analytics-dashboard.png"
    },
    {
      title: "Automated Approval Workflows",
      description: "Streamline approval processes with customizable workflows that route pass requests to the appropriate authorities based on your institution's hierarchy and security requirements.",
      icon: <Check size={24} />,
      color: "#E76F51",
      image: "/images/approval-workflow.png"
    },
    {
      title: "Secure Verification System",
      description: "Prevent unauthorized access with our military-grade encryption and blockchain verification that makes passes impossible to forge while maintaining GDPR and FERPA compliance.",
      icon: <Shield size={24} />,
      color: "#457B9D",
      image: "/images/secure-verification.png"
    },
    {
      title: "Multi-platform Accessibility",
      description: "Access passes from any device with our responsive web app and native mobile applications for iOS and Android, ensuring seamless experiences for all users regardless of technology.",
      icon: <Zap size={24} />,
      color: "#F4A261",
      image: "/images/multi-platform.png"
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      name: "Dr. Emily Richardson",
      role: "Dean of Student Affairs, Westlake University",
      quote: "InstiPass transformed our campus security protocols. We've reduced unauthorized entries by 94% while making the experience more convenient for our students and faculty.",
      logo: "/images/westlake-logo.png"
    },
    {
      name: "Robert Chen",
      role: "CTO, National Science Institute",
      quote: "The analytics capabilities alone justified our investment. We've optimized staffing at entry points and saved over $120,000 annually in operational costs.",
      logo: "/images/nsi-logo.png"
    },
    {
      name: "Maria Gonzalez",
      role: "Director of Security, Eastwood Medical Center",
      quote: "In healthcare, security is non-negotiable. InstiPass gives us enterprise-grade protection with consumer-grade usability. Our staff and patients love it.",
      logo: "/images/eastwood-logo.png"
    }
  ];
  
  // Team members with expanded information
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "With over 10 years of experience in EdTech and institutional security systems, Alex founded InstiPass after witnessing firsthand the inefficiencies of paper-based pass systems while serving as Director of Operations at Stanford University.",
      expertise: ["Institutional Operations", "EdTech Innovation", "Security Systems"],
      linkedin: "https://linkedin.com/in/alexjohnson"
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      bio: "Sarah brings 8 years of software development expertise, specializing in secure authentication systems. Previously at Microsoft's Identity Protection division, she architected solutions used by over 50 million users globally.",
      expertise: ["Secure Authentication", "Blockchain", "Mobile Development"],
      linkedin: "https://linkedin.com/in/sarahchen"
    },
    {
      name: "Michael Rodriguez",
      role: "UX Designer",
      bio: "Michael is passionate about creating intuitive user experiences that make technology accessible to everyone. His previous work for the NYC Department of Education improved digital accessibility for over 1.1 million students.",
      expertise: ["Accessibility Design", "User Research", "Educational UX"],
      linkedin: "https://linkedin.com/in/michaelrodriguez"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Chief Security Officer",
      bio: "With a Ph.D. in Cybersecurity from MIT and 12 years at the Department of Defense, Dr. Patel ensures InstiPass meets the highest security standards while maintaining seamless user experiences.",
      expertise: ["Cryptography", "Threat Analysis", "Compliance"],
      linkedin: "https://linkedin.com/in/aishapatel"
    }
  ];
  
  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-x-hidden`}>
      {/* Navbar Component */}
      <Navbar />
      
      {/* Fixed Book Demo Button */}
      <div className="fixed right-6 top-24 z-40">
        <motion.button
          onClick={() => setIsBookDemoOpen(true)}
          className={`flex items-center px-4 py-2  font-medium rounded-lg shadow-lg bg-transparent  ${darkMode ?  'text-white' :  'text-black'} hover:bg-[#2A9D8F] hover:text-white`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Calendar className="mr-2" size={18} />
          Book Demo
        </motion.button>
      </div>
      
      <main className="flex-grow overflow-x-hidden">
        {/* Hero Section - Enhanced with more product details */}
        <section className={`relative py-20 ${darkMode ? 'bg-gray-800' : 'bg-[#1D3557]'} text-white overflow-hidden`}>
          {/* Animated background particles */}
          <canvas 
            ref={particlesRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 text-left md:pr-8"
              >
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Secure & Streamline <span className="text-[#2A9D8F]">Campus Access</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  InstiPass offers a comprehensive digital pass management system for educational institutions, enhancing security and efficiency.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    onClick={scrollToFeatures}
                    className="px-6 py-3 bg-[#E76F51] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Features
                  </motion.button>
                  <motion.button
                    onClick={() => setIsBookDemoOpen(true)}
                    className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-[#1D3557] transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book a Demo
                  </motion.button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
              >
                <img 
                  src="/images/hero-mockup.png" 
                  alt="InstiPass Digital Pass System Mockup" 
                  className="max-w-full h-auto rounded-lg shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <h2 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-4`}>Key Features</h2>
            <div className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col items-center text-center`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="p-4 rounded-full mb-6" style={{ backgroundColor: feature.color }}>
                    {React.cloneElement(feature.icon, { className: 'text-white' })}
                  </div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-4`}>{feature.title}</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission and Vision Section */}
        <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="text-center md:text-left"
              >
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-4`}>Our Mission</h2>
                <div className="w-24 h-1 bg-[#2A9D8F] mx-auto md:mx-0 mb-6"></div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed`}>
                  To empower educational institutions with cutting-edge digital solutions that enhance security, streamline operations, and create a safer, more efficient environment for students, staff, and visitors.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="text-center md:text-right"
              >
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-4`}>Our Vision</h2>
                <div className="w-24 h-1 bg-[#2A9D8F] mx-auto md:ml-auto md:mr-0 mb-6"></div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed`}>
                  To be the global leader in digital pass management, recognized for our innovative technology, unwavering commitment to security, and dedication to fostering seamless, secure, and sustainable campus ecosystems worldwide.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <h2 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-4`}>What Our Clients Say</h2>
            <div className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col items-center text-center`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <img src={testimonial.logo} alt={`${testimonial.name} logo`} className="h-16 mb-4" />
                  <p className={`text-lg italic ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>"{testimonial.quote}"</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-[#1D3557]'}`}>{testimonial.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="container mx-auto px-6">
            <h2 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-4`}>Meet Our Team</h2>
            <div className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} text-center`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <img 
                    src={`https://via.placeholder.com/150/${darkMode ? '334155' : 'F3F4F6'}/${darkMode ? 'FFFFFF' : '1D3557'}?text=${member.name.split(' ')[0]}`}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[#2A9D8F]"
                  />
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-2`}>{member.name}</h3>
                  <p className={`text-[#2A9D8F] font-medium mb-3`}>{member.role}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{member.bio}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {member.expertise.map((exp, expIndex) => (
                      <span key={expIndex} className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                        {exp}
                      </span>
                    ))}
                  </div>
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`text-[#2A9D8F] hover:underline flex items-center justify-center text-sm`}
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section ref={contactRef} className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <h2 className={`text-4xl font-bold text-center ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-4`}>Get in Touch</h2>
            <div className="w-24 h-1 bg-[#2A9D8F] mx-auto mb-12"></div>
            
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className={`lg:w-1/2 p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-6`}>Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Building className="text-[#2A9D8F] mr-4 flex-shrink-0" size={24} />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-[#1D3557]'}`}>Address:</p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>123 InstiPass Avenue, Innovation City, CA 90210</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="text-[#2A9D8F] mr-4 flex-shrink-0" size={24} />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-[#1D3557]'}`}>Phone:</p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="text-[#2A9D8F] mr-4 flex-shrink-0" size={24} />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-[#1D3557]'}`}>Email:</p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>info@instipass.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="text-[#2A9D8F] mr-4 flex-shrink-0" size={24} />
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-[#1D3557]'}`}>Business Hours:</p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Monday - Friday: 9:00 AM - 5:00 PM (PST)</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className={`lg:w-1/2 p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-6`}>Send Us a Message</h3>
                
                <AnimatePresence>
                  {submissionStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 mb-6 rounded-lg flex items-center ${submissionStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {submissionStatus === 'success' ? (
                        <Check className="w-5 h-5 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                      )}
                      <p className="text-sm font-medium">{submissionMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={validateForm} className="space-y-4">
                  {/* Hidden fingerprint field */}
                  <input type="hidden" name="fingerprint" id="fp-field" value={formData.fingerprint || ''} />

                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Your Name</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Your Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="message" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Your Message</label>
                    <textarea 
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors resize-y`}
                      placeholder="Tell us how we can help you..."
                      disabled={isSubmitting}
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#2A9D8F] hover:bg-opacity-90'} transition-colors shadow-md flex items-center justify-center`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Send className="mr-2" size={20} />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer Component */}
      <Footer />
      
      {/* Book Demo Modal */}
      <AnimatePresence>
        {isBookDemoOpen && (
          <BookDemoModal 
            isOpen={isBookDemoOpen} 
            onClose={() => setIsBookDemoOpen(false)} 
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;


