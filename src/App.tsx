// @ts-nocheck
import { useState, useEffect, useRef } from "react";

/* ─── SUPABASE ─────────────────────────────────────────────────── */
const SB = "https://zafvajcnwyzjumyklyni.supabase.co";
const SK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZnZhamNud3l6anVteWtseW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDkxMTEsImV4cCI6MjA5Mjc4NTExMX0.CIRzRcbf95yGerwDz6aiLz-s2fXXDnMfhfMaETm0A3s";
const H = { apikey:SK, Authorization:`Bearer ${SK}`, "Content-Type":"application/json" };
const q = async(path,o={}) => {
  const r = await fetch(`${SB}/rest/v1/${path}`,{headers:{...H,...(o.headers||{})}, ...o});
  if(!r.ok){const t=await r.text();throw new Error(`DB ${r.status}: ${t}`);}
  return r.headers.get("content-type")?.includes("json") ? r.json() : [];
};
const db = {
  profiles: {
    all: ()=>q("profiles?select=*&order=joined_at.desc"),
    byEmail: e=>q(`profiles?email=eq.${encodeURIComponent(e.trim().toLowerCase())}&select=*`).then(d=>d[0]||null),
    insert: d=>q("profiles",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(d)}),
    update: (id,d)=>q(`profiles?id=eq.${id}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(d)}),
  },
  messages: {
    thread: (a,b)=>q(`messages?or=(and(sender_id.eq.${a},recipient_id.eq.${b}),and(sender_id.eq.${b},recipient_id.eq.${a}))&order=created_at.asc&select=*`),
    inbox: id=>q(`messages?or=(sender_id.eq.${id},recipient_id.eq.${id})&order=created_at.desc&select=*`),
    send: d=>q("messages",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(d)}),
    read: (s,r)=>q(`messages?sender_id=eq.${s}&recipient_id=eq.${r}&read=eq.false`,{method:"PATCH",body:JSON.stringify({read:true})}),
  },
  posts: {
    all: t=>q(`posts?type=eq.${t}&order=created_at.desc&select=*`),
    insert: d=>q("posts",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(d)}),
  },
};

/* ─── SEO ──────────────────────────────────────────────────────── */
const seo = () => {
  document.title = "The Voryel | Premium Digital Network";
  const m=(n,c,p)=>{let e=document.querySelector(p?`meta[property="${n}"]`:`meta[name="${n}"]`)||document.createElement("meta");e.setAttribute(p?"property":"name",n);e.setAttribute("content",c);document.head.appendChild(e);};
  m("description","A premium global network connecting digital professionals and clients.");
  m("og:title","The Voryel | Premium Digital Network",true);
  m("og:description","Connect, collaborate, and grow with elite digital professionals worldwide.",true);
  m("og:type","website",true);
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%230B0B0B'/><text x='16' y='22' text-anchor='middle' font-family='serif' font-size='18' font-weight='bold' fill='%23D4AF37'>TV</text></svg>`;
  let l=document.querySelector('link[rel="icon"]')||document.createElement("link");
  l.rel="icon";l.type="image/svg+xml";l.href=`data:image/svg+xml,${svg}`;document.head.appendChild(l);
};

/* ─── CONSTANTS ────────────────────────────────────────────────── */
const VMAIL = "thevoryel@gmail.com";
const CATS = ["Web Development","Web Design","Graphic Design","Video Editing","UI/UX Design","Programming","Data Analysis"];
const C = {
  bg:"#0B0B0B", s1:"#130609", s2:"#1E0C12", s3:"#2A1018",
  burg:"#800020", burgL:"#A0192E", gold:"#D4AF37", goldL:"#E8C84A", goldD:"rgba(212,175,55,0.12)",
  white:"#FFFFFF", tx:"#E8DDD0", tx2:"#A89070", tx3:"#6A5040",
  b:"rgba(212,175,55,0.16)", bA:"rgba(212,175,55,0.45)",
  green:"#4CAF7D", red:"#CF6679",
};
const ini = n=>(n||"").trim().split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";
const ago = ts=>{const d=(Date.now()-new Date(ts))/1000;return d<60?"just now":d<3600?`${~~(d/60)}m`:d<86400?`${~~(d/3600)}h`:`${~~(d/86400)}d`;};
const pj = (s,fb=[])=>{try{return JSON.parse(s||"null")??fb;}catch{return fb;}};
const ps = s=>Array.isArray(s)?s:(s||"").split(",").map(x=>x.trim()).filter(Boolean);

/* ─── CSS ──────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#0B0B0B;color:#E8DDD0;font-family:'Inter',sans-serif;overflow-x:hidden;scroll-behavior:smooth;}
::placeholder{color:#6A5040;}::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-thumb{background:#800020;}
select option{background:#1E0C12;}input,textarea,select{color:#E8DDD0!important;font-family:'Inter',sans-serif;}
::selection{background:#800020;color:#E8C84A;}a{text-decoration:none;color:inherit;}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:.15;}50%{opacity:.7;}}
.fu{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both;}
.d1{animation-delay:.05s}.d2{animation-delay:.15s}.d3{animation-delay:.27s}.d4{animation-delay:.4s}
.fi{animation:fadeIn .4s ease both;}
.hc{transition:transform .28s,box-shadow .28s,border-color .2s;}
.hc:hover{transform:translateY(-4px);box-shadow:0 16px 44px rgba(128,0,32,0.22);border-color:rgba(212,175,55,.42)!important;}
/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 48px;background:rgba(11,11,11,.97);backdrop-filter:blur(24px);border-bottom:1px solid rgba(212,175,55,.1);}
.nl{font-size:12px;font-weight:500;color:#A89070;cursor:pointer;transition:color .18s;letter-spacing:.02em;position:relative;padding-bottom:2px;}
.nl::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:#D4AF37;transform:scaleX(0);transition:transform .22s;transform-origin:left;}
.nl:hover,.nl.on{color:#D4AF37;}.nl:hover::after,.nl.on::after{transform:scaleX(1);}
/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:.04em;padding:9px 22px;border:none;cursor:pointer;transition:all .2s;border-radius:2px;white-space:nowrap;}
.bp{background:#800020;color:#E8C84A;border:1px solid #A0192E;}.bp:hover{background:#A0192E;box-shadow:0 0 22px rgba(128,0,32,.4);}
.bg{background:transparent;color:#A89070;border:1px solid rgba(212,175,55,.18);}.bg:hover{border-color:#D4AF37;color:#D4AF37;}
.bo{background:transparent;color:#D4AF37;border:1px solid rgba(212,175,55,.42);}.bo:hover{background:rgba(212,175,55,.08);}
.bgo{background:linear-gradient(135deg,#D4AF37,#E8C84A);color:#0B0B0B;font-weight:700;}.bgo:hover{box-shadow:0 0 26px rgba(212,175,55,.38);transform:translateY(-1px);}
.btn-sm{padding:6px 15px;font-size:11px;}.btn-lg{padding:12px 32px;font-size:13px;}.btn-xl{padding:14px 44px;font-size:14px;}
.btn:disabled{opacity:.35;cursor:not-allowed;}
/* FORMS */
.fi2{background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.16);color:#E8DDD0!important;font-family:'Inter',sans-serif;font-size:14px;padding:10px 13px;outline:none;width:100%;transition:border-color .2s;border-radius:2px;}
.fi2:focus{border-color:rgba(212,175,55,.48);background:rgba(255,255,255,.06);}
select.fi2{cursor:pointer;background:#1E0C12;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23D4AF37'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;}
/* CARDS */
.vc{background:#130609;border:1px solid rgba(212,175,55,.14);transition:all .26s;}
/* MESSAGING */
.msg-wrap{display:flex;height:calc(100vh - 58px);margin-top:58px;}
.msg-rail{width:290px;flex-shrink:0;border-right:1px solid rgba(212,175,55,.1);background:#130609;display:flex;flex-direction:column;}
.msg-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.bubble-wrap{max-width:60%;}.bubble-wrap.me{align-self:flex-end;}.bubble-wrap.them{align-self:flex-start;}
.bubble{padding:10px 15px;border-radius:12px;font-size:13.5px;line-height:1.6;}
.bubble-wrap.me .bubble{background:#800020;color:#E8C84A;}.bubble-wrap.them .bubble{background:#1E0C12;border:1px solid rgba(212,175,55,.14);}
/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(11,11,11,.88);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .22s both;}
.modal{background:#130609;border:1px solid rgba(212,175,55,.26);max-width:640px;width:100%;max-height:90vh;overflow-y:auto;}
/* TOAST */
.toast{position:fixed;bottom:22px;right:22px;z-index:999;background:#1E0C12;border:1px solid rgba(212,175,55,.42);padding:14px 20px;display:flex;gap:12px;max-width:290px;box-shadow:0 14px 40px rgba(0,0,0,.5);animation:fadeUp .3s both;border-radius:2px;}
/* TABS */
.tab{background:transparent;border:none;cursor:pointer;padding:10px 22px;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;color:#A89070;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .18s;}
.tab.on{color:#D4AF37;border-bottom-color:#D4AF37;}.tab:hover:not(.on){color:#E8DDD0;}
/* BADGE */
.vbadge{display:inline-flex;align-items:center;gap:4px;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.4);padding:2px 8px;border-radius:100px;font-size:10px;color:#D4AF37;font-weight:600;}
/* STEPS */
.sdot{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;transition:all .22s;}
.sdot.done{background:#800020;border:1px solid #A0192E;color:#D4AF37;}.sdot.active{border:1px solid #D4AF37;color:#D4AF37;background:transparent;}.sdot.idle{border:1px solid rgba(212,175,55,.18);color:#6A5040;background:transparent;}
/* ERR */
.err{background:rgba(207,102,121,.1);border:1px solid rgba(207,102,121,.35);padding:10px 13px;font-size:13px;color:#EE9999;border-radius:2px;line-height:1.6;}
/* RESPONSIVE */
@media(max-width:900px){
  .nav{padding:0 18px;}.hide-mob{display:none!important;}
  .two-col{grid-template-columns:1fr!important;}
  .msg-wrap{flex-direction:column;}.msg-rail{width:100%;max-height:180px;}
  .g3{grid-template-columns:1fr 1fr!important;}.g4{grid-template-columns:1fr 1fr!important;}
}
@media(max-width:560px){.g3,.g4{grid-template-columns:1fr!important;}}
`;

/* ─── LOGO — original preferred: italic "The" + gradient "Voryel" wordmark ── */
function Logo({size="md",onClick}) {
  const s={sm:[0.5,0.9],md:[0.6,1.15],lg:[0.76,1.55]}[size]||[0.6,1.15];
  return (
    <div onClick={onClick} style={{cursor:onClick?"pointer":"default",display:"inline-flex",flexDirection:"column",alignItems:"flex-start",userSelect:"none",gap:1}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:300,fontSize:`${s[0]}rem`,letterSpacing:"0.5em",color:C.goldL,lineHeight:1}}>The</span>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontSize:`${s[1]}rem`,letterSpacing:"0.14em",lineHeight:1,background:`linear-gradient(135deg,${C.white} 0%,#FAF0D0 44%,${C.gold} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Voryel</span>
      <div style={{display:"flex",alignItems:"center",gap:5,width:"100%",marginTop:3}}>
        <div style={{flex:1,height:"0.5px",background:`linear-gradient(90deg,${C.burg},${C.burgL})`}}/>
        <div style={{width:4,height:4,background:C.gold,transform:"rotate(45deg)",flexShrink:0}}/>
        <div style={{flex:1,height:"0.5px",background:`linear-gradient(90deg,${C.burgL},transparent)`}}/>
      </div>
    </div>
  );
}

/* ─── ATOMS ────────────────────────────────────────────────────── */
function Av({name,size=44,photo}) {
  const colors=[["#3D0B18","#800020"],["#0D2A4A","#1A5480"],["#2A1045","#5A2090"],["#0A2E1A","#1A6040"]];
  const [c1,c2]=colors[(name||"A").charCodeAt(0)%colors.length];
  if(photo) return <img src={photo} alt={name} style={{width:size,height:size,borderRadius:2,objectFit:"cover",border:`1px solid ${C.b}`,flexShrink:0}}/>;
  return <div style={{width:size,height:size,background:`linear-gradient(135deg,${c1},${c2})`,border:`1px solid ${C.b}`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:size*.34,color:C.gold,fontWeight:300}}>{ini(name)}</span></div>;
}

function Btn({children,onClick,v="p",size="md",full,disabled,style={}}) {
  const p={sm:"6px 15px",md:"9px 22px",lg:"12px 32px",xl:"14px 44px"}[size]||"9px 22px";
  const cls={p:"btn bp",g:"btn bg",o:"btn bo",gold:"btn bgo"}[v]||"btn bp";
  return <button className={`${cls} btn-${size}`} onClick={disabled?undefined:onClick} disabled={disabled} style={{width:full?"100%":"auto",padding:p,...style}}>{children}</button>;
}

function F({label,name,type="text",value,onChange,placeholder,options,rows,required,hint}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",color:C.tx3,textTransform:"uppercase"}}>{label}{required&&<span style={{color:C.gold,marginLeft:2}}>*</span>}</label>}
      {type==="select"?<select name={name} value={value} onChange={onChange} className="fi2"><option value="">Select…</option>{options?.map(o=><option key={o} value={o}>{o}</option>)}</select>
      :type==="textarea"?<textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows||3} className="fi2" style={{resize:"vertical"}}/>
      :<input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="fi2"/>}
      {hint&&<span style={{fontSize:11,color:C.tx3,fontStyle:"italic"}}>{hint}</span>}
    </div>
  );
}

function Spinner(){return <div style={{width:18,height:18,border:`2px solid ${C.b}`,borderTopColor:C.gold,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>;}
function Err({msg}){return msg?<div className="err">{msg}</div>:null;}
function VBadge(){return <span className="vbadge">✦ Verified</span>;}

function Toast({title,body,onDone}) {
  useEffect(()=>{const t=setTimeout(onDone,3000);return()=>clearTimeout(t);},[]);
  return <div className="toast"><span style={{color:C.gold,fontSize:14,flexShrink:0}}>✦</span><div><div style={{fontSize:12,fontWeight:600,color:C.gold,marginBottom:2}}>{title}</div><div style={{fontSize:12.5,color:C.tx}}>{body}</div></div></div>;
}

function Orn() {
  return <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",margin:"4px 0 22px"}}><div style={{flex:1,maxWidth:60,height:"0.5px",background:`linear-gradient(90deg,transparent,${C.burg})`}}/><div style={{width:5,height:5,background:C.gold,transform:"rotate(45deg)"}}/><div style={{width:3,height:3,background:C.burg,transform:"rotate(45deg)"}}/><div style={{width:5,height:5,background:C.gold,transform:"rotate(45deg)"}}/><div style={{flex:1,maxWidth:60,height:"0.5px",background:`linear-gradient(90deg,${C.burg},transparent)`}}/></div>;
}

/* ─── NAV ──────────────────────────────────────────────────────── */
function Nav({page,setPage,me,onLogout,unread}) {
  return (
    <nav className="nav">
      <Logo size="sm" onClick={()=>setPage("home")}/>
      <div style={{display:"flex",gap:24,alignItems:"center"}} className="hide-mob">
        {[["home","Home"],["explore","Professionals"],["clients","Clients"],["collabs","Collaborate"],["opps","Opportunities"]].map(([id,l])=>(
          <span key={id} className={`nl${page===id?" on":""}`} onClick={()=>setPage(id)}>{l}</span>
        ))}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {me&&<div style={{position:"relative",cursor:"pointer"}} onClick={()=>setPage("messages")}><span className={`nl${page==="messages"?" on":""}`}>Messages</span>{unread>0&&<div style={{width:7,height:7,background:C.gold,borderRadius:"50%",position:"absolute",top:-2,right:-4}}/>}</div>}
        {me?<><span className="nl" style={{cursor:"pointer"}} onClick={()=>setPage("dashboard")}>{me.name?.split(" ")[0]}</span><Btn v="g" size="sm" onClick={onLogout}>Out</Btn></>
        :<><Btn v="g" size="sm" onClick={()=>setPage("login")}>Sign In</Btn><Btn v="gold" size="sm" onClick={()=>setPage("signup")}>Join Free</Btn></>}
      </div>
    </nav>
  );
}

/* ─── FOOTER ───────────────────────────────────────────────────── */
function Footer({setPage}) {
  return (
    <footer style={{background:C.s1,borderTop:`1px solid ${C.b}`,padding:"44px 0 28px"}}>
      <div style={{maxWidth:1140,margin:"0 auto",padding:"0 48px",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40}} className="two-col">
        <div><Logo size="sm"/><p style={{fontSize:13,color:C.tx2,marginTop:14,maxWidth:220,lineHeight:1.8}}>A premium global network where digital professionals and clients connect, collaborate, and grow.</p></div>
        <div><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.16em",color:C.gold,marginBottom:14}}>NETWORK</div>{[["explore","Professionals"],["clients","Clients"],["collabs","Collaborate"],["opps","Opportunities"]].map(([id,l])=><div key={id} onClick={()=>setPage(id)} style={{fontSize:13,color:C.tx2,cursor:"pointer",marginBottom:8,transition:"color .18s"}} onMouseEnter={e=>e.target.style.color=C.gold} onMouseLeave={e=>e.target.style.color=C.tx2}>{l}</div>)}</div>
        <div><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.16em",color:C.gold,marginBottom:14}}>COMPANY</div>{[["terms","Terms of Service"],["privacy","Privacy Policy"],["contact","Contact"]].map(([id,l])=><div key={id} onClick={()=>setPage(id)} style={{fontSize:13,color:C.tx2,cursor:"pointer",marginBottom:8,transition:"color .18s"}} onMouseEnter={e=>e.target.style.color=C.gold} onMouseLeave={e=>e.target.style.color=C.tx2}>{l}</div>)}</div>
        <div><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.16em",color:C.gold,marginBottom:14}}>CONTACT</div><a href={`mailto:${VMAIL}`} style={{fontSize:13,color:C.gold,display:"block",marginBottom:6}}>{VMAIL}</a><p style={{fontSize:12,color:C.tx3}}>We aim to respond promptly.</p></div>
      </div>
      <div style={{maxWidth:1140,margin:"24px auto 0",padding:"16px 48px 0",borderTop:`1px solid ${C.b}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:11,color:C.tx3}}>© 2026 The Voryel · Founded by Adetunji Ewaoluwa Destiny</span>
        <span style={{fontSize:11,color:C.tx3}}>Free to join · No payments processed</span>
      </div>
    </footer>
  );
}

/* ─── PROFILE CARD ─────────────────────────────────────────────── */
function ProCard({m,onClick,onMsg,me}) {
  const skills=ps(m.skills);
  const rate=m.price_label||(m.starting_price?`from $${m.starting_price}`:m.hourly_rate?`$${m.hourly_rate}/hr`:null);
  return (
    <div className="vc hc" style={{display:"flex",flexDirection:"column",overflow:"hidden",cursor:"pointer"}} onClick={onClick}>
      <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${C.b}`}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
          <Av name={m.name} size={48} photo={m.photo_url}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:2}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:400,color:C.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:140}}>{m.name}</span>
              {m.verified&&<VBadge/>}
            </div>
            <div style={{fontSize:11,fontWeight:600,color:C.gold,letterSpacing:"0.04em"}}>{m.category||"Professional"}</div>
            {m.location&&<div style={{fontSize:11,color:C.tx3,marginTop:1}}>📍 {m.location}</div>}
          </div>
          {rate&&<div style={{fontSize:10,color:C.gold,background:C.goldD,border:`1px solid ${C.b}`,padding:"2px 8px",flexShrink:0,borderRadius:2}}>{rate}</div>}
        </div>
        {m.bio&&<p style={{fontSize:13,color:C.tx,lineHeight:1.7,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",marginBottom:10}}>{m.bio}</p>}
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{skills.slice(0,3).map(s=><span key={s} style={{fontSize:10,padding:"2px 8px",border:`1px solid ${C.b}`,color:C.tx2,borderRadius:100}}>{s}</span>)}{skills.length>3&&<span style={{fontSize:10,color:C.tx3}}>+{skills.length-3}</span>}</div>
      </div>
      <div style={{padding:"10px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",background:C.s2}}>
        <span style={{fontSize:10,fontWeight:600,color:m.open_to_work!==false?C.green:C.tx3}}>{m.open_to_work!==false?"● AVAILABLE":"○ BUSY"}</span>
        {me&&me.id!==m.id&&<button className="btn bp btn-sm" onClick={e=>{e.stopPropagation();onMsg(m);}}>Message</button>}
      </div>
    </div>
  );
}

/* ─── PROFILE MODAL ────────────────────────────────────────────── */
function Modal({m,onClose,onMsg,me}) {
  const skills=ps(m.skills),tools=ps(m.tools),portfolio=pj(m.portfolio,[]);
  const rate=m.price_label||(m.starting_price?`from $${m.starting_price}`:m.hourly_rate?`$${m.hourly_rate}/hr`:null);
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal fi">
        <div style={{height:90,background:`linear-gradient(120deg,${C.burg},#200C14 55%,${C.bg})`,position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",top:12,right:14,background:"transparent",border:"none",color:C.tx3,fontSize:18,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:"0 28px 30px"}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-end",marginTop:-32,marginBottom:20}}>
            <Av name={m.name} size={66} photo={m.photo_url}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:300,color:C.white}}>{m.name}</span>{m.verified&&<VBadge/>}</div>
              <div style={{fontSize:12,fontWeight:600,color:C.gold}}>{m.category}</div>
              {m.location&&<div style={{fontSize:12,color:C.tx3,marginTop:2}}>📍 {m.location}</div>}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {rate&&<span style={{fontSize:10,color:C.gold,background:C.goldD,border:`1px solid ${C.b}`,padding:"4px 10px",borderRadius:2}}>{rate}</span>}
              {me&&me.id!==m.id&&<button className="btn bp btn-sm" onClick={()=>onMsg(m)}>Message</button>}
            </div>
          </div>
          {m.bio&&<><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.14em",color:C.gold,marginBottom:7}}>ABOUT</div><p style={{fontSize:14,color:C.tx,lineHeight:1.85,marginBottom:18}}>{m.bio}</p></>}
          {portfolio.length>0&&<><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.14em",color:C.gold,marginBottom:10}}>PORTFOLIO</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:18}}>{portfolio.map((item,i)=><div key={i} style={{aspectRatio:"4/3",background:C.s2,border:`1px solid ${C.b}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:10}}>{item.url?<a href={item.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:C.blue,textAlign:"center"}}>{item.title||"View →"}</a>:<><div style={{fontSize:"1rem",color:C.gold,marginBottom:4}}>◈</div><span style={{fontSize:9,color:C.tx2,textAlign:"center"}}>{item.title}</span></>}</div>)}</div></>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
            {skills.length>0&&<div><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.14em",color:C.gold,marginBottom:8}}>SKILLS</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{skills.map(s=><span key={s} style={{fontSize:10,padding:"2px 8px",border:`1px solid ${C.b}`,color:C.tx2,borderRadius:100}}>{s}</span>)}</div></div>}
            {tools.length>0&&<div><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.14em",color:C.gold,marginBottom:8}}>TOOLS</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{tools.map(t=><span key={t} style={{fontSize:10,padding:"2px 8px",border:`1px solid ${C.b}`,color:C.tx2,borderRadius:100}}>{t}</span>)}</div></div>}
          </div>
          {m.contact_methods&&<div style={{marginBottom:14}}><span style={{fontSize:12,color:C.gold,fontWeight:600}}>Contact: </span><span style={{fontSize:13,color:C.tx}}>{m.contact_methods}</span></div>}
          {m.website&&<div style={{marginBottom:14}}><span style={{fontSize:12,color:C.gold,fontWeight:600}}>Website: </span><a href={m.website} target="_blank" rel="noreferrer" style={{fontSize:13,color:C.gold}}>{m.website}</a></div>}
          <div style={{borderTop:`1px solid ${C.b}`,paddingTop:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <span style={{fontSize:11,color:m.open_to_work!==false?C.green:C.tx3,fontWeight:600}}>{m.open_to_work!==false?"● AVAILABLE":"○ NOT AVAILABLE"}</span>
            {me&&me.id!==m.id&&<button className="btn bp" onClick={()=>onMsg(m)}>Send Message</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HOME ─────────────────────────────────────────────────────── */
function Home({setPage,members,loading,me,onMsg}) {
  const pros=members.filter(m=>m.role==="freelancer"||m.user_type==="freelancer");
  const [view,setView]=useState(null);
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:58}}>
      {view&&<Modal m={view} onClose={()=>setView(null)} onMsg={m=>{setView(null);onMsg(m);}} me={me}/>}
      {/* HERO */}
      <section style={{minHeight:"91vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",padding:"0 10% 0 7%"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 65% 70% at 15% 50%,rgba(128,0,32,0.2) 0%,transparent 65%)`}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(212,175,55,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,.05) 1px,transparent 1px)`,backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 90% 90% at 30% 50%,black 5%,transparent 100%)",opacity:.5}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:580}}>
          <div className="fu d1" style={{fontSize:10,fontWeight:600,letterSpacing:"0.28em",color:C.gold,marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
            <span style={{width:26,height:1,background:C.gold,opacity:.4,display:"inline-block"}}/>YOUR VISION, OUR FLOW
          </div>
          <h1 className="fu d2" style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(3.2rem,6vw,5.8rem)",color:C.white,lineHeight:1.05,marginBottom:0}}>Where Vision</h1>
          <h1 className="fu d2" style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"clamp(3.2rem,6vw,5.8rem)",color:C.gold,fontStyle:"italic",lineHeight:1.08,marginBottom:24}}>Meets Craft</h1>
          <div style={{width:52,height:2,background:`linear-gradient(90deg,${C.burg},${C.gold})`,marginBottom:22}}/>
          <p className="fu d3" style={{fontSize:16,color:C.tx2,lineHeight:1.88,maxWidth:460,marginBottom:38}}>A premium global network where digital professionals and clients discover, connect, and collaborate directly — no intermediaries.</p>
          <div className="fu d4" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn v="gold" size="xl" onClick={()=>setPage("signup")}>Join Free</Btn>
            <Btn v="g" size="lg" onClick={()=>setPage("explore")}>Browse Professionals</Btn>
          </div>
        </div>
        {/* Hero graphic */}
        <svg style={{position:"absolute",right:"4%",top:"50%",transform:"translateY(-50%)",opacity:.42,pointerEvents:"none",animation:"pulse 4s ease-in-out infinite"}} width="360" height="360" viewBox="0 0 420 420" fill="none">
          <circle cx="210" cy="210" r="196" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2"/>
          <path d="M100 100 L210 310 L320 100" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6"/>
          <path d="M140 130 L210 270 L280 130" stroke="#D4AF37" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.28"/>
          <line x1="128" y1="210" x2="292" y2="210" stroke="#800020" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
          <rect x="198" y="198" width="24" height="24" transform="rotate(45 210 210)" fill="#200C14" stroke="#D4AF37" strokeWidth="1.2" opacity="0.85"/>
          <circle cx="100" cy="100" r="4" fill="#D4AF37" opacity="0.7"/>
          <circle cx="320" cy="100" r="4" fill="#D4AF37" opacity="0.7"/>
          <circle cx="210" cy="310" r="5" fill="#800020" opacity="0.85" stroke="#D4AF37" strokeWidth="1"/>
          <polyline points="28,28 28,10 46,10" stroke="#D4AF37" strokeWidth="1.1" fill="none" opacity="0.4"/>
          <polyline points="374,10 392,10 392,28" stroke="#D4AF37" strokeWidth="1.1" fill="none" opacity="0.4"/>
          <polyline points="392,392 392,410 374,410" stroke="#D4AF37" strokeWidth="1.1" fill="none" opacity="0.4"/>
          <polyline points="46,410 28,410 28,392" stroke="#D4AF37" strokeWidth="1.1" fill="none" opacity="0.4"/>
        </svg>
        <div style={{position:"absolute",bottom:32,left:"7%",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:1,background:`linear-gradient(90deg,${C.gold},transparent)`,animation:"pulse 2.5s ease-in-out infinite"}}/>
          <span style={{fontSize:10,fontWeight:500,letterSpacing:"0.18em",color:C.tx3}}>SCROLL</span>
        </div>
      </section>

      {/* STATS */}
      <div style={{borderTop:`1px solid ${C.b}`,borderBottom:`1px solid ${C.b}`,background:C.s1}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"0 48px",display:"grid",gridTemplateColumns:"repeat(4,1fr)"}} className="g4">
          {[[loading?"—":pros.length,"Professionals"],[loading?"—":members.filter(m=>m.role==="client").length,"Clients"],[loading?"—":members.filter(m=>m.verified).length,"Verified"],[CATS.length,"Categories"]].map(([n,l],i)=>(
            <div key={l} style={{padding:"28px 18px",textAlign:"center",borderRight:i<3?`1px solid ${C.b}`:"none"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.4rem",fontWeight:300,color:C.gold,lineHeight:1}}>{n}</div>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.14em",color:C.tx3,marginTop:5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{padding:"80px 0",background:C.s1}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"0 48px",textAlign:"center"}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.22em",color:C.gold,marginBottom:12}}>HOW IT WORKS</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3.5vw,3rem)",fontWeight:300,color:C.white,marginBottom:8}}>Simple. Direct. <em style={{color:C.gold}}>Premium.</em></h2>
          <Orn/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.b,marginTop:40}} className="g4">
            {[["01","Create Profile","Build your identity, set your rates, and showcase your portfolio."],["02","Discover","Browse professionals and clients. Filter by skill, category, or availability."],["03","Connect","Send a connection request. Once accepted, messaging unlocks."],["04","Collaborate","Message directly, agree terms privately, and build great work together."]].map(([n,t,b])=>(
              <div key={n} style={{background:C.s1,padding:"32px 24px",transition:"background .22s"}} onMouseEnter={e=>e.currentTarget.style.background=C.s2} onMouseLeave={e=>e.currentTarget.style.background=C.s1}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.8rem",fontWeight:300,color:"rgba(212,175,55,0.07)",marginBottom:16,lineHeight:1}}>{n}</div>
                <h3 style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:8,letterSpacing:".04em"}}>{t}</h3>
                <p style={{fontSize:13,color:C.tx2,lineHeight:1.8}}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {pros.length>0&&(
        <section style={{padding:"80px 0"}}>
          <div style={{maxWidth:1140,margin:"0 auto",padding:"0 48px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
              <div><div style={{fontSize:10,fontWeight:600,letterSpacing:"0.2em",color:C.gold,marginBottom:10}}>FEATURED PROFESSIONALS</div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,color:C.white}}>Meet the <em style={{color:C.gold}}>Network</em></h2></div>
              <Btn v="o" size="sm" onClick={()=>setPage("explore")}>View All →</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}} className="g3">
              {pros.slice(0,3).map(m=><ProCard key={m.id} m={m} onClick={()=>setView(m)} onMsg={onMsg} me={me}/>)}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section style={{background:C.s1,padding:"80px 0"}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"0 48px",textAlign:"center"}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.22em",color:C.gold,marginBottom:12}}>CATEGORIES</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3.5vw,3rem)",fontWeight:300,color:C.white,marginBottom:8}}>Every discipline, <em style={{color:C.gold}}>one network</em></h2>
          <Orn/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:32}} className="g4">
            {CATS.map(c=>(
              <div key={c} className="vc hc" style={{padding:"22px 18px",cursor:"pointer",textAlign:"center"}} onClick={()=>setPage("explore")}>
                <div style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:6}}>{c}</div>
                <div style={{fontSize:11,color:C.tx3}}>Browse →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFIED BADGE */}
      <section style={{padding:"80px 0"}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"0 48px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}} className="two-col">
          <div>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.22em",color:C.gold,marginBottom:12}}>VORYEL VERIFIED</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:300,color:C.white,marginBottom:8}}>The badge that <em style={{color:C.gold}}>earns trust.</em></h2>
            <Orn/>
            <p style={{fontSize:14,color:C.tx2,lineHeight:1.88,marginBottom:22}}>Payment gives you review access only — not an automatic badge. Our team manually reviews portfolio quality, professionalism, and credibility before approving.</p>
            <div style={{background:"rgba(212,175,55,0.06)",border:`1px solid ${C.bA}`,padding:"20px",borderRadius:2,marginBottom:20}}>
              <VBadge/>
              <p style={{fontSize:13,color:C.tx2,lineHeight:1.75,marginTop:10}}>Priority search placement · Premium trust signal · Profile analytics · Stronger reputation</p>
            </div>
            <span style={{fontSize:11,fontWeight:600,padding:"4px 12px",background:C.goldD,border:`1px solid ${C.b}`,color:C.gold,borderRadius:2}}>Pricing — Coming Soon</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[["🎯","Portfolio Quality","We review your actual work — not just your claims."],["💎","Profile Completeness","A well-presented, complete profile is the foundation."],["✦","Credibility & Communication","How you represent yourself matters as much as your work."],["📊","Analytics Access","Verified members get insight into profile views and appearances."]].map(([ic,t,d])=>(
              <div key={t} style={{background:C.s1,border:`1px solid ${C.b}`,padding:"16px 18px",display:"flex",gap:14,alignItems:"flex-start",transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bA} onMouseLeave={e=>e.currentTarget.style.borderColor=C.b}>
                <span style={{fontSize:"1.2rem",flexShrink:0}}>{ic}</span>
                <div><div style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:3}}>{t}</div><div style={{fontSize:12.5,color:C.tx2}}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"72px 0",textAlign:"center",background:`linear-gradient(135deg,${C.burg} 0%,${C.bg} 55%)`,borderTop:`1px solid ${C.b}`}}>
        <div style={{maxWidth:560,margin:"0 auto",padding:"0 48px"}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.9rem,4vw,3.2rem)",fontWeight:300,color:C.white,marginBottom:8}}>Ready to enter <em style={{color:C.gold}}>The Voryel</em>?</h2>
          <Orn/>
          <p style={{fontSize:15,color:C.tx2,lineHeight:1.88,marginBottom:32}}>Free to join. No fees. No intermediaries. Your network awaits.</p>
          <Btn v="gold" size="xl" onClick={()=>setPage("signup")}>Join The Voryel — Free →</Btn>
        </div>
      </section>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ─── EXPLORE ──────────────────────────────────────────────────── */
function Explore({setPage,members,loading,me,onMsg,type="pro"}) {
  const [cat,setCat]=useState("All");
  const [search,setSearch]=useState("");
  const [view,setView]=useState(null);
  const isClients=type==="client";
  const list=members.filter(m=>isClients?(m.role==="client"||m.user_type==="client"):(m.role==="freelancer"||m.user_type==="freelancer"));
  const filtered=list.filter(m=>{
    if(cat!=="All"&&m.category!==cat)return false;
    const q=search.toLowerCase();
    return !q||(m.name||"").toLowerCase().includes(q)||(m.bio||"").toLowerCase().includes(q)||(m.category||"").toLowerCase().includes(q)||(m.skills||"").toLowerCase().includes(q)||(m.company||"").toLowerCase().includes(q);
  });
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:58}}>
      {view&&<Modal m={view} onClose={()=>setView(null)} onMsg={m=>{setView(null);onMsg(m);}} me={me}/>}
      <div style={{background:`linear-gradient(135deg,${isClients?"#0A2040":C.burg},${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"52px 48px 40px"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.22em",color:isClients?"#6AABCC":C.gold,marginBottom:10}}>{isClients?"CLIENTS & BUSINESSES":"PROFESSIONALS"}</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.4rem)",fontWeight:300,color:C.white,marginBottom:8}}>Find Your <em style={{color:isClients?"#6AABCC":C.gold}}>{isClients?"Next Opportunity":"Collaborator"}</em></h1>
          <Orn/>
          <div style={{display:"flex",maxWidth:500,marginBottom:14,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.b}`,borderRadius:2,overflow:"hidden"}}>
            <input className="fi2" style={{flex:1,border:"none",background:"transparent"}} placeholder={isClients?"Search by company, industry…":"Search by name, skill…"} value={search} onChange={e=>setSearch(e.target.value)}/>
            <div style={{padding:"10px 14px",color:C.tx3,borderLeft:`1px solid ${C.b}`,fontSize:14}}>⌕</div>
          </div>
          {!isClients&&<div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {["All",...CATS].map(c=><button key={c} onClick={()=>setCat(c)} style={{fontSize:11,padding:"5px 13px",border:`1px solid ${cat===c?C.bA:C.b}`,background:cat===c?"rgba(128,0,32,.25)":"transparent",color:cat===c?C.gold:C.tx3,cursor:"pointer",borderRadius:100,fontFamily:"inherit",fontWeight:500}}>{c}</button>)}
          </div>}
        </div>
      </div>
      <div style={{maxWidth:1140,margin:"0 auto",padding:"36px 48px 72px"}}>
        {loading?<div style={{display:"flex",justifyContent:"center",padding:"60px 0"}}><Spinner/></div>
        :filtered.length===0?<div style={{textAlign:"center",padding:"72px 40px",border:`1px dashed ${C.b}`,borderRadius:2}}><div style={{opacity:.2,marginBottom:16,display:"flex",justifyContent:"center"}}><Logo size="sm"/></div><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:300,color:C.white,marginBottom:10}}>{list.length===0?"No members yet":"No results found"}</h3><p style={{fontSize:14,color:C.tx2,maxWidth:300,margin:"0 auto 22px",lineHeight:1.85}}>{list.length===0?"Be the first to join.":"Try adjusting your search."}</p>{list.length===0&&<Btn v="p" onClick={()=>setPage("signup")}>Join Now</Btn>}</div>
        :<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><span style={{fontSize:13,color:C.tx2}}>{filtered.length} member{filtered.length!==1?"s":""} found</span><span style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",color:C.tx3}}>CLICK TO VIEW PROFILE</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}} className="g3">{filtered.map(m=><ProCard key={m.id} m={m} onClick={()=>setView(m)} onMsg={onMsg} me={me}/>)}</div></>}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ─── POSTS (Collabs + Opps) ───────────────────────────────────── */
function Posts({setPage,me,type,setToast}) {
  const cfg={collab:{label:"COLLABORATIONS",title:"Build Something Together",color:"#9B7ACC",eg:"Co-founder, creative partner, team building…"},opps:{label:"OPPORTUNITIES",title:"Find Your Next Project",color:C.green,eg:"Need UI/UX designer, frontend dev, video editor…"}}[type];
  const [posts,setPosts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:"",type_tag:"",description:"",skills_needed:"",contact_pref:"",budget:"",timeline:""});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const h=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));
  useEffect(()=>{db.posts.all(type).then(d=>{if(Array.isArray(d))setPosts(d);}).catch(()=>{}).finally(()=>setLoading(false));},[]);
  const submit=async()=>{
    if(!form.title.trim()){setErr("Please add a title.");return;}
    if(!me){setErr("Sign in to post.");return;}
    setSaving(true);setErr("");
    try{const r=await db.posts.insert({...form,type,poster_id:me.id,poster_name:me.name,created_at:new Date().toISOString()});if(Array.isArray(r)&&r[0]){setPosts(p=>[r[0],...p]);setShow(false);setForm({title:"",type_tag:"",description:"",skills_needed:"",contact_pref:"",budget:"",timeline:""});setToast({title:"Posted!",body:"Your post is now live."});}}
    catch(e){setErr("Connection error. Try again.");}
    setSaving(false);
  };
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:58}}>
      <div style={{background:`linear-gradient(135deg,rgba(20,8,30,0.6),${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"52px 48px 40px"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.22em",color:cfg.color,marginBottom:10}}>{cfg.label}</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:300,color:C.white,marginBottom:8}}>{cfg.title}</h1>
          <Orn/>
          <p style={{fontSize:15,color:C.tx2,maxWidth:480,marginBottom:22,lineHeight:1.88}}>{cfg.eg}</p>
          {me?<Btn v="p" onClick={()=>setShow(!show)}>{show?"Cancel":"+ Post"}</Btn>:<Btn v="g" onClick={()=>setPage("signup")}>Join to Post</Btn>}
        </div>
      </div>
      {show&&<div style={{maxWidth:1140,margin:"0 auto",padding:"28px 48px 0"}}>
        <div style={{background:C.s1,border:`1px solid ${C.bA}`,padding:"24px",maxWidth:600,borderRadius:2}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:C.gold,marginBottom:16}}>NEW POST</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <F label="Title" name="title" value={form.title} onChange={h} placeholder={type==="collab"?"e.g. Seeking UI designer for fintech app":"e.g. Need frontend developer"} required/>
            <F label="Type / Category" name="type_tag" value={form.type_tag} onChange={h} placeholder={type==="collab"?"e.g. Co-founder search":"e.g. Web Development"}/>
            <F label="Description" name="description" type="textarea" value={form.description} onChange={h} placeholder="Describe what you're building and what you need…" rows={3}/>
            <F label="Skills Needed" name="skills_needed" value={form.skills_needed} onChange={h} placeholder="e.g. React, Figma, Brand Design"/>
            {type==="opps"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><F label="Budget" name="budget" value={form.budget} onChange={h} placeholder="e.g. $500–$2000"/><F label="Timeline" name="timeline" value={form.timeline} onChange={h} placeholder="e.g. 2–4 weeks"/></div>}
            <F label="How to Connect" name="contact_pref" value={form.contact_pref} onChange={h} placeholder="e.g. Message me on The Voryel"/>
            <Err msg={err}/>
            <Btn v="gold" onClick={submit} disabled={saving}>{saving?"Posting…":"Post Now"}</Btn>
          </div>
        </div>
      </div>}
      <div style={{maxWidth:1140,margin:"0 auto",padding:"32px 48px 72px"}}>
        {loading?<div style={{display:"flex",justifyContent:"center",padding:"60px 0"}}><Spinner/></div>
        :posts.length===0?<div style={{textAlign:"center",padding:"64px 40px",border:`1px dashed ${C.b}`,borderRadius:2}}><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:300,color:C.white,marginBottom:10}}>Nothing posted yet</h3><p style={{fontSize:14,color:C.tx2,marginBottom:22}}>Be the first to post.</p>{me?<Btn v="p" onClick={()=>setShow(true)}>Post Now</Btn>:<Btn v="g" onClick={()=>setPage("signup")}>Join to Post</Btn>}</div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}} className="two-col">{posts.map(p=>(
          <div key={p.id} style={{background:C.s1,border:`1px solid ${C.b}`,padding:"22px",transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bA} onMouseLeave={e=>e.currentTarget.style.borderColor=C.b}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:400,color:C.white,marginBottom:4}}>{p.title}</h3><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{p.type_tag&&<span style={{fontSize:10,padding:"2px 8px",border:`1px solid ${C.bA}`,color:C.gold,borderRadius:2}}>{p.type_tag}</span>}{p.budget&&<span style={{fontSize:10,padding:"2px 8px",border:`1px solid ${C.b}`,color:C.tx2,borderRadius:2}}>{p.budget}</span>}{p.timeline&&<span style={{fontSize:10,padding:"2px 8px",border:`1px solid ${C.b}`,color:C.tx2,borderRadius:2}}>{p.timeline}</span>}</div></div>
              <span style={{fontSize:10,color:C.tx3,flexShrink:0,marginLeft:12}}>{ago(p.created_at)}</span>
            </div>
            {p.description&&<p style={{fontSize:13,color:C.tx,lineHeight:1.78,marginBottom:10}}>{p.description}</p>}
            {p.skills_needed&&<div style={{fontSize:12,color:C.tx2,marginBottom:8}}><span style={{color:C.gold,fontWeight:600}}>Needs: </span>{p.skills_needed}</div>}
            {p.contact_pref&&<div style={{fontSize:12,color:C.tx3,borderTop:`1px solid ${C.b}`,paddingTop:8,marginTop:8}}><span style={{color:C.gold,fontWeight:600}}>Connect: </span>{p.contact_pref}</div>}
            <div style={{fontSize:11,color:C.tx3,marginTop:8}}>By <strong style={{color:C.tx2}}>{p.poster_name}</strong></div>
          </div>
        ))}</div>}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ─── MESSAGES ─────────────────────────────────────────────────── */
function Messages({me,members,setUnread,initRecip,setInitRecip}) {
  const [threads,setThreads]=useState([]);
  const [active,setActive]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [text,setText]=useState("");
  const [sending,setSending]=useState(false);
  const [loading,setLoading]=useState(true);
  const bodyRef=useRef(null);

  useEffect(()=>{
    if(!me)return;
    db.messages.inbox(me.id).then(all=>{
      if(!Array.isArray(all)){setLoading(false);return;}
      const seen=new Set(),convs=[];
      all.forEach(m=>{const oid=m.sender_id===me.id?m.recipient_id:m.sender_id;if(!seen.has(oid)){seen.add(oid);convs.push({other:members.find(u=>u.id===oid)||{id:oid,name:"Unknown"},lastMsg:m});}});
      setThreads(convs);
      setUnread(all.filter(m=>m.recipient_id===me.id&&!m.read).length);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[me,members]);

  useEffect(()=>{if(initRecip&&me){openThread(initRecip);setInitRecip(null);}  },[initRecip,me]);

  const openThread=async(other)=>{
    setActive(other);setText("");
    const data=await db.messages.thread(me.id,other.id).catch(()=>[]);
    setMsgs(Array.isArray(data)?data:[]);
    db.messages.read(other.id,me.id).catch(()=>{});
    setThreads(p=>{const ex=p.find(t=>t.other.id===other.id);return ex?p:[{other,lastMsg:null},...p];});
  };

  useEffect(()=>{if(bodyRef.current)bodyRef.current.scrollTop=bodyRef.current.scrollHeight;},[msgs]);

  const send=async()=>{
    if(!text.trim()||!active||sending)return;
    setSending(true);
    const msg={sender_id:me.id,recipient_id:active.id,content:text.trim(),read:false,created_at:new Date().toISOString()};
    setText("");
    try{const r=await db.messages.send(msg);const saved=Array.isArray(r)&&r[0]?r[0]:{...msg,id:Date.now()};setMsgs(p=>[...p,saved]);setThreads(p=>p.map(t=>t.other.id===active.id?{...t,lastMsg:saved}:t));}
    catch(e){console.error(e);}
    setSending(false);
  };

  if(!me)return <div style={{background:C.bg,minHeight:"100vh",paddingTop:58,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}><div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,color:C.white,marginBottom:12}}>Sign in to access messages</h2></div></div>;

  return (
    <div className="msg-wrap">
      <div className="msg-rail">
        <div style={{padding:"18px",borderBottom:`1px solid ${C.b}`,flexShrink:0}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontWeight:300,color:C.white}}>Messages</div>
          <div style={{fontSize:11,color:C.tx3,marginTop:2}}>{threads.length} conversations</div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {loading?<div style={{display:"flex",justifyContent:"center",padding:"30px 0"}}><Spinner/></div>
          :threads.length===0?<div style={{padding:"32px 16px",textAlign:"center",fontSize:12,color:C.tx3}}>No conversations yet.<br/>Browse and message someone.</div>
          :threads.map(t=>(
            <div key={t.other.id} style={{display:"flex",gap:10,padding:"13px 16px",cursor:"pointer",borderBottom:`1px solid ${C.b}`,background:active?.id===t.other.id?C.s2:"transparent",transition:"background .18s",alignItems:"center"}} onClick={()=>openThread(t.other)}>
              <Av name={t.other.name} size={36} photo={t.other.photo_url}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:C.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.other.name||"Unknown"}</div>
                {t.lastMsg&&<div style={{fontSize:11,color:C.tx3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{t.lastMsg.content}</div>}
              </div>
              {t.lastMsg&&<div style={{fontSize:10,color:C.tx3,flexShrink:0}}>{ago(t.lastMsg.created_at)}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="msg-main">
        {!active?<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,textAlign:"center",padding:32}}><div style={{opacity:.2}}><Logo size="sm"/></div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:C.white,marginTop:12}}>Select a conversation</div><p style={{fontSize:13,color:C.tx3,maxWidth:280,lineHeight:1.78}}>Browse the network and message someone to start.</p></div>
        :<>
          <div style={{padding:"14px 24px",borderBottom:`1px solid ${C.b}`,display:"flex",alignItems:"center",gap:13,background:C.s1,flexShrink:0}}>
            <Av name={active.name} size={36} photo={active.photo_url}/>
            <div><div style={{fontSize:14,fontWeight:600,color:C.white}}>{active.name}</div><div style={{fontSize:11,color:C.tx3}}>{active.category||active.company||"Member"}</div></div>
          </div>
          <div ref={bodyRef} style={{flex:1,overflowY:"auto",padding:"24px",display:"flex",flexDirection:"column",gap:10}}>
            {msgs.length===0&&<div style={{textAlign:"center",padding:"32px 0",fontSize:13,color:C.tx3}}>Start your conversation.</div>}
            {msgs.map((m,i)=>{const isMe=m.sender_id===me.id;return(<div key={m.id||i} className={`bubble-wrap ${isMe?"me":"them"}`}><div className="bubble">{m.content}</div><div style={{fontSize:10,color:C.tx3,marginTop:3,textAlign:isMe?"right":"left"}}>{ago(m.created_at)}</div></div>);})}
          </div>
          <div style={{padding:"14px 24px",borderTop:`1px solid ${C.b}`,display:"flex",gap:9,alignItems:"flex-end",background:C.s1,flexShrink:0}}>
            <textarea style={{flex:1,background:C.s2,border:`1px solid ${C.b}`,padding:"10px 13px",color:`${C.tx}!important`,fontFamily:"'Inter',sans-serif",fontSize:13.5,outline:"none",resize:"none",borderRadius:2,minHeight:40,maxHeight:110,transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=C.bA} onBlur={e=>e.target.style.borderColor=C.b} placeholder={`Message ${active.name}…`} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} rows={1}/>
            <button className="btn bp btn-sm" onClick={send} disabled={!text.trim()||sending}>{sending?"…":"Send"}</button>
          </div>
        </>}
      </div>
    </div>
  );
}

/* ─── AUTH ─────────────────────────────────────────────────────── */
function Auth({mode,setPage,onAuth}) {
  const isLogin=mode==="login";
  const [role,setRole]=useState("freelancer");
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [agreed,setAgreed]=useState(false);
  const [d,setD]=useState({name:"",email:"",password:"",bio:"",category:"",industry:"",company:"",skillsRaw:"",toolsRaw:"",price_type:"project",starting_price:"",hourly_rate:"",price_label:"",project_needs:"",talent_interests:"",contact_methods:"",location:"",years_exp:"",website:"",open_to_work:true});
  const h=e=>setD(p=>({...p,[e.target.name]:e.target.value}));
  const ve=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const steps=role==="freelancer"?["Account","Profile","Rates","Finish"]:["Account","Business","Finish"];
  const next=(n,check)=>{const f=check?.();if(f){setErr(f);return;}setErr("");setStep(n);};

  const doLogin=async()=>{
    setErr("");
    if(!ve(d.email)){setErr("Enter a valid email.");return;}
    if(!d.password){setErr("Enter your password.");return;}
    setLoading(true);
    try{const user=await db.profiles.byEmail(d.email);if(!user){setErr("No account found. Please sign up.");setLoading(false);return;}if(user.password!==d.password){setErr("Incorrect password.");setLoading(false);return;}onAuth(user);setPage("home");}
    catch(e){setErr(`Connection error: ${e.message||"Please try again."}`);}
    setLoading(false);
  };

  const doSignup=async()=>{
    setErr("");
    if(!agreed){setErr("Please agree to the Terms of Service.");return;}
    if(!d.name.trim()){setErr("Enter your name.");return;}
    if(!ve(d.email)){setErr("Enter a valid email.");return;}
    if(d.password.length<6){setErr("Password needs 6+ characters.");return;}
    if(role==="freelancer"&&!d.category){setErr("Select your discipline.");return;}
    setLoading(true);
    try{
      const existing=await db.profiles.byEmail(d.email);
      if(existing){setErr("Account exists. Please sign in.");setLoading(false);return;}
      const skills=d.skillsRaw.split(",").map(s=>s.trim()).filter(Boolean);
      const tools=d.toolsRaw.split(",").map(s=>s.trim()).filter(Boolean);
      const r=await db.profiles.insert({name:d.name.trim(),email:d.email.toLowerCase().trim(),password:d.password,bio:d.bio.trim(),category:d.category,industry:d.industry,company:d.company.trim(),skills:JSON.stringify(skills),tools:JSON.stringify(tools),user_type:role,role,open_to_work:role==="freelancer"?d.open_to_work:null,project_needs:d.project_needs.trim(),talent_interests:d.talent_interests.trim(),contact_methods:d.contact_methods.trim(),location:d.location.trim(),years_exp:d.years_exp,website:d.website.trim(),starting_price:d.starting_price?parseFloat(d.starting_price):null,hourly_rate:d.hourly_rate?parseFloat(d.hourly_rate):null,price_type:d.price_type,price_label:d.price_label.trim()||null,portfolio:JSON.stringify([]),verified:false,joined_at:new Date().toISOString()});
      if(Array.isArray(r)&&r[0]){onAuth(r[0]);setPage("home");}
      else{console.error("[Signup]",r);setErr("Signup failed. Check all fields and try again.");}
    }catch(e){setErr(`Error: ${e.message||"Please try again."}`);}
    setLoading(false);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,background:`radial-gradient(ellipse 80% 55% at 50% 0%,rgba(128,0,32,0.25) 0%,transparent 65%)`,pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(rgba(212,175,55,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,.05) 1px,transparent 1px)`,backgroundSize:"58px 58px",opacity:.45,pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"36px 20px"}}>
        <div style={{marginBottom:28,cursor:"pointer"}} onClick={()=>setPage("home")}><Logo size="md"/></div>
        <div style={{textAlign:"center",marginBottom:32}}>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:300,color:C.white,lineHeight:1.1,marginBottom:8}}>{isLogin?"Welcome back":"Join The Voryel"}</h1>
          <p style={{fontSize:14,color:C.tx2}}>{isLogin?"Sign in to your network.":"Free to join. No subscription required."}</p>
        </div>
        <div style={{background:"rgba(19,6,9,0.92)",border:`1px solid rgba(212,175,55,0.22)`,backdropFilter:"blur(20px)",padding:"32px 36px",width:"100%",maxWidth:460,borderRadius:4}}>
          {!isLogin&&<div style={{display:"flex",border:`1px solid ${C.b}`,marginBottom:22,overflow:"hidden",borderRadius:2}}>
            {[["freelancer","I'm a Professional"],["client","I'm a Client"]].map(([r,l])=>(
              <button key={r} onClick={()=>{setRole(r);setStep(1);setErr("");setAgreed(false);}} style={{flex:1,padding:"10px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:role===r?C.burg:"transparent",color:role===r?"#E8C84A":C.tx2,transition:"all .18s",fontFamily:"inherit"}}>{l}</button>
            ))}
          </div>}
          {!isLogin&&role==="freelancer"&&<div style={{display:"flex",alignItems:"center",gap:7,marginBottom:20}}>
            {steps.map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",gap:7,flex:i<steps.length-1?1:"auto"}}>
                <div className={`sdot${step===i+1?" active":step>i+1?" done":" idle"}`}>{step>i+1?"✓":i+1}</div>
                <span style={{fontSize:10,fontWeight:500,color:step===i+1?C.gold:C.tx3}}>{s}</span>
                {i<steps.length-1&&<div style={{flex:1,height:1,background:C.b}}/>}
              </div>
            ))}
          </div>}
          {err&&<><Err msg={err}/><div style={{height:12}}/></>}

          {isLogin&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            <F label="Email" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
            <F label="Password" name="password" type="password" value={d.password} onChange={h} placeholder="••••••••" required/>
            <Btn v="gold" full onClick={doLogin} disabled={loading}>{loading?"Signing in…":"Sign In"}</Btn>
            <div style={{textAlign:"center",position:"relative",margin:"4px 0"}}><div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:C.b}}/><span style={{background:"rgba(19,6,9,0.92)",padding:"0 12px",position:"relative",fontSize:11,color:C.tx3}}>New here?</span></div>
            <Btn v="g" full onClick={()=>setPage("signup")}>Create an Account</Btn>
          </div>}

          {!isLogin&&role==="freelancer"&&<>
            {step===1&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
              <F label="Full Name" name="name" value={d.name} onChange={h} placeholder="Your name" required/>
              <F label="Email" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
              <F label="Password" name="password" type="password" value={d.password} onChange={h} placeholder="6+ characters" required/>
              <Btn v="gold" full onClick={()=>next(2,()=>{if(!d.name.trim())return"Enter your name.";if(!ve(d.email))return"Enter a valid email.";if(d.password.length<6)return"Password needs 6+ characters.";})} disabled={loading}>Continue →</Btn>
            </div>}
            {step===2&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
              <F label="Discipline" name="category" type="select" value={d.category} onChange={h} options={CATS} required/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><F label="Location" name="location" value={d.location} onChange={h} placeholder="City, Country"/><F label="Experience" name="years_exp" value={d.years_exp} onChange={h} placeholder="e.g. 5 years"/></div>
              <F label="Bio" name="bio" type="textarea" value={d.bio} onChange={h} placeholder="Your expertise and approach…" rows={3}/>
              <F label="Skills (comma-separated)" name="skillsRaw" value={d.skillsRaw} onChange={h} placeholder="e.g. Figma, React"/>
              <F label="Tools (comma-separated)" name="toolsRaw" value={d.toolsRaw} onChange={h} placeholder="e.g. Adobe Suite, VS Code"/>
              <div style={{display:"flex",gap:9}}><Btn v="g" size="sm" onClick={()=>next(1)}>Back</Btn><Btn v="gold" size="sm" onClick={()=>next(3,()=>{if(!d.category)return"Select your discipline.";})} style={{flex:1}}>Continue →</Btn></div>
            </div>}
            {step===3&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontSize:12,fontWeight:700,color:C.gold,letterSpacing:"0.08em"}}>SET YOUR RATES</div>
              <div style={{display:"flex",gap:7}}>{[["project","Per Project"],["hourly","Hourly"],["both","Both"]].map(([v,l])=><div key={v} onClick={()=>setD(p=>({...p,price_type:v}))} style={{flex:1,padding:"8px",border:`1px solid ${d.price_type===v?C.burg:C.b}`,cursor:"pointer",textAlign:"center",background:d.price_type===v?"rgba(128,0,32,.25)":"transparent",borderRadius:2}}><span style={{fontSize:12,fontWeight:500,color:d.price_type===v?C.gold:C.tx2}}>{l}</span></div>)}</div>
              {(d.price_type==="project"||d.price_type==="both")&&<F label="Starting Price (USD)" name="starting_price" type="number" value={d.starting_price} onChange={h} placeholder="e.g. 500"/>}
              {(d.price_type==="hourly"||d.price_type==="both")&&<F label="Hourly Rate (USD)" name="hourly_rate" type="number" value={d.hourly_rate} onChange={h} placeholder="e.g. 75"/>}
              <F label="Custom Label" name="price_label" value={d.price_label} onChange={h} placeholder='e.g. "from $500"' hint="Shown on your profile card"/>
              <F label="Preferred Contact" name="contact_methods" value={d.contact_methods} onChange={h} placeholder="e.g. Message on The Voryel"/>
              <F label="Website / Portfolio" name="website" value={d.website} onChange={h} placeholder="https://…"/>
              <div style={{display:"flex",gap:9}}><Btn v="g" size="sm" onClick={()=>next(2)}>Back</Btn><Btn v="gold" size="sm" onClick={()=>next(4)} style={{flex:1}}>Continue →</Btn></div>
            </div>}
            {step===4&&<div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div>
                <div style={{fontSize:10,fontWeight:600,color:C.tx3,marginBottom:7,letterSpacing:"0.08em"}}>AVAILABILITY</div>
                <div style={{display:"flex",gap:7}}>{[[true,"Available"],[false,"Not Now"]].map(([v,l])=><div key={String(v)} onClick={()=>setD(p=>({...p,open_to_work:v}))} style={{flex:1,padding:"8px",border:`1px solid ${d.open_to_work===v?C.burg:C.b}`,cursor:"pointer",textAlign:"center",background:d.open_to_work===v?"rgba(128,0,32,.25)":"transparent",borderRadius:2}}><span style={{fontSize:12,fontWeight:500,color:d.open_to_work===v?C.gold:C.tx2}}>{l}</span></div>)}</div>
              </div>
              <div style={{background:C.goldD,border:`1px solid ${agreed?C.bA:C.b}`,padding:"14px",borderRadius:2,transition:"border-color .2s"}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",color:C.gold,marginBottom:8}}>TERMS OF SERVICE — REQUIRED</div>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3,accentColor:C.burg,flexShrink:0,width:14,height:14}}/>
                  <p style={{fontSize:13,color:C.tx,lineHeight:1.65}}>I agree to The Voryel's <span style={{color:C.gold,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("terms")}>Terms of Service</span> and <span style={{color:C.gold,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("privacy")}>Privacy Policy</span>.</p>
                </div>
              </div>
              {!agreed&&<p style={{fontSize:12,color:C.red,fontStyle:"italic"}}>You must agree to continue.</p>}
              <div style={{display:"flex",gap:9}}><Btn v="g" size="sm" onClick={()=>next(3)}>Back</Btn><Btn v="gold" size="sm" onClick={doSignup} disabled={loading||!agreed} style={{flex:1}}>{loading?"Creating…":"Create Profile →"}</Btn></div>
              <div style={{textAlign:"center",fontSize:12,color:C.tx3}}>Already a member? <span style={{color:C.gold,cursor:"pointer",fontWeight:600}} onClick={()=>setPage("login")}>Sign in</span></div>
            </div>}
          </>}

          {!isLogin&&role==="client"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            <F label="Your Name" name="name" value={d.name} onChange={h} placeholder="Full name" required/>
            <F label="Company / Brand" name="company" value={d.company} onChange={h} placeholder="Optional"/>
            <F label="Email" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com" required/>
            <F label="Password" name="password" type="password" value={d.password} onChange={h} placeholder="6+ characters" required/>
            <F label="What do you need?" name="project_needs" type="textarea" value={d.project_needs} onChange={h} placeholder="Briefly describe your project needs…" rows={3}/>
            <div style={{background:C.goldD,border:`1px solid ${agreed?C.bA:C.b}`,padding:"14px",borderRadius:2}}>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3,accentColor:C.burg,flexShrink:0,width:14,height:14}}/>
                <p style={{fontSize:13,color:C.tx,lineHeight:1.65}}>I agree to The Voryel's <span style={{color:C.gold,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("terms")}>Terms of Service</span>.</p>
              </div>
            </div>
            <Btn v="gold" full onClick={doSignup} disabled={loading||!agreed}>{loading?"Creating…":"Join as Client →"}</Btn>
            <div style={{textAlign:"center",fontSize:12,color:C.tx3}}>Already a member? <span style={{color:C.gold,cursor:"pointer",fontWeight:600}} onClick={()=>setPage("login")}>Sign in</span></div>
          </div>}
        </div>
        <div style={{marginTop:22,fontSize:11,color:C.tx3,textAlign:"center"}}>© 2026 The Voryel · <a href={`mailto:${VMAIL}`} style={{color:C.tx3}}>{VMAIL}</a></div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD ────────────────────────────────────────────────── */
