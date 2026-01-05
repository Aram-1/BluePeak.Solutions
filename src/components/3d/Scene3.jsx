import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Coffee, ShoppingBag, Book, HardHat, Hammer } from 'lucide-react';

// --- UTILS ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --- PURE BREW HOME PAGE ---
const HomePage = ({ setActivePage }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#fbbf2410_0%,transparent_100%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="mb-8 relative will-change-transform"
        >
            <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <HardHat className="w-12 h-12 text-yellow-500" />
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-yellow-500/50" style={{ willChange: "transform" }} />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-4 tracking-tight">Pure Brew</h1>
        
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 mb-8">
            <Hammer className="w-4 h-4" />
            <span className="text-sm font-mono font-bold uppercase tracking-wider">Under Construction</span>
        </div>

        <p className="text-amber-800 text-center max-w-lg text-lg leading-relaxed mb-12">
            We are coding the webpage, you can come back in the future and you will see how amazing it will be :)
        </p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="w-64 h-1 bg-amber-200 rounded-full overflow-hidden">
            <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="h-full bg-amber-500 will-change-transform" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ShopPage = ({ setActivePage }) => {
  const products = [
    { id: 1, name: 'Ethiopian Yirgacheffe', price: '$18', image: '/assets/scene3/image1.webp' },
    { id: 2, name: 'Colombian Geisha', price: '$24', image: '/assets/scene3/image2.webp' },
    { id: 3, name: 'Japanese Blend', price: '$22', image: '/assets/scene3/image3.webp' },
    { id: 4, name: 'Brazilian Santos', price: '$16', image: '/assets/scene3/image1.webp' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2 text-amber-700 font-semibold mb-12 hover:text-amber-900"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </motion.button>

        <h1 className="text-5xl font-bold text-amber-900 mb-12">Our Collection</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-amber-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-amber-900 text-lg mb-2">{product.name}</h3>
              <p className="text-amber-700 text-2xl font-semibold">{product.price}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full bg-amber-700 text-white py-2 rounded-lg font-semibold hover:bg-amber-800"
              >
                Add to Cart
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- PURE BREW STORY PAGE ---
const StoryPage = ({ setActivePage }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2 text-amber-700 font-semibold mb-12 hover:text-amber-900"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <h1 className="text-5xl font-bold text-amber-900">Our Story</h1>
          
          <div className="space-y-4 text-amber-800 text-lg leading-relaxed">
            <p>
              Founded in 2015, Pure Brew began as a passion project between two coffee enthusiasts who believed that every cup of coffee deserved to be extraordinary.
            </p>
            <p>
              We source the finest beans from sustainable farms across the globe, ensuring that every harvest is ethical and environmentally responsible.
            </p>
            <p>
              Each blend is carefully crafted by our master roasters, who bring years of expertise to create the perfect balance of flavor, aroma, and body.
            </p>
            <p>
              Today, Pure Brew has become a destination for coffee lovers everywhere, known for our commitment to quality, sustainability, and exceptional taste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: '🌍', title: 'Sustainable', desc: 'Ethically sourced from global farms' },
              { icon: '👨‍🍳', title: 'Artisanal', desc: 'Crafted by master roasters' },
              { icon: '☕', title: 'Premium', desc: 'Only the finest quality beans' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-amber-900 mb-2">{feature.title}</h3>
                <p className="text-amber-700 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- MAIN SCENE 3 COMPONENT ---
export default function Scene3({ onBack }) {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="min-h-screen bg-amber-50 relative">
      {/* Navigation Header */}
      <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-700" />
            <span className="font-bold text-amber-900 text-lg">PURE BREW</span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Portfolio
          </motion.button>
        </div>
      </div>

      {/* Page Content */}
      <div className="pt-16">
        <AnimatePresence mode="wait">
          {activePage === 'home' && <HomePage key="home" setActivePage={setActivePage} />}
          {activePage === 'shop' && <ShopPage key="shop" setActivePage={setActivePage} />}
          {activePage === 'story' && <StoryPage key="story" setActivePage={setActivePage} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

    