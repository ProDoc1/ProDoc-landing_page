import React from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Search, 
  ShieldCheck, 
  Bell, 
  ChevronRight, 
  Heart 
} from 'lucide-react';

const PatientDashboard = ({ user, onLogout }) => {
  // Your watchlist data
  const watchlist = [
    { id: 1, name: "Dr. Sarah Perera", specialty: "Cardiologist", status: "SLMC Verified", lastActive: "2 hours ago" },
    { id: 2, name: "Dr. Sunil Jayawardena", specialty: "Neurologist", status: "Pending Update", lastActive: "1 day ago" },
  ];

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

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: PROFILE & QUICK ACTIONS --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center text-teal-600">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.fullName || 'Patient Name'}</h2>
            <p className="text-slate-500 text-sm mb-6">{user?.email}</p>
            <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              <Settings size={18} /> Edit Profile
            </button>
          </div>

          <div className="bg-teal-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-teal-200/50 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Find More Doctors</h3>
              <p className="text-teal-100 text-sm mb-6">Search our database of verified specialists in Sri Lanka.</p>
              <button className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-all flex items-center gap-2 w-full justify-center">
                <Search size={18} /> Search Directory
              </button>
            </div>
            <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
          </div>
        </div>

        {/* --- RIGHT COLUMN: WATCHLIST --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Heart className="text-red-500 fill-red-500" size={20} />
                <h3 className="text-xl font-bold text-slate-800">My Verified Watchlist</h3>
              </div>
              <button className="text-teal-600 font-bold text-sm hover:underline">Manage List</button>
            </div>
            
            <div className="space-y-4">
              {watchlist.map(doc => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${doc.status === 'SLMC Verified' ? 'bg-teal-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{doc.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{doc.specialty} • <span className={doc.status === 'SLMC Verified' ? 'text-teal-600' : 'text-amber-600'}>{doc.status}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">{doc.lastActive}</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>

            {watchlist.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
                <p>No doctors in your watchlist yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;