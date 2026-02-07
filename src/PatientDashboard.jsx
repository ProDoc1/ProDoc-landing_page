import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Search, 
  ShieldCheck, 
  Bell, 
  ChevronRight, 
  Heart,
  FileText,
  Star,
  Download,
  Lock,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Calendar,
  Plus
} from 'lucide-react';

const PatientDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedReport, setExpandedReport] = useState(null);
  
  // Mock data - replace with actual API calls
  const [reviews, setReviews] = useState([
    {
      id: 1,
      doctor: { name: "Dr. Sarah Perera", specialty: "Cardiologist", hospital: "Asiri Hospital" },
      rating: 5,
      text: "Excellent doctor, very thorough and caring. Highly recommend for cardiac issues.",
      visitDate: "2024-01-15",
      createdAt: "2024-01-16"
    },
    {
      id: 2,
      doctor: { name: "Dr. Sunil Jayawardena", specialty: "Neurologist", hospital: "Nawaloka Hospital" },
      rating: 4,
      text: "Very knowledgeable, but waiting time was a bit long. Good experience overall.",
      visitDate: "2023-12-20",
      createdAt: "2023-12-21"
    }
  ]);

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Blood Test Report - January 2024",
      type: "lab",
      reportDate: "2024-01-15",
      doctorName: "Dr. Sarah Perera",
      hospital: "Asiri Hospital",
      fileSize: "2.4 MB",
      isConfidential: false,
      description: "Complete blood count, lipid profile, and liver function tests"
    },
    {
      id: 2,
      title: "ECG Report",
      type: "scan",
      reportDate: "2024-01-15",
      doctorName: "Dr. Sarah Perera",
      hospital: "Asiri Hospital",
      fileSize: "1.8 MB",
      isConfidential: false,
      description: "Resting ECG - Normal sinus rhythm"
    },
    {
      id: 3,
      title: "Prescription - Amoxicillin",
      type: "prescription",
      reportDate: "2024-01-15",
      doctorName: "Dr. Sarah Perera",
      hospital: "Asiri Hospital",
      fileSize: "156 KB",
      isConfidential: false,
      description: "7-day course for respiratory infection"
    },
    {
      id: 4,
      title: "COVID-19 Vaccination Certificate",
      type: "vaccination",
      reportDate: "2023-06-10",
      doctorName: null,
      hospital: "National Hospital Colombo",
      fileSize: "890 KB",
      isConfidential: false,
      description: "Second dose completion certificate"
    }
  ]);

  const watchlist = [
    { id: 1, name: "Dr. Sarah Perera", specialty: "Cardiologist", status: "SLMC Verified", lastActive: "2 hours ago" },
    { id: 2, name: "Dr. Sunil Jayawardena", specialty: "Neurologist", status: "Pending Update", lastActive: "1 day ago" },
  ];

  const getReportIcon = (type) => {
    switch(type) {
      case 'lab': return <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><FileText size={20} /></div>;
      case 'scan': return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Stethoscope size={20} /></div>;
      case 'prescription': return <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><FileText size={20} /></div>;
      case 'vaccination': return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><ShieldCheck size={20} /></div>;
      default: return <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><FileText size={20} /></div>;
    }
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      lab: 'Laboratory',
      scan: 'Imaging/Scan',
      prescription: 'Prescription',
      vaccination: 'Vaccination',
      discharge_summary: 'Discharge Summary'
    };
    return labels[type] || 'Document';
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "text-amber-400 fill-amber-400" : "text-slate-300"} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">P</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">ProDoc <span className="text-teal-500">Portal</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-teal-500 transition-colors relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-semibold text-sm transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center text-teal-600">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.fullName || 'Patient Name'}</h2>
            <p className="text-slate-500 text-sm mb-6">{user?.email}</p>
            <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              <Settings size={18} /> Edit Profile
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'overview' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ShieldCheck size={20} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'reviews' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Star size={20} /> My Reviews
              <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                {reviews.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'reports' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileText size={20} /> Medical Records
              <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                {reports.length}
              </span>
            </button>
          </div>

          {/* CTA Card */}
          <div className="bg-teal-600 rounded-[2rem] p-8 text-white shadow-lg shadow-teal-200/50 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Find Doctors</h3>
              <p className="text-teal-100 text-sm mb-6">Search verified specialists in Sri Lanka.</p>
              <button className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-all flex items-center gap-2 w-full justify-center">
                <Search size={18} /> Search Directory
              </button>
            </div>
            <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0] || 'Patient'}! 👋</h2>
                <p className="text-slate-300">Manage your medical records and doctor reviews in one place.</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Star size={24} />
                    </div>
                    <span className="text-3xl font-bold text-slate-800">{reviews.length}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Doctor Reviews</h3>
                  <p className="text-sm text-slate-500">Reviews you've left for doctors</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <span className="text-3xl font-bold text-slate-800">{reports.length}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Medical Records</h3>
                  <p className="text-sm text-slate-500">Stored reports and documents</p>
                </div>
              </div>

              {/* Recent Reviews Preview */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Recent Reviews</h3>
                  <button onClick={() => setActiveTab('reviews')} className="text-teal-600 font-bold text-sm hover:underline">View All</button>
                </div>
                
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl">
                    <Star size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.slice(0, 2).map(review => (
                      <div key={review.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold shrink-0">
                          {review.doctor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-800 truncate">{review.doctor.name}</h4>
                            <div className="flex items-center gap-1 shrink-0">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{review.doctor.specialty}</p>
                          <p className="text-sm text-slate-600 line-clamp-2">"{review.text}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Reports Preview */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Recent Medical Records</h3>
                  <button onClick={() => setActiveTab('reports')} className="text-teal-600 font-bold text-sm hover:underline">View All</button>
                </div>
                
                <div className="space-y-3">
                  {reports.slice(0, 3).map(report => (
                    <div key={report.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                      {getReportIcon(report.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{report.title}</h4>
                        <p className="text-xs text-slate-500">{getReportTypeLabel(report.type)} • {report.reportDate}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Watchlist */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Heart className="text-red-500 fill-red-500" size={20} />
                    <h3 className="text-xl font-bold text-slate-800">Watchlist</h3>
                  </div>
                  <button className="text-teal-600 font-bold text-sm hover:underline">Manage</button>
                </div>
                
                <div className="space-y-3">
                  {watchlist.map(doc => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${doc.status === 'SLMC Verified' ? 'bg-teal-500' : 'bg-amber-500'}`}></div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition-colors">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.specialty}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${doc.status === 'SLMC Verified' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-800">My Reviews</h3>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <Plus size={18} /> Write a Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center text-slate-400 border border-slate-100 shadow-sm">
                  <Star size={48} className="mx-auto mb-4 opacity-20" />
                  <h4 className="text-lg font-bold text-slate-600 mb-2">No reviews yet</h4>
                  <p className="mb-6">Share your experience with doctors to help others.</p>
                  <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
                    Write Your First Review
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">
                            {review.doctor.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-slate-800">{review.doctor.name}</h4>
                            <p className="text-slate-500">{review.doctor.specialty} at {review.doctor.hospital}</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                              <Calendar size={14} /> Visited on {review.visitDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-xl">
                          {renderStars(review.rating)}
                          <span className="ml-2 font-bold text-amber-700">{review.rating}/5</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-6 mb-4">
                        <p className="text-slate-700 leading-relaxed text-lg">"{review.text}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Posted on {review.createdAt}</span>
                        <div className="flex gap-3">
                          <button className="text-teal-600 hover:text-teal-700 font-bold px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-600 font-bold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Storage Summary */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Medical Records Storage</h3>
                    <p className="text-teal-100">Securely store prescriptions, lab reports, scans & more</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-3xl font-bold">24.5 MB</p>
                      <p className="text-teal-100 text-sm">of 100 MB used</p>
                    </div>
                    <button className="bg-white text-teal-600 px-4 py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors flex items-center gap-2">
                      <Plus size={18} /> Upload
                    </button>
                  </div>
                </div>
                <div className="mt-6 bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-1/4 transition-all"></div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Lab Reports', 'Prescriptions', 'Scans', 'Vaccinations'].map((filter, idx) => (
                  <button 
                    key={filter}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${idx === 0 ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Reports List */}
              <div className="space-y-3">
                {reports.map(report => (
                  <div 
                    key={report.id} 
                    className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div 
                      className="p-6 flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                    >
                      <div className="flex items-center gap-4">
                        {getReportIcon(report.type)}
                        <div>
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            {report.title}
                            {report.isConfidential && <Lock size={16} className="text-amber-500" />}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium">
                              {getReportTypeLabel(report.type)}
                            </span>
                            <span>•</span>
                            <span>{report.reportDate}</span>
                            {report.doctorName && (
                              <>
                                <span>•</span>
                                <span>{report.doctorName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400 hidden md:block">{report.fileSize}</span>
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          {expandedReport === report.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </button>
                      </div>
                    </div>
                    
                    {expandedReport === report.id && (
                      <div className="px-6 pb-6 pt-0 bg-slate-50 border-t border-slate-100">
                        <div className="pt-4">
                          <div className="bg-white rounded-2xl p-4 mb-4 border border-slate-200">
                            <h5 className="font-bold text-slate-700 mb-2">Description</h5>
                            <p className="text-slate-600">{report.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-sm">
                              <Download size={18} /> Download PDF
                            </button>
                            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                              <FileText size={18} /> View Online
                            </button>
                            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                              <Share size={18} /> Share
                            </button>
                            <button className="ml-auto p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                              <MoreVertical size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;