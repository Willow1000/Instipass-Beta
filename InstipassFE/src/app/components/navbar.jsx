"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, CreditCard } from 'lucide-react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('instipass-theme', !darkMode ? 'dark' : 'light');
      
      // Emit an event so other components can react to theme change
      const event = new CustomEvent('themeChange', { detail: { darkMode: !darkMode } });
      window.dispatchEvent(event);
    }
  };
  
  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  return (
    <nav className={`sticky top-0 z-50 px-6 py-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#1D3557] text-white flex items-center justify-center mr-3">
            <CreditCard size={20} />
          </div>
          <span className="text-xl font-bold text-[#1D3557]">Instipass</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-[#2A9D8F] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#2A9D8F] transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-[#2A9D8F] transition-colors">Testimonials</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link href="/login" className="px-4 py-2 rounded-md bg-[#1D3557] text-white hover:bg-opacity-90 transition-colors">
            Sign In
          </Link>
          
          <Link href="/register" className="px-4 py-2 rounded-md bg-[#2A9D8F] text-white hover:bg-opacity-90 transition-colors">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
