import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, animate, useReducedMotion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
// removed external SpeedInsights import to prevent build errors
import {
  ArrowRight,
  Layout,
  Database,
  MessageCircle,
  Mail,
  Code2,
  Terminal,
  Zap,
  CheckCircle2,
  ChevronLeft,
  FileCode2,
  Hammer,
  HardHat,
  Palette,
  Globe,
  Move3d,
  Lock,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Send // Added Send icon
} from 'lucide-react';

// --- INTERNAL PLACEHOLDER COMPONENTS ---
// These replace the external file imports to ensure the app runs in a single file.

const Scene1 = ({ onBack }) => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-white p-4">
    <h1 className="text-4xl font-bold mb-4 text-cyan-400">ARCHI STRUCT 3D</h1>
    <p className="text-gray-400 mb-8 max-w-md text-center">Interactive 3D Generative CAD visualization would appear here.</p>
    <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
      <ChevronLeft size={20} /> Back to Nexus
    </button>
  </div>
);

const Scene2 = ({ onBack }) => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-white p-4">
    <h1 className="text-4xl font-bold mb-4 text-fuchsia-400">NEXUS GAMING 3D</h1>
    <p className="text-gray-400 mb-8 max-w-md text-center">Synthwave grid and neon cube visualization would appear here.</p>
    <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
      <ChevronLeft size={20} /> Back to Nexus
    </button>
  </div>
);

const Scene3 = ({ onBack }) => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-white p-4">
    <h1 className="text-4xl font-bold mb-4 text-amber-500">PURE BREW 3D</h1>
    <p className="text-gray-400 mb-8 max-w-md text-center">Warm coffee particle simulation would appear here.</p>
    <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
      <ChevronLeft size={20} /> Back to Nexus
    </button>
  </div>
);

const VortexRetail = ({ onExit }) => (
  <div className="min-h-screen w-full bg-[#0a0a0f] text-white p-8 flex flex-col">
    <nav className="flex justify-between items-center mb-12">
        <div className="font-bold text-xl tracking-wider">NEXORIA <span className="text-purple-500">PRO</span></div>
        <button onClick={onExit} className="text-sm text-gray-400 hover:text-white">EXIT DEMO</button>
    </nav>
    <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
            <Database className="w-10 h-10 text-purple-500" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise Analytics Dashboard</h2>
        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
            This module demonstrates high-performance data visualization and AI-driven insights.
            Full interactive dashboard implementation would be rendered here.
        </p>
    </div>
  </div>
);

const VelocityProject = ({ onExit }) => (
  <div className="min-h-screen w-full bg-[#05050A] text-white p-8 flex flex-col">
    <nav className="flex justify-between items-center mb-12">
        <div className="font-bold text-xl tracking-wider flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400 fill-current" /> VELOCITY
        </div>
        <button onClick={onExit} className="text-sm text-gray-400 hover:text-white">EXIT WORKSPACE</button>
    </nav>
    <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20">
            <Layout className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Next-Gen Project Management</h2>
        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
            A collaborative workspace for high-velocity teams. 
            Kanban boards, sprint planning, and team chat interfaces would be rendered here.
        </p>
    </div>
  </div>
);

// --- UTILS ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --- ASSETS CONSTANTS ---
const IMAGES = {
  branding: "/assets/branding.webp",
  websites: "/assets/elite-websites.webp",
  softwares: "/assets/softwares.webp",
  exclusive: "/assets/exclusive-work.webp"
};

// --- DATA ---
const LOGOS_DATA = [
  { id: 'lumen', title: "LÚMEN", category: "Technology / Smart Energy", src: "/assets/logo/logo1.webp", description: "Startup dedicated to developing self-sustaining smart lighting systems for cities and homes." },
  { id: 'nexoria', title: "NEXORIA", category: "AI / Enterprise Software", src: "/assets/logo/logo2.webp", description: "Artificial intelligence platform designed to optimize internal processes for large enterprises." },
  { id: 'terravia', title: "TERRAVIA", category: "Eco Tourism", src: "/assets/logo/logo3.webp", description: "Company offering sustainable travel experiences and premium nature tourism." },
  { id: 'aurix', title: "AURIX", category: "Audio / Music Tech", src: "/assets/logo/logo4.webp", description: "High-fidelity audio brand specializing in premium headphones and sound devices." },
  { id: 'kalon', title: "KÁLON", category: "Fashion / Luxury Design", src: "/assets/logo/logo6.webp", description: "High-end minimalist clothing brand with a focus on sustainability and timeless design." },
  { id: 'novafood', title: "NOVAFOOD", category: "Food / FoodTech", src: "/assets/logo/logo8.webp", description: "Startup developing functional and alternative plant-based food products." },
  { id: 'sentra', title: "SENTRA", category: "Cybersecurity", src: "/assets/logo/logo9.webp", description: "Firm specializing in advanced data protection and digital privacy solutions." },
  { id: 'mythos', title: "MYTHOS", category: "Gaming / Digital", src: "/assets/logo/logo10.webp", description: "Independent game studio creating narrative-driven videogames with high artistic quality." }
];

