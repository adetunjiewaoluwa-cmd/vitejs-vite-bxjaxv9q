// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";

/**
 * THE VORYEL NETWORK - EXTENDED CORE v4.0
 * Founded by: Adetunji Ewaoluwa Destiny
 * Quote: "Your Vision, Our Flow."
 * Current Year: 2026
 */

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const FOUNDER = "Adetunji Ewaoluwa Destiny";
const EMAIL = "thevoryel@gmail.com";
const QUOTE = "Your Vision, Our Flow.";

// --- THEME ENGINE ---
const T = {
  burg: "#6B1428", burgD: "#3D0B18", burgM: "#8B1A35",
  gold: "#C9A84C", goldL: "#E2C06A", goldP: "#F5EBC8",
  bg: "#0C0407", surface: "#130609", surfaceL: "#1c0a0f",
  white: "#FAF8F5",
  muted: "rgba(250,248,245,0.55)",
  faint: "rgba(250,248,245,0.25)",
  ghost: "rgba(250,248,245,0.08)",
  border: "rgba(201,168,76,0.15)",
  borderA: "rgba(201,168,76,0.45)",
  err: "#ff4d4d",
  success: "#4caf50"
};

const CATEGORIES = [
  "Web Designer", "Graphic Designer", "Programmer", 
  "UI/UX Architect", "Video Editor", "Brand Strategist", "Software Engineer"
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: ${T.bg}; 
    color: ${T.white}; 
    font-family: 'Cinzel', serif; 
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.burgD}; border-radius: 10px; }

  .vu { animation: fadeUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  .hov-card { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
  .hov-card:hover { 
    transform: translateY(-10px); 
    border-color: ${T.gold} !important;
    background: ${T.surfaceL} !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  }

  .nav-link { 
    position: relative; 
    transition: color 0.3s;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0%;
    height: 1px;
    background: ${T.gold};
    transition: width 0.3s;
  }
  .nav-link:hover::after { width: 100%; }

  input, select, textarea {
    background: ${T.ghost} !important;
    border: 1px solid ${T.border} !important;
    color: ${T.white} !important;
    padding: 14px !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 16px !important;
    outline: none !important;
    transition: all 0.3s !important;
  }
  input:focus, select:focus, textarea:focus {
    border-color: ${T.gold} !important;
    background: rgba(201,168,76,0.05) !important;
  }
`;

// --- DB HANDLERS ---
const db = {
  async req(method, path, body = null) {
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
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, options);
    return res.json();
  },
  profiles: {
    get: () => db.req("GET", "profiles?select=*&order=joined_at.desc"),
    upsert: (data) => db.req("POST", "profiles", data)
  },
  jobs: {
    get: () => db.req("GET", "jobs?select=*,profiles(name)&order=created_at.desc"),
    post: (data) => db.req("POST", "jobs", data)
  }
};

// --- CORE UI COMPONENTS ---
const Logo = ({ variant = "md", onClick }) => {
  const sizes = { 
    sm: [8, 18], 
    md: [10, 26], 
    lg: [14, 48], 
    xl: [18, 70] 
  }[variant];
  
  return (
    <div onClick={onClick} style={{ cursor: "pointer", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontSize: sizes[0], color: T.goldL, letterSpacing: ".5em", fontWeight: 400 }}>THE</span>
      <span style={{ fontSize: sizes[1], letterSpacing: ".15em", fontWeight: 500, color: T.white }}>VORYEL</span>
    </div>
  );
};

const Btn = ({ children, onClick, full, variant = "primary", disabled, loading }) => (
  <button 
    disabled={disabled || loading}
    onClick={onClick} 
    style={{ 
      padding: "16px 32px", 
      background: variant === "primary" ? T.burg : "transparent", 
      color: T.gold, 
      border: `1px solid ${variant === "primary" ? T.burgM : T.gold}`, 
      cursor: disabled ? "not-allowed" : "pointer", 
      fontFamily: "Cinzel", 
      fontSize: 10, 
      letterSpacing: 2, 
      width: full ? "100%" : "auto",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s",
      opacity: disabled ? 0.5 : 1
    }}>
    {loading ? "TRANSMITTING..." : children.toUpperCase()}
  </button>
);

// --- PAGES ---
const Home = ({ setPage }) => (
  <div className="vu">
    <section style={{ 
      height: "90vh", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      textAlign: "center",
      background: `radial-gradient(circle at center, ${T.burgD} 0%, ${T.bg} 80%)`,
      padding: "0 20px"
    }}>
      <Logo variant="xl" />
      <h1 style={{ 
        fontSize: "clamp(32px, 8vw, 72px)", 
        marginTop: 30, 
        fontFamily: "Cormorant Garamond", 
        fontWeight: 300,
        letterSpacing: -1
      }}>
        {QUOTE}
      </h1>
      <p style={{ 
        maxWidth: 700, 
        marginTop: 20, 
        color: T.muted, 
        fontSize: 20, 
        fontFamily: "Cormorant Garamond", 
        fontStyle: "italic",
        lineHeight: 1.6
      }}>
        Welcome to the guild. We provide the structural flow that allows your creative and technical visions to manifest. Curated for the world's most discerning professionals.
      </p>
      <div style={{ marginTop: 50, display: "flex", gap: 20 }}>
        <Btn onClick={() => setPage("network")}>Explore Collective</Btn>
        <Btn variant="outline" onClick={() => setPage("signup")}>Sign the Accord</Btn>
      </div>
    </section>

    {/* INTRO CONTENT (Adding lines for depth) */}
    <section style={{ padding: "100px 50px", maxWidth: 1200, margin: "0 auto" }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60 }}>
          <div>
            <h3 style={{ color: T.gold, fontSize: 14, marginBottom: 20 }}>THE MISSION</h3>
            <p style={{ color: T.muted, fontFamily: "Cormorant Garamond", fontSize: 18 }}>
              To serve as the bridge between elite talent and high-stakes projects. We prioritize the "Flow"—the intersection of skill, focus, and outcome.
            </p>
          </div>
          <div>
            <h3 style={{ color: T.gold, fontSize: 14, marginBottom: 20 }}>THE STANDARDS</h3>
            <p style={{ color: T.muted, fontFamily: "Cormorant Garamond", fontSize: 18 }}>
              Every member is vetted for technical mastery and professional integrity. The Voryel is a restricted sanctuary for those who lead their fields.
            </p>
          </div>
          <div>
            <h3 style={{ color: T.gold, fontSize: 14, marginBottom: 20 }}>THE FOUNDATION</h3>
            <p style={{ color: T.muted, fontFamily: "Cormorant Garamond", fontSize: 18 }}>
              Led by {FOUNDER}, the network operates on transparency, ensuring every connection results in a legacy-grade deliverable.
            </p>
          </div>
       </div>
    </section>
  </div>
);

const About = () => (
  <div className="vu" style={{ padding: "160px 20px", maxWidth: 850, margin: "0 auto" }}>
    <h4 style={{ color: T.gold, letterSpacing: 8, textAlign: "center", fontSize: 12 }}>THE PHILOSOPHY</h4>
    <h2 style={{ fontSize: 48, textAlign: "center", margin: "20px 0 60px", fontFamily: "Cormorant Garamond" }}>Linking Excellence</h2>
    <div style={{ fontFamily: "Cormorant Garamond", fontSize: 22, color: T.muted, lineHeight: 2 }}>
      <p style={{ marginBottom: 40 }}>
        The Voryel was established in 2026 to solve a critical failure in the digital marketplace: the dilution of quality. In a world of mass-produced services, we represent the "Boutique" approach to human connection.
      </p>
      <p style={{ marginBottom: 40 }}>
        Our identity is built on the concept of <strong>The Flow</strong>. For a client, flow means a project that moves from conception to completion without friction. For a freelancer, flow means being matched with work that respects their specialization and pays their worth.
      </p>
      <p>
        Founded by {FOUNDER}, we continue to curate the world's finest Web Designers, Programmers, and Graphic Artists into a single, high-functioning guild.
      </p>
    </div>
  </div>
);

const Network = ({ members, loading }) => (
  <div className="vu" style={{ padding: "140px 40px" }}>
    <h2 style={{ textAlign: "center", color: T.gold, fontSize: 32, marginBottom: 15 }}>THE COLLECTIVE</h2>
    <p style={{ textAlign: "center", color: T.faint, fontSize: 10, letterSpacing: 4, marginBottom: 80 }}>CURATED MEMBERSHIP</p>
    
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 30, maxWidth: 1400, margin: "0 auto" }}>
      {loading ? [1,2,3].map(i => <div key={i} style={{ height: 400, background: T.ghost, border: `1px solid ${T.border}` }} />) :
      members.map(m => (
        <div key={m.id} className="hov-card" style={{ background: T.surface, padding: 50, border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 9, color: T.gold, letterSpacing: 3, marginBottom: 15 }}>{m.category?.toUpperCase() || "SPECIALIST"}</span>
          <h3 style={{ fontSize: 28, marginBottom: 10, fontWeight: 400 }}>{m.name}</h3>
          <p style={{ fontSize: 18, color: T.goldP, marginBottom: 25, fontFamily: "Cormorant Garamond" }}>Est. Rate: {m.rate || "Project-based"}</p>
          <p style={{ color: T.muted, fontFamily: "Cormorant Garamond", fontSize: 17, lineHeight: 1.6, flexGrow: 1, marginBottom: 30 }}>{m.bio || "A master of the craft, dedicated to the Voryel flow and excellence in every pixel and line of code."}</p>
          <Btn variant="outline" full onClick={() => window.location.href = `mailto:${EMAIL}?subject=Hire Request: ${m.name}`}>Pick Specialist</Btn>
        </div>
      ))}
    </div>
  </div>
);

const Terms = () => (
  <div className="vu" style={{ padding: "160px 20px", maxWidth: 900, margin: "0 auto" }}>
    <h2 style={{ color: T.gold, textAlign: "center", fontSize: 32, marginBottom: 60 }}>THE ACCORD</h2>
    <div style={{ display: "grid", gap: 50 }}>
      {[
        ["Platform Commission", "To maintain the quality of the network and handle administrative overhead, a 15% commission is applied to all initial contracts facilitated through The Voryel. This ensures we can continue to curate the best talent for the best clients."],
        ["Anti-Circumvention", "Members of the guild agree that once a connection is made via The Voryel, all subsequent contracts for a period of 24 months shall be processed through the network. Bypassing the system results in immediate and permanent expulsion."],
        ["The Quality Flow", "All output delivered must adhere to the high-end standards of the network. The administrative core, led by the founder, reserves the right to mediate in cases where 'The Flow' is disrupted by sub-standard performance."],
        ["Payment Protocols", "Clients agree to clear funds through the established network channels. Freelancers are granted protection of their Intellectual Property until full payment and commission have been reconciled."]
      ].map(([title, text], idx) => (
        <div key={idx} style={{ borderLeft: `2px solid ${T.burg}`, paddingLeft: 30 }}>
          <h4 style={{ color: T.white, fontSize: 16, marginBottom: 15 }}>{idx + 1}. {title.toUpperCase()}</h4>
          <p style={{ color: T.muted, fontFamily: "Cormorant Garamond", fontSize: 19, lineHeight: 1.8 }}>{text}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- MAIN APP ENGINE ---
export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Signup State
  const [role, setRole] = useState("freelancer");
  const [formData, setFormData] = useState({ name: "", cat: CATEGORIES[0], rate: "", bio: "" });
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    db.profiles.get().then(data => {
      setMembers(data);
      setLoading(false);
    });
  }, []);

  const handleSignup = async () => {
    if (!agree) return;
    setLoading(true);
    const payload = {
      ...formData,
      role,
      joined_at: new Date().toISOString()
    };
    await db.profiles.upsert(payload);
    setUser(payload);
    setPage("home");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <style>{STYLES}</style>

      {/* NAVIGATION */}
      <nav style={{ 
        position: "fixed", top: 0, width: "100%", height: 90, 
        display: "flex", justifyContent: "space-between", padding: "0 60px", 
        alignItems: "center", background: "rgba(12,4,7,0.9)", 
        backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, 
        zIndex: 1000 
      }}>
        <Logo variant="md" onClick={() => setPage("home")} />
        
        <div style={{ display: "flex", gap: 40, fontSize: 10, letterSpacing: 3 }}>
          {[
            ["home", "Identity"],
            ["network", "Network"],
            ["about", "About"],
            ["terms", "Legal"],
            ["contact", "Contact"]
          ].map(([id, label]) => (
            <span 
              key={id} 
              className="nav-link"
              onClick={() => setPage(id)} 
              style={{ cursor: "pointer", color: page === id ? T.gold : T.white }}>
              {label.toUpperCase()}
            </span>
          ))}
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <span style={{ color: T.gold, fontSize: 10 }}>{user.name.toUpperCase()}</span>
            <div style={{ width: 35, height: 35, borderRadius: "50%", background: T.burg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{user.name[0]}</div>
          </div>
        ) : (
          <Btn onClick={() => setPage("signup")}>Join Guild</Btn>
        )}
      </nav>

      {/* PAGE ROUTER */}
      <main style={{ paddingTop: 90 }}>
        {page === "home" && <Home setPage={setPage} />}
        {page === "about" && <About />}
        {page === "network" && <Network members={members} loading={loading} />}
        {page === "terms" && <Terms />}
        
        {page === "contact" && (
          <div className="vu" style={{ textAlign: "center", padding: "180px 20px" }}>
            <h4 style={{ color: T.gold, letterSpacing: 10, fontSize: 12, marginBottom: 20 }}>DIRECT CHANNELS</h4>
            <h2 style={{ fontSize: 56, fontFamily: "Cormorant Garamond", marginBottom: 40 }}>Get in Touch</h2>
            <div style={{ background: T.surface, padding: 60, border: `1px solid ${T.border}`, maxWidth: 600, margin: "0 auto" }}>
               <p style={{ color: T.muted, fontSize: 18, fontFamily: "Cormorant Garamond", marginBottom: 30 }}>For institutional inquiries, project mediation, or guild membership disputes:</p>
               <h3 style={{ fontSize: 32, color: T.white, letterSpacing: 2 }}>{EMAIL}</h3>
               <div style={{ marginTop: 40, paddingTop: 40, borderTop: `1px solid ${T.ghost}` }}>
                  <p style={{ fontSize: 10, color: T.gold }}>ADMINISTRATIVE CORE · IBADAN, NIGERIA</p>
               </div>
            </div>
          </div>
        )}

        {page === "signup" && (
          <div className="vu" style={{ padding: "100px 20px", maxWidth: 550, margin: "0 auto" }}>
            <div style={{ background: T.surface, padding: 60, border: `1px solid ${T.border}` }}>
              <h2 style={{ color: T.gold, textAlign: "center", fontSize: 24, marginBottom: 40 }}>SIGN THE ACCORD</h2>
              
              <div style={{ marginBottom: 30 }}>
                <label style={{ fontSize: 9, color: T.faint, display: "block", marginBottom: 10 }}>MEMBERSHIP TYPE</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setRole("freelancer")} style={{ flex: 1, padding: 15, background: role === "freelancer" ? T.burg : "transparent", border: `1px solid ${T.border}`, color: role === "freelancer" ? T.gold : T.muted, cursor: "pointer", fontSize: 10 }}>FREELANCER</button>
                  <button onClick={() => setRole("client")} style={{ flex: 1, padding: 15, background: role === "client" ? T.burg : "transparent", border: `1px solid ${T.border}`, color: role === "client" ? T.gold : T.muted, cursor: "pointer", fontSize: 10 }}>CLIENT</button>
                </div>
              </div>

              <input type="text" placeholder="LEGAL FULL NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: "100%", marginBottom: 20 }} />
              
              {role === "freelancer" && (
                <>
                  <select style={{ width: "100%", marginBottom: 20 }} value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" placeholder="STARTING RATE (e.g., $100/hr)" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} style={{ width: "100%", marginBottom: 20 }} />
                  <textarea placeholder="PROFESSIONAL BIO" rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{ width: "100%", marginBottom: 30 }} />
                  
                  <div style={{ background: "rgba(255,77,77,0.05)", border: `1px solid ${T.err}44`, padding: 20, marginBottom: 30 }}>
                    <h5 style={{ color: T.err, fontSize: 10, marginBottom: 10 }}>LEGAL NOTICE</h5>
                    <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>By entering the network as a freelancer, you agree to the 15% service commission on all facilitated contracts. Circumvention of this protocol is grounds for legal review and expulsion.</p>
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: 15, alignItems: "flex-start", marginBottom: 40 }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 4 }} />
                <label style={{ fontSize: 11, color: T.muted, lineHeight: 1.4 }}>
                  I have read the Voryel Accord and agree to operate within "The Flow" and the established legal frameworks of the network.
                </label>
              </div>

              <Btn full disabled={!agree || !formData.name} loading={loading} onClick={handleSignup}>Enter the Network</Btn>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ 
        padding: "120px 60px", 
        borderTop: `1px solid ${T.border}`, 
        marginTop: 150, 
        textAlign: "center",
        background: T.surface 
      }}>
        <Logo variant="md" />
        <p style={{ color: T.gold, fontSize: 12, letterSpacing: 6, marginTop: 30, fontWeight: 500 }}>{QUOTE.toUpperCase()}</p>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 30, margin: "40px 0", color: T.faint, fontSize: 10, letterSpacing: 2 }}>
           <span>INSTAGRAM</span>
           <span>LINKEDIN</span>
           <span>TWITTER</span>
        </div>

        <p style={{ color: T.faint, fontSize: 10, letterSpacing: 1 }}>
          © 2026 THE VORYEL NETWORK · ALL RIGHTS RESERVED
        </p>
        <p style={{ color: T.faint, fontSize: 10, marginTop: 10 }}>
          FOUNDED AND CURATED BY <span style={{ color: T.gold }}>{FOUNDER.toUpperCase()}</span>
        </p>
      </footer>
    </div>
  );
}
             
