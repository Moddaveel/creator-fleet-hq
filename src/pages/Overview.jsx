import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { C } from "../constants";
import Chip from "../components/Chip";
import Card from "../components/Card";
import Sect from "../components/Sect";

const growthData = [
  { week:"W1", twitch:7200,  youtube:4300, tiktok:14000 },
  { week:"W2", twitch:7600,  youtube:4600, tiktok:16500 },
  { week:"W3", twitch:7900,  youtube:4800, tiktok:19200 },
  { week:"W4", twitch:8420,  youtube:5100, tiktok:22800 },
];
const clipPerfData = [
  { name:"Skill",     views:18400, shares:620  },
  { name:"Discovery", views:24100, shares:890  },
  { name:"Reaction",  views:31200, shares:1420 },
];
const platforms = [
  { name:"Twitch",    icon:"🟣", color:C.purple,  trend:"+8.2%",  stats:[["Followers","8,420"],["Avg Viewers","312"],["Clip Views","24.3K"]] },
  { name:"YouTube",   icon:"🔴", color:"#ff4444", trend:"+12.4%", stats:[["Subscribers","5,100"],["Watch Time","1.2K hrs"],["CTR","6.8%"]] },
  { name:"TikTok",    icon:"⚫", color:"#aaa",    trend:"+31.0%", stats:[["Followers","22,800"],["Avg Views","4,100"],["Shares","890"]] },
  { name:"Instagram", icon:"🟠", color:"#f97316", trend:"+5.1%",  stats:[["Followers","3,200"],["Reach Rate","11.2%"],["Saves","340"]] },
];

export default function Overview({ approvals, clips, publishQueue, navigateTo }) {
  const scheduled = publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="scheduled").length,0);
  return (
    <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>
      <Sect>Platform KPIs — This Week</Sect>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        {platforms.map(p => (
          <div key={p.name} style={{ background:C.card, border:"1px solid "+C.border, borderRadius:12, padding:18, flex:1, minWidth:150 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.icon+" "+p.name}</span>
              <Chip label={p.trend} color={C.green} />
            </div>
            {p.stats.map(([k,v]) => <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{ fontSize:11, color:C.muted }}>{k}</span><span style={{ fontSize:12, fontWeight:600 }}>{v}</span></div>)}
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        <Card>
          <Sect>Follower Growth — 4 Weeks</Sect>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={growthData}><CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="week" stroke={C.muted} fontSize={11} /><YAxis stroke={C.muted} fontSize={11} /><Tooltip contentStyle={{background:C.card,border:"1px solid "+C.border,borderRadius:8,fontSize:12}} /><Line type="monotone" dataKey="twitch" stroke={C.purple} strokeWidth={2} dot={false} /><Line type="monotone" dataKey="youtube" stroke="#ff4444" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="tiktok" stroke="#aaa" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <Sect>Clip Performance by Moment Type</Sect>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={clipPerfData}><CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="name" stroke={C.muted} fontSize={11} /><YAxis stroke={C.muted} fontSize={11} /><Tooltip contentStyle={{background:C.card,border:"1px solid "+C.border,borderRadius:8,fontSize:12}} /><Bar dataKey="views" fill={C.purple} radius={[4,4,0,0]} /><Bar dataKey="shares" fill={C.neon} radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { label:"Pending Approvals", val:approvals.length,  color:C.yellow, btn:"Approvals",    nav:"approvals"    },
          { label:"Clips in Studio",   val:clips.length,      color:C.purple, btn:"Studio",       nav:"studio"       },
          { label:"Posts Scheduled",   val:scheduled,         color:C.blue,   btn:"Publishing",   nav:"publishing"   },
          { label:"Active Deals",      val:4,                 color:C.green,  btn:"Monetization", nav:"monetization" },
        ].map((s,i) => (
          <Card key={i} style={{ textAlign:"center" }}>
            <div style={{ fontSize:28, fontWeight:900, color:s.color, marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>{s.label}</div>
            <button onClick={() => navigateTo(s.nav)} style={{ width:"100%", background:s.color+"15", border:"1px solid "+s.color+"33", borderRadius:7, padding:"6px 0", color:s.color, fontSize:11, fontWeight:700, cursor:"pointer" }}>{s.btn} →</button>
          </Card>
        ))}
      </div>
      {approvals.filter(a=>a.priority==="urgent").length > 0 && (
        <div onClick={() => navigateTo("approvals")} style={{ marginTop:16, background:C.red+"11", border:"1px solid "+C.red+"33", borderRadius:12, padding:14, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:700, color:C.red, marginBottom:2 }}>{"🔴 "+approvals.filter(a=>a.priority==="urgent").length+" Urgent Approvals Pending"}</div>
            <div style={{ fontSize:12, color:C.muted }}>{approvals.filter(a=>a.priority==="urgent").map(a=>a.title).join(" · ")}</div>
          </div>
          <span style={{ color:C.red }}>→</span>
        </div>
      )}
    </div>
  );
}