const WEBSITES_DATA = [
    { 
      title: "ARCHI STRUCT", 
      id: "archi", 
      src: "/assets/logopage/1.webp", 
      category: "Architecture / Generative CAD",
      description: "Un edificio generativo en estilo 'wireframe' (planos) que rota lentamente, simulando un diseño CAD."
    },
    { 
      title: "NEXUS GAMING", 
      id: "nexus", 
      src: "/assets/logopage/2.webp", 
      category: "Cybercafé / Synthwave",
      description: "A synthwave-style grid floor that moves infinitely with floating neon cubes."
    },
    { 
      title: "PURE BREW", 
      id: "brew", 
      src: "/assets/logopage/3.webp", 
      category: "E-commerce / Sensory",
      description: "Warm particles simulating the aroma of coffee rising, with warm brown and golden colors."
    },
    { 
      title: "AERO DYNAMICS", 
      id: "aero", 
      src: "/assets/logopage/4.webp", 
      category: "Automotive / Future Tech",
      description: "A digital wind tunnel displaying aerodynamic flows over a futuristic vehicle in real time."
    },
];

const SOFTWARES_DATA = [
    { 
      title: "A NOVA ARCHIVE", 
      id: "nexoria-pro", 
      src: "/assets/4.webp", 
      category: "Fashion / Dashboard / ERP / Analytics",
      description: "Advanced artificial intelligence platform for enterprise process optimization. Real-time analytics and automated decision-making.",
      component: null
    },
    { 
      title: "VELOCITY", 
      id: "sentra-shield", 
      src: "/assets/6.webp", 
      category: "Project Management / Team Collaboration / AI-Driven",
      description: "The AI-driven workspace for high-velocity teams. Plan, track, and ship software faster than ever with intelligent sprint optimization and real-time team collaboration.",
      component: VelocityProject
    }
];

const SERVICES_DATA = [
  { title: "Custom Software", desc: "We engineer the software your company actually needs. SaaS, Dashboards, and Internal Tools. Streamlined and built to scale.", icon: <Database className="w-6 h-6" /> },
  { title: "3D & Web Design", desc: "We move beyond templates to create unique, immersive digital experiences that engage and convert.", icon: <Layout className="w-6 h-6" /> },
  { title: "Full Source Code", desc: "You own everything. We deliver the complete source code at the end. No vendor lock-in, just pure value for your investment.", icon: <FileCode2 className="w-6 h-6" /> }
];

const PROJECT_CATEGORIES = [
    { title: "Logos & Branding", src: IMAGES.branding, id: "logos" },
    { title: "Elite Websites", src: IMAGES.websites, id: "web" },
    { title: "Softwares", src: IMAGES.softwares, id: "soft" },
    { title: "Exclusive Works", src: IMAGES.exclusive, id: "work" },
];

const TESTIMONIALS_DATA = [
  { id: 0, name: "Tyler Durden", designation: "CEO, Project Mayhem", content: (<p>BluePeak transformed our operations. The new <span className="font-bold bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded-sm">Custom Software</span> significantly increased our efficiency and data management.</p>) },
  { id: 1, name: "Sara Connor", designation: "CTO, Skynet Systems", content: (<p>Their engineering approach was exactly what we needed. They built a complex system that handles our logic flawlessly. <span className="font-bold bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded-sm">Pure Software Engineering</span>.</p>) },
  { id: 2, name: "Bruce Wayne", designation: "Owner, Wayne Ent.", content: (<p>I needed a platform that stood out. BluePeak delivered a <span className="font-bold bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded-sm">Unique Digital Asset</span> and handed over the keys. Full control.</p>) },
];


