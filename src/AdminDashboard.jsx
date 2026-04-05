import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, AlertTriangle,
    MessageSquare, Star, FileText, ArrowLeft, Loader2,
    Users, Stethoscope, Search, Trash2, LogOut, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = ({ onBack }) => {
    const [reviews, setReviews] = useState([]);
    const [directory, setDirectory] = useState({ users: [], doctors: [] });
    const [doctorRequests, setDoctorRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeHub, setActiveHub] = useState('moderation');
    const [filter, setFilter] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [popup, setPopup] = useState({ show: false, type: 'confirm', title: '', message: '', onConfirm: null });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [reviewsRes, directoryRes, requestsRes] = await Promise.all([
                fetch('/api/reviews'),
                fetch('/api/admin-directory'),
                fetch('/api/doctor-request')
            ]);

            if (!reviewsRes.ok || !directoryRes.ok || !requestsRes.ok) throw new Error('Data sync failed');

            const reviewsData = await reviewsRes.json();
            const directoryData = await directoryRes.json();
            const requestsData = await requestsRes.json();

            setReviews(reviewsData);
            setDirectory(directoryData);
            setDoctorRequests(requestsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            if (!res.ok) throw new Error('Failed to load reviews');
            const data = await res.json();
            setReviews(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const moderateReview = async (id, action) => {
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        try {
            setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            const res = await fetch('/api/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId: id, action })
            });
            if (!res.ok) throw new Error('Action failed');
        } catch (err) {
            console.error(err);
            fetchReviews();
            setPopup({
                show: true,
                type: 'error',
                title: 'Operation Failed',
                message: 'Failed to update review status. Please try again.'
            });
        }
    };
    const deleteUser = async (userId, type = 'user') => {
        setPopup({
            show: true,
            type: 'confirm',
            title: 'Authorize Deletion',
            message: `You are about to permanently remove this ${type} from the database. All associated historical records will be archived and hidden.`,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin-directory?userId=${userId}&type=${type}`, {
                        method: 'DELETE'
                    });
                    if (!res.ok) throw new Error('Deletion sequence failed');
                    fetchAllData();
                } catch (err) {
                    console.error(err);
                    setPopup({
                        show: true,
                        type: 'error',
                        title: 'Operation Conflict',
                        message: 'A system error occurred during deletion. The record remains intact.'
                    });
                }
            }
        });
    };

    const moderateDoctorRequest = async (id, action) => {
        try {
            setDoctorRequests(prev => prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r));
            const res = await fetch('/api/doctor-request', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });

            if (!res.ok) throw new Error('Action failed');
            if (action === 'approve') fetchAllData();
        } catch (err) {
            console.error(err);
            setPopup({
                show: true,
                type: 'error',
                title: 'Operation Failed',
                message: 'Failed to update doctor request status.'
            });
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchesFilter = filter === 'all' || review.status === filter;
        const matchesSearch = searchQuery === '' ||
            (review.user_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (review.doctor_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (review.comment || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const filteredUsers = (directory.users || []).filter(user =>
        searchQuery === '' ||
        (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.id || '').toString().includes(searchQuery) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDoctors = (directory.doctors || []).filter(doctor =>
        searchQuery === '' ||
        (doctor.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.id || '').toString().includes(searchQuery) ||
        (doctor.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.specialty || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
                <Loader2 className="animate-spin text-teal-600 mb-4" size={48} />
                <p className="text-slate-500 font-medium animate-pulse">Synchronizing Admin Hub...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans px-4 sm:px-6 md:px-12 lg:px-24 pt-32 md:pt-40 max-w-7xl mx-auto pb-24">
            <div className="mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <motion.button
                                onClick={onBack}
                                className="group flex items-center gap-2 text-red-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-red-600 transition-all"
                                whileHover={{ x: -4 }}
                            >
                                <LogOut size={14} />  Secure Log Out
                            </motion.button>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                            Admin <span className="text-teal-500">Control</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-xl">
                            {activeHub === 'moderation'
                                ? 'Review patient narratives and security flags to maintain system integrity.'
                                : activeHub === 'requests'
                                    ? 'Verify and approve medical professionals joining the ProDoc network.'
                                    : 'Comprehensive database of all registered platform members.'}
                        </p>
                    </div>

                    <div className="flex p-1.5 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 shrink-0">
                        {[
                            { id: 'moderation', label: 'Moderation Hub', icon: AlertTriangle },
                            { id: 'requests', label: 'Doctor Requests', icon: ShieldAlert },
                            { id: 'directory', label: 'Directory Hub', icon: FileText }
                        ].map(hub => (
                            <button
                                key={hub.id}
                                onClick={() => { setActiveHub(hub.id); setSearchQuery(''); }}
                                className={`flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all relative ${activeHub === hub.id
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <hub.icon size={16} />
                                {hub.label}
                                {hub.id === 'requests' && (doctorRequests || []).filter(r => r.status === 'pending').length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                                        {(doctorRequests || []).filter(r => r.status === 'pending').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
                {activeHub === 'moderation' && (
                    <div className="flex p-1.5 bg-white rounded-[2rem] border border-slate-100 shadow-sm w-full md:w-fit shrink-0">
                        {[
                            { id: 'pending', label: 'Pending' },
                            { id: 'rejected', label: 'Rejected' },
                            { id: 'approved', label: 'Approved' },
                            { id: 'all', label: 'All' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id)}
                                className={`px-6 py-2.5 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all ${filter === t.id
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/10'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {activeHub === 'moderation' ? (
                <div className="space-y-6">
                    {filteredReviews.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
                            <CheckCircle size={64} className="mx-auto text-teal-500 mb-6 opacity-20" />
                            <h3 className="text-xl font-black text-slate-900 mb-2">Queue Clear</h3>
                            <p className="text-slate-400 font-medium">No reviews require attention in this category.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredReviews.map((review) => (
                                <motion.div
                                    key={review.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/30 border border-slate-50 relative overflow-hidden group"
                                >
                                    <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] z-10 ${review.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                        review.status === 'approved' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {review.status}
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-10">
                                        <div className="flex-1 space-y-8">
                                            <div className="flex items-start gap-5">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-teal-600 font-black text-2xl border-2 border-white shadow-lg shrink-0">
                                                    {review.user_name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                                                        {review.user_name}
                                                    </h3>
                                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                                                        Reviewed <span className="text-slate-600">{review.doctor_name}</span>
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3 p-1.5 bg-slate-50 rounded-lg w-fit">
                                                        <Star size={12} className="fill-amber-400 text-amber-400" />
                                                        <span className="text-[10px] font-black text-slate-600">SCORE: {review.overall}/5</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 relative">
                                                {review.toxicity_score > 0.5 && (
                                                    <div className="absolute -top-3 right-6 bg-red-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter flex items-center gap-1.5 shadow-lg shadow-red-600/20">
                                                        <AlertTriangle size={10} /> High Toxicity Flag
                                                    </div>
                                                )}
                                                <p className="text-slate-600 leading-relaxed font-medium italic text-lg">
                                                    "{review.comment}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="lg:w-80 space-y-4">
                                            <div className="bg-slate-50 rounded-[2rem] h-48 flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden group/proof relative">
                                                {review.proof_url ? (
                                                    review.proof_url.startsWith('data:application/pdf') || review.proof_url.toLowerCase().endsWith('.pdf') ? (
                                                        <div className="flex flex-col items-center gap-3 text-teal-600">
                                                            <FileText size={48} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">PDF Document</span>
                                                        </div>
                                                    ) : (
                                                        <img 
                                                            src={review.proof_url} 
                                                            alt="Proof" 
                                                            className="w-full h-full object-cover group-hover/proof:scale-110 transition-transform duration-700" 
                                                            onError={(e) => {
                                                                // Fallback if image fails to load (e.g. invalid format)
                                                                e.target.parentElement.innerHTML = '<div class="text-slate-400"><FileText size={48} /></div>';
                                                            }}
                                                        />
                                                    )
                                                ) : (
                                                    <div className="text-center space-y-2 opacity-30">
                                                        <FileText size={32} className="mx-auto" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">No Proof Uploaded</span>
                                                    </div>
                                                )}
                                                <div 
                                                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/proof:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                                    onClick={() => {
                                                        if (review.proof_url) {
                                                            const newWindow = window.open();
                                                            if (newWindow) {
                                                                newWindow.document.write(`<iframe src="${review.proof_url}" width="100%" height="100%" style="border:none;"></iframe>`);
                                                            } else {
                                                                window.open(review.proof_url, '_blank');
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                        <Search size={14} /> Full View
                                                    </span>
                                                </div>
                                            </div>

                                            {review.status === 'pending' && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => moderateReview(review.id, 'reject')}
                                                        className="bg-white border-2 border-red-50 text-red-500 py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                    <button
                                                        onClick={() => moderateReview(review.id, 'approve')}
                                                        className="bg-teal-500 text-white py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle size={14} /> Approve
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            ) : activeHub === 'requests' ? (
                <div className="space-y-6">
                    {(doctorRequests || []).filter(r => r.status === 'pending').length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
                            <ShieldAlert size={64} className="mx-auto text-teal-500 mb-6 opacity-20" />
                            <h3 className="text-xl font-black text-slate-900 mb-2">No Pending Approvals</h3>
                            <p className="text-slate-400 font-medium">Any new doctor registration requests will appear here after verification.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {(doctorRequests || []).filter(r => r.status === 'pending').map((request) => (
                                <motion.div
                                    key={request.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/30 border border-slate-50 overflow-hidden relative"
                                >
                                    <div className="flex flex-col lg:flex-row gap-12">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-6 mb-8">
                                                 <div className="w-20 h-20 rounded-[1.5rem] bg-teal-50 flex items-center justify-center text-teal-600 font-black text-3xl border border-teal-100 shadow-sm shrink-0 uppercase overflow-hidden">
                                                     {request.image_url ? (
                                                         <img src={request.image_url} alt="Doctor" className="w-full h-full object-cover" />
                                                     ) : (
                                                         request.full_name?.[0] || 'D'
                                                     )}
                                                 </div>
                                                 <div>
                                                     <h3 className="text-2xl font-black text-slate-900 leading-tight">{request.full_name}</h3>
                                                     <p className="text-teal-600 font-bold text-xs uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                                         <ShieldCheck size={14} /> SLMC: {request.slmc_number}
                                                     </p>
                                                 </div>
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                                 <div className="space-y-1">
                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialty</span>
                                                     <p className="text-sm font-bold text-slate-700">{request.specialty}</p>
                                                 </div>
                                                 <div className="space-y-1">
                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</span>
                                                     <p className="text-sm font-bold text-slate-700">{request.department_type || 'N/A'}</p>
                                                 </div>
                                                 <div className="space-y-1">
                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
                                                     <p className="text-sm font-bold text-slate-700">{request.gender || 'N/A'}</p>
                                                 </div>
                                                 <div className="space-y-1">
                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</span>
                                                     <p className="text-sm font-bold text-slate-700">{request.years_of_experience} Years</p>
                                                 </div>
                                                 <div className="space-y-1">
                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualifications</span>
                                                     <p className="text-sm font-bold text-slate-700">{request.educational_qualifications}</p>
                                                 </div>
                                                 <div className="space-y-1">
                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Languages</span>
                                                     <p className="text-sm font-bold text-slate-700">{request.languages}</p>
                                                 </div>
                                                 <div className="space-y-1">
                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                                                     <p className="text-sm font-bold text-slate-700">{request.email}</p>
                                                 </div>
                                             </div>

                                            <div className="bg-slate-50/70 rounded-[2rem] p-6 border border-slate-100 mb-8">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Professional Bio</span>
                                                <p className="text-slate-600 font-medium leading-relaxed italic text-sm">
                                                    "{request.bio}"
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Affiliated Hospitals</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {(Array.isArray(request.associated_hospitals) 
                                                        ? request.associated_hospitals 
                                                        : JSON.parse(request.associated_hospitals || '[]')
                                                    ).map((hospital, idx) => (
                                                        <span key={idx} className="bg-white text-slate-600 px-4 py-2 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                            {hospital}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:w-72 flex flex-col justify-end gap-3">
                                            <button 
                                                onClick={() => moderateDoctorRequest(request.id, 'reject')}
                                                className="w-full bg-white border-2 border-red-50 text-red-500 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-3"
                                            >
                                                <XCircle size={18} /> Deny Onboarding
                                            </button>
                                            <button 
                                                onClick={() => moderateDoctorRequest(request.id, 'approve')}
                                                className="w-full bg-teal-500 text-white py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3"
                                            >
                                                <CheckCircle size={18} /> Approve Profile
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 shadow-sm border border-teal-100">
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 leading-none">User Registry</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                    {directory.users.length} Total Users
                                </p>
                            </div>
                        </div>

                        <div className="relative group w-full md:max-w-md">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search patients by name, email, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-100 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unique ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Identity</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Contact</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.length === 0 && filteredDoctors.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="opacity-20 mb-4 flex justify-center"><AlertTriangle size={48} /></div>
                                                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No matching records discovered</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {filteredUsers.map(user => (
                                                <tr key={`user-${user.id}`} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <span className="font-mono text-xs font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 italic">
                                                            #{user.id}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-white shadow-sm">
                                                                {user.full_name?.[0]}
                                                            </div>
                                                            <span className="font-black text-slate-900 uppercase text-xs tracking-tight group-hover:text-teal-600 transition-colors">
                                                                {user.full_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className="text-xs font-bold text-slate-500">
                                                            {user.email}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => deleteUser(user.id, 'user')}
                                                                className="p-2.5 bg-white rounded-xl border border-red-50 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-lg transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {filteredDoctors.length > 0 && (
                                                <tr className="bg-slate-50/20">
                                                    <td colSpan="4" className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100">Verified Doctors</td>
                                                </tr>
                                            )}

                                            {filteredDoctors.map(doctor => (
                                                <tr key={`doc-${doctor.id}`} className="group hover:bg-teal-50/20 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <span className="font-mono text-xs font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 italic">
                                                            #{doctor.id}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center font-black text-teal-600 border border-white shadow-sm">
                                                                {doctor.full_name?.[0]}
                                                            </div>
                                                            <div>
                                                                <span className="font-black text-slate-900 uppercase text-xs tracking-tight group-hover:text-teal-600 transition-colors block">
                                                                    {doctor.full_name}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-teal-600 uppercase tracking-tighter">{doctor.specialty}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className="text-xs font-bold text-slate-500">
                                                            {doctor.email}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => deleteUser(doctor.id, 'doctor')}
                                                                className="p-2.5 bg-white rounded-xl border border-red-50 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-lg transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            )}

            <AnimatePresence>
                {popup.show && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-10 text-center">
                                <div className={`w-20 h-20 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center ${popup.type === 'confirm' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                                    }`}>
                                    {popup.type === 'confirm' ? <AlertTriangle size={36} /> : <XCircle size={36} />}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">{popup.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{popup.message}</p>
                            </div>

                            <div className="flex border-t border-slate-50">
                                <button
                                    onClick={() => setPopup({ ...popup, show: false })}
                                    className="flex-1 py-6 font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                {popup.type === 'confirm' && (
                                    <button
                                        onClick={() => {
                                            popup.onConfirm?.();
                                            setPopup({ ...popup, show: false });
                                        }}
                                        className="flex-1 py-6 font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-l border-slate-50"
                                    >
                                        Execute Deletion
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
