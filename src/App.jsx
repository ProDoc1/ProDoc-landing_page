import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, MessageSquare, Stethoscope, Menu, X, ArrowRight, Star, UserCheck, CheckCircle, Briefcase, FileText, User, Bell, BrainCircuit, ScanLine, Users, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import WarpBackground from './components/ui/warp-background';
import Team from './components/team';
import { NavBar } from './components/ui/tubelight-navbar';

// --- MAIN LANDING PAGE COMPONENT ---
const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Defined Nav Items for the Tubelight Navbar
  const navItems = [
    { name: 'Services', url: '#services', icon: Briefcase },
    { name: 'How it Works', url: '#how-it-works', icon: FileText },
    { name: 'Team', url: '#team', icon: Users }
  ];

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
      
      {/* --- SECTION 1: HEADER & HERO --- */}
      <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 mb-6 overflow-hidden shadow-sm bg-teal-900/5">
        
        {/* THE SHADER BACKGROUND */}
        <WarpBackground />
        
        {/* Gradient Mask Overlay for better text readability - ADJUSTED HERE: Reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/70 via-teal-900/30 to-teal-900/5 z-0 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

        {/* Navigation */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 relative z-20 gap-4 md:gap-0">
          
          {/* Logo */}
          <div className="flex items-center gap-3 self-start md:self-auto group cursor-pointer">
            <div className="bg-white p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Stethoscope className="w-5 h-5 text-teal-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-teal-50 transition-colors">ProDoc</span>
            
            {/* Mobile Menu Toggle */}
            <button className="md:hidden ml-auto text-white absolute right-0 top-1 hover:bg-white/10 p-1 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Tubelight Navigation */}
          <div className="hidden md:block">
             <NavBar items={navItems} />
          </div>

          {/* Login Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-5 py-2.5 rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-sm font-semibold active:scale-95">
                Doctor Login
            </button>
            <button className="bg-white text-teal-600 px-5 py-2.5 rounded-full hover:bg-teal-50 transition-all duration-300 shadow-lg shadow-teal-900/10 text-sm font-bold hover:shadow-teal-900/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
                Patient Login
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 z-50 flex flex-col gap-4 text-center shadow-2xl md:hidden animate-in fade-in slide-in-from-top-4 mb-8 border border-white/50 relative">
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-slate-800 font-bold py-3 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors">Services</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-slate-800 font-bold py-3 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors">How it Works</a>
            <a href="#team" onClick={() => setIsMenuOpen(false)} className="text-slate-800 font-bold py-3 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors">Team</a>
            <hr className="border-slate-200" />
            <button className="bg-slate-100 text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors active:scale-95">Doctor Login</button>
            <button className="bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors active:scale-95">Patient Login</button>
          </div>
        )}

        {/* Hero Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
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
               {/* Updated button text color to teal-500 with cleaner hover/active states */}
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

         {/* Feature 3: Patient Dashboard (Changed col-span to align with grid) */}
         <div className="bg-white rounded-[2.5rem] p-10 col-span-1 flex flex-col justify-between group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
            <div>
               <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                  <FileText className="w-7 h-7 text-teal-500 group-hover:text-white" />
               </div>
               <h3 className="text-2xl font-bold mb-4 text-slate-900">Patient Dashboard</h3>
               <p className="text-slate-500 leading-relaxed text-sm">
                  Allows patients to upload and store medical history, lab reports, and prescriptions in one centralized place.
               </p>
            </div>
         </div>

         {/* Feature 4: AI Medical Decision Support (REPLACED CARD) */}
         <div className="bg-white rounded-[2.5rem] p-10 col-span-1 md:col-span-2 group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
               <BrainCircuit className="w-7 h-7 text-teal-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">AI Medical Decision Support</h3>
            <p className="text-slate-500 leading-relaxed max-w-lg">
               Users can upload lab reports or diagnostic images (X-rays, CT scans, MRI); the AI analyzes them to provide easy-to-read summaries and identify potential risks.
            </p>
         </div>

         {/* Feature 5: Multilingual AI Chatbot (Wide Feature Card) */}
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
               {/* Updated to teal-500 */}
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
      
      {/* --- SECTION 5: DETAILED FOOTER --- */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-sm">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-teal-50 p-2 rounded-xl">
                <Stethoscope className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">ProDoc</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              ProDoc is Sri Lanka's first centralized platform for transparent healthcare. We verify doctor qualifications and validate patient reviews to help you make informed decisions.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-teal-600 transition-colors">Find a Doctor</a></li>
              <li><a href="#how-it-works" className="hover:text-teal-600 transition-colors">How it Works</a></li>
              <li><a href="#team" className="hover:text-teal-600 transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Reviews</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#team" className="hover:text-teal-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-teal-500" />
                <span>support@prodoc.lk</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-teal-500" />
                <span>+94 11 234 5678</span>
              </li>
            </ul>
            
            {/* CTA Box */}
            <div className="mt-6 bg-teal-50 p-4 rounded-2xl border border-teal-100">
              <p className="text-xs font-semibold text-teal-800 mb-2">Are you a doctor?</p>
              <button className="text-xs bg-teal-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-teal-700 transition-colors w-full">
                Join ProDoc Network
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>All Systems Operational</span>
           </div>
           <p>© {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
        </div>
      </div>

    </div>
  );
};

// --- APP EXPORT ---
function App() {
  return (
    <LandingPage />
  )
}

export default App;