// --- EXCLUSIVE WORKS PAGE ---
const ExclusiveWorksPage = ({ onBack }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
          <button onClick={onBack} className="flex items-center gap-2 hover:text-amber-500 transition-colors text-sm md:text-base">
              <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="font-mono text-xs text-neutral-600">LEVEL: TOP_SECRET</div>
      </nav>
      
      {/* Fondo de cuadrícula sutil (Grid) */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
             backgroundSize: '30px 30px' 
           }}>
      </div>

      {/* Círculo de luz ambiental (Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Contenedor Principal */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        
        {/* Badge de Estado */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs tracking-wider text-amber-500"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          SYSTEM STATUS: STEALTH_MODE
        </motion.div>

        {/* Icono Principal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl shadow-xl backdrop-blur-sm">
            <Lock size={48} className="text-neutral-400" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Textos */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Access Restricted
          </h1>
          
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto"></div>

          <p className="text-neutral-400 leading-relaxed text-sm md:text-base max-w-md mx-auto">
            This vault contains our heavy-lifting engineering: High-Performance Mobile Apps and Long-Term Enterprise Systems.
            <br className="hidden md:block my-2" />
            Due to the complexity and strategic value of these developments, they operate under strict Non-Disclosure Agreements (NDA).
            <br className="hidden md:block my-2" />
            <span className="text-amber-500/90 font-medium">We build the future in Stealth Mode.</span>
          </p>
        </motion.div>

        {/* Indicador de Bloqueo */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-neutral-600">
            <Lock size={16} />
            <span className="text-xs tracking-widest uppercase font-semibold">Access Locked</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// --- CONSTRUCTION PAGE ---
const ConstructionPage = ({ project, onBack }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const [timeString, setTimeString] = useState("00:00:00");
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeString(new Date().toLocaleTimeString());
      }, 1000);
      return () => clearInterval(timer);
    }, []);
    
    const customMessages = {
      brew: {
        title: "Pure Brew - Under Construction",
        message: "We are coding the webpage, you can come back in the future and you will see how amazing it will be :)",
        isExclusive: false
      },
      aero: {
        title: "Aero Dynamics - Under Construction",
        message: "We are coding the webpage, you can come back in the future and you will see how amazing it will be :)",
        isExclusive: false
      }
    };
    
    const config = customMessages[project?.id] || {
      title: project?.title,
      message: "We are currently engineering a unique digital experience. Great software takes time. Check back soon.",
      isExclusive: false
    };

    return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans relative flex flex-col overflow-hidden">
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[#05050A]/90 backdrop-blur-md border-b border-white/5">
          <button onClick={onBack} className="flex items-center gap-2 hover:text-blue-400 transition-colors text-sm md:text-base">
              <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="font-mono text-xs text-gray-500">STATUS: BUILDING</div>
      </nav>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Grid Background */}
        <motion.div 
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
          style={{ backgroundPosition: "0% 0%" }}
        />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#000000_0%,transparent_100%)] pointer-events-none" />
        
        {/* Icon Section */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="mb-8 relative will-change-transform"
        >
            <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <HardHat className="w-12 h-12 text-yellow-500" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }} 
              className="absolute inset-0 rounded-full border-t-2 border-yellow-500/50"
              style={{ willChange: "transform" }} 
            />
        </motion.div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 tracking-tight">{config.title}</h1>
        
        {/* Status Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full mb-8 border bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
            <Hammer className="w-4 h-4" />
            <span className="text-sm font-mono font-bold uppercase tracking-wider">Under Construction</span>
        </div>
        
        {/* Message Paragraph */}
        <p className="text-gray-400 text-center leading-relaxed max-w-[60ch] text-lg">
            {config.message}
        </p>
        
        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="h-full bg-yellow-500 will-change-transform" />
        </motion.div>
      </div>
    </div>
    );
};

// --- RICH ANIMATION COMPONENTS (Restored & Memoized) ---
const BlueprintAnimation = React.memo(() => (
  <div className="w-full aspect-video bg-[#0A0A12] rounded-lg border border-cyan-500/20 overflow-hidden relative flex items-center justify-center p-4 md:p-8 group shadow-[0_0_30px_rgba(6,182,212,0.1)]">
    <div className="absolute inset-0 bg-grid-white" />
    <div className="relative w-full h-full max-w-[200px] grid grid-cols-2 gap-2 transform scale-90 md:scale-100 origin-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="col-span-2 h-6 md:h-8 bg-cyan-500/20 border border-cyan-500/40 rounded flex items-center px-2">
        <div className="h-1 w-1/3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="h-20 md:h-24 bg-white/5 border border-white/10 rounded p-2 space-y-2">
        <div className="h-1 w-full bg-white/10 rounded-full" />
        <div className="h-1 w-2/3 bg-white/10 rounded-full" />
        <div className="h-1 w-full bg-white/10 rounded-full" />
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="h-20 md:h-24 bg-white/5 border border-white/10 rounded p-2 space-y-2">
        <div className="h-10 md:h-12 w-full bg-white/5 rounded mb-2" />
        <div className="h-1 w-1/2 bg-cyan-500/30 rounded-full" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="col-span-2 h-6 md:h-8 bg-white/5 border border-white/10 rounded flex items-center justify-between px-2">
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="w-1 h-1 rounded-full bg-white/20" />
        </div>
        <div className="h-1 w-1/4 bg-cyan-500/50 rounded-full" />
      </motion.div>
    </div>
  </div>
));
BlueprintAnimation.displayName = "BlueprintAnimation";

const CodingAnimation = React.memo(() => (
  <div className="w-full aspect-video bg-[#0A0A12] rounded-lg border border-fuchsia-500/20 overflow-hidden relative flex flex-col p-4 font-mono text-[10px] md:text-xs shadow-[0_0_30px_rgba(217,70,239,0.1)]">
    <div className="flex gap-1.5 mb-4 border-b border-white/5 pb-2">
      <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-red-500" />
      <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-yellow-500" />
      <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-green-500" />
      <span className="ml-auto text-gray-500 hidden sm:inline">UniqueCore.jsx</span>
    </div>
    <div className="space-y-1 md:space-y-1.5 opacity-90 overflow-hidden">
      <div className="flex flex-wrap">
        <span className="text-fuchsia-400 mr-2">const</span>
        <span className="text-cyan-400">NextGen</span>
        <span className="text-white mx-1">=</span>
        <span className="text-yellow-300">async</span>
        <span className="text-white">()</span>
        <span className="text-white ml-1">{'=>'}</span>
        <span className="text-white ml-1">{'{'}</span>
      </div>
      {[1, 2, 3].map((i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5, duration: 0.5 }} className="pl-2 md:pl-4 flex items-center gap-2">
          <span className="text-gray-600">{i}</span>
          <div className={`h-1.5 rounded-sm ${i === 2 ? 'bg-fuchsia-500 w-24 md:w-32 shadow-[0_0_10px_#d946ef]' : 'bg-gray-700 w-full max-w-[120px] md:max-w-[180px]'}`} />
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 2, duration: 0.3 }} className="pl-2 md:pl-4 flex items-center gap-2">
        <span className="text-gray-600">4</span>
        <span className="text-fuchsia-400">return</span>
        <span className="text-green-400">FullOwnership;</span>
      </motion.div>
      <div className="text-white">{'}'}</div>
    </div>
  </div>
));
CodingAnimation.displayName = "CodingAnimation";

