import React, { useState } from 'react';
import { 
  Stethoscope, 
  HelpCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';

const LoginPage = () => {
  const [userType, setUserType] = useState('doctor'); // 'patient' or 'doctor'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-teal-200 to-cyan-400 flex flex-col relative font-sans text-slate-700">
      
      {/* --- Top Navigation --- */}
      <nav className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-teal-700 p-2 rounded-full text-white">
            <Stethoscope size={24} />
          </div>
          <div className="leading-tight">
            <h1 className="font-bold text-xl tracking-wide text-teal-900">PRODOC</h1>
            <p className="text-[10px] text-teal-800 tracking-wider uppercase font-semibold">Trust. Find. Heal.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-teal-900 font-medium hover:bg-white/40 transition">
          <HelpCircle size={18} />
          <span>Help Center</span>
        </button>
      </nav>

      {/* --- Main Content --- */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 md:p-10 relative">
          
          {/* Header */}
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
            
            <div className="bg-slate-100 p-1 rounded-full flex relative">
              <button 
                onClick={() => setUserType('patient')}
                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${
                  userType === 'patient' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
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
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Enter Credentials</span>
            </div>

            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Password"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
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

            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
              Sign In <ArrowRight size={20} />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-bold text-slate-400">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Social Login */}
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

          {/* Footer CTA */}
          <div className="text-center text-sm text-slate-500 mb-6">
            New to ProDoc? <a href="#" className="text-teal-700 font-bold hover:underline">Create Account</a>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-50 rounded-full w-fit mx-auto border border-slate-100">
            <CheckCircle size={14} className="text-teal-500 fill-teal-100" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Verified Specialists</span>
          </div>

        </div>
      </div>

      {/* --- Footer Copyright --- */}
      <footer className="w-full text-center p-4 text-teal-800/60 text-xs">
        © 2025 ProDoc Group Project
      </footer>

    </div>
  );
};

export default LoginPage;