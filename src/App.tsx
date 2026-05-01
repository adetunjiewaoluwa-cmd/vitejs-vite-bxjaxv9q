// @ts-nocheck
import { useState, useEffect } from "react";

/* ─── SUPABASE ───────────────────────────────────────────────────────────── */
const SURL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";
const H = { apikey: SKEY, Authorization: `Bearer ${SKEY}` };
const db = {
  all: () => fetch(`${SURL}/rest/v1/profiles?select=*&order=joined_at.desc`, { headers: H }).then(r => r.json()),
  byEmail: em => fetch(`${SURL}/rest/v1/profiles?email=eq.${encodeURIComponent(em)}&select=*`, { headers: H }).then(r => r.json()).then(d => d[0] || null),
  insert: d => fetch(`${SURL}/rest/v1/profiles`, { method: "POST", headers: { ...H, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(d) }).then(r => r.json()),
  update: (id, d) => fetch(`${SURL}/rest/v1/profiles?id=eq.${id}`, { method: "PATCH", headers: { ...H, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(d) }).then(r => r.json()),
};

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const VMAIL = "thevoryel@gmail.com";
const CATS = ["Web Development","Web Design","Graphic Design","Video Editing","UI/UX Design","Programming"];

/* ─── COLOUR SYSTEM — brighter, warmer, eye-friendly ─────────────────────── */
const C = {
  /* Backgrounds — noticeably lighter than before */
  bg:    "#18080D",   /* page bg — dark wine, not pitch black */
  s1:    "#22101A",   /* card surface */
  s2:    "#2D1520",   /* elevated surface */
  s3:    "#3A1D28",   /* hover surface */
  /* Burgundy */
  burg:  "#9B2242",
  burgD: "#6B1428",
  burgL: "#C43060",
  /* Gold — warmer, brighter */
  gold:  "#D4A84B",
  goldL: "#EBC96E",
  goldP: "#FAF0D0",
  goldDim:"rgba(212,168,75,0.12)",
  /* Text — higher contrast */
  white: "#FDF8F2",
  tx:    "#E8DDD0",    /* primary text — warm off-white */
  tx2:   "#A8957E",    /* secondary — warm mid */
  tx3:   "#6A5546",    /* muted */
  /* Borders */
  b:    "rgba(212,168,75,0.18)",
  bA:   "rgba(212,168,75,0.5)",
  bS:   "rgba(212,168,75,0.08)",
  /* Accents */
  blue:  "#6AABCC",
  green: "#5CAA8A",
};

const ini = n => (n||"").trim().split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";
const AVC = [["#6B1428","#9B2242"],["#0D2A4A","#1A5480"],["#2A1045","#5A2090"],["#0A2E1A","#1A6040"],["#3A1008","#7A2818"],["#0A2038","#155570"]];
const avc = n => AVC[(n||"A").charCodeAt(0) % AVC.length];
const parseSkills = s => Array.isArray(s) ? s : (s||"").split(",").map(x=>x.trim()).filter(Boolean);

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cinzel:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #18080D; color: #FDF8F2; font-family: 'Cinzel', serif; overflow-x: hidden; scroll-behavior: smooth; }
::placeholder { color: #6A5546; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #18080D; }
::-webkit-scrollbar-thumb { background: #9B2242; border-radius: 2px; }
select option { background: #22101A; color: #E8DDD0; }
input, textarea, select { color: #E8DDD0 !important; font-family: 'Cormorant Garamond', serif; }
::selection { background: #9B2242; color: #FAF0D0; }

/* ── ANIMATIONS ── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes spin     { to { transform: rotate(360deg); } }
@keyframes pulse    { 0%,100% { opacity:.18; } 50% { opacity:.7; } }
@keyframes floatY   { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes rotateSlow { to { transform: rotate(360deg); } }
@keyframes shimmer  { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

.fu { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) both; }
.d1 { animation-delay:.06s } .d2 { animation-delay:.18s } .d3 { animation-delay:.3s }
.d4 { animation-delay:.44s } .d5 { animation-delay:.58s }
.fi { animation: fadeIn .5s ease both; }

/* ── HOVER ── */
.hc { transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .2s; }
.hc:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(155,34,66,0.25); border-color: rgba(212,168,75,.5) !important; }
.hl { transition: all .22s; } .hl:hover { transform: translateY(-1px); opacity: .85; }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 62px;
  display: flex; align-items: center; justify-content: space-between; padding: 0 56px;
  background: rgba(24,8,13,.96); backdrop-filter: blur(28px) saturate(1.5);
  border-bottom: 1px solid rgba(212,168,75,.12);
}
.nav-links { display: flex; gap: 38px; align-items: center; }
.nl {
  font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: .22em;
  color: #A8957E; cursor: pointer; transition: color .2s;
  text-transform: uppercase; position: relative; padding-bottom: 2px;
}
.nl::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px; background:#D4A84B; transform:scaleX(0); transition:transform .25s; transform-origin:left; }
.nl:hover, .nl.on { color: #D4A84B; }
.nl:hover::after, .nl.on::after { transform: scaleX(1); }
.nav-r { display: flex; gap: 8px; align-items: center; }

/* ── HIRE BUTTON ── */
.hire-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Cinzel', serif; font-size: 8.5px; letter-spacing: .2em;
  padding: 10px 22px; text-decoration: none;
  background: linear-gradient(135deg, #D4A84B, #EBC96E);
  color: #18080D; font-weight: 600; border: none; cursor: pointer;
  transition: all .25s; white-space: nowrap;
}
.hire-btn:hover { box-shadow: 0 0 28px rgba(212,168,75,.4); transform: translateY(-1px); }

/* ── FORMS ── */
.fb {
  background: rgba(253,248,242,.04); border: 1px solid rgba(212,168,75,.18);
  color: #E8DDD0 !important; font-family: 'Cormorant Garamond', serif;
  font-size: 15.5px; padding: 12px 15px; outline: none; width: 100%;
  transition: border-color .2s; border-radius: 1px;
}
.fb:focus { border-color: rgba(212,168,75,.5); background: rgba(253,248,242,.06); }

/* ── NET GRID ── */
.net-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 22px; }

/* ── PORTFOLIO ── */
.port-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.port-tile { aspect-ratio: 4/3; background: #2D1520; border: 1px solid rgba(212,168,75,.16); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: border-color .25s; position: relative; overflow: hidden; }
.port-tile:hover { border-color: rgba(212,168,75,.42); }

/* ── STEP DOTS ── */
.sdot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; transition: all .25s; }
.sdot.done { background: #9B2242; border: 1px solid #C43060; color: #D4A84B; }
.sdot.active { border: 1px solid #D4A84B; color: #D4A84B; background: transparent; }
.sdot.idle { border: 1px solid rgba(212,168,75,.2); color: #6A5546; background: transparent; }

/* ── TABS ── */
.tab-btn { background: transparent; border: none; cursor: pointer; padding: 12px 26px; font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #A8957E; border-bottom: 1px solid transparent; margin-bottom: -1px; transition: all .2s; }
.tab-btn.on { color: #D4A84B; border-bottom-color: #D4A84B; }
.tab-btn:hover:not(.on) { color: #E8DDD0; }

/* ── MODAL ── */
.modal-bg { position: fixed; inset: 0; background: rgba(24,8,13,.88); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn .25s both; }
.modal { background: #22101A; border: 1px solid rgba(212,168,75,.28); max-width: 680px; width: 100%; max-height: 92vh; overflow-y: auto; position: relative; }

/* ── TOAST ── */
.toast { position: fixed; bottom: 26px; right: 26px; z-index: 999; background: #2D1520; border: 1px solid rgba(212,168,75,.45); padding: 16px 22px; display: flex; align-items: flex-start; gap: 13px; max-width: 300px; box-shadow: 0 18px 48px rgba(0,0,0,.5); animation: fadeUp .35s both; }

/* ── HERO GRAPHIC ── */
.hero-graphic { position: absolute; right: 5%; top: 50%; transform: translateY(-50%); opacity: .55; pointer-events: none; animation: floatY 7s ease-in-out infinite; }

/* ── SECTION DIVIDER ── */
.sec-div { display: flex; align-items: center; gap: 18px; margin: 0 auto 44px; max-width: 400px; justify-content: center; }
.sec-div-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(212,168,75,.35)); }
.sec-div-line.rev { background: linear-gradient(90deg, rgba(212,168,75,.35), transparent); }

/* ── CARD BASE ── */
.vcard { background: #22101A; border: 1px solid rgba(212,168,75,.16); transition: all .28s; }

/* ── RESPONSIVE ── */
@media(max-width:960px) {
  .nav { padding: 0 22px; } .nav-links { display: none; }
  .two-col, .auth-layout, .contact-grid, .terms-layout { grid-template-columns: 1fr !important; }
  .hero-graphic { display: none; }
  .net-grid { grid-template-columns: 1fr 1fr; }
  .port-grid { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: 1fr 1fr !important; }
  .proc-wrap { grid-template-columns: 1fr 1fr !important; }
  .why-wrap { grid-template-columns: 1fr 1fr !important; }
  .cat-wrap { grid-template-columns: 1fr 1fr !important; }
}
@media(max-width:580px) {
  .net-grid { grid-template-columns: 1fr; }
  .port-grid { grid-template-columns: 1fr 1fr; }
  .why-wrap, .cat-wrap { grid-template-columns: 1fr !important; }
}
`;

/* ══════════════════════════════════════════════════════
   LOGO MARK — new original SVG graphic
══════════════════════════════════════════════════════ */
function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Outer frame with corner cuts */}
      <path d="M6 2H42V46H6Z" stroke="#D4A84B" strokeWidth="0.6" fill="none" opacity="0.3"/>
      <rect x="2" y="6" width="44" height="36" fill="none" stroke="#D4A84B" strokeWidth="0.5" opacity="0.2"/>
      {/* Corner accents */}
      <polyline points="2,6 2,2 6,2" stroke="#D4A84B" strokeWidth="1.1" fill="none"/>
      <polyline points="42,2 46,2 46,6" stroke="#D4A84B" strokeWidth="1.1" fill="none"/>
      <polyline points="46,42 46,46 42,46" stroke="#D4A84B" strokeWidth="1.1" fill="none"/>
      <polyline points="6,46 2,46 2,42" stroke="#D4A84B" strokeWidth="1.1" fill="none"/>
      {/* V letterform — stylised */}
      <path d="M13 13 L24 35 L35 13" stroke="#D4A84B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Cross bar */}
      <line x1="16" y1="24" x2="32" y2="24" stroke="#9B2242" strokeWidth="1.3" strokeLinecap="round"/>
      {/* Centre diamond */}
      <rect x="20.5" y="20.5" width="7" height="7" transform="rotate(45 24 24)" fill="#6B1428" stroke="#D4A84B" strokeWidth="0.9"/>
    </svg>
  );
}

function Logo({ size = "md", onClick }) {
  const cfg = { sm:[26,0.95], md:[36,1.1], lg:[50,1.45] }[size] || [36,1.1];
  return (
    <div onClick={onClick} style={{ cursor: onClick?"pointer":"default", display:"inline-flex", alignItems:"center", gap:12, userSelect:"none" }}>
      <LogoMark size={cfg[0]}/>
      <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:`${cfg[1]*0.54}rem`, letterSpacing:"0.48em", color:C.goldL, lineHeight:1 }}>The</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:400, fontSize:`${cfg[1]}rem`, letterSpacing:"0.14em", lineHeight:1, background:`linear-gradient(135deg,${C.white} 0%,${C.goldP} 48%,${C.gold} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Voryel</span>
      </div>
    </div>
  );
}

/* ── HERO ILLUSTRATION — original abstract SVG ── */
function HeroGraphic() {
  return (
    <svg width="420" height="420" viewBox="0 0 420 420" fill="none" className="hero-graphic">
      {/* Outer ring */}
      <circle cx="210" cy="210" r="200" stroke="#D4A84B" strokeWidth="0.5" opacity="0.2"/>
      <circle cx="210" cy="210" r="170" stroke="#D4A84B" strokeWidth="0.3" opacity="0.15"/>
      {/* Rotating ring segments */}
      <path d="M210 20 A190 190 0 0 1 390 170" stroke="#9B2242" strokeWidth="1.2" opacity="0.5"/>
      <path d="M390 250 A190 190 0 0 1 90 380" stroke="#9B2242" strokeWidth="0.8" opacity="0.3"/>
      {/* Grid lines */}
      <line x1="210" y1="10" x2="210" y2="410" stroke="#D4A84B" strokeWidth="0.3" opacity="0.12"/>
      <line x1="10" y1="210" x2="410" y2="210" stroke="#D4A84B" strokeWidth="0.3" opacity="0.12"/>
      <line x1="60" y1="60" x2="360" y2="360" stroke="#D4A84B" strokeWidth="0.2" opacity="0.08"/>
      <line x1="360" y1="60" x2="60" y2="360" stroke="#D4A84B" strokeWidth="0.2" opacity="0.08"/>
      {/* Main V form — large */}
      <path d="M100 100 L210 310 L320 100" stroke="#D4A84B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
      {/* Inner V */}
      <path d="M140 130 L210 270 L280 130" stroke="#D4A84B" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35"/>
      {/* Horizontal bar */}
      <line x1="130" y1="210" x2="290" y2="210" stroke="#9B2242" strokeWidth="1.4" strokeLinecap="round" opacity="0.8"/>
      {/* Center diamond */}
      <rect x="198" y="198" width="24" height="24" transform="rotate(45 210 210)" fill="#6B1428" stroke="#D4A84B" strokeWidth="1.2" opacity="0.9"/>
      <rect x="204" y="204" width="12" height="12" transform="rotate(45 210 210)" fill="#D4A84B" opacity="0.55"/>
      {/* Corner brackets */}
      <polyline points="30,30 30,10 50,10" stroke="#D4A84B" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <polyline points="370,10 390,10 390,30" stroke="#D4A84B" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <polyline points="390,390 390,410 370,410" stroke="#D4A84B" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <polyline points="50,410 30,410 30,390" stroke="#D4A84B" strokeWidth="1.2" fill="none" opacity="0.5"/>
      {/* Dot nodes */}
      <circle cx="100" cy="100" r="4" fill="#D4A84B" opacity="0.8"/>
      <circle cx="320" cy="100" r="4" fill="#D4A84B" opacity="0.8"/>
      <circle cx="210" cy="310" r="5" fill="#9B2242" opacity="0.9" stroke="#D4A84B" strokeWidth="1"/>
      <circle cx="210" cy="210" r="3" fill="#D4A84B" opacity="0.6"/>
    </svg>
  );
}

/* ── NETWORK ILLUSTRATION — for network page ── */
function NetworkGraphic() {
  return (
    <svg width="280" height="200" viewBox="0 0 280 200" fill="none" opacity="0.45">
      {/* Node circles */}
      {[[140,100],[60,40],[220,40],[40,150],[240,150],[140,180]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i===0?16:10} fill={i===0?"#9B2242":"#22101A"} stroke="#D4A84B" strokeWidth="1"/>
      ))}
      {/* Connecting lines */}
      {[[140,100,60,40],[140,100,220,40],[140,100,40,150],[140,100,240,150],[140,100,140,180],[60,40,40,150],[220,40,240,150]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4A84B" strokeWidth="0.6" opacity="0.5"/>
      ))}
      <circle cx="140" cy="100" r="7" fill="#D4A84B" opacity="0.7"/>
    </svg>
  );
}

/* ── CATEGORY ICON SVGs ── */
function CatIcon({ name, size=28 }) {
  const icons = {
    "Web Development": (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="2" y="5" width="24" height="18" rx="1" stroke="#D4A84B" strokeWidth="1.2" fill="none"/>
        <line x1="2" y1="10" x2="26" y2="10" stroke="#D4A84B" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="5.5" cy="7.5" r="1" fill="#9B2242"/>
        <circle cx="9" cy="7.5" r="1" fill="#D4A84B" opacity="0.6"/>
        <path d="M8 16 L11 13 L8 10" stroke="#D4A84B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M14 16 L20 16" stroke="#D4A84B" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <path d="M14 19 L18 19" stroke="#D4A84B" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    "Web Design": (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="1" stroke="#D4A84B" strokeWidth="1.2" fill="none"/>
        <rect x="3" y="3" width="8" height="22" stroke="#D4A84B" strokeWidth="0.6" fill="rgba(155,34,66,0.12)" opacity="0.6"/>
        <line x1="3" y1="11" x2="25" y2="11" stroke="#D4A84B" strokeWidth="0.6" opacity="0.4"/>
        <rect x="13" y="14" width="9" height="6" rx="0.5" stroke="#D4A84B" strokeWidth="0.8" fill="rgba(212,168,75,0.08)"/>
        <line x1="13" y1="23" x2="22" y2="23" stroke="#D4A84B" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    "Graphic Design": (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#D4A84B" strokeWidth="1.2" fill="none"/>
        <path d="M14 3 L14 25" stroke="#D4A84B" strokeWidth="0.6" opacity="0.3"/>
        <path d="M3 14 L25 14" stroke="#D4A84B" strokeWidth="0.6" opacity="0.3"/>
        <path d="M7 7 L21 21" stroke="#D4A84B" strokeWidth="0.4" opacity="0.2"/>
        <rect x="10" y="10" width="8" height="8" transform="rotate(45 14 14)" fill="#6B1428" stroke="#D4A84B" strokeWidth="0.9"/>
        <circle cx="14" cy="14" r="2.5" fill="#D4A84B" opacity="0.8"/>
      </svg>
    ),
    "Video Editing": (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="2" y="6" width="20" height="16" rx="1" stroke="#D4A84B" strokeWidth="1.2" fill="none"/>
        <path d="M22 10 L26 8 L26 20 L22 18" stroke="#D4A84B" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
        <path d="M9 11 L9 17 L15 14 Z" fill="#9B2242" stroke="#D4A84B" strokeWidth="0.8" strokeLinejoin="round"/>
      </svg>
    ),
    "UI/UX Design": (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="2" stroke="#D4A84B" strokeWidth="1.2" fill="none"/>
        <circle cx="14" cy="13" r="5" stroke="#D4A84B" strokeWidth="1" fill="none"/>
        <circle cx="14" cy="13" r="2" fill="#9B2242"/>
        <line x1="14" y1="4" x2="14" y2="8" stroke="#D4A84B" strokeWidth="0.8"/>
        <line x1="14" y1="18" x2="14" y2="24" stroke="#D4A84B" strokeWidth="0.8"/>
        <line x1="4" y1="13" x2="9" y2="13" stroke="#D4A84B" strokeWidth="0.8"/>
        <line x1="19" y1="13" x2="24" y2="13" stroke="#D4A84B" strokeWidth="0.8"/>
      </svg>
    ),
    "Programming": (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M4 8 L2 14 L4 20" stroke="#D4A84B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M24 8 L26 14 L24 20" stroke="#D4A84B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M10 20 L18 8" stroke="#9B2242" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="10" cy="20" r="1.5" fill="#D4A84B"/>
        <circle cx="18" cy="8" r="1.5" fill="#D4A84B"/>
      </svg>
    ),
  };
  return icons[name] || <svg width={size} height={size} viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" stroke="#D4A84B" strokeWidth="1" fill="none"/></svg>;
}

/* ── SHARED ATOMS ─────────────────────────────────────────────────────────── */
function Av({ name, size = 48 }) {
  const [c1, c2] = avc(name||"A");
  return (
    <div style={{ width:size, height:size, background:`linear-gradient(135deg,${c1},${c2})`, border:`1px solid ${C.b}`, borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:size*0.34, color:C.gold, lineHeight:1, fontWeight:300 }}>{ini(name)}</span>
    </div>
  );
}

function Btn({ children, onClick, v="primary", size="md", full, disabled, style={} }) {
  const p = { sm:"8px 18px", md:"11px 27px", lg:"14px 40px" }[size] || "11px 27px";
  const f = { sm:8.5, md:9.5, lg:11 }[size] || 9.5;
  const vs = {
    primary: { bg:C.burg, bc:C.burgL, c:C.goldP },
    ghost:   { bg:"transparent", bc:C.b, c:C.tx2 },
    outline: { bg:"transparent", bc:C.bA, c:C.gold },
    gold:    { bg:`linear-gradient(135deg,${C.gold},${C.goldL})`, bc:C.gold, c:C.bg },
  };
  const vv = vs[v] || vs.primary;
  return (
    <button onClick={disabled?undefined:onClick} className="hl"
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, fontFamily:"'Cinzel',serif", fontSize:f, letterSpacing:"0.17em", padding:p, background:vv.bg, border:`1px solid ${vv.bc}`, color:vv.c, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.38:1, width:full?"100%":"auto", whiteSpace:"nowrap", ...style }}>
      {children}
    </button>
  );
}

function Field({ label, name, type="text", value, onChange, placeholder, options, rows, required, hint }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {label && <label style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.26em", color:C.tx3 }}>
        {label}{required && <span style={{ color:C.gold, marginLeft:3 }}>*</span>}
      </label>}
      {type==="select"
        ? <select name={name} value={value} onChange={onChange} className="fb" style={{ cursor:"pointer", background:C.s2, appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23D4A84B'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center", paddingRight:36 }}>
            <option value="">Select…</option>
            {options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        : type==="textarea"
        ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows||4} className="fb" style={{ resize:"vertical" }}/>
        : <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="fb"/>
      }
      {hint && <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12.5, color:C.tx3, fontStyle:"italic" }}>{hint}</span>}
    </div>
  );
}

function Ornament({ light }) {
  const col = light ? "rgba(212,168,75,0.3)" : C.burgD;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, justifyContent:"center", margin:"6px 0 28px" }}>
      <div style={{ flex:1, maxWidth:80, height:1, background:`linear-gradient(90deg,transparent,${col})` }}/>
      <div style={{ width:5, height:5, background:C.gold, transform:"rotate(45deg)" }}/>
      <div style={{ width:3, height:3, background:C.burg, transform:"rotate(45deg)" }}/>
      <div style={{ width:5, height:5, background:C.gold, transform:"rotate(45deg)" }}/>
      <div style={{ flex:1, maxWidth:80, height:1, background:`linear-gradient(90deg,${col},transparent)` }}/>
    </div>
  );
}

function EyebrowLabel({ children, center }) {
  return (
    <div style={{ fontFamily:"'Cinzel',serif", fontSize:8.5, letterSpacing:"0.34em", color:C.gold, marginBottom:14, textAlign:center?"center":"left", display:"flex", alignItems:"center", gap:14, justifyContent:center?"center":"flex-start" }}>
      {center && <span style={{ width:24, height:1, background:C.gold, opacity:.4, display:"inline-block" }}/>}
      {children}
      {center && <span style={{ width:24, height:1, background:C.gold, opacity:.4, display:"inline-block" }}/>}
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle, center=true }) {
  return (
    <div style={{ textAlign:center?"center":"left", marginBottom:56 }}>
      <EyebrowLabel center={center}>{eyebrow}</EyebrowLabel>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,4vw,3.5rem)", fontWeight:300, lineHeight:1.1, color:C.white }}
        dangerouslySetInnerHTML={{ __html:title }}/>
      <Ornament/>
      {subtitle && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.tx, fontWeight:300, maxWidth:480, margin:"0 auto", lineHeight:1.9 }}>{subtitle}</p>}
    </div>
  );
}

function Spinner() {
  return <div style={{ width:20, height:20, border:`2px solid ${C.b}`, borderTopColor:C.gold, borderRadius:"50%", animation:"spin .85s linear infinite" }}/>;
}

function Toast({ title, body, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="toast">
      <span style={{ color:C.gold, fontSize:16, flexShrink:0 }}>✦</span>
      <div>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.14em", color:C.gold, marginBottom:3 }}>{title}</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13.5, color:C.tx }}>{body}</div>
      </div>
    </div>
  );
}

function HireBtn({ name, lg }) {
  const sub = `Project Enquiry — ${name} | The Voryel`;
  const bod = `Hello,\n\nI came across ${name}'s profile on The Voryel and would like to discuss a project.\n\nPlease help connect us.\n\nThank you.`;
  return (
    <a href={`mailto:${VMAIL}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(bod)}`}
      className="hire-btn"
      style={lg ? { fontSize:9.5, padding:"12px 28px" } : {}}>
      ✉&ensp;Hire This Professional
    </a>
  );
}

/* ─── NAV ────────────────────────────────────────────────────────────────── */
function Nav({ page, setPage, user, onLogout }) {
  return (
    <nav className="nav">
      <Logo size="md" onClick={() => setPage("home")}/>
      <div className="nav-links">
        {[["home","Home"],["network","Network"],["contact","Contact"]].map(([id,l]) => (
          <span key={id} className={`nl${page===id?" on":""}`} onClick={() => setPage(id)}>{l}</span>
        ))}
      </div>
      <div className="nav-r">
        {user ? (
          <>
            <span className="nl" style={{ cursor:"pointer" }} onClick={() => setPage("dashboard")}>My Profile</span>
            <Btn size="sm" v="ghost" onClick={onLogout}>Sign Out</Btn>
          </>
        ) : (
          <>
            <Btn size="sm" v="ghost" onClick={() => setPage("login")}>Sign In</Btn>
            <Btn size="sm" onClick={() => setPage("signup")}>Join Free</Btn>
          </>
        )}
      </div>
    </nav>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer({ setPage }) {
  return (
    <footer style={{ background:C.s1, borderTop:`1px solid ${C.b}`, padding:"56px 0 36px" }}>
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 56px", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48 }} className="two-col">
        <div>
          <Logo size="md"/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:C.tx, fontWeight:300, marginTop:18, maxWidth:240, lineHeight:1.9 }}>
            A premium global network where clients and digital professionals connect, collaborate, and create.
          </p>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.2em", color:C.gold, marginTop:16 }}>YOUR VISION, OUR FLOW</p>
        </div>
        {[
          { h:"Platform", links:[["home","Home"],["network","Freelancer Network"],["contact","Contact"]] },
          { h:"Categories", links:CATS.map(c=>[null,c]) },
          { h:"Company", links:[[null,"Terms & Services"],[null,"Privacy Policy"]] },
        ].map(col => (
          <div key={col.h}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.22em", color:C.gold, marginBottom:18 }}>{col.h}</div>
            {col.links.map(([id,l]) => (
              <div key={l} onClick={id?()=>setPage(id):l==="Terms & Services"?()=>setPage("terms"):undefined}
                style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14.5, color:C.tx, cursor:id||l==="Terms & Services"?"pointer":"default", marginBottom:10, transition:"color .2s" }}
                onMouseEnter={e => { if(id||l==="Terms & Services") e.target.style.color=C.gold; }}
                onMouseLeave={e => e.target.style.color=C.tx}>
                {l}
              </div>
            ))}
            {col.h==="Company" && (
              <div style={{ marginTop:18 }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.14em", color:C.tx3, marginBottom:5 }}>EMAIL</div>
                <a href={`mailto:${VMAIL}`} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.gold, textDecoration:"none" }}>{VMAIL}</a>
                <div style={{ marginTop:16, display:"inline-block", fontFamily:"'Cinzel',serif", fontSize:7, letterSpacing:"0.12em", padding:"4px 11px", background:"rgba(155,34,66,0.2)", border:`1px solid ${C.burgD}`, color:C.gold }}>10% COMMISSION</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ maxWidth:1160, margin:"36px auto 0", padding:"24px 56px 0", borderTop:`1px solid ${C.b}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.13em", color:C.tx3 }}>© 2026 THE VORYEL · FOUNDED BY ADETUNJI EWAOLUWA DESTINY</span>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.12em", color:C.tx3 }}>FREE TO JOIN · DIGITAL PROFESSIONALS WORLDWIDE</span>
      </div>
    </footer>
  );
}

/* ─── FREELANCER CARD ─────────────────────────────────────────────────────── */
function FreelancerCard({ member, onClick }) {
  const skills = parseSkills(member.skills);
  const rate = member.price_label || (member.starting_price ? `from $${member.starting_price}` : member.hourly_rate ? `$${member.hourly_rate}/hr` : null);
  return (
    <div className="vcard hc" style={{ display:"flex", flexDirection:"column", overflow:"hidden", cursor:"pointer" }} onClick={onClick}>
      <div style={{ padding:"26px 24px 20px", borderBottom:`1px solid ${C.b}` }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:14 }}>
          <Av name={member.name} size={54}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18.5, fontWeight:400, color:C.white, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{member.name}</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.14em", color:C.gold }}>{member.category||"Digital Professional"}</div>
          </div>
          {rate && <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.1em", color:C.gold, background:C.goldDim, border:`1px solid ${C.b}`, padding:"4px 11px", flexShrink:0, whiteSpace:"nowrap", borderRadius:1 }}>{rate}</div>}
        </div>
        {member.bio && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14.5, color:C.tx, fontWeight:300, lineHeight:1.78, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{member.bio}</p>}
        {skills.length > 0 && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
            {skills.slice(0,4).map(s => <span key={s} style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", padding:"3px 10px", border:`1px solid ${C.b}`, color:C.tx2, borderRadius:1 }}>{s}</span>)}
            {skills.length > 4 && <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, color:C.tx3 }}>+{skills.length-4}</span>}
          </div>
        )}
      </div>
      <div style={{ padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, background:C.s2 }}>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", color:member.open_to_work!==false?C.green:C.tx3 }}>
          {member.open_to_work!==false?"● AVAILABLE":"○ BUSY"}
        </span>
        <HireBtn name={member.name}/>
      </div>
    </div>
  );
}

/* ─── PROFILE MODAL ──────────────────────────────────────────────────────── */
function ProfileModal({ member, onClose }) {
  const skills = parseSkills(member.skills);
  const tools = parseSkills(member.tools);
  const portfolio = (() => { try { return JSON.parse(member.portfolio||"[]"); } catch { return []; } })();
  const rate = member.price_label || (member.starting_price ? `from $${member.starting_price}` : member.hourly_rate ? `$${member.hourly_rate}/hr` : null);
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal fi">
        <div style={{ height:120, background:`linear-gradient(120deg,${C.burgD},#200C14 55%,${C.bg})`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 28px,rgba(212,168,75,0.04) 28px,rgba(212,168,75,0.04) 29px)" }}/>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:16, background:"transparent", border:"none", color:C.tx3, fontSize:18, cursor:"pointer", lineHeight:1 }}>✕</button>
        </div>
        <div style={{ padding:"0 32px 36px" }}>
          <div style={{ display:"flex", gap:18, alignItems:"flex-end", marginTop:-38, marginBottom:24 }}>
            <Av name={member.name} size={76}/>
            <div style={{ flex:1 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.75rem", fontWeight:300, color:C.white }}>{member.name}</h2>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:8.5, letterSpacing:"0.14em", color:C.gold, marginTop:4 }}>{member.category}</div>
            </div>
            {rate && <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.1em", color:C.gold, background:C.goldDim, border:`1px solid ${C.b}`, padding:"5px 14px" }}>{rate}</div>}
          </div>
          {member.bio && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.gold, marginBottom:10 }}>ABOUT</div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15.5, color:C.tx, fontWeight:300, lineHeight:1.85 }}>{member.bio}</p>
            </div>
          )}
          {portfolio.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.gold, marginBottom:12 }}>PORTFOLIO</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {portfolio.map((item,i) => (
                  <div key={i} style={{ aspectRatio:"4/3", background:C.s2, border:`1px solid ${C.b}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:12 }}>
                    <LogoMark size={20}/>
                    <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, color:C.tx2, letterSpacing:"0.1em", marginTop:8, textAlign:"center" }}>{item.title||"Work sample"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
            {skills.length>0 && (
              <div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.gold, marginBottom:10 }}>SKILLS</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {skills.map(s => <span key={s} style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", padding:"3px 9px", border:`1px solid ${C.b}`, color:C.tx2 }}>{s}</span>)}
                </div>
              </div>
            )}
            {tools.length>0 && (
              <div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.gold, marginBottom:10 }}>TOOLS</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {tools.map(t => <span key={t} style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", padding:"3px 9px", border:`1px solid ${C.b}`, color:C.tx2 }}>{t}</span>)}
                </div>
              </div>
            )}
          </div>
          <div style={{ borderTop:`1px solid ${C.b}`, paddingTop:22, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", color:member.open_to_work!==false?C.green:C.tx3, marginBottom:4 }}>
                {member.open_to_work!==false?"● AVAILABLE FOR PROJECTS":"○ NOT AVAILABLE RIGHT NOW"}
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, color:C.tx3 }}>Member of The Voryel</div>
            </div>
            <HireBtn name={member.name} lg/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════════════════════════════ */
function Home({ setPage, members, loading }) {
  const freelancers = members.filter(m => m.role==="freelancer"||m.user_type==="freelancer");

  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingTop:62 }}>

      {/* ── HERO — editorial left-aligned layout ── */}
      <section style={{ minHeight:"94vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", padding:"0 10% 0 7%" }}>
        {/* Warm background wash */}
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 65% 75% at 15% 55%,rgba(155,34,66,0.2) 0%,transparent 70%)` }}/>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 50% 55% at 85% 40%,rgba(212,168,75,0.06) 0%,transparent 65%)` }}/>
        {/* Subtle grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(212,168,75,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,75,0.07) 1px,transparent 1px)`, backgroundSize:"64px 64px", maskImage:"radial-gradient(ellipse 90% 90% at 30% 50%,black 5%,transparent 100%)", opacity:.5 }}/>
        {/* Content */}
        <div style={{ position:"relative", zIndex:1, maxWidth:620 }}>
          <div className="fu d1" style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.38em", color:C.gold, marginBottom:24, display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ width:32, height:1, background:C.gold, opacity:.45, display:"inline-block" }}/> YOUR VISION, OUR FLOW
          </div>
          <h1 className="fu d2" style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(3.4rem,6.5vw,6.4rem)", letterSpacing:"-0.01em", lineHeight:1.05, color:C.white, marginBottom:0 }}>
            Where Vision
          </h1>
          <h1 className="fu d3" style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(3.4rem,6.5vw,6.4rem)", letterSpacing:"-0.01em", lineHeight:1.08, color:C.gold, fontStyle:"italic", marginBottom:30 }}>
            Meets Craft
          </h1>
          <div className="fu d3" style={{ width:60, height:2, background:`linear-gradient(90deg,${C.burg},${C.gold})`, marginBottom:28 }}/>
          <p className="fu d4" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17.5, color:C.tx, fontWeight:300, maxWidth:500, marginBottom:44, lineHeight:1.9 }}>
            A premium global network where clients and skilled digital professionals discover, connect, and collaborate on meaningful work.
          </p>
          <div className="fu d5" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <Btn size="lg" v="gold" onClick={() => setPage("signup")}>Join The Voryel — Free</Btn>
            <Btn size="lg" v="ghost" onClick={() => setPage("network")}>Browse the Network</Btn>
          </div>
        </div>
        {/* Hero illustration */}
        <HeroGraphic/>
        {/* Scroll cue */}
        <div style={{ position:"absolute", bottom:36, left:"7%", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:1, background:`linear-gradient(90deg,${C.gold},transparent)`, animation:"pulse 2.5s ease-in-out infinite" }}/>
          <span style={{ fontFamily:"'Cinzel',serif", fontSize:7, letterSpacing:"0.22em", color:C.tx3 }}>SCROLL</span>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div style={{ borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, background:C.s1 }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 56px", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }} className="stats-row">
          {[
            [loading?"—":freelancers.length, "Members in Network"],
            ["6", "Creative Categories"],
            ["Free", "Access at Launch"],
            ["Global", "Digital Platform"],
          ].map(([n,l],i) => (
            <div key={l} style={{ padding:"32px 20px", textAlign:"center", borderRight:i<3?`1px solid ${C.b}`:"none" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.7rem", fontWeight:300, color:C.gold, lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.16em", color:C.tx3, marginTop:6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS — horizontal timeline layout ── */}
      <section style={{ padding:"96px 0", background:C.s1 }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 56px" }}>
          <SectionTitle eyebrow="HOW IT WORKS" title="Simple by design.<br/><em style='color:#D4A84B'>Powerful by nature.</em>" subtitle="From first connection to final delivery — every step is clear, trusted, and premium."/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.b }} className="proc-wrap">
            {[
              { n:"01", icon:<CatIcon name="UI/UX Design" size={34}/>, t:"Build Your Profile", b:"Freelancers set their rates and showcase their portfolio. Clients describe their vision and project needs." },
              { n:"02", icon:<CatIcon name="Web Design" size={34}/>, t:"Browse the Network", b:"Discover talented professionals by category and skill. Every profile is a curated, real presentation of expertise." },
              { n:"03", icon:<CatIcon name="Programming" size={34}/>, t:"Hire This Professional", b:"Click 'Hire This Professional'. It opens a direct email to The Voryel — we manage every introduction securely." },
              { n:"04", icon:<CatIcon name="Graphic Design" size={34}/>, t:"Create Together", b:"Agree on scope, work through milestones, and deliver exceptional digital work — trusted from start to finish." },
            ].map(s => (
              <div key={s.n} style={{ background:C.s1, padding:"40px 30px", position:"relative", transition:"background .3s" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.s2}
                onMouseLeave={e=>e.currentTarget.style.background=C.s1}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"4rem", fontWeight:300, color:"rgba(212,168,75,0.07)", lineHeight:1, position:"absolute", top:14, right:18, userSelect:"none" }}>{s.n}</div>
                <div style={{ marginBottom:20 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.14em", color:C.gold, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                  <span>{s.n}</span><span style={{ width:20, height:1, background:C.burg, display:"inline-block" }}/>
                </div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.25rem", fontWeight:400, color:C.white, marginBottom:10 }}>{s.t}</h3>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.tx, fontWeight:300, lineHeight:1.85 }}>{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY THE VORYEL — 2-col alternating layout ── */}
      <section style={{ padding:"96px 0", background:C.bg }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 56px" }}>
          <SectionTitle eyebrow="WHY THE VORYEL" title="Not just a platform.<br/><em style='color:#D4A84B'>A premium network.</em>"/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }} className="why-wrap">
            {[
              { icon:<CatIcon name="Graphic Design" size={30}/>, t:"Real Profiles", b:"Every member builds a genuine identity — bio, portfolio, skills, and pricing on display. No throwaway accounts." },
              { icon:<CatIcon name="Web Development" size={30}/>, t:"Managed Connections", b:"All client contact routes through The Voryel's official email. Every introduction is accountable and professionally managed." },
              { icon:<CatIcon name="Programming" size={30}/>, t:"Set Your Own Rates", b:"Freelancers control their pricing completely. Publish your starting price or hourly rate so clients know before they reach out." },
              { icon:<CatIcon name="Video Editing" size={30}/>, t:"Digital Only", b:"This network is exclusively for digital work. No physical services. No offline noise. Just focused, premium collaboration." },
              { icon:<CatIcon name="UI/UX Design" size={30}/>, t:"Portfolio Showcase", b:"Post your best work directly on your profile. Give clients a rich, visual view of your craft before they even reach out." },
              { icon:<CatIcon name="Web Design" size={30}/>, t:"Global Reach", b:"Connect with clients and professionals from anywhere in the world. Distance is no barrier to exceptional digital work." },
            ].map(c => (
              <div key={c.t} style={{ background:C.s1, border:`1px solid ${C.b}`, padding:"36px 30px", transition:"all .28s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.s2; e.currentTarget.style.borderColor=C.bA; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=C.s1; e.currentTarget.style.borderColor=C.b; }}>
                <div style={{ marginBottom:18 }}>{c.icon}</div>
                <h4 style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.14em", color:C.white, marginBottom:10 }}>{c.t}</h4>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14.5, color:C.tx, fontWeight:300, lineHeight:1.88 }}>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES — rich icon grid ── */}
      <section style={{ background:C.s1, padding:"96px 0" }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 56px" }}>
          <SectionTitle eyebrow="CATEGORIES" title="Every discipline,<br/><em style='color:#D4A84B'>one network</em>" subtitle="Six areas of elite digital craft — all in one place."/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }} className="cat-wrap">
            {[
              { n:"Web Development", d:"Full-stack, frontend, backend & API engineering" },
              { n:"Web Design", d:"Landing pages, websites & digital experiences" },
              { n:"Graphic Design", d:"Brand identity, logos & visual communication" },
              { n:"Video Editing", d:"Post-production, motion graphics & storytelling" },
              { n:"UI/UX Design", d:"Product design, user research & prototyping" },
              { n:"Programming", d:"Software, automation & custom applications" },
            ].map(({ n, d }) => (
              <div key={n} className="hc" style={{ background:C.s2, border:`1px solid ${C.b}`, padding:"32px 28px", cursor:"pointer", position:"relative", overflow:"hidden" }}
                onClick={() => setPage("network")}>
                {/* Large faded icon in background */}
                <div style={{ position:"absolute", bottom:-12, right:-8, opacity:.06 }}>
                  <CatIcon name={n} size={80}/>
                </div>
                <div style={{ marginBottom:18, position:"relative", zIndex:1 }}>
                  <CatIcon name={n} size={32}/>
                </div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.25rem", fontWeight:400, color:C.white, marginBottom:7, position:"relative", zIndex:1 }}>{n}</h3>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13.5, color:C.tx2, fontWeight:300, position:"relative", zIndex:1 }}>{d}</p>
                <div style={{ position:"absolute", top:20, right:20, fontFamily:"'Cinzel',serif", fontSize:10, color:C.tx3, transition:"all .25s", zIndex:1 }}>↗</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:36 }}>
            <Btn v="outline" size="lg" onClick={() => setPage("network")}>Browse All Professionals →</Btn>
          </div>
        </div>
      </section>

      {/* ── FEATURED FREELANCERS ── */}
      {freelancers.length > 0 && (
        <section style={{ padding:"80px 0", background:C.bg }}>
          <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 56px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:36 }}>
              <div>
                <EyebrowLabel>FEATURED MEMBERS</EyebrowLabel>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.4rem", fontWeight:300, color:C.white }}>Meet the <em style={{ color:C.gold }}>Network</em></h2>
              </div>
              <Btn v="outline" size="sm" onClick={() => setPage("network")}>View All →</Btn>
            </div>
            <div className="net-grid">
              {freelancers.slice(0,3).map(m => <FreelancerCard key={m.id} member={m} onClick={() => {}}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ── TWO PATHS ── */}
      <section style={{ padding:"80px 0", background:C.s1 }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 56px" }}>
          <SectionTitle eyebrow="JOIN US" title="Two paths.<br/><em style='color:#D4A84B'>One community.</em>"/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }} className="two-col">
            {[
              { type:"For Clients", icon:<CatIcon name="Web Design" size={40}/>, tag:"FREE TO USE", desc:"Bring your vision. Browse the network and connect with talented digital professionals — completely free.", items:["Create a client profile","Browse the full Freelancer Network","Click 'Hire This Professional' to connect instantly","Pay only what you agree directly with the freelancer"] },
              { type:"For Freelancers", icon:<CatIcon name="Programming" size={40}/>, tag:"SET YOUR OWN RATES", desc:"Show your craft. Build your identity, set your pricing, and get discovered by clients who value exceptional work.", items:["Create your profile & portfolio","Set your own rates — full control","Get discovered by quality clients worldwide","Transparent commission on completed projects"] },
            ].map(p => (
              <div key={p.type} style={{ background:C.s2, border:`1px solid ${C.b}`, padding:"42px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${C.burg},${C.gold},transparent)` }}/>
                <div style={{ marginBottom:20 }}>{p.icon}</div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.14em", color:C.white }}>{p.type}</span>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", padding:"3px 9px", background:"rgba(155,34,66,0.25)", border:`1px solid ${C.burg}`, color:C.gold }}>{p.tag}</span>
                </div>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15.5, color:C.tx, fontWeight:300, lineHeight:1.88, marginBottom:20 }}>{p.desc}</p>
                <ul style={{ listStyle:"none", marginBottom:28 }}>
                  {p.items.map(i => (
                    <li key={i} style={{ display:"flex", gap:12, marginBottom:11, fontFamily:"'Cormorant Garamond',serif", fontSize:14.5, color:C.tx }}>
                      <span style={{ color:C.gold, flexShrink:0 }}>—</span>{i}
                    </li>
                  ))}
                </ul>
                <Btn onClick={() => setPage("signup")}>Join as {p.type.split(" ")[1]}</Btn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"80px 0", textAlign:"center", background:`linear-gradient(135deg,${C.burgD} 0%,${C.bg} 55%)`, borderTop:`1px solid ${C.b}` }}>
        <div style={{ maxWidth:600, margin:"0 auto", padding:"0 56px" }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,4.2vw,3.6rem)", fontWeight:300, color:C.white, marginBottom:10 }}>
            Ready to enter <em style={{ color:C.gold }}>The Voryel</em>?
          </h2>
          <Ornament/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16.5, color:C.tx, fontWeight:300, marginBottom:36, lineHeight:1.9 }}>
            Free to join. Free to explore. Your premium network awaits.
          </p>
          <Btn size="lg" v="gold" onClick={() => setPage("signup")}>Join The Voryel — It's Free →</Btn>
        </div>
      </section>

      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NETWORK PAGE
══════════════════════════════════════════════════════════════════════════ */
function Network({ setPage, members, loading }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const freelancers = members.filter(m => m.role==="freelancer"||m.user_type==="freelancer");
  const filtered = freelancers.filter(m => {
    const okCat = cat==="All" || m.category===cat;
    const q = search.toLowerCase();
    const okQ = !q || (m.name||"").toLowerCase().includes(q) || (m.bio||"").toLowerCase().includes(q) || (m.category||"").toLowerCase().includes(q) || (m.skills||"").toLowerCase().includes(q);
    return okCat && okQ;
  });

  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingTop:62 }}>
      {viewing && <ProfileModal member={viewing} onClose={() => setViewing(null)}/>}

      <div style={{ background:`linear-gradient(135deg,${C.burgD},${C.bg})`, borderBottom:`1px solid ${C.b}`, padding:"64px 56px 52px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(212,168,75,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,75,.05) 1px,transparent 1px)`, backgroundSize:"58px 58px", opacity:.6 }}/>
        <div style={{ position:"absolute", right:56, top:"50%", transform:"translateY(-50%)", opacity:.3 }}>
          <NetworkGraphic/>
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:640 }}>
          <EyebrowLabel>FREELANCER NETWORK</EyebrowLabel>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.2rem,4.8vw,4rem)", fontWeight:300, color:C.white, marginBottom:10 }}>
            Find Your Perfect <em style={{ color:C.gold }}>Collaborator</em>
          </h1>
          <Ornament/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.tx, fontWeight:300, maxWidth:480, marginBottom:28, lineHeight:1.9 }}>
            Browse the network. View full profiles and portfolios. Click <strong style={{ color:C.gold }}>'Hire This Professional'</strong> to connect instantly via email.
          </p>
          <div style={{ display:"flex", maxWidth:520, marginBottom:16, background:"rgba(253,248,242,0.04)", border:`1px solid ${C.b}`, overflow:"hidden" }}>
            <input className="fb" style={{ flex:1, border:"none", background:"transparent", fontSize:14.5 }} placeholder="Search by name, skill, or category…" value={search} onChange={e => setSearch(e.target.value)}/>
            <div style={{ padding:"12px 16px", color:C.tx3, borderLeft:`1px solid ${C.b}` }}>⌕</div>
          </div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {["All",...CATS].map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", padding:"7px 15px", border:`1px solid ${cat===c?C.bA:C.b}`, background:cat===c?"rgba(155,34,66,.28)":"transparent", color:cat===c?C.gold:C.tx3, cursor:"pointer", transition:"all .2s" }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1160, margin:"0 auto", padding:"48px 56px 80px" }}>
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}><Spinner/></div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"88px 40px", border:`1px dashed ${C.b}` }}>
            <div style={{ marginBottom:20, opacity:.3 }}><LogoMark size={48}/></div>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.75rem", fontWeight:300, color:C.white, marginBottom:10 }}>
              {freelancers.length===0 ? "No members yet" : "No results found"}
            </h3>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15.5, color:C.tx, fontWeight:300, maxWidth:340, margin:"0 auto 28px", lineHeight:1.88 }}>
              {freelancers.length===0 ? "Be the first to join The Voryel and define what this community becomes." : "Try a different search or category."}
            </p>
            {freelancers.length===0 && <Btn onClick={() => setPage("signup")}>Join as Freelancer</Btn>}
          </div>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15.5, color:C.tx }}>{filtered.length} professional{filtered.length!==1?"s":""} found</span>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", color:C.tx3 }}>CLICK A CARD · FULL PROFILE OPENS</span>
            </div>
            <div className="net-grid">
              {filtered.map(m => <FreelancerCard key={m.id} member={m} onClick={() => setViewing(m)}/>)}
            </div>
          </>
        )}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════════════════════ */
