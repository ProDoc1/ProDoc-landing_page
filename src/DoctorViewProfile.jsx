import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Star,
    Stethoscope,
    Building2,
    FileText,
    Calendar,
    ChevronLeft,
    Share2,
    Heart,
    ArrowLeft,
    Globe,
    CheckCircle2,
    MapPin,
    GraduationCap,
    X
} from 'lucide-react';
import DoctorRating from './components/DoctorRating';

const DoctorViewProfile = ({ doctorId, onBack, currentUser, onLogout, onNavigateLogin, onNavigateSignupPage }) => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [reviews, setReviews] = useState([]);

    // derived collections
    const ratingsOnly = reviews.filter(r => !r.comment || r.comment.trim() === '');
    const textReviews = reviews.filter(r => r.comment && r.comment.trim() !== '');
    const totalRatingsCount = reviews.length;
    const commentCount = textReviews.length;

    const shouldScrollRatings = ratingsOnly.length > 3;
    const shouldScrollReviews = textReviews.length > 3;

    const handleSaveClick = () => {
        if (!currentUser) {
            setShowLoginPrompt(true);
        } else {
            setIsSaved(!isSaved);
        }
    };

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                setLoading(true);
                const [profileResponse, reviewsResponse] = await Promise.all([
                    fetch(`/api/doctors?id=${doctorId}`),
                    fetch(`/api/reviews?doctorId=${doctorId}`)
                ]);

                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch doctor profile');
                }
                const profileData = await profileResponse.json();
                setDoctor(profileData);

                if (reviewsResponse.ok) {
                    const reviewsData = await reviewsResponse.json();
                    setReviews(reviewsData);
                }
            } catch (err) {
                console.error('Error fetching doctor data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (doctorId) fetchDoctorData();
    }, [doctorId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-teal-500 border-r-transparent mb-4"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-teal-500/20"></div>
                </div>
                <p className="text-slate-400 font-medium tracking-wide animate-pulse mt-4">Curating Profile Data...</p>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md border border-slate-100">
                    <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Specialist Not Found</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">The profile you are looking for might have been moved or is currently unavailable.</p>
                    <button
                        onClick={onBack}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-teal-600 transition-all flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-24 relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/20 blur-[120px] rounded-full animate-pulse duration-[8000ms]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse duration-[10000ms]"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-100/30 blur-[100px] rounded-full animate-pulse duration-[12000ms]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 md:pt-40">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-all mb-10 group"
                >
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:border-teal-200 group-hover:bg-teal-50 transition-all">
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="tracking-wide text-sm">Back to Specialists</span>
                </button>

                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                            <div className="absolute top-6 right-8 flex gap-3 z-30">
                                <button
                                    onClick={handleSaveClick}
                                    className={`p-3 bg-white/50 backdrop-blur border border-slate-200 rounded-2xl transition-all shadow-sm group ${isSaved
                                        ? 'text-red-500 border-red-200 bg-red-50'
                                        : 'text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                >
                                    <Heart size={20} className={`group-hover:scale-110 transition-transform ${isSaved ? 'fill-red-500' : ''}`} />
                                </button>
                                <button className="p-3 bg-white/50 backdrop-blur border border-slate-200 text-slate-400 rounded-2xl hover:border-teal-200 hover:text-teal-600 hover:bg-teal-50 transition-all shadow-sm group">
                                    <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
                                <div className="relative group">
                                    <div className="w-52 h-52 md:w-64 md:h-64 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                                        {doctor.image_url ? (
                                            <img src={doctor.image_url} alt={doctor.full_name || doctor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-teal-50 flex items-center justify-center">
                                                <Stethoscope size={80} className="text-teal-200" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-teal-500 rounded-3xl flex items-center justify-center text-white shadow-xl border-4 border-white z-20">
                                        <CheckCircle2 size={24} />
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-4">
                                        {doctor.full_name || doctor.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
                                        <span className=" text-teal-700 font-bold px-5 py-2 rounded-full text-[14px] tracking-wider uppercase border border-teal-100 flex items-center gap-3">
                                            <Stethoscope size={16} className="text-teal-500" />
                                            {doctor.specialty}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-slate-500 font-medium mb-4">
                                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                            <Globe size={18} className="text-teal-500" />
                                            <span className="text-sm">{doctor.languages || 'Not Available'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                            <MapPin size={18} className="text-teal-500" />
                                            <span className="text-sm">Colombo, Sri Lanka</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-slate-500 font-medium mb-4">
                                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                            <GraduationCap size={18} className="text-teal-500" />
                                            <span className="text-sm">{doctor.educational_qualifications || 'Not Available'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 p-2 relative z-10">
                                <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-100 rounded-[1.5rem] p-4 text-center group hover:bg-white hover:shadow-md transition-all">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                                    <p className="text-xl font-black text-teal-500">{doctor.years_of_experience}+</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Years</p>
                                </div>
                                <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-100 rounded-[1.5rem] p-4 text-center group hover:bg-white hover:shadow-md transition-all">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Rating</p>
                                    <div className="flex flex-col items-center justify-center mb-0.5">
                                        <div className="flex items-center justify-center gap-1.5 text-xl font-black text-slate-900">
                                            <Star size={16} className="fill-teal-400 text-teal-500" />
                                            {Number(doctor.average_rating || 0).toFixed(1)}
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{totalRatingsCount} Rating{totalRatingsCount !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-100 rounded-[1.5rem] p-4 text-center group hover:bg-white hover:shadow-md transition-all">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Practice</p>
                                    <p className="text-xl font-black text-teal-600 mb-0.5">{doctor.department_type}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Sector</p>
                                </div>
                            </div>
                        </div>

                        <section className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-teal-50 rounded-2xl text-teal-500">
                                    <FileText size={24} />
                                </div>
                                Professional Biography
                            </h3>
                            <div className="prose prose-slate max-w-none relative z-10">
                                <p className="text-slate-500 leading-relaxed text-lg font-medium opacity-90 italic">
                                    {doctor.bio || 'No biography details provided at this time.'}
                                </p>
                            </div>
                        </section>

                        <section className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                                <div className="p-3 bg-teal-50 rounded-2xl text-teal-500">
                                    <Building2 size={24} />
                                </div>
                                Hospital Affiliations
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {doctor.associated_hospitals && doctor.associated_hospitals.length > 0 ? (
                                    doctor.associated_hospitals.map((hospital, index) => (
                                        <div key={index} className="flex items-start gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-teal-50 hover:border-teal-100 transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                                <Building2 className="text-slate-400 group-hover:text-teal-500" size={20} />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-slate-900 mb-1 group-hover:text-teal-900">{hospital.name || hospital}</h5>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 group-hover:text-teal-600/60 uppercase tracking-widest">
                                                    <MapPin size={12} /> {hospital.type || 'Verified Institution'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 italic col-span-2 text-center py-10">No hospital affiliations listed.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-lg text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-30"></div>
                            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-100 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="text-green-500 shadow-sm" size={40} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">Verified Professional</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                                Credentials and SLMC registration have been thoroughly vetted for your safety.
                            </p>
                            <div className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                                <span>Registration ID</span>
                                <span className="text-slate-900 font-mono text-xs">{doctor.slmcNumber}</span>
                            </div>
                        </div>

                        <div className="sticky top-40 bg-teal-500 rounded-[3rem] p-8 text-white shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-900 rounded-full -mr-24 -mt-24 blur-[60px] group-hover:bg-teal-500/30 transition-all duration-700"></div>

                            <h3 className="text-3xl text-white font-bold mb-8 relative z-10 tracking-tight leading-tight">Expert Second Opinion</h3>
                            <p className="text-xs text-white leading-relaxed font-medium">
                                Receive a comprehensive review of your medical status and treatment plan from {(doctor.full_name || doctor.name || 'Doctor').split(' ').slice(0, 2).join(' ')}.
                            </p>

                            <div className="space-y-4 relative z-10 mt-6">
                                {doctor.second_opinion_available && (
                                    <div className="bg-white backdrop-blur-md rounded-[1.5rem] p-4 border border-white/10 shadow-inner">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-teal-500 rounded-xl text-white shadow-lg shadow-teal-500/20">
                                                <Calendar size={18} />
                                            </div>
                                            <div className="text-white">
                                                <p className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Availability</p>
                                                <p className="font-bold text-slate-900">{doctor.second_opinion_dates || 'Contact for details'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {doctor.second_opinion_available ? (
                                    <div className="space-y-3">
                                        <button className="w-full py-3.5 bg-white hover:bg-slate-100 text-teal-500 font-black text-base rounded-2xl transition-all shadow-xl shadow-teal-500/30 active:scale-95">
                                            Request Analysis
                                        </button>
                                        <div className="flex items-center justify-center gap-3 py-2.5 px-4">
                                            <ShieldCheck size={14} className="text-white" />
                                            <p className="text-[9px] font-black text-white uppercase tracking-widest">Secure Case Review</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 px-6 bg-white/5 rounded-[2.5rem] border border-white/50 shadow-inner">
                                        <p className="text-white font-medium italic text-sm">
                                            This specialist is currently at capacity and not accepting new second opinion requests.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating and Reviews Section */}
                <div className="mt-8 space-y-8">
                    

                    {/* two-card layout for ratings and reviews */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {ratingsOnly.length > 0 && (
                            <section className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-slate-100 relative ">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-500">
                                        <Star size={20} className="fill-teal-500" />
                                    </div>
                                    Patient Ratings ({ratingsOnly.length})
                                </h3>
                                <div
                                    className={`space-y-4 ${
                                        shouldScrollRatings
                                            ? 'max-h-[500px] overflow-y-auto'
                                            : ''
                                    }`}
                                >
                                    {ratingsOnly.map((review) => (
                                        <div key={review.id} className="p-4 bg-slate-50 rounded-xl border border-teal-500">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="text-slate-800">Verified User</h4>
                                                    <p className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-slate-100">
                                                    <span className="font-semibold text-slate-700">Communication:</span>
                                                    <span className="flex items-center gap-1 text-teal-600 font-bold">
                                                        <Star size={12} className="fill-teal-500" />
                                                        {review.communication || '--'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-slate-100">
                                                    <span className="font-semibold text-slate-700">Punctuality:</span>
                                                    <span className="flex items-center gap-1 text-teal-600 font-bold">
                                                        <Star size={12} className="fill-teal-500" />
                                                        {review.punctuality || '--'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-slate-100">
                                                    <span className="font-semibold text-slate-700">Treatment Plan:</span>
                                                    <span className="flex items-center gap-1 text-teal-600 font-bold">
                                                        <Star size={12} className="fill-teal-500" />
                                                        {review.treatment_plan || '--'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between bg-teal-100 p-2 rounded-lg border border-teal-150">
                                                    <span className="font-semibold text-slate-700">Overall Satisfaction:</span>
                                                    <span className="flex items-center gap-1 text-teal-700 font-bold">
                                                        <Star size={12} className="fill-teal-500" />
                                                        {review.overall || '--'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {textReviews.length > 0 && (
                            <section className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-slate-100 relative ">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-500">
                                        <Star size={20} className="fill-teal-500" />
                                    </div>
                                    Patient Reviews ({textReviews.length})
                                </h3>
                                <div
                                    className={`space-y-4 ${
                                        shouldScrollReviews
                                            ? 'max-h-[500px] overflow-y-auto'
                                            : ''
                                    }`}
                                >
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const group = textReviews.filter(r => Number(r.overall) === star);
                                        if (group.length === 0) return null;
                                        return (
                                            <div key={star} className="space-y-3">
                                                {group.map(review => (
                                                    <div key={review.id} className="p-4 bg-teal-100 rounded-xl border border-teal-200">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="text-slate-600">
                                                                <p className="font-medium">Verified User</p>
                                                                <p className="text-slate-400 text-[11px]">{new Date(review.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-slate-800 leading-relaxed text-sm font-semibold mb-3 bg-white p-3 rounded-lg border-l-4 border-teal-400">{review.comment}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                    <DoctorRating
                        doctorId={doctorId}
                        user={currentUser}
                        doctorName={doctor?.full_name || doctor?.name}
                        onNavigateLogin={onNavigateLogin}
                        onNavigateSignup={onNavigateSignupPage}
                    />
                </div>

                {/* Login Prompt Modal */}
                {showLoginPrompt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl relative">
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={36} className="text-red-500 fill-red-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Login Required</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                Please login or register to save doctors to your profile for easy access later.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => { setShowLoginPrompt(false); onNavigateLogin && onNavigateLogin(); }}
                                    className="w-full bg-teal-500 text-white font-bold py-4 rounded-xl hover:bg-teal-600 transition-colors shadow-lg active:scale-95"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { setShowLoginPrompt(false); onNavigateSignupPage && onNavigateSignupPage(); }}
                                    className="w-full bg-slate-50 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 active:scale-95"
                                >
                                    Register Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorViewProfile;
