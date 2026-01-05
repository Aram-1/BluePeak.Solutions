import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Menu, X, Layers, Ruler, PenTool, FileText, Compass, ArrowLeft } from 'lucide-react';

// --- UTILS ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* --- THREE.JS BLUEPRINT CANVAS --- */
const ArchiBlueprintCanvas = ({ active }) => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(active);
  const isAnimating = useRef(false);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    activeRef.current = active;
    if (active && !isAnimating.current && rendererRef.current) {
        animate();
    }
  }, [active]);

  const animate = () => {
    if (!activeRef.current) {
        isAnimating.current = false;
        return;
    }
    isAnimating.current = true;
    requestAnimationFrame(animate);

    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !groupRef.current) return;

    const time = performance.now() * 0.0005;
    const idleRotation = Math.sin(time) * 0.05;
    
    const targetX = mouseRef.current.y * 0.5;
    const targetY = mouseRef.current.x * 0.5;

    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetY + idleRotation - groupRef.current.rotation.y) * 0.05;

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#F9F9F7');
    scene.fog = new THREE.FogExp2('#F9F9F7', 0.04);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 12, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    const wallMaterial = new THREE.LineBasicMaterial({ color: 0x1a1a1a, linewidth: 1, transparent: true, opacity: 0.6 });
    const dimensionMaterial = new THREE.LineBasicMaterial({ color: 0x999999, linewidth: 1, transparent: true, opacity: 0.3 });
    const goldMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xD4AF37, roughness: 0.2, metalness: 0.9, emissive: 0xD4AF37, emissiveIntensity: 0.05
    });

    const createDimensionLine = (start, end) => {
        const points = [];
        const p1 = new THREE.Vector3(start.x, 0.1, start.z);
        const p2 = new THREE.Vector3(end.x, 0.1, end.z);
        points.push(p1, p2);
        const tickSize = 0.2;
        points.push(new THREE.Vector3(p1.x, 0.1, p1.z - tickSize), new THREE.Vector3(p1.x, 0.1, p1.z + tickSize));
        points.push(new THREE.Vector3(p2.x, 0.1, p2.z - tickSize), new THREE.Vector3(p2.x, 0.1, p2.z + tickSize));
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.LineSegments(geo, dimensionMaterial);
    };

    const createRoom = (x, z, w, d, isGold = false) => {
      const group = new THREE.Group();
      const h = isGold ? 2.5 : 1.5;
      const vPoints = [
        new THREE.Vector3(x,0,z), new THREE.Vector3(x,h,z),
        new THREE.Vector3(x+w,0,z), new THREE.Vector3(x+w,h,z),
        new THREE.Vector3(x+w,0,z+d), new THREE.Vector3(x+w,h,z+d),
        new THREE.Vector3(x,0,z+d), new THREE.Vector3(x,h,z+d),
        new THREE.Vector3(x,h,z), new THREE.Vector3(x+w,h,z),
        new THREE.Vector3(x+w,h,z), new THREE.Vector3(x+w,h,z+d),
        new THREE.Vector3(x+w,h,z+d), new THREE.Vector3(x,h,z+d),
        new THREE.Vector3(x,h,z+d), new THREE.Vector3(x,h,z)
      ];
      group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(vPoints), wallMaterial));

      if (isGold) {
        const massGeo = new THREE.BoxGeometry(1, h * 0.8, 1);
        const mass = new THREE.Mesh(massGeo, goldMaterial);
        mass.position.set(x + w/2, h * 0.4, z + d/2);
        mass.castShadow = true;
        group.add(mass);
      }
      return group;
    };

    const blueprintGroup = new THREE.Group();
    groupRef.current = blueprintGroup;
    
    blueprintGroup.add(createRoom(-4, -2, 6, 5)); 
    blueprintGroup.add(createRoom(2, -3, 3, 4));  
    blueprintGroup.add(createRoom(-1, 1, 2, 2, true));

    const grid = new THREE.GridHelper(30, 30, 0xdddddd, 0xeeeeee);
    grid.position.y = -0.05;
    
    scene.add(grid);
    scene.add(blueprintGroup);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    
    const sunLight = new THREE.DirectionalLight(0xfff0dd, 0.8);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    if(activeRef.current) animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !container) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    
    const onMouseMove = (e) => {
        if (!activeRef.current) return;
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouseRef.current = { x, y };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      activeRef.current = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if(container) {
          while (container.firstChild) {
              container.removeChild(container.firstChild);
          }
      }
    };
  }, []);

  return (
      <div 
        ref={mountRef} 
        className={`fixed inset-0 z-0 pointer-events-none mix-blend-multiply transition-opacity duration-1000 ease-in-out ${active ? 'opacity-60' : 'opacity-0'}`} 
      />
  );
};

