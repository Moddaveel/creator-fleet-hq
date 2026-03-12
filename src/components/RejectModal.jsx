import { useState } from "react";
import { C, REJECTION_REASONS } from "../constants";

export default function RejectModal({ item, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  const [custom, setCustom] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000bb", display:"flex", alignItems:"center", justifyContent:"center", zIndex:700 }}>
      <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:14, padding:28, width:400, maxWidth:"90vw" }}>
        <div style={{ fontSize:15, fontWeight:800, marginBottom:4 }}>{"Reject: " + item.title}</div>
        <div style={{ fontSize:11, color:C.purple, background:C.purple+"11", border:"1px solid "+C.purple+"22", borderRadius:6, padding:"6px 10px", marginBottom:14 }}>♻ Rejection reason trains the {item.agent}</div>
        {REJECTION_REASONS.map(r => (
          <div key={r} onClick={() => setReason(r)} style={{ padding:"8px 12px", borderRadius:8, marginBottom:5, cursor:"pointer", background:reason===r?C.purple+"22":C.bg, border:"1px solid "+(reason===r?C.purple:C.border), fontSize:13, color:reason===r?C.purple:C.text }}>
            {(reason === r ? "● " : "○ ") + r}
          </div>
        ))}
        {reason === "Custom note..." && (
          <textarea value={custom} onChange={e => setCustom(e.target.value)} placeholder="Add feedback..." rows={3} style={{ width:"100%", background:C.bg, border:"1px solid "+C.border, borderRadius:8, padding:"10px 12px", color:C.text, fontSize:13, resize:"none", boxSizing:"border-box", marginTop:8 }} />
        )}
        <div style={{ display:"flex", gap:10, marginTop:14 }}>
          <button onClick={onCancel} style={{ flex:1, background:C.border, border:"none", borderRadius:8, padding:"10px 0", color:C.muted, fontWeight:700, cursor:"pointer" }}>Cancel</button>
          <button onClick={() => onConfirm(reason === "Custom note..." ? custom : reason)} disabled={!reason} style={{ flex:1, background:reason?C.red+"22":C.border, border:"1px solid "+(reason?C.red+"44":C.border), borderRadius:8, padding:"10px 0", color:reason?C.red:C.muted, fontWeight:700, cursor:reason?"pointer":"default" }}>Confirm Reject</button>
        </div>
      </div>
    </div>
  );
}
