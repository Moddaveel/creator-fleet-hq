import { useState } from "react";
import { C, momentColor } from "../constants";
import { CS_AGENTS } from "../data/agents";
import Chip from "../components/Chip";
import AgentChat from "../components/AgentChat";

export default function ContentStudioPage({ clips, setClips }) {
  const [chatAgent, setChatAgent] = useState(null);
  const pipelineGroups = [
    { label:"Drafted",          status:"drafted",          color:C.muted   },
    { label:"Ready for Review", status:"ready_for_review", color:C.yellow  },
    { label:"Approved",         status:"approved",         color:C.green   },
    { label:"Rejected",         status:"rejected",         color:C.red     },
  ];
  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ fontSize:17, fontWeight:800 }}>Content Studio</div>
        <div style={{ display:"flex", gap:6 }}>
          {CS_AGENTS.map(a => <button key={a.id} onClick={() => setChatAgent(a)} title={a.name} style={{ background:a.color+"15", border:"1px solid "+a.color+"33", borderRadius:7, width:30, height:30, fontSize:14, cursor:"pointer" }}>{a.icon}</button>)}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {pipelineGroups.map(({ label, status, color }) => {
          const group = clips.filter(c => c.status === status);
          return (
            <div key={status}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:700, color, textTransform:"uppercase" }}>{label}</div>
                <span style={{ background:color+"22", color, borderRadius:10, padding:"1px 8px", fontSize:11, fontWeight:700 }}>{group.length}</span>
              </div>
              {group.map(c => {
                const sc = c.clip_score;
                const scoreColor = sc>=90?C.green:sc>=80?C.yellow:sc>=70?C.orange:C.red;
                return (
                  <div key={c.clip_id} style={{ background:C.card2, border:"1px solid "+C.border, borderRadius:10, padding:12, marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <div style={{ fontSize:12, fontWeight:700, flex:1, marginRight:8 }}>{c.clip_summary.slice(0,55)}...</div>
                      <div style={{ fontSize:18, fontWeight:900, color:scoreColor }}>{sc}</div>
                    </div>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      <Chip label={c.moment_type} color={momentColor(c.moment_type)} sm />
                      <Chip label={c.content_pillar} color={C.purple} sm />
                    </div>
                  </div>
                );
              })}
              {group.length === 0 && <div style={{ background:C.card, border:"1px dashed "+C.border, borderRadius:10, padding:"20px 0", textAlign:"center", color:C.muted, fontSize:12 }}>Empty</div>}
            </div>
          );
        })}
      </div>
      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
