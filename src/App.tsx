// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   SUPABASE
══════════════════════════════════════════════════════════════════ */
const SURL = "https://zafvajcnwyzjumyklyni.supabase.co";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";
const SH = { apikey: SKEY, Authorization: `Bearer ${SKEY}`, "Content-Type": "application/json" };

async function sq(path, opts = {}) {
  try {
    const r = await fetch(`${SURL}/rest/v1/${path}`, { headers: { ...SH, ...(opts.headers||{}) }, ...opts });
    if (!r.ok) { const t = await r.text(); throw new Error(`DB ${r.status}: ${t}`); }
    const ct = r.headers.get("content-type")||"";
    return ct.includes("json") ? r.json() : [];
  } catch (e) { console.error("[Voryel DB]", e.message); throw e; }
}

const db = {
  profiles:  { all: () => sq("profiles?select=*&order=joined_at.desc"),
               byEmail: em => sq(`profiles?email=eq.${encodeURIComponent(em.trim().toLowerCase())}&select=*`).then(d=>d[0]||null),
               byId: id => sq(`profiles?id=eq.${id}&select=*`).then(d=>d[0]||null),
               insert: d => sq("profiles", {method:"POST", headers:{Prefer:"return=representation"}, body:JSON.stringify(d)}),
               update: (id,d) => sq(`profiles?id=eq.${id}`, {method:"PATCH", headers:{Prefer:"return=representation"}, body:JSON.stringify(d)}),
             },
  messages:  { thread: (a,b) => sq(`messages?or=(and(sender_id.eq.${a},recipient_id.eq.${b}),and(sender_id.eq.${b},recipient_id.eq.${a}))&order=created_at.asc&select=*`),
               inbox: id => sq(`messages?or=(sender_id.eq.${id},recipient_id.eq.${id})&order=created_at.desc&select=*`),
               send: d => sq("messages", {method:"POST", headers:{Prefer:"return=representation"}, body:JSON.stringify(d)}),
               markRead: (sid,rid) => sq(`messages?sender_id=eq.${sid}&recipient_id=eq.${rid}&read=eq.false`, {method:"PATCH", body:JSON.stringify({read:true})}),
             },
  collabs:   { all: () => sq("collaborations?select=*&order=created_at.desc"),
               insert: d => sq("collaborations", {method:"POST", headers:{Prefer:"return=representation"}, body:JSON.stringify(d)}),
             },
  opps:      { all: () => sq("opportunities?select=*&order=created_at.desc"),
               insert: d => sq("opportunities", {method:"POST", headers:{Prefer:"return=representation"}, body:JSON.stringify(d)}),
             },
};

/* ══════════════════════════════════════════════════════════════════
   SEO
══════════════════════════════════════════════════════════════════ */
function injectSEO() {
  document.title = "The Voryel | Premium Digital Professional Network";
  const m = (n,c,p) => { let e=document.querySelector(p?`meta[property="${n}"]`:`meta[name="${n}"]`)||document.createElement("meta"); e.setAttribute(p?"property":"name",n); e.setAttribute("content",c); document.head.appendChild(e); };
  m("description","A premium global network where digital professionals and clients discover, connect, and collaborate directly.");
  m("robots","index, follow");
  m("og:title","The Voryel | Premium Digital Network",true);
  m("og:description","Connect with elite digital professionals — designers, developers, creators — or find your next collaboration.",true);
  m("og:type","website",true);
  m("og:site_name","The Voryel",true);
  m("twitter:card","summary");
  m("twitter:title","The Voryel | Premium Digital Network");
  m("twitter:description","Premium digital network for professionals and clients worldwide.");
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#18080D"/><path d="M6 6L16 26L26 6" stroke="#D4A84B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="9" y1="17" x2="23" y2="17" stroke="#9B2242" stroke-width="1.4" stroke-linecap="round"/><rect x="13" y="13" width="6" height="6" transform="rotate(45 16 16)" fill="#18080D" stroke="#D4A84B" stroke-width="0.9"/></svg>`;
  let lnk=document.querySelector('link[rel="icon"]')||document.createElement("link");
  lnk.rel="icon"; lnk.type="image/svg+xml"; lnk.href=`data:image/svg+xml,${encodeURIComponent(svg)}`; document.head.appendChild(lnk);
}

/* ══════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════ */
const VMAIL = "thevoryel@gmail.com";
const CATS = ["Web Development","Web Design","Graphic Design","Video Editing","UI/UX Design","Programming","Brand Strategy","Content Creation","Motion Design","3D Design"];
const INDUSTRIES = ["Technology","Creative Agency","Startup","Media","Finance","Healthcare","Education","E-Commerce","Entertainment","Real Estate"];

const C = {
  bg:"#18080D", s1:"#22101A", s2:"#2D1520", s3:"#3A1D28",
  burg:"#9B2242", burgD:"#6B1428", burgL:"#C43060",
  gold:"#D4A84B", goldL:"#EBC96E", goldP:"#FAF0D0", goldDim:"rgba(212,168,75,0.11)",
  white:"#FDF8F2", tx:"#E8DDD0", tx2:"#A8957E", tx3:"#6A5546",
  b:"rgba(212,168,75,0.17)", bA:"rgba(212,168,75,0.5)",
  blue:"#6AABCC", green:"#5CAA8A", red:"#CC6A6A",
};

const ini=n=>(n||"").trim().split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";
const AVC=[["#6B1428","#9B2242"],["#0D2A4A","#1A5480"],["#2A1045","#5A2090"],["#0A2E1A","#1A6040"],["#3A1008","#7A2818"],["#0A2038","#155570"]];
const avc=n=>AVC[(n||"A").charCodeAt(0)%AVC.length];
const parseJ=(s,fb=[])=>{try{return JSON.parse(s||"null")??fb;}catch{return fb;}};
const parseSkills=s=>Array.isArray(s)?s:(s||"").split(",").map(x=>x.trim()).filter(Boolean);
const ago=ts=>{const d=(Date.now()-new Date(ts))/1000;if(d<60)return"just now";if(d<3600)return`${Math.floor(d/60)}m`;if(d<86400)return`${Math.floor(d/3600)}h`;return`${Math.floor(d/86400)}d`;};

