"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  Activity, 
  Clock, 
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
  RefreshCw,
  Share2,
  CreditCard,
  DollarSign,
  Calendar,
  Eye,
  Filter,
  Download,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Info,
  Banknote
} from 'lucide-react';
import AcessTokenProtectedPage from '../../components/AccessTokenProtectedPage'
// API endpoints
const STUDENTS_API_URL = 'http://127.0.0.1:8000/institution/api/students';
const INSTITUTION_API_URL = 'http://127.0.0.1:8000/institution/api/institution';
const TEMPLATE_API_URL = 'http://127.0.0.1:8000/institution/api/template';
const PAYMENTS_API_URL = 'http://127.0.0.1:8000/institution/api/payments';
const NOTIFICATIONS_API_URL = 'http://127.0.0.1:8000/institution/api/notifications';

// Instipass color palette
const COLORS = { 
  primary: '#1D3557', // Deep blue
  secondary: '#2A9D8F', // Soft teal/success green
  accent: '#F1F1F1', // Light gray
  white: '#FFFFFF',
  pending: '#F59E0B', // Yellow for pending
  processing: '#3B82F6', // Blue for processing
  ready: '#10B981', // Green for ready
  rejected: '#EF4444', // Red for rejected
};

// Status mapping for API status values
const statusMap = {
  pending: { 
    label: 'Pending', 
    colorClass: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300', 
    icon: <Clock size={14} />,
    color: COLORS.pending
  },
  processing: { 
    label: 'Processing', 
    colorClass: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', 
    icon: <Activity size={14} />,
    color: COLORS.processing
  },
  ready: { 
    label: 'Ready for Delivery', 
    colorClass: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', 
    icon: <CheckCircle size={14} />,
    color: COLORS.ready
  },
  // Legacy mapping for existing API
  id_ready: { 
    label: 'Ready for Delivery', 
    colorClass: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', 
    icon: <CheckCircle size={14} />,
    color: COLORS.ready
  },
  rejected: { 
    label: 'Rejected', 
    colorClass: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300', 
    icon: <X size={14} />,
    color: COLORS.rejected
  },
  default: { 
    label: 'Unknown', 
    colorClass: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300', 
    icon: <AlertTriangle size={14} />,
    color: '#6B7280'
  }
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
      return window.location.href='/institution/login'
    }
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

// Custom hooks for data fetching
const useInstitutionData = (token) => {
  const { data: institutionData, error: institutionError, isLoading: institutionLoading } = useSWR(
    token ? [INSTITUTION_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
    }
  );

  return { institutionData, institutionError, institutionLoading };
};

const useStudentsData = (token) => {
  const { data: students, error, isLoading, mutate } = useSWR(
    token ? [STUDENTS_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: true,
    }
  );

  return { students, error, isLoading, mutate };
};

const useTemplateData = (token) => {
  const { data: templateData, error: templateError, isLoading: templateLoading } = useSWR(
    token ? [TEMPLATE_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
    }
  );

  return { templateData, templateError, templateLoading };
};

const usePaymentsData = (token) => {
  const { data: paymentsData, error: paymentsError, isLoading: paymentsLoading } = useSWR(
    token ? [PAYMENTS_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 43200000, // 12 hours
      revalidateOnFocus: true,
    }
  );

  return { paymentsData, paymentsError, paymentsLoading };
};

const useNotificationsData = (token) => {
  const { data: notificationsData, error: notificationsError, isLoading: notificationsLoading } = useSWR(
    token ? [NOTIFICATIONS_API_URL, token] : null, 
    fetcher, 
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: true,
    }
  );

  return { notificationsData, notificationsError, notificationsLoading };
};

// Reusable StatCard component
const StatCard = ({ title, value, icon, darkMode, colorClass = '' }) => (
  <motion.div 
    className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col justify-between ${colorClass}`}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex justify-between items-start mb-2 md:mb-4">
      <span className={`text-xs md:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</span>
      <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {React.cloneElement(icon, { className: `w-5 h-5 md:w-6 md:h-6 text-teal-600 dark:text-teal-400`})}
      </div>
    </div>
    <div>
      <h3 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </h3>
    </div>
  </motion.div>
);

