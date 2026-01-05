import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, XCircle, Moon, Coffee, Wifi, ArrowRight, Cpu, Monitor, Zap } from 'lucide-react';

// --- UTILS ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* --- 3D SCENE: THE ARTIFACT --- */
const NexusStudioScene = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const objectRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#02040a');
    scene.fog = new THREE.FogExp2('#02040a', 0.04);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. THE ARTIFACT: ENERGY CORE SYSTEM
    const coreGroup = new THREE.Group();

    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
        color: 0x000000, emissive: 0x2563eb, emissiveIntensity: 3, roughness: 0.1, metalness: 1.0
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);

    const cageGeo = new THREE.IcosahedronGeometry(2.0, 0);
    const cageMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.15
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);

    const shieldBaseGeo = new THREE.DodecahedronGeometry(2.8, 0);
    const shieldGeo = new THREE.EdgesGeometry(shieldBaseGeo); 
    const shieldMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.3 });
    const shield = new THREE.LineSegments(shieldGeo, shieldMat);

    const ringGeo = new THREE.TorusGeometry(3.5, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.5 });
    const ringVertical = new THREE.Mesh(ringGeo, ringMat);
    ringVertical.rotation.y = Math.PI / 2;
    const ringHorizontal = new THREE.Mesh(ringGeo, ringMat);
    ringHorizontal.rotation.x = Math.PI / 2;

    coreGroup.add(innerCore, cage, shield, ringVertical, ringHorizontal);
    coreGroup.rotation.x = 0.5;
    coreGroup.rotation.z = 0.2;

    objectRef.current = {
        group: coreGroup, inner: innerCore, cage: cage, shield: shield, rings: [ringVertical, ringHorizontal]
    };
    scene.add(coreGroup);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(-5, 5, 10);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x2563eb, 5, 20);
    fillLight.position.set(5, -5, 5);
    scene.add(fillLight);

    const updateLayout = () => {
        if (!objectRef.current) return;
        const width = window.innerWidth;
        if (width < 768) {
            objectRef.current.group.position.set(0, 2.5, 0); 
            objectRef.current.group.scale.set(0.6, 0.6, 0.6);
        } else {
            objectRef.current.group.position.set(4.5, 0, 0);
            objectRef.current.group.scale.set(1, 1, 1);
        }
    };
    updateLayout();

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (objectRef.current) {
        const time = performance.now() * 0.001;
        const { group, inner, cage, shield, rings } = objectRef.current;

        inner.rotation.y = time * 0.5; inner.rotation.z = time * 0.2;
        cage.rotation.x = -time * 0.3; cage.rotation.y = time * 0.1;
        shield.rotation.z = time * 0.05;    
        rings[0].rotation.y = (Math.PI / 2) + time * 0.1;
        rings[1].rotation.x = (Math.PI / 2) + time * 0.1;

        const pulse = 1 + Math.sin(time * 2) * 0.05; 
        inner.scale.set(pulse, pulse, pulse);

        const width = window.innerWidth;
        const baseY = width < 768 ? 2.5 : 0; 
        group.position.y = baseY + Math.sin(time * 0.5) * 0.2;

        const targetRotX = mouseRef.current.y * 0.1;
        const targetRotY = mouseRef.current.x * 0.1;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
        group.rotation.y += (targetRotY - group.rotation.y) * 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleMouseMove = (e) => {
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        updateLayout(); 
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (container && renderer.domElement) {
           if(container.contains(renderer.domElement)){
                container.removeChild(renderer.domElement);
           }
        }
        renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none opacity-100" />;
};


const GlitchText = ({ children, className }) => (
    <div className={cn("relative font-mono", className)} data-text={children}>
        {children}
        <div className="absolute inset-0 glitch-top" aria-hidden="true">{children}</div>
        <div className="absolute inset-0 glitch-bottom" aria-hidden="true">{children}</div>
    </div>
);

const NavLink = ({ href, children }) => (
    <a href={href} className="relative py-1 group">
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
    </a>
);

const NexusNav = ({ onBack }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => { 
        document.body.style.overflow = isOpen ? 'hidden' : 'unset'; 
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);
    
    const navLinks = ['Stations', 'Experience', 'Membership'];

    return (
        <>
        <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center bg-gradient-to-b from-[#02040a]/90 via-[#02040a]/70 to-transparent backdrop-blur-sm md:backdrop-blur-none">
            <a href="#" className="text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-3 group relative z-[60]">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full transition-all duration-300 group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_#06b6d4]"></div>
                NEXUS
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-10 text-xs font-bold tracking-widest uppercase text-gray-400">
                <NavLink href="#stations">Stations</NavLink>
                <NavLink href="#experience">Experience</NavLink>
                <NavLink href="#access">Membership</NavLink>
            </div>

            <div className="flex items-center gap-4 relative z-[60]">
                <button onClick={onBack} className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase text-blue-500 hover:text-white transition-colors group">
                    <XCircle size={16} className="group-hover:rotate-90 transition-transform"/> Exit Preview
                </button>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="md:hidden text-white p-2 -mr-2 active:text-cyan-400 transition-colors"
                    aria-label="Open Menu"
                >
                    <Menu size={24} strokeWidth={1.5} />
                </button>
            </div>
        </nav>

        <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-[60] bg-[#02040a] md:hidden flex flex-col'
                        aria-hidden={!isOpen}
                    >
                        <div className="px-6 py-4 md:py-6 flex justify-between items-center border-b border-blue-900/30">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 hover:text-cyan-400 transition-colors group p-2 -ml-2"
                            >
                               <X size={16} className="group-hover:rotate-90 transition-transform"/> BACK
                            </button>
                            <div className="text-lg font-mono font-bold tracking-widest text-cyan-400 opacity-70">
                                MENU
                            </div>
                        </div>

                        <nav className="flex-1 flex flex-col justify-center items-center gap-8 px-8">
                            {navLinks.map((item, i) => (
                                <motion.a 
                                    key={item} 
                                    href={`#${item.toLowerCase()}`} 
                                    onClick={() => setIsOpen(false)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05, ease: "easeOut" }}
                                    className='text-4xl font-light text-white hover:text-cyan-400 tracking-widest uppercase'
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </nav>

                        <div className="px-8 py-8 flex flex-col gap-4 border-t border-blue-900/30">
                            <motion.button 
                                onClick={onBack} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: 0.4 }}
                                className="w-full text-center text-xs tracking-[0.2em] border border-cyan-500/50 px-6 py-3 rounded-lg text-cyan-400 hover:bg-cyan-500/10 active:bg-cyan-500/20 transition-all uppercase font-bold"
                            >
                                Exit Preview
                            </motion.button>
                            <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase text-center">Nexus Gaming — 2026</p>
                            <p className="text-xs text-gray-400 text-center">High-Performance Computing</p>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
                </>
            );
        };

const NexusHero = () => {
    return (
        <section className="relative min-h-screen flex flex-col justify-end md:justify-center px-6 md:px-12 z-10 pointer-events-auto pb-24 md:pb-0">
            <div className="max-w-xl pt-24 md:pt-0">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1.5 border border-blue-900/50 rounded-full mb-6 bg-[#02040a]/50">
                    <Zap size={14} className="text-cyan-400"/>
                    <span className="text-xs tracking-widest text-blue-400 uppercase font-semibold">Next Gen E-Sports Facility</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl sm:text-6xl md:text-8xl font-['Exo_2',_sans-serif] font-extrabold text-white leading-none tracking-tighter mb-6">
                    PERFORMANCE <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-400">UNLEASHED.</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed tracking-wide">
                    Welcome to Nexus. The premier high-performance computing facility designed for professional esports training, competitive dominance, and immersive restoration.
                </motion.p>
                 <motion.button initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="group mt-8 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-cyan-500 hover:shadow-[0_0_20px_#06b6d4] transition-all duration-300 text-sm">
                    Book a Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }} className="absolute bottom-10 right-6 md:right-12 flex items-center gap-3 text-xs text-blue-500 tracking-widest uppercase">
                <span>Scroll to Explore</span>
                <div className="w-8 h-px bg-blue-600"></div>
            </motion.div>
        </section>
    );
};

const NexusSpaces = () => {
    const specs = [
        { icon: <Cpu className="w-8 h-8"/>, label: "Hardware", value: "RTX 4090 / i9-14900K" }, 
        { icon: <Monitor className="w-8 h-8"/>, label: "Display", value: "360Hz QD-OLED" }, 
        { icon: <Zap className="w-8 h-8"/>, label: "Network", value: "10Gbps Fiber" }
    ];
    return (
        <section id="stations" className="py-24 md:py-32 px-6 md:px-12 bg-[#02040a] relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-start mb-16 gap-4">
                <h2 className="font-bold tracking-widest uppercase text-blue-500 md:mb-0">01 — The Stations</h2>
                <p className="text-white text-lg md:text-2xl font-light max-w-xl leading-normal">
                    Twenty-five individual terminals engineered for competitive dominance. Monolith towers, uncompressed fiber optics, and ergonomic silence.
                </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {specs.map((spec, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
                        className="bg-[#040811] p-8 rounded-lg border border-blue-900/20 hover:border-cyan-400/50 hover:-translate-y-2 transition-all duration-300 group"
                    >
                        <div className="text-cyan-400 mb-4">{spec.icon}</div>
                        <span className="block text-sm text-gray-500 group-hover:text-blue-400 transition-colors uppercase tracking-widest mb-2 font-semibold">{spec.label}</span>
                        <GlitchText className="text-xl md:text-2xl text-white font-bold tracking-wider group-hover:text-cyan-300 transition-colors">{spec.value}</GlitchText>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const NexusAmenities = () => (
    <section id="experience" className="py-24 md:py-32 px-6 md:px-12 bg-[#02040a] relative z-10 text-white">
         <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/3 lg:sticky top-32 h-fit">
                <h2 className="font-bold tracking-widest uppercase text-blue-500 mb-6">02 — The Experience</h2>
                <h3 className="text-3xl md:text-4xl font-['Exo_2',_sans-serif] font-bold mb-4">Live Within The Nexus.</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Designed for extended bootcamps and marathon sessions. Our facility provides essential amenities to sustain focus without leaving the server.
                </p>
            </motion.div>
            <div className="lg:w-2/3 space-y-16">
                {[
                    { title: "Recovery Pods", desc: "Acoustically isolated capsules for rapid recovery. Climate controlled. Absolute darkness on demand.", icon: <Moon /> },
                    { title: "Sustenance Bar", desc: "Curated nutrition bar. Specialty coffee, hydration, and clean energy focused supplements.", icon: <Coffee /> },
                    { title: "Strategy Rooms", desc: "Enclosed glass volumes for team synchronization. Separate airflow and dedicated subnet.", icon: <Wifi /> }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
                        className="group cursor-default flex items-start gap-6"
                    >
                        <div className="relative flex-shrink-0">
                           <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center text-cyan-400 border border-blue-900/30 group-hover:border-cyan-400/50 transition-colors">
                               {React.cloneElement(item.icon, { className: "w-6 h-6" })}
                           </div>
                           <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" style={{animationDuration: '3s'}}></div>
                        </div>
                        <div>
                           <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                           <p className="text-sm text-gray-500 max-w-md leading-relaxed group-hover:text-gray-400 transition-colors">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
         </div>
    </section>
);

const NexusGallery = () => {
    const galleryImages = [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2670&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2765&auto=format&fit=crop", 
    ];

    return (
        <section id="gallery" className="py-24 md:py-32 px-6 md:px-12 bg-[#02040a] relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-center font-bold tracking-widest uppercase text-blue-500 mb-4">GALLERY</h2>
                <h3 className="text-center text-3xl md:text-4xl font-['Exo_2',_sans-serif] font-bold mb-16">Moments from the Grid</h3>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {galleryImages.map((src, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 * index }}
                        className="aspect-square bg-black/20 rounded-lg overflow-hidden group border border-blue-900/10"
                    >
                        <img 
                            src={src} 
                            alt={`Nexus Gaming gallery image ${index + 1}`}
                            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0" 
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};


const NexusPricing = () => (
    <section id="access" className="py-24 md:py-32 px-6 md:px-12 bg-[#02040a] relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-center font-bold tracking-widest uppercase text-blue-500 mb-16">03 — MEMBERSHIP ACCESS</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto border-t border-blue-900/30 pt-16">
            {[
                { tier: "Day Pass", time: "1 Hour", price: "15.00" },
                { tier: "Pro Session", time: "5 Hours", price: "65.00" },
                { tier: "Bootcamp", time: "Overnight", price: "120.00" }
            ].map((plan, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
                    className="flex flex-col justify-between h-64 group bg-gradient-to-br from-blue-900/5 to-transparent p-6 rounded-lg border border-blue-900/20 hover:border-cyan-400/50 transition-all duration-300"
                >
                    <div>
                        <div className="text-sm uppercase tracking-widest text-gray-500 mb-2 group-hover:text-blue-400">{plan.tier}</div>
                        <div className="text-3xl text-white font-bold font-['Exo_2',_sans-serif]">{plan.time}</div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-2xl text-white font-mono">${plan.price}</div>
                        <button className="text-xs uppercase tracking-widest text-gray-400 border border-gray-800 rounded-full px-5 py-2 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300">
                            Select
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    </section>
);

const NexusFooter = () => (
    <footer className="py-12 px-6 md:px-12 bg-[#02040a] border-t border-blue-900/30 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end text-xs text-gray-600 uppercase tracking-widest">
        <div className="flex flex-col gap-2">
            <span className="text-gray-400 font-bold">NEXUS GAMING SYSTEMS</span>
            <span>© 2026. All Rights Reserved.</span>
        </div>
        <div className="flex gap-8 mt-8 md:mt-0">
            <a href="#" className="cursor-pointer hover:text-blue-500 transition-colors">Instagram</a>
            <a href="#" className="cursor-pointer hover:text-blue-500 transition-colors">Rules</a>
            <a href="#" className="cursor-pointer hover:text-blue-500 transition-colors">Contact</a>
        </div>
    </footer>
);

export default function Scene2({ onBack }) {
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        const link = document.createElement('link');
        link.href = "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700;800&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => { 
            document.documentElement.style.scrollBehavior = 'auto';
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div className="bg-[#02040a] min-h-screen text-white font-sans antialiased selection:bg-cyan-500 selection:text-black overflow-x-hidden">
            <style jsx global>{`
                .glitch-top {
                  animation: glitch-top 1s linear infinite;
                  clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
                }
                .glitch-bottom {
                  animation: glitch-bottom 1.5s linear infinite;
                  clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
                }
                @keyframes glitch-top {
                  2%, 64% { transform: translate(2px, -2px); }
                  4%, 60% { transform: translate(-2px, 2px); }
                  62% { transform: translate(13px, -1px) skew(-13deg); }
                }
                @keyframes glitch-bottom {
                  2%, 64% { transform: translate(-2px, 0); }
                  4%, 60% { transform: translate(-2px, 0); }
                  62% { transform: translate(-22px, 5px) skew(21deg); }
                }
            `}</style>
            <NexusStudioScene />
            <div className='relative z-10'>
                <NexusNav onBack={onBack} />
                <NexusHero />
                <div className="w-full px-6 md:px-12"><div className="w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div></div>
                <NexusSpaces />
                <div className="w-full px-6 md:px-12"><div className="w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div></div>
                <NexusAmenities />
                <div className="w-full px-6 md:px-12"><div className="w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div></div>
                <NexusGallery />
                <div className="w-full px-6 md:px-12"><div className="w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div></div>
                <NexusPricing />
                <NexusFooter />
            </div>
        </div>
    );
}
