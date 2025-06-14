// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Users, 
//   School, 
//   Bell, 
//   LogOut, 
//   Search, 
//   BarChart2, 
//   Clock, 
//   CheckCircle, 
//   ChevronDown, 
//   Menu, 
//   X,
//   Download,
//   Filter,
//   RefreshCw,
//   PieChart,
//   TrendingUp
// } from 'lucide-react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
// import { Pie, Line } from 'react-chartjs-2';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import * as XLSX from 'xlsx';

// // Register ChartJS components
// ChartJS.register(
//   ArcElement, 
//   Tooltip, 
//   Legend,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title
// );

// const InstitutionDashboard = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [notifications, setNotifications] = useState([
//     { id: 1, message: "New student registration request", time: "10 minutes ago", read: false },
//     { id: 2, message: "5 IDs are ready for collection", time: "1 hour ago", read: false },
//     { id: 3, message: "ID processing completed for 12 students", time: "3 hours ago", read: true }
//   ]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [timeRange, setTimeRange] = useState('week');
//   const [showExportOptions, setShowExportOptions] = useState(false);
//   const [selectedExportData, setSelectedExportData] = useState({
//     registeredStudents: true,
//     processingIds: true,
//     readyIds: true
//   });
  
//   const dashboardRef = useRef(null);

//   // Initialize dark mode from localStorage and listen for theme changes
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const savedTheme = localStorage.getItem('instipass-theme');
//       setDarkMode(savedTheme === 'dark');
      
//       // Listen for theme changes from Navbar
//       const handleThemeChange = (event) => {
//         setDarkMode(event.detail.darkMode);
//       };
      
//       window.addEventListener('themeChange', handleThemeChange);
//       return () => {
//         window.removeEventListener('themeChange', handleThemeChange);
//       };
//     }
//   }, []);

//   // Mock data for dashboard
//   const stats = [
//     { title: "Registered Students", value: "1,247", icon: <Users size={24} />, color: "#2A9D8F" },
//     { title: "IDs Being Processed", value: "89", icon: <Clock size={24} />, color: "#E76F51" },
//     { title: "Ready IDs", value: "358", icon: <CheckCircle size={24} />, color: "#1D3557" }
//   ];

//   // Mock data for pie chart
//   const pieChartData = {
//     labels: ['Registered Students', 'IDs Being Processed', 'Ready IDs'],
//     datasets: [
//       {
//         data: [1247, 89, 358],
//         backgroundColor: ['#2A9D8F', '#E76F51', '#1D3557'],
//         borderWidth: 0,
//       },
//     ],
//   };

//   // Mock data for line chart - weekly
//   const weeklyLineData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         label: 'Registered Students',
//         data: [1200, 1215, 1225, 1230, 1235, 1240, 1247],
//         borderColor: '#2A9D8F',
//         tension: 0.4,
//         fill: false
//       },
//       {
//         label: 'IDs Being Processed',
//         data: [75, 80, 85, 82, 88, 90, 89],
//         borderColor: '#E76F51',
//         tension: 0.4,
//         fill: false
//       },
//       {
//         label: 'Ready IDs',
//         data: [320, 325, 330, 335, 340, 350, 358],
//         borderColor: '#1D3557',
//         tension: 0.4,
//         fill: false
//       }
//     ]
//   };

//   // Mock data for line chart - monthly
//   const monthlyLineData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
//     datasets: [
//       {
//         label: 'Registered Students',
//         data: [1050, 1100, 1150, 1200, 1247],
//         borderColor: '#2A9D8F',
//         tension: 0.4,
//         fill: false
//       },
//       {
//         label: 'IDs Being Processed',
//         data: [60, 70, 75, 80, 89],
//         borderColor: '#E76F51',
//         tension: 0.4,
//         fill: false
//       },
//       {
//         label: 'Ready IDs',
//         data: [280, 300, 320, 340, 358],
//         borderColor: '#1D3557',
//         tension: 0.4,
//         fill: false
//       }
//     ]
//   };

//   // Chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           color: darkMode ? '#F1F1F1' : '#1D3557',
//           font: {
//             size: 12
//           }
//         }
//       }
//     },
//     scales: {
//       x: {
//         grid: {
//           color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
//         },
//         ticks: {
//           color: darkMode ? '#F1F1F1' : '#1D3557'
//         }
//       },
//       y: {
//         grid: {
//           color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
//         },
//         ticks: {
//           color: darkMode ? '#F1F1F1' : '#1D3557'
//         }
//       }
//     }
//   };

//   // Handle notification click
//   const handleNotificationClick = (id) => {
//     setNotifications(notifications.map(notification => 
//       notification.id === id ? { ...notification, read: true } : notification
//     ));
//   };

//   // Handle mobile menu toggle
//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   // Handle sidebar toggle
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Get unread notification count
//   const unreadCount = notifications.filter(notification => !notification.read).length;

