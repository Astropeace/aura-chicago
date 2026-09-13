"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, UploadCloud, Terminal, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SecureUplink() {
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('transmitting');
    
    // Simulate network transmission to the Grid
    setTimeout(() => {
      setStatus('success');
    }, 2500);
  };

  return (
    <main className="min-h-screen w-screen bg-black text-cyan-50 font-mono flex items-center justify-center p-6 overflow-hidden relative">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
      }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-black/80 backdrop-blur-xl border-2 border-cyan-500/50 p-8 rounded-lg shadow-[0_0_50px_rgba(34,211,238,0.2)] z-10 relative"
      >
        <div className="flex items-center gap-4 border-b border-cyan-900/50 pb-6 mb-8">
          <Terminal className="text-cyan-400 w-8 h-8 animate-pulse" />
          <div>
            <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              SECURE UPLINK
            </h1>
            <p className="text-cyan-600 text-xs uppercase tracking-[0.3em]">AURA // PR Network Portal</p>
          </div>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-900/30 border border-cyan-400 mb-4 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              <UploadCloud className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-cyan-300 tracking-widest">TRANSMISSION COMPLETE</h2>
            <p className="text-gray-400">Your coordinates have been encrypted and deployed to the AURA grid.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-8 px-6 py-2 bg-transparent border border-cyan-600 text-cyan-400 hover:bg-cyan-900/30 transition-all rounded"
            >
              INITIATE NEW UPLINK
            </button>
            <div className="mt-4">
              <Link href="/" className="text-xs text-gray-500 hover:text-cyan-400 flex items-center justify-center gap-1">
                RETURN TO GRID <ChevronRight size={12} />
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            
            {status === 'transmitting' && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin"></div>
                  <p className="text-cyan-400 tracking-widest animate-pulse">ENCRYPTING DATA...</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-cyan-500 tracking-widest uppercase flex items-center gap-2">
                <ChevronRight size={14} /> Brand / Activation Name
              </label>
              <input 
                required
                type="text" 
                className="w-full bg-cyan-950/20 border border-cyan-900 focus:border-cyan-400 rounded p-3 text-cyan-50 outline-none transition-colors"
                placeholder="e.g. CyberDrink Launch Party"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-cyan-500 tracking-widest uppercase flex items-center gap-2">
                  <ChevronRight size={14} /> Coordinates (Address)
                </label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-cyan-950/20 border border-cyan-900 focus:border-cyan-400 rounded p-3 text-cyan-50 outline-none transition-colors"
                  placeholder="Secret Location / Address"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-cyan-500 tracking-widest uppercase flex items-center gap-2">
                  <ChevronRight size={14} /> Time / Date
                </label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-cyan-950/20 border border-cyan-900 focus:border-cyan-400 rounded p-3 text-cyan-50 outline-none transition-colors"
                  placeholder="Friday, 11:00 PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#22d3ee] tracking-widest uppercase flex items-center gap-2">
                <Lock size={14} /> Security Access Code (Optional)
              </label>
              <input 
                type="password" 
                className="w-full bg-[#22d3ee]/5 border border-[#22d3ee]/30 focus:border-[#22d3ee] rounded p-3 text-[#22d3ee] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-6 border-t border-cyan-900/50 flex items-center justify-between">
              <Link href="/" className="text-xs text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                <ChevronRight size={12} /> ABORT UPLINK
              </Link>
              
              <button 
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-widest px-8 py-3 rounded shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all hover:scale-105"
              >
                DEPLOY TO GRID
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </main>
  );
}
