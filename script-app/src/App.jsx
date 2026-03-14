import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
// ── SUPABASE ──
const SUPA_URL = "https://neihlobcyssbvrsyptve.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laWhsb2JjeXNzYnZyc3lwdHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTE1NjEsImV4cCI6MjA4ODg4NzU2MX0.AEvReQgzGKUK6gw8hUlvBArpQrP-wRBn6b_9zTexiMs";
const sb = createClient(SUPA_URL, SUPA_KEY);
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const C = { r:"#C8220A", g:"#7A7A7A", k:"#1C1C1E", rl:"#FFF3F1", rm:"#FFCCC4", bd:"#E8D5D0" };
const MCATS_EXPENSE = [
{id:"Food", icon:" ", color:"#E65100"},
{id:"Store", icon:" ", color:"#1565C0"},
{id:"Electronics", icon:" ", color:"#6A1B9A"},
{id:"Car", icon:" ", color:"#4E342E"},
{id:"Mortgage/Rent", icon:" ", color:"#4A148C"},
{id:"Loan", icon:" ", color:"#B71C1C"},
{id:"Vacation", icon:" ", color:"#0277BD"},
{id:"ATM", icon:" ", color:"#546E7A"},
{id:"Subscription", icon:" ", color:"#5C6BC0"},
{id:"Medical", icon:" ", color:"#AD1457"},
{id:"Utilities", icon:" ", color:"#F57F17"},
{id:"Other", icon:" ", color:"#546E7A"},
];
const MCATS_INCOME = [
{id:"Work", icon:" ", color:"#1B5E20"},
{id:"Real Estate", icon:" ", color:"#2E7D32"},
{id:"Investment", icon:" ", color:"#00695C"},
{id:"Freelance", icon:" ", color:"#1565C0"},
{id:"Gift", icon:" ", color:"#6A1B9A"},
{id:"Refund", icon:" ", color:"#0277BD"},
{id:"Other Income", icon:" ", color:"#558B2F"},
];
const MCATS = [...MCATS_EXPENSE, ...MCATS_INCOME];
const inp = {padding:"10px 13px",borderRadius:10,border:"1.5px solid #E8D5D0",fontSize:14,width:"100%",background:"#fff",color:"#1C1C1E",fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
const btn = (bg=C.r,col="#fff")=>({background:bg,color:col,border:"none",borderRadius:10,padding:"10px 16px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"});
const pill = (on,color=C.r)=>({padding:"6px 14px",borderRadius:20,border:"1.5px solid "+(on?color:C.bd),background:on?color:"transparent",color:on?"#fff":C.g,fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"});
const card = {background:"#fff",border:"1.5px solid #E8D5D0",borderRadius:14,padding:"13px 15px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 1px 8px rgba(0,0,0,.05)"};
const box = {background:"#FFF3F1",border:"1.5px solid #E8D5D0",borderRadius:14,padding:16,flexShrink:0};
const lbl = {width:38,height:38,borderRadius:10,background:"#FFF3F1",display:"flex",alignItems:"center",justifyContent:"center",color:C.r,fontWeight:900,fontSize:11,flexShrink:0,border:"1.5px solid #FFCCC4"};
function ScrollIcon({sz=18,white=true}){

const s=white?"#fff":C.r, f=white?"rgba(255,255,255,.2)":C.rl;
return(
<svg width={sz} height={sz} viewBox="0 0 52 52" fill="none">
<rect x="4" y="4" width="36" height="44" rx="5" fill={f} stroke={s} strokeWidth="3"/>
<path d="M2 10 Q2 2 10 2 L10 46 Q10 50 6 50 Q2 50 2 46 Z" stroke={s} strokeWidth="2.5" fill={f}/>
<path d="M10 46 Q10 50 6 50 Q2 50 2 46 Q2 42 6 42 L10 42" stroke={s} strokeWidth="2.5" fill="none"/>
<line x1="15" y1="14" x2="34" y2="14" stroke={s} strokeWidth="3" strokeLinecap="round"/>
<line x1="15" y1="21" x2="34" y2="21" stroke={s} strokeWidth="3" strokeLinecap="round"/>
<line x1="15" y1="28" x2="28" y2="28" stroke={s} strokeWidth="3" strokeLinecap="round"/>
</svg>
);
}
function Spinner({msg="Loading..."}){
return(
<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,color:C.g}}>
<div style={{width:36,height:36,border:"3px solid "+C.bd,borderTopColor:C.r,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
<style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
<div style={{fontSize:14,fontWeight:600}}>{msg}</div>
</div>
);
}
async function dbLoad(userId, section) {
const { data } = await sb.from("script_data").select("value").eq("user_id", userId).eq("section", section).single();
return data ? data.value : null;
}
async function dbSave(userId, section, value) {
await sb.from("script_data").upsert({ user_id: userId, section, value, updated_at: new Date().toISOString() }, { onConflict: "user_id,section" });
}
function Login({ onLogin }) {
const [mode, setMode] = useState("in");
const [email, setEmail] = useState("");
const [pass, setPass] = useState("");
const [agreed, setAgreed] = useState(false);
const [showDisc, setShowDisc] = useState(false);
const [err, setErr] = useState("");
const [info, setInfo] = useState("");
const [loading, setLoading] = useState(false);
const go = async () => {
setErr(""); setInfo(""); setLoading(true);
if (mode === "reset") {
if (!email.trim()) { setErr("Enter your email address."); setLoading(false); return; }
const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
if (error) { setErr(error.message); } else { setInfo("Password reset email sent! Check your inbox."); }

setLoading(false); return;
}
if (!email.trim() || pass.length < 6) { setErr("Email & password (6+ chars) required."); setLoading(false); return; }
if (mode === "up" && !agreed) { setErr("Please read and accept the disclaimer to continue."); setLoading(false); return; }
if (mode === "in") {
const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pass });
if (error) { setErr(error.message); setLoading(false); return; }
onLogin(data.user);
} else {
const { data, error } = await sb.auth.signUp({ email: email.trim(), password: pass });
if (error) { setErr(error.message); setLoading(false); return; }
if (data.user && !data.session) { setInfo("Check your email to confirm your account, then sign in."); setLoading(false); return; }
onLogin(data.user);
}
setLoading(false);
};
// Dark input style with white text
const II = {width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,.12)",background:"rgba(0,0,0,.35)",color:"#fff",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
return (
<div style={{minHeight:"100svh",background:"linear-gradient(160deg,#C8220A 0%,#8B1507 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 16px",fontFamily:"'DM Sans',sans-serif",overflowY:"auto"}}>
<style>{`input::placeholder{color:rgba(255,255,255,.35)!important;}`}</style>
<div style={{width:"100%",maxWidth:400}}>
{/* Logo */}
<div style={{textAlign:"center",marginBottom:36}}>
<div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:10}}>
<span style={{fontFamily:"'Nunito',sans-serif",fontSize:56,fontWeight:900,color:"#fff",lineHeight:1}}>Script</span>
<ScrollIcon sz={50} white={true}/>
</div>
<div style={{color:"rgba(255,255,255,.55)",fontSize:13,letterSpacing:2.5,fontWeight:600,textTransform:"uppercase"}}>Personal Organizer</div>
</div>
{/* Card */}
<div style={{background:"rgba(0,0,0,.45)",border:"1px solid rgba(255,255,255,.1)",borderRadius:24,padding:"28px 24px",backdropFilter:"blur(10px)"}}>
{/* Tabs */}
{mode !== "reset" && (
<div style={{display:"flex",background:"rgba(255,255,255,.07)",borderRadius:12,padding:4,marginBottom:26}}>
{[["in","Sign In"],["up","Create Account"]].map(([m,l])=>(
<button key={m} onClick={()=>{setMode(m);setErr("");setInfo("");}} style={{flex:1,padding:"11px 8px",borderRadius:9,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",background:mode===m?C.r:"transparent",color:mode===m?"#fff":"rgba(255,255,255,.4)",transition:"all .2s"}}>{l}</button>
))}
</div>
)}
{mode === "reset" && (
<div style={{marginBottom:22}}>
<button onClick={()=>{setMode("in");setErr("");setInfo("");}} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",fontSize:13,cursor:"pointer",fontFamily:"inherit",padding:0,display:"flex",alignItems:"center",gap:4}}>← Back to Sign In</button>

<div style={{color:"#fff",fontWeight:700,fontSize:18,marginTop:12}}>Reset Password</div>
<div style={{color:"rgba(255,255,255,.45)",fontSize:13,marginTop:4}}>We'll send a reset link to your email.</div>
</div>
)}
<div style={{display:"flex",flexDirection:"column",gap:16}}>
<div>
<div style={{color:"rgba(255,255,255,.5)",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>Email</div>
<input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="you@email.com" style={II}/>
</div>
{mode !== "reset" && (
<div>
<div style={{color:"rgba(255,255,255,.5)",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>Password</div>
<input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="6+ characters" style={II}/>
</div>
)}
</div>
{/* Disclaimer — signup only */}
{mode === "up" && (
<div style={{marginTop:18,background:"rgba(0,0,0,.25)",borderRadius:12,padding:"14px 16px"}}>
<div style={{display:"flex",alignItems:"flex-start",gap:10}}>
<button onClick={()=>setAgreed(!agreed)} style={{width:20,height:20,borderRadius:5,border:"2px solid "+(agreed?"#fff":"rgba(255,255,255,.3)"),background:agreed?"#fff":"transparent",flexShrink:0,marginTop:1,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
{agreed && <span style={{color:C.r,fontSize:12,fontWeight:900}}>✓</span>}
</button>
<div style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.5}}>
I have read and agree to the{" "}
<button onClick={()=>setShowDisc(!showDisc)} style={{background:"none",border:"none",color:"#fff",fontWeight:700,fontSize:12,textDecoration:"underline",cursor:"pointer",fontFamily:"inherit",padding:0}}>data disclaimer</button>
</div>
</div>
{showDisc && (
<div style={{marginTop:12,padding:"12px 14px",background:"rgba(0,0,0,.3)",borderRadius:10,fontSize:11,color:"rgba(255,255,255,.6)",lineHeight:1.7}}>
<div style={{fontWeight:800,color:"rgba(255,255,255,.9)",fontSize:12,marginBottom:6}}> Data Disclaimer</div>
Never store sensitive data on the internet unless you understand the potential impact of a data loss or data vulnerability to outside parties. By creating an account, you acknowledge that no system is 100% secure and you accept responsibility for the data you choose to store here.
<br/><br/>
We will not share your data voluntarily unless instructed to by government or law enforcement agencies.
</div>
)}
</div>
)}
{err && <div style={{marginTop:14,color:"#ff8080",fontSize:13,textAlign:"center",background:"rgba(255,80,80,.08)",borderRadius:8,padding:"8px 12px"}}>{err}</div>}
{info && <div style={{marginTop:14,color:"#a0ffb0",fontSize:13,textAlign:"center",background:"rgba(80,255,120,.06)",borderRadius:8,padding:"8px 12px"}}>{info}</div>}
<button onClick={go} disabled={loading} style={{width:"100%",marginTop:20,padding:"15px",borderRadius:14,border:"none",background:C.r,color:"#fff",fontWeight:800,fontSize:16,fontFamily:"'Nunito',sans-serif",cursor:"pointer",opacity:loading?0.6:1,boxShadow:"0 4px 20px rgba(200,34,10,.4)"}}>
{loading ? "Please wait..." : mode==="reset" ? "Send Reset Email" : mode==="in" ? "Sign In →" : "Create Account →"}
</button>

{mode === "in" && (
<button onClick={()=>{setMode("reset");setErr("");setInfo("");}} style={{width:"100%",marginTop:14,background:"none",border:"none",color:"rgba(255,255,255,.35)",fontSize:12,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>
Forgot password?
</button>
)}
</div>
<p style={{textAlign:"center",color:"rgba(255,255,255,.25)",fontSize:11,marginTop:16,letterSpacing:1}}>Your data is saved to the cloud </p>
</div>
</div>
);
}
function Chalk({ userId }) {
const [text, setText] = useState("");
const [saving, setSaving] = useState(false);
const [loaded, setLoaded] = useState(false);
const [mode, setMode] = useState("type"); // "type" | "draw"
const [drawing, setDrawing] = useState(false);
const [paths, setPaths] = useState([]);
const [color, setColor] = useState("#ffffff");
const [size, setSize] = useState(3);
const canvasRef = useRef(null);
const timer = useRef(null);
const lastPt = useRef(null);
useEffect(() => {
dbLoad(userId,"chalk").then(v=>{
if(v && typeof v === "object") {
if(v.text !== undefined) setText(v.text||"");
if(v.paths !== undefined) setPaths(v.paths||[]);
} else if(typeof v === "string") {
setText(v||"");
}
setLoaded(true);
});
}, [userId]);
const save = (t, p) => {
clearTimeout(timer.current);
timer.current = setTimeout(async ()=>{ setSaving(true); await dbSave(userId,"chalk",{text:t,paths:p}); setSaving(false); }, 800);
};
const onTextChange = val => { setText(val); save(val, paths); };
// Draw canvas paths on load/update
useEffect(()=>{

if(mode!=="draw" || !canvasRef.current) return;
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.lineCap="round"; ctx.lineJoin="round";
paths.forEach(path=>{
if(!path.pts||path.pts.length<2) return;
ctx.strokeStyle=path.color||"#fff";
ctx.lineWidth=path.size||3;
ctx.beginPath();
ctx.moveTo(path.pts[0].x,path.pts[0].y);
path.pts.slice(1).forEach(pt=>ctx.lineTo(pt.x,pt.y));
ctx.stroke();
});
},[paths,mode]);
const getPos = (e, canvas) => {
const r = canvas.getBoundingClientRect();
const touch = e.touches?.[0] || e;
return { x:(touch.clientX-r.left)*(canvas.width/r.width), y:(touch.clientY-r.top)*(canvas.height/r.height) };
};
const startDraw = e => {
e.preventDefault();
const canvas = canvasRef.current;
const pt = getPos(e, canvas);
lastPt.current = pt;
setDrawing(true);
setPaths(prev=>[...prev,{color,size,pts:[pt]}]);
};
const moveDraw = e => {
e.preventDefault();
if(!drawing) return;
const canvas = canvasRef.current;
const pt = getPos(e, canvas);
const ctx = canvas.getContext("2d");
ctx.strokeStyle=color; ctx.lineWidth=size; ctx.lineCap="round"; ctx.lineJoin="round";
ctx.beginPath();
ctx.moveTo(lastPt.current.x, lastPt.current.y);
ctx.lineTo(pt.x, pt.y);
ctx.stroke();
lastPt.current = pt;
setPaths(prev=>{
const updated=[...prev];
updated[updated.length-1]={...updated[updated.length-1],pts:[...updated[updated.length-1].pts,pt]};
return updated;

});
};
const endDraw = e => {
e.preventDefault();
setDrawing(false);
save(text, paths);
};
const eraseLast = () => { const p=paths.slice(0,-1); setPaths(p); save(text,p); };
const clearAll = () => {
if(mode==="type") { setText(""); save("",paths); }
else { setPaths([]); save(text,[]); }
};
const COLORS = ["#ffffff","#ffeb3b","#ff8a80","#80d8ff","#b9f6ca","#ea80fc","#ff6d00","#1de9b6"];
const pieces = [{w:44,c:"#F5F0E8"},{w:28,c:"#E8C49A"},{w:38,c:"#C8DDB0"},{w:22,c:"#A8C4D8"},{w:34,c:"#F0E8D8"},{w:18,c:"#FFCDD2"}];
return (
<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",borderRadius:10,background:"#6b8c52",boxShadow:"inset 0 0 60px rgba(0,0,0,.25)"}}>
{/* Toolbar */}
<div style={{flexShrink:0,background:"rgba(0,0,0,.22)",borderBottom:"2px solid rgba(0,0,0,.3)",padding:"8px 14px 9px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
<div style={{display:"flex",gap:5,alignItems:"center",flex:1}}>
{pieces.map((pc,i)=>(<div key={i} style={{width:pc.w,height:11,borderRadius:3,background:pc.c,boxShadow:"inset 0 -2px 4px rgba(0,0,0,.25)"}}/>))}
</div>
<div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
{/* Mode toggle */}
<div style={{display:"flex",background:"rgba(0,0,0,.3)",borderRadius:8,padding:2,gap:2}}>
{[["type"," Type"],["draw"," Draw"]].map(([m,l])=>(
<button key={m} onClick={()=>setMode(m)} style={{padding:"4px 10px",borderRadius:6,border:"none",background:mode===m?"rgba(255,255,255,.2)":"transparent",color:"rgba(255,255,255,.8)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
))}
</div>
<span style={{color:"rgba(255,255,255,.35)",fontSize:12}}>{saving?" saving...":" saved"}</span>
{mode==="draw" && <button onClick={eraseLast} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:6,color:"rgba(255,255,255,.65)",padding:"3px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>↩</button>}
<button onClick={clearAll} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:6,color:"rgba(255,255,255,.65)",padding:"3px 13px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Erase</button>
</div>
</div>
{/* Draw color/size toolbar */}
{mode==="draw" && (
<div style={{flexShrink:0,background:"rgba(0,0,0,.18)",borderBottom:"1px solid rgba(0,0,0,.2)",padding:"7px 14px",display:"flex",alignItems:"center",gap:10}}>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
{COLORS.map(col=>(
<button key={col} onClick={()=>setColor(col)} style={{width:color===col?24:18,height:color===col?24:18,borderRadius:"50%",background:col,border:color===col?"3px solid rgba(255,255,255,.9)":"2px solid rgba(255,255,255,.3)",cursor:"pointer",flexShrink:0,transition:"all .15s"}}/>
))}
</div>
<div style={{display:"flex",gap:5,alignItems:"center",marginLeft:"auto"}}>

{[2,4,8].map(s=>(
<button key={s} onClick={()=>setSize(s)} style={{width:s===2?20:s===4?24:28,height:s===2?20:s===4?24:28,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:size===s?"2px solid #fff":"2px solid rgba(255,255,255,.25)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
<div style={{width:s,height:s,borderRadius:"50%",background:"#fff"}}/>
</button>
))}
</div>
</div>
)}
{/* Content */}
<div style={{flex:1,position:"relative",overflow:"hidden"}}>
{!loaded && <div style={{position:"absolute",inset:0,background:"#6b8c52",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}><Spinner msg="Loading..."/></div>}
{/* Type mode */}
{mode==="type" && (
<textarea value={text} onChange={e=>onTextChange(e.target.value)} placeholder="Write anything here..."
style={{position:"absolute",inset:0,width:"100%",height:"100%",padding:"20px 24px",color:"rgba(255,255,255,.95)",fontSize:22,fontWeight:700,lineHeight:"38px",fontFamily:"'Nunito',sans-serif",letterSpacing:"0.8px",resize:"none",border:"none",outline:"none",background:"transparent",caretColor:"#fff",textShadow:"1px 1px 0px rgba(0,0,0,.3), 2px 2px 6px rgba(0,0,0,.2)",boxSizing:"border-box"}}
/>
)}
{/* Draw mode */}
{mode==="draw" && (
<canvas ref={canvasRef} width={800} height={1200}
onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
style={{position:"absolute",inset:0,width:"100%",height:"100%",cursor:"crosshair",touchAction:"none"}}
/>
)}
</div>
</div>
);
}
function Logins({ userId }) {
const [data, setData] = useState([]);
const [form, setForm] = useState({site:"",username:"",hint:"",type:"Personal"});
const [open, setOpen] = useState(false);
const [reveal, setReveal] = useState(null);
const [filter, setFilter] = useState("All");
const [loaded, setLoaded] = useState(false);
useEffect(()=>{ dbLoad(userId,"logins").then(v=>{ if(v) setData(v); setLoaded(true); }); },[userId]);
const S = async d => { setData(d); await dbSave(userId,"logins",d); };
const add = ()=>{ if(!form.site.trim()) return; S([...data,{...form,id:Date.now()}]); setForm({site:"",username:"",hint:"",type:"Personal"}); setOpen(false); };
const fil = filter==="All" ? data : data.filter(l=>l.type===filter);
if (!loaded) return <Spinner msg="Loading logins..."/>;

return (
<div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
<div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
{["All","Personal","Work"].map(f=><button key={f} style={pill(filter===f)} onClick={()=>setFilter(f)}>{f}</button>)}
<button onClick={()=>setOpen(!open)} style={{...btn(),marginLeft:"auto",borderRadius:20,padding:"8px 18px"}}>+ Add</button>
</div>
{open && (
<div style={box}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
<input style={inp} value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="Site / App"/>
<input style={inp} value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Username / Email"/>
<input style={{...inp,gridColumn:"span 2"}} value={form.hint} onChange={e=>setForm({...form,hint:e.target.value})} placeholder="Password hint"/>
</div>
<div style={{display:"flex",gap:8,marginBottom:12}}>
{["Personal","Work"].map(t=>(
<button key={t} onClick={()=>setForm({...form,type:t})} style={{flex:1,padding:"9px",borderRadius:10,border:"1.5px solid "+(form.type===t?C.r:C.bd),background:form.type===t?C.r:"#fff",color:form.type===t?"#fff":C.k,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
))}
</div>
<div style={{display:"flex",gap:8}}>
<button onClick={add} style={{...btn(),flex:1}}>Save</button>
<button onClick={()=>setOpen(false)} style={{...btn("#fff",C.k),border:"1.5px solid "+C.bd,padding:"10px 16px"}}>Cancel</button>
</div>
</div>
)}
<div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:9}}>
{fil.map(l=>(
<div key={l.id} style={card}>
<div style={{...lbl,fontSize:17}}>{l.site[0]?.toUpperCase()}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontWeight:700,fontSize:15,color:C.k}}>{l.site}</div>
<div style={{fontSize:13,color:C.g,marginTop:1}}>{l.username}</div>
{l.hint && (
<div style={{fontSize:12,color:C.r,marginTop:3,display:"flex",alignItems:"center",gap:4}}>
<span style={{fontWeight:800,flexShrink:0}}>Hint:</span>
<span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reveal===l.id?l.hint:"•••••"}</span>
<button onClick={()=>setReveal(reveal===l.id?null:l.id)} style={{background:"none",border:"none",fontSize:11,color:C.g,textDecoration:"underline",flexShrink:0,cursor:"pointer",fontFamily:"inherit"}}>{reveal===l.id?"hide":"show"}</button>
</div>
)}
</div>
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
<span style={{fontSize:11,background:l.type==="Work"?"#EBF5FB":C.rl,color:l.type==="Work"?"#2471A3":C.r,borderRadius:20,padding:"2px 9px",fontWeight:700}}>{l.type}</span>
<button onClick={()=>S(data.filter(x=>x.id!==l.id))} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:13,padding:4}}>✕</button>
</div>
</div>
))}
{fil.length===0 && <div style={{textAlign:"center",color:C.g,padding:48,fontSize:14}}>No logins yet. Tap + Add!</div>}
</div>

</div>
);
}
const BASE_LISTS = [
{id:"todo", label:"To Do", kind:"check", items:[]},
{id:"grocery", label:"Grocery", kind:"check", items:[]},
{id:"watch", label:"To Watch", kind:"check", items:[]},
];
function Lists({ userId }) {
const [lists, setLists] = useState(BASE_LISTS);
const [active, setActive] = useState("todo");
const [ni, setNi] = useState("");
const [showN, setShowN] = useState(false);
const [nn, setNn] = useState("");
const [loaded, setLoaded] = useState(false);
useEffect(()=>{ dbLoad(userId,"lists").then(v=>{ if(v) setLists(v); setLoaded(true); }); },[userId]);
const S = async d => { setLists(d); await dbSave(userId,"lists",d); };
const al = lists.find(l=>l.id===active)||lists[0];
const addItem = ()=>{ if(!ni.trim()) return; S(lists.map(l=>l.id===active?{...l,items:[...l.items,{id:Date.now(),text:ni,done:false}]}:l)); setNi(""); };
const toggle = id=>S(lists.map(l=>l.id===active?{...l,items:l.items.map(i=>i.id===id?{...i,done:!i.done}:i)}:l));
const del = id=>S(lists.map(l=>l.id===active?{...l,items:l.items.filter(i=>i.id!==id)}:l));
const addCustomList = ()=>{ if(!nn.trim()) return; const nl={id:"c"+Date.now(),label:nn,kind:"check",items:[]}; S([...lists,nl]); setNn(""); setShowN(false); setActive(nl.id); };
const removeList = id=>{ if(active===id) setActive("todo"); S(lists.filter(x=>x.id!==id)); };
if (!loaded) return <Spinner msg="Loading lists..."/>;
return (
<div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
<div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:3,flexShrink:0,alignItems:"center"}}>
{lists.map(l=>(
<button key={l.id} style={{...pill(active===l.id),display:"flex",alignItems:"center",gap:4}} onClick={()=>setActive(l.id)}>
{l.label}
{!BASE_LISTS.some(b=>b.id===l.id) && (
<span onClick={e=>{e.stopPropagation();removeList(l.id);}} style={{opacity:.6,fontSize:9,marginLeft:1,cursor:"pointer"}}>✕</span>
)}
</button>
))}
<button onClick={()=>setShowN(!showN)} style={{padding:"6px 12px",borderRadius:20,border:"1.5px dashed "+C.bd,background:"transparent",fontWeight:700,fontSize:12,color:C.g,flexShrink:0,whiteSpace:"nowrap",marginLeft:2,cursor:"pointer",fontFamily:"inherit"}}>+ New</button>
</div>
{showN && (
<div style={box}>
<div style={{display:"flex",gap:8}}>
<input style={{...inp,flex:1}} value={nn} onChange={e=>setNn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomList()} placeholder="List name..."/>
<button onClick={addCustomList} style={{...btn(),padding:"10px 16px"}}>Create</button>
<button onClick={()=>setShowN(false)} style={{...btn("#fff",C.k),border:"1.5px solid "+C.bd,padding:"10px 14px"}}>✕</button>

</div>
</div>
)}
<div style={{flex:1,display:"flex",flexDirection:"column",gap:10,minHeight:0}}>
<div style={{display:"flex",gap:9,flexShrink:0}}>
<input style={{...inp,flex:1}} value={ni} onChange={e=>setNi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()} placeholder={"Add to "+al.label+"..."}/>
<button onClick={addItem} style={{...btn(),padding:"10px 18px",fontSize:18}}>+</button>
</div>
<div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
{al.items.map(it=>(
<div key={it.id} style={{display:"flex",alignItems:"center",gap:11,padding:"12px 14px",background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,opacity:it.done?.5:1}}>
<button onClick={()=>toggle(it.id)} style={{width:24,height:24,borderRadius:8,border:"2px solid "+(it.done?C.r:C.bd),background:it.done?C.r:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,flexShrink:0,cursor:"pointer"}}>{it.done?"✓":""}</button>
<span style={{flex:1,fontSize:14,textDecoration:it.done?"line-through":"none",color:it.done?C.g:C.k}}>{it.text}</span>
<button onClick={()=>del(it.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:13}}>✕</button>
</div>
))}
{al.items.length===0 && <div style={{textAlign:"center",color:C.g,padding:36,fontSize:14}}>Empty — add your first item!</div>}
</div>
</div>
</div>
);
}
function Calendar({ userId }) {
const [evts, setEvts] = useState({});
const [cal, setCal] = useState(()=>{ const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),1); });
const [sel, setSel] = useState(null);
const [note, setNote] = useState("");
const [loaded, setLoaded] = useState(false);
const now = new Date();
useEffect(()=>{ dbLoad(userId,"cal").then(v=>{ if(v) setEvts(v); setLoaded(true); }); },[userId]);
const S = async d => { setEvts(d); await dbSave(userId,"cal",d); };
const y=cal.getFullYear(), m=cal.getMonth();
const dim=new Date(y,m+1,0).getDate(), fd=new Date(y,m,1).getDay();
const dk=d=>y+"-"+(m+1)+"-"+d;
if (!loaded) return <Spinner msg="Loading calendar..."/>;
return (
<div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
<div style={{background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,overflow:"hidden",flexShrink:0}}>
<div style={{background:"linear-gradient(135deg,#C8220A,#E03010)",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<button onClick={()=>setCal(new Date(y,m-1,1))} style={{background:"rgba(255,255,255,.18)",border:"none",color:"#fff",borderRadius:9,width:34,height:34,fontSize:20,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
<div style={{textAlign:"center"}}>
<div style={{fontFamily:"'Nunito',sans-serif",color:"#fff",fontWeight:900,fontSize:18}}>{MONTHS[m]}</div>
<div style={{color:"rgba(255,255,255,.6)",fontSize:12}}>{y}</div>
</div>

<button onClick={()=>setCal(new Date(y,m+1,1))} style={{background:"rgba(255,255,255,.18)",border:"none",color:"#fff",borderRadius:9,width:34,height:34,fontSize:20,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
</div>
<div style={{padding:"12px 14px"}}>
<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
{WDAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:C.r,padding:"3px 0"}}>{d}</div>)}
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
{Array(fd).fill(null).map((_,i)=><div key={"e"+i}/>)}
{Array(dim).fill(null).map((_,i)=>{
const d=i+1,isT=d===now.getDate()&&m===now.getMonth()&&y===now.getFullYear(),isS=sel===d,has=!!evts[dk(d)];
return(
<div key={d} onClick={()=>{setSel(d);setNote(evts[dk(d)]||"");}} style={{borderRadius:9,padding:"7px 2px",textAlign:"center",cursor:"pointer",background:isS?C.r:isT?C.rl:"transparent",border:"1.5px solid "+(isT&&!isS?C.r:"transparent")}}>
<div style={{fontSize:13,fontWeight:isT||isS?800:400,color:isS?"#fff":isT?C.r:C.k}}>{d}</div>
{has&&<div style={{width:5,height:5,borderRadius:"50%",background:isS?"#fff":C.r,margin:"2px auto 0"}}/>}
</div>
);
})}
</div>
</div>
</div>
{sel ? (
<div style={{display:"flex",flexDirection:"column",gap:10,flex:1,minHeight:0}}>
<div style={{background:C.r,borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
<div>
<div style={{color:"rgba(255,255,255,.6)",fontSize:11,letterSpacing:1}}>{MONTHS[m]+" "+y}</div>
<div style={{fontFamily:"'Nunito',sans-serif",fontSize:30,fontWeight:900,color:"#fff",lineHeight:1}}>{sel}</div>
</div>
<button onClick={()=>S({...evts,[dk(sel)]:note})} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:10,padding:"8px 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Save ✓</button>
</div>
<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Notes for this day..." style={{flex:1,minHeight:80,padding:"14px",borderRadius:14,border:"1.5px solid "+C.bd,fontSize:14,lineHeight:1.8,resize:"none",color:C.k,background:"#fff",fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
</div>
) : (
<div style={{textAlign:"center",color:C.g,padding:24,fontSize:14}}>Tap a day to add notes</div>
)}
</div>
);
}
function Money({ userId }) {
const now = new Date();
const toMonthKey = d => { const p=new Date(d); return isNaN(p)?null: p.getFullYear()+"_"+(p.getMonth()+1); };
const monthLabel = key => { const [y,m]=key.split("_"); return MONTHS[parseInt(m)-1]+" "+y; };
const curKey = now.getFullYear()+"_"+(now.getMonth()+1);
const [txns, setTxns] = useState([]);
const [form, setForm] = useState({desc:"",amount:"",type:"Expense",cat:"Food",imgs:[]});
const [open, setOpen] = useState(false);

const [expandId, setExpandId] = useState(null);
const [lightbox, setLightbox] = useState(null);
const [loaded, setLoaded] = useState(false);
const [viewKey, setViewKey] = useState(curKey);
useEffect(()=>{ dbLoad(userId,"money").then(v=>{ if(v) setTxns(v); setLoaded(true); }); },[userId]);
const S = async d => { setTxns(d); await dbSave(userId,"money",d); };
const add = ()=>{
if(!form.desc.trim()||!form.amount) return;
const dateStr = new Date().toLocaleDateString();
S([{...form,amount:parseFloat(form.amount),id:Date.now(),date:dateStr,monthKey:curKey},...txns]);
setForm({desc:"",amount:"",type:"Expense",cat:MCATS_EXPENSE[0].id,imgs:[]}); setOpen(false);
};
const addImg=(txnId,file)=>{
if(!file) return;
const r=new FileReader();
r.onload=e=>S(txns.map(t=>t.id===txnId?{...t,imgs:[...(t.imgs||[]),{id:Date.now(),data:e.target.result,name:file.name}]}:t));
r.readAsDataURL(file);
};
const removeImg=(txnId,imgId)=>S(txns.map(t=>t.id===txnId?{...t,imgs:(t.imgs||[]).filter(i=>i.id!==imgId)}:t));
const GRN="#1a7a3c";
// Fix old txns missing monthKey
const allTxns = txns.map(t=>({...t, monthKey: t.monthKey || toMonthKey(t.date) || curKey}));
// All unique month keys sorted newest first
const allKeys = [...new Set([curKey, ...allTxns.map(t=>t.monthKey)])].sort((a,b)=>{
const [ay,am]=a.split("_"), [by,bm]=b.split("_");
return (parseInt(by)*12+parseInt(bm))-(parseInt(ay)*12+parseInt(am));
});
// Clamp viewKey to valid keys
const safeKey = allKeys.includes(viewKey) ? viewKey : curKey;
const keyIdx = allKeys.indexOf(safeKey);
const monthTxns = allTxns.filter(t=>t.monthKey===safeKey);
const inc = monthTxns.filter(t=>t.type==="Income").reduce((s,t)=>s+t.amount,0);
const exp = monthTxns.filter(t=>t.type==="Expense").reduce((s,t)=>s+t.amount,0);
const isCurrent = safeKey === curKey;
if (!loaded) return <Spinner msg="Loading transactions..."/>;
return (
<div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,paddingBottom:8}}>
{/* Month navigator */}
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,padding:"10px 14px",flexShrink:0}}>
<button onClick={()=>keyIdx<allKeys.length-1&&setViewKey(allKeys[keyIdx+1])} disabled={keyIdx>=allKeys.length-1} style={{background:"none",border:"none",fontSize:20,cursor:keyIdx>=allKeys.length-1?"default":"pointer",color:keyIdx>=allKeys.length-1?"#ddd":C.k,padding:"0 4px"}}>‹</button>

<div style={{textAlign:"center"}}>
<div style={{fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:17,color:"#1B6B35"}}>{monthLabel(safeKey)}</div>
{!isCurrent && <div style={{fontSize:10,color:C.g,fontWeight:600,letterSpacing:1}}>PAST MONTH</div>}
</div>
<button onClick={()=>keyIdx>0&&setViewKey(allKeys[keyIdx-1])} disabled={keyIdx<=0} style={{background:"none",border:"none",fontSize:20,cursor:keyIdx<=0?"default":"pointer",color:keyIdx<=0?"#ddd":C.k,padding:"0 4px"}}>›</button>
</div>
{/* Summary cards */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,flexShrink:0}}>
{[["Balance",inc-exp,(inc-exp)>=0?GRN:C.r],["Income",inc,GRN],["Expenses",exp,C.r]].map(([l,v,col])=>(
<div key={l} style={{background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,padding:"12px 10px"}}>
<div style={{fontSize:9,color:C.g,fontWeight:700,marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>{l}</div>
<div style={{fontSize:15,fontWeight:800,color:col,fontFamily:"'Nunito',sans-serif"}}>{"$"+Math.abs(v).toFixed(2)}</div>
</div>
))}
</div>
{/* Add button — only for current month */}
{isCurrent && <button onClick={()=>{setOpen(!open);setExpandId(null);}} style={{...btn(),borderRadius:20,padding:"8px 18px",alignSelf:"flex-start",flexShrink:0}}>+ Add</button>}
{/* Add form */}
{open && isCurrent && (
<div style={{...box,flexShrink:0}}>
{/* Expense / Income toggle */}
<div style={{display:"flex",background:"#F5F0EE",borderRadius:10,padding:3,marginBottom:12,gap:3}}>
{["Expense","Income"].map(t=>(
<button key={t} onClick={()=>setForm({...form,type:t,cat:t==="Expense"?MCATS_EXPENSE[0].id:MCATS_INCOME[0].id})}
style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:form.type===t?(t==="Expense"?C.r:"#1B6B35"):"transparent",color:form.type===t?"#fff":C.g,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
{t==="Expense"?" Expense":" Income"}
</button>
))}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
<input style={inp} value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Description"/>
<input style={inp} type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="Amount ($)"/>
<select style={{...inp,gridColumn:"span 2"}} value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
{(form.type==="Expense"?MCATS_EXPENSE:MCATS_INCOME).map(c=><option key={c.id} value={c.id}>{c.icon} {c.id}</option>)}
</select>
</div>
<div style={{display:"flex",gap:8}}>
<button onClick={add} style={{...btn(form.type==="Income"?"#1B6B35":C.r),flex:1}}>Save</button>
<button onClick={()=>setOpen(false)} style={{...btn("#fff",C.k),border:"1.5px solid "+C.bd,padding:"10px 16px"}}>Cancel</button>
</div>
</div>
)}
{/* Transaction list */}

{monthTxns.length===0 && (
<div style={{textAlign:"center",color:C.g,padding:40,fontSize:14}}>
{isCurrent ? "No transactions yet this month." : "No transactions for this month."}
</div>
)}
{monthTxns.map(t=>{
// Map old category names to new ones
const CAT_MAP={
"Grocery":"Food","grocery":"Food","food":"Food",
"Store":"Store","store":"Store",
"Electronics":"Electronics","electronics":"Electronics",
"Car":"Car","car":"Car",
"Mortgage/Rent":"Mortgage/Rent","Mortgage":"Mortgage/Rent","Rent":"Mortgage/Rent",
"Loan":"Loan","loan":"Loan",
"Work":"Work","work":"Work","Paycheck":"Work","paycheck":"Work","Salary":"Work",
"Vacation":"Vacation","vacation":"Vacation",
"ATM":"ATM","atm":"ATM",
"Subscription":"Subscription","subscription":"Subscription",
"Medical":"Medical","medical":"Medical","Health":"Medical","health":"Medical",
"Utilities":"Utilities","utilities":"Utilities",
"Real Estate":"Real Estate","Investment":"Investment","investment":"Investment",
"Freelance":"Freelance","freelance":"Freelance",
"Gift":"Gift","gift":"Gift",
"Refund":"Refund","refund":"Refund",
"Other Income":"Other Income","Income":"Other Income",
"Other":"Other","other":"Other",
};
const catId = CAT_MAP[t.cat] || t.cat;
const catObj = MCATS.find(c=>c.id===catId) || (t.type==="Income" ? MCATS_INCOME[MCATS_INCOME.length-1] : MCATS_EXPENSE[MCATS_EXPENSE.length-1]);
const expanded=expandId===t.id, imgs=t.imgs||[];
return(
<div key={t.id} style={{background:"#fff",border:"1.5px solid "+C.bd,borderRadius:14,overflow:"hidden",boxShadow:"0 1px 8px rgba(0,0,0,.05)",flexShrink:0}}>
<div onClick={()=>setExpandId(expanded?null:t.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",cursor:"pointer"}}>
<div style={{width:44,height:44,borderRadius:12,background:catObj.color+"22",border:"1.5px solid "+catObj.color+"44",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
<span style={{fontSize:24,lineHeight:1,fontFamily:"'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"}}>{catObj.icon}</span>
</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontWeight:700,fontSize:14,color:C.k,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc}</div>
<div style={{fontSize:11,color:C.g,marginTop:2,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
<span style={{background:catObj.color+"18",color:catObj.color,borderRadius:20,padding:"1px 8px",fontWeight:700,fontSize:10}}><span style={{fontFamily:"'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"}}>{catObj.icon}</span> {catObj.id}</span>
<span>{t.date}</span>
{imgs.length>0&&<span style={{color:C.r,fontWeight:700}}> {imgs.length}</span>}
</div>
</div>
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
<div style={{fontWeight:800,fontSize:15,color:t.type==="Income"?GRN:C.r}}>{(t.type==="Income"?"+":"-")+"$"+t.amount.toFixed(2)}</div>
<div style={{fontSize:10,color:expanded?"#fff":C.g,background:expanded?C.r:C.rl,borderRadius:20,padding:"2px 8px",fontWeight:700}}>{expanded?"▲ Less":"▼ More"}</div>

</div>
</div>
{expanded && (
<div style={{borderTop:"1px solid #f5f0ee",padding:"12px 15px 14px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:11,fontWeight:700,color:C.g,letterSpacing:.5,textTransform:"uppercase"}}>Receipts & Documents</div>
<button onClick={()=>{S(allTxns.filter(x=>x.id!==t.id));setExpandId(null);}} style={{background:C.r,border:"none",cursor:"pointer",color:"#fff",fontSize:12,fontWeight:700,borderRadius:8,padding:"4px 10px"}}>Delete ✕</button>
</div>
<div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
{imgs.map((img,i)=>(
<div key={img.id} style={{position:"relative",borderRadius:8,overflow:"hidden",border:"1.5px solid "+C.bd,flexShrink:0}}>
<img src={img.data} alt={img.name} onClick={()=>setLightbox({imgs,idx:i})} style={{width:72,height:72,objectFit:"cover",display:"block",cursor:"pointer"}}/>
<button onClick={()=>removeImg(t.id,img.id)} style={{position:"absolute",top:2,right:2,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,.7)",border:"none",color:"#fff",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>✕</button>
</div>
))}
<label style={{width:72,height:72,borderRadius:8,border:"1.5px dashed "+C.bd,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:3,flexShrink:0,background:"#fafafa"}}>
<span style={{fontSize:22,color:C.g,lineHeight:1}}>+</span>
<span style={{fontSize:9,color:C.g,fontWeight:700,textTransform:"uppercase",letterSpacing:.3}}>Receipt</span>
<input type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>{addImg(t.id,e.target.files[0]);e.target.value="";}}/>
</label>
</div>
</div>
)}
</div>
);
})}
{/* Lightbox */}
{lightbox&&(
<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:2000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
<img src={lightbox.imgs[lightbox.idx].data} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}}/>
<div style={{display:"flex",gap:16,marginTop:16,alignItems:"center"}}>
{lightbox.idx>0&&<button onClick={e=>{e.stopPropagation();setLightbox({...lightbox,idx:lightbox.idx-1});}} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:10,padding:"8px 22px",fontWeight:700,fontSize:18,cursor:"pointer"}}>‹</button>}
<span style={{color:"rgba(255,255,255,.45)",fontSize:12}}>{lightbox.idx+1} / {lightbox.imgs.length}</span>
{lightbox.idx<lightbox.imgs.length-1&&<button onClick={e=>{e.stopPropagation();setLightbox({...lightbox,idx:lightbox.idx+1});}} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:10,padding:"8px 22px",fontWeight:700,fontSize:18,cursor:"pointer"}}>›</button>}
</div>
<button onClick={()=>setLightbox(null)} style={{marginTop:14,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.65)",borderRadius:8,padding:"7px 22px",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Close</button>
</div>
)}
</div>
);
}
function Health({ userId }) {
const [tab, setTab] = useState("docs");
const [docs, setDocs] = useState([]);
const [apts, setApts] = useState([]);

const [meds, setMeds] = useState([]);
const [form, setForm] = useState({});
const [open, setOpen] = useState(false);
const [lightbox, setLightbox] = useState(null);
const [expandId, setExpandId] = useState(null);
const [loaded, setLoaded] = useState(false);
useEffect(()=>{
Promise.all([dbLoad(userId,"docs"),dbLoad(userId,"apts"),dbLoad(userId,"meds")])
.then(([d,a,m])=>{ if(d) setDocs(d); if(a) setApts(a); if(m) setMeds(m); setLoaded(true); });
},[userId]);
const Sd=async d=>{setDocs(d);await dbSave(userId,"docs",d);};
const Sa=async d=>{setApts(d);await dbSave(userId,"apts",d);};
const Sm=async d=>{setMeds(d);await dbSave(userId,"meds",d);};
const addDoc=()=>{if(!form.name) return;Sd([...docs,{id:Date.now(),...form,imgs:[]}]);setForm({});setOpen(false);};
const addApt=()=>{if(!form.title) return;Sa([{id:Date.now(),...form,date:form.date||new Date().toLocaleDateString(),imgs:[]},...apts]);setForm({});setOpen(false);};
const addMed=()=>{if(!form.name) return;Sm([...meds,{id:Date.now(),...form,imgs:[]}]);setForm({});setOpen(false);};
const FI=({k,pl,span})=><input style={{...inp,...(span?{gridColumn:"span 2"}:{})}} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={pl}/>;
const addImg=(item,list,setList,saveKey,file)=>{
if(!file) return;
const r=new FileReader();
r.onload=async e=>{const updated=list.map(x=>x.id===item.id?{...x,imgs:[...(x.imgs||[]),{id:Date.now(),data:e.target.result,name:file.name}]}:x);setList(updated);await dbSave(userId,saveKey,updated);};
r.readAsDataURL(file);
};
const removeImg=async(itemId,imgId,list,setList,saveKey)=>{
const updated=list.map(x=>x.id===itemId?{...x,imgs:(x.imgs||[]).filter(i=>i.id!==imgId)}:x);
setList(updated);await dbSave(userId,saveKey,updated);
};
const ImgStrip=({item,list,setList,saveKey})=>(
<div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
{(item.imgs||[]).map((img,i)=>(
<div key={img.id} style={{position:"relative",borderRadius:8,overflow:"hidden",border:"1.5px solid "+C.bd,flexShrink:0}}>
<img src={img.data} alt={img.name} onClick={()=>setLightbox({imgs:item.imgs,idx:i})} style={{width:64,height:64,objectFit:"cover",display:"block",cursor:"pointer"}}/>
<button onClick={()=>removeImg(item.id,img.id,list,setList,saveKey)} style={{position:"absolute",top:2,right:2,width:16,height:16,borderRadius:"50%",background:"rgba(0,0,0,.65)",border:"none",color:"#fff",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>x</button>
</div>
))}
<label style={{width:64,height:64,borderRadius:8,border:"1.5px dashed "+C.bd,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:2,flexShrink:0,background:"#fafafa"}}>
<span style={{fontSize:20,color:C.g,lineHeight:1}}>+</span>
<span style={{fontSize:9,color:C.g,fontWeight:700,textTransform:"uppercase",letterSpacing:.3}}>Photo</span>
<input type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>{addImg(item,list,setList,saveKey,e.target.files[0]);e.target.value="";}}/>
</label>
</div>
);

const HCard=({item,labelEl,children,onDel,list,setList,saveKey})=>{
const cnt=(item.imgs||[]).length, expanded=expandId===item.id;
return(
<div style={{...card,flexDirection:"column",alignItems:"stretch",padding:0,overflow:"hidden"}}>
<div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px"}}>
{labelEl}
<div style={{flex:1,minWidth:0}}>{children}</div>
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
<button onClick={()=>setExpandId(expanded?null:item.id)} style={{background:expanded?C.rl:"#f5f5f5",border:"1.5px solid "+(expanded?C.rm:C.bd),borderRadius:8,padding:"3px 9px",fontSize:11,fontWeight:700,color:expanded?C.r:C.g,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{cnt>0?" "+cnt:" "} {expanded?"▲":"▼"}</button>
<button onClick={onDel} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:13,padding:2}}>✕</button>
</div>
</div>
{expanded&&(<div style={{padding:"0 15px 13px",borderTop:"1px solid #f5f0ee"}}><div style={{fontSize:11,fontWeight:700,color:C.g,letterSpacing:.5,textTransform:"uppercase",marginBottom:6}}>Documents & Photos</div><ImgStrip item={item} list={list} setList={setList} saveKey={saveKey}/></div>)}
</div>
);
};
if (!loaded) return <Spinner msg="Loading health data..."/>;
return (
<div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
<div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
{[["docs","Doctors"],["apts","Appointments"],["meds","Medications"]].map(([id,l])=>(
<button key={id} style={pill(tab===id)} onClick={()=>{setTab(id);setOpen(false);setForm({});setExpandId(null);}}>{l}</button>
))}
<button onClick={()=>setOpen(!open)} style={{...btn(),marginLeft:"auto",borderRadius:20,padding:"8px 18px"}}>+ Add</button>
</div>
{open&&(
<div style={box}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
{tab==="docs"&&<><FI k="name" pl="Doctor Name"/><FI k="specialty" pl="Specialty"/><FI k="phone" pl="Phone"/><FI k="address" pl="Address" span={true}/></>}
{tab==="apts"&&<><FI k="title" pl="Appointment"/><FI k="doctor" pl="Doctor"/><FI k="date" pl="Date"/><FI k="notes" pl="Notes"/></>}
{tab==="meds"&&<><FI k="name" pl="Medication"/><FI k="dosage" pl="Dosage"/><FI k="frequency" pl="Frequency"/><FI k="notes" pl="Notes"/></>}
</div>
<div style={{display:"flex",gap:8}}>
<button onClick={tab==="docs"?addDoc:tab==="apts"?addApt:addMed} style={{...btn(),flex:1}}>Save</button>
<button onClick={()=>setOpen(false)} style={{...btn("#fff",C.k),border:"1.5px solid "+C.bd,padding:"10px 16px"}}>Cancel</button>
</div>
</div>
)}
<div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
{tab==="docs"&&docs.map(d=>(<HCard key={d.id} item={d} list={docs} setList={Sd} saveKey="docs" labelEl={<div style={lbl}>Dr</div>} onDel={()=>Sd(docs.filter(x=>x.id!==d.id))}><div style={{fontWeight:700,fontSize:14,color:C.k}}>{d.name}</div>{d.specialty&&<div style={{fontSize:12,color:C.r,fontWeight:600,marginTop:1}}>{d.specialty}</div>}{d.phone&&<div style={{fontSize:12,color:C.g,marginTop:1}}>{d.phone}</div>}{d.address&&<div style={{fontSize:12,color:C.g,marginTop:1}}>{d.address}</div>}</HCard>))}
{tab==="apts"&&apts.map(a=>(<HCard key={a.id} item={a} list={apts} setList={Sa} saveKey="apts" labelEl={<div style={{...lbl,fontSize:10}}>APT</div>} onDel={()=>Sa(apts.filter(x=>x.id!==a.id))}><div style={{fontWeight:700,fontSize:14,color:C.k}}>{a.title}</div>{a.doctor&&<div style={{fontSize:12,color:C.g,marginTop:1}}>{a.doctor}</div>}<div style={{fontSize:12,color:C.r,fontWeight:600,marginTop:1}}>{a.date}</div>{a.notes&&<div style={{fontSize:12,color:C.g,marginTop:1}}>{a.notes}</div>}</HCard>))}
{tab==="meds"&&meds.map(m=>(<HCard key={m.id} item={m} list={meds} setList={Sm} saveKey="meds" labelEl={<div style={{...lbl,fontSize:10}}>RX</div>} onDel={()=>Sm(meds.filter(x=>x.id!==m.id))}><div style={{fontWeight:700,fontSize:14,color:C.k}}>{m.name}</div>{m.dosage&&<div style={{fontSize:12,color:C.r,fontWeight:600,marginTop:1}}>{m.dosage}</div>}{m.frequency&&<div style={{fontSize:12,color:C.g,marginTop:1}}>{m.frequency}</div>}{m.notes&&<div style={{fontSize:12,color:C.g,marginTop:1}}>{m.notes}</div>}</HCard>))}
{((tab==="docs"&&!docs.length)||(tab==="apts"&&!apts.length)||(tab==="meds"&&!meds.length))&&<div style={{textAlign:"center",color:C.g,padding:40,fontSize:14}}>Nothing here yet. Tap + Add!</div>}
</div>
{lightbox&&(
<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:2000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>

<img src={lightbox.imgs[lightbox.idx].data} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:12,objectFit:"contain",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}}/>
<div style={{display:"flex",gap:16,marginTop:16,alignItems:"center"}}>
{lightbox.idx>0&&<button onClick={e=>{e.stopPropagation();setLightbox({...lightbox,idx:lightbox.idx-1});}} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:10,padding:"8px 22px",fontWeight:700,fontSize:18,cursor:"pointer"}}>‹</button>}
<span style={{color:"rgba(255,255,255,.45)",fontSize:12}}>{lightbox.idx+1} / {lightbox.imgs.length}</span>
{lightbox.idx<lightbox.imgs.length-1&&<button onClick={e=>{e.stopPropagation();setLightbox({...lightbox,idx:lightbox.idx+1});}} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:10,padding:"8px 22px",fontWeight:700,fontSize:18,cursor:"pointer"}}>›</button>}
</div>
<button onClick={()=>setLightbox(null)} style={{marginTop:14,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.65)",borderRadius:8,padding:"7px 22px",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Close</button>
</div>
)}
</div>
);
}
// ── SETTINGS ──
function Settings({ user, dark, setDark, onClose }) {
const [tab, setTab] = useState("account");
const [newEmail, setNewEmail] = useState("");
const [newPass, setNewPass] = useState("");
const [confPass, setConfPass] = useState("");
const [msg, setMsg] = useState("");
const [err, setErr] = useState("");
const [loading, setLoading] = useState(false);
const bg = dark ? "#1C1C1E" : "#fff";
const bg2 = dark ? "#2C2C2E" : "#F5F0EE";
const bdr = dark ? "#3A3A3C" : C.bd;
const txt = dark ? "#F2F2F7" : C.k;
const sub = dark ? "#8E8E93" : C.g;
const saveEmail = async () => {
setErr(""); setMsg(""); setLoading(true);
if (!newEmail.trim()) { setErr("Enter a new email."); setLoading(false); return; }
const { error } = await sb.auth.updateUser({ email: newEmail.trim() });
if (error) setErr(error.message); else setMsg("Confirmation sent to new email!");
setLoading(false);
};
const savePass = async () => {
setErr(""); setMsg(""); setLoading(true);
if (newPass.length < 6) { setErr("Password must be 6+ characters."); setLoading(false); return; }
if (newPass !== confPass) { setErr("Passwords don't match."); setLoading(false); return; }
const { error } = await sb.auth.updateUser({ password: newPass });
if (error) setErr(error.message); else { setMsg("Password updated!"); setNewPass(""); setConfPass(""); }
setLoading(false);
};
const II = {width:"100%",padding:"12px 14px",borderRadius:11,border:"1.5px solid "+bdr,background:bg2,color:txt,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};

return (
<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
<div onClick={e=>e.stopPropagation()} style={{background:bg,borderRadius:"22px 22px 0 0",width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto",paddingBottom:32,boxShadow:"0 -8px 40px rgba(0,0,0,.3)"}}>
{/* Handle */}
<div style={{display:"flex",justifyContent:"center",paddingTop:12,paddingBottom:4}}>
<div style={{width:40,height:4,borderRadius:2,background:bdr}}/>
</div>
{/* Header */}
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px 16px"}}>
<span style={{fontFamily:"'Nunito',sans-serif",fontSize:20,fontWeight:900,color:txt}}>Settings</span>
<button onClick={onClose} style={{background:bg2,border:"none",borderRadius:10,width:32,height:32,cursor:"pointer",fontSize:16,color:sub}}>✕</button>
</div>
{/* Tabs */}
<div style={{display:"flex",gap:6,padding:"0 20px",marginBottom:20}}>
{[["account","Account"],["appearance","Appearance"]].map(([id,l])=>(
<button key={id} onClick={()=>{setTab(id);setErr("");setMsg("");}} style={{...pill(tab===id),flex:1,textAlign:"center"}}>{l}</button>
))}
</div>
<div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:14}}>
{tab === "account" && <>
<div style={{background:bg2,borderRadius:14,padding:"14px 16px"}}>
<div style={{fontSize:11,color:sub,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Signed in as</div>
<div style={{fontSize:14,color:txt,fontWeight:600}}>{user.email}</div>
</div>
<div style={{background:bg2,borderRadius:14,padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
<div style={{fontSize:13,fontWeight:700,color:txt,marginBottom:2}}>Change Email</div>
<input style={II} type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="New email address"/>
<button onClick={saveEmail} disabled={loading} style={{...btn(),width:"100%",opacity:loading?.6:1}}>Update Email</button>
</div>
<div style={{background:bg2,borderRadius:14,padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
<div style={{fontSize:13,fontWeight:700,color:txt,marginBottom:2}}>Change Password</div>
<input style={II} type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New password (6+ chars)"/>
<input style={II} type="password" value={confPass} onChange={e=>setConfPass(e.target.value)} placeholder="Confirm new password"/>
<button onClick={savePass} disabled={loading} style={{...btn(),width:"100%",opacity:loading?.6:1}}>Update Password</button>
</div>
</>}
{tab === "appearance" && <>
<div style={{background:bg2,borderRadius:14,padding:"14px 16px"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<div>
<div style={{fontSize:14,fontWeight:700,color:txt}}>Dark Mode</div>
<div style={{fontSize:12,color:sub,marginTop:2}}>Easy on the eyes at night</div>
</div>
<button onClick={()=>setDark(!dark)} style={{width:50,height:28,borderRadius:14,border:"none",cursor:"pointer",background:dark?C.r:bdr,position:"relative",transition:"background .2s"}}>
<div style={{width:22,height:22,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:dark?25:3,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>

</button>
</div>
</div>
<div style={{background:bg2,borderRadius:14,padding:"14px 16px"}}>
<div style={{fontSize:11,color:sub,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Theme Preview</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
{[[" Chalk","#6b8c52"],[" Logins","#2C5F9E"],[" Lists","#B85C00"],[" Calendar",C.r],[" Money","#1B6B35"],[" Health","#B5174A"]].map(([l,col])=>(
<div key={l} style={{background:col+"22",border:"1.5px solid "+col+"44",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,color:dark?col+"cc":col}}>{l}</div>
))}
</div>
</div>
</>}
{err && <div style={{color:"#ff6060",fontSize:13,background:"rgba(255,80,80,.08)",borderRadius:8,padding:"8px 12px"}}>{err}</div>}
{msg && <div style={{color:"#34c759",fontSize:13,background:"rgba(52,199,89,.08)",borderRadius:8,padding:"8px 12px"}}>{msg}</div>}
</div>
</div>
</div>
);
}
const NAV = [
{id:"chalk", label:"Chalk", color:"#555", App:Chalk},
{id:"logins", label:"Logins", color:"#2C5F9E", App:Logins},
{id:"lists", label:"Lists", color:"#B85C00", App:Lists},
{id:"calendar", label:"Calendar", color:"#6B3FA0", App:Calendar},
{id:"money", label:"Money", color:"#1B6B35", App:Money},
{id:"health", label:"Health", color:"#B5174A", App:Health},
];
export default function Script() {
const [user, setUser] = useState(null);
const [active, setActive] = useState("chalk");
const [showMenu, setShowMenu] = useState(false); // avatar menu
const [showSett, setShowSett] = useState(false); // settings sheet
const [dark, setDark] = useState(()=>localStorage.getItem("script_dark")==="1");
const [booting, setBooting] = useState(true);
useEffect(()=>{ localStorage.setItem("script_dark", dark?"1":"0"); },[dark]);
useEffect(()=>{
sb.auth.getSession().then(({data})=>{ if(data?.session?.user) setUser(data.session.user); setBooting(false); });
const {data:listener}=sb.auth.onAuthStateChange((_,session)=>{ setUser(session?.user??null); });
return ()=>listener.subscription.unsubscribe();
},[]);
// Dark mode palette overrides

const D = dark ? {
pageBg: "#1C1C1E",
headerBg:"#2C2C2E",
border: "#3A3A3C",
text: "#F2F2F7",
sub: "#8E8E93",
} : {
pageBg: "#F5F0EE",
headerBg:"#fff",
border: C.bd,
text: C.k,
sub: C.g,
};
if (booting) return(
<div style={{minHeight:"100svh",background:C.r,display:"flex",alignItems:"center",justifyContent:"center"}}>
<div style={{textAlign:"center"}}>
<div style={{fontFamily:"'Nunito',sans-serif",fontSize:52,fontWeight:900,color:"#fff",marginBottom:16}}>Script</div>
<div style={{width:36,height:36,border:"3px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
<style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
</div>
</div>
);
if (!user) return <Login onLogin={setUser}/>;
const cur=NAV.find(n=>n.id===active);
const {App}=cur;
return(
<div style={{display:"flex",flexDirection:"column",height:"100svh",background:D.pageBg,fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
{/* Global dark-mode style injection */}
{dark && <style>{`
input, select, textarea { background:#2C2C2E !important; color:#F2F2F7 !important; border-color:#3A3A3C !important; }
input::placeholder, textarea::placeholder { color:#636366 !important; }
`}</style>}
{/* Header */}
<div style={{background:D.headerBg,borderBottom:"1.5px solid "+D.border,padding:"10px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
<div style={{display:"flex",alignItems:"center",gap:9}}>
<div style={{width:30,height:30,borderRadius:8,background:C.r,display:"flex",alignItems:"center",justifyContent:"center"}}><ScrollIcon sz={16} white={true}/></div>
<span style={{fontFamily:"'Nunito',sans-serif",fontSize:20,fontWeight:900,color:C.r,letterSpacing:.3}}>Script</span>
</div>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<span style={{fontSize:12,color:D.sub,fontWeight:600}}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
<div style={{position:"relative"}}>
<button onClick={()=>setShowMenu(!showMenu)} style={{width:32,height:32,borderRadius:9,background:cur?.color||C.r,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:14,fontFamily:"'Nunito',sans-serif",border:"none",cursor:"pointer"}}>

{(user.email?.[0]||"U").toUpperCase()}
</button>
{showMenu && (
<div onClick={()=>setShowMenu(false)} style={{position:"fixed",inset:0,zIndex:100}} />
)}
{showMenu && (
<div style={{position:"absolute",top:38,right:0,background:D.headerBg,border:"1.5px solid "+D.border,borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,.18)",zIndex:200,minWidth:180,overflow:"hidden"}}>
<div style={{padding:"12px 16px",borderBottom:"1px solid "+D.border}}>
<div style={{fontSize:11,color:D.sub,fontWeight:700,letterSpacing:1}}>SIGNED IN AS</div>
<div style={{fontSize:13,color:D.text,fontWeight:600,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:148}}>{user.email}</div>
</div>
{[
[" Settings", ()=>{setShowSett(true);setShowMenu(false);}],
[" Dark Mode", ()=>{setDark(!dark);setShowMenu(false);}],
["Sign Out", ()=>{sb.auth.signOut();setShowMenu(false);}],
].map(([l,fn])=>(
<button key={l} onClick={fn} style={{display:"block",width:"100%",padding:"12px 16px",background:"none",border:"none",textAlign:"left",fontSize:14,color:l==="Sign Out"?C.r:D.text,fontWeight:l==="Sign Out"?700:500,cursor:"pointer",fontFamily:"inherit",borderTop:"1px solid "+D.border}}>
{l===" Dark Mode" ? (dark?" Light Mode":" Dark Mode") : l}
</button>
))}
</div>
)}
</div>
</div>
</div>
{/* Section title */}
<div style={{background:D.headerBg,borderBottom:"1.5px solid "+D.border,padding:"6px 18px 10px",flexShrink:0}}>
<h1 style={{margin:0,fontSize:22,fontWeight:900,color:cur?.color||D.text,fontFamily:"'Nunito',sans-serif"}}>{cur?.label}</h1>
</div>
{/* Content */}
<div style={{flex:1,padding:"14px 16px",overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0}}>
<App userId={user.id}/>
</div>
{/* Bottom nav */}
<div style={{background:D.headerBg,borderTop:"1.5px solid "+D.border,display:"flex",flexShrink:0}}>
{NAV.map(n=>{
const on=active===n.id;
return(<button key={n.id} onClick={()=>setActive(n.id)} style={{flex:1,padding:"10px 4px 12px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,border:"none",background:on?n.color:"transparent",cursor:"pointer",fontFamily:"inherit",borderTop:on?"3px solid "+n.color:"3px solid transparent"}}>
<div style={{width:6,height:6,borderRadius:"50%",background:on?"#fff":n.color,opacity:on?1:.65}}/>
<span style={{fontSize:9,fontWeight:800,color:on?"#fff":n.color,letterSpacing:.3,textTransform:"uppercase",lineHeight:1}}>{n.label}</span>
</button>);
})}
</div>

{/* Settings sheet */}
{showSett && <Settings user={user} dark={dark} setDark={setDark} onClose={()=>setShowSett(false)}/>}
</div>
);
}
