// @ts-nocheck
import React, { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURATION & DATABASE ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
};

const CATS = ["Web Development", "Web Design", "Graphic Design", "Video Editing", "UI/UX Design", "Programming"];

// --- UI COMPONENTS ---

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#0C0407;color:#FAF8F5;font-family:'Cinzel',serif;overflow-x:hidden;}
  input,textarea,select{color:#FAF8F5!important;font-family:inherit;}
  .vu{animation:fadeUp 0.9s cubic-bezier(.16,1,.3,1) both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  .hov-card{transition:all 0.3s ease; cursor:pointer;}
  .hov-card:hover{transform:translateY(-5px);border-color:${T.gold}!important;box-shadow:0 10px 30px rgba(107,20,40,0.2);}
`;

function Logo({ variant = "md", onClick }) {
  const sizes = { sm: [9, 22], md: [11, 30], lg: [15, 54], xl: [18, 72] }[variant];
  return (
    <div onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: sizes[0], letterSpacing: "0.52em", color: T.goldL, textTransform: "uppercase" }}>The</span>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: sizes[1], letterSpacing: "0.13em", textTransform: "uppercase", background: `linear-gradient(135deg,${T.white},${T.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Voryel</span>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", full, disabled, type = "button" }) {
  const vars = {
    primary: { bg: T.burg, border: T.burgM, color: T.gold },
    ghost: { bg: "transparent", border: T.border, color: T.muted },
    outline: { bg: "transparent", border: T.borderA, color: T.gold }
  };
  const v = vars[variant] || vars.primary;
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      padding: "12px 24px", background: v.bg, border: `1px solid ${v.border}`, color: v.color,
      fontFamily: "'Cinzel',serif", fontSize: 10, letterSpacing: "0.15em", cursor: "pointer",
      width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, transition: "0.2s"
    }}>{children}</button>
  );
}

function Field({ label, name, type = "text", value, onChange, options, placeholder }) {
  const s = { background: T.ghost, border: `1px solid ${T.border}`, color: T.white, padding: "12px", width: "100%", outline: "none", marginBottom: "15px" };
  return (
    <div>
      {label && <label style={{ fontSize: 9, letterSpacing: "0.2em", color: T.faint, display: "block", marginBottom: 5 }}>{label}</label>}
      {type === "select" ? (
        <select name={name} value={value} onChange={onChange} style={s}>
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} style={{ ...s, height: 100 }} />
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} style={s} />
      )}
    </div>
  );
}

// --- CORE PAGES ---

