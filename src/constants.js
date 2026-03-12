export const C = {
  purple:"#a855f7",purpleDim:"#7c3aed",neon:"#d946ef",
  bg:"#0a0a0f",card:"#12121a",card2:"#0e0e18",border:"#1e1e2e",
  text:"#e2e8f0",muted:"#64748b",
  green:"#22c55e",red:"#ef4444",yellow:"#eab308",
  blue:"#3b82f6",teal:"#14b8a6",orange:"#f97316",
};
export const pColor=(p)=>({urgent:C.red,high:C.neon,normal:C.purple,low:C.muted}[p]||C.muted);
export const pIcon=(p)=>({urgent:"🔴",high:"🟠",normal:"🟣",low:"⚪"}[p]||"");
export const dColor=(d)=>({"Content Studio":C.purple,"Platform Growth":C.blue,"Monetization":C.green,"Community":C.yellow,"Brand Strategy":C.neon,"Executive Office":C.orange}[d]||C.muted);
export const momentColor=(m)=>({skill:C.purple,discovery:C.teal,reaction:C.yellow,commentary:C.blue,entertainment:C.neon,experiment:C.orange}[m]||C.muted);
export const dealStatusColor=(s)=>({outreach_drafted:C.blue,interested:C.green,prospect:C.yellow,declined:C.red}[s]||C.muted);
export const dealStatusLabel=(s)=>({outreach_drafted:"Outreach Drafted",interested:"Interested",prospect:"Prospect",declined:"Declined"}[s]||s);
export const PLATFORM_META={
  tiktok:{icon:"⚫",label:"TikTok",color:"#aaaaaa",charLimit:2200,bestTimes:["7:00 PM","8:00 PM","9:00 PM"],aspectRatio:"9:16",maxDuration:"60s",notes:"Hook in first 2s. 4-6 hashtags. No external links."},
  youtube_shorts:{icon:"🔴",label:"YT Shorts",color:"#ff4444",charLimit:100,bestTimes:["12:00 PM","6:00 PM","9:00 PM"],aspectRatio:"9:16",maxDuration:"60s",notes:"SEO title under 100 chars. Vertical only."},
  instagram_reels:{icon:"🟠",label:"Instagram",color:"#f97316",charLimit:2200,bestTimes:["9:00 AM","11:00 AM","7:00 PM"],aspectRatio:"9:16",maxDuration:"90s",notes:"6-10 hashtags. First line is the hook."},
  youtube:{icon:"🔴",label:"YouTube",color:"#ff4444",charLimit:5000,bestTimes:["12:00 PM","3:00 PM","6:00 PM"],aspectRatio:"16:9",maxDuration:"∞",notes:"Title 60-70 chars. Description with chapters. 8-10 tags."},
};
export const REJECTION_REASONS=["Doesn't match brand voice","Wrong timing / posting window","Quality not there yet","Strategy misaligned","Needs more context","Custom note..."];
export const ALERTS=[
  {type:"warning",msg:"TikTok clip from Fri stream trending — 2 approvals time-sensitive"},
  {type:"info",msg:"Monday Experiment Stream in 18 hours — Stream Brief ready"},
  {type:"success",msg:"YouTube Shorts CTR up 14% this week vs last"},
  {type:"warning",msg:"SteelSeries pitch deadline: Today 9PM"},
];
export const BRAND_DOCTRINE={
  identity:{archetype:"Strategic Entertainer",traits:["Curious","Analytical","Entertaining","Ambitious","Interactive"],valueProp:"A creator who makes thinking visible — turning live experimentation, analysis, and audience interaction into content that is as informative as it is entertaining."},
  voice:{toneRules:[
    {do:"First-person active voice — I tried, I broke it, I figured out",dont:"Passive or impersonal framing"},
    {do:"Short punchy sentences for hooks and captions",dont:"Long qualifying clauses that delay the point"},
    {do:"Express genuine enthusiasm when something works or fails",dont:"Manufactured hype — INSANE, UNBELIEVABLE"},
    {do:"Speak to chat and audience as collaborators",dont:"Talking at the audience as a passive consumer"},
  ],bannedPhrases:[
    {phrase:"INSANE / UNBELIEVABLE / MIND-BLOWING",reason:"Performative hype."},
    {phrase:"Like and subscribe!",reason:"Generic creator trope."},
    {phrase:"In today's video...",reason:"Scripted convention."},
    {phrase:"I went VIRAL",reason:"Outcome-bragging."},
  ]},
};
