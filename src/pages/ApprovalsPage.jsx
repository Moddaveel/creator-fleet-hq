import { useState } from "react";
import { APPROVAL_AGENTS } from "../data/agents";
import AgentButton from "../components/AgentButton";
import AgentChat from "../components/AgentChat";
import { C, pColor, pIcon, dColor } from "../constants";
import Chip from "../components/Chip";
import Countdown from "../components/Countdown";
import RejectModal from "../components/RejectModal";
import ApproveScheduleModal from "../components/ApproveScheduleModal";

const pBg  = p => ({urgent:'#1a0808', high:'#160d04', normal:'#120818', low:'#0e0e12'}[p] || '#12121a');
const pBorder = p => ({urgent:'rgba(239,68,68,0.35)', high:'rgba(249,115,22,0.35)', normal:'rgba(168,85,247,0.35)', low:'rgba(100,116,139,0.2)'}[p] || C.border);

export default function ApprovalsPage({ items, setItems, toast, onApproveAndSchedule }) {
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [schedTarget, setSchedTarget] = useState(null);
  const [log, setLog] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [chatAgent, setChatAgent] = useState(null);

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

  const btnStyle = (active, color) => ({
    background: active ? color+"22" : "transparent",
    border: "1px solid " + (active ? color+"66" : "rgba(255,255,255,0.1)"),
    borderRadius: 8,
    padding: "5px 12px",
    color: active ? color : C.muted,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  });

  return (
    <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>

      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <div>
          <div style={{ fontSize:17, fontWeight:800 }}>Approval Queue</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{items.length+" pending · Publishable items have Approve + Schedule"}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={btnStyle(showStats, C.purple)} onClick={() => setShowStats(s => !s)}>
            <span>📊</span><span>Queue Stats</span><span style={{ fontSize:10, color:C.muted }}>{showStats ? "▲" : "▼"}</span>
          </button>
          <button style={btnStyle(showLog, C.blue)} onClick={() => setShowLog(s => !s)}>
            <span>📋</span><span>Decision Log</span>
            {log.length > 0 && <span style={{ background:C.blue, color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:800 }}>{log.length}</span>}
            <span style={{ fontSize:10, color:C.muted }}>{showLog ? "▲" : "▼"}</span>
          </button>
        </div>
      </div>

      {/* Queue Stats panel */}
      {showStats && (
        <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:12, padding:16, marginBottom:12, display:"flex", gap:12, flexWrap:"wrap" }}>
          {["urgent","high","normal","low"].map(p => {
            const n = items.filter(i => i.priority === p).length;
            if (!n) return null;
            return (
              <div key={p} style={{ display:"flex", alignItems:"center", gap:8, background:C.card2, border:"1px solid "+pColor(p)+"33", borderRadius:9, padding:"7px 14px" }}>
                <span style={{ fontSize:13 }}>{pIcon(p)}</span>
                <span style={{ fontSize:12, color:pColor(p), textTransform:"capitalize", fontWeight:600 }}>{p}</span>
                <span style={{ fontSize:14, fontWeight:800, color:pColor(p) }}>{n}</span>
              </div>
            );
          })}
          {items.length === 0 && <span style={{ fontSize:12, color:C.muted }}>Queue is clear</span>}
        </div>
      )}

      {/* Decision Log panel */}
      {showLog && (
        <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:12, padding:16, marginBottom:12 }}>
          {log.length === 0 && <div style={{ fontSize:12, color:C.muted }}>No decisions yet this session.</div>}
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {log.slice(0,8).map((l, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:C.card2, border:"1px solid "+C.border, borderRadius:8, padding:"8px 12px" }}>
                <span style={{ fontSize:11, fontWeight:800, color:l.action.includes("APPROVED")?C.green:C.red, minWidth:140 }}>{l.action}</span>
                <span style={{ fontSize:12, color:C.text, flex:1 }}>{l.title}</span>
                <span style={{ fontSize:11, color:C.muted }}>{l.note}</span>
                <span style={{ fontSize:10, color:C.muted, flexShrink:0 }}>{l.ts}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..."
        style={{ width:"100%", background:C.card, border:"1px solid "+C.border, borderRadius:9, padding:"9px 14px", color:C.text, fontSize:13, boxSizing:"border-box", outline:"none", marginBottom:20 }}
      />

      {/* Queue */}
      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 0" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>✅</div>
          <div style={{ fontSize:15, fontWeight:700 }}>Queue is clear</div>
        </div>
      )}

      {["urgent","high","normal","low"].map(p => {
        const grp = filtered.filter(x => x.priority === p);
        if (!grp.length) return null;
        const labels = { urgent:"🔴 Urgent", high:"🟠 High Priority", normal:"🟣 Normal", low:"⚪ Low" };
        return (
          <div key={p} style={{ marginBottom:24, border:"2px solid "+pColor(p)+"99", borderRadius:14, padding:16, background:pColor(p)+"12" }}>
            <div style={{ fontSize:11, fontWeight:700, color:pColor(p), letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}><div style={{ flex:1 }}>{labels[p]+" ("+grp.length+")"}</div><div style={{ height:1, background:pColor(p)+"33", flex:20 }} /></div>
            {grp.map(item => (
              <div key={item.id} style={{ background:pBg(p), border:"1px solid "+pBorder(p), borderRadius:12, padding:16, marginBottom:10 }}>
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

            {/* Agent section — bottom */}
      <div style={{ marginTop:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.35)", borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:800, color:"#a855f7" }}>Approval Agents</div>
          <div style={{ fontSize:12, color:"#64748b" }}>Hover to hear from them — click to open a session</div>
        </div>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", padding:"24px", background:"#12121a", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16 }}>
          {APPROVAL_AGENTS.map(a => (
            <AgentButton key={a.id} agent={a} onClick={() => setChatAgent(a)} large />
          ))}
        </div>
      </div>

      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
      {schedTarget && <ApproveScheduleModal item={schedTarget} onConfirm={platforms => handleApproveSchedule(schedTarget, platforms)} onCancel={() => setSchedTarget(null)} />}
      {rejectTarget && <RejectModal item={rejectTarget} onConfirm={r => reject(rejectTarget.id, r)} onCancel={() => setRejectTarget(null)} />}
    </div>
  );
}
