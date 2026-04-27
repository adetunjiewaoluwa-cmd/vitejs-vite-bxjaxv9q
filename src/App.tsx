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
  }
};

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

const CATS = ["Web Development","Web Design","Graphic Design","Video Editing","UI/UX Design","Programming"];
const initials = n => (n||"").trim().split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";
const AV_COLORS = [["#3D0B18","#7a1a2e"],["#0a1528","#1a3a6a"],["#1a0a28","#3e1a70"],["#0a2010","#1a5030"],["#200a08","#5a2010"],["#08182a","#104060"]];
const avColor = name => AV_COLORS[(name||"A").charCodeAt(0)%AV_COLORS.length];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#0C0407;color:#FAF8F5;font-family:'Cinzel',serif;overflow-x:hidden;}
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

function Logo({variant="md",onClick}) {
  const sizes={sm:[9,22],md:[11,30],lg:[15,54],xl:[18,72]}[variant]||[11,30];
  return (
    <div onClick={onClick} style={{cursor:onClick?"pointer":"default",display:"inline-flex",flexDirection:"column",alignItems:"center",userSelect:"none"}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:300,fontSize:sizes[0],letterSpacing:"0.52em",color:T.goldL,textTransform:"uppercase",lineHeight:1.3}}>The</span>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:sizes[1],letterSpacing:"0.13em",lineHeight:1,textTransform:"uppercase",background:`linear-gradient(135deg,${T.white} 0%,${T.goldP} 48%,${T.gold} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Voryel</span>
      <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3,width:"100%"}}>
        <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${T.burgM})`}}/>
        <div style={{width:3,height:3,background:T.gold,transform:"rotate(45deg)",flexShrink:0}}/>
        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${T.burgM},transparent)`}}/>
      </div>
    </div>
  );
}

function Avatar({name,size=48}) {
  const [c1,c2]=avColor(name||"A");
  return (
    <div style={{width:size,height:size,background:`linear-gradient(135deg,${c1},${c2})`,border:`1px solid ${T.border}`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:size*0.36,color:T.gold,lineHeight:1,fontWeight:300}}>{initials(name)}</span>
    </div>
  );
}

function Btn({children,onClick,variant="primary",size="md",full,disabled,type="button"}) {
  const pads={sm:"7px 16px",md:"11px 26px",lg:"14px 36px"}[size]||"11px 26px";
  const fszs={sm:9,md:10,lg:11}[size]||10;
  const vars={primary:{bg:T.burg,border:T.burgM,color:T.gold},ghost:{bg:"transparent",border:T.border,color:T.muted},outline:{bg:"transparent",border:T.borderA,color:T.gold}};
  const v=vars[variant]||vars.primary;
  return <button type={type} onClick={disabled?undefined:onClick} className="hov-btn" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'Cinzel',serif",fontSize:fszs,letterSpacing:"0.18em",padding:pads,background:v.bg,border:`1px solid ${v.border}`,color:v.color,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.4:1,width:full?"100%":"auto",whiteSpace:"nowrap"}}>{children}</button>;
}

function Field({label,name,type="text",value,onChange,placeholder,options,rows}) {
  const base={background:T.ghost,border:`1px solid ${T.border}`,color:T.white,fontFamily:"'Cormorant Garamond',serif",fontSize:15,padding:"11px 14px",outline:"none",width:"100%"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontFamily:"'Cinzel',serif",fontSize:8.5,letterSpacing:"0.28em",color:T.faint}}>{label}</label>}
      {type==="select"?<select name={name} value={value} onChange={onChange} style={{...base,cursor:"pointer",background:T.surfaceL,appearance:"none"}}><option value="">Select…</option>{options?.map(o=><option key={o} value={o}>{o}</option>)}</select>
      :type==="textarea"?<textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows||4} style={{...base,resize:"vertical"}}/>
      :<input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} style={base}/>}
    </div>
  );
}

function Tag({children,active}) {
  return <span style={{fontFamily:"'Cinzel',serif",fontSize:8.5,letterSpacing:"0.14em",padding:"3px 10px",background:active?"rgba(107,20,40,0.4)":T.ghost,border:`1px solid ${active?T.burg:T.border}`,color:active?T.goldL:T.faint,whiteSpace:"nowrap"}}>{children}</span>;
}

function Ornament() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",margin:"10px 0 36px"}}>
      <div style={{height:1,width:60,background:`linear-gradient(90deg,transparent,${T.burg})`}}/>
      <div style={{width:4,height:4,background:T.gold,transform:"rotate(45deg)"}}/>
      <div style={{height:1,width:60,background:`linear-gradient(90deg,${T.burg},transparent)`}}/>
    </div>
  );
}

function Spinner() {
  return <div style={{width:32,height:32,border:`2px solid ${T.border}`,borderTop:`2px solid ${T.gold}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"40px auto"}}/>;
}

