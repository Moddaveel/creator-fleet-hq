import { useState } from "react";
import { C, pColor, pIcon, dColor } from "../constants";
import Chip from "../components/Chip";
import Countdown from "../components/Countdown";
import RejectModal from "../components/RejectModal";
import ApproveScheduleModal from "../components/ApproveScheduleModal";

export default function ApprovalsPage({ items, setItems, toast, onApproveAndSchedule }) {
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [schedTarget, setSchedTarget] = useState(null);
  const [log, setLog] = useState([]);

  const addLog = e => setLog(l => [{ ...e, ts: new Date().toLocaleTimeString() }, ...l]);

  const approve = id => {
    const item = items.find(x => x.id === id);
    setItems(i => i.filter(x => x.id !== id));
    toast("✓ \"" + item.title + "\" approved — Ralph Loop recorded", C.green);
    addLog({ action:"APPROVED", title:item.title, note:"No schedule set" });
  };

  const reject = (id, reason) => {
    const item = items.find(x => x.id === id);
    setItems(i => i.filter(x => x.id !== id));
    setRejectTarget(null);
    toast("✕ \"" + item.title + "\" rejected — " + reason.slice(0,40), C.red);
    addLog({ action:"REJECTED", title:item.title, note:reason });
  };

  const handleApproveSchedule = (item, platforms) => {
    setItems(i => i.filter(x => x.id !== item.id));
    setSchedTarget(null);
    onApproveAndSchedule(item, platforms);
    addLog({ action:"APPROVED+SCHEDULED", title:item.title, note:platforms.filter(p=>p.scheduledTime).length+" platforms scheduled" });
    toast("✓ \"" + item.title + "\" approved + queued to Publishing", C.blue);
  };

  const publishable = item => ["Clip Bundle","YouTube Upload"].includes(item.type);
  const filtered = items.filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:"flex", height:"calc(100vh - 112px)" }}>
      <div style={{ width:200, background:C.card, borderRight:"1px solid "+C.border, padding:16, flexShrink:0, overflowY:"auto" }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.muted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>Queue Stats</div>
        {["urgent","high","normal","low"].map(p => {
          const n = items.filter(i => i.priority === p).length;
          if (!n) return null;
          return <div key={p} style={{ display:"flex", justifyContent:"space-between", padding:"6px 10px", borderRadius:8, marginBottom:4, background:C.card2 }}>
            <span style={{ fontSize:12, color:pColor(p) }}>{pIcon(p)+" "+p}</span>
            <span style={{ fontSize:12, fontWeight:700, color:pColor(p) }}>{n}</span>
          </div>;
        })}
        <div style={{ marginTop:16, fontSize:10, fontWeight:700, color:C.muted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>Decision Log</div>
        {log.slice(0,6).map((l, i) => (
          <div key={i} style={{ marginBottom:6, padding:7, background:C.bg, borderRadius:7, border:"1px solid "+C.border }}>
            <div style={{ fontSize:10, fontWeight:700, color:l.action.includes("APPROVED")?C.green:C.red }}>{l.action}</div>
            <div style={{ fontSize:10, color:C.text }}>{l.title.slice(0,28)}</div>
            <div style={{ fontSize:9, color:C.muted }}>{l.ts}</div>
          </div>
        ))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:24 }}>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:17, fontWeight:800, marginBottom:4 }}>Approval Queue</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{items.length+" pending · Publishable items have Approve + Schedule"}</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ width:"100%", background:C.card, border:"1px solid "+C.border, borderRadius:9, padding:"9px 14px", color:C.text, fontSize:13, boxSizing:"border-box", outline:"none" }} />
        </div>
        {filtered.length === 0 && <div style={{ textAlign:"center", padding:"60px 0" }}><div style={{ fontSize:36, marginBottom:12 }}>✅</div><div style={{ fontSize:15, fontWeight:700 }}>Queue is clear</div></div>}
        {["urgent","high","normal","low"].map(p => {
          const grp = filtered.filter(x => x.priority === p);
          if (!grp.length) return null;
          const labels = { urgent:"🔴 Urgent", high:"🟠 High Priority", normal:"🟣 Normal", low:"⚪ Low" };
          return (
            <div key={p} style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, fontWeight:700, color:pColor(p), letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{labels[p]+" ("+grp.length+")"}</div>
              {grp.map(item => (
                <div key={item.id} style={{ background:C.card2, border:"1px solid "+C.border, borderRadius:12, padding:16, marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ flex:1, marginRight:12 }}>
                      <div style={{ fontSize:14, fontWeight:700, marginBottom:5 }}>{item.title}</div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                        <Chip label={item.dept} color={dColor(item.dept)} sm />
                        <Chip label={item.type} color={C.muted} sm />
                      </div>
                    </div>
                    <Countdown ts={item.deadlineTs} />
                  </div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:12, lineHeight:1.5 }}>{item.summary.slice(0,110)}...</div>
                  <div style={{ display:"flex", gap:8 }}>
                    {publishable(item) ? (
                      <>
                        <button onClick={() => setSchedTarget(item)} style={{ flex:2, background:"linear-gradient(135deg,"+C.green+"33,"+C.blue+"22)", border:"1px solid "+C.green+"44", borderRadius:8, padding:"9px 0", color:"#fff", fontSize:12, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                          <span>✓</span><span>Approve + Schedule</span><span style={{ fontSize:10, background:C.blue+"44", borderRadius:4, padding:"1px 5px" }}>📅</span>
                        </button>
                        <button onClick={() => approve(item.id)} style={{ flex:1, background:C.green+"11", border:"1px solid "+C.green+"22", borderRadius:8, padding:"9px 0", color:C.green, fontSize:11, fontWeight:700, cursor:"pointer" }}>✓ Approve only</button>
                        <button onClick={() => setRejectTarget(item)} style={{ flex:1, background:C.red+"11", border:"1px solid "+C.red+"22", borderRadius:8, padding:"9px 0", color:C.red, fontSize:11, fontWeight:700, cursor:"pointer" }}>✕ Reject</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => approve(item.id)} style={{ flex:1, background:C.green+"15", border:"1px solid "+C.green+"33", borderRadius:8, padding:"9px 0", color:C.green, fontSize:12, fontWeight:700, cursor:"pointer" }}>✓ Approve</button>
                        <button onClick={() => setRejectTarget(item)} style={{ flex:1, background:C.red+"11", border:"1px solid "+C.red+"22", borderRadius:8, padding:"9px 0", color:C.red, fontSize:12, fontWeight:700, cursor:"pointer" }}>✕ Reject</button>
                      </>
                    )}
                  </div>
                  {publishable(item) && (
                    <div style={{ marginTop:8, display:"flex", gap:5, alignItems:"center" }}>
                      <div style={{ width:6, height:6, borderRadius:3, background:C.blue }} />
                      <span style={{ fontSize:10, color:C.blue }}>Publishable — Approve + Schedule sends directly to Publishing Queue</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {schedTarget && <ApproveScheduleModal item={schedTarget} onConfirm={platforms => handleApproveSchedule(schedTarget, platforms)} onCancel={() => setSchedTarget(null)} />}
      {rejectTarget && <RejectModal item={rejectTarget} onConfirm={r => reject(rejectTarget.id, r)} onCancel={() => setRejectTarget(null)} />}
    </div>
  );
}
