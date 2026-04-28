// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";

/**
 * THE VORYEL NETWORK - DEFINITIVE ARCHITECT v16.0
 * Founded by: Adetunji Ewaoluwa Destiny
 * Status: MASTER RESTORATION | 850+ LINE EQUIVALENT DENSITY
 */

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const FOUNDER = "Adetunji Ewaoluwa Destiny";
const EMAIL = "thevoryel@gmail.com";
const QUOTE = "Your Vision, Our Flow.";

const T = {
  burg: "#6B1428", 
  burgD: "#1A050A",
  burgGlow: "rgba(107, 20, 40, 0.4)",
  gold: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 45%, #B38728 100%)",
  goldSolid: "#C9A84C",
  bg: "#080204", 
  surface: "rgba(18, 6, 10, 0.98)",
  white: "#FAF8F5",
  border: "rgba(201,168,76,0.2)"
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Cinzel:wght@400;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: ${T.bg}; 
    color: ${T.white}; 
    font-family: 'Cinzel', serif; 
    overflow-x: hidden;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .gold-text {
    background: ${T.gold};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* LAYOUT ENGINE */
  .master-container {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nav-bar {
    position: fixed; top: 0; left: 0; width: 100%; height: 110px;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 6%; background: rgba(8, 2, 4, 0.95);
    border-bottom: 1px solid ${T.border}; z-index: 9999;
    backdrop-filter: blur(10px);
  }

  .nav-links { display: flex; gap: 40px; }
  .nav-links span { 
    font-size: 10px; letter-spacing: 4px; cursor: pointer; transition: 0.3s; 
    color: rgba(255,255,255,0.6); font-weight: 700;
  }
  .nav-links span:hover, .active-nav { color: ${T.goldSolid} !important; }

  /* HERO & SECTIONS */
  .section-pad { padding: 160px 0 100px 0; width: 100%; }

  .hero-logo-large {
    font-size: clamp(40px, 10vw, 110px);
    letter-spacing: -2px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 20px;
  }

  .hero-sub {
    font-family: 'Cormorant Garamond';
    font-size: clamp(24px, 4vw, 42px);
    font-style: italic;
    opacity: 0.8;
    margin-bottom: 50px;
  }

  /* CARDS & INTERACTION */
  .v-card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    padding: 60px 45px;
    text-align: left;
    transition: 0.5s cubic-bezier(0.2, 1, 0.3, 1);
  }
  .v-card:hover {
    transform: translateY(-10px);
    border-color: ${T.goldSolid};
    box-shadow: 0 25px 50px ${T.burgGlow};
  }

  .v-btn {
    padding: 20px 40px;
    font-family: 'Cinzel';
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.4s;
    border: 1px solid ${T.goldSolid};
    background: transparent;
    color: ${T.goldSolid};
    display: inline-block;
    margin: 10px;
  }
  .v-btn-fill { background: ${T.goldSolid}; color: black; font-weight: 700; }
  .v-btn-burg { background: ${T.burg}; color: white; border: none; }
  .v-btn:hover { letter-spacing: 6px; filter: brightness(1.2); }

  /* FOOTER SPICE */
  .footer-gradient {
    background: linear-gradient(180deg, ${T.bg} 0%, ${T.burgD} 30%, ${T.burg} 100%);
    width: 100%;
    padding: 180px 20px;
    border-top: 1px solid ${T.border};
    margin-top: 150px;
  }

  /* FORM ELEMENTS */
  .v-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid ${T.border};
    padding: 22px;
    color: white;
    font-family: 'Cormorant Garamond';
    font-size: 20px;
    margin-bottom: 25px;
    outline: none;
  }
  .v-input:focus { border-color: ${T.goldSolid}; }

  @media (max-width: 768px) {
    .nav-bar { height: 80px; padding: 0 20px; }
    .nav-links { display: none; }
    .section-pad { padding: 120px 0 60px 0; }
  }
`;

const NavLogo = ({ onClick }) => (
  <div onClick={onClick} style={{ cursor: "pointer", textAlign: "center" }}>
    <div style={{ fontSize: 9, color: T.goldSolid, letterSpacing: 7, fontWeight: 700, marginLeft: 7 }}>THE</div>
    <div className="gold-text" style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>VORYEL</div>
  </div>
);

export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState("freelancer");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rate: "", bio: "", company: "", cat: "Architect" });

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&order=joined_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(d => setMembers(Array.isArray(d) ? d : []));
  }, []);

  const handleJoin = async () => {
    setLoading(true);
    await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role, joined_at: new Date().toISOString() })
    });
    setLoading(false);
    setPage("home");
    alert("TRANSMISSION RECEIVED.");
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{STYLES}</style>

      {/* FIXED NAVIGATION */}
      <nav className="nav-bar">
        <NavLogo onClick={() => setPage("home")} />
        <div className="nav-links">
          <span className={page === "home" ? "active-nav" : ""} onClick={() => setPage("home")}>IDENTITY</span>
          <span className={page === "network" ? "active-nav" : ""} onClick={() => setPage("network")}>NETWORK</span>
          <span className={page === "about" ? "active-nav" : ""} onClick={() => setPage("about")}>ABOUT</span>
        </div>
        <button className="v-btn-burg" style={{ padding: "10px 25px", fontSize: 10, cursor: "pointer", fontFamily: 'Cinzel' }} onClick={() => setPage("signup")}>JOIN GUILD</button>
      </nav>

      <main className="master-container">
        
        {/* IDENTITY (HOME) */}
        {page === "home" && (
          <div className="section-pad" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: T.goldSolid, letterSpacing: 12, marginBottom: 20 }}>ESTABLISHED 2026</div>
            <h1 className="gold-text hero-logo-large">VORYEL</h1>
            <p className="hero-sub">"{QUOTE}"</p>
            <p style={{ maxWidth: 700, margin: "0 auto 60px", color: "rgba(255,255,255,0.5)", fontFamily: 'Cormorant Garamond', fontSize: 22 }}>
              The premium digital network where creators, developers, and visionaries come together to forge extraordinary legacies.
            </p>
            <div>
              <button className="v-btn v-btn-fill" onClick={() => setPage("signup")}>Join Network</button>
              <button className="v-btn" onClick={() => setPage("network")}>Explore Collective</button>
            </div>

            <div style={{ marginTop: 120, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, width: "100%" }}>
              <div className="v-card">
                <h4 className="gold-text" style={{ fontSize: 12, letterSpacing: 5, marginBottom: 20 }}>THE FLOW</h4>
                <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>A structural methodology for project delivery that ensures total precision from start to finish.</p>
              </div>
              <div className="v-card">
                <h4 className="gold-text" style={{ fontSize: 12, letterSpacing: 5, marginBottom: 20 }}>THE ACCORD</h4>
                <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 20 }}>Legal and professional protections for every member of the collective to ensure fair value exchange.</p>
              </div>
            </div>
          </div>
        )}

        {/* NETWORK (FREELANCER DATA) */}
        {page === "network" && (
          <div className="section-pad">
            <h2 className="gold-text" style={{ fontSize: 45, marginBottom: 60, textAlign: "center" }}>THE COLLECTIVE</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 40, width: "100%" }}>
              {members.filter(m => m.role === 'freelancer').map(m => (
                <div key={m.id} className="v-card">
                  <span style={{ color: T.goldSolid, fontSize: 10, letterSpacing: 4 }}>{m.cat?.toUpperCase()}</span>
                  <h3 style={{ fontSize: 32, margin: "15px 0", fontWeight: 400 }}>{m.name}</h3>
                  <p style={{ fontSize: 20, color: T.white, marginBottom: 20, fontWeight: 700 }}>{m.rate}</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Cormorant Garamond", fontSize: 19, marginBottom: 30 }}>{m.bio}</p>
                  <button className="v-btn" style={{ width: "100%", margin: 0 }} onClick={() => window.location.href=`mailto:${EMAIL}`}>PICK SPECIALIST</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIGNUP (FREELANCER + CLIENT) */}
        {page === "signup" && (
          <div className="section-pad" style={{ maxWidth: 700 }}>
            <h2 className="gold-text" style={{ fontSize: 36, marginBottom: 50, textAlign: "center" }}>SIGN THE ACCORD</h2>
            <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
              <button onClick={() => setRole("freelancer")} style={{ flex: 1, padding: 20, background: role === "freelancer" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, cursor: "pointer", fontFamily: 'Cinzel' }}>FREELANCER</button>
              <button onClick={() => setRole("client")} style={{ flex: 1, padding: 20, background: role === "client" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, cursor: "pointer", fontFamily: 'Cinzel' }}>CLIENT</button>
            </div>

            <input className="v-input" placeholder="FULL LEGAL NAME" onChange={e => setForm({...form, name: e.target.value})} />
            <input className="v-input" placeholder="GMAIL ADDRESS" onChange={e => setForm({...form, email: e.target.value})} />
            
            {role === "freelancer" ? (
              <>
                <select className="v-input" onChange={e => setForm({...form, cat: e.target.value})}>
                  <option>Visual Designer</option>
                  <option>Web Architect</option>
                  <option>System Developer</option>
                  <option>Creative Director</option>
                </select>
                <input className="v-input" placeholder="STARTING RATE (e.g. $80/hr)" onChange={e => setForm({...form, rate: e.target.value})} />
                <textarea className="v-input" placeholder="PROFESSIONAL BIO" rows={5} onChange={e => setForm({...form, bio: e.target.value})} />
              </>
            ) : (
              <>
                <input className="v-input" placeholder="COMPANY NAME" onChange={e => setForm({...form, company: e.target.value})} />
                <textarea className="v-input" placeholder="PROJECT BRIEF" rows={5} onChange={e => setForm({...form, bio: e.target.value})} />
              </>
            )}

            <button className="v-btn v-btn-fill" style={{ width: "100%", margin: 0 }} onClick={handleJoin} disabled={loading}>
              {loading ? "TRANSMITTING..." : "ENTER THE NETWORK"}
            </button>
          </div>
        )}
      </main>

      {/* MAROON SPICE FOOTER */}
      <footer className="footer-gradient">
        <div className="master-container">
          <NavLogo />
          <p style={{ color: T.goldSolid, margin: "40px 0", letterSpacing: 8, fontSize: 14 }}>{QUOTE.toUpperCase()}</p>
          <div style={{ opacity: 0.3, fontSize: 10, letterSpacing: 3, textAlign: "center" }}>
            <p>© 2026 THE VORYEL NETWORK</p>
            <p style={{ marginTop: 10 }}>CURATED BY {FOUNDER.toUpperCase()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
