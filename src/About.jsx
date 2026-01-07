import React, { useState, useEffect, useRef } from 'react';
import professionalDoc from './assets/professionaldoc.png';
import LogoWithWords from './assets/Logo_with_words.png';
import Aurora from "./components/Aurora";

import {
  ShieldCheck,
  Target,
  Users,
  Building2,
  HeartPulse,
  CheckCircle,
  Search,
  Cpu,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

// --- ANIMATION COMPONENTS (Unchanged) ---

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

const TiltImage = ({ src, alt, className }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPct = x / rect.width;
    const yPct = y / rect.height;
    
    const xRot = (0.5 - yPct) * 20;
    const yRot = (xPct - 0.5) * 20;

    setRotate({ x: xRot, y: yRot });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
      }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#E4F0F1] relative overflow-hidden selection:bg-teal-200">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-300/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] animate-blob"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 lg:pt-48 pb-12 md:pb-16">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            
            
            <Reveal delay={100}>
              <h1 className="font-bold text-slate-900 leading-tight">
                <span className="block text-base md:text-lg lg:text-3xl text-slate-700">About</span>
                <span className="block text-3xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">ProDoc</span>
              </h1>
            </Reveal>
            
            <Reveal delay={200}>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm max-w-xl">
                <p className="text-lg text-slate-700 leading-relaxed">
                  ProDoc is the centralized platform bridging the gap between patients and verified professionals.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="group bg-[#14B8A6] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:bg-[#0f968c] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                  Find a Doctor
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>
          
          <div className="lg:col-span-5 flex justify-center lg:justify-end pt-8 lg:pt-0">
            <Reveal delay={400}>
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-teal-900/10 ring-8 ring-white/50">
                 <TiltImage 
                   src={professionalDoc} 
                   alt="Professional Doctor" 
                   className="w-full h-full"
                 />
                 {/* Floating Badge Box */}
                 <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white flex items-center gap-3 animate-float">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                      <p className="text-slate-800 font-bold text-sm">100% Verified</p>
                    </div>
                 </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Section 1: Identity & Problem - Boxed Structure */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          {/* Left: Who We Are (Big Box) */}
          <Reveal delay={100} className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 h-full flex flex-col">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Who We Are</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                We are the guardians of healthcare transparency. By building a digital bridge between patients and medical professionals, we ensure that every profile is verified, every review is validated, and every decision is supported by data.
              </p>
            </div>
          </Reveal>

          {/* Right: The Problem (Stacked Alert Boxes) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Reveal delay={200}>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 px-2">The Problems We Solve</h3>
            </Reveal>
            
            <div className="grid grid-cols-1 gap-4 h-full">
              <Reveal delay={200}>
                <div className="bg-[#5EEAD4] border border-[#5EEAD4] rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl text-[#5EEAD4] shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Trust Issues</h4>
                    <p className="text-slate-600 text-sm">Finding a doctor you can truly trust is difficult in an unregulated market.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="bg-[#3AD0C2] border border-[#5EEAD4] rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl text-[#5EEAD4] shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Information Overload</h4>
                    <p className="text-slate-600 text-sm">Fragmented and unreliable medical information confuses patients.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="bg-[#13A89E] border border-[#5EEAD4] rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl text-[#5EEAD4] shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Lack of Transparency</h4>
                    <p className="text-slate-600 text-sm">Hidden costs and unknown credentials make healthcare choices risky.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Section 2: Solutions - Grid of Feature Boxes */}
        <div className="mb-16">
          <Reveal delay={100}>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Solution</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: "Verified Profiles", color: "teal", desc: "Accurate details & credentials." },
              { icon: Search, title: "Smart Search", color: "teal", desc: "Advanced filters & speed." },
              { icon: Cpu, title: "AI Guidance", color: "teal", desc: "Personalized recommendations." },
              { icon: ShieldCheck, title: "Secure Feedback", color: "teal", desc: "Validated patient reviews." },
            ].map((item, idx) => (
              <Reveal key={idx} delay={150 + (idx * 100)}>
                <div className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Section 3: Mission & Vision - Two Separate Large Boxes */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Reveal delay={100}>
            <div className="bg-white rounded-3xl p-10 shadow-lg border-t-4 border-teal-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-32 h-32 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-teal-600" /> Mission
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To empower patients with transparent, reliable healthcare information accessible anytime, anywhere, ensuring no decision is made in the dark.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="bg-white rounded-3xl p-10 shadow-lg border-t-4 border-teal-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HeartPulse className="w-32 h-32 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <HeartPulse className="w-8 h-8 text-teal-600" /> Vision
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To be the most trusted digital healthcare companion, seamlessly connecting patients with technology to create a healthier global community.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Section 4: Technology & Audience */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Tech Box */}
          <Reveal delay={100}>
  {/* Ensure the parent has 'relative' and 'overflow-hidden' */}
  <div className="bg-slate-900 rounded-3xl p-8 text-white h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
    
    {/* 1. Add the Aurora component here */}
    <div className="absolute inset-0 z-0">
        <Aurora
    /* Color 1: Primary Teal, Color 2: Light Teal, Color 3: Deep Slate (Replaces Blue) */
    colorStops={["#0D9488", "#14B8A6", "#0D9488"]} 
    blend={0.5}
    amplitude={2.0}
    speed={0.6}
    />
    </div>

    {/* 2. Add this tint layer to make the text readable */}
    <div className="absolute inset-0 bg-slate-900/40 z-[1]"></div>

    {/* 3. Wrap your existing content in a div with 'relative z-10' */}
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div>
        <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
          <Cpu className="w-6 h-6 text-teal-400" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Technology With Responsibility</h3>
        <p className="text-slate-200 leading-relaxed">
          ProDoc utilizes cutting-edge AI to interpret medical data for clarity. 
          We strictly adhere to the principle that technology assists, but never 
          replaces, the human element of professional care.
        </p>
      </div>
      
      <div className="mt-8 flex gap-3">
        <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-all w-full text-center shadow-lg active:scale-95">
          Read Documentation
        </button>
      </div>
    </div>
  </div>
</Reveal>

          {/* Audience Box Grid */}
          <div className="flex flex-col gap-4">
            <Reveal delay={200}>
              <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 h-full">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Who Is ProDoc For?</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Users, label: "Patients", color: "bg-teal-500 text-white-600", desc: "Seeking trusted care." },
                    { icon: Building2, label: "Clinics", color: "bg-teal-500 text-white-600", desc: "Managing visibility." },
                    { icon: HeartPulse, label: "Providers", color: "bg-teal-500 text-white-600", desc: "Showcasing expertise." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-default group">
                      <div className={`p-3 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item.label}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Footer  */}
        <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-cyan-400"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <img src={LogoWithWords} alt="ProDoc" className="h-10 md:h-12 w-auto" />
              </div>
              <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                ProDoc is Sri Lanka's first centralized platform for transparent healthcare.
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all hover:scale-110">
                    <Icon size={18} />
                  </a>
                ))}
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
      </div>
    </div>
  );
};

export default AboutPage;