const TestingAnimation = React.memo(() => (
  <div className="w-full aspect-video bg-[#0A0A12] rounded-lg border border-lime-500/20 overflow-hidden relative flex items-center justify-center shadow-[0_0_30px_rgba(132,204,22,0.1)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.1),transparent_70%)]" />
    <div className="w-full max-w-[250px] space-y-2 md:space-y-3 relative z-10 px-4">
      {['High Performance', 'Interactive Logic', 'Mobile Ready', 'Bug Free'].map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4, duration: 0.4 }} className="flex items-center justify-between bg-black/60 border border-lime-500/20 p-2 md:p-3 rounded-md backdrop-blur-sm">
          <span className="text-[10px] md:text-xs text-lime-100 font-mono">{item}</span>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.4 + 0.2, type: "spring" }}>
            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-lime-400 drop-shadow-[0_0_5px_rgba(163,230,53,0.8)]" />
          </motion.div>
        </motion.div>
      ))}
    </div>
    <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[1px] bg-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.8)] z-20" style={{ willChange: "top" }} />
  </div>
));
TestingAnimation.displayName = "TestingAnimation";

const DeploymentAnimation = React.memo(() => (
  <div className="w-full aspect-video bg-[#0A0A12] rounded-lg border border-orange-500/20 overflow-hidden relative flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.1)]">
    <div className="relative z-10">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-600 rounded-full flex items-center justify-center relative z-20 shadow-[0_0_20px_rgba(249,115,22,0.5)]">
        <FileCode2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
        <motion.div animate={{ opacity: [0.5, 0], scale: [1, 1.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-orange-500/50 -z-10" style={{ willChange: "transform, opacity" }} />
      </div>
      <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 animate-pulse" />
    </div>
    {[0, 1, 2, 3].map((i) => (
      <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }} className="absolute w-full h-full flex items-center justify-center" style={{ width: `${140 + i * 40}px`, height: `${140 + i * 40}px` }}>
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-200 rounded-full absolute top-0 shadow-[0_0_10px_white]" />
        <div className="absolute inset-0 rounded-full border border-orange-500/20" />
      </motion.div>
    ))}
  </div>
));
DeploymentAnimation.displayName = "DeploymentAnimation";

// --- COMPLEX UI COMPONENTS ---

const Sparkles = React.memo(() => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{ duration: random() * 2 + 4, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", width: "2px", height: "2px", borderRadius: "50%", zIndex: 1 }}
          className="inline-block bg-white"
        ></motion.span>
      ))}
    </div>
  );
});
Sparkles.displayName = "Sparkles";


const CardSkeletonContainer = ({ className, children, showGradient = true }) => (
  <div className={cn("h-[15rem] md:h-[20rem] rounded-xl z-40", className, showGradient && "bg-[rgba(40,40,40,0.3)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]")}>
    {children}
  </div>
);

const Container = ({ className, children }) => (
  <div className={cn("h-12 w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]", className)}>
    {children}
  </div>
);

const ClaudeLogo = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}><rect fill="#CC9B7A" width="512" height="512" rx="104.187" ry="105.042" /><path fill="#1F1F1E" d="M318.663 149.787h-43.368l78.952 212.423 43.368.004-78.952-212.427zm-125.326 0l-78.952 212.427h44.255l15.932-44.608 82.846-.004 16.107 44.612h44.255l-79.126-212.427h-45.317zm-4.251 128.341l26.91-74.701 27.083 74.701h-53.993z"/></svg>);
const ReactLogo = ({ className }) => (<svg viewBox="-11.5 -10.23174 23 20.46348" className={className}><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>);

