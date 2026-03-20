import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://neihlobcyssbvrsyptve.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laWhsb2JjeXNzYnZyc3lwdHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTE1NjEsImV4cCI6MjA4ODg4NzU2MX0.AEvReQgzGKUK6gw8hUlvBArpQrP-wRBn6b_9zTexiMs";
const sb = createClient(SUPA_URL, SUPA_KEY);

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WDAYS  = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const ACCENT_COLORS = [
  {id:"red",      label:"Red",      hex:"#C8220A"},
  {id:"burgundy", label:"Burgundy", hex:"#7B1C2E"},
  {id:"hotpink",  label:"Hot Pink", hex:"#E0006A"},
  {id:"blue",     label:"Blue",     hex:"#0A6BC8"},
  {id:"navy",     label:"Navy",     hex:"#2C5F9E"},
  {id:"green",    label:"Green",    hex:"#1B6B35"},
  {id:"teal",     label:"Teal",     hex:"#00838F"},
  {id:"purple",   label:"Purple",   hex:"#6B3FA0"},
  {id:"orange",   label:"Orange",   hex:"#E05A00"},
  {id:"gold",     label:"Gold",     hex:"#B8860B"},
  {id:"yellow",   label:"Yellow",   hex:"#C8A000"},
  {id:"pink",     label:"Pink",     hex:"#B5174A"},
];
function getAccent() { try{ return localStorage.getItem("script_accent")||"#C8220A"; }catch(e){ return "#C8220A"; } }
function setAccent(hex) { try{ localStorage.setItem("script_accent",hex); }catch(e){} }
const C = { r:getAccent(), g:"#7A7A7A", k:"#1C1C1E", rl:"#FFF3F1", rm:"#FFCCC4", bd:"#E8D5D0" };

// ── SVG ICONS ──
const SvgFood        = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
const SvgStore       = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const SvgElectronics = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
const SvgCommute     = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const SvgCar         = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
const SvgMortgage    = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SvgLoan        = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const SvgVacation    = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3.5 2.5L8 10l-8.2 1.8 4 4L8 14l-2 6 4-2 2 4 1.8-8.2z"/></svg>;
const SvgATM         = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const SvgSubscription= ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>;
const SvgMedical     = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const SvgUtilities   = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const SvgOther       = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
const SvgWork        = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const SvgRealEstate  = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SvgInvestment  = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const SvgFreelance   = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const SvgGift        = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const SvgRefund      = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.9"/></svg>;
const SvgOtherIncome = ({color="#fff",size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;

const MCATS_EXPENSE = [
  {id:"Food",          icon:(c,s)=><SvgFood color={c} size={s}/>,         color:"#E65100"},
  {id:"Store",         icon:(c,s)=><SvgStore color={c} size={s}/>,        color:"#1565C0"},
  {id:"Electronics",   icon:(c,s)=><SvgElectronics color={c} size={s}/>,  color:"#6A1B9A"},
  {id:"Car",           icon:(c,s)=><SvgCar color={c} size={s}/>,          color:"#4E342E"},
  {id:"Commute",       icon:(c,s)=><SvgCommute color={c} size={s}/>,      color:"#00838F"},
  {id:"Mortgage/Rent", icon:(c,s)=><SvgMortgage color={c} size={s}/>,     color:"#4A148C"},
  {id:"Loan",          icon:(c,s)=><SvgLoan color={c} size={s}/>,         color:"#B71C1C"},
  {id:"Vacation",      icon:(c,s)=><SvgVacation color={c} size={s}/>,     color:"#0277BD"},
  {id:"ATM",           icon:(c,s)=><SvgATM color={c} size={s}/>,          color:"#546E7A"},
  {id:"Subscription",  icon:(c,s)=><SvgSubscription color={c} size={s}/>, color:"#5C6BC0"},
  {id:"Medical",       icon:(c,s)=><SvgMedical color={c} size={s}/>,      color:"#AD1457"},
  {id:"Utilities",     icon:(c,s)=><SvgUtilities color={c} size={s}/>,    color:"#F57F17"},
  {id:"Invest",        icon:(c,s)=><SvgInvestment color={c} size={s}/>,   color:"#00695C"},
  {id:"Other",         icon:(c,s)=><SvgOther color={c} size={s}/>,        color:"#546E7A"},
];
const MCATS_INCOME = [
  {id:"Work",          icon:(c,s)=><SvgWork color={c} size={s}/>,         color:"#1B5E20"},
  {id:"Real Estate",   icon:(c,s)=><SvgRealEstate color={c} size={s}/>,   color:"#2E7D32"},
  {id:"Investment",    icon:(c,s)=><SvgInvestment color={c} size={s}/>,   color:"#00695C"},
  {id:"Freelance",     icon:(c,s)=><SvgFreelance color={c} size={s}/>,    color:"#1565C0"},
  {id:"Gift",          icon:(c,s)=><SvgGift color={c} size={s}/>,         color:"#6A1B9A"},
  {id:"Refund",        icon:(c,s)=><SvgRefund color={c} size={s}/>,       color:"#0277BD"},
  {id:"Other Income",  icon:(c,s)=><SvgOtherIncome color={c} size={s}/>,  color:"#558B2F"},
];
const MCATS = [...MCATS_EXPENSE, ...MCATS_INCOME];

const inp  = {padding:"10px 13px",borderRadius:10,border:"1.5px solid #E8D5D0",fontSize:16,width:"100%",outline:"none",background:"#fff",color:"#1C1C1E",boxSizing:"border-box"};
const btn  = (bg=C.r,col="#fff") => ({background:bg,color:col,border:"none",borderRadius:10,padding:"11px 18px",fontWeight:700,fontSize:14,cursor:"pointer"});
const pill = (on,color=C.r) => ({padding:"6px 14px",borderRadius:20,border:"1.5px solid "+(on?color:"#E8D5D0"),background:on?color:"#fff",color:on?"#fff":"#7A7A7A",fontWeight:700,fontSize:13,cursor:"pointer"});
const card = {background:"#fff",border:"1.5px solid #E8D5D0",borderRadius:14,padding:"13px 15px",display:"flex",alignItems:"center",gap:12};
const box  = {background:"#FFF3F1",border:"1.5px solid #E8D5D0",borderRadius:14,padding:16,flexShrink:0};
const lbl  = {width:38,height:38,borderRadius:10,background:"#FFF3F1",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:800,fontSize:15,color:C.r};

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
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,color:C.g}}>
      <div style={{width:36,height:36,border:"3px solid #E8D5D0",borderTopColor:C.r,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:14,fontWeight:600}}>{msg}</div>
    </div>
  );
}

async function dbLoad(userId, section) {
  const { data, error } = await sb.from("script_data").select("value").eq("user_id",userId).eq("section",section).single();
  if(error && error.code !== "PGRST116") console.error("dbLoad error:", section, error);
  return data ? data.value : null;
}
async function dbSave(userId, section, value) {
  const { error } = await sb.from("script_data").upsert(
    { user_id:userId, section, value, updated_at:new Date().toISOString() },
    { onConflict:"user_id,section" }
  );
  if(error) console.error("dbSave error:", section, error);
}


async function autoAddContact(myUserId, myEmail, theirEmail) {
  // Load existing friends list
  const friends = await dbLoad(myUserId, "friends") || [];
  const already = friends.find(f => f.email === theirEmail.toLowerCase());
  if(already) return; // already a contact

  // Look up their profile
  const { data: prof } = await sb.from("user_profiles").select("id,email,username").eq("email", theirEmail.toLowerCase()).single();
  const entry = {
    id: prof?.id || "pending_"+theirEmail,
    email: theirEmail.toLowerCase(),
    username: prof?.username || theirEmail.split("@")[0]
  };
  await dbSave(myUserId, "friends", [...friends, entry]);
}

async function sendShared(fromEmail, toEmail, type, title, data) {
  const from = fromEmail.trim().toLowerCase();
  const to   = toEmail.trim().toLowerCase();

  // 1. Bell inbox (always — works even if recipient has no account yet)
  const { error } = await sb.from("shared_inbox").insert({ from_email: from, to_email: to, type, title, data });

  // 1b. Auto-add each other as contacts so chat appears without needing to "Add Friend"
  const { data: fromProfForContact } = await sb.from("user_profiles").select("id").eq("email", from).single();
  if(fromProfForContact?.id) {
    await autoAddContact(fromProfForContact.id, from, to);
  }

  // 2. Also store as a "shared_chat" entry in shared_inbox so it appears in Scrypt Chat.
  // We use shared_inbox for both bell AND chat pending items — type="shared_chat" marks it as chat-destined.
  // When recipient logs in, loadChatShares() pulls these and shows them in the conversation.
  await sb.from("shared_inbox").insert({
    from_email: from,
    to_email: to,
    type: "shared_chat",
    title,
    data: { type, title, data, from_email: from, to_email: to }
  });

  // 3. If both profiles exist, also insert a real messages row
  const { data: fromProf } = await sb.from("user_profiles").select("id").eq("email", from).single();
  const { data: toProf }   = await sb.from("user_profiles").select("id").eq("email", to).single();
  if(fromProf?.id && toProf?.id) {
    await sb.from("messages").insert({
      from_id: fromProf.id,
      to_id:   toProf.id,
      from_email: from,
      content: { type, title, data },
      type: "shared",
    });
    const typeLabel = type==="note"?"Note":type==="list"?"List":type==="calendar_day"?"Calendar Day":"Calendar";
    await sendPushToUser(toProf.id, "Script — New Share", from.split("@")[0]+" shared a "+typeLabel+" with you", "share", "shared_items");
  }
  return error;
}

// Load pending shared_chat items — shown in Scrypt Chat when no real message exists yet
async function loadChatShares(userEmail) {
  const { data } = await sb.from("shared_inbox")
    .select("*")
    .eq("to_email", userEmail.trim().toLowerCase())
    .eq("type", "shared_chat")
    .order("created_at", { ascending: true });
  return data || [];
}
async function loadInbox(userEmail) {
  const { data, error } = await sb.from("shared_inbox")
    .select("*")
    .eq("to_email", userEmail.trim().toLowerCase())
    .neq("type", "shared_chat")  // never show chat messages as bell notifications
    .order("created_at", { ascending: false });
  if(error){ console.error("inbox error", error); return []; }
  return data || [];
}
async function deleteInboxItem(id) {
  await sb.from("shared_inbox").delete().eq("id", id);
}


const VAPID_PUBLIC_KEY = "BH-XD8EFCsRSifShwSAZrSXQccdjayfZ8RDZk9Y7aBR39aQIu-FIvZ0BEWfaz2ETC0BOMuwIhwjMU-XyKM__KFA";

