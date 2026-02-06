import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
  Activity,
  Award,
  CheckCircle,
  Clock,
  ChevronRight,
  Star,
  Pencil,
  X,
  Calendar
} from 'lucide-react';
import Plasma from './components/Plasma';
import LogoColor from './assets/Logo_with_words.png';

const DoctorDashboard = ({ user, onLogout }) => {
  // State for new features
  const [isSecondOpinionEnabled, setIsSecondOpinionEnabled] = useState(true);
  const [availability, setAvailability] = useState("Mon, Wed, Fri");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [localUser, setLocalUser] = useState({
    fullName: user?.name || 'Dr. Alex Specialist',
    email: user?.email || 'alex@prodoc.com',
    bio: user?.specialty || 'Senior Cardiologist with 10 years of experience.'
  });

  // Mock Reviews Data
  const reviews = [
    { id: 1, patient: "Verified Patient", rating: 5, date: "2 days ago", comment: "Dr. Specialist provided an incredibly detailed second opinion that helped us avoid unnecessary surgery." },
    { id: 2, patient: "Verified Patient", rating: 4, date: "1 week ago", comment: "Very professional and quick response. The dates were a bit hard to book, but worth it." },
    { id: 3, patient: "Verified Patient", rating: 5, date: "2 weeks ago", comment: "Excellent advice. The tele-consultation was seamless." }
  ];

  React.useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'doctor') {
      onLogout();
    }
  }, [onLogout]);

  // Mock data for professional metrics
  const professionalStats = [
    { label: "Profile Views", value: "1,240", icon: <Activity className="text-blue-600" />, color: "bg-blue-50" },
    { label: "Rating", value: "4.8/5", icon: <Star className="text-yellow-500" />, color: "bg-yellow-50" },
    { label: "Endorsements", value: "84", icon: <Award className="text-purple-600" />, color: "bg-purple-50" },
  ];

  const handleProfileSave = (e) => {
    e.preventDefault();
    // In a real app, you'd call an API here
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen w-full relative flex font-sans text-slate-700 overflow-hidden bg-slate-50">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-30 pointer-events-none">
        <Plasma color="#0f766e" speed={0.2} scale={1.5} opacity={0.4} />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <img src={LogoColor} alt="ProDoc" className="h-12 object-contain" />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<Activity size={20} />} label="Dashboard" active />
          <NavItem icon={<ShieldCheck size={20} />} label="Credential Vault" />
          <NavItem icon={<FileText size={20} />} label="Second Opinions" badge={3} /> {/* Badge indicates messages */}
          <NavItem icon={<Star size={20} />} label="Reviews" />
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
            <h1 className="text-3xl font-bold text-slate-800">Welcome, {localUser.fullName}</h1>
            <p className="text-slate-500">{localUser.bio}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-slate-600 font-medium"
            >
              <Pencil size={16} /> Edit Profile
            </button>
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold shadow-lg">
              {localUser.fullName?.charAt(0) || 'D'}
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Verification Status Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">SLMC Verification Progress</h3>
            <div className="space-y-6">
              <Step icon={<CheckCircle className="text-teal-500" />} title="Identity Verified" desc="National ID and Professional Photo" completed />
              <Step icon={<CheckCircle className="text-teal-500" />} title="Medical License" desc="SLMC Registration #82910 verified" completed />
              <Step icon={<Clock className="text-amber-500" />} title="Surgical History" desc="Pending secondary hospital audit" />
            </div>
          </div>

          {/* Second Opinion Settings Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Second Opinion</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {isSecondOpinionEnabled
                      ? "Patients can message you for consultations."
                      : "Currently unavailable for new opinions."}
                  </p>
                </div>
                {/* Custom Toggle Switch */}
                <button
                  onClick={() => setIsSecondOpinionEnabled(!isSecondOpinionEnabled)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${isSecondOpinionEnabled ? 'bg-teal-500' : 'bg-slate-200'}`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isSecondOpinionEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {isSecondOpinionEnabled && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-fadeIn">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Available Dates
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                        placeholder="e.g. Mon, Wed, Fri"
                      />
                    </div>
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                      Save
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">These are the dates patients see when booking.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Recent Patient Reviews</h3>
            <button className="text-teal-600 text-sm font-semibold hover:text-teal-700">View All</button>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{review.patient}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-md tracking-wide">Verified</span>
                  </div>
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Edit Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleProfileSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={localUser.fullName}
                  onChange={(e) => setLocalUser({ ...localUser, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Specialty</label>
                <textarea
                  rows={3}
                  value={localUser.bio}
                  onChange={(e) => setLocalUser({ ...localUser, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-medium shadow-lg shadow-slate-300/50 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false, badge }) => (
  <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium ${active ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
    <div className="flex items-center gap-3">
      {icon} <span>{label}</span>
    </div>
    {badge && <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
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