function EmptyState({title,sub,cta,onCta}) {
  return (
    <div style={{textAlign:"center",padding:"80px 24px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{width:56,height:56,border:`1px solid ${T.border}`,transform:"rotate(45deg)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28}}>
        <span style={{transform:"rotate(-45deg)",fontSize:22}}>◈</span>
      </div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:T.white,letterSpacing:"0.04em",marginBottom:12}}>{title}</div>
      <p style={{fontSize:13,color:T.muted,fontWeight:300,maxWidth:340,lineHeight:1.85,marginBottom:28}}>{sub}</p>
      {cta&&<Btn onClick={onCta}>{cta}</Btn>}
    </div>
  );
}

function ConnectModal({to,from,onClose}) {
  const [f,setF]=useState({name:from?.name||"",email:from?.email||"",msg:""});
  const [sent,setSent]=useState(false);
  const ok=f.name&&f.email&&f.msg;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:24}} onClick={onClose}>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,padding:36,maxWidth:420,width:"100%",position:"relative"}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:T.faint,cursor:"pointer",fontSize:22}}>×</button>
        {sent?(
          <div style={{textAlign:"center",padding:"32px 0"}}>
            <div style={{fontSize:34,marginBottom:16}}>✦</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:T.gold,marginBottom:10}}>Message Sent</div>
            <p style={{fontSize:13,color:T.muted,lineHeight:1.8}}>Your message was delivered to <strong style={{color:T.white}}>{to?.name}</strong>.</p>
            <div style={{marginTop:22}}><Btn variant="ghost" size="sm" onClick={onClose}>CLOSE</Btn></div>
          </div>
        ):(
          <>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:T.white,marginBottom:22,fontWeight:300}}>Message {to?.name?.split(" ")[0]}</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Field label="YOUR NAME" name="name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Your full name"/>
              <Field label="YOUR EMAIL" name="email" type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="your@email.com"/>
              <Field label="MESSAGE" name="msg" type="textarea" value={f.msg} onChange={e=>setF({...f,msg:e.target.value})} placeholder={`Say hello to ${to?.name?.split(" ")[0]}…`} rows={4}/>
              <Btn full onClick={()=>ok&&setSent(true)} disabled={!ok}>SEND MESSAGE</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Nav({page,setPage,user,onLogout}) {
  const [sc,setSc]=useState(false);
  useEffect(()=>{const fn=()=>setSc(window.scrollY>20);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:400,height:68,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 48px",background:sc?"rgba(12,4,7,0.97)":"transparent",backdropFilter:sc?"blur(20px)":"none",borderBottom:sc?`1px solid ${T.border}`:"none",transition:"all 0.35s ease"}}>
      <Logo variant="md" onClick={()=>setPage("home")}/>
      <div style={{display:"flex",gap:36}}>
        {[["home","Home"],["network","Network"],["contact","Contact"]].map(([id,label])=>(
          <button key={id} onClick={()=>setPage(id)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.2em",color:page===id?T.gold:T.muted,borderBottom:page===id?`1px solid ${T.gold}`:"1px solid transparent",paddingBottom:2,transition:"color 0.2s"}}>{label}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {user?(
          <>
            <button onClick={()=>setPage("dashboard")} style={{display:"flex",alignItems:"center",gap:9,background:"none",border:`1px solid ${T.border}`,padding:"6px 14px 6px 8px",cursor:"pointer",transition:"border-color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderA} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <Avatar name={user.name} size={26}/>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.14em",color:T.muted}}>{user.name.split(" ")[0].toUpperCase()}</span>
            </button>
            <Btn size="sm" variant="ghost" onClick={onLogout}>LOG OUT</Btn>
          </>
        ):(
          <>
            <Btn size="sm" variant="ghost" onClick={()=>setPage("login")}>LOGIN</Btn>
            <Btn size="sm" onClick={()=>setPage("signup")}>JOIN</Btn>
          </>
        )}
      </div>
    </nav>
  );
}

function Footer({setPage}) {
  return (
    <footer style={{background:`linear-gradient(180deg,${T.bg},rgba(61,11,24,0.15))`,borderTop:`1px solid ${T.border}`,padding:"52px 48px 28px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1.8fr 1fr 1fr 1fr",gap:40,marginBottom:44,maxWidth:1100,margin:"0 auto 40px"}}>
        <div>
          <Logo variant="sm"/>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.muted,marginTop:16,lineHeight:1.9,fontWeight:300,maxWidth:240}}>A premium global network for digital creators, thinkers, and visionaries.</p>
          <div style={{fontSize:12,color:T.faint,marginTop:12}}>thevoryel@gmail.com</div>
        </div>
        {[["NETWORK",[["Explore","network"],["Sign Up","signup"],["Login","login"]]],["CATEGORIES",CATS.slice(0,4).map(c=>[c,"network"])],["COMPANY",[["About","home"],["Contact","contact"]]]].map(([title,links])=>(
          <div key={title}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:8.5,letterSpacing:"0.3em",color:T.gold,marginBottom:16}}>{title}</div>
            {links.map(([label,pg])=>(
              <div key={label} onClick={()=>setPage(pg)} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.muted,fontWeight:300,marginBottom:9,cursor:"pointer"}}>{label}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",borderTop:`1px solid ${T.border}`,paddingTop:20,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,color:T.faint,fontWeight:300}}>© 2025 The Voryel · Founded by Adetunji Ewaoluwa Destiny</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.3em",color:T.faint}}>YOUR VISION, OUR FLOW</div>
      </div>
    </footer>
  );
}

function MemberCard({u,onClick}) {
  return (
    <div onClick={()=>onClick(u)} className="hov-card" style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:2,padding:"22px",cursor:"pointer"}}>
      <div style={{display:"flex",gap:14,marginBottom:14}}>
        <Avatar name={u.name} size={52}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:T.white,fontWeight:400,letterSpacing:"0.03em",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,color:T.muted,fontWeight:300,marginBottom:7,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.headline||u.category||"Member"}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {u.category&&<Tag active>{u.category}</Tag>}
            {u.open&&<Tag>OPEN TO CONNECT</Tag>}
          </div>
        </div>
      </div>
      {u.bio&&<p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.faint,lineHeight:1.75,fontWeight:300,marginBottom:14,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{u.bio}</p>}
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14,minHeight:24}}>
        {u.skills?.slice(0,3).map(s=><span key={s} style={{fontFamily:"'Cinzel',serif",fontSize:8,padding:"3px 8px",border:`1px solid ${T.border}`,color:T.faint,letterSpacing:"0.08em"}}>{s}</span>)}
        {u.skills?.length>3&&<span style={{fontFamily:"'Cinzel',serif",fontSize:8,padding:"3px 8px",border:`1px solid ${T.border}`,color:T.faint}}>+{u.skills.length-3}</span>}
      </div>
      <div style={{borderTop:`1px solid ${T.border}`,paddingTop:12,display:"flex",justifyContent:"space-between"}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:12,color:T.faint,fontWeight:300}}>📍 {u.location||"Worldwide"}</span>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.2em",color:T.gold,opacity:0.6}}>VIEW →</span>
      </div>
    </div>
  );
}