const ArchiNavItem = ({ label, href, activeId, onClick }) => {
    const isActive = activeId === href.replace('#', '');
    return (
        <a 
            href={href} 
            onClick={onClick}
            className={cn(
                'relative group py-2 transition-colors duration-300',
                isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-[#D4AF37]'
            )}
        >
            {label}
            <span className={cn(
                'absolute bottom-0 left-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ease-out',
                isActive ? 'w-full' : 'w-0 group-hover:w-full'
            )}/>
        </a>
    );
};

const ArchiNavigation = ({ onBack }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
    }, { rootMargin: '-30% 0px -70% 0px' });
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
      document.body.style.overflow = isOpen ? 'hidden' : 'unset';
      return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  const navLinks = ['Thesis', 'Works', 'Atelier', 'Plans', 'Journal'];

  return (
    <>
        <nav 
            className={cn(
                'fixed top-0 w-full z-50 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center transition-all duration-500 border-b',
                scrolled ? 'bg-[#F9F9F7]/90 backdrop-blur-md shadow-sm border-neutral-200/50' : 'bg-transparent border-transparent'
            )}
        >
          <a href="#hero" className="flex flex-col z-50 cursor-pointer group">
            <span className="text-lg md:text-xl font-serif font-bold tracking-widest text-neutral-900">
              ARCHI <span className="text-[#D4AF37] group-hover:text-neutral-900 transition-colors">STRUCT</span>
            </span>
          </a>

          <div className="hidden md:flex gap-10 lg:gap-12 text-[11px] font-bold tracking-[0.2em] uppercase items-center">
            {navLinks.map((item) => (
              <ArchiNavItem key={item} label={item} href={`#${item.toLowerCase()}`} activeId={activeSection} />
            ))}
            <button onClick={onBack} className="ml-4 border border-neutral-300 px-6 py-2 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300">
              EXIT
            </button>
          </div>

          <div className="md:hidden z-50 flex items-center gap-4">
            <button onClick={onBack} className="text-[10px] font-bold tracking-widest border border-neutral-900 px-3 py-1.5 active:bg-neutral-100">
                EXIT
            </button>
            <button 
                onClick={() => setIsOpen(true)} 
                className="text-neutral-900 p-2 -mr-2 active:text-[#D4AF37] transition-colors"
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
                className='fixed inset-0 z-[60] bg-[#F9F9F7] md:hidden flex flex-col'
                aria-hidden={!isOpen}
            >
                <div className="px-6 py-4 md:py-6 flex justify-between items-center border-b border-neutral-100">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-xs font-bold tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors group p-2 -ml-2"
                    >
                       <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> BACK
                    </button>
                    <div className="text-lg font-serif font-bold tracking-widest text-neutral-900 opacity-50">
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
                            className='text-4xl font-serif text-neutral-900 hover:text-[#D4AF37] hover:italic'
                        >
                            {item}
                        </motion.a>
                    ))}
                </nav>

                <div className="p-8 text-center border-t border-neutral-100">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-2">Est. 2024 — Geneva</p>
                    <p className="text-xs text-neutral-400 font-serif italic">Precision in Void & Volume</p>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    </>
  );
};

const ArchiHero = () => (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center px-6 md:px-24 pt-24 md:pt-20 z-10">
      <div className="max-w-4xl pointer-events-auto">
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0}} className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="h-[1px] w-8 md:w-12 bg-[#D4AF37]"></div>
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase">
              Est. 2024 — Geneva
            </p>
        </motion.div>
        
        <motion.h1 initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="text-4xl sm:text-6xl md:text-8xl font-serif font-light text-neutral-900 leading-[1.1] mb-6 md:mb-8">
          Precision in <br /><span className="italic font-light text-neutral-800">Void & Volume</span>
        </motion.h1>
        
        <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}} className="max-w-md text-sm leading-7 text-neutral-500 font-light">
          A library of procedural architectural plans for the discerning individual. Bridging the gap between abstract thought and habitable reality.
        </motion.p>
      </div>
      
      <motion.a initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.6}} href="#thesis" className="absolute bottom-12 left-6 md:left-24 flex items-center gap-4 text-[10px] font-bold tracking-widest text-neutral-400 pointer-events-auto cursor-pointer group">
        <span className="group-hover:text-neutral-900 transition-colors">SCROLL TO DISCOVER</span>
        <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform text-[#D4AF37]" />
      </motion.a>
    </section>
);

