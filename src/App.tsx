// @ts-nocheck
import { useState, useEffect } from "react";

const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

const db = {
  async getAll() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&order=joined_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async insert(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async update(id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async getByEmail(email) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return data[0] || null;
  },
  async getJobs() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*,profiles(name)&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async postJob(jobData) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(jobData)
    });
    return res.json();
  },
};

const T = {
  burg: "#6B1428",
  burgD: "#3D0B18",
  burgM: "#8B1A35",
  gold: "#C9A84C",
  goldL: "#E2C06A",
  goldP: "#F5EBC8",
  bg: "#0C0407",
  surface: "#130609",
  surfaceL: "#1c0a0f",
  white: "#FAF8F5",
  muted: "rgba(250,248,245,0.55)",
  faint: "rgba(250,248,245,0.25)",
  ghost: "rgba(250,248,245,0.08)",
  border: "rgba(201,168,76,0.15)",
  borderA: "rgba(201,168,76,0.45)",
};

const CATS = [
  "Web Development",
  "Web Design",
  "Graphic Design",
  "Video Editing",
  "UI/UX Design",
  "Programming",
];

const initials = (n) =>
  (n || "")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase() || "?";

const AV_COLORS = [
  ["#3D0B18", "#7a1a2e"],
  ["#0a1528", "#1a3a6a"],
  ["#1a0a28", "#3e1a70"],
  ["#0a2010", "#1a5030"],
  ["#200a08", "#5a2010"],
  ["#08182a", "#104060"],
];

