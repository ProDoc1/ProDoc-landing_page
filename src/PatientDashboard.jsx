import React, { useState } from 'react';
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
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  AlertCircle,
  MessageSquare,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import Navbar from './components/Navbar';
import PatientViewProfile from './lib/PatientviewProfile';

// Edit Profile Modal Component
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
    emergencyContact: user?.emergencyContact || '',
    bloodType: user?.bloodType || '',
    allergies: user?.allergies || '',
    medicalConditions: user?.medicalConditions || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('personal');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'medical', label: 'Medical Info', icon: AlertCircle }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <p className="text-teal-100 text-sm mt-1">Update your personal information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 space-y-2 shrink-0 hidden md:block">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeSection === section.id
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                  : 'text-slate-600 hover:bg-white hover:shadow-sm'
                  }`}
              >
                <section.icon size={20} />
                {section.label}
              </button>
            ))}

            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                <AlertCircle size={14} className="inline mr-1" />
                Your medical information is encrypted and only visible to you and your authorized doctors.
              </p>
            </div>
          </div>

          <div className="md:hidden px-6 pt-6 shrink-0">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 font-medium text-slate-700 bg-white"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>{section.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {activeSection === 'personal' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <User size={20} className="text-teal-600" />
                    Personal Information
                  </h3>

                  <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="relative">
                      <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-3xl font-bold">
                        {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <User size={40} />}
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors shadow-lg"
                      >
                        <Camera size={16} />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Profile Photo</h4>
                      <p className="text-sm text-slate-500 mb-3">Upload a clear photo of yourself</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors"
                        >
                          Upload New
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email Address *</label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Phone size={20} className="text-teal-600" />
                    Contact Information
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all`}
                        placeholder="+94 77 123 4567"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Address</label>
                    <div className="relative">
                      <MapPin size={20} className="absolute left-4 top-4 text-slate-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                        placeholder="123 Main Street, Colombo 03"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="Name: Jane Doe, Phone: +94 77 987 6543"
                    />
                    <p className="text-xs text-slate-500">Include name and phone number of emergency contact</p>
                  </div>
                </div>
              )}

              {activeSection === 'medical' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle size={20} className="text-teal-600" />
                    Medical Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Blood Type</label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Allergies</label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                      placeholder="List any allergies (medications, food, etc.)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Existing Medical Conditions</label>
                    <textarea
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                      placeholder="Diabetes, Hypertension, Asthma, etc."
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <strong>Privacy Notice:</strong> This medical information is encrypted and only accessible to healthcare providers you explicitly authorize.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 mt-8 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('payment'); // payment, success

  if (!isOpen) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold">Secure Payment</h2>
            <p className="text-teal-100 text-sm mt-1">Complete payment to proceed</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {step === 'payment' ? (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500">Service</p>
                  <p className="font-bold text-slate-800">Second Opinion Request</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="font-bold text-teal-600 text-lg">$50.00</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Card Number</label>
                  <div className="relative">
                    <CreditCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">CVV</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Cardholder Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-200"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay $50.00
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
              <p className="text-slate-500 mb-8">Your request for a second opinion has been initiated.</p>
              <button
                onClick={() => {
                  onPaymentSuccess();
                  onClose();
                }}
                className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
              >
                Continue to Request Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Patient Dashboard Component
const PatientDashboard = ({
  user,
  onLogout,
  onNavigateDoctors,
  onNavigateHome,
  onNavigateAbout,
  onNavigateLogin,
  onNavigateSignupPage,
  onNavigateDashboard
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedReport, setExpandedReport] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(user || {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+94 77 123 4567',
    dateOfBirth: '1990-05-15',
    address: '123 Galle Road, Colombo 03',
    emergencyContact: 'Jane Doe: +94 77 987 6543',
    bloodType: 'O+',
    allergies: 'Penicillin, Peanuts',
    medicalConditions: 'Hypertension'
  });

  const [reviews, setReviews] = useState([
    {
      id: 1,
      doctor: { name: "Dr. Sarah Perera", specialty: "Cardiologist", hospital: "Asiri Hospital" },
      rating: 5,
      text: "Excellent doctor, very thorough and caring. Highly recommend for cardiac issues.",
      visitDate: "2024-01-15",
      createdAt: "2024-01-16"
    },
    {
      id: 2,
      doctor: { name: "Dr. Sunil Jayawardena", specialty: "Neurologist", hospital: "Nawaloka Hospital" },
      rating: 4,
      text: "Very knowledgeable, but waiting time was a bit long. Good experience overall.",
      visitDate: "2023-12-20",
      createdAt: "2023-12-21"
    }
  ]);

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Blood Test Report - January 2024",
      type: "lab",
      reportDate: "2024-01-15",
      doctorName: "Dr. Sarah Perera",
      hospital: "Asiri Hospital",
      fileSize: "2.4 MB",
      isConfidential: false,
      description: "Complete blood count, lipid profile, and liver function tests"
    },
    {
      id: 2,
      title: "ECG Report",
      type: "scan",
      reportDate: "2024-01-15",
      doctorName: "Dr. Sarah Perera",
      hospital: "Asiri Hospital",
      fileSize: "1.8 MB",
      isConfidential: false,
      description: "Resting ECG - Normal sinus rhythm"
    },
    {
      id: 3,
      title: "Prescription - Amoxicillin",
      type: "prescription",
      reportDate: "2024-01-15",
      doctorName: "Dr. Sarah Perera",
      hospital: "Asiri Hospital",
      fileSize: "156 KB",
      isConfidential: false,
      description: "7-day course for respiratory infection"
    },
    {
      id: 4,
      title: "COVID-19 Vaccination Certificate",
      type: "vaccination",
      reportDate: "2023-06-10",
      doctorName: null,
      hospital: "National Hospital Colombo",
      fileSize: "890 KB",
      isConfidential: false,
      description: "Second dose completion certificate"
    }
  ]);

  const watchlist = [
    { id: 1, name: "Dr. Sarah Perera", specialty: "Cardiologist", status: "SLMC Verified", lastActive: "2 hours ago" },
    { id: 2, name: "Dr. Sunil Jayawardena", specialty: "Neurologist", status: "Pending Update", lastActive: "1 day ago" },
  ];

  const handleSaveProfile = async (formData) => {
    console.log('Saving profile:', formData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentUser(prev => ({ ...prev, ...formData }));
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
    const labels = {
      lab: 'Laboratory',
      scan: 'Imaging/Scan',
      prescription: 'Prescription',
      vaccination: 'Vaccination',
      discharge_summary: 'Discharge Summary'
    };
    return labels[type] || 'Document';
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
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
      />

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 pt-28 md:p-8 md:pt-32 grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center text-teal-600 relative">
              <User size={48} />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{currentUser?.fullName || 'Patient Name'}</h2>
            <p className="text-slate-500 text-sm mb-2">{currentUser?.email}</p>

            {currentUser.bloodType && (
              <div className="flex justify-center gap-2 mb-4">
                <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                  Blood: {currentUser.bloodType}
                </span>
              </div>
            )}

            <button
              onClick={() => setIsEditProfileOpen(true)}
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
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'profile' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <User size={20} /> View Profile
            </button>
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
              <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                {reviews.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'reports' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileText size={20} /> Medical Records
              <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                {reports.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('secondOpinion')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'secondOpinion' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <MessageSquare size={20} /> Second Opinion
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

        <div className="lg:col-span-3 space-y-6">

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.fullName?.split(' ')[0] || 'Patient'}! </h2>
                <p className="text-slate-300">Manage your medical records and doctor reviews in one place.</p>
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
                  <h3 className="text-xl font-bold text-slate-800">Recent Medical Records</h3>
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
                  <button className="text-teal-600 font-bold text-sm hover:underline">Manage</button>
                </div>

                <div className="space-y-3">
                  {watchlist.map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${doc.status === 'SLMC Verified' ? 'bg-teal-500' : 'bg-amber-500'}`}></div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition-colors">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.specialty}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${doc.status === 'SLMC Verified' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-800">My Reviews</h3>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <Plus size={18} /> Write a Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center text-slate-400 border border-slate-100 shadow-sm">
                  <Star size={48} className="mx-auto mb-4 opacity-20" />
                  <h4 className="text-lg font-bold text-slate-600 mb-2">No reviews yet</h4>
                  <p className="mb-6">Share your experience with doctors to help others.</p>
                  <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
                    Write Your First Review
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">
                            {review.doctor.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-slate-800">{review.doctor.name}</h4>
                            <p className="text-slate-500">{review.doctor.specialty} at {review.doctor.hospital}</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                              <Calendar size={14} /> Visited on {review.visitDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-xl">
                          {renderStars(review.rating)}
                          <span className="ml-2 font-bold text-amber-700">{review.rating}/5</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-6 mb-4">
                        <p className="text-slate-700 leading-relaxed text-lg">"{review.text}"</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Posted on {review.createdAt}</span>
                        <div className="flex gap-3">
                          <button className="text-teal-600 hover:text-teal-700 font-bold px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-600 font-bold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <div
                    key={report.id}
                    className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div
                      className="p-6 flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                    >
                      <div className="flex items-center gap-4">
                        {getReportIcon(report.type)}
                        <div>
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            {report.title}
                            {report.isConfidential && <Lock size={16} className="text-amber-500" />}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium">
                              {getReportTypeLabel(report.type)}
                            </span>
                            <span>•</span>
                            <span>{report.reportDate}</span>
                            {report.doctorName && (
                              <>
                                <span>•</span>
                                <span>{report.doctorName}</span>
                              </>
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

          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <PatientViewProfile onBack={() => setActiveTab('overview')} />
            </div>
          )}

          {activeTab === 'secondOpinion' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-lg mb-6">
                <h2 className="text-3xl font-bold mb-2">Second Opinion</h2>
                <p className="text-teal-100">Get expert advice from top specialists worldwide.</p>
              </div>

              <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-24 h-24 bg-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center text-teal-600">
                  <MessageSquare size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Request a Second Opinion</h3>
                <p className="text-slate-500 max-w-lg mx-auto mb-8 leading-relaxed">
                  Unsure about your diagnosis? Upload your medical reports and get a detailed second opinion from our network of verified specialists.
                </p>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 flex items-center gap-2 mx-auto"
                >
                  <Plus size={20} /> Start New Request
                </button>
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
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={() => {
          console.log("Payment successful, proceed to form");
          // Here you would navigate to the form or change state to show the form
        }}
      />
    </div>
  );
};

export default PatientDashboard;
