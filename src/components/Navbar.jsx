import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  User,
  Home,
  Users,
  Menu,
  X,
  LayoutGrid,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { NavBar } from './ui/tubelight-navbar';
import LogoColor from '../assets/Logo_with_words.png';
import LogoWhite from '../assets/logo_with_words_white.png';

const Navbar = ({
  currentPage,
  onNavigateAbout,
  onNavigateHome,
  onNavigateLogin,
  onNavigateSignupPage,
  onNavigateDoctors,
  currentUser,
  onLogout,
  onNavigateDashboard,
  onNavigateContentHub,
  onNavigatePrivacy,
  onNavigateTerms,
  adminUser,
  onNavigateAdmin,
  onNavigateDoctorRegistration,
  scrolled,
  hideNavbar
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const baseWrapper = "fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl transition-all duration-300 border";

  const wrapperWithVisibility = baseWrapper;

  const theme = {
    home: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-black/20 backdrop-blur-xl border-white/10 shadow-lg" : "bg-transparent border-transparent"}`,
      text: "text-white",
      btnPrimary: "bg-white text-[#14B8A6] hover:bg-slate-100",
      mobileToggle: "text-white hover:bg-white/10",
      profileBtn: "bg-white/10 text-white border-white/20 hover:bg-white/20",
    },
    about: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    doctors: {
      wrapper: `${wrapperWithVisibility} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      logoBg: "bg-transparent",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    login: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/90 backdrop-blur-xl border-teal-100 shadow-lg" : "bg-white/80 backdrop-blur-sm border-transparent"}`,
      text: "text-teal-600",
      btnPrimary: "bg-[#14B8A6] text-white hover:bg-[#0f968c]",
      mobileToggle: "text-slate-800 hover:bg-teal-500/10",
      tubelightBg: "#E4F0F1",
      profileBtn: "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100",
    },
    dashboard: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "bg-transparent border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-500 text-white",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: `${scrolled ? "bg-white/60" : "bg-white/20"} text-slate-800 border-slate-200 hover:bg-white/80`,
    },
    'doctor-dashboard': {
      wrapper: `${wrapperWithVisibility} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    'doctor-view': {
      wrapper: `${wrapperWithVisibility} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "bg-transparent border-transparent"}`,
      text: "text-slate-800",
      logoBg: "bg-transparent",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: `${scrolled ? "bg-white" : "bg-white/20"} text-slate-800 border-slate-200 hover:bg-slate-50`,
    },
    'content-hub': {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "bg-transparent border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: `${scrolled ? "bg-white/60" : "bg-white/20"} text-slate-800 border-slate-200 hover:bg-white/80`,
    },
    privacy: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    terms: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    admin: {
      wrapper: `${baseWrapper} bg-white/80 backdrop-blur-xl border-slate-200 shadow-sm`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    'doctor-registration': {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    'patient-profile': {
      wrapper: `${wrapperWithVisibility} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    'content-hub': {
      wrapper: `${baseWrapper} bg-white/80 backdrop-blur-xl border-slate-200 shadow-sm`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    privacy: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    terms: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    admin: {
      wrapper: `${baseWrapper} bg-white/80 backdrop-blur-xl border-slate-200 shadow-sm`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    'doctor-registration': {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    },
    'patient-profile': {
      wrapper: `${wrapperWithVisibility} ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg" : "backdrop-blur-md border-transparent"}`,
      text: "text-slate-800",
      btnPrimary: "bg-teal-600 text-white hover:bg-teal-700",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#14B8A6",
      tubelightText: "text-white",
      profileBtn: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
    }
  };

  const currentStyle = theme[currentPage] || theme.home;

  const navItems = [
    { name: 'Home', url: '/', icon: Home, onClick: onNavigateHome },
    { name: 'About Us', url: '/about', icon: Users, onClick: onNavigateAbout },
    { name: 'Doctors', url: '/doctors', icon: Stethoscope, onClick: onNavigateDoctors },
    { name: 'Content Hub', url: '/content-hub', icon: LayoutGrid, onClick: onNavigateContentHub },
  ];

  const userRole = localStorage.getItem('userRole');
  // Accept multiple possible image field names from different parts of the app/backend
  const userImage = currentUser?.image_url || currentUser?.image || currentUser?.imageURL || currentUser?.image_URL || null;
  const isDoctor = userRole === 'doctor' || currentUser?.user_type === 'doctor' || currentUser?.role === 'doctor';

  const activeItemNameMapping = {
    'home': 'Home',
    'about': 'About Us',
    'doctors': 'Doctors',
    'doctor-view': 'Doctors', // Doctor view counts as Doctors
    'content-hub': 'Content Hub'
  };

  return (
    <nav className={`${currentStyle.wrapper} px-4 md:px-6 py-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${hideNavbar ? '-translate-y-[150%] opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`} >
      <div className="flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onNavigateHome}>
          <div className={`p-0 group-hover:scale-105 transition-transform rounded-lg ${currentPage === 'doctors' || currentPage === 'doctor-view' ? currentStyle.logoBg : ''}`}>
            <img
              src={currentPage === 'home' ? LogoWhite : LogoColor}
              alt="ProDoc"
              className="h-12 md:h-16 lg:h-20 object-contain w-auto"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavBar
            items={navItems}
            accentColor="#0ee9cf3b"
            bgColor={currentStyle.tubelightBg}
            textClass={currentStyle.tubelightText || currentStyle.text}
            activeItemName={activeItemNameMapping[currentPage]}
          />
        </div>

        {/* Desktop Buttons / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 ${isDoctor ? 'p-2 pr-6 rounded-full bg-white text-slate-900 border border-slate-200 shadow-2xl' : 'p-1.5 pr-4 rounded-full'} transition-all group ${currentStyle.profileBtn}`}
              >
                <div className={`${isDoctor ? 'w-11 h-11' : 'w-9 h-9'} rounded-full bg-teal-500 flex items-center justify-center overflow-hidden border border-white/30`}
                >
                  {userImage ? (
                    <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div className="text-left">
                  <p className={`${isDoctor ? 'text-sm' : 'text-xs'} font-bold leading-none ${isDoctor ? 'text-slate-900' : currentStyle.text}`}>
                    {currentUser.name || currentUser.fullName || 'User'}
                  </p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name || currentUser.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        onNavigateDashboard();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      <User size={18} /> My Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <X size={18} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : adminUser ? (
            <button
              onClick={onNavigateAdmin}
              className={`${currentStyle.btnPrimary} px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-500/10 flex items-center gap-2`}
            >
              <ShieldCheck size={16} /> Admin Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={onNavigateLogin}
                className={`${currentStyle.btnPrimary} px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md`}
              >
                Login
              </button>

              <button
                onClick={onNavigateSignupPage}
                className={`${currentPage === 'doctor' ? currentStyle.btnSecondary : currentStyle.btnPrimary} px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md`}
              >
                Signup
              </button>

            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {currentUser && (
            <button
              onClick={() => onNavigateDashboard()}
              className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center overflow-hidden border border-white/30"
            >
              {userImage ? (
                <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-white" />
              )}
            </button>
          )}
          <button
            className={`p-2 rounded-lg transition-colors ${currentStyle.mobileToggle}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 pt-4 md:hidden animate-in slide-in-from-top-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-[#14B8A6] font-medium transition-colors text-left"
                >
                  <item.icon size={20} />
                  {item.name}
                </button>
              ))}

              <div className="h-px bg-slate-100 my-2" />

              <div className="flex flex-col gap-3 mt-2">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        onNavigateDashboard();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-4 rounded-xl font-bold bg-teal-50 text-teal-600 hover:bg-teal-100 transition-all"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-4 rounded-xl font-bold text-rose-600 hover:bg-rose-50 transition-all border border-rose-100"
                    >
                      Logout
                    </button>
                  </>
                ) : adminUser ? (
                  <button
                    onClick={() => {
                      onNavigateAdmin();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest bg-teal-500 text-white shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} /> Admin Control
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onNavigateLogin();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-4 rounded-xl font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        onNavigateSignupPage();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-4 rounded-xl font-bold bg-[#14B8A6] text-white hover:bg-[#0f968c] shadow-lg shadow-teal-100 transition-all"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav >
  );
};

export default Navbar;