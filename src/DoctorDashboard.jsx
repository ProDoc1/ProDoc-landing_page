import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Settings, 
  LogOut, 
  Activity,
  Award,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import Plasma from './components/Plasma';
import LogoColor from './assets/Logo_with_words.png';

const DoctorDashboard = ({ user, onLogout }) => {
  // Mock data for professional metrics
  const professionalStats = [
    { label: "Profile Views", value: "1,240", icon: <Activity className="text-blue-600" />, color: "bg-blue-50" },
    { label: "Verification Level", value: "Level 2", icon: <ShieldCheck className="text-teal-600" />, color: "bg-teal-50" },
    { label: "Endorsements", value: "84", icon: <Award className="text-purple-600" />, color: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen w-full relative flex font-sans text-slate-700 overflow-hidden bg-slate-50">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-30">
        <Plasma color="#0f766e" speed={0.2} scale={1.5} opacity={0.4} />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <img src={LogoColor} alt="ProDoc" className="h-12 object-contain" />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<Activity size={20} />} label="Performance" active />
          <NavItem icon={<ShieldCheck size={20} />} label="Credential Vault" />
          <NavItem icon={<FileText size={20} />} label="Surgical History" />
          <NavItem icon={<Settings size={20} />} label="Account Settings" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome, Dr. {user?.fullName || 'Specialist'}</h1>
            <p className="text-slate-500">Your professional profile is 85% verified.</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.fullName?.charAt(0) || 'D'}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {professionalStats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification Status Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">SLMC Verification Progress</h3>
            <div className="space-y-6">
              <Step icon={<CheckCircle className="text-teal-500" />} title="Identity Verified" desc="National ID and Professional Photo" completed />
              <Step icon={<CheckCircle className="text-teal-500" />} title="Medical License" desc="SLMC Registration #82910 verified" completed />
              <Step icon={<Clock className="text-amber-500" />} title="Surgical History" desc="Pending secondary hospital audit" />
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-slate-800 rounded-[2rem] p-8 shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Update Surgical Records</h3>
                <p className="text-slate-300 mb-6">Add your latest procedures to your public-facing verified history.</p>
                <button className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center gap-2 w-fit">
                  Manage Records <ChevronRight size={18} />
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-teal-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium ${active ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
    {icon} <span>{label}</span>
  </div>
);

const Step = ({ icon, title, desc, completed = false }) => (
  <div className="flex gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <p className={`font-bold ${completed ? 'text-slate-800' : 'text-slate-400'}`}>{title}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

export default DoctorDashboard;