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
  const { identity, voice } = BRAND_DOCTRINE;
  const deptHead = BS_AGENTS.find(a => a.codename);
  const specialists = BS_AGENTS.filter(a => !a.codename);
  return (
    <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:17, fontWeight:800 }}>Brand Strategy</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Voice, identity, and content doctrine</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <div style={{ background:"#18061a", border:"1px solid rgba(168,85,247,0.45)", borderRadius:14, padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:34, height:34, background:C.purple+"20", border:"1px solid "+C.purple+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>&#127917;</div>
            <div style={{ fontSize:12, fontWeight:700, color:C.purple }}>Archetype</div>
          </div>
          <div style={{ borderTop:"1px solid "+C.purple+"18", marginBottom:14 }} />
          <div style={{ fontSize:20, fontWeight:900, color:C.purple, marginBottom:14 }}>{identity.archetype}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {identity.traits.map(t => <Chip key={t} label={t} color={C.purple} />)}
          </div>
        </div>
        <div style={{ background:"#080e1a", border:"1px solid rgba(59,130,246,0.45)", borderRadius:14, padding:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:34, height:34, background:C.blue+"20", border:"1px solid "+C.blue+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>&#128161;</div>
            <div style={{ fontSize:12, fontWeight:700, color:C.blue }}>Value Proposition</div>
          </div>
          <div style={{ borderTop:"1px solid "+C.blue+"18", marginBottom:14 }} />
          <div style={{ fontSize:13, lineHeight:1.8, color:C.text }}>{identity.valueProp}</div>
        </div>
      </div>
      <div style={{ marginBottom:14 }}>
        <Sect>Tone Rules</Sect>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:12 }}>
          <div style={{ background:"#08160e", border:"1px solid rgba(34,197,94,0.45)", borderRadius:14, padding:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:34, height:34, background:C.green+"20", border:"1px solid "+C.green+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>&#10003;</div>
              <div style={{ fontSize:13, fontWeight:800, color:C.green }}>DO</div>
            </div>
            <div style={{ borderTop:"1px solid "+C.green+"18", marginBottom:14 }} />
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {voice.toneRules.map((r, i) => (
                <div key={i} style={{ background:C.green+"0d", border:"1px solid "+C.green+"22", borderRadius:9, padding:"10px 14px", fontSize:12, lineHeight:1.6, color:C.text }}>{r.do}</div>
              ))}
            </div>
          </div>
          <div style={{ background:"#1a0808", border:"1px solid rgba(239,68,68,0.45)", borderRadius:14, padding:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:34, height:34, background:C.red+"20", border:"1px solid "+C.red+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>&#10005;</div>
              <div style={{ fontSize:13, fontWeight:800, color:C.red }}>DO NOT</div>
            </div>
            <div style={{ borderTop:"1px solid "+C.red+"18", marginBottom:14 }} />
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {voice.toneRules.map((r, i) => (
                <div key={i} style={{ background:C.red+"0d", border:"1px solid "+C.red+"22", borderRadius:9, padding:"10px 14px", fontSize:12, lineHeight:1.6, color:C.muted }}>{r.dont}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ background:"#16120a", border:"1px solid rgba(234,179,8,0.45)", borderRadius:14, padding:20, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:34, height:34, background:C.yellow+"20", border:"1px solid "+C.yellow+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>&#128683;</div>
          <div style={{ fontSize:12, fontWeight:700, color:C.yellow }}>Banned Phrases</div>
        </div>
        <div style={{ borderTop:"1px solid "+C.yellow+"18", marginBottom:14 }} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
          {voice.bannedPhrases.map((b, i) => (
            <div key={i} style={{ background:C.yellow+"0d", border:"1px solid "+C.yellow+"22", borderRadius:9, padding:"10px 14px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.yellow, marginBottom:4 }}>"{b.phrase}"</div>
              <div style={{ fontSize:11, color:C.muted }}>{b.reason}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ background:"rgba(217,70,239,0.15)", border:"1px solid rgba(217,70,239,0.35)", borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:800, color:"#d946ef" }}>Brand Agents</div>
          <div style={{ fontSize:12, color:"#64748b" }}>Hover to hear from them - click to open a session</div>
        </div>
        <div style={{ background:"#12121a", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden" }}>
          {deptHead && (
            <div style={{ padding:"20px 28px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:20 }}>
              <button onClick={() => setChatAgent(deptHead)} style={{ background:deptHead.color+"22", border:"2px solid "+deptHead.color+"66", borderRadius:18, width:72, height:72, fontSize:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 0 24px "+deptHead.color+"33" }}>{deptHead.icon}</button>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <div style={{ fontSize:20, fontWeight:900, color:deptHead.color, letterSpacing:"-0.02em" }}>{deptHead.codename}</div>
                  <div style={{ background:deptHead.color+"22", border:"1px solid "+deptHead.color+"44", borderRadius:5, padding:"2px 8px", fontSize:10, fontWeight:800, color:deptHead.color, letterSpacing:"0.06em", textTransform:"uppercase" }}>Dept Head</div>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:deptHead.color+"bb" }}>{deptHead.name}</div>
                <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{deptHead.role}</div>
              </div>
              <button onClick={() => setChatAgent(deptHead)} style={{ background:deptHead.color+"15", border:"1px solid "+deptHead.color+"44", borderRadius:9, padding:"10px 20px", color:deptHead.color, fontSize:12, fontWeight:800, cursor:"pointer", flexShrink:0 }}>Open Session</button>
            </div>
          )}
          <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", padding:"24px" }}>
            {specialists.map(a => (
              <AgentButton key={a.id} agent={a} onClick={() => setChatAgent(a)} large />
            ))}
          </div>
        </div>
      </div>
      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
