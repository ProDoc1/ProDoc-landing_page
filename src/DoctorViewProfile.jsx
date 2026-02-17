import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    MapPin,
    Star,
    Clock,
    Stethoscope,
    Building2,
    Award,
    FileText,
    Calendar,
    ChevronLeft,
    Share2,
    Heart,
    Mail,
    Phone,
    ArrowLeft
} from 'lucide-react';
import Navbar from './components/Navbar';
import Plasma from './components/Plasma';

const DoctorViewProfile = ({ doctorId, onBack, currentUser, onLogout }) => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/get-doctor-profile?id=${doctorId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch doctor profile');
                }
                const data = await response.json();
                setDoctor(data);
            } catch (err) {
                console.error('Error fetching doctor profile:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (doctorId) {
            fetchDoctorProfile();
        }
    }, [doctorId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 border-r-transparent mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading specialist profile...</p>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-md border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
                    <p className="text-slate-500 mb-8">{error || 'The specialist you are looking for could not be found.'}</p>
                    <button
                        onClick={onBack}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
            {/* Background Effect */}
            <div className="fixed inset-0 z-0 h-screen w-screen opacity-30 pointer-events-none">
                <Plasma color="#0f766e" speed={0.2} scale={1.5} opacity={0.4} />
            </div>

            <div className="relative z-10">
                {/* Navigation / Header */}
                <div className="max-w-6xl mx-auto px-4 pt-32 md:pt-36 mb-8">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 font-semibold rounded-full px-6 py-2.5 shadow-sm hover:shadow-md hover:border-teal-300 hover:text-teal-700 transition-all mb-8"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>

                    {/* Main Profile Card */}
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-white relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                                {/* Profile Image */}
                                <div className="relative">
                                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-[2.5rem] bg-teal-50 border-4 border-slate-50 overflow-hidden shadow-2xl relative z-10">
                                        {doctor.image_url ? (
                                            <img
                                                src={doctor.image_url}
                                                alt={doctor.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Stethoscope size={64} className="text-teal-200" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white z-20">
                                        <ShieldCheck size={20} />
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                                                {doctor.full_name}
                                            </h1>
                                            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                                                <span className="bg-teal-50 text-teal-700 font-bold px-4 py-1.5 rounded-full text-sm border border-teal-100 flex items-center gap-2">
                                                    <Stethoscope size={14} /> {doctor.specialty}
                                                </span>
                                                <span className="bg-slate-50 text-slate-500 font-medium px-4 py-1.5 rounded-full text-sm border border-slate-100 flex items-center gap-2">
                                                    <Award size={14} /> SLMC: {doctor.slmc_number}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-center md:justify-start">
                                            <button className="p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors border border-slate-100 shadow-sm group">
                                                <Heart size={20} className="group-active:scale-125 transition-transform" />
                                            </button>
                                            <button className="p-3 bg-slate-50 rounded-2xl hover:bg-teal-50 hover:text-teal-600 transition-colors border border-slate-100 shadow-sm">
                                                <Share2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                                            <p className="text-xl font-bold text-slate-900">{doctor.years_of_experience} Years</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                                            <div className="flex items-center gap-1.5">
                                                <Star size={18} className="fill-amber-400 text-amber-400" />
                                                <p className="text-xl font-bold text-slate-900">4.9</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sector</p>
                                            <p className="text-xl font-bold text-teal-600">{doctor.department_type}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verified</p>
                                            <div className="flex items-center gap-1.5 text-green-600">
                                                <ShieldCheck size={18} />
                                                <p className="text-lg font-bold">Yes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-12 mt-16 pt-16 border-t border-slate-100">
                                {/* Left Column: Bio & Experience */}
                                <div className="lg:col-span-2 space-y-12">
                                    <section>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                            <FileText className="text-teal-500" /> Professional Bio
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-lg font-light">
                                            {doctor.bio || 'No biography details provided.'}
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                            <Building2 className="text-teal-500" /> Hospital Affiliations
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-teal-50 border border-teal-100 p-6 rounded-[2rem] flex items-center justify-between group hover:border-teal-300 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-teal-600 border border-teal-50">
                                                        <Building2 size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-0.5">Primary Hospital</p>
                                                        <h4 className="text-xl font-bold text-slate-900">{doctor.working_hosptial || doctor.working_hospital || 'National Hospital'}</h4>
                                                    </div>
                                                </div>
                                                <span className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-slate-500 border border-teal-50">Working Now</span>
                                            </div>

                                            {doctor.associated_hospitals && doctor.associated_hospitals.length > 0 && (
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {doctor.associated_hospitals.map((hospital, index) => (
                                                        <div key={index} className="bg-slate-50 border border-slate-100 p-5 rounded-3xl flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                                                <Building2 size={18} />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-slate-800">{hospital.name || hospital}</h5>
                                                                <p className="text-xs text-slate-500 font-medium">{hospital.type || 'Affiliated'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Actions & Contact */}
                                <div className="space-y-8">
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                        <h3 className="text-2xl font-bold mb-6 relative z-10">Second Opinion</h3>
                                        <div className="space-y-4 relative z-10">
                                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                                                <Calendar className="text-teal-400" size={24} />
                                                <div>
                                                    <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Availability</p>
                                                    <p className="font-bold">{doctor.availability || 'Not Available'}</p>
                                                </div>
                                            </div>
                                            <button className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-teal-900/40 hover:scale-[1.02] active:scale-[0.98]">
                                                Request Second Opinion
                                            </button>
                                            <p className="text-center text-xs text-slate-400 font-medium">Verified patients only</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
                                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <Clock size={18} className="text-teal-500" /> Working Hours
                                        </h3>
                                        <ul className="space-y-4">
                                            <li className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Mon - Fri</span>
                                                <span className="font-bold text-slate-900">04:00 PM - 08:00 PM</span>
                                            </li>
                                            <li className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Saturday</span>
                                                <span className="font-bold text-slate-900">09:00 AM - 01:00 PM</span>
                                            </li>
                                            <li className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Sunday</span>
                                                <span className="text-red-400 font-bold uppercase text-[10px]">Closed</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorViewProfile;
