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
  
  // Add smooth scrolling to the html element
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    // Changed main background to a very subtle mint-grey for harmony
    <div className="min-h-screen bg-[#F0F8F8] font-sans text-slate-900 pb-8 px-4 pt-4 cursor-default selection:bg-teal-100 selection:text-teal-900">
      
      {/* --- SECTION 1: HERO SECTION --- */}
      <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 mb-6 overflow-hidden shadow-sm bg-teal-900/5">
        
        {/* THE SHADER BACKGROUND */}
        <WarpBackground />
        
        {/* Gradient Mask Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/70 via-teal-900/30 to-teal-900/5 z-0 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

        {/* Hero Content Grid 
            Added 'pt-24 md:pt-32' to push content down below the fixed Navbar 
        */}
        <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10 pt-24 md:pt-32">
          
          {/* Left: Text Content */}
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
                <button className="flex items-center gap-2 bg-white text-teal-600 px-8 py-4 rounded-full font-bold hover:bg-teal-50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center shadow-lg hover:shadow-xl shadow-teal-900/10">
                  Find a Specialist <Search size={18} className="transition-transform group-hover:scale-110" />
                </button>
                <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center">
                  How it works
                </button>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-white/80">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-9 h-9 rounded-full border-2 border-teal-800 bg-slate-${i+1}00 flex items-center justify-center text-[10px] text-white overflow-hidden bg-slate-200 ring-2 ring-transparent hover:ring-teal-400 hover:z-10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
                        <UserCheck size={16} className="text-slate-400" />
                      </div>
                    ))}
                 </div>
                 <p className="drop-shadow-sm">Trusted by 10,000+ patients</p>
              </div>
          </div>

          {/* Right: Abstract Graphic / Mockup */}
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

      {/* --- SECTION 3: SERVICES (UPDATED FEATURES) --- */}
      <div id="services" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Feature 1: Verified Profiles */}
          <div className="bg-white rounded-[2.5rem] p-10 col-span-1 md:col-span-2 group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
             <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                <ShieldCheck className="w-7 h-7 text-teal-500 group-hover:text-white" />
             </div>
             <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Verified Doctor Profiles</h3>
             <p className="text-slate-500 leading-relaxed max-w-lg">
                Displays detailed information including qualifications, experience, specializations, training background, and professional achievements.
             </p>
          </div>

          {/* Feature 2: Advanced Search */}
          <div className="bg-white rounded-[2.5rem] p-10 col-span-1 flex flex-col justify-between group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
             <div>
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                   <Search className="w-7 h-7 text-teal-500 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Advanced Search & Filtering</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                   Users can filter doctors by specialization, location, hospital type (government/private), availability, and procedure.
                </p>
             </div>
          </div>

          {/* Feature 3: Patient Dashboard */}
          <div className="bg-white rounded-[2.5rem] p-10 col-span-1 flex flex-col justify-between group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
             <div>
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                   {/* Removed FileText icon import if not used elsewhere, using fallback or generic */}
                   <CheckCircle className="w-7 h-7 text-teal-500 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Patient Dashboard</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                   Allows patients to upload and store medical history, lab reports, and prescriptions in one centralized place.
                </p>
             </div>
          </div>

          {/* Feature 4: AI Medical Decision Support */}
          <div className="bg-white rounded-[2.5rem] p-10 col-span-1 md:col-span-2 group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
             <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                <BrainCircuit className="w-7 h-7 text-teal-500 group-hover:text-white" />
             </div>
             <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">AI Medical Decision Support</h3>
             <p className="text-slate-500 leading-relaxed max-w-lg">
                Users can upload lab reports or diagnostic images (X-rays, CT scans, MRI); the AI analyzes them to provide easy-to-read summaries and identify potential risks.
             </p>
          </div>

          {/* Feature 5: Multilingual AI Chatbot */}
          <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white rounded-[2.5rem] p-10 col-span-1 md:col-span-3 overflow-hidden relative group hover:shadow-2xl hover:shadow-teal-900/20 transition-all duration-300 hover:-translate-y-1">
             <div className="relative z-10 max-w-2xl">
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 text-white border border-white/10 group-hover:bg-white/20 transition-colors duration-300 group-hover:scale-110">
                   <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Multilingual AI Chatbot</h3>
                <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                   Describe your symptoms in Sinhala, Tamil, or English, and our AI will guide you to the right specialist immediately. Breaking language barriers in healthcare.
                </p>
                <button className="mt-8 bg-white text-teal-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-teal-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20">
                   Try Chatbot Demo
                </button>
             </div>
             <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-teal-500/20 to-transparent opacity-50 hidden md:block group-hover:opacity-70 transition-opacity duration-500"></div>
          </div>
      </div>

      {/* --- SECTION 4: HOW IT WORKS (Steps) --- */}
      <div id="how-it-works" className="bg-white rounded-[2.5rem] p-10 md:p-16 mb-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Simplifying your healthcare journey.</h2>
             <p className="text-slate-500">Three simple steps to find the care you need.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
             <div className="relative group cursor-default">
                <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/20">
                   <Search size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-teal-600 transition-colors">Find the Right Specialist</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                   Search for doctors by name, specialization, or hospital, or use our multilingual AI chatbot to describe your symptoms and get instantly matched with the correct specialist.
                </p>
             </div>
             <div className="relative group cursor-default">
                <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/20">
                   <ScanLine size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-teal-600 transition-colors">Understand Your Medical Reports</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                   Upload your lab reports, X-rays, or CT scans to our AI Medical Decision Support System to receive an instant, easy-to-read summary of findings and risk assessments.
                </p>
             </div>
             <div className="relative group cursor-default">
                <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/20">
                   <Star size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-teal-600 transition-colors">Share Your Experience</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                   Help others by rating your doctor on punctuality and professionalism, with our new offensive comment detection system ensuring a safe and respectful community.
                </p>
             </div>
          </div>
      </div>

      {/* --- SECTION 6: TEAM --- */}
      <div id="team">
        <Team/>
      </div>
      
         {/* --- SECTION 5: FOOTER (About page footer reused) --- */}
         <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-400"></div>
        
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
               <div className="md:col-span-4 space-y-6">
                  <div className="flex items-center gap-3">
                     <img src={LogoWithWords} alt="ProDoc" className="h-10 md:h-12 w-auto" />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                     ProDoc is Sri Lanka's first centralized platform for transparent healthcare.
                  </p>
                  <div className="flex gap-3 mt-2">
                     <a href="#" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Facebook size={18} /></a>
                     <a href="https://www.instagram.com/prodoclk/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Instagram size={18} /></a>
                     <a href="https://www.linkedin.com/in/pro-doc-19629b3a5/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Linkedin size={18} /></a>
                  </div>
               </div>

               <div className="md:col-span-2">
                  <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Platform</h4>
                  <ul className="space-y-4 text-sm">
                     {['Find a Doctor', 'How it Works', 'Our Team', 'Reviews'].map((item) => (
                        <li key={item}><a href="#" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                           <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                           {item}
                        </a></li>
                     ))}
                  </ul>
               </div>

               <div className="md:col-span-2">
                  <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Company</h4>
                  <ul className="space-y-4 text-sm">
                     {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                        <li key={item}><a href="#" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                           <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                           {item}
                        </a></li>
                     ))}
                  </ul>
               </div>

               <div className="md:col-span-4">
                  <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contact</h4>
                  <ul className="space-y-4 text-sm mb-8">
                     <li className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Mail size={18} /></div>
                        <span>prdoc2025se06@gmail.com</span>
                     </li>
                     <li className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Phone size={18} /></div>
                        <span>+94 76 793 7055</span>
                     </li>
                  </ul>
            
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200">
                     <p className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide">Are you a doctor?</p>
                     <button className="w-full bg-teal-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/50 transition-all transform active:scale-95">
                        Join ProDoc Network
                     </button>
                  </div>
               </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
               <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>All Systems Operational</span>
               </div>
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
      {/* 3. EDITED PAGE SWITCHING LOGIC 👇 */}
      {currentPage === 'home' && (
        <LandingPage />
      )}
      
      {currentPage === 'about' && (
        <AboutPage onBack={() => navigateTo('home')} />
      )}

      {/* Added Logic for Login Page */}
      {currentPage === 'login' && (
        <LoginPage onBack={() => navigateTo('home')} />
      )}
    </main>
  );
}