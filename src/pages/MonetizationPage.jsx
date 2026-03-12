import { useState } from "react";
import { C, dealStatusColor, dealStatusLabel } from "../constants";
import { MONO_AGENTS } from "../data/agents";
import { DEAL_PIPELINE } from "../data/deals";
import Chip from "../components/Chip";
import Card from "../components/Card";
import AgentChat from "../components/AgentChat";
import AgentButton from "../components/AgentButton";

export default function MonetizationPage() {
  const [deals, setDeals] = useState(DEAL_PIPELINE);
  const [chatAgent, setChatAgent] = useState(null);
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding:24, maxWidth:1000, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ fontSize:17, fontWeight:800 }}>Monetization & Partnership</div>
        <div style={{ display:"flex", gap:6 }}>{MONO_AGENTS.map(a => <button key={a.id} onClick={() => setChatAgent(a)} title={a.name} style={{ background:a.color+"15", border:"1px solid "+a.color+"33", borderRadius:7, width:30, height:30, fontSize:14, cursor:"pointer" }}>{a.icon}</button>)}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
        {[{label:"Est. MRR",val:"$3,200",color:C.green},{label:"Pipeline Value",val:"$12,800",color:C.yellow},{label:"Avg Fit Score",val:"82/100",color:C.blue}].map((s,i) => (
          <Card key={i}><div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{s.label}</div><div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div></Card>
        ))}
      </div>
      {deals.map(deal => (
        <div key={deal.id} onClick={() => setSelected(selected?.id===deal.id?null:deal)} style={{ background:C.card2, border:"1px solid "+(selected?.id===deal.id?C.green+"66":C.border), borderRadius:12, padding:16, marginBottom:10, cursor:"pointer" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ display:"flex", gap:8, marginBottom:4 }}>
                <div style={{ fontSize:14, fontWeight:800 }}>{deal.brand}</div>
                <Chip label={dealStatusLabel(deal.status)} color={dealStatusColor(deal.status)} sm />
                {deal.priority==="urgent" && <Chip label="🔴 URGENT" color={C.red} sm />}
              </div>
              <div style={{ fontSize:12, color:C.muted }}>{deal.notes}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:15, fontWeight:800, color:C.green }}>{deal.revenue}</div>
              <div style={{ fontSize:12, color:deal.fitScore>=80?C.green:deal.fitScore>=65?C.yellow:C.red }}>Fit {deal.fitScore}/100</div>
            </div>
          </div>
          {selected?.id === deal.id && (
            <div style={{ borderTop:"1px solid "+C.border, paddingTop:12, marginTop:12, display:"flex", gap:8 }}>
              <button onClick={e=>{e.stopPropagation();setChatAgent(MONO_AGENTS[1]);}} style={{ background:C.blue+"22", border:"1px solid "+C.blue+"44", borderRadius:7, padding:"7px 14px", color:C.blue, fontSize:12, fontWeight:700, cursor:"pointer" }}>✉️ Draft Outreach</button>
              <button onClick={e=>{e.stopPropagation();setChatAgent(MONO_AGENTS[2]);}} style={{ background:C.teal+"22", border:"1px solid "+C.teal+"44", borderRadius:7, padding:"7px 14px", color:C.teal, fontSize:12, fontWeight:700, cursor:"pointer" }}>🤝 Build Package</button>
              <button onClick={e=>{e.stopPropagation();setDeals(ds=>ds.map(d=>d.id===deal.id?{...d,status:d.status==="prospect"?"outreach_drafted":d.status==="outreach_drafted"?"interested":"closed"}:d));}} style={{ background:C.green+"22", border:"1px solid "+C.green+"44", borderRadius:7, padding:"7px 14px", color:C.green, fontSize:12, fontWeight:700, cursor:"pointer" }}>→ Advance Stage</button>
            </div>
          )}
        </div>
      ))}
      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
