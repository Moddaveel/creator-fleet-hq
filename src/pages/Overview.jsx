import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { C } from "../constants";
import Chip from "../components/Chip";
import Card from "../components/Card";
import Sect from "../components/Sect";

const allGrowthData = [
  {label:"Jan W1", twitch:6100,youtube:3800,tiktok:9200,instagram:2700},
  {label:"Jan W2", twitch:6250,youtube:3900,tiktok:9800,instagram:2730},
  {label:"Jan W3", twitch:6300,youtube:3950,tiktok:10400,instagram:2760},
  {label:"Jan W4", twitch:6420,youtube:4050,tiktok:11100,instagram:2790},
  {label:"Feb W1", twitch:6500,youtube:4100,tiktok:11800,instagram:2820},
  {label:"Feb W2", twitch:6600,youtube:4150,tiktok:12300,instagram:2850},
  {label:"Feb W3", twitch:6700,youtube:4200,tiktok:12900,instagram:2880},
  {label:"Feb W4", twitch:6820,youtube:4250,tiktok:13600,instagram:2910},
  {label:"Mar W1", twitch:6900,youtube:4300,tiktok:14000,instagram:2950},
  {label:"Mar W2", twitch:7050,youtube:4350,tiktok:14600,instagram:2980},
  {label:"Mar W3", twitch:7100,youtube:4420,tiktok:15100,instagram:3010},
  {label:"Mar W4", twitch:7200,youtube:4500,tiktok:15800,instagram:3040},
  {label:"Apr W1", twitch:7280,youtube:4560,tiktok:16400,instagram:3060},
  {label:"Apr W2", twitch:7350,youtube:4610,tiktok:17000,instagram:3080},
  {label:"Apr W3", twitch:7420,youtube:4660,tiktok:17700,instagram:3100},
  {label:"Apr W4", twitch:7500,youtube:4720,tiktok:18500,instagram:3120},
  {label:"May W1", twitch:7560,youtube:4770,tiktok:19100,instagram:3140},
  {label:"May W2", twitch:7620,youtube:4820,tiktok:19800,instagram:3155},
  {label:"May W3", twitch:7680,youtube:4870,tiktok:20400,instagram:3165},
  {label:"May W4", twitch:7740,youtube:4920,tiktok:21100,instagram:3175},
  {label:"Jun W1", twitch:7800,youtube:4960,tiktok:21700,instagram:3182},
  {label:"Jun W2", twitch:7850,youtube:5000,tiktok:22100,instagram:3188},
  {label:"Jun W3", twitch:7900,youtube:5040,tiktok:22500,instagram:3193},
  {label:"Jun W4", twitch:7960,youtube:5070,tiktok:22800,instagram:3196},
  {label:"Jul W1", twitch:8000,youtube:5090,tiktok:22900,instagram:3197},
  {label:"Jul W2", twitch:8060,youtube:5095,tiktok:23100,instagram:3198},
  {label:"Jul W3", twitch:8120,youtube:5098,tiktok:23400,instagram:3199},
  {label:"Jul W4", twitch:8180,youtube:5099,tiktok:23700,instagram:3199},
  {label:"Aug W1", twitch:8220,youtube:5100,tiktok:24000,instagram:3200},
  {label:"Aug W2", twitch:8260,youtube:5100,tiktok:24200,instagram:3200},
  {label:"Aug W3", twitch:8300,youtube:5101,tiktok:24500,instagram:3200},
  {label:"Aug W4", twitch:8340,youtube:5102,tiktok:24800,instagram:3201},
  {label:"Sep W1", twitch:8360,youtube:5103,tiktok:25000,instagram:3202},
  {label:"Sep W2", twitch:8370,youtube:5104,tiktok:25200,instagram:3203},
  {label:"Sep W3", twitch:8380,youtube:5105,tiktok:25500,instagram:3204},
  {label:"Sep W4", twitch:8390,youtube:5106,tiktok:25800,instagram:3205},
  {label:"Oct W1", twitch:8395,youtube:5107,tiktok:26000,instagram:3206},
  {label:"Oct W2", twitch:8398,youtube:5108,tiktok:26200,instagram:3207},
  {label:"Oct W3", twitch:8400,youtube:5109,tiktok:26400,instagram:3208},
  {label:"Oct W4", twitch:8405,youtube:5110,tiktok:26600,instagram:3209},
  {label:"Nov W1", twitch:8408,youtube:5111,tiktok:26800,instagram:3210},
  {label:"Nov W2", twitch:8410,youtube:5112,tiktok:27000,instagram:3211},
  {label:"Nov W3", twitch:8412,youtube:5113,tiktok:27200,instagram:3212},
  {label:"Nov W4", twitch:8414,youtube:5114,tiktok:27400,instagram:3213},
  {label:"Dec W1", twitch:8415,youtube:5115,tiktok:27600,instagram:3214},
  {label:"Dec W2", twitch:8416,youtube:5116,tiktok:27800,instagram:3215},
  {label:"Dec W3", twitch:8418,youtube:5117,tiktok:28000,instagram:3216},
  {label:"Dec W4", twitch:8420,youtube:5118,tiktok:28200,instagram:3217},
  {label:"Jan W1", twitch:8421,youtube:5119,tiktok:28400,instagram:3218},
  {label:"Jan W2", twitch:8422,youtube:5119,tiktok:28500,instagram:3218},
  {label:"Jan W3", twitch:8422,youtube:5120,tiktok:28600,instagram:3219},
  {label:"Jan W4", twitch:8420,youtube:5100,tiktok:22800,instagram:3200},
];

