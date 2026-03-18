import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, MapPin, Star, ShieldCheck,
  Clock, Stethoscope, Facebook, Instagram,
  Linkedin, Mail, Phone, Filter, ChevronDown,
  X, FileText, CheckCircle, MoveRight
} from 'lucide-react';
import LogoWithWords from './assets/Logo_with_words.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const DoctorsPage = ({ onBack, onViewProfile, onNavigateDoctorRegistration }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  const [filters, setFilters] = useState({
    specialty: 'All',
    hospitalSearch: '',
    gender: 'All',
    availability: 'All',
    secondOpinion: false
  });

  const specRef = useRef(null);
  const hospitalRef = useRef(null);

  useEffect(() => {
    const mockDoctors = [
      {
        doctor_id: 1,
        full_name: "Dr. Anura Bandara",
        specialty: "Oncologist",
        associated_hospitals: [{ name: "National Hospital", type: "Government" }],
        years_of_experience: 18,
        department_type: "Government",
        gender: "Male",
        image_url: null,
        second_opinion_available: true
      },
      {
        doctor_id: 2,
        full_name: "Dr. Aruni Perera",
        specialty: "Cardiologist",
        associated_hospitals: [{ name: "Colombo General", type: "Government" }],
        years_of_experience: 12,
        department_type: "Government",
        gender: "Female",
        image_url: null,
        second_opinion_available: false
      }
    ];

    const fetchDoctors = async () => {
      try {
        const response = await fetch(`/api/doctors?t=${Date.now()}`);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        } else {
          console.warn("API returned non-array data, using mock.");
          setDoctors(mockDoctors);
        }
      } catch (error) {
        console.error("Failed to load doctors, using mock data:", error);
        setDoctors(mockDoctors);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    const handleClickOutside = (e) => {
      if (specRef.current && !specRef.current.contains(e.target)) setIsSpecOpen(false);
      if (hospitalRef.current && !hospitalRef.current.contains(e.target)) setIsHospitalOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableSpecialties = (doctors || []).reduce((acc, doc) => {
    const spec = doc?.specialty?.trim();
    if (spec && !acc.find(existing => existing.toLowerCase() === spec.toLowerCase())) {
      acc.push(spec);
    }
    return acc;
  }, []);

  const specialties = ['All', ...availableSpecialties.sort()];

  const availableHospitals = (doctors || []).reduce((acc, doc) => {
    const docHospitals = doc?.associated_hospitals || [];
    docHospitals.forEach(h => {
      const name = h.name?.trim();
      if (name && !acc.find(existing => existing.toLowerCase() === name.toLowerCase())) {
        acc.push(name);
      }
    });
    return acc;
  }, []);

  const hospitalSuggestions = filters.hospitalSearch.trim() === ''
    ? availableHospitals
    : availableHospitals.filter(h =>
      h.toLowerCase().includes(filters.hospitalSearch.toLowerCase()) &&
      filters.hospitalSearch.toLowerCase() !== h.toLowerCase()
    );

  const filteredDoctors = (doctors || []).filter(doc => {
    const searchLower = (searchQuery || '').toLowerCase().trim();
    const name = (doc?.full_name || '').toLowerCase();
    const specialty = (doc?.specialty || '').toLowerCase();

    const matchesSearch = searchLower === '' ||
      name.includes(searchLower) ||
      specialty.includes(searchLower);

    const matchesSpecialty = filters.specialty === 'All' || specialty === filters.specialty.toLowerCase();

    const docHospitals = doc?.associated_hospitals || [];
    const hospitalFilter = (filters.hospitalSearch || '').toLowerCase().trim();
    const matchesHospital = hospitalFilter === '' ||
      docHospitals.some(h => (h.name || '').toLowerCase().includes(hospitalFilter));

    const matchesAvailability = filters.availability === 'All' ||
      doc.department_type === filters.availability ||
      (doc.department_type === 'Both' && filters.availability !== 'Both');

    const gender = doc?.gender || '';
    const matchesGender = filters.gender === 'All' || gender === filters.gender;

    const matchesSecondOpinion = !filters.secondOpinion || doc.second_opinion_available === true;

    return matchesSearch && matchesSpecialty && matchesHospital && matchesAvailability && matchesGender && matchesSecondOpinion;
  });

  const highlightMatch = (text, query) => {
    if (!text || !query) return text || '';
    const regex = new RegExp(`(${query})`, 'ig');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-teal-600 bg-teal-50 px-1 rounded-md">{part}</span>
      ) : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative selection:bg-teal-100 selection:text-teal-900 font-sans">

      {/* Dynamic Fluid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50/50">
        {/* Animated Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-200/30 mix-blend-multiply filter blur-[100px] opacity-80 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-200/30 mix-blend-multiply filter blur-[100px] opacity-80 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-emerald-100/40 mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>

        {/* Subtle dot pattern map for structure */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-slate-200 pb-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Find a <br /> <span className="text-teal-600">Specialist.</span>
              </h1>
            </div>
          </div>

          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors z-10" size={20} />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 border-b-2">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm sticky top-36 z-40">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Filter size={16} className="text-teal-500" /> Filters
                </h2>
                <button
                  onClick={() => {
                    setFilters({ specialty: 'All', hospitalSearch: '', gender: 'All', availability: 'All', secondOpinion: false });
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Specialization Dropdown */}
              <div className="mb-6" ref={specRef}>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Specialization</h4>
                <div className="relative">
                  <button
                    onClick={() => setIsSpecOpen(!isSpecOpen)}
                    className={`w-full flex items-center justify-between bg-slate-50 border ${isSpecOpen ? 'border-teal-400 ring-2 ring-teal-500/10' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200`}
                  >
                    <span className={filters.specialty === 'All' ? 'text-slate-500' : 'text-teal-700 font-bold'}>
                      {filters.specialty === 'All' ? 'Any Specialty' : filters.specialty}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isSpecOpen ? 'rotate-180 text-teal-600' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isSpecOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto"
                      >
                        {(specialties || []).map((spec) => (
                          <button
                            key={spec}
                            onClick={() => {
                              setFilters({ ...filters, specialty: spec });
                              setIsSpecOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-slate-50 last:border-0 hover:bg-teal-50 ${filters.specialty === spec ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600'}`}
                          >
                            {spec}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Hospital Search */}
              <div className="mb-6" ref={hospitalRef}>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Hospital</h4>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search hospitals..."
                    value={filters.hospitalSearch}
                    onFocus={() => setIsHospitalOpen(true)}
                    onChange={(e) => {
                      setFilters({ ...filters, hospitalSearch: e.target.value });
                      setIsHospitalOpen(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-slate-700 placeholder:text-slate-400"
                  />
                  <AnimatePresence>
                    {isHospitalOpen && hospitalSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto"
                      >
                        {hospitalSuggestions.map((hospital, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setFilters({ ...filters, hospitalSearch: hospital });
                              setIsHospitalOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-slate-50 last:border-none"
                          >
                            {hospital}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Second Opinion Toggle */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer" onClick={() => setFilters({ ...filters, secondOpinion: !filters.secondOpinion })}>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText size={14} className="text-teal-500" /> Second Opinion
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-tight">Remote consults</p>
                </div>
                <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${filters.secondOpinion ? 'bg-teal-500' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${filters.secondOpinion ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Sector Options */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Sector</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Government', 'Private', 'Both'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilters({ ...filters, availability: option })}
                      className={`py-3 px-1 xl:px-2 rounded-xl border text-[13px] font-bold transition-all duration-200 ${filters.availability === option ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Radio */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Gender</h4>
                <div className="flex bg-slate-50 border border-slate-200 p-1.5 rounded-2xl gap-1">
                  {['All', 'Male', 'Female'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFilters({ ...filters, gender: g })}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${filters.gender === g ? 'bg-white border border-slate-200 text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 border border-transparent hover:bg-slate-100/50'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* RESULTS GRID */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-32 border border-slate-200 bg-white rounded-3xl shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500 border-r-transparent mb-4"></div>
                <p className="text-slate-500 text-sm font-medium font-mono animate-pulse uppercase tracking-widest">Compiling DB...</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode='popLayout'>
                  {(filteredDoctors || []).map(doc => (
                    <motion.div
                      key={doc.doctor_id}
                      layout
                      variants={itemVariants}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 flex flex-col justify-between h-full transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row gap-6 items-start">


                        {/* Image */}
                        <div className="shrink-0">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-teal-200 transition-colors">
                            {doc.image_url ? (
                              <img src={doc.image_url} alt={doc.full_name} className="w-full h-full object-cover transition-all duration-500 hover:scale-105" onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                              <Stethoscope size={32} className="text-slate-300 group-hover:text-teal-300 transition-colors" />
                            )}
                          </div>
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 w-full pt-1">
                          <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-teal-600 transition-colors mb-1 pr-12 line-clamp-2">
                            {highlightMatch(doc.full_name, searchQuery)}
                          </h3>
                          <p className="text-teal-600 font-mono text-xs font-bold uppercase tracking-wider mb-4">
                            {doc.specialty || 'General Practitioner'}
                          </p>

                          <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <Clock size={14} className="text-slate-400" />
                              <span>{doc.years_of_experience || 0} Years Experience</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <ShieldCheck size={14} className={doc.department_type === 'Private' ? 'text-indigo-400' : 'text-emerald-400'} />
                              <span>{doc.department_type || 'Hospital'} Sector</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                        {doc.second_opinion_available ? (
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 font-mono uppercase tracking-wide">
                            Remote Consult
                          </div>
                        ) : <div></div>}

                        <button
                          onClick={() => onViewProfile(doc.doctor_id)}
                          className="bg-slate-50/80 backdrop-blur-xl border border-slate-200 text-slate-900 font-bold px-8 py-3 rounded-[1.25rem] transition-all duration-300 flex items-center gap-2 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-white hover:border-slate-300 group/btn"
                        >
                          View Profile <MoveRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform text-teal-600" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && (!filteredDoctors || filteredDoctors.length === 0) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-24 bg-slate-50 border border-slate-200 rounded-3xl">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Search size={24} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No strictly matching profiles</h3>
                <p className="text-slate-500 font-medium max-w-sm">We couldn't find any verified professionals matching your exact criteria. Try broadening your filters.</p>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* FOOTER SAME AS ABOUT.JSX */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
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
                <a href="https://www.linkedin.com/company/prodoclk/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-4 text-sm">
                {[
                  { name: 'Find a Doctor', url: '/doctors' },
                  { name: 'How it Works', url: '/how-it-works' },
                  { name: 'Our Team', url: '/team' },
                  { name: 'Reviews', url: '/reviews' }
                ].map((item) => (
                  <li key={item.name}><a href={item.url} className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                    {item.name}
                  </a></li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-4 text-sm">
                {[
                  { name: 'About Us', url: '/about' },
                  { name: 'Careers', url: '/careers' },
                  { name: 'Privacy Policy', url: '/privacy' },
                  { name: 'Terms of Service', url: '/terms' }
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.url} className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Mail size={18} /></div>
                    <a href="mailto:prdoc2025se06@gmail.com" className="hover:text-teal-600 transition-colors">prdoc2025se06@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Phone size={18} /></div>
                  <span>+94 74 279 7484</span>
                </li>
              </ul>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide">Are you a doctor?</p>
                <button 
                  onClick={onNavigateDoctorRegistration}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all transform active:scale-95"
                >
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
            <p>©️ {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DoctorsPage;