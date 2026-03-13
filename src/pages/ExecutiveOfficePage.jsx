import { useState } from "react";
import { C, ALERTS } from "../constants";
import { EO_AGENTS } from "../data/agents";
import Card from "../components/Card";
import Sect from "../components/Sect";
import AgentChat from "../components/AgentChat";

const ALERT_STYLE = {
  warning: { icon:"⚠️", color:"#eab308", bg:"rgba(234,179,8,0.1)",   border:"rgba(234,179,8,0.35)"   },
  success: { icon:"✅", color:"#22c55e", bg:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.35)"   },
  info:    { icon:"ℹ️",  color:"#3b82f6", bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.35)"  },
};

const AGENT_META = {
  cosa:     { bg:"#18061a", border:"rgba(168,85,247,0.45)",  emoji:"⚡", size:52 },
  briefing: { bg:"#16120a", border:"rgba(234,179,8,0.45)",   emoji:"📋", size:52 },
  router:   { bg:"#061614", border:"rgba(20,184,166,0.45)",  emoji:"🔀", size:52 },
  kpi:      { bg:"#08160e", border:"rgba(34,197,94,0.45)",   emoji:"📈", size:52 },
};

export default function ExecutiveOfficePage({ approvals, navigateTo }) {
  const [chatAgent, setChatAgent]   = useState(null);
  const [alertsOpen, setAlertsOpen] = useState(true);
  const urgentN = approvals.filter(a => a.priority === "urgent").length;

  const statCards = [
    { label:"Agents",        val:"26",                  color:C.purple, bg:"#18061a", border:"rgba(168,85,247,0.45)", icon:"🤖", onClick: null },
    { label:"Approvals",     val:approvals.length,      color:C.yellow, bg:"#16120a", border:"rgba(234,179,8,0.45)",  icon:"✅", onClick: () => navigateTo("approvals") },
    { label:"Urgent",        val:urgentN,               color:C.red,    bg:"#1a0808", border:"rgba(239,68,68,0.45)",  icon:"🔴", onClick: () => navigateTo("approvals") },
    { label:"Ralph Signals", val:"8",                   color:C.neon,   bg:"#1a0618", border:"rgba(217,70,239,0.45)", icon:"♻️", onClick: () => navigateTo("studio") },
  ];

  return (
    <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>

      {/* ── Page header pill ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:"linear-gradient(135deg,"+C.purple+","+C.neon+")", borderRadius:14, padding:"10px 20px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>⚡</span>
            <div>
              <div style={{ fontSize:16, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>The Collective</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>Executive Operations Layer</div>
            </div>
          </div>
          <div style={{ background:C.green+"22", border:"1px solid "+C.green+"44", borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, color:C.green }}>
            ● Online — Publishing Layer Active
          </div>
        </div>
      </div>

      {/* ── System Alerts collapsible pill ── */}
      <div style={{ marginBottom:20 }}>
        <button onClick={() => setAlertsOpen(o => !o)}
          style={{ width:"100%", background:C.card, border:"1px solid "+C.border, borderRadius: alertsOpen ? "12px 12px 0 0" : 12, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", color:C.text }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, background:C.yellow+"22", border:"1px solid "+C.yellow+"44", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🔔</div>
            <span style={{ fontSize:13, fontWeight:700 }}>System Alerts</span>
            <div style={{ background:C.yellow, color:"#000", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:800 }}>{ALERTS.length}</div>
          </div>
          <span style={{ fontSize:12, color:C.muted }}>{alertsOpen ? "▲ Collapse" : "▼ Expand"}</span>
        </button>
        {alertsOpen && (
          <div style={{ background:C.card, border:"1px solid "+C.border, borderTop:"none", borderRadius:"0 0 12px 12px", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            {ALERTS.map((a, i) => {
              const s = ALERT_STYLE[a.type] || ALERT_STYLE.info;
              return (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, background:s.bg, border:"1px solid "+s.border, borderRadius:9, padding:"10px 14px" }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{s.icon}</span>
                  <span style={{ fontSize:12, color:C.text, lineHeight:1.5 }}>{a.msg}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Stat cards — clickable ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {statCards.map((s, i) => (
          <div key={i} onClick={s.onClick || undefined}
            style={{ background:s.bg, border:"1px solid "+s.border, borderRadius:14, padding:18, cursor:s.onClick?"pointer":"default", transition:"all 0.15s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:34, height:34, background:s.color+"20", border:"1px solid "+s.color+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
              <div style={{ fontSize:11, fontWeight:700, color:s.color }}>{s.label}</div>
              {s.onClick && <span style={{ marginLeft:"auto", fontSize:10, color:s.color }}>→</span>}
            </div>
            <div style={{ borderTop:"1px solid "+s.color+"18", marginBottom:10 }} />
            <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.val}</div>
            {s.onClick && (
              <div style={{ fontSize:10, color:s.color, marginTop:6, opacity:0.7 }}>
                {s.label === "Urgent" ? urgentN > 0 ? "View urgent approvals →" : "All clear" : "Go to "+s.label.toLowerCase()+" →"}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Agent cards ── */}
      <Sect>The Collective — Agents</Sect>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginTop:14 }}>
        {EO_AGENTS.map(a => {
          const meta = AGENT_META[a.id] || { bg:C.card2, border:C.border, emoji:a.icon, size:52 };
          return (
            <div key={a.id} onClick={() => setChatAgent(a)}
              style={{ background:meta.bg, border:"1px solid "+meta.border, borderRadius:16, padding:22, cursor:"pointer", transition:"all 0.15s", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:12 }}>
              {/* Large agent icon */}
              <div style={{ width:72, height:72, background:a.color+"20", border:"2px solid "+a.color+"55", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34 }}>
                {a.icon}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:a.color, marginBottom:4 }}>{a.name}</div>
                <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{a.role}</div>
              </div>
              <div style={{ borderTop:"1px solid "+a.color+"18", width:"100%", paddingTop:12 }}>
                <button style={{ width:"100%", background:a.color+"15", border:"1px solid "+a.color+"33", borderRadius:8, padding:"8px 0", color:a.color, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  Open Session →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
