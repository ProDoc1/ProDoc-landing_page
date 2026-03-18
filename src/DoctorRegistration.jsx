import React, { useState } from 'react';
import { 
    User, Mail, Lock, ShieldCheck, Stethoscope, 
    Building2, FileText, ArrowLeft, Loader2, CheckCircle, 
    AlertCircle,  MapPin, Plus, X, GraduationCap, Globe, Briefcase, Layers, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoWithWords from './assets/Logo_with_words.png';

const DoctorRegistration = ({ onBack, onNavigateLogin, onNavigateTerms }) => {
    const [step, setStep] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        password: '',
        slmcNumber: '',
        specialty: '',
        sector: '',
        qualifications: '',
        languages: '',
        yearsOfExperience: '',
        profilePhoto: '',
        bio: '',
        associatedHospitals: []
    });
    const [hospitalInput, setHospitalInput] = useState('');
    const [dragging, setDragging] = useState(false);

    const handleImageUpload = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Please upload a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setFormData(prev => ({ ...prev, profilePhoto: e.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleImageUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const addHospital = () => {
        if (hospitalInput.trim() && !formData.associatedHospitals.includes(hospitalInput.trim())) {
            setFormData(prev => ({
                ...prev,
                associatedHospitals: [...prev.associatedHospitals, hospitalInput.trim()]
            }));
            setHospitalInput('');
        }
    };

    const removeHospital = (hospital) => {
        setFormData(prev => ({
            ...prev,
            associatedHospitals: prev.associatedHospitals.filter(h => h !== hospital)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Strict SLMC validation (4-5 digits)
        if (formData.slmcNumber.length < 4 || formData.slmcNumber.length > 5) {
            setError('SLMC Number must be between 4 and 5 digits.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/doctor-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setStep(2);
            } else {
                setError(data.error || 'Failed to submit registration request');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('System error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
        exit: { 
            opacity: 0, 
            y: -20,
            transition: { duration: 0.4 }
        }
    };

    if (step === 2) {
        return (
            <div className="min-h-screen bg-[#F0F8F8] flex items-center justify-center p-6">
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl shadow-teal-900/10 text-center border border-teal-50"
                >
                    <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle className="w-10 h-10 text-teal-500" />
                    </div>
                    <h2 className="text-3xl font-black text-teal-600 mb-4 tracking-tight">Request Received!</h2>
                    <p className="text-teal-900/60 leading-relaxed mb-10 font-medium text-sm">
                        Thank you for applying to join the ProDoc network. Your details have been sent to our administration team for verification. We will notify you via email once your profile is approved.
                    </p>
                    <button
                        onClick={onBack}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        Return to Home
                    </button>
                    <p className="mt-6 text-sm font-bold text-slate-400">
                        Usually takes 24-48 hours for verification.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0F8F8] via-[#E6F3F3] to-white py-8 px-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10l80 80M90 10L10 90' stroke='%2314B8A6' stroke-width='1' fill='none'/%3E%3C/svg%3E")` }}></div>
            
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto relative z-10"
            >
                <div className="mb-16 flex justify-center w-full">
                    <img 
                        src={LogoWithWords} 
                        alt="ProDoc Logo" 
                        className="h-16 md:h-20 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => window.location.href = '/'}
                    />
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Left Column: Branding & Info */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-100/50 rounded-full">
                                <ShieldCheck size={14} className="text-teal-500" />
                                <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">Official Registration</span>
                            </div>

                            <h1 className="text-6xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight">
                                Join the <span className="text-teal-500">Future</span> of Healthcare.
                            </h1>

                            <p className="text-lg font-medium text-slate-500 leading-relaxed max-w-lg">
                                Register with ProDoc to verify your professional profile, manage patient reviews, and expand your digital presence seamlessly.
                            </p>
                        </div>

                        <div className="space-y-6 max-w-lg">
                            {/* Feature Card 1 */}
                            <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-teal-900/5 flex gap-6 group hover:bg-white transition-all duration-500">
                                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-teal-100 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={24} className="text-teal-500" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Verified SLMC Profile</h3>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                        Instantly gain trust by showing patients your verified medical council credentials.
                                    </p>
                                </div>
                            </div>

                            {/* Feature Card 2 */}
                            <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-teal-900/5 flex gap-6 group hover:bg-white transition-all duration-500">
                                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-teal-100 group-hover:scale-110 transition-transform">
                                    <FileText size={24} className="text-teal-500" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Digital Portfolios</h3>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                        Showcase your specialized procedures, educational background, and hospital affiliations.
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-400">
                                Already have an account? 
                                <button 
                                    onClick={onNavigateLogin}
                                    className="text-teal-600 hover:text-teal-700 ml-2 font-black transition-colors underline decoration-teal-500/30 underline-offset-4"
                                >
                                    Log in here
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Registration Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[4rem] p-10 md:p-14 shadow-2xl shadow-teal-900/10 border border-white relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100">
                                        <Building2 size={24} className="text-teal-500" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Application Form</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">First Name (Dr.)*</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <input 
                                                    required
                                                    type="text" 
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    placeholder="Kamal"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Last Name*</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <input 
                                                    required
                                                    type="text" 
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Perera"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Email Address*</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <Mail size={18} />
                                                </div>
                                                <input 
                                                    required
                                                    type="email" 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">SLMC Number*</label>
                                            <div className="relative flex items-center bg-slate-50/50 border border-slate-100 rounded-2xl group focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-500/30 transition-all">
                                                <div className="pl-4 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <ShieldCheck size={18} />
                                                </div>
                                                <div className="pl-2 pr-0.5 text-sm font-bold text-teal-600/50 select-none">
                                                    SLMC-MD-
                                                </div>
                                                <input 
                                                    required
                                                    type="text" 
                                                    name="slmcNumber"
                                                    value={formData.slmcNumber}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 5) {
                                                            handleChange({ target: { name: 'slmcNumber', value: val } });
                                                        }
                                                    }}
                                                    placeholder="00000"
                                                    className="flex-1 bg-transparent py-4 pl-1 pr-4 text-sm font-bold text-teal-900 outline-none placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Specialty*</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                <Stethoscope size={18} />
                                            </div>
                                            <input 
                                                required
                                                type="text" 
                                                name="specialty"
                                                value={formData.specialty}
                                                onChange={handleChange}
                                                placeholder="Neurologist"
                                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Gender*</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <select 
                                                    required
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className={`w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all appearance-none cursor-pointer ${!formData.gender ? 'text-slate-300' : 'text-teal-900'}`}
                                                >
                                                    <option value="" disabled>Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Sector*</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <Layers size={18} />
                                                </div>
                                                <select 
                                                    required
                                                    name="sector"
                                                    value={formData.sector}
                                                    onChange={handleChange}
                                                    className={`w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all appearance-none cursor-pointer ${formData.sector === '' ? 'text-slate-300' : 'text-teal-900'}`}
                                                >
                                                    <option value="" disabled>Select Sector</option>
                                                    <option value="Private">Private</option>
                                                    <option value="Government">Government</option>
                                                    <option value="Both">Both</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Years of Experience*</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <Briefcase size={18} />
                                                </div>
                                                <input 
                                                    required
                                                    type="number" 
                                                    name="yearsOfExperience"
                                                    value={formData.yearsOfExperience}
                                                    onChange={handleChange}
                                                    placeholder="10"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Qualifications*</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <GraduationCap size={18} />
                                                </div>
                                                <input 
                                                    required
                                                    type="text" 
                                                    name="qualifications"
                                                    value={formData.qualifications}
                                                    onChange={handleChange}
                                                    placeholder="MBBS, MS, FRCS"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Languages Spoken*</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                    <Globe size={18} />
                                                </div>
                                                <input 
                                                    required
                                                    type="text" 
                                                    name="languages"
                                                    value={formData.languages}
                                                    onChange={handleChange}
                                                    placeholder="English, Sinhala"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Profile Photo*</label>
                                            <div 
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                className={`relative group h-[58px] border-2 border-dashed rounded-2xl transition-all flex items-center justify-center cursor-pointer overflow-hidden ${
                                                    dragging 
                                                    ? 'border-teal-500 bg-teal-50/50' 
                                                    : formData.profilePhoto 
                                                        ? 'border-teal-500 bg-white' 
                                                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                                                }`}
                                                onClick={() => document.getElementById('imageInput').click()}
                                            >
                                                <input 
                                                    type="file" 
                                                    id="imageInput"
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e.target.files[0])}
                                                />
                                                {formData.profilePhoto ? (
                                                    <div className="flex items-center gap-3 px-4 w-full h-full bg-white">
                                                        <img src={formData.profilePhoto} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-teal-100 shadow-sm" />
                                                        <span className="text-xs font-bold text-teal-600 truncate flex-1">Image Loaded</span>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFormData(prev => ({ ...prev, profilePhoto: '' }));
                                                            }}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                                        <Upload size={16} className={dragging ? 'animate-bounce text-teal-500' : ''} />
                                                        {dragging ? 'Drop to upload' : 'Click to Upload Photo'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Create Password*</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input 
                                                required
                                                type="password" 
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Affiliated Hospitals*</label>
                                        <div className="flex gap-2">
                                            <div className="relative group flex-1">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400">
                                                    <MapPin size={18} />
                                                </div>
                                                <input 
                                                    required
                                                    type="text" 
                                                    value={hospitalInput}
                                                    onChange={(e) => setHospitalInput(e.target.value)}
                                                    placeholder="Add Hospital/Clinic..."
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHospital())}
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={addHospital}
                                                className="bg-teal-500 text-white p-4 rounded-2xl hover:bg-teal-600 transition-all shadow-lg"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {formData.associatedHospitals.map((h, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-xl border border-teal-100 text-xs font-black uppercase tracking-wider">
                                                    {h}
                                                    <button type="button" onClick={() => removeHospital(h)} className="hover:text-red-500">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Professional Bio</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-5 text-teal-400">
                                                <FileText size={18} />
                                            </div>
                                            <textarea 
                                                required
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Brief overview of your practice..."
                                                className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] py-4 pl-12 pr-4 text-sm font-bold text-teal-900 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all placeholder:text-slate-300 resize-none"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                                            <AlertCircle size={20} />
                                            <p className="text-xs font-bold leading-none">{error}</p>
                                        </div>
                                    )}

                                    <div className="space-y-6 pt-4">
                                        <button 
                                            disabled={loading}
                                            type="submit"
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-2xl shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Verification Request
                                                    <ArrowLeft size={20} className="rotate-180" />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
                                            By submitting, you agree to ProDoc's <button onClick={onNavigateTerms} className="text-teal-600 underline hover:text-teal-700 transition-colors font-bold">Terms of Service</button> and confirm that all medical credentials provided are authentic.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DoctorRegistration;