const avColor = (name) => AV_COLORS[(name || "A").charCodeAt(0) % AV_COLORS.length];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#0C0407;color:#FAF8F5;font-family:'Cinzel',serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
  ::placeholder{color:rgba(250,248,245,0.22);}
  ::-webkit-scrollbar{width:2px;}
  ::-webkit-scrollbar-track{background:#0C0407;}
  ::-webkit-scrollbar-thumb{background:#6B1428;}
  select option{background:#1c0a0f;}
  input,textarea,select{color:#FAF8F5!important;font-family:inherit;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  .vu{animation:fadeUp 0.9s cubic-bezier(.16,1,.3,1) both;}
  .d1{animation-delay:0.1s;}.d2{animation-delay:0.24s;}.d3{animation-delay:0.38s;}.d4{animation-delay:0.52s;}
  .hov-card{transition:transform 0.32s cubic-bezier(.16,1,.3,1),box-shadow 0.32s ease,border-color 0.25s ease;}
  .hov-card:hover{transform:translateY(-5px);box-shadow:0 20px 60px rgba(107,20,40,0.3);border-color:rgba(201,168,76,0.5)!important;}
  .hov-btn{transition:all 0.25s;}.hov-btn:hover{opacity:0.82;transform:translateY(-1px);}
`;

function Logo({ variant = "md", onClick }) {
  const sizes = {
    sm: [9, 22],
    md: [11, 30],
    lg: [15, 54],
    xl: [18, 72],
  }[variant] || [11, 30];
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: sizes[0],
          letterSpacing: "0.52em",
          color: T.goldL,
          textTransform: "uppercase",
          lineHeight: 1.3,
        }}
      >
        The
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontWeight: 300,
          fontSize: sizes[1],
          letterSpacing: "0.13em",
          lineHeight: 1,
          textTransform: "uppercase",
          background: `linear-gradient(135deg,${T.white} 0%,${T.goldP} 48%,${T.gold} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Voryel
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginTop: 3,
          width: "100%",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background: `linear-gradient(90deg,transparent,${T.burgM})`,
          }}
        />
        <div
          style={{
            width: 3,
            height: 3,
            background: T.gold,
            transform: "rotate(45deg)",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            height: 1,
            background: `linear-gradient(90deg,${T.burgM},transparent)`,
          }}
        />
      </div>
    </div>
  );
}

function Avatar({ name, size = 48 }) {
  const [c1, c2] = avColor(name || "A");
  return (
    <div
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg,${c1},${c2})`,
        border: `1px solid ${T.border}`,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: size * 0.36,
          color: T.gold,
          lineHeight: 1,
          fontWeight: 300,
        }}
      >
        {initials(name)}
      </span>
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  full,
  disabled,
  type = "button",
  loading,
}) {
  const pads =
    {
      sm: "7px 16px",
      md: "11px 26px",
      lg: "14px 36px",
    }[size] || "11px 26px";
  const fszs =
    {
      sm: 9,
      md: 10,
      lg: 11,
    }[size] || 10;
  const vars = {
    primary: { bg: T.burg, border: T.burgM, color: T.gold },
    ghost: { bg: "transparent", border: T.border, color: T.muted },
    outline: { bg: "transparent", border: T.borderA, color: T.gold },
  };
  const v = vars[variant] || vars.primary;
  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      className="hov-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        fontFamily: "'Cinzel',serif",
        fontSize: fszs,
        letterSpacing: "0.18em",
        padding: pads,
        background: v.bg,
        border: `1px solid ${v.border}`,
        color: v.color,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        width: full ? "100%" : "auto",
        whiteSpace: "nowrap",
        outline: "none",
      }}
    >
      {loading ? "..." : (children || "").toUpperCase()}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  rows,
}) {
  const base = {
    background: T.ghost,
    border: `1px solid ${T.border}`,
    color: T.white,
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: 15,
    padding: "11px 14px",
    outline: "none",
    width: "100%",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && (
        <label
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 8.5,
            letterSpacing: "0.28em",
            color: T.faint,
          }}
        >
          {label}
        </label>
      )}
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{
            ...base,
            cursor: "pointer",
            background: T.surfaceL,
            appearance: "none",
          }}
        >
          <option value="">Select…</option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          style={{ ...base, resize: "vertical" }}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={base}
        />
      )}
    </div>
  );
}

function Tag({ children, active }) {
  return (
    <span
      style={{
        fontFamily: "'Cinzel',serif",
        fontSize: 8.5,
        letterSpacing: "0.14em",
        padding: "3px 10px",
        background: active ? "rgba(107,20,40,0.4)" : T.ghost,
        border: `1px solid ${active ? T.burg : T.border}`,
        color: active ? T.goldL : T.faint,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Ornament() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "center",
        margin: "10px 0 36px",
      }}
    >
      <div
        style={{
          height: 1,
          width: 60,
          background: `linear-gradient(90deg,transparent,${T.burg})`,
        }}
      />
      <div
        style={{
          width: 4,
          height: 4,
          background: T.gold,
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          height: 1,
          width: 60,
          background: `linear-gradient(90deg,${T.burg},transparent)`,
        }}
      />
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        border: `2px solid ${T.border}`,
        borderTop: `2px solid ${T.gold}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "40px auto",
      }}
    />
  );
}

function EmptyState({ title, sub, cta, onCta }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          border: `1px solid ${T.border}`,
          transform: "rotate(45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        <span style={{ transform: "rotate(-45deg)", fontSize: 22 }}>◈</span>
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 28,
          fontWeight: 300,
          color: T.white,
          letterSpacing: "0.04em",
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <p
        style={{
          fontSize: 13,
          color: T.muted,
          fontWeight: 300,
          maxWidth: 340,
          lineHeight: 1.85,
          marginBottom: 28,
        }}
      >
        {sub}
      </p>
      {cta && <Btn onClick={onCta}>{cta}</Btn>}
    </div>
  );
}

