import React, { useState , useRef } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, Upload, FileText, X } from 'lucide-react';

const RatingCategory = ({ label, value, onChange }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 w-full sm:w-1/3">{label}</label>
            <div className="flex gap-1 w-full sm:w-2/3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                        type="button"
                    >
                        <Star
                            size={24}
                            className={`${star <= value
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-100 text-slate-300 hover:text-amber-200'
                                } transition-colors duration-200`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

const DoctorRating = ({ doctorId, user, doctorName, onNavigateLogin, onNavigateSignup }) => {
    const fileInputRef = useRef(null);
    const [ratings, setRatings] = useState({
        communication: 0,
        punctuality: 0,
        treatmentPlan: 0,
        professionalism: 0,
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

        if (comment.trim() && !proofFile) {
            setSubmitStatus('error');
            setErrorMessage('Proof of visit (receipt or appointment slip) is required.');
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
                    userName: user.name || user.displayName || 'Anonymous',
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

            // Reset form after delay
            setTimeout(() => {
                setRatings({
                    communication: 0,
                    punctuality: 0,
                    treatmentPlan: 0,
                    professionalism: 0,
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
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-slate-100 mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/50 rounded-full -mr-10 -mt-10 opacity-60 pointer-events-none"></div>

            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-500">
                        <Star size={24} className="fill-teal-500" />
                    </div>
                    Rate Your Experience
                </h3>
                <p className="text-slate-500 mb-8 ml-16 max-w-none">
                    Help other patients by sharing your experience with {doctorName || 'this specialist'}. Your feedback is confidential and valuable.
                </p>

                {!user ? (
                    <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                        <h4 className="text-xl font-bold text-teal-500 mb-2">Login to Rate Your Experience</h4>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            Please login or register to share your review and help other patients find the right specialist.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={onNavigateLogin}
                                className="bg-teal-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-teal-600 transition-colors shadow-md active:scale-95"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={onNavigateSignup}
                                className="bg-white text-slate-700 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm active:scale-95"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                ) : submitStatus === 'success' || submitStatus === 'pending-approval' ? (
                    <div className={`rounded-2xl p-8 text-center animate-fade-in border ${submitStatus === 'success' ? 'bg-green-50 border-green-100' : 'bg-teal-50 border-teal-100'}`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${submitStatus === 'success' ? 'bg-green-100 text-green-600' : 'bg-teal-100 text-teal-600'}`}>
                            <CheckCircle2 size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">{submitStatus === 'success' ? 'Published!' : 'Under Review'}</h4>
                        <p className="text-slate-600">
                            {submitStatus === 'success'
                                ? 'Your review has been verified and published successfully.'
                                : 'Your review has been submitted for moderation and will differ after approval.'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-slate-50/50 rounded-3xl p-6 md:p-8 border border-slate-100">

                        {submitStatus === 'error' && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-100">
                                <AlertCircle size={18} />
                                {errorMessage}
                            </div>
                        )}

                        <div className="grid md:grid-cols-1 gap-x-8 gap-y-2 mb-8">
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
                                label="Treatment Plan Clarity"
                                value={ratings.treatmentPlan}
                                onChange={(val) => handleRatingChange('treatmentPlan', val)}
                            />
                            <RatingCategory
                                label="Professionalism"
                                value={ratings.professionalism}
                                onChange={(val) => handleRatingChange('professionalism', val)}
                            />
                            <RatingCategory
                                label="Overall Satisfaction"
                                value={ratings.overall}
                                onChange={(val) => handleRatingChange('overall', val)}
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-200 mb-6">
                            <h4 className="text-lg font-bold text-slate-800 mb-2">Write a Review (Optional)</h4>
                            <p className="text-sm text-slate-500 mb-6">
                                To share a written review, you must first upload a proof of visit to ensure authenticity.
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Proof of Visit</label>
                                <p className="text-xs text-slate-500 mb-3">Upload a receipt or appointment slip. (Max 5MB)</p>
                                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all group cursor-pointer bg-slate-50">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center gap-2 relative z-20 pointer-events-none">
                                        {proofFile ? (
                                            <div className="flex items-center gap-2 group/file animate-fade-in pointer-events-auto">
                                                <div className="text-teal-600 font-bold flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-lg">
                                                    <CheckCircle2 size={16} /> {fileName}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleRemoveFile();
                                                    }}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm relative z-30"
                                                    title="Remove proof"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={24} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                                                <span className="text-sm text-slate-500 group-hover:text-teal-600 font-medium">Click or Drag to Upload Receipt</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {proofFile && (
                            <div className="mb-6 animate-fade-in">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Comments (Optional)</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all min-h-[100px] resize-y"
                                    placeholder="Share more details about your visit..."
                                />
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95
                  ${isSubmitting ? 'bg-teal-500 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 hover:shadow-teal-500/30'}
                `}
                            >
                                {isSubmitting ? 'Submitting...' : (proofFile ? 'Submit Rating & Review' : 'Submit Rating')} <Send size={18} />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default DoctorRating;
