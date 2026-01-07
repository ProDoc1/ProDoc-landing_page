import React from 'react';
import LogoWithWords from './assets/Logo_with_words.png';
import {
  ShieldCheck,
  Target,
  Users,
  Building2,
  HeartPulse,
  CheckCircle,
  Search,
  Cpu,
  Stethoscope,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#E4F0F1] pt-40 md:pt-48 lg:pt-56 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section 
            - Removed the top header div (Logo/Nav/Buttons)
            - The content will now sit naturally below the sticky App Navbar 
        */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-8 pt-4">
          <div className="lg:col-span-7">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About ProDoc</h1>
            <p className="text-[#14B8A6] font-semibold mb-2">TRUST.FIND.HEAL</p>
            <p className="text-slate-600 max-w-2xl mb-6">
              ProDoc is a digital healthcare platform built to help users find trusted medical
              professionals, access verified profiles, and make informed healthcare decisions.
            </p>
            <div className="flex gap-3">
              <button className="bg-[#14B8A6] text-white px-5 py-3 rounded-full font-semibold hover:bg-[#0f968c] transition-colors">
                Find a Doctor
              </button>
              <button className="bg-white border border-slate-200 px-5 py-3 rounded-full font-semibold hover:bg-slate-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-64 h-64 bg-gradient-to-br from-[#E4F0F1] to-white rounded-3xl flex items-center justify-center shadow-md">
              {/* Illustration placeholder */}
              <div className="text-[#14B8A6]">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-80">
                  <path d="M12 2a4 4 0 0 1 4 4v1h-8V6a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#14B8A6]/10 p-3 rounded-full">
                <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <h3 className="text-xl font-bold">Who We Are</h3>
            </div>
            <p className="text-slate-600">ProDoc is built to bridge the gap between patients and verified medical professionals by providing reliable doctor profiles, transparent feedback, and supportive digital tools.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#14B8A6]/10 p-3 rounded-full">
                <Target className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <h3 className="text-xl font-bold">The Problem</h3>
            </div>
            <ul className="text-slate-600 list-disc pl-5 space-y-2">
              <li>Difficulty finding trustworthy doctors.</li>
              <li>Fragmented and unreliable medical information.</li>
              <li>Lack of transparency in healthcare choices.</li>
            </ul>
          </div>
        </div>

        {/* Solutions and Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Our Solution</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#14B8A6] mt-1" /> Verified Profiles — accurate doctor details, specialties, & credentials.</li>
              <li className="flex items-start gap-3"><Search className="w-5 h-5 text-[#14B8A6] mt-1" /> Smart Search & Filters — find specialists fast.</li>
              <li className="flex items-start gap-3"><Cpu className="w-5 h-5 text-[#14B8A6] mt-1" /> AI-assisted Health Guidance — personalized recommendations (non-diagnostic).</li>
              <li className="flex items-start gap-3"><ShieldCheck className="w-5 h-5 text-[#14B8A6] mt-1" /> Secure Feedback System — verified patient reviews and ratings.</li>
            </ul>
          </div>

          <div className="bg-[#14B8A6] rounded-2xl p-6 text-white shadow-sm">
            <h3 className="text-xl font-bold mb-4">Our Mission & Vision</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-bold">Mission</h4>
                <p className="text-sm opacity-90">To empower patients with transparent, reliable healthcare information.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-bold">Vision</h4>
                <p className="text-sm opacity-90">To be a trusted digital healthcare companion connecting patients and technology.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology & Audience */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Technology With Responsibility</h3>
            <p className="text-slate-600 mb-4">ProDoc uses AI-assisted tools to help users understand medical reports and health information. The system provides guidance and recommendations while never replacing professional medical advice.</p>
            <div className="flex gap-3">
              <button className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm hover:bg-slate-50 transition-colors">Read More</button>
              <button className="bg-[#14B8A6] text-white px-4 py-2 rounded-full text-sm hover:bg-[#0f968c] transition-colors">Get Started</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Who ProDoc Is For</h3>
            <div className="grid grid-cols-3 gap-3 text-center text-slate-600">
              <div className="p-3 bg-[#14B8A6]/10 rounded-xl">
                <Users className="mx-auto w-6 h-6 text-[#14B8A6] mb-2" />
                <div className="text-sm font-semibold">Patients</div>
              </div>
              <div className="p-3 bg-[#14B8A6]/10 rounded-xl">
                <Building2 className="mx-auto w-6 h-6 text-[#14B8A6] mb-2" />
                <div className="text-sm font-semibold">Clinics</div>
              </div>
              <div className="p-3 bg-[#14B8A6]/10 rounded-xl">
                <HeartPulse className="mx-auto w-6 h-6 text-[#14B8A6] mb-2" />
                <div className="text-sm font-semibold">Providers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-sm">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
            
            {/* Brand Column */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <img src={LogoWithWords} alt="ProDoc" className="h-10 md:h-12 w-auto" />
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
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;