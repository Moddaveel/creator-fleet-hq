import { useState } from "react";
import { C, ALERTS } from "../constants";
import { EO_AGENTS, BS_AGENTS, CS_AGENTS, MONO_AGENTS, PUB_AGENTS } from "../data/agents";
import AgentChat from "../components/AgentChat";
import Sect from "../components/Sect";

const RALPH_LOOP = {
  status: "open",
  lastSignal: "Mar 11, 2026 9:42 PM",
  signalType: "overperformer",
  activeSignals: 3,
  lastContent: "Discovery Clip — Reaction format 2x avg",
};

const ALERT_STYLE = {
  warning: { icon:"⚠️", color:"#eab308", bg:"rgba(234,179,8,0.1)",  border:"rgba(234,179,8,0.35)"  },
  success: { icon:"✅", color:"#22c55e", bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.35)"  },
  info:    { icon:"ℹ️",  color:"#3b82f6", bg:"rgba(59,130,246,0.1)", border:"rgba(59,130,246,0.35)" },
};

const AGENT_META = {
  cosa:     { bg:"#18061a", border:"rgba(168,85,247,0.45)" },
  briefing: { bg:"#16120a", border:"rgba(234,179,8,0.45)"  },
  router:   { bg:"#061614", border:"rgba(20,184,166,0.45)" },
  kpi:      { bg:"#08160e", border:"rgba(34,197,94,0.45)"  },
};

const ALL_DEPARTMENTS = [
  { id:"executive",    label:"The Collective", icon:"⚡", color:"#a855f7", nav:"executive",    description:"The executive brain — routes tasks, tracks KPIs, generates briefings, and acts as the primary creator interface.", agents:EO_AGENTS },
  { id:"brand",        label:"Brand Strategy", icon:"🎯", color:"#d946ef", nav:"brand",        description:"Maintains doctrine, voice, positioning, and brand QA across all content.", agents:BS_AGENTS },
  { id:"studio",       label:"Content Studio", icon:"🎬", color:"#a855f7", nav:"studio",       description:"Produces and packages clips — from VOD ingestion to platform-ready bundles.", agents:CS_AGENTS },
  { id:"monetization", label:"Monetization",   icon:"💰", color:"#22c55e", nav:"monetization", description:"Manages the full deal pipeline from prospecting to sponsorship packages and outreach.", agents:MONO_AGENTS },
  { id:"publishing",   label:"Publishing",     icon:"🚀", color:"#3b82f6", nav:"publishing",   description:"The last mile — scheduling, formatting, copy optimisation, and performance tracking.", agents:PUB_AGENTS },
];

