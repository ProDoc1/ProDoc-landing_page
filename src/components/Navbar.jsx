import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Briefcase,
  FileText,
  User,
  Users,
  Menu,
  X
} from 'lucide-react';
import { NavBar } from './ui/tubelight-navbar';
import LogoColor from '../assets/Logo_with_words.png';
import LogoWhite from '../assets/logo_with_words_white.png';

const Navbar = ({ currentPage, onNavigateAbout, onNavigateHome }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Shared wrapper classes for the floating island look
  // fixed: keeps it on screen
  // top-6: moves it down (the "little below" you requested)
  // left-1/2 -translate-x-1/2: centers it perfectly
  // w-[95%] max-w-7xl: ensures it doesn't touch the edges
  const baseWrapper = "fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl transition-all duration-300 border";

  // Configuration for Page Themes
  const theme = {
    home: {
      // Dark/Transparent Mode
      wrapper: `${baseWrapper} ${scrolled ? "bg-black/20 backdrop-blur-xl border-white/10 shadow-lg" : "bg-transparent border-transparent"}`,
      text: "text-white",
      logoIcon: "#14b8a5ff",
      logoBg: "bg-white",
      btnSecondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
      btnPrimary: "bg-white text-[#14B8A6] hover:bg-slate-100",
      mobileToggle: "text-white hover:bg-white/10",
      
    },
    about: {
      // Light/Green Mode
    wrapper: `${baseWrapper} ${scrolled ? "bg-white/80 backdrop-blur-xl border-teal-100 shadow-lg" : "bg-[#E4F0F1]/20 backdrop-blur-sm border-transparent"}`,
      text: "text-slate-800",
      logoIcon: "#14B8A6",
      logoBg: "bg-white",
      btnSecondary: "bg-white text-[#14B8A6] hover:bg-teal-50 border border-transparent shadow-sm",
      btnPrimary: "bg-[#14B8A6] text-white hover:bg-[#0f968c]",
      mobileToggle: "text-slate-800 hover:bg-teal-500/10",
      tubelightBg: "#E4F0F1",
    }
  };

  const currentStyle = theme[currentPage] || theme.home;

  const navItems = [
    { name: 'Home', url: '#', icon: Stethoscope, onClick: onNavigateHome },
    { name: 'Services', url: '#services', icon: Briefcase },
    { name: 'About', url: '#', icon: User, onClick: onNavigateAbout },
    { name: 'How it Works', url: '#how-it-works', icon: FileText },
    { name: 'Team', url: '#team', icon: Users },
  ];

  return (
    <nav className={`${currentStyle.wrapper} px-4 md:px-6 py-3`}>
      <div className="flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onNavigateHome}>
          {/*
            If we're on the dark 'home' theme, don't render a white bg wrapper
            so transparent PNG logos remain transparent. For light pages keep
            a small padded background for contrast.
          */}
          {/* Render logo without a white padded background so transparent PNGs remain transparent.
              Keep a subtle hover scale for affordance. */}
          <div className="p-0 group-hover:scale-105 transition-transform">
            <img
              src={currentPage === 'home' ? LogoWhite : LogoColor}
              alt="ProDoc"
              className="h-12 md:h-16 lg:h-20 object-contain w-auto"
            />
          </div>
          <span className={`text-lg font-bold ${currentStyle.text}`}></span>
        </div>

        {/* Desktop Navigation (Center) */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavBar 
            items={navItems} 
            accentColor="#14B8A6" 
            bgColor={currentStyle.tubelightBg}
          />
        </div>

        {/* Desktop Buttons (Right) */}
        <div className="hidden md:flex items-center gap-3">
          <button className={`${currentStyle.btnSecondary} px-5 py-2 rounded-full text-sm font-semibold transition-all`}>
            Doctor Login
          </button>
          <button className={`${currentStyle.btnPrimary} px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md`}>
            Patient Login
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className={`md:hidden p-2 rounded-lg transition-colors ${currentStyle.mobileToggle}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 pt-4 md:hidden animate-in slide-in-from-top-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if(item.onClick) item.onClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-[#14B8A6] font-medium transition-colors text-left"
                >
                  <item.icon size={18} />
                  {item.name}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              <button className="w-full py-3 rounded-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100">
                Doctor Login
              </button>
              <button className="w-full py-3 rounded-xl font-bold bg-[#14B8A6] text-white hover:bg-[#0f968c]">
                Patient Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;