function ClientDashboard({ user, setPage }) {
  const [jobs, setJobs] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", budget: "", category: "" });

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase.from('jobs').select('*').eq('client_id', user.id);
      if (data) setJobs(data);
    };
    fetchJobs();
  }, [user]);

  const handlePost = async () => {
    await supabase.from('jobs').insert([{ ...form, client_id: user.id, status: 'open' }]);
    setShowPost(false);
    // Refresh jobs...
  };

  return (
    <div style={{ padding: "100px 48px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 300 }}>Client Dashboard</h2>
        <Btn onClick={() => setShowPost(true)}>POST NEW WORK</Btn>
      </div>

      {showPost && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 30, marginBottom: 40 }}>
          <Field label="PROJECT TITLE" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Field label="CATEGORY" type="select" options={CATS} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <Field label="BUDGET (e.g. $500)" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
          <Field label="DESCRIPTION" type="textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handlePost}>PUBLISH REQUEST</Btn>
            <Btn variant="ghost" onClick={() => setShowPost(false)}>CANCEL</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 15 }}>
        {jobs.map(j => (
          <div key={j.id} style={{ background: T.ghost, border: `1px solid ${T.border}`, padding: 20 }}>
            <div style={{ color: T.gold, fontSize: 10, marginBottom: 5 }}>{j.status.toUpperCase()} • {j.category}</div>
            <h4 style={{ fontSize: 20, marginBottom: 10 }}>{j.title}</h4>
            <p style={{ color: T.muted, fontSize: 14 }}>{j.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FreelancerDashboard({ user }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data } = await supabase.from('job_requests').select('*, jobs(*)').eq('freelancer_id', user.id);
      if (data) setRequests(data);
    };
    fetchRequests();
  }, [user]);

  return (
    <div style={{ padding: "100px 48px", maxWidth: 1000, margin: "0 auto" }}>
      <h2 style={{ fontSize: 32, fontWeight: 300, marginBottom: 40 }}>Freelancer Inbox</h2>
      {requests.length === 0 ? (
        <p style={{ color: T.faint }}>No work requests yet. Keep your profile updated!</p>
      ) : (
        <div style={{ display: "grid", gap: 15 }}>
          {requests.map(r => (
            <div key={r.id} style={{ background: T.surfaceL, border: `1px solid ${T.border}`, padding: 20 }}>
              <div style={{ color: T.gold, fontSize: 10 }}>NEW WORK REQUEST</div>
              <h4 style={{ fontSize: 20 }}>{r.jobs?.title}</h4>
              <p style={{ margin: "10px 0", color: T.muted }}>{r.message}</p>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn size="sm">ACCEPT</Btn>
                <Btn size="sm" variant="ghost">DECLINE</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AuthPage({ setPage, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("freelancer");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleAuth = async () => {
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (data?.user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        setUser(prof);
        setPage("dashboard");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
      if (data?.user) {
        const prof = { id: data.user.id, email: form.email, name: form.name, role: role };
        await supabase.from('profiles').insert([prof]);
        setUser(prof);
        setPage("dashboard");
      }
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg }}>
      <div style={{ width: 400, padding: 40, background: T.surface, border: `1px solid ${T.border}` }}>
        <Logo variant="lg" />
        <div style={{ margin: "30px 0" }}>
          {!isLogin && (
            <>
              <Field label="FULL NAME" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button onClick={() => setRole("freelancer")} style={{ flex: 1, padding: 10, background: role === "freelancer" ? T.burg : T.ghost, border: `1px solid ${T.border}`, color: T.white, cursor: "pointer" }}>FREELANCER</button>
                <button onClick={() => setRole("client")} style={{ flex: 1, padding: 10, background: role === "client" ? T.burg : T.ghost, border: `1px solid ${T.border}`, color: T.white, cursor: "pointer" }}>CLIENT</button>
              </div>
            </>
          )}
          <Field label="EMAIL" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Field label="PASSWORD" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <Btn full onClick={handleAuth}>{isLogin ? "SIGN IN" : "CREATE ACCOUNT"}</Btn>
        </div>
        <p style={{ fontSize: 12, textAlign: "center", color: T.muted, cursor: "pointer" }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Join The Voryel" : "Already a member? Sign in"}
        </p>
      </div>
    </div>
  );
}

// --- MAIN APP WRAPPER ---

export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'freelancer');
      if (data) setMembers(data);
    };
    fetchMembers();
  }, []);

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <style>{STYLES}</style>
      
      {/* Navigation */}
      {page !== "auth" && (
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", zIndex: 100, background: "rgba(12,4,7,0.8)", backdropFilter: "blur(10px)" }}>
          <Logo variant="md" onClick={() => setPage("home")} />
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <span style={{ fontSize: 10, cursor: "pointer", color: T.muted }} onClick={() => setPage("network")}>NETWORK</span>
            {user ? (
              <Btn variant="outline" onClick={() => setPage("dashboard")}>DASHBOARD</Btn>
            ) : (
              <Btn onClick={() => setPage("auth")}>JOIN</Btn>
            )}
          </div>
        </nav>
      )}

      {/* Page Routing */}
      {page === "home" && (
        <div style={{ textAlign: "center", paddingTop: 200 }}>
          <Logo variant="xl" />
          <p style={{ fontStyle: "italic", color: T.muted, marginTop: 20 }}>Your Vision, Our Flow</p>
          <div style={{ marginTop: 40 }}>
            <Btn size="lg" onClick={() => setPage("network")}>EXPLORE THE NETWORK</Btn>
          </div>
        </div>
      )}

      {page === "auth" && <AuthPage setPage={setPage} setUser={setUser} />}

      {page === "dashboard" && user && (
        user.role === "client" ? <ClientDashboard user={user} setPage={setPage} /> : <FreelancerDashboard user={user} />
      )}

      {page === "network" && (
        <div style={{ padding: "120px 48px" }}>
          <h2 style={{ fontSize: 40, fontWeight: 300, marginBottom: 40 }}>The Global Network</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {members.map(m => (
              <div key={m.id} className="hov-card" style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 25 }}>
                <h3 style={{ fontSize: 22, color: T.white }}>{m.name}</h3>
                <p style={{ color: T.gold, fontSize: 12, margin: "5px 0" }}>{m.category}</p>
                <p style={{ color: T.muted, fontSize: 14, height: 40, overflow: "hidden" }}>{m.bio}</p>
                <div style={{ marginTop: 20 }}>
                  <Btn variant="ghost" full>VIEW PROFILE</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding: "50px 48px", borderTop: `1px solid ${T.border}`, marginTop: 100, textAlign: "center" }}>
        <Logo variant="sm" />
        <p style={{ fontSize: 12, color: T.faint, marginTop: 20 }}>© 2026 The Voryel · Founded by Adetunji Ewaoluwa Destiny.</p>
      </footer>
    </div>
  );
}
