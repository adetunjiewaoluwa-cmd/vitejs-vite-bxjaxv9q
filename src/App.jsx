// @ts-nocheck
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{
      background:"#0B0B0B",
      minHeight:"100vh",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      gap:20
    }}>
      <h1 style={{color:"#D4AF37",fontFamily:"serif",fontSize:"3rem"}}>
        The Voryel
      </h1>
      <p style={{color:"white",fontSize:"1.2rem"}}>
        Coming Soon ✦
      </p>
      <button
        onClick={()=>setCount(c=>c+1)}
        style={{background:"#800020",color:"gold",padding:"10px 24px",border:"none",cursor:"pointer",fontSize:"1rem"}}
      >
        Clicked {count} times
      </button>
    </div>
  );
        }
