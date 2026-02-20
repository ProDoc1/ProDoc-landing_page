import React, { useState } from 'react';
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
    Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContentHub = ({ onNavigateHome, onNavigateLogin }) => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Dr. Sarah Perera",
            specialty: "Cardiologist",
            authorImage: null, // Placeholder
            timeAgo: "2 hours ago",
            content: "Heart health is checking your blood pressure regularly. Small changes in diet can make a huge difference in long-term cardiovascular health. #HeartHealth #Wellness #Cardiology",
            image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2670&auto=format&fit=crop",
            likes: 124,
            comments: 18,
            shares: 5,
            isLiked: false,
            isBookmarked: false
        },
        {
            id: 2,
            author: "Dr. Anura Bandara",
            specialty: "Oncologist",
            authorImage: null,
            timeAgo: "5 hours ago",
            content: "Early detection saves lives. Don't skip your annual screenings. Today we discussed the latest advancements in immunotherapy at the National Health Symposium.",
            image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2670&auto=format&fit=crop",
            likes: 89,
            comments: 42,
            shares: 12,
            isLiked: true,
            isBookmarked: true
        },
        {
            id: 3,
            author: "Dr. Emily Chen",
            specialty: "Pediatrician",
            authorImage: null,
            timeAgo: "1 day ago",
            content: "Flu season is approaching! Here are my top 5 tips for keeping your little ones healthy this winter:\n1. Wash hands frequently\n2. Stay hydrated\n3. Get plenty of rest...",
            image: null, // Text-only post
            likes: 256,
            comments: 64,
            shares: 30,
            isLiked: false,
            isBookmarked: false
        }
    ]);

    const [activeTab, setActiveTab] = useState('For You');

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

                {/* LEFT SIDEBAR - Navigation & Filters */}
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

                    {/* Create Post Input (Mock) */}
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center gap-4 sticky top-36 z-10">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            className="flex-1 bg-slate-50 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                        />
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                            <ImageIcon size={20} />
                        </button>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {posts.map(post => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100"
                            >
                                {/* Post Header */}
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                                            {post.author[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{post.author}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{post.specialty} • {post.timeAgo}</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:bg-slate-50 p-2 rounded-full transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                {/* Post Content */}
                                <div className="px-6 pb-4">
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                                </div>

                                {/* Post Image */}
                                {post.image && (
                                    <div className="w-full aspect-video bg-slate-100 overflow-hidden">
                                        <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* Post Actions */}
                                <div className="p-4 px-6 flex items-center justify-between border-t border-slate-50">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-slate-800'}`}
                                        >
                                            <Heart size={20} className={post.isLiked ? 'fill-rose-500' : ''} />
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
                                        className={`p-2 rounded-full transition-colors ${post.isBookmarked ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        <Bookmark size={20} className={post.isBookmarked ? 'fill-teal-600' : ''} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>

                {/* RIGHT SIDEBAR - Suggestions */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-36 h-fit">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-6 px-2">Suggested Doctors</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Dr. Name {i}</p>
                                            <p className="text-[10px] text-slate-500">Neurologist</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors border-t border-slate-50">
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

            {/* Mobile Navigation Bar (Bottom) - Optional if main nav doesn't cover it, but sticking to main nav for now */}
        </div>
    );
};

export default ContentHub;