function RalphLoopStatus() {
  const isOpen = RALPH_LOOP.status === "open";
  const accent = isOpen ? C.neon : C.green;
  return (
    <div style={{ marginBottom:20, background:isOpen?"rgba(217,70,239,0.08)":"rgba(34,197,94,0.08)", border:"2px solid "+(isOpen?"rgba(217,70,239,0.5)":"rgba(34,197,94,0.5)"), borderRadius:14, padding:18 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <div style={{ width:38, height:38, background:"rgba(217,70,239,0.2)", border:"1px solid rgba(217,70,239,0.44)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>♻️</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:800, color:C.neon }}>Ralph Loop</div>
          <div style={{ fontSize:11, color:C.muted }}>Performance signal chain — Studio to Publish to Analytics to Studio</div>
        </div>
        <div style={{ background:accent+"22", border:"1px solid "+accent+"55", borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:800, color:accent }}>
          {isOpen ? "Signal Open" : "Loop Closed"}
        </div>
      </div>
      <div style={{ borderTop:"1px solid rgba(217,70,239,0.15)", paddingTop:12, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        <div style={{ background:"rgba(217,70,239,0.08)", border:"1px solid rgba(217,70,239,0.2)", borderRadius:9, padding:"10px 14px" }}>
          <div style={{ fontSize:10, color:C.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>Active Signals</div>
          <div style={{ fontSize:22, fontWeight:900, color:C.neon }}>{RALPH_LOOP.activeSignals}</div>
        </div>
        <div style={{ background:"rgba(217,70,239,0.08)", border:"1px solid rgba(217,70,239,0.2)", borderRadius:9, padding:"10px 14px" }}>
          <div style={{ fontSize:10, color:C.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>Signal Type</div>
          <div style={{ fontSize:12, fontWeight:700, color:RALPH_LOOP.signalType==="overperformer"?C.green:C.red, marginTop:4 }}>
            {RALPH_LOOP.signalType==="overperformer" ? "Overperformer" : "Underperformer"}
          </div>
        </div>
        <div style={{ background:"rgba(217,70,239,0.08)", border:"1px solid rgba(217,70,239,0.2)", borderRadius:9, padding:"10px 14px" }}>
          <div style={{ fontSize:10, color:C.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>Last Signal</div>
          <div style={{ fontSize:11, fontWeight:600, color:C.text, marginTop:4 }}>{RALPH_LOOP.lastSignal}</div>
        </div>
      </div>
      <div style={{ marginTop:10, padding:"8px 12px", background:"rgba(217,70,239,0.06)", border:"1px solid rgba(217,70,239,0.15)", borderRadius:8, fontSize:11, color:C.muted }}>
        <span style={{ color:C.neon, fontWeight:700 }}>Latest: </span>{RALPH_LOOP.lastContent}
      </div>
    </div>
  );
}

export default function ExecutiveOfficePage({ approvals, navigateTo }) {
  const [chatAgent, setChatAgent]       = useState(null);
  const [alertsOpen, setAlertsOpen]     = useState(true);
  const [rosterOpen, setRosterOpen]     = useState(false);
  const [expandedDepts, setExpandedDepts] = useState(new Set());
  const urgentN = approvals.filter(a => a.priority === "urgent").length;
  const totalAgents = ALL_DEPARTMENTS.reduce((a,d) => a + d.agents.length, 0);

  const toggleDept = id => setExpandedDepts(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const statCards = [
    { label:"Agents",        val:totalAgents,      color:C.purple, bg:"#18061a", border:"rgba(168,85,247,0.45)", icon:"🤖", onClick:() => setRosterOpen(o=>!o) },
    { label:"Approvals",     val:approvals.length, color:C.yellow, bg:"#16120a", border:"rgba(234,179,8,0.45)",  icon:"✅", onClick:() => navigateTo("approvals") },
    { label:"Urgent",        val:urgentN,          color:C.red,    bg:"#1a0808", border:"rgba(239,68,68,0.45)",  icon:"🔴", onClick:() => navigateTo("approvals") },
    { label:"Ralph Signals", val:"8",              color:C.neon,   bg:"#1a0618", border:"rgba(217,70,239,0.45)", icon:"♻️", onClick:() => navigateTo("studio") },
  ];

  return (
    <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>

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
            Online — Publishing Layer Active
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div style={{ marginBottom:16 }}>
        <button onClick={() => setAlertsOpen(o => !o)}
          style={{ width:"100%", background:C.card, border:"1px solid "+C.border, borderRadius:alertsOpen?"12px 12px 0 0":12, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", color:C.text }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, background:C.yellow+"22", border:"1px solid "+C.yellow+"44", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🔔</div>
            <span style={{ fontSize:13, fontWeight:700 }}>System Alerts</span>
            <div style={{ background:C.yellow, color:"#000", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:800 }}>{ALERTS.length}</div>
          </div>
          <span style={{ fontSize:12, color:C.muted }}>{alertsOpen?"▲ Collapse":"▼ Expand"}</span>
        </button>
        {alertsOpen && (
          <div style={{ background:C.card, border:"1px solid "+C.border, borderTop:"none", borderRadius:"0 0 12px 12px", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            {ALERTS.map((a,i) => {
              const s = ALERT_STYLE[a.type]||ALERT_STYLE.info;
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

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {statCards.map((s,i) => (
          <div key={i} onClick={s.onClick}
            style={{ background:s.bg, border:"1px solid "+s.border, borderRadius:14, padding:18, cursor:"pointer", transition:"all 0.15s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:34, height:34, background:s.color+"20", border:"1px solid "+s.color+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
              <div style={{ fontSize:11, fontWeight:700, color:s.color }}>{s.label}</div>
              <span style={{ marginLeft:"auto", fontSize:10, color:s.color }}>→</span>
            </div>
            <div style={{ borderTop:"1px solid "+s.color+"18", marginBottom:10 }} />
            <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:s.color, marginTop:6, opacity:0.7 }}>
              {s.label==="Agents"?"View full roster →"
               :s.label==="Urgent"?(urgentN>0?"View urgent approvals →":"All clear")
               :s.label==="Ralph Signals"?"View Content Studio →"
               :"Go to "+s.label.toLowerCase()+" →"}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Roster */}
      {rosterOpen && (
        <div style={{ marginBottom:20, background:C.card, border:"1px solid "+C.border, borderRadius:14, overflow:"hidden" }}>
          <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid "+C.border }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, background:C.purple+"20", border:"1px solid "+C.purple+"44", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🤖</div>
              <div>
                <div style={{ fontSize:14, fontWeight:800 }}>Full Agent Roster</div>
                <div style={{ fontSize:11, color:C.muted }}>{totalAgents} active agents across {ALL_DEPARTMENTS.length} departments</div>
              </div>
            </div>
            <button onClick={() => setRosterOpen(false)} style={{ background:"transparent", border:"1px solid "+C.border, borderRadius:7, padding:"4px 12px", color:C.muted, fontSize:11, cursor:"pointer" }}>Close</button>
          </div>
          {ALL_DEPARTMENTS.map(dept => {
            const isOpen = expandedDepts.has(dept.id);
            return (
              <div key={dept.id} style={{ borderBottom:"1px solid "+C.border }}>
                <div onClick={() => toggleDept(dept.id)}
                  style={{ padding:"12px 20px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", background:isOpen?dept.color+"08":"transparent" }}>
                  <div style={{ width:36, height:36, background:dept.color+"20", border:"1px solid "+dept.color+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{dept.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:dept.color }}>{dept.label}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{dept.description}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ background:dept.color+"20", border:"1px solid "+dept.color+"33", borderRadius:8, padding:"2px 10px", fontSize:11, fontWeight:700, color:dept.color }}>{dept.agents.length} agents</div>
                    <button onClick={e=>{e.stopPropagation();navigateTo(dept.nav);}} style={{ background:dept.color+"15", border:"1px solid "+dept.color+"33", borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:700, color:dept.color, cursor:"pointer" }}>Go</button>
                    <span style={{ fontSize:12, color:C.muted }}>{isOpen?"▲":"▼"}</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding:"0 20px 14px 20px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:8 }}>
                    {dept.agents.map(a => (
                      <div key={a.id} onClick={() => setChatAgent(a)}
                        style={{ background:a.color+"0d", border:"1px solid "+a.color+"33", borderRadius:10, padding:"12px 14px", cursor:"pointer", display:"flex", gap:12, alignItems:"flex-start" }}>
                        <div style={{ width:38, height:38, background:a.color+"20", border:"1px solid "+a.color+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{a.icon}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:800, color:a.color, marginBottom:3 }}>{a.name}</div>
                          <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{a.role}</div>
                          <div style={{ marginTop:6, fontSize:10, color:a.color, opacity:0.8 }}>Lives in: {dept.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ralph Loop */}
      <RalphLoopStatus />

      {/* Command Staff heading */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <div style={{ background:"linear-gradient(135deg,"+C.purple+"33,"+C.neon+"22)", border:"1px solid "+C.purple+"44", borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:800, color:C.purple }}>
          🧠 Command Staff
        </div>
        <div style={{ fontSize:12, color:C.muted }}>Direct executive agents — your primary interface</div>
      </div>

      {/* EO Agent cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {EO_AGENTS.map(a => {
          const meta = AGENT_META[a.id] || { bg:C.card2, border:C.border };
          return (
            <div key={a.id} onClick={() => setChatAgent(a)}
              style={{ background:meta.bg, border:"1px solid "+meta.border, borderRadius:16, padding:22, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:12 }}>
              <div style={{ width:72, height:72, background:a.color+"20", border:"2px solid "+a.color+"55", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34 }}>{a.icon}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:a.color, marginBottom:4 }}>{a.name}</div>
                <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{a.role}</div>
              </div>
              <div style={{ borderTop:"1px solid "+a.color+"18", width:"100%", paddingTop:12 }}>
                <button style={{ width:"100%", background:a.color+"15", border:"1px solid "+a.color+"33", borderRadius:8, padding:"8px 0", color:a.color, fontSize:12, fontWeight:700, cursor:"pointer" }}>Open Session →</button>
              </div>
            </div>
          );
        })}
      </div>

      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
