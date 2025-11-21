import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Twitter, 
  ExternalLink, 
  Code2, 
  Database, 
  Cloud, 
  Menu, 
  X, 
  ChevronRight,
  Send,
  Terminal,
  Smartphone,
  Layers,
  Download,
  FileText,
  Sparkles,
  Bot,
  Loader2,
  Minimize2
} from 'lucide-react';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * RESUME DATA CONSTANTS
 */
const RESUME_DATA = {
  name: "Sarthak Jasuja",
  role: "Aspiring Software Engineer",
  summary: "Highly motivated Computer Science student and aspiring Software Engineer with strong skills in software development and iOS development. Proficient in React and Swift, with experience building scalable, AI-driven applications. Currently advancing full-stack expertise through Meta's Developer Program.",
  socials: {
    email: "sarthakjasuja@gmail.com",
    linkedin: "linkedin.com/in/sarthak-jasuja", 
    github: "github.com/Sarthak-jasuja",
    X: "@sarthak_jasuja"
  },
  skills: [
    { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "C++", "Swift"] },
    { category: "Web", items: ["React.js", "Next.js", "Tailwind CSS", "Node.js", "Express.js", "HTML5/CSS3"] },
    { category: "Backend & DB", items: ["MongoDB", "PostgreSQL", "REST APIs", "JSON"] },
    { category: "AI & Cloud", items: ["Google Gemini API", "RAG", "Google Cloud", "Vercel", "Netlify", "Render"] },
    { category: "Tools & DevOps", items: ["Git/GitHub", "Docker", "SDLC", "System Design", "TDD"] }
  ],
  experience: [
    {
      company: "Codeunia",
      role: "Software Developer Intern",
      duration: "July 2025 - Sept 2025",
      type: "Remote",
      description: "Collaborated with a dynamic team to build and optimize web applications. Utilized Git and GitHub for version control, managed pull requests, and contributed to collaborative coding workflows. Gained hands-on experience in full-stack development, debugging, and deploying scalable features."
    }
  ],
  projects: [
    {
      title: "Tripmate",
      subtitle: "AI Travel Itinerary Planner",
      description: "AI-powered travel planner for personalized trips and seamless coordination. Generates custom itineraries based on user preferences.",
      tags: ["AI", "React", "GenAI", "TravelTech"],
      link: "https://trip-mate-travel-itinerary-planner-tan.vercel.app"
    },
    {
      title: "Syntrix",
      subtitle: "GenAI Drawing Generator",
      description: "A modern looking AI-powered drawing generator that transforms drawing prompts into unique artwork using generative models. Features a sleek interface for easy creation and sharing of AI-generated images.",
      tags: ["GenAI", "Drawing", "Collaboration", "Productivity"],
      link: "https://trip-mate-travel-itinerary-planner-tan.vercel.app"
    }
  ],
  education: [
    {
      school: "Manipal University Jaipur",
      degree: "Bachelors in Computer Applications",
      year: "2023 - Present",
      grade: "Avg SGPA: 8.5"
    },
    {
      school: "Saraswati Vihar Sr Sec School",
      degree: "Class XII (Science PCM)",
      year: "2021-22",
      grade: "84%"
    }
  ],
  certifications: [
    "Create Generative AI Apps on Google Cloud",
    "Intro to Generative AI (Google Cloud)",
    "Introduction to iOS Mobile Development (Meta)",
    "Introduction to DevOps (IBM)",
    "Google Study Jams 2025 (Google Cloud)"
  ]
};

/**
 * GEMINI API UTILITIES
 */
const callGeminiAPI = async (prompt, systemInstruction = "") => {
  const apiKey = "env.GEMINI_API_KEY"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Call Failed:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};

/**
 * COMPONENT: PRELOADER
 */
