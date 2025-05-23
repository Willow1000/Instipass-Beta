"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // 'student' or 'institution'

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, userType });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#1D3557] mb-6">Sign In</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          
          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
            <div className="flex border border-[#1D3557] rounded-full overflow-hidden">
              <div 
                className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                  userType === 'student' 
                    ? 'bg-[#1D3557] text-white' 
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => setUserType('student')}
              >
                Student
              </div>
              <div 
                className={`flex-1 py-2 text-center cursor-pointer transition-colors ${
                  userType === 'institution' 
                    ? 'bg-[#1D3557] text-white' 
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => setUserType('institution')}
              >
                Institution
              </div>
            </div>
          </div> */}
          
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-[#2A9D8F] text-white rounded-md font-medium hover:bg-[#238276] focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
          
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-[#1D3557] hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <Link href="/register" className="text-[#1D3557] font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