function Home({setPage,members,loading}) {
  return (
    <div style={{background:T.bg,minHeight:"100vh"}}>
      <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",overflow:"hidden",padding:"80px 24px 60px"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 90% 60% at 50% 42%,${T.burgD},${T.bg} 66%)`}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(201,168,76,0.04) 1px,transparent 1px)",backgroundSize:"38px 38px"}}/>
        <div style={{position:"absolute",top:"18%",left:"8%",width:400,height:400,background:"radial-gradient(circle,rgba(107,20,40,0.2),transparent 70%)",borderRadius:"50%",filter:"blur(60px)"}}/>
        <div style={{position:"relative",maxWidth:700}}>
          <div className="vu d1"><Logo variant="xl"/></div>
          <p className="vu d2" style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:21,color:T.muted,marginTop:22,letterSpacing:"0.1em",fontWeight:300}}>Your Vision, Our Flow</p>
          <p className="vu d3" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:T.faint,maxWidth:520,margin:"16px auto 40px",lineHeight:2,fontWeight:300}}>The premium digital network where creators, developers, and visionaries come together. Present your work. Discover others. Connect meaningfully.</p>
          <div className="vu d4" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <Btn size="lg" onClick={()=>setPage("network")}>EXPLORE THE NETWORK</Btn>
            <Btn size="lg" variant="ghost" onClick={()=>setPage("signup")}>JOIN THE VORYEL</Btn>
          </div>
        </div>
        <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.32em",color:T.faint}}>SCROLL</span>
          <div style={{width:1,height:28,background:`linear-gradient(180deg,${T.gold},transparent)`}}/>
        </div>
      </section>

      <section style={{borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:"36px 48px"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
          {[[loading?"…":members.length,"Members"],["6","Categories"],["Global","Reach"],["Free","To Join"]].map(([n,l],i)=>(
            <div key={l} style={{textAlign:"center",borderRight:i<3?`1px solid ${T.border}`:"none",padding:"4px 0"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,color:T.gold,lineHeight:1,fontWeight:300}}>{n}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:T.muted,marginTop:7,letterSpacing:"0.1em"}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:"80px 48px",borderBottom:`1px solid ${T.border}`,background:`linear-gradient(180deg,${T.bg},rgba(61,11,24,0.12),${T.bg})`}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.38em",color:T.gold,marginBottom:14}}>THE PLATFORM</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:44,fontWeight:300,color:T.white,letterSpacing:"0.04em",lineHeight:1.1}}>One Network. Every Voice Equal.</h2>
            <Ornament/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {[{n:"01",t:"Create Your Profile",b:"Build a rich presence that goes beyond a résumé. Showcase your skills, portfolio, and identity to the world."},{n:"02",t:"Discover Others",b:"Explore a curated network of digital creators across six categories. Find the people whose work resonates with you."},{n:"03",t:"Connect & Collaborate",b:"Reach out directly. Start conversations. Build relationships that lead to meaningful creative collaboration."}].map(c=>(
              <div key={c.n} style={{border:`1px solid ${T.border}`,padding:"32px 28px",background:T.ghost}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:36,color:T.burg,marginBottom:16,lineHeight:1}}>{c.n}</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:400,color:T.white,marginBottom:12,letterSpacing:"0.03em"}}>{c.t}</h3>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.muted,lineHeight:1.85,fontWeight:300}}>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {members.length>0&&(
        <section style={{padding:"80px 48px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.38em",color:T.gold,marginBottom:14}}>RECENTLY JOINED</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:300,color:T.white,letterSpacing:"0.04em"}}>Members of The Voryel</h2>
              <Ornament/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:18}}>
              {members.slice(0,4).map(u=><MemberCard key={u.id} u={u} onClick={()=>setPage("network")}/>)}
            </div>
            <div style={{textAlign:"center",marginTop:38}}><Btn variant="ghost" onClick={()=>setPage("network")}>VIEW ALL MEMBERS</Btn></div>
          </div>
        </section>
      )}

      <section style={{textAlign:"center",padding:"100px 48px"}}>
        <div style={{maxWidth:520,margin:"0 auto"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.38em",color:T.gold,marginBottom:20}}>BEGIN YOUR JOURNEY</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,color:T.white,letterSpacing:"0.04em",lineHeight:1.15,marginBottom:20}}>Your next great connection starts here.</h2>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:T.muted,lineHeight:1.9,marginBottom:40,fontWeight:300}}>Join a growing network of digital creators and visionaries. Present your work, explore others, and build something extraordinary.</p>
          <Btn size="lg" onClick={()=>setPage("signup")}>CREATE YOUR PROFILE</Btn>
        </div>
      </section>
      <Footer setPage={setPage}/>
    </div>
  );
}

