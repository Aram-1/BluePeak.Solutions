import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
  Package,
  Tag,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Globe,
  Store,
  Smartphone,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  CheckCircle,
  Mail,
  Image as ImageIcon,
  HelpCircle,
  LogOut,
  Menu as IconMenu2,
  X as IconX,
  LayoutDashboard,
  Settings
} from 'lucide-react';

// --- UTILS ---
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --- BRAND CONFIG ---
const BRAND_NAME = "NOVA ARCHIVE";

// --- MOCK DATA ---
const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Oversized Heavy Tee', category: 'Essentials', price: 45.00, stock: 120, salesVelocity: 'High', image: '👕' },
  { id: 'p2', name: 'Pleated Trousers', category: 'Bottoms', price: 189.50, stock: 12, salesVelocity: 'Critical', image: '👖' },
  { id: 'p3', name: 'Structured Wool Coat', category: 'Outerwear', price: 450.00, stock: 8, salesVelocity: 'Medium', image: '🧥' },
  { id: 'p4', name: 'Leather Derby Shoes', category: 'Footwear', price: 249.99, stock: 15, salesVelocity: 'Low', image: '👞' },
  { id: 'p5', name: 'Minimalist Tote', category: 'Accessories', price: 120.00, stock: 34, salesVelocity: 'High', image: '👜' },
  { id: 'p6', name: 'Cashmere Scarf', category: 'Accessories', price: 95.00, stock: 50, salesVelocity: 'Medium', image: '🧣' },
];

const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Elena Fisher', email: 'elena.f@example.com', spent: 1240.50, orders: 12, lastOrder: '2 days ago', status: 'VIP' },
  { id: 'c2', name: 'Marcus Holloway', email: 'marcus.h@dedsec.net', spent: 450.00, orders: 3, lastOrder: '5 hours ago', status: 'Active' },
  { id: 'c3', name: 'Lara Croft', email: 'l.croft@tombraider.com', spent: 8900.00, orders: 45, lastOrder: 'Just now', status: 'Wholesale' },
  { id: 'c4', name: 'Nathan Drake', email: 'nate@sicparvis.com', spent: 120.00, orders: 1, lastOrder: '1 month ago', status: 'Inactive' },
];

const INITIAL_ORDERS = [
  { id: '#ORD-9921', customer: 'Lara Croft', total: 450.00, date: 'Oct 24, 2025', status: 'Processing', items: 3 },
  { id: '#ORD-9920', customer: 'Marcus Holloway', total: 129.00, date: 'Oct 23, 2025', status: 'Shipped', items: 1 },
  { id: '#ORD-9919', customer: 'Elena Fisher', total: 85.50, date: 'Oct 23, 2025', status: 'Delivered', items: 2 },
  { id: '#ORD-9918', customer: 'Guest User', total: 249.99, date: 'Oct 22, 2025', status: 'Cancelled', items: 1 },
];

const LIVE_EVENTS = [
  { id: 1, type: 'sale', msg: 'Order #ORD-9921 placed', loc: 'London, UK', amount: 450.00, time: 'Just now' },
  { id: 2, type: 'view', msg: 'High traffic: Outerwear', loc: 'Berlin, DE', amount: null, time: '2m ago' },
  { id: 3, type: 'cart', msg: 'Cart abandoned', loc: 'New York, US', amount: null, time: '5m ago' },
];

// --- TOUR DATA (TRANSLATED) ---
const TOUR_STEPS = [
  {
    title: 'Welcome to NOVA ARCHIVE',
    content: 'This is a high-performance ERP simulator for e-commerce. Here you can manage products, customers, and sales in real-time.',
    positionClass: 'inset-0 m-auto h-fit' // Center
  },
  {
    title: 'Main Navigation',
    content: 'Use this sidebar to switch between the Overview Dashboard, Inventory Management, Customer CRM, and Sales Ledger.',
    positionClass: 'left-20 top-20' // Near sidebar
  },
  {
    title: 'Quick Actions',
    content: 'Try the "New Order" button to simulate a manual sale. You will see stock levels and revenue update instantly.',
    positionClass: 'right-10 top-24' // Near header buttons
  },
  {
    title: 'Live Activity',
    content: 'This panel displays real-time system events such as purchases, abandoned carts, and traffic spikes.',
    positionClass: 'bottom-20 right-10' // Near feed
  }
];