// Dashboard Page Component
const DashboardPage = ({ students, loading, error, darkMode, refreshData }) => {
  const [searchName, setSearchName] = useState('');
  const [searchRegNo, setSearchRegNo] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const debouncedSetSearchName = useCallback(debounce(setSearchName, 300), []);
  const debouncedSetSearchRegNo = useCallback(debounce(setSearchRegNo, 300), []);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!students) {
      return {
        totalSubmitted: 0,
        pending: 0,
        processing: 0,
        ready: 0
      };
    }

    const totalSubmitted = students.length;
    const pending = students.filter(s => s.status === 'pending').length;
    const processing = students.filter(s => s.status === 'processing').length;
    const ready = students.filter(s => s.status === 'ready' || s.status === 'id_ready').length;

    return { totalSubmitted, pending, processing, ready };
  }, [students]);

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    
    return students.filter(student => {
      const nameMatch = searchName === '' || 
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchName.toLowerCase());
      const regNoMatch = searchRegNo === '' || 
        student.reg_no.toLowerCase().includes(searchRegNo.toLowerCase());
      const statusMatch = filterStatus === 'all' || student.status === filterStatus;
      
      return nameMatch && regNoMatch && statusMatch;
    });
  }, [students, searchName, searchRegNo, filterStatus]);

  const getStatusInfo = (status) => {
    return statusMap[status] || statusMap.default;
  };

  const resultCount = filteredStudents.length;
  const hasFilters = searchName || searchRegNo || filterStatus !== 'all';

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Students Submitted" 
          value={loading ? '...' : summaryStats.totalSubmitted.toLocaleString()} 
          icon={<Users />} 
          darkMode={darkMode} 
        />
        <StatCard 
          title="Pending" 
          value={loading ? '...' : summaryStats.pending.toLocaleString()} 
          icon={<Clock />} 
          darkMode={darkMode} 
        />
        <StatCard 
          title="Processing" 
          value={loading ? '...' : summaryStats.processing.toLocaleString()} 
          icon={<Activity />} 
          darkMode={darkMode} 
        />
        <StatCard 
          title="Ready for Delivery" 
          value={loading ? '...' : summaryStats.ready.toLocaleString()} 
          icon={<CheckCircle />} 
          darkMode={darkMode} 
        />
      </div>

      {/* Student Submissions Table */}
      <div className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex items-center">
            <h3 className={`text-base md:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Student Submissions</h3>
            {loading && (
              <div className="ml-3 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-500"></div>
            )}
            
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Search by Name..." 
            onChange={(e) => debouncedSetSearchName(e.target.value)} 
            className="p-2 rounded-lg border text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <input 
            type="text" 
            placeholder="Search by Registration Number..." 
            onChange={(e) => debouncedSetSearchRegNo(e.target.value)} 
            className="p-2 rounded-lg border text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="p-2 rounded-lg border text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="id_ready">Ready</option>
          </select>
        </div>

        {/* Result count */}
        {hasFilters && (
          <div className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {resultCount} results
            {searchName && ` for name contains '${searchName}'`}
            {searchRegNo && ` for registration number contains '${searchRegNo}'`}
            {filterStatus !== 'all' && ` for status: ${filterStatus}`}
          </div>
        )}

        {/* Error message */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Student Name</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Registration Number</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Submission Date</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
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
              ) : filteredStudents && filteredStudents.length > 0 ? filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={student.photo || `https://i.pravatar.cc/40?u=${student.id}`} 
                        alt={`${student.first_name} ${student.last_name}`} 
                        className="w-8 h-8 rounded-full object-cover mr-3" 
                      />
                      <span className="text-sm font-medium">{student.first_name} {student.last_name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm whitespace-nowrap">{student.reg_no}</td>
                  <td className="p-3 text-sm whitespace-nowrap">
                    {new Date(student.created_at).toLocaleDateString()} {new Date(student.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
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

// Template Settings Page Component
const TemplateSettingsPage = ({ templateData, loading, error, darkMode }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'text-green-600 dark:text-green-400';
      case 'under review': return 'text-yellow-600 dark:text-yellow-400';
      case 'submitted': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <CheckCircle size={20} className="text-green-600 dark:text-green-400" />;
      case 'under review': return <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />;
      case 'submitted': return <Upload size={20} className="text-blue-600 dark:text-blue-400" />;
      default: return <AlertTriangle size={20} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <p>Error loading template data: {error.message}</p>
        </div>
      </div>
    );
  }

  const currentStatus = templateData?.status || 'Not Submitted';
  const lastUpdated = templateData?.updated_at ? new Date(templateData.updated_at).toLocaleString() : 'Never';
  const templatePreview = templateData?.preview_url;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Current Template Status */}
      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Current Template Status</h3>
        
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon(currentStatus)}
          <span className={`text-lg font-medium ${getStatusColor(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>
        
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Template Preview */}
      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Template Preview</h3>
        
        {templatePreview ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
              <img 
                src={templatePreview} 
                alt="ID Template Preview" 
                className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                style={{ maxHeight: '400px' }}
              />
            </div>
            <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              To change your template, please contact Instipass support.
            </p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <ImageIcon size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              No template preview available
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              To submit or change your template, please contact Instipass support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Payments Page Component
const PaymentsPage = ({ paymentsData, loading, error, darkMode }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <p>Error loading payment data: {error.message}</p>
        </div>
      </div>
    );
  }

  const downPayment = paymentsData?.down_payment || {};
  const finalPayment = paymentsData?.final_payment || {};
  const paymentHistory = paymentsData?.history || [];

  const getPaymentStatusColor = (status) => {
    return status?.toLowerCase() === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getPaymentStatusIcon = (status) => {
    return status?.toLowerCase() === 'paid' ? 
      <CheckCircle size={20} className="text-green-600 dark:text-green-400" /> : 
      <Clock size={20} className="text-red-600 dark:text-red-400" />;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Down Payment */}
        <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Down Payment</h3>
            <DollarSign className="text-teal-600 dark:text-teal-400" size={24} />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {getPaymentStatusIcon(downPayment.status)}
              <span className={`font-medium ${getPaymentStatusColor(downPayment.status)}`}>
                {downPayment.status || 'Unpaid'}
              </span>
            </div>
            
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${downPayment.amount || '0.00'}
              </p>
              {downPayment.date && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(downPayment.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Final Payment */}
        <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Final Payment</h3>
            <Banknote className="text-teal-600 dark:text-teal-400" size={24} />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {getPaymentStatusIcon(finalPayment.status)}
              <span className={`font-medium ${getPaymentStatusColor(finalPayment.status)}`}>
                {finalPayment.status || 'Due'}
              </span>
            </div>
            
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${finalPayment.amount || '0.00'}
              </p>
              {finalPayment.date && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(finalPayment.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Payment History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Payment Type</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paymentHistory.length > 0 ? paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-3 text-sm font-medium">{payment.type}</td>
                  <td className="p-3 text-sm">${payment.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status?.toLowerCase() === 'paid' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="p-3 text-sm">{payment.note || '-'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No payment history available.
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

// Notifications Page Component
const NotificationsPage = ({ notificationsData, loading, error, darkMode }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <p>Error loading notifications: {error.message}</p>
        </div>
      </div>
    );
  }

  const notifications = notificationsData || [];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notification Feed</h3>
        
        <div className="space-y-4">
          {notifications.length > 0 ? notifications.map((notification, index) => (
            <div key={index} className={`p-4 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-start space-x-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {notification.message}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <Bell size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No notifications available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const InstitutionDashboard = () => {
  // State for client-side only features
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard'); 

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('access_token');
    setToken(storedToken);
    
    const savedTheme = localStorage.getItem('instipass-theme');
    setDarkMode(savedTheme === 'dark');
    
    const handleThemeChange = (event) => setDarkMode(event.detail.darkMode);
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Data fetching hooks
  const { institutionData, institutionError, institutionLoading } = useInstitutionData(token);
  const { students, error: studentsError, isLoading: studentsLoading, mutate: refreshStudents } = useStudentsData(token);
  const { templateData, templateError, templateLoading } = useTemplateData(token);
  const { paymentsData, paymentsError, paymentsLoading } = usePaymentsData(token);
  const { notificationsData, notificationsError, notificationsLoading } = useNotificationsData(token);

  // Event handlers
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/institution/login';
  };

  const toggleDarkMode = () => {
    if (!isClient) return;
    
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('instipass-theme', newDarkMode ? 'dark' : 'light');
    const event = new CustomEvent('themeChange', { detail: { darkMode: newDarkMode } });
    window.dispatchEvent(event);
  };

  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage 
          students={students} 
          loading={studentsLoading} 
          error={studentsError} 
          darkMode={darkMode} 
          refreshData={refreshStudents}
        />;
      case 'template-settings':
        return <TemplateSettingsPage 
          templateData={templateData} 
          loading={templateLoading} 
          error={templateError} 
          darkMode={darkMode} 
        />;
      case 'payments':
        return <PaymentsPage 
          paymentsData={paymentsData} 
          loading={paymentsLoading} 
          error={paymentsError} 
          darkMode={darkMode} 
        />;
      case 'notifications':
        return <NotificationsPage 
          notificationsData={notificationsData} 
          loading={notificationsLoading} 
          error={notificationsError} 
          darkMode={darkMode} 
        />;
      default:
        return <DashboardPage 
          students={students} 
          loading={studentsLoading} 
          error={studentsError} 
          darkMode={darkMode} 
          refreshData={refreshStudents}
        />;
    }
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
          ? `bg-teal-600 text-white` 
          : `${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
        ${!sidebarOpen && !isMobile ? 'justify-center' : ''}
      `}
      title={label}
    >
      {icon}
      {(sidebarOpen || isMobile) && <span className="ml-3 truncate">{label}</span>}
    </button>
  );

  // Get institution logo or fallback to default
  const getProfileImage = () => {
    // console.log(institutionData.name)
    if (institutionData && institutionData.logo) {
      return institutionData.logo;
    }
    return "https://i.pravatar.cc/40?u=admin";
    
  };

  // Get institution name or fallback to default
  const getProfileName = () => {
    if (institutionData) {
      return institutionData.name;
    }
    return "Admin User";
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-800">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <AcessTokenProtectedPage>
      <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-gray-200 dark' : 'bg-gray-100 text-gray-800'}`}>
        {/* Desktop Sidebar */}
        <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            key="desktop-sidebar-expanded"
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: '16rem', opacity: 1, x: 0 }}
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
              <NavItem icon={<Settings size={20}/>} label="Template Settings" pageName="template-settings" />
              <NavItem icon={<CreditCard size={20}/>} label="Payments" pageName="payments" />
              <NavItem icon={<Bell size={20}/>} label="Notifications" pageName="notifications" />
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
            animate={{ width: '5rem' }}
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
              <NavItem icon={<Settings size={20}/>} label="Template Settings" pageName="template-settings" />
              <NavItem icon={<CreditCard size={20}/>} label="Payments" pageName="payments" />
              <NavItem icon={<Bell size={20}/>} label="Notifications" pageName="notifications" />
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
                <NavItem icon={<Settings size={20}/>} label="Template Settings" pageName="template-settings" isMobile={true} />
                <NavItem icon={<CreditCard size={20}/>} label="Payments" pageName="payments" isMobile={true} />
                <NavItem icon={<Bell size={20}/>} label="Notifications" pageName="notifications" isMobile={true} />
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
              <h2 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                {activePage === 'template-settings' ? 'Template Settings' : 
                 activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              </h2>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex items-center">
                {institutionLoading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                ) : (
                  <img 
                    src={getProfileImage()} 
                    alt={getProfileName()} 
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://i.pravatar.cc/40?u=admin";
                    }}
                  />
                )}
                <span className="ml-2 hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {institutionLoading ? "Loading..." : getProfileName()}
                </span>
              </div>
            </div>
          </header>
          
          <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </AcessTokenProtectedPage>
  );
};

export default InstitutionDashboard;