function Network({setPage,setViewUser,members,loading}) {
  const [cat,setCat]=useState("All");
  const [q,setQ]=useState("");
  const filtered=members.filter(u=>{
    if(q&&!u.name.toLowerCase().includes(q.toLowerCase())&&!(u.headline||"").toLowerCase().includes(q.toLowerCase())) return false;
    if(cat!=="All"&&u.category!==cat) return false;
    return true;
  });
  return (
    <div style={{background:T.bg,minHeight:"100vh",paddingTop:68}}>
      <div style={{background:`linear-gradient(135deg,${T.burgD},${T.bg})`,borderBottom:`1px solid ${T.border}`,padding:"56px 48px 44px"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.38em",color:T.gold,marginBottom:14}}>THE NETWORK</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:300,color:T.white,letterSpacing:"0.04em",lineHeight:1,marginBottom:22}}>Explore Members</h1>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or skill…" style={{background:T.ghost,border:`1px solid ${T.border}`,color:T.white,fontFamily:"'Cormorant Garamond',serif",fontSize:15,padding:"10px 16px",outline:"none",flex:1,minWidth:200,maxWidth:360}}/>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 48px 80px"}}>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:30}}>
          {["All",...CATS].map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{fontFamily:"'Cinzel',serif",fontSize:8.5,letterSpacing:"0.14em",padding:"7px 14px",background:cat===c?T.burg:"transparent",border:`1px solid ${cat===c?T.burg:T.border}`,color:cat===c?T.gold:T.muted,cursor:"pointer",transition:"all 0.2s"}}>{c}</button>
          ))}
        </div>
        {loading?<Spinner/>:filtered.length===0?(
          <EmptyState title="No members yet — be the first to join The Voryel" sub="The network is just getting started. Create your profile and be part of something premium from the very beginning." cta="CREATE YOUR PROFILE" onCta={()=>setPage("signup")}/>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
            {filtered.map(u=><MemberCard key={u.id} u={u} onClick={u=>{setViewUser(u);setPage("profile");}}/>)}
          </div>
        )}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

function ProfilePage({setPage,user,currentUser,onUpdate}) {
  const u=user;
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState(false);
  const [ed,setEd]=useState({...u,skillsRaw:u?.skills?.join(", ")||"",toolsRaw:u?.tools?.join(", ")||""});
  const [saving,setSaving]=useState(false);
  const isOwn=currentUser?.id===u?.id;
  if(!u) return null;
  const h=e=>setEd({...ed,[e.target.name]:e.target.value});
  const save=async()=>{
    setSaving(true);
    const skills=ed.skillsRaw?ed.skillsRaw.split(",").map(s=>s.trim()).filter(Boolean):[];
    const tools=ed.toolsRaw?ed.toolsRaw.split(",").map(s=>s.trim()).filter(Boolean):[];
    const updated={...ed,skills,tools};
    await db.update(u.id,{name:updated.name,headline:updated.headline,category:updated.category,location:updated.location,bio:updated.bio,skills,tools,open:updated.open});
    onUpdate(updated);
    setEditing(false);
    setSaving(false);
  };
  return (
    <div style={{background:T.bg,minHeight:"100vh",paddingTop:68}}>
      <div style={{position:"relative",background:`linear-gradient(135deg,${T.burgD},${T.bg})`,borderBottom:`1px solid ${T.border}`,padding:"60px 48px 48px",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:"10%",width:320,height:320,background:"radial-gradient(circle,rgba(107,20,40,0.22),transparent 70%)",borderRadius:"50%",filter:"blur(55px)"}}/>
        <div style={{maxWidth:900,margin:"0 auto",position:"relative"}}>
          <button onClick={()=>setPage("network")} style={{background:"none",border:"none",color:T.faint,cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.16em",marginBottom:24,padding:0}}>← BACK</button>
          <div style={{display:"flex",gap:30,alignItems:"flex-start",flexWrap:"wrap"}}>
            <Avatar name={u.name} size={96}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
                {u.category&&<Tag active>{u.category}</Tag>}
                {u.open&&<Tag>OPEN TO CONNECT</Tag>}
              </div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:50,fontWeight:300,color:T.white,letterSpacing:"0.04em",lineHeight:1,marginBottom:7}}>{u.name}</h1>
              {u.headline&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.muted,marginBottom:5,fontWeight:300}}>{u.headline}</div>}
              {u.location&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,color:T.faint,marginBottom:16,fontWeight:300}}>📍 {u.location}</div>}
              {u.bio&&<p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:17,color:T.muted,lineHeight:1.8,maxWidth:540,fontWeight:300}}>"{u.bio}"</p>}
            </div>
            <div>{isOwn?<Btn size="sm" variant="outline" onClick={()=>setEditing(!editing)}>{editing?"CANCEL":"EDIT PROFILE"}</Btn>:<Btn size="sm" onClick={()=>setModal(true)}>CONNECT</Btn>}</div>
          </div>
        </div>
      </div>

      {editing&&(
        <div style={{maxWidth:680,margin:"24px auto 0",padding:"28px",border:`1px solid ${T.border}`,background:"rgba(107,20,40,0.07)"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.25em",color:T.gold,marginBottom:18}}>EDIT YOUR PROFILE</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="FULL NAME" name="name" value={ed.name||""} onChange={h} placeholder="Your name"/>
            <Field label="LOCATION" name="location" value={ed.location||""} onChange={h} placeholder="City, Country"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="HEADLINE" name="headline" value={ed.headline||""} onChange={h} placeholder="e.g. UI Designer"/>
            <Field label="CATEGORY" name="category" type="select" value={ed.category||""} onChange={h} options={CATS}/>
          </div>
          <div style={{marginBottom:12}}><Field label="BIO" name="bio" type="textarea" value={ed.bio||""} onChange={h} placeholder="Your story…" rows={3}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="SKILLS (comma-separated)" name="skillsRaw" value={ed.skillsRaw||""} onChange={h} placeholder="e.g. Figma, React"/>
            <Field label="TOOLS (comma-separated)" name="toolsRaw" value={ed.toolsRaw||""} onChange={h} placeholder="e.g. VS Code"/>
          </div>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <Btn size="sm" onClick={save} disabled={saving}>{saving?"SAVING…":"SAVE CHANGES"}</Btn>
            <Btn size="sm" variant="ghost" onClick={()=>setEditing(false)}>CANCEL</Btn>
          </div>
        </div>
      )}

      <div style={{maxWidth:900,margin:"0 auto",padding:"48px 48px 80px",display:"grid",gridTemplateColumns:isOwn?"1fr":"1fr 280px",gap:44,alignItems:"start"}}>
        <div>
          {u.skills?.length>0&&<div style={{marginBottom:40}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.26em",color:T.gold,marginBottom:16}}>SKILLS</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{u.skills.map(s=><span key={s} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,padding:"6px 16px",border:`1px solid ${T.border}`,color:T.muted,fontWeight:300}}>{s}</span>)}</div></div>}
          {u.tools?.length>0&&<div style={{marginBottom:40}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.26em",color:T.gold,marginBottom:16}}>TOOLS</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{u.tools.map(t=><span key={t} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,padding:"6px 16px",border:`1px solid rgba(107,20,40,0.5)`,color:T.muted,background:"rgba(107,20,40,0.1)",fontWeight:300}}>{t}</span>)}</div></div>}
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.26em",color:T.gold,marginBottom:16}}>PORTFOLIO & WORK</div>
            {u.portfolio?.length>0?(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {u.portfolio.map((p,i)=>(
                  <div key={i} style={{border:`1px solid ${T.border}`,padding:"22px",background:T.ghost}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.2em",color:T.gold,marginBottom:8}}>{p.type||"PROJECT"}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:T.white,marginBottom:8,fontWeight:400}}>{p.title}</div>
                    {p.description&&<p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.faint,lineHeight:1.75,fontWeight:300}}>{p.description}</p>}
                  </div>
                ))}
              </div>
            ):(
              <div style={{border:`1px dashed ${T.border}`,padding:"36px",textAlign:"center"}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:T.faint,fontWeight:300}}>{isOwn?"Edit your profile to add portfolio projects.":"No portfolio items added yet."}</p>
              </div>
            )}
          </div>
        </div>
        {!isOwn&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{border:`1px solid ${T.border}`,padding:"26px",background:"rgba(107,20,40,0.08)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:T.white,marginBottom:10,fontWeight:300}}>Connect with {u.name.split(" ")[0]}</div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.faint,lineHeight:1.8,marginBottom:20,fontWeight:300}}>Send a direct message to start a conversation.</p>
              <Btn full onClick={()=>setModal(true)}>SEND MESSAGE</Btn>
            </div>
            <div style={{border:`1px solid ${T.border}`,padding:"22px",background:T.ghost}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:8.5,letterSpacing:"0.24em",color:T.gold,marginBottom:14}}>MEMBER INFO</div>
              {[u.category&&["Category",u.category],u.location&&["Location",u.location],u.open!==undefined&&["Status",u.open?"Open to connect":"Not connecting"],["Joined",new Date(u.joined_at).toLocaleDateString("en-US",{month:"long",year:"numeric"})]].filter(Boolean).map(([label,val])=>(
                <div key={label} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.muted,marginBottom:9,fontWeight:300}}><span style={{color:T.faint}}>{label}:</span> {val}</div>
              ))}
            </div>
          </div>
        )}
      </div>
      {modal&&<ConnectModal to={u} from={currentUser} onClose={()=>setModal(false)}/>}
      <Footer setPage={setPage}/>
    </div>
  );
}

