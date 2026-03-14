import { useState } from "react";
import { C, dealStatusColor, dealStatusLabel } from "../constants";
import { MONO_AGENTS } from "../data/agents";
import { DEAL_PIPELINE } from "../data/deals";
import Chip from "../components/Chip";
import Card from "../components/Card";
import Sect from "../components/Sect";
import AgentChat from "../components/AgentChat";
import AgentButton from "../components/AgentButton";

const STAT_CARDS = [
  { label:"Est. MRR",       val:"$3,200",  icon:"💰", accent:"#22c55e", bg:"#08160e", border:"rgba(34,197,94,0.45)"  },
  { label:"Pipeline Value", val:"$12,800", icon:"📈", accent:"#eab308", bg:"#16120a", border:"rgba(234,179,8,0.45)"  },
  { label:"Avg Fit Score",  val:"82/100",  icon:"🎯", accent:"#3b82f6", bg:"#080e1a", border:"rgba(59,130,246,0.45)" },
];

const BRAND_ICONS = {
  SteelSeries:  { icon:"🎧", accent:"#ef4444", bg:"#1a0808", border:"rgba(239,68,68,0.45)"   },
  Notion:       { icon:"📝", accent:"#e2e8f0", bg:"#111118", border:"rgba(226,232,240,0.25)"  },
  Elgato:       { icon:"⚡", accent:"#a855f7", bg:"#18061a", border:"rgba(168,85,247,0.45)"   },
  "Brilliant.org":{ icon:"🧠", accent:"#14b8a6", bg:"#061614", border:"rgba(20,184,166,0.45)" },
};

