import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Activity,
  User,
  AlertTriangle,
  Phone
} from 'lucide-react';

// --- IMPORTS ---
import LogoColor from './assets/Logo_with_words.png';
import Plasma from './components/Plasma';

const LoginPage = ({ onBack, onNavigateSignup, onLoginSuccess }) => {
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ show: false, message: '' });
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorAlert({ show: true, message: "Please enter both email and password." });
      return;
    }

    setLoading(true);

    try {
      const apiEndpoint = userType === 'doctor' ? '/api/doctor-login' : '/api/login';
      const response = await fetch(apiEndpoint, {
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
        localStorage.setItem('userRole', userType);
        if (data.user && data.user.id) {
          localStorage.setItem(userType === 'doctor' ? 'doctorId' : 'patientId', data.user.id);
        }
        onLoginSuccess(data.user, userType);
      } else {
        setErrorAlert({ show: true, message: data.error || "Invalid credentials. Please try again." });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorAlert({ show: true, message: "Connection error. Is 'vercel dev' running?" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans text-slate-700 overflow-hidden">

      {/* --- CUSTOM ANIMATIONS --- */}
      <style jsx>{`
        @keyframes slideFadeIn {
          0% { opacity: 0; transform: translateY(15px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-fade {
          animation: slideFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* 1. PLASMA BACKGROUND */}
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <Plasma color={userType === 'patient' ? "#14b8a6" : "#0d9488"} speed={0.4} scale={2.0} opacity={0.6} />
        <div className="absolute inset-0 bg-slate-50/30 backdrop-blur-[1px]"></div>
      </div>

      {/* 2. DYNAMIC BACKGROUND ORB (Visual Transition Cue) */}
      {/* This orb slides behind the card to indicate mode change */}
      <div className={`fixed w-[500px] h-[500px] rounded-full blur-[100px] z-0 transition-all duration-700 ease-in-out opacity-60
        ${userType === 'patient'
          ? 'bg-teal-400 left-[-100px] bottom-[-100px]'
          : 'bg-teal-600 right-[-100px] top-[-100px]'}
      `}></div>

      {/* 3. CONTENT LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">

        <nav className="w-full p-4 md:p-6 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full text-slate-700 font-bold hover:bg-white hover:shadow-md transition-all duration-300 border border-slate-300/30"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
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
          {/* 
            SPLIT-PANE CONTAINER 
          */}
          <div className="relative bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_0_40px_rgba(0,0,0,0.1)] w-full max-w-[850px] min-h-0 md:min-h-[520px] overflow-hidden flex flex-col md:block shadow-teal-500/10 border border-slate-200">

            {/* MOBILE TABS */}
            <div className="grid grid-cols-2 md:hidden border-b border-slate-100">
              <button
                onClick={() => setUserType('patient')}
                className={`py-4 text-sm font-bold transition-all ${userType === 'patient' ? 'text-teal-500 border-b-2 border-teal-500 bg-teal-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                Patient
              </button>
              <button
                onClick={() => setUserType('doctor')}
                className={`py-4 text-sm font-bold transition-all ${userType === 'doctor' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                Doctor
              </button>
            </div>

            <div className="relative md:absolute md:inset-0 flex flex-col md:flex-row w-full h-auto md:h-full">

              {/* LEFT PANEL: PATIENT SIGN IN (Visible when userType === 'patient') */}
              <div className={`w-full md:w-1/2 h-auto md:h-full p-6 md:p-10 flex flex-col justify-center items-center relative z-10 transition-opacity duration-500 ${userType === 'patient' ? 'flex' : 'hidden md:flex'}`}
                style={{ opacity: userType === 'patient' ? 1 : 0, pointerEvents: userType === 'patient' ? 'auto' : 'none' }}>

                <div className="w-full max-w-[320px]">
                  <h2 className="text-3xl font-bold text-teal-500 mb-2 text-center">Patient Login</h2>
                  <p className="text-slate-500 text-xs text-center mb-8">Access your personal health records</p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email Address"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                        value={userType === 'patient' ? formData.email : ''}
                        onChange={userType === 'patient' ? handleInputChange : () => { }}
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="Password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-12 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                        value={userType === 'patient' ? formData.password : ''}
                        onChange={userType === 'patient' ? handleInputChange : () => { }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="text-right">
                      <a href="#" className="text-[10px] font-bold text-teal-500 hover:text-teal-600 transition-colors">Forgot Password?</a>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-500 hover:bg-teal-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    >
                      {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                  </form>

                  <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 w-full opacity-30">
                      <div className="h-px bg-slate-700 flex-1"></div>
                      <span className="text-[10px] text-slate-700 uppercase tracking-widest">Or</span>
                      <div className="h-px bg-slate-700 flex-1"></div>
                    </div>

                    <button className="w-full bg-slate-50 hover:bg-slate-100 border border-teal-500 text-teal-600 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
                      Sign in with Google
                    </button>

                    <p className="text-xs text-slate-500 mt-2">
                      New user? <button onClick={() => onNavigateSignup()} className="text-teal-600 hover:text-teal-500 font-bold underline underline-offset-2">Create Account</button>
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: DOCTOR SIGN IN (Visible when userType === 'doctor') */}
              <div className={`w-full md:w-1/2 h-auto md:h-full p-6 md:p-10 flex flex-col justify-center items-center relative z-10 transition-opacity duration-500 ${userType === 'doctor' ? 'flex' : 'hidden md:flex'}`}
                style={{ opacity: userType === 'doctor' ? 1 : 0, pointerEvents: userType === 'doctor' ? 'auto' : 'none' }}>

                <div className="w-full max-w-[320px]">
                  <h2 className="text-3xl font-bold text-teal-600 mb-2 text-center">Doctor Portal</h2>
                  <p className="text-slate-500 text-xs text-center mb-8">Secure professional access</p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Doctor ID / Email"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                        value={userType === 'doctor' ? formData.email : ''}
                        onChange={userType === 'doctor' ? handleInputChange : () => { }}
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="Password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-12 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                        value={userType === 'doctor' ? formData.password : ''}
                        onChange={userType === 'doctor' ? handleInputChange : () => { }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="text-right">
                      <a href="#" className="text-[10px] font-bold text-teal-500 hover:text-teal-600 transition-colors">Forgot Password?</a>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-500 hover:bg-teal-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(8,145,178,0.6)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    >
                      {loading ? 'Authenticating...' : 'Access Dashboard'} <Activity size={18} />
                    </button>
                  </form>
                </div>
              </div>

            </div>

            {/* 
              OVERLAY SLIDER LAYER  
            */}
            <div className={`hidden md:block absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] z-20 ${userType === 'patient' ? 'translate-x-full rounded-l-[4.5rem]' : 'translate-x-0 rounded-r-[4.5rem]'}`}>

              {/* GRADIENT BACKGROUND */}
              <div className={`absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600`} >
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className={`absolute -bottom-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-t opacity-40 ${userType === 'patient' ? 'from-teal-500 via-transparent to-transparent' : 'from-teal-600 via-transparent to-transparent'}`}></div>
              </div>

              {/* OVERLAY CONTENT TRACK (Moves opposite to parent to create 'reveal' effect) */}
              <div className={`relative w-[200%] h-full flex transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${userType === 'patient' ? '-translate-x-1/2' : 'translate-x-0'}`}>

                {/* LEFT HALF CONTENT (Visible when Overlay is Left -> User = Doctor) */}
                <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center text-white relative">
                  <div className="mb-6 p-4 rounded-full bg-white backdrop-blur-md shadow-lg border border-teal-500">
                    <User size={32} className="text-teal-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Patient Access</h2>
                  <p className="text-white mb-8 leading-relaxed text-sm">
                    Return to your personal health dashboard to view records, appointments, and prescriptions.
                  </p>
                  <button
                    onClick={() => setUserType('patient')}
                    className="px-8 py-3 rounded-full bg-white text-teal-500 font-bold hover:bg-teal-50 transition-all shadow-lg"
                  >
                    Switch to Patient Login
                  </button>
                </div>

                {/* RIGHT HALF CONTENT (Visible when Overlay is Right -> User = Patient) */}
                <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center text-white relative">
                  <div className="mb-6 p-4 rounded-full bg-white backdrop-blur-md shadow-lg border border-teal-500">
                    <Activity size={32} className="text-teal-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Doctor Access</h2>
                  <p className="text-white mb-8 leading-relaxed text-sm">
                    Authorized medical personnel only. Access patient records and manage your practice.
                  </p>
                  <button
                    onClick={() => setUserType('doctor')}
                    className="px-8 py-3 rounded-full bg-white text-teal-500 font-bold hover:bg-teal-50 transition-all shadow-lg"
                  >
                    Switch to Doctor Login
                  </button>
                </div>

              </div>
            </div>
          </div >
        </div >

        <footer className="w-full text-center p-4 text-slate-500 text-xs font-medium">
          © {new Date().getFullYear()} ProDoc All rights reserved.
        </footer>
      </div >

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
              If you are having trouble logging in or accessing your account, please contact our support team.
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
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Login Failed</h3>
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

      {/* --- CUSTOM ANIMATIONS --- */}
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
    </div >
  );
};

export default LoginPage;