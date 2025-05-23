"use client"

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Cloud, Lock, Cog, CheckCircle, University, Users, CreditCard, Star } from 'lucide-react';
import Link from 'next/link';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ParallaxHero from './ParallaxHero';

// Lazy load components for performance
const FAQSection = lazy(() => import('./FAQSection'));
const TestimonialCarousel = lazy(() => import('./TestimonialCarousel'));
const ClientLogos = lazy(() => import('./ClientLogos'));
const NewsletterSignup = lazy(() => import('./NewsletterSignup'));
const BookDemoModal = lazy(() => import('./BookDemoModal'));

// Skeleton loaders
const SkeletonLoader = ({ type, darkMode }) => {
  const bgColor = darkMode ? 'bg-gray-700' : 'bg-gray-200';
  
  if (type === 'text') {
    return (
      <div className="animate-pulse space-y-2">
        <div className={`h-4 ${bgColor} rounded w-3/4`}></div>
        <div className={`h-4 ${bgColor} rounded`}></div>
        <div className={`h-4 ${bgColor} rounded w-5/6`}></div>
      </div>
    );
  }
  
  if (type === 'card') {
    return (
      <div className="animate-pulse">
        <div className={`h-48 ${bgColor} rounded-lg mb-4`}></div>
        <div className={`h-4 ${bgColor} rounded w-3/4 mb-2`}></div>
        <div className={`h-4 ${bgColor} rounded mb-2`}></div>
        <div className={`h-4 ${bgColor} rounded w-5/6`}></div>
      </div>
    );
  }
  
  return null;
};

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [counters, setCounters] = useState({
    institutions: 0,
    students: 0,
    ids: 0,
    satisfaction: 0
  });
  
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
  
  // Animate counters
  useEffect(() => {
    const targetValues = {
      institutions: 50,
      students: 10000,
      ids: 8500,
      satisfaction: 99
    };
    
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setCounters({
        institutions: Math.floor(progress * targetValues.institutions),
        students: Math.floor(progress * targetValues.students),
        ids: Math.floor(progress * targetValues.ids),
        satisfaction: Math.floor(progress * targetValues.satisfaction)
      });
      
      if (frame === totalFrames) {
        clearInterval(timer);
        setCounters(targetValues);
      }
    }, frameDuration);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-x-hidden`}>
      {/* Navbar Component */}
      <Navbar />
      
      <main className="flex-grow overflow-x-hidden">
        {/* Hero Section with Animated Particle Background */}
        <ParallaxHero darkMode={darkMode} />
        
        {/* Student ID Card Section */}
        <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Your Digital Student ID</h2>
              <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Access your student ID anytime, anywhere with just a few taps. No more physical cards to lose or forget.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full max-w-md">
                <motion.div 
                  className="absolute -top-4 -left-4 w-full h-full rounded-xl bg-[#2A9D8F] opacity-20"
                  animate={{ 
                    boxShadow: ["0px 0px 0px rgba(42, 157, 143, 0.3)", "0px 0px 20px rgba(42, 157, 143, 0.6)", "0px 0px 0px rgba(42, 157, 143, 0.3)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                <motion.div 
                  className="relative bg-white p-6 rounded-xl shadow-lg"
                  whileHover={{ y: -5, boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-[#1D3557] text-white p-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">STUDENT ID</h3>
                        <p className="text-sm text-gray-300">Valid until: 06/2026</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center">
                          <span className="font-bold">IP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserPlus size={32} className="text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1D3557]">John Doe</h4>
                      <p className="text-gray-600">Computer Science</p>
                      <p className="text-gray-600">ID: 1234567890</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-100 rounded-b-lg flex justify-between items-center">
                    <div className="w-16 h-16">
                      {/* QR Code placeholder */}
                      <div className="w-full h-full bg-white border-2 border-gray-300 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-400">QR Code</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Scan to verify</p>
                      <p className="text-xs text-gray-500">Powered by Instipass</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Features</h2>
              <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Discover how Instipass can transform your institution's ID management system with these powerful features.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <UserPlus size={48} className="text-[#2A9D8F]" />,
                  title: "Personalized ID",
                  description: "Create and manage personalized student IDs, and ensure quick access through a simple, intuitive interface."
                },
                {
                  icon: <Cloud size={48} className="text-[#2A9D8F]" />,
                  title: "Cloud-Based Storage",
                  description: "Store and access your ID anytime, anywhere in a secure, cloud-based environment with seamless synchronization across devices."
                },
                {
                  icon: <Lock size={48} className="text-[#2A9D8F]" />,
                  title: "Enhanced Security",
                  description: "Ensure the security of your digital ID through advanced encryption and secure access protocols."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: darkMode 
                      ? "0 10px 25px rgba(0, 0, 0, 0.3)" 
                      : "0 10px 25px rgba(0, 0, 0, 0.1)"
                  }}
                  className={`p-6 rounded-xl text-center transition-all duration-300 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Our simple three-step process makes digital ID management effortless for both institutions and students.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <UserPlus size={48} className="text-[#2A9D8F]" />,
                  title: "Step 1: Create Profile",
                  description: "Students create their profile by entering essential details, including their name, photo, and student ID number."
                },
                {
                  icon: <Cog size={48} className="text-[#2A9D8F]" />,
                  title: "Step 2: ID Generation",
                  description: "The system generates a digital ID based on the student's profile and institution's preferences, ensuring accurate and up-to-date information."
                },
                {
                  icon: <CheckCircle size={48} className="text-[#2A9D8F]" />,
                  title: "Step 3: Access Anywhere",
                  description: "Students can access their digital ID from their device at any time, whether for campus access, exams, or other student services."
                }
              ].map((step, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center"
                >
                  <motion.div 
                    className="mb-4 flex justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <Suspense fallback={
          <div className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
                <SkeletonLoader type="text" darkMode={darkMode} />
              </div>
              <div className="max-w-3xl mx-auto">
                <SkeletonLoader type="card" darkMode={darkMode} />
              </div>
            </div>
          </div>
        }>
          <TestimonialCarousel darkMode={darkMode} />
        </Suspense>
        
        {/* Stats Section */}
        <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-x-hidden`}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <University size={32} className="text-[#2A9D8F]" />,
                  value: counters.institutions,
                  label: "Partner Institutions"
                },
                {
                  icon: <Users size={32} className="text-[#2A9D8F]" />,
                  value: counters.students,
                  label: "Active Students"
                },
                {
                  icon: <CreditCard size={32} className="text-[#2A9D8F]" />,
                  value: counters.ids,
                  label: "IDs Issued"
                },
                {
                  icon: <CheckCircle size={32} className="text-[#2A9D8F]" />,
                  value: counters.satisfaction,
                  label: "Satisfaction Rate (%)"
                }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-[#2A9D8F] bg-opacity-10 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold text-[#1D3557] mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    {stat.value.toLocaleString()}
                  </motion.h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <Suspense fallback={
          <div className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <SkeletonLoader type="text" darkMode={darkMode} />
              </div>
              <div className="max-w-3xl mx-auto space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <SkeletonLoader type="text" darkMode={darkMode} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }>
          <FAQSection darkMode={darkMode} />
        </Suspense>
        
        {/* Client Logos Section */}
        <Suspense fallback={
          <div className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Trusted by Leading Institutions</h2>
                <SkeletonLoader type="text" darkMode={darkMode} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className={`h-32 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`}></div>
                ))}
              </div>
            </div>
          </div>
        }>
          <ClientLogos darkMode={darkMode} />
        </Suspense>
        
        {/* Book Demo Section */}
        <Suspense fallback={
          <div className="text-center my-16 overflow-x-hidden">
            <div className={`h-12 w-48 rounded-full mx-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
          </div>
        }>
          <BookDemoModal darkMode={darkMode} />
        </Suspense>
        
        {/* CTA Section - Using original design with enhanced animations */}
        <section className="py-16 px-6 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`container mx-auto rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] max-w-full`}
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-8 md:mb-0 md:mr-8">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                  >
                    Ready to Transform Your ID Management?
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-xl text-white text-opacity-90"
                  >
                    Join innovative institutions and streamline your student identification process today.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex-shrink-0"
                >
                  <motion.a 
                    href="/register" 
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white text-[#1D3557] font-bold rounded-full hover:bg-gray-100 transition-all inline-block"
                  >
                    <div className="flex items-center">
                      <UserPlus size={20} className="mr-2" />
                      <span>Get Started</span>
                    </div>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      
      {/* Newsletter Signup */}
      <Suspense fallback={null}>
        <NewsletterSignup darkMode={darkMode} />
      </Suspense>
      
      {/* Footer Component */}
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default HomePage;
