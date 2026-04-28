// @ts-nocheck
import React, { useState, useEffect } from "react";

/**
 * THE VORYEL NETWORK - MASTER COMMAND v13.0
 * Founder: Adetunji Ewaoluwa Destiny
 * Features: Complete Freelancer + Client Suite, Supabase Sync, Corrected Maroon Flow
 */

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const FOUNDER = "Adetunji Ewaoluwa Destiny";
const EMAIL = "thevoryel@gmail.com";
const QUOTE = "Your Vision, Our Flow.";

const T = {
  burg: "#6B1428", 
  gold: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 45%, #B38728 100%)",
  goldSolid: "#C9A84C",
  bg: "#0C0407", 
  surface: "rgba(25, 10, 15, 0.98)",
  white: "#FAF8F5",
  border: "rgba(201,168,76,0.4)"
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Cinzel:wght@400;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: ${T.bg}; 
    color: ${T.white}; 
    font-family: 'Cinzel', serif; 
    overflow-x: hidden;
  }

  .gold-text {
    background: ${T.gold};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  .center-spine {
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    padding: 18px 40px;
    font-family: 'Cinzel';
    font-size: 11px;
    letter-spacing: 3px;
    cursor: pointer;
    transition: 0.4s;
    border: 1px solid ${T.goldSolid};
    margin: 10px;
    text-transform: uppercase;
    background: transparent;
    color: ${T.goldSolid};
  }

  .btn-gold { background: ${T.goldSolid}; color: black; font-weight: 700; }
  .action-btn:hover { transform: translateY(-4px); box-shadow: 0 12px 25px rgba(107,20,40,0.5); }

  .maroon-spice-footer {
    background: linear-gradient(to bottom, ${T.bg} 0%, ${T.burg} 100%);
    padding: 140px 20px;
    border-top: 1px solid ${T.border};
    width: 100%;
  }

  input, textarea, select {
    background: rgba(255,255,255,0.04);
    border: 1px solid ${T.border};
    color: white;
    padding: 16px;
    margin-bottom: 20px;
    width: 100%;
    font-family: 'Cormorant Garamond';
    font-size: 18px;
    outline: none;
  }
`;

const Logo = ({ variant = "md", onClick }) => {
  const sizes = { md: [10, 30], xl: [18, 85] }[variant] || [10, 30];
  return (
    <div onClick={onClick} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontSize: sizes[0], color: T.goldSolid, letterSpacing: "0.8em", fontWeight: 700, marginLeft: "0.8em" }}>THE</span>
      <span className="gold-text" style={{ fontSize: sizes[1], letterSpacing: "0.1em", fontWeight: 700 }}>VORYEL</span>
    </div>
  );
};

export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState("freelancer");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rate: "", bio: "", company: "", contact_info: "", category: "Graphic Designer" });

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&order=joined_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(res => res.json()).then(data => setMembers(Array.isArray(data) ? data : []));
  }, []);

  const handleJoin = async () => {
    if(!agree) return alert("Please sign the Accord.");
    setLoading(true);
    const payload = { ...form, role, joined_at: new Date().toISOString() };
    await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    setPage("home");
    alert("Application transmitted.");
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{STYLES}</style>

      {/* SYMMETRICAL NAV */}
      <nav style={{ position: "fixed", top: 0, width: "100%", height: "110px", display: "flex", justifyContent: "space-between", padding: "0 80px", alignItems: "center", background: "rgba(12,4,7,0.98)", zIndex: 1000, borderBottom: `1px solid ${T.border}` }}>
        <Logo variant="md" onClick={() => setPage("home")} />
        <div style={{ display: "flex", gap: "45px", fontSize: "11px", fontWeight: 600 }}>
          <span onClick={() => setPage("home")} style={{ cursor: "pointer", letterSpacing: "3px", color: page === "home" ? T.goldSolid : "white" }}>IDENTITY</span>
          <span onClick={() => setPage("network")} style={{ cursor: "pointer", letterSpacing: "3px", color: page === "network" ? T.goldSolid : "white" }}>NETWORK</span>
          <span onClick={() => setPage("about")} style={{ cursor: "pointer", letterSpacing: "3px", color: page === "about" ? T.goldSolid : "white" }}>ABOUT</span>
        </div>
        <button onClick={() => setPage("signup")} style={{ background: T.burg, color: "white", border: "none", padding: "12px 25px", fontSize: "10px", fontFamily: "Cinzel", cursor: "pointer" }}>JOIN GUILD</button>
      </nav>

      <main style={{ paddingTop: "110px" }}>
        
        {/* HERO */}
        {page === "home" && (
          <div className="center-spine" style={{ padding: "140px 20px", minHeight: "85vh" }}>
            <Logo variant="xl" />
            <h1 style={{ fontSize: "55px", fontFamily: "Cormorant Garamond", fontStyle: "italic", margin: "40px 0", fontWeight: 300 }}>"{QUOTE}"</h1>
            <div style={{ display: "flex", gap: "15px" }}>
              <button className="action-btn btn-gold" onClick={() => setPage("signup")}>Join Network</button>
              <button className="action-btn" onClick={() => setPage("network")}>Explore Collective</button>
            </div>
            <p style={{ marginTop: "100px", color: T.goldSolid, letterSpacing: "8px", fontSize: "12px" }}>ESTABLISHED 2026</p>
          </div>
        )}

        {/* THE COLLECTIVE (FREELANCER DATA) */}
        {page === "network" && (
          <div className="center-spine" style={{ padding: "100px 20px" }}>
            <h2 className="gold-text" style={{ fontSize: "40px", marginBottom: "60px", letterSpacing: "5px" }}>THE COLLECTIVE</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "40px", width: "100%" }}>
              {members.filter(m => m.role === 'freelancer').map(m => (
                <div key={m.id} style={{ padding: "50px 40px", background: T.surface, border: `1px solid ${T.border}`, textAlign: "left" }}>
                  <span style={{ color: T.goldSolid, fontSize: "10px", letterSpacing: "2px" }}>{m.category?.toUpperCase()}</span>
                  <h3 style={{ fontSize: "28px", margin: "15px 0" }}>{m.name}</h3>
                  <p style={{ color: "#AAA", fontFamily: "Cormorant Garamond", fontSize: "18px", marginBottom: "25px" }}>{m.bio}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: T.goldSolid, fontWeight: "bold" }}>{m.rate}</span>
                    <button className="action-btn" style={{ padding: "10px 20px", margin: 0, fontSize: "9px" }} onClick={() => window.location.href=`mailto:${EMAIL}`}>HIRE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DUAL-INPUT SIGNUP ACCORD */}
        {page === "signup" && (
          <div className="center-spine" style={{ padding: "80px 20px", maxWidth: "600px" }}>
            <h2 className="gold-text" style={{ fontSize: "32px", marginBottom: "40px" }}>SIGN THE ACCORD</h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "30px", width: "100%" }}>
              <button onClick={() => setRole("freelancer")} style={{ flex: 1, padding: "15px", background: role === "freelancer" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, cursor: "pointer" }}>FREELANCER</button>
              <button onClick={() => setRole("client")} style={{ flex: 1, padding: "15px", background: role === "client" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, cursor: "pointer" }}>CLIENT</button>
            </div>

            <input placeholder="LEGAL FULL NAME" onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="GMAIL ADDRESS" onChange={e => setForm({...form, email: e.target.value})} />
            
            {role === "freelancer" ? (
              <>
                <select onChange={e => setForm({...form, category: e.target.value})}>
                  <option>Graphic Designer</option>
                  <option>Web Programmer</option>
                  <option>UI/UX Architect</option>
                  <option>Video Editor</option>
                </select>
                <input placeholder="HOURLY RATE (e.g. $50/hr)" onChange={e => setForm({...form, rate: e.target.value})} />
                <textarea placeholder="PROFESSIONAL BIO" rows={4} onChange={e => setForm({...form, bio: e.target.value})} />
              </>
            ) : (
              <>
                <input placeholder="COMPANY / PROJECT NAME" onChange={e => setForm({...form, company: e.target.value})} />
                <input placeholder="OTHER CONTACT (Phone/LinkedIn/WhatsApp)" onChange={e => setForm({...form, contact_info: e.target.value})} />
                <textarea placeholder="PROJECT BRIEF / NEEDS" rows={4} onChange={e => setForm({...form, bio: e.target.value})} />
              </>
            )}

            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "30px" }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: "20px", height: "20px", marginBottom: 0 }} />
              <label style={{ fontSize: "11px", color: "#AAA" }}>I agree to the Voryel commission and non-circumvention accord.</label>
            </div>

            <button className="action-btn btn-gold" style={{ width: "100%", margin: 0 }} onClick={handleJoin} disabled={loading}>
              {loading ? "TRANSMITTING..." : "ENTER THE NETWORK"}
            </button>
          </div>
        )}
      </main>

      {/* MAROON SPICED FOOTER */}
      <footer className="maroon-spice-footer">
        <div className="center-spine">
          <Logo variant="md" />
          <p style={{ color: T.goldSolid, margin: "40px 0", letterSpacing: "8px" }}>{QUOTE.toUpperCase()}</p>
          <div style={{ opacity: 0.3, fontSize: "10px" }}>
            <p>© 2026 THE VORYEL NETWORK</p>
            <p>CURATED BY {FOUNDER.toUpperCase()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