function Dashboard({user,setPage,setViewUser}) {
  return (
    <div style={{background:T.bg,minHeight:"100vh",paddingTop:68}}>
      <div style={{background:`linear-gradient(135deg,${T.burgD},${T.bg})`,borderBottom:`1px solid ${T.border}`,padding:"52px 48px 40px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.32em",color:T.gold,marginBottom:14}}>DASHBOARD</div>
          <div style={{display:"flex",alignItems:"center",gap:22}}>
            <Avatar name={user.name} size={74}/>
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:300,color:T.white,letterSpacing:"0.04em",lineHeight:1}}>Welcome, {user.name.split(" ")[0]}.</h1>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:T.muted,marginTop:7,fontWeight:300}}>{user.headline||user.category||"Member of The Voryel"}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:860,margin:"0 auto",padding:"44px 48px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
          {[{icon:"◈",title:"View My Profile",sub:"See your public profile",action:()=>{setViewUser(user);setPage("profile");}},{icon:"◎",title:"Explore Network",sub:"Browse all members",action:()=>setPage("network")},{icon:"✦",title:"Edit Profile",sub:"Update your details",action:()=>{setViewUser(user);setPage("profile");}},{icon:"✉",title:"Contact Voryel",sub:"Reach our team",action:()=>setPage("contact")}].map(c=>(
            <div key={c.title} onClick={c.action} style={{border:`1px solid ${T.border}`,padding:"24px",cursor:"pointer",background:T.ghost,transition:"all 0.25s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderA;e.currentTarget.style.background="rgba(107,20,40,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.ghost;}}>
              <div style={{fontSize:24,marginBottom:12}}>{c.icon}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.12em",color:T.white,marginBottom:6}}>{c.title}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,color:T.faint,fontWeight:300}}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

function Auth({mode,setPage,onAuth,members}) {
  const isLogin=mode==="login";
  const [step,setStep]=useState(1);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [d,setD]=useState({name:"",email:"",password:"",headline:"",category:"",location:"",bio:"",skillsRaw:"",toolsRaw:"",open:true});
  const h=e=>setD({...d,[e.target.name]:e.target.value});

  const doLogin=async e=>{
    e.preventDefault();
    setLoading(true);
    setErr("");
    const found=await db.getByEmail(d.email);
    if(!found||found.password!==d.password){setErr("Incorrect email or password.");setLoading(false);return;}
    onAuth(found);setPage("dashboard");setLoading(false);
  };

  const doSignup=async()=>{
    if(!d.name||!d.email||!d.password){setErr("Please fill all required fields.");return;}
    setLoading(true);setErr("");
    const existing=await db.getByEmail(d.email);
    if(existing){setErr("An account with this email already exists.");setLoading(false);return;}
    const skills=d.skillsRaw?d.skillsRaw.split(",").map(s=>s.trim()).filter(Boolean):[];
    const tools=d.toolsRaw?d.toolsRaw.split(",").map(s=>s.trim()).filter(Boolean):[];
    const result=await db.insert({name:d.name,email:d.email,password:d.password,headline:d.headline,category:d.category,location:d.location,bio:d.bio,skills,tools,open:d.open,portfolio:[]});
    if(result&&result[0]){onAuth(result[0]);setPage("dashboard");}
    else{setErr("Something went wrong. Please try again.");}
    setLoading(false);
  };

  return (
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 24px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,background:`radial-gradient(ellipse 75% 62% at 50% 50%,${T.burgD},${T.bg} 70%)`}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"radial-gradient(rgba(201,168,76,0.04) 1px,transparent 1px)",backgroundSize:"36px 36px"}}/>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:460}}>
        <div style={{textAlign:"center",marginBottom:36,cursor:"pointer"}} onClick={()=>setPage("home")}><Logo variant="lg"/></div>
        <div style={{border:`1px solid ${T.border}`,background:"rgba(12,4,7,0.92)",backdropFilter:"blur(24px)",padding:"38px"}}>
          {!isLogin&&step>1&&<div style={{display:"flex",gap:4,marginBottom:24}}>{[1,2,3].map(n=><div key={n} style={{flex:1,height:2,background:n<=step?T.burg:T.border,transition:"background 0.3s"}}/>)}</div>}
          {err&&<div style={{background:"rgba(107,20,40,0.3)",border:`1px solid ${T.burg}`,color:T.goldL,fontFamily:"'Cormorant Garamond',serif",fontSize:14,padding:"10px 14px",marginBottom:18,textAlign:"center"}}>{err}</div>}

          {isLogin&&(
            <>
              <div style={{textAlign:"center",marginBottom:26}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:"0.22em",color:T.gold,marginBottom:7}}>SIGN IN</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:T.faint,fontWeight:300}}>Welcome back to The Voryel</div>
              </div>
              <form onSubmit={doLogin} style={{display:"flex",flexDirection:"column",gap:14}}>
                <Field label="EMAIL" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com"/>
                <Field label="PASSWORD" name="password" type="password" value={d.password} onChange={h} placeholder="••••••••"/>
                <div style={{marginTop:4}}><Btn type="submit" full size="md" disabled={loading}>{loading?"SIGNING IN…":"SIGN IN"}</Btn></div>
              </form>
              <div style={{textAlign:"center",marginTop:18,fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.faint,fontWeight:300}}>
                No account? <span onClick={()=>setPage("signup")} style={{color:T.goldL,cursor:"pointer"}}>Join The Voryel</span>
              </div>
            </>
          )}

          {!isLogin&&step===1&&(
            <>
              <div style={{textAlign:"center",marginBottom:26}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:"0.22em",color:T.gold,marginBottom:7}}>CREATE ACCOUNT</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:T.faint,fontWeight:300}}>Join the premium digital network</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Field label="FULL NAME *" name="name" value={d.name} onChange={h} placeholder="Your full name"/>
                <Field label="EMAIL *" name="email" type="email" value={d.email} onChange={h} placeholder="your@email.com"/>
                <Field label="PASSWORD *" name="password" type="password" value={d.password} onChange={h} placeholder="Create a strong password"/>
              </div>
              <div style={{marginTop:18}}><Btn full onClick={()=>{if(!d.name||!d.email||!d.password){setErr("Fill all required fields.");return;}setErr("");setStep(2);}}>CONTINUE →</Btn></div>
              <div style={{textAlign:"center",marginTop:16,fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.faint,fontWeight:300}}>Already a member? <span onClick={()=>setPage("login")} style={{color:T.goldL,cursor:"pointer"}}>Sign in</span></div>
            </>
          )}

          {!isLogin&&step===2&&(
            <>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.26em",color:T.gold,marginBottom:18}}>YOUR IDENTITY</div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Field label="HEADLINE" name="headline" value={d.headline} onChange={h} placeholder="e.g. UI Designer & Creative Director"/>
                <Field label="PRIMARY CATEGORY" name="category" type="select" value={d.category} onChange={h} options={CATS}/>
                <Field label="LOCATION" name="location" value={d.location} onChange={h} placeholder="City, Country"/>
                <Field label="BIO" name="bio" type="textarea" value={d.bio} onChange={h} placeholder="Tell the world who you are…" rows={3}/>
              </div>
              <div style={{display:"flex",gap:10,marginTop:18}}>
                <Btn size="sm" variant="ghost" onClick={()=>{setStep(1);setErr("");}}>BACK</Btn>
                <Btn size="sm" onClick={()=>{setErr("");setStep(3);}}>CONTINUE →</Btn>
              </div>
            </>
          )}

          {!isLogin&&step===3&&(
            <>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.26em",color:T.gold,marginBottom:18}}>SKILLS & WORK</div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Field label="SKILLS (comma-separated)" name="skillsRaw" value={d.skillsRaw} onChange={h} placeholder="e.g. Figma, React, Brand Design"/>
                <Field label="TOOLS (comma-separated)" name="toolsRaw" value={d.toolsRaw} onChange={h} placeholder="e.g. Adobe Suite, VS Code"/>
                <div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:8.5,letterSpacing:"0.22em",color:T.faint,marginBottom:8}}>OPEN TO CONNECT?</div>
                  <div style={{display:"flex",gap:8}}>
                    {[[true,"Yes — Let's Connect"],[false,"Not Right Now"]].map(([val,label])=>(
                      <div key={String(val)} onClick={()=>setD({...d,open:val})} style={{flex:1,padding:"9px",border:`1px solid ${d.open===val?T.burg:T.border}`,cursor:"pointer",textAlign:"center",background:d.open===val?"rgba(107,20,40,0.25)":"transparent",transition:"all 0.2s"}}>
                        <span style={{fontFamily:"'Cinzel',serif",fontSize:8.5,letterSpacing:"0.08em",color:d.open===val?T.gold:T.muted}}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:10,marginTop:18}}>
                <Btn size="sm" variant="ghost" onClick={()=>{setStep(2);setErr("");}}>BACK</Btn>
                <Btn size="sm" onClick={doSignup} disabled={loading}>{loading?"CREATING…":"CREATE PROFILE →"}</Btn>
              </div>
            </>
          )}
        </div>
        <button onClick={()=>setPage("home")} style={{display:"block",margin:"18px auto 0",background:"none",border:"none",color:T.faint,fontFamily:"'Cinzel',serif",fontSize:8.5,letterSpacing:"0.18em",cursor:"pointer"}}>← BACK TO HOME</button>
      </div>
    </div>
  );
}

