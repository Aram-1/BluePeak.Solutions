import React, { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  List,
  Clock,
  AlertTriangle,
  Plus,
  Zap,
  Cpu,
  LogOut,
  X,
  Target,
  Trash2,
  HelpCircle,
  Calendar,
  Filter,
  Menu,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';

const APP_NAME = "VELOCITY";

const TEAM_MEMBERS = [
  { id: 1, name: "Alex K.", role: "Lead Dev", avatar: "👨🏻‍💻" },
  { id: 2, name: "Sarah J.", role: "UI Designer", avatar: "👩🏼‍🎨" },
  { id: 3, name: "Mike T.", role: "Backend", avatar: "🧔🏾‍♂️" },
  { id: 4, name: "AI Agent", role: "Bot", avatar: "🤖" },
];

const INITIAL_TASKS = [
  { id: 't1', title: "Implement Auth0 Integration", priority: "High", assignee: 1, status: "todo", points: 5, aiRisk: "Low", startDay: 1, duration: 3 },
  { id: 't2', title: "Design System V2", priority: "Medium", assignee: 2, status: "in-progress", points: 8, aiRisk: "Medium", startDay: 2, duration: 5 },
  { id: 't3', title: "Fix API Gateway Latency", priority: "Critical", assignee: 3, status: "review", points: 3, aiRisk: "High", startDay: 4, duration: 2 },
  { id: 't4', title: "Update Landing Page Copy", priority: "Low", assignee: 2, status: "done", points: 2, aiRisk: "Low", startDay: 1, duration: 2 },
  { id: 't5', title: "Optimize Database Queries", priority: "High", assignee: 3, status: "todo", points: 13, aiRisk: "High", startDay: 5, duration: 4 },
];

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-zinc-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-violet-500' },
  { id: 'review', title: 'Review', color: 'bg-amber-500' },
  { id: 'done', title: 'Done', color: 'bg-emerald-500' },
];

// --- Components ---

