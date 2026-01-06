import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, Palette } from 'lucide-react';

const LOGOS_DATA = [
  { 
    id: 'lumen',
    title: "LÚMEN", 
    category: "Technology / Smart Energy", 
    src: "/assets/logo/logo1.webp",
    description: "Startup dedicated to developing self-sustaining smart lighting systems for cities and homes."
  },
  { 
    id: 'nexoria',
    title: "NEXORIA", 
    category: "AI / Enterprise Software", 
    src: "/assets/logo/logo2.webp",
    description: "Artificial intelligence platform designed to optimize internal processes for large enterprises."
  },
  { 
    id: 'terravia',
    title: "TERRAVIA", 
    category: "Eco Tourism", 
    src: "/assets/logo/logo3.webp",
    description: "Company offering sustainable travel experiences and premium nature tourism."
  },
  { 
    id: 'aurix',
    title: "AURIX", 
    category: "Audio / Music Tech", 
    src: "/assets/logo/logo4.webp",
    description: "High-fidelity audio brand specializing in premium headphones and sound devices."
  },
  { 
    id: 'vireon',
    title: "VIREON", 
    category: "Biotech / Health", 
    src: "/assets/logo/logo5.webp",
    description: "Company focused on the research and development of advanced genetic therapies."
  },
  { 
    id: 'kalon',
    title: "KÁLON", 
    category: "Fashion / Luxury Design", 
    src: "/assets/logo/logo6.webp",
    description: "High-end minimalist clothing brand with a focus on sustainability and timeless design."
  },
  { 
    id: 'orbita',
    title: "ORBITA", 
    category: "Aerospace / Innovation", 
    src: "/assets/logo/logo7.webp",
    description: "Aerospace company dedicated to developing small satellites for global telecommunications."
  },
  { 
    id: 'novafood',
    title: "NOVAFOOD", 
    category: "Food / FoodTech", 
    src: "/assets/logo/logo8.webp",
    description: "Startup developing functional and alternative plant-based food products."
  },
  { 
    id: 'sentra',
    title: "SENTRA", 
    category: "Cybersecurity", 
    src: "/assets/logo/logo9.webp",
    description: "Firm specializing in advanced data protection and digital privacy solutions."
  },
  { 
    id: 'mythos',
    title: "MYTHOS", 
    category: "Gaming / Digital", 
    src: "/assets/logo/logo10.webp",
    description: "Independent game studio creating narrative-driven videogames with high artistic quality."
  }
];

// --- UTILS ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --- OPTIMIZED CARD COMPONENT ---
// React.memo previene re-renders si las props no cambian (esencial para listas grandes)
const LogoCard = React.memo(({ item, index, hovered, setHovered, isMobile }) => {
  const isHovered = hovered === index;
  const isBlurry = hovered !== null && hovered !== index;
  
  // Performance: Manejadores estables
  const handleMouseEnter = () => !isMobile && setHovered(index);
  const handleMouseLeave = () => !isMobile && setHovered(null);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Performance: 'will-change-transform' ayuda al navegador a optimizar capas
      className={cn(
        "rounded-xl relative bg-[#0A0A10] overflow-hidden aspect-[9/16] w-full cursor-default border border-white/5",
        "transition-all duration-300 ease-out will-change-transform",
        // Desktop Optimization: Solo aplicamos blur y escala compleja en pantallas medianas o superiores
        isBlurry && "md:blur-[2px] md:scale-[0.98] opacity-60 md:grayscale-[0.5]",
        isHovered && "md:scale-[1.02] border-blue-500/40 md:shadow-[0_0_50px_rgba(59,130,246,0.25)] z-20"
      )}
    >
      {/* Background & Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#111] to-[#050505] p-0">
        {/* Fallback Text (Rendered underneath) */}
        <h2 className="absolute text-3xl font-bold text-white/5 select-none pointer-events-none uppercase tracking-tighter z-0 -rotate-90">
          {item.title}
        </h2>
        
        {/* Optimized Image */}
        <img 
          src={item.src} 
          alt={item.title}
          // Performance: Carga perezosa y decodificación asíncrona para no bloquear el hilo principal
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 relative z-10"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 pointer-events-none" />
      </div>
      
      {/* Overlay Info */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-6 transition-transform duration-300",
          isHovered ? "translate-y-0" : "translate-y-2"
        )}
      >
        <div className="relative z-20">
          <p className="text-blue-400 text-[10px] font-mono mb-2 tracking-widest uppercase font-bold">
            {item.category}
          </p>
          <h3 className="text-2xl font-bold text-white tracking-wide mb-2 leading-tight">
            {item.title}
          </h3>
          <p className={cn(
            "text-gray-400 text-xs leading-relaxed transition-opacity duration-300",
            isHovered ? "opacity-100 line-clamp-none" : "opacity-80 line-clamp-2"
          )}>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
});

LogoCard.displayName = "LogoCard";

// --- MAIN PAGE COMPONENT ---
export default function LogosPage({ onBack }) {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // UX: Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check mobile once to disable heavy hover effects
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Framer motion variants optimized
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // Faster stagger for perceived performance
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans relative flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-[#05050A]/90 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 hover:text-blue-400 transition-colors text-sm md:text-base group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          Back to Nexus
        </button>
        <div className="font-mono text-xs text-gray-500">COLLECTION: BRANDING</div>
      </nav>
      
      <div className="flex-1 p-6 pt-32 pb-20 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12 md:mb-20 text-center">
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6"
          >
            <Palette className="w-3 h-3" /> Identity Systems
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            Logos & Branding
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A curated selection of corporate identities designed for high-impact brands. Minimalist, geometric, and timeless.
          </p>
        </div>

        {/* Logo Grid */}
        <motion.div 
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto"
        >
          {LOGOS_DATA.map((logo, index) => (
            <motion.div key={logo.id} variants={shouldReduceMotion ? {} : itemVariants}>
              <LogoCard 
                item={logo} 
                index={index} 
                hovered={hovered} 
                setHovered={setHovered}
                isMobile={isMobile}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};