async function registerPush(userId) {
  try {
    if(!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if(!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    // Save subscription to DB
    await sb.from("push_subscriptions").upsert(
      { user_id: userId, subscription: sub.toJSON(), updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    return sub;
  } catch(e) { console.error("Push register error:", e); return null; }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g,"+").replace(/_/g,"/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

async function sendPushToUser(toUserId, title, body, tag="script", type="general") {
  try {
    await fetch("/api/send-push", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-script-secret": "script2025" },
      body: JSON.stringify({ userId: toUserId, title, body, tag, type })
    });
  } catch(e) { /* push is best-effort */ }
}

async function loadNotifSettings(userId) {
  const v = await dbLoad(userId, "notif_settings");
  return v || { messages:true, shared_items:true, appointments:true, medications:true, enabled:false };
}




// ── LOGIN ──
// ── SHARE MODAL ──
function ShareModal({ title, onSend, onClose, userId, friends=[] }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [errMsg, setErrMsg] = useState("");
  const [recents, setRecents] = useState([]);

  useEffect(()=>{
    if(userId) {
      dbLoad(userId,"share_recents").then(v=>{ if(v&&Array.isArray(v)) setRecents(v); else { try{ const ls=JSON.parse(localStorage.getItem("script_recents")||"[]"); setRecents(ls); }catch(e){} } });
    } else { try{ const ls=JSON.parse(localStorage.getItem("script_recents")||"[]"); setRecents(ls); }catch(e){} }
  },[userId]);

  const saveRecent = async (em) => {
    const updated = [em, ...recents.filter(r=>r!==em)].slice(0,20);
    setRecents(updated);
    try{ localStorage.setItem("script_recents", JSON.stringify(updated)); }catch(e){}
    if(userId) await dbSave(userId, "share_recents", updated).catch(()=>{});
  };

  const resolveAddr = (input) => {
    const v = input.trim().toLowerCase();
    // Check if input matches a nickname — resolve to email
    const byNick = friends.find(f => f.nickname && f.nickname.trim().toLowerCase()===v);
    if(byNick) return byNick.email;
    return v;
  };
  const send = async (toEmail) => {
    const addr = resolveAddr(toEmail||email);
    if (!addr) return;
    setState("sending");
    const err = await onSend(addr);
    if (err) {
      setErrMsg(err.message || "User not found or failed to send");
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    } else {
      await saveRecent(addr);
      setState("sent");
      setTimeout(() => { setState("idle"); onClose(); }, 2000);
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:600,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"22px 22px 0 0",width:"100%",padding:"20px 20px 40px"}}>
        <div style={{display:"flex",justifyContent:"center",paddingBottom:12}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#E8D5D0"}}/>
        </div>
        <div style={{fontWeight:900,fontSize:17,color:C.k,marginBottom:4}}>Share "{title}"</div>
        <div style={{fontSize:13,color:C.g,marginBottom:12}}>Send to another Script user by email</div>
        {recents.length>0&&(
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.g,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Recent</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {recents.map(r=>(
                <button key={r} onClick={()=>send(r)} style={{padding:"6px 12px",borderRadius:20,border:"1.5px solid #E8D5D0",background:"#fff",color:C.k,fontSize:12,fontWeight:600,cursor:"pointer",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {(()=>{const f=friends.find(x=>x.email===r); return f?.nickname||f?.username||r;})()}
                </button>
              ))}
            </div>
          </div>
        )}
        <input
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="email or nickname"
          style={{...inp,marginBottom:12}}
          autoFocus
        />
        {state==="error" && <div style={{color:"#ff6060",fontSize:13,marginBottom:10}}>{errMsg}</div>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>send()} disabled={state==="sending"||state==="sent"} style={{...btn(state==="sent"?"#1B6B35":C.r),flex:1}}>
            {state==="sending"?"Sending...":state==="sent"?"✓ Sent!":"Send"}
          </button>
          <button onClick={onClose} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",flex:1}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── INBOX MODAL ──
function InboxModal({ items, onAccept, onDismiss, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:600,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"85vh",display:"flex",flexDirection:"column",padding:"20px 0 0"}}>
        <div style={{display:"flex",justifyContent:"center",paddingBottom:8}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#E8D5D0"}}/>
        </div>
        <div style={{fontWeight:900,fontSize:17,color:C.k,padding:"0 20px",marginBottom:12}}>Shared with you</div>
        <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px",display:"flex",flexDirection:"column",gap:10,WebkitOverflowScrolling:"touch"}}>
          {items.map(item=>(
            <div key={item.id} style={{background:"#F5F0EE",borderRadius:14,padding:"13px 15px"}}>
              <div style={{fontWeight:700,fontSize:14,color:C.k,marginBottom:2}}>{item.title}</div>
              <div style={{fontSize:12,color:C.g,marginBottom:10}}>
                From <span style={{fontWeight:700,color:C.k}}>{item.from_email}</span>
                {" · "}{item.type==="list"?"List":item.type==="note"?"Note":"Calendar"}
              </div>
              <div style={{display:"flex",gap:8}}>
                {item.type==="calendar" ? (
                <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
                  <div style={{fontSize:12,color:C.g,marginBottom:4}}>{Object.keys(item.data||{}).length} day(s) with notes</div>
                  {Object.entries(item.data||{}).slice(0,5).map(([k,v])=>(
                    <div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0,0,0,.04)",borderRadius:8,padding:"6px 10px"}}>
                      <div style={{fontSize:13,color:C.k,flex:1,minWidth:0}}>
                        <span style={{fontWeight:700}}>{k}</span>
                        <span style={{color:C.g,marginLeft:6,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block",maxWidth:120}}>{v.slice(0,40)}</span>
                      </div>
                      <button onClick={()=>onAccept({...item,type:"calendar_day",dayKey:k,data:v})} style={{...btn(),fontSize:11,padding:"4px 10px",borderRadius:8,flexShrink:0}}>Save</button>
                    </div>
                  ))}
                  {Object.keys(item.data||{}).length>5&&<div style={{fontSize:11,color:C.g,textAlign:"center"}}>+{Object.keys(item.data).length-5} more days</div>}
                  <button onClick={()=>onAccept(item)} style={{...btn(),fontSize:13,padding:"9px",marginTop:4}}>Save All Days</button>
                </div>
              ) : (
                <button onClick={()=>onAccept(item)} style={{...btn(),flex:1,fontSize:13,padding:"9px"}}>Add to my {item.type==="list"?"Lists":"Chalk"}</button>
              )}
                <button onClick={()=>onDismiss(item.id)} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",flex:1,fontSize:13,padding:"9px"}}>Dismiss</button>
              </div>
            </div>
          ))}
          {items.length===0&&<div style={{textAlign:"center",color:C.g,padding:36,fontSize:14}}>Nothing shared with you yet.</div>}
        </div>
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [mode,setMode]=useState("in");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [agreed,setAgreed]=useState(false);
  const [showDisc,setShowDisc]=useState(false);
  const [err,setErr]=useState("");
  const [info,setInfo]=useState("");
  const [loading,setLoading]=useState(false);

  const go = async () => {
    setErr(""); setInfo(""); setLoading(true);
    if(mode==="reset"){
      if(!email.trim()){ setErr("Enter your email address."); setLoading(false); return; }
      const {error}=await sb.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.href});
      if(error){ setErr(error.message); } else { setInfo("Password reset email sent! Check your inbox."); }
      setLoading(false); return;
    }
    if(!email.trim()||pass.length<6){ setErr("Email & password (6+ chars) required."); setLoading(false); return; }
    if(mode==="up"&&!agreed){ setErr("Please read and accept the disclaimer to continue."); setLoading(false); return; }
    if(mode==="in"){
      const {data,error}=await sb.auth.signInWithPassword({email:email.trim(),password:pass});
      if(error){ setErr(error.message); setLoading(false); return; }
      await getOrCreateProfile(data.user.id, data.user.email).catch(()=>{});
      onLogin(data.user);
    } else {
      const {data,error}=await sb.auth.signUp({email:email.trim(),password:pass});
      if(error){ setErr(error.message); setLoading(false); return; }
      if(data.user&&!data.session){ setInfo("Check your email to confirm your account, then sign in."); setLoading(false); return; }
      if(data.user) await getOrCreateProfile(data.user.id, data.user.email).catch(()=>{});
      onLogin(data.user);
    }
    setLoading(false);
  };

  const II={width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.08)",color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box"};
  return(
    <div style={{minHeight:"100svh",background:"linear-gradient(160deg,#C8220A 0%,#8B1507 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Nunito',sans-serif"}}>
      <style>{`input::placeholder{color:rgba(255,255,255,.35)!important;}`}</style>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:10}}>
            <span style={{fontFamily:"'Nunito',sans-serif",fontSize:56,fontWeight:900,color:"#fff",letterSpacing:-2}}>Script</span>
            <ScrollIcon sz={50} white={true}/>
          </div>
          <div style={{color:"rgba(255,255,255,.55)",fontSize:13,letterSpacing:2.5,fontWeight:700,textTransform:"uppercase"}}>Your Personal Organizer</div>
        </div>
        <div style={{background:"rgba(0,0,0,.45)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:28}}>
          {mode!=="reset"&&(
            <div style={{display:"flex",background:"rgba(255,255,255,.07)",borderRadius:12,padding:4,gap:4,marginBottom:24}}>
              {[["in","Sign In"],["up","Create Account"]].map(([m,l])=>(
                <button key={m} onClick={()=>{setMode(m);setErr("");setInfo("");}} style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:mode===m?"#fff":"transparent",color:mode===m?C.r:"rgba(255,255,255,.6)",fontWeight:700,fontSize:14,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
          )}
          {mode==="reset"&&(
            <div style={{marginBottom:22}}>
              <button onClick={()=>{setMode("in");setErr("");setInfo("");}} style={{background:"none",border:"none",color:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:13,padding:0}}>← Back to Sign In</button>
              <div style={{color:"#fff",fontWeight:700,fontSize:18,marginTop:12}}>Reset Password</div>
              <div style={{color:"rgba(255,255,255,.45)",fontSize:13,marginTop:4}}>Enter your email to receive a reset link.</div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>Email</div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="you@email.com" style={II}/>
            </div>
            {mode!=="reset"&&(
              <div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>Password</div>
                <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" style={II}/>
              </div>
            )}
          </div>
          {mode==="up"&&(
            <div style={{marginTop:18,background:"rgba(0,0,0,.25)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <button onClick={()=>setAgreed(!agreed)} style={{width:20,height:20,borderRadius:5,border:"1.5px solid rgba(255,255,255,.3)",background:agreed?"rgba(200,34,10,.7)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                  {agreed&&<span style={{color:"#fff",fontSize:12,fontWeight:900}}>✓</span>}
                </button>
                <div style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.5}}>
                  I have read and agree to the{" "}
                  <button onClick={()=>setShowDisc(!showDisc)} style={{background:"none",border:"none",color:"rgba(255,255,255,.85)",cursor:"pointer",textDecoration:"underline",fontSize:12,padding:0}}>Disclaimer</button>
                </div>
              </div>
              {showDisc&&(
                <div style={{marginTop:12,padding:"14px 16px",background:"rgba(0,0,0,.3)",borderRadius:10,color:"#fff",fontSize:12,lineHeight:1.7}}>
                  <div style={{fontWeight:800,fontSize:13,marginBottom:10,letterSpacing:.5}}>Data &amp; Privacy Disclaimer</div>
                  <div style={{marginBottom:8}}><span style={{fontWeight:700}}>Data Security: </span>No internet-based system is 100% secure. While we take reasonable measures to protect your data, we cannot guarantee absolute security against data breaches, unauthorized access, or data loss. You assume full responsibility for the sensitivity of any information you choose to store in this application.</div>
                  <div style={{marginBottom:8}}><span style={{fontWeight:700}}>Your Responsibility: </span>Do not store highly sensitive information such as Social Security numbers, bank account numbers, passwords to other services, or any data whose exposure could cause you significant harm.</div>
                  <div style={{marginBottom:8}}><span style={{fontWeight:700}}>Data Sharing: </span>We will not voluntarily share, sell, or disclose your personal data to any third party. We may be required to disclose your data if compelled by a valid court order, subpoena, or request from a government or law enforcement agency.</div>
                  <div style={{marginBottom:8}}><span style={{fontWeight:700}}>No Warranty: </span>This application is provided "as is" without warranty of any kind. We are not liable for any loss, damage, or harm resulting from the use of this application or any data loss that may occur.</div>
                  <div><span style={{fontWeight:700}}>Acceptance: </span>By checking this box, you confirm that you have read, understood, and agree to this disclaimer.</div>
                </div>
              )}
            </div>
          )}
          {err&&<div style={{marginTop:14,color:"#ff8080",fontSize:13,textAlign:"center",background:"rgba(255,80,80,.1)",borderRadius:8,padding:"10px 14px"}}>{err}</div>}
          {info&&<div style={{marginTop:14,color:"#a0ffb0",fontSize:13,textAlign:"center",background:"rgba(80,255,120,.1)",borderRadius:8,padding:"10px 14px"}}>{info}</div>}
          <button onClick={go} disabled={loading} style={{width:"100%",marginTop:20,padding:"15px",borderRadius:12,border:"none",background:"#fff",color:C.r,fontWeight:800,fontSize:15,cursor:"pointer",opacity:loading?0.7:1}}>
            {loading?"Please wait...":mode==="reset"?"Send Reset Email":mode==="in"?"Sign In":"Create Account"}
          </button>
          {mode==="in"&&(
            <button onClick={()=>{setMode("reset");setErr("");setInfo("");}} style={{width:"100%",marginTop:12,padding:"10px",background:"none",border:"none",color:"rgba(255,255,255,.45)",cursor:"pointer",fontSize:13}}>
              Forgot password?
            </button>
          )}
        </div>
        <p style={{textAlign:"center",color:"rgba(255,255,255,.25)",fontSize:11,marginTop:16,letterSpacing:1}}>© Script by BNT</p>
      </div>
    </div>
  );
}

// ── CHALK ──
function Chalk({ userId, dark, userEmail }) {
  const [text,setText]=useState("");
  const [loaded,setLoaded]=useState(false);
  const [mode,setMode]=useState("type");
  const [showShare,setShowShare]=useState(false);
  const [listening,setListening]=useState(false);
  const recognitionRef=useRef(null);
  const [drawing,setDrawing]=useState(false);
  const [paths,setPaths]=useState([]);
  const [color,setColor]=useState("#ffffff");
  const [size,setSize]=useState(3);
  const canvasRef=useRef(null);
  const timer=useRef(null);
  const lastPt=useRef(null);

  useEffect(()=>{
    dbLoad(userId,"chalk").then(v=>{
      if(v&&typeof v==="object"){ if(v.text!==undefined) setText(v.text||""); if(v.paths!==undefined) setPaths(v.paths||[]); }
      else if(typeof v==="string") setText(v||"");
      setLoaded(true);
    });
  },[userId]);

  const save=(t,p)=>{ 
    try{ localStorage.setItem("chalk_cache_"+userId, JSON.stringify({text:t,paths:p})); }catch(e){}
    clearTimeout(timer.current); timer.current=setTimeout(async()=>{ await dbSave(userId,"chalk",{text:t,paths:p}); },1200); 
  };
  const onTextChange=val=>{ setText(val); save(val,paths); };
  const startListening=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ alert("Speech not supported in this browser."); return; }
    const r=new SR(); r.continuous=true; r.interimResults=false; r.lang="en-US";
    r.onresult=e=>{ const t=Array.from(e.results).slice(e.resultIndex).map(x=>x[0].transcript).join(" "); setText(prev=>{ const v=prev+(prev?" ":"")+t; save(v,paths); return v; }); };
    r.onerror=()=>setListening(false); r.onend=()=>setListening(false);
    recognitionRef.current=r; r.start(); setListening(true);
  };
  const stopListening=()=>{ recognitionRef.current?.stop(); setListening(false); };

  useEffect(()=>{
    if(mode!=="draw"||!canvasRef.current) return;
    const canvas=canvasRef.current, ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.lineCap="round"; ctx.lineJoin="round";
    paths.forEach(path=>{
      if(!path.pts||path.pts.length<2) return;
      ctx.strokeStyle=path.color||"#fff"; ctx.lineWidth=path.size||3;
      ctx.beginPath(); ctx.moveTo(path.pts[0].x,path.pts[0].y);
      path.pts.slice(1).forEach(pt=>ctx.lineTo(pt.x,pt.y)); ctx.stroke();
    });
  },[paths,mode]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas||mode!=="draw") return;
    const prevent=e=>e.preventDefault();
    canvas.addEventListener("touchstart",prevent,{passive:false});
    canvas.addEventListener("touchmove",prevent,{passive:false});
    return()=>{ canvas.removeEventListener("touchstart",prevent); canvas.removeEventListener("touchmove",prevent); };
  },[mode]);

  const getPos=(e,canvas)=>{ const r=canvas.getBoundingClientRect(), touch=e.touches?.[0]||e.changedTouches?.[0]||e; return {x:(touch.clientX-r.left)*(canvas.width/r.width),y:(touch.clientY-r.top)*(canvas.height/r.height)}; };
  const startDraw=e=>{ const canvas=canvasRef.current, pt=getPos(e,canvas); lastPt.current=pt; setDrawing(true); setPaths(prev=>[...prev,{color,size,pts:[pt]}]); };
  const moveDraw=e=>{ if(!drawing) return; const canvas=canvasRef.current, pt=getPos(e,canvas), ctx=canvas.getContext("2d"); ctx.strokeStyle=color; ctx.lineWidth=size; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.beginPath(); ctx.moveTo(lastPt.current.x,lastPt.current.y); ctx.lineTo(pt.x,pt.y); ctx.stroke(); lastPt.current=pt; setPaths(prev=>{ const u=[...prev]; u[u.length-1]={...u[u.length-1],pts:[...u[u.length-1].pts,pt]}; return u; }); };
  const endDraw=()=>{ setDrawing(false); save(text,paths); };
  const eraseLast=()=>{ const p=paths.slice(0,-1); setPaths(p); save(text,p); };
  const clearText=()=>{ setText(""); save("",paths); };
  const clearDraw=()=>{ const p=[]; setPaths(p); save(text,p); if(canvasRef.current){ const ctx=canvasRef.current.getContext("2d"); ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height); } };
  const clearAll=()=>{ if(mode==="type") clearText(); else clearDraw(); };

  const COLORS=["#ffffff","#ffeb3b","#ff8a80","#80d8ff","#b9f6ca","#ea80fc","#ff6d00","#1de9b6"];
  const pieces=[{w:44,c:"#F5F0E8"},{w:28,c:"#E8C49A"},{w:38,c:"#C8DDB0"},{w:22,c:"#A8C4D8"},{w:34,c:"#D4B8E0"}];

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",borderRadius:14,background:dark?"#1C2C1C":"#6b8c52",border:"2px solid rgba(255,255,255,.15)"}}>
      <style>{`@media(min-width:600px){.chalk-textarea{font-size:15px!important;line-height:1.6!important;} .chalk-board{max-width:700px;margin:0 auto;width:100%;position:relative;}}`}</style>
      <div style={{flexShrink:0,background:"rgba(0,0,0,.22)",borderBottom:"2px solid rgba(0,0,0,.2)",padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",gap:5,alignItems:"center",flex:1}}>
          {pieces.map((pc,i)=><div key={i} style={{width:pc.w,height:11,borderRadius:3,background:pc.c,opacity:.85}}/>)}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",background:"rgba(0,0,0,.3)",borderRadius:8,padding:2,gap:2}}>
            {[["type","✏ Type"],["draw","🖊 Draw"]].map(([m,l])=>(
              <button key={m} onClick={()=>setMode(m)} style={{padding:"4px 10px",borderRadius:6,border:"none",background:mode===m?"rgba(255,255,255,.18)":"transparent",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      {mode==="draw"&&(
        <div style={{flexShrink:0,background:"rgba(0,0,0,.18)",borderBottom:"1px solid rgba(0,0,0,.15)",padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {COLORS.map(col=><button key={col} onClick={()=>setColor(col)} style={{width:color===col?24:18,height:color===col?24:18,borderRadius:"50%",background:col,border:color===col?"2px solid #fff":"2px solid transparent",cursor:"pointer",transition:"all .15s"}}/>)}
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center",marginLeft:"auto"}}>
            {[2,4,8].map(s=>(
              <button key={s} onClick={()=>setSize(s)} style={{width:s===2?20:s===4?24:28,height:s===2?20:s===4?24:28,borderRadius:"50%",background:size===s?"rgba(255,255,255,.3)":"rgba(255,255,255,.08)",border:"1.5px solid rgba(255,255,255,.2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:s,height:s,borderRadius:"50%",background:"#fff"}}/>
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        {!loaded&&<div style={{position:"absolute",inset:0,background:dark?"#1C2C1C":"#6b8c52",display:"flex",alignItems:"center",justifyContent:"center"}}><Spinner msg=""/></div>}
        {mode==="type"&&(
          <textarea value={text} onChange={e=>onTextChange(e.target.value)} placeholder="" className="chalk-textarea"
            style={{position:"absolute",inset:0,width:"100%",height:"100%",padding:"20px 24px",background:"transparent",border:"none",outline:"none",resize:"none",color:"#fff",fontSize:17,lineHeight:1.7,fontFamily:"'Nunito',sans-serif",boxSizing:"border-box"}}
          ></textarea>
        )}
        {mode==="draw"&&(
          <canvas ref={canvasRef} width={800} height={1200}
            onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
            style={{position:"absolute",inset:0,width:"100%",height:"100%",cursor:"crosshair",touchAction:"none",background:dark?"#1C2C1C":"#6b8c52"}}
          />
        )}
        {showShare&&<ShareModal title={mode==="draw"?"My Drawing":"My Notes"} userId={userId} friends={[]} onClose={()=>setShowShare(false)} onSend={async(toEmail)=>sendShared(userEmail,toEmail,"note",mode==="draw"?"Chalk Drawing":"Chalk Notes",mode==="draw"?{text,paths}:text)}/>}
        <button onClick={()=>setShowShare(true)} style={{position:"absolute",bottom:16,left:16,background:"rgba(0,0,0,.35)",border:"1.5px solid rgba(255,255,255,.25)",borderRadius:24,padding:"10px 16px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",backdropFilter:"blur(4px)"}}>⬆ Share</button>
        {mode==="type"&&(
          <button onClick={listening?stopListening:startListening} style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:listening?"rgba(200,34,10,.85)":"rgba(0,0,0,.35)",border:"1.5px solid rgba(255,255,255,.25)",borderRadius:24,padding:"10px 16px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={listening?"#fff":"none"} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            {listening?"Listening...":"Speak"}
          </button>
        )}
        <div style={{position:"absolute",bottom:16,right:16,display:"flex",gap:10,alignItems:"center"}}>
          {mode==="draw"&&(
            <button onClick={eraseLast} style={{width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,.35)",border:"1.5px solid rgba(255,255,255,.25)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.9"/></svg>
            </button>
          )}
          <button onClick={clearAll} style={{width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,.35)",border:"1.5px solid rgba(255,255,255,.25)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16l10-10 7 7-3.5 3.5"/><path d="M6.5 17.5l4-4"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LOGINS ──
function Logins({ userId }) {
  const [data,setData]=useState([]);
  const [form,setForm]=useState({site:"",username:"",hint:"",type:"Personal"});
  const [open,setOpen]=useState(false);
  const [reveal,setReveal]=useState(null);
  const [filter,setFilter]=useState("All");
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{ dbLoad(userId,"logins").then(v=>{ if(v) setData(v); setLoaded(true); }); },[userId]);
  const S=async d=>{ setData(d); await dbSave(userId,"logins",d); };
  const add=()=>{ if(!form.site.trim()) return; S([...data,{...form,id:Date.now()}]); setForm({site:"",username:"",hint:"",type:"Personal"}); setOpen(false); };
  const fil=filter==="All"?data:data.filter(l=>l.type===filter);

  if(!loaded) return <Spinner msg="Loading logins..."/>;
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
        {["All","Personal","Work"].map(f=><button key={f} style={pill(filter===f)} onClick={()=>setFilter(f)}>{f}</button>)}
        <button onClick={()=>setOpen(!open)} style={{...btn(),marginLeft:"auto",borderRadius:20,padding:"6px 16px"}}>+ Add</button>
      </div>
      {open&&(
        <div style={box}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
            <input style={inp} value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="Website / App"/>
            <input style={inp} value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Username / Email"/>
            <input style={{...inp,gridColumn:"span 2"}} value={form.hint} onChange={e=>setForm({...form,hint:e.target.value})} placeholder="Password hint"/>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {["Personal","Work"].map(t=>(
              <button key={t} onClick={()=>setForm({...form,type:t})} style={{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid "+(form.type===t?C.r:"#E8D5D0"),background:form.type===t?C.rl:"#fff",color:form.type===t?C.r:C.g,fontWeight:700,fontSize:13,cursor:"pointer"}}>{t}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={add} style={{...btn(),flex:1}}>Save</button>
            <button onClick={()=>setOpen(false)} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",flex:1}}>Cancel</button>
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
              {l.hint&&(
                <div style={{fontSize:12,color:C.r,marginTop:3,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontWeight:800,flexShrink:0}}>Hint:</span>
                  <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reveal===l.id?l.hint:"••••••••"}</span>
                  <button onClick={()=>setReveal(reveal===l.id?null:l.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.r,fontWeight:700,flexShrink:0}}>{reveal===l.id?"Hide":"Show"}</button>
                </div>
              )}
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
              <span style={{fontSize:11,background:l.type==="Work"?"#EBF5FB":C.rl,color:l.type==="Work"?"#2C5F9E":C.r,padding:"3px 8px",borderRadius:20,fontWeight:700}}>{l.type}</span>
              <button onClick={()=>S(data.filter(x=>x.id!==l.id))} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:16}}>×</button>
            </div>
          </div>
        ))}
        {fil.length===0&&<div style={{textAlign:"center",color:C.g,padding:48,fontSize:14}}>No logins yet.</div>}
      </div>
    </div>
  );
}

// ── LISTS ──
const BASE_LISTS=[
  {id:"todo",label:"To Do",kind:"check",items:[]},
  {id:"grocery",label:"Grocery",kind:"check",items:[]},
  {id:"watch",label:"To Watch",kind:"check",items:[]},
];

function Lists({ userId, userEmail }) {
  const [lists,setLists]=useState(BASE_LISTS);
  const [active,setActive]=useState("todo");
  const [ni,setNi]=useState("");
  const [showN,setShowN]=useState(false);
  const [nn,setNn]=useState("");
  const [loaded,setLoaded]=useState(false);
  const [showShare,setShowShare]=useState(false);
  const [editItemId,setEditItemId]=useState(null);
  const [editText,setEditText]=useState("");
  const listsRef=useRef(BASE_LISTS);

  useEffect(()=>{ dbLoad(userId,"lists").then(v=>{ if(v){ setLists(v); listsRef.current=v; } setLoaded(true); }); },[userId]);
  const S=async d=>{ setLists(d); listsRef.current=d; await dbSave(userId,"lists",d); };
  const addItem=()=>{ if(!ni.trim()) return; const u=listsRef.current.map(l=>l.id===active?{...l,items:[...l.items,{id:Date.now(),text:ni,done:false}]}:l); S(u); setNi(""); };
  const toggle=id=>S(listsRef.current.map(l=>l.id===active?{...l,items:l.items.map(i=>i.id===id?{...i,done:!i.done}:i)}:l));
  const del=id=>S(listsRef.current.map(l=>l.id===active?{...l,items:l.items.filter(i=>i.id!==id)}:l));
  const saveEdit=(id,text)=>{ if(!text.trim()) return; S(listsRef.current.map(l=>l.id===active?{...l,items:l.items.map(i=>i.id===id?{...i,text}:i)}:l)); setEditItemId(null); };
  const addCustomList=()=>{ if(!nn.trim()) return; const nl={id:"c"+Date.now(),label:nn,kind:"check",items:[]}; const u=[...listsRef.current,nl]; S(u); setActive(nl.id); setNn(""); setShowN(false); };
  const removeList=id=>{ if(active===id) setActive("todo"); S(listsRef.current.filter(x=>x.id!==id)); };
  const al=lists.find(l=>l.id===active)||lists[0];

  if(!loaded) return <Spinner msg="Loading lists..."/>;
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",flexShrink:0,alignItems:"center"}}>
        {lists.map(l=>(
          <button key={l.id} style={{...pill(active===l.id),display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}} onClick={()=>setActive(l.id)}>
            {l.label}
            {l.id!=="todo"&&<span onClick={e=>{e.stopPropagation();removeList(l.id);}} style={{opacity:.6,fontSize:14,marginLeft:2}}>×</span>}
          </button>
        ))}
        <button onClick={()=>setShowN(!showN)} style={{padding:"6px 12px",borderRadius:20,border:"1.5px dashed #E8D5D0",background:"#fff",color:C.g,fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>+ New</button>
        <button onClick={()=>setShowShare(true)} style={{padding:"6px 12px",borderRadius:20,border:"none",background:C.r,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>⬆ Share</button>
      </div>
      {showShare&&<ShareModal title={al?.label||"List"} userId={userId} friends={[]} onClose={()=>setShowShare(false)} onSend={async(toEmail)=>{ const al2=listsRef.current.find(l=>l.id===active)||listsRef.current[0]; return await sendShared(userEmail,toEmail,"list",al2.label,al2.items); }}/>}
      {showN&&(
        <div style={box}>
          <div style={{display:"flex",gap:8}}>
            <input style={{...inp,flex:1}} value={nn} onChange={e=>setNn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomList()} placeholder="List name"/>
            <button onClick={addCustomList} style={{...btn(),padding:"10px 16px"}}>Create</button>
            <button onClick={()=>setShowN(false)} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",padding:"10px 16px"}}>✕</button>
          </div>
        </div>
      )}
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:10,minHeight:0}}>
        <div style={{display:"flex",gap:9,flexShrink:0}}>
          <input style={{...inp,flex:1,minWidth:0}} value={ni} onChange={e=>setNi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()} placeholder="Add item..."/>
          <button onClick={addItem} style={{...btn(),padding:"10px 18px",fontSize:18,flexShrink:0}}>+</button>
        </div>
        <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
          {al.items.map(it=>(
            <div key={it.id} style={{display:"flex",alignItems:"center",gap:11,padding:"12px 14px",background:"#fff",borderRadius:12,border:"1.5px solid #E8D5D0",flexShrink:0}}>
              <button onClick={()=>toggle(it.id)} style={{width:24,height:24,borderRadius:8,border:"2px solid "+(it.done?C.r:"#E8D5D0"),background:it.done?C.r:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {it.done&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}
              </button>
              {editItemId===it.id ? (
                <input
                  style={{...inp,flex:1,fontSize:14,padding:"4px 8px"}}
                  value={editText}
                  onChange={e=>setEditText(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") saveEdit(it.id,editText); if(e.key==="Escape") setEditItemId(null); }}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={()=>{setEditItemId(it.id);setEditText(it.text);}} style={{flex:1,fontSize:14,textDecoration:it.done?"line-through":"none",color:it.done?C.g:C.k,wordBreak:"break-word"}}>{it.text}</span>
              )}
              {editItemId===it.id ? (
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button onClick={()=>saveEdit(it.id,editText)} style={{background:C.r,border:"none",borderRadius:6,padding:"4px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Save</button>
                  <button onClick={()=>setEditItemId(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:18}}>×</button>
                </div>
              ) : (
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button onClick={()=>{setEditItemId(it.id);setEditText(it.text);}} style={{background:"none",border:"none",cursor:"pointer",color:C.g,fontSize:12,fontWeight:700}}>Edit</button>
                  <button onClick={()=>del(it.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:18}}>×</button>
                </div>
              )}
            </div>
          ))}
          {al.items.length===0&&<div style={{textAlign:"center",color:C.g,padding:36,fontSize:14}}>Nothing here yet.</div>}
        </div>
      </div>
    </div>
  );
}

// ── CALENDAR ──

function CalendarNote({ selKey, evtsRef, userId, onUpdate }) {
  const [val,setVal]=useState(()=>evtsRef.current[selKey]||"");
  const saveTimer=useRef(null);

  const onChange=e=>{
    const v=e.target.value;
    setVal(v);
    const updated={...evtsRef.current};
    if(v.trim()){ updated[selKey]=v; } else { delete updated[selKey]; }
    evtsRef.current=updated;
    onUpdate(updated);
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(()=>{ dbSave(userId,"cal",evtsRef.current); },800);
  };

  useEffect(()=>{ return()=>{ clearTimeout(saveTimer.current); dbSave(userId,"cal",evtsRef.current); }; },[]);

  return(
    <textarea value={val} onChange={onChange} placeholder="Notes for this day..."
      style={{flex:1,minHeight:180,padding:"14px 16px",borderRadius:14,border:"1.5px solid #E8D5D0",fontSize:16,resize:"none",outline:"none",fontFamily:"'Nunito',sans-serif",background:"#fff",color:"#1C1C1E"}}
    ></textarea>
  );
}

function SharedLoginForm({ onLogin }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const go=async()=>{ setErr(""); setLoading(true); const{data,error}=await sb.auth.signInWithPassword({email:email.trim(),password:pass}); if(error){setErr(error.message);setLoading(false);return;} onLogin(data.user); };
  const II={width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid #E8D5D0",fontSize:16,outline:"none",boxSizing:"border-box",marginBottom:10};
  return(
    <div>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={II}/>
      <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Password" style={II}/>
      {err&&<div style={{color:C.r,fontSize:12,marginBottom:10}}>{err}</div>}
      <button onClick={go} disabled={loading} style={{...btn(),width:"100%",padding:"13px",fontSize:15}}>{loading?"Signing in...":"Sign In"}</button>
    </div>
  );
}

function SharedCalendarView({ shareId }) {
  const [data,setData]=useState(null);
  const [cal,setCal]=useState(()=>{ const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),1); });
  const [selKey,setSelKey]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [notFound,setNotFound]=useState(false);
  const [user,setUser]=useState(null);
  const [addState,setAddState]=useState("idle");
  const [showLogin,setShowLogin]=useState(false);
  const now=new Date();

  useEffect(()=>{
    sb.auth.getSession().then(({data:s})=>{ if(s?.session?.user) setUser(s.session.user); });
    const {data:listener}=sb.auth.onAuthStateChange((_,session)=>{ setUser(session?.user??null); });
    sb.from("shared_calendars").select("data,owner_email").eq("id",shareId).single()
      .then(({data:row,error})=>{ if(error||!row){setNotFound(true);setLoaded(true);return;} setData(row); setLoaded(true); });
    return()=>listener.subscription.unsubscribe();
  },[shareId]);

  const y=cal.getFullYear(), m=cal.getMonth();
  const dim=new Date(y,m+1,0).getDate(), fd=new Date(y,m,1).getDay();
  const makeKey=(day,yr,mo)=>yr+"-"+(mo+1)+"-"+day;
  const selParts=selKey?selKey.split("-").map(Number):null;
  const selMonth=selParts?.[1], selDay=selParts?.[2];

  const addToMyCalendar=async()=>{
    if(!user){setShowLogin(true);return;}
    if(!selKey) return;
    setAddState("adding");
    try{
      const existing=await dbLoad(user.id,"cal")||{};
      const sharedNote=data?.data?.[selKey]||"";
      const existingNote=existing[selKey]||"";
      const merged=existingNote?existingNote+"\n\n--- Added from shared calendar ---\n"+sharedNote:sharedNote;
      await dbSave(user.id,"cal",{...existing,[selKey]:merged});
      setAddState("added"); setTimeout(()=>setAddState("idle"),3000);
    }catch(e){ console.error(e); setAddState("error"); setTimeout(()=>setAddState("idle"),3000); }
  };

  if(!loaded) return(
    <div style={{minHeight:"100svh",background:C.r,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:40,fontWeight:900,color:"#fff",marginBottom:16}}>Script</div>
        <div style={{width:32,height:32,border:"3px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if(notFound) return(
    <div style={{minHeight:"100svh",background:"#F5F0EE",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif"}}>
      <div style={{textAlign:"center",padding:32}}>
        <div style={{fontSize:48,marginBottom:12}}>📅</div>
        <div style={{fontWeight:900,fontSize:22,color:C.k,marginBottom:8}}>Calendar not found</div>
        <div style={{color:C.g,fontSize:14}}>This link may have expired or been removed.</div>
        <a href="https://script-sable.vercel.app" style={{display:"inline-block",marginTop:20,padding:"12px 24px",background:C.r,color:"#fff",borderRadius:10,textDecoration:"none",fontWeight:700}}>Open Script</a>
      </div>
    </div>
  );

  const evts=data?.data||{};
  return(
    <div style={{minHeight:"100svh",background:"#F5F0EE",fontFamily:"'Nunito',sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:"#fff",borderBottom:"1.5px solid #E8D5D0",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:28,height:28,borderRadius:8,background:C.r,display:"flex",alignItems:"center",justifyContent:"center"}}><ScrollIcon sz={16} white={true}/></div>
          <span style={{fontFamily:"'Nunito',sans-serif",fontSize:18,fontWeight:900,color:C.r}}>Script</span>
        </div>
        {user?<div style={{fontSize:12,color:C.g,fontWeight:600}}>Signed in as <span style={{color:C.k}}>{user.email}</span></div>:<button onClick={()=>setShowLogin(true)} style={{...btn(),padding:"7px 14px",fontSize:12,borderRadius:20}}>Sign In</button>}
      </div>
      {data?.owner_email&&<div style={{background:"#fff",borderBottom:"1.5px solid #E8D5D0",padding:"8px 16px",fontSize:12,color:C.g}}>📅 Shared by <span style={{fontWeight:700,color:C.k}}>{data.owner_email}</span></div>}
      {showLogin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowLogin(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:360}}>
            <div style={{fontWeight:900,fontSize:18,color:C.k,marginBottom:4}}>Sign in to Script</div>
            <div style={{fontSize:13,color:C.g,marginBottom:20}}>Sign in to add this event to your calendar.</div>
            <SharedLoginForm onLogin={u=>{setUser(u);setShowLogin(false);}}/>
          </div>
        </div>
      )}
      <div style={{flex:1,padding:"14px 16px",display:"flex",flexDirection:"column",gap:12,maxWidth:500,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>
        <div style={{background:"#fff",borderRadius:14,border:"1.5px solid #E8D5D0",overflow:"hidden",flexShrink:0}}>
          <div style={{background:"linear-gradient(135deg,#C8220A,#E03010)",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <button onClick={()=>{setSelKey(null);setCal(new Date(y,m-1,1));}} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",color:"#fff",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Nunito',sans-serif",color:"#fff",fontWeight:900,fontSize:18}}>{MONTHS[m]}</div>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:12}}>{y}</div>
            </div>
            <button onClick={()=>{setSelKey(null);setCal(new Date(y,m+1,1));}} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",color:"#fff",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
          </div>
          <div style={{padding:"12px 14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
              {WDAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:C.g,padding:"2px 0"}}>{d}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
              {Array(fd).fill(null).map((_,i)=><div key={"e"+i}/>)}
              {Array(dim).fill(null).map((_,i)=>{
                const d=i+1, key=makeKey(d,y,m);
                const isT=d===now.getDate()&&m===now.getMonth()&&y===now.getFullYear();
                const isS=selKey===key, has=!!evts[key]?.trim();
                return(
                  <div key={d} onClick={()=>setSelKey(isS?null:key)} style={{borderRadius:8,padding:"6px 2px",textAlign:"center",cursor:has?"pointer":"default",background:isS?C.r:isT?C.rl:"transparent",border:isT&&!isS?"1.5px solid "+C.r:"1.5px solid transparent"}}>
                    <div style={{fontSize:13,fontWeight:isT||isS?800:400,color:isS?"#fff":isT?C.r:C.k}}>{d}</div>
                    {has&&<div style={{width:5,height:5,borderRadius:"50%",background:isS?"#fff":C.r,margin:"2px auto 0"}}/>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button onClick={addToMyCalendar} disabled={addState==="adding"||!selKey||!evts[selKey]?.trim()} style={{background:addState==="added"?"#1B6B35":addState==="error"?"#888":C.r,color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:(selKey&&evts[selKey]?.trim())?1:0.4}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
          {addState==="adding"?"Adding...":addState==="added"?"✓ Added to My Calendar!":addState==="error"?"Error — try again":"Add to My Calendar"}
        </button>
        {selKey&&evts[selKey]?.trim()?(
          <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>
            <div style={{background:C.r,borderRadius:14,padding:"12px 16px",flexShrink:0}}>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:11,letterSpacing:1}}>{selMonth!=null?MONTHS[selMonth-1].toUpperCase():""}</div>
              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:30,fontWeight:900,color:"#fff"}}>{selDay}</div>
            </div>
            <div style={{flex:1,padding:"14px 16px",borderRadius:14,border:"1.5px solid #E8D5D0",fontSize:15,background:"#fff",color:C.k,lineHeight:1.6,minHeight:120,whiteSpace:"pre-wrap"}}>{evts[selKey]}</div>
          </div>
        ):selKey?(
          <div style={{textAlign:"center",color:C.g,padding:24,fontSize:14}}>No notes for this day</div>
        ):(
          <div style={{textAlign:"center",color:C.g,padding:24,fontSize:14}}>Tap a day with a dot to read notes</div>
        )}
      </div>
    </div>
  );
}

function Calendar({ userId, userEmail }) {
  const [evts,setEvts]=useState({});
  const [cal,setCal]=useState(()=>{ const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),1); });
  const [selKey,setSelKey]=useState(null);
  const evtsRef=useRef({});
  const [loaded,setLoaded]=useState(false);
  const [showShareModal,setShowShareModal]=useState(false);
  const [showShareDayModal,setShowShareDayModal]=useState(false);
  const now=new Date();

  useEffect(()=>{
    dbLoad(userId,"cal").then(v=>{ const d=v||{}; setEvts(d); evtsRef.current=d; setLoaded(true); });
  },[userId]);

  const y=cal.getFullYear(), m=cal.getMonth();
  const dim=new Date(y,m+1,0).getDate(), fd=new Date(y,m,1).getDay();
  const makeKey=(day,yr,mo)=>yr+"-"+(mo+1)+"-"+day;
  const selectDay=day=>{ const key=makeKey(day,y,m); setSelKey(key); };
  const selParts=selKey?selKey.split("-").map(Number):null;
  const selMonth=selParts?.[1], selDay=selParts?.[2];

  if(!loaded) return <Spinner msg="Loading calendar..."/>;
  return(
    <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
      <div style={{background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,overflow:"hidden",flexShrink:0}}>
        <div style={{background:"linear-gradient(135deg,"+C.r+","+C.r+"dd)",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>{setSelKey(null);setCal(new Date(y,m-1,1));}} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontSize:18,fontWeight:700}}>‹</button>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Nunito',sans-serif",color:"#fff",fontWeight:900,fontSize:18}}>{MONTHS[m]}</div>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:12}}>{y}</div>
          </div>
          <button onClick={()=>{setSelKey(null);setCal(new Date(y,m+1,1));}} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontSize:18,fontWeight:700}}>›</button>
        </div>
        <div style={{padding:"12px 14px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
            {WDAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:C.g,padding:"2px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {Array(fd).fill(null).map((_,i)=><div key={"e"+i}/>)}
            {Array(dim).fill(null).map((_,i)=>{
              const d=i+1, key=makeKey(d,y,m);
              const isT=d===now.getDate()&&m===now.getMonth()&&y===now.getFullYear();
              const isS=selKey===key, has=!!(evts[key]?.trim());
              return(
                <div key={d} onClick={()=>selectDay(d)} style={{borderRadius:8,padding:"6px 2px",textAlign:"center",cursor:"pointer",background:isS?C.r:isT?C.rl:"transparent",border:isT&&!isS?"1.5px solid "+C.r:"1.5px solid transparent"}}>
                  <div style={{fontSize:13,fontWeight:isT||isS?800:400,color:isS?"#fff":isT?C.r:C.k}}>{d}</div>
                  {has&&<div style={{width:5,height:5,borderRadius:"50%",background:isS?"#fff":C.r,margin:"2px auto 0"}}/>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button onClick={()=>setShowShareModal(true)} style={{...btn(C.r),borderRadius:12,padding:"11px",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexShrink:0}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Share Calendar
      </button>
      {showShareModal&&<ShareModal title="My Calendar" userId={userId} friends={[]} onClose={()=>setShowShareModal(false)} onSend={async(toEmail)=>{ return await sendShared(userEmail,toEmail,"calendar","Calendar",evtsRef.current); }}/>}
      {selKey?(
        <div style={{display:"flex",flexDirection:"column",gap:8,minHeight:240}}>
          <div style={{background:C.r,borderRadius:10,padding:"6px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{fontFamily:"'Nunito',sans-serif",fontSize:20,fontWeight:900,color:"#fff"}}>{selDay}</div>
            <div style={{color:"rgba(255,255,255,.7)",fontSize:12,fontWeight:700}}>{selMonth!=null?MONTHS[selMonth-1]+" "+selKey.split("-")[0]:""}</div>
            <button onClick={()=>setShowShareDayModal(true)} style={{marginLeft:"auto",background:"rgba(255,255,255,.2)",border:"none",borderRadius:8,padding:"4px 10px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share Day
            </button>
          </div>
          {showShareDayModal&&<ShareModal title={(selMonth!=null?MONTHS[selMonth-1]+" ":"")+selDay} userId={userId} friends={[]} onClose={()=>setShowShareDayModal(false)} onSend={async(toEmail)=>{ return await sendShared(userEmail,toEmail,"calendar_day",(selMonth!=null?MONTHS[selMonth-1]+" ":"")+selDay,{[selKey]:evtsRef.current[selKey]||""}); }}/>}
          <CalendarNote key={selKey} selKey={selKey} evtsRef={evtsRef} userId={userId} onUpdate={updated=>setEvts({...updated})}/>
        </div>
      ):(
        <div style={{textAlign:"center",color:C.g,padding:24,fontSize:14}}>Tap a day to add notes</div>
      )}
    </div>
  );
}

// ── MONEY ──
function Money({ userId }) {
  const now=new Date();
  const toMonthKey=d=>{ const p=new Date(d); return isNaN(p)?null:p.getFullYear()+"_"+(p.getMonth()+1); };
  const monthLabel=key=>{ const [y,m]=key.split("_"); return MONTHS[parseInt(m)-1]+" "+y; };
  const curKey=now.getFullYear()+"_"+(now.getMonth()+1);
  const [txns,setTxns]=useState([]);
  const [form,setForm]=useState({desc:"",amount:"",type:"Expense",cat:MCATS_EXPENSE[0].id,imgs:[]});
  const [open,setOpen]=useState(false);
  const [expandId,setExpandId]=useState(null);
  const [editId,setEditId]=useState(null);
  const [editDesc,setEditDesc]=useState("");
  const [editNote,setEditNote]=useState("");
  const [lightbox,setLightbox]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [viewKey,setViewKey]=useState(curKey);

  useEffect(()=>{ dbLoad(userId,"money").then(v=>{ if(v) setTxns(v); setLoaded(true); }); },[userId]);
  const S=async d=>{ setTxns(d); await dbSave(userId,"money",d); };

  const add=()=>{
    if(!form.desc.trim()||!form.amount) return;
    const dateStr=new Date().toLocaleDateString();
    S([{...form,amount:parseFloat(form.amount),id:Date.now(),date:dateStr,monthKey:curKey,note:""},...txns]);
    setForm({desc:"",amount:"",type:"Expense",cat:MCATS_EXPENSE[0].id,imgs:[]}); setOpen(false);
  };

  const addImg=(txnId,file)=>{
    if(!file) return;
    const r=new FileReader();
    r.onload=e=>S(txns.map(t=>t.id===txnId?{...t,imgs:[...(t.imgs||[]),{id:Date.now(),data:e.target.result,name:file.name}]}:t));
    r.readAsDataURL(file);
  };
  const removeImg=(txnId,imgId)=>S(txns.map(t=>t.id===txnId?{...t,imgs:(t.imgs||[]).filter(i=>i.id!==imgId)}:t));

  const allTxns=txns.map(t=>({...t,monthKey:t.monthKey||toMonthKey(t.date)||curKey}));
  const allKeys=[...new Set([curKey,...allTxns.map(t=>t.monthKey)])].sort((a,b)=>{
    const [ay,am]=a.split("_"),[by,bm]=b.split("_");
    return(parseInt(by)*12+parseInt(bm))-(parseInt(ay)*12+parseInt(am));
  });
  const safeKey=allKeys.includes(viewKey)?viewKey:curKey;
  const keyIdx=allKeys.indexOf(safeKey);
  const monthTxns=allTxns.filter(t=>t.monthKey===safeKey);
  const inc=monthTxns.filter(t=>t.type==="Income").reduce((s,t)=>s+t.amount,0);
  const exp=monthTxns.filter(t=>t.type==="Expense").reduce((s,t)=>s+t.amount,0);
  const isCurrent=safeKey===curKey;
  const CAT_MAP={"Grocery":"Food","grocery":"Food","food":"Food","Store":"Store","store":"Store","Car":"Car","car":"Car","Commute":"Commute","commute":"Commute","Transit":"Commute","Bus":"Commute","Train":"Commute","Mortgage/Rent":"Mortgage/Rent","Mortgage":"Mortgage/Rent","Rent":"Mortgage/Rent","Loan":"Loan","loan":"Loan","Work":"Work","work":"Work","Paycheck":"Work","paycheck":"Work","Salary":"Work","Vacation":"Vacation","vacation":"Vacation","ATM":"ATM","atm":"ATM","Subscription":"Subscription","subscription":"Subscription","Medical":"Medical","medical":"Medical","Utilities":"Utilities","utilities":"Utilities","Investment":"Investment","investment":"Investment","Invest":"Invest","invest":"Invest","Freelance":"Freelance","freelance":"Freelance","Gift":"Gift","gift":"Gift","Refund":"Refund","refund":"Refund","Other Income":"Other Income","Other":"Other","other":"Other"};

  if(!loaded) return <Spinner msg="Loading transactions..."/>;
  return(
    <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,paddingBottom:8,minHeight:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,padding:"10px 16px",flexShrink:0}}>
        <button onClick={()=>keyIdx<allKeys.length-1&&setViewKey(allKeys[keyIdx+1])} disabled={keyIdx>=allKeys.length-1} style={{background:"none",border:"none",fontSize:20,cursor:keyIdx>=allKeys.length-1?"default":"pointer",color:keyIdx>=allKeys.length-1?"#ddd":C.r}}>‹</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:17,color:C.k}}>{monthLabel(safeKey)}</div>
          {!isCurrent&&<div style={{fontSize:10,color:C.g,fontWeight:600,letterSpacing:1}}>PAST MONTH</div>}
        </div>
        <button onClick={()=>keyIdx>0&&setViewKey(allKeys[keyIdx-1])} disabled={keyIdx<=0} style={{background:"none",border:"none",fontSize:20,cursor:keyIdx<=0?"default":"pointer",color:keyIdx<=0?"#ddd":C.r}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,flexShrink:0}}>
        {[["Balance",inc-exp,(inc-exp)>=0?"#1a7a3c":C.r],["Income",inc,"#1a7a3c"],["Expenses",exp,C.r]].map(([l,v,col])=>(
          <div key={l} style={{background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontSize:9,color:C.g,fontWeight:700,marginBottom:4,letterSpacing:1,textTransform:"uppercase"}}>{l}</div>
            <div style={{fontSize:15,fontWeight:800,color:col,fontFamily:"'Nunito',sans-serif"}}>${Math.abs(v).toFixed(0)}</div>
          </div>
        ))}
      </div>

      {monthTxns.filter(t=>t.type==="Expense").length>0&&(
        <div style={{background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,padding:"12px 14px",flexShrink:0}}>
          <div style={{fontSize:10,color:C.g,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Spending by Category</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {Object.entries(
              monthTxns.filter(t=>t.type==="Expense").reduce((acc,t)=>{
                const cat=CAT_MAP[t.cat]||t.cat||"Other";
                acc[cat]=(acc[cat]||0)+t.amount; return acc;
              },{})
            ).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>{
              const total=monthTxns.filter(t=>t.type==="Expense").reduce((s,t)=>s+t.amount,0);
              const pct=total>0?Math.round(amt/total*100):0;
              const catObj=MCATS.find(c=>c.id===cat)||MCATS_EXPENSE[MCATS_EXPENSE.length-1];
              return(
                <div key={cat} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:24,height:24,borderRadius:7,background:catObj.color||C.r,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {typeof catObj.icon==="function"?catObj.icon("#fff",12):<span style={{fontSize:8,fontWeight:900,color:"#fff"}}>{cat[0]}</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:11,fontWeight:700,color:C.k}}>{cat}</span>
                      <span style={{fontSize:11,fontWeight:700,color:C.r}}>${amt.toFixed(0)}</span>
                    </div>
                    <div style={{height:4,borderRadius:2,background:"#F0EDE8",overflow:"hidden"}}>
                      <div style={{height:"100%",width:pct+"%",background:catObj.color||C.r,borderRadius:2}}/>
                    </div>
                  </div>
                  <span style={{fontSize:10,color:C.g,width:28,textAlign:"right"}}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isCurrent&&<button onClick={()=>{setOpen(!open);setExpandId(null);}} style={{...btn(),borderRadius:12,padding:"12px",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexShrink:0}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Transaction
      </button>}
      {open&&isCurrent&&(
        <div style={{background:"#fff",borderRadius:14,border:"1.5px solid "+C.bd,padding:"16px",flexShrink:0}}>
          <div style={{display:"flex",background:"#F5F0EE",borderRadius:10,padding:3,marginBottom:12,gap:3}}>
            {["Expense","Income"].map(t=>(
              <button key={t} onClick={()=>setForm({...form,type:t,cat:t==="Expense"?MCATS_EXPENSE[0].id:MCATS_INCOME[0].id})} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:form.type===t?"#fff":"transparent",color:form.type===t?C.k:C.g,fontWeight:700,fontSize:14,cursor:"pointer"}}>
                {t==="Expense"?"💸 Expense":"💰 Income"}
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
            <input style={inp} value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Description"/>
            <input style={inp} type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="Amount"/>
            <select style={{...inp,gridColumn:"span 2"}} value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
              {(form.type==="Expense"?MCATS_EXPENSE:MCATS_INCOME).map(c=><option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={add} style={{...btn(form.type==="Income"?"#1B6B35":C.r),flex:1}}>Save</button>
            <button onClick={()=>setOpen(false)} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",flex:1}}>Cancel</button>
          </div>
        </div>
      )}
      {monthTxns.length===0&&<div style={{textAlign:"center",color:C.g,padding:40,fontSize:14}}>{isCurrent?"No transactions yet this month.":"No transactions for this month."}</div>}
      {monthTxns.map(t=>{
        const catId=CAT_MAP[t.cat]||t.cat;
        const catObj=MCATS.find(c=>c.id===catId)||MCATS_EXPENSE[MCATS_EXPENSE.length-1];
        const isIncome=t.type==="Income", txColor=isIncome?"#1B6B35":C.r;
        const expanded=expandId===t.id, imgs=t.imgs||[];
        const isEditing=editId===t.id;
        return(
          <div key={t.id} style={{background:"#fff",border:"1.5px solid "+txColor+"44",borderRadius:14}}>
            <div onClick={()=>{ setExpandId(expanded?null:t.id); if(!expanded){setEditId(null);} }} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",cursor:"pointer"}}>
              <div style={{width:44,height:44,borderRadius:12,background:txColor,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {typeof catObj.icon==="function"?catObj.icon("#fff",20):<span style={{fontSize:11,fontWeight:900,color:"#fff"}}>{isIncome?"INC":"EXP"}</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:14,color:C.k,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc}</div>
                <div style={{fontSize:11,color:C.g,marginTop:2,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{background:txColor+"22",color:txColor,borderRadius:20,padding:"2px 7px",fontWeight:700}}>{catId}</span>
                  <span>{t.date}</span>
                  {imgs.length>0&&<span style={{color:C.r,fontWeight:700}}>📎 {imgs.length}</span>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                <div style={{fontWeight:800,fontSize:15,color:txColor}}>{(isIncome?"+":"-")}${t.amount.toFixed(2)}</div>
                <div style={{fontSize:10,color:expanded?"#fff":C.g,background:expanded?txColor:"#F5F0EE",padding:"2px 7px",borderRadius:20,fontWeight:700}}>{expanded?"▲ less":"▼ more"}</div>
              </div>
            </div>
            {expanded&&(
              <div style={{borderTop:"1px solid #f5f0ee",padding:"12px 15px 14px"}}>
                {isEditing?(
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                    <input style={inp} value={editDesc} onChange={e=>setEditDesc(e.target.value)} placeholder="Title"/>
                    <textarea value={editNote} onChange={e=>setEditNote(e.target.value)} placeholder="Notes..." rows={3} style={{...inp,resize:"none",fontFamily:"inherit"}}></textarea>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>{ if(!editDesc.trim()) return; S(allTxns.map(x=>x.id===t.id?{...x,desc:editDesc,note:editNote}:x)); setEditId(null); }} style={{...btn(),flex:1,fontSize:13,padding:"9px"}}>Save</button>
                      <button onClick={()=>setEditId(null)} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",flex:1,fontSize:13,padding:"9px"}}>Cancel</button>
                    </div>
                  </div>
                ):(
                  <div style={{marginBottom:10}}>
                    {t.note&&<div style={{fontSize:13,color:C.k,lineHeight:1.5,marginBottom:8,padding:"8px 10px",background:"#f9f9f9",borderRadius:8,whiteSpace:"pre-wrap"}}>{t.note}</div>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:11,fontWeight:700,color:C.g,letterSpacing:.5,textTransform:"uppercase"}}>Receipts</div>
                      <div style={{display:"flex",gap:10}}>
                        <button onClick={()=>{ setEditId(t.id); setEditDesc(t.desc); setEditNote(t.note||""); }} style={{background:"none",border:"none",cursor:"pointer",color:C.r,fontSize:12,fontWeight:700}}>Edit</button>
                        <button onClick={()=>{S(allTxns.filter(x=>x.id!==t.id));setExpandId(null);}} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:12,fontWeight:700}}>Delete</button>
                      </div>
                    </div>
                  </div>
                )}
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  {imgs.map((img,i)=>(
                    <div key={img.id} style={{position:"relative",borderRadius:8,overflow:"hidden",border:"1.5px solid #E8D5D0"}}>
                      <img src={img.data} alt={img.name} onClick={()=>setLightbox({imgs,idx:i})} style={{width:72,height:72,objectFit:"cover",cursor:"pointer",display:"block"}}/>
                      <button onClick={()=>removeImg(t.id,img.id)} style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.6)",border:"none",borderRadius:"50%",width:18,height:18,cursor:"pointer",color:"#fff",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                    </div>
                  ))}
                  <label style={{width:72,height:72,borderRadius:8,border:"1.5px dashed "+C.bd,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#fafafa"}}>
                    <span style={{fontSize:22,color:C.g,lineHeight:1}}>+</span>
                    <span style={{fontSize:9,color:C.g,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginTop:2}}>Add</span>
                    <input type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>addImg(t.id,e.target.files[0])}/>
                  </label>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {lightbox&&(
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
          <img src={lightbox.imgs[lightbox.idx].data} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:"100%",maxHeight:"65vh",borderRadius:12,objectFit:"contain"}}/>
          <div style={{display:"flex",gap:12,marginTop:16,alignItems:"center"}}>
            {lightbox.idx>0&&<button onClick={e=>{e.stopPropagation();setLightbox({...lightbox,idx:lightbox.idx-1});}} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"10px 18px",color:"#fff",cursor:"pointer",fontSize:16}}>‹</button>}
            <span style={{color:"rgba(255,255,255,.45)",fontSize:12}}>{lightbox.idx+1} / {lightbox.imgs.length}</span>
            {lightbox.idx<lightbox.imgs.length-1&&<button onClick={e=>{e.stopPropagation();setLightbox({...lightbox,idx:lightbox.idx+1});}} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"10px 18px",color:"#fff",cursor:"pointer",fontSize:16}}>›</button>}
          </div>
          <div style={{display:"flex",gap:10,marginTop:12}}>
            <a href={lightbox.imgs[lightbox.idx].data} download={lightbox.imgs[lightbox.idx].name||"receipt.jpg"} onClick={e=>e.stopPropagation()} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"10px 20px",color:"#fff",cursor:"pointer",textDecoration:"none",fontSize:13,fontWeight:700}}>⬇ Save Photo</a>
            <button onClick={()=>setLightbox(null)} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"10px 20px",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ── HEALTH ──
function HealthFI({k,pl,span,form,setForm}) {
  return <input style={{...inp,...(span?{gridColumn:"span 2"}:{})}} value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={pl}/>;
}

function HealthHCard({item,labelEl,children,onDel,onEdit,list,setList,saveKey,userId,expandId,setExpandId,setLightbox}) {
  const expanded=expandId===item.id;
  const addImg=file=>{ if(!file) return; const r=new FileReader(); r.onload=async e=>{ const u=list.map(x=>x.id===item.id?{...x,imgs:[...(x.imgs||[]),{id:Date.now(),data:e.target.result,name:file.name}]}:x); setList(u); await dbSave(userId,saveKey,u); }; r.readAsDataURL(file); };
  const removeImg=async imgId=>{ const u=list.map(x=>x.id===item.id?{...x,imgs:(x.imgs||[]).filter(i=>i.id!==imgId)}:x); setList(u); await dbSave(userId,saveKey,u); };
  return(
    <div style={{...card,flexDirection:"column",alignItems:"stretch",padding:0,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px"}}>
        {labelEl}
        <div style={{flex:1,minWidth:0}}>{children}</div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button onClick={()=>onEdit&&onEdit(item)} style={{background:"none",border:"none",cursor:"pointer",color:C.r,fontSize:12,fontWeight:700,padding:"2px 6px"}}>Edit</button>
            <button onClick={()=>setExpandId(expanded?null:item.id)} style={{background:expanded?C.r:C.rl,border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:expanded?"#fff":C.r,fontWeight:700,fontSize:12}}>{expanded?"▲":"📎"}</button>
          </div>
          <button onClick={onDel} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:16}}>×</button>
        </div>
      </div>
      {expanded&&(
        <div style={{padding:"0 15px 13px",borderTop:"1px solid #f5f0ee"}}>

          <div style={{marginTop:4,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            {(item.imgs||[]).map((img,i)=>(
              <div key={img.id} style={{position:"relative",borderRadius:8,overflow:"hidden",border:"1.5px solid #E8D5D0"}}>
                <img src={img.data} alt={img.name} onClick={()=>setLightbox({imgs:item.imgs,idx:i})} style={{width:64,height:64,objectFit:"cover",cursor:"pointer",display:"block"}}/>
                <button onClick={()=>removeImg(img.id)} style={{position:"absolute",top:2,right:2,background:"rgba(0,0,0,.6)",border:"none",borderRadius:"50%",width:16,height:16,cursor:"pointer",color:"#fff",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
            ))}
            <label style={{width:64,height:64,borderRadius:8,border:"1.5px dashed "+C.bd,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#fafafa"}}>
              <span style={{fontSize:20,color:C.g,lineHeight:1}}>+</span>
              <span style={{fontSize:9,color:C.g,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Add</span>
              <input type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>addImg(e.target.files[0])}/>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

function Health({ userId }) {
  const [tab,setTab]=useState("docs");
  const [docs,setDocs]=useState([]);
  const [apts,setApts]=useState([]);
  const [meds,setMeds]=useState([]);
  const [form,setForm]=useState({});
  const [open,setOpen]=useState(false);
  const [editItemId,setEditItemId]=useState(null);
  const [editItemData,setEditItemData]=useState({});
  const [lightbox,setLightbox]=useState(null);
  const [expandId,setExpandId]=useState(null);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{ Promise.all([dbLoad(userId,"docs"),dbLoad(userId,"apts"),dbLoad(userId,"meds")]).then(([d,a,m])=>{ if(d) setDocs(d); if(a) setApts(a); if(m) setMeds(m); setLoaded(true); }); },[userId]);
  const Sd=async d=>{setDocs(d);await dbSave(userId,"docs",d);};
  const Sa=async d=>{setApts(d);await dbSave(userId,"apts",d);};
  const Sm=async d=>{setMeds(d);await dbSave(userId,"meds",d);};
  const addDoc=()=>{ if(!form.name) return; Sd([...docs,{id:Date.now(),...form,imgs:[]}]); setForm({}); setOpen(false); };
  const addApt=async()=>{
    if(!form.title) return;
    const id=Date.now();
    const apt={id,...form,date:form.date||new Date().toLocaleDateString()};
    Sa([apt,...apts]);
    // Auto-add to calendar
    if(form.datetime){
      const calKey=new Date(form.datetime).getFullYear()+"-"+(new Date(form.datetime).getMonth()+1)+"-"+new Date(form.datetime).getDate();
      const cal=await dbLoad(userId,"cal")||{};
      const timeStr=new Date(form.datetime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
      cal[calKey]=(cal[calKey]?cal[calKey]+"\n":"")+timeStr+" — "+form.title+(form.doctor?" with "+form.doctor:"");
      await dbSave(userId,"cal",cal);
    }
    // Schedule reminder
    setForm({}); setOpen(false);
  };
  const addMed=async()=>{
    if(!form.name) return;
    const id=Date.now();
    Sm([...meds,{id,...form,imgs:[]}]); setOpen(false);
  };

  if(!loaded) return <Spinner msg="Loading health data..."/>;
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
        {[["docs","Doctors"],["apts","Appointments"],["meds","Medications"]].map(([id,l])=>(
          <button key={id} style={pill(tab===id)} onClick={()=>{setTab(id);setOpen(false);setExpandId(null);}}>{l}</button>
        ))}
        <button onClick={()=>setOpen(!open)} style={{...btn(),marginLeft:"auto",borderRadius:20,padding:"6px 16px"}}>+ Add</button>
      </div>
      {open&&(
        <div style={box}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
            {tab==="docs"&&<><HealthFI k="name" pl="Doctor Name" form={form} setForm={setForm}/><HealthFI k="specialty" pl="Specialty" form={form} setForm={setForm}/><HealthFI k="phone" pl="Phone" form={form} setForm={setForm}/><HealthFI k="address" pl="Address" form={form} setForm={setForm}/><HealthFI k="notes" pl="Notes" span form={form} setForm={setForm}/></>}
            {tab==="apts"&&<>
                  <HealthFI k="title" pl="Appointment" form={form} setForm={setForm}/>
                  <HealthFI k="doctor" pl="Doctor" form={form} setForm={setForm}/>
                  <div style={{gridColumn:"span 2"}}>
                    <div style={{fontSize:11,color:C.g,marginBottom:4,fontWeight:700}}>Date &amp; Time</div>
                    <input type="datetime-local" style={{...inp,fontSize:16}} value={form.datetime||""} onChange={e=>setForm(f=>({...f,datetime:e.target.value,date:new Date(e.target.value).toLocaleDateString()}))}/>
                  </div>
                  <HealthFI k="location" pl="Location" form={form} setForm={setForm}/>
                  <HealthFI k="notes" pl="Notes" span form={form} setForm={setForm}/>
                </>}
            {tab==="meds"&&<>
                  <HealthFI k="name" pl="Medication" form={form} setForm={setForm}/>
                  <HealthFI k="dosage" pl="Dosage" form={form} setForm={setForm}/>
                  <HealthFI k="frequency" pl="Frequency" form={form} setForm={setForm}/>
                  <HealthFI k="prescriber" pl="Prescriber" form={form} setForm={setForm}/>
                  <HealthFI k="notes" pl="Notes" span form={form} setForm={setForm}/>
                </>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={tab==="docs"?addDoc:tab==="apts"?addApt:addMed} style={{...btn(),flex:1}}>Save</button>
            <button onClick={()=>setOpen(false)} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",flex:1}}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
        {tab==="docs"&&docs.map(d=><HealthHCard key={d.id} item={d} list={docs} setList={Sd} saveKey="docs" userId={userId} expandId={expandId} setExpandId={setExpandId} setLightbox={setLightbox} onEdit={(item)=>{setEditItemId(item.id);setEditItemData({...item});setExpandId(item.id);}} onDel={()=>Sd(docs.filter(x=>x.id!==d.id))} labelEl={<div style={{...lbl,fontSize:15,background:"#FDE8F0",color:"#AD1457"}}>{d.name?.[0]?.toUpperCase()||"D"}</div>}><div style={{fontWeight:700,fontSize:14,color:C.k}}>{d.name}</div><div style={{fontSize:12,color:C.g}}>{d.specialty}{d.phone?` • ${d.phone}`:""}</div></HealthHCard>)}
        {tab==="apts"&&apts.map(a=><HealthHCard key={a.id} item={a} list={apts} setList={Sa} saveKey="apts" userId={userId} expandId={expandId} setExpandId={setExpandId} setLightbox={setLightbox} onEdit={(item)=>{setEditItemId(item.id);setEditItemData({...item});setExpandId(item.id);}} onDel={()=>Sa(apts.filter(x=>x.id!==a.id))} labelEl={<div style={{...lbl,fontSize:15,background:"#E8F4FD",color:"#0277BD"}}>{a.title?.[0]?.toUpperCase()||"A"}</div>}><div style={{fontWeight:700,fontSize:14,color:C.k}}>{a.title}</div><div style={{fontSize:12,color:C.g}}>{a.date}{a.doctor?` • ${a.doctor}`:""}</div></HealthHCard>)}
        {tab==="meds"&&meds.map(m=><HealthHCard key={m.id} item={m} list={meds} setList={Sm} saveKey="meds" userId={userId} expandId={expandId} setExpandId={setExpandId} setLightbox={setLightbox} onEdit={(item)=>{setEditItemId(item.id);setEditItemData({...item});setExpandId(item.id);}} onDel={()=>Sm(meds.filter(x=>x.id!==m.id))} labelEl={<div style={{...lbl,fontSize:15,background:"#E8F8F0",color:"#1B5E20"}}>{m.name?.[0]?.toUpperCase()||"M"}</div>}><div style={{fontWeight:700,fontSize:14,color:C.k}}>{m.name}</div><div style={{fontSize:12,color:C.g}}>{m.dosage}{m.frequency?` • ${m.frequency}`:""}</div></HealthHCard>)}
        {((tab==="docs"&&!docs.length)||(tab==="apts"&&!apts.length)||(tab==="meds"&&!meds.length))&&<div style={{textAlign:"center",color:C.g,padding:40,fontSize:14}}>Nothing here yet.</div>}
      </div>
      {editItemId&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:500,display:"flex",alignItems:"flex-end"}} onClick={()=>setEditItemId(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"80vh",overflowY:"auto",padding:"20px 20px 40px"}}>
            <div style={{fontWeight:900,fontSize:17,color:C.k,marginBottom:16}}>
              {tab==="docs"?"Edit Doctor":tab==="apts"?"Edit Appointment":"Edit Medication"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {tab==="docs"&&<>
                <input style={inp} value={editItemData.name||""} onChange={e=>setEditItemData(f=>({...f,name:e.target.value}))} placeholder="Doctor Name"/>
                <input style={inp} value={editItemData.specialty||""} onChange={e=>setEditItemData(f=>({...f,specialty:e.target.value}))} placeholder="Specialty"/>
                <input style={inp} value={editItemData.phone||""} onChange={e=>setEditItemData(f=>({...f,phone:e.target.value}))} placeholder="Phone"/>
                <input style={inp} value={editItemData.address||""} onChange={e=>setEditItemData(f=>({...f,address:e.target.value}))} placeholder="Address"/>
                <input style={inp} value={editItemData.notes||""} onChange={e=>setEditItemData(f=>({...f,notes:e.target.value}))} placeholder="Notes"/>
              </>}
              {tab==="apts"&&<>
                <input style={inp} value={editItemData.title||""} onChange={e=>setEditItemData(f=>({...f,title:e.target.value}))} placeholder="Appointment"/>
                <input style={inp} value={editItemData.doctor||""} onChange={e=>setEditItemData(f=>({...f,doctor:e.target.value}))} placeholder="Doctor"/>
                <input style={inp} value={editItemData.date||""} onChange={e=>setEditItemData(f=>({...f,date:e.target.value}))} placeholder="Date"/>
                <input style={inp} value={editItemData.location||""} onChange={e=>setEditItemData(f=>({...f,location:e.target.value}))} placeholder="Location"/>
                <input style={inp} value={editItemData.notes||""} onChange={e=>setEditItemData(f=>({...f,notes:e.target.value}))} placeholder="Notes"/>

              </>}
              {tab==="meds"&&<>
                <input style={inp} value={editItemData.name||""} onChange={e=>setEditItemData(f=>({...f,name:e.target.value}))} placeholder="Medication"/>
                <input style={inp} value={editItemData.dosage||""} onChange={e=>setEditItemData(f=>({...f,dosage:e.target.value}))} placeholder="Dosage"/>
                <input style={inp} value={editItemData.frequency||""} onChange={e=>setEditItemData(f=>({...f,frequency:e.target.value}))} placeholder="Frequency"/>
                <input style={inp} value={editItemData.prescriber||""} onChange={e=>setEditItemData(f=>({...f,prescriber:e.target.value}))} placeholder="Prescriber"/>
                <input style={inp} value={editItemData.notes||""} onChange={e=>setEditItemData(f=>({...f,notes:e.target.value}))} placeholder="Notes"/>

              </>}
            </div>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button onClick={async()=>{
                if(tab==="docs") Sd(docs.map(x=>x.id===editItemId?{...x,...editItemData}:x));
                else if(tab==="apts") {
                  Sa(apts.map(x=>x.id===editItemId?{...x,...editItemData}:x));
                } else {
                  Sm(meds.map(x=>x.id===editItemId?{...x,...editItemData}:x));
                }
                setEditItemId(null);
              }} style={{...btn(),flex:1}}>Save</button>
              <button onClick={()=>setEditItemId(null)} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",flex:1}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {lightbox&&(
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
          <img src={lightbox.imgs[lightbox.idx].data} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:"100%",maxHeight:"70vh",borderRadius:12,objectFit:"contain"}}/>
          <div style={{display:"flex",gap:16,marginTop:16,alignItems:"center"}}>
            {lightbox.idx>0&&<button onClick={e=>{e.stopPropagation();setLightbox({...lightbox,idx:lightbox.idx-1});}} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"10px 18px",color:"#fff",cursor:"pointer",fontSize:16}}>‹</button>}
            <span style={{color:"rgba(255,255,255,.45)",fontSize:12}}>{lightbox.idx+1} / {lightbox.imgs.length}</span>
            {lightbox.idx<lightbox.imgs.length-1&&<button onClick={e=>{e.stopPropagation();setLightbox({...lightbox,idx:lightbox.idx+1});}} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"10px 18px",color:"#fff",cursor:"pointer",fontSize:16}}>›</button>}
          </div>
          <button onClick={()=>setLightbox(null)} style={{marginTop:14,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"10px 24px",color:"#fff",cursor:"pointer"}}>Close</button>
        </div>
      )}
    </div>
  );
}


// ──────────────────────────────────────────────
// MESSAGING / CHAT
// ──────────────────────────────────────────────
async function getOrCreateProfile(userId, email) {
  // First check if profile exists by user id
  const { data: byId } = await sb.from("user_profiles").select("*").eq("id", userId).single();
  if(byId) return byId;

  // Check if a placeholder was created by email (someone shared to them before they logged in)
  const { data: byEmail } = await sb.from("user_profiles").select("*").eq("email", email.toLowerCase()).single();
  if(byEmail && byEmail.id !== userId) {
    // Update placeholder row to use real auth user id
    await sb.from("user_profiles").delete().eq("id", byEmail.id);
  }

  const username = email.split("@")[0];
  await sb.from("user_profiles").upsert(
    { id: userId, email: email.toLowerCase(), username, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );

  // If there was a placeholder, repoint any messages sent to the placeholder id
  if(byEmail && byEmail.id !== userId) {
    await sb.from("messages").update({ to_id: userId }).eq("to_id", byEmail.id);
    await sb.from("messages").update({ from_id: userId }).eq("from_id", byEmail.id);
  }

  return { id: userId, email, username };
}

async function searchUserByEmail(email) {
  const em = email.trim().toLowerCase();
  // Try user_profiles first
  const { data } = await sb.from("user_profiles").select("*").eq("email", em).single();
  if(data) return data;
  // Fallback: check if this email appears in shared_inbox (they've used Script before)
  const { data: inboxRow } = await sb.from("shared_inbox")
    .select("from_email")
    .eq("from_email", em)
    .limit(1)
    .single();
  if(inboxRow) {
    // They exist but haven't opened Chat — return a stub so they can be added
    return { id: null, email: em, username: em.split("@")[0], stub: true };
  }
  // Also check if they appear as sender in messages
  const { data: msgRow } = await sb.from("messages")
    .select("from_id, from_email")
    .eq("from_email", em)
    .limit(1)
    .single();
  if(msgRow) return { id: msgRow.from_id, email: em, username: em.split("@")[0] };
  return null;
}

async function loadMessages(myId, myEmail, otherId, otherEmail) {
  // Real messages between both users
  const { data: msgs } = await sb.from("messages")
    .select("*")
    .or(`and(from_id.eq.${myId},to_id.eq.${otherId}),and(from_id.eq.${otherId},to_id.eq.${myId})`)
    .order("created_at", { ascending: true });

  // Pending shared_chat items — fetch all involving either email then filter in JS
  // (avoids complex Supabase multi-column OR syntax issues)
  const { data: pendingA } = await sb.from("shared_inbox")
    .select("*")
    .eq("type", "shared_chat")
    .eq("from_email", myEmail)
    .eq("to_email", otherEmail)
    .order("created_at", { ascending: true });

  const { data: pendingB } = await sb.from("shared_inbox")
    .select("*")
    .eq("type", "shared_chat")
    .eq("from_email", otherEmail)
    .eq("to_email", myEmail)
    .order("created_at", { ascending: true });

  const pending = [...(pendingA||[]), ...(pendingB||[])];

  const pendingMsgs = pending.map(p=>{
    // If inner type is "text" or "drawing", render as a normal chat bubble not a Scrypt card
    const innerType = p.data?.type;
    const isDirectMsg = innerType==="text" || innerType==="drawing";
    return {
      id: "pending_"+p.id,
      from_id: p.from_email===myEmail ? myId : otherId,
      to_id:   p.to_email===myEmail   ? myId : otherId,
      from_email: p.from_email,
      content: isDirectMsg ? p.data?.data : p.data,
      type: isDirectMsg ? innerType : "shared",
      created_at: p.created_at,
      read: p.read,
      pending: true,
      inbox_id: p.id,
    };
  });

  // Skip pending if a real message already covers it (dedup by sender+minute)
  const realKeys = new Set((msgs||[]).filter(m=>m.type==="shared").map(m=>m.from_email+"_"+m.created_at?.slice(0,16)));
  const filtered = pendingMsgs.filter(p=>!realKeys.has(p.from_email+"_"+p.created_at?.slice(0,16)));

  return [...(msgs||[]), ...filtered].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
}

async function sendMessage(fromId, toId, fromEmail, content, type="text") {
  const { error } = await sb.from("messages").insert({ from_id: fromId, to_id: toId, from_email: fromEmail, content, type });
  if(!error) {
    const preview = type==="drawing" ? "sent you a drawing" : (content?.text||"").slice(0,60)||"sent a message";
    await sendPushToUser(toId, "Scrypt Chat", fromEmail.split("@")[0]+": "+preview, "message", "messages");
  }
  return error;
}

async function markMessagesRead(fromId, toId) {
  await sb.from("messages").update({ read: true }).eq("from_id", fromId).eq("to_id", toId).eq("read", false);
}

// ── ChatDrawCanvas — mini chalk inside chat ──
function ChatDrawCanvas({ onSend, dark }) {
  const [paths, setPaths] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const canvasRef = useRef(null);
  const lastPt = useRef(null);

  const bgColor = dark ? "#1C2C1C" : "#f0f4ec";
  const COLORS = ["#000000","#C8220A","#1565C0","#2E7D32","#F57F17","#ffffff"];

  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = bgColor; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.lineCap="round"; ctx.lineJoin="round";
    paths.forEach(path=>{
      if(!path.pts||path.pts.length<2) return;
      ctx.strokeStyle=path.color||"#000"; ctx.lineWidth=path.size||2;
      ctx.beginPath(); ctx.moveTo(path.pts[0].x,path.pts[0].y);
      path.pts.slice(1).forEach(pt=>ctx.lineTo(pt.x,pt.y)); ctx.stroke();
    });
  },[paths,dark]);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const prevent=e=>e.preventDefault();
    canvas.addEventListener("touchstart",prevent,{passive:false});
    canvas.addEventListener("touchmove",prevent,{passive:false});
    return()=>{ canvas.removeEventListener("touchstart",prevent); canvas.removeEventListener("touchmove",prevent); };
  },[]);

  const getPos=(e,canvas)=>{ const r=canvas.getBoundingClientRect(), t=e.touches?.[0]||e.changedTouches?.[0]||e; return {x:(t.clientX-r.left)*(canvas.width/r.width),y:(t.clientY-r.top)*(canvas.height/r.height)}; };
  const startDraw=e=>{ const pt=getPos(e,canvasRef.current); lastPt.current=pt; setDrawing(true); setPaths(prev=>[...prev,{color,size:2,pts:[pt]}]); };
  const moveDraw=e=>{ if(!drawing) return; const canvas=canvasRef.current, pt=getPos(e,canvas), ctx=canvas.getContext("2d"); ctx.strokeStyle=color; ctx.lineWidth=2; ctx.lineCap="round"; ctx.beginPath(); ctx.moveTo(lastPt.current.x,lastPt.current.y); ctx.lineTo(pt.x,pt.y); ctx.stroke(); lastPt.current=pt; setPaths(prev=>{ const u=[...prev]; u[u.length-1]={...u[u.length-1],pts:[...u[u.length-1].pts,pt]}; return u; }); };
  const endDraw=()=>setDrawing(false);
  const clear=()=>{ setPaths([]); const ctx=canvasRef.current?.getContext("2d"); if(ctx){ ctx.fillStyle=bgColor; ctx.fillRect(0,0,800,600); } };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:8,padding:"10px 0"}}>
      <div style={{borderRadius:12,overflow:"hidden",border:"1.5px solid #E8D5D0",background:bgColor}}>
        <div style={{display:"flex",gap:6,padding:"6px 10px",background:"rgba(0,0,0,.06)",alignItems:"center",flexWrap:"wrap"}}>
          {COLORS.map(col=><button key={col} onClick={()=>setColor(col)} style={{width:color===col?22:16,height:color===col?22:16,borderRadius:"50%",background:col,border:color===col?"2px solid "+C.r:"2px solid #ccc",cursor:"pointer",transition:"all .15s"}}/>)}
          <button onClick={clear} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",fontSize:11,color:C.g,fontWeight:700}}>Clear</button>
        </div>
        <canvas ref={canvasRef} width={800} height={400}
          onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
          style={{width:"100%",height:140,cursor:"crosshair",display:"block",touchAction:"none"}}
        />
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{ if(paths.length>0){ onSend({paths},"drawing"); } }} style={{...btn(C.r),flex:1,fontSize:13,padding:"9px"}}>Send Drawing</button>
        <button onClick={clear} style={{...btn("#fff",C.k),border:"1.5px solid #E8D5D0",padding:"9px 14px",fontSize:13}}>✕</button>
      </div>
    </div>
  );
}

// ── Chat window ──
function ChatWindow({ myId, myEmail, myUsername, friend, dark, onSaveToChalk, onClose }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showDraw, setShowDraw] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  const msgsRef = useRef([]);
  const bg = dark?"#1C1C1E":"#F5F0EE", bg2=dark?"#2C2C2E":"#fff", bdr=dark?"#3A3A3C":C.bd, txt=dark?"#F2F2F7":C.k;

  const cacheKey = "msgs_"+myId+"_"+(friend.email||friend.id);

  const load = async (scrollToBottom=false) => {
    const data = await loadMessages(myId, myEmail, friend.id||"none", friend.email||"");
    const newJson = JSON.stringify(data.map(m=>m.id));
    const oldJson = JSON.stringify(msgsRef.current.map(m=>m.id));
    if(newJson !== oldJson) {
      msgsRef.current = data;
      setMsgs(data);
      try{ localStorage.setItem(cacheKey, JSON.stringify(data)); }catch(e){}
      if(scrollToBottom) setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
    }
    if(friend.id && !friend.id.startsWith("pending_")) await markMessagesRead(friend.id, myId);
  };

  useEffect(()=>{
    // Show cached messages instantly while fetching
    try {
      const cached = localStorage.getItem(cacheKey);
      if(cached) {
        const data = JSON.parse(cached);
        msgsRef.current = data; setMsgs(data);
        setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
      }
    } catch(e){}
    load(true).then(()=>setHasLoaded(true));
    pollRef.current = setInterval(()=>load(false), 8000);
    return()=>clearInterval(pollRef.current);
  },[friend.id]);

  const send = async (content, type="text") => {
    if(type==="text" && !content?.trim()) return;
    const payload = type==="text" ? {text:content} : content;
    setSending(true);
    // Optimistic — add to UI immediately
    const optimistic = {
      id: "opt_"+Date.now(),
      from_id: myId, from_email: myEmail,
      content: payload, type,
      created_at: new Date().toISOString(),
      optimistic: true,
    };
    msgsRef.current = [...msgsRef.current, optimistic];
    setMsgs([...msgsRef.current]);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);

    const isPending = !friend.id || friend.id.startsWith("pending_");
    if(isPending) {
      await sb.from("shared_inbox").insert({
        from_email: myEmail, to_email: friend.email,
        type: "shared_chat",
        title: type==="text" ? (content?.slice?.(0,40)||"Message") : "Drawing",
        data: { type, title: type==="text"?(content?.slice?.(0,40)||"Message"):"Drawing", data: payload, from_email: myEmail, to_email: friend.email }
      });
    } else {
      await sendMessage(myId, friend.id, myEmail, payload, type);
    }
    setInput(""); setShowDraw(false);
    setSending(false);
    // Refresh to get real server message replacing optimistic
    await load(false);
  };

  const renderMsg = (m) => {
    const isMe = m.from_id === myId || m.from_email === myEmail;
    const bubbleBg = isMe ? C.r : bg2;
    const bubbleTxt = isMe ? "#fff" : txt;
    const align = isMe ? "flex-end" : "flex-start";
    const time = new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});

    // Shared item message
    if(m.type==="shared") {
      const sc = m.content||{};
      const shareType = sc.type||"note";
      const shareColor = shareType==="note"?"#555":shareType==="list"?"#B85C00":shareType==="calendar_day"||shareType==="calendar"?"#6B3FA0":C.r;
      const isDrawing = shareType==="note" && typeof sc.data==="object" && sc.data?.paths;
      const isTextNote = shareType==="note" && typeof sc.data==="string";
      const isCalDay = shareType==="calendar_day";
      const isCal = shareType==="calendar";
      const isList = shareType==="list";

      return(
        <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:align,marginBottom:12,maxWidth:"82%"}}>
          <div style={{background:bg2,borderRadius:14,border:"1.5px solid "+shareColor+"55",overflow:"hidden",width:"100%"}}>
            {/* Header bar */}
            <div style={{background:shareColor,padding:"7px 12px",display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:.5,textTransform:"uppercase"}}>
                {isDrawing?"Chalk":isTextNote?"Chalk":isCalDay?"Calendar":isCal?"Calendar":isList?"List":"Scrypt"}
              </span>
              <span style={{fontSize:11,color:"rgba(255,255,255,.7)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sc.title}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>{time}</span>
            </div>
            {/* Content */}
            <div style={{padding:"10px 12px"}}>
              {isDrawing&&<DrawingPreview paths={sc.data.paths} dark={dark}/>}
              {isTextNote&&<div style={{fontSize:13,color:txt,lineHeight:1.6,whiteSpace:"pre-wrap",maxHeight:160,overflow:"hidden"}}>{sc.data}</div>}
              {isCalDay&&Object.entries(sc.data||{}).map(([k,v])=>(
                <div key={k}>
                  <div style={{fontWeight:700,fontSize:12,color:shareColor,marginBottom:4}}>{k}</div>
                  <div style={{fontSize:13,color:txt,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{v}</div>
                </div>
              ))}
              {isCal&&(
                <div style={{fontSize:12,color:C.g}}>{Object.keys(sc.data||{}).length} day(s) with notes</div>
              )}
              {isList&&(
                <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:140,overflow:"hidden"}}>
                  {(sc.data||[]).slice(0,5).map((it,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:14,height:14,borderRadius:4,border:"1.5px solid "+shareColor,background:it.done?shareColor:"transparent",flexShrink:0}}/>
                      <span style={{fontSize:12,color:txt,textDecoration:it.done?"line-through":"none"}}>{it.text}</span>
                    </div>
                  ))}
                  {(sc.data||[]).length>5&&<div style={{fontSize:11,color:C.g}}>+{sc.data.length-5} more</div>}
                </div>
              )}
            </div>
            {/* Save buttons — only for recipient */}
            {!isMe&&(
              <div style={{padding:"0 12px 10px",display:"flex",gap:7}}>
                {(isTextNote||isDrawing)&&<button onClick={()=>{ if(isDrawing) onSaveToChalk({paths:sc.data.paths,text:""}); else onSaveToChalk({text:sc.data,paths:[]}); }} style={{...btn(shareColor),flex:1,fontSize:11,padding:"6px",borderRadius:8}}>+ Add to Chalk</button>}
                {(isCalDay||isCal)&&<button onClick={async()=>{ const cal=await dbLoad(myId,"cal")||{}; Object.entries(sc.data||{}).forEach(([k,v])=>{ cal[k]=cal[k]?cal[k]+"\n---\n"+v:v; }); await dbSave(myId,"cal",cal); }} style={{...btn(shareColor),flex:1,fontSize:11,padding:"6px",borderRadius:8}}>+ Add to Calendar</button>}
                {isList&&<button onClick={async()=>{ const existing=await dbLoad(myId,"lists")||[]; const nl={id:"shared_"+Date.now(),label:sc.title||"Shared List",kind:"check",items:sc.data||[]}; await dbSave(myId,"lists",[...existing,nl]); }} style={{...btn(shareColor),flex:1,fontSize:11,padding:"6px",borderRadius:8}}>+ Add to Lists</button>}
              </div>
            )}
          </div>
        </div>
      );
    }

    return(
      <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:align,marginBottom:10}}>
        {m.type==="drawing" ? (
          <div style={{maxWidth:"75%",background:bubbleBg,borderRadius:14,padding:10,border:isMe?"none":"1.5px solid "+bdr}}>
            <DrawingPreview paths={m.content?.paths||[]} dark={dark}/>
            <div style={{display:"flex",gap:8,marginTop:8,justifyContent:"flex-end"}}>
              {!isMe&&<button onClick={()=>onSaveToChalk({paths:m.content?.paths||[],text:""})} style={{...btn(C.r),fontSize:11,padding:"5px 10px",borderRadius:8}}>+ Save to Chalk</button>}
            </div>
            <div style={{fontSize:10,color:isMe?"rgba(255,255,255,.5)":C.g,marginTop:4,textAlign:"right"}}>{time}</div>
          </div>
        ) : (
          <div style={{maxWidth:"75%",background:bubbleBg,borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",border:isMe?"none":"1.5px solid "+bdr}}>
            {m.content?.text&&<div style={{fontSize:14,color:bubbleTxt,lineHeight:1.5,wordBreak:"break-word"}}>{m.content.text}</div>}
            <div style={{fontSize:10,color:isMe?"rgba(255,255,255,.5)":C.g,marginTop:3,textAlign:"right"}}>{time}</div>
          </div>
        )}
      </div>
    );
  };

  return(
    <div style={{position:"fixed",inset:0,background:bg,zIndex:700,display:"flex",flexDirection:"column",fontFamily:"'Nunito',sans-serif"}}>
      {/* Header */}
      <div style={{background:dark?"#2C2C2E":"#fff",borderBottom:"1.5px solid "+bdr,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.r,fontSize:22,fontWeight:900,lineHeight:1}}>‹</button>
        <div style={{width:36,height:36,borderRadius:"50%",background:C.r,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#fff",flexShrink:0}}>
          {(friend.username||friend.email)?.[0]?.toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,fontSize:15,color:txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{friend.nickname||friend.username||friend.email}</div>
          <div style={{fontSize:11,color:C.g,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{friend.email}</div>
        </div>
      </div>
      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        {msgs.length===0&&<div style={{textAlign:"center",color:C.g,padding:40,fontSize:14}}>No messages yet. Say hi!</div>}
        {msgs.map(renderMsg)}
        <div ref={bottomRef}/>
      </div>
      {/* Draw canvas */}
      {showDraw&&<div style={{padding:"0 16px",flexShrink:0,borderTop:"1.5px solid "+bdr,background:dark?"#2C2C2E":"#fff"}}><ChatDrawCanvas onSend={send} dark={dark}/></div>}
      {/* Input */}
      <div style={{background:dark?"#2C2C2E":"#fff",borderTop:"1.5px solid "+bdr,padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-end",flexShrink:0}}>
        <button onClick={()=>setShowDraw(!showDraw)} style={{width:40,height:40,borderRadius:12,background:showDraw?C.r:dark?"#3A3A3C":"#F5F0EE",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={showDraw?"#fff":C.r} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(input.trim()); } }}
          placeholder="Message..." rows={1}
          style={{flex:1,padding:"10px 13px",borderRadius:12,border:"1.5px solid "+bdr,fontSize:16,outline:"none",resize:"none",background:dark?"#3A3A3C":"#F5F0EE",color:txt,fontFamily:"'Nunito',sans-serif",lineHeight:1.4,maxHeight:100,overflowY:"auto"}}
        ></textarea>
        <button onClick={()=>send(input.trim())} disabled={!input.trim()||sending} style={{width:40,height:40,borderRadius:12,background:input.trim()?C.r:"#ddd",border:"none",cursor:input.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

function DrawingPreview({ paths, dark, expandable=true }) {
  const canvasRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const bg = dark?"#1C2C1C":"#f0f4ec";

  const pathsKey = (paths||[]).length+"_"+(paths?.[0]?.pts?.length||0);
  const draw = (canvas) => {
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.lineCap="round"; ctx.lineJoin="round";
    (paths||[]).forEach(path=>{
      if(!path.pts||path.pts.length<2) return;
      ctx.strokeStyle=path.color||"#000"; ctx.lineWidth=path.size||2;
      ctx.beginPath(); ctx.moveTo(path.pts[0].x,path.pts[0].y);
      path.pts.slice(1).forEach(pt=>ctx.lineTo(pt.x,pt.y)); ctx.stroke();
    });
  };

  useEffect(()=>{ draw(canvasRef.current); },[pathsKey,dark]);

  return(
    <>
      <div style={{position:"relative",cursor:expandable?"pointer":"default"}} onClick={()=>expandable&&setExpanded(true)}>
        <canvas ref={canvasRef} width={800} height={600}
          style={{width:"100%",height:"auto",maxHeight:220,borderRadius:8,display:"block",objectFit:"contain"}}
        />
        {expandable&&<div style={{position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,.45)",borderRadius:6,padding:"3px 8px",fontSize:10,color:"#fff",fontWeight:700}}>tap to expand</div>}
      </div>
      {expanded&&(
        <div onClick={()=>setExpanded(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:1200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
          <ExpandedDrawing paths={paths} dark={dark} bg={bg}/>
          <button onClick={()=>setExpanded(false)} style={{marginTop:16,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"10px 24px",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700}}>Close</button>
        </div>
      )}
    </>
  );
}

function ExpandedDrawing({ paths, dark, bg }) {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=bg||"#f0f4ec"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.lineCap="round"; ctx.lineJoin="round";
    (paths||[]).forEach(path=>{
      if(!path.pts||path.pts.length<2) return;
      ctx.strokeStyle=path.color||"#000"; ctx.lineWidth=path.size||2;
      ctx.beginPath(); ctx.moveTo(path.pts[0].x,path.pts[0].y);
      path.pts.slice(1).forEach(pt=>ctx.lineTo(pt.x,pt.y)); ctx.stroke();
    });
  },[paths,dark]);
  return <canvas ref={canvasRef} width={800} height={600} style={{maxWidth:"100%",maxHeight:"75vh",borderRadius:12,display:"block",objectFit:"contain"}}/>;
}

// ── Friends list + messaging hub ──
function Messages({ userId, userEmail, dark, onSaveToChalk, onAcceptShared }) {
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [unread, setUnread] = useState({});
  const [sharedItems, setSharedItems] = useState([]);
  const [swipedId, setSwipedId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const bg=dark?"#1C1C1E":"#F5F0EE", bg2=dark?"#2C2C2E":"#fff", bdr=dark?"#3A3A3C":C.bd, txt=dark?"#F2F2F7":C.k, sub=dark?"#8E8E93":C.g;

  useEffect(()=>{
    getOrCreateProfile(userId, userEmail).then(p=>{ setProfile(p); setNameVal(p.username||""); });
    dbLoad(userId,"blocked").then(v=>{ if(v) setBlockedUsers(v); });

    const buildContacts = async () => {
      // Load saved friends list
      const savedFriends = await dbLoad(userId,"friends") || [];
      let contactMap = {};
      savedFriends.forEach(f=>{ if(f.email) contactMap[f.email]=f; });

      // Auto-add anyone from shared_inbox (they shared with you)
      const items = await loadInbox(userEmail);
      setSharedItems(items||[]);
      for(const item of (items||[])) {
        if(item.from_email && item.from_email!==userEmail && !contactMap[item.from_email]) {
          await autoAddContact(userId, userEmail, item.from_email).catch(()=>{});
          contactMap[item.from_email] = {id:"pending_"+item.from_email, email:item.from_email, username:item.from_email.split("@")[0]};
        }
      }

      // Auto-add anyone you have real messages with
      const { data: msgContacts } = await sb.from("messages")
        .select("from_id,from_email,to_id")
        .or(`from_id.eq.${userId},to_id.eq.${userId}`)
        .limit(100);
      for(const m of (msgContacts||[])) {
        const email = m.from_id===userId ? null : m.from_email;
        if(email && email!==userEmail && !contactMap[email]) {
          const prof = await sb.from("user_profiles").select("id,email,username").eq("email",email).single().then(r=>r.data);
          contactMap[email] = {id:prof?.id||"pending_"+email, email, username:prof?.username||email.split("@")[0]};
        }
      }

      const allContacts = Object.values(contactMap);
      setFriends(allContacts);
      await dbSave(userId,"friends",allContacts);
      setLoaded(true);
    };

    buildContacts();
  },[userId, userEmail]);

  // Poll unread counts
  useEffect(()=>{
    const checkUnread=async()=>{
      if(!friends.length) return;
      const counts={};
      for(const f of friends){
        const {count}=await sb.from("messages").select("*",{count:"exact",head:true}).eq("from_id",f.id).eq("to_id",userId).eq("read",false);
        if(count>0) counts[f.id]=count;
      }
      setUnread(counts);
    };
    checkUnread();
    const t=setInterval(checkUnread,10000);
    return()=>clearInterval(t);
  },[friends,userId]);

  const saveFriends=async(list)=>{ setFriends(list); await dbSave(userId,"friends",list); };

  const blockUser=async(email)=>{
    const updated=[...blockedUsers.filter(b=>b!==email),email];
    setBlockedUsers(updated);
    await dbSave(userId,"blocked",updated);
    // Also remove from friends
    await saveFriends(friends.filter(f=>f.email!==email));
  };
  const unblockUser=async(email)=>{
    const updated=blockedUsers.filter(b=>b!==email);
    setBlockedUsers(updated);
    await dbSave(userId,"blocked",updated);
  };

  const saveName=async()=>{
    if(!nameVal.trim()) return;
    await sb.from("user_profiles").upsert({id:userId,email:userEmail,username:nameVal.trim(),updated_at:new Date().toISOString()},{onConflict:"id"});
    setProfile(p=>({...p,username:nameVal.trim()}));
    setEditName(false);
  };

  const handleSaveToChalk=async(data)=>{ await onSaveToChalk(data); };

  if(activeFriend) return(
    <ChatWindow myId={userId} myEmail={userEmail} myUsername={profile?.username||userEmail} friend={activeFriend} dark={dark}
      onSaveToChalk={handleSaveToChalk} onClose={()=>setActiveFriend(null)}/>
  );

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
      {/* Profile / username */}
      <div style={{background:bg2,borderRadius:14,border:"1.5px solid "+bdr,padding:"12px 16px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:C.r,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:900,color:"#fff",flexShrink:0}}>
            {(profile?.username||userEmail)?.[0]?.toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            {editName ? (
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <input style={{...inp,flex:1,padding:"6px 10px",fontSize:14}} value={nameVal} onChange={e=>setNameVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveName()} autoFocus/>
                <button onClick={saveName} style={{...btn(C.r),padding:"6px 12px",fontSize:13}}>Save</button>
                <button onClick={()=>setEditName(false)} style={{background:"none",border:"none",cursor:"pointer",color:sub,fontSize:18}}>×</button>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:800,fontSize:15,color:txt}}>{profile?.username||userEmail.split("@")[0]}</span>
                <button onClick={()=>setEditName(true)} style={{background:"none",border:"none",cursor:"pointer",color:C.r,fontSize:12,fontWeight:700}}>Edit</button>
              </div>
            )}
            <div style={{fontSize:11,color:sub,marginTop:1}}>{userEmail}</div>
          </div>
        </div>
      </div>
      {/* Add friend */}
      {/* Shared items section */}
      {sharedItems.length>0&&(
        <div style={{flexShrink:0}}>
          <div style={{fontSize:11,color:sub,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Shared with you</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {sharedItems.map(item=>(
              <div key={item.id} style={{background:bg2,borderRadius:14,border:"1.5px solid "+bdr,padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:32,height:32,borderRadius:10,background:item.type==="note"?"#555":item.type==="list"?"#B85C00":item.type==="calendar"||item.type==="calendar_day"?"#6B3FA0":C.r,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {item.type==="note"&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                    {item.type==="list"&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
                    {(item.type==="calendar"||item.type==="calendar_day")&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</div>
                    <div style={{fontSize:11,color:sub}}>from {item.from_email.split("@")[0]} · {item.type==="note"?"Note":item.type==="list"?"List":"Calendar"}</div>
                  </div>
                </div>
                {item.type==="note"&&typeof item.data==="string"&&(
                  <div style={{fontSize:12,color:sub,marginBottom:8,padding:"6px 8px",background:bg,borderRadius:8,maxHeight:60,overflow:"hidden"}}>{item.data.slice(0,120)}{item.data.length>120?"...":""}</div>
                )}
                {item.type==="note"&&typeof item.data==="object"&&item.data?.paths&&(
                  <div style={{marginBottom:8}}><DrawingPreview paths={item.data.paths} dark={dark}/></div>
                )}
                <div style={{display:"flex",gap:7}}>
                  <button onClick={async()=>{ await onAcceptShared(item); setSharedItems(prev=>prev.filter(x=>x.id!==item.id)); }} style={{...btn(C.r),flex:1,fontSize:12,padding:"7px",borderRadius:8}}>
                    {item.type==="list"?"Add to Lists":item.type==="note"?"Add to Chalk":"Add to Calendar"}
                  </button>
                  <button onClick={async()=>{ await deleteInboxItem(item.id); setSharedItems(prev=>prev.filter(x=>x.id!==item.id)); }} style={{...btn("#fff",C.k),border:"1.5px solid "+bdr,fontSize:12,padding:"7px 12px",borderRadius:8}}>Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Friends list */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
        {!loaded&&<Spinner msg="Loading..."/>}
        {loaded&&friends.filter(f=>!blockedUsers.includes(f.email)).length===0&&sharedItems.length===0&&<div style={{textAlign:"center",color:sub,padding:40,fontSize:14}}>Share something with someone to start a conversation!</div>}
        {friends.filter(f=>!blockedUsers.includes(f.email)).map(f=>{ const swiped=swipedId===f.id||swipedId===f.email; const setSwiped=(v)=>setSwipedId(v?(f.id||f.email):null); return(
          <div key={f.id} style={{position:"relative",overflow:"hidden",borderRadius:14,marginBottom:0}}>
            <div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:"#ff3b30",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"0 14px 14px 0"}}>
              <button onClick={async e=>{ e.stopPropagation(); await dbSave(userId,"friends",friends.filter(x=>x.email!==f.email)); setFriends(friends.filter(x=>x.email!==f.email)); }} style={{background:"none",border:"none",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>Delete</button>
            </div>
            <div onClick={()=>{ if(swiped){setSwiped(false);return;} setActiveFriend({...f, email: f.email||""}); }}
              onTouchStart={e=>{ const sx=e.touches[0].clientX; e._sx=sx; }}
              onTouchEnd={e=>{ const dx=(e.changedTouches[0].clientX)-(e.currentTarget._sx||e.changedTouches[0].clientX); if(dx<-40) setSwiped(true); else if(dx>20) setSwiped(false); }}
              style={{transform:swiped?"translateX(-80px)":"translateX(0)",transition:"transform .2s",background:bg2,borderRadius:14,border:"1.5px solid "+bdr,padding:"13px 15px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:C.r,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:900,color:"#fff",flexShrink:0,position:"relative"}}>
              {(f.username||f.email)?.[0]?.toUpperCase()}
              {unread[f.id]>0&&<div style={{position:"absolute",top:-2,right:-2,width:16,height:16,borderRadius:"50%",background:"#ff3b30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#fff"}}>{unread[f.id]}</div>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:txt}}>{f.nickname||f.username||f.email.split("@")[0]}</div>
              <div style={{fontSize:11,color:sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.email}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><polyline points="9 18 15 12 9 6"/></svg>
            <button onClick={e=>{e.stopPropagation(); const nn=window.prompt("Nickname for "+f.email+":",f.nickname||f.username||f.email.split("@")[0]); if(nn!==null){
              const trimmed = nn.trim();
              if(trimmed) {
                // Check uniqueness
                const conflict = friends.find(x=>x.email!==f.email && x.nickname && x.nickname.trim().toLowerCase()===trimmed.toLowerCase());
                if(conflict){ alert("Nickname already used for "+conflict.email+". Choose a different one."); }
                else { const updated=friends.map(x=>x.email===f.email?{...x,nickname:trimmed}:x); saveFriends(updated); }
              } else {
                const updated=friends.map(x=>x.email===f.email?{...x,nickname:undefined}:x); saveFriends(updated);
              }
            }}} style={{background:"none",border:"none",cursor:"pointer",color:C.r,fontSize:11,fontWeight:700,flexShrink:0,padding:"4px 6px"}}>✏</button>
            <button onClick={e=>{e.stopPropagation();if(window.confirm("Block "+f.email+"? They cannot message you.")){blockUser(f.email);}}} style={{background:"none",border:"none",cursor:"pointer",color:"#ff3b30",fontSize:11,fontWeight:700,flexShrink:0,padding:"4px 6px"}}>Block</button>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}
// ── SETTINGS ──
function Settings({ user, dark, setDark, accent, onAccent, onClose }) {
  const [tab,setTab]=useState("account");



  useEffect(()=>{
    loadNotifSettings(user.id).then(s=>{ if(s) setNotifSettings(s); });
},[user.id]);




  const [newEmail,setNewEmail]=useState("");
  const [newPass,setNewPass]=useState("");
  const [confPass,setConfPass]=useState("");
  const [msg,setMsg]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const bg=dark?"#1C1C1E":"#fff", bg2=dark?"#2C2C2E":"#F5F0EE", bdr=dark?"#3A3A3C":C.bd, txt=dark?"#F2F2F7":C.k, sub=dark?"#8E8E93":C.g;

  const saveEmail=async()=>{ setErr(""); setMsg(""); setLoading(true); if(!newEmail.trim()){setErr("Enter a new email.");setLoading(false);return;} const{error}=await sb.auth.updateUser({email:newEmail.trim()}); if(error) setErr(error.message); else setMsg("Confirmation sent to new email!"); setLoading(false); };
  const savePass=async()=>{ setErr(""); setMsg(""); setLoading(true); if(newPass.length<6){setErr("Password must be 6+ characters.");setLoading(false);return;} if(newPass!==confPass){setErr("Passwords don't match.");setLoading(false);return;} const{error}=await sb.auth.updateUser({password:newPass}); if(error) setErr(error.message); else{setMsg("Password updated!");setNewPass("");setConfPass("");} setLoading(false); };
  const II={width:"100%",padding:"12px 14px",borderRadius:11,border:"1.5px solid "+bdr,background:bg,color:txt,fontSize:14,outline:"none",boxSizing:"border-box"};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:500,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:bg,borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",paddingBottom:32}}>
        <div style={{display:"flex",justifyContent:"center",paddingTop:12,paddingBottom:4}}>
          <div style={{width:40,height:4,borderRadius:2,background:bdr}}/>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px 8px"}}>
          <span style={{fontFamily:"'Nunito',sans-serif",fontSize:20,fontWeight:900,color:txt}}>Settings</span>
          <button onClick={onClose} style={{background:bg2,border:"none",borderRadius:10,width:32,height:32,cursor:"pointer",fontSize:18,color:txt,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{display:"flex",gap:6,padding:"0 20px",marginBottom:20}}>
          {[["account","Account"],["appearance","Appearance"],["notifications","Notifications"]].map(([id,l])=>(
            <button key={id} onClick={()=>{setTab(id);setErr("");setMsg("");}} style={{...pill(tab===id),fontSize:13}}>{l}</button>
          ))}
        </div>
        <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:14}}>
          {tab==="account"&&(
            <>
              <div style={{background:bg2,borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:sub,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Signed In As</div>
                <div style={{fontSize:14,color:txt,fontWeight:600}}>{user.email}</div>
              </div>
              <div style={{background:bg2,borderRadius:14,padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:13,fontWeight:700,color:txt}}>Change Email</div>
                <input style={II} type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="New email address"/>
                <button onClick={saveEmail} disabled={loading} style={{...btn(),width:"100%",opacity:loading?0.7:1}}>Update Email</button>
              </div>
              <div style={{background:bg2,borderRadius:14,padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:13,fontWeight:700,color:txt}}>Change Password</div>
                <input style={II} type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New password"/>
                <input style={II} type="password" value={confPass} onChange={e=>setConfPass(e.target.value)} placeholder="Confirm new password"/>
                <button onClick={savePass} disabled={loading} style={{...btn(),width:"100%",opacity:loading?0.7:1}}>Update Password</button>
              </div>
            </>
          )}
          {tab==="appearance"&&(
            <>
              <div style={{background:bg2,borderRadius:14,padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:txt}}>Dark Mode</div>
                    <div style={{fontSize:12,color:sub,marginTop:2}}>Easy on the eyes at night</div>
                  </div>
                  <button onClick={()=>setDark(!dark)} style={{width:50,height:28,borderRadius:14,background:dark?C.r:"#E5E5EA",border:"none",cursor:"pointer",position:"relative"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:dark?25:3,transition:"left .2s"}}/>
                  </button>
                </div>
              </div>
              <div style={{background:bg2,borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:sub,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Accent Color</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:8}}>
                  {ACCENT_COLORS.map(ac=>{

                    return(
                      <button key={ac.id} onClick={()=>onAccent(ac.hex)}
                        style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:0}}>
                        <div style={{width:38,height:38,borderRadius:"50%",background:ac.hex,border:accent===ac.hex?"3px solid "+txt:"3px solid transparent",boxSizing:"border-box"}}/>
                        <span style={{fontSize:10,color:accent===ac.hex?txt:sub,fontWeight:accent===ac.hex?800:500}}>{ac.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{fontSize:11,color:sub}}>Tap a color to apply — changes immediately.</div>
              </div>
              <div style={{background:bg2,borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:sub,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>App Sections</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["🖊 Chalk","#6b8c52"],["🔑 Logins","#2C5F9E"],["☑ Lists","#B85C00"],["📅 Calendar","#6B3FA0"],["💰 Money","#1B6B35"],["🏥 Health","#B5174A"]].map(([l,col])=>(
                    <div key={l} style={{background:col+"22",border:"1.5px solid "+col+"44",borderRadius:10,padding:"8px 12px",fontSize:13,fontWeight:700,color:col}}>{l}</div>
                  ))}
                </div>
              </div>
            </>
          )}
          {tab==="notifications"&&(
            <div style={{background:bg2,borderRadius:14,padding:"20px 16px",textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>🔔</div>
              <div style={{fontSize:16,fontWeight:800,color:txt,marginBottom:8}}>Notifications Coming Soon</div>
              <div style={{fontSize:13,color:sub,lineHeight:1.6}}>Push notifications with exact-time alerts will be available in the Script native app. Stay tuned!</div>
            </div>
          )}
          {err&&<div style={{color:"#ff6060",fontSize:13,background:"rgba(255,80,80,.08)",borderRadius:10,padding:"10px 14px"}}>{err}</div>}
          {msg&&<div style={{color:"#34c759",fontSize:13,background:"rgba(52,199,89,.08)",borderRadius:10,padding:"10px 14px"}}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}

const NAV=[
  {id:"chalk",    label:"Chalk",    color:"#555",    App:Chalk},
  {id:"logins",   label:"Logins",   color:"#2C5F9E", App:Logins},
  {id:"lists",    label:"Lists",    color:"#B85C00", App:Lists},
  {id:"calendar", label:"Calendar", color:"#6B3FA0", App:Calendar},
  {id:"money",    label:"Money",    color:"#1B6B35", App:Money},
  {id:"health",   label:"Health",   color:"#B5174A", App:Health},
];

export default function Script() {
  const [user,setUser]=useState(null);
  const [active,setActive]=useState("chalk");
  const [chalkKey,setChalkKey]=useState(0);
  const [showMenu,setShowMenu]=useState(false);
  const [msgUnread,setMsgUnread]=useState(0);
  const [showSett,setShowSett]=useState(false);
  const [dark,setDark]=useState(()=>{ try{ return localStorage.getItem("script_dark")==="1"; }catch(e){ return false; } });
  const [accent,setAccentState]=useState(()=>{ try{ return localStorage.getItem("script_accent")||"#C8220A"; }catch(e){ return "#C8220A"; } });
  const changeAccent=(hex)=>{ setAccentState(hex); C.r=hex; try{ localStorage.setItem("script_accent",hex); }catch(e){} };
  const [booting,setBooting]=useState(true);
  const [inbox,setInbox]=useState([]);
  const [showInbox,setShowInbox]=useState(false);
  const [showChat,setShowChat]=useState(false);

  const hash=window.location.hash;
  const hashShare=hash.match(/^#share\/(.+)$/);
  if(hashShare) return <SharedCalendarView shareId={hashShare[1]}/>;

  useEffect(()=>{ try{ localStorage.setItem("script_dark",dark?"1":"0"); }catch(e){} },[dark]);
  useEffect(()=>{ C.r=accent; },[accent]);
  useEffect(()=>{
    sb.auth.getSession().then(({data})=>{
      if(data?.session?.user) {
        const u = data.session.user;
        setUser(u);
        // Create profile immediately on login so they are discoverable
        getOrCreateProfile(u.id, u.email).catch(()=>{});
        if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
      }
      setBooting(false);
    });
    const {data:listener}=sb.auth.onAuthStateChange((_,session)=>{
      const u = session?.user ?? null;
      setUser(u);
      // Also create profile on any auth state change (new signup, token refresh)
      if(u?.id && u?.email) getOrCreateProfile(u.id, u.email).catch(()=>{});
    });
    return()=>listener.subscription.unsubscribe();
  },[]);
  useEffect(()=>{
    if(!user?.email) return;
    loadInbox(user.email).then(setInbox);
    // Poll every 30s for new shared items
    const t=setInterval(()=>loadInbox(user.email).then(setInbox),30000);
    return()=>clearInterval(t);
  },[user]);


  const acceptShared = async (item) => {
    if(item.type==="note") {
      // Append to chalk — handle both text-only and {text,paths} drawing shares
      const existing = await dbLoad(user.id,"chalk");
      const existText = existing?.text||"";
      const existPaths = existing?.paths||[];
      const sharedData = item.data;
      let newText, newPaths;
      if(typeof sharedData === "object" && sharedData.paths) {
        // Drawing share — just merge paths, don't add text label
        newText = existText;
        newPaths = [...existPaths, ...sharedData.paths];
      } else {
        // Text share
        newText = existText ? existText+"\n\n--- From "+item.from_email+" ---\n"+sharedData : sharedData;
        newPaths = existPaths;
      }
      await dbSave(user.id,"chalk",{text:newText,paths:newPaths});
      setChalkKey(k=>k+1);
      setActive("chalk");
    } else if(item.type==="list") {
      // Add as new list
      const existing = await dbLoad(user.id,"lists")||BASE_LISTS;
      const nl={id:"shared_"+Date.now(),label:item.title+" (from "+item.from_email.split("@")[0]+")",kind:"check",items:item.data||[]};
      await dbSave(user.id,"lists",[...existing,nl]);
      setActive("lists");
    } else if(item.type==="calendar") {
      // For calendar: save all days
      const existing = await dbLoad(user.id,"cal")||{};
      const merged={...existing};
      Object.entries(item.data||{}).forEach(([k,v])=>{ merged[k]=merged[k]?merged[k]+"\n--- From "+item.from_email+" ---\n"+v:v; });
      await dbSave(user.id,"cal",merged);
      setActive("calendar");
    } else if(item.type==="calendar_day") {
      // Save single day — data is {key: noteText}
      const existing = await dbLoad(user.id,"cal")||{};
      const dayData = item.data||{};
      Object.entries(dayData).forEach(([k,v])=>{
        if(v) existing[k]=existing[k]?existing[k]+"\n--- From "+item.from_email+" ---\n"+v:v;
      });
      await dbSave(user.id,"cal",existing);
      setActive("calendar");
    }
    // Only delete bell notification items, NOT shared_chat (those are permanent chat history)
    if(item.type !== "shared_chat") {
      await deleteInboxItem(item.id);
    }
    setInbox(prev=>prev.filter(x=>x.id!==item.id));
    setShowInbox(false);
  };
  const handleSaveToChalk=async(data)=>{
    const existing=await dbLoad(user.id,"chalk");
    const newText=existing?.text||"";
    const newPaths=[...(existing?.paths||[]),...(data.paths||[])];
    await dbSave(user.id,"chalk",{text:newText,paths:newPaths});
    setChalkKey(k=>k+1); setActive("chalk");
  };

  const D=dark?{pageBg:"#1C1C1E",headerBg:"#2C2C2E",border:"#3A3A3C",text:"#F2F2F7",sub:"#8E8E93"}:{pageBg:"#F5F0EE",headerBg:"#fff",border:C.bd,text:C.k,sub:C.g};

  if(booting) return(
    <div style={{minHeight:"100svh",background:C.r,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:52,fontWeight:900,color:"#fff",letterSpacing:-2,marginBottom:20}}>Script</div>
        <div style={{width:36,height:36,border:"3px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if(!user) return <Login onLogin={setUser}/>;

  const cur=NAV.find(n=>n.id===active);
  const {App}=cur;

  return(
    <div key={accent} style={{display:"flex",flexDirection:"column",height:"100svh",background:D.pageBg,fontFamily:"'Nunito',sans-serif",overflow:"hidden",paddingTop:"env(safe-area-inset-top)"}}>
      <style>{`input,select,textarea{font-size:16px!important;}`}</style>
      {dark&&<style>{`input,select,textarea{background:#2C2C2E !important;color:#F2F2F7 !important;border-color:#3A3A3C !important;}input::placeholder,textarea::placeholder{color:#636366 !important;}`}</style>}
      <div style={{background:D.headerBg,borderBottom:"1.5px solid "+D.border,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,borderRadius:8,background:C.r,display:"flex",alignItems:"center",justifyContent:"center"}}><ScrollIcon sz={18} white={true}/></div>
          <span style={{fontFamily:"'Nunito',sans-serif",fontSize:20,fontWeight:900,color:C.r,letterSpacing:-0.5}}>Script</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:12,color:D.sub,fontWeight:600}}>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
          <button onClick={()=>setShowChat(true)} style={{display:"flex",alignItems:"center",gap:5,background:C.r,border:"none",borderRadius:20,padding:"5px 11px",cursor:"pointer",color:"#fff",fontSize:12,fontWeight:800,letterSpacing:.3}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Scrypt Chat
          </button>
          <button onClick={()=>setShowInbox(true)} style={{position:"relative",background:"none",border:"none",cursor:"pointer",padding:4}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={D.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {inbox.filter(i=>!i.read).length>0&&<div style={{position:"absolute",top:2,right:2,width:8,height:8,borderRadius:"50%",background:C.r}}/>}
          </button>
          <div style={{position:"relative"}}>
            <button onClick={()=>setShowMenu(!showMenu)} style={{width:32,height:32,borderRadius:"50%",background:C.r,border:"none",cursor:"pointer",color:"#fff",fontWeight:800,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {(user.email?.[0]||"U").toUpperCase()}
            </button>
            {showMenu&&<div onClick={()=>setShowMenu(false)} style={{position:"fixed",inset:0,zIndex:100}}/>}
            {showMenu&&(
              <div style={{position:"absolute",top:38,right:0,background:D.headerBg,border:"1.5px solid "+D.border,borderRadius:14,overflow:"hidden",minWidth:180,zIndex:101,boxShadow:"0 8px 32px rgba(0,0,0,.15)"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+D.border}}>
                  <div style={{fontSize:11,color:D.sub,fontWeight:700,letterSpacing:1}}>SIGNED IN AS</div>
                  <div style={{fontSize:13,color:D.text,fontWeight:600,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{user.email}</div>
                </div>
                {[["⚙️  Settings",()=>{setShowSett(true);setShowMenu(false);}],[dark?"☀️  Light Mode":"🌙  Dark Mode",()=>{setDark(!dark);setShowMenu(false);}],["Sign Out",()=>{sb.auth.signOut();setShowMenu(false);}]].map(([l,fn])=>(
                  <button key={l} onClick={fn} style={{display:"block",width:"100%",padding:"12px 16px",background:"none",border:"none",textAlign:"left",cursor:"pointer",fontSize:14,color:l==="Sign Out"?C.r:D.text,fontWeight:600}}>{l}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{background:D.headerBg,borderBottom:"1.5px solid "+D.border,padding:"6px 18px 8px",flexShrink:0}}>
        <h1 style={{margin:0,fontSize:22,fontWeight:900,color:cur?.color||D.text,fontFamily:"'Nunito',sans-serif"}}>{cur?.label}</h1>
      </div>
      <div style={{flex:1,padding:"14px 16px",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <App key={active==="chalk"?chalkKey:active} userId={user.id} dark={dark} userEmail={user.email||""} onSaveToChalk={handleSaveToChalk}/>
      </div>
      <div style={{background:D.headerBg,borderTop:"1.5px solid "+D.border,flexShrink:0,paddingBottom:"max(env(safe-area-inset-bottom),20px)"}}>
        <div style={{display:"flex"}}>
          {NAV.map(n=>{ const on=active===n.id; return(
            <button key={n.id} onClick={()=>setActive(n.id)} style={{flex:1,paddingTop:8,paddingBottom:8,paddingLeft:4,paddingRight:4,border:"none",background:on?n.color:D.headerBg,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"background .15s"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:on?"#fff":n.color,opacity:on?1:.5}}/>
              <span style={{fontSize:9,fontWeight:800,color:on?"#fff":n.color,letterSpacing:.3,textTransform:"uppercase"}}>{n.label}</span>
            </button>
          ); })}
        </div>
      </div>
      {showChat&&(
        <div style={{position:"fixed",inset:0,zIndex:800,background:D.pageBg,display:"flex",flexDirection:"column"}}>
          <div style={{background:D.headerBg,borderBottom:"1.5px solid "+D.border,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <button onClick={()=>setShowChat(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.r,fontSize:22,fontWeight:900,lineHeight:1,padding:0}}>‹</button>
            <span style={{fontFamily:"'Nunito',sans-serif",fontSize:18,fontWeight:900,color:C.r}}>Scrypt Chat</span>
          </div>
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",padding:"14px 16px"}}>
            <Messages userId={user.id} userEmail={user.email||""} dark={dark} onSaveToChalk={handleSaveToChalk} onAcceptShared={async(item)=>{ await acceptShared(item); }}/>
          </div>
        </div>
      )}
      {showInbox&&<InboxModal items={inbox} onAccept={acceptShared} onDismiss={async(id)=>{ const item=inbox.find(x=>x.id===id); if(item?.type!=="shared_chat") await deleteInboxItem(id); setInbox(prev=>prev.filter(x=>x.id!==id)); }} onClose={()=>setShowInbox(false)}/>}
      {showSett&&<Settings user={user} dark={dark} setDark={setDark} accent={accent} onAccent={changeAccent} onClose={()=>setShowSett(false)}/>}
    </div>
  );
}
