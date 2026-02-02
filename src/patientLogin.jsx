import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

// --- IMPORTS ---
import LogoColor from './assets/Logo_with_words.png'; 
import Plasma from './components/Plasma'; 

const LoginPage = ({ onBack, onNavigateSignup, onLoginSuccess }) => {
  const [userType, setUserType] = useState('patient'); 
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: userType 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // We call the prop from App.jsx to update the global state and redirect
        onLoginSuccess(data.user);
      } else {
        alert(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Connection error. Is 'vercel dev' running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans text-slate-700 overflow-hidden">
      
      {/* 1. PLASMA BACKGROUND */}
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <Plasma color="#14b8a6" speed={0.4} scale={2.0} opacity={0.8} />
        <div className="absolute inset-0 bg-teal-500/10 backdrop-blur-[2px]"></div>
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        <nav className="w-full p-6 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-teal-900 font-bold hover:bg-white/60 transition shadow-sm border border-white/20"
            >
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
              <HelpCircle size={18} />
            </button>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 md:p-10 relative border border-white/40">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-500 text-sm">Securely access your healthcare portal</p>
            </div>

            {/* Step 1: User Type */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">1</span>
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Choose User Type</span>
              </div>
              <div className="bg-slate-100/50 p-1 rounded-full flex relative">
                <button
                  onClick={() => setUserType('patient')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${
                    userType === 'patient' ? 'bg-teal-500 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Patient Login
                </button>
                <button
                  onClick={() => setUserType('doctor')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${
                    userType === 'doctor' ? 'bg-teal-500 shadow-md text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Doctor Login
                </button>
              </div>
            </div>

            {/* Step 2: Credentials */}
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Enter Credentials</span>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email Address"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="Password"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="text-right">
                    <a href="#" className="text-xs font-semibold text-teal-600 hover:text-teal-700">Forgot Password?</a>
                  </div>
                </div>
              </div>

              {/* Step 3: Authentication */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Authentication</span>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={20} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-bold text-slate-400">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="flex gap-4 mb-8">
              <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-2xl hover:bg-slate-50 transition font-semibold text-sm text-slate-700">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-2xl hover:bg-slate-50 transition font-semibold text-sm text-slate-700">
                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5" />
                Apple
              </button>
            </div>

            <div className="text-center text-sm text-slate-500 mb-6">
              New to ProDoc? <a href="#" onClick={(e) => { e.preventDefault(); onNavigateSignup(); }} className="text-teal-700 font-bold hover:underline">Create Account</a>
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

export default LoginPage;