import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, MapPin, Star, ShieldCheck,
  Clock, Stethoscope, Facebook, Instagram,
  Linkedin, Mail, Phone, Filter, ChevronDown,
  X, FileText
} from 'lucide-react';

// --- Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const DoctorsPage = ({ onBack, onViewProfile }) => {
  // --- FIX 1: Ensure state is ALWAYS an array, never false ---
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
    // Mock data fallback
    const mockDoctors = [
      {
        doctor_id: 1,
        full_name: "Dr. Anura Bandara",
        specialty: "Oncologist",
        associated_hospitals: [{ name: "National Hospital", type: "Government" }],
        years_of_experience: 18,
        department_type: "Government",
        gender: "Male",
        image_url: null
      },
      {
        doctor_id: 2,
        full_name: "Dr. Aruni Perera",
        specialty: "Cardiologist",
        associated_hospitals: [{ name: "Colombo General", type: "Government" }],
        years_of_experience: 12,
        department_type: "Government",
        gender: "Female",
        image_url: null
      }
    ];

    const fetchDoctors = async () => {
      try {
        // Add a timestamp to bypass browser cache
        const response = await fetch(`/api/doctor?t=${Date.now()}`);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();

        // --- FIX 2: Strictly check if data is an Array before setting ---
        if (Array.isArray(data) && data.length > 0) {
          console.log("Doctors loaded from database:", data);
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

  const specialties = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Orthopedic Surgeon', 'General Surgeon', 'Oncologist'];

  // --- FIX 3: Safe reduction with (doctors || []) ---
  // Collect all unique hospitals from the doctors' associated_hospitals arrays
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
    ? []
    : availableHospitals.filter(h =>
      h.toLowerCase().includes(filters.hospitalSearch.toLowerCase()) &&
      filters.hospitalSearch.toLowerCase() !== h.toLowerCase()
    );

  // --- FIX 4: Safe filtering with (doctors || []) ---
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

    // Filter by Second Opinion
    const matchesSecondOpinion = !filters.secondOpinion || doc.second_opinion_available === true;

    return matchesSearch && matchesSpecialty && matchesHospital && matchesAvailability && matchesGender && matchesSecondOpinion;
  });

  const highlightMatch = (text, query) => {
    if (!text || !query) return text || '';
    const regex = new RegExp(`(${query})`, 'ig');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-teal-600 font-bold bg-teal-50 rounded px-0.5">{part}</span>
      ) : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-white p-4 md:p-8 pt-32 md:pt-36 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={onBack}
              className="group flex items-center gap-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-teal-300 hover:text-teal-700 transition-all w-fit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">Find a Specialist</h1>
              <p className="text-slate-500 mt-1">Search our network of top-rated professionals</p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors z-10" size={20} />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full bg-white/80 backdrop-blur border border-slate-200 rounded-2xl py-4 pl-12 pr-10 shadow-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 outline-none transition-all text-slate-700 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full hover:bg-slate-200 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-lg shadow-slate-200/50 border border-white sticky top-36 z-40"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-wide">
                  <Filter size={18} className="text-teal-600" /> Filters
                </h2>
                <button
                  onClick={() => {
                    setFilters({ specialty: 'All', hospitalSearch: '', gender: 'All', availability: 'All', secondOpinion: false });
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline transition-all"
                >
                  Reset All
                </button>
              </div>

              {/* Specialization Dropdown */}
              <div className="mb-8" ref={specRef}>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Stethoscope size={14} /> Specialization
                </h4>
                <div className="relative">
                  <button
                    onClick={() => setIsSpecOpen(!isSpecOpen)}
                    className={`w-full flex items-center justify-between bg-slate-50 border ${isSpecOpen ? 'border-teal-300 ring-2 ring-teal-100' : 'border-slate-200'} rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 hover:border-teal-300 transition-all duration-300`}
                  >
                    <span className={filters.specialty === 'All' ? 'text-slate-400' : 'text-teal-800 font-bold'}>
                      {filters.specialty === 'All' ? 'Select Specialty' : filters.specialty}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isSpecOpen ? 'rotate-180 text-teal-600' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isSpecOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full mt-3 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                      >
                        {(specialties || []).map((spec) => (
                          <button
                            key={spec}
                            onClick={() => {
                              setFilters({ ...filters, specialty: spec });
                              setIsSpecOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3.5 text-sm transition-colors border-b border-slate-50 last:border-0 hover:bg-teal-50 ${filters.specialty === spec ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600'
                              }`}
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
              <div className="mb-8" ref={hospitalRef}>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <MapPin size={14} /> Hospital
                </h4>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Search Hospital"
                    value={filters.hospitalSearch}
                    onFocus={() => setIsHospitalOpen(true)}
                    onChange={(e) => {
                      setFilters({ ...filters, hospitalSearch: e.target.value });
                      setIsHospitalOpen(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-300 transition-all"
                  />

                  <AnimatePresence>
                    {isHospitalOpen && hospitalSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto"
                      >
                        {(hospitalSuggestions || []).map((hospital, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setFilters({ ...filters, hospitalSearch: hospital });
                              setIsHospitalOpen(false);
                            }}
                            className="w-full text-left px-5 py-3 text-xs text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-slate-50 last:border-none"
                          >
                            {hospital}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>



              {/* Second Opinion Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileText size={14} /> Second Opinion
                  </h4>
                  <button
                    onClick={() => setFilters({ ...filters, secondOpinion: !filters.secondOpinion })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${filters.secondOpinion ? 'bg-teal-500' : 'bg-slate-200'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${filters.secondOpinion ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Show only specialists accepting remote consultations</p>
              </div>

              {/* Department Type */}
              <div className="mb-8">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">SECTOR</h4>
                <div className="flex flex-col gap-2">
                  {['All', 'Government', 'Private', 'Both'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilters({ ...filters, availability: option })}
                      className={`text-left px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${filters.availability === option ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Toggle */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Gender</h4>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  {['All', 'Male', 'Female'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFilters({ ...filters, gender: g })}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${filters.gender === g ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* RESULTS GRID */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 border-r-transparent"></div>
                <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">Finding specialists...</p>
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
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-teal-500/10 group flex flex-col justify-between h-full transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Decorative Top Border */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-100 to-transparent group-hover:via-teal-400 transition-all duration-500"></div>

                      {/* REVISED CARD CONTENT */}
                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

                        {/* 1. INCREASED IMAGE SIZE */}
                        <div className="shrink-0">
                          <div className="w-32 h-32 rounded-3xl bg-teal-50 flex items-center justify-center overflow-hidden border border-teal-100 shadow-sm">
                            {doc.image_url ? (
                              <img
                                src={doc.image_url}
                                alt={doc.full_name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <Stethoscope size={40} className="text-teal-600" />
                            )}
                          </div>
                        </div>

                        {/* 2. TEXT INFO COLUMN */}
                        <div className="flex-1 w-full flex flex-col justify-between h-full min-h-[128px]">

                          {/* Top: Name, Rating, Specialty */}
                          <div className="w-full">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h1 className="font-bold text-xl text-slate-900 leading-tight group-hover:text-teal-700 transition-colors">
                                {highlightMatch(doc.full_name, searchQuery)}
                              </h1>
                              <div className="flex items-center gap-1.5 shrink-0 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <span className="text-xs font-bold text-amber-700">
                                  {doc.average_rating > 0 ? Number(doc.average_rating).toFixed(1) : 'New'}
                                </span>
                              </div>
                            </div>
                            <p className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-4">
                              {doc.specialty || 'General Practitioner'}
                            </p>
                          </div>

                          {/* 3. ALIGNED RIGHT: EXPERIENCE & WORK */}
                          <div className="flex flex-col sm:flex-row justify-end items-center sm:items-center gap-3 mt-auto w-full">

                            {/* Original Sector Badge */}
                            <div className="flex items-center gap-2 text-xs">
                              <ShieldCheck size={16} className="text-teal-500" />
                              <span className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${doc.department_type === 'Private'
                                ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                {doc.department_type || 'Hospital'}
                              </span>
                            </div>

                            {/* Multiple Hospitals List Removed as per request */}

                            {/* Experience Badge */}
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                                <Clock size={14} />
                              </div>
                              <span className="font-medium whitespace-nowrap">Exp: {doc.years_of_experience || 0} yrs</span>
                            </div>

                          </div>
                        </div>
                      </div>
                      {/* END REVISED CARD CONTENT */}

                      <div className="flex justify-center w-full mt-6">
                        <button
                          onClick={() => onViewProfile(doc.doctor_id)}
                          className="bg-slate-900 text-white font-semibold px-6 py-2 rounded-xl hover:bg-teal-600 hover:shadow-md hover:shadow-teal-500/30 transition-all duration-300 flex items-center justify-center gap-1.5 text-sm group-active:scale-[0.98] w-[80%]"
                        >
                          View Profile <Stethoscope size={14} className="opacity-70 group-hover:opacity-100" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && (!filteredDoctors || filteredDoctors.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-slate-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Search size={28} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium text-lg">No specialists found matching these criteria.</p>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* --- SECTION 5: FOOTER --- */}
      <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 mt-24 mb-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-teal-700 tracking-tight">ProDoc</div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm font-light">
              ProDoc is Sri Lanka's first centralized platform for transparent healthcare.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="p-2.5 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-all duration-300 hover:-translate-y-1 border border-slate-100"><Facebook size={18} /></a>
              <a href="#" className="p-2.5 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-all duration-300 hover:-translate-y-1 border border-slate-100"><Instagram size={18} /></a>
              <a href="#" className="p-2.5 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-all duration-300 hover:-translate-y-1 border border-slate-100"><Linkedin size={18} /></a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4 text-sm">
              {['Find a Doctor', 'How it Works', 'Our Team', 'Reviews'].map((item) => (
                <li key={item}><a href="#" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all duration-300"></span>
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
                  <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all duration-300"></span>
                  {item}
                </a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm mb-8">
              <li className="flex items-center gap-3 text-slate-600">
                <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 border border-teal-100"><Mail size={18} /></div>
                <span className="font-medium">prdoc2025se06@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 border border-teal-100"><Phone size={18} /></div>
                <span className="font-medium">+94 74 279 7484</span>
              </li>
            </ul>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide">Are you a doctor?</p>
              <button className="w-full bg-slate-900 text-white px-4 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 transform active:scale-95">
                Join ProDoc Network
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            <span>All Systems Operational</span>
          </div>
          <p>© {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
        </div>
      </footer>
    </div >
  );
};

export default DoctorsPage;