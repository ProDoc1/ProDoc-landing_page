import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, AlertTriangle,
    MessageSquare, Star, FileText, ArrowLeft, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = ({ onBack }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            if (!res.ok) throw new Error('Failed to load reviews');
            const data = await res.json();
            setReviews(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const moderateReview = async (id, action) => {
        try {
            // Optimistic update
            setReviews(prev => prev.filter(r => r.id !== id));

            const res = await fetch('/api/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId: id, action })
            });

            if (!res.ok) throw new Error('Action failed');

            // Could show toast success here

        } catch (err) {
            console.error(err);
            fetchReviews(); // Revert on failure
            alert('Failed to update review status');
        }
    };

    const filteredReviews = reviews.filter(review => {
        if (filter === 'all') return true;
        if (filter === 'pending') return review.status === 'pending';
        if (filter === 'rejected') return review.status === 'rejected';
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
                <Loader2 className="animate-spin text-teal-600 mb-4" size={48} />
                <p className="text-slate-500 font-medium animate-pulse">Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans px-4 sm:px-6 md:px-12 lg:px-24 pt-32 md:pt-40 max-w-7xl mx-auto">
            <div className="mb-8 md:mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <motion.button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider hover:text-teal-700 transition-all w-fit"
                            whileHover={{ x: -4 }}
                        >
                            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Home
                        </motion.button>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Moderation <span className="text-teal-500">Dashboard</span></h1>
                        <p className="text-slate-500 text-sm md:text-base font-medium">Review pending user submissions and toxicity flags.</p>
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 w-fit">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-900 leading-none">{reviews.length}</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Active Entries</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs - Scrollable on Mobile */}
            <div className="mb-8 -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-2 min-w-full overflow-x-auto pb-2 scrollbar-hide md:overflow-visible md:pb-0">
                    <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                        {[
                            { id: 'all', label: 'All Activity', count: reviews.length },
                            { id: 'pending', label: 'Pending', count: reviews.filter(r => r.status === 'pending').length },
                            { id: 'rejected', label: 'Rejected', count: reviews.filter(r => r.status === 'rejected').length }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${filter === tab.id
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                                    : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-md text-[10px] ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-8 md:p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="bg-slate-50 p-5 rounded-full mb-6 text-slate-400">
                        <AlertTriangle size={40} className="md:w-[48px] md:h-[48px]" />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">No {filter} reviews</h3>
                    <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto font-medium">There are no reviews matching the selected filter.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence>
                        {filteredReviews.map((review) => (
                            <motion.div
                                key={review.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow"
                            >
                                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[9px] md:text-[10px] uppercase font-black tracking-widest z-10 ${review.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                    review.status === 'approved' ? 'bg-teal-50 text-teal-600' :
                                        review.toxicity_score > 0.5 ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {review.status === 'rejected' ? 'Auto-Rejected' :
                                        review.status === 'approved' ? 'Approved' : 'Pending Verification'}
                                </div>

                                <div className="flex flex-col lg:flex-row gap-8">

                                    {/* Left: User & Content */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-lg md:text-xl uppercase shrink-0 border border-slate-200">
                                                {review.user_name?.[0] || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-black text-base md:text-lg text-slate-900 flex flex-wrap items-center gap-x-2 gap-y-1">
                                                    <span className="truncate max-w-[150px] md:max-w-none">{review.user_name || 'Verified User'}</span>
                                                    <span className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-tighter">reviewed</span>
                                                    <span className="text-teal-600 truncate max-w-[150px] md:max-w-none">{review.doctor_name}</span>
                                                </h3>
                                                <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                                    {new Date(review.created_at).toLocaleDateString()} • {new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative">
                                            {/* Toxicity Warning */}
                                            {review.toxicity_score > 0.5 && (
                                                <div className="absolute -top-3 right-4 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-red-200">
                                                    <AlertTriangle size={12} /> Toxic Flag: {(review.toxicity_score * 100).toFixed(0)}%
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-700">
                                                <MessageSquare size={16} className="text-slate-400" />
                                                User Comment:
                                            </div>
                                            <p className="text-slate-600 leading-relaxed italic">
                                                "{review.comment || (
                                                    <span className="text-slate-400 not-italic">No written comment provided.</span>
                                                )}"
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {Object.entries({
                                                'Overall': review.overall,
                                                'Communication': review.communication,
                                                'Punctuality': review.punctuality,
                                                'Treatment': review.treatment_plan
                                            }).map(([key, val]) => (
                                                <div key={key} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl shadow-sm group/score hover:bg-white hover:border-teal-100 transition-all">
                                                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-tighter group-hover/score:text-teal-600">{key}</span>
                                                    <div className="flex items-center gap-0.5 text-amber-500 font-black text-xs">
                                                        <Star size={10} className="fill-amber-500" /> {val}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Proof & Actions */}
                                    <div className="lg:w-80 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                        <div className="bg-slate-50 rounded-2xl p-1 flex items-center justify-center border border-slate-200 min-h-[160px] relative group overflow-hidden">
                                            {review.proof_url ? (
                                                review.proof_url.startsWith('data:image') ? (
                                                    <img
                                                        src={review.proof_url}
                                                        alt="Proof of visit"
                                                        className="w-full h-40 object-cover rounded-xl transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                                                        onClick={() => {
                                                            // Simple image preview logic could go here
                                                            const w = window.open("");
                                                            w.document.write(`<img src="${review.proof_url}" style="max-width:100%"/>`);
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-slate-400 p-8 text-center">
                                                        <FileText size={32} />
                                                        <span className="text-xs font-medium">PDF Document</span>
                                                        <a href={review.proof_url} target="_blank" rel="noreferrer" className="text-teal-600 text-xs font-bold hover:underline">View Document</a>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="text-slate-400 text-xs font-medium flex flex-col items-center gap-2">
                                                    <AlertTriangle size={24} className="text-amber-400" />
                                                    No Proof Uploaded
                                                </div>
                                            )}
                                            {review.proof_url && (
                                                <div className="absolute bottom-2 right-2 bg-white text-teal-500 text-[10px] px-2 py-1 rounded backdrop-blur-sm font-bold border-teal-500 border-2">
                                                    Click to Verify
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-row sm:flex-row gap-3 mt-auto">
                                            <button
                                                onClick={() => moderateReview(review.id, 'reject')}
                                                className="flex-1 bg-white border border-red-100 text-red-600 py-3.5 rounded-2xl font-black hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-sm"
                                            >
                                                <XCircle size={16} /> Reject
                                            </button>
                                            <button
                                                onClick={() => moderateReview(review.id, 'approve')}
                                                className="flex-1 bg-teal-500 text-white py-3.5 rounded-2xl font-black hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-md active:scale-95 border border-teal-400"
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
