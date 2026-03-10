import React, { useState, useRef } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, Upload, FileText, X } from 'lucide-react';

const RatingCategory = ({ label, value, onChange }) => {
    return (
        <div className="flex flex-col gap-1.5 mb-4 items-center">
            <label className="text-sm font-bold text-slate-700">{label}</label>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                        type="button"
                    >
                        <Star
                            size={28}
                            className={`${star <= value
                                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                : 'fill-slate-100 text-slate-200 hover:text-amber-200'
                                } transition-colors duration-200`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

const DoctorRating = ({ doctorId, user, doctorName, onNavigateLogin, onNavigateSignup, onRatingSubmit }) => {
    const fileInputRef = useRef(null);
    const [ratings, setRatings] = useState({
        communication: 0,
        punctuality: 0,
        treatmentPlan: 0,
        overall: 0
    });

    const [comment, setComment] = useState('');
    const [proofFile, setProofFile] = useState(null); // base64 string
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'pending-approval'
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrorMessage('File size too large. Please upload an image under 5MB.');
                return;
            }
            setFileName(file.name);

            const reader = new FileReader();
            reader.onloadend = () => {
                setProofFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setProofFile(null);
        setFileName('');
        setComment('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRatingChange = (category, value) => {
        setRatings(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (Object.values(ratings).some(val => val === 0)) {
            setSubmitStatus('error');
            setErrorMessage('Please rate all categories before submitting.');
            return;
        }

        if (comment.trim().length > 0 && !proofFile) {
            setSubmitStatus('error');
            setErrorMessage('Proof of visit (receipt or appointment slip) is required to submit a written review.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrorMessage('');

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorId,
                    userId: user.id || user.uid,
                    userName: user.name || user.displayName || 'Verified User',
                    ratings,
                    comment,
                    proof: proofFile // Send base64 image
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit rating');
            }

            if (data.status === 'pending') {
                setSubmitStatus('pending-approval');
            } else {
                setSubmitStatus('success');
            }

            if (onRatingSubmit) {
                onRatingSubmit();
            }

            // Reset form after delay
            setTimeout(() => {
                setRatings({
                    communication: 0,
                    punctuality: 0,
                    treatmentPlan: 0,
                    overall: 0
                });
                setComment('');
                setProofFile(null);
                setFileName('');
                // setSubmitStatus(null); // Keep status visible a bit longer or until user navigates
            }, 5000);

        } catch (err) {
            console.error('Error submitting rating:', err);
            setSubmitStatus('error');
            setErrorMessage(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative">
            <div className="relative z-10 w-full">
                {!user ? (
                    <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                        <h4 className="text-sm font-bold text-teal-600 mb-2">Login to Rate</h4>
                        <p className="text-xs text-slate-500 mb-6 px-4">
                            Please login or register to share your review and help other patients.
                        </p>
                        <div className="flex flex-col gap-3 px-6">
                            <button
                                type="button"
                                onClick={onNavigateLogin}
                                className="bg-teal-500 text-white text-sm font-bold py-2.5 px-4 rounded-xl hover:bg-teal-600 transition-colors shadow-sm active:scale-95"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={onNavigateSignup}
                                className="bg-white text-slate-700 text-sm font-bold py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm active:scale-95"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                ) : localStorage.getItem('userRole') === 'doctor' ? (
                    <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                        <h4 className="text-sm font-bold text-slate-500 mb-2">Doctors Cannot Rate</h4>
                        <p className="text-xs text-slate-400 px-4">
                            Doctor accounts are restricted from rating or reviewing specialists.
                        </p>
                    </div>
                ) : submitStatus === 'success' || submitStatus === 'pending-approval' ? (
                    <div className={`rounded-2xl p-6 text-center animate-fade-in border ${submitStatus === 'success' ? 'bg-green-50 border-green-100' : 'bg-teal-50 border-teal-100'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${submitStatus === 'success' ? 'bg-green-100 text-green-600' : 'bg-teal-100 text-teal-600'}`}>
                            <CheckCircle2 size={24} />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">Submitted Successfully!</h4>
                        <p className="text-xs text-slate-600">
                            Your rating has been published.
                            {submitStatus === 'pending-approval' && ' Written review pending admin verification.'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full">

                        {submitStatus === 'error' && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 flex items-center gap-2 text-xs font-medium border border-red-100">
                                <AlertCircle size={16} />
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex flex-col gap-2 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                            <RatingCategory
                                label="Communication"
                                value={ratings.communication}
                                onChange={(val) => handleRatingChange('communication', val)}
                            />
                            <RatingCategory
                                label="Punctuality"
                                value={ratings.punctuality}
                                onChange={(val) => handleRatingChange('punctuality', val)}
                            />
                            <RatingCategory
                                label="Treatment Plan"
                                value={ratings.treatmentPlan}
                                onChange={(val) => handleRatingChange('treatmentPlan', val)}
                            />
                            <RatingCategory
                                label="Overall Satisfaction"
                                value={ratings.overall}
                                onChange={(val) => handleRatingChange('overall', val)}
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 mb-6">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-800 mb-1">
                                    Want to write a review?
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Upload proof of your visit (like a receipt) to unlock the written review section. Star ratings can be submitted without proof.
                                </p>
                                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all group cursor-pointer bg-slate-50">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center gap-1.5 relative z-20 pointer-events-none">
                                        {proofFile ? (
                                            <div className="flex flex-col items-center gap-2 group/file animate-fade-in pointer-events-auto w-full">
                                                <div className="text-teal-700 text-xs font-bold flex items-center gap-1.5 bg-teal-100 px-3 py-1.5 rounded-lg max-w-full overflow-hidden">
                                                    <CheckCircle2 size={14} className="shrink-0" />
                                                    <span className="truncate">{fileName}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleRemoveFile();
                                                    }}
                                                    className="text-xs text-red-500 font-medium hover:text-red-700 z-30 pointer-events-auto"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={20} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                                                <span className="text-xs text-slate-500 group-hover:text-teal-600 font-medium whitespace-nowrap">Upload Receipt</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {proofFile && (
                                <div className="mb-4 animate-fade-in bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                                    <label className="block text-sm font-bold text-slate-800 mb-2">Written Review <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-teal-500 ring-1 ring-transparent focus:ring-teal-500 transition-all min-h-[100px] resize-y"
                                        placeholder="Share detailed feedback about your experience..."
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`
                                    w-full py-3 rounded-xl font-bold text-white shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                                    ${isSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}
                                `}
                            >
                                {isSubmitting ? 'Submitting...' : (proofFile ? 'Submit Rating & Review' : 'Submit Rating')} <Send size={16} />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DoctorRating;
