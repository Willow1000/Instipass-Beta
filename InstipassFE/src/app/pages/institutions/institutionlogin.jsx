"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, Lock, Mail, AlertCircle, WifiOff, Server, Clock } from 'lucide-react';
import Cookies from 'js-cookie'; // Import js-cookie library for cookie management

const InstitutionLogin = () => {
  const router = useRouter(); // Initialize router for navigation
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student'); // 'student' or 'institution'
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [errorIcon, setErrorIcon] = useState(<AlertCircle />);

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

  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };

  // Function to set refresh token as a secure cookie
  const setRefreshTokenCookie = (refreshToken) => {
    // Set cookie with secure attributes
    // httpOnly: true - Cannot be accessed by JavaScript
    // secure: true - Only sent over HTTPS
    // sameSite: 'strict' - Prevents CSRF attacks
    // expires: 7 days (or match your refresh token expiry time)
    
    // Note: js-cookie doesn't support httpOnly as it's set server-side
    // For client-side, we can set other security attributes
    Cookies.set('refresh_token', refreshToken, {
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      sameSite: 'strict',
      expires: 7, // 7 days, adjust to match your refresh token expiry
      path: '/' // Available across the site
    });
    
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setAuthError('');
      setErrorIcon(<AlertCircle />);
      
      try {
        // Set up timeout for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        // Make API call to authentication endpoint
        const response = await fetch("http://127.0.0.1:8000/institution/api/token/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            password, 
            userType 
          }),
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId);
        });
        
        // Parse the response to get tokens or error message
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          
          setErrorIcon(<Server />);
          throw new Error('Server returned an invalid response. Please try again later.');
        }
        
        if (!response.ok) {
          // Handle specific API error responses
          if (response.status === 401 || response.status === 400) {
            setErrorIcon(<AlertCircle />);
            throw new Error('Invalid email or password');
          } else if (response.status === 403) {
            setErrorIcon(<AlertCircle />);
            throw new Error('Access forbidden. You do not have permission to log in.');
          } else if (response.status === 404) {
            setErrorIcon(<Server />);
            throw new Error('Authentication service not found. Please contact support.');
          } else if (response.status === 429) {
            setErrorIcon(<Clock />);
            throw new Error('Too many login attempts. Please try again later.');
          } else if (response.status >= 500) {
            setErrorIcon(<Server />);
            throw new Error('Server error. Please try again later or contact support.');
          } else if (data.detail) {
            setErrorIcon(<AlertCircle />);
            throw new Error(data.detail);
          } else if (data.error) {
            setErrorIcon(<AlertCircle />);
            throw new Error(data.error);
          } else {
            setErrorIcon(<AlertCircle />);
            throw new Error('Authentication failed. Please try again later.');
          }
        }
        
        // Check if access token exists in the response
        if (data.access) {
          // Store ONLY the access token in localStorage
          localStorage.setItem('access_token', data.access);
          
          // Log the access token to console as requested
          
          // Store refresh token as a cookie if it exists in the response
          if (data.refresh) {
            setRefreshTokenCookie(data.refresh);
       
          } else {
            
          }
          
        
          
          // Redirect to institution/ path after successful login
          router.push('/institution/');
          
          // Alternative redirect method if router doesn't work in your setup
          // window.location.href = '/institution/';
        } else {
          setErrorIcon(<AlertCircle />);
          throw new Error('Access token not found in response');
        }
      } catch (error) {
       
        
        // Handle specific error types
        if (error.name === 'AbortError') {
          setErrorIcon(<Clock />);
          setAuthError('Request timed out. Please check your connection and try again.');
        } else if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
          setErrorIcon(<WifiOff />);
          setAuthError('Network error. Please check your internet connection.');
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          setErrorIcon(<WifiOff />);
          setAuthError('Unable to connect to the authentication server. Please check if the server is running.');
        } else {
          setAuthError(error.message || 'Failed to authenticate. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  // Function to retry connection if server is down
  const retryConnection = () => {
    setAuthError('');
    setIsLoading(true);
    
    // Simple ping to check if server is available
    fetch("http://127.0.0.1:8000/", { 
      method: 'HEAD',
      cache: 'no-store'
    })
    .then(response => {
      if (response.ok) {
        setAuthError('Server is now available. Please try logging in again.');
        setErrorIcon(<AlertCircle />);
      } else {
        setAuthError('Server is still unavailable. Please try again later.');
        setErrorIcon(<Server />);
      }
    })
    .catch(error => {
      setAuthError('Server is still unavailable. Please try again later.');
      setErrorIcon(<WifiOff />);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 w-full max-w-md mx-4`}
      >
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-2`}>Welcome Back</h1>
          <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {authError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-start"
            >
              <span className="mr-2 mt-0.5 flex-shrink-0">{errorIcon}</span>
              <div>
                <span>{authError}</span>
                {(authError.includes('Unable to connect') || authError.includes('Server is still unavailable')) && (
                  <button 
                    type="button"
                    onClick={retryConnection}
                    className="block mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Check server status
                  </button>
                )}
              </div>
            </motion.div>
          )}
          
          <div className="mb-5">
            <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                placeholder="Enter your email"
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                placeholder="Enter your password"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2A9D8F]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className={`h-4 w-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded focus:ring-[#2A9D8F] text-[#2A9D8F]`}
              />
              <label htmlFor="remember" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Remember me
              </label>
            </div>
            <a href="http://127.0.0.1:8000/password-reset/" className="text-sm text-[#2A9D8F] hover:underline" target='_blank'>
              Forgot password?
            </a>
          </div>
          
          
          
          <motion.button 
            type="submit" 
            className="w-full py-3 px-4 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2" size={18} />
                Sign In
              </>
            )}
          </motion.button>
          
          {/* <div className="relative flex items-center justify-center mt-8 mb-4">
            <div className={`flex-grow border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
            <span className={`mx-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>OR</span>
            <div className={`flex-grow border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          </div> */}
          
          
          
          {/* <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account? <Link href="/institution/signup" className="text-[#2A9D8F] hover:underline">Sign up</Link>
          </p> */}
        </form>
      </motion.div>
    </div>
  );
};

export default InstitutionLogin;
