import React, { useState, useEffect } from 'react';
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
  Phone,
  CheckCircle2
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import GoogleIcon from './components/GoogleIcon';

// --- IMPORTS ---
import LogoColor from './assets/Logo_with_words.png';
import Plasma from './components/Plasma';

const LoginPage = ({ onBack, onNavigateSignup, onLoginSuccess }) => {
  const [userType, setUserType] = useState('patient');
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', code: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ show: false, message: '' });
  const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GOOGLE LOGIN (OAUTH2 POPUP) ---
  const handleGoogleToken = (accessToken) => {
    setLoading(true);
    fetch('/api/google-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: accessToken, role: userType })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('userRole', userType);
          if (data.user && data.user.id) {
            localStorage.setItem(userType === 'doctor' ? 'doctorId' : 'patientId', data.user.id);
          }
          onLoginSuccess(data.user, userType);
        } else {
          setErrorAlert({ show: true, message: data.error || "Google login failed." });
        }
      })
      .catch(err => {
        console.error("Google Auth Error:", err);
        setErrorAlert({ show: true, message: "Connection error during Google login." });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    // Use google.accounts.oauth2 for Custom Button (Popup flow)
    if (window.google && window.google.accounts) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            handleGoogleToken(tokenResponse.access_token);
          }
        },
      });
      client.requestAccessToken();
    } else {
      setErrorAlert({ show: true, message: "Google Sign-In is loading. Please try again in a moment." });
    }
  };

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

  // --- FORGOT PASSWORD LOGIC ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setErrorAlert({ show: true, message: "Please enter your email address." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, role: userType })
      });
      const data = await res.json();

      if (data.success && data.resetCode) {
        const serviceId = 'service_jajwzgf';
        const templateId = 'template_o75vnnp';
        const publicKey = 'LUysmcNbwO0ok5GAV';

        const templateParams = {
          from_name: "ProDoc Security",
          to_name: formData.email,
          to_email: formData.email,
          subject: "Password Reset Request",
          message: `Your password reset code is: ${data.resetCode}. It expires in 15 minutes.`,
          code: data.resetCode
        };

        await emailjs.send(serviceId, templateId, templateParams, publicKey);

        setView('reset');
        setSuccessAlert({ show: true, message: "A 6-digit reset code has been sent to your email." });
      } else {
        setErrorAlert({ show: true, message: data.error || "Failed to generate code." });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setErrorAlert({ show: true, message: "Error sending reset code. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.newPassword) {
      setErrorAlert({ show: true, message: "Please enter the code and your new password." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
          role: userType
        })
      });
      const data = await res.json();
      if (data.success) {
        setView('login');
        setSuccessAlert({ show: true, message: "Password updated successfully! You can now log in." });
        setFormData({ ...formData, password: '', code: '', newPassword: '' });
      } else {
        setErrorAlert({ show: true, message: data.error || "Failed to reset password." });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setErrorAlert({ show: true, message: "Error resetting password. Please try again." });
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
              onClick={view === 'login' ? onBack : () => setView('login')}
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
          <div className="relative bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_0_40px_rgba(0,0,0,0.1)] w-full max-w-[850px] min-h-0 md:min-h-[520px] overflow-hidden flex flex-col md:block shadow-teal-500/10 border border-slate-200">

            {/* MOBILE TABS (only shown in login view) */}
            {view === 'login' && (
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
            )}

            <div className="relative md:absolute md:inset-0 flex flex-col md:flex-row w-full h-auto md:h-full">

              {/* FORGOT PASSWORD VIEW */}
              {view === 'forgot' && (
                <div className="w-full h-full p-8 md:p-16 flex flex-col justify-center items-center animate-slide-fade">
                  <div className="w-full max-w-[400px]">
                    <h2 className="text-3xl font-bold text-teal-600 mb-2 text-center">Reset Password</h2>
                    <p className="text-slate-500 text-sm text-center mb-8">Enter your email and we'll send you a 6-digit code</p>
                    <form onSubmit={handleSendCode} className="space-y-6">
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Email Address"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500 transition-all"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? 'Sending Code...' : 'Send Reset Code'} <ArrowRight size={18} />
                      </button>
                      <button type="button" onClick={() => setView('login')} className="w-full text-sm text-slate-400 font-bold hover:text-teal-500 transition-colors">
                        Back to Login
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* RESET PASSWORD VIEW */}
              {view === 'reset' && (
                <div className="w-full h-full p-8 md:p-16 flex flex-col justify-center items-center animate-slide-fade">
                  <div className="w-full max-w-[400px]">
                    <h2 className="text-3xl font-bold text-teal-600 mb-2 text-center">New Password</h2>
                    <p className="text-slate-500 text-sm text-center mb-8">Enter the code sent to {formData.email}</p>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500">
                          <Activity size={18} />
                        </div>
                        <input
                          type="text"
                          name="code"
                          required
                          maxLength={6}
                          placeholder="6-Digit Verification Code"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-mono tracking-widest text-center focus:outline-none focus:border-teal-500 transition-all"
                          value={formData.code}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500">
                          <Lock size={18} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          required
                          placeholder="New Secure Password"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-teal-500 transition-all"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                      >
                        {loading ? 'Updating Password...' : 'Reset Password'} <CheckCircle2 size={18} />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* LOGIN VIEW (Standard split pane) */}
              {view === 'login' && (
                <>
                  {/* LEFT PANEL: PATIENT SIGN IN */}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                          <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-bold text-teal-500 hover:text-teal-600 transition-colors">Forgot Password?</button>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-teal-500 hover:bg-teal-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                        >
                          {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
                        </button>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                          <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-400 font-bold">Or continue with</span></div>
                        </div>

                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
                        >
                          <GoogleIcon size={20} />
                          <span>Google</span>
                        </button>
                      </form>

                      <div className="mt-6 flex flex-col items-center gap-4">
                        <p className="text-xs text-slate-500">
                          New user? <button onClick={() => onNavigateSignup()} className="text-teal-600 hover:text-teal-500 font-bold underline underline-offset-2">Create Account</button>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL: DOCTOR SIGN IN */}
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
                            placeholder="Doctor Email"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                            value={userType === 'doctor' ? formData.email : ''}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                          <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-bold text-teal-500 hover:text-teal-600 transition-colors">Forgot Password?</button>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-teal-500 hover:bg-teal-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(8,145,178,0.6)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                        >
                          {loading ? 'Authenticating...' : 'Access Dashboard'} <Activity size={18} />
                        </button>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                          <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-400 font-bold">Or continue with</span></div>
                        </div>

                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
                        >
                          <GoogleIcon size={20} />
                          <span>Google</span>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* OVERLAY SLIDER LAYER  */}
                  <div className={`hidden md:block absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] z-20 ${userType === 'patient' ? 'translate-x-full rounded-l-[4.5rem]' : 'translate-x-0 rounded-r-[4.5rem]'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600`} >
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    </div>
                    <div className={`relative w-[200%] h-full flex transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${userType === 'patient' ? '-translate-x-1/2' : 'translate-x-0'}`}>
                      <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center text-white relative">
                        <div className="mb-6 p-4 rounded-full bg-white backdrop-blur-md shadow-lg border border-teal-500 text-teal-400"><User size={32} /></div>
                        <h2 className="text-3xl font-bold mb-4">Patient Access</h2>
                        <p className="text-white mb-8 leading-relaxed text-sm">Return to your personal health dashboard to view records and appointments.</p>
                        <button onClick={() => setUserType('patient')} className="px-8 py-3 rounded-full bg-white text-teal-500 font-bold hover:bg-teal-50 transition-all shadow-lg">Switch to Patient Login</button>
                      </div>
                      <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center text-white relative">
                        <div className="mb-6 p-4 rounded-full bg-white backdrop-blur-md shadow-lg border border-teal-500 text-teal-400"><Activity size={32} /></div>
                        <h2 className="text-3xl font-bold mb-4">Doctor Access</h2>
                        <p className="text-white mb-8 leading-relaxed text-sm">Authorized medical personnel only. Access patient records and manage your practice.</p>
                        <button onClick={() => setUserType('doctor')} className="px-8 py-3 rounded-full bg-white text-teal-500 font-bold hover:bg-teal-50 transition-all shadow-lg">Switch to Doctor Login</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div >
        </div >

        <footer className="w-full text-center p-4 text-slate-500 text-xs font-medium">
          © {new Date().getFullYear()} ProDoc All rights reserved.
        </footer>
      </div >

      {/* MODALS (Help, Error, Success) */}
      <Modal show={showHelpModal} onClose={() => setShowHelpModal(false)} type="help" title="Need Help?">
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">If you are having trouble logging in, please contact our support team.</p>
        <div className="w-full space-y-3 mb-6">
          <ContactItem icon={<Mail size={18} />} label="Email Us" value="prdoc2025se06@gmail.com" />
          <ContactItem icon={<Phone size={18} />} label="Call Us" value="+94 74 279 7484" />
        </div>
      </Modal>

      <Modal show={errorAlert.show} onClose={() => setErrorAlert({ ...errorAlert, show: false })} type="error" title="Login Failed">
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">{errorAlert.message}</p>
      </Modal>

      <Modal show={successAlert.show} onClose={() => setSuccessAlert({ ...successAlert, show: false })} type="success" title="Success!">
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">{successAlert.message}</p>
      </Modal>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div >
  );
};

// Helper Components
const Modal = ({ show, onClose, title, children, type }) => {
  if (!show) return null;
  const icons = {
    help: <HelpCircle size={24} className="text-blue-600" />,
    error: <AlertTriangle size={24} className="text-rose-600" />,
    success: <CheckCircle2 size={24} className="text-emerald-600" />
  };
  const colors = {
    help: "bg-blue-50 border-blue-100",
    error: "bg-rose-50 border-rose-100",
    success: "bg-emerald-50 border-emerald-100"
  };
  const btnColors = {
    help: "bg-slate-900 hover:bg-slate-800",
    error: "bg-rose-500 hover:bg-rose-600",
    success: "bg-emerald-500 hover:bg-emerald-600"
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative z-10 animate-slide-up flex flex-col items-center text-center border ${colors[type]}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${type === 'help' ? 'bg-blue-50' : type === 'error' ? 'bg-rose-50' : 'bg-emerald-50'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type === 'help' ? 'bg-blue-100' : type === 'error' ? 'bg-rose-100' : 'bg-emerald-100'}`}>
            {icons[type]}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
        {children}
        <button onClick={onClose} className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98] ${btnColors[type]}`}>
          {type === 'error' ? 'Try Again' : 'Close'}
        </button>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
    <div className="p-2 bg-white rounded-lg text-teal-600 shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  </div>
);

export default LoginPage;