/* ══════════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#18080D;color:#FDF8F2;font-family:'DM Sans',sans-serif;overflow-x:hidden;scroll-behavior:smooth;}
::placeholder{color:#6A5546;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#18080D;}::-webkit-scrollbar-thumb{background:#9B2242;border-radius:2px;}
select option{background:#22101A;color:#E8DDD0;}
input,textarea,select{color:#E8DDD0!important;font-family:'DM Sans',sans-serif;}
::selection{background:#9B2242;color:#FAF0D0;}
a{text-decoration:none;color:inherit;}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:.15;}50%{opacity:.65;}}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
@keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(212,168,75,0.3);}50%{box-shadow:0 0 0 6px rgba(212,168,75,0);}}

.fu{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both;}
.d1{animation-delay:.05s}.d2{animation-delay:.15s}.d3{animation-delay:.26s}.d4{animation-delay:.38s}.d5{animation-delay:.5s}
.fi{animation:fadeIn .4s ease both;}

.hc{transition:transform .28s cubic-bezier(.16,1,.3,1),box-shadow .28s,border-color .2s;}
.hc:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(155,34,66,0.22);border-color:rgba(212,168,75,.45)!important;}
.hl{transition:all .2s;}.hl:hover{opacity:.82;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 48px;background:rgba(24,8,13,.97);backdrop-filter:blur(28px) saturate(1.5);border-bottom:1px solid rgba(212,168,75,.1);}
.nav-links{display:flex;gap:28px;align-items:center;}
.nl{font-size:11px;letter-spacing:.08em;color:#A8957E;cursor:pointer;transition:color .2s;position:relative;padding-bottom:2px;font-weight:400;}
.nl::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:#D4A84B;transform:scaleX(0);transition:transform .22s;transform-origin:left;}
.nl:hover,.nl.on{color:#D4A84B;}.nl:hover::after,.nl.on::after{transform:scaleX(1);}
.nav-r{display:flex;gap:8px;align-items:center;}
.unread-dot{width:7px;height:7px;background:#D4A84B;border-radius:50%;position:absolute;top:-2px;right:-4px;animation:badgePulse 2s ease-in-out infinite;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:.06em;padding:9px 22px;border:none;cursor:pointer;transition:all .22s;white-space:nowrap;border-radius:2px;}
.btn-primary{background:#9B2242;color:#FAF0D0;border:1px solid #C43060;}.btn-primary:hover{background:#C43060;box-shadow:0 0 24px rgba(155,34,66,0.4);}
.btn-ghost{background:transparent;color:#A8957E;border:1px solid rgba(212,168,75,.18);}.btn-ghost:hover{border-color:#D4A84B;color:#D4A84B;}
.btn-outline{background:transparent;color:#D4A84B;border:1px solid rgba(212,168,75,.45);}.btn-outline:hover{background:rgba(212,168,75,.08);}
.btn-gold{background:linear-gradient(135deg,#D4A84B,#EBC96E);color:#18080D;font-weight:600;}.btn-gold:hover{box-shadow:0 0 28px rgba(212,168,75,.4);transform:translateY(-1px);}
.btn-sm{padding:6px 16px;font-size:11px;}
.btn-lg{padding:12px 32px;font-size:13px;}
.btn-xl{padding:15px 44px;font-size:14px;letter-spacing:.08em;}
.btn:disabled{opacity:.35;cursor:not-allowed;}

/* FORMS */
.fb{background:rgba(253,248,242,.04);border:1px solid rgba(212,168,75,.18);color:#E8DDD0!important;font-family:'DM Sans',sans-serif;font-size:14px;padding:11px 14px;outline:none;width:100%;transition:border-color .2s;border-radius:2px;}
.fb:focus{border-color:rgba(212,168,75,.5);background:rgba(253,248,242,.06);}
textarea.fb{resize:vertical;}
select.fb{cursor:pointer;background:#2D1520;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23D4A84B'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;padding-right:34px;}

/* LAYOUT */
.wrap{max-width:1160px;margin:0 auto;padding:0 48px;}
.wrap-sm{max-width:820px;margin:0 auto;padding:0 48px;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}

/* CARDS */
.vcard{background:#22101A;border:1px solid rgba(212,168,75,.16);transition:all .26s;}
.vcard:hover{border-color:rgba(212,168,75,.4);}
.section{padding:88px 0;}
.section-sm{padding:52px 0;}

/* VERIFIED BADGE */
.badge-verified{display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,rgba(212,168,75,0.15),rgba(212,168,75,0.08));border:1px solid rgba(212,168,75,0.45);padding:2px 9px;border-radius:100px;font-size:10px;color:#D4A84B;font-weight:500;letter-spacing:.04em;}
.badge-verified svg{width:11px;height:11px;}

/* TAGS */
.tag{display:inline-block;font-size:10px;padding:3px 10px;border:1px solid rgba(212,168,75,.22);color:#A8957E;border-radius:100px;letter-spacing:.04em;}
.tag-gold{border-color:rgba(212,168,75,.5);color:#D4A84B;background:rgba(212,168,75,.07);}

/* MESSAGES */
.msg-layout{display:flex;height:calc(100vh - 60px);margin-top:60px;overflow:hidden;}
.msg-rail{width:310px;flex-shrink:0;border-right:1px solid rgba(212,168,75,.12);background:#22101A;display:flex;flex-direction:column;overflow:hidden;}
.msg-rail-top{padding:20px;border-bottom:1px solid rgba(212,168,75,.12);flex-shrink:0;}
.msg-thread{flex:1;overflow-y:auto;}
.msg-row{display:flex;gap:12px;padding:14px 18px;cursor:pointer;border-bottom:1px solid rgba(212,168,75,.08);transition:background .18s;align-items:center;position:relative;}
.msg-row:hover,.msg-row.on{background:#2D1520;}
.msg-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.msg-main-top{padding:16px 28px;border-bottom:1px solid rgba(212,168,75,.12);display:flex;align-items:center;gap:14px;flex-shrink:0;background:#22101A;}
.msg-body{flex:1;overflow-y:auto;padding:28px;display:flex;flex-direction:column;gap:12px;}
.bubble-wrap{max-width:62%;}
.bubble-wrap.me{align-self:flex-end;}.bubble-wrap.them{align-self:flex-start;}
.bubble{padding:11px 16px;border-radius:12px;font-size:13.5px;line-height:1.6;}
.bubble-wrap.me .bubble{background:#9B2242;color:#FAF0D0;}
.bubble-wrap.them .bubble{background:#2D1520;border:1px solid rgba(212,168,75,.14);}
.bubble-time{font-size:10px;color:#6A5546;margin-top:3px;}
.bubble-wrap.me .bubble-time{text-align:right;}
.msg-compose{padding:16px 28px;border-top:1px solid rgba(212,168,75,.12);display:flex;gap:10px;align-items:flex-end;flex-shrink:0;background:#22101A;}
.compose-inp{flex:1;background:#2D1520;border:1px solid rgba(212,168,75,.18);padding:11px 15px;color:#E8DDD0!important;font-family:'DM Sans',sans-serif;font-size:13.5px;outline:none;resize:none;border-radius:2px;transition:border-color .2s;min-height:42px;max-height:120px;}
.compose-inp:focus{border-color:rgba(212,168,75,.5);}

/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(24,8,13,.9);z-index:300;display:flex;align-items:center;justify-content:center;padding:24px;animation:fadeIn .22s both;}
.modal{background:#22101A;border:1px solid rgba(212,168,75,.28);max-width:700px;width:100%;max-height:90vh;overflow-y:auto;position:relative;}

/* TOAST */
.toast{position:fixed;bottom:24px;right:24px;z-index:999;background:#2D1520;border:1px solid rgba(212,168,75,.45);padding:14px 20px;display:flex;align-items:flex-start;gap:12px;max-width:300px;box-shadow:0 16px 44px rgba(0,0,0,.5);animation:fadeUp .3s both;border-radius:2px;}

/* COLLAB / OPP CARDS */
.collab-card{background:#22101A;border:1px solid rgba(212,168,75,.16);padding:24px;transition:border-color .22s;}
.collab-card:hover{border-color:rgba(212,168,75,.38);}

/* ORNAMENT */
.orn{display:flex;align-items:center;gap:14px;justify-content:center;margin:6px 0 24px;}
.orn-line{flex:1;max-width:72px;height:1px;}
.orn-diamond{width:5px;height:5px;background:#D4A84B;transform:rotate(45deg);}
.orn-diamond-sm{width:3px;height:3px;background:#9B2242;transform:rotate(45deg);}

/* VERIFY BADGE BOX */
.verify-box{background:linear-gradient(135deg,rgba(212,168,75,0.08),rgba(155,34,66,0.06));border:1px solid rgba(212,168,75,0.35);padding:28px;border-radius:2px;}

/* RESPONSIVE */
@media(max-width:1024px){
  .nav{padding:0 22px;}.nav-links{display:none;}
  .wrap,.wrap-sm{padding:0 22px;}
  .grid-3,.grid-4{grid-template-columns:1fr 1fr;}
  .msg-rail{width:260px;}
}
@media(max-width:720px){
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr!important;}
  .msg-layout{flex-direction:column;}
  .msg-rail{width:100%;max-height:200px;}
  .two-col{grid-template-columns:1fr!important;}
}
`;

/* ══════════════════════════════════════════════════════════════════
   LOGO (original preferred style)
══════════════════════════════════════════════════════════════════ */
function Logo({ size="md", onClick }) {
  const s={sm:[0.52,0.95],md:[0.62,1.2],lg:[0.78,1.6]}[size]||[0.62,1.2];
  return (
    <div onClick={onClick} style={{cursor:onClick?"pointer":"default",display:"inline-flex",flexDirection:"column",alignItems:"flex-start",userSelect:"none",gap:1}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:300,fontSize:`${s[0]}rem`,letterSpacing:"0.52em",color:C.goldL,lineHeight:1}}>The</span>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontSize:`${s[1]}rem`,letterSpacing:"0.14em",lineHeight:1,background:`linear-gradient(135deg,${C.white} 0%,${C.goldP} 44%,${C.gold} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Voryel</span>
      <div style={{display:"flex",alignItems:"center",gap:5,width:"100%",marginTop:3}}>
        <div style={{flex:1,height:"0.5px",background:`linear-gradient(90deg,${C.burg},${C.burgL})`}}/>
        <div style={{width:4,height:4,background:C.gold,transform:"rotate(45deg)",flexShrink:0}}/>
        <div style={{flex:1,height:"0.5px",background:`linear-gradient(90deg,${C.burgL},transparent)`}}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════════════ */
function Av({name,size=46,photo}) {
  const [c1,c2]=avc(name||"A");
  if(photo) return <img src={photo} alt={name} style={{width:size,height:size,borderRadius:2,objectFit:"cover",border:`1px solid ${C.b}`,flexShrink:0}}/>;
  return (
    <div style={{width:size,height:size,background:`linear-gradient(135deg,${c1},${c2})`,border:`1px solid ${C.b}`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:size*0.34,color:C.gold,lineHeight:1,fontWeight:300}}>{ini(name)}</span>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="badge-verified">
      <svg viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4H11L8.5 6.5L9.5 10L6 8L2.5 10L3.5 6.5L1 4H4.5L6 1Z" fill="#D4A84B"/></svg>
      Verified
    </span>
  );
}

function Btn({children,onClick,v="primary",size="md",full,disabled,style={}}) {
  const cls=`btn btn-${v} btn-${size}`;
  return <button className={cls} onClick={disabled?undefined:onClick} disabled={disabled} style={{width:full?"100%":"auto",...style}}>{children}</button>;
}

function Field({label,name,type="text",value,onChange,placeholder,options,rows,required,hint}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:11,letterSpacing:"0.08em",color:C.tx3,fontWeight:500}}>{label}{required&&<span style={{color:C.gold,marginLeft:2}}>*</span>}</label>}
      {type==="select"
        ?<select name={name} value={value} onChange={onChange} className="fb"><option value="">Select…</option>{options?.map(o=><option key={o} value={o}>{o}</option>)}</select>
        :type==="textarea"
        ?<textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows||4} className="fb"/>
        :<input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="fb"/>
      }
      {hint&&<span style={{fontSize:11,color:C.tx3,fontStyle:"italic"}}>{hint}</span>}
    </div>
  );
}

function Ornament() {
  return (
    <div className="orn">
      <div className="orn-line" style={{background:`linear-gradient(90deg,transparent,${C.burgD})`}}/>
      <div className="orn-diamond"/><div className="orn-diamond-sm"/><div className="orn-diamond"/>
      <div className="orn-line" style={{background:`linear-gradient(90deg,${C.burgD},transparent)`}}/>
    </div>
  );
}

function SectionHead({eyebrow,title,sub,center=true}) {
  return (
    <div style={{textAlign:center?"center":"left",marginBottom:52}}>
      <div style={{fontSize:10,letterSpacing:"0.22em",color:C.gold,marginBottom:12,fontWeight:500,display:"flex",alignItems:"center",gap:12,justifyContent:center?"center":"flex-start"}}>
        {center&&<span style={{width:20,height:1,background:C.gold,opacity:.4,display:"inline-block"}}/>}
        {eyebrow}
        {center&&<span style={{width:20,height:1,background:C.gold,opacity:.4,display:"inline-block"}}/>}
      </div>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.9rem,3.8vw,3.2rem)",fontWeight:300,color:C.white,lineHeight:1.1}} dangerouslySetInnerHTML={{__html:title}}/>
      <Ornament/>
      {sub&&<p style={{fontSize:15,color:C.tx,maxWidth:480,margin:"0 auto",lineHeight:1.85,fontWeight:300}}>{sub}</p>}
    </div>
  );
}

function Spinner() { return <div style={{width:18,height:18,border:`2px solid ${C.b}`,borderTopColor:C.gold,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>; }

function Toast({title,body,type="success",onDone}) {
  useEffect(()=>{const t=setTimeout(onDone,3200);return()=>clearTimeout(t);},[]);
  return (
    <div className="toast">
      <span style={{color:type==="error"?C.red:C.gold,fontSize:15,flexShrink:0}}>{type==="error"?"✕":"✦"}</span>
      <div>
        <div style={{fontSize:12,fontWeight:600,color:type==="error"?C.red:C.gold,marginBottom:2}}>{title}</div>
        <div style={{fontSize:12.5,color:C.tx}}>{body}</div>
      </div>
    </div>
  );
}

function ErrBox({msg}) {
  if(!msg) return null;
  return <div style={{background:"rgba(200,60,60,.1)",border:"1px solid rgba(200,60,60,.35)",padding:"10px 14px",fontSize:13,color:"#EE9999",borderRadius:2,lineHeight:1.6}}>{msg}</div>;
}

/* ══════════════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════════════ */
function Nav({page,setPage,user,onLogout,unreadCount}) {
  const links=[["home","Home"],["explore-pro","Professionals"],["explore-clients","Clients"],["collaborations","Collaborate"],["opportunities","Opportunities"]];
  return (
    <nav className="nav">
      <Logo size="md" onClick={()=>setPage("home")}/>
      <div className="nav-links">
        {links.map(([id,l])=>(
          <span key={id} className={`nl${page===id?" on":""}`} onClick={()=>setPage(id)}>{l}</span>
        ))}
      </div>
      <div className="nav-r">
        {user&&(
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setPage("messages")}>
            <span className={`nl${page==="messages"?" on":""}`}>Messages</span>
            {unreadCount>0&&<div className="unread-dot"/>}
          </div>
        )}
        {user?(
          <>
            <span className="nl" style={{cursor:"pointer"}} onClick={()=>setPage("dashboard")}>{user.name?.split(" ")[0]||"Profile"}</span>
            <Btn v="ghost" size="sm" onClick={onLogout}>Sign Out</Btn>
          </>
        ):(
          <>
            <Btn v="ghost" size="sm" onClick={()=>setPage("login")}>Sign In</Btn>
            <Btn v="gold" size="sm" onClick={()=>setPage("signup")}>Join Free</Btn>
          </>
        )}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════ */
function Footer({setPage}) {
  return (
    <footer style={{background:C.s1,borderTop:`1px solid ${C.b}`,padding:"52px 0 32px"}}>
      <div className="wrap" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:44}} id="footer-grid">
        <div>
          <Logo size="md"/>
          <p style={{fontSize:14,color:C.tx,fontWeight:300,marginTop:16,maxWidth:240,lineHeight:1.85}}>A premium global network where digital professionals and clients connect, collaborate, and grow together.</p>
          <p style={{fontSize:10,letterSpacing:"0.2em",color:C.gold,marginTop:14,fontWeight:500}}>YOUR VISION, OUR FLOW</p>
        </div>
        <div>
          <div style={{fontSize:10,letterSpacing:"0.18em",color:C.gold,marginBottom:16,fontWeight:600}}>NETWORK</div>
          {[["explore-pro","Professionals"],["explore-clients","Clients"],["collaborations","Collaborate"],["opportunities","Opportunities"]].map(([id,l])=>(
            <div key={id} onClick={()=>setPage(id)} style={{fontSize:13.5,color:C.tx,cursor:"pointer",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=C.gold} onMouseLeave={e=>e.target.style.color=C.tx}>{l}</div>
          ))}
        </div>
        <div>
          <div style={{fontSize:10,letterSpacing:"0.18em",color:C.gold,marginBottom:16,fontWeight:600}}>CATEGORIES</div>
          {CATS.slice(0,6).map(c=><div key={c} style={{fontSize:13,color:C.tx2,marginBottom:8}}>{c}</div>)}
        </div>
        <div>
          <div style={{fontSize:10,letterSpacing:"0.18em",color:C.gold,marginBottom:16,fontWeight:600}}>COMPANY</div>
          {[["terms","Terms of Service"],["privacy","Privacy Policy"],["contact","Contact"]].map(([id,l])=>(
            <div key={id} onClick={()=>setPage(id)} style={{fontSize:13.5,color:C.tx,cursor:"pointer",marginBottom:9,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=C.gold} onMouseLeave={e=>e.target.style.color=C.tx}>{l}</div>
          ))}
          <div style={{marginTop:20}}>
            <div style={{fontSize:10,letterSpacing:"0.14em",color:C.tx3,marginBottom:5,fontWeight:500}}>SUPPORT</div>
            <a href={`mailto:${VMAIL}`} style={{fontSize:13,color:C.gold}}>{VMAIL}</a>
          </div>
        </div>
      </div>
      <div className="wrap" style={{borderTop:`1px solid ${C.b}`,marginTop:36,paddingTop:24,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <span style={{fontSize:11,color:C.tx3}}>© 2026 The Voryel · Founded by Adetunji Ewaoluwa Destiny</span>
        <span style={{fontSize:11,color:C.tx3}}>Free to join · Professionals worldwide</span>
      </div>
      <style>{`#footer-grid{grid-template-columns:2fr 1fr 1fr 1fr;}@media(max-width:720px){#footer-grid{grid-template-columns:1fr 1fr;}}`}</style>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HERO GRAPHIC
══════════════════════════════════════════════════════════════════ */
function HeroGraphic() {
  return (
    <svg width="380" height="380" viewBox="0 0 420 420" fill="none" style={{position:"absolute",right:"5%",top:"50%",transform:"translateY(-50%)",opacity:.48,pointerEvents:"none",animation:"floatY 7s ease-in-out infinite"}}>
      <circle cx="210" cy="210" r="195" stroke="#D4A84B" strokeWidth="0.5" opacity="0.2"/>
      <circle cx="210" cy="210" r="155" stroke="#D4A84B" strokeWidth="0.3" opacity="0.12"/>
      <path d="M210 20 A190 190 0 0 1 390 170" stroke="#9B2242" strokeWidth="1.2" opacity="0.4"/>
      <path d="M390 250 A190 190 0 0 1 90 380" stroke="#9B2242" strokeWidth="0.7" opacity="0.25"/>
      <line x1="210" y1="15" x2="210" y2="405" stroke="#D4A84B" strokeWidth="0.3" opacity="0.09"/>
      <line x1="15" y1="210" x2="405" y2="210" stroke="#D4A84B" strokeWidth="0.3" opacity="0.09"/>
      <path d="M100 100 L210 310 L320 100" stroke="#D4A84B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.62"/>
      <path d="M140 130 L210 270 L280 130" stroke="#D4A84B" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.28"/>
      <line x1="128" y1="210" x2="292" y2="210" stroke="#9B2242" strokeWidth="1.4" strokeLinecap="round" opacity="0.72"/>
      <rect x="198" y="198" width="24" height="24" transform="rotate(45 210 210)" fill="#6B1428" stroke="#D4A84B" strokeWidth="1.2" opacity="0.88"/>
      <rect x="204" y="204" width="12" height="12" transform="rotate(45 210 210)" fill="#D4A84B" opacity="0.48"/>
      <polyline points="30,30 30,12 48,12" stroke="#D4A84B" strokeWidth="1.1" fill="none" opacity="0.42"/>
      <polyline points="372,12 390,12 390,30" stroke="#D4A84B" strokeWidth="1.1" fill="none" opacity="0.42"/>
      <polyline points="390,390 390,408 372,408" stroke="#D4A84B" strokeWidth="1.1" fill="none" opacity="0.42"/>
      <polyline points="48,408 30,408 30,390" stroke="#D4A84B" strokeWidth="1.1" fill="none" opacity="0.42"/>
      <circle cx="100" cy="100" r="4" fill="#D4A84B" opacity="0.7"/>
      <circle cx="320" cy="100" r="4" fill="#D4A84B" opacity="0.7"/>
      <circle cx="210" cy="310" r="5" fill="#9B2242" opacity="0.85" stroke="#D4A84B" strokeWidth="1"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PROFILE CARD (professional)
══════════════════════════════════════════════════════════════════ */
function ProCard({member,onClick,onMessage,me}) {
  const skills=parseSkills(member.skills);
  const rate=member.price_label||(member.starting_price?`from $${member.starting_price}`:member.hourly_rate?`$${member.hourly_rate}/hr`:null);
  return (
    <div className="vcard hc" style={{display:"flex",flexDirection:"column",overflow:"hidden",cursor:"pointer"}} onClick={onClick}>
      <div style={{padding:"22px 20px 18px",borderBottom:`1px solid ${C.b}`}}>
        <div style={{display:"flex",gap:13,alignItems:"flex-start",marginBottom:13}}>
          <Av name={member.name} size={50} photo={member.photo_url}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:2}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:400,color:C.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:160}}>{member.name}</span>
              {member.verified&&<VerifiedBadge/>}
            </div>
            <div style={{fontSize:11,letterSpacing:"0.06em",color:C.gold,fontWeight:500}}>{member.category||"Digital Professional"}</div>
            {member.location&&<div style={{fontSize:11,color:C.tx3,marginTop:2}}>📍 {member.location}</div>}
          </div>
          {rate&&<div style={{fontSize:10,color:C.gold,background:C.goldDim,border:`1px solid ${C.b}`,padding:"3px 9px",flexShrink:0,whiteSpace:"nowrap",borderRadius:2}}>{rate}</div>}
        </div>
        {member.bio&&<p style={{fontSize:13,color:C.tx,lineHeight:1.72,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",marginBottom:10}}>{member.bio}</p>}
        {skills.length>0&&(
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {skills.slice(0,4).map(s=><span key={s} className="tag">{s}</span>)}
            {skills.length>4&&<span style={{fontSize:11,color:C.tx3}}>+{skills.length-4}</span>}
          </div>
        )}
      </div>
      <div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:C.s2}}>
        <span style={{fontSize:10,letterSpacing:"0.08em",fontWeight:500,color:member.open_to_work!==false?C.green:C.tx3}}>
          {member.open_to_work!==false?"● AVAILABLE":"○ BUSY"}
        </span>
        {me&&me.id!==member.id&&(
          <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();onMessage(member);}}>Message</button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CLIENT CARD
══════════════════════════════════════════════════════════════════ */
function ClientCard({member,onClick,onMessage,me}) {
  return (
    <div className="vcard hc" style={{display:"flex",flexDirection:"column",overflow:"hidden",cursor:"pointer"}} onClick={onClick}>
      <div style={{padding:"22px 20px 18px",borderBottom:`1px solid ${C.b}`}}>
        <div style={{display:"flex",gap:13,alignItems:"flex-start",marginBottom:13}}>
          <Av name={member.company||member.name} size={50} photo={member.photo_url}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:2}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:400,color:C.white}}>{member.company||member.name}</span>
              {member.verified&&<VerifiedBadge/>}
            </div>
            <div style={{fontSize:11,color:C.gold,fontWeight:500}}>{member.industry||"Client / Business"}</div>
            {member.location&&<div style={{fontSize:11,color:C.tx3,marginTop:2}}>📍 {member.location}</div>}
          </div>
        </div>
        {member.bio&&<p style={{fontSize:13,color:C.tx,lineHeight:1.72,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",marginBottom:10}}>{member.bio}</p>}
        {member.talent_interests&&(
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {member.talent_interests.split(",").slice(0,3).map(t=><span key={t} className="tag">{t.trim()}</span>)}
          </div>
        )}
      </div>
      <div style={{padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:C.s2}}>
        <span style={{fontSize:11,color:C.tx2}}>{member.project_needs?"Looking for talent":"Client / Business"}</span>
        {me&&me.id!==member.id&&(
          <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();onMessage(member);}}>Message</button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PROFILE MODAL (full view)
══════════════════════════════════════════════════════════════════ */
function ProfileModal({member,onClose,onMessage,me}) {
  const skills=parseSkills(member.skills);
  const tools=parseSkills(member.tools);
  const portfolio=parseJ(member.portfolio,[]);
  const isFreelancer=member.role==="freelancer"||member.user_type==="freelancer";
  const rate=member.price_label||(member.starting_price?`from $${member.starting_price}`:member.hourly_rate?`$${member.hourly_rate}/hr`:null);
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal fi">
        <div style={{height:110,background:`linear-gradient(120deg,${C.burgD},#200C14 55%,${C.bg})`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 26px,rgba(212,168,75,0.04) 26px,rgba(212,168,75,0.04) 27px)"}}/>
          <button onClick={onClose} style={{position:"absolute",top:13,right:15,background:"transparent",border:"none",color:C.tx3,fontSize:18,cursor:"pointer",lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:"0 30px 34px"}}>
          <div style={{display:"flex",gap:16,alignItems:"flex-end",marginTop:-36,marginBottom:22}}>
            <Av name={member.name} size={72} photo={member.photo_url}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.65rem",fontWeight:300,color:C.white}}>{member.name}</span>
                {member.verified&&<VerifiedBadge/>}
              </div>
              <div style={{fontSize:12,color:C.gold,fontWeight:500}}>{member.category||(member.company?"Client / Business":"Professional")}</div>
              {member.location&&<div style={{fontSize:12,color:C.tx3,marginTop:3}}>📍 {member.location}</div>}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {rate&&<span style={{fontSize:10,color:C.gold,background:C.goldDim,border:`1px solid ${C.b}`,padding:"4px 12px",borderRadius:2}}>{rate}</span>}
              {me&&me.id!==member.id&&<button className="btn btn-primary btn-sm" onClick={()=>onMessage(member)}>Message</button>}
            </div>
          </div>

          {member.bio&&<div style={{marginBottom:20}}><div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:8,fontWeight:600}}>ABOUT</div><p style={{fontSize:14.5,color:C.tx,lineHeight:1.85}}>{member.bio}</p></div>}

          {member.years_exp&&<div style={{marginBottom:16,fontSize:13,color:C.tx2}}><strong style={{color:C.tx}}>Experience:</strong> {member.years_exp} {parseInt(member.years_exp)===1?"year":"years"}</div>}

          {portfolio.length>0&&(
            <div style={{marginBottom:22}}>
              <div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:12,fontWeight:600}}>PORTFOLIO</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {portfolio.map((item,i)=>(
                  <div key={i} style={{aspectRatio:"4/3",background:C.s2,border:`1px solid ${C.b}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:12,overflow:"hidden"}}>
                    {item.url?<img src={item.url} alt={item.title||""} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
                    :<><div style={{fontSize:"1.1rem",color:C.gold,marginBottom:6}}>◈</div><span style={{fontSize:10,color:C.tx2,textAlign:"center"}}>{item.title||"Work sample"}</span></>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(skills.length>0||tools.length>0)&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
              {skills.length>0&&<div><div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:8,fontWeight:600}}>SKILLS</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{skills.map(s=><span key={s} className="tag">{s}</span>)}</div></div>}
              {tools.length>0&&<div><div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:8,fontWeight:600}}>TOOLS</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{tools.map(t=><span key={t} className="tag">{t}</span>)}</div></div>}
            </div>
          )}

          {member.contact_methods&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:8,fontWeight:600}}>PREFERRED CONTACT</div>
              <p style={{fontSize:13.5,color:C.tx}}>{member.contact_methods}</p>
            </div>
          )}

          {(member.website||member.social_links)&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:8,fontWeight:600}}>LINKS</div>
              {member.website&&<a href={member.website} target="_blank" rel="noreferrer" style={{fontSize:13,color:C.blue,display:"block",marginBottom:4}}>{member.website}</a>}
              {member.social_links&&<p style={{fontSize:13,color:C.tx2}}>{member.social_links}</p>}
            </div>
          )}

          <div style={{borderTop:`1px solid ${C.b}`,paddingTop:18,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:10,color:isFreelancer?(member.open_to_work!==false?C.green:C.tx3):C.blue,fontWeight:500,marginBottom:3}}>
                {isFreelancer?(member.open_to_work!==false?"● AVAILABLE FOR PROJECTS":"○ NOT AVAILABLE RIGHT NOW"):"● CLIENT / BUSINESS"}
              </div>
              <div style={{fontSize:11,color:C.tx3}}>Member of The Voryel</div>
            </div>
            {me&&me.id!==member.id&&<button className="btn btn-primary" onClick={()=>onMessage(member)}>Send Message</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════════════════════ */
function Home({setPage,members,loading,me,onMessage}) {
  const pros=members.filter(m=>m.role==="freelancer"||m.user_type==="freelancer");
  const clients=members.filter(m=>m.role==="client"||m.user_type==="client");
  const verified=members.filter(m=>m.verified);
  const [viewingMember,setViewingMember]=useState(null);

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:60}}>
      {viewingMember&&<ProfileModal member={viewingMember} onClose={()=>setViewingMember(null)} onMessage={m=>{setViewingMember(null);onMessage(m);}} me={me}/>}

      {/* HERO */}
      <section style={{minHeight:"92vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",padding:"0 10% 0 7%"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 65% 75% at 15% 55%,rgba(155,34,66,0.18) 0%,transparent 70%)`}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(212,168,75,.065) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,75,.065) 1px,transparent 1px)`,backgroundSize:"62px 62px",maskImage:"radial-gradient(ellipse 90% 90% at 30% 50%,black 5%,transparent 100%)",opacity:.48}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:620}}>
          <div className="fu d1" style={{fontSize:10,letterSpacing:"0.32em",color:C.gold,marginBottom:22,display:"flex",alignItems:"center",gap:14,fontWeight:500}}>
            <span style={{width:28,height:1,background:C.gold,opacity:.4,display:"inline-block"}}/> YOUR VISION, OUR FLOW
          </div>
          <h1 className="fu d2" style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(3.2rem,6.2vw,6rem)",letterSpacing:"-0.01em",lineHeight:1.05,color:C.white}}>Where Vision</h1>
          <h1 className="fu d3" style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(3.2rem,6.2vw,6rem)",letterSpacing:"-0.01em",lineHeight:1.08,color:C.gold,fontStyle:"italic",marginBottom:28}}>Meets Craft</h1>
          <div className="fu d3" style={{width:56,height:2,background:`linear-gradient(90deg,${C.burg},${C.gold})`,marginBottom:26}}/>
          <p className="fu d4" style={{fontSize:16.5,color:C.tx,fontWeight:300,maxWidth:480,marginBottom:40,lineHeight:1.9}}>A premium global network where digital professionals and clients discover, connect, message directly, and collaborate on meaningful work — no intermediaries.</p>
          <div className="fu d5" style={{display:"flex",gap:13,flexWrap:"wrap"}}>
            <Btn v="gold" size="xl" onClick={()=>setPage("signup")}>Join The Voryel — Free</Btn>
            <Btn v="ghost" size="lg" onClick={()=>setPage("explore-pro")}>Explore Professionals</Btn>
          </div>
          <div className="fu" style={{animationDelay:".65s",marginTop:24,fontSize:11,color:C.tx3,display:"flex",gap:20,flexWrap:"wrap"}}>
            <span>✦ Free to join</span>
            <span>✦ Direct messaging</span>
            <span>✦ No intermediaries</span>
          </div>
        </div>
        <HeroGraphic/>
        <div style={{position:"absolute",bottom:34,left:"7%",display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:36,height:1,background:`linear-gradient(90deg,${C.gold},transparent)`,animation:"pulse 2.5s ease-in-out infinite"}}/>
          <span style={{fontSize:10,letterSpacing:"0.18em",color:C.tx3,fontWeight:500}}>SCROLL</span>
        </div>
      </section>

      {/* STATS */}
      <div style={{borderTop:`1px solid ${C.b}`,borderBottom:`1px solid ${C.b}`,background:C.s1}}>
        <div className="wrap" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)"}} id="stats-grid">
          {[[loading?"—":pros.length,"Professionals"],[loading?"—":clients.length,"Clients"],[loading?"—":verified.length,"Verified Members"],["Global","Digital Network"]].map(([n,l],i)=>(
            <div key={l} style={{padding:"30px 20px",textAlign:"center",borderRight:i<3?`1px solid ${C.b}`:"none"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.5rem",fontWeight:300,color:C.gold,lineHeight:1}}>{n}</div>
              <div style={{fontSize:10,letterSpacing:"0.14em",color:C.tx3,marginTop:5,fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>
        <style>{`#stats-grid{grid-template-columns:repeat(4,1fr);}@media(max-width:720px){#stats-grid{grid-template-columns:1fr 1fr;}}`}</style>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" style={{background:C.s1}}>
        <div className="wrap">
          <SectionHead eyebrow="HOW IT WORKS" title="Simple. Direct. <em style='color:#D4A84B'>Premium.</em>" sub="From discovery to direct conversation — everything happens on The Voryel."/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.b}} id="how-grid">
            {[
              {n:"01",t:"Create Your Profile",b:"Professionals set rates, showcase portfolios, and define their craft. Clients describe their business and project needs."},
              {n:"02",t:"Discover the Network",b:"Browse professionals by category, skill, or availability. Explore client businesses looking for talent. Search. Filter. Connect."},
              {n:"03",t:"Message Directly",b:"Send a direct message on the platform. No email, no middleman. Discuss projects, pricing, and timelines privately and instantly."},
              {n:"04",t:"Collaborate & Grow",b:"Agree on work terms directly. Build trust. Grow your professional network. The Voryel facilitates connection — you handle the rest."},
            ].map(s=>(
              <div key={s.n} style={{background:C.s1,padding:"36px 28px",position:"relative",transition:"background .25s"}} onMouseEnter={e=>e.currentTarget.style.background=C.s2} onMouseLeave={e=>e.currentTarget.style.background=C.s1}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"3.5rem",fontWeight:300,color:"rgba(212,168,75,0.06)",position:"absolute",top:12,right:16,lineHeight:1,userSelect:"none"}}>{s.n}</div>
                <div style={{fontSize:10,letterSpacing:"0.14em",color:C.gold,marginBottom:14,fontWeight:600,display:"flex",alignItems:"center",gap:8}}><span>{s.n}</span><span style={{width:18,height:1,background:C.burg,display:"inline-block"}}/></div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:400,color:C.white,marginBottom:10}}>{s.t}</h3>
                <p style={{fontSize:13.5,color:C.tx,lineHeight:1.82}}>{s.b}</p>
              </div>
            ))}
          </div>
          <style>{`#how-grid{grid-template-columns:repeat(4,1fr);}@media(max-width:720px){#how-grid{grid-template-columns:1fr 1fr;}}`}</style>
        </div>
      </section>

      {/* VERIFIED BADGE SECTION */}
      <section className="section" style={{background:C.bg}}>
        <div className="wrap">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,alignItems:"center"}} className="two-col" id="verified-grid">
            <div>
              <SectionHead eyebrow="VORYEL VERIFIED" title="The badge that <em style='color:#D4A84B'>earns trust.</em>" center={false}/>
              <p style={{fontSize:14.5,color:C.tx,lineHeight:1.88,marginBottom:24}}>The Voryel Verified badge is not automatic. Professionals apply for a manual review by The Voryel team. Only those who meet our quality standards receive the badge — making it a genuine signal of credibility and excellence.</p>
              <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>
                {[["Portfolio quality & consistency","We review your actual work — not just your claims."],["Profile completeness & professionalism","A complete, well-presented profile is the foundation."],["Credibility & communication quality","We assess how you represent yourself on the platform."]].map(([t,d])=>(
                  <div key={t} style={{display:"flex",gap:13,alignItems:"flex-start"}}>
                    <div style={{width:18,height:18,background:`rgba(212,168,75,0.15)`,border:`1px solid ${C.bA}`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                      <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1 4.5L3.5 7L8 2" stroke="#D4A84B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    </div>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:2}}>{t}</div><div style={{fontSize:12.5,color:C.tx2}}>{d}</div></div>
                  </div>
                ))}
              </div>
              <div className="verify-box">
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <VerifiedBadge/>
                  <span style={{fontSize:13,fontWeight:600,color:C.white}}>Voryel Verified</span>
                </div>
                <p style={{fontSize:13,color:C.tx2,lineHeight:1.75}}>A monthly subscription gives you <strong style={{color:C.white}}>access to apply for review only</strong> — not an automatic badge. If approved, your badge is displayed on your profile. If quality drops or rules are violated, the badge may be removed.</p>
                <div style={{marginTop:16,display:"inline-flex",alignItems:"center",gap:8,background:C.s2,border:`1px solid ${C.b}`,padding:"8px 16px",borderRadius:2}}>
                  <span style={{fontSize:11,color:C.tx3}}>Pricing</span>
                  <span style={{fontSize:11,fontWeight:600,color:C.gold}}>Coming Soon</span>
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[
                {icon:"🎯",t:"Priority Search Placement",d:"Verified profiles appear higher in search results and category pages."},
                {icon:"💎",t:"Premium Trust Signal",d:"Clients immediately see you've been manually reviewed and approved."},
                {icon:"📊",t:"Profile Analytics",d:"Access insights on profile views, search appearances, and more."},
                {icon:"✦",t:"Stronger Reputation",d:"Stand out in a growing network with a badge that genuinely means something."},
              ].map(c=>(
                <div key={c.t} style={{background:C.s1,border:`1px solid ${C.b}`,padding:"20px 22px",display:"flex",gap:16,alignItems:"flex-start",transition:"border-color .22s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bA} onMouseLeave={e=>e.currentTarget.style.borderColor=C.b}>
                  <span style={{fontSize:"1.3rem",flexShrink:0}}>{c.icon}</span>
                  <div><div style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:4}}>{c.t}</div><div style={{fontSize:13,color:C.tx2}}>{c.d}</div></div>
                </div>
              ))}
            </div>
          </div>
          <style>{`#verified-grid{grid-template-columns:1fr 1fr;}@media(max-width:720px){#verified-grid{grid-template-columns:1fr;}}`}</style>
        </div>
      </section>

      {/* FEATURED PROFESSIONALS */}
      {pros.length>0&&(
        <section className="section" style={{background:C.s1}}>
          <div className="wrap">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
              <div><div style={{fontSize:10,letterSpacing:"0.2em",color:C.gold,marginBottom:10,fontWeight:500}}>FEATURED PROFESSIONALS</div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.2rem",fontWeight:300,color:C.white}}>Meet the <em style={{color:C.gold}}>Network</em></h2></div>
              <Btn v="outline" size="sm" onClick={()=>setPage("explore-pro")}>View All →</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}} id="feat-grid">
              {pros.slice(0,3).map(m=><ProCard key={m.id} member={m} onClick={()=>setViewingMember(m)} onMessage={onMessage} me={me}/>)}
            </div>
            <style>{`#feat-grid{grid-template-columns:repeat(3,1fr);}@media(max-width:720px){#feat-grid{grid-template-columns:1fr;}}`}</style>
          </div>
        </section>
      )}

      {/* FUTURE MONETIZATION */}
      <section className="section" style={{background:C.bg}}>
        <div className="wrap">
          <SectionHead eyebrow="FUTURE OFFERINGS" title="Built to grow <em style='color:#D4A84B'>with you.</em>" sub="The Voryel will never charge commissions on deals. Instead, our future revenue comes from premium services that benefit you."/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}} id="future-grid">
            {[
              {icon:"⭐",t:"Premium Profiles",d:"Featured placement, higher ranking, analytics, and extra portfolio slots for serious professionals.",tag:"Coming Soon"},
              {icon:"📣",t:"Sponsored Placement",d:"Homepage, category, and newsletter sponsorships for brands and agencies wanting visibility.",tag:"Coming Soon"},
              {icon:"🤝",t:"Agency Partnerships",d:"Dedicated partnership programs for agencies, brands, educational platforms, and startup ecosystems.",tag:"Coming Soon"},
              {icon:"🚀",t:"Boosted Listings",d:"Premium opportunity and job listings for businesses seeking targeted reach within the network.",tag:"Coming Soon"},
              {icon:"📚",t:"Learning & Resources",d:"Portfolio reviews, professional templates, growth guides, and tools for digital creatives.",tag:"Coming Soon"},
              {icon:"🔵",t:"Voryel Verified Badge",d:"Monthly subscription for review access. Badge granted only upon manual approval by our team.",tag:"Coming Soon"},
            ].map(c=>(
              <div key={c.t} style={{background:C.s1,border:`1px solid ${C.b}`,padding:"26px 22px",transition:"border-color .22s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bA} onMouseLeave={e=>e.currentTarget.style.borderColor=C.b}>
                <div style={{fontSize:"1.4rem",marginBottom:14}}>{c.icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:6}}>{c.t}</div>
                <p style={{fontSize:13,color:C.tx2,lineHeight:1.75,marginBottom:14}}>{c.d}</p>
                <span style={{fontSize:10,letterSpacing:"0.1em",fontWeight:600,padding:"3px 10px",background:"rgba(212,168,75,0.08)",border:`1px solid ${C.b}`,color:C.gold,borderRadius:2}}>{c.tag}</span>
              </div>
            ))}
          </div>
          <style>{`#future-grid{grid-template-columns:repeat(3,1fr);}@media(max-width:720px){#future-grid{grid-template-columns:1fr 1fr;}}`}</style>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"76px 0",textAlign:"center",background:`linear-gradient(135deg,${C.burgD} 0%,${C.bg} 55%)`,borderTop:`1px solid ${C.b}`}}>
        <div className="wrap-sm">
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.9rem,4vw,3.3rem)",fontWeight:300,color:C.white,marginBottom:10}}>Ready to enter <em style={{color:C.gold}}>The Voryel</em>?</h2>
          <Ornament/>
          <p style={{fontSize:15.5,color:C.tx,fontWeight:300,marginBottom:34,lineHeight:1.88}}>Free to join. Message directly. No middlemen. Build your network today.</p>
          <Btn v="gold" size="xl" onClick={()=>setPage("signup")}>Join The Voryel — It's Free →</Btn>
        </div>
      </section>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EXPLORE PROFESSIONALS
══════════════════════════════════════════════════════════════════ */
function ExplorePro({setPage,members,loading,me,onMessage}) {
  const [cat,setCat]=useState("All");
  const [search,setSearch]=useState("");
  const [avail,setAvail]=useState(false);
  const [verified,setVerified]=useState(false);
  const [viewing,setViewing]=useState(null);
  const pros=members.filter(m=>m.role==="freelancer"||m.user_type==="freelancer");
  const filtered=pros.filter(m=>{
    if(cat!=="All"&&m.category!==cat)return false;
    if(avail&&m.open_to_work===false)return false;
    if(verified&&!m.verified)return false;
    const q=search.toLowerCase();
    return !q||(m.name||"").toLowerCase().includes(q)||(m.bio||"").toLowerCase().includes(q)||(m.category||"").toLowerCase().includes(q)||(m.skills||"").toLowerCase().includes(q);
  });
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:60}}>
      {viewing&&<ProfileModal member={viewing} onClose={()=>setViewing(null)} onMessage={m=>{setViewing(null);onMessage(m);}} me={me}/>}
      <div style={{background:`linear-gradient(135deg,${C.burgD},${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"56px 48px 44px"}}>
        <div className="wrap">
          <div style={{fontSize:10,letterSpacing:"0.22em",color:C.gold,marginBottom:12,fontWeight:500}}>EXPLORE PROFESSIONALS</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.6rem)",fontWeight:300,color:C.white,marginBottom:8}}>Find Your Perfect <em style={{color:C.gold}}>Collaborator</em></h1>
          <Ornament/>
          <p style={{fontSize:15,color:C.tx,fontWeight:300,maxWidth:520,marginBottom:28,lineHeight:1.88}}>Browse elite digital professionals. Click any profile to view their full portfolio, skills, and rates. Then message them directly — no middleman.</p>
          <div style={{display:"flex",maxWidth:560,marginBottom:16,background:"rgba(253,248,242,0.03)",border:`1px solid ${C.b}`,overflow:"hidden",borderRadius:2}}>
            <input className="fb" style={{flex:1,border:"none",background:"transparent"}} placeholder="Search by name, skill, or specialty…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <div style={{padding:"11px 15px",color:C.tx3,borderLeft:`1px solid ${C.b}`,fontSize:16}}>⌕</div>
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
            {["All",...CATS].map(c=><button key={c} onClick={()=>setCat(c)} style={{fontSize:11,padding:"6px 14px",border:`1px solid ${cat===c?C.bA:C.b}`,background:cat===c?"rgba(155,34,66,.25)":"transparent",color:cat===c?C.gold:C.tx3,cursor:"pointer",transition:"all .18s",borderRadius:2,fontFamily:"inherit"}}>{c}</button>)}
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {[[avail,()=>setAvail(!avail),"Available only"],[verified,()=>setVerified(!verified),"Verified only"]].map(([on,tog,label])=>(
              <button key={label} onClick={tog} style={{fontSize:11,padding:"5px 13px",border:`1px solid ${on?C.bA:C.b}`,background:on?C.goldDim:"transparent",color:on?C.gold:C.tx3,cursor:"pointer",borderRadius:100,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
                {on&&<span>✓</span>}{label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap" style={{padding:"40px 48px 80px"}}>
        {loading?<div style={{display:"flex",justifyContent:"center",padding:"80px 0"}}><Spinner/></div>
        :filtered.length===0?(
          <div style={{textAlign:"center",padding:"80px 40px",border:`1px dashed ${C.b}`,borderRadius:2}}>
            <div style={{marginBottom:20,opacity:.22,display:"flex",justifyContent:"center"}}><Logo size="md"/></div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:300,color:C.white,marginBottom:10}}>{pros.length===0?"No members yet":"No results found"}</h3>
            <p style={{fontSize:14.5,color:C.tx,maxWidth:320,margin:"0 auto 26px",lineHeight:1.85}}>{pros.length===0?"Be the first to join The Voryel.":"Try adjusting your filters."}</p>
            {pros.length===0&&<Btn v="primary" onClick={()=>setPage("signup")}>Join as Professional</Btn>}
          </div>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <span style={{fontSize:14,color:C.tx}}>{filtered.length} professional{filtered.length!==1?"s":""} found</span>
              <span style={{fontSize:10,letterSpacing:"0.1em",color:C.tx3,fontWeight:500}}>CLICK A CARD TO VIEW FULL PROFILE</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}} id="pro-grid">
              {filtered.map(m=><ProCard key={m.id} member={m} onClick={()=>setViewing(m)} onMessage={onMessage} me={me}/>)}
            </div>
            <style>{`#pro-grid{grid-template-columns:repeat(3,1fr);}@media(max-width:1024px){#pro-grid{grid-template-columns:1fr 1fr;}}@media(max-width:720px){#pro-grid{grid-template-columns:1fr;}}`}</style>
          </>
        )}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EXPLORE CLIENTS
══════════════════════════════════════════════════════════════════ */
function ExploreClients({setPage,members,loading,me,onMessage}) {
  const [search,setSearch]=useState("");
  const [industry,setIndustry]=useState("All");
  const [viewing,setViewing]=useState(null);
  const clients=members.filter(m=>m.role==="client"||m.user_type==="client");
  const filtered=clients.filter(m=>{
    if(industry!=="All"&&m.industry!==industry)return false;
    const q=search.toLowerCase();
    return !q||(m.name||"").toLowerCase().includes(q)||(m.company||"").toLowerCase().includes(q)||(m.bio||"").toLowerCase().includes(q)||(m.industry||"").toLowerCase().includes(q);
  });
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:60}}>
      {viewing&&<ProfileModal member={viewing} onClose={()=>setViewing(null)} onMessage={m=>{setViewing(null);onMessage(m);}} me={me}/>}
      <div style={{background:`linear-gradient(135deg,#0A1520,${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"56px 48px 44px"}}>
        <div className="wrap">
          <div style={{fontSize:10,letterSpacing:"0.22em",color:C.blue,marginBottom:12,fontWeight:500}}>EXPLORE CLIENTS & BUSINESSES</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.6rem)",fontWeight:300,color:C.white,marginBottom:8}}>Discover <em style={{color:C.blue}}>Opportunities</em></h1>
          <Ornament/>
          <p style={{fontSize:15,color:C.tx,fontWeight:300,maxWidth:520,marginBottom:28,lineHeight:1.88}}>Browse businesses and clients looking for digital talent. View their needs, message them directly, and build valuable professional relationships.</p>
          <div style={{display:"flex",maxWidth:560,marginBottom:16,background:"rgba(253,248,242,0.03)",border:`1px solid ${C.b}`,overflow:"hidden",borderRadius:2}}>
            <input className="fb" style={{flex:1,border:"none",background:"transparent"}} placeholder="Search by company, industry, or needs…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <div style={{padding:"11px 15px",color:C.tx3,borderLeft:`1px solid ${C.b}`,fontSize:16}}>⌕</div>
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {["All",...INDUSTRIES].map(i=><button key={i} onClick={()=>setIndustry(i)} style={{fontSize:11,padding:"6px 14px",border:`1px solid ${industry===i?"rgba(106,171,204,0.5)":C.b}`,background:industry===i?"rgba(106,171,204,0.12)":"transparent",color:industry===i?C.blue:C.tx3,cursor:"pointer",transition:"all .18s",borderRadius:2,fontFamily:"inherit"}}>{i}</button>)}
          </div>
        </div>
      </div>
      <div className="wrap" style={{padding:"40px 48px 80px"}}>
        {loading?<div style={{display:"flex",justifyContent:"center",padding:"80px 0"}}><Spinner/></div>
        :filtered.length===0?(
          <div style={{textAlign:"center",padding:"80px 40px",border:`1px dashed ${C.b}`,borderRadius:2}}>
            <div style={{marginBottom:20,opacity:.22,display:"flex",justifyContent:"center"}}><Logo size="md"/></div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:300,color:C.white,marginBottom:10}}>{clients.length===0?"No clients yet":"No results found"}</h3>
            <p style={{fontSize:14.5,color:C.tx,maxWidth:320,margin:"0 auto 26px",lineHeight:1.85}}>{clients.length===0?"Be the first client to join The Voryel.":"Try adjusting your search."}</p>
            {clients.length===0&&<Btn v="primary" onClick={()=>setPage("signup")}>Join as Client</Btn>}
          </div>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <span style={{fontSize:14,color:C.tx}}>{filtered.length} client{filtered.length!==1?"s":""} found</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}} id="cli-grid">
              {filtered.map(m=><ClientCard key={m.id} member={m} onClick={()=>setViewing(m)} onMessage={onMessage} me={me}/>)}
            </div>
            <style>{`#cli-grid{grid-template-columns:repeat(3,1fr);}@media(max-width:1024px){#cli-grid{grid-template-columns:1fr 1fr;}}@media(max-width:720px){#cli-grid{grid-template-columns:1fr;}}`}</style>
          </>
        )}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COLLABORATIONS HUB
══════════════════════════════════════════════════════════════════ */
function Collaborations({setPage,me,setToast}) {
  const [collabs,setCollabs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showing,setShowing]=useState(false);
  const [form,setForm]=useState({title:"",type:"",description:"",skills_needed:"",contact_pref:""});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const h=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));

  useEffect(()=>{
    db.collabs.all().then(d=>{if(Array.isArray(d))setCollabs(d);}).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const submit=async()=>{
    if(!form.title.trim()||!form.type){setErr("Please fill in the title and type.");return;}
    if(!me){setErr("Please sign in to post a collaboration.");return;}
    setSaving(true);setErr("");
    try{
      const res=await db.collabs.insert({...form,poster_id:me.id,poster_name:me.name,poster_role:me.role||me.user_type,created_at:new Date().toISOString()});
      if(Array.isArray(res)&&res[0]){setCollabs(p=>[res[0],...p]);setShowing(false);setForm({title:"",type:"",description:"",skills_needed:"",contact_pref:""});setToast({title:"Posted!",body:"Your collaboration is now live."});}
      else setErr("Could not post. Please try again.");
    }catch(e){setErr("Connection error. Please try again.");}
    setSaving(false);
  };

  const TYPES=["Looking for co-founder","Seeking designer","Need developer","Need video editor","Creative partnership","Team building","Startup collaboration","Content collaboration","Other"];

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:60}}>
      <div style={{background:`linear-gradient(135deg,rgba(42,16,69,0.5),${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"56px 48px 44px"}}>
        <div className="wrap">
          <div style={{fontSize:10,letterSpacing:"0.22em",color:"#9B7ACC",marginBottom:12,fontWeight:500}}>COLLABORATIONS HUB</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.6rem)",fontWeight:300,color:C.white,marginBottom:8}}>Build Something <em style={{color:"#9B7ACC"}}>Together</em></h1>
          <Ornament/>
          <p style={{fontSize:15,color:C.tx,fontWeight:300,maxWidth:520,marginBottom:28,lineHeight:1.88}}>Find co-founders, creative partners, and collaborators. Post what you're looking for and connect with the right people directly.</p>
          {me&&<Btn v="primary" onClick={()=>setShowing(!showing)}>{showing?"Cancel":"+ Post a Collaboration"}</Btn>}
          {!me&&<Btn v="ghost" onClick={()=>setPage("signup")}>Join to Post</Btn>}
        </div>
      </div>
      {showing&&(
        <div className="wrap" style={{paddingTop:36,paddingBottom:0}}>
          <div style={{background:C.s1,border:`1px solid ${C.bA}`,padding:"28px",borderRadius:2,maxWidth:640}}>
            <div style={{fontSize:12,letterSpacing:"0.14em",color:C.gold,marginBottom:20,fontWeight:600}}>NEW COLLABORATION POST</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Field label="TITLE" name="title" value={form.title} onChange={h} placeholder="e.g. Seeking UI/UX designer for fintech startup" required/>
              <Field label="TYPE" name="type" type="select" value={form.type} onChange={h} options={TYPES} required/>
              <Field label="DESCRIPTION" name="description" type="textarea" value={form.description} onChange={h} placeholder="Describe what you're building and what you need…" rows={4}/>
              <Field label="SKILLS / EXPERTISE NEEDED" name="skills_needed" value={form.skills_needed} onChange={h} placeholder="e.g. React, Figma, Brand Strategy"/>
              <Field label="HOW TO CONNECT" name="contact_pref" value={form.contact_pref} onChange={h} placeholder="e.g. Message me on The Voryel / include your portfolio"/>
              {err&&<ErrBox msg={err}/>}
              <Btn v="gold" onClick={submit} disabled={saving}>{saving?"Posting…":"Post Collaboration"}</Btn>
            </div>
          </div>
        </div>
      )}
      <div className="wrap" style={{padding:"36px 48px 80px"}}>
        {loading?<div style={{display:"flex",justifyContent:"center",padding:"60px 0"}}><Spinner/></div>
        :collabs.length===0?(
          <div style={{textAlign:"center",padding:"72px 40px",border:`1px dashed ${C.b}`,borderRadius:2}}>
            <div style={{fontSize:"2rem",marginBottom:16,opacity:.4}}>🤝</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:300,color:C.white,marginBottom:10}}>No collaborations posted yet</h3>
            <p style={{fontSize:14,color:C.tx,maxWidth:320,margin:"0 auto 24px",lineHeight:1.85}}>Be the first to post a collaboration opportunity and connect with the right people.</p>
            {me?<Btn v="primary" onClick={()=>setShowing(true)}>Post a Collaboration</Btn>:<Btn v="ghost" onClick={()=>setPage("signup")}>Join to Post</Btn>}
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18}} id="collab-grid">
            {collabs.map(c=>(
              <div key={c.id} className="collab-card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:400,color:C.white,marginBottom:4}}>{c.title}</h3>
                    {c.type&&<span className="tag tag-gold">{c.type}</span>}
                  </div>
                  <span style={{fontSize:11,color:C.tx3,flexShrink:0,marginLeft:12}}>{ago(c.created_at)}</span>
                </div>
                {c.description&&<p style={{fontSize:13.5,color:C.tx,lineHeight:1.78,marginBottom:12}}>{c.description}</p>}
                {c.skills_needed&&<div style={{marginBottom:10}}><span style={{fontSize:10,color:C.gold,fontWeight:600}}>Needs: </span><span style={{fontSize:13,color:C.tx2}}>{c.skills_needed}</span></div>}
                {c.contact_pref&&<div style={{fontSize:12.5,color:C.tx3,borderTop:`1px solid ${C.b}`,paddingTop:10,marginTop:10}}><span style={{color:C.gold,fontWeight:500}}>Connect: </span>{c.contact_pref}</div>}
                <div style={{fontSize:11,color:C.tx3,marginTop:10}}>Posted by <strong style={{color:C.tx2}}>{c.poster_name}</strong></div>
              </div>
            ))}
          </div>
        )}
        <style>{`#collab-grid{grid-template-columns:repeat(2,1fr);}@media(max-width:720px){#collab-grid{grid-template-columns:1fr;}}`}</style>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   OPPORTUNITIES
══════════════════════════════════════════════════════════════════ */
function Opportunities({setPage,me,setToast}) {
  const [opps,setOpps]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showing,setShowing]=useState(false);
  const [form,setForm]=useState({title:"",category:"",description:"",budget:"",timeline:"",contact_pref:""});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const h=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));

  useEffect(()=>{
    db.opps.all().then(d=>{if(Array.isArray(d))setOpps(d);}).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const submit=async()=>{
    if(!form.title.trim()||!form.category){setErr("Please fill in the title and category.");return;}
    if(!me){setErr("Please sign in to post.");return;}
    setSaving(true);setErr("");
    try{
      const res=await db.opps.insert({...form,poster_id:me.id,poster_name:me.name,poster_company:me.company||"",created_at:new Date().toISOString()});
      if(Array.isArray(res)&&res[0]){setOpps(p=>[res[0],...p]);setShowing(false);setForm({title:"",category:"",description:"",budget:"",timeline:"",contact_pref:""});setToast({title:"Posted!",body:"Your opportunity is now live."});}
      else setErr("Could not post. Please try again.");
    }catch(e){setErr("Connection error. Please try again.");}
    setSaving(false);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:60}}>
      <div style={{background:`linear-gradient(135deg,rgba(10,46,26,0.5),${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"56px 48px 44px"}}>
        <div className="wrap">
          <div style={{fontSize:10,letterSpacing:"0.22em",color:C.green,marginBottom:12,fontWeight:500}}>OPPORTUNITIES</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.6rem)",fontWeight:300,color:C.white,marginBottom:8}}>Find Your Next <em style={{color:C.green}}>Project</em></h1>
          <Ornament/>
          <p style={{fontSize:15,color:C.tx,fontWeight:300,maxWidth:520,marginBottom:28,lineHeight:1.88}}>Browse premium project opportunities posted by businesses and clients. Professionals — find meaningful work. Clients — post your needs and connect with talent directly.</p>
          {me&&<Btn v="primary" onClick={()=>setShowing(!showing)}>{showing?"Cancel":"+ Post an Opportunity"}</Btn>}
          {!me&&<Btn v="ghost" onClick={()=>setPage("signup")}>Join to Post</Btn>}
        </div>
      </div>
      {showing&&(
        <div className="wrap" style={{paddingTop:36,paddingBottom:0}}>
          <div style={{background:C.s1,border:`1px solid ${C.bA}`,padding:"28px",borderRadius:2,maxWidth:640}}>
            <div style={{fontSize:12,letterSpacing:"0.14em",color:C.gold,marginBottom:20,fontWeight:600}}>NEW OPPORTUNITY</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Field label="TITLE" name="title" value={form.title} onChange={h} placeholder="e.g. Need UI/UX Designer for mobile app" required/>
              <Field label="CATEGORY" name="category" type="select" value={form.category} onChange={h} options={CATS} required/>
              <Field label="DESCRIPTION" name="description" type="textarea" value={form.description} onChange={h} placeholder="Describe the project, what you need, and your expectations…" rows={4}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Field label="BUDGET (optional)" name="budget" value={form.budget} onChange={h} placeholder="e.g. $500–$2000"/>
                <Field label="TIMELINE (optional)" name="timeline" value={form.timeline} onChange={h} placeholder="e.g. 2–4 weeks"/>
              </div>
              <Field label="HOW TO APPLY" name="contact_pref" value={form.contact_pref} onChange={h} placeholder="e.g. Message me on The Voryel with your portfolio"/>
              {err&&<ErrBox msg={err}/>}
              <Btn v="gold" onClick={submit} disabled={saving}>{saving?"Posting…":"Post Opportunity"}</Btn>
            </div>
          </div>
        </div>
      )}
      <div className="wrap" style={{padding:"36px 48px 80px"}}>
        {loading?<div style={{display:"flex",justifyContent:"center",padding:"60px 0"}}><Spinner/></div>
        :opps.length===0?(
          <div style={{textAlign:"center",padding:"72px 40px",border:`1px dashed ${C.b}`,borderRadius:2}}>
            <div style={{fontSize:"2rem",marginBottom:16,opacity:.4}}>🎯</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:300,color:C.white,marginBottom:10}}>No opportunities posted yet</h3>
            <p style={{fontSize:14,color:C.tx,maxWidth:320,margin:"0 auto 24px",lineHeight:1.85}}>Post a project or opportunity and connect with talented professionals.</p>
            {me?<Btn v="primary" onClick={()=>setShowing(true)}>Post an Opportunity</Btn>:<Btn v="ghost" onClick={()=>setPage("signup")}>Join to Post</Btn>}
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18}} id="opp-grid">
            {opps.map(o=>(
              <div key={o.id} className="collab-card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:400,color:C.white,marginBottom:6}}>{o.title}</h3>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {o.category&&<span className="tag tag-gold">{o.category}</span>}
                      {o.budget&&<span className="tag">{o.budget}</span>}
                      {o.timeline&&<span className="tag">{o.timeline}</span>}
                    </div>
                  </div>
                  <span style={{fontSize:11,color:C.tx3,flexShrink:0,marginLeft:12}}>{ago(o.created_at)}</span>
                </div>
                {o.description&&<p style={{fontSize:13.5,color:C.tx,lineHeight:1.78,marginBottom:12}}>{o.description}</p>}
                {o.contact_pref&&<div style={{fontSize:12.5,color:C.tx3,borderTop:`1px solid ${C.b}`,paddingTop:10,marginTop:10}}><span style={{color:C.green,fontWeight:500}}>How to apply: </span>{o.contact_pref}</div>}
                <div style={{fontSize:11,color:C.tx3,marginTop:10}}>Posted by <strong style={{color:C.tx2}}>{o.poster_company||o.poster_name}</strong></div>
              </div>
            ))}
          </div>
        )}
        <style>{`#opp-grid{grid-template-columns:repeat(2,1fr);}@media(max-width:720px){#opp-grid{grid-template-columns:1fr;}}`}</style>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MESSAGES
══════════════════════════════════════════════════════════════════ */
function Messages({me,members,setUnread,initialRecipient,setInitialRecipient}) {
  const [threads,setThreads]=useState([]);
  const [active,setActive]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [text,setText]=useState("");
  const [sending,setSending]=useState(false);
  const [loading,setLoading]=useState(true);
  const bodyRef=useRef(null);

  // Load inbox threads
  useEffect(()=>{
    if(!me) return;
    db.messages.inbox(me.id).then(all=>{
      if(!Array.isArray(all)){setLoading(false);return;}
      // Get unique conversation partners
      const seen=new Set();
      const convs=[];
      all.forEach(m=>{
        const otherId=m.sender_id===me.id?m.recipient_id:m.sender_id;
        if(!seen.has(otherId)){seen.add(otherId);const other=members.find(u=>u.id===otherId)||{id:otherId,name:"Unknown",role:"unknown"};convs.push({other,lastMsg:m});}
      });
      setThreads(convs);
      // Count unread
      const unread=all.filter(m=>m.recipient_id===me.id&&!m.read).length;
      setUnread(unread);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[me,members]);

  // Open thread with initialRecipient if set
  useEffect(()=>{
    if(initialRecipient&&me){
      openThread(initialRecipient);
      setInitialRecipient(null);
    }
  },[initialRecipient,me]);

  const openThread=useCallback(async(other)=>{
    setActive(other);setText("");
    const data=await db.messages.thread(me.id,other.id).catch(()=>[]);
    setMsgs(Array.isArray(data)?data:[]);
    // Mark as read
    db.messages.markRead(other.id,me.id).catch(()=>{});
    // Ensure thread exists
    setThreads(p=>{
      const ex=p.find(t=>t.other.id===other.id);
      return ex?p:[{other,lastMsg:null},...p];
    });
  },[me]);

  useEffect(()=>{
    if(bodyRef.current) bodyRef.current.scrollTop=bodyRef.current.scrollHeight;
  },[msgs]);

  const send=async()=>{
    if(!text.trim()||!active||sending) return;
    setSending(true);
    const msg={sender_id:me.id,recipient_id:active.id,content:text.trim(),read:false,created_at:new Date().toISOString()};
    setText("");
    try{
      const res=await db.messages.send(msg);
      const saved=Array.isArray(res)&&res[0]?res[0]:{...msg,id:Date.now()};
      setMsgs(p=>[...p,saved]);
      setThreads(p=>p.map(t=>t.other.id===active.id?{...t,lastMsg:saved}:t));
    }catch(e){console.error("[Send msg]",e);}
    setSending(false);
  };

  const onKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};

  if(!me) return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:60,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,color:C.white,marginBottom:12}}>Sign in to access messages</div>
        <p style={{fontSize:14,color:C.tx2,marginBottom:24}}>You need an account to send and receive messages.</p>
      </div>
    </div>
  );

  return (
    <div className="msg-layout">
      {/* RAIL */}
      <div className="msg-rail">
        <div className="msg-rail-top">
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:300,color:C.white,marginBottom:2}}>Messages</div>
          <div style={{fontSize:11,color:C.tx3}}>{threads.length} conversation{threads.length!==1?"s":""}</div>
        </div>
        <div className="msg-thread">
          {loading?<div style={{display:"flex",justifyContent:"center",padding:"40px 0"}}><Spinner/></div>
          :threads.length===0?(
            <div style={{padding:"40px 20px",textAlign:"center"}}>
              <div style={{fontSize:"1.5rem",opacity:.25,marginBottom:12}}>💬</div>
              <p style={{fontSize:12.5,color:C.tx3,lineHeight:1.75}}>No conversations yet.<br/>Explore the network and message someone.</p>
            </div>
          ):threads.map(t=>(
            <div key={t.other.id} className={`msg-row${active?.id===t.other.id?" on":""}`} onClick={()=>openThread(t.other)}>
              <Av name={t.other.name} size={38} photo={t.other.photo_url}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:500,color:C.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.other.name||"Unknown"}</div>
                {t.lastMsg&&<div style={{fontSize:11.5,color:C.tx3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>{t.lastMsg.content}</div>}
              </div>
              {t.lastMsg&&<div style={{fontSize:10,color:C.tx3,flexShrink:0}}>{ago(t.lastMsg.created_at)}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="msg-main">
        {!active?(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,textAlign:"center",padding:40}}>
            <div style={{opacity:.2,marginBottom:8}}><Logo size="md"/></div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:300,color:C.white}}>Select a conversation</div>
            <p style={{fontSize:13.5,color:C.tx3,maxWidth:300,lineHeight:1.78}}>Choose a conversation from the list, or browse the network to start a new one.</p>
          </div>
        ):(
          <>
            <div className="msg-main-top">
              <Av name={active.name} size={38} photo={active.photo_url}/>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:C.white}}>{active.name}</div>
                <div style={{fontSize:11,color:C.tx3}}>{active.category||active.company||"Member"}</div>
              </div>
            </div>
            <div className="msg-body" ref={bodyRef}>
              {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 0",fontSize:13,color:C.tx3}}>Start your conversation with {active.name}.</div>}
              {msgs.map((m,i)=>{
                const isMe=m.sender_id===me.id;
                return (
                  <div key={m.id||i} className={`bubble-wrap ${isMe?"me":"them"}`}>
                    <div className="bubble">{m.content}</div>
                    <div className="bubble-time">{ago(m.created_at)}</div>
                  </div>
                );
              })}
            </div>
            <div className="msg-compose">
              <textarea className="compose-inp" placeholder={`Message ${active.name}…`} value={text} onChange={e=>setText(e.target.value)} onKeyDown={onKey} rows={1}/>
              <button className="btn btn-primary btn-sm" onClick={send} disabled={!text.trim()||sending}>{sending?"…":"Send"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════════════ */
function Auth({mode,setPage,onAuth}) {
  const isLogin=mode==="login";
  const [role,setRole]=useState("freelancer");
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [agreed,setAgreed]=useState(false);
  const [d,setD]=useState({name:"",email:"",password:"",bio:"",category:"",industry:"",company:"",skillsRaw:"",toolsRaw:"",price_type:"project",starting_price:"",hourly_rate:"",price_label:"",project_needs:"",talent_interests:"",contact_methods:"",location:"",years_exp:"",website:"",social_links:"",open_to_work:true});
  const h=e=>setD(p=>({...p,[e.target.name]:e.target.value}));
  const ve=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const vp=v=>v.length>=6;

  const doLogin=async()=>{
    setErr("");
    if(!ve(d.email)){setErr("Please enter a valid email address.");return;}
    if(!d.password){setErr("Please enter your password.");return;}
    setLoading(true);
    try{
      const user=await db.profiles.byEmail(d.email);
      if(!user){setErr("No account found with that email. Please create an account.");setLoading(false);return;}
      if(user.password!==d.password){setErr("Incorrect password. Please try again.");setLoading(false);return;}
      onAuth(user);setPage("home");
    }catch(e){setErr(`Connection error: ${e.message||"Please check your internet and try again."}`);}
    setLoading(false);
  };

  const doSignup=async()=>{
    setErr("");
    if(!agreed){setErr("You must agree to the Terms of Service to create an account.");return;}
    if(!d.name.trim()){setErr("Please enter your full name.");return;}
    if(!ve(d.email)){setErr("Please enter a valid email address.");return;}
    if(!vp(d.password)){setErr("Password must be at least 6 characters.");return;}
    if(role==="freelancer"&&!d.category){setErr("Please select your primary discipline.");return;}
    if(role==="client"&&!d.industry){setErr("Please select your industry.");return;}
    setLoading(true);
    try{
      const existing=await db.profiles.byEmail(d.email);
      if(existing){setErr("An account with this email already exists. Please sign in.");setLoading(false);return;}
      const skills=d.skillsRaw.split(",").map(s=>s.trim()).filter(Boolean);
      const tools=d.toolsRaw.split(",").map(s=>s.trim()).filter(Boolean);
      const payload={
        name:d.name.trim(),email:d.email.toLowerCase().trim(),password:d.password,
        bio:d.bio.trim(),category:d.category,industry:d.industry,company:d.company.trim(),
        skills:JSON.stringify(skills),tools:JSON.stringify(tools),
        user_type:role,role,
        open_to_work:role==="freelancer"?d.open_to_work:null,
        project_needs:d.project_needs.trim(),
        talent_interests:d.talent_interests.trim(),
        contact_methods:d.contact_methods.trim(),
        location:d.location.trim(),years_exp:d.years_exp,
        website:d.website.trim(),social_links:d.social_links.trim(),
        starting_price:d.starting_price?parseFloat(d.starting_price):null,
        hourly_rate:d.hourly_rate?parseFloat(d.hourly_rate):null,
        price_type:d.price_type,price_label:d.price_label.trim()||null,
        portfolio:JSON.stringify([]),verified:false,
        joined_at:new Date().toISOString(),
      };
      const res=await db.profiles.insert(payload);
      if(Array.isArray(res)&&res[0]){onAuth(res[0]);setPage("home");}
      else{console.error("[Signup]",res);setErr("Account creation failed. All fields must be valid. If the issue persists, contact "+VMAIL);}
    }catch(e){setErr(`Error: ${e.message||"Connection issue. Please try again."}`);}
    setLoading(false);
  };

  const steps=role==="freelancer"?["Account","Profile","Rates","Finish"]:["Account","Business","Finish"];
  const next=(n,check)=>{const f=check?.();if(f){setErr(f);return;}setErr("");setStep(n);};

  return (
    <div style={{background:C.bg,minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr"}} className="auth-layout">
      {/* LEFT */}
      <div style={{background:`linear-gradient(150deg,${C.burgD} 0%,#140610 60%,${C.bg} 100%)`,padding:"52px",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(212,168,75,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,75,.04) 1px,transparent 1px)`,backgroundSize:"50px 50px"}}/>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",top:-80,left:-80,background:`radial-gradient(circle,rgba(155,34,66,0.26) 0%,transparent 70%)`,filter:"blur(55px)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <Logo size="lg"/>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.7rem",fontWeight:300,lineHeight:1.18,marginTop:40,marginBottom:22,color:C.white}}>
            {isLogin?"Welcome\nback.":"Begin your\njourney."}
          </h2>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {(isLogin?["Your network awaits","Your messages are waiting","Pick up where you left off"]
              :role==="freelancer"?["Build your professional identity","Set your own rates","Get discovered by quality clients","Message and collaborate directly","Verified badge available"]
              :["Post your project needs","Browse elite professionals","Message directly — no middlemen","Build your creative team","Free to use"]).map(f=>(
              <div key={f} style={{display:"flex",gap:10,color:C.tx,fontSize:14}}><span style={{color:C.gold,flexShrink:0}}>✦</span>{f}</div>
            ))}
          </div>
        </div>
        <p style={{position:"relative",zIndex:1,fontSize:11,color:C.tx3}}>© 2026 The Voryel · {VMAIL}</p>
      </div>

      {/* RIGHT */}
      <div style={{background:C.s1,padding:"48px 56px",display:"flex",flexDirection:"column",justifyContent:"center",overflowY:"auto"}}>
        <div style={{marginBottom:28}}><Logo size="md"/></div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.85rem",fontWeight:300,color:C.white,marginBottom:5}}>{isLogin?"Sign in":"Create your account"}</h3>
        <p style={{fontSize:14,color:C.tx2,marginBottom:22}}>{isLogin?"Welcome back to The Voryel.":"Join free — no subscription required."}</p>

        {!isLogin&&(
          <div style={{display:"flex",border:`1px solid ${C.b}`,marginBottom:20,overflow:"hidden",borderRadius:2}}>
            {[["freelancer","I'm a Professional"],["client","I'm a Client / Business"]].map(([r,l])=>(
              <button key={r} onClick={()=>{setRole(r);setStep(1);setErr("");setAgreed(false);}} style={{flex:1,padding:"10px",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",background:role===r?C.burg:"transparent",color:role===r?C.goldP:C.tx2,transition:"all .2s",fontFamily:"inherit"}}>{l}</button>
            ))}
          </div>
        )}

        {!isLogin&&(
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:20}}>
            {steps.map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",gap:7,flex:i<steps.length-1?1:"auto"}}>
                <div className={`sdot${step===i+1?" active":step>i+1?" done":" idle"}`}>{step>i+1?"✓":i+1}</div>
                <span style={{fontSize:10,color:step===i+1?C.gold:C.tx3,fontWeight:step===i+1?600:400}}>{s}</span>
                {i<steps.length-1&&<div style={{flex:1,height:1,background:C.b}}/>}
              </div>
            ))}
          </div>
        )}

        {err&&<ErrBox msg={err}/>}
        {err&&<div style={{height:12}}/>}

        {/* ── LOGIN ── */}
        {isLogin&&(
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <Field label="EMAIL" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
            <Field label="PASSWORD" name="password" type="password" value={d.password} onChange={h} placeholder="••••••••" required/>
            <Btn v="gold" full onClick={doLogin} disabled={loading}>{loading?"Signing in…":"Sign In to The Voryel"}</Btn>
            <div style={{textAlign:"center",position:"relative",margin:"4px 0"}}>
              <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:C.b}}/>
              <span style={{background:C.s1,padding:"0 12px",position:"relative",fontSize:11,color:C.tx3}}>New here?</span>
            </div>
            <Btn v="ghost" full onClick={()=>setPage("signup")}>Create an Account</Btn>
          </div>
        )}

        {/* ── PROFESSIONAL STEPS ── */}
        {!isLogin&&role==="freelancer"&&(
          <>
            {step===1&&(<div style={{display:"flex",flexDirection:"column",gap:13}}>
              <Field label="FULL NAME" name="name" value={d.name} onChange={h} placeholder="Your full name" required/>
              <Field label="EMAIL" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
              <Field label="PASSWORD" name="password" type="password" value={d.password} onChange={h} placeholder="At least 6 characters" required/>
              <Btn v="gold" full onClick={()=>next(2,()=>{if(!d.name.trim())return"Please enter your name.";if(!ve(d.email))return"Please enter a valid email.";if(!vp(d.password))return"Password needs 6+ characters.";})} disabled={loading}>Continue →</Btn>
            </div>)}

            {step===2&&(<div style={{display:"flex",flexDirection:"column",gap:13}}>
              <Field label="PRIMARY DISCIPLINE" name="category" type="select" value={d.category} onChange={h} options={CATS} required/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Field label="LOCATION (optional)" name="location" value={d.location} onChange={h} placeholder="e.g. London, UK"/>
                <Field label="YEARS OF EXPERIENCE" name="years_exp" value={d.years_exp} onChange={h} placeholder="e.g. 5"/>
              </div>
              <Field label="BIO" name="bio" type="textarea" value={d.bio} onChange={h} placeholder="Your expertise, approach, and what makes your work distinctive…" rows={3}/>
              <Field label="SKILLS (comma-separated)" name="skillsRaw" value={d.skillsRaw} onChange={h} placeholder="e.g. Figma, React, Brand Design"/>
              <Field label="TOOLS (comma-separated)" name="toolsRaw" value={d.toolsRaw} onChange={h} placeholder="e.g. Adobe Suite, VS Code"/>
              <Field label="PREFERRED CONTACT METHODS" name="contact_methods" value={d.contact_methods} onChange={h} placeholder="e.g. Message on The Voryel, WhatsApp"/>
              <Field label="PORTFOLIO / WEBSITE LINKS" name="website" value={d.website} onChange={h} placeholder="https://yourportfolio.com"/>
              <div style={{display:"flex",gap:9}}>
                <Btn v="ghost" size="sm" onClick={()=>next(1)}>Back</Btn>
                <Btn v="gold" size="sm" onClick={()=>next(3,()=>{if(!d.category)return"Please select your discipline.";})} style={{flex:1}}>Continue →</Btn>
              </div>
            </div>)}

            {step===3&&(<div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div style={{fontSize:12,fontWeight:600,color:C.gold,letterSpacing:"0.08em"}}>SET YOUR RATES</div>
              <p style={{fontSize:13,color:C.tx2,lineHeight:1.75}}>Set your pricing clearly so clients know what to expect. You control all negotiations directly.</p>
              <div>
                <div style={{fontSize:10,color:C.tx3,marginBottom:8,fontWeight:500}}>PRICING TYPE</div>
                <div style={{display:"flex",gap:7}}>
                  {[["project","Per Project"],["hourly","Hourly"],["both","Both"]].map(([v,l])=>(
                    <div key={v} onClick={()=>setD(p=>({...p,price_type:v}))} style={{flex:1,padding:"9px",border:`1px solid ${d.price_type===v?C.burg:C.b}`,cursor:"pointer",textAlign:"center",background:d.price_type===v?"rgba(155,34,66,.25)":"transparent",transition:"all .18s",borderRadius:2}}>
                      <span style={{fontSize:12,color:d.price_type===v?C.gold:C.tx2}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              {(d.price_type==="project"||d.price_type==="both")&&<Field label="STARTING PRICE (USD)" name="starting_price" type="number" value={d.starting_price} onChange={h} placeholder="e.g. 500" hint="Minimum project price displayed on your profile"/>}
              {(d.price_type==="hourly"||d.price_type==="both")&&<Field label="HOURLY RATE (USD)" name="hourly_rate" type="number" value={d.hourly_rate} onChange={h} placeholder="e.g. 75"/>}
              <Field label="CUSTOM PRICE LABEL (optional)" name="price_label" value={d.price_label} onChange={h} placeholder='e.g. "from $500" or "contact for pricing"' hint="Shown on your profile card — override the auto-generated rate"/>
              <div style={{display:"flex",gap:7}}>
                {[[true,"Available now"],[false,"Not available"]].map(([val,label])=>(
                  <div key={String(val)} onClick={()=>setD(p=>({...p,open_to_work:val}))} style={{flex:1,padding:"9px",border:`1px solid ${d.open_to_work===val?C.burg:C.b}`,cursor:"pointer",textAlign:"center",background:d.open_to_work===val?"rgba(155,34,66,.25)":"transparent",borderRadius:2}}>
                    <span style={{fontSize:12,color:d.open_to_work===val?C.gold:C.tx2}}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:9}}>
                <Btn v="ghost" size="sm" onClick={()=>next(2)}>Back</Btn>
                <Btn v="gold" size="sm" onClick={()=>next(4)} style={{flex:1}}>Continue →</Btn>
              </div>
            </div>)}

            {step===4&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:C.goldDim,border:`1px solid ${agreed?C.bA:C.b}`,padding:"16px",transition:"border-color .2s",borderRadius:2}}>
                <div style={{fontSize:11,letterSpacing:"0.14em",color:C.gold,marginBottom:10,fontWeight:600}}>TERMS OF SERVICE — REQUIRED</div>
                <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
                  <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:4,accentColor:C.burg,flexShrink:0,width:14,height:14}}/>
                  <p style={{fontSize:13.5,color:C.tx,lineHeight:1.65}}>
                    I have read and agree to The Voryel's{" "}
                    <span style={{color:C.gold,cursor:"pointer",textDecoration:"underline"}} onClick={()=>window.open("#terms","_blank")}>Terms of Service</span>{" "}and{" "}
                    <span style={{color:C.gold,cursor:"pointer",textDecoration:"underline"}}>Privacy Policy</span>.
                    I understand The Voryel does not process payments or handle transactions between users.
                  </p>
                </div>
              </div>
              {!agreed&&<p style={{fontSize:13,color:"rgba(220,90,90,.85)",fontStyle:"italic"}}>You must agree to the Terms of Service to create your account.</p>}
              <div style={{display:"flex",gap:9}}>
                <Btn v="ghost" size="sm" onClick={()=>next(3)}>Back</Btn>
                <Btn v="gold" size="sm" onClick={doSignup} disabled={loading||!agreed} style={{flex:1}}>{loading?"Creating account…":"Create My Profile →"}</Btn>
              </div>
              <div style={{textAlign:"center",fontSize:12,color:C.tx3}}>Already a member? <span style={{color:C.gold,cursor:"pointer"}} onClick={()=>setPage("login")}>Sign in</span></div>
            </div>)}
          </>
        )}

        {/* ── CLIENT STEPS ── */}
        {!isLogin&&role==="client"&&(
          <>
            {step===1&&(<div style={{display:"flex",flexDirection:"column",gap:13}}>
              <Field label="YOUR NAME" name="name" value={d.name} onChange={h} placeholder="Your full name" required/>
              <Field label="EMAIL" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
              <Field label="PASSWORD" name="password" type="password" value={d.password} onChange={h} placeholder="At least 6 characters" required/>
              <Btn v="gold" full onClick={()=>next(2,()=>{if(!d.name.trim())return"Please enter your name.";if(!ve(d.email))return"Please enter a valid email.";if(!vp(d.password))return"Password needs 6+ characters.";})} disabled={loading}>Continue →</Btn>
            </div>)}

            {step===2&&(<div style={{display:"flex",flexDirection:"column",gap:13}}>
              <Field label="COMPANY / BRAND NAME (optional)" name="company" value={d.company} onChange={h} placeholder="Your company or brand"/>
              <Field label="INDUSTRY" name="industry" type="select" value={d.industry} onChange={h} options={INDUSTRIES} required/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Field label="LOCATION (optional)" name="location" value={d.location} onChange={h} placeholder="e.g. New York, USA"/>
                <Field label="WEBSITE (optional)" name="website" value={d.website} onChange={h} placeholder="https://yourbrand.com"/>
              </div>
              <Field label="ABOUT YOUR BUSINESS" name="bio" type="textarea" value={d.bio} onChange={h} placeholder="Describe your brand, mission, and what you do…" rows={3}/>
              <Field label="PROJECT NEEDS" name="project_needs" type="textarea" value={d.project_needs} onChange={h} placeholder="What kind of digital work are you looking to commission?" rows={3}/>
              <Field label="TALENT YOU'RE LOOKING FOR" name="talent_interests" value={d.talent_interests} onChange={h} placeholder="e.g. UI/UX Designer, Frontend Developer, Brand Designer"/>
              <div style={{display:"flex",gap:9}}>
                <Btn v="ghost" size="sm" onClick={()=>next(1)}>Back</Btn>
                <Btn v="gold" size="sm" onClick={()=>next(3,()=>{if(!d.industry)return"Please select your industry.";})} style={{flex:1}}>Continue →</Btn>
              </div>
            </div>)}

            {step===3&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:C.goldDim,border:`1px solid ${agreed?C.bA:C.b}`,padding:"16px",transition:"border-color .2s",borderRadius:2}}>
                <div style={{fontSize:11,letterSpacing:"0.14em",color:C.gold,marginBottom:10,fontWeight:600}}>TERMS OF SERVICE — REQUIRED</div>
                <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
                  <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:4,accentColor:C.burg,flexShrink:0,width:14,height:14}}/>
                  <p style={{fontSize:13.5,color:C.tx,lineHeight:1.65}}>
                    I have read and agree to The Voryel's{" "}
                    <span style={{color:C.gold,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("terms")}>Terms of Service</span>{" "}and{" "}
                    <span style={{color:C.gold,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("privacy")}>Privacy Policy</span>.
                    I understand all agreements and negotiations happen directly between users.
                  </p>
                </div>
              </div>
              {!agreed&&<p style={{fontSize:13,color:"rgba(220,90,90,.85)",fontStyle:"italic"}}>You must agree to proceed.</p>}
              <div style={{display:"flex",gap:9}}>
                <Btn v="ghost" size="sm" onClick={()=>next(2)}>Back</Btn>
                <Btn v="gold" size="sm" onClick={doSignup} disabled={loading||!agreed} style={{flex:1}}>{loading?"Creating…":"Join as Client →"}</Btn>
              </div>
              <div style={{textAlign:"center",fontSize:12,color:C.tx3}}>Already a member? <span style={{color:C.gold,cursor:"pointer"}} onClick={()=>setPage("login")}>Sign in</span></div>
            </div>)}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════ */
function Dashboard({user,setPage,onUpdate,onMessage,members}) {
  const [tab,setTab]=useState("profile");
  const [editing,setEditing]=useState(false);
  const [saving,setSaving]=useState(false);
  const [saveErr,setSaveErr]=useState("");
  const isFreelancer=user.role==="freelancer"||user.user_type==="freelancer";
  const [form,setForm]=useState({bio:user.bio||"",category:user.category||"",industry:user.industry||"",company:user.company||"",skillsRaw:parseSkills(user.skills).join(", "),toolsRaw:parseSkills(user.tools).join(", "),starting_price:user.starting_price||"",hourly_rate:user.hourly_rate||"",price_type:user.price_type||"project",price_label:user.price_label||"",open_to_work:user.open_to_work!==false,location:user.location||"",years_exp:user.years_exp||"",website:user.website||"",social_links:user.social_links||"",contact_methods:user.contact_methods||"",project_needs:user.project_needs||"",talent_interests:user.talent_interests||""});
  const fh=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));
  const [portfolio,setPortfolio]=useState(()=>parseJ(user.portfolio,[]));
  const [portForm,setPortForm]=useState({title:"",desc:"",url:""});
  const [addingPort,setAddingPort]=useState(false);
  const [portSaving,setPortSaving]=useState(false);

  const addPort=async()=>{
    if(!portForm.title.trim())return;
    setPortSaving(true);
    try{
      const updated=[...portfolio,{...portForm,added:new Date().toISOString()}];
      const res=await db.profiles.update(user.id,{portfolio:JSON.stringify(updated)});
      if(Array.isArray(res)&&res[0]){setPortfolio(updated);onUpdate(res[0]);setPortForm({title:"",desc:"",url:""});setAddingPort(false);}
    }catch(e){console.error("[Portfolio]",e);}
    setPortSaving(false);
  };

  const removePort=async(i)=>{
    try{const updated=portfolio.filter((_,idx)=>idx!==i);const res=await db.profiles.update(user.id,{portfolio:JSON.stringify(updated)});if(Array.isArray(res)&&res[0]){setPortfolio(updated);onUpdate(res[0]);}}catch(e){}
  };

  const save=async()=>{
    setSaving(true);setSaveErr("");
    try{
      const skills=form.skillsRaw.split(",").map(s=>s.trim()).filter(Boolean);
      const tools=form.toolsRaw.split(",").map(s=>s.trim()).filter(Boolean);
      const res=await db.profiles.update(user.id,{bio:form.bio,category:form.category,industry:form.industry,company:form.company,skills:JSON.stringify(skills),tools:JSON.stringify(tools),starting_price:form.starting_price?parseFloat(form.starting_price):null,hourly_rate:form.hourly_rate?parseFloat(form.hourly_rate):null,price_type:form.price_type,price_label:form.price_label||null,open_to_work:form.open_to_work,location:form.location,years_exp:form.years_exp,website:form.website,social_links:form.social_links,contact_methods:form.contact_methods,project_needs:form.project_needs,talent_interests:form.talent_interests});
      if(Array.isArray(res)&&res[0]){onUpdate(res[0]);setEditing(false);}
      else setSaveErr("Could not save. Please try again.");
    }catch(e){setSaveErr("Connection error. Please try again.");}
    setSaving(false);
  };

  const skills=parseSkills(user.skills);
  const rate=user.price_label||(user.starting_price?`from $${user.starting_price}`:user.hourly_rate?`$${user.hourly_rate}/hr`:null);
  const tabs=isFreelancer?["profile","portfolio","rates"]:["profile","needs"];

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:60}}>
      <div style={{height:180,background:`linear-gradient(120deg,${C.burgD} 0%,#1A0A12 40%,${C.bg} 100%)`,borderBottom:`1px solid ${C.b}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 28px,rgba(212,168,75,0.04) 28px,rgba(212,168,75,0.04) 29px)"}}/>
      </div>
      <div className="wrap" style={{paddingTop:0,paddingBottom:80}}>
        <div style={{display:"flex",gap:22,alignItems:"flex-end",marginTop:-46,marginBottom:36,flexWrap:"wrap"}}>
          <Av name={user.name} size={92} photo={user.photo_url}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:5}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.85rem",fontWeight:300,color:C.white}}>{user.name}</span>
              {user.verified&&<VerifiedBadge/>}
              <span style={{fontSize:10,letterSpacing:"0.1em",fontWeight:600,padding:"3px 10px",borderRadius:2,...(isFreelancer?{background:"rgba(155,34,66,.3)",border:`1px solid ${C.burg}`,color:C.gold}:{background:"rgba(26,58,106,.25)",border:"1px solid rgba(26,58,106,.5)",color:C.blue})}}>{isFreelancer?"PROFESSIONAL":"CLIENT"}</span>
              {rate&&isFreelancer&&<span style={{fontSize:10,color:C.gold,background:C.goldDim,border:`1px solid ${C.b}`,padding:"3px 10px",borderRadius:2}}>{rate}</span>}
            </div>
            <div style={{fontSize:12,color:C.gold,fontWeight:500}}>{user.category||user.company||user.industry||""}</div>
            {user.location&&<div style={{fontSize:12,color:C.tx3,marginTop:3}}>📍 {user.location}</div>}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn v="ghost" size="sm" onClick={()=>{setEditing(!editing);setSaveErr("");}}>{editing?"Cancel":"Edit Profile"}</Btn>
            <Btn v="outline" size="sm" onClick={()=>setPage(isFreelancer?"explore-clients":"explore-pro")}>{isFreelancer?"Browse Clients":"Browse Professionals"}</Btn>
          </div>
        </div>

        <div style={{borderBottom:`1px solid ${C.b}`,marginBottom:36,display:"flex"}}>
          {tabs.map(t=><button key={t} className={`tab-btn${tab===t?" on":""}`} onClick={()=>{setTab(t);setEditing(false);setSaveErr("");}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"2fr 280px",gap:28}} id="dash-grid">
          <div>
            {saveErr&&<><ErrBox msg={saveErr}/><div style={{height:14}}/></>}

            {/* PROFILE */}
            {tab==="profile"&&!editing&&(
              <div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:C.white,marginBottom:14}}>About</h3>
                <p style={{fontSize:14.5,color:user.bio?C.tx:C.tx3,lineHeight:1.88,marginBottom:22,fontStyle:user.bio?"normal":"italic"}}>{user.bio||"No bio yet — click Edit Profile to add one."}</p>
                {isFreelancer&&user.years_exp&&<div style={{fontSize:13.5,color:C.tx,marginBottom:16}}><span style={{color:C.gold,fontWeight:500}}>Experience: </span>{user.years_exp} {parseInt(user.years_exp)===1?"year":"years"}</div>}
                {isFreelancer&&skills.length>0&&(<><h4 style={{fontSize:12,fontWeight:600,color:C.white,marginBottom:10,letterSpacing:"0.08em"}}>SKILLS</h4><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>{skills.map(s=><span key={s} className="tag">{s}</span>)}</div></>)}
                {user.contact_methods&&<div style={{fontSize:13.5,color:C.tx,marginBottom:10}}><span style={{color:C.gold,fontWeight:500}}>Contact: </span>{user.contact_methods}</div>}
                {user.website&&<div style={{fontSize:13.5,marginBottom:6}}><span style={{color:C.gold,fontWeight:500}}>Website: </span><a href={user.website} target="_blank" rel="noreferrer" style={{color:C.blue}}>{user.website}</a></div>}
              </div>
            )}
            {tab==="profile"&&editing&&(
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Field label="BIO" name="bio" type="textarea" value={form.bio} onChange={fh} placeholder="Tell people about yourself…" rows={4}/>
                {isFreelancer&&<><Field label="DISCIPLINE" name="category" type="select" value={form.category} onChange={fh} options={CATS}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="LOCATION" name="location" value={form.location} onChange={fh} placeholder="City, Country"/><Field label="YEARS EXPERIENCE" name="years_exp" value={form.years_exp} onChange={fh} placeholder="e.g. 5"/></div><Field label="SKILLS" name="skillsRaw" value={form.skillsRaw} onChange={fh} placeholder="e.g. Figma, React"/><Field label="TOOLS" name="toolsRaw" value={form.toolsRaw} onChange={fh} placeholder="e.g. Adobe Suite"/><Field label="PREFERRED CONTACT" name="contact_methods" value={form.contact_methods} onChange={fh} placeholder="e.g. Message on The Voryel"/><Field label="WEBSITE / PORTFOLIO" name="website" value={form.website} onChange={fh} placeholder="https://…"/><Field label="SOCIAL LINKS" name="social_links" value={form.social_links} onChange={fh} placeholder="LinkedIn, Instagram, etc."/></>}
                {!isFreelancer&&<><Field label="COMPANY / BRAND" name="company" value={form.company} onChange={fh} placeholder="Your company name"/><Field label="INDUSTRY" name="industry" type="select" value={form.industry} onChange={fh} options={INDUSTRIES}/><Field label="LOCATION" name="location" value={form.location} onChange={fh} placeholder="City, Country"/><Field label="WEBSITE" name="website" value={form.website} onChange={fh} placeholder="https://…"/></>}
                <Btn v="gold" onClick={save} disabled={saving}>{saving?"Saving…":"Save Changes"}</Btn>
              </div>
            )}

            {/* PORTFOLIO */}
            {tab==="portfolio"&&isFreelancer&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:C.white}}>Portfolio</h3>
                  <Btn v="outline" size="sm" onClick={()=>setAddingPort(!addingPort)}>{addingPort?"Cancel":"+ Add Work"}</Btn>
                </div>
                {addingPort&&(
                  <div style={{background:C.s2,border:`1px solid ${C.bA}`,padding:"20px",marginBottom:18,borderRadius:2}}>
                    <div style={{fontSize:11,letterSpacing:"0.14em",color:C.gold,marginBottom:16,fontWeight:600}}>NEW PORTFOLIO ITEM</div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      <Field label="PROJECT TITLE" name="title" value={portForm.title} onChange={e=>setPortForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Brand identity for Noir Studio"/>
                      <Field label="LINK / URL (optional)" name="url" value={portForm.url} onChange={e=>setPortForm(p=>({...p,url:e.target.value}))} placeholder="https://…"/>
                      <Field label="DESCRIPTION" name="desc" type="textarea" value={portForm.desc} onChange={e=>setPortForm(p=>({...p,desc:e.target.value}))} placeholder="Describe the project and your role…" rows={3}/>
                      <Btn v="gold" size="sm" onClick={addPort} disabled={!portForm.title.trim()||portSaving}>{portSaving?"Saving…":"Save Work Item"}</Btn>
                    </div>
                  </div>
                )}
                {portfolio.length===0&&!addingPort?(
                  <div style={{textAlign:"center",padding:"48px 28px",border:`1px dashed ${C.b}`,borderRadius:2}}>
                    <p style={{fontSize:14.5,color:C.tx3,lineHeight:1.85}}>No portfolio items yet.<br/><em style={{color:C.gold}}>Click '+ Add Work' to showcase your projects.</em></p>
                  </div>
                ):(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {portfolio.map((item,i)=>(
                      <div key={i} style={{aspectRatio:"4/3",background:C.s2,border:`1px solid ${C.b}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,position:"relative",overflow:"hidden",borderRadius:2}}>
                        <button onClick={()=>removePort(i)} style={{position:"absolute",top:7,right:7,background:"rgba(155,34,66,.5)",border:"none",color:C.gold,width:20,height:20,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:2}}>✕</button>
                        <div style={{fontSize:"1.2rem",color:C.gold,marginBottom:8}}>◈</div>
                        <div style={{fontSize:12,fontWeight:600,color:C.white,textAlign:"center",marginBottom:4}}>{item.title}</div>
                        {item.url&&<a href={item.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:C.blue,textDecoration:"underline",marginBottom:4}}>View →</a>}
                        {item.desc&&<p style={{fontSize:11,color:C.tx2,textAlign:"center",lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.desc}</p>}
                      </div>
                    ))}
                    <div style={{aspectRatio:"4/3",background:C.s2,border:`1px dashed ${C.b}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:2,transition:"border-color .2s"}} onClick={()=>setAddingPort(true)} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bA} onMouseLeave={e=>e.currentTarget.style.borderColor=C.b}>
                      <div style={{fontSize:"1.6rem",color:C.tx3}}>+</div>
                      <span style={{fontSize:11,color:C.tx3,marginTop:6}}>Add Work</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RATES */}
            {tab==="rates"&&isFreelancer&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:C.white}}>Your Rates</h3>
                  <Btn v="ghost" size="sm" onClick={()=>{setEditing(!editing);setSaveErr("");}}>{editing?"Cancel":"Edit Rates"}</Btn>
                </div>
                {!editing?(
                  <div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"22px",borderRadius:2}}>
                    {[["Pricing Type",user.price_type||"—"],["Starting Price",user.starting_price?`$${user.starting_price}`:"—"],["Hourly Rate",user.hourly_rate?`$${user.hourly_rate}/hr`:"—"],["Profile Label",user.price_label||"—"]].map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.b}`,fontSize:13.5}}>
                        <span style={{color:C.tx3}}>{l}</span><span style={{color:C.gold}}>{v}</span>
                      </div>
                    ))}
                    <p style={{fontSize:12.5,color:C.tx3,marginTop:14,lineHeight:1.75}}>All pricing negotiations happen directly with clients via messaging. The Voryel does not process or handle any payments.</p>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:13}}>
                    <div>
                      <div style={{fontSize:10,color:C.tx3,marginBottom:8,fontWeight:500}}>PRICING TYPE</div>
                      <div style={{display:"flex",gap:7}}>
                        {[["project","Per Project"],["hourly","Hourly"],["both","Both"]].map(([v,l])=>(
                          <div key={v} onClick={()=>setForm(p=>({...p,price_type:v}))} style={{flex:1,padding:"9px",border:`1px solid ${form.price_type===v?C.burg:C.b}`,cursor:"pointer",textAlign:"center",background:form.price_type===v?"rgba(155,34,66,.25)":"transparent",borderRadius:2}}>
                            <span style={{fontSize:12,color:form.price_type===v?C.gold:C.tx2}}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {(form.price_type==="project"||form.price_type==="both")&&<Field label="STARTING PRICE (USD)" name="starting_price" type="number" value={form.starting_price} onChange={fh} placeholder="e.g. 500"/>}
                    {(form.price_type==="hourly"||form.price_type==="both")&&<Field label="HOURLY RATE (USD)" name="hourly_rate" type="number" value={form.hourly_rate} onChange={fh} placeholder="e.g. 75"/>}
                    <Field label="CUSTOM LABEL" name="price_label" value={form.price_label} onChange={fh} placeholder='e.g. "from $500"'/>
                    <Btn v="gold" onClick={save} disabled={saving}>{saving?"Saving…":"Update Rates"}</Btn>
                  </div>
                )}
              </div>
            )}

            {/* NEEDS (client) */}
            {tab==="needs"&&!isFreelancer&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:C.white}}>Project Needs</h3>
                  <Btn v="ghost" size="sm" onClick={()=>{setEditing(!editing);setSaveErr("");}}>{editing?"Cancel":"Edit"}</Btn>
                </div>
                {!editing?(<>
                  <p style={{fontSize:14.5,color:user.project_needs?C.tx:C.tx3,lineHeight:1.88,marginBottom:16,fontStyle:user.project_needs?"normal":"italic"}}>{user.project_needs||"No project needs added yet."}</p>
                  {user.talent_interests&&<div style={{fontSize:13.5,color:C.tx,marginTop:8}}><span style={{color:C.gold,fontWeight:500}}>Looking for: </span>{user.talent_interests}</div>}
                </>):(
                  <div style={{display:"flex",flexDirection:"column",gap:13}}>
                    <Field label="PROJECT NEEDS" name="project_needs" type="textarea" value={form.project_needs} onChange={fh} placeholder="What kind of digital work are you looking for?" rows={4}/>
                    <Field label="TALENT INTERESTS" name="talent_interests" value={form.talent_interests} onChange={fh} placeholder="e.g. UI/UX Designer, Frontend Developer"/>
                    <Btn v="gold" onClick={save} disabled={saving}>{saving?"Saving…":"Save"}</Btn>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"18px",borderRadius:2}}>
              <div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:12,fontWeight:600}}>ACCOUNT</div>
              {[["Email",user.email],["Member Since",new Date(user.joined_at||Date.now()).getFullYear()],["Role",isFreelancer?"Professional":"Client / Business"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.b}`,fontSize:13}}>
                  <span style={{color:C.tx3}}>{l}</span><span style={{color:C.tx,wordBreak:"break-all",textAlign:"right",maxWidth:150,fontSize:12}}>{v}</span>
                </div>
              ))}
            </div>
            {isFreelancer&&(
              <div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"18px",borderRadius:2}}>
                <div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:10,fontWeight:600}}>AVAILABILITY</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:form.open_to_work?"#5CAA8A":"#888",boxShadow:form.open_to_work?"0 0 6px rgba(92,170,138,0.4)":"none"}}/>
                  <span style={{fontSize:13,color:C.tx}}>{form.open_to_work?"Available for projects":"Not available right now"}</span>
                </div>
              </div>
            )}
            <div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"18px",borderRadius:2}}>
              <div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:10,fontWeight:600}}>VORYEL VERIFIED</div>
              {user.verified?<VerifiedBadge/>:<>
                <p style={{fontSize:12.5,color:C.tx2,lineHeight:1.75,marginBottom:10}}>Apply for manual review to earn your Verified badge. Pricing coming soon.</p>
                <span style={{fontSize:10,fontWeight:600,padding:"3px 10px",background:C.goldDim,border:`1px solid ${C.b}`,color:C.gold,borderRadius:2}}>Coming Soon</span>
              </>}
            </div>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"18px",borderRadius:2}}>
              <div style={{fontSize:10,letterSpacing:"0.16em",color:C.gold,marginBottom:10,fontWeight:600}}>QUICK ACTIONS</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <Btn v="primary" size="sm" full onClick={()=>setPage("messages")}>View Messages</Btn>
                <Btn v="ghost" size="sm" full onClick={()=>setPage(isFreelancer?"explore-clients":"explore-pro")}>{isFreelancer?"Browse Clients":"Browse Professionals"}</Btn>
                <Btn v="ghost" size="sm" full onClick={()=>setPage("opportunities")}>{isFreelancer?"Find Opportunities":"Post Opportunity"}</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`#dash-grid{grid-template-columns:2fr 280px;}@media(max-width:720px){#dash-grid{grid-template-columns:1fr;}}`}</style>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TERMS OF SERVICE
══════════════════════════════════════════════════════════════════ */
function Terms({setPage}) {
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:60}}>
      <div style={{background:`linear-gradient(135deg,${C.burgD},${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"60px 48px 48px",textAlign:"center"}}>
        <div style={{fontSize:10,letterSpacing:"0.22em",color:C.gold,marginBottom:12,fontWeight:500}}>LEGAL</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.6rem)",fontWeight:300,color:C.white,marginBottom:8}}>Terms of Service</h1>
        <Ornament/>
        <p style={{fontSize:12,letterSpacing:"0.1em",color:C.tx3,fontWeight:500}}>LAST UPDATED: JANUARY 2026 · VERSION 3.0</p>
      </div>
      <div className="wrap-sm" style={{paddingTop:52,paddingBottom:80}}>
        {[
          ["1. Introduction","Welcome to The Voryel — a premium global digital network operated by Adetunji Ewaoluwa Destiny. By creating an account or using The Voryel in any capacity, you confirm that you have read, understood, and agreed to these Terms in full."],
          ["2. What The Voryel Is","The Voryel is a professional networking platform. It provides infrastructure for digital professionals and clients to discover each other, build profiles, communicate directly, and explore collaboration opportunities. The Voryel is not a marketplace, agency, freelance platform, or payment processor."],
          ["3. No Transaction Processing","The Voryel does not process, hold, facilitate, or mediate any financial transactions between users. All pricing, payment terms, contracts, and financial agreements are made exclusively and directly between the Client and the Professional. The Voryel is not a party to any such agreement and accepts no liability for the outcomes of user-to-user arrangements."],
          ["4. User Responsibilities","Users are fully responsible for all agreements they enter into with other members. This includes project scope, pricing, delivery, payment terms, and dispute resolution. The Voryel does not guarantee results, income, project completion, or professional quality. Users must conduct their own due diligence before engaging in any collaboration."],
          ["5. Verified Badge","The Voryel Verified badge is awarded by The Voryel team following a manual review process. A subscription fee provides access to the review process only — it does not guarantee badge approval. The Voryel reserves the right to grant, withhold, or revoke the badge at any time based on quality, conduct, or rule violations. Refunds for review subscriptions are not guaranteed."],
          ["6. User Conduct","All users must behave professionally and respectfully. Prohibited conduct includes: creating false or misleading profiles; harassment or abusive communication; submitting fake reviews or ratings; using the platform for illegal activity; spamming or unsolicited bulk messaging; impersonating others; misrepresenting skills, experience, or credentials."],
          ["7. Content & Intellectual Property","Users retain full ownership of all original content they create and upload. By uploading content, you grant The Voryel a limited, non-exclusive licence to display it for Platform operation. Intellectual property for project deliverables is governed exclusively by the agreement between the relevant Client and Professional."],
          ["8. Account Suspension & Termination","The Voryel may suspend or terminate accounts that violate these Terms, with or without prior notice. The Voryel reserves the right to remove content or users that compromise the quality, safety, or integrity of the network."],
          ["9. Platform Changes","The Voryel may update, modify, or discontinue features at any time. Future monetization features, pricing, and premium services will be communicated to users in advance. Continued use of the Platform following updates constitutes acceptance of the revised Terms."],
          ["10. Limitation of Liability","To the fullest extent permitted by law, The Voryel shall not be liable for any direct, indirect, incidental, or consequential damages arising from: user-to-user disputes; failed or incomplete project arrangements; financial losses from collaborations; inaccurate us
           style={{fontSize:14,color:C.tx,lineHeight:1.85,fontWeight:300}}>We'll respond within 48 hours.</p>
              <div style={{marginTop:18}}><Btn v="ghost" size="sm" onClick={()=>setSent(false)}>Send Another</Btn></div>
            </div>
          ):(
            <>
              <div style={{fontSize:12,letterSpacing:"0.14em",color:C.gold,marginBottom:18,fontWeight:600}}>SEND A MESSAGE</div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <Field label="NAME" name="name" value={f.name} onChange={fh} placeholder="Your name"/>
                  <Field label="EMAIL" name="email" type="email" value={f.email} onChange={fh} placeholder="your@email.com"/>
                </div>
                <Field label="SUBJECT" name="subject" type="select" value={f.subject} onChange={fh} options={["Support / Bug Report","Partnership Inquiry","Sponsorship / Advertising","Press / Media","Privacy Request","Other Business Inquiry"]}/>
                <Field label="MESSAGE" name="message" type="textarea" value={f.message} onChange={fh} placeholder="How can we help?" rows={5}/>
                <Btn v="gold" full onClick={()=>ok&&setSent(true)} disabled={!ok}>Send Message</Btn>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`#contact-grid{grid-template-columns:1fr 1fr;}@media(max-width:720px){#contact-grid{grid-template-columns:1fr;}}`}</style>
      <Footer setPage={setPage}/>
    </div>
  );
}

