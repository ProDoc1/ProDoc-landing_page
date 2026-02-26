import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Bell } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
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
            title: "Data We Collect",
            icon: <Eye size={24} className="text-teal-600" />,
            content: "We collect information you provide directly to us when you create an account, such as your name, email address, phone number, and professional credentials (for doctors). We also collect medical preferences and history that you choose to share for better healthcare coordination."
        },
        {
            title: "How We Use Your Data",
            icon: <FileText size={24} className="text-teal-600" />,
            content: "Your data is used to provide, maintain, and improve our services, including connecting patients with the right specialists. We use it to verify professional status, process appointments, and send relevant health-related communications."
        },
        {
            title: "Security Measures",
            icon: <ShieldCheck size={24} className="text-teal-600" />,
            content: "We implement industry-standard encryption and security protocols to protect your personal information. Our platform is built with 'Privacy by Design' principles to ensure that your sensitive health data remains confidential and secure."
        },
        {
            title: "Data Sharing",
            icon: <Lock size={24} className="text-teal-600" />,
            content: "We do not sell your personal data. We only share information with healthcare providers you explicitly choose to interact with, or as required by Sri Lankan law. All third-party integrations are strictly vetted for privacy compliance."
        },
        {
            title: "Policy Updates",
            icon: <Bell size={24} className="text-teal-600" />,
            content: "We may update this policy from time to time. We will notify you of any significant changes via email or through a prominent notice on our platform. Continued use of ProDoc after such changes constitutes acceptance of the new policy."
        },
        {
            title: "Google API Services Usage",
            icon: <Lock size={24} className="text-teal-600" />,
            content: "ProDoc's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements. We only access the data you explicitly permit during the Google Sign-In process (such as your email and basic profile information) strictly for authentication and account creation purposes. We do not use Google user data to develop, improve, or train generalized/non-personalized AI or machine learning models."
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
                            Privacy <span className="text-teal-600">Policy</span>
                        </h1>
                        <p className="text-slate-500 text-xl font-light leading-relaxed max-w-2xl">
                            Last updated: February 2025. Your privacy is our priority. This policy outlines how ProDoc handles and protects your personal data.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-12">
                        {sections.map((section, index) => (
                            <motion.div key={index} variants={itemVariants} className="group">
                                <div className="flex flex-col md:flex-row items-start gap-8">
                                    <div className="shrink-0 p-5 bg-teal-50 rounded-2xl border border-teal-100 group-hover:bg-teal-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-teal-500/20">
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

                    <motion.div variants={itemVariants} className="mt-16 pt-12 border-t border-slate-100">
                        <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-bold mb-4">Have questions?</h3>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                    If you have any questions about how we handle your data, our privacy team is here to help.
                                </p>
                                <a
                                    href="mailto:privacy@prodoc.lk"
                                    className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-teal-500/20"
                                >
                                    Contact Privacy Team
                                </a>
                            </div>
                            {/* Background Glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full"></div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="mt-12 text-center text-slate-400 text-xs font-medium">
                    <p>© {new Date().getFullYear()} ProDoc Sri Lanka. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
