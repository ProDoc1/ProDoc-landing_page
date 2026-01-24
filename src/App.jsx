import React, { useState, useEffect } from 'react'; 
import { Search, ShieldCheck, Star, UserCheck, Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import WarpBackground from './components/ui/warp-background';
import LogoWithWords from './assets/Logo_with_words.png';
import AboutPage from './About';
import Navbar from './components/Navbar';
import LoginPage from './patientLogin';
import SignupPage from './Signup'; 
import DoctorsPage from './doctor';
import PatientDashboard from './PatientDashboard'; 
import DoctorDashboard from './DoctorDashboard';

// --- MAIN LANDING PAGE COMPONENT ---
const LandingPage = ({ onNavigateHowitWorks, onFindSpecialist }) => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F8F8] font-sans text-slate-900 pb-8 px-4 pt-4 cursor-default selection:bg-teal-100 selection:text-teal-900">
      
      {/* --- SECTION 1: HERO SECTION --- */}
      <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 mb-6 overflow-hidden shadow-sm bg-teal-900/5">
        <WarpBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/70 via-teal-900/30 to-teal-900/5 z-0 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

        <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10 pt-24 md:pt-32">
          <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 pr-4 pl-1 py-1 rounded-full mb-8 hover:bg-white/20 transition-colors cursor-default">
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                   <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                </div>
                <span className="text-sm font-semibold text-white">Now Live in Sri Lanka</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05] text-white drop-shadow-sm">
                Healthcare you can <span className="text-teal-200 selection:bg-white/20">trust.</span><br className="hidden md:block"/>
                Doctors you can <span className="text-teal-200 selection:bg-white/20">verify.</span>
              </h1>
              
              <p className="text-lg text-white/90 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-sm">
                Stop guessing. ProDoc connects you with verified specialists, authentic surgical histories, and structured patient reviews.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={onFindSpecialist}
                  className="flex items-center gap-2 bg-white text-teal-600 px-8 py-4 rounded-full font-bold hover:bg-teal-50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center shadow-lg hover:shadow-xl shadow-teal-900/10 group"
                >
                  Find a Specialist <Search size={18} className="transition-transform group-hover:scale-110" />
                </button>
                <button 
                  onClick={onNavigateHowitWorks}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center"
                >
                  How it works
                </button>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-white/80">
                 <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                      <div key={i} className={`w-9 h-9 rounded-full border-2 border-teal-800 bg-slate-200 flex items-center justify-center text-[10px] text-white overflow-hidden ring-2 ring-transparent hover:ring-teal-400 hover:z-10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
                        <UserCheck size={16} className="text-slate-400" />
                      </div>
                    ))}
                 </div>
                 <p className="drop-shadow-sm">Trusted by 10,000+ patients</p>
              </div>
          </div>

          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-2xl relative z-10 rotate-2 hover:rotate-0 transition-transform duration-500 hover:shadow-teal-500/20 cursor-default">
                 <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                       <UserCheck className="w-8 h-8 text-teal-500" />
                    </div>
                    <div>
                       <h3 className="font-bold text-xl text-slate-900">Dr. Sarah Perera</h3>
                       <p className="text-slate-500 font-medium">Cardiologist • MBBS, MD</p>
                       <div className="flex items-center gap-1 mt-1">
                         {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s < 5 ? 'text-teal-500 fill-teal-500' : 'text-slate-300'}`} />
                         ))}
                         <span className="text-xs text-slate-400 ml-2 font-mono">(124 Verified)</span>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-colors">
                       <span className="text-xs font-bold text-slate-400 uppercase">Experience</span>
                       <span className="font-bold text-slate-900">12 Years</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-colors">
                       <span className="text-xs font-bold text-slate-400 uppercase">SLMC Status</span>
                       <span className="font-bold text-teal-500 flex items-center gap-1 text-sm"><ShieldCheck size={14}/> Verified</span>
                    </div>
                 </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-500/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* --- SERVICES SECTION --- */}
      <div id="services" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-[2.5rem] p-10 col-span-1 md:col-span-2 group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
             <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                <ShieldCheck className="w-7 h-7 text-teal-500 group-hover:text-white" />
             </div>
             <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Verified Doctor Profiles</h3>
             <p className="text-slate-500 leading-relaxed max-w-lg">
                Displays detailed information including qualifications, experience, specializations, training background, and professional achievements.
             </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 col-span-1 flex flex-col justify-between group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
             <div>
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                   <Search className="w-7 h-7 text-teal-500 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Advanced Search & Filtering</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                   Users can filter doctors by specialization, location, hospital type, availability, and procedure.
                </p>
             </div>
          </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-400"></div>
         <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            <div className="md:col-span-4 space-y-6">
               <img src={LogoWithWords} alt="ProDoc" className="h-10 md:h-12 w-auto" />
               <p className="text-sm text-slate-500 max-w-sm">Sri Lanka's first centralized platform for transparent healthcare.</p>
               <div className="flex gap-3">
                  <Facebook size={18} className="cursor-pointer hover:text-teal-600"/>
                  <Instagram size={18} className="cursor-pointer hover:text-teal-600"/>
                  <Linkedin size={18} className="cursor-pointer hover:text-teal-600"/>
               </div>
            </div>
            <div className="md:col-span-4">
               <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase">Contact</h4>
               <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3"><Mail size={18} className="text-teal-600"/> prdoc2025se06@gmail.com</li>
                  <li className="flex items-center gap-3"><Phone size={18} className="text-teal-600"/> +94 76 793 7055</li>
               </ul>
            </div>
         </div>
         <div className="mt-16 pt-8 border-t text-center text-xs text-slate-400">
            © {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.
         </div>
      </footer>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  // --- CHECK SESSION ON LOAD ---
  useEffect(() => {
    const savedSession = localStorage.getItem('prodoc_session');
    if (savedSession) {
      const user = JSON.parse(savedSession);
      setCurrentUser(user);
      setCurrentPage(user.userType === 'doctor' ? 'doctor_dashboard' : 'dashboard');
    }
  }, []);

  const navigateTo = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const navigateToSection = (sectionId) => {
    setCurrentPage('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('prodoc_session', JSON.stringify(user));
    navigateTo(user.userType === 'doctor' ? 'doctor_dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('prodoc_session');
    setCurrentUser(null);
    navigateTo('home');
  };

  return (
    <main className="relative min-h-screen">
      {/* PERSISTENT NAVBAR (Hidden on dashboards and login/signup) */}
      {!['login', 'signup', 'dashboard', 'doctor_dashboard'].includes(currentPage) && (
        <Navbar 
          currentPage={currentPage} 
          onNavigateHome={() => navigateTo('home')}
          onNavigateAbout={() => navigateTo('about')}
          onNavigateServices={() => navigateToSection('services')}
          onNavigateHowitWorks={() => navigateToSection('how-it-works')}
          onNavigateLogin={() => navigateTo('login')}
          onNavigateSignupPage={() => navigateTo('signup')}
        />
      )}

      {/* PAGE ROUTING */}
      {currentPage === 'home' && (
        <LandingPage 
          onNavigateHowitWorks={() => navigateToSection('how-it-works')}
          onFindSpecialist={() => navigateTo('doctors')}
        />
      )}
      
      {currentPage === 'about' && (
        <AboutPage onBack={() => navigateTo('home')} />
      )}

      {currentPage === 'login' && (
        <LoginPage 
          onBack={() => navigateTo('home')} 
          onNavigateSignup={() => navigateTo('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === 'signup' && (
        <SignupPage 
          onBack={() => navigateTo('home')}
          onNavigateLogin={() => navigateTo('login')} 
        />
      )}

      {currentPage === 'doctors' && (
        <DoctorsPage onBack={() => navigateTo('home')} />
      )}

      {currentPage === 'dashboard' && (
        <PatientDashboard user={currentUser} onLogout={handleLogout} />
      )}

      {currentPage === 'doctor_dashboard' && (
        <DoctorDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </main>
  );
}