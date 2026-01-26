import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, MapPin, Star, ShieldCheck, 
  Clock, Stethoscope, Facebook, Instagram, 
  Linkedin, Mail, Phone, Filter, ChevronDown, 
  X
} from 'lucide-react';
import LogoWithWords from './assets/Logo_with_words.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const DoctorsPage = ({ onBack }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    specialty: 'All',
    hospitalSearch: '',
    gender: 'All',
    availability: 'Both' // Default set to Both
  });

  const specRef = useRef(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/get-doctors');
        const data = await response.json();
        setDoctors(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load doctors:", error);
        setLoading(false);
      }
    };
    fetchDoctors();

    const handleClickOutside = (e) => {
      if (specRef.current && !specRef.current.contains(e.target)) setIsSpecOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const specialties = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Orthopedic Surgeon', 'General Surgeon'];

  const filteredDoctors = doctors.filter(doc => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = searchLower === '' || 
                         doc.full_name.toLowerCase().includes(searchLower) ||
                         doc.specialty.toLowerCase().includes(searchLower);
    
    const matchesSpecialty = filters.specialty === 'All' || doc.specialty === filters.specialty;
    
    const hospitalLower = filters.hospitalSearch.toLowerCase().trim();
    const matchesHospital = hospitalLower === '' || 
                           doc.working_hospital.toLowerCase().includes(hospitalLower);

    const matchesAvailability = filters.availability === 'Both' || 
                               doc.sector === filters.availability;

    return matchesSearch && matchesSpecialty && matchesHospital && matchesAvailability;
  });

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'ig');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-teal-600 font-bold bg-teal-50 rounded">{part}</span>
      ) : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F8F8] p-4 md:p-8 pt-32 md:pt-36 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex flex-col gap-4">
            <motion.button 
              onClick={onBack}
              className="flex items-center gap-2 bg-white text-teal-700 font-bold rounded-full px-5 py-2.5 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all w-fit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} /> Back to Home
            </motion.button>
            <h1 className="text-3xl font-bold text-slate-900">Find a Specialist</h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-10 shadow-sm focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-36 z-40"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Filter size={18} className="text-teal-600" /> Filters
                </h2>
                <button 
                  onClick={() => {
                    setFilters({ specialty: 'All', hospitalSearch: '', gender: 'All', availability: 'Both' });
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-teal-600 hover:underline"
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
                    className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-teal-500 transition-all"
                  >
                    <span className={filters.specialty === 'All' ? 'text-slate-400' : 'text-teal-700 font-bold'}>
                      {filters.specialty === 'All' ? 'Select Specialty' : filters.specialty}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isSpecOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isSpecOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                      >
                        {specialties.map((spec) => (
                          <button
                            key={spec}
                            onClick={() => {
                              setFilters({...filters, specialty: spec});
                              setIsSpecOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-teal-50 ${
                              filters.specialty === spec ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600'
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
              <div className="mb-8">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <MapPin size={14} /> Hospital
                </h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search Hospital"
                    value={filters.hospitalSearch}
                    onChange={(e) => setFilters({...filters, hospitalSearch: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                  />
                </div>
              </div>

              {/* Sector (Formerly Availability) */}
              <div className="mb-8">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Sector</h4>
                <div className="flex flex-col gap-2">
                  {['Both', 'Government', 'Private'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilters({...filters, availability: option})}
                      className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.availability === option ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500' : 'text-slate-500 hover:bg-slate-50'
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
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['All', 'Male', 'Female'].map(g => (
                    <button
                      key={g}
                      onClick={() => setFilters({...filters, gender: g})}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        filters.gender === g ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500'
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
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500"></div>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode='popLayout'>
                  {filteredDoctors.map(doc => (
                    <motion.div
                      key={doc.doctor_id}
                      layout
                      variants={itemVariants}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 group flex flex-col justify-between h-full"
                    >
                      <div>
                        <div className="flex gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                            <Stethoscope size={28} />
                          </div>
                          <div className="flex-1">
                            {/* Aligned Name and Rating */}
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                  {highlightMatch(doc.full_name, searchQuery)}
                                </h3>
                                <div className="flex items-center gap-1 shrink-0">
                                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-bold text-slate-700">4.9</span>
                                </div>
                            </div>
                            <p className="text-teal-600 text-xs font-bold uppercase tracking-wider mt-1">{doc.specialty}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <MapPin size={14} className="text-teal-500" />
                            <span>{doc.working_hospital}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <Clock size={14} className="text-teal-500" />
                            <span>{doc.years_of_experience} Years Experience</span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-teal-600 transition-all flex items-center justify-center gap-2 text-sm mt-auto">
                        View Profile <Stethoscope size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && filteredDoctors.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200"
              >
                <p className="text-slate-400 font-medium">No specialists found matching these criteria.</p>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 pt-60 mt-20">
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
                  {['Find a Doctor', 'How it Works', 'Our Team', 'Reviews'].map((item) => (
                      <li key={item}><a href="#" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                        <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
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
                        <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                        {item}
                      </a></li>
                  ))}
                </ul>
            </div>

            <div className="md:col-span-4">
                <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contact</h4>
                <ul className="space-y-4 text-sm mb-8">
                  <li className="flex items-center gap-3 text-slate-600">
                      <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Mail size={18} /></div>
                      <span>prdoc2025se06@gmail.com</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                      <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Phone size={18} /></div>
                      <span>+94 76 793 7055</span>
                  </li>
                </ul>
          
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide">Are you a doctor?</p>
                  <button className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all transform active:scale-95">
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
            <p>© {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};

export default DoctorsPage;