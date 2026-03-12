import{C}from"../constants";
export default function Card({children,style={}}){return(<div style={{background:C.card,border:"1px solid "+C.border,borderRadius:12,padding:18,...style}}>{children}</div>);}