const ToolsSkeleton = React.memo(() => {
  useEffect(() => {
    animate([
        [".circle-1", { scale: [1, 1.1, 1], transform: ["translateY(0px)", "translateY(-4px)", "translateY(0px)"] }, { duration: 0.8 }],
        [".circle-2", { scale: [1, 1.1, 1], transform: ["translateY(0px)", "translateY(-4px)", "translateY(0px)"] }, { duration: 0.8 }],
        [".circle-3", { scale: [1, 1.1, 1], transform: ["translateY(0px)", "translateY(-4px)", "translateY(0px)"] }, { duration: 0.8 }],
        [".circle-4", { scale: [1, 1.1, 1], transform: ["translateY(0px)", "translateY(-4px)", "translateY(0px)"] }, { duration: 0.8 }],
        [".circle-5", { scale: [1, 1.1, 1], transform: ["translateY(0px)", "translateY(-4px)", "translateY(0px)"] }, { duration: 0.8 }],
    ], { repeat: Infinity, repeatDelay: 1 });
  }, []);

  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1"><ClaudeLogo className="h-4 w-4" /></Container>
        <Container className="h-10 w-10 md:h-12 md:w-12 circle-2"><Code2 className="h-5 w-5 md:h-6 md:w-6 text-blue-400" /></Container>
        <Container className="circle-3"><ReactLogo className="h-6 w-6 md:h-8 md:w-8" /></Container>
        <Container className="h-10 w-10 md:h-12 md:w-12 circle-4"><Terminal className="h-5 w-5 md:h-6 md:w-6 text-white" /></Container>
        <Container className="h-8 w-8 circle-5"><Zap className="h-4 w-4 text-yellow-400" /></Container>
      </div>
      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-pulse">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10"><Sparkles /></div>
      </div>
    </div>
  );
});
ToolsSkeleton.displayName = "ToolsSkeleton";


const ToolsCard = React.memo(() => (
  <div className="w-full max-w-sm mx-auto p-4 md:p-8 rounded-xl border border-white/10 bg-[#0A0A12] shadow-2xl group">
    <CardSkeletonContainer><ToolsSkeleton /></CardSkeletonContainer>
    <h3 className="text-lg font-semibold text-white py-2">Unique Code Architecture</h3>
    <p className="text-sm font-normal text-neutral-400">We write every line. No drag-and-drop builders. Just pure, high-performance code.</p>
  </div>
));
ToolsCard.displayName = "ToolsCard";


const CardStack = ({ items, offset, scaleFactor }) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState(items);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards];
        const lastCard = newArray.pop();
        if (lastCard) {
          newArray.unshift(lastCard);
        }
        return newArray;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-60 w-full max-w-[280px] md:h-60 md:max-w-md mx-auto">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute dark:bg-black bg-[#0A0A12] h-60 w-full rounded-3xl p-6 shadow-xl border border-white/10 shadow-black/[0.1] flex flex-col justify-between"
          style={{ transformOrigin: "top center" }}
          animate={{ top: index * -CARD_OFFSET, scale: 1 - index * SCALE_FACTOR, zIndex: cards.length - index }}
        >
          <div className="font-normal text-neutral-300 text-sm md:text-base">{card.content}</div>
          <div>
            <p className="text-white font-medium">{card.name}</p>
            <p className="text-neutral-500 font-normal text-sm">{card.designation}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- CORE UI ---

const FocusCard = React.memo(({ card, onClick }) => {
  const isLocked = card.id === 'brew' || card.id === 'aero';
  
  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        "rounded-2xl relative bg-neutral-900 overflow-hidden h-[300px] md:h-[400px] w-full cursor-pointer border border-white/5",
        "transition-all duration-200 ease-out transform-gpu", 
        "group-hover/projects:opacity-40 group-hover/projects:scale-[0.98]",
        !isLocked && "hover:!opacity-100 hover:!scale-[1.02] hover:z-10 hover:border-blue-500/50 hover:ring-1 hover:ring-blue-400/50 hover:shadow-xl",
        isLocked && "hover:opacity-50 cursor-not-allowed"
      )}
    >
      <img 
        src={card.src} 
        alt={card.title} 
        className={cn(
          "object-cover absolute inset-0 w-full h-full transition-all duration-500 z-0",
          !isLocked && "hover:scale-105",
          isLocked && "grayscale hover:grayscale"
        )}
      />
      <div className={cn(
        "absolute inset-0 flex flex-col justify-end py-8 px-6 transition-all duration-500 z-10",
        "bg-gradient-to-t from-black via-black/60 to-transparent" 
      )}>
        <div className="relative z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md">{card.title}</h3>
          <div className={cn(
            "h-1 mt-2 rounded-full transition-all duration-500 shadow-sm",
            isLocked ? "w-12 bg-gray-500" : "w-12 bg-blue-500 group-hover:w-full group-hover:bg-blue-400"
          )} />
        </div>
      </div>
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 hover:bg-black/60 transition-all duration-300">
          <Lock className="w-16 h-16 text-white drop-shadow-lg" />
        </div>
      )}
    </div>
  );
});
FocusCard.displayName = "FocusCard";


const ProjectGrid = ({ items, onClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6 group/projects">
      {items.map((card) => (
        <FocusCard key={card.title} card={card} onClick={() => onClick(card)} />
      ))}
    </div>
  );
};