const Preloader = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-8 animate-bounce">
        <div className="absolute inset-0 border-4 border-orange-600 rounded-lg transform rotate-45 animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute inset-2 border-4 border-neutral-800 rounded-lg transform -rotate-12"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black text-white">SJ</span>
        </div>
      </div>
      <div className="w-48 h-1 bg-neutral-900 rounded-full overflow-hidden">
        <div className="h-full bg-orange-600 animate-[loading_2s_ease-in-out_infinite] w-full origin-left scale-x-0"></div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: AI CHAT WIDGET
 */
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm Sarthak's AI Assistant. Ask me anything about his skills, projects, or experience!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const systemPrompt = `
      You are the AI portfolio assistant for Sarthak Jasuja.
      Here is his Resume Data: ${JSON.stringify(RESUME_DATA)}.
      
      Your goal is to answer questions about Sarthak based on this data. 
      - Be friendly, professional, and concise.
      - If asked about contact info, provide his email or LinkedIn from the data.
      - If asked about something not in the data (like his favorite color), humorously say you only know his professional life.
      - Keep answers under 50 words if possible.
    `;

    const aiResponseText = await callGeminiAPI(input, systemPrompt);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-neutral-900/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-neutral-800/50 p-4 border-b border-neutral-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-white text-sm">AI Assistant</span>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setMessages([])} className="text-neutral-400 hover:text-white text-xs" title="Clear Chat">Clear</button>
               <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white"><Minimize2 size={16} /></button>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-orange-900 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-br-none' 
                    : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 p-3 rounded-2xl rounded-bl-none border border-neutral-700 flex gap-1 items-center h-10">
                  <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-neutral-900 border-t border-neutral-800">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Sarthak..."
                className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-full pl-4 pr-10 py-3 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600 rounded-full text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isTyping ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
            <div className="text-[10px] text-neutral-600 text-center mt-2 flex items-center justify-center gap-1">
               Powered by Gemini <Sparkles size={10} className="text-orange-500" />
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 bg-orange-600 hover:bg-orange-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all duration-300 active:scale-90"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
             <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-[#050505]"></div>
             <Bot size={28} className="group-hover:rotate-12 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
};

/**
 * COMPONENT: NAVBAR
 */
const Navbar = ({ setPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
    isHovered 
      ? 'bg-neutral-950/80 backdrop-blur-xl border-orange-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' 
      : 'bg-transparent backdrop-blur-none border-transparent'
  }`;

  const scrollToSection = (id) => {
    setPage('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav 
      className={navClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isOpen) setIsHovered(false);
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center group cursor-pointer" onClick={() => setPage('home')}>
             <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3 transform group-hover:rotate-12 transition-transform duration-300">
                <span className="font-bold text-black text-xl">SJ</span>
             </div>
             <span className="text-xl font-bold text-white tracking-wider group-hover:text-orange-500 transition-colors">
               SARTHAK
             </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Home', 'Projects', 'Skills', 'Experience'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item === 'Home' ? 'home' : item.toLowerCase())}
                  className="relative text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              <button
                onClick={() => setPage('contact')}
                className="relative overflow-hidden px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 border border-orange-500 text-orange-500 hover:text-white group"
              >
                 <span className="absolute top-0 left-0 w-0 h-full bg-orange-600 transition-all duration-300 group-hover:w-full -z-10"></span>
                 Contact Me
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Home', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'Contact') setPage('contact');
                  else scrollToSection(item === 'Home' ? 'home' : item.toLowerCase());
                  setIsOpen(false);
                }}
                className="text-neutral-300 hover:text-orange-500 block px-3 py-4 rounded-md text-lg font-medium w-full text-left border-b border-neutral-900"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

/**
 * COMPONENT: TECH TICKER
 */
const TechTicker = () => {
  const allSkills = RESUME_DATA.skills.flatMap(s => s.items);

  useEffect(() => {
    gsap.to(".ticker-content", {
      xPercent: -50,
      duration: 50,
      ease: "none",
      repeat: -1
    });
  }, []);

  return (
    <div className="w-full bg-neutral-950 border-y border-neutral-900 py-6 overflow-hidden flex relative z-20 select-none">
       <div className="ticker-content flex whitespace-nowrap items-center">
          {[...allSkills, ...allSkills, ...allSkills].map((skill, i) => (
            <div key={i} className="flex items-center">
              <span className="text-2xl md:text-4xl font-black text-neutral-800 hover:text-neutral-600 transition-colors uppercase tracking-tight mx-8 font-outline-2">
                {skill}
              </span>
              <div className="w-2 h-2 bg-orange-900/30 rounded-full"></div>
            </div>
          ))}
       </div>
    </div>
  );
};

