import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, AlertTriangle,
    MessageSquare, User, Star, FileText, ArrowLeft, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = ({ onBack }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
                <Loader2 className="animate-spin text-teal-600 mb-4" size={48} />
                <p className="text-slate-500 font-medium animate-pulse">Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8 pt-24 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-4 font-bold text-sm group transition-colors"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Moderation Dashboard</h1>
                    <p className="text-slate-500 mt-1">Review pending user submissions and toxicity flags.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="font-bold text-slate-700 text-sm">{reviews.length} Pending Actions</span>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="bg-green-50 p-6 rounded-full mb-6 text-green-500">
                        <CheckCircle size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
                    <p className="text-slate-500 max-w-md mx-auto">There are no pending reviews in the queue. New submissions requiring moderation will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence>
                        {reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow"
                            >
                                {/* Status Badge */}
                                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] uppercase font-bold tracking-wider ${review.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                    review.toxicity_score > 0.5 ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {review.status === 'rejected' ? 'Auto-Rejected' : 'Pending Review'}
                                </div>

                                <div className="flex flex-col lg:flex-row gap-8">

                                    {/* Left: User & Content */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl uppercase shrink-0">
                                                {review.user_name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                                    {review.user_name || 'Anonymous User'}
                                                    <span className="text-slate-400 font-normal text-sm">reviewed</span>
                                                    <span className="text-teal-600">{review.doctor_name}</span>
                                                </h3>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                    Submitted on {new Date(review.created_at).toLocaleDateString()} at {new Date(review.created_at).toLocaleTimeString()}
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

                                        <div className="flex flex-wrap gap-4">
                                            {Object.entries({
                                                'Overall': review.overall,
                                                'Communication': review.communication,
                                                'Punctuality': review.punctuality,
                                                'Treatment': review.treatment_plan,
                                                'Professionalism': review.professionalism
                                            }).map(([key, val]) => (
                                                <div key={key} className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{key}</span>
                                                    <div className="flex items-center gap-0.5 text-amber-500 font-bold text-sm">
                                                        <Star size={12} className="fill-amber-500" /> {val}
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
                                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-bold">
                                                    Click to Verify
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={() => moderateReview(review.id, 'reject')}
                                                className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                                            >
                                                <XCircle size={18} /> Reject
                                            </button>
                                            <button
                                                onClick={() => moderateReview(review.id, 'approve')}
                                                className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-95"
                                            >
                                                <CheckCircle size={18} /> Approve
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