function Contact({setPage}) {
  const [f,setF]=useState({name:"",email:"",subject:"",message:""});
  const [sent,setSent]=useState(false);
  const h=e=>setF({...f,[e.target.name]:e.target.value});
  const ok=f.name&&f.email&&f.subject&&f.message;
  return (
    <div style={{background:T.bg,minHeight:"100vh",paddingTop:68}}>
      <div style={{background:`linear-gradient(135deg,${T.burgD},${T.bg})`,borderBottom:`1px solid ${T.border}`,padding:"60px 48px 48px",textAlign:"center"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.38em",color:T.gold,marginBottom:14}}>GET IN TOUCH</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:300,color:T.white,letterSpacing:"0.04em",marginBottom:12}}>Contact Us</h1>
        <Ornament/>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:T.muted,fontWeight:300,maxWidth:440,margin:"0 auto",lineHeight:1.9}}>Questions, partnerships, or feedback — we'd love to hear from you.</p>
      </div>
      <div style={{maxWidth:960,margin:"0 auto",padding:"64px 48px 80px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"start"}}>
        <div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.26em",color:T.gold,marginBottom:26}}>REACH US DIRECTLY</div>
          {[["Official Email","thevoryel@gmail.com"],["Founder","Adetunji Ewaoluwa Destiny"],["Response Time","Within 48 hours"],["Platform","Free to join — now live"]].map(([l,v])=>(
            <div key={l} style={{paddingBottom:18,marginBottom:18,borderBottom:`1px solid ${T.border}`}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:8.5,color:T.faint,letterSpacing:"0.16em",marginBottom:5}}>{l}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:T.muted,fontWeight:300}}>{v}</div>
            </div>
          ))}
          <div style={{padding:"24px",border:`1px solid ${T.border}`,background:"rgba(107,20,40,0.08)"}}>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:16,color:T.muted,lineHeight:1.85,fontWeight:300}}>"Your Vision, Our Flow — we exist to bridge the gap between great minds and meaningful digital collaboration."</p>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:8.5,color:T.faint,marginTop:12,letterSpacing:"0.12em"}}>— Adetunji Ewaoluwa Destiny, Founder</div>
          </div>
        </div>
        <div style={{border:`1px solid ${T.border}`,background:T.ghost,padding:"32px"}}>
          {sent?(
            <div style={{textAlign:"center",padding:"44px 0"}}>
              <div style={{fontSize:36,marginBottom:16}}>✦</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:T.gold,marginBottom:10,fontWeight:300}}>Message Received</div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:T.muted,lineHeight:1.8,fontWeight:300}}>Thank you. We'll respond within 48 hours.</p>
              <div style={{marginTop:22}}><Btn size="sm" variant="ghost" onClick={()=>setSent(false)}>SEND ANOTHER</Btn></div>
            </div>
          ):(
            <>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.2em",color:T.gold,marginBottom:22}}>SEND A MESSAGE</div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <Field label="NAME" name="name" value={f.name} onChange={h} placeholder="Your name"/>
                  <Field label="EMAIL" name="email" type="email" value={f.email} onChange={h} placeholder="your@email.com"/>
                </div>
                <Field label="SUBJECT" name="subject" type="select" value={f.subject} onChange={h} options={["General Inquiry","Partnership","Press","Join The Network","Feedback","Other"]}/>
                <Field label="MESSAGE" name="message" type="textarea" value={f.message} onChange={h} placeholder="How can we help?" rows={5}/>
                <Btn full onClick={()=>ok&&setSent(true)} disabled={!ok}>SEND MESSAGE</Btn>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
}

