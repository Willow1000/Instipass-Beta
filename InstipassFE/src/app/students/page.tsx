"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TokenProtectedPage from '../components/TEST'

const StudentRegistrationForm = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    institution: null, // This will be set from token validation
    reg_no: '',
    first_name: '',
    last_name: '',
    course: '',
    admission_year: '',
    email: '',
    phone_number: '',
    photo: null,
    fingerprint: null // Added fingerprint field
    // status field removed as requested
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const fingerprintScriptLoaded = useRef(false);
  const tokenValidated = useRef(false);

  // Admission years based on model constraints (2020-current year)
  const currentYear = new Date().getFullYear();
  const ADMISSION_YEARS = Array.from(
    { length: currentYear - 2019 }, 
    (_, i) => 2020 + i
  ).filter(year => year <= 2025); // Max year is 2025 per model

  
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

  // Reset status message after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setFormErrors({
        ...formErrors,
        photo: 'Please select a valid image file (JPEG, PNG, GIF)'
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        photo: 'Image size should be less than 2MB'
      });
      return;
    }

    // Clear any previous errors
    if (formErrors.photo) {
      setFormErrors({
        ...formErrors,
        photo: ''
      });
    }

    // Update form data and preview
    setFormData({
      ...formData,
      photo: file
    });

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photo: null
    });
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Institution validation
    if (!formData.institution) {
      errors.institution = 'Institution data could not be loaded';
    }
    
    // Registration number validation
    if (!formData.reg_no.trim()) {
      errors.reg_no = 'Registration number is required';
    }
    
    // Name validation
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    // Course validation
    if (!formData.course.trim()) {
      errors.course = 'Course is required';
    }
    
    // Admission year validation
    if (!formData.admission_year) {
      errors.admission_year = 'Admission year is required';
    } else {
      const year = parseInt(formData.admission_year);
      if (isNaN(year) || year < 2020 || year > 2025) {
        errors.admission_year = 'Admission year must be between 2020 and 2025';
      }
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Phone number validation
    if (!formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone_number)) {
      errors.phone_number = 'Phone number format is invalid';
    }
    
    // Photo validation
    if (!formData.photo) {
      errors.photo = 'Photo is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage('');
      
      try {
        // Create FormData object for multipart/form-data (required for file upload)
        const formDataToSend = new FormData();
        
        // Append all form fields to FormData except 'status'
        Object.keys(formData).forEach(key => {
          // Skip the status field as requested
          if (key === 'status') {
            return;
          }
          
          if (key === 'photo') {
            if (formData.photo) {
              formDataToSend.append('photo', formData.photo);
            }
          } else if (formData[key] !== null && formData[key] !== undefined) {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        // Make API request - no authorization header needed
        const response = await fetch('http://127.0.0.1:8000/student/api/student/', {
          method: 'POST',
          body: formDataToSend
        });
        
        // Handle response based on status code
        if (response.ok) {
          const data = await response.json();
          console.log('Success:', data);
          setSubmitStatus('success');
          
          // Reset form after successful submission
          setFormData({
            institution: formData.institution, // Keep the institution ID
            reg_no: '',
            first_name: '',
            last_name: '',
            course: '',
            admission_year: '',
            email: '',
            phone_number: '',
            photo: null,
            fingerprint: formData.fingerprint // Keep the fingerprint
            // status field removed as requested
          });
          setPhotoPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          // Handle different error status codes
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 400) {
            // Bad request - validation errors
            const errorMessages = [];
            for (const key in errorData) {
              if (Array.isArray(errorData[key])) {
                errorMessages.push(`${key}: ${errorData[key].join(', ')}`);
              } else if (typeof errorData[key] === 'string') {
                errorMessages.push(`${key}: ${errorData[key]}`);
              }
            }
            throw new Error(errorMessages.join('\n') || 'Invalid form data. Please check your inputs.');
          } else if (response.status === 500) {
            // Server error
            throw new Error('Server error occurred. Please try again later.');
          } else {
            // Other errors
            throw new Error(`Error: ${response.status} - ${errorData.detail || 'Something went wrong'}`);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setSubmitStatus('error');
        setErrorMessage(error.message || 'Failed to submit form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  // Status alert component
  const StatusAlert = () => {
    if (!submitStatus) return null;
    
    if (submitStatus === 'success') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Registration submitted successfully!</span>
          </div>
        </motion.div>
      );
    } else {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700"
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="font-medium">Submission failed!</span>
              <p className="mt-1 text-sm whitespace-pre-line">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      );
    }
  };

  // Loading component
  // const LoadingOverlay = () => {
  //   if (!isLoading) return null;
    
  //   return (
  //     <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
  //       <div className="bg-white p-5 rounded-lg flex flex-col items-center">
  //         <svg className="animate-spin h-10 w-10 text-[#2A9D8F] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //         </svg>
  //         <p className="text-gray-700">Validating registration token...</p>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <TokenProtectedPage>
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 my-8 relative`}
      >
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#1D3557]'} mb-2`}>Student Registration</h1>
          <div className="w-16 h-1 bg-[#2A9D8F] mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Please provide your information to register</p>
        </div>
        
        {/* Loading Overlay */}
        {/* <LoadingOverlay /> */}
        
        {/* Status Alert */}
        <StatusAlert />
        
        <form onSubmit={handleSubmit} className="space-y-6" id="student-form">
          {/* Hidden fingerprint field */}
          <input type="hidden" name="fingerprint" id="fp-field" value={formData.fingerprint || ''} />
          
          {/* Personal Information Section */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-[#2A9D8F]' : 'text-[#1D3557]'}`}>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  disabled={isSubmitting }
                />
                {formErrors.first_name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  disabled={isSubmitting }
                />
                {formErrors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.last_name}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Academic Information Section */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-[#2A9D8F]' : 'text-[#1D3557]'}`}>
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg_no" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="reg_no"
                  name="reg_no"
                  value={formData.reg_no}
                  onChange={handleInputChange}
                  placeholder="Enter your registration number"
                  className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  disabled={isSubmitting }
                />
                {formErrors.reg_no && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.reg_no}</p>
                )}
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter your unique registration number</p>
              </div>
              <div>
                <label htmlFor="course" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Course <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="Enter your course"
                  className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  disabled={isSubmitting }
                />
                {formErrors.course && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.course}</p>
                )}
              </div>
              <div>
                <label htmlFor="admission_year" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Admission Year <span className="text-red-500">*</span>
                </label>
                <select 
                  id="admission_year"
                  name="admission_year"
                  value={formData.admission_year}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  disabled={isSubmitting }
                >
                  <option value="">Select Admission Year</option>
                  {ADMISSION_YEARS.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {formErrors.admission_year && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.admission_year}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Information Section */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-[#2A9D8F]' : 'text-[#1D3557]'}`}>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  disabled={isSubmitting }
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone_number" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors`}
                  disabled={isSubmitting }
                />
                {formErrors.phone_number && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone_number}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Photo Upload Section */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-[#2A9D8F]' : 'text-[#1D3557]'}`}>
              Photo Upload
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="photo" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Upload Photo <span className="text-red-500">*</span>
                </label>
                <input 
                  type="file" 
                  id="photo"
                  name="photo"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 ${darkMode ? 'file:bg-gray-600 file:text-white' : 'file:bg-blue-50 file:text-blue-700'}`}
                  disabled={isSubmitting }
                />
                {formErrors.photo && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.photo}</p>
                )}
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload a clear passport-sized photo (JPEG or PNG format)</p>
                
                <div className={`mt-4 w-40 h-40 rounded-lg overflow-hidden flex items-center justify-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} ${photoPreview ? '' : 'border-2 border-dashed'}`}>
                  {photoPreview ? (
                    <div className="relative w-full h-full">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isSubmitting }
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <i className={`bi bi-person-bounding-box text-4xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}></i>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Photo Preview</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <h5 className="font-semibold mb-3">
                    Photo Requirements
                  </h5>
                  <ul className="space-y-2 text-sm list-disc pl-5">
                    <li>Clear, recent passport-sized photo</li>
                    <li>Plain background</li>
                    <li>Face clearly visible</li>
                    <li>Maximum file size: 2MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => {
                setFormData({
                  institution: formData.institution, // Keep the institution ID
                  reg_no: '',
                  first_name: '',
                  last_name: '',
                  course: '',
                  admission_year: '',
                  email: '',
                  phone_number: '',
                  photo: null,
                  fingerprint: formData.fingerprint // Keep the fingerprint
                  // status field removed as requested
                });
                setPhotoPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                setFormErrors({});
              }}
              className={`px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
              disabled={isSubmitting }
            >
              Reset Form
            </button>
            <button 
              type="submit" 
              className={`px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${darkMode ? 'bg-[#2A9D8F] hover:bg-[#238b7e]' : 'bg-[#0d6efd] hover:bg-[#0b5ed7]'} text-white transition-colors`}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Submit Registration
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
    </TokenProtectedPage>
  );
  
};

export default StudentRegistrationForm;












