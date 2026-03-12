import { useState } from "react";
import { C, PLATFORM_META, dColor } from "../constants";
import { PUB_AGENTS } from "../data/agents";
import Chip from "./Chip";

export default function ApproveScheduleModal({ item, onConfirm, onCancel }) {
  const publishablePlatforms = item.subitems
    .filter(s => s.platform && !["Internal","Email"].includes(s.platform))
    .map(s => {
      const platKey = s.platform==="TikTok"?"tiktok":s.platform==="YT Shorts"?"youtube_shorts":s.platform==="TikTok+Reels"?"tiktok":s.platform==="YouTube"?"youtube":"tiktok";
      return { platform:platKey, caption:s.caption||s.content||"", hook:s.hook||"", scheduledTime:"", status:"draft", subId:s.id };
    })
    .filter((p, i, arr) => arr.findIndex(x => x.platform === p.platform) === i);

  const [platforms, setPlatforms] = useState(publishablePlatforms);
  const [activePlat, setActivePlat] = useState(0);
  const [schedLoading, setSchedLoading] = useState(false);
  const [schedRec, setSchedRec] = useState("");

  const updatePlat = (idx, changes) => setPlatforms(ps => ps.map((p, i) => i === idx ? { ...p, ...changes } : p));

  const getScheduleRec = async () => {
    setSchedLoading(true); setSchedRec("");
    const plat = platforms[activePlat];
    const meta = PLATFORM_META[plat.platform];
    try {
      const res = await fetch("/api/agent-chat", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ system:PUB_AGENTS[0].context, max_tokens:200, messages:[{ role:"user", content:`Best publish time for ${meta?.label} — content type: ${item.type}, title: "${item.title}". One specific recommendation, 1-2 sentences.` }] }) });
      const d = await res.json();
      setSchedRec(d.content?.find(b => b.type === "text")?.text || "");
    } catch {}
    setSchedLoading(false);
  };

  const allScheduled = platforms.every(p => p.scheduledTime);

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", display:"flex", alignItems:"center", justifyContent:"center", zIndex:700 }}>
      <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:16, width:680, maxWidth:"95vw", maxHeight:"90vh", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid "+C.border }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:15, fontWeight:800, marginBottom:6 }}>{item.title}</div>
              <div style={{ display:"flex", gap:6 }}><Chip label="Approve + Schedule" color={C.blue} /><Chip label={item.dept} color={dColor(item.dept)} sm /></div>
            </div>
            <button onClick={onCancel} style={{ background:C.border, border:"none", borderRadius:8, width:32, height:32, color:C.muted, cursor:"pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          <div style={{ width:160, borderRight:"1px solid "+C.border, padding:12, flexShrink:0, overflowY:"auto" }}>
            <div style={{ fontSize:10, color:C.muted, fontWeight:700, marginBottom:10 }}>PLATFORMS</div>
            {platforms.map((p, i) => {
              const meta = PLATFORM_META[p.platform] || { icon:"📱", label:p.platform, color:C.muted };
              return (
                <div key={i} onClick={() => setActivePlat(i)} style={{ padding:"10px 10px", borderRadius:8, marginBottom:6, cursor:"pointer", background:activePlat===i?meta.color+"22":C.card2, border:"1px solid "+(activePlat===i?meta.color+"55":C.border) }}>
                  <div style={{ fontSize:16, marginBottom:3 }}>{meta.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:activePlat===i?meta.color:C.text }}>{meta.label}</div>
                  <div style={{ marginTop:4 }}>{p.scheduledTime ? <Chip label="📅 Scheduled" color={C.blue} sm /> : <Chip label="Draft" color={C.muted} sm />}</div>
                </div>
              );
            })}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:20 }}>
            {(() => {
              const p = platforms[activePlat];
              const meta = PLATFORM_META[p.platform] || { label:p.platform, color:C.muted, charLimit:null, notes:"", bestTimes:[] };
              return (
                <>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:5 }}>HOOK</div>
                    <input value={p.hook||""} onChange={e => updatePlat(activePlat, { hook:e.target.value })} style={{ width:"100%", background:C.bg, border:"1px solid "+C.border, borderRadius:7, padding:"8px 12px", color:C.text, fontSize:13, boxSizing:"border-box" }} />
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <div style={{ fontSize:10, color:C.muted }}>CAPTION</div>
                      {meta.charLimit && <div style={{ fontSize:10, color:(p.caption||"").length>meta.charLimit?C.red:C.muted }}>{(p.caption||"").length}/{meta.charLimit}</div>}
                    </div>
                    <textarea value={p.caption||""} onChange={e => updatePlat(activePlat, { caption:e.target.value })} rows={4} style={{ width:"100%", background:C.bg, border:"1px solid "+C.border, borderRadius:7, padding:"8px 12px", color:C.text, fontSize:13, resize:"vertical", boxSizing:"border-box" }} />
                    <div style={{ fontSize:10, color:C.muted, marginTop:4 }}>{meta.notes}</div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:5 }}>SCHEDULE TIME</div>
                    <input type="datetime-local" value={p.scheduledTime||""} onChange={e => updatePlat(activePlat, { scheduledTime:e.target.value, status:e.target.value?"scheduled":"draft" })} style={{ width:"100%", background:C.bg, border:"1px solid "+C.border, borderRadius:7, padding:"8px 12px", color:C.text, fontSize:13, boxSizing:"border-box" }} />
                    <div style={{ marginTop:8 }}>
                      <div style={{ fontSize:10, color:C.muted, marginBottom:5 }}>BEST TIMES</div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                        {meta.bestTimes?.map(t => {
                          const d = new Date(); d.setHours(parseInt(t), 0, 0, 0);
                          if (t.includes("PM") && parseInt(t) !== 12) d.setHours(parseInt(t)+12, 0, 0, 0);
                          const iso = d.toISOString().slice(0, 16);
                          return <div key={t} onClick={() => updatePlat(activePlat, { scheduledTime:iso, status:"scheduled" })} style={{ background:C.blue+"22", border:"1px solid "+C.blue+"33", borderRadius:5, padding:"3px 10px", fontSize:11, color:C.blue, cursor:"pointer", fontWeight:600 }}>{t}</div>;
                        })}
                      </div>
                    </div>
                  </div>
                  <button onClick={getScheduleRec} disabled={schedLoading} style={{ width:"100%", background:C.blue+"15", border:"1px solid "+C.blue+"33", borderRadius:7, padding:"8px 0", color:C.blue, fontSize:12, fontWeight:700, cursor:"pointer", marginBottom:schedRec?10:0 }}>
                    {schedLoading ? "●●● Asking Scheduling Agent..." : "📅 Get Agent Schedule Recommendation"}
                  </button>
                  {schedRec && <div style={{ background:C.blue+"11", border:"1px solid "+C.blue+"22", borderRadius:7, padding:"10px 12px", fontSize:12, color:C.text, lineHeight:1.6 }}>{schedRec}</div>}
                </>
              );
            })()}
          </div>
        </div>
        <div style={{ padding:"16px 24px", borderTop:"1px solid "+C.border, display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ flex:1, fontSize:11, color:C.muted }}>{platforms.filter(p=>p.scheduledTime).length}/{platforms.length} platforms scheduled</div>
          <button onClick={onCancel} style={{ background:C.border, border:"none", borderRadius:8, padding:"9px 18px", color:C.muted, fontWeight:700, fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={() => onConfirm(platforms)} style={{ background:"linear-gradient(135deg,"+C.green+"44,"+C.blue+"33)", border:"1px solid "+C.green+"55", borderRadius:9, padding:"10px 24px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>
            {allScheduled ? "✓ Approve & Schedule All →" : "✓ Approve & Queue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
