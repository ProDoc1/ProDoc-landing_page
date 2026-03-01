import React, { useState, useEffect } from 'react';
import {
    ThumbsUp,
    Share2,
    Bookmark,
    MoreHorizontal,
    Search,
    Filter,
    TrendingUp,
    PlusSquare,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    RefreshCw,
    Newspaper,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContentHub = ({ onNavigateHome, onNavigateLogin, onNavigateDoctors, onViewProfile, user, userRole }) => {
    const [posts, setPosts] = useState([]);
    const [suggestedDoctors, setSuggestedDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Doctor Articles');
    const [showAllSuggestions, setShowAllSuggestions] = useState(false);

    // Article Creation State
    const [articleFormContent, setArticleFormContent] = useState('');
    const [articleFormImage, setArticleFormImage] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [articleError, setArticleError] = useState('');
    const fileInputRef = React.useRef(null);

    // Format timestamp to relative time (e.g., "2 hours ago")
    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'recently';
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return past.toLocaleDateString();
    };

    const handleArticleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setArticleFormImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const publishArticle = async (e) => {
        e.preventDefault();
        if (!articleFormContent || !articleFormImage) {
            setArticleError('Both an image and content are required.');
            return;
        }
        setIsPublishing(true);
        setArticleError('');

        try {
            const response = await fetch('/api/manage-doctor-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: user?.id,
                    full_name: user?.full_name || user?.name || user?.fullName,
                    specialty: user?.specialty,
                    image_url: user?.image_url || user?.image,
                    post_content: articleFormContent,
                    post_image: articleFormImage
                })
            });

            if (response.ok) {
                setArticleFormContent('');
                setArticleFormImage('');
                // Automatically fetch latest posts after publishing
                fetchPosts();
            } else {
                const data = await response.json();
                setArticleError(data.error || 'Failed to publish.');
            }
        } catch (err) {
            setArticleError('Connection error. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/get-content-hub-posts?t=${Date.now()}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to connect to the server');
            }
            const data = await response.json();

            const currentBookmarks = JSON.parse(localStorage.getItem(`prodoc_bookmarks_${user?.id || 'guest'}`) || '[]');
            const currentLikes = JSON.parse(localStorage.getItem(`prodoc_likes_${user?.id || 'guest'}`) || '[]');

            // Map DB fields to UI fields based on verified schema
            const mappedPosts = data.map(post => ({
                id: post.post_id,
                author: post.full_name || 'ProDoc Member',
                specialty: post.specialty || 'Generalist',
                authorImage: post.image_url || null, // Doctor's profile image
                timeAgo: formatTimeAgo(post.created_at),
                content: post.post_content || '',
                image: post.post_image || null, // The actual image for the post
                likes: parseInt(post.likes_count || 0),
                shares: parseInt(post.shares_count || 0),
                isLiked: currentLikes.includes(post.post_id),
                isBookmarked: currentBookmarks.includes(post.post_id)
            }));

            setPosts(mappedPosts);
        } catch (err) {
            console.error('Error fetching Content Hub posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await fetch('/api/doctors');
            if (response.ok) {
                const data = await response.json();
                // Randomize or just show first ones
                setSuggestedDoctors(data);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    const handleLike = async (id) => {
        let isLiking = false;

        setPosts(posts.map(post => {
            if (post.id === id) {
                const newStatus = !post.isLiked;
                isLiking = newStatus;
                const newLikesCount = newStatus ? post.likes + 1 : post.likes - 1;

                // Sync persistent likes to local storage based on user ID
                const key = `prodoc_likes_${user?.id || 'guest'}`;
                try {
                    let likes = JSON.parse(localStorage.getItem(key) || '[]');
                    if (newStatus) {
                        likes.push(id);
                    } else {
                        likes = likes.filter(lId => lId !== id);
                    }
                    localStorage.setItem(key, JSON.stringify(likes));
                } catch (e) {
                    console.error('Error saving like to localStorage:', e);
                }

                return { ...post, likes: newLikesCount, isLiked: newStatus };
            }
            return post;
        }));

        // Send API call to database
        try {
            await fetch('/api/manage-doctor-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: id, action: isLiking ? 'like' : 'unlike' })
            });
        } catch (e) {
            console.error('Error recording like:', e);
        }
    };

    const handleShare = async (id) => {
        // Optimistic UI update
        setPosts(posts.map(post => {
            if (post.id === id) {
                return { ...post, shares: post.shares + 1 };
            }
            return post;
        }));

        // Send API call to database
        try {
            await fetch('/api/manage-doctor-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: id, action: 'share' })
            });

            // Optionally construct a share URL and open system dialog
            const shareUrl = `${window.location.origin}/content-hub?post=${id}`;
            if (navigator.share) {
                navigator.share({
                    title: 'ProDoc Article',
                    url: shareUrl
                }).catch(err => console.log('Share error:', err));
            } else {
                navigator.clipboard.writeText(shareUrl);
            }
        } catch (e) {
            console.error('Error recording share:', e);
        }
    };

    const handleBookmark = (id) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                const newStatus = !post.isBookmarked;

                // Sync persistent bookmarks to local storage based on user ID
                const key = `prodoc_bookmarks_${user?.id || 'guest'}`;
                try {
                    let bookmarks = JSON.parse(localStorage.getItem(key) || '[]');
                    if (newStatus) {
                        bookmarks.push(id);
                    } else {
                        bookmarks = bookmarks.filter(bId => bId !== id);
                    }
                    localStorage.setItem(key, JSON.stringify(bookmarks));
                } catch (e) {
                    console.error('Error saving bookmark to localStorage:', e);
                }

                return { ...post, isBookmarked: newStatus };
            }
            return post;
        }));
    };

    const getFilteredPosts = () => {
        if (activeTab === 'Saved') {
            return posts.filter(post => post.isBookmarked);
        }
        if (activeTab === 'Popular') {
            return [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        }
        return posts;
    };

    const displayedPosts = getFilteredPosts();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-36 pb-8 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-36 h-fit">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="flex flex-col gap-2">
                            {['Doctor Articles', 'Popular', 'Saved'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === tab
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                        }`}
                                >
                                    {tab === 'Doctor Articles' && <Newspaper size={20} />}
                                    {tab === 'Popular' && <TrendingUp size={20} />}
                                    {tab === 'Saved' && <Bookmark size={20} />}
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col max-h-[50vh]">
                        <h3 className="font-bold text-slate-900 mb-4 px-2 flex-shrink-0">Suggested Doctors</h3>
                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {(showAllSuggestions ? suggestedDoctors : suggestedDoctors.slice(0, 3)).map(doctor => (
                                <div key={doctor.doctor_id} className="flex items-center justify-between gap-3 group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {doctor.image_url ? (
                                            <img
                                                src={doctor.image_url.replace(/^\.\//, '/')}
                                                alt={doctor.full_name}
                                                className="w-10 h-10 rounded-full object-cover border border-teal-50 flex-shrink-0 group-hover:ring-2 ring-teal-100 transition-all"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold flex-shrink-0 group-hover:ring-2 ring-teal-200 transition-all text-xs">
                                                {doctor.full_name ? doctor.full_name[0] : 'D'}
                                            </div>
                                        )}
                                        <div className="truncate">
                                            <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate" title={doctor.full_name}>
                                                {doctor.full_name}
                                            </p>
                                            <p className="text-[10px] text-slate-500 truncate" title={doctor.specialty}>
                                                {doctor.specialty}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onViewProfile && onViewProfile(doctor.doctor_id)}
                                        className="text-[11px] font-bold text-teal-600 border border-teal-100 hover:bg-teal-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0"
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                            {suggestedDoctors.length === 0 && (
                                <p className="text-xs text-slate-500 text-center py-4">No suggestions found.</p>
                            )}
                        </div>
                        {suggestedDoctors.length > 3 && (
                            <button
                                onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                                className="w-full mt-4 py-3 text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors border-t border-slate-50 flex-shrink-0"
                            >
                                {showAllSuggestions ? 'Show Less' : 'View All Suggestions'}
                            </button>
                        )}
                    </div>
                </aside>

                {/* CENTER FEED */}
                <main className="lg:col-span-9 space-y-6">

                    {/* Create Post Input (Doctors Only) */}
                    {userRole === 'doctor' && (
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-4 mt-8 md:mt-0">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                                    {user?.image_url || user?.image ? (
                                        <img src={user.image_url || user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold uppercase">
                                            {(user?.full_name || user?.name || user?.fullName || 'U')[0]}
                                        </div>
                                    )}
                                </div>
                                <textarea
                                    value={articleFormContent}
                                    onChange={(e) => setArticleFormContent(e.target.value)}
                                    placeholder="What's on your mind, Doctor? Note: attaching an image is required to publish."
                                    className="flex-1 bg-slate-50 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all min-h-[90px] resize-none"
                                />
                            </div>

                            {articleFormImage && (
                                <div className="relative w-full max-h-[300px] rounded-xl overflow-hidden mt-2 bg-slate-100 border border-slate-200">
                                    <img src={articleFormImage} alt="Post preview" className="w-full h-full object-cover max-h-[300px]" />
                                    <button
                                        onClick={() => setArticleFormImage('')}
                                        className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all shadow-md z-10"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {articleError && (
                                <div className="text-red-500 text-sm font-medium px-2 flex justify-between items-center bg-red-50 py-2 rounded-lg">
                                    <span>{articleError}</span>
                                    <button onClick={() => setArticleError('')} className="hover:bg-red-200 p-1 rounded-full"><X size={14} /></button>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleArticleImage}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`px-4 py-2.5 rounded-full transition-colors flex gap-2 items-center text-sm font-bold ${articleFormImage ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'text-slate-500 hover:bg-slate-100 border border-transparent'}`}
                                >
                                    <ImageIcon size={18} />
                                    <span className="hidden sm:inline">{articleFormImage ? 'Image Attached' : 'Attach Image'}</span>
                                </button>
                                <button
                                    disabled={!articleFormContent || !articleFormImage || isPublishing}
                                    onClick={publishArticle}
                                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:bg-slate-300 text-white px-8 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-teal-100 disabled:shadow-none"
                                >
                                    {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <PlusSquare size={16} />}
                                    {isPublishing ? 'Publishing...' : 'Publish'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                // Loading Skeletons
                                [1, 2, 3].map(i => (
                                    <motion.div
                                        key={`skeleton-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 p-5 space-y-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 bg-slate-100 rounded-full w-1/3 animate-pulse" />
                                                <div className="h-3 bg-slate-100 rounded-full w-1/4 animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="aspect-[16/9] bg-slate-100 rounded-[1.25rem] animate-pulse mx-4" />
                                        <div className="space-y-2 px-1">
                                            <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
                                            <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
                                        </div>
                                    </motion.div>
                                ))
                            ) : error ? (
                                // Error State
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                                        <AlertCircle className="text-rose-500" size={32} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">Unable to load feed</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto">{error}</p>
                                    <button
                                        onClick={fetchPosts}
                                        className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-full font-bold text-sm mx-auto hover:bg-teal-700 transition-colors shadow-lg shadow-teal-100"
                                    >
                                        <RefreshCw size={16} /> Retry
                                    </button>
                                </motion.div>
                            ) : displayedPosts.length === 0 ? (
                                // Empty State
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                        <Newspaper className="text-slate-300" size={32} />
                                    </div>
                                    <h3 className="font-bold text-slate-900">No posts yet</h3>
                                    <p className="text-slate-500 text-sm">Be the first to share medical insights with the ProDoc community.</p>
                                </motion.div>
                            ) : (
                                // Actual Posts
                                displayedPosts.map(post => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-md"
                                    >
                                        {/* Post Header */}
                                        <div className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {post.authorImage ? (
                                                    <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full object-cover border-2 border-teal-50" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                                                        {post.author[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm leading-tight hover:text-teal-600 transition-colors cursor-pointer">{post.author}</h4>
                                                    <p className="text-[11px] text-slate-500 font-medium">{post.specialty} • {post.timeAgo}</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-300 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-all">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>

                                        {/* Post Image */}
                                        {post.image && (
                                            <div className="px-4 pb-3">
                                                <div className="w-full aspect-[16/9] bg-slate-50 overflow-hidden rounded-[1.25rem] border border-slate-100">
                                                    <img src={post.image} alt="Post content" className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Post Content */}
                                        <div className="px-6 pb-5">
                                            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">{post.content}</p>
                                        </div>

                                        {/* Post Actions */}
                                        <div className="p-3 px-6 flex items-center justify-between border-t border-slate-50 bg-slate-50/30">
                                            <div className="flex items-center gap-6">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center gap-2 text-xs font-bold transition-all ${post.isLiked ? 'text-teal-600 scale-105' : 'text-slate-500 hover:text-slate-800'}`}
                                                >
                                                    <ThumbsUp size={18} className={post.isLiked ? 'fill-teal-600 stroke-teal-600' : ''} />
                                                    {post.likes}
                                                </button>
                                                <button
                                                    onClick={() => handleShare(post.id)}
                                                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                                >
                                                    <Share2 size={18} />
                                                    {post.shares}
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleBookmark(post.id)}
                                                className={`p-2 rounded-full transition-all ${post.isBookmarked ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:bg-slate-50'}`}
                                            >
                                                <Bookmark size={18} className={post.isBookmarked ? 'fill-teal-600 stroke-teal-600' : ''} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default ContentHub;
