import{useState,useEffect}from"react";
import{C}from"../constants";
export default function Countdown({ts}){const[s,setS]=useState("");useEffect(()=>{const tick=()=>{const d=ts-Date.now();if(d<=0){setS("Overdue");return;}const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000);setS(h>0?h+"h "+m+"m":m+"m");};tick();const iv=setInterval(tick,30000);return()=>clearInterval(iv);},[ts]);const col=ts-Date.now()<6*3600000?C.red:ts-Date.now()<24*3600000?C.yellow:C.muted;return<span style={{color:col,fontSize:11,fontWeight:700}}>{"⏰ "+s}</span>;}
