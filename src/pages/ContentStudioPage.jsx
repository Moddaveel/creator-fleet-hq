import { useState } from "react";
import { C, momentColor } from "../constants";
import { CS_AGENTS } from "../data/agents";
import Chip from "../components/Chip";
import AgentChat from "../components/AgentChat";
import AgentButton from "../components/AgentButton";

const PLATFORMS = [
  { id:"youtube",        label:"YouTube",        icon:"▶", accent:"#ff4444", bg:"#1a0a0a", border:"rgba(255,68,68,0.45)",    keys:["youtube"],        description:"Long-form VODs & full stream uploads" },
  { id:"youtube_shorts", label:"YouTube Shorts", icon:"▶", accent:"#ff6b6b", bg:"#1a0c0c", border:"rgba(255,107,107,0.45)", keys:["youtube_shorts"], description:"Vertical short clips · under 60s" },
  { id:"tiktok",         label:"TikTok",         icon:"♪", accent:"#69c9d0", bg:"#08161a", border:"rgba(105,201,208,0.45)", keys:["tiktok"],         description:"Short clips · hook in 2s · max 60s" },
  { id:"instagram_reels",label:"Instagram Reels",icon:"◈", accent:"#f97316", bg:"#1a0e08", border:"rgba(249,115,22,0.45)",  keys:["instagram_reels"],description:"Reels · first line is the hook · 6–10 hashtags" },
];

const STATUSES = [
  { key:"ready_for_review", label:"For Review", color:"#eab308" },
  { key:"approved",         label:"Approved",   color:"#22c55e" },
  { key:"rejected",         label:"Rejected",   color:"#ef4444" },
];

