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
    ShieldCheck,
    Edit,
    Eye
} from 'lucide-react';

const PatientViewProfile = ({ patientId, onBack, onNavigate }) => {
    // Mock Data - In a real app, this would be fetched based on patientId
    const [patient] = useState({
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

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">

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
                            <h1 className="text-2xl font-bold text-slate-800">Patient Profile</h1>
                            <p className="text-slate-500 text-sm">ID: {patient.id}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all">
                            <Share2 size={18} /> Share Record
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200">
                            <MessageSquare size={18} /> Message Patient
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar: Patient Identity & Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal-500 to-teal-600"></div>

                        <div className="relative mt-12 mb-4">
                            <div className="w-28 h-28 bg-white rounded-full mx-auto p-1 shadow-md">
                                <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-4xl font-bold">
                                    {patient.fullName.charAt(0)}
                                </div>
                            </div>
                            <span className="absolute bottom-2 right-1/2 translate-x-12 bg-green-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800">{patient.fullName}</h2>
                        <p className="text-slate-500 mb-4">{patient.age} Years • {patient.gender}</p>

                        <div className="flex justify-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold flex items-center gap-1">
                                <Activity size={12} /> {patient.status}
                            </span>
                            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                                Blood: {patient.bloodType}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-200">
                                <Stethoscope size={18} /> Start Consultation
                            </button>
                            <button className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                <Plus size={18} /> Add Prescription
                            </button>
                        </div>
                    </div>

                    {/* Critical Alerts */}
                    {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertCircle className="text-red-500" size={18} />
                                Critical Alerts
                            </h3>

                            {patient.allergies.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Known Allergies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.allergies.map((allergy, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                                                {allergy}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {patient.chronicConditions.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chronic Conditions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.chronicConditions.map((condition, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-sm font-medium">
                                                {condition}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
                            <button className="text-teal-600 font-bold text-sm hover:underline flex items-center gap-1">
                                <Edit size={14} /> Update Vitals
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <VitalCard icon={Weight} label="Weight" value={vitals.weight} color="text-blue-600" bg="bg-blue-50" />
                            <VitalCard icon={Ruler} label="Height" value={vitals.height} color="text-indigo-600" bg="bg-indigo-50" />
                            <VitalCard icon={Activity} label="BMI" value={vitals.bmi} color="text-emerald-600" bg="bg-emerald-50" status="Normal" />
                            <VitalCard icon={HeartPulse} label="Heart Rate" value={vitals.heartRate} color="text-rose-600" bg="bg-rose-50" />
                            <div className="col-span-2 md:col-span-4 lg:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Last Updated</p>
                                <p className="text-slate-800 font-medium">{vitals.updatedAt}</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <User className="text-teal-600" size={24} />
                                Personal Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoRow label="Full Name" value={patient.fullName} icon={User} />
                            <InfoRow label="Date of Birth" value={patient.dateOfBirth} icon={Calendar} />
                            <InfoRow label="Gender" value={patient.gender} icon={User} />
                            <InfoRow label="Email Address" value={patient.email} icon={Mail} />
                            <InfoRow label="Phone Number" value={patient.phone} icon={Phone} />
                            <InfoRow label="Address" value={patient.address} icon={MapPin} />
                            <div className="md:col-span-2 pt-4 border-t border-slate-100">
                                <InfoRow label="Emergency Contact" value={patient.emergencyContact} icon={AlertCircle} highlight />
                            </div>
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
                                View Full Records <Eye size={14} />
                            </button>
                        </div>

                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200"></div>

                            <div className="space-y-8">
                                {medicalHistory.map((record, index) => (
                                    <div key={record.id} className="relative flex gap-6 group">
                                        {/* Timeline Dot */}
                                        <div className={`w-8 h-8 rounded-full border-4 border-white z-10 flex items-center justify-center shrink-0 shadow-sm ${record.type === 'Emergency' ? 'bg-red-500' :
                                            record.type === 'Lab Report' ? 'bg-blue-500' :
                                                record.type === 'Prescription' ? 'bg-amber-500' : 'bg-teal-500'
                                            }`}>
                                            {record.type === 'Emergency' && <AlertCircle size={14} className="text-white" />}
                                            {record.type === 'Lab Report' && <FileText size={14} className="text-white" />}
                                            {record.type === 'Prescription' && <FileText size={14} className="text-white" />}
                                            {record.type === 'Consultation' && <Stethoscope size={14} className="text-white" />}
                                        </div>

                                        {/* Content Card */}
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
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                                {record.type === 'Lab Report' && (
                                                    <button className="text-teal-600 text-sm font-bold hover:underline flex items-center gap-1">
                                                        <Download size={14} /> Download Report
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

// Sub-components for internal structure to keep code clean

const VitalCard = ({ icon: Icon, label, value, color, bg, status }) => (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center text-center hover:border-teal-200 hover:shadow-sm transition-all">
        <div className={`${bg} ${color} w-10 h-10 rounded-full flex items-center justify-center mb-2`}>
            <Icon size={20} />
        </div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
        {status && (
            <span className="text-[10px] font-bold uppercase text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded-full">
                {status}
            </span>
        )}
    </div>
);

const InfoRow = ({ label, value, icon: Icon, highlight }) => (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${highlight ? 'bg-amber-50 border border-amber-100' : ''}`}>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-sm font-medium ${highlight ? 'text-amber-900' : 'text-slate-700'}`}>{value}</p>
        </div>
    </div>
);

export default PatientViewProfile;