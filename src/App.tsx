// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, User, MessageSquare, Globe, ChevronRight, Layout, Code, Video, 
  PenTool, Smartphone, CheckCircle2, Star, Filter, Share2, Plus, X 
} from 'lucide-react';

// --- SUPABASE CONFIG ---
const SUPABASE_URL = "https://unpohitxskatvovjowen.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucG9oaXR4c2thdHZvdmpvd2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MjcwNjMsImV4cCI6MjA1NDAwMzA2M30.K9Gf6X0-TOfk7N5-o99iO2Y-7S2K9N6L2J9I0-7_S6Y";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {

  const [view, setView] = useState('home'); // home, discover, collaborations, profile
  const [loading, setLoading] = useState(false);

  // --- BRAND COLORS ---
  const theme = {
    black: '#0A0A0A',
    burgundy: '#2D0A0A',
    gold: '#D4AF37',
    goldMuted: '#B8962E',
    glass: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(212, 175, 55, 0.15)'
  };

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden" style={{ backgroundColor: theme.black }}>
      
      {/* --- NAVIGATION (LOGO #4) --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => setView('home')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center border border-[#D4AF37]/40 rounded-sm">
              <span className="text-[#D4AF37] font-serif text-2xl font-bold tracking-tighter">TV</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[#D4AF37] font-serif tracking-[0.2em] text-lg leading-none uppercase">The Voryel</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Your Vision, Our Flow</span>
            </div>
          </button>
          
          <div className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">
            <button onClick={() => setView('discover')} className={view === 'discover' ? 'text-[#D4AF37]' : 'hover:text-white'}>Discover</button>
            <button onClick={() => setView('collaborations')} className={view === 'collaborations' ? 'text-[#D4AF37]' : 'hover:text-white'}>Collaborations</button>
            <button className="hover:text-white">Messages</button>
            <button className="hover:text-white">About Us</button>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-sm">Join Now</button>
          </div>
        </div>
      </nav>

      {/* --- CONDITIONAL VIEW RENDERING --- */}
      <div className="pt-20">
        
        {view === 'home' && (
          <>
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2D0A0A]/40 blur-[120px] rounded-full -z-10" />
              <div className="max-w-4xl mx-auto">
                <div className="inline-block px-4 py-1 border border-[#D4AF37]/20 rounded-full bg-[#2D0A0A]/30 mb-8">
                  <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.4em]">Welcome to The Voryel</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] mb-8">
                  Connect with premium <br />
                  <span className="text-[#D4AF37] italic">digital professionals</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12 font-light">
                  A trusted platform where clients and professionals meet, 
                  collaborate, and complete quality digital work. No fees. No middleman.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => setView('discover')} className="bg-[#2D0A0A] border border-[#D4AF37]/30 px-10 py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-black transition-all">Join as Professional</button>
                  <button className="bg-white/5 border border-white/10 px-10 py-5 text-[11px] uppercase tracking-widest font-bold">Join as Client</button>
                </div>
              </div>
            </section>

            {/* CATEGORIES GRID */}
            <section className="py-20 px-6 border-t border-white/5 bg-[#0D0D0D]">
              <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-px bg-white/5 border border-white/5">
                {[
                  { icon: Code, label: 'Web Dev' },
                  { icon: Layout, label: 'Web Design' },
                  { icon: PenTool, label: 'Graphic' },
                  { icon: Video, label: 'Video' },
                  { icon: Smartphone, label: 'UI/UX' },
                  { icon: Globe, label: 'Programming' }
                ].map((cat, i) => (
                  <div key={i} className="bg-black p-10 flex flex-col items-center gap-4 hover:bg-[#2D0A0A]/20 transition cursor-pointer">
                    <cat.icon size={20} className="text-[#D4AF37]" />
                    <span className="text-[9px] uppercase tracking-widest text-gray-500">{cat.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'discover' && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-serif mb-2">Discover Professionals</h2>
                <p className="text-gray-500 text-sm">Hand-picked talent for your next vision.</p>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input type="text" placeholder="Search skills..." className="bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-sm rounded-sm focus:border-[#D4AF37] outline-none" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="group bg-white/[0.02] border border-white/5 p-6 hover:border-[#D4AF37]/30 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#2D0A0A] to-black border border-white/10 rounded-sm" />
                    <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-1">Featured</span>
                  </div>
                  <h3 className="text-xl font-serif mb-1">Adetunji Destiny</h3>
                  <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest">Full Stack Developer</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['React', 'Node.js', 'Next.js'].map(s => <span key={s} className="text-[8px] bg-white/5 px-2 py-1 rounded-full text-gray-400">{s}</span>)}
                  </div>
                  <button className="w-full border border-[#D4AF37]/20 py-3 text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition">View Profile</button>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* --- MASTER PROMPT FOOTER --- */}
      <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-[10px] uppercase tracking-widest">
            <div className="col-span-1">
               <div className="flex items-center gap-3 mb-8">
                 <div className="w-8 h-8 flex items-center justify-center border border-[#D4AF37]/40 rounded-sm">
                   <span className="text-[#D4AF37] font-serif text-lg font-bold">TV</span>
                 </div>
                 <span className="text-[#D4AF37] font-serif text-lg">The Voryel</span>
               </div>
               <p className="text-gray-600 leading-relaxed tracking-normal lowercase text-xs">A premium network for digital professionals and clients shaping the future of work.</p>
            </div>
            <div>
              <h4 className="text-white mb-8 font-bold">Platform</h4>
              <div className="flex flex-col gap-4 text-gray-500">
                <span>Discover</span>
                <span>Collaborations</span>
                <span>Featured</span>
              </div>
            </div>
            <div>
              <h4 className="text-white mb-8 font-bold">Company</h4>
              <div className="flex flex-col gap-4 text-gray-500">
                <span>About Us</span>
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
              </div>
            </div>
            <div>
              <h4 className="text-white mb-8 font-bold">Contact</h4>
              <p className="text-[#D4AF37] mb-2 lowercase tracking-normal text-sm font-medium">thevoryel@gmail.com</p>
              <p className="text-gray-600 italic tracking-normal capitalize">We aim to respond promptly.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 text-[9px] text-gray-600 tracking-[0.4em] uppercase font-medium">
            <p>© 2026 The Voryel. All rights reserved.</p>
            <p className="text-[#D4AF37]">Founded by Adetunji Ewaoluwa Destiny</p>
            <p>Est. 2026</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@300;400;600&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
}