function ConnectModal({ to, from, onClose }) {
  const [f, setF] = useState({
    name: from?.name || "",
    email: from?.email || "",
    msg: "",
  });
  const [sent, setSent] = useState(false);
  const ok = f.name && f.email && f.msg;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          padding: 36,
          maxWidth: 420,
          width: "100%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "none",
            border: "none",
            color: T.faint,
            cursor: "pointer",
            fontSize: 22,
          }}
        >
          ×
        </button>
        {sent ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 34, marginBottom: 16 }}>✦</div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 24,
                color: T.gold,
                marginBottom: 10,
              }}
            >
              Message Sent
            </div>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.8 }}>
              Your message was delivered to{" "}
              <strong style={{ color: T.white }}>{to?.name}</strong>.
            </p>
            <div style={{ marginTop: 22 }}>
              <Btn variant="ghost" size="sm" onClick={onClose}>
                CLOSE
              </Btn>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 26,
                color: T.white,
                marginBottom: 22,
                fontWeight: 300,
              }}
            >
              Message {to?.name?.split(" ")[0]}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field
                label="YOUR NAME"
                name="name"
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                placeholder="Your full name"
              />
              <Field
                label="YOUR EMAIL"
                name="email"
                type="email"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
                placeholder="your@email.com"
              />
              <Field
                label="MESSAGE"
                name="msg"
                type="textarea"
                value={f.msg}
                onChange={(e) => setF({ ...f, msg: e.target.value })}
                placeholder={`Say hello to ${to?.name?.split(" ")[0]}…`}
                rows={4}
              />
              <Btn full onClick={() => ok && setSent(true)} disabled={!ok}>
                SEND MESSAGE
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- NEW MARKETPLACE COMPONENTS ---

