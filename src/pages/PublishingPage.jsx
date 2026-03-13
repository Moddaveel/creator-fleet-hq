import { useState } from "react";
import { C, PLATFORM_META } from "../constants";
import { PUB_AGENTS } from "../data/agents";
import Chip from "../components/Chip";
import Card from "../components/Card";
import Sect from "../components/Sect";
import AgentChat from "../components/AgentChat";
import AgentButton from "../components/AgentButton";

function CalendarView({ queue, onSelectItem }) {
  const days = [
    {label:"Mon 10",num:10},{label:"Tue 11",num:11},{label:"Wed 12",num:12},
    {label:"Thu 13",num:13},{label:"Fri 14",num:14},{label:"Sat 15",num:15},{label:"Sun 16",num:16},
  ];
  const timeSlots = [
    {label:"Morning",hours:[6,7,8,9,10,11]},
    {label:"Afternoon",hours:[12,13,14,15,16,17]},
    {label:"Evening",hours:[18,19,20,21,22,23]},
  ];
  const getItems = (dayNum, hour) => queue.flatMap(item =>
    item.platforms.filter(p => {
      if (!p.scheduledTime) return false;
      const d = new Date(p.scheduledTime);
      return d.getDate() === dayNum && d.getHours() === hour;
    }).map(p => ({ ...p, itemTitle:item.title, pub_id:item.pub_id }))
  );
  return (
    <div style={{ overflowX:"auto" }}>
      <div style={{ minWidth:760 }}>
        <div style={{ display:"grid", gridTemplateColumns:"80px repeat(7,1fr)", gap:1, marginBottom:8 }}>
          <div />
          {days.map(d => <div key={d.label} style={{ textAlign:"center", padding:"8px 4px", background:C.card2, borderRadius:"6px 6px 0 0", fontSize:11, fontWeight:700, color:C.text }}>{d.label}</div>)}
        </div>
        {timeSlots.map(slot => (
          <div key={slot.label} style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, color:C.muted, fontWeight:700, marginBottom:6 }}>{slot.label.toUpperCase()}</div>
            {slot.hours.map(hour => {
              const hasAny = days.some(d => getItems(d.num, hour).length > 0);
              if (!hasAny) return null;
              return (
                <div key={hour} style={{ display:"grid", gridTemplateColumns:"80px repeat(7,1fr)", gap:1, marginBottom:1 }}>
                  <div style={{ fontSize:10, color:C.muted, display:"flex", alignItems:"center", paddingRight:8, justifyContent:"flex-end" }}>
                    {hour===0?"12AM":hour<12?hour+"AM":hour===12?"12PM":(hour-12)+"PM"}
                  </div>
                  {days.map(d => {
                    const items = getItems(d.num, hour);
                    return (
                      <div key={d.label} style={{ background:C.card2, border:"1px solid "+C.border, borderRadius:4, minHeight:32, padding:2 }}>
                        {items.map((item, i) => {
                          const meta = PLATFORM_META[item.platform] || { color:C.muted, icon:"📱" };
                          return <div key={i} onClick={() => onSelectItem&&onSelectItem(item.pub_id)} title={item.itemTitle}
                            style={{ background:meta.color+"33", border:"1px solid "+meta.color+"55", borderRadius:3, padding:"2px 5px", fontSize:9, color:meta.color, fontWeight:700, marginBottom:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", cursor:"pointer" }}>
                            {meta.icon} {item.itemTitle.slice(0,16)}
                          </div>;
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const STAT_FILTERS = [
  { key:"all",       label:"Total Posts", icon:"📤", accent:"#a855f7", bg:"#18061a", border:"rgba(168,85,247,0.45)" },
  { key:"scheduled", label:"Scheduled",  icon:"📅", accent:"#3b82f6", bg:"#080e1a", border:"rgba(59,130,246,0.45)"  },
  { key:"draft",     label:"Drafts",     icon:"✏️",  accent:"#eab308", bg:"#16120a", border:"rgba(234,179,8,0.45)"   },
  { key:"published", label:"Published",  icon:"✅", accent:"#22c55e", bg:"#08160e", border:"rgba(34,197,94,0.45)"   },
];

export default function PublishingPage({ publishQueue, setPublishQueue, toast }) {
  const [subpage, setSubpage] = useState("queue");
  const [chatAgent, setChatAgent] = useState(null);
  const [selectedPubId, setSelectedPubId] = useState(null);
  const [filter, setFilter] = useState("all");

  const SUBPAGES = [
    {id:"queue", label:"Queue", icon:"📤"},
    {id:"calendar", label:"Calendar", icon:"📅"},
    {id:"agents", label:"Agents", icon:"🤖"},
  ];

  const markPublished = (pubId, platIdx) => {
    setPublishQueue(q => q.map(item => {
      if (item.pub_id !== pubId) return item;
      return { ...item, platforms: item.platforms.map((p,i) => i===platIdx ? {...p,status:"published"} : p) };
    }));
    toast("✅ Marked published — Ralph Loop tracking", C.green);
  };

  const scheduledCount = publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="scheduled").length,0);
  const publishedCount = publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="published").length,0);
  const draftCount     = publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="draft").length,0);
  const totalPosts     = publishQueue.reduce((a,i)=>a+i.platforms.length,0);

  const statVals = { all:totalPosts, scheduled:scheduledCount, draft:draftCount, published:publishedCount };

  // Filter queue items — keep item if it has at least one platform matching the filter
  const filteredQueue = filter === "all"
    ? publishQueue
    : publishQueue.map(item => ({
        ...item,
        platforms: item.platforms.filter(p => p.status === filter)
      })).filter(item => item.platforms.length > 0);

  return (
    <div style={{ height:"calc(100vh - 112px)", display:"flex", flexDirection:"column" }}>

      {/* Sub-nav */}
      <div style={{ background:C.card, borderBottom:"1px solid "+C.border, padding:"0 24px", display:"flex", gap:2, alignItems:"center", flexShrink:0 }}>
        {SUBPAGES.map(sp => (
          <button key={sp.id} onClick={() => setSubpage(sp.id)} style={{ background:"transparent", border:"none", borderBottom:"2px solid "+(subpage===sp.id?C.blue:"transparent"), color:subpage===sp.id?C.blue:C.muted, padding:"10px 14px", fontSize:12, fontWeight:subpage===sp.id?700:400, cursor:"pointer", display:"flex", gap:5, alignItems:"center" }}>
            <span>{sp.icon}</span><span>{sp.label}</span>
            {sp.id==="queue"&&draftCount>0&&<span style={{ background:C.yellow, color:"#000", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:800 }}>{draftCount}</span>}
          </button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:6, alignItems:"center" }}>
          {PUB_AGENTS.map(a => <AgentButton key={a.id} agent={a} onClick={() => setChatAgent(a)} />)}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        {subpage==="queue" && (
          <div style={{ padding:24 }}>

            {/* Stat filter cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
              {STAT_FILTERS.map(s => {
                const active = filter === s.key;
                return (
                  <div key={s.key} onClick={() => setFilter(active ? "all" : s.key)}
                    style={{ background:s.bg, border:"1px solid "+(active ? s.accent+"99" : s.border), borderRadius:14, padding:16, cursor:"pointer", transition:"border 0.15s", outline: active ? "1px solid "+s.accent+"44" : "none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <div style={{ width:32, height:32, background:s.accent+"20", border:"1px solid "+s.accent+"44", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{s.icon}</div>
                      <div style={{ fontSize:11, fontWeight:700, color: active ? s.accent : C.muted }}>{s.label}</div>
                      {active && <div style={{ marginLeft:"auto", width:8, height:8, borderRadius:4, background:s.accent }} />}
                    </div>
                    <div style={{ borderTop:"1px solid "+s.accent+"18", marginBottom:10 }} />
                    <div style={{ fontSize:26, fontWeight:900, color:s.accent }}>{statVals[s.key]}</div>
                  </div>
                );
              })}
            </div>

            {/* Filter label */}
            {filter !== "all" && (
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ fontSize:12, color:C.muted }}>Filtering by:</div>
                <Chip label={STAT_FILTERS.find(s=>s.key===filter)?.label} color={STAT_FILTERS.find(s=>s.key===filter)?.accent} />
                <button onClick={() => setFilter("all")} style={{ background:"transparent", border:"none", color:C.muted, fontSize:11, cursor:"pointer", textDecoration:"underline" }}>Clear</button>
              </div>
            )}

            {/* Queue */}
            {filteredQueue.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📤</div>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>
                  {filter === "all" ? "Queue is empty" : "No "+filter+" posts"}
                </div>
                <div style={{ fontSize:13, color:C.muted }}>
                  {filter === "all" ? 'Use "Approve + Schedule" in the Approval Queue to add content here' : ""}
                </div>
              </div>
            ) : (
              filteredQueue.map(item => (
                <div key={item.pub_id} style={{ background:C.card2, border:"1px solid "+(selectedPubId===item.pub_id?C.blue+"66":C.border), borderRadius:12, padding:16, marginBottom:12, overflow:"hidden" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, marginBottom:5 }}>{item.title}</div>
                      <div style={{ display:"flex", gap:6 }}>
                        <Chip label={item.type} color={C.purple} sm />
                        <span style={{ fontSize:11, color:C.muted }}>from {item.addedFrom}</span>
                      </div>
                    </div>
                    <div style={{ fontSize:11, color:C.muted }}>{item.platforms.filter(p=>p.status==="published").length}/{item.platforms.length} published</div>
                  </div>
                  {item.platforms.map((p, pi) => {
                    const meta = PLATFORM_META[p.platform] || { icon:"📱", label:p.platform, color:C.muted };
                    return (
                      <div key={pi} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:meta.color+"0d", border:"1px solid "+meta.color+"44", borderRadius:8, marginBottom:6 }}>
                        <div style={{ width:28, textAlign:"center", fontSize:15 }}>{meta.icon}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:meta.color, marginBottom:2 }}>{meta.label}</div>
                          <div style={{ fontSize:11, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.hook||p.caption||"No copy set"}</div>
                        </div>
                        <div style={{ flexShrink:0 }}>
                          {p.scheduledTime
                            ? <div style={{ fontSize:10, color:C.blue, fontWeight:600 }}>{new Date(p.scheduledTime).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</div>
                            : <span style={{ fontSize:10, color:C.muted }}>Not scheduled</span>}
                        </div>
                        <div style={{ flexShrink:0 }}>
                          {p.status==="published"
                            ? <Chip label="✅ Published" color={C.green} sm />
                            : p.status==="scheduled"
                              ? <button onClick={() => markPublished(item.pub_id,pi)} style={{ background:C.green+"22", border:"1px solid "+C.green+"44", borderRadius:6, padding:"3px 10px", color:C.green, fontSize:11, fontWeight:700, cursor:"pointer" }}>Mark Published</button>
                              : <Chip label="Draft" color={C.muted} sm />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}

        {subpage==="calendar" && (
          <div style={{ padding:24 }}>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:17, fontWeight:800, marginBottom:4 }}>Publishing Calendar</div>
              <div style={{ fontSize:13, color:C.muted }}>Week of March 10–16, 2026</div>
            </div>
            <Card style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap" }}>
                {Object.entries(PLATFORM_META).map(([k,v]) => (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:v.color }} />
                    <span style={{ fontSize:11, color:C.muted }}>{v.label}</span>
                  </div>
                ))}
                <div style={{ marginLeft:"auto", fontSize:11, color:C.blue, fontWeight:700 }}>{scheduledCount} posts scheduled this week</div>
              </div>
              <CalendarView queue={publishQueue} onSelectItem={id => setSelectedPubId(id===selectedPubId?null:id)} />
            </Card>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {Object.entries(PLATFORM_META).map(([k,v]) => (
                <Card key={k}>
                  <div style={{ fontSize:12, fontWeight:700, color:v.color, marginBottom:8 }}>{v.icon} {v.label}</div>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:6 }}>BEST TIMES</div>
                  {v.bestTimes.map((t,i) => <div key={i} style={{ fontSize:12, marginBottom:3 }}>· {t}</div>)}
                  <div style={{ marginTop:8, fontSize:10, color:C.muted }}>{v.notes}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {subpage==="agents" && (
          <div style={{ padding:24 }}>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:800, marginBottom:4 }}>Publishing Agents</div>
              <div style={{ fontSize:13, color:C.muted }}>The last mile — scheduling to analytics.</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
              {PUB_AGENTS.map(a => (
                <div key={a.id} onClick={() => setChatAgent(a)} style={{ background:C.card2, border:"1px solid "+C.border, borderRadius:12, padding:18, cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <div style={{ width:36, height:36, background:a.color+"22", border:"1px solid "+a.color+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{a.icon}</div>
                    <div><div style={{ fontSize:13, fontWeight:700 }}>{a.name}</div><div style={{ fontSize:11, color:a.color }}>{a.role}</div></div>
                  </div>
                  <button style={{ width:"100%", background:a.color+"15", border:"1px solid "+a.color+"33", borderRadius:7, padding:"8px 0", color:a.color, fontSize:12, fontWeight:700, cursor:"pointer" }}>Open Session →</button>
                </div>
              ))}
            </div>
            <Card style={{ marginTop:20 }}>
              <Sect>Publishing SLA — Targets</Sect>
              {[
                {metric:"Approval to Queue",    target:"<5 min",  note:"Approve + Schedule is instant"},
                {metric:"Queue to Scheduled",   target:"<30 min", note:"Scheduling Agent recommends time"},
                {metric:"Approval to Publish",  target:"<2 hrs",  note:"Currently 4.2 hrs — gap to close"},
                {metric:"Stream to Published",  target:"<48 hrs", note:"Currently 3.2 days — primary target"},
              ].map((s,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<3?"1px solid "+C.border:"none" }}>
                  <div><div style={{ fontSize:12, fontWeight:600 }}>{s.metric}</div><div style={{ fontSize:10, color:C.muted }}>{s.note}</div></div>
                  <Chip label={s.target} color={C.blue} sm />
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
