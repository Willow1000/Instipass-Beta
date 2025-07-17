"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  BarChart3,
  PieChart as PieChartIcon,
  Activity, 
  Clock, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Menu, 
  X,
  Download,
  Filter as FilterIcon,
  RefreshCw,
  Copy,
  Edit2, 
  Share2,

} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

// API endpoints
const STUDENTS_API_URL = 'http://127.0.0.1:8000/institution/api/students';
const INSTITUTION_API_URL = 'http://127.0.0.1:8000/institution/api/institution';

const COLORS = { 
  processing: '#3B82F6', // blue-500
  completed: '#10B981', // green-500
  rejected: '#EF4444', // red-500
  primary: '#2A9D8F', // teal-green from previous context
  secondary: '#1D3557' // dark blue from previous context
};

// Status mapping for API status values
const statusMap = {
  pending: { label: 'Processing', colorClass: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', icon: <Clock size={14} /> },
  id_ready: { label: 'Completed', colorClass: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', icon: <CheckCircle size={14} /> },
  rejected: { label: 'Rejected', colorClass: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300', icon: <X size={14} /> },
  // Add fallback for any other status
  default: { label: 'Unknown', colorClass: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300', icon: <AlertTriangle size={14} /> }
};

// Debounce function
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// SWR fetcher function
const fetcher = async ([url, token]) => {
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      
      const newAccessToken = await handleTokenRefresh();
      if (newAccessToken) {
        // Re-attempt the original fetch request with the new token
        const retryResponse = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (!retryResponse.ok) {
          throw new Error(`API request failed after refresh with status ${retryResponse.status}`);
        }
        return retryResponse.json();
      } else {
        // Redirection already handled by handleTokenRefresh
        throw new Error("Token refresh failed or no refresh token.");
      }
    }
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

// Custom hook to fetch institution data
const useInstitutionData = (token) => {
  const { data: institutionData, error: institutionError, isLoading: institutionLoading } = useSWR(
    token ? [INSTITUTION_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false, // Don't refetch on window focus for institution data
    }
  );

  return {
    institutionData,
    institutionError,
    institutionLoading
  };
};

// StatCard component
const StatCard = ({ title, value, icon, change, changeType, unit, darkMode }) => (
  <motion.div 
    className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col justify-between`}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex justify-between items-start mb-2 md:mb-4">
      <span className={`text-xs md:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</span>
      <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {React.cloneElement(icon, { className: `w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`})}
      </div>
    </div>
    <div>
      <h3 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}{unit && <span className="text-base md:text-lg ml-1">{un}</span>}
      </h3>
      {change && (
        <p className={`text-xs mt-1 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </p>
      )}
    </div>
  </motion.div>
);

// StatisticsPage component
const StatisticsPage = ({ students, darkMode, loading, error, onCourseClick, onYearClick }) => {
  const statsByCourse = useMemo(() => {
    if (!students) return [];
    const courseCounts = students.reduce((acc, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(courseCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  const statsByYear = useMemo(() => {
    if (!students) return [];
    const yearCounts = students.reduce((acc, student) => {
      acc[student.admission_year] = (acc[student.admission_year] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(yearCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => parseInt(b.name) - parseInt(a.name));
  }, [students]);

  const statusDistribution = useMemo(() => {
    if (!students) return [];
    const statusCounts = students.reduce((acc, student) => {
      const statusLabel = statusMap[student.status]?.label || 'Unknown';
      acc[statusLabel] = (acc[statusLabel] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: name === 'Completed' ? COLORS.completed : name === 'Processing' ? COLORS.processing : COLORS.rejected,
    }));
  }, [students]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <p>Error loading data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Advanced Statistics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Registrations by Course */}
        <div className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-base md:text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Registrations by Course</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsByCourse} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
              <XAxis type="number" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: darkMode ? 'rgba(31,41,55,0.9)' : 'rgba(255,255,255,0.9)', borderRadius: '0.75rem', borderColor: darkMode ? 'rgba(75,85,99,0.5)' : 'rgba(229,231,235,0.5)' }}
                itemStyle={{ color: darkMode ? '#F3F4F6' : '#1F2937' }}
                labelStyle={{ color: darkMode ? '#D1D5DB' : '#374151', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{fontSize: '12px'}} />
              <Bar dataKey="count" fill={COLORS.primary} name="Students" onClick={(data) => onCourseClick(data.name)} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Registrations by Admission Year */}
        <div className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-base md:text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Registrations by Admission Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsByYear} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
              <XAxis dataKey="name" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: darkMode ? 'rgba(31,41,55,0.9)' : 'rgba(255,255,255,0.9)', borderRadius: '0.75rem', borderColor: darkMode ? 'rgba(75,85,99,0.5)' : 'rgba(229,231,235,0.5)' }}
                itemStyle={{ color: darkMode ? '#F3F4F6' : '#1F2937' }}
                labelStyle={{ color: darkMode ? '#D1D5DB' : '#374151', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{fontSize: '12px'}} />
              <Bar dataKey="count" fill={COLORS.secondary} name="Students" onClick={(data) => onYearClick(data.name)} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-base md:text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Overall Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {statusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} cursor="pointer" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: darkMode ? 'rgba(31,41,55,0.9)' : 'rgba(255,255,255,0.9)', borderRadius: '0.75rem', borderColor: darkMode ? 'rgba(75,85,99,0.5)' : 'rgba(229,231,235,0.5)' }}
              itemStyle={{ color: darkMode ? '#F3F4F6' : '#1F2937' }}
              labelStyle={{ color: darkMode ? '#D1D5DB' : '#374151', fontWeight: 'bold' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Main Dashboard Component
const InstitutionDashboard = () => {
  // Initialize token synchronously
  const initialToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const [token, setToken] = useState(initialToken);

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard'); 

  // Use SWR for data fetching
  const { data: students, error, isLoading, mutate } = useSWR(token ? [STUDENTS_API_URL, token] : null, fetcher, {
    refreshInterval: 30000, // Poll every 30 seconds
    revalidateOnFocus: true,
  });

  // Fetch institution data
  const { institutionData, institutionError, institutionLoading } = useInstitutionData(token);

  // Logout function
  const handleLogout = useCallback(() => {
    try {
      // Clear access token from localStorage
      localStorage.removeItem('access_token');
      
      // Clear refresh token from cookies
      deleteCookie('refresh_token');
      
      // Clear any other stored data
      localStorage.removeItem('instipass-theme');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/institution/login';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect even if there's an error
      if (typeof window !== 'undefined') {
        window.location.href = '/institution/login';
      }
    }
  }, []);

  // Derived stats from API data
  const statsData = useMemo(() => {
    if (!students) {
      return {
        totalRegistrations: 0,
        pendingIds: 0,
        completedIds: 0,
        averageProcessingTime: 0,
        submissionsOverTime: []
      };
    }

    // Count total registrations
    const totalRegistrations = students.length;
    
    // Count by status
    const pendingIds = students.filter(student => student.status === 'pending').length;
    const completedIds = students.filter(student => student.status === 'id_ready').length;
    
    // Calculate average processing time (in hours)
    let totalProcessingTime = 0;
    let processedCount = 0;
    
    students.forEach(student => {
      if (student.status === 'id_ready') {
        const createdDate = new Date(student.created_at);
        const updatedDate = new Date(student.updated_at);
        const processingTime = (updatedDate - createdDate) / (1000 * 60 * 60); // Convert to hours
        totalProcessingTime += processingTime;
        processedCount++;
      }
    });
    
    const averageProcessingTime = processedCount > 0 ? (totalProcessingTime / processedCount).toFixed(1) : 0;
    
    // Group submissions by day of week for the chart
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const submissionsByDay = Array(7).fill(0);
    
    students.forEach(student => {
      const createdDate = new Date(student.created_at);
      const dayOfWeek = createdDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      submissionsByDay[dayOfWeek]++;
    });
    
    const submissionsOverTime = dayNames.map((name, index) => ({
      name,
      submissions: submissionsByDay[index]
    }));
    
    return {
      totalRegistrations,
      pendingIds,
      completedIds,
      averageProcessingTime,
      submissionsOverTime
    };
  }, [students]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterCourse, setFilterCourse] = useState(null);
  const [filterYear, setFilterYear] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('instipass-theme');
      setDarkMode(savedTheme === 'dark');
      const handleThemeChange = (event) => setDarkMode(event.detail.darkMode);
      window.addEventListener('themeChange', handleThemeChange);
      return () => window.removeEventListener('themeChange', handleThemeChange);
    }
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('instipass-theme', newDarkMode ? 'dark' : 'light');
    // Dispatch event for other components
    const event = new CustomEvent('themeChange', { detail: { darkMode: newDarkMode } });
    window.dispatchEvent(event);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const debouncedSetSearchTerm = useCallback(debounce(setSearchTerm, 300), []);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students
      .filter(student => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = searchTermLower === '' || 
                              `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTermLower) || 
                              student.reg_no.toLowerCase().includes(searchTermLower) ||
                              student.email.toLowerCase().includes(searchTermLower) ||
                              student.course.toLowerCase().includes(searchTermLower);
        const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
        const matchesDate = filterDate === '' || student.created_at.startsWith(filterDate);
        const matchesCourse = !filterCourse || student.course === filterCourse;
        const matchesYear = !filterYear || student.admission_year == filterYear;
        return matchesSearch && matchesStatus && matchesDate && matchesCourse && matchesYear;
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
  }, [students, searchTerm, filterStatus, filterDate, sortConfig, filterCourse, filterYear]);

  const renderMainContent = () => {
    if (activePage === 'dashboard') {
      return <DashboardMainContent 
                statsData={statsData} 
                students={filteredStudents} 
                loading={isLoading}
                error={error}
                darkMode={darkMode} 
                handleSort={handleSort}
                sortConfig={sortConfig}
                setFilterStatus={setFilterStatus}
                setFilterDate={setFilterDate}
                filterStatus={filterStatus}
                filterDate={filterDate}
                filterCourse={filterCourse}
                setFilterCourse={setFilterCourse}
                filterYear={filterYear}
                setFilterYear={setFilterYear}
                debouncedSetSearchTermGlobal={debouncedSetSearchTerm}
                refreshData={() => mutate()}
             />;
    }
    if (activePage === 'id-builder') {
      return <div className={`p-8 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Custom ID Template Builder</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>This page would allow you to create and customize ID templates for your institution.</p>
        <div className={`p-6 border-2 border-dashed rounded-xl ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex flex-col items-center justify-center`}>
          <Edit2 size={48} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>ID Template Builder would be implemented here as a separate page with its own UI and functionality.</p>
        </div>
      </div>;
    }
    if (activePage === 'statistics') {
      return <StatisticsPage 
                students={students} 
                darkMode={darkMode} 
                loading={isLoading} 
                error={error} 
                onCourseClick={(course) => { setFilterCourse(course); setActivePage('dashboard'); }} 
                onYearClick={(year) => { setFilterYear(year); setActivePage('dashboard'); }}
              />;
    }
    if (activePage === 'support') {
      return <div className={`p-8 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Support & Feedback</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Get help or provide feedback about the Instipass platform.</p>
        <div className={`p-6 border-2 border-dashed rounded-xl ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex flex-col items-center justify-center`}>
          <LifeBuoy size={48} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>Support resources and a feedback form would be available here.</p>
        </div>
      </div>;
    }
    return <div className={`p-8 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Page: {activePage}</h2>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Content for this page would be displayed here.</p>
    </div>;
  };
  
  const NavItem = ({ icon, label, pageName, isMobile = false, onClick }) => (
    <button 
        onClick={() => { 
            if (onClick) {
              onClick();
            } else {
              setActivePage(pageName); 
              if(isMobile) toggleMobileMenu(); 
            }
        }}
        className={`w-full flex items-center p-3 rounded-lg transition-colors 
            ${activePage === pageName 
                ? `${darkMode ? 'bg-teal-600 text-white' : 'bg-teal-500 text-white'}` 
                : `${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
            ${!sidebarOpen && !isMobile ? 'justify-center' : ''}
        `}
        title={label}
    >
        {icon}
        {(sidebarOpen || isMobile) && <span className="ml-3 truncate">{label}</span>}
    </button>
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        // Show success message
        setShowShareModal(true);
        setTimeout(() => setShowShareModal(false), 2000);
      })
      .catch(err => console.error('Failed to copy link: ', err));
  };

  // Get institution logo or fallback to default
  const getProfileImage = () => {
    if (institutionData && institutionData.logo) {
      return institutionData.logo;
    }
    return "https://i.pravatar.cc/40?u=admin"; // Fallback to default
  };

  // Get institution name or fallback to default
  const getProfileName = () => {
    if (institutionData && institutionData.name) {
      return institutionData.name;
    }
    return "Admin User"; // Fallback to default
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-gray-200 dark' : 'bg-gray-100 text-gray-800'}`}>
      {/* Desktop Sidebar */}
      <AnimatePresence>
      {sidebarOpen && (
        <motion.aside 
            key="desktop-sidebar-expanded"
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: '16rem', opacity: 1, x: 0 }} // w-64
            exit={{ width: 0, opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`hidden lg:flex flex-col h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl z-20`}
        >
          <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center">
                <LayoutDashboard className="text-teal-500 w-7 h-7 mr-2" />
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Instipass</span>
            </div>
            <button onClick={toggleSidebar} className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`} title="Collapse sidebar">
                <ChevronLeft size={20} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" pageName="dashboard" />
            <NavItem icon={<Edit2 size={20}/>} label="ID Template Builder" pageName="id-builder" />
            <NavItem icon={<BarChart3 size={20}/>} label="Statistics" pageName="statistics" />
            <NavItem icon={<LifeBuoy size={20}/>} label="Support & Feedback" pageName="support" />
          </nav>
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              onClick={toggleDarkMode} 
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <NavItem icon={<LogOut size={20}/>} label="Logout" pageName="logout" onClick={handleLogout} />
          </div>
        </motion.aside>
      )}
      </AnimatePresence>
      {!sidebarOpen && (
          <motion.aside 
            key="desktop-sidebar-collapsed"
            initial={{ width: '16rem' }}
            animate={{ width: '5rem' }} // w-20
            transition={{ duration: 0.3 }}
            className={`hidden lg:flex flex-col h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl z-20 items-center`}
        >
            <div className={`flex items-center justify-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} w-full`}>
                <button onClick={toggleSidebar} className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`} title="Expand sidebar">
                    <ChevronRight size={20} />
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto w-full">
                <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" pageName="dashboard" />
                <NavItem icon={<Edit2 size={20}/>} label="ID Template Builder" pageName="id-builder" />
                <NavItem icon={<BarChart3 size={20}/>} label="Statistics" pageName="statistics" />
                <NavItem icon={<LifeBuoy size={20}/>} label="Support & Feedback" pageName="support" />
            </nav>
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} w-full flex flex-col space-y-2`}>
                <button 
                  onClick={toggleDarkMode} 
                  className={`w-full flex justify-center p-3 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                  title={darkMode ? 'Light Mode' : 'Dark Mode'}
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <NavItem icon={<LogOut size={20}/>} label="Logout" pageName="logout" onClick={handleLogout} />
            </div>
        </motion.aside>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                key="mobile-sidebar-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                onClick={toggleMobileMenu}
            />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.aside 
                key="mobile-sidebar"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed top-0 left-0 h-full w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl z-40 flex flex-col lg:hidden`}
            >
                <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center">
                        <LayoutDashboard className="text-teal-500 w-7 h-7 mr-2" />
                        <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Instipass</span>
                    </div>
                    <button onClick={toggleMobileMenu} className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`} title="Close menu">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" pageName="dashboard" isMobile={true} />
                    <NavItem icon={<Edit2 size={20}/>} label="ID Template Builder" pageName="id-builder" isMobile={true} />
                    <NavItem icon={<BarChart3 size={20}/>} label="Statistics" pageName="statistics" isMobile={true} />
                    <NavItem icon={<LifeBuoy size={20}/>} label="Support & Feedback" pageName="support" isMobile={true} />
                </nav>
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button 
                      onClick={toggleDarkMode} 
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                      {darkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                      <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <NavItem icon={<LogOut size={20}/>} label="Logout" pageName="logout" isMobile={true} onClick={handleLogout} />
                </div>
            </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'} shadow-sm p-4 flex justify-between items-center`}>
          <div className="flex items-center">
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 mr-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" title="Open menu">
                <Menu size={24} />
            </button>
            <h2 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>{activePage.charAt(0).toUpperCase() + activePage.slice(1).replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button onClick={handleCopyLink} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" title="Copy Dashboard Link">
                <Share2 size={20} />
            </button>
            <div className="relative notifications-container">
                <button onClick={() => setShowNotifications(s => !s)} className="p-2 rounded-full relative text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" title="Notifications">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                </button>
                <AnimatePresence>
                {showNotifications && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-72 md:w-80 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                        <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold">Notifications</h3>
                            {unreadCount > 0 && <button onClick={() => setNotifications(nots => nots.map(n => ({...n, read: true})))} className="text-xs text-teal-500 hover:underline">Mark all as read</button>}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="p-4 text-sm text-center text-gray-500">No new notifications.</p>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${!notif.read ? 'bg-teal-500/10 dark:bg-teal-600/10' : ''}`}>
                                        <p className={`text-sm mb-0.5 ${!notif.read ? 'font-semibold' : ''}`}>{notif.message}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                            <button className="text-xs text-teal-500 hover:underline">View all notifications</button>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            <div className="flex items-center">
                
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            
              <img 
                src={getProfileImage()} 
                alt={getProfileName()} 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://i.pravatar.cc/40?u=admin"; // Fallback on error
                }}
              />
                
                <span className="ml-2 hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                   {getProfileName()}
                </span>
            </div>
          </div>
        </header>
        
        <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      {/* Share Link Success Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mx-4 max-w-sm">
              <div className="flex items-center justify-center text-green-500 mb-4">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Link Copied!</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">Dashboard link has been copied to your clipboard.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DashboardMainContent = ({ statsData, students, loading, error, darkMode, handleSort, sortConfig, setFilterStatus, setFilterDate, filterStatus, filterDate, filterCourse, setFilterCourse, filterYear, setFilterYear, debouncedSetSearchTermGlobal, refreshData }) => {
  const pieData = [
    { name: 'Completed', value: statsData.completedIds, color: COLORS.completed },
    { name: 'Processing', value: statsData.pendingIds, color: COLORS.processing },
  ];

  const TableHeader = ({ label, sortKey }) => (
    <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">
      <button onClick={() => handleSort(sortKey)} className="flex items-center space-x-1 hover:text-teal-500">
        <span>{label}</span>
        {sortConfig.key === sortKey ? (
          sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        ) : <ArrowUpDown size={14} className="opacity-50" />}
      </button>
    </th>
  );

  // Get status display info with fallback
  const getStatusInfo = (status) => {
    return statusMap[status] || statusMap.default;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Error message if API fails */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            <p>Error loading data: {error.message}</p>
          </div>
          <button 
            onClick={refreshData} 
            className="mt-2 px-3 py-1 bg-red-200 dark:bg-red-800 rounded-md text-sm flex items-center"
          >
            <RefreshCw size={14} className="mr-1" /> Retry
          </button>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Registrations" 
          value={loading ? '...' : statsData.totalRegistrations.toLocaleString()} 
          icon={<Users />} 
          darkMode={darkMode} 
        />
        <StatCard 
          title="Completed IDs" 
          value={loading ? '...' : statsData.completedIds.toLocaleString()} 
          icon={<ShieldCheck />} 
          change={loading ? null : `${((statsData.completedIds / (statsData.totalRegistrations || 1)) * 100).toFixed(1)}%`} 
          changeType="positive" 
          darkMode={darkMode} 
        />
        <StatCard 
          title="Pending IDs" 
          value={loading ? '...' : statsData.pendingIds.toLocaleString()} 
          icon={<Clock />} 
          change={loading ? null : `${((statsData.pendingIds / (statsData.totalRegistrations || 1)) * 100).toFixed(1)}%`} 
          changeType="negative" 
          darkMode={darkMode} 
        />
        <StatCard 
          title="Avg. Processing Time" 
          value={loading ? '...' : parseFloat(statsData.averageProcessingTime).toFixed(1)} 
          icon={<Activity />} 
          unit="hrs" 
          darkMode={darkMode} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 p-4 md:p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800 dark:text-white">Submissions Over Time</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statsData.submissionsOverTime} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                <XAxis dataKey="name" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: darkMode ? 'rgba(31,41,55,0.9)' : 'rgba(255,255,255,0.9)', borderRadius: '0.75rem', borderColor: darkMode ? 'rgba(75,85,99,0.5)' : 'rgba(229,231,235,0.5)', padding: '8px 12px' }}
                  itemStyle={{ color: darkMode ? '#F3F4F6' : '#1F2937', fontSize: 12 }}
                  labelStyle={{ color: darkMode ? '#D1D5DB' : '#374151', fontSize: 12, fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{fontSize: '12px'}} />
                <Line type="monotone" dataKey="submissions" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: COLORS.primary }} activeDot={{ r: 6, stroke: darkMode ? '#1f2937' : '#fff', strokeWidth: 2 }} name="Submissions" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="p-4 md:p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800 dark:text-white">ID Status Distribution</h3>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }} onClick={(data) => setFilterStatus(data.name === 'Completed' ? 'id_ready' : 'pending')} >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} cursor="pointer" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: darkMode ? 'rgba(31,41,55,0.9)' : 'rgba(255,255,255,0.9)', borderRadius: '0.75rem', borderColor: darkMode ? 'rgba(75,85,99,0.5)' : 'rgba(229,231,235,0.5)', padding: '8px 12px' }}
                  itemStyle={{ color: darkMode ? '#F3F4F6' : '#1F2937', fontSize: 12 }}
                  labelStyle={{ color: darkMode ? '#D1D5DB' : '#374151', fontSize: 12, fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="p-4 md:p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex items-center">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">Student Submissions</h3>
            {loading && (
              <div className="ml-3 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-500"></div>
            )}
            <button 
              onClick={refreshData} 
              className="ml-2 p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Refresh data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input 
                type="text" 
                placeholder="Search..." 
                onChange={(e) => debouncedSetSearchTermGlobal(e.target.value)} 
                className="p-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-sm w-full sm:w-auto focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)} 
                className="p-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm w-full sm:w-auto focus:ring-2 focus:ring-teal-500 outline-none"
            >
                <option value="all">All Statuses</option>
                <option value="pending">Processing</option>
                <option value="id_ready">Completed</option>
                <option value="rejected">Rejected</option>
            </select>
            <input 
                type="date" 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)} 
                className="p-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm w-full sm:w-auto focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-4">
            {filterCourse && (
                <button onClick={() => setFilterCourse(null)} className="flex items-center gap-1 px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs">
                    Course: {filterCourse} <X size={14} />
                </button>
            )}
            {filterYear && (
                <button onClick={() => setFilterYear(null)} className="flex items-center gap-1 px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs">
                    Year: {filterYear} <X size={14} />
                </button>
            )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <TableHeader label="Student Name" sortKey="first_name" />
                <TableHeader label="Registration ID" sortKey="reg_no" />
                <TableHeader label="Submission Date" sortKey="created_at" />
                <TableHeader label="Status" sortKey="status" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500 mr-3"></div>
                      <span>Loading student data...</span>
                    </div>
                  </td>
                </tr>
              ) : students && students.length > 0 ? students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={student.photo || `https://i.pravatar.cc/40?u=${student.id}`} alt={`${student.first_name} ${student.last_name}`} className="w-8 h-8 rounded-full object-cover mr-3" />
                      <span className="text-sm font-medium">{student.first_name} {student.last_name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm whitespace-nowrap">{student.reg_no}</td>
                  <td className="p-3 text-sm whitespace-nowrap">{new Date(student.created_at).toLocaleDateString()} {new Date(student.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusInfo(student.status).colorClass}`}>
                      {React.cloneElement(getStatusInfo(student.status).icon, { className: 'mr-1' })}
                      {getStatusInfo(student.status).label}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="4" className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No students found matching your criteria.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;



// --- Token Refresh Logic ---

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

async function handleTokenRefresh() {
  const refreshToken = getCookie("refresh_token");

  if (!refreshToken) {
    window.location.href = "/institution/login";
    return null;
  }

  try {
    const token = localStorage.getItem('access_token') 
    const response = await fetch("http://127.0.0.1:8000/institution/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },

      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed with status ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    setCookie("refresh_token", data.refresh, 7); // Store for 7 days, adjust as needed

    return data.access; // Return the new access token

  } catch (error) {
    console.error("Error during token refresh:", error);
    window.location.href = "/institution/login";
    return null;
  }
}