function ClipCard({ clip, accent }) {
  const sc = clip.clip_score;
  const scoreColor = sc>=90?"#22c55e":sc>=80?"#eab308":sc>=70?"#f97316":"#ef4444";
  return (
    <div style={{ background:"#ffffff07", border:"1px solid "+accent+"25", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <div style={{ fontSize:12, fontWeight:700, flex:1, marginRight:8, color:C.text, lineHeight:1.4 }}>
          {clip.clip_summary.slice(0,58)}...
        </div>
        <div style={{ fontSize:17, fontWeight:900, color:scoreColor, flexShrink:0 }}>{sc}</div>
      </div>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        <Chip label={clip.moment_type} color={momentColor(clip.moment_type)} sm />
        <Chip label={clip.content_pillar} color={C.purple} sm />
      </div>
    </div>
  );
}

function PlatformSection({ platform, clips }) {
  const platformClips = clips.filter(c => platform.keys.some(k => c.platforms?.includes(k)));
  return (
    <div style={{ background:platform.bg, border:"1px solid "+platform.border, borderRadius:14, padding:20, marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
        <div style={{ width:38, height:38, background:platform.accent+"20", border:"1px solid "+platform.accent+"44", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:platform.accent, fontWeight:900 }}>
          {platform.icon}
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:platform.accent }}>{platform.label}</div>
          <div style={{ fontSize:11, color:C.muted }}>{platform.description}</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:6, flexWrap:"wrap" }}>
          {STATUSES.map(s => {
            const n = platformClips.filter(c => c.status===s.key).length;
            return n > 0 ? (
              <span key={s.key} style={{ background:s.color+"20", color:s.color, borderRadius:8, padding:"2px 9px", fontSize:11, fontWeight:700 }}>
                {n} {s.label}
              </span>
            ) : null;
          })}
          {platformClips.length===0 && <span style={{ fontSize:11, color:C.muted }}>No content yet</span>}
        </div>
      </div>
      <div style={{ borderTop:"1px solid "+platform.accent+"18", margin:"14px 0" }} />
      {platformClips.length > 0 ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {STATUSES.map(s => {
            const group = platformClips.filter(c => c.status===s.key);
            return (
              <div key={s.key}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:0.5 }}>{s.label}</span>
                  <span style={{ background:s.color+"20", color:s.color, borderRadius:8, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{group.length}</span>
                </div>
                {group.length > 0
                  ? group.map(c => <ClipCard key={c.clip_id} clip={c} accent={platform.accent} />)
                  : <div style={{ border:"1px dashed "+platform.accent+"20", borderRadius:8, padding:"14px 0", textAlign:"center", color:C.muted, fontSize:11 }}>Empty</div>
                }
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"18px 0", color:C.muted, fontSize:12 }}>
          No clips routed to {platform.label} yet — deposit a VOD above to get started
        </div>
      )}
    </div>
  );
}

export default function ContentStudioPage({ clips, setClips }) {
  const [chatAgent, setChatAgent] = useState(null);
  const [dragging, setDragging]   = useState(false);
  const [vods, setVods]           = useState([]);
  const [processing, setProcessing] = useState(null);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    processVods(Array.from(e.dataTransfer?.files||[]));
  }
  function handleFileInput(e) { processVods(Array.from(e.target.files||[])); }
  function processVods(files) {
    if (!files.length) return;
    files.forEach(file => {
      const vod = { id:Date.now()+Math.random(), name:file.name, size:(file.size/1e6).toFixed(1)+" MB", status:"processing" };
      setVods(v => [...v, vod]);
      setProcessing(file.name);
      setTimeout(() => {
        setVods(v => v.map(x => x.id===vod.id ? {...x, status:"done"} : x));
        setProcessing(null);
      }, 2400);
    });
  }

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:17, fontWeight:800 }}>Content Studio</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Drop a VOD into the Drop Zone — clips are extracted and auto-routed to each platform below</div>
        </div>
      </div>



      {/* Drop Zone — primary action */}
      <div style={{
        background: dragging ? "#9146ff18" : "#18061a",
        border: "2px dashed "+(dragging?"#9146ff":"#9146ff66"),
        borderRadius:16, marginBottom:24, overflow:"hidden",
        boxShadow: dragging ? "0 0 32px rgba(145,70,255,0.2)" : "none",
        transition:"all 0.2s",
      }}>
        {/* Header strip */}
        <div style={{ background:"#9146ff22", borderBottom:"1px solid #9146ff33", padding:"12px 24px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, background:"#9146ff", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🟣</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#9146ff" }}>Twitch VOD Drop Zone</div>
            <div style={{ fontSize:11, color:C.muted }}>Primary input — drop any stream VOD to extract and route clips</div>
          </div>
          {processing && (
            <div style={{ background:"#9146ff22", border:"1px solid #9146ff44", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#9146ff", fontWeight:600 }}>
              Processing {processing}...
            </div>
          )}
        </div>

        {/* Drop target */}
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={handleDrop}
          onClick={()=>document.getElementById("vod-input").click()}
          style={{ padding:"44px 20px", textAlign:"center", cursor:"pointer" }}
        >
          <input id="vod-input" type="file" accept="video/*" multiple onChange={handleFileInput} style={{ display:"none" }} />
          <div style={{ fontSize:44, marginBottom:12 }}>🎮</div>
          <div style={{ fontWeight:800, fontSize:16, color:C.text, marginBottom:6 }}>Drag and drop your Twitch VOD here</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>or click to browse — MP4, MOV, AVI supported</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#9146ff22", border:"1px solid #9146ff55", borderRadius:10, padding:"8px 20px" }}>
            <span style={{ fontSize:13, color:"#9146ff", fontWeight:700 }}>Browse Files</span>
          </div>
        </div>

        {/* VOD list */}
        {vods.length > 0 && (
          <div style={{ borderTop:"1px solid #9146ff22", padding:"12px 24px", display:"flex", flexDirection:"column", gap:8 }}>
            {vods.map(v => (
              <div key={v.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#9146ff0e", border:"1px solid #9146ff22", borderRadius:10, padding:"10px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:18 }}>🎥</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{v.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{v.size}</div>
                  </div>
                </div>
                {v.status==="processing"
                  ? <span style={{ fontSize:11, color:"#9146ff", fontWeight:600 }}>Processing...</span>
                  : <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:11, color:"#22c55e", fontWeight:600 }}>Routed to platforms</span>
                      <div style={{ display:"flex", gap:4 }}>
                        {PLATFORMS.map(p => (
                          <div key={p.id} style={{ width:22, height:22, background:p.accent+"20", border:"1px solid "+p.accent+"44", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:p.accent }}>{p.icon}</div>
                        ))}
                      </div>
                    </div>
                }
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform Sections */}
      {PLATFORMS.map(p => <PlatformSection key={p.id} platform={p} clips={clips} />)}

      {/* Agent section — bottom */}
      <div style={{ marginTop:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.35)", borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:800, color:"#a855f7" }}>Studio Agents</div>
          <div style={{ fontSize:12, color:"#64748b" }}>Hover to hear from them — click to open a session</div>
        </div>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", padding:"24px", background:"#12121a", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16 }}>
          {CS_AGENTS.map(a => (
            <AgentButton key={a.id} agent={a} onClick={() => setChatAgent(a)} large />
          ))}
        </div>
      </div>

      {/* {chatAgent && <AgentChat agent={chatAgent} onClose={()=>setChatAgent(null)} />}
    </div>
  );
}
