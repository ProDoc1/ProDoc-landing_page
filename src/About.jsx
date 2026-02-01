import React, { useState, useEffect, useRef } from 'react';
import professionalDoc from './assets/professionaldoc.png';
import LogoWithWords from './assets/Logo_with_words.png';
import Aurora from "./components/Aurora";
import Carousel from './components/Carousel';
import Team from './components/team';
import emailjs from '@emailjs/browser';
import {
  ShieldCheck,
  Target,
  Users,
  Building2,
  HeartPulse,
  CheckCircle,
  Search,
  Cpu,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  Star,
  ChevronRight,
} from 'lucide-react';

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
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const TiltImage = ({ src, alt, className }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width;
    const yPct = y / rect.height;
    const xRot = (0.5 - yPct) * 20;
    const yRot = (xPct - 0.5) * 20;
    setRotate({ x: xRot, y: yRot });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
      }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
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
    <div ref={countRef} className={`text-3xl md:text-4xl font-bold text-teal-600 ${className}`}>
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
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevTestimonial} className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-teal-600 hover:bg-white transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <button onClick={nextTestimonial} className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-teal-600 hover:bg-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <img src={`https://picsum.photos/seed/user${index}/40/40.jpg?random=${index}`} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"{testimonial.text}"</p>
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
    <div ref={containerRef} className="relative py-12">
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-teal-100 rounded-full"></div>
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600 rounded-full transition-all duration-100 origin-top" style={{ height: `${progress * 100}%` }}></div>
      <div className="space-y-8 md:space-y-12 relative">
        {events.map((event, index) => {
          const isActive = index === activeIndex;
          return (
            <div key={index} className={`flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 transition-all duration-700 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
              <div className={`w-full md:w-1/2 transition-all duration-500 ${isActive ? 'opacity-100 scale-105 -translate-y-2' : 'opacity-60 scale-100'}`}>
                <div className={`rounded-2xl p-6 border-2 transition-all ${isActive ? 'bg-white border-teal-500 shadow-xl' : 'bg-white/80 border-transparent shadow-sm'}`}>
                  <div className={`mb-1 text-sm font-bold uppercase tracking-wider ${isActive ? 'text-teal-600' : 'text-slate-400'}`}>Year {event.year}</div>
                  <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{event.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{event.description}</p>
                </div>
              </div>
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold shadow-lg transition-all border-4 border-white relative z-10 ${isActive ? 'bg-teal-600 text-white scale-125' : 'bg-white text-slate-500'}`}>
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

const AboutPage = () => {
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

    // Prepare Template Params to match your EmailJS Dashboard template variables
    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      // Replace these placeholders with your ACTUAL keys from EmailJS
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
    { year: "2027", title: "National Expansion", description: "Expanding services across the entire country" },
  ];

  return (
    <div className="min-h-screen bg-[#E4F0F1] relative overflow-hidden selection:bg-teal-200">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-300/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 lg:pt-48 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <Reveal delay={100}>
              <h1 className="font-bold text-slate-900 leading-tight">
                <span className="block text-base md:text-3xl text-slate-700">About</span>
                <span className="block text-3xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">ProDoc</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm max-w-xl">
                <p className="text-lg text-slate-700">ProDoc bridges the gap between patients and verified professionals by simplifying health reports and instantly connecting patients to the right doctor.</p>
              </div>
            </Reveal>
            <Reveal delay={300}>
            </Reveal>
          </div>
          <div className="lg:col-span-5 flex justify-center pt-8">
            <Reveal delay={400}>
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-white/50">
                <TiltImage src={professionalDoc} alt="Professional Doctor" className="w-full h-full" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                    <p className="text-slate-800 font-bold text-sm">100% Verified</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 mb-16 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, end: 1000, label: "Happy Patients" },
            { icon: ShieldCheck, end: 200, label: "Verified Doctors" },
            { icon: Building2, end: 50, label: "Partner Clinics" },
            { icon: Star, end: 4.8, suffix: " / 5", label: "Average Rating" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2 flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <stat.icon className="w-8 h-8 text-teal-600" />
              </div>
              <Counter end={stat.end} suffix={stat.suffix || "+"} className="text-2xl font-bold text-teal-600" />
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          <Reveal delay={100} className="lg:col-span-5">
            <div style={{ height: '500px', width: '100%' }}>
              <Carousel baseWidth={Math.min(380, window.innerWidth - 32)} autoplay={true} />
            </div>
          </Reveal>
          <div className="lg:col-span-7 pt-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">The Problems We Solve</h3>
            <div className="grid gap-5">
              {["Trust Issues", "Information Overload", "Lack of Transparency"].map((prob, i) => (
                <Reveal key={i} delay={200 + (i*100)}>
                  <div className="bg-teal-500 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                    <AlertCircle className="w-6 h-6 text-white shrink-0" />
                    <div>
                      <h4 className="font-bold text-white mb-1">{prob}</h4>
                      <p className="text-teal-50 text-sm">Providing reliable solutions to navigate complex healthcare landscapes.</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <Reveal delay={100}><h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2></Reveal>
          <div className="bg-white rounded-3xl p-8 shadow-lg"><TestimonialCarousel testimonials={testimonials} /></div>
        </div>

        <div className="mb-16">
          <Reveal delay={100}><h2 className="text-3xl font-bold text-center mb-8">Our Journey</h2></Reveal>
          <div className="bg-white rounded-3xl p-8 shadow-lg"><Timeline events={timelineEvents} /></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Reveal delay={100}>
            <div className="bg-white rounded-3xl p-10 shadow-lg border-t-4 border-teal-500 hover:-translate-y-1 transition-all">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900"><Target className="text-teal-600" /> Mission</h3>
              <p className="text-slate-600 leading-relaxed">To empower patients with transparent, reliable healthcare information accessible anytime, anywhere.</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="bg-white rounded-3xl p-10 shadow-lg border-t-4 border-teal-500 hover:-translate-y-1 transition-all">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900"><HeartPulse className="text-teal-600" /> Vision</h3>
              <p className="text-slate-600 leading-relaxed">To be the most trusted digital healthcare companion, creating a healthier global community.</p>
            </div>
          </Reveal>
        </div>

        <div id="team" className="mb-20"><Team /></div>

        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <Reveal className="md:col-span-12">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden group">
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-slate-900">Get in Touch</h2>
                  <p className="text-lg text-slate-600">Have questions? Our team is here to assist you on your journey to better healthcare.</p>
                  <div className="flex justify-center md:justify-start">
                    <Mail className="w-56 h-56 text-teal-500/10 group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                </div>

                <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                  {submitStatus === 'success' && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl">Message sent successfully!</div>}
                  {submitStatus === 'error' && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">Failed to send message. Check your keys.</div>}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none" />
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none" />
                  <textarea rows="4" name="message" value={formData.message} onChange={handleChange} placeholder="Message" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none resize-none"></textarea>
                  
                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#14B8A6] text-white py-4 rounded-xl font-bold hover:bg-[#0f968c] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </div>

        {/* --- SECTION 5: FOOTER --- */}
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
                          {['Find a Doctor', 'How it Works', 'Our Team', 'Reviews'].map((item) => (
                             <li key={item}><a href="#" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                                <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                                {item}
                             </a></li>
                          ))}
                       </ul>
                    </div>
        
                    <div className="md:col-span-2">
                       <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Company</h4>
                       <ul className="space-y-4 text-sm">
                          {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                             <li key={item}><a href="#" className="hover:text-teal-600 transition-colors flex items-center gap-2 group">
                                <span className="w-0 h-0.5 bg-teal-600 group-hover:w-4 transition-all"></span>
                                {item}
                             </a></li>
                          ))}
                       </ul>
                    </div>
        
                    <div className="md:col-span-4">
                       <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Contact</h4>
                       <ul className="space-y-4 text-sm mb-8">
                          <li className="flex items-center gap-3 text-slate-600">
                             <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Mail size={18} /></div>
                             <span>prdoc2025se06@gmail.com</span>
                          </li>
                          <li className="flex items-center gap-3 text-slate-600">
                             <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Phone size={18} /></div>
                             <span>+94 76 793 7055</span>
                          </li>
                       </ul>
                 
                       <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200">
                          <p className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide">Are you a doctor?</p>
                          <button className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all transform active:scale-95">
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
                    <p>© {new Date().getFullYear()} ProDoc Group Project (SE-06). All rights reserved.</p>
                 </div>
              </footer>
      </div>
    </div>
  );
};

export default AboutPage;