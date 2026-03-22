import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  FileText,
  LogOut,
  Activity,
  CheckCircle,
  Clock,
  Star,
  Pencil,
  X,
  Calendar,
  Verified,
  MapPin,
  Globe,
  Share2,
  Lock,
  Camera,
  Menu,
  PlusSquare,
  UploadCloud,
  Trash2,
  Newspaper,
  Loader2,
  User,
  Award,
  Briefcase,
  Save,
  AlertCircle,
  Download,
  Brain,
  Upload,
  Eye,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DoctorImg from './assets/doctor.png';
import { decryptFile, getMimeTypeFromUrl } from './utils/cryptoDetails';

const DoctorDashboard = ({
  user,
  onLogout,
  onNavigateAbout,
  onNavigateHome,
  onNavigateLogin,
  onNavigateSignupPage,
  onNavigateDoctors,
  onNavigateContentHub,
  onViewPatientProfile,
  hideNavbar
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // AI Assistant state
  const [aiFile, setAiFile] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Profile & Settings State
  const [isSecondOpinionEnabled, setIsSecondOpinionEnabled] = useState(true);
  const [availability, setAvailability] = useState("Mon, Wed, Fri");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeEditSection, setActiveEditSection] = useState('Personal');

  // Save Data State (New)
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  // Separate state for Available Dates save feedback
  const [dateSaveStatus, setDateSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'success' | 'error'

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  // local filter for doctor view: show all, ratings only, or reviews only
  const [reviewFilter, setReviewFilter] = useState('all');

  const [secondOpinionRequests, setSecondOpinionRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loadingPatientRecords, setLoadingPatientRecords] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  // Article State
  const [articleForm, setArticleForm] = useState({ content: '', image: null });
  const [articleStatus, setArticleStatus] = useState({ type: '', message: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [doctorPosts, setDoctorPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const articleImageRef = useRef(null);

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({ new: '', confirm: '' });
  const [pwdStatus, setPwdStatus] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  const [localUser, setLocalUser] = useState({
    id: user?.id || localStorage.getItem('doctorId'), // Ensure ID is captured
    fullName: user?.name || 'Doctor',
    email: user?.email,
    specialty: user?.specialty,
    bio: user?.bio,
    slmcNumber: user?.slmcNumber,
    location: user?.working_hospital || user?.location || 'Colombo, Sri Lanka',
    languages: user?.languages || '',
    sector: user?.department_type || '',
    qualifications: user?.educational_qualifications || '',
    experience: user?.years_of_experience || '',
    associatedHospitals: user?.associated_hospitals || [],
    image: user?.image_url || DoctorImg,
    average_rating: user?.average_rating || 0,
    rating_count: user?.rating_count || 0,
    email_verified: user?.email_verified || false
  });
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (user) {
      setLocalUser(prev => ({
        ...prev,
        id: user.id || prev.id,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        specialty: user.specialty || prev.specialty,
        bio: user.bio || prev.bio,
        slmcNumber: user.slmcNumber || prev.slmcNumber,
        location: user.location || user.working_hospital || prev.location,
        languages: user.languages || prev.languages,
        sector: user.sector || prev.sector,
        qualifications: user.educational_qualifications || prev.qualifications,
        experience: user.years_of_experience || prev.experience,
        associatedHospitals: user.associated_hospitals || prev.associatedHospitals,
        image: user.image_url || prev.image,
        email_verified: user.email_verified !== undefined ? user.email_verified : prev.email_verified
      }));
      // Also update second opinion state if present in user prop (though likely not)
      if (user.second_opinion_available !== undefined) {
        setIsSecondOpinionEnabled(user.second_opinion_available);
      }
      if (user.second_opinion_dates) {
        setAvailability(user.second_opinion_dates);
      }

      // Fetch Profile Views
      const dId = user.id || localStorage.getItem('doctorId');
      if (dId) {
        fetch(`/api/profile-views?doctorId=${dId}`)
          .then(res => res.json())
          .then(data => setViewCount(data.count || 0))
          .catch(err => console.error("Error fetching views:", err));
      }
    }
  }, [user]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const doctorId = localStorage.getItem('doctorId');

    if (role !== 'doctor') {
      onLogout();
    } else if (doctorId) {
      // Always fetch latest profile to get second opinion settings
      fetch(`/api/doctors?id=${doctorId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setLocalUser(prev => ({
              ...prev,
              id: doctorId,
              fullName: data.name || prev.fullName,
              email: data.email || prev.email,
              specialty: data.specialty || prev.specialty,
              bio: data.bio || prev.bio,
              slmcNumber: data.slmcNumber || prev.slmcNumber,
              location: data.location || data.working_hospital || prev.location,
              languages: data.languages || prev.languages,
              sector: data.department_type || data.sector || prev.sector,
              qualifications: data.educational_qualifications || prev.qualifications,
              experience: data.years_of_experience || prev.experience,
              associatedHospitals: data.associated_hospitals || prev.associatedHospitals,
              image: data.image_url || prev.image,
              average_rating: data.average_rating || 0,
              rating_count: data.rating_count || 0,
              email_verified: data.email_verified !== undefined ? data.email_verified : prev.email_verified
            }));
            // Initialize Second Opinion state from fetched data
            if (data.second_opinion_available !== undefined) {
              setIsSecondOpinionEnabled(data.second_opinion_available);
            }
            if (data.second_opinion_dates) {
              setAvailability(data.second_opinion_dates);
            }

            // Fetch Profile Views
            fetch(`/api/profile-views?doctorId=${doctorId}`)
              .then(res => res.json())
              .then(data => setViewCount(data.count || 0))
              .catch(err => console.error("Error fetching views:", err));
          }
        })
        .catch(err => console.error("Error fetching doctor profile:", err));
    }
  }, [onLogout, user]);

  useEffect(() => {
    if (activeTab === 'Reviews' && localUser.id) {
      setReviewsLoading(true);
      fetch(`/api/reviews?doctorId=${localUser.id}`)
        .then(res => res.json())
        .then(data => {
          setReviews(data);
        })
        .catch(err => console.error("Error fetching reviews:", err))
        .finally(() => setReviewsLoading(false));
    }

    if (activeTab === 'Second Opinions' && localUser.id) {
      setLoadingRequests(true);
      fetch(`/api/second-opinion-requests?doctorId=${localUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSecondOpinionRequests(data);
          }
        })
        .catch(err => console.error("Error fetching second opinion requests:", err))
        .finally(() => setLoadingRequests(false));
    }

    if ((activeTab === 'Create' || activeTab === 'Dashboard' || activeTab === 'Articles') && localUser.id) {
      fetchDoctorPosts();
    }
  }, [activeTab, localUser.id]);

  useEffect(() => {
    if (selectedPatientProfile && selectedPatientProfile.patientId) {
      setLoadingPatientRecords(true);
      fetch(`/api/medical-records?patientId=${selectedPatientProfile.patientId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPatientRecords(data);
          }
        })
        .catch(err => console.error("Error fetching patient records:", err))
        .finally(() => setLoadingPatientRecords(false));
    } else {
      setPatientRecords([]);
      setExpandedRecord(null);
    }
  }, [selectedPatientProfile?.patientId]);


  const fetchDoctorPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch(`/api/manage-doctor-posts?doctor_id=${localUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setDoctorPosts(data);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoadingPosts(false);

    }
  };

  const handleViewDocument = async (recordUrl, patientEmail, originalFileName) => {
    try {
      if (recordUrl.endsWith('.gpg') || originalFileName?.endsWith('.gpg')) {
        let privateKey = null;
        if (patientEmail) {
          privateKey = localStorage.getItem(`private_key_${patientEmail}`);
        }

        if (!privateKey) {
          const manualKey = prompt("Patient's private key not detected in this browser session. In a production app, the patient would grant access using the Doctor's public key. For this demo, please paste the Patient's private key:");
          if (manualKey) {
            privateKey = manualKey;
          } else {
            alert("Cannot decrypt without the patient's private key.");
            return;
          }
        }

        const response = await fetch(`/api/proxy-blob?url=${encodeURIComponent(recordUrl)}`);
        const encryptedBlob = await response.blob();

        // Find correct MIME Type so images open as images, PDFs as PDFs
        const mimeType = getMimeTypeFromUrl(originalFileName || recordUrl);

        // Removed the password prompt for a smoother demo experience
        const decryptedBlob = await decryptFile(encryptedBlob, privateKey, '', mimeType);
        const localUrl = URL.createObjectURL(decryptedBlob);
        window.open(localUrl);
      } else {
        window.open(`/api/proxy-blob?url=${encodeURIComponent(recordUrl)}`, '_blank');
      }
    } catch (error) {
      console.error("Decryption failed:", error);
      alert("Failed to decrypt report. Ensure the private key and password are correct.");
    }
  };

  // --- UPDATED: Handle Profile Save to Backend ---
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });

    try {
      // 1. Prepare data payload
      const payload = {
        id: localUser.id,
        name: localUser.fullName,
        specialty: localUser.specialty,
        slmcNumber: localUser.slmcNumber,
        location: localUser.location,
        languages: localUser.languages,
        department_type: localUser.sector,
        educational_qualifications: localUser.qualifications,
        years_of_experience: localUser.experience,
        associated_hospitals: JSON.stringify(
          Array.isArray(localUser.associatedHospitals)
            ? localUser.associatedHospitals.map(h => typeof h === 'object' ? h : { name: h, type: "Consulting Physician" })
            : typeof localUser.associatedHospitals === 'string'
              ? localUser.associatedHospitals.split(',').filter(Boolean).map(h => ({ name: h.trim(), type: "Consulting Physician" }))
              : []
        ),
        image_url: localUser.image,
        bio: localUser.bio
      };

      // 2. Send request to backend
      const response = await fetch('/api/doctors', {
        method: 'PUT', // or 'POST' depending on your API
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Add if using JWT
        },
        body: JSON.stringify(payload),
      });

      // Some backends return no body (204) or return plain text — guard against empty/non-JSON responses
      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        // Not JSON — keep raw text available for error messages
        console.warn('Could not parse JSON response from update-doctor-profile:', parseErr);
      }

      if (response.ok) {
        setSaveStatus({ type: 'success', message: data?.message || 'Profile updated successfully!' });

        // Close modal after delay
        setTimeout(() => {
          setIsEditingProfile(false);
          setSaveStatus({ type: '', message: '' });
        }, 1500);
      } else {
        const errMsg = data?.error || text || response.statusText || 'Failed to update profile.';
        setSaveStatus({ type: 'error', message: errMsg });
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus({ type: 'error', message: 'Network connection error.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdStatus({ type: '', message: '' });

    if (passwordForm.new !== passwordForm.confirm) {
      setPwdStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    try {
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id || localStorage.getItem('doctorId'),
          newPassword: passwordForm.new
        }),
      });

      if (response.ok) {
        setPwdStatus({ type: 'success', message: 'Password updated successfully!' });
        setPasswordForm({ new: '', confirm: '' });
      } else {
        const errData = await response.json();
        setPwdStatus({ type: 'error', message: errData.error || 'Failed to update.' });
      }
    } catch (error) {
      setPwdStatus({ type: 'error', message: 'Failed to update password.' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalUser(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSecondOpinionSettings = async (updates) => {
    try {
      const response = await fetch('/api/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: localUser.id,
          ...updates
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update second opinion settings");
      }
      return true;
    } catch (error) {
      console.error("Error updating second opinion settings:", error);
      return false;
    }
  };

  const handleDateSave = async () => {
    setDateSaveStatus('saving');
    const success = await updateSecondOpinionSettings({ second_opinion_dates: availability });
    if (success) {
      setDateSaveStatus('success');
      setTimeout(() => setDateSaveStatus('idle'), 2000);
    } else {
      setDateSaveStatus('error');
      setTimeout(() => setDateSaveStatus('idle'), 3000);
    }
  };

  const handleArticleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticleForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiAnalysis = async (e) => {
    e.preventDefault();
    if (!aiFile && !aiReport) return;
    setAiLoading(true);
    setAiError('');
    setAiResult(null);
    const fd = new FormData();
    fd.append('medical_image', aiFile);
    fd.append('doctorId', localStorage.getItem('doctorId'));
    if (aiReport) fd.append('report_file', aiReport);
    try {
      const res = await fetch('/api/ai-analyze', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setAiResult(data);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const publishArticle = async (e) => {
    e.preventDefault();
    if (!articleForm.content || !articleForm.image) {
      setArticleStatus({ type: 'error', message: 'Both an image and content are required.' });
      return;
    }
    setIsPublishing(true);
    setArticleStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/manage-doctor-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: localUser.id,
          full_name: localUser.fullName,
          specialty: localUser.specialty,
          image_url: localUser.image,
          post_content: articleForm.content,
          post_image: articleForm.image
        })
      });

      const data = await response.json();
      if (response.ok) {
        setArticleStatus({ type: 'success', message: 'Article published successfully!' });
        setArticleForm({ content: '', image: null });
        fetchDoctorPosts(); // Refresh list automatically
        setTimeout(() => setArticleStatus({ type: '', message: '' }), 5000);
      } else {
        setArticleStatus({ type: 'error', message: data.error || 'Failed to publish article.' });
      }
    } catch (error) {
      setArticleStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;

    try {
      const response = await fetch('/api/manage-doctor-posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, doctor_id: localUser.id })
      });
      if (response.ok) {
        setDoctorPosts(doctorPosts.filter(post => post.post_id !== postId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to the server while trying to delete.');
    }
  };

  const handleReport = (reviewId) => {
    console.log(`Reporting review ${reviewId}`);
    alert("Report submitted to administration.");
  };

  const professionalStats = [
    { label: "Profile Views", value: viewCount.toLocaleString(), icon: <Activity className="text-teal-600" />, color: "bg-teal-100" },
    { label: "Patient Rating", value: `${Number(localUser.average_rating || 0).toFixed(1)}/5`, subValue: `${localUser.rating_count || 0} reviews`, icon: <Star className="text-amber-500 fill-amber-500" />, color: "bg-amber-50" },
    { label: "Status", value: "Verified", icon: <Verified className="text-blue-600" />, color: "bg-blue-100" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 pt-36 md:p-8 md:pt-44 lg:pt-48 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mobile Dashboard Navigation */}
        <div className={`lg:hidden flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth -mx-4 px-4 sticky transition-all duration-300 z-30 bg-[#F8FAFC]/80 backdrop-blur-md ${hideNavbar ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100 top-20'}`}>
          {[
            { id: 'Dashboard', label: 'Dashboard', icon: <Activity size={18} /> },
            { id: 'Second Opinions', label: 'Second Opinions', icon: <FileText size={18} />, badge: secondOpinionRequests.length > 0 ? secondOpinionRequests.length : undefined },
            { id: 'Reviews', label: 'Reviews', icon: <Star size={18} /> },
            { id: 'Credential Vault', label: 'Credential Vault', icon: <ShieldCheck size={18} /> },
            { id: 'Create', label: 'Create Article', icon: <PlusSquare size={18} /> },
            { id: 'Articles', label: 'Articles', icon: <Newspaper size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-white text-slate-500 border border-slate-100 shadow-sm'}`}
            >
              {item.icon}
              {item.label}
              {item.badge !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${activeTab === item.id ? 'bg-white text-teal-600' : 'bg-teal-100 text-teal-600'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="whitespace-nowrap flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold bg-white text-rose-500 border border-slate-200 shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <aside className="lg:col-span-3 space-y-6 sticky top-44 h-fit hidden lg:block">
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 space-y-2">
            <NavItem
              icon={<Activity size={18} />}
              label="Dashboard"
              active={activeTab === 'Dashboard'}
              onClick={() => setActiveTab('Dashboard')}
            />
            <NavItem
              icon={<FileText size={18} />}
              label="Second Opinions"
              active={activeTab === 'Second Opinions'}
              badge={secondOpinionRequests.length > 0 ? secondOpinionRequests.length : undefined}
              onClick={() => setActiveTab('Second Opinions')}
            />
            <NavItem
              icon={<Star size={18} />}
              label="Reviews"
              active={activeTab === 'Reviews'}
              onClick={() => setActiveTab('Reviews')}
            />
            <NavItem
              icon={<ShieldCheck size={18} />}
              label="Credential Vault"
              active={activeTab === 'Credential Vault'}
              onClick={() => setActiveTab('Credential Vault')}
            />
            <NavItem
              icon={<PlusSquare size={18} />}
              label="Create Article"
              active={activeTab === 'Create'}
              onClick={() => setActiveTab('Create')}
            />
            <NavItem
              icon={<Newspaper size={18} />}
              label="Articles"
              active={activeTab === 'Articles'}
              onClick={() => setActiveTab('Articles')}
            />
            <NavItem
              icon={<Brain size={18} />}
              label="AI Assistant"
              active={activeTab === 'AI Assistant'}
              onClick={() => setActiveTab('AI Assistant')}
            />

            <div className="pt-4 mt-4 border-t border-slate-100">
              <NavItem
                icon={<LogOut size={18} className="text-rose-500" />}
                label="Logout"
                onClick={onLogout}
              />
            </div>
          </div>

          <div className="bg-teal-600 rounded-[2rem] p-6 text-white shadow-lg shadow-teal-900/10 relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Second Opinion</h3>
              <p className="text-teal-100 text-[11px] mb-4">Accepting requests: <span className="font-bold text-white">{isSecondOpinionEnabled ? 'YES' : 'NO'}</span></p>
              <button
                onClick={() => {
                  const newValue = !isSecondOpinionEnabled;
                  setIsSecondOpinionEnabled(newValue);
                  updateSecondOpinionSettings({ second_opinion_available: newValue });
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${isSecondOpinionEnabled ? 'bg-white text-teal-600' : 'bg-teal-500 text-white border border-teal-400'}`}
              >
                {isSecondOpinionEnabled ? 'Pause' : 'Resume'}
              </button>
            </div>
            <ShieldCheck className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {activeTab === 'Dashboard' ? (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center group hover:shadow-xl hover:shadow-teal-500/5 transition-all">
                  <div className="w-24 h-24 bg-teal-100 rounded-full mb-4 flex items-center justify-center text-teal-600 relative overflow-hidden ring-4 ring-slate-50">
                    <img src={localUser.image} alt={localUser.fullName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{localUser.fullName}</h3>
                  <p className="text-teal-600 text-sm font-bold uppercase tracking-wider mb-4">{localUser.specialty}</p>

                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {localUser.sector && (
                      <span className="bg-teal-50 text-teal-700 text-xs font-black uppercase px-3 py-1.5 rounded-xl border border-teal-100">
                        {localUser.sector} Sector
                      </span>
                    )}
                    {localUser.languages && (
                      <span className="bg-slate-50 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-100">
                        {localUser.languages}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full max-w-xs py-3 bg-slate-50 hover:bg-teal-600 hover:text-white text-slate-600 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-100 hover:border-teal-600 shadow-sm"
                  >
                    <Pencil size={18} /> Profile Settings
                  </button>
                </div>

                <div className="lg:col-span-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-[2.5rem] p-10 text-white shadow-lg relative overflow-hidden group min-h-[260px] flex flex-col justify-center">
                  <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Welcome, {localUser.fullName}!</h2>
                    <p className="text-teal-50/80 max-w-xl text-lg leading-relaxed">Manage your professional profile, publications, and patient interactions from your unified dashboard.</p>
                  </div>
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-110"></div>
                  <ShieldCheck size={200} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {professionalStats.map((stat, i) => (
                  <div key={i} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                        {stat.subValue && <span className="text-[11px] font-bold text-slate-400">{stat.subValue}</span>}
                      </div>
                    </div>
                    <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      {React.cloneElement(stat.icon, { size: 20 })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 transition-all border border-slate-100 mb-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shadow-inner">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">Working Hospitals</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Practice Locations</p>
                    </div>
                  </div>
                  <button onClick={() => setIsEditingProfile(true)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-sm transition-colors">
                    <PlusSquare size={16} /> Add
                  </button>
                </div>

                <div className="space-y-4">
                  {(() => {
                    let hospitals = [];
                    if (Array.isArray(localUser.associatedHospitals)) {
                      hospitals = localUser.associatedHospitals;
                    } else if (typeof localUser.associatedHospitals === 'string') {
                      try {
                        const parsed = JSON.parse(localUser.associatedHospitals);
                        if (Array.isArray(parsed)) hospitals = parsed;
                        else hospitals = localUser.associatedHospitals.split(',').map(h => h.trim()).filter(Boolean);
                      } catch (e) {
                        hospitals = localUser.associatedHospitals.split(',').map(h => h.trim()).filter(Boolean);
                      }
                    }

                    return hospitals.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {hospitals.map((hospital, i) => (
                          <div key={i} className="group relative overflow-hidden flex items-start gap-4 p-5 bg-white rounded-[1.5rem] border border-slate-200 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300">
                            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                            <div className="p-2.5 bg-teal-50/50 rounded-xl text-teal-500 shrink-0">
                              <MapPin size={20} />
                            </div>
                            <div className="flex flex-col justify-center">
                              <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-teal-700 transition-colors">
                                {typeof hospital === 'object' ? (hospital.name || hospital.hospital || 'Hospital') : hospital}
                              </h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1.5">
                                {typeof hospital === 'object' && hospital.type ? hospital.type : "Consulting Physician"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <MapPin size={40} className="text-slate-300 mx-auto mb-4" />
                        <h4 className="text-slate-700 font-bold mb-1">No Practice Locations</h4>
                        <p className="text-slate-500 text-sm mb-4">You haven't added any associated hospitals yet.</p>
                        <button onClick={() => setIsEditingProfile(true)} className="px-6 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-bold text-teal-600 hover:text-teal-700 hover:border-teal-200 transition-all">
                          Add Your First Hospital
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-8 pb-10">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 transition-all border border-slate-100 flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shadow-inner">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">Professional Brief</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Background & Expertise</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <section className="bg-slate-50/50 rounded-[2rem] p-6 md:p-8 border border-slate-100">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <User size={14} /> About / Bio
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                        {localUser.bio || <span className="italic text-slate-400">No bio added yet. Provide details about your career journey.</span>}
                      </p>
                    </section>

                    <section className="bg-slate-50/50 rounded-[2rem] p-6 md:p-8 border border-slate-100">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Award size={14} /> Qualifications & Credentials
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {localUser.qualifications ? localUser.qualifications.split(',').map((q, i) => (
                          <span key={i} className="px-4 py-2 bg-white text-teal-700 rounded-xl text-sm font-bold border border-teal-100/50 shadow-sm hover:border-teal-300 transition-colors cursor-default">
                            {q.trim()}
                          </span>
                        )) : (
                          <span className="text-slate-400 text-sm italic font-medium">No qualifications listed.</span>
                        )}
                      </div>
                    </section>
                  </div>
                </div>


              </div>
            </div>
          ) : activeTab === 'Second Opinions' ? (
            <div className="animate-slideUp max-w-5xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden h-fit">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl shrink-0">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-none mb-1">Status</h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isSecondOpinionEnabled ? 'text-teal-500' : 'text-slate-400'}`}>
                          {isSecondOpinionEnabled ? 'Active' : 'Paused'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newValue = !isSecondOpinionEnabled;
                        setIsSecondOpinionEnabled(newValue);
                        updateSecondOpinionSettings({ second_opinion_available: newValue });
                      }}
                      className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 ${isSecondOpinionEnabled ? 'bg-teal-500' : 'bg-slate-200'}`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isSecondOpinionEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {isSecondOpinionEnabled && (
                    <div className="pt-4 border-t border-slate-100 animate-scaleIn relative z-10">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Consultation Days
                      </label>
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input
                            type="text"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 font-bold"
                            placeholder="e.g. Mon, Wed"
                          />
                        </div>
                        <button
                          onClick={handleDateSave}
                          disabled={dateSaveStatus === 'saving'}
                          className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center ${dateSaveStatus === 'success' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-teal-600 text-white hover:bg-teal-700'} disabled:opacity-50`}
                        >
                          {dateSaveStatus === 'saving' ? <Loader2 size={14} className="animate-spin" /> : dateSaveStatus === 'success' ? 'Saved' : 'Save Days'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100 mb-0 w-full">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-teal-100 rounded-2xl text-teal-600">
                        <FileText size={32} />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">Second Opinion Requests</h3>
                          <p className="text-slate-500 text-sm">Review cases and provide advice</p>
                        </div>
                        <div className="bg-amber-50 px-4 py-2 rounded-full hidden md:block border border-amber-200">
                          <span className="text-amber-700 font-bold text-sm">{secondOpinionRequests.filter(r => r.status === 'Pending').length} Pending</span>
                        </div>
                      </div>
                    </div>

                    {loadingRequests ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin text-teal-500 max-w-full" size={32} />
                      </div>
                    ) : secondOpinionRequests.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-slate-500 text-sm">No second opinion requests available.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {secondOpinionRequests.map(request => (
                          <div key={request.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative shadow-sm hover:shadow-md transition-shadow group">
                            <div className="mb-4 flex flex-wrap justify-between items-start gap-4">
                              <div>
                                <h4 className="text-lg font-bold text-slate-800">{request.patientName}</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  {request.age} yrs • {request.gender} • {request.dateRequired}
                                </p>
                              </div>
                              <button
                                onClick={() => setSelectedPatientProfile(request)}
                                className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-teal-100 shadow-sm"
                              >
                                <User size={14} /> View Profile
                              </button>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 mb-4">
                              <p className="text-sm text-slate-700 leading-relaxed font-medium line-clamp-2">
                                <span className="font-bold text-slate-800 mr-2">Case Summary:</span>
                                {request.summary}
                              </p>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                              <button className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors shadow-md shadow-teal-200 flex items-center gap-2">
                                Review Case
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Articles' ? (
            <div className="animate-slideUp max-w-4xl mx-auto w-full">
              <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-100 mb-4 w-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-teal-100 rounded-2xl text-teal-600">
                    <Newspaper size={32} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Your Published Articles</h3>
                      <p className="text-slate-500 text-sm">Manage the articles you've shared</p>
                    </div>
                    <div className="bg-teal-50 px-4 py-2 rounded-full hidden md:block">
                      <span className="text-teal-700 font-bold text-sm">{doctorPosts.length} Articles</span>
                    </div>
                  </div>
                </div>

                {loadingPosts ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-teal-500 max-w-full" size={32} />
                  </div>
                ) : doctorPosts.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-500 text-sm">You haven't published any articles yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctorPosts.map(post => (
                      <div key={post.post_id} className="flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors group">
                        {post.post_image && (
                          <div className="w-full md:w-40 h-32 flex-shrink-0 bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
                            <img src={post.post_image.replace(/^\.\//, '/')} alt="Thumbnail" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-2">
                              {new Date(post.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-slate-700 text-sm line-clamp-3">
                              {post.post_content}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                              <span>❤️ {post.likes_count || 0}</span>
                              <span>💬 {post.comments_count || 0}</span>
                            </div>
                            <button
                              onClick={() => handleDeletePost(post.post_id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'Reviews' ? (
            <div className="animate-slideUp max-w-5xl mx-auto w-full">
              <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-100 flex flex-col items-center">
                <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-teal-500/20 text-teal-500 rounded-2xl">
                      <Star size={32} className="fill-teal-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Patient Reviews</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Feedback from your patients</p>
                    </div>
                  </div>
                </div>

                {reviewsLoading ? (
                  <div className="py-20 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-teal-500" size={40} />
                    <p className="text-slate-400 font-bold text-sm animate-pulse">Fetching latest patient feedback...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="w-full py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center px-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
                      <Star size={32} className="text-slate-200" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-700 mb-2">No Reviews Yet</h4>
                    <p className="text-slate-500 max-w-sm leading-relaxed">As you consult more patients, your reviews and ratings will appear here.</p>
                  </div>
                ) : (
                  <div className="w-full space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="group bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-x-12 -translate-y-12 opacity-50 group-hover:bg-teal-50 transition-colors"></div>

                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                          <div className="flex flex-col items-center md:items-start shrink-0">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3 border border-slate-100 group-hover:border-teal-200 transition-colors overflow-hidden">
                              {review.patientImage ? (
                                <img src={review.patientImage} alt={review.patientName} className="w-full h-full object-cover" />
                              ) : (
                                <User size={30} />
                              )}
                            </div>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div>
                                <h4 className="font-black text-slate-800 text-lg leading-none mb-1.5">{review.patientName}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                              <button
                                onClick={() => handleReport(review.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest flex items-center gap-1.5"
                              >
                                <AlertTriangle size={14} /> Report
                              </button>
                            </div>

                            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 italic">
                              <p className="text-slate-600 leading-relaxed font-medium">"{review.comment}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'Credential Vault' ? (
            <div className="animate-slideUp max-w-3xl mx-auto w-full">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Credential Vault</h3>
                    <p className="text-sm text-slate-400 mt-0.5">Update your security and professional status</p>
                  </div>
                </div>

                {/* Security Settings Card */}
                <div className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Lock size={18} className="text-teal-600" />
                    <h4 className="font-bold text-slate-800">Security Settings</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.new}
                        onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-sm text-slate-800 focus:outline-none focus:border-teal-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-sm text-slate-800 focus:outline-none focus:border-teal-500 transition-all"
                      />
                    </div>

                    {pwdStatus.message && (
                      <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${pwdStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                        {pwdStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {pwdStatus.message}
                      </div>
                    )}

                    <button
                      onClick={async () => {
                        if (!passwordForm.new || !passwordForm.confirm) {
                          setPwdStatus({ type: 'error', message: 'Please fill in both fields.' });
                          return;
                        }
                        if (passwordForm.new !== passwordForm.confirm) {
                          setPwdStatus({ type: 'error', message: 'Passwords do not match.' });
                          return;
                        }
                        setPwdStatus({ type: '', message: '' });
                        try {
                          const res = await fetch('/api/update-password', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              doctor_id: localUser.id,
                              new_password: passwordForm.new
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setPwdStatus({ type: 'success', message: 'Password updated successfully!' });
                            setPasswordForm({ new: '', confirm: '' });
                          } else {
                            setPwdStatus({ type: 'error', message: data.error || 'Failed to update password.' });
                          }
                        } catch {
                          setPwdStatus({ type: 'error', message: 'Connection error. Please try again.' });
                        }
                      }}
                      className="w-full mt-2 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-600/20 active:scale-[0.98]"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>) : activeTab === 'Create' ? (
              <div className="animate-slideUp max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-100 flex flex-col w-full">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-100">
                      <PlusSquare size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Create Article</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Share knowledge with the ProDoc community</p>
                    </div>
                  </div>

                  <form onSubmit={publishArticle} className="space-y-8">
                    <div
                      onClick={() => articleImageRef.current?.click()}
                      className={`relative w-full aspect-video rounded-[2.5rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden cursor-pointer group ${articleForm.image ? 'border-teal-500 bg-teal-50' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-teal-200'}`}
                    >
                      <input type="file" ref={articleImageRef} onChange={handleArticleImage} className="hidden" accept="image/*" />
                      {articleForm.image ? (
                        <>
                          <img src={articleForm.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-black text-xs uppercase tracking-widest">Change Cover Image</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4 p-8">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-slate-400 flex items-center justify-center group-hover:text-teal-500 transition-colors">
                            <UploadCloud size={32} />
                          </div>
                          <div className="text-center">
                            <p className="text-slate-800 font-bold mb-1">Upload a Cover Image</p>
                            <p className="text-slate-400 text-xs font-medium">Recommended: 1200 x 630px (Max 2MB)</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        Article Content
                      </label>
                      <textarea
                        value={articleForm.content}
                        onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        placeholder="Share your medical expertise, latest research insights, or health tips..."
                        className="w-full h-64 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-slate-700 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-200 transition-all resize-none shadow-inner"
                      />
                    </div>

                    {articleStatus.message && (
                      <div className={`p-5 rounded-2xl animate-fadeIn flex items-center gap-4 ${articleStatus.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                        {articleStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm font-bold">{articleStatus.message}</p>
                      </div>
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isPublishing}
                        className="group px-10 py-5 bg-teal-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                      >
                        {isPublishing ? <Loader2 className="animate-spin" size={20} /> : <><Share2 size={20} className="group-hover:rotate-12 transition-transform" /> Publish Article</>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : activeTab === 'AI Assistant' ? (
              <AiAssistantPanel
                onSubmit={handleAiAnalysis}
                loading={aiLoading}
                result={aiResult}
                error={aiError}
                aiFile={aiFile}
                aiReport={aiReport}
                onFileChange={setAiFile}
                onReportChange={setAiReport}
              />
            ) : null}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`absolute top-0 right-0 h-full w-80 bg-white p-8 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-800">Menu</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <NavItem icon={<Activity size={20} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setIsMobileMenuOpen(false); }} />
            <NavItem icon={<FileText size={20} />} label="Second Opinions" active={activeTab === 'Second Opinions'} onClick={() => { setActiveTab('Second Opinions'); setIsMobileMenuOpen(false); }} />
            <NavItem icon={<Star size={20} />} label="Reviews" active={activeTab === 'Reviews'} onClick={() => { setActiveTab('Reviews'); setIsMobileMenuOpen(false); }} />
            <NavItem icon={<ShieldCheck size={20} />} label="Credential Vault" active={activeTab === 'Credential Vault'} onClick={() => { setActiveTab('Credential Vault'); setIsMobileMenuOpen(false); }} />
            <NavItem icon={<PlusSquare size={20} />} label="Create Article" active={activeTab === 'Create'} onClick={() => { setActiveTab('Create'); setIsMobileMenuOpen(false); }} />
            <NavItem icon={<Newspaper size={20} />} label="Articles" active={activeTab === 'Articles'} onClick={() => { setActiveTab('Articles'); setIsMobileMenuOpen(false); }} />
            <NavItem icon={<Brain size={20} />} label="AI Assistant" active={activeTab === 'AI Assistant'} onClick={() => { setActiveTab('AI Assistant'); setIsMobileMenuOpen(false); }} />
            <div className="pt-8 mt-8 border-t border-slate-100">
              <NavItem icon={<LogOut size={20} className="text-rose-500" />} label="Logout" onClick={onLogout} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scaleIn">
            <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-2xl font-black text-slate-800">Settings</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage your account</p>
              </div>

              <div className="space-y-2 flex-1">
                {[
                  { id: 'Personal', icon: <User size={18} />, label: 'Personal Information' },
                  { id: 'Professional', icon: <Briefcase size={18} />, label: 'Professional Details' },
   
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEditSection(tab.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeEditSection === tab.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-slate-500 hover:bg-white hover:text-teal-600'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/60 text-center md:text-left">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">ProDoc Practitioner v2.4.0</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-white">
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <h3 className="text-xl font-bold text-slate-800">{activeEditSection} Settings</h3>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                {activeEditSection === 'Personal' && (
                  <div className="space-y-10 animate-fadeIn">
                    <div className="flex flex-col items-center md:flex-row gap-8 pb-10 border-b border-slate-50">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-slate-50 group-hover:ring-teal-100 transition-all shadow-lg ring-offset-4 ring-offset-white">
                          <img src={localUser.image} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 p-3 bg-teal-600 text-white rounded-2xl shadow-xl hover:bg-teal-700 transition-all hover:scale-110 active:scale-95"
                        >
                          <Camera size={18} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-xl font-black text-slate-800 mb-1">Profile Photo</h4>
                        <p className="text-sm text-slate-500 font-medium mb-4">This will be displayed on your public profile and articles.</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-100 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-all">Change Photo</button>
                          <button onClick={() => setLocalUser(prev => ({ ...prev, image: DoctorImg }))} className="px-5 py-2.5 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all">Remove</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <input
                          type="text"
                          value={localUser.fullName}
                          onChange={(e) => setLocalUser({ ...localUser, fullName: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Specialty</label>
                        <input
                          type="text"
                          value={localUser.specialty}
                          onChange={(e) => setLocalUser({ ...localUser, specialty: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Bio</label>
                        <textarea
                          value={localUser.bio}
                          onChange={(e) => setLocalUser({ ...localUser, bio: e.target.value })}
                          className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeEditSection === 'Professional' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SLMC Number</label>
                        <input
                          type="text"
                          value={localUser.slmcNumber}
                          onChange={(e) => setLocalUser({ ...localUser, slmcNumber: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Experience (Years)</label>
                        <input
                          type="text"
                          value={localUser.experience}
                          onChange={(e) => setLocalUser({ ...localUser, experience: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Location</label>
                        <input
                          type="text"
                          value={localUser.location}
                          onChange={(e) => setLocalUser({ ...localUser, location: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Languages</label>
                        <input
                          type="text"
                          value={localUser.languages}
                          onChange={(e) => setLocalUser({ ...localUser, languages: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                          placeholder="e.g. English, Sinhala"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Associated Hospitals (comma separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(localUser.associatedHospitals) ? localUser.associatedHospitals.map(h => typeof h === 'object' ? h.name : h).join(', ') : localUser.associatedHospitals}
                          onChange={(e) => setLocalUser({ ...localUser, associatedHospitals: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                          placeholder="e.g. Asiri Hospital, Lanka Hospital"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeEditSection === 'Security' && (
                  <div className="space-y-10 animate-fadeIn">
                    

                    <form onSubmit={handlePasswordChange} className="space-y-8">
                      <h4 className="text-lg font-black text-slate-800 px-1 border-l-4 border-teal-500 pl-4">Change Password</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password</label>
                          <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <button type="submit" className="px-10 py-4 bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-200">Update Password</button>
                      {pwdStatus.message && (
                        <div className={`p-4 rounded-xl text-xs font-bold ${pwdStatus.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'}`}>
                          {pwdStatus.message}
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 sticky bottom-0">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-8 py-4 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-4">
                  {saveStatus.message && (
                    <p className={`text-xs font-bold animate-fadeIn ${saveStatus.type === 'success' ? 'text-teal-600' : 'text-rose-500'}`}>
                      {saveStatus.message}
                    </p>
                  )}
                  <button
                    onClick={handleProfileSave}
                    disabled={isSaving}
                    className="px-10 py-4 bg-teal-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save All Changes</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient View Profile Modal */}
      {selectedPatientProfile && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-scaleIn">
            <div className="p-6 md:p-10 flex items-center justify-between border-b border-slate-50 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-xl overflow-hidden">
                  <User size={40} />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold shadow-sm border border-slate-200">
                      Patient Profile
                    </span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold shadow-sm border border-teal-100">
                      Second Opinion ID: #{selectedPatientProfile.id}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white leading-none mb-2">{selectedPatientProfile.patientName}</h2>
                    <p className="text-teal-50 text-sm font-medium">
                      {selectedPatientProfile.age} Years • {selectedPatientProfile.gender} • {selectedPatientProfile.location || "City/Province"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientProfile(null)}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/20"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-slate-50/30">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <AlertCircle size={14} className="text-amber-500" /> Medical Context
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Primary Symptom</p>
                        <p className="text-slate-800 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">{selectedPatientProfile.symptoms || "Recurrent Pain/Discomfort"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Current Condition</p>
                        <p className="text-slate-800 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">{selectedPatientProfile.condition || "Undergoing Initial Diagnosis"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-600 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/10 text-white relative overflow-hidden group">
                    <h4 className="text-xs font-black text-teal-100 uppercase tracking-widest mb-4 relative z-10">Patient Request</h4>
                    <p className="text-lg font-medium leading-relaxed italic relative z-10">
                      "{selectedPatientProfile.summary}"
                    </p>
                    <ShieldCheck size={100} className="absolute -bottom-4 -right-4 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[400px]">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">EHR Repository</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Shared medical records</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-500 border border-slate-200">
                        {patientRecords.length} Documents
                      </div>
                    </div>

                    {loadingPatientRecords ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-teal-500" size={40} />
                        <p className="text-slate-400 font-bold text-sm">Synchronizing health records...</p>
                      </div>
                    ) : patientRecords.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
                          <FileText size={32} className="text-slate-200" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-700">No Records Shared</h4>
                        <p className="text-slate-500 text-sm max-w-xs mt-1">The patient hasn't attached any clinical documents to this request.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {patientRecords.map((record) => (
                          <div key={record.id} className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 overflow-hidden">
                            <div
                              className="p-6 md:p-8 flex items-center justify-between cursor-pointer"
                              onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                            >
                              <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl transition-colors ${record.record_type === 'Lab Report' ? 'bg-blue-50 text-blue-500' : record.record_type === 'Prescription' ? 'bg-teal-50 text-teal-500' : 'bg-amber-50 text-amber-500'}`}>
                                  <FileText size={24} />
                                </div>
                                <div>
                                  <h4 className="font-black text-slate-800 group-hover:text-teal-700 transition-colors">{record.record_type}</h4>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    Shared on {new Date(record.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`hidden md:block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${record.file_url?.endsWith('.gpg') ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                                  {record.file_url?.endsWith('.gpg') ? 'AES Encrypted' : 'Standard'}
                                </span>
                                {expandedRecord === record.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                              </div>
                            </div>

                            {expandedRecord === record.id && (
                              <div className="px-6 pb-8 md:px-8 md:pb-10 pt-0 animate-slideDown">
                                <div className="bg-slate-50 rounded-[1.5rem] p-6 border border-slate-200/60">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Origin / Lab</p>
                                      <p className="text-sm font-bold text-slate-700">{record.hospital_name || "General Medical Center"}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Authenticated By</p>
                                      <p className="text-sm font-bold text-slate-700">{record.doctor_name || "Self-Uploaded"}</p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200/60">
                                    <button
                                      onClick={() => handleViewDocument(record.file_url, selectedPatientProfile.patientEmail, record.original_file_name)}
                                      className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:bg-teal-700 active:scale-95 transition-all"
                                    >
                                      <Eye size={16} /> Access Document
                                    </button>
                                  </div>
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

            <div className="p-8 border-t border-slate-50 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-xl">
                <AlertCircle className="text-teal-600 shrink-0" size={24} />
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  <span className="font-black text-slate-800 uppercase tracking-tighter mr-2">Clinician Notice:</span>
                  Please review all EHR documents thoroughly. Second opinions are advisory and the ultimate responsibility lies with the treating physician.
                </p>
              </div>
              <button
                className="w-full md:w-auto px-12 py-5 bg-teal-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Proceed to Review Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Supplemental UI Components ---

const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group ${active ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600'}`}
  >
    <div className="flex items-center gap-3">
      <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
        {icon}
      </span>
      <span className={`text-sm font-bold tracking-tight ${active ? 'font-black' : ''}`}>{label}</span>
    </div>
    {badge !== undefined && (
      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${active ? 'bg-white text-teal-600' : 'bg-teal-100 text-teal-600'}`}>
        {badge}
      </span>
    )}
  </button>
);

const RiskBadge = ({ level }) => {
  const colors = { LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200', MODERATE: 'bg-amber-100 text-amber-700 border-amber-200', HIGH: 'bg-orange-100 text-orange-700 border-orange-200', CRITICAL: 'bg-red-100 text-red-700 border-red-200', UNKNOWN: 'bg-slate-100 text-slate-600 border-slate-200' };
  const cls = colors[level?.toUpperCase()] || colors.UNKNOWN;
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${cls}`}><AlertCircle size={14} />{level || 'UNKNOWN'} RISK</span>;
};

const ResultSection = ({ title, items }) => {
  const [open, setOpen] = useState(true);
  if (!items || items.length === 0) return null;
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
        <span className="font-bold text-slate-700">{title}</span>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <ul className="px-5 py-3 space-y-1.5">{items.map((item, i) => <li key={i} className="flex gap-2 text-sm text-slate-600"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />{typeof item === 'object' ? JSON.stringify(item) : item}</li>)}</ul>}
    </div>
  );
};

const AiAssistantPanel = ({ onSubmit, loading, result, error, aiFile, aiReport, onFileChange, onReportChange }) => (
  <div className="max-w-3xl mx-auto animate-fadeIn space-y-6 p-4 md:p-0">
    <div className="flex items-center gap-4">
      <div className="p-4 bg-teal-100 rounded-2xl text-teal-600"><Brain size={32} /></div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">AI Medical Assistant</h2>
        <p className="text-slate-500 text-sm">Upload a medical image or report for AI-powered analysis</p>
      </div>
    </div>

    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medical Image <span className="text-slate-400 font-normal">(optional if report uploaded)</span></label>
          <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${aiFile ? 'border-teal-400 bg-teal-50' : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'}`}>
            <Upload size={28} className={aiFile ? 'text-teal-500' : 'text-slate-300'} />
            <p className="mt-2 text-sm font-medium text-slate-500">{aiFile ? aiFile.name : 'Click to upload'}</p>
            <p className="text-xs text-slate-400">DICOM, JPG, PNG, TIFF supported</p>
            <input type="file" className="hidden" accept=".dcm,.dicom,.jpg,.jpeg,.png,.tiff,.tif,.bmp" onChange={e => onFileChange(e.target.files[0])} />
          </label>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medical Report <span className="text-slate-400 font-normal">(optional)</span></label>
          <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${aiReport ? 'border-teal-400 bg-teal-50' : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'}`}>
            <FileText size={22} className={aiReport ? 'text-teal-500' : 'text-slate-300'} />
            <p className="mt-1 text-sm text-slate-500">{aiReport ? aiReport.name : 'Upload PDF or image report'}</p>
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.txt" onChange={e => onReportChange(e.target.files[0])} />
          </label>
        </div>
        {error && <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700"><AlertCircle size={18} /> {error}</div>}
        <button type="submit" disabled={loading || (!aiFile && !aiReport)} className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2">
          {loading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Analyzing...</> : <><Brain size={18} /> Run AI Analysis</>}
        </button>
      </form>
    </div>

    {result && (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-4 animate-fadeIn">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
          <div className="p-2 bg-teal-50 rounded-xl"><Brain size={18} className="text-teal-600" /></div>
          <h3 className="text-xl font-bold text-slate-800">Analysis Results</h3>
          <span className="ml-auto text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            {result._source === 'backend' ? 'ProDoc AI' : 'Gemini'}
          </span>
        </div>

        {/* Gemini markdown result */}
        {result.analysis && (
          <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed [&_strong]:font-semibold [&_strong]:text-slate-800 [&_ul]:space-y-1 [&_li]:text-slate-600">
            <ReactMarkdown>{result.analysis}</ReactMarkdown>
          </div>
        )}

        {/* ProDoc AI backend structured result */}
        {result._source === 'backend' && (
          <>
            {result.ai_result?.finding && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Finding</p>
                <p className="text-slate-800 font-semibold">{result.ai_result.finding}</p>
                {result.ai_result.confidence !== undefined && <p className="text-xs text-slate-400 mt-1">Confidence: {(result.ai_result.confidence * 100).toFixed(1)}%</p>}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {result.metadata?.modality && <div className="p-3 bg-slate-50 rounded-xl border border-slate-100"><p className="text-xs text-slate-400 font-bold uppercase">Image Type</p><p className="text-slate-700 font-semibold text-sm mt-0.5">{result.metadata.modality}</p></div>}
              {result.metadata?.routed_model && <div className="p-3 bg-slate-50 rounded-xl border border-slate-100"><p className="text-xs text-slate-400 font-bold uppercase">Model Used</p><p className="text-slate-700 font-semibold text-sm mt-0.5">{result.metadata.routed_model}</p></div>}
            </div>
            <ResultSection title="Key Observations" items={result.ai_result?.key_findings || result.ai_result?.observations} />
            <ResultSection title="Diagnostic Suggestions" items={result.diagnostic_suggestions} />
            <ResultSection title="Recommended Tests" items={result.recommended_tests} />
            {result.final_report && (
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 bg-slate-50"><span className="font-bold text-slate-700">Full Report</span></div>
                <pre className="px-5 py-4 text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">{result.final_report}</pre>
              </div>
            )}
          </>
        )}

        <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-50">For clinical decision support only. Always apply professional judgement.</p>
      </div>
    )}
  </div>
);

export default DoctorDashboard;