function Dashboard({user,setPage,onUpdate,onMsg}) {
  const [tab,setTab]=useState("profile");
  const [editing,setEditing]=useState(false);
  const [saving,setSaving]=useState(false);
  const [saveErr,setSaveErr]=useState("");
  const isF=user.role==="freelancer"||user.user_type==="freelancer";
  const [form,setForm]=useState({bio:user.bio||"",category:user.category||"",skillsRaw:ps(user.skills).join(", "),toolsRaw:ps(user.tools).join(", "),starting_price:user.starting_price||"",hourly_rate:user.hourly_rate||"",price_type:user.price_type||"project",price_label:user.price_label||"",open_to_work:user.open_to_work!==false,company:user.company||"",location:user.location||"",years_exp:user.years_exp||"",website:user.website||"",contact_methods:user.contact_methods||"",project_needs:user.project_needs||"",talent_interests:user.talent_interests||""});
  const fh=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));
  const [portfolio,setPortfolio]=useState(()=>pj(user.portfolio,[]));
  const [pf,setPf]=useState({title:"",url:"",desc:""});
  const [addP,setAddP]=useState(false);
  const [pSaving,setPSaving]=useState(false);

  const addPort=async()=>{if(!pf.title.trim())return;setPSaving(true);try{const u=[...portfolio,{...pf,added:new Date().toISOString()}];const r=await db.profiles.update(user.id,{portfolio:JSON.stringify(u)});if(Array.isArray(r)&&r[0]){setPortfolio(u);onUpdate(r[0]);setPf({title:"",url:"",desc:""});setAddP(false);}}catch(e){}setPSaving(false);};
  const removePort=async i=>{try{const u=portfolio.filter((_,idx)=>idx!==i);const r=await db.profiles.update(user.id,{portfolio:JSON.stringify(u)});if(Array.isArray(r)&&r[0]){setPortfolio(u);onUpdate(r[0]);}}catch(e){}};
  const save=async()=>{setSaving(true);setSaveErr("");try{const skills=form.skillsRaw.split(",").map(s=>s.trim()).filter(Boolean);const tools=form.toolsRaw.split(",").map(s=>s.trim()).filter(Boolean);const r=await db.profiles.update(user.id,{bio:form.bio,category:form.category,skills:JSON.stringify(skills),tools:JSON.stringify(tools),starting_price:form.starting_price?parseFloat(form.starting_price):null,hourly_rate:form.hourly_rate?parseFloat(form.hourly_rate):null,price_type:form.price_type,price_label:form.price_label||null,open_to_work:form.open_to_work,company:form.company,location:form.location,years_exp:form.years_exp,website:form.website,contact_methods:form.contact_methods,project_needs:form.project_needs,talent_interests:form.talent_interests});if(Array.isArray(r)&&r[0]){onUpdate(r[0]);setEditing(false);}else setSaveErr("Could not save. Try again.");}catch(e){setSaveErr("Connection error.");}setSaving(false);};

  const skills=ps(user.skills);
  const rate=user.price_label||(user.starting_price?`from $${user.starting_price}`:user.hourly_rate?`$${user.hourly_rate}/hr`:null);

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:58}}>
      <div style={{height:170,background:`linear-gradient(120deg,${C.burg} 0%,#200C14 40%,${C.bg} 100%)`,borderBottom:`1px solid ${C.b}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 26px,rgba(212,175,55,0.04) 26px,rgba(212,175,55,0.04) 27px)"}}/>
      </div>
      <div style={{maxWidth:1060,margin:"0 auto",padding:"0 44px 72px"}}>
        <div style={{display:"flex",gap:20,alignItems:"flex-end",marginTop:-44,marginBottom:32,flexWrap:"wrap"}}>
          <Av name={user.name} size={88} photo={user.photo_url}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:4}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:300,color:C.white}}>{user.name}</span>
              {user.verified&&<VBadge/>}
              <span style={{fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:2,...(isF?{background:"rgba(128,0,32,.3)",border:`1px solid ${C.burg}`,color:C.gold}:{background:"rgba(26,58,106,.25)",border:"1px solid rgba(26,58,106,.5)",color:"#6AABCC"})}}>{isF?"PROFESSIONAL":"CLIENT"}</span>
              {rate&&isF&&<span style={{fontSize:10,color:C.gold,background:C.goldD,border:`1px solid ${C.b}`,padding:"2px 9px",borderRadius:2}}>{rate}</span>}
            </div>
            <div style={{fontSize:12,fontWeight:600,color:C.gold}}>{user.category||user.company||""}</div>
            {user.location&&<div style={{fontSize:12,color:C.tx3,marginTop:2}}>📍 {user.location}</div>}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn v="g" size="sm" onClick={()=>{setEditing(!editing);setSaveErr("");}}>{editing?"Cancel":"Edit Profile"}</Btn>
            <Btn v="o" size="sm" onClick={()=>setPage(isF?"explore":"clients")}>{isF?"Browse Clients":"Browse Pros"}</Btn>
          </div>
        </div>

        <div style={{borderBottom:`1px solid ${C.b}`,marginBottom:32,display:"flex"}}>
          {(isF?["profile","portfolio","rates"]:["profile","needs"]).map(t=><button key={t} className={`tab${tab===t?" on":""}`} onClick={()=>{setTab(t);setEditing(false);setSaveErr("");}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"2fr 260px",gap:26}} className="two-col">
          <div>
            {saveErr&&<><Err msg={saveErr}/><div style={{height:14}}/></>}

            {tab==="profile"&&!editing&&<div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",fontWeight:300,color:C.white,marginBottom:12}}>About</h3>
              <p style={{fontSize:14,color:user.bio?C.tx:C.tx3,lineHeight:1.88,marginBottom:20,fontStyle:user.bio?"normal":"italic"}}>{user.bio||"No bio yet — click Edit Profile."}</p>
              {isF&&skills.length>0&&<><h4 style={{fontSize:11,fontWeight:700,color:C.white,marginBottom:9,letterSpacing:".06em"}}>SKILLS</h4><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{skills.map(s=><span key={s} style={{fontSize:10,padding:"2px 8px",border:`1px solid ${C.b}`,color:C.tx2,borderRadius:100}}>{s}</span>)}</div></>}
            </div>}
            {tab==="profile"&&editing&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
              <F label="Bio" name="bio" type="textarea" value={form.bio} onChange={fh} rows={4}/>
              {isF&&<><F label="Discipline" name="category" type="select" value={form.category} onChange={fh} options={CATS}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><F label="Location" name="location" value={form.location} onChange={fh} placeholder="City, Country"/><F label="Experience" name="years_exp" value={form.years_exp} onChange={fh} placeholder="e.g. 5 years"/></div><F label="Skills" name="skillsRaw" value={form.skillsRaw} onChange={fh} placeholder="e.g. Figma, React"/><F label="Tools" name="toolsRaw" value={form.toolsRaw} onChange={fh} placeholder="e.g. Adobe Suite"/><F label="Contact Methods" name="contact_methods" value={form.contact_methods} onChange={fh} placeholder="e.g. Message on The Voryel"/><F label="Website" name="website" value={form.website} onChange={fh} placeholder="https://…"/></>}
              {!isF&&<><F label="Company / Brand" name="company" value={form.company} onChange={fh}/><F label="Location" name="location" value={form.location} onChange={fh} placeholder="City, Country"/></>}
              <Btn v="gold" onClick={save} disabled={saving}>{saving?"Saving…":"Save Changes"}</Btn>
            </div>}

            {tab==="portfolio"&&isF&&<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",fontWeight:300,color:C.white}}>Portfolio</h3>
                <Btn v="o" size="sm" onClick={()=>setAddP(!addP)}>{addP?"Cancel":"+ Add Work"}</Btn>
              </div>
              {addP&&<div style={{background:C.s2,border:`1px solid ${C.bA}`,padding:"18px",marginBottom:16,borderRadius:2}}><div style={{display:"flex",flexDirection:"column",gap:11}}><F label="Title" name="t" value={pf.title} onChange={e=>setPf(p=>({...p,title:e.target.value}))} placeholder="e.g. Brand identity for XYZ"/><F label="Link (optional)" name="u" value={pf.url} onChange={e=>setPf(p=>({...p,url:e.target.value}))} placeholder="https://…"/><F label="Description" name="d" type="textarea" value={pf.desc} onChange={e=>setPf(p=>({...p,desc:e.target.value}))} rows={2}/><Btn v="gold" size="sm" onClick={addPort} disabled={!pf.title.trim()||pSaving}>{pSaving?"Saving…":"Save Item"}</Btn></div></div>}
              {portfolio.length===0&&!addP?<div style={{textAlign:"center",padding:"44px 24px",border:`1px dashed ${C.b}`,borderRadius:2}}><p style={{fontSize:14,color:C.tx3,lineHeight:1.85}}>No portfolio items yet.<br/><em style={{color:C.gold}}>Click '+ Add Work' to get started.</em></p></div>
              :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>{portfolio.map((item,i)=><div key={i} style={{aspectRatio:"4/3",background:C.s2,border:`1px solid ${C.b}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:14,position:"relative",borderRadius:2}}>
                <button onClick={()=>removePort(i)} style={{position:"absolute",top:7,right:7,background:"rgba(128,0,32,.5)",border:"none",color:C.gold,width:19,height:19,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:2}}>✕</button>
                <div style={{fontSize:"1rem",color:C.gold,marginBottom:7}}>◈</div>
                <div style={{fontSize:12,fontWeight:600,color:C.white,textAlign:"center",marginBottom:4}}>{item.title}</div>
                {item.url&&<a href={item.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#6AABCC",textDecoration:"underline"}}>View →</a>}
                {item.desc&&<p style={{fontSize:11,color:C.tx2,textAlign:"center",lineHeight:1.6,marginTop:4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.desc}</p>}
              </div>)}{!addP&&<div style={{aspectRatio:"4/3",background:C.s2,border:`1px dashed ${C.b}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:2}} onClick={()=>setAddP(true)}><div style={{fontSize:"1.5rem",color:C.tx3}}>+</div><span style={{fontSize:11,color:C.tx3,marginTop:5}}>Add Work</span></div>}</div>}
            </div>}

            {tab==="rates"&&isF&&<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",fontWeight:300,color:C.white}}>Your Rates</h3>
                <Btn v="g" size="sm" onClick={()=>{setEditing(!editing);setSaveErr("");}}>{editing?"Cancel":"Edit"}</Btn>
              </div>
              {!editing?<div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"20px",borderRadius:2}}>{[["Type",user.price_type||"—"],["Starting Price",user.starting_price?`$${user.starting_price}`:"—"],["Hourly Rate",user.hourly_rate?`$${user.hourly_rate}/hr`:"—"],["Label",user.price_label||"—"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.b}`,fontSize:13}}><span style={{color:C.tx3}}>{l}</span><span style={{color:C.gold}}>{v}</span></div>)}<p style={{fontSize:12,color:C.tx3,marginTop:12,lineHeight:1.75}}>All pricing is agreed directly with clients via messaging.</p></div>
              :<div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{display:"flex",gap:7}}>{[["project","Per Project"],["hourly","Hourly"],["both","Both"]].map(([v,l])=><div key={v} onClick={()=>setForm(p=>({...p,price_type:v}))} style={{flex:1,padding:"8px",border:`1px solid ${form.price_type===v?C.burg:C.b}`,cursor:"pointer",textAlign:"center",background:form.price_type===v?"rgba(128,0,32,.25)":"transparent",borderRadius:2}}><span style={{fontSize:12,fontWeight:500,color:form.price_type===v?C.gold:C.tx2}}>{l}</span></div>)}</div>
                {(form.price_type==="project"||form.price_type==="both")&&<F label="Starting Price" name="starting_price" type="number" value={form.starting_price} onChange={fh} placeholder="e.g. 500"/>}
                {(form.price_type==="hourly"||form.price_type==="both")&&<F label="Hourly Rate" name="hourly_rate" type="number" value={form.hourly_rate} onChange={fh} placeholder="e.g. 75"/>}
                <F label="Custom Label" name="price_label" value={form.price_label} onChange={fh} placeholder='e.g. "from $500"'/>
                <Btn v="gold" onClick={save} disabled={saving}>{saving?"Saving…":"Update Rates"}</Btn>
              </div>}
            </div>}

            {tab==="needs"&&!isF&&<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",fontWeight:300,color:C.white}}>Project Needs</h3>
                <Btn v="g" size="sm" onClick={()=>{setEditing(!editing);setSaveErr("");}}>{editing?"Cancel":"Edit"}</Btn>
              </div>
              {!editing?<><p style={{fontSize:14,color:user.project_needs?C.tx:C.tx3,lineHeight:1.88,fontStyle:user.project_needs?"normal":"italic"}}>{user.project_needs||"No project needs added yet."}</p>{user.talent_interests&&<div style={{fontSize:13,color:C.tx,marginTop:12}}><span style={{color:C.gold,fontWeight:600}}>Looking for: </span>{user.talent_interests}</div>}</>
              :<div style={{display:"flex",flexDirection:"column",gap:12}}><F label="Project Needs" name="project_needs" type="textarea" value={form.project_needs} onChange={fh} rows={4}/><F label="Talent Interests" name="talent_interests" value={form.talent_interests} onChange={fh} placeholder="e.g. UI/UX Designer, Developer"/><Btn v="gold" onClick={save} disabled={saving}>{saving?"Saving…":"Save"}</Btn></div>}
            </div>}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"17px",borderRadius:2}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:C.gold,marginBottom:11}}>ACCOUNT</div>
              {[["Email",user.email],["Since",new Date(user.joined_at||Date.now()).getFullYear()],["Role",isF?"Professional":"Client"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.b}`,fontSize:12}}><span style={{color:C.tx3}}>{l}</span><span style={{color:C.tx,wordBreak:"break-all",textAlign:"right",maxWidth:140,fontSize:11}}>{v}</span></div>)}
            </div>
            {isF&&<div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"17px",borderRadius:2}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:C.gold,marginBottom:10}}>AVAILABILITY</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:form.open_to_work?C.green:"#888",boxShadow:form.open_to_work?`0 0 5px ${C.green}50`:"none"}}/>
                <span style={{fontSize:12.5,color:C.tx}}>{form.open_to_work?"Available":"Not available"}</span>
              </div>
            </div>}
            <div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"17px",borderRadius:2}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:C.gold,marginBottom:10}}>VERIFIED BADGE</div>
              {user.verified?<VBadge/>:<><p style={{fontSize:12,color:C.tx2,lineHeight:1.75,marginBottom:9}}>Apply for manual review to earn your Verified badge.</p><span style={{fontSize:10,fontWeight:700,padding:"3px 10px",background:C.goldD,border:`1px solid ${C.b}`,color:C.gold,borderRadius:2}}>Coming Soon</span></>}
            </div>
            <div style={{background:C.s1,border:`1px solid ${C.b}`,padding:"17px",borderRadius:2}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:C.gold,marginBottom:10}}>QUICK ACTIONS</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                <Btn v="p" size="sm" full onClick={()=>setPage("messages")}>Messages</Btn>
                <Btn v="g" size="sm" full onClick={()=>setPage(isF?"clients":"explore")}>{isF?"Browse Clients":"Browse Pros"}</Btn>
                <Btn v="g" size="sm" full onClick={()=>setPage("opps")}>Opportunities</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ─── LEGAL PAGES ──────────────────────────────────────────────── */
function Legal({setPage,type}) {
  const isTerms=type==="terms";
  const sections=isTerms?[
    ["1. Introduction","Welcome to The Voryel — a premium global digital network operated by Adetunji Ewaoluwa Destiny. By using The Voryel, you agree to these Terms in full."],
    ["2. What The Voryel Is","The Voryel is a professional networking platform for discovery, connection, and collaboration. It is not a marketplace, agency, or payment processor."],
    ["3. No Transaction Processing","The Voryel does not process, hold, or mediate any financial transactions. All pricing, payment, and project agreements are made directly between users. The Voryel accepts no liability for these arrangements."],
    ["4. User Responsibilities","Users are fully responsible for all agreements with other members, including scope, pricing, and delivery. Conduct yourselves professionally and respectfully at all times."],
    ["5. Verified Badge","Payment provides access to the review process only — not a guaranteed badge. The Voryel reserves the right to grant, withhold, or revoke the badge based on quality and conduct."],
    ["6. Prohibited Conduct","False profiles, harassment, fake reviews, spam, illegal activity, and impersonation are strictly prohibited and may result in account suspension."],
    ["7. IP & Content","Users retain ownership of their content. You grant The Voryel a limited licence to display it. IP for project deliverables is governed by the agreement between the parties."],
    ["8. Liability","To the fullest extent permitted by law, The Voryel is not liable for user-to-user disputes, financial losses, or platform downtime."],
    ["9. Contact",`Questions: ${VMAIL}. Do not use this email to hire professionals — use the platform's messaging system.`],
  ]:[
    ["Data We Collect","Name, email, profile info, portfolio, messages, and posts you create on The Voryel."],
    ["How We Use It","To operate your account, display your profile, power messaging and discovery, and improve the platform. Not for third-party ad targeting."],
    ["Data Sharing","We do not sell or rent your data. Your profile is publicly visible by design — it is a professional network."],
    ["Messaging","Messages are stored to deliver them and maintain history. We do not read or sell them."],
    ["Your Rights","You may access, correct, or delete your data at any time. Email us to request account deletion."],
    ["Security","We take reasonable measures to protect your data. No online system is 100% secure."],
    ["Contact",`For privacy matters: ${VMAIL}. We respond within 30 days.`],
  ];
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:58}}>
      <div style={{background:`linear-gradient(135deg,${C.burg},${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"56px 48px 44px",textAlign:"center"}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.22em",color:C.gold,marginBottom:10}}>LEGAL</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.4rem)",fontWeight:300,color:C.white,marginBottom:6}}>{isTerms?"Terms of Service":"Privacy Policy"}</h1>
        <Orn/>
        <p style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:C.tx3}}>LAST UPDATED: JANUARY 2026</p>
      </div>
      <div style={{maxWidth:740,margin:"0 auto",padding:"52px 48px 80px"}}>
        {sections.map(([t,b])=>(
          <div key={t} style={{marginBottom:40,paddingBottom:40,borderBottom:`1px solid ${C.b}`}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:400,color:C.white,marginBottom:10}}>{t}</h2>
            <p style={{fontSize:14,color:C.tx,lineHeight:1.88}}>{b}</p>
          </div>
        ))}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ─── CONTACT ──────────────────────────────────────────────────── */
function Contact({setPage}) {
  const [f,setF]=useState({name:"",email:"",subject:"",message:""});
  const [sent,setSent]=useState(false);
  const fh=e=>setF(p=>({...p,[e.target.name]:e.target.value}));
  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingTop:58}}>
      <div style={{background:`linear-gradient(135deg,${C.burg},${C.bg})`,borderBottom:`1px solid ${C.b}`,padding:"56px 48px 44px",textAlign:"center"}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.22em",color:C.gold,marginBottom:10}}>GET IN TOUCH</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.4rem)",fontWeight:300,color:C.white,marginBottom:6}}>Contact Us</h1>
        <Orn/>
        <p style={{fontSize:15,color:C.tx2,maxWidth:420,margin:"0 auto"}}>Support, partnerships, and business inquiries only.</p>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"56px 48px 80px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"start"}} className="two-col">
        <div>
          <div style={{fontSize:12,fontWeight:700,color:C.white,marginBottom:5}}>Official Email</div>
          <a href={`mailto:${VMAIL}`} style={{fontSize:15,color:C.gold,display:"block",marginBottom:24}}>{VMAIL}</a>
          <div style={{fontSize:12,fontWeight:700,color:C.white,marginBottom:5}}>Founder</div>
          <div style={{fontSize:15,color:C.tx,marginBottom:24}}>Adetunji Ewaoluwa Destiny</div>
          <div style={{fontSize:12,fontWeight:700,color:C.white,marginBottom:5}}>Response</div>
          <div style={{fontSize:15,color:C.tx,marginBottom:28}}>Within 48 hours</div>
          <div style={{background:"rgba(128,0,32,.1)",border:`1px solid ${C.burg}`,padding:"16px 18px",borderRadius:2}}>
            <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:7}}>⚠ IMPORTANT</div>
            <p style={{fontSize:13,color:C.tx,lineHeight:1.78}}>This email is for <strong style={{color:C.white}}>support, partnerships, and press only.</strong><br/><br/>Do <strong style={{color:C.red}}>NOT</strong> use it to hire professionals. Use <strong style={{color:C.white}}>The Voryel's messaging system</strong> for all professional contact.</p>
          </div>
        </div>
        <div style={{border:`1px solid ${C.b}`,padding:"26px",borderRadius:2}}>
          {sent?<div style={{textAlign:"center",padding:"36px 0"}}><div style={{opacity:.5,marginBottom:14,display:"flex",justifyContent:"center"}}><Logo size="sm"/></div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:C.gold,marginBottom:8,fontWeight:300}}>Message Received</div><p style={{fontSize:13.5,color:C.tx}}>We'll respond within 48 hours.</p><div style={{marginTop:16}}><Btn v="g" size="sm" onClick={()=>setSent(false)}>Send Another</Btn></div></div>
          :<><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:C.gold,marginBottom:16}}>SEND A MESSAGE</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}><F label="Name" name="name" value={f.name} onChange={fh} placeholder="Your name"/><F label="Email" name="email" type="email" value={f.email} onChange={fh} placeholder="your@email.com"/></div>
            <F label="Subject" name="subject" type="select" value={f.subject} onChange={fh} options={["Support / Bug Report","Partnership","Sponsorship","Press / Media","Privacy Request","Other"]}/>
            <F label="Message" name="message" type="textarea" value={f.message} onChange={fh} rows={5} placeholder="How can we help?"/>
            <Btn v="gold" full onClick={()=>f.name&&f.email&&f.subject&&f.message&&setSent(true)} disabled={!f.name||!f.email||!f.subject||!f.message}>Send Message</Btn>
          </div></>}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

/* ─── ROOT ─────────────────────────────────────────────────────── */
export default function App() {
  const [page,setPage]=useState("home");
  const [members,setMembers]=useState([]);
  const [me,setMe]=useState(null);
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);
  const [unread,setUnread]=useState(0);
  const [initRecip,setInitRecip]=useState(null);

  useEffect(()=>{seo();},[]);
  useEffect(()=>{db.profiles.all().then(d=>{if(Array.isArray(d))setMembers(d);}).catch(e=>console.error("[Load]",e)).finally(()=>setLoading(false));},[]);
  useEffect(()=>{try{window.scrollTo({top:0,behavior:"instant"});}catch(e){};},[page]);

  const onAuth=u=>{setMembers(p=>{const ex=p.find(x=>x.id===u.id);return ex?p.map(x=>x.id===u.id?u:x):[u,...p];});setMe(u);setToast({title:"Welcome to The Voryel",body:`Signed in as ${u.name}`});};
  const onLogout=()=>{setMe(null);setPage("home");setUnread(0);};
  const onUpdate=u=>{setMembers(p=>p.map(x=>x.id===u.id?u:x));setMe(p=>p?.id===u.id?u:p);};
  const onMsg=m=>{if(!me){setPage("signup");return;}setInitRecip(m);setPage("messages");};

  const noNav=["login","signup"].includes(page);
  const cp={setPage,members,loading,me,onMsg};

  return (
    <div style={{background:C.bg,color:C.tx,minHeight:"100vh"}}>
      <style>{CSS}</style>
      {!noNav&&<Nav page={page} setPage={setPage} me={me} onLogout={onLogout} unread={unread}/>}
      {page==="home"     &&<Home {...cp}/>}
      {page==="explore"  &&<Explore {...cp} type="pro"/>}
      {page==="clients"  &&<Explore {...cp} type="client"/>}
      {page==="collabs"  &&<Posts setPage={setPage} me={me} type="collab" setToast={setToast}/>}
      {page==="opps"     &&<Posts setPage={setPage} me={me} type="opps" setToast={setToast}/>}
      {page==="messages" &&<Messages me={me} members={members} setUnread={setUnread} initRecip={initRecip} setInitRecip={setInitRecip}/>}
      {page==="dashboard"&&me&&<Dashboard user={me} setPage={setPage} onUpdate={onUpdate} onMsg={onMsg}/>}
      {page==="dashboard"&&!me&&(()=>{setTimeout(()=>setPage("login"),0);return null;})()}
      {page==="terms"    &&<Legal setPage={setPage} type="terms"/>}
      {page==="privacy"  &&<Legal setPage={setPage} type="privacy"/>}
      {page==="contact"  &&<Contact setPage={setPage}/>}
      {page==="login"    &&<Auth mode="login" setPage={setPage} onAuth={onAuth}/>}
      {page==="signup"   &&<Auth mode="signup" setPage={setPage} onAuth={onAuth}/>}
      {toast&&<Toast title={toast.title} body={toast.body} onDone={()=>setToast(null)}/>}
    </div>
  );
}