const ZOOM_OPTIONS = [
  { label:"1M", weeks:4  },
  { label:"3M", weeks:13 },
  { label:"6M", weeks:26 },
  { label:"1Y", weeks:52 },
];

const clipPerfData = [
  { name:"Skill",     views:18400, shares:620  },
  { name:"Discovery", views:24100, shares:890  },
  { name:"Reaction",  views:31200, shares:1420 },
];

const platforms = [
  { name:"Twitch",    icon:"🟣", accent:"#9146FF", bg:"#18061a", border:"rgba(145,70,255,0.45)",  trend:"+8.2%",  stats:[["Followers","8,420"],["Avg Viewers","312"],["Clip Views","24.3K"]] },
  { name:"YouTube",  icon:"🔴", accent:"#FF0000", bg:"#1a0a0a", border:"rgba(255,0,0,0.45)",     trend:"+12.4%", stats:[["Subscribers","5,100"],["Watch Time","1.2K hrs"],["CTR","6.8%"]] },
  { name:"TikTok",   icon:"⚫", accent:"#69c9d0", bg:"#08161a", border:"rgba(105,201,208,0.45)", trend:"+31.0%", stats:[["Followers","22,800"],["Avg Views","4,100"],["Shares","890"]] },
  { name:"Instagram",icon:"🟠", accent:"#E1306C", bg:"#1a080e", border:"rgba(225,48,108,0.45)", trend:"+5.1%",  stats:[["Followers","3,200"],["Reach Rate","11.2%"],["Saves","340"]] },
];

const statCards = [
  { label:"Pending Approvals", icon:"✅", accent:"#eab308", bg:"#16120a", border:"rgba(234,179,8,0.45)",   btn:"Approvals",   nav:"approvals"    },
  { label:"Clips in Studio",   icon:"🎬", accent:"#9146FF", bg:"#18061a", border:"rgba(145,70,255,0.45)",  btn:"Studio",      nav:"studio"       },
  { label:"Posts Scheduled",   icon:"🚀", accent:"#3b82f6", bg:"#080e1a", border:"rgba(59,130,246,0.45)",  btn:"Publishing",  nav:"publishing"   },
  { label:"Active Deals",      icon:"💰", accent:"#22c55e", bg:"#08160e", border:"rgba(34,197,94,0.45)",   btn:"Monetization",nav:"monetization" },
];

const fmtK = v => v >= 1000 ? (v/1000).toFixed(v>=10000?0:1)+"K" : v;

