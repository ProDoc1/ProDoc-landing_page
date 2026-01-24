import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Filter,
  Stethoscope
} from 'lucide-react';

const DoctorsPage = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM POSTGRES ---
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
  }, []);

  const categories = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Orthopedic Surgery'];

  // Match database column names (full_name, specialty)
  const filteredDoctors = doctors.filter(doc => 
    (activeFilter === 'All' || doc.specialty === activeFilter) &&
    doc.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0F8F8] p-4 md:p-8 pt-24 font-sans">
      {/* Header Area */}
      <div className="max-w-6xl mx-auto mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-teal-700 font-bold mb-6 hover:translate-x-1 transition-transform"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Find a Specialist</h1>
            <p className="text-slate-500">Verified medical professionals in Sri Lanka</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="max-w-6xl mx-auto mb-10 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeFilter === cat 
              ? 'bg-teal-50 text-white shadow-lg shadow-teal-500/30' 
              : 'bg-white text-slate-600 hover:bg-teal-50 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading verified profiles...</p>
        </div>
      ) : (
        /* Results Grid */
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doc => (
            <div key={doc.doctor_id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-teal-900/5 transition-all group">
              <div className="flex gap-4 mb-6">
                <div className="relative">
                  {/* Default avatar since we don't have images for 50 doctors yet */}
                  <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner">
                    <Stethoscope size={32} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                    <ShieldCheck className="text-teal-500" size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors">{doc.full_name}</h3>
                  <p className="text-teal-600 text-sm font-bold">{doc.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-slate-700">4.9</span>
                    <span className="text-xs text-slate-400">(Verified)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <MapPin size={16} className="text-teal-500" />
                  <span>{doc.working_hospital}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Clock size={16} className="text-teal-500" />
                  <span>Experience: {doc.years_of_experience} Years</span>
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-teal-600 transition-all transform active:scale-95 flex items-center justify-center gap-2">
                Book Appointment <Stethoscope size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredDoctors.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No doctors found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;