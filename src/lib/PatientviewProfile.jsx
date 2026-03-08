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
    ArrowLeft,
    FileText,
    Clock,
    Plus,
    Stethoscope,
    Edit,
    ChevronRight
} from 'lucide-react';
import EditProfileModal from '../EditProfileModal';  // Fixed import path

const PatientViewProfile = ({ 
    user, 
    onBack, 
    onNavigate,
    onSaveProfile 
}) => {
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Use the same data structure as PatientDashboard
    const [patient, setPatient] = useState(user || {
        id: "PT-2024-001",
        fullName: "John Doe",
        dateOfBirth: "1990-05-15",
        age: 34,
        gender: "Male",
        email: "john@example.com",
        phone: "+94 77 123 4567",
        address: "123 Galle Road, Colombo 03",
        bloodType: "O+",
        emergencyContact: "Jane Doe: +94 77 987 6543",
        allergies: ["Penicillin", "Peanuts"],
        chronicConditions: ["Hypertension"],
        status: "Active"
    });

    const [vitals] = useState({
        height: "175 cm",
        weight: "70 kg",
        bmi: "22.9",
        bloodPressure: "120/80 mmHg",
        heartRate: "72 bpm",
        updatedAt: "Today, 09:30 AM"
    });

    const [medicalHistory] = useState([
        { id: 1, date: "2023-10-15", type: "Consultation", doctor: "Dr. Sarah Perera", notes: "Routine checkup. BP slightly elevated.", status: "Completed" },
        { id: 2, date: "2023-08-10", type: "Lab Report", doctor: "Dr. Sunil Jayawardena", notes: "Full Blood Count - Normal Range.", status: "Reviewed" },
        { id: 3, date: "2023-05-20", type: "Prescription", doctor: "Dr. Sarah Perera", notes: "Medication refill.", status: "Dispensed" },
    ]);

   useEffect(() => {
  if (user) {
    setPatient(user);
  }
}, [user]);

const handleSave = async (formData) => {
  try {
    const patientId = patient.id;
    
    const response = await fetch('/api/patient/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        ...formData
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save profile');
    }

    const result = await response.json();
    
    // Update local state
    setPatient(prev => ({ ...prev, ...formData }));
    
    // Notify parent component
    if (onSaveProfile) {
      await onSaveProfile(formData);
    }
  } catch (error) {
    console.error('Failed to save:', error);
    throw error;
  }
};
    // Clickable Info Row Component
    const ClickableInfoRow = ({ label, value, icon: Icon, highlight }) => {
        const isEmpty = !value || value === '';
        
        return (
            <div 
                onClick={() => setIsEditMode(true)}
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

    // Clickable Vital Card
    const ClickableVitalCard = ({ icon: Icon, label, value, color, bg, status }) => (
        <div 
            onClick={() => setIsEditMode(true)}
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
            <EditProfileModal
                isOpen={isEditMode}
                onClose={() => setIsEditMode(false)}
                user={patient}
                onSave={handleSave}
            />

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
                                    {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : <User size={40} />}
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
                                    <Plus size={12} /> Add
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={() => setIsEditMode(true)}
                            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-200"
                        >
                            <Edit size={18} /> Update Profile
                        </button>
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
                            <ClickableVitalCard icon={Weight} label="Weight" value={vitals.weight} color="text-blue-600" bg="bg-blue-50" />
                            <ClickableVitalCard icon={Ruler} label="Height" value={vitals.height} color="text-indigo-600" bg="bg-indigo-50" />
                            <ClickableVitalCard icon={Activity} label="BMI" value={vitals.bmi} color="text-emerald-600" bg="bg-emerald-50" status="Normal" />
                            <ClickableVitalCard icon={HeartPulse} label="Heart Rate" value={vitals.heartRate} color="text-rose-600" bg="bg-rose-50" />
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
                            <ClickableInfoRow label="Full Name" value={patient.fullName} icon={User} />
                            <ClickableInfoRow label="Date of Birth" value={patient.dateOfBirth} icon={Calendar} />
                            <ClickableInfoRow label="Gender" value={patient.gender} icon={User} />
                            <ClickableInfoRow label="Email Address" value={patient.email} icon={Mail} />
                            <ClickableInfoRow label="Phone Number" value={patient.phone} icon={Phone} />
                            <ClickableInfoRow label="Address" value={patient.address} icon={MapPin} />
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <ClickableInfoRow 
                                label="Emergency Contact" 
                                value={patient.emergencyContact} 
                                icon={AlertCircle}
                                highlight
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