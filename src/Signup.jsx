import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  User,
  AlertTriangle,
  Phone
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ show: false, message: '' });
  const [showHelpModal, setShowHelpModal] = useState(false);

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

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    // Client-side validation first
    const newErrors = {};
    if (!formData.fullName || !formData.email || !formData.password) {
      setErrorAlert({ show: true, message: "Please fill in all fields." });
      return;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // API CALL
    try {
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (e) {
        // Response had no JSON body
        console.warn('Non-JSON response from /api/sign-up:', e);
      }

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        setErrorAlert({ show: true, message: result.error || "Signup failed. Please try again." });
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setErrorAlert({ show: true, message: "Could not connect. Ensure server is running." });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans text-slate-700 overflow-hidden">

      {/* 1. PLASMA BACKGROUND */}
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <Plasma color="#14b8a6" speed={0.4} scale={2.0} opacity={0.6} />
        <div className="absolute inset-0 bg-slate-50/30 backdrop-blur-[1px]"></div>
      </div>

      {/* 2. DYNAMIC BACKGROUND ORB */}
      <div className="fixed w-[500px] h-[500px] rounded-full blur-[100px] z-0 bg-teal-400 left-[-100px] bottom-[-100px] opacity-60"></div>


      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="w-full p-4 md:p-6 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button onClick={onBack} className="group flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full text-slate-700 font-bold hover:bg-white hover:shadow-md transition-all duration-300 border border-slate-300/30">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Back</span>
            </button>
          </div>
          <div className="flex justify-center">
            <div className="bg-white/70 backdrop-blur-md p-3 md:p-4 rounded-[2rem] shadow-sm border border-white/50 flex items-center justify-center transition-transform duration-500 hover:scale-105">
              <img src={LogoColor} alt="ProDoc" className="h-10 md:h-16 object-contain" />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setShowHelpModal(true)} className="bg-white/50 backdrop-blur-md p-2 rounded-full text-slate-700 hover:bg-white hover:shadow-md transition-all duration-300 border border-slate-300/30">
              <HelpCircle size={18} />
            </button>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          {/* MAIN CONTAINER MATCHING LOGIN PAGE */}
          <div className="relative bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_0_40px_rgba(0,0,0,0.1)] w-full max-w-[850px] min-h-0 md:min-h-[520px] overflow-hidden flex flex-col md:flex-row shadow-teal-500/10 border border-slate-200">

            {/* LEFT PANEL: SIGNUP FORM */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-center relative z-10">
              <div className="w-full max-w-[320px]">
                <h2 className="text-3xl font-bold text-teal-500 mb-2 text-center">Create Account</h2>
                <p className="text-slate-500 text-xs text-center mb-6">Join ProDoc for better healthcare</p>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400"><User size={18} /></div>
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all" />
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400"><Mail size={18} /></div>
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange}
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all`} />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400"><Lock size={18} /></div>
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange}
                      className={`w-full bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3.5 pl-10 pr-12 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400"><Lock size={18} /></div>
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange}
                      className={`w-full bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl py-3.5 pl-10 pr-12 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.password}</p>}
                  </div>


                  <button onClick={handleCreateAccount} className="w-full bg-teal-500 hover:bg-teal-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
                    Create Account <ArrowRight size={18} />
                  </button>
                </div>

                <div className="mt-6 text-center text-xs text-slate-500">
                  Already have an account? <button onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} className="text-teal-600 hover:text-teal-500 font-bold underline underline-offset-2">Log In</button>
                </div>

              </div>
            </div>

            {/* RIGHT PANEL: STATIC DECORATIVE SECTION (Matches Login Overlay Aesthetics) */}
            <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full overflow-hidden rounded-l-[4.5rem] z-20">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-t opacity-40 from-teal-500 via-transparent to-transparent"></div>
              </div>

              <div className="relative w-full h-full flex flex-col items-center justify-center p-12 text-center text-white">
                <div className="mb-6 p-4 rounded-full bg-white backdrop-blur-md shadow-lg border border-teal-500">
                  <User size={32} className="text-teal-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Welcome to ProDoc</h2>
                <p className="text-white mb-8 leading-relaxed text-sm">
                  Create your account to start managing your health records securely and efficiently.
                </p>
                <div className="flex gap-4">
                  <button className="flex items-center justify-center gap-2 bg-white text-teal-600 font-bold py-2.5 px-6 rounded-xl hover:bg-teal-50 transition-all shadow-lg text-xs">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" /> Google
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile-only visual separator or simplified footer if needed, but the current structure handles it via flex-col */}
          </div>
        </div>

        <footer className="w-full text-center p-4 text-slate-500 text-xs font-medium">
          © {new Date().getFullYear()} ProDoc All rights reserved.
        </footer>
      </div>
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { }}></div>
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative z-10 animate-slide-up flex flex-col items-center text-center border border-slate-100">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <User size={24} className="text-teal-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Account Created!</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Your account has been successfully registered. You can now log in to the platform.
            </p>
            <button
              onClick={onNavigateLogin}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/30 transition-all transform active:scale-[0.98]"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

      {/* ERROR MODAL */}
      {errorAlert.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setErrorAlert({ ...errorAlert, show: false })}></div>
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative z-10 animate-slide-up flex flex-col items-center text-center border border-rose-100">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-rose-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Registration Failed</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {errorAlert.message}
            </p>
            <button
              onClick={() => setErrorAlert({ ...errorAlert, show: false })}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/30 transition-all transform active:scale-[0.98]"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowHelpModal(false)}></div>
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative z-10 animate-slide-up flex flex-col items-center text-center border border-slate-100">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <HelpCircle size={24} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Need Help?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              If you are having trouble creating an account, please contact our support team.
            </p>

            <div className="w-full space-y-3 mb-6">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
                <div className="p-2 bg-white rounded-lg text-teal-600 shadow-sm"><Mail size={18} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Us</p>
                  <p className="text-sm font-semibold text-slate-700">prdoc2025se06@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
                <div className="p-2 bg-white rounded-lg text-teal-600 shadow-sm"><Phone size={18} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Call Us</p>
                  <p className="text-sm font-semibold text-slate-700">+94 74 279 7484</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/20 transition-all transform active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- CUSTOM ANIMATIONS FOR MODAL --- */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SignupPage;