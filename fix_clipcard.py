f = open('src/pages/ContentStudioPage.jsx', 'r').read()

old = '''function ClipCard({ clip, accent }) {
  const sc = clip.clip_score;
  const scoreColor = sc>=90?"#22c55e":sc>=80?"#eab308":sc>=70?"#f97316":"#ef4444";
  return (
    <div style={{ background:"#ffffff07", border:"1px solid "+accent+"25", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <div style={{ fontSize:12, fontWeight:700, flex:1, marginRight:8, color:C.text, lineHeight:1.4 }}>{clip.clip_summary.slice(0,58)}...</div>
        <div style={{ fontSize:17, fontWeight:900, color:scoreColor, flexShrink:0 }}>{sc}</div>
      </div>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        <Chip label={clip.moment_type} color={momentColor(clip.moment_type)} sm />
        <Chip label={clip.content_pillar} color={C.purple} sm />
      </div>
    </div>
  );
}'''

new = '''function VideoModal({ clip, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:800, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#1a1025", border:"1px solid "+C.purple+"44", borderRadius:16, padding:24, width:680, maxWidth:"95vw" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:4 }}>{clip.title}</div>
            <div style={{ fontSize:11, color:C.muted }}>{clip.clip_summary}</div>
          </div>
          <button onClick={onClose} style={{ background:C.border, border:"none", borderRadius:8, width:32, height:32, color:C.muted, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <video src={clip.clip_url} controls autoPlay style={{ width:"100%", borderRadius:10, background:"#000", maxHeight:"60vh" }} />
        <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
          <Chip label={"Score: "+clip.clip_score} color={clip.clip_score>=80?"#22c55e":"#eab308"} />
          <Chip label={clip.moment_type} color={momentColor(clip.moment_type)} />
          <Chip label={clip.content_pillar} color={C.purple} />
          <a href={clip.clip_url} download style={{ marginLeft:"auto", background:C.purple+"22", border:"1px solid "+C.purple+"44", borderRadius:8, padding:"6px 14px", color:C.purple, fontSize:12, fontWeight:700, textDecoration:"none" }}>⬇ Download</a>
        </div>
      </div>
    </div>
  );
}

function ClipCard({ clip, accent, onPlay }) {
  const sc = clip.clip_score;
  const scoreColor = sc>=90?"#22c55e":sc>=80?"#eab308":sc>=70?"#f97316":"#ef4444";
  return (
    <div onClick={onPlay} style={{ background:"#ffffff07", border:"1px solid "+accent+"25", borderRadius:10, padding:"10px 12px", marginBottom:8, cursor:"pointer", transition:"all 0.15s" }}
      onMouseEnter={e=>e.currentTarget.style.border="1px solid "+accent+"66"}
      onMouseLeave={e=>e.currentTarget.style.border="1px solid "+accent+"25"}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <div style={{ fontSize:12, fontWeight:700, flex:1, marginRight:8, color:C.text, lineHeight:1.4 }}>{clip.clip_summary?.slice(0,58)}...</div>
        <div style={{ fontSize:17, fontWeight:900, color:scoreColor, flexShrink:0 }}>{sc}</div>
      </div>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
        <Chip label={clip.moment_type} color={momentColor(clip.moment_type)} sm />
        <Chip label={clip.content_pillar} color={C.purple} sm />
        {clip.clip_url && <span style={{ marginLeft:"auto", fontSize:10, color:accent, fontWeight:700 }}>▶ Play</span>}
      </div>
    </div>
  );
}'''

if old in f:
    f = f.replace(old, new)
    open('src/pages/ContentStudioPage.jsx', 'w').write(f)
    print('done - ClipCard updated')
else:
    print('no match found')
