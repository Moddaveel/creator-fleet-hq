import { useState, useRef, useEffect } from "react";
import { C } from "../constants";

const GREETINGS = {
  scheduler:  "Scheduling Agent ready. Give me a content item and target platforms — I'll recommend optimal publish times with reasoning.",
  formatter:  "Ready to format. Give me content and target platforms and I'll produce platform-ready copy that meets all specs.",
  copywriter: "Ready for final copy pass. Paste your hook and caption and I'll clean it for publish.",
  analytics:  "Ready to analyse post performance. Share what's been published and I'll surface signals for the Ralph Loop.",
  director:   "Content Studio is active. 5 clips in library — 2 ready for review, 2 approved, 1 rejected. What do you need?",
  clip_hunter:"Ready to hunt. Give me stream notes, timestamps, or transcript excerpts and I will score clip candidates.",
  hook:       "Give me a clip summary and transcript excerpt and I will produce ranked hook options.",
  caption:    "Give me a clip summary, hook, and target platforms and I will produce captions and hashtag sets.",
  qa:         "Give me a completed clip package and I will run a full QA check.",
  repurposer: "Show me your approved clip library and I will identify compilation and reuse opportunities.",
  architect:  "Brand Doctrine v1.1 is active. Strategic Entertainer archetype. What would you like to review?",
  analyst:    "Audience Map is current. TikTok discovery audience fastest growing at +31%. What would you like to analyze?",
  dealflow:   "Deal pipeline active. SteelSeries is urgent — deadline today 9PM. What do you need?",
  outreach:   "Ready to draft outreach. Give me the brand, what they make, and why you think it's a fit.",
  sponsorship:"Ready to score brand fit or build a sponsorship package.",
  funnel:     "Funnel overview ready. Current MRR estimate: $3,200/mo. Where do you want to focus?",
};

export default function AgentChat({ agent, onClose, initialPrompt }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", text: GREETINGS[agent.id] || "Ready." }]);
  const [input, setInput] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => { if (initialPrompt) setTimeout(() => doSend(initialPrompt), 300); }, []);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const doSend = async (u) => {
    if (!u || loading) return;
    setInput(""); setLoading(true);
    setMsgs(m => [...m, { role: "user", text: u }]);
    try {
      const hist = msgs.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: agent.context, max_tokens: 1000, messages: [...hist, { role: "user", content: u }] }),
      });
      const d = await res.json();
      setMsgs(m => [...m, { role: "assistant", text: d.content?.find(b => b.type === "text")?.text || "Error." }]);
    } catch { setMsgs(m => [...m, { role: "assistant", text: "System error." }]); }
    setLoading(false);
  };

  const renderText = t => t.split("\n").map((l, i) => {
    const b = l.replace(/\*\*(.*?)\*\*/g, (_, w) => `<strong style="color:${agent.color}">${w}</strong>`);
    return <div key={i} style={{ marginBottom: l === "" ? 5 : 2 }} dangerouslySetInnerHTML={{ __html: b || "&nbsp;" }} />;
  });

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000bb", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.card, border:"1px solid "+agent.color+"44", borderRadius:16, width:620, maxWidth:"95vw", height:"82vh", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"18px 22px", borderBottom:"1px solid "+C.border, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, background:agent.color+"22", border:"1px solid "+agent.color+"44", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{agent.icon}</div>
            <div><div style={{ fontWeight:800, fontSize:14 }}>{agent.name}</div><div style={{ fontSize:11, color:agent.color }}>{agent.role}</div></div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ fontSize:10, color:C.purple, fontWeight:700, background:C.purple+"11", border:"1px solid "+C.purple+"22", borderRadius:6, padding:"3px 8px" }}>♻ Ralph Loop Active</div>
            <button onClick={onClose} style={{ background:C.border, border:"none", borderRadius:8, width:32, height:32, color:C.muted, cursor:"pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 22px" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ marginBottom:14, display:"flex", flexDirection:"column", alignItems:m.role==="user"?"flex-end":"flex-start" }}>
              {m.role === "assistant" && <div style={{ fontSize:10, color:agent.color, fontWeight:700, marginBottom:4 }}>{agent.icon + " " + agent.name.toUpperCase()}</div>}
              <div style={{ background:m.role==="user"?C.purpleDim+"44":"#1a1a2e", border:"1px solid "+(m.role==="user"?C.purple+"44":C.border), borderRadius:10, padding:"10px 14px", maxWidth:"92%", fontSize:13, color:C.text, lineHeight:1.65 }}>
                {renderText(m.text)}
              </div>
            </div>
          ))}
          {loading && <div style={{ color:agent.color, fontSize:12 }}>{"●●● " + agent.name + " is working..."}</div>}
          <div ref={ref} />
        </div>
        <div style={{ padding:"14px 22px", borderTop:"1px solid "+C.border, display:"flex", gap:8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && doSend(input.trim())} placeholder={"Message " + agent.name + "..."} style={{ flex:1, background:C.card2, border:"1px solid "+C.border, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:13, outline:"none" }} />
          <button onClick={() => doSend(input.trim())} disabled={loading} style={{ background:agent.color+"33", border:"1px solid "+agent.color+"55", borderRadius:8, padding:"0 18px", color:agent.color, fontWeight:800, fontSize:13, cursor:"pointer" }}>↑</button>
        </div>
      </div>
    </div>
  );
}
