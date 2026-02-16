import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, UserCheck, AlertTriangle, HelpCircle, Handshake } from 'lucide-react';

const TermsOfService = ({ onBack }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    const sections = [
        {
            title: "Acceptance of Terms",
            icon: <Handshake size={24} className="text-teal-600" />,
            content: "By accessing and using ProDoc, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
        },
        {
            title: "User Responsibilities",
            icon: <UserCheck size={24} className="text-teal-600" />,
            content: "Users are responsible for providing accurate information during registration. Any misuse of the platform, including providing false medical credentials or impersonating others, will result in immediate account termination."
        },
        {
            title: "Platform Role",
            icon: <Scale size={24} className="text-teal-600" />,
            content: "ProDoc is a facilitator platform connecting patients with healthcare providers. We do not provide medical advice ourselves. All clinical decisions and treatments are the sole responsibility of the registered doctors."
        },
        {
            title: "Limitations of Liability",
            icon: <AlertTriangle size={24} className="text-teal-600" />,
            content: "ProDoc is not liable for outcomes of medical consultations or appointments booked through the platform. We strive for 100% uptime but cannot guarantee uninterrupted service due to technical maintenance or external factors."
        },
        {
            title: "Termination of Service",
            icon: <HelpCircle size={24} className="text-teal-600" />,
            content: "We reserve the right to suspend or terminate access to our services at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the platform."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-white p-4 md:p-8 pt-36 md:pt-44 font-sans text-slate-800">
            <div className="max-w-5xl mx-auto">
                <div className="px-4 md:px-8 mb-8">
                    <motion.button
                        onClick={onBack}
                        className="group flex items-center gap-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:border-teal-300 hover:text-teal-700 transition-all"
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ArrowLeft size={18} /> Back to Home
                    </motion.button>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="bg-white/90 backdrop-blur-2xl rounded-[3rem] p-8 md:p-20 shadow-2xl shadow-teal-900/5 border border-white relative overflow-hidden"
                >
                    {/* Decorative Gradient Bar */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400"></div>

                    <motion.div variants={itemVariants} className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            Terms of <span className="text-teal-600">Service</span>
                        </h1>
                        <p className="text-slate-500 text-xl font-light leading-relaxed max-w-2xl">
                            Last updated: February 2025. Please read these terms carefully. By using ProDoc, you agree to the conditions outlined below.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-12">
                        {sections.map((section, index) => (
                            <motion.div key={index} variants={itemVariants} className="group">
                                <div className="flex flex-col md:flex-row items-start gap-8">
                                    <div className="shrink-0 p-5 bg-teal-50 rounded-2xl border border-teal-100 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-teal-500/20">
                                        {React.cloneElement(section.icon, {
                                            className: "transition-colors duration-500 group-hover:text-white"
                                        })}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-wide group-hover:text-teal-700 transition-colors">
                                            {section.title}
                                        </h2>
                                        <p className="text-slate-600 text-lg leading-relaxed font-light">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={itemVariants} className="mt-16 pt-12 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                            By using ProDoc, you acknowledge that you have read and understood these Terms of Service. These terms are governed by the laws of Sri Lanka.
                        </p>
                    </motion.div>
                </motion.div>

                <div className="mt-12 text-center text-slate-400 text-xs font-medium">
                    <p>© {new Date().getFullYear()} ProDoc Sri Lanka. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