const ArchiThesis = () => (
    <section id="thesis" className="bg-white py-20 md:py-32 px-6 md:px-24 z-10 relative border-b border-neutral-100">
        <div className="max-w-3xl mx-auto text-center">
            <Compass className="w-8 h-8 mx-auto text-[#D4AF37] mb-8 animate-pulse" style={{ animationDuration: '3s' }} />
            <h2 className="text-xs font-bold tracking-[0.4em] text-neutral-400 mb-6 md:mb-8 uppercase">The Thesis</h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-serif text-neutral-800 leading-relaxed mb-8 md:mb-12">
                "We do not sell buildings. We sell the intellectual framework for shelter."
            </p>
            <div className="text-sm text-neutral-500 leading-7 md:leading-8 font-light columns-1 md:columns-2 gap-12 text-left">
                <p className="mb-4">
                    In an era of mass-production, the blueprint remains the last bastion of true customization. Our studio creates schematic frameworks that are mathematically pure yet locally adaptable.
                </p>
                <p>
                    Each plan serves as a dialogue between the architect and the inhabitant. By providing the structural logic (the 'Struct') and leaving the material finish to you, we ensure that no two realizations of our work are ever identical.
                </p>
            </div>
        </div>
    </section>
);

const ArchiProjects = () => {
  const projectsData = [
    { id: '01', title: 'Villa Lago di Como', loc: 'Lombardy, Italy', price: '$12,500,000', image: '/assets/scene1/1.png' },
    { id: '02', title: 'Desert Mirage Estate', loc: 'Joshua Tree, California', price: '$4,850,000', image: '/assets/scene1/2.png' },
    { id: '03', title: 'The Cliff Sentinel', loc: 'North Coast, Iceland', price: '$9,200,000', image: '/assets/scene1/3.png' },
    { id: '04', title: 'Forest Glass Haven', loc: 'Byron Bay, Australia', price: '$6,750,000', image: '/assets/scene1/4.png' },
  ];

  return (
    <section id="works" className="relative bg-[#F9F9F7] py-20 md:py-32 px-6 md:px-24 z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-4 md:gap-0">
        <h2 className="text-3xl md:text-5xl font-serif text-neutral-900">Selected Works</h2>
        <div className="hidden md:block w-32 h-[1px] bg-neutral-300"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-16">
        {projectsData.map((p, i) => (
            <motion.div 
              key={i} 
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="aspect-[4/5] bg-neutral-200 mb-6 relative overflow-hidden rounded-lg">
                  <img 
                    src={p.image} 
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0 ease-out" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                <div className="absolute inset-0 border border-transparent group-hover:border-[10px] group-hover:border-white/20 transition-all duration-500 z-10 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
              </div>
              <div className="flex justify-between items-start border-t border-neutral-300 pt-4 group-hover:border-[#D4AF37] transition-colors duration-500">
                <div>
                  <span className="text-[10px] text-[#D4AF37] font-mono block mb-2 tracking-widest">NO. {p.id}</span>
                  <h3 className="text-lg md:text-xl font-serif text-neutral-900 group-hover:text-[#D4AF37] transition-colors">{p.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">{p.loc}</p>
                  <p className="text-xs font-bold text-neutral-900">{p.price}</p>
                </div>
              </div>
            </motion.div>
        ))}
      </div>
    </section>
  );
};

const ArchiServices = () => {
    const services = [
      { icon: <Ruler size={18} />, title: "Adaptation", desc: "Topographical adjustment of base schematics." },
      { icon: <Layers size={18} />, title: "Visualization", desc: "4K Renderings & AR Walkthroughs." },
      { icon: <PenTool size={18} />, title: "Curation", desc: "Interior FF&E schedules matched to the struct." }
    ];

    return (
      <section id="atelier" className="bg-white py-20 md:py-32 px-6 md:px-24 z-10 border-t border-neutral-100 relative">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <div className="lg:w-1/3 lg:sticky top-32">
            <h2 className="text-xs font-bold tracking-[0.4em] text-[#D4AF37] mb-6 md:mb-8 uppercase">The Atelier</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-6 leading-tight">Beyond the<br/>Blueprint.</h3>
            <p className="text-sm text-neutral-500 mb-8">Full-service architectural customization for acquired plans.</p>
          </div>
          <div className="w-full lg:w-2/3 grid grid-cols-1 gap-8 md:gap-12">
            {services.map((s, i) => (
              <div key={i} className="flex gap-6 group hover:bg-[#F9F9F7] p-6 md:p-8 transition-colors duration-500 border-l-2 border-transparent hover:border-[#D4AF37]">
                <div className="text-neutral-300 group-hover:text-[#D4AF37] transition-colors duration-300 mt-1 min-w-[20px]">{s.icon}</div>
                <div>
                    <h4 className="text-lg font-serif mb-2 group-hover:text-neutral-900 transition-colors">{s.title}</h4>
                    <p className="text-sm text-neutral-500 leading-6 max-w-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

const ArchiPlans = () => (
    <section id="plans" className="bg-[#1a1a1a] py-20 md:py-32 px-6 md:px-24 z-10 text-[#F9F9F7] relative">
        <div className="text-center mb-16 md:mb-24">
            <h2 className="text-xs font-bold tracking-[0.4em] text-[#D4AF37] mb-6 uppercase">Acquisition</h2>
            <h3 className="text-3xl md:text-5xl font-serif">The Mastersets</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-6xl mx-auto border-t md:border-t-0 border-l border-r border-b md:border border-white/10">
            {[
                { name: "Concept", price: "5k", desc: "Visualization only. Non-buildable." },
                { name: "Construct", price: "12k", desc: "Full DWG & MEP schematics. Buildable." },
                { name: "Exclusive", price: "Req", desc: "Full IP transfer & Global rights." }
            ].map((tier, i) => (
                <div key={i} className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/5 transition-all duration-500 group flex flex-col items-center text-center relative last:border-r-0">
                    <div className="text-[10px] text-[#D4AF37] tracking-widest uppercase mb-4 opacity-50 group-hover:opacity-100">{tier.name}</div>
                    <div className="text-4xl md:text-5xl font-serif mb-4">{tier.price}</div>
                    <p className="text-xs text-neutral-500 mb-8 group-hover:text-neutral-300 transition-colors">{tier.desc}</p>
                    <button className="mt-auto py-3 px-8 border border-white/20 text-[10px] font-bold tracking-widest hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] transition-all uppercase w-full md:w-auto">
                        Details
                    </button>
                </div>
            ))}
        </div>
    </section>
);

const ArchiJournal = () => (
    <section id="journal" className="bg-[#F9F9F7] py-20 md:py-32 px-6 md:px-24 z-10 relative">
         <div className="flex justify-between items-baseline mb-12 md:mb-16 border-b border-neutral-200 pb-4">
             <h2 className="text-2xl md:text-3xl font-serif text-neutral-900">Journal</h2>
             <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Latest Theory</span>
         </div>
         <div className="space-y-10 md:space-y-12">
            {[
                { title: "Silence as Material: Designing for Acoustics", cat: "Theory" },
                { title: "The Return of Brutalism in Luxury", cat: "Trend" },
                { title: "Light & Shadow: Circadian Rhythms", cat: "Science" }
            ].map((art, i) => (
                <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between cursor-pointer">
                    <h3 className="text-xl md:text-3xl font-serif text-neutral-400 group-hover:text-neutral-900 transition-colors duration-500 md:group-hover:translate-x-4 transform">
                        {art.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-3 md:mt-0 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">{art.cat}</span>
                        <FileText size={14} className="text-neutral-900" />
                    </div>
                </div>
            ))}
         </div>
    </section>
);

const ArchiFooter = () => (
    <footer className="bg-white px-6 md:px-24 py-12 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center text-[10px] text-neutral-400 tracking-widest gap-6 md:gap-0 z-10 relative">
        <div className="font-serif text-neutral-900 text-lg">AS.</div>
        <div className="flex gap-8 uppercase">
             <span className="hover:text-neutral-900 cursor-pointer transition-colors">Instagram</span>
             <span className="hover:text-neutral-900 cursor-pointer transition-colors">Legal</span>
             <span className="hover:text-neutral-900 cursor-pointer transition-colors">Contact</span>
        </div>
    </footer>
);

export default function Scene1({ onBack }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            setHeroVisible(entry.isIntersecting);
        });
    }, { threshold: 0.1 });

    const currentRef = heroSectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
        if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  return (
    <div className="bg-[#F9F9F7] text-neutral-900 min-h-screen selection:bg-[#D4AF37] selection:text-white font-sans antialiased overflow-x-hidden">
      <ArchiBlueprintCanvas active={heroVisible} />
      <div className="relative z-10">
        <ArchiNavigation onBack={onBack} />
        <main>
            <div ref={heroSectionRef}>
                <ArchiHero />
            </div>
            <ArchiThesis />
            <ArchiProjects />
            <ArchiServices />
            <ArchiPlans />
            <ArchiJournal />
        </main>
        <ArchiFooter />
      </div>
    </div>
  );
};

    