import React from "react";
import { Linkedin, Github, ArrowUpRight } from "lucide-react";

function TeamMember({ imgSrc, name, title,linkedIn,git }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] shadow-lg transition-all duration-300 hover:shadow-xl h-[400px]">
      {/* Background Image */}
      <img
        loading="lazy"
        src={imgSrc}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Glassmorphism Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 p-5 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        
        {/* Top Row: Name & Arrow */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white">{name}</h3>
            <p className="text-sm font-medium text-teal-200">{title}</p>
          </div>
          <div className="p-2 bg-white/10 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <ArrowUpRight size={16} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/20 my-3" />

        {/* Bottom Row: Socials */}
        <div className="flex gap-3">
          <a href={linkedIn} className="p-2 bg-white/10 rounded-full hover:bg-teal-500 hover:text-white transition-colors duration-300">
            <Linkedin size={16} />
          </a>
          <a href={git} className="p-2 bg-white/10 rounded-full hover:bg-teal-500 hover:text-white transition-colors duration-300">
            <Github size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Team() {
  const teamMembers = [
    {
      imgSrc: "https://media.licdn.com/dms/image/v2/D5603AQFwS3YWc67BVg/profile-displayphoto-crop_800_800/B56ZmRhPuOJ8AI-/0/1759083038032?e=1766620800&v=beta&t=b4409XdNlVrIU9T-ICjl6F8oPUHtzKQhpG5LYLGNIoc",
      name: "Jayith",
      title: "Team Leader",
      linkedIn: "https://www.linkedin.com/in/jayith-wijethunge/",
      git:"https://github.com/Jayith",
    },
    {
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/1aa484b096efd982c17829a912d74329ab81001c4ad1da0197618eb5ae4719c7?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&",
      name: "Kushan Anutthara",
      title: "Manager",
      linkedIn: "https://www.linkedin.com/in/jayith-wijethunge/",
      git:"https://github.com/Jayith",
    },
    {
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/a526d51b880f5455948aec3ff5cb0fca1f4b09c016232f7e8057df97104641dd?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&",
      name: "Nethmin Gomez",
      title: "Secretary",
      linkedIn: "https://www.linkedin.com/in/jayith-wijethunge/",
      git:"https://github.com/Jayith",
    },
    {
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/0ba683f74943142ccaf0fc039abf04fa47637ba466b6819719847d5b3f76f6c6?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&",
      name: "Geenadi Dhanayake",
      title: "Creative Director",
      linkedIn: "https://www.linkedin.com/in/jayith-wijethunge/",
      git:"https://github.com/Jayith",
    },
    {
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/1bdd6ebeb5bb2d2cbccb01e077f6b83d945305173ef38c2045c16da7de4088cc?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&",
      name: "Uvindu Perera",
      title: "Lead Programmer",
      linkedIn: "https://www.linkedin.com/in/uvindu-perera",
      git:"https://github.com/Uluduwade",
    },
    {
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/4257f727112b2bed686495d55fbe6dcf22640f332af711cf27fe525cb69f914f?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&",
      name: "Agitha Perera",
      title: "UX Designer",
      linkedIn: "https://www.linkedin.com/in/jayith-wijethunge/",
      git:"https://github.com/Jayith",
    },
  ];

  return (
    <section className="bg-white rounded-[2.5rem] p-10 md:p-16 mb-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Meet the Team</h2>
        <p className="text-slate-500 text-lg">
          The dedicated professionals driving ProDoc's success and delivering exceptional healthcare solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </section>
  );
}

export default Team;