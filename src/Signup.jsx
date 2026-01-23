import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  User 
} from 'lucide-react';

import LogoColor from './assets/Logo_with_words.png'; 
import Plasma from './components/Plasma'; 

const SignupPage = ({ onBack, onNavigateLogin }) => { // <-- ACCEPT PROP HERE
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  // Track errors for specific fields
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    let newErrors = {};

    // 1. Email Validation
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 2. Password Mismatch Validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Passwords do not match.';
    }

    // If there are errors, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // SUCCESS: Proceed with API call
    console.log("Form is valid! Proceeding with registration...");
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans text-slate-700 overflow-hidden">
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <Plasma color="#14b8a6" speed={0.4} scale={2.0} opacity={0.8} />
        <div className="absolute inset-0 bg-teal-500/10 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="w-full p-6 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button onClick={onBack} className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-teal-900 font-bold hover:bg-white/60 transition shadow-sm border border-white/20">
              <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
            </button>
          </div>
          <div className="flex justify-center">
            <div className="bg-white/60 backdrop-blur-md p-3 md:p-4 rounded-[2rem] shadow-sm border border-white/20 flex items-center justify-center transition-transform hover:scale-105">
              <img src={LogoColor} alt="ProDoc" className="h-10 md:h-16 object-contain" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-teal-900 font-medium hover:bg-white/60 transition shadow-sm border border-white/20">
              <HelpCircle size={20} />
            </button>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 md:p-10 relative border border-white/40">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
              <p className="text-slate-500 text-sm">Join ProDoc for better healthcare</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">1</span>
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Enter Details</span>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={20} /></div>
                  <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400" />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={20} /></div>
                    <input 
                      type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange}
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-100'} rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all`} 
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={20} /></div>
                  <input
                    type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange}
                    className={`w-full bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-100'} rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={20} /></div>
                    <input
                      type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange}
                      className={`w-full bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-100'} rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.password}</p>}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Registration</span>
              </div>
              <button onClick={handleCreateAccount} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
                Create Account <ArrowRight size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-bold text-slate-400">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="flex gap-4 mb-8">
              <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-2xl hover:bg-slate-50 transition font-semibold text-sm text-slate-700">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-2xl hover:bg-slate-50 transition font-semibold text-sm text-slate-700">
                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5" /> Apple
              </button>
            </div>

            <div className="text-center text-sm text-slate-500">
              {/* CONNECTED LINK HERE 👇 */}
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} className="text-teal-700 font-bold hover:underline">Log In</a>
            </div>
          </div>
        </div>

        <footer className="w-full text-center p-4 text-teal-900/60 text-xs">
          © {new Date().getFullYear()} ProDoc All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default SignupPage;