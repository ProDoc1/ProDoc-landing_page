import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, X, Sparkles, Bot } from 'lucide-react';

const EveBotIcon = () => {
    return (
        <div className="relative w-28 h-36 flex flex-col items-center justify-center pointer-events-none drop-shadow-2xl scale-[0.8] origin-bottom">
            {/* Head */}
            <motion.div
                className="relative w-[5.5rem] h-[4.2rem] bg-[radial-gradient(circle_at_50%_15%,#ffffff_10%,#e2e8f0_60%,#94a3b8_100%)] rounded-[45%_45%_50%_50%] z-20 flex flex-col items-center overflow-hidden border-b border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_-3px_-6px_10px_rgba(0,0,0,0.15),inset_2px_6px_12px_rgba(255,255,255,1)]"
                animate={{
                    y: [-2, 4, -2],
                    rotateZ: [-2, 2, -2],
                    rotateX: [0, -5, 0]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: 'bottom center' }}
            >
                {/* Visor */}
                <div className="w-[82%] h-[65%] bg-[linear-gradient(180deg,#1a1a1a_0%,#000000_100%)] rounded-[45%_45%_50%_50%] mt-1.5 flex items-center justify-center overflow-hidden relative shadow-[inset_0_4px_6px_rgba(255,255,255,0.2),inset_0_-2px_8px_rgba(0,0,0,0.9),0_2px_4px_rgba(0,0,0,0.6)]">

                    {/* Glossy top reflection on visor */}
                    <div className="absolute top-[2px] left-[15%] w-[70%] h-3 bg-gradient-to-b from-white/30 to-transparent rounded-[50%] blur-[0.5px]"></div>
                    <div className="absolute bottom-[2px] right-[10%] w-[30%] h-2 bg-gradient-to-t from-white/10 to-transparent rounded-[50%] blur-[1px]"></div>

                    {/* Scanlines on visor */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_3px] z-10 pointer-events-none opacity-50 mix-blend-overlay"></div>

                    {/* Eyes */}
                    <div className="flex gap-[0.4rem] relative z-0 mt-0.5">
                        <motion.div
                            className="w-[1.4rem] h-[0.9rem] bg-[#00f0ff] rounded-[50%_50%_40%_40%] shadow-[0_0_15px_3px_rgba(0,240,255,0.8),inset_0_0_8px_rgba(255,255,255,0.9)]"
                            animate={{
                                scaleY: [1, 0.05, 1, 1, 1, 1, 1],
                                opacity: [1, 0.7, 1, 1, 1, 1, 1],
                                x: [0, -1, 0, 1, 0]
                            }}
                            transition={{ duration: 5, times: [0, 0.04, 0.08, 0.5, 0.6, 0.7, 1], repeat: Infinity, repeatDelay: 1 }}
                            style={{ transform: 'rotate(-8deg)' }}
                        ></motion.div>
                        <motion.div
                            className="w-[1.4rem] h-[0.9rem] bg-[#00f0ff] rounded-[50%_50%_40%_40%] shadow-[0_0_15px_3px_rgba(0,240,255,0.8),inset_0_0_8px_rgba(255,255,255,0.9)]"
                            animate={{
                                scaleY: [1, 0.05, 1, 1, 1, 1, 1],
                                opacity: [1, 0.7, 1, 1, 1, 1, 1],
                                x: [0, -1, 0, 1, 0]
                            }}
                            transition={{ duration: 5, times: [0, 0.04, 0.08, 0.5, 0.6, 0.7, 1], repeat: Infinity, repeatDelay: 1 }}
                            style={{ transform: 'rotate(8deg)' }}
                        ></motion.div>
                    </div>
                </div>
                {/* Top Glossy highlight on head */}
                <div className="absolute top-0.5 left-[20%] w-[60%] h-4 bg-gradient-to-b from-white/90 to-transparent opacity-80 rounded-[50%] blur-[1.5px]"></div>
            </motion.div>

            {/* Gap between head and body */}
            <div className="h-1.5 w-full relative z-10 flex justify-center items-center">
                {/* Dark neck cavity shadow */}
                <div className="w-[3.5rem] h-full bg-black/20 rounded-[50%] blur-[2px]"></div>
            </div>

            {/* Body */}
            <motion.div
                className="relative w-[5.5rem] h-[6rem] bg-[radial-gradient(circle_at_40%_30%,#ffffff_20%,#e2e8f0_60%,#94a3b8_95%)] shadow-[0_20px_30px_rgba(0,0,0,0.25),inset_-6px_-10px_15px_rgba(0,0,0,0.15),inset_6px_10px_15px_rgba(255,255,255,0.9)] z-10 flex border border-white/20"
                animate={{ y: [0, -3, 0], rotateZ: [1, -1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ borderRadius: '40% 40% 50% 50% / 20% 20% 80% 80%' }}
            >
                {/* Chest Display */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6 flex justify-center items-center opacity-90 drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-emerald-400">
                        <path d="M12 22C12 22 4 16 4 9C4 3 12 2 12 2C12 2 20 3 20 9C20 16 12 22 12 22Z" fill="currentColor" opacity="0.8" />
                        <path d="M12 22V12" stroke="white" strokeWidth="1" opacity="0.5" />
                    </svg>
                </div>

                {/* Glossy body highlight right */}
                <div className="absolute top-3 right-1.5 w-3 h-14 bg-gradient-to-l from-white/60 to-transparent rounded-full blur-[2px] transform rotate-[18deg]"></div>

                {/* Glossy body highlight left */}
                <div className="absolute top-4 left-1 w-2 h-10 bg-gradient-to-r from-white/50 to-transparent rounded-full blur-[1.5px] transform -rotate-[15deg]"></div>
            </motion.div>

            {/* Left Arm */}
            <motion.div
                className="absolute left-[0.2rem] top-[5.2rem] w-[1.3rem] h-[4.2rem] bg-[radial-gradient(ellipse_at_30%_30%,#ffffff_10%,#e2e8f0_60%,#94a3b8_100%)] shadow-[0_8px_15px_rgba(0,0,0,0.2),inset_-2px_-4px_8px_rgba(0,0,0,0.2),inset_2px_4px_8px_rgba(255,255,255,0.9)] origin-top z-30"
                animate={{
                    rotateZ: [20, 32, 20],
                    x: [0, -4, 0],
                    y: [0, -1, 0]
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ borderRadius: '50% 100% 100% 50% / 20% 50% 50% 20%' }}
            >
                <div className="absolute top-2 left-0.5 w-1 h-10 bg-white/60 rounded-full blur-[1px]"></div>
            </motion.div>

            {/* Right Arm */}
            <motion.div
                className="absolute right-[0.2rem] top-[5.2rem] w-[1.3rem] h-[4.2rem] bg-[radial-gradient(ellipse_at_70%_30%,#ffffff_10%,#e2e8f0_60%,#94a3b8_100%)] shadow-[0_8px_15px_rgba(0,0,0,0.2),inset_2px_-4px_8px_rgba(0,0,0,0.2),inset_-2px_4px_8px_rgba(255,255,255,0.9)] origin-top z-30"
                animate={{
                    rotateZ: [-20, -32, -20],
                    x: [0, 4, 0],
                    y: [0, -1, 0]
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ borderRadius: '100% 50% 50% 100% / 50% 20% 20% 50%' }}
            >
                <div className="absolute top-2 right-0.5 w-1 h-10 bg-white/60 rounded-full blur-[1px]"></div>
            </motion.div>

            {/* Drop shadow on floor */}
            <motion.div
                className="absolute -bottom-8 w-16 h-4 bg-teal-900/10 rounded-[50%] blur-[6px]"
                animate={{ scale: [1, 0.8, 1], opacity: [0.6, 0.3, 0.6] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            ></motion.div>
        </div>
    );
};

const MiniBot = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleBotClick = () => {
        // Redirect to AI Chatbot. 
        // In local development, it runs on port 4000. In production, assume it's routed to /chatbot via Vercel or similar.
        const chatbotUrl = window.location.hostname === 'localhost' ? 'http://localhost:4000' : '/chatbot';
        window.open(chatbotUrl, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            {/* Chat Prompt Bubble */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10, x: 20 }}
                        className="mb-8 mr-4 bg-white px-5 py-3.5 rounded-2xl rounded-br-none shadow-2xl border border-teal-100 pointer-events-auto cursor-pointer relative"
                        onClick={handleBotClick}
                    >
                        <p className="text-sm font-bold text-teal-900 flex items-center gap-2">
                            <Sparkles size={16} className="text-teal-500" />
                            Hi! Need a Specialist?
                        </p>
                        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-teal-100 transform rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The EVE Bot Button */}
            <div className="relative pointer-events-auto mr-4 mb-2">
                <button
                    className="relative outline-none transition-transform hover:scale-105 active:scale-95 group"
                    onClick={handleBotClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="absolute inset-0 bg-teal-300 opacity-0 group-hover:opacity-20 blur-2xl rounded-full transition-opacity duration-500"></div>
                    <EveBotIcon isOpen={false} />
                </button>
            </div>
        </div>
    );
};

export default MiniBot;
