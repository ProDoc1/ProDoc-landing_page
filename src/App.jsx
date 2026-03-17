import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Search, ShieldCheck, MessageSquare, Stethoscope, ArrowRight, Star, UserCheck, CheckCircle, Bell, BrainCircuit, ScanLine, Mail, Phone, Facebook, Instagram, Linkedin, AlertTriangle, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import WarpBackground from './components/ui/warp-background';
import LogoWithWords from './assets/Logo_with_words.png';
import AboutPage from './About';
import Navbar from './components/Navbar';
import LoginPage from './patientLogin';
import SignupPage from './Signup';
import DoctorsPage from './doctor';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import DoctorViewProfile from './DoctorViewProfile';
import ContentHub from './ContentHub';
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AdminLogin = lazy(() => import('./AdminLogin'));
import MiniBot from './components/MiniBot';
import ChatbotApp from './Chatbot/App';


const LandingPage = ({ onNavigateHowitWorks, onFindSpecialist, onNavigateAbout, onNavigatePrivacy, onNavigateTerms, onNavigateChatbot }) => {

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
                     Healthcare you can <span className="text-teal-200 selection:bg-white/20">trust.</span><br className="hidden md:block" />
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
                        {[1, 2, 3].map(i => (
                           <div key={i} className={`w-9 h-9 rounded-full border-2 border-teal-800 bg-slate-200 flex items-center justify-center text-[10px] text-white overflow-hidden ring-2 ring-transparent hover:ring-teal-400 hover:z-10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
                              <UserCheck size={16} className="text-slate-400" />
                           </div>
                        ))}
                     </div>
                     <p className="drop-shadow-sm">Trusted by 1,000+ patients</p>
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
                              {[1, 2, 3, 4, 5].map(s => (
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
                           <span className="font-bold text-teal-500 flex items-center gap-1 text-sm"><ShieldCheck size={14} /> Verified</span>
                        </div>
                     </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-500/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
               </div>
            </div>
         </div>

         {/* --- SECTION 3: SERVICES --- */}
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

            <div className="bg-white rounded-[2.5rem] p-10 col-span-1 flex flex-col justify-between group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
               <div>
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                     <CheckCircle className="w-7 h-7 text-teal-500 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">Patient Dashboard</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                     Allows patients to upload and store medical history, lab reports, and prescriptions in one centralized place.
                  </p>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 col-span-1 md:col-span-2 group hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-teal-100">
               <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                  <BrainCircuit className="w-7 h-7 text-teal-500 group-hover:text-white" />
               </div>
               <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">AI Medical Decision Support</h3>
               <p className="text-slate-500 leading-relaxed max-w-lg">
                  Users can upload lab reports or diagnostic images; the AI analyzes them to provide easy-to-read summaries and identify potential risks.
               </p>
            </div>

            <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white rounded-[2.5rem] p-10 col-span-1 md:col-span-3 overflow-hidden relative group hover:shadow-2xl hover:shadow-teal-900/20 transition-all duration-300 hover:-translate-y-1">
               <div className="relative z-10 max-w-2xl">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 text-white border border-white/10 group-hover:bg-white/20 transition-colors duration-300 group-hover:scale-110">
                     <MessageSquare className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Multilingual AI Chatbot</h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                     Describe your symptoms in Sinhala, Tamil, or English, and our AI will guide you to the right specialist immediately.
                  </p>
                  <button
                     onClick={onNavigateChatbot}
                     className="mt-8 bg-white text-teal-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-teal-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
                  >
                     Try Chatbot Demo
                  </button>
               </div>
            </div>
         </div>

         {/* --- SECTION 4: HOW IT WORKS --- */}
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
                     Search for doctors by name, specialization, or hospital instantly matched with the correct specialist.
                  </p>
               </div>
               <div className="relative group cursor-default">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/20">
                     <ScanLine size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-teal-600 transition-colors">Understand Reports</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     Upload your diagnostic images to receive easy-to-read summaries and identified potential risks.
                  </p>
               </div>
               <div className="relative group cursor-default">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/20">
                     <Star size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-teal-600 transition-colors">Share Your Experience</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     Help others by rating your doctor on punctuality and professionalism in a safe and respectful community.
                  </p>
               </div>
            </div>
         </div>

         {/* --- SECTION 5: FOOTER --- */}
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
                     <a href="https://www.linkedin.com/company/prodoclk/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Linkedin size={18} /></a>
                  </div>
               </div>

               <div className="md:col-span-2">
                  <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Platform</h4>
                  <ul className="space-y-4 text-sm">
                     {[
                        { name: 'Find a Doctor', url: '/doctors', action: onFindSpecialist },
                        { name: 'How it Works', url: '/how-it-works', action: onNavigateHowitWorks },
                        { name: 'Our Team', url: '/team', action: null },
                        { name: 'Reviews', url: '/reviews', action: null }
                     ].map((item) => (
                        <li key={item.name}><a href={item.url} onClick={(e) => { if (item.action) { e.preventDefault(); item.action(); } }} className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                           <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                           {item.name}
                        </a></li>
                     ))}
                  </ul>
               </div>

               <div className="md:col-span-2">
                  <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Company</h4>
                  <ul className="space-y-4 text-sm">
                     <li>
                        <a href="/about" onClick={(e) => { e.preventDefault(); onNavigateAbout(); }} className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                           <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                           About Us
                        </a>
                     </li>
                     <li>
                        <a href="/careers" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                           <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                           Careers
                        </a>
                     </li>
                     <li>
                        <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigatePrivacy(); }} className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                           <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                           Privacy Policy
                        </a>
                     </li>
                     <li>
                        <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigateTerms(); }} className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                           <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                           Terms of Service
                        </a>
                     </li>
                  </ul>
               </div>

               <div className="md:col-span-4">
                  <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contact</h4>
                  <ul className="space-y-4 text-sm mb-8">
                     <li className="flex items-center gap-3 text-slate-600">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Mail size={18} /></div>
                           <a href="mailto:prdoc2025se06@gmail.com" className="hover:text-teal-600 transition-colors">prdoc2025se06@gmail.com</a>
                        </div>
                     </li>
                     <li className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Phone size={18} /></div>
                        <span>+94 74 279 7484</span>
                     </li>
                  </ul>

                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200">
                     <p className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide">Are you a doctor?</p>
                     <button className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all transform active:scale-95">
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
               <p>©️ {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
            </div>
         </footer>
      </div>
   );
};

// --- MAIN APP COMPONENT ---
export default function App() {
   const validPages = ['home', 'about', 'doctors', 'login', 'signup', 'dashboard', 'doctor-dashboard', 'doctor-view', 'privacy', 'terms', 'content-hub', 'admin', 'chatbot'];

   const [currentPage, setCurrentPage] = useState(() => {
      const segments = window.location.pathname.split('/').filter(Boolean);
      const path = segments[0] || 'home';
      return validPages.includes(path) ? path : 'home';
   });
   const [currentUser, setCurrentUser] = useState(null);
   const [selectedDoctorId, setSelectedDoctorId] = useState(null);
   const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
   const [showVerifyModal, setShowVerifyModal] = useState(false);
   const [verifyStep, setVerifyStep] = useState('prompt');
   const [verifyLoading, setVerifyLoading] = useState(false);
   const [generatedCode, setGeneratedCode] = useState('');
   const [inputCode, setInputCode] = useState('');
   const [adminUser, setAdminUser] = useState(() => {
      const savedAdmin = localStorage.getItem('adminUser');
      return savedAdmin ? JSON.parse(savedAdmin) : null;
   });

   // --- NAVBAR VISIBILITY LOGIC ---
   const [scrolled, setScrolled] = useState(false);
   const [hideNavbar, setHideNavbar] = useState(false);
   const lastScrollYRef = React.useRef(0);

   useEffect(() => {
      const handleScroll = () => {
         const currentScrollY = window.scrollY;
         setScrolled(currentScrollY > 20);

         // Apply auto-hide navbar logic to all pages
         if (currentScrollY > lastScrollYRef.current && currentScrollY > 150) {
            setHideNavbar(true);
         } else {
            setHideNavbar(false);
         }
         lastScrollYRef.current = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, [currentPage]);

   // --- EFFECT FOR PERSISTENT LOGIN ---
   // This runs once when the component mounts to check for a saved session.
   useEffect(() => {
      const savedUser = localStorage.getItem('prodoc_user');
      const savedPage = localStorage.getItem('currentPage');

      if (savedUser) {
         setCurrentUser(JSON.parse(savedUser));

         // Only auto-redirect to dashboard if we are on the landing page
         // This allows direct URL navigation to other pages like /admin to work.
         if (window.location.pathname === '/' || window.location.pathname === '/home') {
            if (savedPage === 'dashboard' || savedPage === 'doctor-dashboard') {
               setCurrentPage(savedPage);
            }
         }
      }
   }, []);



   // --- EFFECT TO UPDATE PAGE TITLE AND URL ---
   useEffect(() => {
      const titles = {
         'home': 'ProDoc | Home',
         'about': 'ProDoc | About Us',
         'doctors': 'ProDoc | Doctors',
         'login': 'ProDoc | Login',
         'signup': 'ProDoc | Sign Up',
         'dashboard': 'ProDoc | Patient Dashboard',
         'doctor-dashboard': 'ProDoc | Doctor Dashboard',
         'doctor-view': 'ProDoc | Doctor Profile',
         'privacy': 'ProDoc | Privacy Policy',
         'terms': 'ProDoc | Terms of Service',
         'content-hub': 'ProDoc | Content Hub',
         'admin': 'ProDoc | Admin Dashboard'
      };

      document.title = titles[currentPage] || 'ProDoc';
      const path = currentPage === 'home' ? '/' : `/${currentPage}`;
      if (window.location.pathname !== path) {
         window.history.pushState(null, '', path);
      }
   }, [currentPage]);

   // Patients and Doctors should not have access to the admin login/dashboard.
   useEffect(() => {
      if (currentPage === 'admin' && currentUser) {
         const role = localStorage.getItem('userRole');
         navigateTo(role === 'doctor' ? 'doctor-dashboard' : 'dashboard');
      }
   }, [currentPage, currentUser]);

   // --- POPSTATE & INITIAL NAVIGATION SYNC ---
   useEffect(() => {
      const handlePopState = () => {
         const currentSegments = window.location.pathname.split('/').filter(Boolean);
         const currentPath = currentSegments[0] || 'home';
         setCurrentPage(validPages.includes(currentPath) ? currentPath : 'home');
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
   }, []);

   const navigateTo = (page, data = null) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentPage(page);
      if (data && page === 'doctor-view') {
         setSelectedDoctorId(data);
      }
      // Save current page to local storage
      localStorage.setItem('currentPage', page);
   };

   const handleLoginSuccess = (userData, role) => {
      setCurrentUser(userData);

      const userString = JSON.stringify(userData);
      // Save user to local storage for persistence
      localStorage.setItem('prodoc_user', userString);
      localStorage.setItem('userRole', role);

      if (role === 'doctor') {
         localStorage.setItem('doctorId', userData.id);
         navigateTo('doctor-dashboard');
      } else {
         navigateTo('dashboard');
      }
   };

   useEffect(() => {
      if (currentUser && currentUser.email_verified === false) {
         const checkAndPrompt = () => {
            const lastPrompt = localStorage.getItem('last_verify_prompt_time');
            const now = new Date().getTime();
            const ONE_HOUR = 60 * 60 * 1000;

            if (!lastPrompt || (now - parseInt(lastPrompt)) >= ONE_HOUR) {
               setShowVerifyModal(true);
            }
         };


         checkAndPrompt();


         const intervalId = setInterval(checkAndPrompt, 60 * 1000);
         return () => clearInterval(intervalId);
      } else {
         setShowVerifyModal(false);
      }
   }, [currentUser]);

   const handleSkipVerify = () => {
      setShowVerifyModal(false);
      localStorage.setItem('last_verify_prompt_time', new Date().getTime().toString());
   };

   const handleSendVerificationCode = async () => {
      setVerifyLoading(true);
      try {
         const code = Math.floor(100000 + Math.random() * 900000).toString();
         setGeneratedCode(code);

         const serviceId = 'service_jajwzgf';
         const templateId = 'template_o75vnnp';
         const publicKey = 'LUysmcNbwO0ok5GAV';

         const templateParams = {
            from_name: "ProDoc Support",
            to_name: currentUser.name || "User",
            to_email: currentUser.email,
            subject: "Verify Your Email - ProDoc",
            message: `Your verification code is: ${code}`,
            code: code,
         };

         await emailjs.send(serviceId, templateId, templateParams, publicKey);
         setVerifyStep('code');
      } catch (err) {
         console.error('Error sending code:', err);
         alert("Failed to send code. Please check your connection.");
      } finally {
         setVerifyLoading(false);
      }
   };

   const handleVerifyConfirm = async () => {
      if (inputCode !== generatedCode) {
         alert("Invalid verification code. Please try again.");
         return;
      }

      setVerifyLoading(true);
      try {
         const role = localStorage.getItem('userRole');
         const response = await fetch('/api/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email, role })
         });
         const data = await response.json();

         if (data.success) {
            const updatedUser = { ...currentUser, email_verified: true };
            setCurrentUser(updatedUser);
            localStorage.setItem('prodoc_user', JSON.stringify(updatedUser));
            setVerifyStep('success');
         } else {
            alert(data.error || "Verification failed");
         }
      } catch (err) {
         console.error('Verify error:', err);
         alert("System Error. Verification failed.");
      } finally {
         setVerifyLoading(false);
      }
   };

   const handleAdminLogin = (adminData) => {
      setAdminUser(adminData);
      navigateTo('admin');
   };

   const handleLogout = async () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
      if (token) {
         try {
            await fetch('/api/logout', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ token })
            });
         } catch (error) {
            console.error('Logout API failed:', error);
         }
      }

      // Clear all session data
      localStorage.removeItem('prodoc_user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('doctorId');
      localStorage.removeItem('patientId');
      localStorage.removeItem('currentPage');
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      setCurrentUser(null);
      setAdminUser(null);
      navigateTo('home');
   };

   // --- EFFECT FOR INACTIVITY SESSION TIMEOUT ---
   useEffect(() => {
      if (!currentUser && !adminUser) return;

      let timeoutId;
      const TIMEOUT_DURATION = 10 * 60 * 1000; //60

      const resetTimer = () => {
         if (timeoutId) clearTimeout(timeoutId);
         timeoutId = setTimeout(() => {
            setShowSessionExpiredModal(true);
            handleLogout();
         }, TIMEOUT_DURATION);
      };

      resetTimer();


      const events = ['mousemove', 'keydown', 'scroll', 'click'];
      const handleActivity = () => resetTimer();

      events.forEach(event => {
         window.addEventListener(event, handleActivity);
      });

      return () => {
         if (timeoutId) clearTimeout(timeoutId);
         events.forEach(event => {
            window.removeEventListener(event, handleActivity);
         });
      };
   }, [currentUser, adminUser]);

   const navigateToSection = (sectionId) => {
      setCurrentPage('home');
      localStorage.setItem('currentPage', 'home');
      setTimeout(() => {
         const element = document.getElementById(sectionId);
         if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
   };

   return (
      <main className="relative min-h-screen">
         {/* Navbar visibility logic */}
         {currentPage !== 'login' && currentPage !== 'signup' && (currentPage !== 'admin' || adminUser) && (
            <Navbar
               currentPage={currentPage}
               currentUser={currentUser}
               scrolled={scrolled}
               hideNavbar={hideNavbar}
               onNavigateHome={() => navigateTo('home')}
               onNavigateAbout={() => navigateTo('about')}
               onNavigateDoctors={() => navigateTo('doctors')}
               onNavigateHowitWorks={() => navigateToSection('how-it-works')}
               adminUser={adminUser}
               onNavigateAdmin={() => navigateTo('admin')}
               onNavigateLogin={() => navigateTo('login')}
               onNavigateSignupPage={() => navigateTo('signup')}
               onLogout={handleLogout}
               onNavigateDashboard={() => {
                  const role = localStorage.getItem('userRole');
                  navigateTo(role === 'doctor' ? 'doctor-dashboard' : 'dashboard');
               }}
               onNavigateContentHub={() => navigateTo('content-hub')}
            />
         )}

         {currentPage === 'home' && (
            <LandingPage
               onNavigateHowitWorks={() => navigateToSection('how-it-works')}
               onFindSpecialist={() => navigateTo('doctors')}
               onNavigateAbout={() => navigateTo('about')}
               onNavigatePrivacy={() => navigateTo('privacy')}
               onNavigateTerms={() => navigateTo('terms')}
               onNavigateChatbot={() => {
                  window.history.pushState(null, '', '/chatbot');
                  navigateTo('chatbot');
               }}
            />
         )}

         {currentPage === 'privacy' && (
            <PrivacyPolicy onBack={() => navigateTo('home')} />
         )}

         {currentPage === 'terms' && (
            <TermsOfService onBack={() => navigateTo('home')} />
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
            <DoctorsPage
               onBack={() => navigateTo('home')}
               onViewProfile={(id) => navigateTo('doctor-view', id)}
            />
         )}

         {currentPage === 'doctor-view' && (
            <DoctorViewProfile
               doctorId={selectedDoctorId}
               onBack={() => navigateTo('doctors')}
               currentUser={currentUser}
               onLogout={handleLogout}
               onNavigateLogin={() => navigateTo('login')}
               onNavigateSignupPage={() => navigateTo('signup')}
            />
         )}

         {currentPage === 'dashboard' && (
            <PatientDashboard
               user={currentUser}
               onLogout={handleLogout}
               onNavigateDoctors={() => navigateTo('doctors')}
               onNavigateHome={() => navigateTo('home')}
               onNavigateAbout={() => navigateTo('about')}
               onNavigateLogin={() => navigateTo('login')}
               onNavigateSignupPage={() => navigateTo('signup')}
               onNavigateDashboard={() => navigateTo('dashboard')}
               onNavigateContentHub={() => navigateTo('content-hub')}
               onViewProfile={(id) => navigateTo('doctor-view', id)}
            />
         )}

         {currentPage === 'doctor-dashboard' && (
            <DoctorDashboard
               user={currentUser}
               onLogout={handleLogout}
               onNavigateHome={() => navigateTo('home')}
               onNavigateAbout={() => navigateTo('about')}
               onNavigateDoctors={() => navigateTo('doctors')}
               onNavigateLogin={() => navigateTo('login')}
               onNavigateSignupPage={() => navigateTo('signup')}
               onNavigateContentHub={() => navigateTo('content-hub')}
            />
         )}

         {currentPage === 'content-hub' && (
            <ContentHub
               user={currentUser}
               userRole={localStorage.getItem('userRole')}
               hideNavbar={hideNavbar}
               onNavigateHome={() => navigateTo('home')}
               onNavigateDoctors={() => navigateTo('doctors')}
               onViewProfile={(id) => navigateTo('doctor-view', id)}
            />
         )}

         {currentPage === 'admin' && (
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F0F8F8] text-teal-800 font-medium">Loading...</div>}>
               {adminUser ? (
                  <AdminDashboard
                     onBack={handleLogout}
                  />
               ) : (
                  <AdminLogin
                     onLoginSuccess={handleAdminLogin}
                  />
               )}
            </Suspense>
         )}

         <div className={`fixed inset-0 z-[200] bg-white transition-opacity ${currentPage === 'chatbot' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button
               onClick={() => navigateTo('home')}
               className="absolute top-4 left-4 z-[210] p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-2 text-slate-700 font-semibold"
            >
               <ArrowRight className="w-5 h-5 rotate-180" /> Back to ProDoc
            </button>
            <ChatbotApp onViewProfile={(id) => navigateTo('doctor-view', id)} />
         </div>

         {/* --- SESSION EXPIRED MODAL --- */}
         {showSessionExpiredModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSessionExpiredModal(false)}></div>
               <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative z-10 flex flex-col items-center text-center animate-slide-up border border-orange-100">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                     <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <AlertTriangle size={24} />
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Session Expired</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                     Your session has expired due to inactivity. For your security, you have been automatically logged out.
                  </p>
                  <button
                     onClick={() => {
                        setShowSessionExpiredModal(false);
                        navigateTo('home');
                     }}
                     className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98]"
                  >
                     Go to Home Page
                  </button>
               </div>
            </div>
         )}

         {/* --- EMAIL VERIFICATION MODAL --- */}
         {showVerifyModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in text-slate-800">
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
               <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative z-10 flex flex-col items-center animate-slide-up border border-teal-100">
                  <button
                     onClick={handleSkipVerify}
                     className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                     <X size={20} />
                  </button>

                  <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                     <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <Mail size={24} />
                     </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">Verify Your Email</h3>

                  {verifyStep === 'prompt' ? (
                     <>
                        <p className="text-slate-500 text-sm mb-2 text-center">
                           Your email <span className="font-bold text-slate-700">{currentUser?.email}</span> is not verified. Let's verify it to secure your account.
                        </p>
                        <button
                           disabled={verifyLoading}
                           onClick={handleSendVerificationCode}
                           className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50"
                        >
                           {verifyLoading ? "Sending Code..." : "Send Verification Code"}
                        </button>
                        <button
                           onClick={handleSkipVerify}
                           className="w-full mt-3 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold py-3.5 rounded-xl transition-all"
                        >
                           Skip for now
                        </button>
                     </>
                  ) : verifyStep === 'success' ? (
                     <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                           <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                              <CheckCircle size={24} />
                           </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 text-center">
                           Your email has been verified successfully! Thank you for securing your account.
                        </p>
                        <button
                           onClick={() => setShowVerifyModal(false)}
                           className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98]"
                        >
                           Continue to Dashboard
                        </button>
                     </div>
                  ) : (
                     <>
                        <p className="text-slate-500 text-sm mb-6 text-center">
                           We sent a 6-digit code to your email.
                        </p>
                        <input
                           type="text"
                           placeholder="Enter 6-digit Code"
                           maxLength="6"
                           value={inputCode}
                           onChange={(e) => setInputCode(e.target.value)}
                           className="w-full text-center bg-slate-50 border border-slate-200 rounded-xl py-4 text-lg font-mono tracking-widest focus:outline-none focus:border-teal-500 transition-all mb-4"
                        />
                        <button
                           disabled={verifyLoading || inputCode.length < 6}
                           onClick={handleVerifyConfirm}
                           className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50"
                        >
                           {verifyLoading ? "Verifying..." : "Verify Code"}
                        </button>
                     </>
                  )}
               </div>
            </div>
         )}
         <MiniBot onNavigate={() => {
            window.history.pushState(null, '', '/chatbot');
            navigateTo('chatbot');
         }} />
      </main>
   );
}
