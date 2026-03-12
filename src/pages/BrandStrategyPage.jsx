import { useState } from "react";
import { C, BRAND_DOCTRINE } from "../constants";
import { BS_AGENTS } from "../data/agents";
import Chip from "../components/Chip";
import Card from "../components/Card";
import Sect from "../components/Sect";
import AgentChat from "../components/AgentChat";
import AgentButton from "../components/AgentButton";

export default function BrandStrategyPage() {
  const [chatAgent, setChatAgent] = useState(null);
  return (
    <div style={{ padding:24, maxWidth:1000, margin:"0 auto" }}>
      <div style={{ marginBottom:20 }}><div style={{ fontSize:17, fontWeight:800 }}>Brand Strategy</div></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card>
          <Sect>Archetype</Sect>
          <div style={{ fontSize:22, fontWeight:800, color:C.purple, marginBottom:12 }}>{BRAND_DOCTRINE.identity.archetype}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{BRAND_DOCTRINE.identity.traits.map(t => <Chip key={t} label={t} color={C.purple} />)}</div>
        </Card>
        <Card><Sect>Value Prop</Sect><div style={{ fontSize:13, lineHeight:1.7 }}>{BRAND_DOCTRINE.identity.valueProp}</div></Card>
      </div>
      <Card style={{ marginBottom:14 }}>
        <Sect>Tone Rules</Sect>
        {BRAND_DOCTRINE.voice.toneRules.map((r, i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, padding:"10px 0", borderBottom:i<3?"1px solid "+C.border:"none" }}>
            <div><div style={{ fontSize:10, color:C.green, fontWeight:700, marginBottom:4 }}>✓ DO</div><div style={{ fontSize:12 }}>{r.do}</div></div>
            <div><div style={{ fontSize:10, color:C.red, fontWeight:700, marginBottom:4 }}>✕ DON'T</div><div style={{ fontSize:12, color:C.muted }}>{r.dont}</div></div>
          </div>
        ))}
      </Card>
      <Card>
        <Sect>Agents</Sect>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
          {BS_AGENTS.map(a => (
            <div key={a.id} onClick={() => setChatAgent(a)} style={{ background:a.color+"11", border:"1px solid "+a.color+"33", borderRadius:10, padding:"12px 8px", cursor:"pointer", textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{a.icon}</div>
              <div style={{ fontSize:11, fontWeight:700, color:a.color }}>{a.name}</div>
            </div>
          ))}
        </div>
      </Card>
      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
