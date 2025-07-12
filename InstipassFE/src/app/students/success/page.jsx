"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Smartphone, CreditCard, Download, QrCode, ArrowRight, Mail, Bell, User, Shield, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import AccessTokenProtectedPage from '../../components/AccessTokenProtectedPage'

const StudentSignupSuccessPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const nextSteps = [
    {
      icon: <Smartphone className="text-[#2A9D8F]" size={24} />,
      title: "Download the App",
      description: "Get the Instipass mobile app to access your digital student ID anywhere, anytime.",
      action: "Download Now",
      highlight: true
    },
    {
      icon: <User className="text-[#2A9D8F]" size={24} />,
      title: "Complete Your Profile",
      description: "Add your photo and verify your information to activate your digital ID.",
      action: "Complete Profile"
    },
    {
      icon: <QrCode className="text-[#2A9D8F]" size={24} />,
      title: "Get Your Digital ID",
      description: "Your unique QR code and digital student ID will be ready to use immediately.",
      action: "View ID"
    },
    {
      icon: <Bell className="text-[#2A9D8F]" size={24} />,
      title: "Enable Notifications",
      description: "Stay updated with important announcements and campus events.",
      action: "Enable Now"
    }
  ];

  const benefits = [
    {
      icon: <CreditCard className="text-[#1D3557]" size={32} />,
      title: "Digital Student ID",
      description: "Your student ID is now always in your pocket - no more lost or forgotten cards!"
    },
    {
      icon: <Shield className="text-[#1D3557]" size={32} />,
      title: "Secure Access",
      description: "Enhanced security with QR codes and biometric verification options"
    },
    {
      icon: <Star className="text-[#1D3557]" size={32} />,
      title: "Campus Integration",
      description: "Use your digital ID for library access, dining, events, and more"
    }
  ];

  const appFeatures = [
    "📱 Instant access to your student ID",
    "🎫 Digital event tickets and passes",
    "📚 Library card integration",
    "🍽️ Dining hall access",
    "🚌 Campus transportation",
    "📢 Important notifications"
  ];

  return (
    <AccessTokenProtectedPage>
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b border-gray-200 dark:border-gray-700`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[#1D3557] dark:text-[#2A9D8F]">
              Instipass
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Student Portal
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-[#2A9D8F] bg-opacity-10 rounded-full mb-8"
          >
            <CheckCircle className="text-[#2A9D8F]" size={48} />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to <span className="text-[#2A9D8F]">Instipass!</span>
          </h1>
          
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            🎉 Congratulations! You've successfully joined Instipass. Your digital student life starts now - 
            no more worrying about lost ID cards or forgotten passes!
          </p>
          
          <div className={`inline-flex items-center px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700`}>
            <Heart className="text-[#2A9D8F] mr-3" size={20} />
            <span className="font-medium">Account Created Successfully</span>
          </div>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started in 4 Easy Steps</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Follow these simple steps to start using your digital student ID
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className={`p-6 rounded-xl ${step.highlight ? 'bg-gradient-to-br from-[#2A9D8F] to-[#1D3557] text-white' : darkMode ? 'bg-gray-800' : 'bg-gray-50'} ${!step.highlight && 'border border-gray-200 dark:border-gray-700'} hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 ${step.highlight ? 'bg-white bg-opacity-20' : 'bg-[#2A9D8F] bg-opacity-10'} rounded-lg mr-4`}>
                    {step.icon}
                  </div>
                  <div className={`flex items-center justify-center w-8 h-8 ${step.highlight ? 'bg-white text-[#1D3557]' : 'bg-[#1D3557] text-white'} rounded-full text-sm font-bold`}>
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className={`text-sm mb-4 ${step.highlight ? 'text-white text-opacity-90' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {step.description}
                </p>
                <button className={`flex items-center ${step.highlight ? 'text-white' : 'text-[#2A9D8F]'} font-medium hover:opacity-80 transition-opacity`}>
                  {step.action}
                  <ArrowRight className="ml-1" size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* App Download Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-50 to-white'} border border-gray-200 dark:border-gray-700 mb-16`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">📱 Download the Instipass App</h2>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get instant access to your digital student ID and enjoy all the features that make campus life easier.
              </p>
              
              <div className="space-y-3 mb-6">
                {appFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <span className="text-lg mr-3">{feature.split(' ')[0]}</span>
                    <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="mr-2" size={20} />
                  Download for iOS
                </motion.button>
                <motion.button
                  className="flex items-center justify-center px-6 py-3 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-[#1D3557] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="mr-2" size={20} />
                  Download for Android
                </motion.button>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`inline-block p-8 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                <div className="w-48 h-48 bg-gradient-to-br from-[#1D3557] to-[#2A9D8F] rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <QrCode className="text-white" size={80} />
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Scan to download the app
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What You Can Do Now</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover all the amazing features available with your new digital student ID
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className={`text-center p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}
              >
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-[#1D3557] bg-opacity-10 rounded-lg">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Support Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border border-gray-200 dark:border-gray-700`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We're here to help you get the most out of your Instipass experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg">
                  <Mail className="text-[#2A9D8F]" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Student Support</h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get help with your account and app
              </p>
              <a 
                href="mailto:students@instipass.com" 
                className="text-[#2A9D8F] font-medium hover:text-[#1D3557] transition-colors"
              >
                students@instipass.com
              </a>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-[#2A9D8F] bg-opacity-10 rounded-lg">
                  <User className="text-[#2A9D8F]" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Campus IT Help</h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Contact your campus IT support
              </p>
              <button className="text-[#2A9D8F] font-medium hover:text-[#1D3557] transition-colors">
                Find Campus Support
              </button>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/student/profile" passHref>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#1D3557] to-[#2A9D8F] text-white text-lg font-medium rounded-lg shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Complete Your Profile
                <ArrowRight className="inline ml-2" size={20} />
              </motion.button>
            </Link>
            
            <Link href="/student/id" passHref>
              <motion.button
                className={`px-8 py-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} text-lg font-medium rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg`}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                View My Digital ID
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-t border-gray-200 dark:border-gray-700 mt-16`}>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#1D3557] dark:text-[#2A9D8F] mb-4">
              Instipass
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Your digital campus life starts here
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              © 2024 Instipass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </AccessTokenProtectedPage>
  );
};

export default StudentSignupSuccessPage;

