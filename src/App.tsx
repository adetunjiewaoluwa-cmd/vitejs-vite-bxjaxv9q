// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";

/**
 * THE VORYEL NETWORK - MASTER COMMAND v8.0
 * Founded by: Adetunji Ewaoluwa Destiny
 * Quote: "Your Vision, Our Flow."
 * Status: FULL DB + CLIENT CONTACT CAPTURE + SYMMETRY
 */

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const FOUNDER = "Adetunji Ewaoluwa Destiny";
const EMAIL = "thevoryel@gmail.com";
const QUOTE = "Your Vision, Our Flow.";

const T = {
  burg: "#6B1428", 
  burgD: "#2D0812", 
  burgGlow: "rgba(107, 20, 40, 0.4)",
  gold: "linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
  goldSolid: "#C9A84C",
  bg: "#0C0407", 
  surface: "rgba(25, 10, 15, 0.85)",
  white: "#FAF8F5",
  muted: "rgba(250,248,245,0.6)",
  border: "rgba(201,168,76,0.25)",
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .vu { animation: fadeUp 1.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(50px); filter: blur(10px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  .gold-text {
    background: ${T.gold};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  .premium-card {
    background: ${T.surface};
    backdrop-filter: blur(20px);
    border: 1px solid ${T.border};
    padding: 60px 45px;
    position: relative;
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .premium-card:hover {
    border-color: ${T.goldSolid};
    box-shadow: 0 20px 50px -10px ${T.burgGlow}, 0 0 15px rgba(201,168,76,0.2);
    transform: translateY(-12px) scale(1.01);
  }

  .center-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input, select, textarea {
    background: rgba(255,255,255,0.04) !important;
    border: 1px solid ${T.border} !important;
    color: white !important;
    padding: 18px !important;
    font-family: 'Cormorant Garamond' !important;
    font-size: 18px !important;
    outline: none !important;
    width: 100%;
    transition: 0.3s;
    margin-bottom: 25px;
  }

  input:focus { border-color: ${T.goldSolid} !important; background: rgba(201,168,76,0.05) !important; }

  button { transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
  button:hover { letter-spacing: 3px; filter: brightness(1.2); }
`;

// --- DATABASE ENGINE ---
const db = {
  async call(method, table, body = null) {
    const options = {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      }
    };
    if (body) options.body = JSON.stringify(body);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, options);
      return await res.json();
    } catch (e) { return []; }
  },
  profiles: {
    list: () => db.call("GET", "profiles?select=*&order=joined_at.desc"),
    save: (data) => db.call("POST", "profiles", data)
  }
};

// --- ALIGNED UI COMPONENTS ---
const Logo = ({ variant = "md", onClick }) => {
  const sizes = { sm: [8, 18], md: [10, 30], lg: [14, 55], xl: [16, 85] }[variant];
  return (
    <div onClick={onClick} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <span style={{ fontSize: sizes[0], color: T.goldSolid, letterSpacing: "0.7em", marginLeft: "0.7em", fontWeight: 700 }}>THE</span>
      <span className="gold-text" style={{ fontSize: sizes[1], letterSpacing: "0.15em", fontWeight: 700 }}>VORYEL</span>
    </div>
  );
};

const Section = ({ children, maroon, style, fullHeight }) => (
  <section style={{ 
    padding: "140px 20px", 
    width: "100vw",
    minHeight: fullHeight ? "80vh" : "auto",
    background: maroon ? `linear-gradient(180deg, ${T.bg} 0%, ${T.burgD} 100%)` : T.bg,
    display: "flex", 
    justifyContent: "center", 
    ...style 
  }}>
    <div className="center-container">{children}</div>
  </section>
);

export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [role, setRole] = useState("freelancer");
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    cat: "Web Designer", 
    rate: "", 
    bio: "", 
    email: "", 
    contact_info: "", 
    company: "" 
  });

  useEffect(() => {
    db.profiles.list().then(data => {
      setMembers(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const handleJoin = async () => {
    if (!agree || !form.name || !form.email) return;
    setLoading(true);
    const payload = { ...form, role, joined_at: new Date().toISOString() };
    await db.profiles.save(payload);
    setUser(payload);
    setPage("home");
    setLoading(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{STYLES}</style>

      {/* NAVIGATION */}
      <nav style={{ 
        position: "fixed", top: 0, width: "100%", height: "110px", 
        display: "flex", justifyContent: "space-between", padding: "0 100px", 
        alignItems: "center", background: "rgba(12,4,7,0.98)", 
        backdropFilter: "blur(25px)", borderBottom: `1px solid ${T.border}`, zIndex: 1000 
      }}>
        <Logo variant="md" onClick={() => setPage("home")} />
        <div style={{ display: "flex", gap: "60px", fontSize: "10px", letterSpacing: "5px" }}>
          {["home", "network", "about", "contact"].map(p => (
            <span key={p} onClick={() => setPage(p)} style={{ 
              cursor: "pointer", color: page === p ? T.goldSolid : "white", fontWeight: 700, transition: "0.3s"
            }}>
              {p === "home" ? "IDENTITY" : p.toUpperCase()}
            </span>
          ))}
        </div>
        {user ? (
           <div style={{ border: `1px solid ${T.goldSolid}`, padding: "8px 20px" }}>
             <span className="gold-text" style={{ fontSize: 10 }}>{user.name.toUpperCase()}</span>
           </div>
        ) : (
          <button onClick={() => setPage("signup")} style={{ background: T.burg, color: "white", padding: "14px 35px", fontSize: "10px", border: "none", cursor: "pointer", letterSpacing: "2px" }}>JOIN</button>
        )}
      </nav>

      <main style={{ paddingTop: "110px" }}>
        {page === "home" && (
          <div className="vu">
            <Section fullHeight style={{ background: `radial-gradient(circle, ${T.burg} -70%, ${T.bg} 80%)` }}>
              <Logo variant="xl" />
              <h1 style={{ fontSize: "clamp(35px, 6vw, 65px)", fontFamily: "Cormorant Garamond", fontWeight: 300, marginTop: "30px", fontStyle: "italic" }}>"{QUOTE}"</h1>
              <div style={{ width: "100px", height: "1px", background: T.gold, margin: "40px 0" }}></div>
              <p style={{ color: T.muted, fontSize: "14px", letterSpacing: "8px" }}>ESTABLISHED 2026</p>
            </Section>
            
            <Section maroon>
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "40px", width: "100%" }}>
                  {[
                    ["The Handshake", "Direct, high-stakes connections between visionary clients and creators."],
                    ["The Flow", "A structural methodology for project delivery that ensures total precision."],
                    ["The Accord", "Legal and professional protections for every member of the collective."]
                  ].map(([title, desc]) => (
                    <div key={title} className="premium-card">
                      <h3 className="gold-text" style={{ fontSize: "15px", marginBottom: "25px", letterSpacing: "4px" }}>{title.toUpperCase()}</h3>
                      <p style={{ fontFamily: "Cormorant Garamond", fontSize: "20px", color: T.muted, lineHeight: "1.8" }}>{desc}</p>
                    </div>
                  ))}
               </div>
            </Section>
          </div>
        )}

        {page === "network" && (
          <Section style={{ paddingTop: "160px" }}>
            <h2 style={{ fontSize: "40px", letterSpacing: "8px", marginBottom: "15px" }}>THE <span className="gold-text">COLLECTIVE</span></h2>
            <p style={{ color: T.muted, fontSize: "11px", letterSpacing: "4px", marginBottom: "100px" }}>VETTED ELITE SPECIALISTS</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "50px", width: "100%" }}>
              {loading ? <p>TRANSMITTING DATA...</p> : members.filter(m => m.role === 'freelancer').map(m => (
                <div key={m.id} className="premium-card">
                  <span style={{ fontSize: "10px", color: T.goldSolid, letterSpacing: "4px" }}>{m.cat?.toUpperCase() || "SPECIALIST"}</span>
                  <h3 style={{ fontSize: "32px", margin: "20px 0", fontWeight: 400 }}>{m.name}</h3>
                  <p style={{ fontSize: "20px", color: T.white, marginBottom: "25px", fontFamily: "Cormorant Garamond" }}>Starting at {m.rate}</p>
                  <p style={{ color: T.muted, fontFamily: "Cormorant Garamond", fontSize: "18px", lineHeight: 1.6, marginBottom: "40px" }}>{m.bio}</p>
                  <button onClick={() => window.location.href=`mailto:${EMAIL}?subject=Hire: ${m.name}`} style={{ width: "100%", padding: "20px", background: "transparent", border: `1px solid ${T.goldSolid}`, color: T.goldSolid, cursor: "pointer", fontFamily: "Cinzel", fontSize: "11px" }}>PICK SPECIALIST</button>
                </div>
              ))}
            </div>
          </Section>
        )}

        {page === "signup" && (
          <Section maroon fullHeight>
            <div className="premium-card" style={{ maxWidth: "550px", width: "100%" }}>
              <h2 className="gold-text" style={{ textAlign: "center", marginBottom: "40px", fontSize: 24 }}>SIGN THE ACCORD</h2>
              
              <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                <button onClick={() => setRole("freelancer")} style={{ flex: 1, padding: 20, background: role === "freelancer" ? T.burg : "transparent", border: `1px solid ${T.border}`, color: "white", fontSize: 10 }}>FREELANCER</button>
                <button onClick={() => setRole("client")} style={{ flex: 1, padding: 20, background: role === "client" ? T.burg : "transparent", border: `1px solid ${T.border}`, color: "white", fontSize: 10 }}>CLIENT</button>
              </div>

              <input placeholder="LEGAL FULL NAME" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="GMAIL ADDRESS" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              
              {role === "freelancer" ? (
                <>
                  <input placeholder="STARTING RATE (e.g. $100/hr)" value={form.rate} onChange={e => setForm({...form, rate: e.target.value})} />
                  <textarea placeholder="PROFESSIONAL BIO" rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
                </>
              ) : (
                <>
                  <input placeholder="COMPANY OR PROJECT NAME" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
                  <textarea placeholder="PROJECT BRIEF / WHAT ARE YOU LOOKING FOR?" rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
                  <input placeholder="PREFERRED CONTACT (Phone/LinkedIn/WhatsApp)" value={form.contact_info} onChange={e => setForm({...form, contact_info: e.target.value})} />
                </>
              )}

              <div style={{ display: "flex", gap: "20px", marginBottom: "40px", alignItems: "flex-start" }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: "25px", height: "25px", marginTop: "5px" }} />
                <label style={{ fontSize: "11px", color: T.muted, lineHeight: 1.5 }}>
                  By joining, I agree to the Voryel Accord, including platform mediation and anti-circumvention protocols.
                </label>
              </div>

              <button disabled={!agree || loading} onClick={handleJoin} style={{ width: "100%", padding: "22px", background: T.goldSolid, color: "black", border: "none", cursor: "pointer", fontFamily: "Cinzel", fontWeight: "bold", letterSpacing: 2 }}>
                {loading ? "TRANSMITTING..." : "ENTER THE NETWORK"}
              </button>
            </div>
          </Section>
        )}

        {/* ABOUT & CONTACT PAGES REMAIN CONSTANT */}
        {page === "about" && (
           <Section maroon fullHeight style={{ textAlign: "center" }}>
             <h2 className="gold-text" style={{ fontSize: "45px", marginBottom: "60px" }}>LINKING EXCELLENCE</h2>
             <p style={{ fontSize: "26px", fontFamily: "Cormorant Garamond", lineHeight: "2", color: T.muted, maxWidth: "850px" }}>
               The Voryel is a premier guild founded by <strong>{FOUNDER}</strong>. We solve the complexity of linking elite talent with visionary projects. Our platform acts as the bridge—ensuring "The Flow" is never interrupted.
             </p>
           </Section>
        )}

        {page === "contact" && (
          <Section fullHeight style={{ justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <h4 className="gold-text" style={{ letterSpacing: "10px", marginBottom: "30px", fontSize: 12 }}>DIRECT CHANNEL</h4>
              <div className="premium-card" style={{ display: "inline-block", padding: "80px 120px" }}>
                <h3 style={{ fontSize: "38px", letterSpacing: "3px", fontFamily: "Cormorant Garamond" }}>{EMAIL}</h3>
                <p style={{ marginTop: "40px", fontSize: "10px", color: T.muted, letterSpacing: 5 }}>ADMINISTRATIVE CORE · IBADAN, NIGERIA</p>
              </div>
            </div>
          </Section>
        )}
      </main>

      <footer style={{ padding: "140px 20px", background: T.burgD, borderTop: `1px solid ${T.border}`, textAlign: "center", width: "100vw" }}>
        <div className="center-container">
          <Logo variant="md" />
          <p style={{ color: T.goldSolid, fontSize: "14px", letterSpacing: "8px", margin: "50px 0" }}>{QUOTE.toUpperCase()}</p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>© 2026 THE VORYEL NETWORK · CURATED BY {FOUNDER.toUpperCase()}</p>
        </div>
      </footer>
    </div>
  );
}
