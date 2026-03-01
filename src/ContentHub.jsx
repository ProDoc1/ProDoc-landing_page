import React, { useState, useEffect } from 'react';
import {
    Heart,
    MessageCircle,
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
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContentHub = ({ onNavigateHome, onNavigateLogin }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('For You');

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

            // Map DB fields to UI fields based on verified schema
            const mappedPosts = data.map(post => ({
                id: post.post_id,
                author: post.full_name || 'ProDoc Member',
                specialty: post.specialty || 'Generalist',
                authorImage: post.image_url ? post.image_url.replace(/^\.\//, '/') : null, // Doctor's profile image
                timeAgo: formatTimeAgo(post.created_at),
                content: post.post_content || '',
                image: post.post_image ? post.post_image.replace(/^\.\//, '/') : null, // The actual image for the post
                likes: parseInt(post.likes_count || 0),
                comments: parseInt(post.comments_count || 0),
                shares: parseInt(post.shares_count || 0),
                isLiked: false,
                isBookmarked: false
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
    }, []);

    const handleLike = (id) => {
        setPosts(posts.map(post =>
            post.id === id
                ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
                : post
        ));
    };

    const handleBookmark = (id) => {
        setPosts(posts.map(post =>
            post.id === id
                ? { ...post, isBookmarked: !post.isBookmarked }
                : post
        ));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-36 pb-8 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT SIDEBAR */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-36 h-fit">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="flex flex-col gap-2">
                            {['For You', 'Following', 'Popular', 'Saved'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === tab
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                        }`}
                                >
                                    {tab === 'For You' && <Heart size={20} />}
                                    {tab === 'Following' && <PlusSquare size={20} />}
                                    {tab === 'Popular' && <TrendingUp size={20} />}
                                    {tab === 'Saved' && <Bookmark size={20} />}
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 px-2">Trending Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {['#MentalHealth', '#Nutrition', '#COVID19', '#Wellness', '#Pediatrics', '#Surgery'].map(tag => (
                                <span key={tag} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-teal-50 hover:text-teal-600 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* CENTER FEED */}
                <main className="lg:col-span-6 space-y-6">

                    {/* Create Post Input */}
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center gap-4 sticky top-36 z-10">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                            <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">U</div>
                        </div>
                        <input
                            type="text"
                            placeholder="What's on your mind, Doctor?"
                            className="flex-1 bg-slate-50 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                        />
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                            <ImageIcon size={20} />
                        </button>
                    </div>

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
                                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 p-6 space-y-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 bg-slate-100 rounded-full w-1/3 animate-pulse" />
                                                <div className="h-3 bg-slate-100 rounded-full w-1/4 animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="aspect-video bg-slate-100 rounded-2xl animate-pulse" />
                                        <div className="space-y-2">
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
                            ) : posts.length === 0 ? (
                                // Empty State
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                        <Heart className="text-slate-300" size={32} />
                                    </div>
                                    <h3 className="font-bold text-slate-900">No posts yet</h3>
                                    <p className="text-slate-500 text-sm">Be the first to share medical insights with the ProDoc community.</p>
                                </motion.div>
                            ) : (
                                // Actual Posts
                                posts.map(post => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-md"
                                    >
                                        {/* Post Header */}
                                        <div className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {post.authorImage ? (
                                                    <img src={post.authorImage} alt={post.author} className="w-12 h-12 rounded-full object-cover border-2 border-teal-50" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                                                        {post.author[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm leading-tight hover:text-teal-600 transition-colors cursor-pointer">{post.author}</h4>
                                                    <p className="text-xs text-slate-500 font-medium">{post.specialty} • {post.timeAgo}</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-300 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-all">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>

                                        {/* Post Image */}
                                        {post.image && (
                                            <div className="px-4 pb-4">
                                                <div className="w-full aspect-[16/9] bg-slate-50 overflow-hidden rounded-[1.5rem] border border-slate-100">
                                                    <img src={post.image} alt="Post content" className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Post Content */}
                                        <div className="px-6 pb-6">
                                            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[15px]">{post.content}</p>
                                        </div>

                                        {/* Post Actions */}
                                        <div className="p-4 px-6 flex items-center justify-between border-t border-slate-50 bg-slate-50/30">
                                            <div className="flex items-center gap-6">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center gap-2 text-sm font-bold transition-all ${post.isLiked ? 'text-rose-500 scale-110' : 'text-slate-500 hover:text-slate-800'}`}
                                                >
                                                    <Heart size={20} className={post.isLiked ? 'fill-rose-500 stroke-rose-500' : ''} />
                                                    {post.likes}
                                                </button>
                                                <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                                    <MessageCircle size={20} />
                                                    {post.comments}
                                                </button>
                                                <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                                    <Share2 size={20} />
                                                    {post.shares}
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleBookmark(post.id)}
                                                className={`p-2 rounded-full transition-all ${post.isBookmarked ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:bg-slate-50'}`}
                                            >
                                                <Bookmark size={20} className={post.isBookmarked ? 'fill-teal-600 stroke-teal-600' : ''} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-36 h-fit">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-6 px-2">Suggested Doctors</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between gap-3 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:ring-2 ring-teal-100 transition-all" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">Dr. Name {i}</p>
                                            <p className="text-[10px] text-slate-500">Neurologist</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-teal-600 border border-teal-100 hover:bg-teal-600 hover:text-white px-3 py-1.5 rounded-lg transition-all">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors border-t border-slate-50">
                            View All Suggestions
                        </button>
                    </div>

                    <div className="text-center p-6">
                        <p className="text-xs text-slate-400">
                            © 2026 ProDoc Content Hub<br />
                            Privacy • Terms • Guidelines
                        </p>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default ContentHub;