function Auth({ mode, setPage, onAuth }) {
  const isLogin = mode==="login";
  const [role, setRole] = useState("freelancer");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [d, setD] = useState({ name:"",email:"",password:"",bio:"",category:"",skillsRaw:"",toolsRaw:"",price_type:"project",starting_price:"",hourly_rate:"",price_label:"",company:"",project_needs:"",open_to_work:true });
  const h = e => setD({...d,[e.target.name]:e.target.value});

  const doLogin = async () => {
    setErr(""); setLoading(true);
    const user = await db.byEmail(d.email.toLowerCase().trim());
    setLoading(false);
    if (!user) { setErr("No account found with that email."); return; }
    if (user.password !== d.password) { setErr("Incorrect password."); return; }
    onAuth(user); setPage("home");
  };

  const doSignup = async () => {
    if (!agreed) { setErr("You must agree to the Terms & Services to continue."); return; }
    setErr(""); setLoading(true);
    const existing = await db.byEmail(d.email.toLowerCase().trim());
    if (existing) { setErr("An account with this email already exists."); setLoading(false); return; }
    const skills = d.skillsRaw.split(",").map(s=>s.trim()).filter(Boolean);
    const tools = d.toolsRaw.split(",").map(s=>s.trim()).filter(Boolean);
    const result = await db.insert({ name:d.name.trim(),email:d.email.toLowerCase().trim(),password:d.password,bio:d.bio,category:d.category,skills:JSON.stringify(skills),tools:JSON.stringify(tools),user_type:role,role,open_to_work:role==="freelancer"?d.open_to_work:null,company:d.company,project_needs:d.project_needs,starting_price:d.starting_price||null,hourly_rate:d.hourly_rate||null,price_type:d.price_type,price_label:d.price_label||null,portfolio:JSON.stringify([]),joined_at:new Date().toISOString() });
    setLoading(false);
    if (Array.isArray(result) && result[0]) { onAuth(result[0]); setPage("home"); }
    else setErr("Something went wrong. Please try again.");
  };

  const steps = role==="freelancer" ? ["Account","Profile","Pricing","Finish"] : ["Account","Finish"];

  return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }} className="auth-layout">
      {/* LEFT */}
      <div style={{ background:`linear-gradient(150deg,${C.burgD} 0%,#140610 60%,${C.bg} 100%)`, padding:"56px", display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(212,168,75,.042) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,75,.042) 1px,transparent 1px)`, backgroundSize:"52px 52px" }}/>
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", top:-100, left:-100, background:`radial-gradient(circle,rgba(155,34,66,0.28) 0%,transparent 70%)`, filter:"blur(55px)" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <Logo size="lg"/>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.8rem", fontWeight:300, lineHeight:1.18, marginTop:44, marginBottom:24, color:C.white }}>
            {isLogin ? "Welcome\nback." : "Begin your\njourney."}
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            {(isLogin
              ? ["Your profile awaits","Reconnect with the network","Continue where you left off"]
              : role==="freelancer"
              ? ["Set your own rates & pricing","Post your portfolio & showcase your work","Get discovered by quality clients globally","Free access — always"]
              : ["Browse the full Freelancer Network","Click 'Hire This Professional' to connect","Pay zero platform fees — ever","Free access — always"]
            ).map(f => (
              <div key={f} style={{ display:"flex", gap:11, fontSize:"0.8rem", color:C.tx, fontFamily:"'Cormorant Garamond',serif" }}>
                <span style={{ color:C.gold, flexShrink:0 }}>✦</span>{f}
              </div>
            ))}
          </div>
          {!isLogin && role==="freelancer" && (
            <div style={{ background:"rgba(155,34,66,.18)", border:`1px solid ${C.b}`, padding:"14px 17px", marginTop:26, fontFamily:"'Cormorant Garamond',serif", fontSize:13.5, color:C.tx, lineHeight:1.78 }}>
              <strong style={{ color:C.gold, fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.12em" }}>COMMISSION</strong><br/>
              A <strong style={{ color:C.gold }}>10% platform commission</strong> is deducted from your earnings on each completed project. Clients pay no fees.
            </div>
          )}
        </div>
        <p style={{ position:"relative", zIndex:1, fontFamily:"'Cinzel',serif", fontSize:7, letterSpacing:"0.14em", color:C.tx3 }}>© 2026 THE VORYEL · {VMAIL}</p>
      </div>

      {/* RIGHT */}
      <div style={{ background:C.s1, padding:"52px 60px", display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"auto" }}>
        <div style={{ marginBottom:30 }}><Logo size="md"/></div>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.9rem", fontWeight:300, color:C.white, marginBottom:5 }}>{isLogin?"Sign in":"Create your account"}</h3>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:C.tx, fontWeight:300, marginBottom:24 }}>{isLogin?"Welcome back.":"Join The Voryel — free access at launch."}</p>

        {!isLogin && (
          <div style={{ display:"flex", border:`1px solid ${C.b}`, marginBottom:22, overflow:"hidden" }}>
            {[["freelancer","I'm a Freelancer"],["client","I'm a Client"]].map(([r,l]) => (
              <button key={r} onClick={() => { setRole(r); setStep(1); setErr(""); setAgreed(false); }} style={{ flex:1, padding:"11px", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.13em", border:"none", cursor:"pointer", background:role===r?C.burg:"transparent", color:role===r?C.goldP:C.tx2, transition:"all .2s" }}>{l}</button>
            ))}
          </div>
        )}

        {!isLogin && role==="freelancer" && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:22 }}>
            {steps.map((s,i) => (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:8, flex:i<steps.length-1?1:"auto" }}>
                <div className={`sdot${step===i+1?" active":step>i+1?" done":" idle"}`}>{step>i+1?"✓":i+1}</div>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:7, letterSpacing:"0.1em", color:step===i+1?C.gold:C.tx3 }}>{s}</span>
                {i<steps.length-1 && <div style={{ flex:1, height:1, background:C.b }}/>}
              </div>
            ))}
          </div>
        )}

        {err && <div style={{ background:"rgba(200,60,60,.1)", border:"1px solid rgba(200,60,60,.38)", padding:"10px 14px", marginBottom:14, fontFamily:"'Cormorant Garamond',serif", fontSize:14.5, color:"#E88" }}>{err}</div>}

        {/* LOGIN */}
        {isLogin && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Field label="EMAIL" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
            <Field label="PASSWORD" name="password" type="password" value={d.password} onChange={h} placeholder="••••••••" required/>
            <Btn full onClick={doLogin} disabled={loading}>{loading?"SIGNING IN…":"SIGN IN"}</Btn>
            <div style={{ textAlign:"center", position:"relative", margin:"6px 0" }}>
              <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:C.b }}/>
              <span style={{ background:C.s1, padding:"0 13px", position:"relative", fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.14em", color:C.tx3 }}>NEW HERE?</span>
            </div>
            <Btn full v="ghost" onClick={() => setPage("signup")}>CREATE AN ACCOUNT</Btn>
          </div>
        )}

        {/* CLIENT SIGNUP */}
        {!isLogin && role==="client" && (
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Field label="FULL NAME" name="name" value={d.name} onChange={h} placeholder="Your name" required/>
              <Field label="COMPANY (optional)" name="company" value={d.company} onChange={h} placeholder="Your brand"/>
            </div>
            <Field label="EMAIL" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
            <Field label="PASSWORD" name="password" type="password" value={d.password} onChange={h} placeholder="Create a password" required/>
            <Field label="WHAT DO YOU NEED?" name="project_needs" type="textarea" value={d.project_needs} onChange={h} placeholder="What kind of projects are you looking to commission?" rows={3}/>
            <div style={{ display:"flex", gap:11, alignItems:"flex-start", background:`${C.goldDim}`, border:`1px solid ${C.b}`, padding:"13px 15px" }}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:4, accentColor:C.burg, flexShrink:0, width:14, height:14 }}/>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.tx, lineHeight:1.65 }}>
                I have read and agree to The Voryel's{" "}
                <span style={{ color:C.gold, cursor:"pointer", textDecoration:"underline" }} onClick={() => setPage("terms")}>Terms & Services</span>.
                I understand The Voryel is free to use as a client.
              </p>
            </div>
            <Btn full onClick={doSignup} disabled={loading||!agreed}>{loading?"CREATING…":"JOIN AS CLIENT — FREE"}</Btn>
            <div style={{ textAlign:"center" }}>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.1em", color:C.tx3 }}>ALREADY A MEMBER? </span>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.1em", color:C.gold, cursor:"pointer" }} onClick={() => setPage("login")}>SIGN IN</span>
            </div>
          </div>
        )}

        {/* FREELANCER SIGNUP STEPS */}
        {!isLogin && role==="freelancer" && (
          <>
            {step===1 && (
              <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                <Field label="FULL NAME" name="name" value={d.name} onChange={h} placeholder="Your full name" required/>
                <Field label="EMAIL" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
                <Field label="PASSWORD" name="password" type="password" value={d.password} onChange={h} placeholder="Create a password" required/>
                <Btn full onClick={() => { if(!d.name||!d.email||!d.password){setErr("Please fill all fields.");return;} setErr(""); setStep(2); }}>CONTINUE →</Btn>
              </div>
            )}
            {step===2 && (
              <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                <Field label="YOUR DISCIPLINE" name="category" type="select" value={d.category} onChange={h} options={CATS} required/>
                <Field label="YOUR BIO" name="bio" type="textarea" value={d.bio} onChange={h} placeholder="Tell clients about your expertise and approach…" rows={3}/>
                <Field label="SKILLS (comma-separated)" name="skillsRaw" value={d.skillsRaw} onChange={h} placeholder="e.g. Figma, React, Brand Design"/>
                <Field label="TOOLS (comma-separated)" name="toolsRaw" value={d.toolsRaw} onChange={h} placeholder="e.g. Adobe Suite, VS Code"/>
                <div style={{ display:"flex", gap:9 }}>
                  <Btn size="sm" v="ghost" onClick={() => { setStep(1); setErr(""); }}>BACK</Btn>
                  <Btn size="sm" onClick={() => { if(!d.category){setErr("Please select your discipline.");return;} setErr(""); setStep(3); }}>CONTINUE →</Btn>
                </div>
              </div>
            )}
            {step===3 && (
              <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.2em", color:C.gold }}>SET YOUR RATES</div>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14.5, color:C.tx, fontWeight:300, lineHeight:1.78 }}>Set your pricing clearly so clients know what to expect before reaching out.</p>
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.tx3, marginBottom:8 }}>PRICING TYPE</div>
                  <div style={{ display:"flex", gap:7 }}>
                    {[["project","Per Project"],["hourly","Hourly"],["both","Both"]].map(([v,l]) => (
                      <div key={v} onClick={() => setD({...d,price_type:v})} style={{ flex:1, padding:"9px", border:`1px solid ${d.price_type===v?C.burg:C.b}`, cursor:"pointer", textAlign:"center", background:d.price_type===v?"rgba(155,34,66,.25)":"transparent", transition:"all .2s" }}>
                        <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:d.price_type===v?C.gold:C.tx }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {(d.price_type==="project"||d.price_type==="both") && <Field label="STARTING PRICE (USD)" name="starting_price" type="number" value={d.starting_price} onChange={h} placeholder="e.g. 500" hint="Minimum project price"/>}
                {(d.price_type==="hourly"||d.price_type==="both") && <Field label="HOURLY RATE (USD)" name="hourly_rate" type="number" value={d.hourly_rate} onChange={h} placeholder="e.g. 75"/>}
                <Field label="CUSTOM LABEL (optional)" name="price_label" value={d.price_label} onChange={h} placeholder='e.g. "from $500"' hint="Shown on your profile card"/>
                {d.starting_price && <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13.5, color:C.tx3, fontStyle:"italic" }}>On a ${d.starting_price} project, after 10% commission, you receive <strong style={{ color:C.gold }}>${(parseFloat(d.starting_price)*0.9).toFixed(2)}</strong>.</div>}
                <div style={{ display:"flex", gap:9 }}>
                  <Btn size="sm" v="ghost" onClick={() => { setStep(2); setErr(""); }}>BACK</Btn>
                  <Btn size="sm" onClick={() => { setErr(""); setStep(4); }}>CONTINUE →</Btn>
                </div>
              </div>
            )}
            {step===4 && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.tx3, marginBottom:8 }}>AVAILABILITY</div>
                  <div style={{ display:"flex", gap:7 }}>
                    {[[true,"Yes — Available"],[false,"Not Right Now"]].map(([val,label]) => (
                      <div key={String(val)} onClick={() => setD({...d,open_to_work:val})} style={{ flex:1, padding:"9px", border:`1px solid ${d.open_to_work===val?C.burg:C.b}`, cursor:"pointer", textAlign:"center", background:d.open_to_work===val?"rgba(155,34,66,.25)":"transparent", transition:"all .2s" }}>
                        <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:d.open_to_work===val?C.gold:C.tx }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* COMPULSORY T&S */}
                <div style={{ background:C.goldDim, border:`1px solid ${agreed?C.bA:C.b}`, padding:"16px", transition:"border-color .2s" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.18em", color:C.gold, marginBottom:10 }}>TERMS & SERVICES — REQUIRED</div>
                  <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop:4, accentColor:C.burg, flexShrink:0, width:14, height:14 }}/>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.tx, lineHeight:1.65 }}>
                      I have read and agree to The Voryel's{" "}
                      <span style={{ color:C.gold, cursor:"pointer", textDecoration:"underline" }} onClick={() => setPage("terms")}>Terms & Services</span>,
                      including the <strong style={{ color:C.gold }}>10% commission</strong> deducted from my earnings on completed projects.
                    </p>
                  </div>
                  <div style={{ marginTop:10 }}>
                    <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.12em", color:C.gold, cursor:"pointer", textDecoration:"underline" }} onClick={() => setPage("terms")}>READ FULL TERMS →</span>
                  </div>
                </div>
                {!agreed && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13.5, color:"rgba(220,90,90,.85)", fontStyle:"italic" }}>You must agree to the Terms & Services to create your account.</p>}
                <div style={{ display:"flex", gap:9 }}>
                  <Btn size="sm" v="ghost" onClick={() => { setStep(3); setErr(""); }}>BACK</Btn>
                  <Btn size="sm" onClick={doSignup} disabled={loading||!agreed}>{loading?"CREATING…":"CREATE MY PROFILE →"}</Btn>
                </div>
                <div style={{ textAlign:"center" }}>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, color:C.tx3 }}>ALREADY A MEMBER? </span>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, color:C.gold, cursor:"pointer" }} onClick={() => setPage("login")}>SIGN IN</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════════════ */
function Dashboard({ user, setPage, onUpdate }) {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const isFreelancer = user.role==="freelancer"||user.user_type==="freelancer";
  const [form, setForm] = useState({ bio:user.bio||"",category:user.category||"",skillsRaw:parseSkills(user.skills).join(", "),toolsRaw:parseSkills(user.tools).join(", "),starting_price:user.starting_price||"",hourly_rate:user.hourly_rate||"",price_type:user.price_type||"project",price_label:user.price_label||"",open_to_work:user.open_to_work!==false,company:user.company||"",project_needs:user.project_needs||"" });
  const fh = e => setForm({...form,[e.target.name]:e.target.value});
  const [portfolio, setPortfolio] = useState(() => { try { return JSON.parse(user.portfolio||"[]"); } catch { return []; } });
  const [portTitle, setPortTitle] = useState("");
  const [portDesc, setPortDesc] = useState("");
  const [addingPort, setAddingPort] = useState(false);

  const addPortItem = async () => {
    if (!portTitle.trim()) return;
    const updated = [...portfolio, { type:"text", title:portTitle.trim(), desc:portDesc.trim(), added:new Date().toISOString() }];
    setPortfolio(updated); setPortTitle(""); setPortDesc(""); setAddingPort(false);
    await db.update(user.id, { portfolio:JSON.stringify(updated) });
    onUpdate({ ...user, portfolio:JSON.stringify(updated) });
  };
  const removePort = async i => {
    const updated = portfolio.filter((_,idx)=>idx!==i);
    setPortfolio(updated);
    await db.update(user.id, { portfolio:JSON.stringify(updated) });
    onUpdate({ ...user, portfolio:JSON.stringify(updated) });
  };
  const save = async () => {
    setSaving(true);
    const skills = form.skillsRaw.split(",").map(s=>s.trim()).filter(Boolean);
    const tools = form.toolsRaw.split(",").map(s=>s.trim()).filter(Boolean);
    const updated = await db.update(user.id, { bio:form.bio,category:form.category,skills:JSON.stringify(skills),tools:JSON.stringify(tools),starting_price:form.starting_price||null,hourly_rate:form.hourly_rate||null,price_type:form.price_type,price_label:form.price_label||null,open_to_work:form.open_to_work,company:form.company,project_needs:form.project_needs });
    setSaving(false);
    if (Array.isArray(updated)&&updated[0]) { onUpdate(updated[0]); setEditing(false); }
  };

  const skills = parseSkills(user.skills);
  const rate = user.price_label||(user.starting_price?`from $${user.starting_price}`:user.hourly_rate?`$${user.hourly_rate}/hr`:null);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingTop:62 }}>
      <div style={{ height:190, background:`linear-gradient(120deg,${C.burgD} 0%,#1A0A12 40%,${C.bg} 100%)`, borderBottom:`1px solid ${C.b}`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(212,168,75,0.04) 30px,rgba(212,168,75,0.04) 31px)" }}/>
      </div>
      <div style={{ maxWidth:1060, margin:"0 auto", padding:"0 52px 80px" }}>
        <div style={{ display:"flex", gap:24, alignItems:"flex-end", marginTop:-48, marginBottom:38 }}>
          <Av name={user.name} size={96}/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:5 }}>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.9rem", fontWeight:300, color:C.white }}>{user.name}</h1>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.12em", padding:"3px 10px", ...(isFreelancer?{background:"rgba(155,34,66,.3)",border:`1px solid ${C.burg}`,color:C.gold}:{background:"rgba(26,58,106,.25)",border:"1px solid rgba(26,58,106,.5)",color:C.blue}) }}>{isFreelancer?"FREELANCER":"CLIENT"}</span>
              {rate && isFreelancer && <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.1em", color:C.gold, background:C.goldDim, border:`1px solid ${C.b}`, padding:"3px 10px" }}>{rate}</span>}
            </div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.12em", color:C.gold }}>{user.category}</div>
            {user.company && <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.tx, marginTop:3 }}>{user.company}</div>}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn size="sm" v="ghost" onClick={() => setEditing(!editing)}>{editing?"CANCEL":"EDIT PROFILE"}</Btn>
            <Btn size="sm" v="outline" onClick={() => setPage("network")}>{isFreelancer?"VIEW NETWORK":"BROWSE FREELANCERS"}</Btn>
          </div>
        </div>
        <div style={{ borderBottom:`1px solid ${C.b}`, marginBottom:36, display:"flex" }}>
          {(isFreelancer?["profile","portfolio","pricing"]:["profile","needs"]).map(t => (
            <button key={t} className={`tab-btn${tab===t?" on":""}`} onClick={() => { setTab(t); setEditing(false); }}>{t.toUpperCase()}</button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 290px", gap:32 }} className="two-col">
          <div>
            {/* PROFILE */}
            {tab==="profile" && !editing && (
              <div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.35rem", fontWeight:300, color:C.white, marginBottom:16 }}>About</h3>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15.5, color:user.bio?C.tx:C.tx3, fontWeight:300, lineHeight:1.88, marginBottom:24, fontStyle:user.bio?"normal":"italic" }}>{user.bio||"No bio yet — click Edit Profile to add one."}</p>
                {isFreelancer && skills.length>0 && (
                  <>
                    <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:300, color:C.white, marginBottom:12 }}>Skills</h3>
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>{skills.map(s=><span key={s} style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.1em", padding:"3px 10px", border:`1px solid ${C.b}`, color:C.tx2 }}>{s}</span>)}</div>
                  </>
                )}
              </div>
            )}
            {tab==="profile" && editing && (
              <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                <Field label="BIO" name="bio" type="textarea" value={form.bio} onChange={fh} placeholder="Tell clients about yourself…" rows={4}/>
                {isFreelancer && <Field label="DISCIPLINE" name="category" type="select" value={form.category} onChange={fh} options={CATS}/>}
                {isFreelancer && <Field label="SKILLS" name="skillsRaw" value={form.skillsRaw} onChange={fh} placeholder="e.g. Figma, React"/>}
                {isFreelancer && <Field label="TOOLS" name="toolsRaw" value={form.toolsRaw} onChange={fh} placeholder="e.g. Adobe Suite"/>}
                {!isFreelancer && <Field label="COMPANY / BRAND" name="company" value={form.company} onChange={fh} placeholder="Your company"/>}
                <Btn onClick={save} disabled={saving}>{saving?"SAVING…":"SAVE CHANGES"}</Btn>
              </div>
            )}

            {/* PORTFOLIO */}
            {tab==="portfolio" && isFreelancer && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.35rem", fontWeight:300, color:C.white }}>Portfolio</h3>
                  <Btn size="sm" v="outline" onClick={() => setAddingPort(!addingPort)}>{addingPort?"CANCEL":"+ ADD WORK"}</Btn>
                </div>
                {addingPort && (
                  <div style={{ background:C.s2, border:`1px solid ${C.bA}`, padding:"20px", marginBottom:20, display:"flex", flexDirection:"column", gap:12 }}>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.18em", color:C.gold }}>NEW PORTFOLIO ITEM</div>
                    <Field label="PROJECT TITLE" name="_" value={portTitle} onChange={e=>setPortTitle(e.target.value)} placeholder="e.g. Brand identity for Noir Studio"/>
                    <Field label="DESCRIPTION (optional)" name="_2" type="textarea" value={portDesc} onChange={e=>setPortDesc(e.target.value)} placeholder="Describe the project, your role, and the outcome…" rows={3}/>
                    <Btn size="sm" onClick={addPortItem} disabled={!portTitle.trim()}>SAVE WORK ITEM</Btn>
                  </div>
                )}
                {portfolio.length===0 && !addingPort ? (
                  <div style={{ textAlign:"center", padding:"52px 30px", border:`1px dashed ${C.b}` }}>
                    <div style={{ marginBottom:14, opacity:.3 }}><LogoMark size={36}/></div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15.5, color:C.tx, fontWeight:300, lineHeight:1.85 }}>No portfolio items yet.<br/><em style={{ color:C.gold }}>Click '+ Add Work' to showcase your projects.</em></p>
                  </div>
                ) : (
                  <div className="port-grid">
                    {portfolio.map((item,i) => (
                      <div key={i} className="port-tile" style={{ padding:"20px" }}>
                        <button onClick={() => removePort(i)} style={{ position:"absolute", top:8, right:8, background:"rgba(155,34,66,.5)", border:"none", color:C.gold, width:22, height:22, cursor:"pointer", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                        <LogoMark size={22}/>
                        <div style={{ fontFamily:"'Cinzel',serif", fontSize:8.5, letterSpacing:"0.12em", marginTop:10, marginBottom:6, textAlign:"center", color:C.white }}>{item.title}</div>
                        {item.desc && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12.5, color:C.tx2, textAlign:"center", lineHeight:1.7, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.desc}</p>}
                      </div>
                    ))}
                    <div className="port-tile" onClick={() => setAddingPort(true)}>
                      <div style={{ fontSize:"1.8rem", color:C.tx3 }}>+</div>
                      <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.14em", color:C.tx3, marginTop:6 }}>ADD WORK</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PRICING */}
            {tab==="pricing" && isFreelancer && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.35rem", fontWeight:300, color:C.white }}>Pricing</h3>
                  <Btn size="sm" v="ghost" onClick={() => setEditing(!editing)}>{editing?"CANCEL":"EDIT RATES"}</Btn>
                </div>
                {!editing ? (
                  <div>
                    <div style={{ background:C.s1, border:`1px solid ${C.b}`, padding:"24px", marginBottom:18 }}>
                      {[["Type",user.price_type||"—"],["Starting Price",user.starting_price?`$${user.starting_price}`:"—"],["Hourly Rate",user.hourly_rate?`$${user.hourly_rate}/hr`:"—"],["Label",user.price_label||"—"]].map(([l,v]) => (
                        <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.b}`, fontFamily:"'Cormorant Garamond',serif", fontSize:14.5 }}>
                          <span style={{ color:C.tx3 }}>{l}</span><span style={{ color:C.gold }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    {user.starting_price && (
                      <div style={{ background:"rgba(155,34,66,.1)", border:`1px solid ${C.burg}`, padding:"20px" }}>
                        <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.18em", color:C.gold, marginBottom:12 }}>EARNINGS EXAMPLE</div>
                        {[["Project Value",`$${user.starting_price}`,C.white],["Commission (10%)",`− $${(user.starting_price*0.1).toFixed(2)}`,"#E88"],["You Receive",`$${(user.starting_price*0.9).toFixed(2)}`,C.gold]].map(([l,v,col]) => (
                          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:l!=="You Receive"?`1px solid ${C.b}`:"none", fontFamily:"'Cormorant Garamond',serif", fontSize:14.5 }}>
                            <span style={{ color:C.tx3 }}>{l}</span><span style={{ color:col }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                    <div>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.tx3, marginBottom:8 }}>TYPE</div>
                      <div style={{ display:"flex", gap:7 }}>
                        {[["project","Per Project"],["hourly","Hourly"],["both","Both"]].map(([v,l]) => (
                          <div key={v} onClick={() => setForm({...form,price_type:v})} style={{ flex:1, padding:"9px", border:`1px solid ${form.price_type===v?C.burg:C.b}`, cursor:"pointer", textAlign:"center", background:form.price_type===v?"rgba(155,34,66,.25)":"transparent" }}>
                            <span style={{ fontFamily:"'Cinzel',serif", fontSize:8, color:form.price_type===v?C.gold:C.tx }}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {(form.price_type==="project"||form.price_type==="both")&&<Field label="STARTING PRICE" name="starting_price" type="number" value={form.starting_price} onChange={fh} placeholder="e.g. 500"/>}
                    {(form.price_type==="hourly"||form.price_type==="both")&&<Field label="HOURLY RATE" name="hourly_rate" type="number" value={form.hourly_rate} onChange={fh} placeholder="e.g. 75"/>}
                    <Field label="CUSTOM LABEL" name="price_label" value={form.price_label} onChange={fh} placeholder='e.g. "from $500"'/>
                    <Btn onClick={save} disabled={saving}>{saving?"SAVING…":"UPDATE RATES"}</Btn>
                  </div>
                )}
              </div>
            )}

            {/* CLIENT NEEDS */}
            {tab==="needs" && !isFreelancer && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.35rem", fontWeight:300, color:C.white }}>Project Needs</h3>
                  <Btn size="sm" v="ghost" onClick={() => setEditing(!editing)}>{editing?"CANCEL":"EDIT"}</Btn>
                </div>
                {!editing ? (
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15.5, color:user.project_needs?C.tx:C.tx3, fontWeight:300, lineHeight:1.88, fontStyle:user.project_needs?"normal":"italic" }}>{user.project_needs||"No project needs added yet."}</p>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                    <Field label="PROJECT NEEDS" name="project_needs" type="textarea" value={form.project_needs} onChange={fh} placeholder="What kind of projects do you need help with?" rows={5}/>
                    <Btn onClick={save} disabled={saving}>{saving?"SAVING…":"SAVE"}</Btn>
                  </div>
                )}
                <div style={{ background:"rgba(26,58,106,.12)", border:"1px solid rgba(26,58,106,.3)", padding:"20px", marginTop:24 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.blue, marginBottom:10 }}>HOW TO HIRE</div>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14.5, color:C.tx, fontWeight:300, lineHeight:1.88 }}>Browse the network, find the right professional, then click <strong style={{ color:C.blue }}>'Hire This Professional'</strong> on their profile. It opens a direct email to <a href={`mailto:${VMAIL}`} style={{ color:C.blue, textDecoration:"none" }}>{VMAIL}</a>.</p>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div>
            {[
              { title:"ACCOUNT", rows:[["Email",user.email],["Since",new Date(user.joined_at||Date.now()).getFullYear()],["Role",isFreelancer?"Freelancer":"Client"]] },
            ].map(w => (
              <div key={w.title} style={{ background:C.s1, border:`1px solid ${C.b}`, padding:"20px", marginBottom:12 }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.gold, marginBottom:13 }}>{w.title}</div>
                {w.rows.map(([l,v]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.b}`, fontFamily:"'Cormorant Garamond',serif", fontSize:13.5 }}>
                    <span style={{ color:C.tx3 }}>{l}</span>
                    <span style={{ color:C.tx, wordBreak:"break-all", textAlign:"right", maxWidth:160, fontSize:12.5 }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
            {isFreelancer && (
              <div style={{ background:C.s1, border:`1px solid ${C.b}`, padding:"20px", marginBottom:12 }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.gold, marginBottom:12 }}>AVAILABILITY</div>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:form.open_to_work?C.green:"#888", boxShadow:form.open_to_work?`0 0 6px ${C.green}50`:"none" }}/>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:C.tx }}>{form.open_to_work?"Available for projects":"Not available right now"}</span>
                </div>
              </div>
            )}
            {!isFreelancer && (
              <div style={{ background:C.s1, border:`1px solid ${C.b}`, padding:"20px", marginBottom:12 }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.gold, marginBottom:12 }}>HIRE A FREELANCER</div>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13.5, color:C.tx, lineHeight:1.85, marginBottom:14 }}>Browse the network and click 'Hire This Professional' to connect via email.</p>
                <Btn size="sm" full onClick={() => setPage("network")}>BROWSE NETWORK</Btn>
              </div>
            )}
            <div style={{ background:C.s1, border:`1px solid ${C.b}`, padding:"20px" }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.2em", color:C.gold, marginBottom:10 }}>CONTACT</div>
              <a href={`mailto:${VMAIL}`} style={{ fontFamily:"'Cinzel',serif", fontSize:8.5, letterSpacing:"0.1em", color:C.gold, textDecoration:"none" }}>{VMAIL}</a>
            </div>
          </div>
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TERMS & SERVICES
══════════════════════════════════════════════════════════════════════════ */
function Terms({ setPage }) {
  const [active, setActive] = useState("intro");
  const nav = [["intro","1. Introduction"],["definitions","2. Definitions"],["eligibility","3. Eligibility"],["commission","4. Commission & Fees"],["transactions","5. Transactions"],["conduct","6. Conduct"],["ip","7. Content & IP"],["privacy","8. Privacy"],["liability","9. Liability"],["termination","10. Termination"],["contact","11. Contact"]];
  const P = ({c,s={}}) => <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:C.tx, fontWeight:300, lineHeight:1.85, marginBottom:12,...s }}>{c}</p>;
  const H2 = ({c}) => <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", fontWeight:400, color:C.white, marginBottom:14 }}>{c}</h2>;
  const Sub = ({c}) => <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.14em", color:C.gold, margin:"20px 0 8px" }}>{c}</div>;
  const Li = ({c}) => <div style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:`1px solid ${C.b}`, fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:C.tx }}><span style={{ color:C.gold, flexShrink:0 }}>—</span><span>{c}</span></div>;
  const HL = ({c}) => <div style={{ background:"rgba(212,168,75,0.07)", borderLeft:`2px solid ${C.gold}`, padding:"13px 17px", margin:"14px 0", fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:C.tx, lineHeight:1.85 }}>{c}</div>;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingTop:62 }}>
      <div style={{ background:`linear-gradient(135deg,${C.burgD},${C.bg})`, borderBottom:`1px solid ${C.b}`, padding:"64px 56px 52px", textAlign:"center" }}>
        <EyebrowLabel center>LEGAL</EyebrowLabel>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.2rem,5vw,4rem)", fontWeight:300, color:C.white, marginBottom:8 }}>Terms & Services</h1>
        <Ornament/>
        <p style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.14em", color:C.tx3 }}>LAST UPDATED: JANUARY 2026 · VERSION 1.0</p>
      </div>
      <div style={{ maxWidth:1060, margin:"0 auto", padding:"56px 56px 80px", display:"grid", gridTemplateColumns:"190px 1fr", gap:56 }} className="terms-layout">
        <nav style={{ display:"flex", flexDirection:"column", gap:2, position:"sticky", top:78, alignSelf:"start" }}>
          {nav.map(([id,label]) => (
            <a key={id} href={`#ts-${id}`} onClick={() => setActive(id)} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:active===id?C.gold:C.tx2, cursor:"pointer", padding:"7px 13px", borderLeft:`1px solid ${active===id?C.gold:C.b}`, transition:"all .2s", textDecoration:"none", display:"block" }}>{label}</a>
          ))}
        </nav>
        <div style={{ maxWidth:640 }}>
          {[
            { id:"intro", title:"1. Introduction", body: <><P c={<>Welcome to <strong style={{color:C.white}}>The Voryel</strong> — a premium global digital network operated by its founder, Adetunji Ewaoluwa Destiny. By creating an account or using The Voryel, you confirm you have read, understood, and agreed to these Terms in full.</>}/></> },
            { id:"definitions", title:"2. Definitions", body: <><Li c={<><strong style={{color:C.white}}>"Client"</strong> — A user who joins to discover and hire Freelancers for digital projects.</>}/><Li c={<><strong style={{color:C.white}}>"Freelancer"</strong> — A user who joins to offer digital services and showcase their portfolio.</>}/><Li c={<><strong style={{color:C.white}}>"Transaction"</strong> — Any payment exchange for digital services via The Voryel.</>}/><Li c={<><strong style={{color:C.white}}>"Commission"</strong> — The 10% platform fee deducted from the Freelancer's earnings on completed Transactions.</>}/></> },
            { id:"eligibility", title:"3. Eligibility & Accounts", body: <><P c="You must be at least 18 years old to use The Voryel. Freelancer signup requires explicit agreement to these Terms, including the commission structure."/><Li c="All profile information must be truthful and accurate."/><Li c="Accounts are personal and non-transferable."/><Li c="Notify us at thevoryel@gmail.com of any unauthorised access immediately."/></> },
            { id:"commission", title:"4. Commission & Fees", body: <>
              <div style={{ background:`linear-gradient(135deg,rgba(155,34,66,0.18) 0%,${C.s2} 100%)`, border:`1px solid ${C.bA}`, padding:"26px", marginBottom:16 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"3.8rem", fontWeight:300, color:C.gold, lineHeight:1, marginBottom:8 }}>10%</div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.14em", color:C.white, marginBottom:10 }}>PLATFORM COMMISSION RATE</div>
                <P c="A flat 10% commission on the total value of each completed Transaction is deducted from the Freelancer's earnings. Clients are not charged any platform fee." s={{margin:0}}/>
              </div>
              <HL c={<><strong style={{color:C.gold}}>The 10% commission is paid by the Freelancer, not the Client.</strong> It is deducted automatically from the Freelancer's payment on project completion. Clients pay only the agreed price — nothing more.</>}/>
              <Sub c="WORKED EXAMPLES"/>
              {[["$500","$50","$450"],["$1,000","$100","$900"],["$2,500","$250","$2,250"]].map(([b,c,e]) => (
                <div key={b} style={{ background:C.s2, border:`1px solid ${C.b}`, padding:"14px 18px", marginBottom:8 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.14em", color:C.gold, marginBottom:10 }}>EXAMPLE: {b} PROJECT</div>
                  {[["Client Pays",b,C.white],["Commission (10%)",`− ${c}`,"#E88"],["Freelancer Receives",e,C.gold]].map(([l,v,col]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.b}`, fontFamily:"'Cormorant Garamond',serif", fontSize:14.5 }}>
                      <span style={{ color:C.tx3 }}>{l}</span><span style={{ color:col }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
              <Sub c="KEY RULES"/>
              <Li c="Commission applies only on successfully completed projects or milestones."/>
              <Li c="No commission on cancelled projects where no work was delivered."/>
              <Li c="The 10% rate applies equally to all categories and project types."/>
              <Li c="Rate changes communicated with 30 days' notice. There are no signup, listing, or search fees."/>
            </> },
            { id:"transactions", title:"5. Transactions & Projects", body: <><P c={<>Clients connect by clicking <strong style={{color:C.white}}>'Hire This Professional'</strong>, routing directly to <strong style={{color:C.gold}}>{VMAIL}</strong>. All introductions are managed through this official channel. The Voryel facilitates exclusively digital services — physical goods and offline services are not permitted.</>}/></> },
            { id:"conduct", title:"6. User Conduct", body: <><P c="All users must maintain high professional standards. The following is prohibited:"/><Li c="False, misleading, or impersonating profiles"/><Li c="Harassment, abuse, or threatening communication"/><Li c="Moving transactions off-platform to circumvent commission"/><Li c="Fake reviews, endorsements, or ratings"/><Li c="Spam or unsolicited aggressive solicitation"/><Li c="Illegal activity of any kind"/></> },
            { id:"ip", title:"7. Content & IP", body: <><P c="You retain ownership of all content you upload. Unless agreed in writing, intellectual property rights to project deliverables transfer to the Client upon full payment and completion."/></> },
            { id:"privacy", title:"8. Privacy", body: <><P c={`We collect only what's necessary to operate The Voryel. We do not sell or share your data with third parties for marketing. Contact ${VMAIL} with any data queries.`}/></> },
            { id:"liability", title:"9. Limitation of Liability", body: <><P c="The Voryel provides a connection platform and is not a party to agreements between Clients and Freelancers. Our total liability shall not exceed the commissions paid in connection with the relevant transaction."/></> },
            { id:"termination", title:"10. Termination", body: <><P c={`You may close your account by emailing ${VMAIL}. The Voryel may suspend accounts that violate these Terms. Termination does not relieve parties of obligations from ongoing transactions.`}/></> },
            { id:"contact", title:"11. Contact & Disputes", body: <>
              <HL c={<><strong style={{color:C.gold}}>Email:</strong> <a href={`mailto:${VMAIL}`} style={{color:C.gold,textDecoration:"none"}}>{VMAIL}</a><br/><strong style={{color:C.gold}}>Founder:</strong> Adetunji Ewaoluwa Destiny<br/><strong style={{color:C.gold}}>Platform:</strong> Global · Digital · Remote</>}/>
              <P c="We are committed to resolving all disputes fairly and promptly."/>
            </> },
          ].map(({ id, title, body }) => (
            <div key={id} id={`ts-${id}`} style={{ marginBottom:48, paddingBottom:48, borderBottom:`1px solid ${C.b}` }}>
              <H2 c={title}/>{body}
            </div>
          ))}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════════════════════════ */
function Contact({ setPage }) {
  const [f, setF] = useState({ name:"",email:"",subject:"",message:"" });
  const [sent, setSent] = useState(false);
  const fh = e => setF({...f,[e.target.name]:e.target.value});
  const ok = f.name && f.email && f.subject && f.message;
  return (
    <div style={{ background:C.bg, minHeight:"100vh", paddingTop:62 }}>
      <div style={{ background:`linear-gradient(135deg,${C.burgD},${C.bg})`, borderBottom:`1px solid ${C.b}`, padding:"68px 56px 56px", textAlign:"center" }}>
        <EyebrowLabel center>GET IN TOUCH</EyebrowLabel>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.2rem,5vw,3.8rem)", fontWeight:300, color:C.white, marginBottom:10 }}>Contact Us</h1>
        <Ornament/>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.tx, fontWeight:300, maxWidth:380, margin:"0 auto" }}>Questions, partnerships, or feedback — we're here.</p>
      </div>
      <div style={{ maxWidth:940, margin:"0 auto", padding:"64px 56px 80px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:52, alignItems:"start" }} className="contact-grid">
        <div>
          {[["Official Email",VMAIL,true],["Founder","Adetunji Ewaoluwa Destiny",false],["Response","Within 48 hours",false]].map(([l,v,isEmail]) => (
            <div key={l} style={{ paddingBottom:17, marginBottom:17, borderBottom:`1px solid ${C.b}` }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, letterSpacing:"0.16em", color:C.tx3, marginBottom:5 }}>{l}</div>
              {isEmail ? <a href={`mailto:${v}`} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16.5, color:C.gold, textDecoration:"none" }}>{v}</a> : <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16.5, color:C.tx, fontWeight:300 }}>{v}</div>}
            </div>
          ))}
          <div style={{ padding:"22px", border:`1px solid ${C.b}`, marginTop:8 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:15.5, color:C.tx, lineHeight:1.9, fontWeight:300 }}>"Your Vision, Our Flow — we exist to bridge the gap between great minds and meaningful digital collaboration."</p>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:7.5, color:C.tx3, marginTop:12, letterSpacing:"0.1em" }}>— Adetunji Ewaoluwa Destiny, Founder</div>
          </div>
        </div>
        <div style={{ border:`1px solid ${C.b}`, padding:"30px" }}>
          {sent ? (
            <div style={{ textAlign:"center", padding:"44px 0" }}>
              <div style={{ marginBottom:16, display:"flex", justifyContent:"center" }}><LogoMark size={48}/></div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:C.gold, marginBottom:10, fontWeight:300 }}>Message Received</div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:C.tx, lineHeight:1.85, fontWeight:300 }}>We'll respond within 48 hours.</p>
              <div style={{ marginTop:20 }}><Btn size="sm" v="ghost" onClick={() => setSent(false)}>SEND ANOTHER</Btn></div>
            </div>
          ) : (
            <>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.2em", color:C.gold, marginBottom:20 }}>SEND A MESSAGE</div>
              <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <Field label="NAME" name="name" value={f.name} onChange={fh} placeholder="Your name"/>
                  <Field label="EMAIL" name="email" type="email" value={f.email} onChange={fh} placeholder="your@email.com"/>
                </div>
                <Field label="SUBJECT" name="subject" type="select" value={f.subject} onChange={fh} options={["General Inquiry","I Want to Hire a Freelancer","Partnership","Press","Feedback","Other"]}/>
                <Field label="MESSAGE" name="message" type="textarea" value={f.message} onChange={fh} placeholder="How can we help?" rows={5}/>
                <Btn full onClick={() => ok && setSent(true)} disabled={!ok}>SEND MESSAGE</Btn>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════════════ */
export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [members, setMembers] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    db.all().then(d => { if (Array.isArray(d)) setMembers(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { try { window.scrollTo(0,0); } catch(e) {} }, [page]);

  const onAuth = u => {
    setMembers(p => { const ex = p.find(x=>x.id===u.id); return ex ? p.map(x=>x.id===u.id?u:x) : [u,...p]; });
    setMe(u);
    setToast({ title:"Welcome to The Voryel", body:`Signed in as ${u.name}` });
  };
  const onLogout = () => { setMe(null); setPage("home"); };
  const onUpdate = u => {
    setMembers(p => p.map(x => x.id===u.id?u:x));
    setMe(p => p?.id===u.id?u:p);
  };

  const noNav = ["login","signup"].includes(page);

  return (
    <div style={{ background:C.bg, color:C.white, minHeight:"100vh" }}>
      <style>{CSS}</style>
      {!noNav && <Nav page={page} setPage={setPage} user={me} onLogout={onLogout}/>}
      {page==="home"       && <Home setPage={setPage} members={members} loading={loading}/>}
      {page==="network"    && <Network setPage={setPage} members={members} loading={loading}/>}
      {page==="dashboard"  && me && <Dashboard user={me} setPage={setPage} onUpdate={onUpdate}/>}
      {page==="dashboard"  && !me && (()=>{setTimeout(()=>setPage("login"),0);return null;})()}
      {page==="terms"      && <Terms setPage={setPage}/>}
      {page==="contact"    && <Contact setPage={setPage}/>}
      {page==="login"      && <Auth mode="login" setPage={setPage} onAuth={onAuth}/>}
      {page==="signup"     && <Auth mode="signup" setPage={setPage} onAuth={onAuth}/>}
      {toast && <Toast title={toast.title} body={toast.body} onDone={() => setToast(null)}/>}
    </div>
  );
}