const Timeline = ({ data }) => {
  const containerRef = React.useRef(null);
  const [height, setHeight] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (containerRef.current) {
        requestAnimationFrame(() => {
            if (containerRef.current) {
                setHeight(containerRef.current.getBoundingClientRect().height)
            }
        });
    }
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 10%", "end 50%"] });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-[#05050A] font-sans px-4 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto py-12 md:py-20 px-0 md:px-8">
        <h2 className="text-3xl md:text-4xl mb-4 text-white font-bold">Integral Development Methodology</h2>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl">
          We believe in crafting solutions that fit your specific needs. Our process moves beyond standard templates to engineer robust, scalable software that drives your business forward.
        </p>
      </div>
      <div ref={containerRef} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-24 md:top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-8 w-8 absolute left-2 md:left-3 rounded-full bg-[#05050A] border border-white/10 z-50 flex items-center justify-center">
                 <div className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-gray-100 tracking-tight">{item.title}</h3>
            </div>
            <div className="relative pl-14 md:pl-20 pr-0 md:pr-4 w-full">
              <h3 className="md:hidden block text-xl mb-4 font-bold text-gray-100">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
        <div style={{ height: height + "px" }} className="absolute left-[23px] md:left-[27px] top-0 w-[2px] bg-white/5 overflow-hidden">
           {!shouldReduceMotion && (
               <motion.div 
                 style={{ height: heightTransform, opacity: opacityTransform }} 
                 className="w-full bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500" 
               />
           )}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
    const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    return (
    <nav className="fixed top-0 w-full z-50 bg-[#05050A]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-bold text-white tracking-tight text-lg">BluePeak</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#method" className="hover:text-white transition-colors">Method</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
        </div>
        <button onClick={scrollToContact} className="bg-green-600 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold hover:bg-green-500 transition-colors flex items-center gap-2">
            <MessageCircle className="w-3 h-3 md:w-4 md:h-4" /> Get a Quote
        </button>
        </div>
    </nav>
    );
};

const Interstitial = ({ onContinue, project }) => {
  useEffect(() => {
    const timer = setTimeout(onContinue, 2500); 
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center text-center px-6">
       <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] opacity-10 pointer-events-none">
          {[...Array(400)].map((_, i) => <div key={i} className="border-[0.5px] border-blue-900/30" />)}
       </div>
       <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center relative z-10">
           <div className="mb-8 relative flex justify-center">
                <motion.div animate={{ rotateX: 360, rotateY: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-16 h-16 md:w-24 md:h-24 border-2 border-blue-500 relative" style={{ transformStyle: 'preserve-3d'}}>
                    <div className="absolute inset-0 bg-blue-500/20" />
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 md:w-32 h-1 bg-blue-500 blur-xl animate-pulse" />
            </div>
            <h2 className="text-xl md:text-3xl font-mono font-bold text-white mb-2">INITIALIZING</h2>
            <p className="text-blue-400 font-mono text-sm">{project?.title || 'System'} Module...</p>
       </motion.div>
    </div>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
);

const LogoCard = React.memo(({ item }) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-[#0F0F16] overflow-hidden flex flex-col w-full border border-white/5",
        "transition-all duration-300 ease-out will-change-transform transform-gpu",
        "group-hover/logos:opacity-40 group-hover/logos:scale-[0.98]", 
        "hover:!opacity-100 hover:!scale-[1.02] hover:!z-10 hover:border-blue-500/30 hover:shadow-xl hover:bg-[#16161F]"
      )}
    >
      <div className="relative w-full aspect-[9/16] bg-black/40 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 flex items-center justify-center">
             <h2 className="text-3xl font-bold text-white/5 select-none uppercase tracking-tighter -rotate-12">
               {item.title}
             </h2>
          </div>
          <img 
            src={item.src} 
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
      </div>
      <div className="flex flex-col p-5 bg-[#0F0F16]">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-blue-400 text-[10px] font-mono tracking-widest uppercase font-bold truncate">
                {item.category}
                </p>
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide mb-2 leading-snug">
            {item.title}
            </h3>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-4">
          {item.description}
        </p>
      </div>
    </div>
  );
});
LogoCard.displayName = "LogoCard";

const LogosPage = ({ onBack }) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans relative flex flex-col">
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[#05050A]/90 backdrop-blur-md border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-blue-400 transition-colors text-sm md:text-base group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Nexus
        </button>
        <div className="font-mono text-xs text-gray-500">COLLECTION: BRANDING</div>
      </nav>
      <div className="flex-1 p-6 pt-32 pb-20 max-w-7xl mx-auto w-full">
        <div className="mb-12 md:mb-20 text-center">
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6"
          >
            <Palette className="w-3 h-3" /> Identity Systems
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">Logos & Branding</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">A curated selection of corporate identities designed for high-impact brands.</p>
        </div>
        
        <motion.div 
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto group/logos"
        >
          {LOGOS_DATA.map((logo) => (
            <motion.div key={logo.id} variants={shouldReduceMotion ? {} : itemVariants}>
              <LogoCard item={logo} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const SoftwaresPage = ({ onBack, onViewProject }) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans relative flex flex-col">
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[#05050A]/90 backdrop-blur-md border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-blue-400 transition-colors text-sm md:text-base group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </button>
        <div className="font-mono text-xs text-gray-500">COLLECTION: SOFTWARES</div>
      </nav>
      <div className="flex-1 p-6 pt-32 pb-20 max-w-7xl mx-auto w-full">
        <div className="mb-12 md:mb-20 text-center">
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400 mb-6"
          >
            <Code2 className="w-3 h-3" /> Advanced Solutions
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">Custom Softwares</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Enterprise-grade applications built for your unique needs.</p>
        </div>
        
        <motion.div 
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto group/projects"
        >
          {SOFTWARES_DATA.map((software) => (
            <motion.div key={software.id} variants={shouldReduceMotion ? {} : itemVariants}>
              <div onClick={() => onViewProject && onViewProject(software)} className="rounded-2xl relative bg-neutral-900 overflow-hidden h-[300px] md:h-[400px] w-full border border-white/5 hover:border-purple-500/50 hover:ring-1 hover:ring-purple-400/50 hover:shadow-xl transition-all duration-200 group cursor-pointer">
                <img 
                  src={software.src} 
                  alt={software.title} 
                  className="object-cover absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105 z-0" 
                />
                <div className="absolute inset-0 flex flex-col justify-end py-8 px-6 transition-all duration-500 z-10 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <div className="relative z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md">{software.title}</h3>
                    <div className="w-12 h-1 bg-purple-500 mt-2 rounded-full transition-all duration-500 group-hover:w-full group-hover:bg-purple-400 shadow-sm" />
                    <p className="text-xs md:text-sm text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{software.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const WebsitesPage = ({ onBack, onViewProject }) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans relative flex flex-col">
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[#05050A]/90 backdrop-blur-md border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-blue-400 transition-colors text-sm md:text-base group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Nexus
        </button>
        <div className="font-mono text-xs text-gray-500">COLLECTION: WEBSITES</div>
      </nav>
      <div className="flex-1 p-6 pt-32 pb-20 max-w-7xl mx-auto w-full">
        <div className="mb-12 md:mb-20 text-center">
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6"
          >
            <Globe className="w-3 h-3" /> Digital Experience
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">Elite Websites</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Immersive web platforms engineered for performance and impact.</p>
        </div>
        
        <motion.div 
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto group/projects"
        >
          {WEBSITES_DATA.map((site) => (
            <motion.div key={site.id} variants={shouldReduceMotion ? {} : itemVariants}>
              <FocusCard card={site} onClick={() => onViewProject(site)} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const Home = ({ onViewProject }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleInputChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation of sending
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
      setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };

  const timelineData = useMemo(() => [
    { 
        title: "1. Analysis & Architecture", 
        content: (
            <div>
              <p className="text-neutral-400 text-sm md:text-base mb-8 leading-relaxed">
                We analyze your business thoroughly. You tell us your idea —whether it's automating your company with <span className="text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Custom Software</span> or launching a <span className="text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">High-Impact Web Platform</span>. We define the logic and architecture before writing a single line of code.
              </p>
              <BlueprintAnimation />
            </div>
        ) 
    },
    { 
        title: "2. Engineering & Development", 
        content: (
            <div>
              <p className="text-neutral-400 text-sm md:text-base mb-8 leading-relaxed">
                We build with precision. Using <span className="text-fuchsia-300 font-bold drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]">React, Next.js, and Three.js</span>, we create bespoke systems that stand out. We focus on performance and scalability, ensuring your software is robust and ready for growth.
              </p>
              <CodingAnimation />
            </div>
        ) 
    },
    { 
        title: "3. QA & Optimization", 
        content: (
            <div>
              <p className="text-neutral-400 text-sm md:text-base mb-8 leading-relaxed">
                Quality is paramount. We rigorously test for <span className="text-lime-300 font-bold drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]">0 errors</span> and optimize for fluid performance. Your users deserve a seamless experience. We ensure every interaction is instantaneous and every workflow is bulletproof. High Performance.
              </p>
              <TestingAnimation />
            </div>
        ) 
    },
    { 
        title: "4. Deployment & Handover", 
        content: (
            <div>
              <p className="text-neutral-400 text-sm md:text-base mb-8 leading-relaxed">
                We launch your project to the cloud with secure, scalable infrastructure. Most importantly, we provide a <span className="text-orange-300 font-bold drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">full source code handover</span>. You own your technology completely.
              </p>
              <DeploymentAnimation />
            </div>
        ) 
    },
  ], []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            <div>
                <FadeIn>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Custom Software + Elite Websites
                  </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 md:mb-8">
                    Custom Software.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-white">The Next Generation.</span>
                    </h1>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mb-8 border-l-2 border-white/10 pl-4 md:pl-6">
                        We transform your vision into unique digital assets. We move beyond standard templates to engineer spectacular <b>3D experiences</b> and powerful <b>Custom Software</b> designed to engage users and elevate your brand.
                    </p>
                </FadeIn>
                <FadeIn delay={0.3} className="flex flex-wrap gap-4">
                    <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all text-sm md:text-base">
                        View Our Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </FadeIn>
            </div>
            <FadeIn delay={0.4} className="relative flex justify-center mt-10 lg:mt-0">
                <ToolsCard />
            </FadeIn>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-[#08080E] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">Comprehensive Solutions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES_DATA.map((service, index) => (
              <div key={index} className="p-6 md:p-8 rounded-2xl bg-[#0F0F16] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-900/10 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="bg-[#05050A]">
        <Timeline data={timelineData} />
      </section>

      <section id="portfolio" className="py-20 md:py-32 bg-[#05050A]">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <span className="text-blue-500 font-bold tracking-wider text-xs md:text-sm mb-2 block">SELECTED WORKS</span>
                <h2 className="text-3xl md:text-5xl font-bold">Our Portfolio So Far</h2>
                <p className="text-gray-500 mt-2 text-sm md:text-base">A collection of the unique projects we've engineered to date.</p>
            </div>
        </div>
        <ProjectGrid items={PROJECT_CATEGORIES} onClick={onViewProject} />
      </section>

      <section id="testimonials" className="py-20 border-t border-white/5 bg-[#08080E] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Simulated Success</h2>
                <p className="text-gray-400 text-base md:text-lg mb-8">While these testimonials are placeholders, they represent the tangible reality we deliver. This is the level of satisfaction we guarantee for your future project.</p>
            </div>
            <div className="flex items-center justify-center h-[20rem] md:h-[30rem]">
                <CardStack items={TESTIMONIALS_DATA} />
            </div>
        </div>
      </section>

       <section id="contact" className="py-20 md:py-32 border-t border-white/10 bg-[#05050A] px-6">
         <div className="max-w-4xl mx-auto text-center mb-12">
           <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6">Ready to Innovate?</h2>
           <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">Let's build something exceptional together. Fill out the form below or message us directly.</p>
         </div>

         <div className="max-w-xl mx-auto bg-[#0F0F16] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Form Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <form onSubmit={handleSubmit} className="space-y-6 text-left relative z-10">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formState.name}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required
                    value={formState.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : isSent ? (
                    <span className="flex items-center gap-2 text-green-400"><CheckCircle2 className="w-5 h-5"/> Message Sent</span>
                  ) : (
                    <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
                 <p className="text-gray-400 text-sm">Or connect instantly via</p>
                 <a href="sms:385-416-5454" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium bg-green-500/10 px-6 py-3 rounded-full hover:bg-green-500/20 border border-green-500/20">
                    <MessageCircle className="w-5 h-5" /> Contact via iMessage
                 </a>
            </div>
         </div>
       </section>

       <footer className="py-8 md:py-12 border-t border-white/10 bg-black text-center text-gray-500 text-xs md:text-sm">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="font-bold text-white text-base md:text-lg">BluePeak Solutions</div>
             <p>© 2026 BluePeak Solutions. The New Generation.</p>
         </div>
       </footer>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState({ name: 'home', project: null });
  const [interstitial, setInterstitial] = useState(false);

  const handleViewProject = (project) => {
    setView({ ...view, project });
    setInterstitial(true);
  };

  const handleContinue = () => {
    setInterstitial(false);
    const pid = view.project?.id;
    
    if (!pid) return;

    switch (pid) {
        case 'logos':
             setView(prev => ({ name: 'logos', project: prev.project }));
             break;
        case 'web':
             setView(prev => ({ name: 'websites', project: prev.project }));
             break;
        case 'soft':
             setView(prev => ({ name: 'softwares', project: prev.project }));
             break;
        case 'nexoria-pro':
             setView(prev => ({ name: 'nexoria-pro', project: prev.project }));
             break;
        case 'sentra-shield':
             setView(prev => ({ name: 'velocity', project: prev.project }));
             break;
        case 'archi':
             setView(prev => ({ name: 'scene-1', project: prev.project }));
             break;
        case 'nexus':
             setView(prev => ({ name: 'scene-2', project: prev.project }));
             break;
        case 'brew':
             setView(prev => ({ name: 'scene-3', project: prev.project }));
             break;
        case 'work':
             setView(prev => ({ name: 'exclusive', project: prev.project }));
             break;
        default:
             setView(prev => ({ name: 'construction', project: prev.project }));
             break;
    }
  };

  const handleBack = () => {
    setView({ name: 'home', project: null });
  };

  const handleBackToElite = () => {
      setView({ name: 'websites', project: { id: 'web', title: 'Elite Websites' } });
  };

  const renderScene = () => {
    if (interstitial) {
        return <Interstitial key="loading" onContinue={handleContinue} project={view.project} />;
    }
    switch(view.name) {
        case 'home':
            return <Home key="home" onViewProject={handleViewProject} />;
        case 'logos':
            return <LogosPage key="logos" onBack={handleBack} />;
        case 'websites':
            return <WebsitesPage key="websites" onBack={handleBack} onViewProject={handleViewProject} />;
        case 'softwares':
            return <SoftwaresPage key="softwares" onBack={handleBack} onViewProject={handleViewProject} />;
        case 'nexoria-pro':
            return <VortexRetail key="nexoria-pro" onExit={handleBack} />;
        case 'velocity':
            return <VelocityProject key="velocity" onExit={handleBack} />;
        case 'exclusive':
            return <ExclusiveWorksPage key="exclusive" onBack={handleBack} />;
        case 'scene-1':
            return <Scene1 onBack={handleBackToElite} />;
        case 'scene-2':
            return <Scene2 onBack={handleBackToElite} />;
        case 'scene-3':
            return <Scene3 onBack={handleBackToElite} />;
        case 'construction':
        default:
            return <ConstructionPage key="construction" project={view.project} onBack={handleBack} />;
    }
  };

  return (
    <div className="bg-[#05050A] min-h-screen text-white font-sans">
      {view.name === 'home' && <Navbar />}
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
      <Analytics />
    </div>
  );
}