export default function TheVoryel() {
  const [page,setPage]=useState("home");
  const [members,setMembers]=useState([]);
  const [me,setMe]=useState(null);
  const [viewUser,setViewUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    db.getAll().then(data=>{
      if(Array.isArray(data)) setMembers(data);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  useEffect(()=>{try{window.scrollTo(0,0);}catch(e){}},[page]);

  const onAuth=user=>{
    setMembers(prev=>{const ex=prev.find(u=>u.id===user.id);return ex?prev.map(u=>u.id===user.id?user:u):[user,...prev];});
    setMe(user);
  };
  const onLogout=()=>{setMe(null);setPage("home");};
  const onUpdate=updated=>{
    setMembers(prev=>prev.map(u=>u.id===updated.id?updated:u));
    setMe(prev=>prev?.id===updated.id?updated:prev);
    setViewUser(updated);
  };

  const noNav=["login","signup"].includes(page);
  return (
    <div style={{background:T.bg,color:T.white,minHeight:"100vh",fontFamily:"'Cinzel',serif"}}>
      <style>{STYLES}</style>
      {!noNav&&<Nav page={page} setPage={setPage} user={me} onLogout={onLogout}/>}
      {page==="home"&&<Home setPage={setPage} members={members} loading={loading}/>}
      {page==="network"&&<Network setPage={setPage} setViewUser={setViewUser} members={members} loading={loading}/>}
      {page==="profile"&&<ProfilePage setPage={setPage} user={viewUser||me} currentUser={me} onUpdate={onUpdate}/>}
      {page==="dashboard"&&me&&<Dashboard user={me} setPage={setPage} setViewUser={setViewUser}/>}
      {page==="contact"&&<Contact setPage={setPage}/>}
      {page==="login"&&<Auth mode="login" setPage={setPage} onAuth={onAuth} members={members}/>}
      {page==="signup"&&<Auth mode="signup" setPage={setPage} onAuth={onAuth} members={members}/>}
    </div>
  );
                 }