export default function TheVoryel() {
  const [page,setPage]=useState("home");
  const [members,setMembers]=useState([]);
  const [me,setMe]=useState(null);
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);
  const [unread,setUnread]=useState(0);
  const [initialRecipient,setInitialRecipient]=useState(null);

  useEffect(()=>{ injectSEO(); },[]);

  useEffect(()=>{
    db.profiles.all().then(d=>{if(Array.isArray(d))setMembers(d);}).catch(e=>console.error("[Load]",e)).finally(()=>setLoading(false));
  },[]);

  useEffect(()=>{try{window.scrollTo({top:0,behavior:"instant"});}catch(e){};},[page]);

  const onAuth=u=>{
    setMembers(p=>{const ex=p.find(x=>x.id===u.id);return ex?p.map(x=>x.id===u.id?u:x):[u,...p];});
    setMe(u);
    setToast({title:"Welcome to The Voryel",body:`Signed in as ${u.name}`});
  };

  const onLogout=()=>{ setMe(null); setPage("home"); setUnread(0); };

  const onUpdate=u=>{
    setMembers(p=>p.map(x=>x.id===u.id?u:x));
    setMe(p=>p?.id===u.id?u:p);
  };

  const onMessage=member=>{
    if(!me){ setPage("signup"); return; }
    setInitialRecipient(member);
    setPage("messages");
  };

  const noNav=["login","signup"].includes(page);
  const msgProps={me,members,setUnread,initialRecipient,setInitialRecipient};
  const commonProps={setPage,members,loading,me,onMessage};

  return (
    <div style={{background:C.bg,color:C.white,minHeight:"100vh"}}>
      <style>{CSS}</style>
      {!noNav&&<Nav page={page} setPage={setPage} user={me} onLogout={onLogout} unreadCount={unread}/>}
      {page==="home"            &&<Home {...commonProps}/>}
      {page==="explore-pro"     &&<ExplorePro {...commonProps}/>}
      {page==="explore-clients" &&<ExploreClients {...commonProps}/>}
      {page==="collaborations"  &&<Collaborations setPage={setPage} me={me} setToast={setToast}/>}
      {page==="opportunities"   &&<Opportunities setPage={setPage} me={me} setToast={setToast}/>}
      {page==="messages"        &&<Messages {...msgProps}/>}
      {page==="dashboard"       &&me&&<Dashboard user={me} setPage={setPage} onUpdate={onUpdate} onMessage={onMessage} members={members}/>}
      {page==="dashboard"       &&!me&&(()=>{setTimeout(()=>setPage("login"),0);return null;})()}
      {page==="terms"           &&<Terms setPage={setPage}/>}
      {page==="privacy"         &&<Privacy setPage={setPage}/>}
      {page==="contact"         &&<Contact setPage={setPage}/>}
      {page==="login"           &&<Auth mode="login" setPage={setPage} onAuth={onAuth}/>}
      {page==="signup"          &&<Auth mode="signup" setPage={setPage} onAuth={onAuth}/>}
      {toast&&<Toast title={toast.title} body={toast.body} type={toast.type||"success"} onDone={()=>setToast(null)}/>}
    </div>
  );
           }
    