// --- SIDEBAR CONTEXT ---
const SidebarContext = createContext(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const SidebarProvider = ({ children, open: openProp, setOpen: setOpenProp, animate = true }) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-[#0A0C10] border-r border-white/5 w-[250px] flex-shrink-0 z-50",
        className
      )}
      animate={{
        width: animate ? (open ? "250px" : "80px") : "250px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-[#0A0C10] border-b border-white/5 w-full sticky top-0 z-50"
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
         <div className="h-6 w-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs">N</div>
         <span className="text-white font-bold tracking-widest text-sm">NOVA</span>
      </div>
      <div className="flex justify-end z-20">
        <IconMenu2
          className="text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-[#050608] p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            <div className="flex flex-col gap-4 mt-8">
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarLink = ({ link, className, onClick, ...props }) => {
  const { open, animate } = useSidebar();
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-3 px-2 rounded-lg hover:bg-white/5 transition-colors w-full text-left",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </button>
  );
};

const Logo = () => {
  return (
    <a href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-6 w-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs shrink-0">N</div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-white whitespace-pre tracking-widest"
      >
        NOVA ARCHIVE
      </motion.span>
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-6 w-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs shrink-0">N</div>
    </a>
  );
};

// --- TOUR TOOLTIP ---
const TourTooltip = ({ title, content, onNext, onPrev, step, totalSteps, onClose, positionClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`absolute z-[60] w-80 bg-indigo-600 text-white p-5 rounded-xl shadow-2xl border border-indigo-400/30 ${positionClass}`}
  >
    <div className="flex justify-between items-start mb-3">
       <h4 className="font-bold text-base flex items-center gap-2">
         <HelpCircle className="w-4 h-4 text-indigo-200" /> {title}
       </h4>
       <button onClick={onClose}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
    </div>
    <p className="text-sm text-indigo-100 mb-5 leading-relaxed font-light">{content}</p>
    <div className="flex justify-between items-center border-t border-indigo-500/30 pt-3">
       <span className="text-xs font-mono opacity-50">STEP {step + 1} / {totalSteps}</span>
       <div className="flex gap-2">
          {step > 0 && (
            <button onClick={onPrev} className="text-xs font-bold px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors">
              Back
            </button>
          )}
          <button 
            onClick={onNext} 
            className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-lg"
          >
             {step === totalSteps - 1 ? 'Finish' : 'Next'}
          </button>
       </div>
    </div>
    {positionClass !== 'inset-0 m-auto h-fit' && (
      <div className="absolute w-4 h-4 bg-indigo-600 rotate-45 -z-10 bottom-[-8px] left-1/2 -translate-x-1/2" />
    )}
  </motion.div>
);

const StatBox = ({ label, value, trend, icon: Icon, color }) => (
  <div className="bg-[#111318] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-opacity-10 ${color.bg} ${color.text}`}>
        <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
      </div>
      <span className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <div>
      <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{value}</h3>
      <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

const FunnelStep = ({ label, count, color, percent }) => (
  <div className="flex items-center gap-2 md:gap-4 group cursor-pointer">
    <div className="w-16 md:w-24 text-right shrink-0">
      <div className="text-white font-bold tabular-nums text-xs md:text-base">{count}</div>
      <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
    <div className="flex-1 h-10 md:h-12 bg-[#111318] rounded-lg border border-white/5 relative overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full opacity-20 group-hover:opacity-30 transition-opacity ${color}`}
      />
      <div className={`absolute left-0 top-0 h-full w-1 ${color}`} />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Processing': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Shipped': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Cancelled': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'VIP': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Inactive': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    'Wholesale': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[status] || styles['Active']}`}>
      {status}
    </span>
  );
};

// --- MODAL COMPONENT ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111318] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#161920]">
          <h3 className="text-white font-bold tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const VortexRetail = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [open, setOpen] = useState(false);
  
  // Data States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [feed, setFeed] = useState(LIVE_EVENTS);
  const [salesTotal, setSalesTotal] = useState(14250.50);
  
  // Modal States
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [isSaleModalOpen, setSaleModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Tour States
  const [tourStep, setTourStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(true);

  // Form States
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', stock: '', image: '' });
  const [saleForm, setSaleForm] = useState({ productId: '', quantity: 1, location: 'Manual Entry' });

  // Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setSalesTotal(prev => prev + Math.floor(Math.random() * 200) + 50);
        
        const newEvent = {
          id: Date.now(),
          type: 'sale',
          msg: `Order #ORD-${Math.floor(Math.random() * 1000) + 9000} placed`,
          loc: 'Online Store',
          amount: Math.floor(Math.random() * 200) + 50,
          time: 'Just now'
        };
        setFeed(prev => [newEvent, ...prev.slice(0, 4)]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleNextStep = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      setIsTourActive(false);
    }
  };

  const handlePrevStep = () => {
    if (tourStep > 0) setTourStep(prev => prev - 1);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: '', price: '', stock: '', image: '📦' });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const imgUrl = productForm.image || '📦';
    
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...productForm, image: imgUrl, id: p.id, price: Number(productForm.price), stock: Number(productForm.stock) } : p));
    } else {
      const newProduct = {
        ...productForm,
        image: imgUrl,
        id: `p${Date.now()}`,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        salesVelocity: 'New'
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setProductModalOpen(false);
  };

  const handleAddSale = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === saleForm.productId);
    if (!product) return;

    const totalAmount = product.price * saleForm.quantity;

    setSalesTotal(prev => prev + totalAmount);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: Math.max(0, p.stock - saleForm.quantity) } : p));
    
    const newOrder = {
        id: `#ORD-${Math.floor(Math.random() * 1000) + 9000}`,
        customer: 'Manual Entry',
        total: totalAmount,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Processing',
        items: saleForm.quantity
    };
    setOrders(prev => [newOrder, ...prev]);

    const newEvent = {
      id: Date.now(),
      type: 'sale',
      msg: `Manual Sale: ${product.name}`,
      loc: saleForm.location,
      amount: totalAmount,
      time: 'Just now'
    };
    setFeed(prev => [newEvent, ...prev.slice(0, 4)]);
    setSaleModalOpen(false);
  };

  const links = [
    { label: "Dashboard", id: 'dashboard', icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" /> },
    { label: "Inventory", id: 'products', icon: <Package className="h-5 w-5 flex-shrink-0" /> },
    { label: "Customers", id: 'customers', icon: <Users className="h-5 w-5 flex-shrink-0" /> },
    { label: "Sales Ledger", id: 'orders', icon: <ShoppingBag className="h-5 w-5 flex-shrink-0" /> },
  ];

  return (
    <div className="w-full h-screen bg-[#050608] text-gray-300 font-sans flex flex-col md:flex-row overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 relative">
      
      {/* --- TOUR OVERLAY --- */}
      <AnimatePresence>
        {isTourActive && (
          <>
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/40 z-[50] backdrop-blur-[2px]"
             />
             
             <TourTooltip 
                key={tourStep}
                {...TOUR_STEPS[tourStep]}
                step={tourStep}
                totalSteps={TOUR_STEPS.length}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                onClose={() => setIsTourActive(false)}
                positionClass={TOUR_STEPS[tourStep].positionClass}
             />
          </>
        )}
      </AnimatePresence>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isProductModalOpen && (
          <Modal isOpen={isProductModalOpen} onClose={() => setProductModalOpen(false)} title={editingProduct ? "Edit Item" : "New Arrival"}>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-lg p-2 text-white focus:border-indigo-500 outline-none" placeholder="e.g. Silk Shirt" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                   <input required type="text" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-lg p-2 text-white focus:border-indigo-500 outline-none" placeholder="Tops" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Emoji Icon</label>
                   <input type="text" maxLength="2" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-lg p-2 text-center text-2xl text-white focus:border-indigo-500 outline-none" placeholder="📦" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                   <input required type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-lg p-2 text-white focus:border-indigo-500 outline-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                   <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-lg p-2 text-white focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors">
                <Save className="w-4 h-4" /> Save Item
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSaleModalOpen && (
          <Modal isOpen={isSaleModalOpen} onClose={() => setSaleModalOpen(false)} title="Manual Order Entry">
             <form onSubmit={handleAddSale} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Item</label>
                 <select required value={saleForm.productId} onChange={e => setSaleForm({...saleForm, productId: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-lg p-2 text-white focus:border-emerald-500 outline-none">
                    <option value="">-- Choose --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price}) - Stock: {p.stock}</option>
                    ))}
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                    <input required type="number" min="1" value={saleForm.quantity} onChange={e => setSaleForm({...saleForm, quantity: Number(e.target.value)})} className="w-full bg-[#0A0C10] border border-white/10 rounded-lg p-2 text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                    <input type="text" value={saleForm.location} onChange={e => setSaleForm({...saleForm, location: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-lg p-2 text-white focus:border-emerald-500 outline-none" />
                  </div>
               </div>
               <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors">
                  <CheckCircle className="w-4 h-4" /> Process Order
               </button>
             </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* --- NEW SIDEBAR IMPLEMENTATION --- */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="hidden md:block">
              {open ? <Logo /> : <LogoIcon />}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  onClick={() => { setActiveTab(link.id); setOpen(false); }}
                  className={activeTab === link.id ? "bg-white/10 text-white" : ""}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Exit Preview",
                href: "#",
                icon: <LogOut className="h-5 w-5 flex-shrink-0 text-red-400" />,
              }}
              onClick={onExit}
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header for Desktop */}
        <div className="hidden md:flex h-16 border-b border-white/5 items-center justify-between px-8 bg-[#0A0C10]">
           <div className="flex items-center gap-2 text-xs text-gray-500">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               Live System • {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setSaleModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> New Order
              </button>
              <div className="flex items-center px-3 py-1.5 bg-[#111318] border border-white/10 rounded-lg text-sm text-gray-400 gap-2">
                <Globe className="w-4 h-4 text-white" />
                Store: <strong>Global</strong>
              </div>
           </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 custom-scrollbar bg-[#050608]">
          
          {/* --- DASHBOARD VIEW --- */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* STATS ROW */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                 <StatBox 
                    label="Revenue (24h)" 
                    value={`$${salesTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                    trend={12.5} 
                    icon={CreditCard} 
                    color={{ bg: 'bg-white', text: 'text-black' }} 
                 />
                 <StatBox 
                    label="Active Sessions" 
                    value="1,240" 
                    trend={-2.4} 
                    icon={Users} 
                    color={{ bg: 'bg-blue-500', text: 'text-blue-500' }} 
                 />
                 <StatBox 
                    label="Conversion" 
                    value="3.2%" 
                    trend={0.8} 
                    icon={TrendingUp} 
                    color={{ bg: 'bg-indigo-500', text: 'text-indigo-500' }} 
                 />
                 <StatBox 
                    label="Avg. Ticket" 
                    value="$85.20" 
                    trend={5.1} 
                    icon={ShoppingBag} 
                    color={{ bg: 'bg-orange-500', text: 'text-orange-500' }} 
                 />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                 {/* LEFT: Top Products Summary */}
                 <div className="lg:col-span-2 bg-[#0A0C10] rounded-2xl border border-white/5 flex flex-col overflow-hidden">
                    <div className="p-3 sm:p-4 md:p-5 border-b border-white/5 flex justify-between items-center bg-[#111318]">
                       <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                          <Package className="w-4 h-4 text-white" /> Top Selling Collection
                       </h3>
                       <button onClick={() => setActiveTab('products')} className="text-xs text-gray-500 hover:text-white transition-colors">View All</button>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-[#111318] text-xs uppercase text-gray-500 border-b border-white/5">
                             <tr>
                                <th className="px-3 sm:px-4 md:px-6 py-2 md:py-3 font-medium">Item</th>
                                <th className="px-3 sm:px-4 md:px-6 py-2 md:py-3 font-medium">Price</th>
                                <th className="px-3 sm:px-4 md:px-6 py-2 md:py-3 font-medium text-right">Velocity</th>
                             </tr>
                          </thead>
                          <tbody>
                            {products.slice(0, 4).map((p) => (
                               <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                  <td className="px-3 sm:px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 md:gap-3">
                                      <span className="text-lg md:text-2xl">{p.image}</span>
                                      <span className="text-xs md:text-sm font-medium text-white line-clamp-1">{p.name}</span>
                                  </td>
                                  <td className="px-3 sm:px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm text-gray-400">${p.price}</td>
                                  <td className="px-3 sm:px-4 md:px-6 py-2 md:py-3 text-right">
                                    <span className="text-[9px] md:text-[10px] bg-white/10 text-white px-2 py-0.5 rounded">{p.salesVelocity}</span>
                                  </td>
                               </tr>
                            ))}
                          </tbody>
                       </table>
                    </div>
                 </div>

                 {/* RIGHT: Live Feed & Funnel */}
                 <div className="space-y-4 md:space-y-6 relative">
                    <div className="bg-[#0A0C10] rounded-2xl border border-white/5 flex flex-col overflow-hidden h-auto md:h-[300px]">
                       <div className="p-3 sm:p-4 border-b border-white/5 bg-[#111318] flex justify-between items-center">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                             <Zap className="w-3 h-3 text-yellow-500" /> Live Feed
                          </h3>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       </div>
                       <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 md:space-y-4">
                          <AnimatePresence initial={false}>
                             {feed.map((event) => (
                                <motion.div 
                                   key={event.id}
                                   layout
                                   initial={{ opacity: 0, x: 20 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   className="flex gap-2 md:gap-3 items-start"
                                >
                                   <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                                      event.type === 'sale' ? 'bg-emerald-500' : 
                                      event.type === 'cart' ? 'bg-orange-500' : 'bg-blue-500'
                                   }`} />
                                   <div className="min-w-0">
                                      <p className="text-xs md:text-sm text-gray-300 leading-tight break-words">
                                         <span className="text-white font-medium">{event.msg}</span>
                                         {event.amount && <span className="text-emerald-400 ml-1 font-mono">+${event.amount.toFixed(2)}</span>}
                                      </p>
                                      <p className="text-[9px] md:text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                         {event.loc} • {event.time}
                                      </p>
                                   </div>
                                </motion.div>
                             ))}
                          </AnimatePresence>
                       </div>
                    </div>
                    <div className="bg-[#0A0C10] rounded-2xl border border-white/5 p-3 sm:p-4 md:p-5">
                       <h3 className="text-sm md:text-base text-white font-bold mb-4 md:mb-6 flex items-center gap-2">
                          <Filter className="w-4 h-4 text-orange-500" /> Conversion
                       </h3>
                       <div className="space-y-3 md:space-y-4 relative">
                          <div className="absolute left-[88px] top-4 bottom-4 w-0.5 bg-gray-800 -z-10" />
                          <FunnelStep label="Visitors" count="1,240" percent={100} color="bg-blue-500" />
                          <FunnelStep label="Add to Cart" count="128" percent={30} color="bg-orange-500" />
                          <FunnelStep label="Purchased" count="42" percent={12} color="bg-emerald-500" />
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* --- PRODUCTS VIEW --- */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0A0C10] rounded-2xl border border-white/5 flex flex-col overflow-hidden min-h-[400px] md:min-h-[600px]">
                <div className="p-3 sm:p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#111318]">
                   <div className="min-w-0">
                       <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                          Inventory
                       </h3>
                       <p className="text-xs text-gray-500 mt-1">Manage stock, prices, and collections.</p>
                   </div>
                   <button 
                     onClick={handleOpenAddProduct}
                     className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs md:text-sm font-bold transition-colors shrink-0"
                   >
                      <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Item</span>
                   </button>
                </div>
                
                <div className="flex-1 overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-[#111318] text-xs uppercase text-gray-500 border-b border-white/5">
                         <tr>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Product</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Category</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Price</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Stock Level</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody>
                         <AnimatePresence>
                            {products.map((p) => (
                               <motion.tr 
                                  key={p.id}
                                  layout
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                               >
                                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                                     <div className="flex items-center gap-2 md:gap-4 min-w-0">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-[#151820] flex items-center justify-center text-xl md:text-2xl border border-white/5 shrink-0">
                                           {p.image}
                                        </div>
                                        <div className="min-w-0">
                                           <div className="text-xs md:text-base font-bold text-white truncate">{p.name}</div>
                                           <div className="text-[10px] md:text-xs text-gray-500 truncate">ID: {p.id}</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                                     <span className="px-2 py-1 bg-white/5 rounded text-[10px] md:text-xs text-gray-400 border border-white/5">{p.category}</span>
                                  </td>
                                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-300 font-mono">${Number(p.price).toFixed(2)}</td>
                                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                                     <div className="w-full max-w-[120px] md:max-w-[140px]">
                                        <div className="flex justify-between text-[10px] md:text-xs mb-1.5">
                                           <span className={p.stock < 10 ? 'text-rose-400 font-bold' : 'text-gray-400'}>{p.stock}</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                           <motion.div 
                                              className={`h-full rounded-full ${p.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                              initial={{ width: 0 }}
                                              animate={{ width: `${Math.min(100, (p.stock / 150) * 100)}%` }}
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-right">
                                     <div className="flex justify-end gap-1 md:gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEditProduct(p)} className="p-2 hover:bg-indigo-500/20 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors">
                                           <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-rose-500/20 rounded-lg text-gray-400 hover:text-rose-400 transition-colors">
                                           <Trash2 className="w-4 h-4" />
                                        </button>
                                     </div>
                                  </td>
                               </motion.tr>
                            ))}
                         </AnimatePresence>
                      </tbody>
                   </table>
                </div>
            </motion.div>
          )}

          {/* --- CUSTOMERS VIEW --- */}
          {activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0A0C10] rounded-2xl border border-white/5 flex flex-col overflow-hidden min-h-[400px] md:min-h-[600px]">
                <div className="p-3 sm:p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#111318]">
                   <div className="min-w-0">
                       <h3 className="text-lg md:text-xl font-bold text-white">Clientèle</h3>
                       <p className="text-xs text-gray-500 mt-1">CRM Database & History.</p>
                   </div>
                   <div className="flex gap-2">
                       <button className="px-2 sm:px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">Export CSV</button>
                   </div>
                </div>
                <div className="flex-1 overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-[#111318] text-xs uppercase text-gray-500 border-b border-white/5">
                         <tr>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Customer</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium hidden sm:table-cell">Contact</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Status</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium text-right">Spent</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium text-right hidden md:table-cell">Last Order</th>
                         </tr>
                      </thead>
                      <tbody>
                        {customers.map((c) => (
                           <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                                 <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] md:text-xs font-bold text-white border border-white/10 shrink-0">
                                        {c.name.split(' ').map(n=>n[0]).join('')}
                                    </div>
                                    <div className="min-w-0">
                                       <div className="text-xs md:text-base font-bold text-white truncate">{c.name}</div>
                                       <div className="text-[10px] md:text-xs text-gray-500 truncate">ID: {c.id}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                                 <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 truncate">
                                    <Mail className="w-3 h-3 shrink-0" /> <span className="truncate text-[10px] md:text-sm">{c.email}</span>
                                 </div>
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                                 <StatusBadge status={c.status} />
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-right font-mono text-xs md:text-base text-white">
                                 ${c.spent.toLocaleString()}
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm text-gray-500 hidden md:table-cell">
                                 {c.lastOrder}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
            </motion.div>
          )}

          {/* --- ORDERS VIEW --- */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0A0C10] rounded-2xl border border-white/5 flex flex-col overflow-hidden min-h-[400px] md:min-h-[600px]">
                <div className="p-3 sm:p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#111318]">
                   <div className="min-w-0">
                       <h3 className="text-lg md:text-xl font-bold text-white">Sales Ledger</h3>
                       <p className="text-xs text-gray-500 mt-1">Global transaction history.</p>
                   </div>
                   <div className="flex gap-2">
                       <button className="p-2 hover:bg-white/5 rounded text-gray-400"><Filter className="w-4 h-4" /></button>
                   </div>
                </div>
                <div className="flex-1 overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-[#111318] text-xs uppercase text-gray-500 border-b border-white/5">
                         <tr>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Order ID</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Customer</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium hidden sm:table-cell">Date</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium">Status</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium text-right">Total</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium text-right hidden md:table-cell">Items</th>
                         </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                           <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                                 <span className="font-mono text-indigo-400 font-bold text-xs md:text-base">{o.id}</span>
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-white font-medium truncate">
                                 {o.customer}
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                                 {o.date}
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                                 <StatusBadge status={o.status} />
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-right font-mono text-xs md:text-base text-white">
                                 ${o.total.toFixed(2)}
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm text-gray-500 hidden md:table-cell">
                                 {o.items}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VortexRetail;