const TaskCard = forwardRef(({ task, onEdit, onDelete }, ref) => (
  <motion.div 
    ref={ref}
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    onClick={() => onEdit(task)}
    className="bg-[#18181b] p-3 md:p-4 rounded-lg md:rounded-xl border border-white/5 hover:border-violet-500/50 group cursor-pointer relative overflow-hidden transition-all hover:shadow-lg hover:shadow-violet-500/10 mb-2 md:mb-3 touch-manipulation"
  >
    <div className="flex justify-between items-start mb-2 gap-2">
       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
         task.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
         task.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
         task.priority === 'Medium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
         'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30'
       }`}>
         {task.priority}
       </span>
       <button 
         onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
         className="text-zinc-600 hover:text-red-400 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1"
       >
         <Trash2 className="w-3.5 h-3.5" />
       </button>
    </div>
    
    <h4 className="text-sm font-medium text-zinc-200 mb-3 group-hover:text-white transition-colors line-clamp-2 leading-snug">{task.title}</h4>
    
    <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
       <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs shadow-sm flex-shrink-0">
             {TEAM_MEMBERS.find(m => m.id === task.assignee)?.avatar || "?"}
          </div>
          <span className="text-xs text-zinc-500 font-mono">{task.points}pts</span>
       </div>
       
       {task.aiRisk === 'High' && task.status !== 'done' && (
         <div className="flex items-center gap-1 text-[10px] text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10 flex-shrink-0" title="AI Risk">
            <AlertTriangle className="w-3 h-3" /> Risk
         </div>
       )}
    </div>
  </motion.div>
));

TaskCard.displayName = "TaskCard";

const BacklogRow = forwardRef(({ task, onEdit, onDelete }, ref) => (
  <motion.tr 
    ref={ref}
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors cursor-pointer text-sm"
    onClick={() => onEdit(task)}
  >
    <td className="px-4 py-4 max-w-[200px] sm:max-w-none">
       <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${COLUMNS.find(c => c.id === task.status)?.color}`} />
          <span className="text-zinc-200 font-medium truncate block">{task.title}</span>
       </div>
    </td>
    <td className="px-4 py-4 hidden sm:table-cell">
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${
          task.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
          task.priority === 'High' ? 'bg-amber-500/10 text-amber-400' :
          task.priority === 'Medium' ? 'bg-blue-500/10 text-blue-400' :
          'bg-zinc-700/50 text-zinc-400'
        }`}>
          {task.priority}
        </span>
    </td>
    <td className="px-4 py-4 hidden md:table-cell">
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                {TEAM_MEMBERS.find(m => m.id === task.assignee)?.avatar}
            </div>
            <span className="text-xs text-zinc-400">{TEAM_MEMBERS.find(m => m.id === task.assignee)?.name}</span>
        </div>
    </td>
    <td className="px-4 py-4">
        <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded whitespace-nowrap">{task.points} pt</span>
    </td>
    <td className="px-4 py-4 text-right">
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </td>
  </motion.tr>
));

BacklogRow.displayName = "BacklogRow";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#18181b] z-10">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App({ onExit }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('board');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', priority: 'Medium', assignee: 1, points: 3, status: 'todo' });
  const [tourStep, setTourStep] = useState(0);

  // Simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
        if (Math.random() > 0.9) {
            const randomTaskIndex = Math.floor(Math.random() * tasks.length);
            const task = tasks[randomTaskIndex];
            if (task && task.status !== 'done') {
               const statuses = ['todo', 'in-progress', 'review', 'done'];
               const currentIdx = statuses.indexOf(task.status);
               const nextStatus = statuses[currentIdx + 1] || 'done';
               setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
            }
        }
    }, 8000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
       const optimized = [...tasks].sort((a, b) => b.points - a.points).map(t => ({
         ...t,
         aiRisk: Math.random() > 0.8 ? 'High' : 'Low' 
       }));
       setTasks(optimized);
       setIsOptimizing(false);
    }, 1500);
  };

  const handleOpenAdd = (status = 'todo') => {
      setEditMode(false);
      setTaskForm({ title: '', priority: 'Medium', assignee: 1, points: 3, status });
      setModalOpen(true);
      setSidebarOpen(false);
  };

  const handleOpenEdit = (task) => {
      setEditMode(true);
      setCurrentTask(task);
      setTaskForm(task);
      setModalOpen(true);
  };

  const handleSaveTask = (e) => {
      e.preventDefault();
      if (isEditMode && currentTask) {
          setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...taskForm, id: t.id, startDay: t.startDay, duration: t.duration } : t));
      } else {
          const newTask = {
              ...taskForm,
              id: `t${Date.now()}`,
              aiRisk: 'Low',
              startDay: Math.floor(Math.random() * 5) + 1,
              duration: Math.floor(Math.random() * 5) + 1
          };
          setTasks(prev => [...prev, newTask]);
      }
      setModalOpen(false);
  };

  const handleDelete = (id) => {
      if(window.confirm("Delete this task?")) {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (isModalOpen) setModalOpen(false);
      }
  };

  return (
    <div className="w-full h-screen bg-[#09090b] text-zinc-300 font-sans flex flex-col lg:flex-row overflow-hidden relative selection:bg-violet-500/30">
      
      {/* --- Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={isEditMode ? "Edit Task" : "New Task"}>
                <form onSubmit={handleSaveTask} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Title</label>
                        <input 
                            required 
                            autoFocus
                            value={taskForm.title} 
                            onChange={e => setTaskForm({...taskForm, title: e.target.value})} 
                            className="w-full bg-[#27272a] border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm transition-all" 
                            placeholder="e.g., Fix Navigation Bug..." 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Priority</label>
                            <div className="relative">
                              <select 
                                  value={taskForm.priority} 
                                  onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                                  className="w-full appearance-none bg-[#27272a] border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none text-sm"
                              >
                                  <option>Low</option>
                                  <option>Medium</option>
                                  <option>High</option>
                                  <option>Critical</option>
                              </select>
                              <div className="absolute right-3 top-3.5 pointer-events-none text-zinc-500"><ChevronLeft className="w-4 h-4 -rotate-90" /></div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Points</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="20"
                                value={taskForm.points} 
                                onChange={e => setTaskForm({...taskForm, points: Number(e.target.value)})} 
                                className="w-full bg-[#27272a] border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none text-sm" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Assignee</label>
                            <div className="flex gap-2 flex-wrap">
                                {TEAM_MEMBERS.map(m => (
                                    <button 
                                        key={m.id}
                                        type="button"
                                        onClick={() => setTaskForm({...taskForm, assignee: m.id})}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all text-lg ${taskForm.assignee === m.id ? 'border-violet-500 bg-violet-500/20 scale-110 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'}`}
                                        title={m.name}
                                    >
                                            {m.avatar}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Status</label>
                             <div className="relative">
                               <select 
                                  value={taskForm.status} 
                                  onChange={e => setTaskForm({...taskForm, status: e.target.value})}
                                  className="w-full appearance-none bg-[#27272a] border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none text-sm"
                               >
                                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                               </select>
                               <div className="absolute right-3 top-3.5 pointer-events-none text-zinc-500"><ChevronLeft className="w-4 h-4 -rotate-90" /></div>
                             </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
                        {isEditMode && (
                            <button 
                                type="button" 
                                onClick={() => handleDelete(currentTask.id)}
                                className="px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-colors"
                            >
                                Delete
                            </button>
                        )}
                        <button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-violet-600/20 text-sm flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            {isEditMode ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </Modal>
        )}
      </AnimatePresence>

      {/* --- Sidebar (Desktop) --- */}
      <nav className="hidden lg:flex w-72 bg-[#09090b] border-r border-white/5 flex-col justify-between py-8 px-6 flex-shrink-0 z-50">
         <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 mb-10">
               <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-[0_0_20px_rgba(124,58,237,0.4)]">V</div>
               <div>
                 <span className="text-white font-bold tracking-widest text-lg block leading-none">{APP_NAME}</span>
                 <span className="text-xs text-zinc-500 font-mono">v2.4.0</span>
               </div>
            </div>

            <SidebarButton active={activeTab === 'board'} onClick={() => setActiveTab('board')} icon={Layout} label="Board" />
            <SidebarButton active={activeTab === 'backlog'} onClick={() => setActiveTab('backlog')} icon={List} label="Backlog" />
            <SidebarButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={Clock} label="Timeline" />
         </div>

         <div>
            <h5 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4 px-2">Team Members</h5>
            <div className="flex -space-x-3 mb-8 px-2">
               {TEAM_MEMBERS.map(m => (
                  <div key={m.id} className="w-10 h-10 rounded-full bg-zinc-800 border-4 border-[#09090b] flex items-center justify-center text-lg cursor-pointer hover:scale-110 hover:z-10 transition-transform relative group" title={m.name}>
                      {m.avatar}
                  </div>
               ))}
               <button className="w-10 h-10 rounded-full bg-zinc-800 border-4 border-[#09090b] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors">
                  <Plus className="w-4 h-4" />
               </button>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                    <HelpCircle className="w-4 h-4" />
                    <span className="font-medium">Need Help?</span>
                </div>
                <p className="text-xs text-zinc-600 mb-3">Check our docs for tips.</p>
                <button className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-zinc-400 text-xs rounded transition-colors">Documentation</button>
            </div>
         </div>
      </nav>

      {/* --- Sidebar (Mobile Drawer) --- */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-4/5 max-w-xs bg-[#09090b] border-r border-white/10 z-50 lg:hidden flex flex-col justify-between py-6 px-5 shadow-2xl"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-white">V</div>
                       <span className="text-white font-bold tracking-widest text-lg">{APP_NAME}</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="p-2 text-zinc-500 hover:bg-white/5 rounded-full">
                       <X className="w-5 h-5" />
                    </button>
                </div>

                <SidebarButton active={activeTab === 'board'} onClick={() => { setActiveTab('board'); setSidebarOpen(false); }} icon={Layout} label="Board" />
                <SidebarButton active={activeTab === 'backlog'} onClick={() => { setActiveTab('backlog'); setSidebarOpen(false); }} icon={List} label="Backlog" />
                <SidebarButton active={activeTab === 'timeline'} onClick={() => { setActiveTab('timeline'); setSidebarOpen(false); }} icon={Clock} label="Timeline" />
              </div>

              <div>
                <h5 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">Team</h5>
                <div className="flex -space-x-2 mb-6">
                   {TEAM_MEMBERS.map(m => (
                      <div key={m.id} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#09090b] flex items-center justify-center text-sm">
                          {m.avatar}
                      </div>
                   ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
         
         {/* Top Header */}
         <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#09090b]/90 backdrop-blur z-20 flex-shrink-0">
            <div className="flex items-center gap-3 md:gap-4">
               <button 
                 onClick={() => setSidebarOpen(true)}
                 className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-full active:bg-white/5 transition-colors"
               >
                 <Menu className="w-6 h-6" />
               </button>

               <div className="flex lg:hidden items-center gap-2">
                   <span className="text-white font-bold tracking-widest text-lg">VELOCITY</span>
               </div>

               <div className="hidden md:flex items-center bg-[#18181b] rounded-full px-4 py-1.5 border border-white/5 gap-3">
                  <Target className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-mono text-zinc-400">Sprint 42: <span className="text-white">Day 3/14</span></span>
                  <div className="h-3 w-[1px] bg-white/10"></div>
                  <span className="text-xs text-emerald-500">On Track</span>
               </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
               <button 
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs md:text-sm font-bold rounded-lg transition-all border border-violet-500/20 disabled:opacity-50"
               >
                  {isOptimizing ? <Cpu className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-violet-400" />}
                  <span className="hidden sm:inline">{isOptimizing ? 'Optimizing...' : 'Optimize'}</span>
               </button>

               <button 
                 onClick={onExit}
                 className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs md:text-sm font-bold rounded-lg transition-all border border-red-500/20"
               >
                 <LogOut className="w-4 h-4" />
                 <span className="hidden sm:inline">Exit</span>
               </button>
            </div>
         </header>

         {/* Content Area */}
         <div className="flex-1 overflow-hidden relative">
            
            {/* Board View */}
            {activeTab === 'board' && (
                <div className="h-full w-full p-4 md:p-8 overflow-x-auto overflow-y-hidden pb-20 md:pb-8 custom-scrollbar">
                   <div className="flex h-full gap-4 md:gap-6 min-w-max">
                      {COLUMNS.map(column => (
                          <div key={column.id} className="w-[85vw] sm:w-[320px] flex flex-col h-full bg-[#121215] rounded-xl border border-white/5 shadow-xl relative">
                              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#151518]/90 rounded-t-xl backdrop-blur sticky top-0 z-10">
                                 <div className="flex items-center gap-2.5">
                                    <div className={`w-2.5 h-2.5 rounded-full ${column.color} shadow-[0_0_8px_currentColor]`} />
                                    <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">{column.title}</h3>
                                    <span className="bg-white/5 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/5">{tasks.filter(t => t.status === column.id).length}</span>
                                 </div>
                                 <button onClick={() => handleOpenAdd(column.id)} className="text-zinc-600 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded">
                                     <Plus className="w-4 h-4" />
                                 </button>
                              </div>
                              
                              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                                 <AnimatePresence mode='popLayout'>
                                     {tasks.filter(t => t.status === column.id).map(task => (
                                          <TaskCard 
                                             key={task.id} 
                                             task={task} 
                                             onEdit={handleOpenEdit} 
                                             onDelete={handleDelete} 
                                          />
                                     ))}
                                 </AnimatePresence>
                                 
                                 {tasks.filter(t => t.status === column.id).length === 0 && (
                                     <div 
                                       className="h-24 border-2 border-dashed border-white/5 rounded-xl flex flex-col gap-2 items-center justify-center text-xs text-zinc-700 uppercase tracking-widest cursor-pointer hover:border-white/10 hover:text-zinc-500 transition-colors group" 
                                       onClick={() => handleOpenAdd(column.id)}
                                     >
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                           <Plus className="w-4 h-4 opacity-50" />
                                        </div>
                                        <span>Add Task</span>
                                     </div>
                                 )}
                              </div>
                          </div>
                      ))}
                   </div>
                </div>
            )}

            {/* Backlog View */}
            {activeTab === 'backlog' && (
                <div className="h-full w-full p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
                   <div className="bg-[#121215] rounded-xl border border-white/5 flex flex-col min-h-[500px] shadow-2xl max-w-5xl mx-auto">
                       <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#151518] rounded-t-xl sticky top-0 z-10">
                           <div className="flex items-center gap-3">
                              <h3 className="text-white font-bold text-lg">Backlog</h3>
                              <span className="bg-white/5 text-zinc-500 text-xs px-2 py-0.5 rounded-full">{tasks.length} issues</span>
                           </div>
                           <div className="flex gap-2">
                               <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors hidden sm:block"><Filter className="w-4 h-4" /></button>
                               <button onClick={() => handleOpenAdd()} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-violet-600/20">
                                 <Plus className="w-4 h-4" /> 
                                 <span className="hidden sm:inline">Add Issue</span>
                                 <span className="sm:hidden">Add</span>
                               </button>
                           </div>
                       </div>
                       <div className="flex-1 overflow-x-auto">
                           <table className="w-full text-left text-sm text-zinc-400 min-w-[600px] md:min-w-full">
                               <thead className="bg-[#18181b]/50 text-xs uppercase font-bold text-zinc-500 sticky top-0">
                                   <tr>
                                       <th className="px-4 py-3 border-b border-white/5 w-1/2">Title</th>
                                       <th className="px-4 py-3 border-b border-white/5 hidden sm:table-cell">Priority</th>
                                       <th className="px-4 py-3 border-b border-white/5 hidden md:table-cell">Assignee</th>
                                       <th className="px-4 py-3 border-b border-white/5">Points</th>
                                       <th className="px-4 py-3 border-b border-white/5 text-right"></th>
                                   </tr>
                               </thead>
                               <tbody>
                                   <AnimatePresence>
                                       {tasks.map(task => (
                                           <BacklogRow key={task.id} task={task} onEdit={handleOpenEdit} onDelete={handleDelete} />
                                       ))}
                                   </AnimatePresence>
                               </tbody>
                           </table>
                           {tasks.length === 0 && (
                             <div className="p-10 text-center text-zinc-600">No tasks in backlog.</div>
                           )}
                       </div>
                   </div>
                </div>
            )}

            {/* Timeline View */}
            {activeTab === 'timeline' && (
                <div className="h-full w-full p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
                   <div className="bg-[#121215] rounded-xl border border-white/5 flex flex-col min-h-[400px] shadow-2xl max-w-6xl mx-auto overflow-hidden">
                       <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#151518]">
                           <div>
                             <h3 className="text-white font-bold text-lg flex items-center gap-2"><Calendar className="w-5 h-5 text-violet-500" /> Project Timeline</h3>
                             <p className="text-zinc-500 text-xs mt-1">Q1 2024 Roadmap</p>
                           </div>
                           <div className="flex items-center gap-6 text-xs text-zinc-500 font-mono bg-black/20 px-4 py-2 rounded-lg border border-white/5 w-full sm:w-auto overflow-x-auto">
                               <span className="whitespace-nowrap">Week 1</span>
                               <span className="whitespace-nowrap opacity-50">Week 2</span>
                               <span className="whitespace-nowrap opacity-50">Week 3</span>
                               <span className="whitespace-nowrap opacity-50">Week 4</span>
                           </div>
                       </div>
                       
                       <div className="flex-1 overflow-x-auto p-6 custom-scrollbar">
                           <div className="min-w-[600px] space-y-6">
                               {tasks.map((task, idx) => (
                                   <div key={task.id} className="flex items-center group">
                                       <div className="w-48 md:w-64 flex-shrink-0 pr-6 border-r border-white/5 flex items-center gap-3">
                                           <div className={`w-2 h-2 rounded-full ${COLUMNS.find(c => c.id === task.status)?.color}`} />
                                           <div className="truncate">
                                             <div className="text-zinc-300 text-sm font-medium truncate group-hover:text-white transition-colors">{task.title}</div>
                                             <div className="text-zinc-600 text-xs">{TEAM_MEMBERS.find(m => m.id === task.assignee)?.name}</div>
                                           </div>
                                       </div>
                                       <div className="flex-1 ml-6 relative h-10 flex items-center bg-white/[0.01] rounded-lg">
                                           {/* Grid Lines */}
                                           <div className="absolute inset-0 flex">
                                             <div className="flex-1 border-r border-white/5 h-full"></div>
                                             <div className="flex-1 border-r border-white/5 h-full"></div>
                                             <div className="flex-1 border-r border-white/5 h-full"></div>
                                             <div className="flex-1 h-full"></div>
                                           </div>
                                           
                                           <motion.div 
                                               className={`absolute h-7 rounded-md ${COLUMNS.find(c => c.id === task.status)?.color.replace('500', '500/40')} border ${COLUMNS.find(c => c.id === task.status)?.color.replace('bg-', 'border-').replace('500', '500/50')} shadow-lg hover:brightness-110 cursor-pointer transition-all`}
                                               style={{ left: `${task.startDay * 4}%`, width: `${Math.max(task.duration * 4, 5)}%` }}
                                               initial={{ opacity: 0, scaleX: 0 }}
                                               animate={{ opacity: 1, scaleX: 1 }}
                                               transition={{ duration: 0.5, delay: idx * 0.05 }}
                                           >
                                               <div className="w-full h-full flex items-center px-2">
                                                   <span className="text-[10px] font-bold text-white/80 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                                       {task.duration} days
                                                   </span>
                                               </div>
                                           </motion.div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>
                </div>
            )}
         </div>
      </div>

      {/* --- Bottom Navigation (Mobile Only) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/10 flex justify-around items-center z-40 px-2 pb-safe">
         <NavButton active={activeTab === 'board'} onClick={() => setActiveTab('board')} icon={Layout} label="Board" />
         
         <div className="relative -top-5">
           <button 
             onClick={() => handleOpenAdd()} 
             className="flex items-center justify-center w-14 h-14 bg-violet-600 rounded-full text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] border-4 border-[#09090b] active:scale-95 transition-transform"
           >
             <Plus className="w-7 h-7" />
           </button>
         </div>
         
         <NavButton active={activeTab === 'backlog'} onClick={() => setActiveTab('backlog')} icon={List} label="List" />
         <NavButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={Clock} label="Time" />
      </div>

    </div>
  );
}

// --- Helper Components ---

const SidebarButton = ({ active, onClick, icon: Icon, label }) => (
    <button 
        onClick={onClick} 
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
    >
        <Icon className={`w-5 h-5 transition-colors ${active ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
        <span className="text-sm font-bold">{label}</span>
        {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_currentColor]" />}
    </button>
);

const NavButton = ({ active, onClick, icon: Icon, label }) => (
    <button 
        onClick={onClick} 
        className={`flex flex-col items-center gap-1 py-2 flex-1 rounded-lg active:bg-white/5 ${active ? 'text-violet-400' : 'text-zinc-600'}`}
    >
        <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);