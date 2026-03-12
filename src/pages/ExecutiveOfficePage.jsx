import { useState } from "react";
import { C, ALERTS } from "../constants";
import { EO_AGENTS } from "../data/agents";
import Card from "../components/Card";
import Sect from "../components/Sect";
import AgentChat from "../components/AgentChat";

export default function ExecutiveOfficePage({ approvals }) {
  const [chatAgent, setChatAgent] = useState(null);
  return (
    <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, marginBottom:20 }}>
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:"1px solid "+C.border }}>
            <div style={{ width:40, height:40, background:"linear-gradient(135deg,"+C.purple+","+C.neon+")", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>⚡</div>
            <div><div style={{ fontWeight:800, fontSize:16 }}>Executive Office</div><div style={{ fontSize:11, color:C.green }}>● Online — Publishing Layer Active</div></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {EO_AGENTS.map(a => (
              <div key={a.id} onClick={() => setChatAgent(a)} style={{ background:a.color+"11", border:"1px solid "+a.color+"33", borderRadius:10, padding:12, cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{a.icon}</span>
                <div><div style={{ fontSize:12, fontWeight:700, color:a.color }}>{a.name}</div><div style={{ fontSize:10, color:C.muted }}>{a.role}</div></div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card>
            <Sect>System Alerts</Sect>
            {ALERTS.map((a, i) => (
              <div key={i} style={{ display:"flex", flexWrap:"wrap", gap:8, padding:"7px 0", borderBottom:i<ALERTS.length-1?"1px solid "+C.border:"none" }}>
                <span>{a.type==="warning"?"⚠️":a.type==="success"?"✅":"ℹ️"}</span>
                <span style={{ fontSize:12 }}>{a.msg}</span>
              </div>
            ))}
          </Card>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[{label:"Agents",val:"26",color:C.purple},{label:"Approvals",val:approvals.length,color:C.yellow},{label:"Urgent",val:approvals.filter(a=>a.priority==="urgent").length,color:C.red},{label:"Ralph Signals",val:8,color:C.neon}].map((s,i) => (
              <div key={i} style={{ background:C.card, border:"1px solid "+C.border, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:10, color:C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
