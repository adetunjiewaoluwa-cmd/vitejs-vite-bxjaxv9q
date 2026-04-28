// @ts-nocheck
import React, { useState, useEffect } from "react";

/**
 * THE VORYEL NETWORK - ETERNAL MAROON EDITION
 * Founder: Adetunji Ewaoluwa Destiny
 * Status: FINAL ATMOSPHERIC LOCK | FULL DATA SYNC
 */

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const FOUNDER = "Adetunji Ewaoluwa Destiny";
const EMAIL = "thevoryel@gmail.com";
const QUOTE = "Your Vision, Our Flow.";

const T = {
  burg: "#6B1428", 
  burgDark: "#2D0812", 
  burgDeep: "#1A050A",
  gold: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 45%, #B38728 100%)",
  goldSolid: "#C9A84C",
  white: "#FAF8F5",
  border: "rgba(201,168,76,0.35)"
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Cinzel:wght@400;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: radial-gradient(circle at center, ${T.burgDark} 0%, ${T.burgDeep} 100%);
    color: ${T.white}; 
    font-family: 'Cinzel', serif; 
    overflow-x: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gold-text {
    background: ${T.gold};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  /* NAV SYSTEM */
  .v-nav {
    position: fixed; top: 0; width: 100%; height: 110px;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 6%; background: rgba(26, 5, 10, 0.98);
    border-bottom: 1px solid ${T.border}; z-index: 1000;
    backdrop-filter: blur(10px);
  }

  .nav-links span { 
    font-size: 11px; letter-spacing: 4px; cursor: pointer; color: white;
    margin: 0 20px; transition: 0.3s;
  }
  .nav-links span:hover { color: ${T.goldSolid}; }

  /* FULL PAGE MAROON WRAPPER */
  .content-wrap {
    width: 100%;
    max-width: 1200px;
    padding: 180px 20px 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .v-btn {
    padding: 18px 45px; font-family: 'Cinzel'; font-size: 11px; letter-spacing: 4px;
    text-transform: uppercase; cursor: pointer; transition: 0.4s;
    border: 1px solid ${T.goldSolid}; background: transparent; color: ${T.goldSolid};
    margin: 15px;
  }
  .v-btn-gold { background: ${T.goldSolid}; color: black; font-weight: 700; }
  .v-btn:hover { transform: scale(1.05); box-shadow: 0 0 20px ${T.burg}; }

  .v-card {
    background: rgba(45, 8, 18, 0.6); border: 1px solid ${T.border};
    padding: 50px 40px; text-align: left; transition: 0.4s;
  }

  /* LEGAL ACCORD BOX */
  .accord-area {
    background: rgba(0,0,0,0.3); border: 1px solid ${T.border};
    height: 200px; overflow-y: auto; padding: 25px; margin-bottom: 25px;
    text-align: left; font-family: 'Cormorant Garamond'; font-size: 17px; line-height: 1.6;
  }

  input, textarea, select {
    width: 100%; background: rgba(255,255,255,0.05); border: 1px solid ${T.border};
    padding: 20px; color: white; font-family: 'Cormorant Garamond';
    font-size: 20px; margin-bottom: 20px; outline: none;
  }

  .footer {
    width: 100vw; padding: 120px 20px; background: ${T.burgDeep};
    border-top: 1px solid ${T.border}; text-align: center;
  }
`;

export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState("freelancer");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rate: "", bio: "", category: "Web Architect" });

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&order=joined_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(data => setMembers(Array.isArray(data) ? data : []));
  }, []);

  const handleJoin = async () => {
    if(!agree) return alert("You must sign the Voryel Accord.");
    setLoading(true);
    await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role, joined_at: new Date().toISOString() })
    });
    setLoading(false);
    setPage("network");
    window.location.reload();
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{STYLES}</style>

      {/* FIXED NAV */}
      <nav className="v-nav">
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.goldSolid, letterSpacing: 8 }}>THE</div>
          <div className="gold-text" style={{ fontSize: 32, fontWeight: 700 }}>VORYEL</div>
        </div>
        <div className="nav-links">
          <span onClick={() => setPage("home")}>IDENTITY</span>
          <span onClick={() => setPage("network")}>NETWORK</span>
        </div>
        <button onClick={() => setPage("signup")} style={{ background: T.burg, color: 'white', border: 'none', padding: '10px 25px', cursor: 'pointer', fontFamily: 'Cinzel', fontSize: 10 }}>JOIN</button>
      </nav>

      <main className="content-wrap">
        
        {/* IDENTITY SECTION */}
        {page === "home" && (
          <div style={{ animation: "fadeIn 1s ease-in" }}>
            <div style={{ fontSize: 14, color: T.goldSolid, letterSpacing: 12, marginBottom: 20 }}>ESTABLISHED 2026</div>
            <h1 className="gold-text" style={{ fontSize: "clamp(60px, 12vw, 120px)", fontWeight: 700 }}>VORYEL</h1>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: "42px", fontStyle: "italic", margin: "30px 0" }}>"{QUOTE}"</p>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              <button className="v-btn v-btn-gold" onClick={() => setPage("signup")}>Sign the Accord</button>
              <button className="v-btn" onClick={() => setPage("network")}>The Collective</button>
            </div>
          </div>
        )}

        {/* NETWORK SECTION (RESTORED DATA) */}
        {page === "network" && (
          <div style={{ width: "100%" }}>
            <h2 className="gold-text" style={{ fontSize: 45, marginBottom: 60 }}>THE COLLECTIVE</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 30 }}>
              {members.filter(m => m.role === "freelancer" || !m.role).map(m => (
                <div key={m.id} className="v-card">
                  <span style={{ color: T.goldSolid, fontSize: 10, letterSpacing: 4 }}>{m.category?.toUpperCase() || "SPECIALIST"}</span>
                  <h3 style={{ fontSize: 32, margin: "15px 0", fontWeight: 400 }}>{m.name}</h3>
                  <p style={{ color: T.goldSolid, fontWeight: 700, marginBottom: 20 }}>{m.rate || "Project-Based"}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Cormorant Garamond", fontSize: 20 }}>{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIGNUP SECTION (WITH ACCORD) */}
        {page === "signup" && (
          <div style={{ maxWidth: "650px", width: "100%" }}>
            <h2 className="gold-text" style={{ fontSize: 36, marginBottom: 50 }}>SIGN THE ACCORD</h2>
            
            <input placeholder="LEGAL FULL NAME" onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="GMAIL ADDRESS" onChange={e => setForm({...form, email: e.target.value})} />
            <input placeholder="CATEGORY (e.g. Visual Designer)" onChange={e => setForm({...form, category: e.target.value})} />
            <input placeholder="BASE RATE" onChange={e => setForm({...form, rate: e.target.value})} />
            <textarea placeholder="PROFESSIONAL BIO" rows={4} onChange={e => setForm({...form, bio: e.target.value})} />
            
            <div className="accord-area">
              <strong style={{color: T.goldSolid}}>THE VORYEL ACCORD</strong><br/><br/>
              1. <strong>Excellence:</strong> You commit to delivering work at the highest possible global standard.<br/><br/>
              2. <strong>Non-Circumvention:</strong> You agree not to bypass the platform for projects initiated here.<br/><br/>
              3. <strong>Integrity:</strong> All interactions must remain professional, transparent, and direct.<br/><br/>
              4. <strong>Mediation:</strong> Administrative Core (Founder) holds final say in project delivery disputes.
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: 40, textAlign: 'left' }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: 22, height: 22 }} />
              <label style={{ fontSize: 12, opacity: 0.8 }}>I SOLEMNLY AGREE TO THE VORYEL ACCORD.</label>
            </div>

            <button className="v-btn v-btn-gold" style={{ width: "100%", margin: 0 }} onClick={handleJoin} disabled={loading}>
              {loading ? "TRANSMITTING..." : "ENTER THE NETWORK"}
            </button>
          </div>
        )}

      </main>

      <footer className="footer">
        <div className="gold-text" style={{ fontSize: 36, fontWeight: 700, marginBottom: 20 }}>VORYEL</div>
        <p style={{ color: T.goldSolid, letterSpacing: 10, fontSize: 14, marginBottom: 40 }}>{QUOTE.toUpperCase()}</p>
        <div style={{ opacity: 0.5, fontSize: 11, letterSpacing: 2 }}>
          <p>© 2026 THE VORYEL NETWORK</p>
          <p style={{ marginTop: 10 }}>FOUNDER: {FOUNDER.toUpperCase()}</p>
        </div>
      </footer>
    </div>
  );
}
