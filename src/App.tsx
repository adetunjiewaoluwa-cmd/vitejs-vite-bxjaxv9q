// @ts-nocheck
import React, { useState, useEffect } from "react";

/**
 * THE VORYEL NETWORK - PREMIER v10.0
 * Founded by: Adetunji Ewaoluwa Destiny
 * Fixed: Nav Menu, Symmetry, Intense Maroon Footer, Client Contact
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
  surface: "rgba(25, 10, 15, 0.9)",
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
    padding: 20px 45px;
    font-family: 'Cinzel';
    font-size: 12px;
    letter-spacing: 4px;
    cursor: pointer;
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid ${T.goldSolid};
    margin: 15px;
    text-transform: uppercase;
  }

  .btn-gold { background: ${T.goldSolid}; color: black; font-weight: 700; }
  .btn-outline { background: transparent; color: ${T.goldSolid}; }
  .action-btn:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(107,20,40,0.5); }

  .maroon-spice-footer {
    background: linear-gradient(to bottom, ${T.bg} 0%, ${T.burg} 100%);
    padding: 150px 20px;
    border-top: 1px solid ${T.border};
    width: 100%;
  }

  input, textarea, select {
    background: rgba(255,255,255,0.05);
    border: 1px solid ${T.border};
    color: white;
    padding: 18px;
    margin-bottom: 25px;
    width: 100%;
    font-family: 'Cormorant Garamond';
    font-size: 18px;
  }
`;

const Logo = ({ variant = "md", onClick }) => {
  const sizes = { md: [10, 30], xl: [18, 90] }[variant] || [10, 30];
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

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(res => res.json()).then(data => setMembers(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <style>{STYLES}</style>

      {/* NAVIGATION BAR - FIXED SYMMETRY */}
      <nav style={{ 
        position: "fixed", top: 0, width: "100%", height: "110px", 
        display: "flex", justifyContent: "space-between", padding: "0 80px", 
        alignItems: "center", background: "rgba(12,4,7,0.98)", zIndex: 1000, 
        borderBottom: `1px solid ${T.border}` 
      }}>
        <Logo variant="md" onClick={() => setPage("home")} />
        
        {/* NAV LINKS - RESTORED NETWORK BESIDE IDENTITY */}
        <div style={{ display: "flex", gap: "50px", fontSize: "11px", fontWeight: 600 }}>
          <span onClick={() => setPage("home")} style={{ cursor: "pointer", letterSpacing: "3px", color: page === "home" ? T.goldSolid : "white" }}>IDENTITY</span>
          <span onClick={() => setPage("network")} style={{ cursor: "pointer", letterSpacing: "3px", color: page === "network" ? T.goldSolid : "white" }}>NETWORK</span>
          <span onClick={() => setPage("about")} style={{ cursor: "pointer", letterSpacing: "3px", color: page === "about" ? T.goldSolid : "white" }}>ABOUT</span>
          <span onClick={() => setPage("contact")} style={{ cursor: "pointer", letterSpacing: "3px", color: page === "contact" ? T.goldSolid : "white" }}>CONTACT</span>
        </div>

        <button onClick={() => setPage("signup")} style={{ 
          background: T.burg, color: "white", border: "none", padding: "12px 30px", 
          fontFamily: "Cinzel", fontSize: "10px", cursor: "pointer", letterSpacing: "2px" 
        }}>JOIN GUILD</button>
      </nav>

      <main style={{ paddingTop: "110px" }}>
        
        {/* HERO PAGE */}
        {page === "home" && (
          <div className="center-spine" style={{ padding: "140px 20px", minHeight: "80vh", background: `radial-gradient(circle, ${T.burg} -90%, ${T.bg} 90%)` }}>
            <Logo variant="xl" />
            <h1 style={{ fontSize: "clamp(30px, 5vw, 60px)", fontFamily: "Cormorant Garamond", fontStyle: "italic", margin: "40px 0", fontWeight: 300 }}>"{QUOTE}"</h1>
            
            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
              <button className="action-btn btn-gold" onClick={() => setPage("signup")}>Join the Network</button>
              <button className="action-btn btn-outline" onClick={() => setPage("network")}>Explore Collective</button>
            </div>

            <p style={{ marginTop: "80px", color: T.goldSolid, letterSpacing: "10px", fontSize: "12px" }}>ESTABLISHED 2026</p>
          </div>
        )}

        {/* NETWORK LISTING */}
        {page === "network" && (
          <div className="center-spine" style={{ padding: "100px 20px" }}>
            <h2 className="gold-text" style={{ fontSize: "40px", marginBottom: "20px", letterSpacing: "5px" }}>THE COLLECTIVE</h2>
            <p style={{ color: T.muted, marginBottom: "80px" }}>VETTED ARCHITECTS OF THE DIGITAL WORLD</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "40px", width: "100%" }}>
              {members.filter(m => m.role === 'freelancer').map(m => (
                <div key={m.id} style={{ padding: "50px 40px", background: T.surface, border: `1px solid ${T.border}`, textAlign: "left" }}>
                  <span style={{ color: T.goldSolid, fontSize: "10px", letterSpacing: "3px" }}>{m.cat?.toUpperCase()}</span>
                  <h3 style={{ fontSize: "28px", margin: "15px 0", fontWeight: 400 }}>{m.name}</h3>
                  <p style={{ color: T.muted, fontFamily: "Cormorant Garamond", fontSize: "18px", marginBottom: "30px", minHeight: "60px" }}>{m.bio}</p>
                  <button className="action-btn btn-outline" style={{ width: "100%", margin: 0 }} onClick={() => window.location.href=`mailto:${EMAIL}`}>REQUEST DATA</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIGNUP WITH CLIENT GMAIL CAPTURE */}
        {page === "signup" && (
          <div className="center-spine" style={{ padding: "80px 20px", maxWidth: "600px" }}>
            <h2 className="gold-text" style={{ fontSize: "32px", marginBottom: "40px" }}>SIGN THE ACCORD</h2>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "30px", width: "100%" }}>
              <button onClick={() => setRole("freelancer")} style={{ flex: 1, padding: "15px", background: role === "freelancer" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, cursor: "pointer" }}>FREELANCER</button>
              <button onClick={() => setRole("client")} style={{ flex: 1, padding: "15px", background: role === "client" ? T.burg : "transparent", color: "white", border: `1px solid ${T.border}`, cursor: "pointer" }}>CLIENT</button>
            </div>

            <input placeholder="LEGAL FULL NAME" />
            <input placeholder="GMAIL ADDRESS" type="email" />
            
            {role === "client" && (
              <>
                <input placeholder="COMPANY / PROJECT NAME" />
                <input placeholder="HOW SHOULD WE REACH YOU? (WhatsApp/LinkedIn/Phone)" />
              </>
            )}

            <textarea placeholder={role === "client" ? "BRIEF PROJECT DESCRIPTION" : "PROFESSIONAL BIO & EXPERIENCE"} rows={5} />
            
            <button className="action-btn btn-gold" style={{ width: "100%", margin: "20px 0 0 0" }}>ENTER THE NETWORK</button>
          </div>
        )}

        {/* ABOUT PAGE */}
        {page === "about" && (
          <div className="center-spine" style={{ padding: "120px 20px" }}>
            <h2 className="gold-text" style={{ fontSize: "40px", marginBottom: "40px" }}>LINKING EXCELLENCE</h2>
            <p style={{ fontSize: "24px", fontFamily: "Cormorant Garamond", lineHeight: "1.8", color: T.muted, maxWidth: "800px" }}>
              The Voryel is a premier guild founded by <strong>{FOUNDER}</strong>. We solve the complexity of linking elite talent with visionary projects. Our platform acts as the bridge—ensuring "The Flow" is never interrupted.
            </p>
          </div>
        )}

      </main>

      {/* FOOTER - THE INTENSE MAROON SPICE */}
      <footer className="maroon-spice-footer">
        <div className="center-spine">
          <Logo variant="md" />
          <p style={{ color: T.goldSolid, margin: "40px 0", letterSpacing: "8px", fontSize: "14px" }}>{QUOTE.toUpperCase()}</p>
          <div style={{ height: "1px", width: "60px", background: T.goldSolid, marginBottom: "40px" }}></div>
          <div style={{ opacity: 0.4, fontSize: "10px", letterSpacing: "2px" }}>
            <p style={{ marginBottom: "10px" }}>© 2026 THE VORYEL NETWORK</p>
            <p>CURATED BY {FOUNDER.toUpperCase()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
