import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, MessageSquare, Stethoscope, ArrowRight, Star, UserCheck, CheckCircle, Bell, BrainCircuit, ScanLine, Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import WarpBackground from './components/ui/warp-background';
import LogoWithWords from './assets/Logo_with_words.png';
import Team from './components/team';
import AboutPage from './About';
import Navbar from './components/Navbar';
import LoginPage from './patientLogin';

// --- MAIN LANDING PAGE COMPONENT ---
const LandingPage = () => {
  
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
                Healthcare you can <span className="text-teal-200">trust.</span><br className="hidden md:block"/>
                Doctors you can <span className="text-teal-200">verify.</span>
              </h1>
              
              <p className="text-lg text-white/90 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-sm">
                Stop guessing. ProDoc connects you with verified specialists, authentic surgical histories, and structured patient reviews.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="flex items-center gap-2 bg-white text-teal-600 px-8 py-4 rounded-full font-bold hover:bg-teal-50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center shadow-lg hover:shadow-xl shadow-teal-900/10">
                  Get Started <ArrowRight size={18} />
                </button>
                <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center">
                  How it works
                </button>
              </div>
          </div>

          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-2xl relative z-10 rotate-2 hover:rotate-0 transition-transform duration-500">
                 <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                       <UserCheck className="w-8 h-8 text-teal-500" />
                    </div>
                    <div>
                       <h3 className="font-bold text-xl text-slate-900">Dr. Sarah Perera</h3>
                       <p className="text-slate-500 font-medium">Cardiologist • MBBS, MD</p>
                       <div className="flex items-center gap-1 mt-1">
                         {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s < 5 ? 'text-teal-500 fill-teal-500' : 'text-slate-300'}`} />
                         ))}
                         <span className="text-xs text-slate-400 ml-2 font-mono">(Verified)</span>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <span className="text-xs font-bold text-slate-400 uppercase">SLMC Status</span>
                       <span className="font-bold text-teal-500 flex items-center gap-1 text-sm"><ShieldCheck size={14}/> Verified</span>
                    </div>
                 </div>
              </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: AI FEATURES --- */}
      <div id="services" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-[2.5rem] p-10 col-span-1 md:col-span-2 group hover:shadow-xl transition-all">
             <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <ShieldCheck className="w-7 h-7 text-teal-500 group-hover:text-white" />
             </div>
             <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Verified Doctor Profiles</h3>
             <p className="text-slate-500 leading-relaxed max-w-lg">
                Access SLMC-validated credentials and authentic surgical histories for total transparency.
             </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 col-span-1 group hover:shadow-xl transition-all">
             <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <BrainCircuit className="w-7 h-7 text-teal-500 group-hover:text-white" />
             </div>
             <h3 className="text-2xl font-bold mb-4 text-slate-900">Medical Report AI</h3>
             <p className="text-slate-500 text-sm leading-relaxed">
                Upload lab reports or diagnostic images for easy-to-read summaries of main findings and risks.
             </p>
          </div>

          <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white rounded-[2.5rem] p-10 col-span-1 md:col-span-3 group hover:shadow-2xl transition-all">
             <div className="relative z-10 max-w-2xl">
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 text-white border border-white/10 group-hover:bg-white/20 transition-colors">
                   <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">24/7 AI Chatbot</h3>
                <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                   Get instant support for symptom-based specialist matching at any time.
                </p>
                <button className="mt-8 bg-white text-teal-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-teal-50 transition-all">
                   Try Chatbot Demo
                </button>
             </div>
          </div>
      </div>

      <div id="team"><Team/></div>
      
      <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 border border-slate-100 shadow-2xl">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 space-y-6">
               <img src={LogoWithWords} alt="ProDoc" className="h-10 w-auto" />
               <p className="text-sm leading-relaxed text-slate-500">ProDoc: Revolutionizing Sri Lankan healthcare with verified doctors and AI-powered insights.</p>
               <div className="flex gap-3">
                  <a href="#" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 transition-colors"><Facebook size={18} /></a>
                  <a href="https://www.instagram.com/prodoclk/" target="_blank" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 transition-colors"><Instagram size={18} /></a>
                  <a href="https://www.linkedin.com/in/pro-doc-69964a3a6/" target="_blank" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 transition-colors"><Linkedin size={18} /></a>
               </div>
            </div>
         </div>
         <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-400">
             <p>© {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
};

// --- APP EXPORT ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

  return (
    <main className="relative min-h-screen">
      {currentPage !== 'login' && (
        <Navbar 
          currentPage={currentPage} 
          onNavigateHome={() => navigateTo('home')}
          onNavigateAbout={() => navigateTo('about')}
          onNavigateServices={() => navigateToSection('services')}
          onNavigateHowitWorks={() => navigateToSection('how-it-works')}
          onNavigateTeam={() => navigateToSection('team')}
          onNavigateLogin={() => navigateTo('login')}
        />
      )}

      {currentPage === 'home' && (
        <LandingPage />
      )}
      
      {currentPage === 'about' && (
        <AboutPage onBack={() => navigateTo('home')} />
      )}

      {currentPage === 'login' && (
        <LoginPage onBack={() => navigateTo('home')} />
      )}
    </main>
  );
}