export default function Overview({ approvals, clips, publishQueue, navigateTo }) {
  const scheduled = publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="scheduled").length,0);
  const statVals = [approvals.length, clips.length, scheduled, 4];
  const [zoom, setZoom] = useState("1M");
  const urgentApprovals = approvals.filter(a => a.priority === "urgent");

  const growthData = useMemo(() => {
    const weeks = ZOOM_OPTIONS.find(o => o.label === zoom)?.weeks ?? 4;
    return allGrowthData.slice(-weeks);
  }, [zoom]);

  const tickFormatter = (val, idx) => {
    if (idx === 0) return val.split(" ")[0];
    const prev = growthData[idx - 1];
    if (!prev) return "";
    return val.split(" ")[0] !== prev.label.split(" ")[0] ? val.split(" ")[0] : "";
  };

  return (
    <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>

      {/* 1 — ALERTS */}
      {urgentApprovals.length > 0 && (
        <div onClick={() => navigateTo("approvals")} style={{ marginBottom:20, background:C.red+"11", border:"1px solid "+C.red+"33", borderRadius:12, padding:14, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:700, color:C.red, marginBottom:2 }}>{"🔴 "+urgentApprovals.length+" Urgent Approvals Pending"}</div>
            <div style={{ fontSize:12, color:C.muted }}>{urgentApprovals.map(a=>a.title).join(" · ")}</div>
          </div>
          <span style={{ color:C.red }}>→</span>
        </div>
      )}

      {/* 2 — PLATFORM KPIs */}
      <Sect>Platform KPIs — This Week</Sect>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        {platforms.map(p => (
          <div key={p.name} style={{ background:p.bg, border:"1px solid "+p.border, borderRadius:14, padding:18, flex:1, minWidth:150 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:34, height:34, background:p.accent+"20", border:"1px solid "+p.accent+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{p.icon}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:800, color:p.accent }}>{p.name}</div></div>
              <Chip label={p.trend} color={C.green} />
            </div>
            <div style={{ borderTop:"1px solid "+p.accent+"18", marginBottom:10 }} />
            {p.stats.map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:11, color:C.muted }}>{k}</span>
                <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 3 — CHARTS */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
        <Card>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <Sect>Follower Growth</Sect>
            <div style={{ display:"flex", gap:4 }}>
              {ZOOM_OPTIONS.map(o => (
                <button key={o.label} onClick={() => setZoom(o.label)} style={{ background: zoom===o.label ? C.purple+"33" : "transparent", border:"1px solid "+(zoom===o.label ? C.purple : "rgba(255,255,255,0.1)"), borderRadius:6, padding:"2px 8px", color: zoom===o.label ? C.purple : C.muted, fontSize:11, fontWeight:700, cursor:"pointer" }}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={growthData} margin={{top:4,right:8,left:-10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="label" stroke={C.muted} fontSize={10} tick={{fill:C.muted,fontSize:10}} tickFormatter={tickFormatter} interval={0} />
              <YAxis stroke={C.muted} fontSize={10} tick={{fill:C.muted,fontSize:10}} width={40} tickFormatter={fmtK} />
              <Tooltip contentStyle={{background:C.card,border:"1px solid rgba(255,255,255,0.13)",borderRadius:8,fontSize:12}} labelStyle={{color:C.text}} formatter={(v,n)=>[v.toLocaleString(), n.charAt(0).toUpperCase()+n.slice(1)]} />
              <Legend content={({ payload }) => (
                <div style={{ display:"flex", gap:16, justifyContent:"center", paddingTop:8 }}>
                  {payload.map(e => (
                    <div key={e.dataKey} style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <div style={{ width:24, height:3, background:e.color, borderRadius:2 }} />
                      <span style={{ fontSize:11, color:C.muted, textTransform:"capitalize" }}>{e.dataKey}</span>
                    </div>
                  ))}
                </div>
              )} />
              <Line type="monotone" dataKey="twitch"    stroke="#9146FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="youtube"   stroke="#FF0000" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="tiktok"    stroke="#69c9d0" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Sect>Clip Performance by Moment Type</Sect>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={clipPerfData} margin={{top:4,right:8,left:-10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" stroke={C.muted} fontSize={11} tick={{fill:C.muted,fontSize:11}} />
              <YAxis stroke={C.muted} fontSize={11} tick={{fill:C.muted,fontSize:11}} tickFormatter={fmtK} />
              <Tooltip contentStyle={{background:C.card,border:"1px solid "+C.border,borderRadius:8,fontSize:12}} formatter={(v,n)=>[v.toLocaleString(), n.charAt(0).toUpperCase()+n.slice(1)]} />
              <Legend content={() => (
                <div style={{ display:"flex", gap:16, justifyContent:"center", paddingTop:8 }}>
                  {[{key:"views",color:C.purple},{key:"shares",color:"#f59e0b"}].map(e => (
                    <div key={e.key} style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:12, height:12, background:e.color, borderRadius:3 }} />
                      <span style={{ fontSize:11, color:C.muted, textTransform:"capitalize" }}>{e.key}</span>
                    </div>
                  ))}
                </div>
              )} />
              <Bar dataKey="views"  fill={C.purple} radius={[4,4,0,0]} />
              <Bar dataKey="shares" fill="#f59e0b"   radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 4 — OPERATIONS */}
      <Sect>Operations</Sect>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {statCards.map((s, i) => (
          <div key={s.nav} style={{ background:s.bg, border:"1px solid "+s.border, borderRadius:14, padding:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:34, height:34, background:s.accent+"20", border:"1px solid "+s.accent+"44", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:s.accent }}>{s.label}</div>
            </div>
            <div style={{ borderTop:"1px solid "+s.accent+"18", marginBottom:10 }} />
            <div style={{ fontSize:32, fontWeight:900, color:s.accent, marginBottom:10 }}>{statVals[i]}</div>
            <button onClick={() => navigateTo(s.nav)} style={{ width:"100%", background:s.accent+"15", border:"1px solid "+s.accent+"33", borderRadius:7, padding:"6px 0", color:s.accent, fontSize:11, fontWeight:700, cursor:"pointer" }}>{s.btn} →</button>
          </div>
        ))}
      </div>

    </div>
  );
}
