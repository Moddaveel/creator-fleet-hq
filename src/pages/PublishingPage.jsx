import { useState, useEffect } from "react";
import { C, PLATFORM_META } from "../constants";
import { PUB_AGENTS } from "../data/agents";
import Chip from "../components/Chip";
import Card from "../components/Card";
import Sect from "../components/Sect";
import AgentChat from "../components/AgentChat";
import AgentButton from "../components/AgentButton";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const TWITCH_COLOR = "#9146ff";

const PLATFORMS = [
  { label:"Twitch",    icon:"🟣", color:TWITCH_COLOR },
  { label:"YouTube",   icon:"🔴", color:"#FF0000"   },
  { label:"Instagram", icon:"🟠", color:"#f97316"   },
  { label:"TikTok",    icon:"🎵", color:"#69c9d0"   },
];

const RALPH_LOOP = {
  status: "open", lastSignal: "Mar 11, 2026 9:42 PM",
  signalType: "overperformer", activeSignals: 3,
  lastContent: "Discovery Clip - Reaction format 2x avg",
};

function RalphLoopStatus() {
  const isOpen = RALPH_LOOP.status === "open";
  const accent = isOpen ? C.neon : C.green;
  return (
    <div style={{ marginBottom:20, background:isOpen?"rgba(217,70,239,0.08)":"rgba(34,197,94,0.08)", border:"2px solid "+(isOpen?"rgba(217,70,239,0.5)":"rgba(34,197,94,0.5)"), borderRadius:14, padding:18 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <div style={{ width:38, height:38, background:"rgba(217,70,239,0.2)", border:"1px solid rgba(217,70,239,0.44)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>♻️</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:800, color:C.neon }}>Ralph Loop</div>
          <div style={{ fontSize:11, color:C.muted }}>Performance signal chain - Studio to Publish to Analytics to Studio</div>
        </div>
        <div style={{ background:accent+"22", border:"1px solid "+accent+"55", borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:800, color:accent }}>{isOpen?"Signal Open":"Loop Closed"}</div>
      </div>
      <div style={{ borderTop:"1px solid rgba(217,70,239,0.15)", paddingTop:12, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {[
          { label:"Active Signals", val:RALPH_LOOP.activeSignals, big:true },
          { label:"Signal Type", val:RALPH_LOOP.signalType==="overperformer"?"Overperformer":"Underperformer", color:RALPH_LOOP.signalType==="overperformer"?C.green:C.red },
          { label:"Last Signal", val:RALPH_LOOP.lastSignal },
        ].map((s,i) => (
          <div key={i} style={{ background:"rgba(217,70,239,0.08)", border:"1px solid rgba(217,70,239,0.2)", borderRadius:9, padding:"10px 14px" }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</div>
            <div style={{ fontSize:s.big?22:12, fontWeight:s.big?900:700, color:s.color||C.neon, marginTop:s.big?0:4 }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:10, padding:"8px 12px", background:"rgba(217,70,239,0.06)", border:"1px solid rgba(217,70,239,0.15)", borderRadius:8, fontSize:11, color:C.muted }}>
        <span style={{ color:C.neon, fontWeight:700 }}>Latest: </span>{RALPH_LOOP.lastContent}
      </div>
    </div>
  );
}

function StreamModal({ onSave, onClose }) {
  const [title, setTitle]       = useState("");
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("");
  const [duration, setDuration] = useState("3");
  const inputStyle = { width:"100%", background:C.card2, border:"1px solid "+C.border, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" };
  const labelStyle = { fontSize:11, fontWeight:700, color:C.muted, marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.06em" };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#1a1025", border:"2px solid "+TWITCH_COLOR+"66", borderRadius:18, padding:28, width:380, boxShadow:"0 0 40px "+TWITCH_COLOR+"33" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
          <div style={{ width:36, height:36, background:TWITCH_COLOR+"22", border:"1px solid "+TWITCH_COLOR+"55", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🟣</div>
          <div style={{ fontSize:15, fontWeight:800, color:TWITCH_COLOR }}>Schedule a Stream</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={labelStyle}>Stream Title</label>
            <input style={inputStyle} placeholder="e.g. Friday Night Build Session" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} value={date} onChange={e=>setDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="time" style={inputStyle} value={time} onChange={e=>setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Duration (hrs)</label>
            <input type="number" min="0.5" max="12" step="0.5" style={inputStyle} value={duration} onChange={e=>setDuration(e.target.value)} />
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          <button onClick={onClose} style={{ flex:1, background:"transparent", border:"1px solid "+C.border, borderRadius:9, padding:"10px 0", color:C.muted, fontSize:13, fontWeight:700, cursor:"pointer" }}>Cancel</button>
          <button
            onClick={() => { if (!title||!date||!time) return; onSave({ id:"stream_"+Date.now(), title, date, time, duration:parseFloat(duration)||3 }); onClose(); }}
            style={{ flex:2, background:TWITCH_COLOR+"22", border:"2px solid "+TWITCH_COLOR+"66", borderRadius:9, padding:"10px 0", color:TWITCH_COLOR, fontSize:13, fontWeight:800, cursor:"pointer" }}
          >+ Add Stream</button>
        </div>
      </div>
    </div>
  );
}

function DayModal({ day, year, month, queue, streams, onClose, onNavigateToPost }) {
  const dateStr   = year+"-"+String(month+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
  const dayStreams = streams.filter(s => s.date === dateStr);
  const dayPosts  = queue.flatMap(item =>
    item.platforms
      .filter(p => p.scheduledTime && new Date(p.scheduledTime).toISOString().startsWith(dateStr))
      .map(p => ({ ...p, itemTitle:item.title, pub_id:item.pub_id }))
  ).sort((a,b) => new Date(a.scheduledTime)-new Date(b.scheduledTime));
  const fmt = t => new Date(t).toLocaleString("en-US",{hour:"numeric",minute:"2-digit",hour12:true});
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#1a1025", border:"1px solid "+C.border, borderRadius:18, padding:28, width:460, maxHeight:"80vh", overflowY:"auto", boxShadow:"0 8px 40px #00000088" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:900, color:C.purple }}>{MONTH_NAMES[month]} {day}, {year}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"1px solid "+C.border, borderRadius:7, padding:"4px 12px", color:C.muted, fontSize:12, cursor:"pointer" }}>Close</button>
        </div>
        {dayStreams.length > 0 && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Streams</div>
            {dayStreams.map(s => (
              <div key={s.id} style={{ background:TWITCH_COLOR+"12", border:"1px solid "+TWITCH_COLOR+"44", borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:16 }}>🟣</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:TWITCH_COLOR }}>{s.title}</div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.time} - {s.duration}h on Twitch</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {dayPosts.length > 0 && (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Scheduled Posts</div>
            {dayPosts.map((p,i) => {
              const meta = PLATFORM_META[p.platform]||{ icon:"📱", label:p.platform, color:C.muted };
              return (
                <div key={i} style={{ background:meta.color+"0d", border:"1px solid "+meta.color+"33", borderRadius:10, padding:"12px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:34, height:34, background:meta.color+"22", border:"1px solid "+meta.color+"44", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{meta.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:meta.color }}>{meta.label}</div>
                    <div style={{ fontSize:11, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.itemTitle}</div>
                    <div style={{ fontSize:11, color:C.blue, fontWeight:600, marginTop:2 }}>{fmt(p.scheduledTime)}</div>
                  </div>
                  <button onClick={() => { onNavigateToPost(p.pub_id); onClose(); }} style={{ background:C.purple+"15", border:"1px solid "+C.purple+"33", borderRadius:7, padding:"6px 12px", color:C.purple, fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}>View</button>
                </div>
              );
            })}
          </div>
        )}
        {dayStreams.length===0 && dayPosts.length===0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:C.muted, fontSize:13 }}>Nothing scheduled for this day.</div>
        )}
      </div>
    </div>
  );
}

function MonthCalendar({ queue, streams, year, month, onDayClick }) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today       = new Date();
  const getPostsForDay = (day) => {
    const dateStr = year+"-"+String(month+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
    return queue.flatMap(item =>
      item.platforms
        .filter(p => p.scheduledTime && new Date(p.scheduledTime).toISOString().startsWith(dateStr))
        .map(p => ({ ...p, itemTitle:item.title }))
    );
  };
  const getStreamsForDay = (day) => {
    const dateStr = year+"-"+String(month+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
    return streams.filter(s => s.date === dateStr);
  };
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const isToday = d => d && today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:800, color:C.purple, padding:"6px 0", textTransform:"uppercase", letterSpacing:"0.08em" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={"e"+i} style={{ minHeight:90, borderRadius:10 }} />;
          const posts      = getPostsForDay(day);
          const dayStrm    = getStreamsForDay(day);
          const isTod      = isToday(day);
          const hasContent = posts.length > 0 || dayStrm.length > 0;
          return (
            <div key={day} onClick={() => hasContent && onDayClick(day)} style={{ minHeight:90, borderRadius:10, padding:8, background:isTod?C.neon+"18":C.purple+"0d", border:(isTod?"2px":"1.5px")+" solid "+(isTod?C.neon:C.purple+"77"), display:"flex", flexDirection:"column", gap:3, boxShadow:isTod?"0 0 12px "+C.neon+"55":"0 0 4px "+C.purple+"22", cursor:hasContent?"pointer":"default", transition:"all 0.15s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                <div style={{ width:22, height:22, borderRadius:11, background:isTod?C.neon:C.purple+"30", border:"1px solid "+(isTod?C.neon:C.purple+"88"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:isTod?"#fff":C.purple }}>{day}</div>
                {(posts.length+dayStrm.length) > 2 && <div style={{ fontSize:9, color:C.muted, fontWeight:600 }}>+{posts.length+dayStrm.length-2}</div>}
              </div>
              {dayStrm.slice(0,1).map((s,si) => (
                <div key={si} style={{ background:TWITCH_COLOR+"22", border:"1px solid "+TWITCH_COLOR+"66", borderRadius:5, padding:"2px 5px", fontSize:9, fontWeight:700, color:TWITCH_COLOR, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:3 }}>
                  🟣 <span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>{s.title.slice(0,12)}</span>
                </div>
              ))}
              {posts.slice(0, dayStrm.length>0?1:2).map((p, pi) => {
                const meta = PLATFORM_META[p.platform]||{ color:C.muted, icon:"📱" };
                return (
                  <div key={pi} style={{ background:meta.color+"22", border:"1px solid "+meta.color+"66", borderRadius:5, padding:"2px 5px", fontSize:9, fontWeight:700, color:meta.color, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:3 }}>
                    <span>{meta.icon}</span><span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>{p.itemTitle.slice(0,14)}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STAT_FILTERS = [
  { key:"all",       label:"Total Posts", icon:"📤", accent:"#a855f7", bg:"#18061a", border:"rgba(168,85,247,0.45)" },
  { key:"scheduled", label:"Scheduled",   icon:"📅", accent:"#3b82f6", bg:"#080e1a", border:"rgba(59,130,246,0.45)" },
  { key:"draft",     label:"Drafts",      icon:"✏️", accent:"#eab308", bg:"#16120a", border:"rgba(234,179,8,0.45)" },
  { key:"published", label:"Published",   icon:"✅", accent:"#22c55e", bg:"#08160e", border:"rgba(34,197,94,0.45)" },
];
const statusStyles = {
  published: { color:"#22c55e", bg:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.3)",  label:"Published" },
  scheduled: { color:"#3b82f6", bg:"rgba(59,130,246,0.12)", border:"rgba(59,130,246,0.3)", label:"Scheduled" },
  draft:     { color:"#eab308", bg:"rgba(234,179,8,0.12)",  border:"rgba(234,179,8,0.3)",  label:"Draft"     },
};

const SUBPAGES = [
  { id:"queue",    label:"Queue",    icon:"📤" },
  { id:"calendar", label:"Calendar", icon:"📅" },
];

export default function PublishingPage({ publishQueue, setPublishQueue, toast }) {
  const [subpage, setSubpage]             = useState("queue");
  const [chatAgent, setChatAgent]         = useState(null);
  const [expandedIds, setExpandedIds]     = useState(new Set());
  const [filter, setFilter]               = useState("all");
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [selectedDay, setSelectedDay]         = useState(null);
  const [streams, setStreams] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cfhq_streams")||"[]"); } catch { return []; }
  });
  const today = new Date();
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  useEffect(() => {
    localStorage.setItem("cfhq_streams", JSON.stringify(streams));
  }, [streams]);

  const addStream    = s  => setStreams(prev => [...prev, s]);
  const toggleExpand = id => setExpandedIds(prev => {
    const next = new Set(prev); next.has(id)?next.delete(id):next.add(id); return next;
  });
  const markPublished = (pubId, platIdx) => {
    setPublishQueue(q => q.map(item => {
      if (item.pub_id !== pubId) return item;
      return { ...item, platforms: item.platforms.map((p,i) => i===platIdx?{...p,status:"published"}:p) };
    }));
    toast("Marked published - Ralph Loop tracking", C.green);
  };
  const navigateToPost = pub_id => { setSubpage("queue"); setExpandedIds(new Set([pub_id])); };

  const scheduledCount = publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="scheduled").length,0);
  const publishedCount = publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="published").length,0);
  const draftCount     = publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="draft").length,0);
  const totalPosts     = publishQueue.reduce((a,i)=>a+i.platforms.length,0);
  const statVals       = { all:totalPosts, scheduled:scheduledCount, draft:draftCount, published:publishedCount };

  const filteredQueue = filter==="all"
    ? publishQueue
    : publishQueue.map(item=>({...item,platforms:item.platforms.filter(p=>p.status===filter)})).filter(item=>item.platforms.length>0);

  const prevMonth = () => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); };
  const nextMonth = () => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); };

  return (
    <div style={{ height:"calc(100vh - 112px)", display:"flex", flexDirection:"column" }}>

      <div style={{ background:"#1a1025", borderBottom:"1px solid "+C.border, padding:"0 24px", display:"flex", gap:2, alignItems:"center", flexShrink:0 }}>
        {SUBPAGES.map(sp => (
          <button key={sp.id} onClick={()=>setSubpage(sp.id)} style={{ background:subpage===sp.id?C.purple+"22":"transparent", border:"none", borderBottom:"2px solid "+(subpage===sp.id?C.purple:"transparent"), color:subpage===sp.id?C.purple:C.muted, padding:"11px 16px", fontSize:12, fontWeight:subpage===sp.id?700:400, cursor:"pointer", display:"flex", gap:6, alignItems:"center", transition:"all 0.15s" }}>
            <span>{sp.icon}</span><span>{sp.label}</span>
            {sp.id==="queue"&&draftCount>0&&<span style={{ background:C.yellow, color:"#000", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:800 }}>{draftCount}</span>}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>

        {subpage==="queue" && (
          <div style={{ padding:24 }}>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:800 }}>Publishing Queue</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{totalPosts} total posts - {scheduledCount} scheduled - {draftCount} drafts</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
              {STAT_FILTERS.map(s => {
                const active = filter===s.key;
                return (
                  <div key={s.key} onClick={()=>setFilter(s.key)} style={{ background:s.bg, border:"1px solid "+(active?s.accent:s.border), borderRadius:14, padding:18, cursor:"pointer", transition:"all 0.15s", transform:active?"translateY(-1px)":"none", boxShadow:active?"0 4px 20px "+s.accent+"22":"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <div style={{ width:34, height:34, background:s.accent+"20", border:"1px solid "+s.accent+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
                      <div style={{ fontSize:11, fontWeight:700, color:active?s.accent:C.muted }}>{s.label}</div>
                      {active&&<div style={{ marginLeft:"auto", width:8, height:8, borderRadius:4, background:s.accent, boxShadow:"0 0 6px "+s.accent }} />}
                    </div>
                    <div style={{ borderTop:"1px solid "+s.accent+"18", marginBottom:12 }} />
                    <div style={{ fontSize:28, fontWeight:900, color:s.accent }}>{statVals[s.key]}</div>
                  </div>
                );
              })}
            </div>
            {filter!=="all" && (
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, padding:"8px 14px", background:C.card, border:"1px solid "+C.border, borderRadius:9 }}>
                <span style={{ fontSize:12, color:C.muted }}>Showing:</span>
                <Chip label={STAT_FILTERS.find(s=>s.key===filter)?.label} color={STAT_FILTERS.find(s=>s.key===filter)?.accent} />
                <span style={{ fontSize:11, color:C.muted }}>- {filteredQueue.reduce((a,i)=>a+i.platforms.length,0)} posts</span>
                <button onClick={()=>setFilter("all")} style={{ marginLeft:"auto", background:"transparent", border:"1px solid "+C.border, borderRadius:6, padding:"2px 10px", color:C.muted, fontSize:11, cursor:"pointer" }}>Clear</button>
              </div>
            )}
            {filteredQueue.length===0 ? (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📤</div>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>{filter==="all"?"Queue is empty":"No "+filter+" posts"}</div>
                <div style={{ fontSize:13, color:C.muted }}>{filter==="all"?"Use Approve + Schedule in the Approval Queue to add content here":""}</div>
              </div>
            ) : filteredQueue.map(item => {
              const isSelected = expandedIds.has(item.pub_id);
              const publishedN = item.platforms.filter(p=>p.status==="published").length;
              const progress   = Math.round((publishedN/item.platforms.length)*100);
              return (
                <div key={item.pub_id} style={{ background:C.card, border:"1px solid "+(isSelected?C.purple+"66":C.border), borderRadius:14, marginBottom:14, overflow:"hidden" }}>
                  <div onClick={()=>toggleExpand(item.pub_id)} style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", background:isSelected?C.purple+"08":"transparent" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:42, height:42, background:C.purple+"20", border:"1px solid "+C.purple+"44", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                        {item.type==="Clip Bundle"?"🎬":item.type==="YouTube Upload"?"▶":"📄"}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:800, marginBottom:4 }}>{item.title}</div>
                        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                          <Chip label={item.type} color={C.purple} sm />
                          <span style={{ fontSize:11, color:C.muted }}>from {item.addedFrom}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{publishedN}/{item.platforms.length} published</div>
                        <div style={{ width:100, height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
                          <div style={{ width:progress+"%", height:"100%", background:progress===100?C.green:C.purple, borderRadius:2, transition:"width 0.3s" }} />
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:4 }}>
                        {item.platforms.map((p,pi) => { const meta=PLATFORM_META[p.platform]||{icon:"📱",color:C.muted}; return <div key={pi} style={{ width:26,height:26,background:meta.color+"20",border:"1px solid "+meta.color+"44",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>{meta.icon}</div>; })}
                      </div>
                      <span style={{ color:C.muted, fontSize:12 }}>{isSelected?"▲":"▼"}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ borderTop:"1px solid "+C.border, padding:"14px 20px", display:"flex", flexDirection:"column", gap:8 }}>
                      {item.platforms.map((p,pi) => {
                        const meta=PLATFORM_META[p.platform]||{icon:"📱",label:p.platform,color:C.muted};
                        const ss=statusStyles[p.status]||statusStyles.draft;
                        return (
                          <div key={pi} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:meta.color+"0d",border:"1px solid "+meta.color+"33",borderRadius:10 }}>
                            <div style={{ width:36,height:36,background:meta.color+"20",border:"1px solid "+meta.color+"44",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{meta.icon}</div>
                            <div style={{ flex:1,minWidth:0 }}>
                              <div style={{ fontSize:12,fontWeight:700,color:meta.color,marginBottom:3 }}>{meta.label}</div>
                              <div style={{ fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.hook||p.caption||"No copy set"}</div>
                            </div>
                            <div style={{ flexShrink:0,textAlign:"right",minWidth:90 }}>
                              {p.scheduledTime?<div style={{ fontSize:11,color:C.purple,fontWeight:600 }}>{new Date(p.scheduledTime).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</div>:<span style={{ fontSize:10,color:C.muted }}>Not scheduled</span>}
                            </div>
                            <div style={{ flexShrink:0 }}>
                              {p.status==="published"
                                ?<div style={{ background:ss.bg,border:"1px solid "+ss.border,borderRadius:7,padding:"4px 10px",fontSize:11,fontWeight:700,color:ss.color }}>{ss.label}</div>
                                :p.status==="scheduled"
                                  ?<button onClick={()=>markPublished(item.pub_id,pi)} style={{ background:C.green+"22",border:"1px solid "+C.green+"44",borderRadius:7,padding:"6px 12px",color:C.green,fontSize:11,fontWeight:700,cursor:"pointer" }}>Mark Published</button>
                                  :<div style={{ background:ss.bg,border:"1px solid "+ss.border,borderRadius:7,padding:"4px 10px",fontSize:11,fontWeight:700,color:ss.color }}>{ss.label}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ marginTop:32 }}><RalphLoopStatus /></div>
            <Card>
              <Sect>Publishing SLA - Targets</Sect>
              {[
                {metric:"Approval to Queue",   target:"less than 5 min",  note:"Approve + Schedule is instant",       color:C.green},
                {metric:"Queue to Scheduled",  target:"less than 30 min", note:"Scheduling Agent recommends time",    color:C.green},
                {metric:"Approval to Publish", target:"less than 2 hrs",  note:"Currently 4.2 hrs - gap to close",   color:C.yellow},
                {metric:"Stream to Published", target:"less than 48 hrs", note:"Currently 3.2 days - primary target", color:C.red},
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<3?"1px solid "+C.border:"none" }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600 }}>{s.metric}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{s.note}</div>
                  </div>
                  <div style={{ background:s.color+"15", border:"1px solid "+s.color+"33", borderRadius:7, padding:"4px 12px", fontSize:11, fontWeight:700, color:s.color }}>{s.target}</div>
                </div>
              ))}
            </Card>
            <div style={{ marginTop:32, marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ background:C.purple+"22", border:"1px solid "+C.purple+"44", borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:800, color:C.purple }}>Publishing Agents</div>
                <div style={{ fontSize:12, color:C.muted }}>Hover to hear from them - click to open a session</div>
              </div>
              <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", padding:"24px", background:"#12121a", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16 }}>
                {PUB_AGENTS.map(a => <AgentButton key={a.id} agent={a} onClick={()=>setChatAgent(a)} large />)}
              </div>
            </div>
          </div>
        )}

        {subpage==="calendar" && (
          <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ background:C.purple+"22", border:"1px solid "+C.purple+"44", borderRadius:10, padding:"6px 14px", fontSize:15, fontWeight:800, color:C.purple }}>Publishing Calendar</div>
                <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:8, padding:"4px 12px", fontSize:12, color:C.muted }}>{scheduledCount} posts scheduled</div>
              </div>
              <button onClick={()=>setShowStreamModal(true)} style={{ background:TWITCH_COLOR+"22", border:"2px solid "+TWITCH_COLOR+"55", borderRadius:10, padding:"8px 18px", color:TWITCH_COLOR, fontSize:12, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                🟣 + Schedule Stream
              </button>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16, padding:"12px 16px", background:C.card, border:"1px solid "+C.border, borderRadius:12 }}>
              <span style={{ fontSize:11, color:C.muted, fontWeight:700, marginRight:4, alignSelf:"center" }}>PLATFORMS</span>
              {PLATFORMS.map(p => (
                <div key={p.label} style={{ display:"flex", alignItems:"center", gap:6, background:p.color+"15", border:"1px solid "+p.color+"44", borderRadius:7, padding:"4px 10px" }}>
                  <span style={{ fontSize:13 }}>{p.icon}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:p.color }}>{p.label}</span>
                </div>
              ))}
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:12, height:12, borderRadius:3, background:TWITCH_COLOR+"44", border:"1px solid "+TWITCH_COLOR+"88" }} />
                  <span style={{ fontSize:11, color:C.muted }}>Stream</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:12, height:12, borderRadius:6, background:C.neon }} />
                  <span style={{ fontSize:11, color:C.muted }}>Today</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:12, padding:"12px 0", background:C.card, border:"1px solid "+C.border, borderRadius:14 }}>
              <button onClick={prevMonth} style={{ background:C.purple+"22", border:"1px solid "+C.purple+"66", borderRadius:9, width:36, height:36, color:C.purple, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>&#8249;</button>
              <div style={{ fontSize:20, fontWeight:900, minWidth:200, textAlign:"center", background:"linear-gradient(135deg,"+C.purple+","+C.neon+")", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{MONTH_NAMES[calMonth]} {calYear}</div>
              <button onClick={nextMonth} style={{ background:C.purple+"22", border:"1px solid "+C.purple+"66", borderRadius:9, width:36, height:36, color:C.purple, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>&#8250;</button>
            </div>
            <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:20, marginBottom:16 }}>
              <MonthCalendar queue={publishQueue} streams={streams} year={calYear} month={calMonth} onDayClick={setSelectedDay} />
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Best Times to Post</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {Object.entries(PLATFORM_META).map(([k,v]) => (
                <div key={k} style={{ background:v.color+"0d", border:"1px solid "+v.color+"33", borderRadius:14, padding:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:30, height:30, background:v.color+"20", border:"1px solid "+v.color+"44", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{v.icon}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:v.color }}>{v.label}</div>
                  </div>
                  <div style={{ borderTop:"1px solid "+v.color+"18", marginBottom:10 }} />
                  <div style={{ fontSize:10, color:C.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Best Times</div>
                  {v.bestTimes.map((t,i) => (
                    <div key={i} style={{ fontSize:12, color:C.text, marginBottom:4, display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:4, height:4, borderRadius:2, background:v.color }} />{t}
                    </div>
                  ))}
                  <div style={{ marginTop:10, fontSize:10, color:C.muted, lineHeight:1.5 }}>{v.notes}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showStreamModal && <StreamModal onSave={addStream} onClose={()=>setShowStreamModal(false)} />}
      {selectedDay !== null && (
        <DayModal day={selectedDay} year={calYear} month={calMonth} queue={publishQueue} streams={streams} onClose={()=>setSelectedDay(null)} onNavigateToPost={navigateToPost} />
      )}
      {chatAgent && <AgentChat agent={chatAgent} onClose={()=>setChatAgent(null)} />}
    </div>
  );
}
