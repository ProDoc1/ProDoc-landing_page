import React, { useState } from 'react';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    AlertCircle,
    Activity,
    HeartPulse,
    Weight,
    Ruler,
    Download,
    Share2,
    ArrowLeft,
    FileText,
    Clock,
    Plus,
    MessageSquare,
    Stethoscope,
    Edit,
    Eye,
    ChevronRight
} from 'lucide-react';

const PatientViewProfile = ({ patientId, onBack, onNavigate }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [patient, setPatient] = useState({
        id: "PT-2024-894",
        fullName: "Amanda Silva",
        dateOfBirth: "1995-08-14",
        age: 28,
        gender: "Female",
        email: "amanda.silva@example.com",
        phone: "+94 71 234 5678",
        address: "45/12, Havelock Road, Colombo 05",
        bloodType: "O+",
        emergencyContact: "Mr. Nimal Silva (Father) - +94 77 123 4567",
        allergies: ["Penicillin", "Peanuts", "Dust Mites"],
        chronicConditions: ["Asthma", "Mild Hypertension"],
        lastVisit: "2023-10-15",
        status: "Active"
    });

    const [vitals, setVitals] = useState({
        height: "165 cm",
        weight: "62 kg",
        bmi: "22.8",
        bloodPressure: "120/80 mmHg",
        heartRate: "72 bpm",
        temperature: "36.6 °C",
        updatedAt: "Today, 09:30 AM"
    });

    const [medicalHistory, setMedicalHistory] = useState([
        { id: 1, date: "2023-10-15", type: "Consultation", doctor: "Dr. Sarah Perera", notes: "Routine checkup. BP slightly elevated. Prescribed Amlodipine.", status: "Completed" },
        { id: 2, date: "2023-08-10", type: "Lab Report", doctor: "Dr. Sunil Jayawardena", notes: "Full Blood Count - Normal Range.", status: "Reviewed" },
        { id: 3, date: "2023-05-20", type: "Prescription", doctor: "Dr. Sarah Perera", notes: "Ventolin Inhaler refill.", status: "Dispensed" },
        { id: 4, date: "2022-11-12", type: "Emergency", doctor: "Dr. K. Fernando", notes: "Mild asthma attack. Treated with nebulizer.", status: "Resolved" }
    ]);

    // Edit Profile Modal Component
    const EditProfileModal = () => {
        const [formData, setFormData] = useState({ ...patient });
        const [activeSection, setActiveSection] = useState('personal');

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSave = () => {
            setPatient(formData);
            setIsEditMode(false);
        };

        const sections = [
            { id: 'personal', label: 'Personal Info' },
            { id: 'contact', label: 'Contact' },
            { id: 'medical', label: 'Medical Info' }
        ];

        if (!isEditMode) return null;

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setIsEditMode(false)}
                />
                
                <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 text-white flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <p className="text-teal-100 text-sm mt-1">Update your personal information</p>
                        </div>
                        <button 
                            onClick={() => setIsEditMode(false)}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        <div className="w-56 bg-slate-50 border-r border-slate-200 p-4 space-y-2 shrink-0">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                                        activeSection === section.id 
                                            ? 'bg-teal-600 text-white shadow-lg' 
                                            : 'text-slate-600 hover:bg-white'
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-4">
                                {activeSection === 'personal' && (
                                    <>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-bold text-slate-700 block mb-2">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-slate-700 block mb-2">Gender</label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                                >
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Blood Type</label>
                                            <select
                                                name="bloodType"
                                                value={formData.bloodType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                            >
                                                <option value="">Select</option>
                                                <option>A+</option>
                                                <option>A-</option>
                                                <option>B+</option>
                                                <option>B-</option>
                                                <option>AB+</option>
                                                <option>AB-</option>
                                                <option>O+</option>
                                                <option>O-</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {activeSection === 'contact' && (
                                    <>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Address</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Emergency Contact</label>
                                            <input
                                                type="text"
                                                name="emergencyContact"
                                                value={formData.emergencyContact}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeSection === 'medical' && (
                                    <>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Allergies (comma separated)</label>
                                            <input
                                                type="text"
                                                value={formData.allergies.join(', ')}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                }))}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                                placeholder="e.g. Penicillin, Peanuts"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Chronic Conditions (comma separated)</label>
                                            <input
                                                type="text"
                                                value={formData.chronicConditions.join(', ')}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    chronicConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                }))}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                                placeholder="e.g. Asthma, Diabetes"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditMode(false)}
                                        className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Clickable Info Row Component
    const ClickableInfoRow = ({ label, value, icon: Icon, emptyText = "Not provided", section }) => {
        const isEmpty = !value || value === '';
        
        return (
            <div 
                onClick={() => {
                    setIsEditMode(true);
                    // You could also set the active section here if needed
                }}
                className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-200"
            >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
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
                        <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
                    )}
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-500 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
        );
    };

    // Clickable Vital Card
    const ClickableVitalCard = ({ icon: Icon, label, value, color, bg, status, onClick }) => (
        <div 
            onClick={onClick}
            className="group bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center text-center hover:border-teal-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`${bg} ${color} w-10 h-10 rounded-full flex items-center justify-center mb-2 relative z-10 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800 relative z-10">{value || '--'}</p>
            <p className="text-xs text-slate-500 font-medium mt-1 relative z-10">{label}</p>
            {status && (
                <span className="text-[10px] font-bold uppercase text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded-full relative z-10">
                    {status}
                </span>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit size={14} className="text-teal-500" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <EditProfileModal />

            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                            <p className="text-slate-500 text-sm">ID: {patient.id}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsEditMode(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
                        >
                            <Edit size={18} /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar: Patient Identity */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal-500 to-teal-600"></div>

                        <div className="relative mt-12 mb-4">
                            <div className="w-28 h-28 bg-white rounded-full mx-auto p-1 shadow-md">
                                <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-4xl font-bold">
                                    {patient.fullName.charAt(0)}
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsEditMode(true)}
                                className="absolute bottom-2 right-1/2 translate-x-12 bg-teal-600 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center hover:bg-teal-700 transition-colors shadow-lg"
                            >
                                <Edit size={14} className="text-white" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800">{patient.fullName}</h2>
                        <p className="text-slate-500 mb-4">{patient.age} Years • {patient.gender}</p>

                        <div className="flex justify-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold flex items-center gap-1">
                                <Activity size={12} /> {patient.status}
                            </span>
                            {patient.bloodType ? (
                                <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                                    Blood: {patient.bloodType}
                                </span>
                            ) : (
                                <button 
                                    onClick={() => setIsEditMode(true)}
                                    className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-teal-100 hover:text-teal-700 transition-colors"
                                >
                                    <Plus size={12} /> Add Blood Type
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={() => setIsEditMode(true)}
                                className="w-full h-12 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-teal-200"
                            >
                                <Edit size={18} className="shrink-0" />
                                <span className="leading-none">Update Profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Critical Alerts */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <AlertCircle className="text-red-500" size={18} />
                                Medical Alerts
                            </h3>
                            <button 
                                onClick={() => setIsEditMode(true)}
                                className="text-teal-600 text-sm font-bold hover:underline"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Known Allergies</p>
                            {patient.allergies.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {patient.allergies.map((allergy, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                                            {allergy}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEditMode(true)}
                                    className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add allergies
                                </button>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chronic Conditions</p>
                            {patient.chronicConditions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {patient.chronicConditions.map((condition, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-sm font-medium">
                                            {condition}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEditMode(true)}
                                    className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add conditions
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Vitals Section */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <HeartPulse className="text-teal-600" size={24} />
                                Current Vitals
                            </h3>
                            <span className="text-xs text-slate-400">Last updated: {vitals.updatedAt}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ClickableVitalCard 
                                icon={Weight} 
                                label="Weight" 
                                value={vitals.weight} 
                                color="text-blue-600" 
                                bg="bg-blue-50"
                                onClick={() => setIsEditMode(true)}
                            />
                            <ClickableVitalCard 
                                icon={Ruler} 
                                label="Height" 
                                value={vitals.height} 
                                color="text-indigo-600" 
                                bg="bg-indigo-50"
                                onClick={() => setIsEditMode(true)}
                            />
                            <ClickableVitalCard 
                                icon={Activity} 
                                label="BMI" 
                                value={vitals.bmi} 
                                color="text-emerald-600" 
                                bg="bg-emerald-50" 
                                status="Normal"
                                onClick={() => setIsEditMode(true)}
                            />
                            <ClickableVitalCard 
                                icon={HeartPulse} 
                                label="Heart Rate" 
                                value={vitals.heartRate} 
                                color="text-rose-600" 
                                bg="bg-rose-50"
                                onClick={() => setIsEditMode(true)}
                            />
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <User className="text-teal-600" size={24} />
                                Personal Information
                            </h3>
                            <button 
                                onClick={() => setIsEditMode(true)}
                                className="text-teal-600 font-bold text-sm hover:underline flex items-center gap-1"
                            >
                                <Edit size={14} /> Edit All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <ClickableInfoRow label="Full Name" value={patient.fullName} icon={User} section="personal" />
                            <ClickableInfoRow label="Date of Birth" value={patient.dateOfBirth} icon={Calendar} section="personal" />
                            <ClickableInfoRow label="Gender" value={patient.gender} icon={User} section="personal" />
                            <ClickableInfoRow label="Email Address" value={patient.email} icon={Mail} section="contact" />
                            <ClickableInfoRow label="Phone Number" value={patient.phone} icon={Phone} section="contact" />
                            <ClickableInfoRow label="Address" value={patient.address} icon={MapPin} section="contact" />
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <ClickableInfoRow 
                                label="Emergency Contact" 
                                value={patient.emergencyContact} 
                                icon={AlertCircle}
                                section="contact"
                            />
                        </div>
                    </div>

                    {/* Medical History Timeline */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Clock className="text-teal-600" size={24} />
                                Medical History
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
                                        <div className={`w-8 h-8 rounded-full border-4 border-white z-10 flex items-center justify-center shrink-0 shadow-sm ${
                                            record.type === 'Emergency' ? 'bg-red-500' :
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
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                    record.status === 'Resolved' || record.status === 'Completed' || record.status === 'Dispensed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
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

                </div>
            </div>
        </div>
    );
};

export default PatientViewProfile;