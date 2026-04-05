import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    X,
    Award
} from 'lucide-react';
import DoctorRating from './components/DoctorRating';

const DoctorViewProfile = ({ doctorData, doctorId: propDoctorId, onBack, currentUser, onLogout, onNavigateLogin, onNavigateSignupPage, onNavigateDashboard }) => {
    // Robustly handle both full objects and just IDs for consistency
    const initialDoctor = (doctorData && typeof doctorData === 'object') ? doctorData : null;
    const doctorId = initialDoctor ? initialDoctor.doctor_id : (doctorData || propDoctorId);
    
    const [doctor, setDoctor] = useState(initialDoctor);
    const [profileLoading, setProfileLoading] = useState(!initialDoctor);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loginPromptType, setLoginPromptType] = useState(null);
    const [reviews, setReviews] = useState([]);

    const totalRatingsCount = reviews.length;

    useEffect(() => {
        if (loginPromptType) {
            const nav = document.querySelector('nav');
            if (nav) nav.style.display = 'none';
        } else {
            const nav = document.querySelector('nav');
            if (nav) nav.style.display = '';
        }
        return () => {
            const nav = document.querySelector('nav');
            if (nav) nav.style.display = '';
        }
    }, [loginPromptType]);

    const handleSaveClick = async () => {
        if (!currentUser || !currentUser.id) {
            setLoginPromptType('save');
            return;
        }

        try {
            const action = isSaved ? 'unsave' : 'save';
            const res = await fetch('/api/saved-doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: currentUser.id,
                    doctorId: doctorId,
                    action: action
                })
            });

            if (res.ok) {
                setIsSaved(action === 'save');
            }
        } catch (error) {
            console.error('Error saving doctor:', error);
        }
    };

    useEffect(() => {
        if (doctorId && currentUser && currentUser.id) {
            fetch('/api/saved-doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: currentUser.id,
                    doctorId: doctorId,
                    action: 'check'
                })
            })
                .then(res => res.json())
                .then(data => setIsSaved(data.isSaved))
                .catch(console.error);
        }
    }, [doctorId, currentUser]);

    const fetchDoctorData = async () => {
        setProfileLoading(true);
        setReviewsLoading(true);
        
        // Fetch Profile
        fetch(`/api/doctors?id=${doctorId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch doctor profile');
                return res.json();
            })
            .then(data => {
                setDoctor(data);
                setProfileLoading(false);
            })
            .catch(err => {
                console.error('Error fetching doctor profile:', err);
                setError(err.message);
                setProfileLoading(false);
            });

        // Fetch Reviews (Don't block profile)
        fetch(`/api/reviews?doctorId=${doctorId}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setReviews(data);
                setReviewsLoading(false);
            })
            .catch(err => {
                console.error('Error fetching reviews:', err);
                setReviewsLoading(false);
            });
    };

    const hasViewed = useRef(false);

    useEffect(() => {
        if (doctorId && !hasViewed.current) {
            hasViewed.current = true;
            fetchDoctorData();
            fetch(`/api/profile-views?doctorId=${doctorId}`, { method: 'POST' })
                .catch(err => {
                    console.error('Error recording view:', err);
                    hasViewed.current = false; // Reset on failure if needed
                });
        }
    }, [doctorId]);

    if (profileLoading && !doctor) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-4 text-slate-500 font-medium animate-pulse">Initializing profile...</p>
                </div>
            </div>
        );
    }

    if (error && !doctor) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-sm w-full">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-6 h-6 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
                    <p className="text-slate-500 mb-6 text-sm">The specialist profile you are looking for is unavailable.</p>
                    <button
                        onClick={onBack}
                        className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 selection:bg-teal-100 selection:text-teal-900">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-6">

                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-medium text-sm transition-colors"
                    >
                        <ChevronLeft size={18} />
                        Back to Specialists
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-6 space-y-6">

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-sm bg-slate-100 mb-4">
                                    {doctor.image_url ? (
                                        <img src={doctor.image_url} alt={doctor.full_name || doctor.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Stethoscope size={64} className="text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-1">{doctor.full_name || doctor.name}</h2>
                                <p className="text-teal-600 font-medium text-sm mb-4 font-bold">{doctor.specialty}</p>

                                <div className="flex flex-wrap items-center justify-center gap-2 mb-4 w-full">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 rounded-lg text-teal-700 text-xs font-bold border border-teal-100">
                                        <Globe size={14} className="text-teal-500" />
                                        {doctor.languages || 'Not Available'}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg text-blue-700 text-xs font-bold border border-blue-100">
                                        <Building2 size={14} className="text-blue-500" />
                                        {doctor.department_type || 'Not Available'}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-4 w-full border-t border-slate-100 pt-4">
                                    <button
                                        onClick={handleSaveClick}
                                        className={`flex-1 py-2.5 rounded-xl border transition-all text-sm font-medium ${isSaved
                                            ? 'bg-red-50 border-red-200 text-red-500'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Heart size={16} className={`inline mr-1.5 ${isSaved ? 'fill-current' : ''}`} /> Save
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            const shareData = {
                                                title: `ProDoc - ${doctor.full_name || doctor.name}`,
                                                text: `Check out ${doctor.full_name || doctor.name}, ${doctor.specialty} on ProDoc.`,
                                                url: window.location.href
                                            };
                                            try {
                                                if (navigator.share) {
                                                    await navigator.share(shareData);
                                                } else {
                                                    await navigator.clipboard.writeText(window.location.href);
                                                    alert('Profile link copied to clipboard!');
                                                }
                                            } catch (err) {
                                                console.error('Share failed:', err);
                                            }
                                        }}
                                        className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium"
                                    >
                                        <Share2 size={16} className="inline mr-1.5" /> Share
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Verified Professional</h4>
                                    <p className="text-xs text-slate-500 mt-1">SLMC ID: <span className="font-mono text-slate-700 font-bold">{doctor.slmcNumber}</span></p>
                                </div>
                            </div>

                            <div className="bg-teal-600 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-lg text-white p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>

                                <div className="relative z-10 w-full">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShieldCheck size={18} className="text-white drop-shadow-sm" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-white drop-shadow-sm">Second Opinion</span>
                                    </div>
                                    <h3 className="text-xl text-slate-900 font-bold mb-2 leading-tight drop-shadow-sm">Get Expert Advice</h3>
                                    <p className="text-slate-00 text-sm mb-5 leading-relaxed">
                                        Comprehensive review of your medical condition by {doctor.full_name || doctor.name}.
                                    </p>

                                    {doctor.second_opinion_available ? (
                                        <>
                                            <div className="bg-white rounded-xl p-3 border border-slate-700/50 flex items-center gap-3 mb-4">
                                                <Calendar size={18} className="text-teal-400" />
                                                <div>
                                                    <p className="text-[10px] text-teal-500 uppercase font-bold tracking-wider">Next Available</p>
                                                    <p className="text-sm text-slate-900 font-bold">{doctor.second_opinion_dates || 'Contact Clinic'}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    if (!currentUser || !currentUser.id) {
                                                        setLoginPromptType('analysis');
                                                    } else {
                                                        localStorage.setItem('initialPatientDashboardTab', 'secondOpinion');
                                                        if(onNavigateDashboard) onNavigateDashboard();
                                                    }
                                                }}
                                                className="w-full py-3 bg-white hover:bg-slate-200 text-teal-500 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-teal-900/20"
                                            >
                                                Request Analysis
                                            </button>
                                        </>
                                    ) : (
                                        <div className="p-3 bg-white rounded-xl border border-teal-500 text-center">
                                            <p className="text-xs text-teal-500 font-bold">Currently not accepting new requests.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-base font-bold text-slate-900 mb-4">Write a Review</h3>
                                <DoctorRating
                                    doctorId={doctorId}
                                    user={currentUser}
                                    doctorName={doctor?.full_name || doctor?.name}
                                    onNavigateLogin={onNavigateLogin}
                                    onNavigateSignup={onNavigateSignupPage}
                                    onRatingSubmit={() => fetchDoctorData(false)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-8">

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                    <Award className="text-teal-500 mb-2" size={20} />
                                    <span className="text-xs text-slate-500 font-semibold uppercase">Experience</span>
                                    <span className="text-xl font-bold text-slate-900">{doctor.years_of_experience}+</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                    <Star className="text-amber-400 fill-amber-400 mb-2" size={20} />
                                    <span className="text-xs text-slate-500 font-semibold uppercase">Rating</span>
                                    <span className="text-xl font-bold text-slate-900">{Number(doctor.average_rating || 0).toFixed(1)}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                                    <GraduationCap className="text-teal-500 mb-2" size={20} />
                                    <span className="text-xs text-slate-500 font-semibold uppercase">Education & Qualifications</span>
                                    <span className="text-sm font-bold text-slate-900 leading-snug mt-1">{doctor.educational_qualifications || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText size={22} className="text-teal-500" />
                                Professional Biography
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-base">
                                {doctor.bio || 'No biography details provided at this time.'}
                            </p>
                        </section>

                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Building2 size={22} className="text-teal-500" />
                                Hospital Affiliations
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {doctor.associated_hospitals && doctor.associated_hospitals.length > 0 ? (
                                    doctor.associated_hospitals.map((hospital, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                                <Building2 size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-semibold text-slate-900 text-sm truncate">{hospital.name || hospital}</h5>
                                                <p className="text-xs text-slate-500 truncate">{hospital.type || 'Affiliated Hospital'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm col-span-2 py-4 text-center">No affiliations listed.</p>
                                )}
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Star size={22} className="text-amber-400 fill-amber-400" />
                                    Ratings & Reviews
                                </h3>
                                <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                    {totalRatingsCount} Total Reviews
                                </span>
                            </div>

                            {reviewsLoading ? (
                                <div className="space-y-6 animate-pulse">
                                    <div className="h-40 bg-slate-50 rounded-2xl border border-slate-100"></div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-14 bg-slate-50 rounded-xl"></div>
                                        <div className="h-14 bg-slate-50 rounded-xl"></div>
                                        <div className="h-14 bg-slate-50 rounded-xl"></div>
                                    </div>
                                    <div className="h-32 bg-slate-50 rounded-2xl"></div>
                                </div>
                            ) : totalRatingsCount > 0 ? (
                                <>
                                    <div className="flex flex-col md:flex-row gap-8 mb-10">
                                        <div className="md:w-1/3 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm text-center">
                                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Overall Rating</h4>
                                            <div className="text-6xl font-black text-slate-900 mb-4">{Number(doctor.average_rating || 0).toFixed(1)}</div>
                                            <div className="flex gap-1.5 mb-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={24}
                                                        className={star <= Math.round(Number(doctor.average_rating || 0)) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">Based on {totalRatingsCount} patient ratings</p>
                                        </div>

                                        <div className="md:w-2/3 flex flex-col justify-center space-y-4 py-2">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = reviews.filter(r => Math.round(Number(r.overall)) === star).length;
                                                const percentage = totalRatingsCount > 0 ? (count / totalRatingsCount) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-4 group">
                                                        <div className="flex items-center gap-1.5 w-12 shrink-0 justify-end">
                                                            <span className="text-sm font-bold text-slate-700">{star}</span>
                                                            <Star size={14} className="fill-slate-400 text-slate-400 group-hover:fill-amber-400 group-hover:text-amber-400 transition-colors" />
                                                        </div>
                                                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="w-10 text-right text-sm font-medium text-slate-500">{count}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                        {['communication', 'punctuality', 'treatment_plan'].map((metric) => {
                                            const vals = reviews.map(r => Number(r[metric])).filter(n => !isNaN(n) && n > 0);
                                            const avg = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '-';
                                            const labelMap = {
                                                communication: 'Clear Communication',
                                                punctuality: 'Punctuality',
                                                treatment_plan: 'Treatment Planning'
                                            };
                                            return (
                                                <div key={metric} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-teal-200 transition-colors">
                                                    <span className="text-sm font-bold text-slate-600">{labelMap[metric]}</span>
                                                    <div className="flex items-center gap-1.5 bg-teal-50 px-2.5 py-1 rounded-lg">
                                                        <Star size={14} className="fill-teal-500 text-teal-500" />
                                                        <span className="text-sm font-black text-teal-700">{avg}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-100 pb-4">Recent Patient Feedback</h4>
                                        <div className="space-y-6">
                                            {reviews.map(review => (
                                                <div key={review.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                                                                {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'P'}
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-slate-900">{review.user_name || 'Verified Patient'}</h5>
                                                                <span className="text-xs font-medium text-slate-400">{new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={i < Math.round(Number(review.overall)) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {review.comment && (
                                                        <p className="text-slate-700 leading-relaxed mb-5 italic">
                                                            "{review.comment}"
                                                        </p>
                                                    )}

                                                    <div className="flex flex-wrap gap-2.5">
                                                        {[
                                                            { label: 'Communication', val: review.communication },
                                                            { label: 'Punctuality', val: review.punctuality },
                                                            { label: 'Treatment', val: review.treatment_plan }
                                                        ].filter(item => item.val).map((item, idx) => (
                                                            <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600">
                                                                <span>{item.label}</span>
                                                                <div className="w-px h-3 bg-slate-300"></div>
                                                                <span className="font-bold text-teal-600 flex items-center gap-1">
                                                                    {item.val} <Star size={10} className="fill-teal-600" />
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                                        <Star size={24} className="text-slate-300 fill-slate-100" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">No Reviews Yet</h4>
                                    <p className="text-slate-500 text-sm max-w-sm mx-auto">This specialist hasn't received any patient reviews. Be the first to share your experience!</p>
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            </div>

            {loginPromptType && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[150] flex items-start pt-24 justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setLoginPromptType(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            {loginPromptType === 'save' ? (
                                <Heart size={28} className="text-teal-600 fill-teal-100" />
                            ) : (
                                <ShieldCheck size={28} className="text-teal-600 fill-teal-100" />
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {loginPromptType === 'save' ? 'Save this Doctor?' : 'Login Required'}
                        </h3>
                        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                            {loginPromptType === 'save' 
                                ? 'Login to your account to save this profile to your favorites list.'
                                : 'Please login to your account to request a second opinion analysis.'}
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => { setLoginPromptType(null); onNavigateLogin && onNavigateLogin(); }}
                                className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setLoginPromptType(null); onNavigateSignupPage && onNavigateSignupPage(); }}
                                className="w-full bg-white text-slate-700 font-medium py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>, document.body
            )}
        </div>
    );
};

export default DoctorViewProfile;