/**
 * COMPONENT: HERO SECTION
 */
const Hero = ({ setPage }) => {
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-greeting", { y: 20, opacity: 20, duration: 0.6 })
      .from(".hero-name", { y: 50, opacity:0.8, duration: 0.8, ease: "power3.out" }, "-=0.3")
      .from(".hero-role", { y: 30, opacity:0.2, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .from(".hero-desc", { opacity: 0.2, duration: 1 }, "-=0.5")
      .from(".hero-btn", { scale: 0.8, opacity: 0.8, stagger: 0.1, ease: "back.out(1.7)"}, "-=0.5");

  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] md:text-[20rem] font-black text-white/[0.03] select-none whitespace-nowrap pointer-events-none z-0">
        PORTFOLIO
      </h1>

      <div className="text-center z-10 px-4 max-w-5xl w-full">
        <p className="hero-greeting text-orange-400 font-bold font-mono tracking-[0.2em] mb-6 text-sm md:text-base uppercase">
           Welcome to my digital space
        </p>
        <h1 className="hero-name text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
          SARTHAK<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-neutral-200 via-white to-neutral-500">JASUJA</span>
        </h1>
        <h2 className="hero-role text-2xl md:text-4xl text-orange-400 font-bold mb-8 tracking-wide">
          {RESUME_DATA.role}
        </h2>
        <p className="hero-desc text-neutral-200 max-w-2xl mx-auto mb-12 text-lg leading-relaxed font-medium">
          {RESUME_DATA.summary}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={() => {
              const el = document.getElementById('projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hero-btn group relative px-8 py-4 bg-orange-600 text-black cursor-pointer rounded-full font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,88,12,0.3)]"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-shine" />
            View Projects
          </button>
          
          <button 
            onClick={() => setPage('contact')}
            className="hero-btn px-8 py-4 bg-transparent border border-neutral-500 text-white font-bold rounded-full cursor-pointer hover:bg-neutral-800 hover:border-neutral-300 transition-all flex items-center gap-2"
          >
            Contact Me <ChevronRight size={18} />
          </button>

           <a 
            href="#" 
            download="Sarthak_Jasuja_Resume.pdf"
            className="hero-btn px-8 py-4 bg-neutral-900 text-white font-bold rounded-full cursor-pointer hover:bg-neutral-800 transition-all flex items-center gap-2 border border-neutral-700 hover:border-orange-500/50"
            title="Download Resume"
          >
            <Download size={18} /> Resume
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-neutral-600 hidden md:block">
        <div className="w-6 h-10 border-2 border-neutral-700 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-orange-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

/**
 * COMPONENT: PROJECTS
 */

const Projects = () => {
  const [suggestions, setSuggestions] = useState({});
  const [loadingSuggestion, setLoadingSuggestion] = useState(null);

  useEffect(() => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
        y: 80,
        opacity: 0.8,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  }, []);

  const handleGenerateSuggestion = async (project, idx) => {
    if (suggestions[idx]) return; 
    setLoadingSuggestion(idx);
    const prompt = `Based on this project: "${project.title}: ${project.description}" using tech stack [${project.tags.join(', ')}], suggest ONE creative, advanced feature I could add to version 2.0. Keep it short (1 sentence) and exciting. Start with "Feature Idea:".`;
    const result = await callGeminiAPI(prompt);
    setSuggestions(prev => ({ ...prev, [idx]: result }));
    setLoadingSuggestion(null);
  };

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 relative z-10">
           <div className="flex items-center gap-4 mb-4">
             <div className="h-[1px] w-12 bg-orange-500"></div>
             <p className="text-orange-500 font-mono text-sm tracking-widest">SELECTED WORKS</p>
           </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase">
            Featured <br /><span className="text-neutral-800 text-stroke-white">Projects</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-32">
          {RESUME_DATA.projects.map((project, idx) => (
            <div key={idx} className="project-card group relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className={`lg:col-span-5 flex flex-col ${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                 <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-8xl font-black text-neutral-800/50 group-hover:text-orange-500/20 transition-colors duration-500">
                      0{idx + 1}
                    </span>
                 </div>
                 <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{project.title}</h3>
                 <h4 className="text-xl text-orange-400/80 mb-6 font-medium">{project.subtitle}</h4>
                 
                 <div className="bg-neutral-900/50 border-l-2 border-orange-500 p-6 mb-8 backdrop-blur-sm rounded-r-lg">
                   <p className="text-neutral-300 leading-relaxed text-lg">
                    {project.description}
                   </p>
                 </div>

                 <div className="flex flex-wrap gap-3 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-4 py-2 rounded-full text-sm font-semibold text-neutral-400 bg-neutral-900 border border-neutral-800 group-hover:border-orange-500/30 transition-all">
                      #{tag}
                    </span>
                  ))}
                 </div>
                 
                 <div className="mb-8">
                    {!suggestions[idx] ? (
                      <button 
                        onClick={() => handleGenerateSuggestion(project, idx)}
                        disabled={loadingSuggestion === idx}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-white transition-colors border border-orange-500/30 rounded-full px-4 py-2 hover:bg-orange-500/10"
                      >
                         {loadingSuggestion === idx ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                         ✨ Suggest Next Feature with AI
                      </button>
                    ) : (
                      <div className="bg-gradient-to-r from-orange-900/20 to-neutral-900 p-4 rounded-lg border border-orange-500/20 animate-in fade-in duration-500">
                        <p className="text-orange-300 text-sm italic flex gap-2">
                           <Sparkles size={16} className="shrink-0 mt-1" />
                           {suggestions[idx]}
                        </p>
                      </div>
                    )}
                 </div>

                 <button className="w-fit flex items-center gap-3 text-white font-bold border-b-2 border-orange-500 pb-1 hover:gap-5 transition-all">
                    View Project <ExternalLink size={18} className="text-orange-500" />
                 </button>
              </div>

              <div className={`lg:col-span-7 ${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative h-[400px] md:h-[500px] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 group-hover:border-orange-500/30 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-orange-900/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950 opacity-80"></div>
                  <div className="absolute inset-10 border border-neutral-800 rounded-xl bg-[#0a0a0a] shadow-2xl flex flex-col overflow-hidden">
                     <div className="h-8 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                     </div>
                     <div className="flex-1 p-6 relative overflow-hidden">
                        <div className="flex gap-6 h-full">
                           <div className="w-1/4 bg-neutral-900/50 rounded-lg h-full animate-pulse"></div>
                           <div className="w-3/4 space-y-4">
                              <div className="w-full h-32 bg-neutral-900/50 rounded-lg"></div>
                              <div className="w-full h-12 bg-neutral-900/50 rounded-lg"></div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="h-20 bg-neutral-900/50 rounded-lg"></div>
                                <div className="h-20 bg-neutral-900/50 rounded-lg"></div>
                              </div>
                           </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent flex items-end p-6">
                           <span className="text-orange-500 font-mono text-sm tracking-widest uppercase">
                              UI Visualization - {project.title}
                           </span>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * COMPONENT: SKILLS
 */
const Skills = () => {
  useEffect(() => {
    gsap.from(".skill-card", {
      scrollTrigger: {
        trigger: "#skills",
        start: "top 85%",
      },
      y: 40,
      opacity: 0.8,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);

  const getIcon = (category) => {
    const iconProps = { size: 32, className: "text-orange-500 mb-4" };
    switch(category) {
      case "Languages": return <Terminal {...iconProps} />;
      case "Web": return <Code2 {...iconProps} />;
      case "Backend & DB": return <Database {...iconProps} />;
      case "AI & Cloud": return <Cloud {...iconProps} />;
      default: return <Layers {...iconProps} />;
    }
  };

  return (
    <section id="skills" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900/20 to-neutral-950 -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            TECHNICAL <span className="text-orange-600">ARSENAL</span>
          </h2>
          <p className="text-neutral-400 text-lg">My tools of choice for building digital products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESUME_DATA.skills.map((skillGroup, idx) => (
            <div key={idx} className="skill-card group bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl hover:border-orange-500/50 transition-all duration-300 hover:translate-y-[-5px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">{skillGroup.category}</h3>
                  {getIcon(skillGroup.category)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item, i) => (
                    <span key={i} className="text-sm font-medium text-neutral-400 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800 group-hover:text-white group-hover:border-neutral-700 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * COMPONENT: EXPERIENCE & EDUCATION
 */
const Experience = () => {
  useEffect(() => {
    gsap.from("#experience-content", {
      scrollTrigger: { trigger: "#experience", start: "top 80%" },
      opacity: 0.5, y: 50, duration: 1
    });
  }, []);

  return (
    <section id="experience" className="py-32 bg-neutral-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="experience-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* Experience Column */}
            <div>
                <div className="flex items-center gap-4 mb-12">
                   <div className="p-3 bg-orange-500/10 rounded-xl">
                     <Terminal className="text-orange-500" size={32} />
                   </div>
                   <h3 className="text-3xl font-black text-white uppercase">Work Experience</h3>
                </div>

                <div className="space-y-12">
                    {RESUME_DATA.experience.map((exp, idx) => (
                        <div key={idx} className="group relative border-l-2 border-neutral-800 pl-8 pb-2 hover:border-orange-500 transition-colors duration-500">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-neutral-800 border-2 border-[#050505] group-hover:bg-orange-500 transition-colors"></div>
                          
                          <span className="inline-block px-3 py-1 bg-neutral-900 text-orange-500 text-xs font-bold rounded-full mb-4 border border-neutral-800">
                            {exp.duration}
                          </span>
                          <h4 className="text-2xl font-bold text-white mb-1">{exp.role}</h4>
                          <p className="text-neutral-300 font-medium mb-4 text-lg">{exp.company} <span className="text-neutral-500">•</span> {exp.type}</p>
                          <p className="text-neutral-400 leading-relaxed">
                              {exp.description}
                          </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education & Certs Column */}
            <div>
                <div className="flex items-center gap-4 mb-12">
                   <div className="p-3 bg-neutral-800 rounded-xl">
                     <Smartphone className="text-white" size={32} />
                   </div>
                   <h3 className="text-3xl font-black text-white uppercase">Education</h3>
                </div>

                <div className="space-y-12">
                    {RESUME_DATA.education.map((edu, idx) => (
                        <div key={idx} className="relative border-l-2 border-neutral-800 pl-8 pb-2 group hover:border-white transition-colors">
                         <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-neutral-800 border-2 border-[#050505] group-hover:bg-white transition-colors"></div>
                         <span className="inline-block px-3 py-1 bg-neutral-900 text-neutral-400 text-xs font-bold rounded-full mb-4 border border-neutral-800">
                            {edu.year}
                          </span>
                        <h4 className="text-2xl font-bold text-white mb-1">{edu.degree}</h4>
                        <p className="text-neutral-300 font-medium text-lg">{edu.school}</p>
                        <p className="text-orange-400 mt-2 font-mono text-sm">{edu.grade}</p>
                        </div>
                    ))}

                    <div className="pt-8">
                        <h5 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                           <FileText size={20} /> Certifications
                        </h5>
                        <div className="grid grid-cols-1 gap-3">
                            {RESUME_DATA.certifications.map((cert, i) => (
                                <div key={i} className="flex items-center p-4 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-orange-500/30 transition-colors">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-4"></div>
                                    <span className="text-neutral-400 text-sm font-medium">{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

/**
 * COMPONENT: CONTACT PAGE
 */
const Contact = ({ setPage }) => {
  useEffect(() => {
    gsap.from(".contact-anim", {
      y: 30,
      opacity: 0.8,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => setPage('home')}
          className="mb-12 text-neutral-500 hover:text-orange-500 flex items-center gap-3 transition-colors group uppercase font-bold tracking-wider text-sm"
        >
          <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-orange-500 transition-colors bg-neutral-900">
             <ChevronRight className="rotate-180" size={20} />
          </div> 
          Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="contact-anim text-6xl md:text-8xl font-black text-white mb-8 leading-none">
              LET'S <br /><span className="text-orange-600">TALK</span>
            </h1>
            <p className="contact-anim text-neutral-400 text-xl mb-12 leading-relaxed max-w-md">
            ~I'm currently open to full-time software engineering roles.<br />
            ~Available for remote work or relocation.
            </p>

            <div className="contact-anim space-y-6">
              <a href={`mailto:${RESUME_DATA.socials.email}`} className="block p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800 hover:border-orange-500 hover:bg-neutral-900 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                     <Mail size={24} />
                  </div>
                  <div>
                     <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1 font-bold">Email</p>
                     <span className="text-lg font-bold text-white">{RESUME_DATA.socials.email}</span>
                  </div>
                </div>
              </a>
              
              <div className="grid grid-cols-2 gap-6">
                 <a href={`https://${RESUME_DATA.socials.linkedin}`} target="_blank" rel="noreferrer" className="block p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800 hover:border-orange-500 hover:bg-neutral-900 transition-all group">
                    <div className="flex flex-col gap-4">
                       <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-white group-hover:bg-[#0077b5] transition-colors">
                          <Linkedin size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">LinkedIn</p>
                          <span className="text-base font-medium text-white">Connect</span>
                       </div>
                    </div>
                 </a>

                 <a href={`https://${RESUME_DATA.socials.github}`} target="_blank" rel="noreferrer" className="block p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800 hover:border-orange-500 hover:bg-neutral-900 transition-all group">
                    <div className="flex flex-col gap-4">
                       <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                          <Github size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">GitHub</p>
                          <span className="text-base font-medium text-white">Follow</span>
                       </div>
                    </div>
                 </a>
              </div>
            </div>
          </div>

          <form className="contact-anim relative" onSubmit={(e) => e.preventDefault()}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent blur-3xl -z-10"></div>
            <div className="bg-neutral-950 p-8 md:p-10 rounded-3xl border border-neutral-800 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8">Send a Message</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Name</label>
                      <input 
                      type="text" 
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-neutral-700"
                      placeholder="John Doe"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Email</label>
                      <input 
                      type="email" 
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-neutral-700"
                      placeholder="john@example.com"
                      />
                   </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Subject</label>
                  <input 
                    type="text" 
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-neutral-700"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Message</label>
                  <textarea 
                    rows="5"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-neutral-700 resize-none"
                    placeholder="Hello, I'd like to discuss..."
                  ></textarea>
                </div>
                <button className="w-full bg-orange-600 text-black font-bold py-5 rounded-xl hover:bg-white transition-all flex justify-center items-center gap-2 mt-4 transform hover:-translate-y-1 shadow-lg shadow-orange-900/20">
                  - Under Maintainance <Send size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
const App = () => {
  const [page, setPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
      {isLoading && <Preloader onLoadingComplete={handleLoadingComplete} />}
      
      {!isLoading && (
        <>
           <Navbar setPage={setPage} />

           <main className="relative z-10">
             {page === 'home' ? (
               <>
                 <Hero setPage={setPage} />
                 <TechTicker />
                 <Projects />
                 <Skills />
                 <Experience />
                 
                 {/* Footer */}
                 <footer className="py-12 bg-neutral-950 text-center border-t border-neutral-900">
                    <div className="flex justify-center gap-8 mb-8">
                       <a href={`https://${RESUME_DATA.socials.twitter}`} className="text-neutral-500 hover:text-white hover:scale-110 transition-all"><Twitter size={24} /></a>
                       <a href={`https://${RESUME_DATA.socials.linkedin}`} className="text-neutral-500 hover:text-white hover:scale-110 transition-all"><Linkedin size={24} /></a>
                       <a href={`https://${RESUME_DATA.socials.github}`} className="text-neutral-500 hover:text-white hover:scale-110 transition-all"><Github size={24} /></a>
                    </div>
                   <p className="text-neutral-600 text-sm font-medium">
                     © {new Date().getFullYear()} {RESUME_DATA.name}. All Rights Reserved.
                   </p>
                 </footer>
               </>
             ) : (
               <Contact setPage={setPage} />
             )}
           </main>

           {/* AI CHAT WIDGET */}
           <AIChatWidget />
        </>
      )}
    </div>
  );
};

export default App;