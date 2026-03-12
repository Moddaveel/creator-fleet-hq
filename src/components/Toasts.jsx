import{C}from"../constants";
export default function Toasts({toasts}){return(<div style={{position:"fixed",bottom:24,right:24,display:"flex",flexDirection:"column",gap:8,zIndex:999}}>{toasts.map(t=>(<div key={t.id} style={{background:C.card,border:"1px solid "+t.color+"55",borderRadius:10,padding:"12px 18px",color:t.color,fontSize:13,fontWeight:600,minWidth:260}}>{t.msg}</div>))}</div>);}
