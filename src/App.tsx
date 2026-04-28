// @ts-nocheck
import React, { useState, useEffect } from "react";

/**
 * THE VORYEL NETWORK - SUPREME ARCHITECT v19.0
 * Founder: Adetunji Ewaoluwa Destiny
 * Features: Full Legal Accord, Double-Ended Maroon Spice, Data Persistence
 */

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const FOUNDER = "Adetunji Ewaoluwa Destiny";
const EMAIL = "thevoryel@gmail.com";
const QUOTE = "Your Vision, Our Flow.";

const T = {
  burg: "#6B1428", 
  burgDeep: "#1A050A",
  gold: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 45%, #B38728 100%)",
  goldSolid: "#C9A84C",
  bg: "#0C0407", 
  surface: "rgba(25, 10, 15, 0.98)",
  white: "#FAF8F5",
  border: "rgba(201,168,76,0.3)"
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Cinzel:wght@400;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: ${T.bg}; 
    color: ${T.white}; 
    font-family: 'Cinzel', serif; 
    overflow-x: hidden;
    display: flex; flex-direction: column; align-items: center;
  }

  .gold-text {
    background: ${T.gold}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;
  }

  .v-nav {
    position: fixed; top: 0; width: 100%; height: 110px;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 6%; background: rgba(12, 4, 7, 0.98);
    border-bottom: 1px solid ${T.border}; z-index: 1000;
  }

  .hero-maroon {
    background: linear-gradient(180deg, ${T.burg} 0%, ${T.burgDeep} 60%, ${T.bg} 100%);
    width: 100vw; padding: 180px 20px 100px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }

  .footer-maroon {
    background: linear-gradient(to bottom, ${T.bg} 0%, ${T.burgDeep} 40%, ${T.burg} 100%);
    width: 100vw; padding: 150px 20px; border-top: 1px solid ${T.border};
    margin-top: 100px; display: flex; flex-direction: column; align-items: center; text-align: center;
  }

  .v-btn {
    padding: 18px 45px; font-family: 'Cinzel'; font-size: 11px; letter-spacing: 4px;
    text-transform: uppercase; cursor: pointer; transition: 0.4s;
    border: 1px solid ${T.goldSolid}; background: transparent; color: ${T.goldSolid}; margin: 10px;
  }
  .v-btn-gold { background: ${T.goldSolid}; color: black; font-weight: 700; }

  .accord-box {
    background: rgba(0,0,0,0.4); border: 1px solid ${T.border};
    height: 180px; overflow-y: scroll; padding: 20px;
    margin-bottom: 25px; text-align: left; font-family: 'Cormorant Garamond';
    font-size: 15px; line-height: 1.6; color: #AAA;
  }

  input, textarea, select {
    width: 100%; background: rgba(255,255,255,0.03); border: 1px solid ${T.border};
    padding: 20px; color: white; font-family: 'Cormorant Garamond'; font-size: 19px; margin-bottom: 20px; outline: none;
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
    if(!agree) return alert("You must sign the Accord to proceed.");
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

      <nav className="v-nav">
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.goldSolid, letterSpacing: 8 }}>THE</div>
          <div className="gold-text" style={{ fontSize: 32, fontWeight: 700 }}>VORYEL</div>
        </div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <span onClick={() => setPage("home")} style={{ cursor: 'pointer', fontSize: 10, letterSpacing: 3 }}>IDENTITY</span>
          <span onClick={() => setPage("network")} style={{ cursor: 'pointer', fontSize: 10, letterSpacing: 3 }}>NETWORK</span>
        </div>
        <button className="v-btn" style={{ padding: "10px 25px", background: T.burg, color: 'white', border: 'none' }} onClick={() => setPage("signup")}>JOIN</button>
      </nav>

      <main style={{ width: "100%" }}>
        {page === "home" && (
          <section className="hero-maroon">
            <div style={{ fontSize: 12, color: T.goldSolid, letterSpacing: 10, marginBottom: 20 }}>ESTABLISHED 2026</div>
            <h1 className="gold-text" style={{ fontSize: "clamp(50px, 10vw, 100px)", fontWeight: 700 }}>VORYEL</h1>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: "38px", fontStyle: "italic", margin: "20px 0" }}>"{QUOTE}"</p>
            <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
              <button className="v-btn v-btn-gold" onClick={() => setPage("signup")}>Enter Guild</button>
              <button className="v-btn" onClick={() => setPage("network")}>Collective</button>
            </div>
          </section>
        )}

        {page === "network" && (
          <div style={{ padding: "150px 20px", textAlign: "center", maxWidth: 1200, margin: '0 auto' }}>
            <h2 className="gold-text" style={{ fontSize: 40, marginBottom: 60 }}>THE COLLECTIVE</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 30 }}>
              {members.filter(m => m.role === "freelancer" || !m.role).map(m => (
                <div key={m.id} style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 40, textAlign: 'left' }}>
                  <span style={{ color: T.goldSolid, fontSize: 10 }}>{m.category?.toUpperCase() || "ELITE"}</span>
                  <h3 style={{ fontSize: 28, margin: "10px 0" }}>{m.name}</h3>
                  <p style={{ color: "#888", fontFamily: "Cormorant Garamond", fontSize: 18 }}>{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "signup" && (
          <div style={{ padding: "150px 20px", maxWidth: "600px", margin: "0 auto", textAlign: 'center' }}>
            <h2 className="gold-text" style={{ fontSize: 32, marginBottom: 40 }}>SIGN THE ACCORD</h2>
            <input placeholder="LEGAL NAME" onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="GMAIL ADDRESS" onChange={e => setForm({...form, email: e.target.value})} />
            
            {/* THE LEGAL TERMS SECTION */}
            <div className="accord-box">
              <strong style={{color: T.goldSolid}}>THE VORYEL ACCORD (TERMS OF SERVICE)</strong><br/><br/>
              1. <strong>Excellence:</strong> Every member commits to a standard of absolute professional integrity.<br/>
              2. <strong>Mediation:</strong> The Voryel Network acts as the primary mediator for all project disputes.<br/>
              3. <strong>Commission:</strong> A platform fee is applied to all successful project matches within the flow.<br/>
              4. <strong>Non-Circumvention:</strong> Members agree not to bypass the Voryel Network for project payments.<br/>
              5. <strong>Confidentiality:</strong> Identity and project specifics remain under absolute guild protection.
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: 30, textAlign: 'left' }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: 20, height: 20, marginBottom: 0 }} />
              <label style={{ fontSize: 11, opacity: 0.6 }}>I HAVE READ AND SOLEMNLY AGREE TO THE VORYEL ACCORD.</label>
            </div>

            <button className="v-btn v-btn-gold" style={{ width: "100%", margin: 0 }} onClick={handleJoin} disabled={loading}>
              {loading ? "TRANSMITTING..." : "SIGN & JOIN"}
            </button>
          </div>
        )}
      </main>

      <footer className="footer-maroon">
        <div className="gold-text" style={{ fontSize: 36, fontWeight: 700 }}>VORYEL</div>
        <p style={{ color: T.goldSolid, letterSpacing: 8, fontSize: 14, margin: '30px 0' }}>{QUOTE.toUpperCase()}</p>
        <div style={{ opacity: 0.4, fontSize: 11 }}>
          <p>© 2026 THE VORYEL NETWORK</p>
          <p style={{ marginTop: 10 }}>FOUNDER: {FOUNDER.toUpperCase()}</p>
        </div>
      </footer>
    </div>
  );
}
