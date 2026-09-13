"use client";

import { useState, useEffect } from 'react';
import MapComponent from '@/components/Map';
import { mockEvents, EventData } from '@/data/mockEvents';
import { Clock, MapPin, X, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [filter, setFilter] = useState<string>('All');
  
  // State for our live events
  const [liveEvents, setLiveEvents] = useState<EventData[]>(
    mockEvents.filter(e => e.source === 'PR' || e.source === 'Tech') // Keep our mock PR events
  );
  const [isScanning, setIsScanning] = useState(true);

  const categories = ['All', 'Ticketmaster', 'Posh', 'PR', 'Tech'];

  useEffect(() => {
    async function scanTheGrid() {
      try {
        setIsScanning(true);
        
        // Fetch Ticketmaster & Posh concurrently
        const [tmRes, poshRes] = await Promise.allSettled([
          fetch('/api/events/ticketmaster').then(res => res.json()),
          fetch('/api/events/posh').then(res => res.json())
        ]);

        let newEvents: EventData[] = [];

        if (tmRes.status === 'fulfilled' && tmRes.value.events) {
          newEvents = [...newEvents, ...tmRes.value.events];
        }
        if (poshRes.status === 'fulfilled' && poshRes.value.events) {
          newEvents = [...newEvents, ...poshRes.value.events];
        }

        // Merge real events with our mock PR/Tech events, filtering duplicates
        setLiveEvents(prev => {
          const merged = [...prev, ...newEvents];
          const uniqueEvents = Array.from(new Map(merged.map(e => [e.id, e])).values());
          return uniqueEvents as EventData[];
        });
      } catch (error) {
        console.error("Grid Scan Error:", error);
      } finally {
        setIsScanning(false);
      }
    }

    scanTheGrid();
  }, []);

  const filteredEvents = filter === 'All' 
    ? liveEvents 
    : liveEvents.filter(e => e.source === filter);

  return (
    <main className="flex h-screen w-screen bg-black overflow-hidden font-mono text-cyan-50">
      
      {/* MAP SECTION */}
      <div className="flex-1 relative">
        <MapComponent events={filteredEvents} onEventSelect={setSelectedEvent} />
        
        {/* SCANNING OVERLAY */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center pointer-events-none"
            >
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <div className="text-cyan-400 font-mono tracking-widest uppercase animate-pulse">
                Scanning the Grid for Live Events...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER OVERLAY & BRANDING */}
        <div className="absolute top-6 left-6 pointer-events-none z-10">
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            AURA
          </h1>
          <p className="text-cyan-400/80 font-mono text-sm mt-2 tracking-widest uppercase">
            VIP Radar // Chicago
          </p>

          <div className="mt-8 font-mono text-xs space-y-2 bg-black/40 backdrop-blur-md p-4 rounded border border-cyan-900/30">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#b026ff] shadow-[0_0_8px_#b026ff]"></div><span className="text-gray-300">Ticketmaster</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff2a85] shadow-[0_0_8px_#ff2a85]"></div><span className="text-gray-300">Posh VIP</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]"></div><span className="text-gray-300">PR Portal</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]"></div><span className="text-gray-300">Tech/Network</span></div>
          </div>
        </div>

        {/* FILTERS OVERLAY */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2 overflow-x-auto max-w-full px-4 pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm uppercase tracking-wider transition-all duration-300 border backdrop-blur-md
                ${filter === cat 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                  : 'bg-black/40 border-gray-800 text-gray-400 hover:border-cyan-900 hover:text-cyan-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 w-96 h-full bg-black/60 backdrop-blur-xl border-l border-cyan-900/50 p-6 overflow-y-auto z-20 flex flex-col"
          >
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-30"
            >
              <X size={24} />
            </button>

            <div className="mt-8 space-y-6 flex-1">
              <div className="w-full h-48 relative rounded-lg overflow-hidden border border-cyan-900/50">
                <img 
                  src={selectedEvent.imageUrl} 
                  alt={selectedEvent.title}
                  className="object-cover w-full h-full opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              </div>

              <div>
                <div className={`text-xs font-mono tracking-widest mb-2 uppercase
                  ${selectedEvent.source === 'Ticketmaster' ? 'text-[#b026ff]' :
                    selectedEvent.source === 'Posh' ? 'text-[#ff2a85]' :
                    selectedEvent.source === 'PR' ? 'text-[#22d3ee]' :
                    'text-[#39ff14]'
                  }`}
                >
                  {selectedEvent.source}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                <div className="flex items-center gap-2 text-cyan-400/80 font-mono text-sm mb-4">
                  <Clock size={14} />
                  <span>{selectedEvent.date}</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
            
            <div className="pt-6 mt-auto">
               <button className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/50 text-cyan-400 font-mono text-sm tracking-widest rounded transition-colors duration-300">
                <ExternalLink size={16} />
                INITIATE RSVP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
