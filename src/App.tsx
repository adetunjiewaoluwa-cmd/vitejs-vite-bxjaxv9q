// @ts-nocheck
import { useState, useEffect } from "react";

/* =========================
   SaaS CONFIG (ADDED)
========================= */
const PLATFORM_COMMISSION = 0.10; // 10%

/* =========================
   SUPABASE CONFIG
========================= */
const SUPABASE_URL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";

/* =========================
   DATABASE
========================= */
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
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async update(id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
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
  }
};

/* =========================
   THEME
========================= */
const T = {
  burg: "#6B1428",
  burgD: "#3D0B18",
  gold: "#C9A84C",
  bg: "#0C0407",
  surface: "#130609",
  white: "#FAF8F5",
  muted: "rgba(250,248,245,0.55)",
  border: "rgba(201,168,76,0.15)"
};

/* =========================
   SaaS CONNECT MODAL (UPDATED)
========================= */
function ConnectModal({to,from,onClose}) {
  const [f,setF]=useState({name:from?.name||"",email:from?.email||"",msg:""});
  const [sent,setSent]=useState(false);

  const feeMin = (to?.rateMin || 0) * PLATFORM_COMMISSION;
  const feeMax = (to?.rateMax || 0) * PLATFORM_COMMISSION;

  const ok = f.name && f.email && f.msg;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:T.surface,padding:30,maxWidth:500,width:"100%"}}>

        {sent ? (
          <div style={{textAlign:"center"}}>
            <h2 style={{color:T.gold}}>Request Sent</h2>
            <p style={{color:T.muted}}>Freelancer will contact you via email.</p>
          </div>
        ) : (
          <>
            <h2 style={{color:T.white}}>Connect with {to?.name}</h2>

            {/* SAAS INFO */}
            <div style={{border:`1px solid ${T.border}`,padding:10,margin:"10px 0",color:T.muted,fontSize:13}}>
              <div>💰 Freelancer Price: ${to?.rateMin || 0} - ${to?.rateMax || 0}</div>
              <div>🏷 Platform Fee (10%): ${feeMin.toFixed(2)} - ${feeMax.toFixed(2)}</div>
              <div style={{marginTop:6,color:T.gold}}>
                Payment is handled manually via email (no in-app payments yet)
              </div>
            </div>

            {/* PAYMENT FLOW */}
            <div style={{border:`1px dashed ${T.border}`,padding:10,marginBottom:10,color:T.muted,fontSize:13}}>
              <strong>Process:</strong>
              <ol>
                <li>Client sends request</li>
                <li>Freelancer replies via email</li>
                <li>Both agree on final price</li>
                <li>Payment is made manually</li>
              </ol>
            </div>

            <input placeholder="Your name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
            <input placeholder="Your email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
            <textarea placeholder="Message" value={f.msg} onChange={e=>setF({...f,msg:e.target.value})}/>

            <button disabled={!ok} onClick={()=>setSent(true)}>
              Send Request
            </button>
          </>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

/* =========================
   PROFILE (ADDED PRICING)
========================= */
function ProfilePage({user,currentUser}) {
  const [ed,setEd]=useState({
    ...user,
    rateMin:user?.rateMin||0,
    rateMax:user?.rateMax||0
  });

  const save=async()=>{
    await db.update(user.id,{
      ...ed,
      rateMin:Number(ed.rateMin),
      rateMax:Number(ed.rateMax)
    });
  };

  return (
    <div>
      <h1>{user.name}</h1>

      <p>💰 ${user?.rateMin} - ${user?.rateMax}</p>

      {currentUser?.id===user.id && (
        <>
          <input
            placeholder="Min price"
            value={ed.rateMin}
            onChange={e=>setEd({...ed,rateMin:e.target.value})}
          />
          <input
            placeholder="Max price"
            value={ed.rateMax}
            onChange={e=>setEd({...ed,rateMax:e.target.value})}
          />
          <button onClick={save}>Save</button>
        </>
      )}
    </div>
  );
}

/* =========================
   SIGNUP (UPDATED)
========================= */
async function createUser(d){
  return db.insert({
    ...d,
    rateMin:0,
    rateMax:0,
    commission:PLATFORM_COMMISSION
  });
}

/* =========================
   MAIN APP
========================= */
export default function App(){
  return (
    <div>
      {/* YOUR ORIGINAL UI STAYS HERE UNCHANGED */}
      The Voryel SaaS v2026 Ready
      <footer>
        © 2026 The Voryel · Founded by Adetunji Ewaoluwa Destiny
      </footer>
    </div>
  );
                }
