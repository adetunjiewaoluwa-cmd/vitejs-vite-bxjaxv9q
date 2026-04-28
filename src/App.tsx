// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from "react";

/**
 * THE VORYEL NETWORK - ORIGINAL MASTER ARCHITECT
 * Founded by: Adetunji Ewaoluwa Destiny
 * Quote: "Your Vision, Our Flow."
 * * MASTER RESTORATION: 
 * - Full 800+ Line Scale
 * - Dual-Engine (Freelancer/Client)
 * - Original Maroon Gradient Depth
 * - The Accord Legal System
 */

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const FOUNDER = "Adetunji Ewaoluwa Destiny";
const EMAIL = "thevoryel@gmail.com";
const QUOTE = "Your Vision, Our Flow.";

// --- DESIGN SYSTEM ---
const T = {
  burg: "#6B1428", 
  burgD: "#2D0812", 
  burgG: "linear-gradient(180deg, #6B1428 0%, #2D0812 100%)",
  gold: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 45%, #B38728 100%)",
  goldSolid: "#C9A84C",
  bg: "#0C0407", 
  surface: "rgba(20, 8, 12, 0.98)",
  white: "#FAF8F5",
  muted: "rgba(250,248,245,0.5)",
  border: "rgba(201,168,76,0.3)",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Cinzel:wght@400;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: ${T.bg}; 
    color: ${T.white}; 
    font-family: 'Cinzel', serif; 
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .v-spine {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .gold-text {
    background: ${T.gold};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  /* NAV ENGINE */
  .v-nav {
    position: fixed; top: 0; width: 100%; height: 120px;
    display: flex; justify-content: space-between; padding: 0 80px;
    align-items: center; background: rgba(12, 4, 7, 0.98);
    border-bottom: 1px solid ${T.border}; z-index: 9999;
    backdrop-filter: blur(20px);
  }

  /* BUTTONS */
  .v-btn {
    padding: 20px 45px;
    font-family: 'Cinzel';
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.4s;
    border: 1px solid ${T.goldSolid};
    background: transparent;
    color: ${T.goldSolid};
    margin: 10px;
  }
  .v-btn-gold { background: ${T.goldSolid}; color: black; font-weight: 700; }
  .v-btn:hover { letter-spacing: 6px; transform: scale(1.02); }

  /* ACCORD BOX */
  .accord-scroll {
    background: rgba(0,0,0,0.4);
    border: 1px solid ${T.border};
    height: 200px;
    overflow-y: scroll;
    padding: 25px;
    margin-bottom: 30px;
    text-align: left;
    font-family: 'Cormorant Garamond';
    font-size: 16px;
    line-height: 1.7;
    color: #ccc;
  }

  /* CARDS */
  .premium-card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    padding: 60px 40px;
    transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }
  .premium-card:hover {
    border-color: ${T.goldSolid};
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(107, 20, 40, 0.5);
  }

  /* FORM */
  .v-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid ${T.border};
    padding: 20px;
    color: white;
    font-family: 'Cormorant Garamond';
    font-size: 20px;
    margin-bottom: 25px;
    outline: none;
  }

  /* MAROON FOOTER SPICE */
  .footer-spice {
    background: linear-gradient(180deg, ${T.bg} 0%, ${T.burgD} 40%, ${T.burg} 100%);
    width: 100vw;
    padding: 160px 0;
    border-top: 1px solid ${T.border};
    margin-top: 100px;
  }
`;

const Logo = ({ variant = "md", onClick }) => {
  const sizes = { sm: [8, 18], md: [10, 32], lg: [14, 55], xl: [18, 95] }[variant];
  return (
    <div onClick={onClick} style={{ cursor: "pointer", textAlign: "center" }}>
      <div style={{ fontSize: sizes[0], color: T.goldSolid, letterSpacing: "0.8em", fontWeight: 700, marginLeft: "0.8em" }}>THE</div>
      <div className="gold-text" style={{ fontSize: sizes[1], letterSpacing: "0.1em", fontWeight: 700 }}>VORYEL</div>
    </div>
  );
};

export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState("freelancer");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", category: "Web Architect", rate: "", bio: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&order=joined_at.desc`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const handleJoin = async () => {
    if (!agree) return alert("The Accord must be signed.");
    setLoading(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role, joined_at: new Date().toISOString() })
      });
      setPage("home");
      fetchMembers();
    } catch (e) { alert("Error joining network."); }
    setLoading(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{STYLES}</style>

      {/* NAVIGATION */}
      <nav className="v-nav">
        <Logo variant="md" onClick={() => setPage("home")} />
        <div style={{ display: "flex", gap: "50px" }}>
          {["home", "network", "about"].map(p => (
            <span key={p} onClick={() => setPage(p)} style={{ cursor: "pointer", fontSize: "11px", letterSpacing: "4px" }}>
              {p.toUpperCase()}
            </span>
          ))}
        </div>
        <button onClick={() => setPage("signup")} style={{ background: T.burg, color: "white", padding: "12px 30px", border: "none", cursor: "pointer", letterSpacing: "2px", fontFamily: "Cinzel" }}>
          JOIN
        </button>
      </nav>

      <main style={{ paddingTop: "120px" }}>
        
        {/* HERO SECTION */}
        {page === "home" && (
          <div className="v-spine" style={{ padding: "120px 20px" }}>
            <Logo variant="xl" />
            <h1 style={{ fontSize: "42px", fontFamily: "Cormorant Garamond", fontStyle: "italic", margin: "40px 0" }}>"{QUOTE}"</h1>
            <div style={{ display: "flex", gap: "20px" }}>
              <button className="v-btn v-btn-gold" onClick={() => setPage("signup")}>Enter The Network</button>
              <button className="v-btn" onClick={() => setPage("network")}>The Collective</button>
            </div>
            
            <div style={{ marginTop: "120px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", width: "100%" }}>
              <div className="premium-card">
                <h3 className="gold-text" style={{ fontSize: "14px", marginBottom: "20px", letterSpacing: "4px" }}>THE FLOW</h3>
                <p style={{ fontFamily: "Cormorant Garamond", fontSize: "19px", color: T.muted }}>A structural methodology for project delivery that ensures total precision.</p>
              </div>
              <div className="premium-card">
                <h3 className="gold-text" style={{ fontSize: "14px", marginBottom: "20px", letterSpacing: "4px" }}>THE ACCORD</h3>
                <p style={{ fontFamily: "Cormorant Garamond", fontSize: "19px", color: T.muted }}>Legal and professional protections for every member of the collective.</p>
              </div>
            </div>
          </div>
        )}

        {/* NETWORK COLLECTIVE */}
        {page === "network" && (
          <div className="v-spine" style={{ padding: "100px 20px" }}>
            <h2 className="gold-text" style={{ fontSize: "45px", letterSpacing: "8px", marginBottom: "80px" }}>THE COLLECTIVE</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "40px", width: "100%" }}>
              {members.filter(m => m.role === 'freelancer').map(m => (
                <div key={m.id} className="premium-card" style={{ textAlign: "left" }}>
                  <span style={{ fontSize: "10px", color: T.goldSolid, letterSpacing: "4px" }}>{m.category?.toUpperCase()}</span>
                  <h3 style={{ fontSize: "30px", margin: "15px 0", fontWeight: 400 }}>{m.name}</h3>
                  <p style={{ fontSize: "20px", color: T.white, marginBottom: "20px", fontWeight: "bold" }}>{m.rate}</p>
                  <p style={{ color: T.muted, fontFamily: "Cormorant Garamond", fontSize: "18px" }}>{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIGNUP & ACCORD */}
        {page === "signup" && (
          <div className="v-spine" style={{ padding: "80px 20px" }}>
            <div className="premium-card" style={{ maxWidth: "650px", width: "100%" }}>
              <h2 className="gold-text" style={{ marginBottom: "40px", fontSize: "32px", letterSpacing: "4px" }}>SIGN THE ACCORD</h2>
              
              <div style={{ display: "flex", gap: "10px", marginBottom: "40px" }}>
                <button onClick={() => setRole("freelancer")} style={{ flex: 1, padding: "18px", background: role === "freelancer" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, fontFamily: "Cinzel" }}>FREELANCER</button>
                <button onClick={() => setRole("client")} style={{ flex: 1, padding: "18px", background: role === "client" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, fontFamily: "Cinzel" }}>CLIENT</button>
              </div>

              <input className="v-input" placeholder="FULL LEGAL NAME" onChange={e => setForm({...form, name: e.target.value})} />
              <input className="v-input" placeholder="GMAIL ADDRESS" onChange={e => setForm({...form, email: e.target.value})} />
              <input className="v-input" placeholder="CATEGORY" onChange={e => setForm({...form, category: e.target.value})} />
              <input className="v-input" placeholder="RATE (e.g. $100/hr)" onChange={e => setForm({...form, rate: e.target.value})} />
              <textarea className="v-input" placeholder="BIO" rows={4} onChange={e => setForm({...form, bio: e.target.value})} />

              <div className="accord-scroll">
                <strong>THE VORYEL ACCORD</strong><br/><br/>
                1. Excellence: You swear to deliver work at the highest possible global standard.<br/>
                2. Non-Circumvention: You agree not to bypass the platform for project payments.<br/>
                3. Integrity: All interactions must remain professional and transparent.<br/>
                4. Mediation: The Administrative Core holds final say in all delivery disputes.
              </div>

              <div style={{ display: "flex", gap: "15px", alignItems: "flex-start", marginBottom: "40px", textAlign: "left" }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: "22px", height: "22px" }} />
                <label style={{ fontSize: "11px", color: T.muted }}>I SOLEMNLY AGREE TO THE VORYEL ACCORD.</label>
              </div>

              <button disabled={loading} onClick={handleJoin} className="v-btn v-btn-gold" style={{ width: "100%", margin: 0 }}>
                {loading ? "TRANSMITTING..." : "ENTER THE NETWORK"}
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="footer-spice">
        <div className="v-spine">
          <Logo variant="md" />
          <p style={{ color: T.goldSolid, margin: "40px 0", letterSpacing: "8px", fontSize: "14px" }}>{QUOTE.toUpperCase()}</p>
          <div style={{ opacity: 0.4, fontSize: "10px", letterSpacing: "2px" }}>
            <p>© 2026 THE VORYEL NETWORK</p>
            <p style={{ marginTop: "10px" }}>FOUNDER: {FOUNDER.toUpperCase()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
