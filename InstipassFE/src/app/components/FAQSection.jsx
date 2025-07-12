import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
  return (
    <motion.div 
      className={`border-b border-gray-200 py-4 ${isOpen ? 'bg-opacity-5 bg-[#2A9D8F] rounded-lg' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <ChevronUp className="text-[#2A9D8F]" /> : <ChevronDown />}
        </motion.div>
      </button>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className={`pt-4 ${darkMode?'text-white':'text-black'}`}>{answer}</p>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = ({ darkMode }) => {
  const faqs = [
    {
      question: "How does Instipass ensure the security of student IDs?",
      answer: "Instipass uses advanced encryption protocols and secure access controls to protect all student data. Our platform is regularly audited for security compliance and follows industry best practices for data protection."
    },
    {
      question: "Can institutions customize the digital ID format?",
      answer: "Yes, institutions can fully customize their digital ID templates, including logos, colors, fields displayed, and security features to match their branding and specific requirements."
    },
    {
      question: "Is Instipass compatible with existing student management systems?",
      answer: "Absolutely! Instipass is designed to integrate seamlessly with most popular student management systems through our API. We also offer custom integration services for specialized systems."
    },
    {
      question: "How do students access their digital IDs?",
      answer: "Students can access their digital IDs through our mobile app (available on iOS and Android) or through a web browser. IDs can be stored for offline access and are automatically updated when connected to the internet."
    },
    {
      question: "What happens if a student loses their device?",
      answer: "If a student loses their device, they can simply log in to Instipass from any other device to access their ID. Administrators also have the ability to temporarily suspend access if needed for security reasons."
    }
  ];

  return (
    <section id="faq" className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
        
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
