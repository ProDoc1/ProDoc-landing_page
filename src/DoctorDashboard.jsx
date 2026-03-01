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
  Loader2 // Imported Loader icon for saving state
} from 'lucide-react';
import Navbar from './components/Navbar';
import Plasma from './components/Plasma';
import LogoColor from './assets/Logo_with_words.png';
import DoctorImg from './assets/doctor.png';

const DoctorDashboard = ({
  user,
  onLogout,
  onNavigateAbout,
  onNavigateHome,
  onNavigateLogin,
  onNavigateSignupPage,
  onNavigateDoctors
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile & Settings State
  const [isSecondOpinionEnabled, setIsSecondOpinionEnabled] = useState(true);
  const [availability, setAvailability] = useState("Mon, Wed, Fri");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Save Data State (New)
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  // Separate state for Available Dates save feedback
  const [dateSaveStatus, setDateSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'success' | 'error'

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

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
    location: 'Colombo, Sri Lanka',
    image: user?.image_url || DoctorImg,
    average_rating: user?.average_rating || 0,
    rating_count: user?.rating_count || 0
  });

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
        location: user.location || prev.location,
        languages: user.languages || prev.languages,
        image: user.image_url || prev.image
      }));
      // Also update second opinion state if present in user prop (though likely not)
      if (user.second_opinion_available !== undefined) {
        setIsSecondOpinionEnabled(user.second_opinion_available);
      }
      if (user.second_opinion_dates) {
        setAvailability(user.second_opinion_dates);
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
              location: data.location || prev.location,
              languages: data.languages || prev.languages,
              image: data.image_url || prev.image,
              average_rating: data.average_rating || 0,
              rating_count: data.rating_count || 0
            }));
            // Initialize Second Opinion state from fetched data
            if (data.second_opinion_available !== undefined) {
              setIsSecondOpinionEnabled(data.second_opinion_available);
            }
            if (data.second_opinion_dates) {
              setAvailability(data.second_opinion_dates);
            }
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

    if ((activeTab === 'Create' || activeTab === 'Dashboard' || activeTab === 'Articles') && localUser.id) {
      fetchDoctorPosts();
    }
  }, [activeTab, localUser.id]);

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
        image_url: localUser.image, // Assuming your backend accepts base64 or URL
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
    } catch (err) {
      setPwdStatus({ type: 'error', message: 'Connection error. Please try again.' });
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
      const response = await fetch('/api/create-content-hub-post', {
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
    } catch (err) {
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
    } catch (err) {
      console.error(err);
      alert('Error connecting to the server while trying to delete.');
    }
  };

  const professionalStats = [
    { label: "Profile Views", value: "1,240", icon: <Activity className="text-green-600" />, color: "bg-green-100" },
    { label: "Rating", value: `${Number(localUser.average_rating || 0).toFixed(1)}/5`, icon: <Star className="text-green-600" />, color: "bg-green-100" },
    { label: "Status", value: "Verified", icon: <Verified className="text-green-600" />, color: "bg-green-100" },
  ];

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans text-slate-700 bg-slate-50">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 h-screen w-screen opacity-30 pointer-events-none">
        <Plasma color="#0f766e" speed={0.2} scale={1.5} opacity={0.4} />
      </div>

      {/* Insert Navbar Here */}
      <Navbar
        currentUser={localUser}
        onLogout={onLogout}
        onNavigateHome={onNavigateHome}
        onNavigateDoctors={onNavigateDoctors}
        onNavigateAbout={onNavigateAbout}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignupPage={onNavigateSignupPage}
        onNavigateDashboard={() => setActiveTab('Dashboard')}
      />

      <div className="flex flex-1 pt-24 md:pt-32 relative z-10 overflow-hidden">
        {/* Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`fixed md:relative z-40 w-64 h-[calc(100vh-theme(spacing.32))] bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-500 font-bold mb-4">
              <X size={20} /> Close Menu
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <NavItem
              icon={<Activity size={20} />}
              label="Dashboard"
              active={activeTab === 'Dashboard'}
              onClick={() => {
                setActiveTab('Dashboard');
                setIsMobileMenuOpen(false);
              }}
            />
            <NavItem
              icon={<FileText size={20} />}
              label="Second Opinions"
              badge={3}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<Star size={20} />}
              label="Reviews"
              active={activeTab === 'Reviews'}
              onClick={() => {
                setActiveTab('Reviews');
                setIsMobileMenuOpen(false);
              }}
            />
            <NavItem
              icon={<ShieldCheck size={20} />}
              label="Credential Vault"
              active={activeTab === 'Credential Vault'}
              onClick={() => {
                setActiveTab('Credential Vault');
                setIsMobileMenuOpen(false);
              }}
            />
            <NavItem
              icon={<PlusSquare size={20} />}
              label="Create"
              active={activeTab === 'Create'}
              onClick={() => {
                setActiveTab('Create');
                setIsMobileMenuOpen(false);
              }}
            />
            <NavItem
              icon={<Newspaper size={20} />}
              label="Articles"
              active={activeTab === 'Articles'}
              onClick={() => {
                setActiveTab('Articles');
                setIsMobileMenuOpen(false);
              }}
            />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </aside>

        {/* Dashbaord Mobile Control */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-teal-600 text-white rounded-full shadow-2xl"
        >
          <Menu size={24} />
        </button>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'Dashboard' ? (
            <div className="animate-fadeIn">
              {/* Profile Header */}
              <div className="relative mb-6 md:mb-10 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-xl bg-gradient-to-br from-teal-900 to-teal-600">
                <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                  <div className="relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-slate-200">
                      <img src={localUser.image} alt={localUser.fullName} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">{localUser.fullName}</h1>
                    <div className="flex flex-col items-center md:items-start gap-4 md:gap-6 mb-4">
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <span className="bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 text-cyan-100 px-4 py-1.5 rounded-full text-sm font-semibold">
                          {localUser.specialty}
                        </span>
                        <span className="bg-teal-950/40 backdrop-blur-md border border-teal-700/50 text-emerald-100 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                          <Verified size={14} className="text-cyan-400" />
                          SLMC Reg: {localUser.slmcNumber}
                        </span>
                      </div>

                      <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm md:text-base text-teal-50/90 font-medium">
                        <div className="flex items-center gap-2.5">
                          <MapPin size={22} className="text-cyan-300" />
                          <span>{localUser.location}</span>
                        </div>
                        <div className="w-px h-6 bg-teal-500/40 hidden md:block"></div>
                        <div className="flex items-center gap-2.5">
                          <Globe size={22} className="text-cyan-300" />
                          <span>{localUser.languages}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[170px]">
                    <button onClick={() => setIsEditingProfile(true)} className="group px-6 py-3 bg-white hover:bg-teal-50 text-teal-900 rounded-full transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20">
                      <Pencil size={16} className="text-teal-600" /> Edit Details
                    </button>
                    <button className="group px-6 py-3 bg-white/10 hover:bg-white/20 text-teal-50 rounded-full transition-all text-sm font-medium flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10">
                      <Share2 size={16} className="text-cyan-300" /> Share Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {professionalStats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                  </div>
                ))}
              </div>

              {/* Content Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Verification Progress</h3>
                  <div className="space-y-6">
                    <Step icon={<CheckCircle className="text-teal-500" />} title="Identity Verified" desc="National ID verified" completed />
                    <Step icon={<CheckCircle className="text-teal-500" />} title="Medical License" desc="SLMC Registration verified" completed />
                    <Step icon={<Clock className="text-amber-500" />} title="Surgical History" desc="Pending secondary audit" />
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Second Opinion</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {isSecondOpinionEnabled
                            ? "Patients can message you for consultations."
                            : "Currently unavailable for new opinions."}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newValue = !isSecondOpinionEnabled;
                          setIsSecondOpinionEnabled(newValue);
                          updateSecondOpinionSettings({ second_opinion_available: newValue });
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${isSecondOpinionEnabled ? 'bg-teal-500' : 'bg-slate-200'}`}
                      >
                        <div
                          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isSecondOpinionEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>

                    {isSecondOpinionEnabled && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-fadeIn">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Available Dates
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                              type="text"
                              value={availability}
                              onChange={(e) => setAvailability(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
                              placeholder="e.g. Mon, Wed, Fri"
                            />
                          </div>
                          <button
                            onClick={handleDateSave}
                            disabled={dateSaveStatus === 'saving'}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 min-w-[80px] justify-center ${dateSaveStatus === 'success'
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : dateSaveStatus === 'error'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-teal-500 hover:bg-teal-600 text-white'
                              } ${dateSaveStatus === 'saving' ? 'opacity-70 cursor-wait' : ''}`}
                          >
                            {dateSaveStatus === 'saving' ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : dateSaveStatus === 'success' ? (
                              <>
                                <CheckCircle size={16} /> Saved
                              </>
                            ) : dateSaveStatus === 'error' ? (
                              'Retry'
                            ) : (
                              'Save'
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">These are the dates patients see when booking.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>            </div>
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
                  <div className="p-4 bg-amber-100 rounded-2xl text-amber-600">
                    <Star size={32} className="fill-amber-600" />
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
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-slate-800">{review.user_name || 'Anonymous'}</h4>
                            <p className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200">
                            <Star className="text-amber-400 fill-amber-400" size={16} />
                            <span className="font-bold text-slate-700">{review.overall}</span>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-slate-600 italic">"{review.comment}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'Credential Vault' ? (
            /* CREDENTIAL VAULT PAGE */
            <div className="max-w-2xl mx-auto animate-slideUp">
              <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-100">
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
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Edit Profile</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                disabled={isSaving}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProfileSave} className="p-6 space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer" onClick={() => !isSaving && fileInputRef.current.click()}>
                  <div className="w-24 h-24 rounded-full border-2 border-teal-500 overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img src={localUser.image} alt="Profile Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                <p className="text-xs text-slate-400 mt-2">Click to change photo</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" value={localUser.fullName} onChange={(e) => setLocalUser({ ...localUser, fullName: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" disabled={isSaving} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                  <input type="text" value={localUser.specialty} onChange={(e) => setLocalUser({ ...localUser, specialty: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" disabled={isSaving} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SLMC Reg</label>
                  <input type="text" value={localUser.slmcNumber} onChange={(e) => setLocalUser({ ...localUser, slmcNumber: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" disabled={isSaving} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" value={localUser.location} onChange={(e) => setLocalUser({ ...localUser, location: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" disabled={isSaving} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Languages</label>
                <input type="text" value={localUser.languages} onChange={(e) => setLocalUser({ ...localUser, languages: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. English, Sinhala" disabled={isSaving} />
              </div>

              {saveStatus.message && (
                <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${saveStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {saveStatus.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
                  {saveStatus.message}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors" disabled={isSaving}>Cancel</button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active = false, badge, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium ${active ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
  >
    <div className="flex items-center gap-3">
      {icon} <span>{label}</span>
    </div>
    {badge && <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
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