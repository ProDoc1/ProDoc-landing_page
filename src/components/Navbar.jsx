import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  User,
  Home,
  Users,
  Menu,
  X
} from 'lucide-react';
import { NavBar } from './ui/tubelight-navbar';
import LogoColor from '../assets/Logo_with_words.png';
import LogoWhite from '../assets/logo_with_words_white.png';

const Navbar = ({ currentPage, onNavigateAbout, onNavigateHome, onNavigateLogin, onNavigateSignupPage, onNavigateDoctors }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentPage === 'doctor') {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, currentPage]);

  const baseWrapper = "fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl transition-all duration-300 border";

  // Logic to hide/show navbar on doctor page scroll
  const wrapperWithVisibility = currentPage === 'doctor' && !isVisible 
    ? `${baseWrapper} -translate-y-32` 
    : baseWrapper;

  const theme = {
    home: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-black/20 backdrop-blur-xl border-white/10 shadow-lg" : "bg-transparent border-transparent"}`,
      text: "text-white",
      btnPrimary: "bg-white text-[#14B8A6] hover:bg-slate-100",
      mobileToggle: "text-white hover:bg-white/10",
    },
    about: {
      wrapper: `${baseWrapper} ${scrolled ? "backdrop-blur-xl shadow-lg" : " backdrop-blur-xl "}`,
      text: "text-white",
      btnPrimary: "bg-white text-teal-600",
      mobileToggle: "text-white hover:bg-white/10",
      tubelightBg: "#14B8A6",
    },
   doctors: {
      // YOUR NEW STYLE: This is independent and won't affect Home or Login
      wrapper: `${wrapperWithVisibility} ${scrolled ? "backdrop-blur-xl shadow-lg " : " backdrop-blur-xl"}`,
      text: "text-white",
      logoBg: "bg-white", 
      btnPrimary: "bg-white text-teal-600",
      mobileToggle: "text-white hover:bg-white/10",
      tubelightBg: "#14B8A6", 
    },
    login: {
      wrapper: `${baseWrapper} ${scrolled ? "bg-white/90 backdrop-blur-xl border-teal-100 shadow-lg" : "bg-white/80 backdrop-blur-sm border-transparent"}`,
      text: "text-teal-600",
      btnPrimary: "bg-[#14B8A6] text-white hover:bg-[#0f968c]",
      mobileToggle: "text-slate-800 hover:bg-teal-500/10",
      tubelightBg: "#E4F0F1",
    },
    dashboard: {
      wrapper: `fixed top-0 left-0 right-0 w-full z-50 border-b border-slate-300 bg-white/95 backdrop-blur-xl shadow-sm`,
      text: "text-slate-800",
      btnPrimary: "bg-[#14B8A6] text-white hover:bg-[#0f968c]",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#0F766E",
    },
    'doctor-dashboard': {
      wrapper: `fixed top-0 left-0 right-0 w-full z-50 border-b border-slate-300 bg-white/95 backdrop-blur-xl shadow-sm`,
      text: "text-slate-800",
      btnPrimary: "bg-[#14B8A6] text-white hover:bg-[#0f968c]",
      mobileToggle: "text-slate-800 hover:bg-slate-100",
      tubelightBg: "#0F766E",
    }
  };

  const currentStyle = theme[currentPage] || theme.home;

  const navItems = [
    { name: 'Home', url: '#', icon: Home, onClick: onNavigateHome },
    { name: 'About Us', url: '#', icon: Users, onClick: onNavigateAbout },
    { name: 'Doctors', url: '#', icon: Stethoscope, onClick: onNavigateDoctors },
  ];

  return (
    <nav className={`${currentStyle.wrapper} px-4 md:px-6 py-3`}>
      <div className="flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onNavigateHome}>
          <div className={`p-0 group-hover:scale-105 transition-transform rounded-lg ${currentPage === 'doctor' ? currentStyle.logoBg : ''}`}>
            <img
              src={currentPage === 'home' || currentPage === 'doctor' ? LogoWhite : LogoColor}
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
          />
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
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
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 rounded-lg transition-colors ${currentStyle.mobileToggle}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 pt-4 md:hidden animate-in slide-in-from-top-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if(item.onClick) item.onClick();
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
