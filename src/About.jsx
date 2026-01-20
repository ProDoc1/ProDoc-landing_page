import React, { useState, useEffect, useRef } from 'react';
import professionalDoc from './assets/professionaldoc.png';
import LogoWithWords from './assets/Logo_with_words.png';
import Aurora from "./components/Aurora";
import Carousel from './components/Carousel';
import Team from './components/team';
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
  TrendingUp,
  Award,
  Calendar,
  Zap,
  Clock,
  UserCheck,
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

// Counter Animation Component
const Counter = ({ end, duration = 2000, suffix = "", className = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    let endTime;
    let animationFrameId;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsVisible(false);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <div ref={countRef} className={`text-3xl md:text-4xl font-bold text-teal-600 ${className}`}>
      {count.toLocaleString()}{suffix}
    </div>
  );
};



// Testimonial Carousel Component
const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevTestimonial}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-teal-600 hover:bg-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <button 
          onClick={nextTestimonial}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-teal-600 hover:bg-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={`https://picsum.photos/seed/user${index}/40/40.jpg?random=${index}`} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
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

// --- ANIMATED TIMELINE COMPONENT ---

const Timeline = ({ events }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 1

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const containerHeight = rect.height;

      // Calculate scroll position relative to the container
      // We start progress when the container hits the bottom of the viewport
      const windowHeight = window.innerHeight;
      const startScroll = containerTop - windowHeight + (windowHeight * 0.2);
      const endScroll = containerTop + containerHeight - (windowHeight * 0.8);

      let currentScroll = window.scrollY;

      // Clamp the scroll value
      let percentage = (currentScroll - startScroll) / (endScroll - startScroll);
      percentage = Math.max(0, Math.min(1, percentage));

      setProgress(percentage);

      // Determine which item is active based on progress
      // Map 0-1 progress to 0-(events.length-1) index
      const rawIndex = percentage * (events.length - 1);
      setActiveIndex(Math.round(rawIndex));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [events.length]);

  return (
    <div ref={containerRef} className="relative py-12">
      {/* Center Line (Static Base) - Hidden on mobile */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-teal-100 rounded-full"></div>

      {/* Progress Line (Glowing Animated) - Hidden on mobile */}
      <div
        className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 w-1 bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600 rounded-full shadow-[0_0_20px_rgba(13,148,136,0.8)] transition-all duration-100 ease-out origin-top"
        style={{ height: `${Math.max(0, progress * 100)}%` }}
      ></div>

      {/* Glowing Pulse at the bottom of the progress line - Hidden on mobile */}
      <div
        className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-teal-300 rounded-full blur-md -z-10 transition-all duration-100 ease-out"
        style={{ top: `${Math.max(0, progress * 100)}%`, marginTop: '-12px' }}
      ></div>

      <div className="space-y-8 md:space-y-12 relative">
        {events.map((event, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 transition-all duration-700 ease-out ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content Card */}
              <div
                className={`w-full md:w-1/2 transition-all duration-500 ease-out ${
                  isActive
                    ? 'opacity-100 scale-105 translate-y-[-10px] z-20'
                    : 'opacity-60 scale-100 translate-y-0'
                }`}
              >
                <div
                  className={`
                    rounded-2xl p-4 md:p-6 shadow-md transition-all duration-500 border-2
                    ${isActive
                      ? 'bg-white border-teal-500 shadow-[0_10px_40px_-10px_rgba(13,148,136,0.4)]'
                      : 'bg-white/80 border-transparent shadow-sm hover:shadow-md'
                    }
                  `}
                >
                  <div className={`mb-1 text-sm font-bold uppercase tracking-wider transition-colors duration-500 ${isActive ? 'text-teal-600' : 'text-slate-400'}`}>
                    Year {event.year}
                  </div>
                  <h3 className={`text-lg md:text-xl font-bold mb-2 transition-colors duration-500 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {event.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">{event.description}</p>
                </div>
              </div>

              {/* Center Node (Year Dot) */}
              <div
                className={`
                  relative z-10 flex items-center justify-center transition-all duration-500 ease-out order-first md:order-none
                  ${isActive ? 'scale-125' : 'scale-100 grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}
                `}
              >
                {/* Glow Effect behind active dot */}
                {isActive && (
                  <div className="absolute inset-0 bg-teal-400 rounded-full blur-xl animate-pulse"></div>
                )}

                <div
                  className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-500 border-4 border-white relative z-10
                    ${isActive
                      ? 'bg-teal-600 text-white scale-110 shadow-[0_0_25px_rgba(13,148,136,0.6)]'
                      : 'bg-white text-slate-500'
                    }
                  `}
                >
                  {event.year.substring(2)}
                </div>
              </div>

              {/* Spacer - Hidden on mobile */}
              <div className="hidden md:block w-1/2"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



// --- MAIN PAGE COMPONENT ---

const AboutPage = () => {
  const testimonials = [
    {
      name: "Sarah J.", // Added names for consistency
      text: "It’s needed cause some people are struggling to find the right doctor for their disease so I think platform like this would be very helpful.",
    },
    {
      name: "Mark D.",
      text: "Nowadays, Medical industry is very high expensive industry where the treatments are subjectively technical and cannot argue. So information to choose the right doctor is highly useful effective for quick recovery and its a social responsibility to have transparency within the industry.",
    },
    {
      name: "Emily R.",
      text: "Patients often choose doctors randomly or based on word of mouth. A platform helps them find doctors who specialize in their exact condition",
    }
  ];

  const timelineEvents = [
  {
    year: "2025",
    title: "ProDoc Founded",
    description:
      "Started with a mission to bring transparency to healthcare in Sri Lanka",
  },
  {
    year: "2026",
    title: "1,000+ Users",
    description:
      "Reached a major milestone with thousands of patients trusting our platform",
  },
  {
    year: "2026",
    title: "AI Integration",
    description:
      "Introduced AI-powered medical decision support to help patients understand their health better",
  },
  {
    year: "2027",
    title: "National Expansion (To be Continued)",
    description:
      "Expanding services across the entire country, connecting patients with verified healthcare professionals",
  },
];



  
  

  return (
    <div className="min-h-screen bg-[#E4F0F1] relative overflow-hidden selection:bg-teal-200">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-300/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 lg:pt-48 pb-12 md:pb-16">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <Reveal delay={100}>
              <h1 className="font-bold text-slate-900 leading-tight">
                <span className="block text-base md:text-lg lg:text-3xl text-slate-700">About</span>
                <span className="block text-3xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">ProDoc</span>
              </h1>
            </Reveal>
            
            <Reveal delay={200}>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm max-w-xl">
                <p className="text-lg text-slate-700 leading-relaxed">
                  ProDoc is the centralized platform bridging the gap between patients and verified professionals.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="group bg-[#14B8A6] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:bg-[#0f968c] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                  Find a Doctor
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>
          
          <div className="lg:col-span-5 flex justify-center lg:justify-end pt-8 lg:pt-0">
            <Reveal delay={400}>
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-teal-900/10 ring-8 ring-white/50">
                 <TiltImage 
            src={professionalDoc} 
            alt="Professional Doctor" 
            className="w-full h-full rounded-3xl overflow-hidden"
          />
                 {/* Floating Badge Box */}
                 <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white flex items-center gap-3 animate-float">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                      <p className="text-slate-800 font-bold text-sm">100% Verified</p>
                    </div>
                 </div>
              </div>
            </Reveal>
          </div>
        </div>
        
        
       {/* Statistics Section */}
        <div className="bg-white rounded-3xl p-8 mb-16 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <Counter end={1000} suffix="+" className="text-2xl md:text-3xl font-bold text-teal-600" />
              <p className="text-slate-600">Happy Patients</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <ShieldCheck className="w-8 h-8 text-teal-600" />
              </div>
              <Counter end={200} suffix="+" className="text-2xl md:text-3xl font-bold text-teal-600" />
              <p className="text-slate-600">Verified Doctors</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <Building2 className="w-8 h-8 text-teal-600" />
              </div>
              <Counter end={50} suffix="+" className="text-2xl md:text-3xl font-bold text-teal-600" />
              <p className="text-slate-600">Partner Clinics</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-teal-600" />
              </div>
              <Counter end={4.8} suffix=" / 5" className="text-2xl md:text-3xl font-bold text-teal-600" />
              <p className="text-slate-600">Average Rating</p>
            </div>
          </div>
        </div>

        



        
        {/* Section 1: Carousel & Problems - Side by Side Layout */}
        <div className="grid lg:grid-cols-12 gap-x-2 gap-y-8 mb-12">
          {/* Left: Carousel */}
          <Reveal delay={100} className="lg:col-span-5">
            <div className="flex justify-start h-full px-4 pt-12">
              <div style={{ height: '500px', position: 'relative', width: '100%' }}>
                <Carousel
                  baseWidth={Math.min(380, window.innerWidth - 32)}
                  autoplay={true}
                  autoplayDelay={4000}
                  pauseOnHover={true}
                  loop={true}
                  round={false}
                />
              </div>
            </div>
          </Reveal>

          {/* Right: The Problems We Solve */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Reveal delay={200}>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 px-2 pt-10">The Problems We Solve</h3>
            </Reveal>
            
            <div className="grid grid-cols-1 gap-5">
              <Reveal delay={200}>
                <div className="bg-teal-500 border border-teal-500 rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl text-teal-500 shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Trust Issues</h4>
                    <p className="text-teal-50 text-sm">Finding a doctor you can truly trust is difficult in an unregulated market.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="bg-teal-500 border border-teal-500 rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl text-teal-500 shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Information Overload</h4>
                    <p className="text-teal-50 text-sm">Fragmented and unreliable medical information confuses patients.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="bg-teal-500 border border-teal-500 rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-white p-3 rounded-xl text-teal-500 shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Lack of Transparency</h4>
                    <p className="text-teal-50 text-sm">Hidden costs and unknown credentials make healthcare choices risky.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <Reveal delay={100}>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Our Users Say</h2>
        </Reveal>
        <Reveal delay={200}>
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-16">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </Reveal>

        {/* Timeline Section */}
        <div className="mb-20">
           <Reveal delay={100}>
           <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Our Journey
           </h2>
           </Reveal>

           <Reveal delay={200}>
               <div className="bg-white rounded-3xl p-8 shadow-lg">
                  <Timeline events={timelineEvents} />
               </div>
           </Reveal>
        </div>

        {/* Section 2: Solutions - Grid of Feature Boxes */}
        <div className="mb-16">
          <Reveal delay={100}>
          
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Solutions</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: "Verified Profiles", color: "teal", desc: "Accurate details & credentials." },
              { icon: Search, title: "Smart Search", color: "teal", desc: "Advanced filters & speed." },
              { icon: Cpu, title: "AI Guidance", color: "teal", desc: "Personalized recommendations." },
              { icon: ShieldCheck, title: "Secure Feedback", color: "teal", desc: "Validated patient reviews." },
            ].map((item, idx) => (
              <Reveal key={idx} delay={150 + (idx * 100)}>
                <div className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Section 3: Mission & Vision - Two Separate Large Boxes */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Reveal delay={100}>
            <div className="bg-white rounded-3xl p-10 shadow-lg border-t-4 border-teal-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-32 h-32 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-teal-600" /> Mission
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To empower patients with transparent, reliable healthcare information accessible anytime, anywhere, ensuring no decision is made in the dark.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="bg-white rounded-3xl p-10 shadow-lg border-t-4 border-teal-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HeartPulse className="w-32 h-32 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <HeartPulse className="w-8 h-8 text-teal-600" /> Vision
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To be the most trusted digital healthcare companion, seamlessly connecting patients with technology to create a healthier global community.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Section 4: Technology & Audience */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Reveal delay={100}>
            {/* Ensure the parent has 'relative' and 'overflow-hidden' */}
            <div className="bg-teal-500 rounded-3xl p-8 text-white h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
              
              {/* 1. Add the Aurora component here */}
              <div className="absolute inset-0 z-0">
                <Aurora
                  /* Color 1: Primary Teal, Color 2: Light Teal, Color 3: Deep Slate (Replaces Blue) */
                  colorStops={["#0D9488", "#14B8A6", "#2e786b"]} 
                  blend={0.8}
                  amplitude={2.0}
                  speed={0.5}
                />
              </div>

              {/* 2. Add this tint layer to make the text readable */}
              <div className="absolute inset-0 bg-slate-900/40 z-[1]"></div>

              {/* 3. Wrap your existing content in a div with 'relative z-10' */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
                    <Cpu className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Technology With Responsibility</h3>
                  <p className="text-slate-200 leading-relaxed">
                    ProDoc utilizes cutting-edge AI to interpret medical data for clarity. 
                    We strictly adhere to the principle that technology assists, but never 
                    replaces, the human element of professional care.
                  </p>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => window.open('https://www.unesco.org/en/artificial-intelligence/recommendation-ethics', '_blank')}
                    className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition-all w-full text-center shadow-lg active:scale-95"
                  >
                    Read Documentation
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Audience Box Grid */}
          <div className="flex flex-col gap-4">
            <Reveal delay={200}>
              <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 h-full">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Who Is ProDoc For?</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Users, label: "Patients", color: "bg-teal-500 text-white", desc: "Seeking trusted care." },
                    { icon: Building2, label: "Clinics", color: "bg-teal-500 text-white", desc: "Managing visibility." },
                    { icon: HeartPulse, label: "Providers", color: "bg-teal-500 text-white", desc: "Showcasing expertise." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-default group">
                      <div className={`p-3 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item.label}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Team Section Integration */}
        <div id="team" className="mb-20">
          <Reveal delay={100}>
            <Team />
          </Reveal>
        </div>

        {/* Get in Touch */}
        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <Reveal delay={100} className="md:col-span-12">
            {/* ADDED 'group' class to the container div */}
            <div className="group bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
              {/* Decorative Background Blob inside the card */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                {/* Left Side: Content */}
                <div className="space-y-6 flex flex-col justify-start">
                  <div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Have questions about ProDoc or need help getting started? Our team is here to assist you on your journey to better healthcare management.
                    </p>
                  </div>

                  {/* Mail Icon */}
                  <div className="flex justify-center md:justify-start mt-4">
                    <Mail className="w-64 h-64 md:h-56 md:translate-x-32  translate-y-8 md:translate-y-12 text-teal-500/10 transition-all duration-1000 ease-out group-hover:scale-150 group-hover:rotate-12 group-hover:text-teal-500/20 cursor-pointer" />
                  </div>
                </div>

                {/* Right Side: Form */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">First Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Subject</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <textarea rows="4" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"></textarea>
                  </div>

                  <button className="w-full bg-[#14B8A6] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 hover:bg-[#0f968c] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                    Send Message
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Footer  */}
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
                  <a href="https://www.linkedin.com/in/pro-doc-69964a3a6/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"><Linkedin size={18} /></a>
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
                <button className="w-full bg-teal-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/50 transition-all transform active:scale-95">
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