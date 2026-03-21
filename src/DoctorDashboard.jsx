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
  Eye,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Navbar from './components/Navbar';
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
  onViewPatientProfile
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            const manualKey = prompt("Patient's private key not detected in this browser session. In a production app, the patient would grant access using the Doctor's public key. For this demo, please paste the Patient's private key:");
            if (manualKey) {
              privateKey = manualKey;
            } else {
              alert("Cannot decrypt without the patient's private key.");
              return;
            }
          } else {
            alert("Patient's private key not available in this browser session. In production request patient access or use the patient's account to view records.");
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
        const mimeType = getMimeTypeFromUrl(originalFileName || recordUrl);
        window.open(`/api/proxy-blob?url=${encodeURIComponent(recordUrl)}&type=${encodeURIComponent(mimeType)}`, '_blank');
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

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 pt-36 md:p-8 md:pt-44 lg:pt-48 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6 sticky top-44 h-fit">
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

            <div className="pt-4 mt-4 border-t border-slate-100">
              <NavItem
                icon={<LogOut size={18} className="text-rose-500" />}
                label="Logout"
                onClick={onLogout}
              />
            </div>
          </div>

          {/* Second Opinion Sidebar Card */}
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
        </div>



        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'Dashboard' ? (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                {/* Profile Summary Card */}
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

                {/* Welcome Card */}
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

              {/* Associated Hospitals Card */}
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
                {/* Professional Brief - Main Section */}
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

                {/* Trust & Verify - Now Underneath */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="p-3 bg-blue-50 text-teal-500 rounded-2xl shadow-inner shrink-0">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">Trust & Verify</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Platform Status</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <CheckCircle className="text-teal-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Identity</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">National ID verified</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <CheckCircle className="text-teal-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Medical License</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">SLMC Registration verified</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                      <Clock className="text-amber-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Secondary Audit</p>
                        <p className="text-xs font-medium text-amber-700/70 mt-0.5">Pending final review</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Second Opinions' ? (
            <div className="animate-slideUp max-w-5xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                {/* Second Opinion Availability Widget */}
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
                                onClick={() => onViewPatientProfile(request)}
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
              {/* Your Published Articles List */}
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
            <div className="animate-slideUp max-w-4xl mx-auto">
              <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-teal-100 rounded-2xl text-teal-600">
                    <Star size={32} className="fill-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Patient Reviews</h2>
                    <p className="text-slate-500 text-sm">See what your patients are saying about you</p>
                  </div>
                </div>

                {reviewsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-teal-500 max-w-full" size={40} />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
                    <Star size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Reviews Yet</h3>
                    <p className="text-slate-500">When patients leave reviews, they will appear here.</p>
                  </div>
                ) : (
                  <>
                    {/* filter controls */}
                    <div className="flex gap-2 mb-6">
                      {['all', 'ratings', 'reviews'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setReviewFilter(opt)}
                          className={`px-4 py-2 rounded-xl font-semibold transition-colors ${reviewFilter === opt ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          {opt === 'all' ? 'All' : opt === 'ratings' ? 'Ratings' : 'Reviews'}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-6">
                      {(() => {
                        const ratingsOnly = reviews.filter(r => !r.comment || r.comment.trim() === '');
                        const textReviews = reviews.filter(r => r.comment && r.comment.trim() !== '');
                        const showRatings = reviewFilter === 'all' || reviewFilter === 'ratings';
                        const showText = reviewFilter === 'all' || reviewFilter === 'reviews';
                        return (
                          <>
                            {showRatings && ratingsOnly.length > 0 && (
                              <div className="space-y-4">
                                <h4 className="text-xl font-semibold text-slate-800">Ratings</h4>
                                {ratingsOnly.map(review => (
                                  <div key={review.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
                                    {/* optional status badge */}
                                    {review.status && (
                                      <div className="absolute top-4 right-4">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${review.status === 'rejected' ? 'bg-rose-100 text-rose-600' : review.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                          {review.status}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h4 className="font-bold text-slate-800">Verified User</h4>
                                        <p className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
                                      </div>
                                      <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200">
                                        <Star className="text-teal-400 fill-teal-400" size={16} />
                                        <span className="font-bold text-slate-700">{review.overall}</span>
                                      </div>
                                    </div>
                                    {/* category ratings grid */}
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
                                          {review.overall || '--'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* report button */}
                                    <div className="text-right">
                                      <button onClick={() => handleReport(review.id)} className="text-rose-600 text-sm font-semibold">Report</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {showText && textReviews.length > 0 && (
                              <div className="space-y-4">
                                <h4 className="text-xl font-semibold text-slate-800">Reviews</h4>
                                {textReviews.map(review => (
                                  <div key={review.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">

                                    {review.status && (
                                      <div className="absolute top-4 right-4">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${review.status === 'rejected' ? 'bg-rose-100 text-rose-600' : review.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                          {review.status}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h4 className="font-bold text-slate-800">Verified User</h4>
                                        <p className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
                                      </div>
                                      <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200">
                                        <Star className="text-teal-400 fill-teal-400" size={16} />
                                        <span className="font-bold text-slate-700">{review.overall}</span>
                                      </div>
                                    </div>
                                    {/* category ratings grid */}
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
                                        <span className="font-semibold text-slate-700">Treatment:</span>
                                        <span className="flex items-center gap-1 text-teal-600 font-bold">
                                          <Star size={12} className="fill-teal-400" />
                                          {review.treatment_plan || '--'}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between bg-teal-50 p-2 rounded-lg border border-teal-100">
                                        <span className="font-semibold text-slate-700">Overall:</span>
                                        <span className="flex items-center gap-1 text-teal-700 font-bold">
                                          <Star size={12} className="fill-teal-400" />
                                          {review.overall || '--'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* comment text */}
                                    {review.comment && (
                                      <p className="text-slate-800 leading-relaxed text-sm font-semibold mb-3 bg-white p-3 rounded-lg border-l-4 border-teal-400">{review.comment}</p>
                                    )}
                                    {/* report button */}
                                    <div className="text-right">
                                      <button onClick={() => handleReport(review.id)} className="text-rose-600 text-sm font-semibold">Report</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : activeTab === 'Credential Vault' ? (
            <div className="max-w-4xl mx-auto animate-slideUp">
              {/* CREDENTIAL VAULT PAGE */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-teal-100 rounded-2xl text-teal-600">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Credential Vault</h2>
                    <p className="text-slate-500 text-sm">Update your security and professional status</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-6 md:p-8 bg-slate-50 rounded-3xl md:rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock size={20} className="text-teal-600" />
                      <h3 className="font-bold text-slate-800">Security Settings</h3>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      {pwdStatus.message && (
                        <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${pwdStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                          {pwdStatus.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
                          {pwdStatus.message}
                        </div>
                      )}

                      <button type="submit" className="w-full py-4 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-all shadow-lg shadow-teal-100">
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'Create' ? (
            <div className="max-w-3xl mx-auto animate-slideUp">
              <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-teal-100 rounded-2xl text-teal-600">
                    <PlusSquare size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Create Article</h2>
                    <p className="text-slate-500 text-sm">Share knowledge and updates with the ProDoc community</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                  <form onSubmit={publishArticle} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Article Image (Required)</label>
                      <div
                        onClick={() => articleImageRef.current.click()}
                        className="w-full h-64 border-2 border-dashed border-teal-200 rounded-2xl flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-teal-50 transition-colors overflow-hidden relative group"
                      >
                        {articleForm.image ? (
                          <img src={articleForm.image} alt="Article format" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <UploadCloud size={40} className="text-teal-300 mb-3" />
                            <p className="font-bold text-teal-700">Click to upload an image</p>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                          </>
                        )}
                        {articleForm.image && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg">Change Image</span>
                          </div>
                        )}
                      </div>
                      <input type="file" ref={articleImageRef} onChange={handleArticleImage} className="hidden" accept="image/*" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Article Content (Required)</label>
                      <textarea
                        value={articleForm.content}
                        onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        placeholder="Write your article content here..."
                        className="w-full h-40 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                      />
                    </div>

                    {articleStatus.message && (
                      <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${articleStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {articleStatus.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
                        {articleStatus.message}
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isPublishing || !articleForm.content || !articleForm.image}
                        className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isPublishing ? (
                          <><Loader2 className="animate-spin" size={18} /> Publishing...</>
                        ) : (
                          'Publish Article'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
            {/* Header */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-teal-700 to-teal-600 flex justify-between items-center shrink-0">
              <div className="text-white">
                <h3 className="text-2xl font-bold">Edit Professional Profile</h3>
                <p className="text-teal-100/80 text-sm">Update your public information and credentials</p>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                disabled={isSaving}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-56 bg-slate-50 border-r border-slate-100 p-4 space-y-2 hidden md:block">
                {[
                  { id: 'Personal', icon: <User size={18} />, label: 'Identity' },
                  { id: 'Credentials', icon: <Award size={18} />, label: 'Credentials' },
                  { id: 'Presence', icon: <Globe size={18} />, label: 'Presence' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEditSection(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeEditSection === tab.id
                      ? 'bg-white text-teal-600 shadow-sm border border-slate-200'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                      }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}

                <div className="mt-8 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <p className="text-[10px] text-teal-700 font-bold uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2 text-xs text-indigo-700 font-medium">
                    <Verified size={12} className="text-teal-500" />
                    Verified Provider
                  </div>
                </div>


              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                {/* Mobile Tab Selector */}
                <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                  {['Personal', 'Credentials', 'Presence'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveEditSection(tab)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${activeEditSection === tab ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleProfileSave} className="space-y-8 h-full flex flex-col">
                  <div className="flex-1 space-y-8">
                    {activeEditSection === 'Personal' && (
                      <div className="animate-slideUp space-y-6">
                        <SectionTitle icon={<User size={20} className="text-teal-600" />} title="Personal Identity" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField
                            label="Full Name"
                            name="fullName"
                            value={localUser.fullName}
                            onChange={(v) => setLocalUser({ ...localUser, fullName: v })}
                            disabled={isSaving}
                            placeholder="Dr. John Doe"
                          />
                          <InputField
                            label="Specialty"
                            name="specialty"
                            value={localUser.specialty}
                            onChange={(v) => setLocalUser({ ...localUser, specialty: v })}
                            disabled={isSaving}
                            placeholder="e.g. Cardiologist"
                          />
                          <InputField
                            label="SLMC Registration Number"
                            name="slmcNumber"
                            value={localUser.slmcNumber}
                            onChange={(v) => setLocalUser({ ...localUser, slmcNumber: v })}
                            disabled={isSaving}
                            placeholder="REG-12345"
                          />
                          <InputField
                            label="Practice Sector"
                            name="sector"
                            value={localUser.sector}
                            onChange={(v) => setLocalUser({ ...localUser, sector: v })}
                            disabled={isSaving}
                            placeholder="e.g. Government, Private"
                          />
                        </div>
                      </div>
                    )}

                    {activeEditSection === 'Credentials' && (
                      <div className="animate-slideUp space-y-6">
                        <SectionTitle icon={<Award size={20} className="text-amber-600" />} title="Professional Credentials" />

                        <div className="space-y-6">
                          <div className="w-full">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Working Hospitals</label>
                            <div className="space-y-3">
                              {(() => {
                                let hospitalsList = [];
                                if (Array.isArray(localUser.associatedHospitals)) {
                                  hospitalsList = localUser.associatedHospitals;
                                } else if (typeof localUser.associatedHospitals === 'string') {
                                  try {
                                    const parsed = JSON.parse(localUser.associatedHospitals);
                                    if (Array.isArray(parsed)) hospitalsList = parsed;
                                    else hospitalsList = localUser.associatedHospitals.split(',').map(h => h.trim()).filter(Boolean).map(name => ({ name, type: 'Consulting Physician' }));
                                  } catch {
                                    hospitalsList = localUser.associatedHospitals.split(',').map(h => h.trim()).filter(Boolean).map(name => ({ name, type: 'Consulting Physician' }));
                                  }
                                }

                                return (
                                  <>
                                    {hospitalsList.map((hospital, index) => (
                                      <div key={index} className="flex flex-col md:flex-row gap-2">
                                        <div className="flex-1 relative">
                                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                          <input
                                            type="text"
                                            value={typeof hospital === 'object' ? (hospital.name || hospital.hospital || '') : hospital}
                                            onChange={(e) => {
                                              const newHospitals = [...hospitalsList];
                                              newHospitals[index] = { ...(typeof newHospitals[index] === 'object' ? newHospitals[index] : { name: newHospitals[index], type: 'Consulting Physician' }), name: e.target.value };
                                              setLocalUser({ ...localUser, associatedHospitals: newHospitals });
                                            }}
                                            placeholder="Hospital Name (e.g. Asiri Hospital)"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-slate-700"
                                            disabled={isSaving}
                                          />
                                        </div>
                                        <div className="flex-[0.8] relative flex gap-2">
                                          <div className="flex-1 relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                              type="text"
                                              value={typeof hospital === 'object' ? (hospital.type || '') : 'Consulting Physician'}
                                              onChange={(e) => {
                                                const newHospitals = [...hospitalsList];
                                                newHospitals[index] = { ...(typeof newHospitals[index] === 'object' ? newHospitals[index] : { name: newHospitals[index] }), type: e.target.value };
                                                setLocalUser({ ...localUser, associatedHospitals: newHospitals });
                                              }}
                                              placeholder="Type (e.g. Private)"
                                              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-slate-700 text-sm"
                                              disabled={isSaving}
                                            />
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newHospitals = hospitalsList.filter((_, i) => i !== index);
                                              setLocalUser({ ...localUser, associatedHospitals: newHospitals });
                                            }}
                                            disabled={isSaving}
                                            className="px-4 py-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-colors border border-red-100 active:scale-95"
                                          >
                                            <X size={20} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => setLocalUser({ ...localUser, associatedHospitals: [...hospitalsList, { name: '', type: '' }] })}
                                      disabled={isSaving}
                                      className="w-full py-4 mt-2 border-2 border-dashed border-teal-200 text-teal-600 hover:border-teal-400 hover:bg-teal-50 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2"
                                    >
                                      <PlusSquare size={18} /> Add Practice Location
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                          <InputField
                            label="Educational Qualifications"
                            name="qualifications"
                            value={localUser.qualifications}
                            onChange={(v) => setLocalUser({ ...localUser, qualifications: v })}
                            disabled={isSaving}
                            placeholder="e.g. MBBS, MD (Surgery)"
                          />
                          <div className="w-full">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Years of Experience</label>
                            <div className="relative">
                              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input
                                type="number"
                                value={localUser.experience}
                                onChange={(e) => setLocalUser({ ...localUser, experience: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-slate-700"
                                disabled={isSaving}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeEditSection === 'Presence' && (
                      <div className="animate-slideUp space-y-6">
                        <SectionTitle icon={<Globe size={20} className="text-blue-600" />} title="Public Presence" />

                        <div className="space-y-6">
                          <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="relative group cursor-pointer" onClick={() => !isSaving && fileInputRef.current.click()}>
                              <div className="w-24 h-24 rounded-3xl border-2 border-white shadow-xl overflow-hidden bg-white">
                                <img src={localUser.image} alt="Profile Preview" className="w-full h-full object-cover" />
                              </div>
                              <div className="absolute inset-0 bg-teal-600/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                                <Camera className="text-white" size={24} />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">Profile Photo</h4>
                              <p className="text-sm text-slate-500 mb-2">Recommended: 400x400px</p>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="text-xs font-bold text-teal-600 hover:text-teal-700 underline"
                              >
                                Replace Image
                              </button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                          </div>

                          <InputField
                            label="Languages Spoken"
                            name="languages"
                            value={localUser.languages}
                            onChange={(v) => setLocalUser({ ...localUser, languages: v })}
                            disabled={isSaving}
                            placeholder="e.g. English, Sinhala"
                          />

                          <div className="w-full">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Professional Bio</label>
                            <textarea
                              value={localUser.bio}
                              onChange={(e) => setLocalUser({ ...localUser, bio: e.target.value })}
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:bg-white focus:border-teal-500 outline-none transition-all min-h-[140px] text-slate-700 leading-relaxed font-medium"
                              placeholder="Describe your medical journey and expertise..."
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer & Feedback */}
                  <div className="shrink-0 pt-6">
                    {saveStatus.message && (
                      <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 mb-6 animate-fadeIn ${saveStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {saveStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {saveStatus.message}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-bold"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-xl shadow-teal-900/10 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:grayscale"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Applying Changes...
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            Save Profile
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient View Profile Modal */}
      {selectedPatientProfile && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
            {/* Header */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-teal-700 to-teal-600 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-inner">
                  <User size={28} />
                </div>
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{selectedPatientProfile.patientName}'s Profile</h3>
                  <p className="text-teal-100/80 text-sm">Patient Details & Medical History</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientProfile(null)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50">

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner border border-teal-100 shrink-0 mx-auto md:mx-0">
                  <User size={40} />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold shadow-sm border border-slate-200">
                      Age: {selectedPatientProfile.age}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold shadow-sm border border-slate-200">
                      Gender: {selectedPatientProfile.gender}
                    </span>
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold shadow-sm border border-rose-100">
                      Blood: {selectedPatientProfile.bloodGroup || 'N/A'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md">
                        <Activity size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Contact</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedPatientProfile.contact || 'Not Provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md">
                        <FileText size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedPatientProfile.email || 'Not Provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Address</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedPatientProfile.address || 'Not Provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pb-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <Activity size={16} className="text-teal-600" /> Patient Medical Shared Records
                </h4>

                {loadingPatientRecords ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-teal-500" size={32} />
                  </div>
                ) : patientRecords.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                    <FileText className="mx-auto text-slate-300 mb-3" size={40} />
                    <p className="text-slate-500 font-medium text-sm">No medical records uploaded by this patient yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {patientRecords.map((record) => (
                      <div key={record.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-teal-200 transition-all group">
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${record.type === 'lab' ? 'bg-rose-50 text-rose-500' :
                                record.type === 'prescription' ? 'bg-emerald-50 text-emerald-500' :
                                  record.type === 'scan' ? 'bg-blue-50 text-blue-500' :
                                    'bg-purple-50 text-purple-500'
                              }`}>
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-800 text-sm truncate">{record.title}</h5>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                <span>{record.type}</span>
                                <span>•</span>
                                <span>{record.reportDate}</span>
                                <span>•</span>
                                <span className="text-teal-500 flex items-center gap-1">
                                  <ShieldCheck size={10} /> {record.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500 transition-all ${expandedRecord === record.id ? 'rotate-180 bg-teal-50 text-teal-500' : ''}`}>
                            <ChevronDown size={16} />
                          </div>
                        </div>

                        {expandedRecord === record.id && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleViewDocument(record.url, selectedPatientProfile?.email, record.title, record.status)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
                              >
                                <Eye size={14} /> View Document
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
      )}
    </div>
  );
};

// Helper Components
const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
    {icon}
    <h4 className="text-xl font-bold text-slate-800">{title}</h4>
  </div>
);

const InputField = ({ label, value, onChange, disabled, placeholder, type = "text" }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-slate-700"
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

const NavItem = ({ icon, label, active = false, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${active ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}
  >
    <div className="flex items-center gap-3">
      <div className={`transition-colors ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-600'}`}>
        {icon}
      </div>
      <span>{label}</span>
    </div>
    {badge && (
      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${active ? 'bg-teal-100 text-teal-600' : 'bg-slate-200 text-slate-600'}`}>
        {badge}
      </span>
    )}
  </button>
);

const Step = ({ icon, title, desc, completed = false }) => (
  <div className="flex gap-4 mb-4">
    <div className="mt-1">{icon}</div>
    <div>
      <p className={`font-bold ${completed ? 'text-slate-800' : 'text-slate-400'}`}>{title}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

export default DoctorDashboard;