//   // Export data as PDF
//   const exportAsPDF = () => {
//     const input = dashboardRef.current;
//     html2canvas(input).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('l', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;
//       const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
//       const imgX = (pdfWidth - imgWidth * ratio) / 2;
//       const imgY = 30;
      
//       pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
//       pdf.save('institution_dashboard.pdf');
//     });
//   };

//   // Export data as Excel
//   const exportAsExcel = () => {
//     const data = [];
    
//     if (selectedExportData.registeredStudents) {
//       data.push(['Registered Students', '1,247']);
//     }
    
//     if (selectedExportData.processingIds) {
//       data.push(['IDs Being Processed', '89']);
//     }
    
//     if (selectedExportData.readyIds) {
//       data.push(['Ready IDs', '358']);
//     }
    
//     const ws = XLSX.utils.aoa_to_sheet([['Metric', 'Value'], ...data]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Data');
//     XLSX.writeFile(wb, 'institution_dashboard.xlsx');
//   };

//   // Export data as CSV
//   const exportAsCSV = () => {
//     let csvContent = "Metric,Value\n";
    
//     if (selectedExportData.registeredStudents) {
//       csvContent += "Registered Students,1247\n";
//     }
    
//     if (selectedExportData.processingIds) {
//       csvContent += "IDs Being Processed,89\n";
//     }
    
//     if (selectedExportData.readyIds) {
//       csvContent += "Ready IDs,358\n";
//     }
    
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'institution_dashboard.csv');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Handle export data selection change
//   const handleExportDataChange = (key) => {
//     setSelectedExportData({
//       ...selectedExportData,
//       [key]: !selectedExportData[key]
//     });
//   };

//   return (
//     <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//       {/* Mobile Menu Button */}
   

      

//       {/* Main Content */}
//       <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
//         {/* Top Navigation */}
        
        
//         {/* Dashboard Content */}
//         <main className="pt-16 pb-8 px-4 md:px-6 h-screen overflow-y-auto" ref={dashboardRef}>
//           <div className="max-w-7xl mx-auto">
//             {/* Page Header */}
//             <div className="mb-6 mt-4">
//               <h1 className="text-2xl font-bold">Institution Dashboard</h1>
//               <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Monitor student ID registrations and processing status
//               </p>
//             </div>
            
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               {stats.map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={{ y: -5 }}
//                   className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
//                 >
//                   <div className="flex items-center">
//                     <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: `${stat.color}20` }}>
//                       <div style={{ color: stat.color }}>{stat.icon}</div>
//                     </div>
//                     <div>
//                       <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
//                       <h3 className="text-2xl font-bold">{stat.value}</h3>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
            
//             {/* Charts Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//               {/* Pie Chart */}
//               <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold">ID Distribution</h2>
//                   <div className="flex items-center">
//                     <PieChart size={16} className="mr-1" />
//                     <span className="text-sm">Pie Chart</span>
//                   </div>
//                 </div>
//                 <div className="h-64">
//                   <Pie data={pieChartData} options={chartOptions} />
//                 </div>
//               </div>
              
//               {/* Line Chart */}
//               <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold">ID Status Trends</h2>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => setTimeRange('week')}
//                       className={`px-3 py-1 text-xs rounded-md ${
//                         timeRange === 'week'
//                           ? 'bg-[#2A9D8F] text-white'
//                           : darkMode
//                             ? 'bg-gray-700 text-gray-300'
//                             : 'bg-gray-200 text-gray-700'
//                       }`}
//                     >
//                       Weekly
//                     </button>
//                     <button
//                       onClick={() => setTimeRange('month')}
//                       className={`px-3 py-1 text-xs rounded-md ${
//                         timeRange === 'month'
//                           ? 'bg-[#2A9D8F] text-white'
//                           : darkMode
//                             ? 'bg-gray-700 text-gray-300'
//                             : 'bg-gray-200 text-gray-700'
//                       }`}
//                     >
//                       Monthly
//                     </button>
//                     <TrendingUp size={16} />
//                   </div>
//                 </div>
//                 <div className="h-64">
//                   <Line 
//                     data={timeRange === 'week' ? weeklyLineData : monthlyLineData} 
//                     options={chartOptions} 
//                   />
//                 </div>
//               </div>
//             </div>
            
//             {/* Recent Notifications */}
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Recent Notifications</h2>
//                 <button className="text-sm text-[#2A9D8F] hover:underline">View all</button>
//               </div>
//               <div className="space-y-3">
//                 {notifications.map((notification) => (
//                   <div 
//                     key={notification.id}
//                     className={`p-3 rounded-lg ${
//                       darkMode 
//                         ? notification.read ? 'bg-gray-700' : 'bg-gray-700 border-l-4 border-[#2A9D8F]' 
//                         : notification.read ? 'bg-gray-50' : 'bg-gray-50 border-l-4 border-[#2A9D8F]'
//                     }`}
//                   >
//                     <div className="flex justify-between">
//                       <p className={`${notification.read ? '' : 'font-medium'}`}>{notification.message}</p>
//                       <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default InstitutionDashboard;
