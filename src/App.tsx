// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from "react";

/**
 * THE VORYEL NETWORK - FULL SCALE RESTORATION
 * Founder: Adetunji Ewaoluwa Destiny
 * Status: ORIGINAL LOGIC REINSTATED
 */

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const FOUNDER = "Adetunji Ewaoluwa Destiny";
const EMAIL = "thevoryel@gmail.com";
const QUOTE = "Your Vision, Our Flow.";

const T = {
  burg: "#6B1428",
  burgD: "#1A050A",
  gold: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 45%, #B38728 100%)",
  goldSolid: "#C9A84C",
  bg: "#080204",
  surf: "rgba(18, 6, 10, 0.98)",
  border: "rgba(201,168,76,0.3)"
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Cinzel:wght@400;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: ${T.bg}; 
    color: #FAF8F5; 
    font-family: 'Cinzel', serif; 
    overflow-x: hidden;
  }

  .gold-text {
    background: ${T.gold};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .v-nav {
    position: fixed; top: 0; width: 100%; height: 110px;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 6%; background: rgba(8, 2, 4, 0.98);
    border-bottom: 1px solid ${T.border}; z-index: 1000;
  }

  .hero-maroon {
    background: linear-gradient(180deg, ${T.burg} 0%, ${T.burgD} 60%, ${T.bg} 100%);
    width: 100vw; padding: 200px 20px 100px; text-align: center;
    display: flex; flex-direction: column; align-items: center;
  }

  .footer-maroon {
    background: linear-gradient(0deg, ${T.burg} 0%, ${T.burgD} 60%, ${T.bg} 100%);
    width: 100vw; padding: 150px 20px; border-top: 1px solid ${T.border};
    margin-top: 100px; text-align: center; display: flex; flex-direction: column; align-items: center;
  }

  .v-btn {
    padding: 18px 45px; font-family: 'Cinzel'; font-size: 11px; letter-spacing: 4px;
    text-transform: uppercase; cursor: pointer; transition: 0.4s;
    border: 1px solid ${T.goldSolid}; background: transparent; color: ${T.goldSolid};
    margin: 10px;
  }

  .v-btn-solid { background: ${T.goldSolid}; color: black; font-weight: 700; }
  .v-btn-burg { background: ${T.burg}; color: white; border: none; }

  .v-input {
    width: 100%; background: rgba(255,255,255,0.03); border: 1px solid ${T.border};
    padding: 20px; color: white; font-family: 'Cormorant Garamond';
    font-size: 20px; margin-bottom: 20px; outline: none;
  }

  .accord-container {
    background: rgba(0,0,0,0.4); border: 1px solid ${T.border};
    height: 200px; overflow-y: scroll; padding: 25px; margin-bottom: 30px;
    text-align: left; font-family: 'Cormorant Garamond'; font-size: 16px; line-height: 1.7; color: #AAA;
  }

  .member-card {
    background: ${T.surf}; border: 1px solid ${T.border};
    padding: 60px 40px; text-align: left; transition: 0.4s;
  }

  .grid-layout {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 40px; width: 100%; max-width: 1200px; margin: 80px auto;
  }
`;

export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState("freelancer");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rate: "", bio: "", category: "Architect" });

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
    window.location.reload();
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{STYLES}</style>

      {/* HEADER NAV */}
      <nav className="v-nav">
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.goldSolid, letterSpacing: 8, fontWeight: 700 }}>THE</div>
          <div className="gold-text" style={{ fontSize: 32, fontWeight: 700 }}>VORYEL</div>
        </div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <span onClick={() => setPage("home")} style={{ cursor: 'pointer', fontSize: 10, letterSpacing: 4 }}>IDENTITY</span>
          <span onClick={() => setPage("network")} style={{ cursor: 'pointer', fontSize: 10, letterSpacing: 4 }}>NETWORK</span>
        </div>
        <button className="v-btn-burg" style={{ padding: "12px 30px" }} onClick={() => setPage("signup")}>JOIN</button>
      </nav>

      <main style={{ width: "100%" }}>
        
        {/* TOP MAROON SECTION */}
        {page === "home" && (
          <section className="hero-maroon">
            <div style={{ fontSize: 14, color: T.goldSolid, letterSpacing: 12, marginBottom: 20 }}>ESTABLISHED 2026</div>
            <h1 className="gold-text" style={{ fontSize: "clamp(60px, 12vw, 110px)", fontWeight: 700, letterSpacing: "-3px" }}>VORYEL</h1>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: "42px", fontStyle: "italic", margin: "30px 0" }}>"{QUOTE}"</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <button className="v-btn v-btn-solid" onClick={() => setPage("signup")}>Enter Network</button>
              <button className="v-btn" onClick={() => setPage("network")}>The Collective</button>
            </div>
          </section>
        )}

        {/* DATA-DRIVEN COLLECTIVE */}
        {page === "network" && (
          <div style={{ padding: "160px 20px", textAlign: "center" }}>
            <h2 className="gold-text" style={{ fontSize: 45, marginBottom: 80 }}>THE COLLECTIVE</h2>
            <div className="grid-layout">
              {members.filter(m => m.role === "freelancer" || !m.role).map(m => (
                <div key={m.id} className="member-card">
                  <span style={{ color: T.goldSolid, fontSize: 10, letterSpacing: 4 }}>{m.category?.toUpperCase() || "ELITE"}</span>
                  <h3 style={{ fontSize: 32, margin: "15px 0", fontWeight: 400 }}>{m.name}</h3>
                  <p style={{ color: T.goldSolid, fontWeight: 700, marginBottom: 20 }}>{m.rate || "Exclusive"}</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Cormorant Garamond", fontSize: 20 }}>{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIGNUP & THE ACCORD */}
        {page === "signup" && (
          <div style={{ padding: "160px 20px", maxWidth: "650px", margin: "0 auto", textAlign: 'center' }}>
            <h2 className="gold-text" style={{ fontSize: 32, marginBottom: 50 }}>SIGN THE ACCORD</h2>
            
            <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
              <button onClick={() => setRole("freelancer")} style={{ flex: 1, padding: 18, background: role === "freelancer" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, fontFamily: 'Cinzel' }}>FREELANCER</button>
              <button onClick={() => setRole("client")} style={{ flex: 1, padding: 18, background: role === "client" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, fontFamily: 'Cinzel' }}>CLIENT</button>
            </div>

            <input className="v-input" placeholder="FULL LEGAL NAME" onChange={e => setForm({...form, name: e.target.value})} />
            <input className="v-input" placeholder="GMAIL ADDRESS" onChange={e => setForm({...form, email: e.target.value})} />
            <input className="v-input" placeholder="CATEGORY / SKILL" onChange={e => setForm({...form, category: e.target.value})} />
            <textarea className="v-input" placeholder="BIO" rows={4} onChange={e => setForm({...form, bio: e.target.value})} />
            
            <div className="accord-container">
              <strong style={{color: T.goldSolid}}>THE VORYEL ACCORD</strong><br/><br/>
              1. <strong>Excellence:</strong> You commit to delivering work at the highest possible global standard.<br/><br/>
              2. <strong>Non-Circumvention:</strong> You agree not to bypass the platform for project payments.<br/><br/>
              3. <strong>Integrity:</strong> All interactions must remain professional, transparent, and direct.<br/><br/>
              4. <strong>Mediation:</strong> Administrative Core (Founder) holds final say in project delivery disputes.
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: 40, textAlign: 'left' }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: 22, height: 22 }} />
              <label style={{ fontSize: 12, opacity: 0.8 }}>I SOLEMNLY SIGN THE VORYEL ACCORD.</label>
            </div>

            <button className="v-btn v-btn-solid" style={{ width: "100%", margin: 0 }} onClick={handleJoin} disabled={loading}>
              {loading ? "TRANSMITTING..." : "ENTER THE NETWORK"}
            </button>
          </div>
        )}
      </main>

      {/* BOTTOM MAROON FOOTER */}
      <footer className="footer-maroon">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 9, color: T.goldSolid, letterSpacing: 8, fontWeight: 700 }}>THE</div>
          <div className="gold-text" style={{ fontSize: 40, fontWeight: 700 }}>VORYEL</div>
        </div>
        <p style={{ color: T.goldSolid, letterSpacing: 8, fontSize: 14, marginBottom: 40 }}>{QUOTE.toUpperCase()}</p>
        <div style={{ opacity: 0.4, fontSize: 11 }}>
          <p>© 2026 THE VORYEL NETWORK</p>
          <p style={{ marginTop: 10 }}>FOUNDER: {FOUNDER.toUpperCase()}</p>
        </div>
      </footer>
    </div>
  );
}
     
