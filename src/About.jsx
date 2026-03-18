import React, { useState, useEffect, useRef } from 'react';
import professionalDoc from './assets/professionaldoc.png';
import LogoWithWords from './assets/Logo_with_words.png';
import Aurora from "./components/Aurora";
import Carousel from './components/Carousel';
import Team from './components/team';
import emailjs from '@emailjs/browser';
import {
  ShieldCheck, Target, Users, Building2, HeartPulse, CheckCircle, Search, Cpu,
  Facebook, Instagram, Linkedin, Mail, Phone, ArrowRight, AlertCircle, Star,
  ChevronRight, UserCheck, FileLock, MoveRight
} from 'lucide-react';
import { GradientBackground } from './components/ui/gradient-background';
import DisplayCards from './components/ui/display-cards';

// --- ANIMATION COMPONENTS ---
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};



const Counter = ({ end, duration = 2000, suffix = "", className = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => { if (countRef.current) observer.unobserve(countRef.current); };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    let animationFrameId;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  }, [isVisible, end, duration]);

  return (
    <div ref={countRef} className={`text-4xl md:text-5xl font-bold tracking-tight ${className}`}>
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextTestimonial = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8 px-4">
        <h3 className="text-2xl font-bold text-slate-900">Voices of Trust</h3>
        <div className="flex items-center gap-3">
          <button onClick={prevTestimonial} className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-all bg-white shadow-sm">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button onClick={nextTestimonial} className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-all bg-white shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-[0.22,1,0.36,1]" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden group hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all">
                {/* Decorative subtle pulse */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-50 rounded-full blur-2xl group-hover:bg-teal-100 transition-colors"></div>

                <div className="flex items-center mb-6 relative z-10">
                  <div className="flex-shrink-0 p-1 rounded-full border border-slate-100 shadow-sm bg-white">
                    <img src={`https://picsum.photos/seed/user${index}/40/40.jpg?random=${index}`} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-teal-500 fill-teal-500" />)}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 italic text-lg leading-relaxed relative z-10">"{testimonial.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Timeline = ({ events }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;
      const startScroll = containerTop - windowHeight + (windowHeight * 0.2);
      const endScroll = containerTop + containerHeight - (windowHeight * 0.8);
      let percentage = (window.scrollY - startScroll) / (endScroll - startScroll);
      percentage = Math.max(0, Math.min(1, percentage));
      setProgress(percentage);
      setActiveIndex(Math.round(percentage * (events.length - 1)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [events.length]);

  return (
    <div ref={containerRef} className="relative py-12 lg:py-24 max-w-5xl mx-auto">
      {/* Background Track */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-slate-200"></div>
      {/* Active Track */}
      <div
        className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-teal-500 transition-all duration-100 origin-top"
        style={{ height: `${progress * 100}%` }}>
      </div>

      <div className="space-y-12 md:space-y-20 relative">
        {events.map((event, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

          return (
            <div key={index} className={`flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 transition-all duration-700 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
              <div className={`w-full md:w-1/2 transition-all duration-500 ${isActive || isPast ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-8'}`}>
                <div className={`rounded-3xl p-8 border transition-all duration-300 relative bg-white
                  ${isActive
                    ? 'border-teal-400 shadow-[0_8px_30px_rgba(20,184,166,0.12)] scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>

                  <div className="relative z-10">
                    <div className={`text-xs font-bold tracking-widest uppercase mb-3 ${isActive ? 'text-teal-600' : 'text-slate-400'}`}>
                      {event.year}
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                      {event.title}
                    </h3>
                    <p className={`leading-relaxed text-sm md:text-base ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold font-mono text-sm transition-all duration-300 relative z-10 shrink-0
                ${isActive
                  ? 'bg-teal-500 text-white shadow-[0_0_0_4px_rgba(255,255,255,1),0_0_0_6px_rgba(20,184,166,0.2)] scale-110'
                  : isPast
                    ? 'bg-white border-2 border-teal-500 text-teal-600'
                    : 'bg-slate-50 border border-slate-200 text-slate-400'}`}>
                {event.year.substring(2)}
              </div>

              <div className="hidden md:block w-1/2"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AboutPage = ({ onNavigateDoctorRegistration }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      to_email: 'prdoc2025se06@gmail.com',
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const serviceId = 'service_jajwzgf';
      const templateId = 'template_o75vnnp';
      const publicKey = 'LUysmcNbwO0ok5GAV';
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Email sending failed:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const testimonials = [
    { name: "Sarah J.", text: "It's needed cause some people are struggling to find the right doctor for their disease so I think platform like this would be very helpful." },
    { name: "Mark D.", text: "Nowadays, Medical industry is very high expensive industry where the treatments are subjectively technical and cannot argue. So information to choose the right doctor is highly useful." },
    { name: "Emily R.", text: "Patients often choose doctors randomly or based on word of mouth. A platform helps them find doctors who specialize." }
  ];

  const timelineEvents = [
    { year: "2025", title: "ProDoc Founded", description: "Started with a mission to bring transparency to healthcare in Sri Lanka" },
    { year: "2026", title: "1,000+ Users", description: "Reached a major milestone with thousands of patients trusting our platform" },
    { year: "2026", title: "AI Integration", description: "Introduced AI-powered medical decision support to help patients" },
  ];

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden selection:bg-teal-100 selection:text-teal-900 font-sans">

      {/* Animated Teal & White Gradient Background via UI Component */}
      <GradientBackground className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50" overlay={true} overlayOpacity={0.05} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24">

        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center mb-32">
          <div className="space-y-8 relative">
            {/* Minimalist Accents */}
            <div className="absolute -left-6 top-8 w-1 h-24 bg-teal-500 rounded-r-lg"></div>

            <Reveal delay={100}>
              <h1 className="font-extrabold text-slate-900 leading-[1.05] tracking-tight text-5xl md:text-7xl">
                About <br />
                <span className="text-teal-600">
                  ProDoc
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed font-light">
                Bridging the gap between patients and verified professionals by simplifying health reports and instantly connecting you to the right doctor.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                {[
                  { icon: ShieldCheck, title: "Secure Data", desc: "HIPAA-compliant flow" },
                  { icon: UserCheck, title: "Verified", desc: "Official credentials" },
                  { icon: FileLock, title: "Private", desc: "Explicit consent strictly required" }
                ].map((feature, idx) => (
                  <div key={idx} className="group flex flex-col items-start gap-4 bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300">
                    <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{feature.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Reveal delay={400} className="relative w-full max-w-[340px] lg:max-w-[380px]">
              {/* Abstract decorative frame */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-slate-200 bg-white shadow-xl -z-10 xl:translate-x-6 xl:translate-y-6"></div>

              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
                <img src={professionalDoc} alt="Professional Doctor" className="w-full h-full object-cover" />

                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-white shadow-lg flex items-center gap-4">
                  <div className="p-2.5 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Network Status</p>
                    <p className="text-slate-900 font-bold text-sm">100% Professionals Verified</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* STATS STRIP - Minimalist White Cards */}
        <div className="mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Users, end: 1000, label: "Patients", suffix: "+" },
              { icon: ShieldCheck, end: 200, label: "Verified Docs", suffix: "+" },
              { icon: Building2, end: 50, label: "Clinics", suffix: "+" },
              { icon: Star, end: 4.8, label: "Rating", suffix: "/5" }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center group">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-50 transition-colors">
                  <stat.icon className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <Counter end={stat.end} suffix={stat.suffix} className="text-slate-900 mb-1" />
                <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Carousel & Problems */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20 lg:mb-32 items-center">
          {/* Left: Carousel */}
          <Reveal delay={100} className="flex items-center justify-center w-full h-full min-h-[450px]">
            <Carousel baseWidth={windowWidth < 640 ? 320 : windowWidth < 1024 ? 400 : 540} autoplay={true} autoplayDelay={4000} pauseOnHover={true} loop={true} />
          </Reveal>

          {/* Right: The Problems We Solve */}
          <div className="flex flex-col justify-center items-center text-center gap-6">
            <Reveal delay={200}>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">The Challenges We Overcome</h3>
              <p className="text-slate-600 text-lg mb-4 max-w-lg mx-auto">Navigating healthcare can be confusing. We built ProDoc to solve these core issues.</p>
            </Reveal>

            <Reveal delay={300} className="w-full flex justify-center mt-8">
              <DisplayCards />
            </Reveal>
          </div>
        </div>

        {/* Mission & Vision - Distinct Light Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-32 relative z-10">
          {/* Mission Card */}
          <Reveal delay={100}>
            <div className="relative overflow-hidden bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 border-t-[4px] border-t-teal-500 group transition-all duration-300 hover:shadow-[0_20px_40px_rgb(20,184,166,0.08)]">
              {/* Huge subtle background watermark */}
              <Target className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 h-64 text-teal-600/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" strokeWidth={1} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center text-teal-600">
                    <Target className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mission</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                  To empower patients with transparent, reliable healthcare information accessible anytime, anywhere, ensuring no decision is made in the dark.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Vision Card */}
          <Reveal delay={200}>
            <div className="relative overflow-hidden bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 border-t-[4px] border-t-teal-500 group transition-all duration-300 hover:shadow-[0_20px_40px_rgb(20,184,166,0.08)]">
              {/* Huge subtle background watermark */}
              <HeartPulse className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 h-64 text-teal-600/5 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700" strokeWidth={1} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center text-teal-600">
                    <HeartPulse className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vision</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                  To be the most trusted digital healthcare companion, seamlessly connecting patients with technology to create a healthier global community.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Testimonials */}
        <div className="mb-32">
          <TestimonialCarousel testimonials={testimonials} />
        </div>

        {/* Technology & Audience */}
        <div className="grid lg:grid-cols-12 gap-6 mb-32 items-stretch">

          {/* Tech Box */}
          <Reveal delay={100} className="lg:col-span-7 h-full">
            <div className="bg-[#146154] rounded-[2.5rem] p-10 md:p-14 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden group">
              {/* Aurora Glow in the dark box */}
              <div className="absolute inset-0 z-0 opacity-70 mix-blend-screen pointer-events-none transition-opacity duration-1000 group-hover:opacity-100">
                <Aurora colorStops={["#ffffff", "#5eead5", "#22AB8C"]} blend={0.5} amplitude={7.0} speed={0.4} />
              </div>

              {/* Background Watermark */}
              <div className="absolute -top-12 -right-12 p-8 opacity-5 mix-blend-overlay">
                <Cpu className="w-96 h-96 text-white group-hover:scale-105 transition-transform duration-700" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="bg-white/10 border border-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm backdrop-blur-md">
                  <Cpu className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Technology With Responsibility</h3>
                <p className="text-slate-300 leading-relaxed text-lg max-w-lg mb-12">
                  ProDoc utilizes cutting-edge AI to interpret medical data for clarity.
                  We strictly adhere to the principle that technology assists, but never
                  replaces, the human element of professional care.
                </p>

                <div className="mt-auto flex">
                  <button onClick={() => window.open('https://newsroom.heart.org/news/new-guidance-offered-for-responsible-ai-use-in-health-care', '_blank')}
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-teal-50 transition-colors group/btn">
                    Read Documentation
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Audience Box */}
          <Reveal delay={200} className="lg:col-span-5 h-full">
            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Built For Everyone</h3>
              <div className="flex flex-col gap-3 flex-grow justify-center">
                {[
                  { icon: Users, label: "Patients", desc: "Seeking trusted care." },
                  { icon: Building2, label: "Clinics", desc: "Managing reputation." },
                  { icon: HeartPulse, label: "Providers", desc: "Showcasing expertise." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:border-teal-200 transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.label}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Timeline */}
        <div className="mb-32">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-bold tracking-wide uppercase mb-4">
              Our Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Milestones</h2>
          </Reveal>
          <Timeline events={timelineEvents} />
        </div>

        {/* Team Component */}
        <div id="team" className="mb-32 py-16">
          <Team />
        </div>

        {/* Contact Form - Clean White Card */}
        <div className="mb-32">
          <Reveal>
            <div className="bg-teal-600/20 rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-slate-900/10 shadow-xl overflow-hidden relative">

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="flex flex-col justify-center max-w-md relative">
                  {/* Huge subtle background watermark */}
                  <Mail className="absolute -left-12 top-1/2 -translate-y-1/2 w-72 h-72 text-slate-600/5 pointer-events-none -rotate-12" strokeWidth={1} />

                  <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Let's connect.</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-10">
                      Have questions about ProDoc or need help getting started? Our team is here to assist you on your journey.
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-slate-700">
                      </div>
                      <div className="flex items-center gap-4 text-slate-700">
                      </div>
                    </div>
                  </div>
                </div>

                <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                  {submitStatus === 'success' && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2"><CheckCircle className="w-5 h-5" />Message sent successfully!</div>}
                  {submitStatus === 'error' && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2"><AlertCircle className="w-5 h-5" />Failed to send message. Please try again.</div>}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 ml-1">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 ml-1">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 ml-1">Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 ml-1">Message</label>
                    <textarea rows="4" name="message" value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none transition-all"></textarea>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-teal-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-md">
                    {isSubmitting ? "Sending..." : "Submit Message"}
                    <MoveRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </div>

        {/* FOOTER */}
        <footer className="bg-white rounded-[3rem] p-10 md:p-16 text-slate-600 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-400"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <img src={LogoWithWords} alt="ProDoc" className="h-10 md:h-12 w-auto" />
              </div>
              <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                ProDoc is Sri Lanka's first centralized platform for transparent healthcare.
              </p>
              <div className="flex gap-3 mt-2">
                <a href="#" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Facebook size={18} /></a>
                <a href="https://www.instagram.com/prodoclk/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Instagram size={18} /></a>
                <a href="https://www.linkedin.com/company/prodoclk/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-4 text-sm">
                {[
                  { name: 'Find a Doctor', url: '/doctors' },
                  { name: 'How it Works', url: '/how-it-works' },
                  { name: 'Our Team', url: '/team' },
                  { name: 'Reviews', url: '/reviews' }
                ].map((item) => (
                  <li key={item.name}><a href={item.url} className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                    {item.name}
                  </a></li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-4 text-sm">
                {[
                  { name: 'About Us', url: '/about' },
                  { name: 'Careers', url: '/careers' },
                  { name: 'Privacy Policy', url: '/privacy' },
                  { name: 'Terms of Service', url: '/terms' }
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.url} className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Mail size={18} /></div>
                    <a href="mailto:prdoc2025se06@gmail.com" className="hover:text-teal-600 transition-colors">prdoc2025se06@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Phone size={18} /></div>
                  <span>+94 74 279 7484</span>
                </li>
              </ul>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide">Are you a doctor?</p>
                <button 
                  onClick={onNavigateDoctorRegistration}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all transform active:scale-95"
                >
                  Join ProDoc Network
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>All Systems Operational</span>
            </div>
            <p>©️ {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;