function JobFeed({setPage}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { db.getJobs().then(data => { setJobs(data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  return (
    <div style={{background:T.bg, minHeight:"100vh", paddingTop:100, paddingBottom:80}}>
       <div style={{textAlign:'center', marginBottom:60}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.38em",color:T.gold,marginBottom:14}}>OPPORTUNITIES</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:44,fontWeight:300,color:T.white}}>Find Work</h2>
        <p style={{ color: T.muted, fontSize: 10, letterSpacing: 2, marginTop: 15 }}>PLATFORM COMMISSION APPLIES TO ALL CONTRACTS</p>
      </div>
      <div style={{ display: "grid", gap: 20, maxWidth:900, margin:"0 auto", padding:"0 20px" }}>
        {loading ? <Spinner /> : jobs.map(j => (
          <div key={j.id} style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 32 }} className="hov-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems:'flex-start' }}>
              <div>
                <h3 style={{ fontFamily: "Cinzel", color: T.white, margin: 0, fontSize:18 }}>{j.title}</h3>
                <div style={{fontSize:12, color:T.gold, marginTop:5}}>Client: {j.profiles?.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: T.gold, fontFamily:"'Cinzel',serif", fontSize:16 }}>{j.budget}</div>
                <div style={{ fontSize: 9, color: T.muted }}>Commission-inclusive</div>
              </div>
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:T.muted, margin: "20px 0", lineHeight:1.7 }}>{j.description}</p>
            <Btn onClick={() => alert("Application sent to network queue.")} size="sm">SEND PROPOSAL</Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostJob({ user, setPage }) {
  const [jd, setJd] = useState({ title: "", desc: "", budget: "", category: "Web Development" });
  const [loading, setLoading] = useState(false);
  const handlePost = async () => {
    if (!jd.title || !jd.desc) return alert("Fill all details");
    setLoading(true);
    await db.postJob({ ...jd, client_id: user.id, status: 'open', created_at: new Date().toISOString() });
    setLoading(false); setPage("dashboard");
  };

  return (
    <div style={{ background:T.bg, minHeight:"100vh", padding: "120px 20px" }}>
      <div style={{maxWidth: 600, margin: "0 auto"}}>
        <h2 style={{ fontFamily: "Cinzel", color: T.gold, textAlign: "center", fontSize:28 }}>REQUEST TALENT</h2>
        <div style={{ background: T.surface, padding: 40, border: `1px solid ${T.border}`, marginTop: 30 }}>
          <div style={{display:'flex', flexDirection:'column', gap:20}}>
            <Field label="PROJECT TITLE" value={jd.title} onChange={e => setJd({ ...jd, title: e.target.value })} placeholder="e.g. Luxury Brand Identity" />
            <Field label="BUDGET" value={jd.budget} onChange={e => setJd({ ...jd, budget: e.target.value })} placeholder="e.g. $2,500" />
            <Field label="CATEGORY" type="select" options={CATS} value={jd.category} onChange={e => setJd({...jd, category: e.target.value})} />
            <div style={{ background: "rgba(107, 20, 40, 0.15)", border: `1px solid ${T.burg}`, padding: 15, fontSize: 11, color: T.muted }}>
              <b style={{ color: T.gold, display: "block", marginBottom:5 }}>COMMISSION POLICY:</b>
              The network service commission will be applied to this project budget upon completion.
            </div>
            <Field label="DESCRIPTION" type="textarea" value={jd.desc} onChange={e => setJd({ ...jd, desc: e.target.value })} placeholder="Describe your project requirements..." rows={6} />
            <Btn onClick={handlePost} loading={loading} full>PUBLISH REQUEST</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ setPage, user, currentUser, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ ...user });
  const [con, setCon] = useState(false);
  const isMe = currentUser?.id === user?.id;

  if (!user) return <div style={{ paddingTop: 120 }}><Spinner /></div>;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingTop: 100, paddingBottom: 100 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 40, alignItems: "center", marginBottom: 60 }} className="vu">
          <Avatar name={user.name} size={120} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: T.white }}>{user.name}</h1>
                <p style={{ color: T.gold, letterSpacing: "0.2em", fontSize: 11, marginTop: 4 }}>{user.category?.toUpperCase()}</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {isMe ? (
                  <Btn variant="outline" size="sm" onClick={() => setEdit(true)}>EDIT PROFILE</Btn>
                ) : (
                  <Btn onClick={() => setCon(true)}>SEND INQUIRY</Btn>
                )}
              </div>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: T.muted, marginTop: 24, lineHeight: 1.8, maxWidth: 600 }}>{user.bio || "No biography provided."}</p>
          </div>
        </div>

        <div style={{ height: 1, background: T.border, margin: "40px 0" }} />

        <div className="vu d1">
          <h3 style={{ fontSize: 11, letterSpacing: "0.3em", color: T.faint, marginBottom: 32 }}>PORTFOLIO & WORK</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }} className="hov-card">
                <div style={{ color: T.ghost, fontSize: 40 }}>✧</div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: T.gold }}>PROJECT 0{i}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16 }}>Legacy Visuals</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {con && <ConnectModal to={user} from={currentUser} onClose={() => setCon(false)} />}

      {edit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 40, maxWidth: 500, width: "100%" }} className="vu">
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, marginBottom: 24 }}>Update Profile</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="DISPLAY NAME" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              <Field label="CATEGORY" type="select" options={CATS} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} />
              <Field label="BIO" type="textarea" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} rows={5} />
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <Btn full onClick={async () => { await db.update(user.id, f); onUpdate(f); setEdit(false); }}>SAVE CHANGES</Btn>
                <Btn full variant="ghost" onClick={() => setEdit(false)}>CANCEL</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Home({ setPage, members, loading }) {
  const featured = members.slice(0, 3);

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", overflow: "hidden", padding: "80px 24px 60px" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 60% at 50% 42%,${T.burgD},${T.bg} 66%)` }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "38px 38px" }} />
        <div style={{ position: "relative", maxWidth: 700 }}>
          <div className="vu d1"><Logo variant="xl" /></div>
          <p className="vu d2" style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 21, color: T.muted, marginTop: 22, letterSpacing: "0.1em", fontWeight: 300 }}>Your Vision, Our Flow</p>
          <p className="vu d3" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: T.faint, maxWidth: 520, margin: "16px auto 40px", lineHeight: 2, fontWeight: 300 }}>The premium digital network where creators, developers, and visionaries come together to forge extraordinary legacies.</p>
          <div className="vu d4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg" onClick={() => setPage("network")}>EXPLORE THE NETWORK</Btn>
            <Btn size="lg" variant="ghost" onClick={() => setPage("signup")}>JOIN THE VORYEL</Btn>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, width: "100%", display: "flex", justifyContent: "center" }} className="vu d4">
          <div style={{ width: 1, height: 60, background: `linear-gradient(${T.gold}, transparent)` }} />
        </div>
      </section>

      <section style={{ padding: "120px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: "0.4em", color: T.gold, marginBottom: 12 }}>THE COLLECTIVE</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300 }}>Featured Talent</h2>
            <Ornament />
          </div>

          {loading ? <Spinner /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32 }}>
              {featured.map((m, idx) => (
                <div key={m.id} className={`vu d${idx + 1} hov-card`} style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 40, textAlign: "center", cursor: "pointer" }} onClick={() => { setPage("profile"); /* In real app, set view target */ }}>
                  <Avatar name={m.name} size={64} />
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, marginTop: 20, fontWeight: 300 }}>{m.name}</h3>
                  <div style={{ color: T.gold, fontSize: 9, letterSpacing: "0.2em", margin: "8px 0 20px" }}>{m.category?.toUpperCase() || "CREATIVE"}</div>
                  <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, fontFamily: "'Cormorant Garamond',serif" }}>{m.bio?.slice(0, 80)}...</p>
                  <div style={{ height: 1, background: T.ghost, margin: "24px 0" }} />
                  <span style={{ fontSize: 9, letterSpacing: "0.15em", color: T.faint }}>VIEW PORTFOLIO</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ background: T.surface, padding: "100px 24px", borderY: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 20 }}>◈</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, marginBottom: 20 }}>Elevate Your Digital Presence</h2>
          <p style={{ color: T.muted, lineHeight: 2, fontFamily: "'Cormorant Garamond',serif", fontSize: 17 }}>Access a curated guild of professionals dedicated to technical precision and aesthetic brilliance. From bespoke web applications to immersive brand identities, we build the future.</p>
        </div>
      </section>

      <footer style={{ padding: "80px 48px", background: T.bg, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
          <div>
            <Logo variant="sm" />
            <p style={{ color: T.faint, fontSize: 10, marginTop: 20, letterSpacing: "0.1em" }}>© 2026 THE VORYEL NETWORK. ALL RIGHTS RESERVED.</p>
          </div>
          <div style={{ display: "flex", gap: 60 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.gold, marginBottom: 20 }}>NAVIGATE</div>
              {["NETWORK", "JOURNAL", "ABOUT", "CONTACT"].map(l => (
                <div key={l} style={{ fontSize: 11, color: T.muted, marginBottom: 10, cursor: "pointer" }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.gold, marginBottom: 20 }}>LEGAL</div>
              {["PRIVACY", "TERMS", "GUIDELINES"].map(l => (
                <div key={l} style={{ fontSize: 11, color: T.muted, marginBottom: 10, cursor: "pointer" }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Network({ setPage, setViewUser, members, loading }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = members.filter(m => {
    const mq = m.name.toLowerCase().includes(query.toLowerCase());
    const mc = cat === "All" || m.category === cat;
    return mq && mc;
  });

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 60 }} className="vu">
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: "0.38em", color: T.gold, marginBottom: 14 }}>DIRECTORY</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 300, color: T.white }}>The Network</h2>
        </div>

        <div style={{ display: "flex", gap: 20, marginBottom: 48, flexWrap: "wrap" }} className="vu d1">
          <div style={{ flex: 1, minWidth: 280 }}>
            <Field placeholder="Search by name..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div style={{ width: 220 }}>
            <Field type="select" options={["All", ...CATS]} value={cat} onChange={e => setCat(e.target.value)} />
          </div>
        </div>

        {loading ? <Spinner /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }} className="vu d2">
            {filtered.map(m => (
              <div key={m.id} style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 32, cursor: "pointer" }} className="hov-card" onClick={() => { setViewUser(m); setPage("profile"); }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <Avatar name={m.name} size={48} />
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, color: T.white }}>{m.name}</div>
                    <div style={{ color: T.gold, fontSize: 8.5, letterSpacing: "0.15em", marginTop: 2 }}>{m.category?.toUpperCase() || "MEMBER"}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: T.muted, margin: "20px 0", lineHeight: 1.7, fontFamily: "'Cormorant Garamond',serif", height: 44, overflow: "hidden" }}>{m.bio || "Crafting digital excellence within the Voryel collective."}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.ghost}`, paddingTop: 20 }}>
                  <span style={{ fontSize: 8.5, color: T.faint, letterSpacing: "0.1em" }}>JOINED {new Date(m.joined_at).getFullYear()}</span>
                  <span style={{ color: T.gold, fontSize: 14 }}>✧</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && <EmptyState title="No matches found" sub="Refine your search or explore all categories to find the right talent." />}
      </div>
    </div>
  );
}

function Nav({ page, setPage, user, onLogout }) {
  const links = [
    ["home", "Identity"],
    ["network", "Network"],["jobs","Opportunities"]
  ];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, height: 72, background: "rgba(12,4,7,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px" }}>
      <Logo variant="md" onClick={() => setPage("home")} />
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {links.map(([id, label]) => (
          <button key={id} onClick={() => setPage(id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: 10, letterSpacing: "0.2em", color: page === id ? T.gold : T.muted, transition: "color 0.3s" }}>{label.toUpperCase()}</button>
        ))}
        {user ? (
          <div style={{ display: "flex", gap: 24, alignItems: "center", borderLeft: `1px solid ${T.border}`, paddingLeft: 24 }}>
            {user.role === 'client' && <button onClick={()=>setPage("post-job")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.2em",color:page==="post-job"?T.gold:T.muted}}>POST JOB</button>}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: T.white, letterSpacing: "0.1em", cursor: "pointer" }} onClick={() => setPage("dashboard")}>{user.name.split(" ")[0].toUpperCase()}</div>
              <div style={{ fontSize: 8, color: T.gold, cursor: "pointer" }} onClick={onLogout}>LOGOUT</div>
            </div>
            <Avatar name={user.name} size={32} />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12 }}>
            <Btn size="sm" variant="ghost" onClick={() => setPage("login")}>LOGIN</Btn>
            <Btn size="sm" onClick={() => setPage("signup")}>JOIN</Btn>
          </div>
        )}
      </div>
    </nav>
  );
}

function Auth({ mode, setPage, onAuth }) {
  const isLogin = mode === "login";
  const [step, setStep] = useState(1);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [d, setD] = useState({ name: "", email: "", password: "", role: "freelancer", category: "Web Development", bio: "" });

  const handle = async (e) => {
    e.preventDefault();
    if (!isLogin && step === 2 && !agree) return alert("You must agree to the commission policy.");
    setLoading(true);
    try {
      if (isLogin) {
        const u = await db.getByEmail(d.email);
        if (u && u.password === d.password) { onAuth(u); setPage("dashboard"); }
        else alert("Invalid credentials.");
      } else {
        if (step === 1) setStep(2);
        else {
          const res = await db.insert({ ...d, joined_at: new Date().toISOString() });
          if (res && res[0]) { onAuth(res[0]); setPage("dashboard"); }
        }
      }
    } catch (err) { alert("An error occurred."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at center, ${T.burgD}, ${T.bg} 70%)`, opacity: 0.4 }} />
      <div style={{ width: "100%", maxWidth: 420, background: T.surface, border: `1px solid ${T.border}`, padding: 48, position: "relative" }} className="vu">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Logo variant="lg" />
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, color: T.white, marginTop: 24 }}>{isLogin ? "Welcome Back" : "Begin Your Journey"}</h2>
        </div>

        <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {isLogin ? (
            <>
              <Field label="EMAIL" type="email" value={d.email} onChange={e => setD({ ...d, email: e.target.value })} />
              <Field label="PASSWORD" type="password" value={d.password} onChange={e => setD({ ...d, password: e.target.value })} />
            </>
          ) : step === 1 ? (
            <>
              <Field label="EMAIL" type="email" value={d.email} onChange={e => setD({ ...d, email: e.target.value })} />
              <Field label="PASSWORD" type="password" value={d.password} onChange={e => setD({ ...d, password: e.target.value })} />
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 5 }}>
                {["freelancer", "client"].map(r => (
                  <div key={r} onClick={() => setD({ ...d, role: r })} style={{ flex: 1, padding: "10px", textAlign: "center", border: `1px solid ${d.role === r ? T.gold : T.border}`, fontSize: 9, color: d.role === r ? T.gold : T.faint, cursor: "pointer", fontFamily: "'Cinzel',serif" }}>{r.toUpperCase()}</div>
                ))}
              </div>
              <Field label="NAME" value={d.name} onChange={e => setD({ ...d, name: e.target.value })} />
            <div style={{ background: "rgba(107, 20, 40, 0.2)", border: `1px solid ${T.burg}`, padding: 15 }}>
              <label style={{ fontSize: 11, color: T.white, display:'flex', gap:10 }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                I agree to the Network Commission Policy.
              </label>
            </div>
              <Field label="CATEGORY" type="select" options={CATS} value={d.category} onChange={e => setD({ ...d, category: e.target.value })} />
            </>
          )}
          <Btn type="submit" full loading={loading}>{isLogin ? "Login" : step === 1 ? "Next" : "Create Account"}</Btn>
        </form>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <span style={{ fontSize: 12, color: T.faint, fontFamily: "'Cormorant Garamond',serif" }}>{isLogin ? "New to the collective?" : "Already a member?"} </span>
          <button onClick={() => { setPage(isLogin ? "signup" : "login"); setStep(1); }} style={{ background: "none", border: "none", color: T.gold, fontSize: 12, cursor: "pointer", fontFamily: "'Cormorant Garamond',serif" }}>{isLogin ? "Apply Now" : "Login Here"}</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, setPage, members }) {
  if (!user) return null;
  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
        <div className="vu" style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 48, display: "flex", gap: 32, alignItems: "center", marginBottom: 40 }}>
          <Avatar name={user.name} size={80} />
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300 }}>Master {user.name.split(" ")[0]}</h2>
            <p style={{ color: T.gold, fontSize: 10, letterSpacing: "0.2em", marginTop: 4 }}>DASHBOARD OVERVIEW</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }} className="vu d1">
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 40 }}>
            <h3 style={{ fontSize: 10, letterSpacing: "0.2em", color: T.gold, marginBottom: 24 }}>QUICK ACTIONS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Btn full variant="outline" onClick={() => setPage("profile")}>VIEW PUBLIC PROFILE</Btn>
              <Btn full variant="outline">MESSAGE INBOX</Btn>
              <Btn full variant="ghost">ACCOUNT SETTINGS</Btn>
            </div>
          </div>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 40 }}>
            <h3 style={{ fontSize: 10, letterSpacing: "0.2em", color: T.gold, marginBottom: 24 }}>NETWORK STATS</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ color: T.muted }}>Network Size</span>
              <span style={{ color: T.white }}>{members.length} Members</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: T.muted }}>Your Status</span>
              <span style={{ color: T.goldL }}>Active Elite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TheVoryel() {
  const [page, setPage] = useState("home");
  const [members, setMembers] = useState([]);
  const [me, setMe] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getAll().then((data) => {
      setMembers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  }, [page]);

  const onAuth = (user) => {
    setMembers((prev) => {
      const ex = prev.find((u) => u.id === user.id);
      return ex ? prev.map((u) => (u.id === user.id ? user : u)) : [user, ...prev];
    });
    setMe(user);
  };
  const onLogout = () => {
    setMe(null);
    setPage("home");
  };
  const onUpdate = (updated) => {
    setMembers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setMe((prev) => (prev?.id === updated.id ? updated : prev));
    setViewUser(updated);
  };

  const noNav = ["login", "signup"].includes(page);
  return (
    <div style={{ background: T.bg, color: T.white, minHeight: "100vh", fontFamily: "'Cinzel',serif" }}>
      <style>{STYLES}</style>
      {!noNav && <Nav page={page} setPage={setPage} user={me} onLogout={onLogout} />}
      {page === "home" && <Home setPage={setPage} members={members} loading={loading} />}
      {page === "network" && <Network setPage={setPage} setViewUser={setViewUser} members={members} loading={loading} />}
      {page === "profile" && <ProfilePage setPage={setPage} user={viewUser || me} currentUser={me} onUpdate={onUpdate} />}
      {page==="jobs"&&<JobFeed setPage={setPage}/>}
      {page==="post-job"&&<PostJob user={me} setPage={setPage}/>}
      {page === "dashboard" && <Dashboard user={me} setPage={setPage} members={members} />}
      {page === "login" && <Auth mode="login" setPage={setPage} onAuth={onAuth} />}
      {page === "signup" && <Auth mode="signup" setPage={setPage} onAuth={onAuth} />}
    </div>
  );
}