export default function MonetizationPage() {
  const [deals, setDeals] = useState(DEAL_PIPELINE);
  const [chatAgent, setChatAgent] = useState(null);
  const [expanded, setExpanded] = useState(new Set());
  const toggleExpand = id => setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div style={{ padding:24, maxWidth:1000, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:17, fontWeight:800 }}>Monetization & Partnerships</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{deals.length} active deals · Click a deal to expand</div>
        </div>
        
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {STAT_CARDS.map(s => (
          <div key={s.label} style={{ background:s.bg, border:"1px solid "+s.border, borderRadius:14, padding:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:34, height:34, background:s.accent+"20", border:"1px solid "+s.accent+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:s.accent }}>{s.label}</div>
            </div>
            <div style={{ borderTop:"1px solid "+s.accent+"18", marginBottom:10 }} />
            <div style={{ fontSize:28, fontWeight:900, color:s.accent }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Deal pipeline */}
      <Sect>Deal Pipeline</Sect>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:12 }}>
        {deals.map(deal => {
          const brand = BRAND_ICONS[deal.brand] || { icon:"🏢", accent:C.muted, bg:C.card2, border:C.border };
          const statusColor = dealStatusColor(deal.status);
          const isOpen = expanded.has(deal.id);

          return (
            <div key={deal.id} onClick={() => toggleExpand(deal.id)}
              style={{ background:brand.bg, border:"1px solid "+(isOpen ? brand.accent+"88" : brand.border), borderRadius:14, padding:18, cursor:"pointer", transition:"border 0.15s" }}>

              {/* Top row */}
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                {/* Brand icon */}
                <div style={{ width:44, height:44, background:brand.accent+"20", border:"1px solid "+brand.accent+"44", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                  {brand.icon}
                </div>

                {/* Brand info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ fontSize:15, fontWeight:800, color:brand.accent }}>{deal.brand}</div>
                    <Chip label={dealStatusLabel(deal.status)} color={statusColor} sm />
                    {deal.priority === "urgent" && <Chip label="🔴 URGENT" color={C.red} sm />}
                  </div>
                  <div style={{ fontSize:12, color:C.muted }}>{deal.category} · {deal.notes}</div>
                </div>

                {/* Right side stats */}
                <div style={{ textAlign:"right", flexShrink:0, display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:C.green }}>{deal.revenue}</div>
                  <div style={{ fontSize:11, color: deal.fitScore>=80?C.green:deal.fitScore>=65?C.yellow:C.red, fontWeight:600 }}>Fit {deal.fitScore}/100</div>
                  <div style={{ background: deal.priority==="urgent" ? C.red+"22" : deal.priority==="high" ? C.yellow+"22" : C.card2, border:"1px solid "+(deal.priority==="urgent" ? C.red+"55" : deal.priority==="high" ? C.yellow+"55" : C.border), borderRadius:7, padding:"3px 10px", fontSize:11, fontWeight:700, color: deal.priority==="urgent" ? C.red : deal.priority==="high" ? C.yellow : C.muted, display:"flex", alignItems:"center", gap:5 }}>
                    <span>{deal.priority==="urgent" ? "⏰" : "📅"}</span>
                    <span>{deal.deadline}</span>
                  </div>
                </div>

                <div style={{ fontSize:12, color:C.muted, marginLeft:8 }}>{isOpen ? "▲" : "▼"}</div>
              </div>

              {/* Expanded section */}
              {isOpen && (
                <div style={{ borderTop:"1px solid "+brand.accent+"22", marginTop:14, paddingTop:14 }}>
                  {/* Score breakdown */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
                    {[
                      { label:"Fit Score",        val:deal.fitScore,       color:deal.fitScore>=80?C.green:C.yellow },
                      { label:"Audience Match",   val:deal.audienceMatch,  color:deal.audienceMatch>=80?C.green:C.yellow },
                      { label:"Brand Alignment",  val:deal.brandAlignment, color:deal.brandAlignment>=80?C.green:C.yellow },
                    ].map(m => (
                      <div key={m.label} style={{ background:brand.accent+"0d", border:"1px solid "+brand.accent+"22", borderRadius:9, padding:"10px 14px" }}>
                        <div style={{ fontSize:10, color:C.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>{m.label}</div>
                        <div style={{ fontSize:20, fontWeight:800, color:m.color }}>{m.val}<span style={{ fontSize:11, color:C.muted }}>/100</span></div>
                      </div>
                    ))}
                  </div>

                  {/* Deadline */}
                  <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
                    ⏰ Deadline: <span style={{ color:deal.priority==="urgent"?C.red:C.text, fontWeight:600 }}>{deal.deadline}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={e=>{e.stopPropagation();setChatAgent(MONO_AGENTS[1]);}}
                      style={{ background:C.blue+"22", border:"1px solid "+C.blue+"44", borderRadius:7, padding:"8px 14px", color:C.blue, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      ✉️ Draft Outreach
                    </button>
                    <button onClick={e=>{e.stopPropagation();setChatAgent(MONO_AGENTS[2]);}}
                      style={{ background:C.teal+"22", border:"1px solid "+C.teal+"44", borderRadius:7, padding:"8px 14px", color:C.teal, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      🤝 Build Package
                    </button>
                    <button onClick={e=>{e.stopPropagation();setDeals(ds=>ds.map(d=>d.id===deal.id?{...d,status:d.status==="prospect"?"outreach_drafted":d.status==="outreach_drafted"?"interested":"closed"}:d));}}
                      style={{ background:C.green+"22", border:"1px solid "+C.green+"44", borderRadius:7, padding:"8px 14px", color:C.green, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      → Advance Stage
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Agent large cards */}
      <div style={{ marginTop:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <div style={{ background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.35)', borderRadius:10, padding:'6px 16px', fontSize:13, fontWeight:800, color:'#22c55e' }}>Monetization Agents</div>
          <div style={{ fontSize:12, color:'#64748b' }}>Hover to hear from them — click to open a session</div>
        </div>
        <div style={{ background:'#12121a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
        {MONO_AGENTS.filter(a => a.codename).map(a => (
          <div key={a.id} style={{ padding:'20px 28px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:20 }}>
            <button onClick={() => setChatAgent(a)} style={{ background:a.color+'22', border:'2px solid '+a.color+'66', borderRadius:18, width:72, height:72, fontSize:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 0 24px '+a.color+'33' }}>{a.icon}</button>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <div style={{ fontSize:20, fontWeight:900, color:a.color, letterSpacing:'-0.02em' }}>{a.codename}</div>
                <div style={{ background:a.color+'22', border:'1px solid '+a.color+'44', borderRadius:5, padding:'2px 8px', fontSize:10, fontWeight:800, color:a.color, letterSpacing:'0.06em', textTransform:'uppercase' }}>Dept Head</div>
              </div>
              <div style={{ fontSize:12, fontWeight:700, color:a.color+'bb' }}>{a.name}</div>
              <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{a.role}</div>
            </div>
            <button onClick={() => setChatAgent(a)} style={{ background:a.color+'15', border:'1px solid '+a.color+'44', borderRadius:9, padding:'10px 20px', color:a.color, fontSize:12, fontWeight:800, cursor:'pointer', flexShrink:0 }}>Open Session</button>
          </div>
        ))}
        <div style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'center', padding:'24px' }}>
          {MONO_AGENTS.filter(a => a.codename === undefined).map(a => (
            <AgentButton key={a.id} agent={a} onClick={() => setChatAgent(a)} large />
          ))}
        </div>
      </div>

      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
