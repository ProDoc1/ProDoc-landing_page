import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  LogOut,
  Search,
  ShieldCheck,
  ChevronRight,
  Heart,
  FileText,
  Star,
  Download,
  Lock,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Calendar,
  Plus,
  Share,
  X,
  MessageSquare,
  CreditCard,
  CheckCircle,
  Verified,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Clock,
  Edit,
  Activity
} from 'lucide-react';

import Navbar from './components/Navbar';
import EditProfileModal from './EditProfileModal';

const ClickableInfoRow = ({ label, value, icon: Icon, highlight, onClick }) => {
  const isEmpty = !value || value === '';

  return (
    <div
      onClick={onClick}
      className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-200"
    >
      <div className={`p-2 rounded-lg ${highlight ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600'} transition-colors`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        {isEmpty ? (
          <div className="flex items-center gap-2 text-teal-600 font-medium">
            <Plus size={16} />
            <span className="text-sm">Add {label.toLowerCase()}</span>
          </div>
        ) : (
          <p className={`text-sm font-medium truncate ${highlight ? 'text-amber-900' : 'text-slate-700'}`}>{value}</p>
        )}
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, amount = 'Rs. 2500.00', serviceName = 'Second Opinion Request', userId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('payment');
  const [saveCardDetails, setSaveCardDetails] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState('Unknown');

  if (!isOpen) return null;

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Digits only
    if (value.length > 16) value = value.slice(0, 16);

    // Check card type
    if (value.startsWith('4')) setCardType('VISA');
    else if (value.startsWith('5')) setCardType('MASTERCARD');
    else if (value.startsWith('3')) setCardType('AMEX');
    else setCardType('Unknown');

    // Add space every 4 digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    let inputVal = e.target.value;

    if (expiry.endsWith('/') && inputVal.length === expiry.length - 1) {
      setExpiry(inputVal.slice(0, -1));
      return;
    }

    let value = inputVal.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 1) {
      const firstDigit = parseInt(value[0], 10);
      if (value.length === 1 && firstDigit > 1) {
        value = `0${firstDigit}/`;
      } else if (value.length >= 2) {
        let month = parseInt(value.slice(0, 2), 10);
        if (month > 12) month = 12;
        if (month === 0) month = 1;
        let monthStr = month.toString().padStart(2, '0');

        if (value.length === 4) {
          let year = parseInt(value.slice(2, 4), 10);
          const currentYear = parseInt(new Date().getFullYear().toString().slice(2), 10);
          if (year < currentYear) year = currentYear;
          value = `${monthStr}/${year.toString().padStart(2, '0')}`;
        } else {
          value = `${monthStr}/${value.slice(2)}`;
          if (value.length === 2 && !inputVal.endsWith('/')) {
            value = `${value}/`;
          }
        }
      }
    }

    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Attempt to resolve stored userId from localStorage if prop is missing
    const finalUserId = userId || localStorage.getItem('patientId') || 'test-debug-id';

    if (saveCardDetails && finalUserId) {
      try {
        const response = await fetch('/api/save-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: finalUserId,
            cardNumber,
            expiryDate: expiry,
            cardName,
            cardType,
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          console.error('Server returned error:', errData);
          alert(`Failed to save card: ${errData.error || 'Server error'}`);
        } else {
          console.log("Card saved successfully!");
        }
      } catch (error) {
        console.error('Failed to save card (network error):', error);
        alert('Network error while saving card details.');
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold">Secure Payment</h2>
            <p className="text-teal-100 text-sm mt-1">Complete payment to proceed</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {step === 'payment' ? (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500">Service</p>
                  <p className="font-bold text-slate-800">{serviceName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="font-bold text-teal-600 text-lg">{amount}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Card Number</label>
                    <div className="flex gap-2 items-center h-6">
                      <svg viewBox="0 0 38 15" className="h-4 opacity-100 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.672 0.28H10.138L6.476 8.526L5.808 5.122C5.64 4.09 4.882 3.328 3.868 3.018L0 2.216V0.28H7.316C8.216 0.28 8.974 0.96 9.172 1.838L10.832 9.07L14.672 0.28ZM27.086 7.64C27.086 5.342 23.778 5.218 23.778 3.978C23.778 3.606 24.116 3.172 24.962 3.048C25.356 2.986 26.316 2.924 27.132 3.328L27.866 0.536C27.414 0.38 26.37 0 25.044 0C21.464 0 19.04 1.954 19.012 4.684C18.984 6.668 20.73 7.784 22.084 8.466C23.466 9.148 23.944 9.582 23.944 10.234C23.916 11.226 22.788 11.66 21.604 11.692C19.828 11.722 18.784 11.194 18.022 10.822L17.26 13.738C18.05 14.11 19.516 14.452 21.066 14.482C24.872 14.482 27.284 12.558 27.284 9.774M36.31 14.234L33.914 0.28H30.136C29.346 0.28 28.698 0.744 28.388 1.488L24.328 11.436H28.98L29.91 8.862H35.548L36.084 14.234H36.31ZM31.122 5.56L33.096 0.25L34.252 5.56H31.122Z" fill="#1434CB" />
                      </svg>
                      <svg viewBox="0 0 24 15" className="h-5 opacity-100 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7.5" cy="7.5" r="7.5" fill="#EB001B" />
                        <circle cx="16.5" cy="7.5" r="7.5" fill="#F79E1B" />
                        <path d="M16.5 7.5C16.5 4.96316 15.2415 2.68285 13.2985 1.32043C11.3556 2.68285 10.0971 4.96316 10.0971 7.5C10.0971 10.0368 11.3556 12.3171 13.2985 13.6796C15.2415 12.3171 16.5 10.0368 16.5 7.5Z" fill="#FF5F00" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 z-10 w-8 flex justify-center">
                      {cardType === 'VISA' ? (
                        <svg viewBox="0 0 38 15" className="h-3.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.672 0.28H10.138L6.476 8.526L5.808 5.122C5.64 4.09 4.882 3.328 3.868 3.018L0 2.216V0.28H7.316C8.216 0.28 8.974 0.96 9.172 1.838L10.832 9.07L14.672 0.28ZM27.086 7.64C27.086 5.342 23.778 5.218 23.778 3.978C23.778 3.606 24.116 3.172 24.962 3.048C25.356 2.986 26.316 2.924 27.132 3.328L27.866 0.536C27.414 0.38 26.37 0 25.044 0C21.464 0 19.04 1.954 19.012 4.684C18.984 6.668 20.73 7.784 22.084 8.466C23.466 9.148 23.944 9.582 23.944 10.234C23.916 11.226 22.788 11.66 21.604 11.692C19.828 11.722 18.784 11.194 18.022 10.822L17.26 13.738C18.05 14.11 19.516 14.452 21.066 14.482C24.872 14.482 27.284 12.558 27.284 9.774M36.31 14.234L33.914 0.28H30.136C29.346 0.28 28.698 0.744 28.388 1.488L24.328 11.436H28.98L29.91 8.862H35.548L36.084 14.234H36.31ZM31.122 5.56L33.096 0.25L34.252 5.56H31.122Z" fill="#1434CB" />
                        </svg>
                      ) : cardType === 'MASTERCARD' ? (
                        <svg viewBox="0 0 24 15" className="h-4.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="7.5" cy="7.5" r="7.5" fill="#EB001B" />
                          <circle cx="16.5" cy="7.5" r="7.5" fill="#F79E1B" />
                          <path d="M16.5 7.5C16.5 4.96316 15.2415 2.68285 13.2985 1.32043C11.3556 2.68285 10.0971 4.96316 10.0971 7.5C10.0971 10.0368 11.3556 12.3171 13.2985 13.6796C15.2415 12.3171 16.5 10.0368 16.5 7.5Z" fill="#FF5F00" />
                        </svg>
                      ) : (
                        <CreditCard size={20} className="text-slate-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all font-mono placeholder:font-sans font-medium tracking-wide"
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all font-mono placeholder:font-sans font-medium tracking-wide"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all font-mono placeholder:font-sans font-medium tracking-wide"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all font-medium uppercase placeholder:normal-case placeholder:font-normal"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCardDetails}
                  onChange={(e) => setSaveCardDetails(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
                />
                <label htmlFor="saveCard" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                  Save card details
                </label>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-200 mt-2">
                {isProcessing ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard size={20} /> Pay {amount}</>
                )}
              </button>
              <p className="text-xs text-slate-500 text-center mt-4">
                Your personal data will be used to process your payment, support your experience throughout this website.
              </p>
            </form>
          ) : (
            <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
              <p className="text-slate-500 mb-8">Your request for a second opinion has been initiated successfully. We will follow up shortly.</p>
              <button
                onClick={() => {
                  onPaymentSuccess();
                  onClose();
                }}
                className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PatientDashboard = ({
  user,
  onLogout,
  onNavigateDoctors,
  onNavigateHome,
  onNavigateAbout,
  onNavigateLogin,
  onNavigateSignupPage,
  onNavigateDashboard,
  onNavigateContentHub,
  onViewProfile
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedReport, setExpandedReport] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileSection, setEditProfileSection] = useState('personal');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ amount: 'Rs. 2500.00', serviceName: 'General Second Opinion' });

  const [currentUser, setCurrentUser] = useState({
    id: null,
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: [],
    chronicConditions: [],
    email_verified: false
  });

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const [secondOpinionDoctors, setSecondOpinionDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [savedDoctors, setSavedDoctors] = useState([]);
  const [loadingSavedDoctors, setLoadingSavedDoctors] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await fetch(`/api/doctors?t=${Date.now()}`);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();

        if (Array.isArray(data)) {
          const remoteDoctors = data.filter(doc => doc.second_opinion_available === true);
          setSecondOpinionDoctors(remoteDoctors);
        }
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const [medicalHistory] = useState([
    { id: 3, date: "2023-05-20", type: "Prescription", doctor: "Dr. Sarah Perera", notes: "Medication refill.", status: "Dispensed" },
  ]);

  useEffect(() => {
    if (user && (user.id || user.uid || user.email)) {
      setCurrentUser(prev => ({
        ...prev,
        ...user,
        fullName: user.fullName || user.name || prev.fullName || ''
      }));
      fetchUserData(user.id || user.uid, user.email);
    } else {
      const storedPatientId = localStorage.getItem('patientId');
      const storedEmail = localStorage.getItem('patientEmail');
      if (storedPatientId || storedEmail) {
        fetchUserData(storedPatientId, storedEmail);
      }
    }
  }, [user]);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      setReviewsLoading(true);
      const userId = currentUser.id;
      fetch(`/api/reviews?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const formattedReviews = data.map(r => ({
              id: r.id,
              doctor: {
                name: r.doctor_name || 'Doctor',
                specialty: r.specialty || 'General',
                hospital: "Verified Institution"
              },
              rating: r.rating,
              communication: r.communication,
              punctuality: r.punctuality,
              treatment_plan: r.treatment_plan,
              proof: r.proof_url || '',
              text: r.text || '',
              status: r.status || 'approved',
              visitDate: r.visitdate || new Date().toLocaleDateString(),
              createdAt: r.createdat || new Date().toLocaleDateString()
            }));
            setReviews(formattedReviews);
          }
        })
        .catch(err => console.error("Error fetching patient reviews:", err))
        .finally(() => setReviewsLoading(false));

      setLoadingSavedDoctors(true);
      fetch(`/api/saved-doctors?patientId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSavedDoctors(data);
          }
        })
        .catch(err => console.error("Error fetching saved doctors:", err))
        .finally(() => setLoadingSavedDoctors(false));
    }
  }, [currentUser?.id]);

  const fetchUserData = async (patientId, email) => {
    try {
      const queryParams = new URLSearchParams();
      if (patientId) queryParams.append('patientId', patientId);
      if (email) queryParams.append('email', email);
      // Adding a timestamp ensures the browser doesn't serve a cached (old) version
      queryParams.append('t', Date.now());

      const response = await fetch(`/api/patient/profile?${queryParams.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(prev => ({
          ...prev,
          ...data,
          fullName: data.fullName || prev.fullName || prev.name || ''
        }));

        if (data.id) localStorage.setItem('patientId', data.id);
        if (data.email) localStorage.setItem('patientEmail', data.email);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      const email = currentUser?.email || formData.email || localStorage.getItem('patientEmail');
      if (!email) throw new Error('Email is required to save profile data.');

      const response = await fetch('/api/patient/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, email }),
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save profile');
        } else {
          // If 404 appears here, verify that the file exists at /api/patient/profile/route.js
          throw new Error(`Server returned a ${response.status} error. Check your API route path!`);
        }
      }

      const result = await response.json();

      // Force local UI update so changes appear immediately
      setCurrentUser(prev => ({
        ...prev,
        ...formData,
        allergies: formData.allergies || [],
        chronicConditions: formData.chronicConditions || [],
        id: result.patient?.id || prev.id
      }));

      if (result.patient?.id) {
        localStorage.setItem('patientId', result.patient.id);
      }

      setIsEditProfileOpen(false);

    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(`Could not save profile: ${error.message}`);
    }
  };

  const openEditProfile = (section = 'personal') => {
    setEditProfileSection(section);
    setIsEditProfileOpen(true);
  };

  const getReportIcon = (type) => {
    switch (type) {
      case 'lab': return <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><FileText size={20} /></div>;
      case 'scan': return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Stethoscope size={20} /></div>;
      case 'prescription': return <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><FileText size={20} /></div>;
      case 'vaccination': return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><ShieldCheck size={20} /></div>;
      default: return <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><FileText size={20} /></div>;
    }
  };

  const getReportTypeLabel = (type) => {
    const labels = { lab: 'Laboratory', scan: 'Imaging/Scan', prescription: 'Prescription', vaccination: 'Vaccination', discharge_summary: 'Discharge Summary' };
    return labels[type] || 'Document';
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={16} className={i < rating ? "text-teal-400 fill-teal-400" : "text-slate-300"} />
    ));
  };

  const performDelete = async (reviewId) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId })
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      }
    } catch (err) {
      console.error('Error deleting review', err);
    }
  };

  const confirmDelete = (reviewId) => setDeleteConfirm({ show: true, id: reviewId });
  const cancelDelete = () => setDeleteConfirm({ show: false, id: null });
  const handleDeleteReview = () => {
    if (deleteConfirm.show && deleteConfirm.id) {
      performDelete(deleteConfirm.id);
      setDeleteConfirm({ show: false, id: null });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Confirm deletion</h3>
            <p className="text-slate-600">Are you sure you want to delete this review or rating? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelDelete} className="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
              <button onClick={handleDeleteReview} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
      <Navbar
        currentPage="dashboard"
        currentUser={currentUser}
        onNavigateHome={onNavigateHome}
        onNavigateAbout={onNavigateAbout}
        onNavigateDoctors={onNavigateDoctors}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignupPage={onNavigateSignupPage}
        onLogout={onLogout}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateContentHub={onNavigateContentHub}
      />

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 pt-28 md:p-8 md:pt-32 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {currentUser && (
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center text-teal-600 relative">
                <User size={48} />
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-1.5">
                {currentUser?.fullName || currentUser?.name || 'Patient Name'}
                {currentUser?.email_verified && <Verified size={25} className="text-white fill-blue-500 mt-1" />}
              </h2>
              <p className="text-slate-500 text-sm mb-2">{currentUser?.email}</p>

              {currentUser.bloodType && (
                <div className="flex justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                    Blood: {currentUser.bloodType}
                  </span>
                </div>
              )}

              <button
                onClick={() => openEditProfile('personal')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Settings size={18} /> Edit Profile
              </button>
              <button
                onClick={onLogout}
                className="w-full mt-3 py-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>

            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'overview' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <ShieldCheck size={20} /> Overview
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'reviews' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Star size={20} /> My Reviews
                <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{reviews.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'reports' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <FileText size={20} /> Medical Records
                <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{reports.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('secondOpinion')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'secondOpinion' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <MessageSquare size={20} /> Second Opinion
              </button>
              <button
                onClick={() => setActiveTab('savedDoctors')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'savedDoctors' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Heart size={20} /> Watchlist
                <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{savedDoctors.length}</span>
              </button>
            </div>

            <div className="bg-teal-600 rounded-[2rem] p-8 text-white shadow-lg shadow-teal-200/50 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Find Doctors</h3>
                <p className="text-teal-100 text-sm mb-6">Search verified specialists in Sri Lanka.</p>
                <button
                  onClick={onNavigateDoctors}
                  className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-all flex items-center gap-2 w-full justify-center"
                >
                  <Search size={18} /> Search Directory
                </button>
              </div>
              <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
            </div>
          </div>
        )}

        <div className="lg:col-span-3 space-y-6">

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {(currentUser?.fullName || currentUser?.name || 'Patient').split(' ')[0]}! </h2>
                <p className="text-slate-300">Manage your medical records and doctor reviews in one place.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <User className="text-teal-600" size={24} />
                      Personal Information
                    </h3>
                    <button
                      onClick={() => openEditProfile('personal')}
                      className="text-teal-600 font-bold text-sm hover:underline flex items-center gap-1"
                    >
                      <Edit size={14} /> Edit All
                    </button>
                  </div>

                  <div className="space-y-2 flex-1">
                    <ClickableInfoRow label="Full Name" value={currentUser.fullName} icon={User} onClick={() => openEditProfile('personal')} />
                    <ClickableInfoRow label="Date of Birth" value={currentUser.dateOfBirth} icon={Calendar} onClick={() => openEditProfile('personal')} />
                    <ClickableInfoRow label="Gender" value={currentUser.gender} icon={User} onClick={() => openEditProfile('personal')} />
                    <ClickableInfoRow label="Email Address" value={currentUser.email} icon={Mail} onClick={() => openEditProfile('personal')} />
                    <ClickableInfoRow label="Phone Number" value={currentUser.phone} icon={Phone} onClick={() => openEditProfile('contact')} />
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-xl">
                      <AlertCircle className="text-red-500" size={24} />
                      Medical Alerts
                    </h3>
                    <button
                      onClick={() => openEditProfile('medical')}
                      className="text-teal-600 text-sm font-bold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Known Allergies</p>
                    {currentUser.allergies && currentUser.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentUser.allergies.map((allergy, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => openEditProfile('medical')}
                        className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add allergies
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chronic Conditions</p>
                    {currentUser.chronicConditions && currentUser.chronicConditions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentUser.chronicConditions.map((condition, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-sm font-medium">
                            {condition}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => openEditProfile('medical')}
                        className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add conditions
                      </button>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <ClickableInfoRow
                      label="Emergency Contact"
                      value={currentUser.emergencyContact}
                      icon={AlertCircle}
                      highlight
                      onClick={() => openEditProfile('contact')}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="text-teal-600" size={24} />
                    Recent Medical History
                  </h3>
                  <button className="text-teal-600 font-bold text-sm hover:underline flex items-center gap-1">
                    <Plus size={14} /> Add Record
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200"></div>
                  <div className="space-y-8">
                    {medicalHistory.map((record) => (
                      <div key={record.id} className="relative flex gap-6 group">
                        <div className={`w-8 h-8 rounded-full border-4 border-white z-10 flex items-center justify-center shrink-0 shadow-sm ${record.type === 'Emergency' ? 'bg-red-500' :
                          record.type === 'Lab Report' ? 'bg-blue-500' :
                            record.type === 'Prescription' ? 'bg-amber-500' : 'bg-teal-500'
                          }`}>
                          {record.type === 'Emergency' && <AlertCircle size={14} className="text-white" />}
                          {record.type === 'Lab Report' && <FileText size={14} className="text-white" />}
                          {record.type === 'Prescription' && <FileText size={14} className="text-white" />}
                          {record.type === 'Consultation' && <Stethoscope size={14} className="text-white" />}
                        </div>

                        <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-800">{record.type}</h4>
                            <span className="text-xs text-slate-400 font-medium bg-white px-2 py-1 rounded-md border border-slate-200">
                              {record.date}
                            </span>
                          </div>
                          <p className="text-sm text-teal-700 font-medium mb-2">{record.doctor}</p>
                          <p className="text-slate-600 text-sm leading-relaxed">{record.notes}</p>

                          <div className="mt-3 flex items-center justify-between">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${record.status === 'Resolved' || record.status === 'Completed' || record.status === 'Dispensed'
                              ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                              {record.status}
                            </span>
                            {record.type === 'Lab Report' && (
                              <button className="text-teal-600 text-sm font-bold hover:underline flex items-center gap-1">
                                <Download size={14} /> Download
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full rounded-2xl transition-all ${activeTab === 'reviews' ? 'ring-2 ring-teal-200' : ''}`}
                >
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow w-full flex flex-col items-center text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Star size={24} />
                      </div>
                      <span className="text-3xl font-bold text-slate-800">{reviews.length}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1 text-center">Doctor Reviews</h3>
                    <p className="text-sm text-slate-500 text-center">Reviews you've left for doctors</p>
                  </div></button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full rounded-2xl transition-all ${activeTab === 'reports' ? 'ring-2 ring-teal-200' : ''}`}
                >
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow w-full flex flex-col items-center text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <span className="text-3xl font-bold text-slate-800">{reports.length}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1 text-center">Medical Records</h3>
                    <p className="text-sm text-slate-500 text-center">Stored reports and documents</p>
                  </div>
                </button>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Recent Reviews</h3>
                  <button onClick={() => setActiveTab('reviews')} className="text-teal-600 font-bold text-sm hover:underline">View All</button>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl">
                    <Star size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.slice(0, 2).map(review => (
                      <div key={review.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold shrink-0">
                          {review.doctor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-800 truncate">{review.doctor.name}</h4>
                            <div className="flex items-center gap-1 shrink-0">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{review.doctor.specialty}</p>
                          <p className="text-sm text-slate-600 line-clamp-2">"{review.text}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Recent Documents</h3>
                  <button onClick={() => setActiveTab('reports')} className="text-teal-600 font-bold text-sm hover:underline">View All</button>
                </div>

                <div className="space-y-3">
                  {reports.slice(0, 3).map(report => (
                    <div key={report.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                      {getReportIcon(report.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{report.title}</h4>
                        <p className="text-xs text-slate-500">{getReportTypeLabel(report.type)} • {report.reportDate}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Heart className="text-red-500 fill-red-500" size={20} />
                    <h3 className="text-xl font-bold text-slate-800">Watchlist</h3>
                  </div>
                  <button onClick={() => setActiveTab('savedDoctors')} className="text-teal-600 font-bold text-sm hover:underline">Manage</button>
                </div>

                <div className="space-y-3">
                  {savedDoctors.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-2xl">
                      <p className="text-sm">No saved doctors yet</p>
                    </div>
                  ) : (
                    savedDoctors.slice(0, 3).map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => onViewProfile(doc.id)}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg shrink-0 overflow-hidden border border-teal-200">
                            {doc.image_url ? (
                              <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" />
                            ) : (
                              doc.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition-colors">{doc.name}</p>
                            <p className="text-xs text-slate-500">{doc.specialty}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-teal-100 text-teal-700 rounded-full flex items-center gap-1">
                          <Star size={12} className="fill-teal-700" />
                          {Number(doc.average_rating || 0).toFixed(1)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-2xl font-bold text-slate-800">My Reviews & Ratings</h3>
              </div>
              <div className="flex gap-2">
                {['all', 'reviews', 'ratings'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setReviewFilter(opt)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-colors ${reviewFilter === opt ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {opt === 'all' ? 'All' : opt === 'ratings' ? 'Ratings' : 'Reviews'}
                  </button>
                ))}
              </div>

              {reviews.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center text-slate-400 border border-slate-100 shadow-sm">
                  <Star size={48} className="mx-auto mb-4 opacity-20" />
                  <h4 className="text-lg font-bold text-slate-600 mb-2">No reviews or ratings yet</h4>
                  <p className="mb-6">Share your experience with doctors to help others.</p>
                  <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
                    Write Your First Review
                  </button>
                </div>
              ) : (
                <>
                  {(() => {
                    const ratingsOnly = reviews.filter(r => !r.text || r.text.trim() === '');
                    const textReviews = reviews.filter(r => r.text && r.text.trim() !== '');
                    const showRatings = reviewFilter === 'all' || reviewFilter === 'ratings';
                    const showText = reviewFilter === 'all' || reviewFilter === 'reviews';
                    return (
                      <div className="space-y-6">
                        {showRatings && ratingsOnly.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-xl font-semibold text-slate-800">Ratings</h4>
                            {ratingsOnly.map(review => (
                              <div key={review.id} className={`bg-white border rounded-[2rem] p-4 shadow-sm hover:shadow-md transition-all relative ${review.status === 'rejected' ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}>
                                <div className="absolute top-4 right-4">
                                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${review.status === 'rejected' ? 'bg-rose-100 text-rose-600' : review.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {review.status}
                                  </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                                      {review.doctor.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-md text-slate-800">{review.doctor.name}</h4>
                                      <p className="text-slate-500 text-sm">{review.doctor.specialty} at {review.doctor.hospital}</p>
                                    </div>
                                  </div>
                                </div>
                                {review.proof && (
                                  <div className="mb-4 text-sm">
                                    Proof: <a href={review.proof} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">View</a>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                                  <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-slate-100">
                                    <span className="font-semibold text-slate-700">Communication:</span>
                                    <span className="flex items-center gap-1 text-teal-600 font-bold">
                                      <Star size={12} className="fill-teal-400" />
                                      {review.communication || '--'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-slate-100">
                                    <span className="font-semibold text-slate-700">Punctuality:</span>
                                    <span className="flex items-center gap-1 text-teal-600 font-bold">
                                      <Star size={12} className="fill-teal-400" />
                                      {review.punctuality || '--'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-slate-100">
                                    <span className="font-semibold text-slate-700">Treatment Plan:</span>
                                    <span className="flex items-center gap-1 text-teal-600 font-bold">
                                      <Star size={12} className="fill-teal-400" />
                                      {review.treatment_plan || '--'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between bg-teal-50 p-2 rounded-lg border border-teal-100">
                                    <span className="font-semibold text-slate-700">Overall Satisfaction:</span>
                                    <span className="flex items-center gap-1 text-teal-700 font-bold">
                                      <Star size={12} className="fill-teal-400" />
                                      {review.rating || '--'}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-slate-400 text-sm">
                                  <span>Posted on {review.createdAt}</span>
                                </div>
                                <div className="flex justify-end mt-2">
                                  <button onClick={() => confirmDelete(review.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {showText && textReviews.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-xl font-semibold text-slate-800">Written Reviews</h4>
                            {textReviews.map(review => (
                              <div key={review.id} className={`bg-white border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all relative ${review.status === 'rejected' ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}>
                                <div className="absolute top-1 right-8">
                                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide ${review.status === 'rejected' ? 'bg-rose-100 text-rose-600' : review.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {review.status}
                                  </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">
                                      {review.doctor.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-lg text-slate-800">{review.doctor.name}</h4>
                                      <p className="text-slate-500">{review.doctor.specialty} at {review.doctor.hospital}</p>
                                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                        <Calendar size={14} /> Posted on {review.createdAt}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-5">
                                    <div className="flex justify-start">
                                      <div className="flex items-center gap-1 bg-teal-50 px-3 py-2 rounded-xl border border-teal-100 mr-2">
                                        {renderStars(review.rating)}
                                        <span className="ml-2 font-bold text-teal-600">{review.rating}/5</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 mb-4">
                                  <p className="text-slate-800 leading-relaxed text-sm font-semibold mb-3 bg-white p-3 rounded-lg border-l-4 border-teal-400">{review.text}</p>
                                </div>
                                {review.proof && (
                                  <div className="mb-4 text-sm">
                                    Proof of visit: <a href={review.proof} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">View</a>
                                  </div>
                                )}
                                <div className="flex justify-end mt-2">
                                  <button onClick={() => confirmDelete(review.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Medical Records Storage</h3>
                    <p className="text-teal-100">Securely store prescriptions, lab reports, scans & more</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-3xl font-bold">24.5 MB</p>
                      <p className="text-teal-100 text-sm">of 100 MB used</p>
                    </div>
                    <button className="bg-white text-teal-600 px-4 py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors flex items-center gap-2">
                      <Plus size={18} /> Upload
                    </button>
                  </div>
                </div>
                <div className="mt-6 bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-1/4 transition-all"></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['All', 'Lab Reports', 'Prescriptions', 'Scans', 'Vaccinations'].map((filter, idx) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${idx === 0 ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {reports.map(report => (
                  <div key={report.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-lg transition-all">
                    <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}>
                      <div className="flex items-center gap-4">
                        {getReportIcon(report.type)}
                        <div>
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            {report.title}
                            {report.isConfidential && <Lock size={16} className="text-teal-500" />}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium">{getReportTypeLabel(report.type)}</span>
                            <span>•</span>
                            <span>{report.reportDate}</span>
                            {report.doctorName && (
                              <><span>•</span><span>{report.doctorName}</span></>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400 hidden md:block">{report.fileSize}</span>
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          {expandedReport === report.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </button>
                      </div>
                    </div>

                    {expandedReport === report.id && (
                      <div className="px-6 pb-6 pt-0 bg-slate-50 border-t border-slate-100">
                        <div className="pt-4">
                          <div className="bg-white rounded-2xl p-4 mb-4 border border-slate-200">
                            <h5 className="font-bold text-slate-700 mb-2">Description</h5>
                            <p className="text-slate-600">{report.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-sm">
                              <Download size={18} /> Download PDF
                            </button>
                            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                              <FileText size={18} /> View Online
                            </button>
                            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                              <Share size={18} /> Share
                            </button>
                            <button className="ml-auto p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                              <MoreVertical size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'secondOpinion' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-lg mb-6">
                <h2 className="text-3xl font-bold mb-2">Second Opinion</h2>
                <p className="text-teal-100">Get expert advice from top specialists worldwide.</p>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Stethoscope className="text-teal-600" size={24} />
                  Available Specialists & Pricing
                </h3>
                {loadingDoctors ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500 border-r-transparent"></div>
                  </div>
                ) : secondOpinionDoctors.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p>No specialists available for remote consult at the moment.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {secondOpinionDoctors.map((doc, idx) => {
                      const doctorName = doc.full_name || 'Doctor Name';
                      const initial = doctorName.split(' ')[1]?.charAt(0) || doctorName.charAt(0);
                      const specialty = doc.specialty || 'Specialist';
                      // Using realistic mock values for rating/price as they might not come from db
                      const rating = doc.rating || (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1);
                      const price = 'Rs. 2500';
                      const exp = doc.years_of_experience ? `${doc.years_of_experience}+ yrs` : '10+ yrs';

                      return (
                        <div key={doc.doctor_id || idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="cursor-pointer group flex items-center gap-4 flex-1" onClick={onNavigateDoctors}>
                            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl shrink-0 group-hover:bg-teal-200 transition-colors overflow-hidden border border-teal-200">
                              {doc.image_url ? (
                                <img src={doc.image_url} alt={doctorName} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                initial
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-slate-800 group-hover:text-teal-600 transition-colors">{doctorName}</h4>
                              <p className="text-sm text-slate-500">{specialty}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Star size={16} className="text-teal-500 fill-teal-500" />
                                  <span className="font-semibold">{rating}</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-slate-200">{exp}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 md:min-w-[250px] border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-6">
                            <div>
                              <p className="text-xs text-slate-500 mb-0.5">Consultation Fee</p>
                              <p className="font-bold text-xl text-teal-600">{price}</p>
                            </div>
                            <button
                              onClick={() => {
                                setPaymentDetails({ amount: price, serviceName: `Second Opinion - ${doctorName}` });
                                setIsPaymentModalOpen(true);
                              }}
                              className="px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-teal-600 transition-colors shrink-0"
                            >
                              Proceed to Payment
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'savedDoctors' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-lg mb-6">
                <h2 className="text-3xl font-bold mb-2">Saved Doctors</h2>
                <p className="text-teal-100">Easily access your preferred specialists.</p>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Heart className="text-red-500 fill-red-500" size={24} />
                  My Saved Professionals
                </h3>
                {loadingSavedDoctors ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500 border-r-transparent"></div>
                  </div>
                ) : savedDoctors.length === 0 ? (
                  <div className="bg-white rounded-[2rem] p-12 text-center text-slate-400 border border-slate-100 shadow-sm">
                    <Heart size={48} className="mx-auto mb-4 opacity-20" />
                    <h4 className="text-lg font-bold text-slate-600 mb-2">No saved doctors yet</h4>
                    <p className="mb-6">Save doctors while browsing to easily find them later.</p>
                    <button onClick={onNavigateDoctors} className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
                      Browse Doctors Directory
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {savedDoctors.map((doc, idx) => {
                      const doctorName = doc.name || 'Doctor Name';
                      const initial = doctorName.split(' ')[1]?.charAt(0) || doctorName.charAt(0);
                      const specialty = doc.specialty || 'Specialist';
                      const rating = Number(doc.average_rating || 0).toFixed(1);
                      const reviewsCount = doc.rating_count || 0;
                      const exp = doc.years_of_experience ? `${doc.years_of_experience}+ yrs` : '10+ yrs';

                      return (
                        <div key={doc.id || idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="cursor-pointer group flex items-center gap-4 flex-1" onClick={() => onViewProfile(doc.id)}>
                            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl shrink-0 group-hover:bg-teal-200 transition-colors overflow-hidden border border-teal-200">
                              {doc.image_url ? (
                                <img src={doc.image_url} alt={doctorName} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                initial
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-slate-800 group-hover:text-teal-600 transition-colors">{doctorName}</h4>
                              <p className="text-sm text-slate-500">{specialty}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Star size={16} className="text-teal-500 fill-teal-500" />
                                  <span className="font-semibold">{rating} <span className="text-slate-400 font-normal">({reviewsCount})</span></span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-slate-200">{exp}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-3 md:min-w-[200px] border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-6">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const res = await fetch('/api/saved-doctors', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      patientId: currentUser.id,
                                      doctorId: doc.id,
                                      action: 'unsave'
                                    })
                                  });
                                  if (res.ok) {
                                    setSavedDoctors(savedDoctors.filter(d => d.id !== doc.id));
                                  }
                                } catch (err) {
                                  console.error('Failed to unsave doctor', err);
                                }
                              }}
                              className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shadow-sm border border-red-100"
                              title="Remove from saved"
                            >
                              <Heart size={20} className="fill-current" />
                            </button>
                            <button
                              onClick={() => onViewProfile(doc.id)}
                              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm flex-1 md:flex-none text-center"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={currentUser}
        onSave={handleSaveProfile}
        initialSection={editProfileSection}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={paymentDetails.amount}
        serviceName={paymentDetails.serviceName}
        userId={currentUser?.id}
        onPaymentSuccess={() => {
          // console.log("Payment successful, proceed to form");
        }}
      />
    </div>
  );
};

export default PatientDashboard;