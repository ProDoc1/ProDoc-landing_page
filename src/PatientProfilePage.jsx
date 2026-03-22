import React, { useState, useEffect } from 'react';
import { User, Activity, FileText, MapPin, Loader2, ShieldCheck, ChevronDown, Eye, ArrowLeft } from 'lucide-react';
import { decryptFile, getMimeTypeFromUrl } from './utils/cryptoDetails';

const PatientProfilePage = ({ requestData, onBack }) => {
  const [patientRecords, setPatientRecords] = useState([]);
  const [loadingPatientRecords, setLoadingPatientRecords] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (requestData && requestData.patientId) {
      setLoadingPatientRecords(true);
      fetch(`/api/medical-records?patientId=${requestData.patientId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPatientRecords(data);
          }
        })
        .catch(err => console.error("Error fetching patient records:", err))
        .finally(() => setLoadingPatientRecords(false));
    }
  }, [requestData]);

  const handleViewDocument = async (recordUrl, patientEmail, originalFileName, status) => {
    try {
      if (recordUrl.endsWith('.gpg') || originalFileName?.endsWith('.gpg') || status === 'Encrypted') {
        let privateKey = null;
        if (patientEmail) {
          privateKey = localStorage.getItem(`private_key_${patientEmail}`);
        }

        if (!privateKey) {
          const canUsePrompt = import.meta?.env?.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          if (canUsePrompt) {
            const manualKey = prompt("Patient's private key not detected in this browser session. For this demo, please paste the Patient's private key:");
            if (manualKey) {
              privateKey = manualKey;
            } else {
              alert("Cannot decrypt without the patient's private key.");
              return;
            }
          } else {
            alert("Patient's private key not available in this browser session. Please request access from the patient or use the patient's account to view records.");
            return;
          }
        }

        const response = await fetch(`/api/proxy-blob?url=${encodeURIComponent(recordUrl)}`);
        const encryptedBlob = await response.blob();

        const mimeType = getMimeTypeFromUrl(originalFileName || recordUrl);
        const decryptedBlob = await decryptFile(encryptedBlob, privateKey, '', mimeType);
        const localUrl = URL.createObjectURL(decryptedBlob);
        window.open(localUrl);
      } else {
        const mimeType = getMimeTypeFromUrl(originalFileName || recordUrl);
        window.open(`/api/proxy-blob?url=${encodeURIComponent(recordUrl)}&type=${encodeURIComponent(mimeType)}&disposition=inline`, '_blank');
      }
    } catch (error) {
      console.error("Decryption failed:", error);
      alert("Failed to decrypt report.");
    }
  };

  if (!requestData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <p className="text-slate-500 mb-4">No patient data available.</p>
        <button onClick={onBack} className="px-6 py-2 bg-teal-600 text-white rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 pt-36 md:pt-44 lg:pt-48 font-sans">
      <div className="max-w-4xl mx-auto px-4 w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col animate-scaleIn">
          <div className="p-6 md:p-10 bg-gradient-to-r from-teal-700 to-teal-600 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
                <User size={32} />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{requestData.patientName}'s Profile</h2>
                <p className="text-teal-100/80 text-sm mt-1">Patient Details & Medical History</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-10 space-y-10 bg-slate-50">

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 bg-teal-50 rounded-3xl flex items-center justify-center text-teal-600 shadow-inner border border-teal-100 shrink-0 mx-auto md:mx-0">
                <User size={56} />
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold shadow-sm border border-slate-200">
                    Age: {requestData.age}
                  </span>
                  <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold shadow-sm border border-slate-200">
                    Gender: {requestData.gender}
                  </span>
                  <span className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold shadow-sm border border-rose-100">
                    Blood: {requestData.bloodGroup || 'N/A'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Contact</p>
                      <p className="text-base font-semibold text-slate-700">{requestData.contact || 'Not Provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Email</p>
                      <p className="text-base font-semibold text-slate-700">{requestData.email || 'Not Provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Address</p>
                      <p className="text-base font-semibold text-slate-700">{requestData.address || 'Not Provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pb-4">
              <h4 className="text-base font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity size={20} className="text-teal-600" /> Patient Medical Shared Records
              </h4>

              {loadingPatientRecords ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-teal-500" size={40} />
                </div>
              ) : patientRecords.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl border 2 border-dashed border-slate-200 text-center">
                  <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-500 font-medium text-base">No medical records uploaded by this patient yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {patientRecords.map((record) => (
                    <div key={record.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-teal-200 transition-all group">
                      <div
                        className="p-5 flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${record.type === 'lab' ? 'bg-rose-50 text-rose-500' :
                            record.type === 'prescription' ? 'bg-emerald-50 text-emerald-500' :
                              record.type === 'scan' ? 'bg-blue-50 text-blue-500' :
                                'bg-purple-50 text-purple-500'
                            }`}>
                            <FileText size={24} />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-800 text-base truncate">{record.title}</h5>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                              <span>{record.type}</span>
                              <span>•</span>
                              <span>{record.reportDate}</span>
                              <span>•</span>
                              <span className="text-teal-500 flex items-center gap-1">
                                <ShieldCheck size={12} /> {record.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500 transition-all ${expandedRecord === record.id ? 'rotate-180 bg-teal-50 text-teal-500' : ''}`}>
                          <ChevronDown size={20} />
                        </div>
                      </div>

                      {expandedRecord === record.id && (
                        <div className="px-5 pb-5 pt-3 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleViewDocument(record.url, requestData?.email, record.title, record.status)}
                              className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors shadow-sm"
                            >
                              <Eye size={18} /> View Document
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;
