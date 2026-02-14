import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Save,
  AlertCircle
} from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: '',
    medicalConditions: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('personal');

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        bloodType: user.bloodType || '',
        allergies: user.allergies || '',
        medicalConditions: user.medicalConditions || ''
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
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
          {/* Sidebar Navigation */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 space-y-2 shrink-0 hidden md:block">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeSection === section.id 
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

          {/* Mobile Section Selector */}
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

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information Section */}
              {activeSection === 'personal' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <User size={20} className="text-teal-600" />
                    Personal Information
                  </h3>
                  
                  {/* Profile Photo Upload */}
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

              {/* Contact Section */}
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

              {/* Medical Section */}
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

              {/* Footer Actions */}
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

export default EditProfileModal;