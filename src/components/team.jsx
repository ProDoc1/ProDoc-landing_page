import React from "react";
import { Linkedin, Github, ArrowUpRight } from "lucide-react";

// Import Team Photos from the assets folder
// Make sure you have saved your images in src/assets/ with these names
import jayithImg from "../assets/jayith.jpg";
import kushanImg from "../assets/kushan.jpg";
import nethminImg from "../assets/nethmin.jpg";
import geenadiImg from "../assets/geenadi.jpg";
import uvinduImg from "../assets/uvindu.jpg";
import agithaImg from "../assets/agitha.jpg";

function TeamMember({ imgSrc, name, title, linkedinUrl, githubUrl }) {
  return (
    // Reduced height from h-[400px] to h-[300px]
    <div className="group relative overflow-hidden rounded-[2rem] shadow-lg transition-all duration-300 hover:shadow-xl h-[400px]">
      {/* Background Image */}
      <img
        loading="lazy"
        src={imgSrc}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Glassmorphism Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        
        {/* Top Row: Name & Arrow */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-base font-bold tracking-tight text-white">{name}</h3>
            <p className="text-xs font-medium text-teal-200">{title}</p>
          </div>
          <div className="p-1.5 bg-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/20 my-2" />

        {/* Bottom Row: Socials */}
        <div className="flex gap-2">
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-1.5 bg-white/10 rounded-full hover:bg-teal-500 hover:text-white transition-colors duration-300"
          >
            <Linkedin size={14} />
          </a>
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-1.5 bg-white/10 rounded-full hover:bg-teal-500 hover:text-white transition-colors duration-300"
          >
            <Github size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Team() {
  const teamMembers = [
    {
      imgSrc: jayithImg,
      name: "Jayith Wijethunge",
      title: "Team Leader",
      linkedinUrl: "https://www.linkedin.com/in/jayith-wijethunge/",
      githubUrl: "https://github.com/Jayith"
    },
    {
      imgSrc: kushanImg,
      name: "Kushan Anutthara",
      title: "Project Coordinator",
      linkedinUrl: "https://www.linkedin.com/in/kushan-wickramaarachchi-471635359/",
      githubUrl: "https://github.com/kushanaw"
    },
    {
      imgSrc: nethminImg,
      name: "Nethmin Gomes",
      title: "Documentation Lead",
      linkedinUrl: "https://www.linkedin.com/in/nethmin-gomes-924b51291/",
      githubUrl: "https://github.com/njxbeast10-ai"
    },
    {
      imgSrc: geenadiImg,
      name: "Geenadi Dahanayake",
      title: "Creative Director",
      linkedinUrl: "https://www.linkedin.com/in/geenadi-dahanayake-22a7b5179/",
      githubUrl: "https://github.com/Geenadi"
    },
    {
      imgSrc: uvinduImg,
      name: "Uvindu Perera",
      title: "Lead Programmer",
      linkedinUrl: "https://www.linkedin.com/in/uvindu-perera/",
      githubUrl: "https://github.com/Uluduwade"
    },
    {
      imgSrc: agithaImg,
      name: "Agitha Perera",
      title: "UX Designer",
      linkedinUrl: "https://www.linkedin.com/in/agithaperera/",
      githubUrl: "https://github.com/AgithaPerera"
    },
  ];

  return (
    <section className="bg-white rounded-[2.5rem] p-10 md:p-16 mb-6">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Meet the Team</h2>
        <p className="text-slate-500 text-lg">
          The dedicated professionals driving ProDoc's success.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </section>
  );
}

export default Team;