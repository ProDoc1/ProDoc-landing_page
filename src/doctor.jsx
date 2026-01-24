import React, { useState, useEffect, useRef } from 'react';
import LogoWithWords from './assets/Logo_with_words.png';
import axios from 'axios';
import {
  MapPin,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  Hospital,
  ArrowLeft,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';

// Import your logo here - ensure the path is correct for your project
// import LogoWithWords from '../assets/logo.png'; 


// --- ANIMATION COMPONENT ---
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- MAIN COMPONENT ---
const DoctorsPage = ({ onBack }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/doctors')
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E4F0F1] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-300/40 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-teal-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium animate-pulse">Fetching verified profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E4F0F1] relative overflow-hidden selection:bg-teal-200">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-300/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-20">
        
        {/* Hero Section */}
        <div className="mb-10">
          <Reveal delay={100}>
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-teal-900 font-bold hover:bg-white/60 transition shadow-sm border border-white/20 mb-8"
            >
              <ArrowLeft size={20} /> 
              <span>Back to Dashboard</span>
            </button>
          </Reveal>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <Reveal delay={200}>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-2">
                  Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Specialists</span>
                </h1>
                <p className="text-slate-600 text-lg max-w-2xl mt-4">
                  Browse our comprehensive list of qualified professionals dedicated to your health and well-being.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
               <div className="hidden md:flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white/50">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-sm font-bold text-slate-700">{doctors.length} Profiles Active</span>
               </div>
            </Reveal>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {doctors.map((doctor, index) => {
            const doctorImage = doctor.image 
              ? doctor.image 
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=random&size=400&length=2`;

            return (
              <Reveal key={doctor.slmc_number || index} delay={index * 100}>
                <div className="group bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
                  
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img 
                      src={doctorImage} 
                      alt={doctor.full_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                    
                    <div className="absolute top-6 right-6 bg-white shadow-xl text-teal-500 p-2 rounded-full z-20 border border-slate-100 group-hover:scale-110 transition-transform">
                       <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-teal-500 rounded-b-full"></div>

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
                        {doctor.full_name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wide border border-teal-100">
                          {doctor.specialty}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start text-slate-600">
                          <MapPin className="w-5 h-5 mr-3 text-teal-500 shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">{doctor.working_hospital}</span>
                        </div>
                        {doctor.slmc_number && (
                          <div className="flex items-center text-slate-600">
                            <ShieldCheck className="w-5 h-5 mr-3 text-teal-500 shrink-0" />
                            <span className="text-sm font-mono">SLMC: {doctor.slmc_number}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                       <span className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 ${
                          doctor.department_type === 'Government' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'bg-purple-50 text-purple-700'
                       }`}>
                          <Hospital className="w-3 h-3" />
                          {doctor.department_type}
                       </span>
                       
                       <button className="w-10 h-10 rounded-full bg-slate-50 text-teal-600 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors group-hover:rotate-45 duration-300">
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
           <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No doctors found at the moment.</p>
           </div>
        )}

        {/* --- SECTION 5: FOOTER --- */}
        <Reveal delay={400}>
          <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 mt-20">
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
                    <li key={item}>
                      <a href="#" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                        <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-4 text-sm">
                  {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                        <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                        {item}
                      </a>
                    </li>
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
              <p>© {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
            </div>
          </footer>
        </Reveal>

      </div>
    </div>
  );
};

export default DoctorsPage;