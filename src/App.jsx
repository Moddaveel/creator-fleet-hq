import { useState } from "react";
import { C } from "./constants";
import { initApprovals } from "./data/approvals";
import { seedClips } from "./data/clips";
import { initPublishQueue } from "./data/publishQueue";
import Chip from "./components/Chip";
import Toasts from "./components/Toasts";
import Overview from "./pages/Overview";
import ApprovalsPage from "./pages/ApprovalsPage";
import ContentStudioPage from "./pages/ContentStudioPage";
import PublishingPage from "./pages/PublishingPage";
import BrandStrategyPage from "./pages/BrandStrategyPage";
import MonetizationPage from "./pages/MonetizationPage";
import ExecutiveOfficePage from "./pages/ExecutiveOfficePage";

const NAV=[{id:"executive",label:"Executive Office",icon:"🏢"},{id:"overview",label:"Overview",icon:"🏠"},{id:"approvals",label:"Approvals",icon:"✅"},{id:"studio",label:"Content Studio",icon:"🎬"},{id:"publishing",label:"Publishing",icon:"📤"},{id:"brand",label:"Brand Strategy",icon:"🎯"},{id:"monetization",label:"Monetization",icon:"💰"}];

export default function App() {
  const [page,setPage]=useState("approvals");
  const [approvals,setApprovals]=useState(initApprovals);
  const [clips,setClips]=useState(seedClips);
  const [publishQueue,setPublishQueue]=useState(initPublishQueue);
  const [toasts,setToasts]=useState([]);
  const toast=(msg,color)=>{const id=Date.now();setToasts(t=>[...t,{id,msg,color}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200);};
  const handleApproveAndSchedule=(item,platforms)=>{setPublishQueue(q=>[...q,{pub_id:"pub_"+Date.now(),source_id:"approval_"+item.id,title:item.title,type:item.type,addedFrom:"Approval Queue",addedTs:Date.now(),platforms}]);};
  const urgentN=approvals.filter(x=>x.priority==="urgent").length;
  const scheduledN=publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="scheduled").length,0);
  const draftPubN=publishQueue.reduce((a,i)=>a+i.platforms.filter(p=>p.status==="draft").length,0);
  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Inter',system-ui,sans-serif",fontSize:14}}>
      <div style={{background:"#1a1025",borderBottom:"1px solid "+C.border,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:200}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:28,height:28,background:"linear-gradient(135deg,"+C.purple+","+C.neon+")",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>⚡</div>
          <span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.02em"}}>Creator Fleet HQ</span>
          <Chip label="LIVE" color={C.green}/>
          <Chip label="♻ Ralph Loop" color={C.purple}/>
          <Chip label="📤 Publishing Active" color={C.blue}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          {urgentN>0&&<div onClick={()=>setPage("approvals")} style={{background:C.red+"22",border:"1px solid "+C.red+"44",borderRadius:8,padding:"5px 12px",color:C.red,fontSize:12,fontWeight:700,cursor:"pointer"}}>{"🔴 "+urgentN+" Urgent"}</div>}
          {scheduledN>0&&<div onClick={()=>setPage("publishing")} style={{background:C.blue+"22",border:"1px solid "+C.blue+"44",borderRadius:8,padding:"5px 12px",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer"}}>{"📅 "+scheduledN+" Scheduled"}</div>}
        </div>
      </div>
      <div style={{background:"#110e1a",borderBottom:"1px solid "+C.border,padding:"0 20px",display:"flex",position:"sticky",top:54,zIndex:199,overflowX:"auto"}}>
        {NAV.map(n=>{const active=page===n.id;const badge=n.id==="approvals"&&approvals.length>0?approvals.length:n.id==="publishing"&&draftPubN>0?draftPubN:null;const badgeColor=n.id==="approvals"?C.red:C.yellow;return(<button key={n.id} onClick={()=>setPage(n.id)} style={{background:active?C.purple+"22":"transparent",border:"none",borderBottom:"2px solid "+(active?C.purple:"transparent"),color:active?C.purple:C.muted,padding:"11px 14px",fontSize:12,fontWeight:active?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}><span>{n.icon}</span><span>{n.label}</span>{badge&&<span style={{background:badgeColor,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:800}}>{badge}</span>}</button>);})}
      </div>
      <div>
        {page==="executive"&&<ExecutiveOfficePage approvals={approvals}/>}
        {page==="overview"&&<Overview approvals={approvals} clips={clips} publishQueue={publishQueue} navigateTo={setPage}/>}
        {page==="approvals"&&<ApprovalsPage items={approvals} setItems={setApprovals} toast={toast} onApproveAndSchedule={handleApproveAndSchedule}/>}
        {page==="studio"&&<ContentStudioPage clips={clips} setClips={setClips}/>}
        {page==="publishing"&&<PublishingPage publishQueue={publishQueue} setPublishQueue={setPublishQueue} toast={toast}/>}
        {page==="brand"&&<BrandStrategyPage/>}
        {page==="monetization"&&<MonetizationPage/>}
      </div>
      <Toasts toasts={toasts}/>
    </div>
  );
}
