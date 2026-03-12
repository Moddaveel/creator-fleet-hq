export const initApprovals=[
  {id:1,dept:"Content Studio",type:"Clip Bundle",priority:"urgent",title:"Friday Stream — Top 5 Clips",summary:"Moment Detection identified 8 high-value moments. Top 5 selected by score. Bundled for TikTok, YouTube Shorts, and Instagram Reels.",deadline:"Today 6PM",deadlineTs:Date.now()+3*3600000,agent:"Clip Production Agent",feedbackLoop:"Clip scores feed back into Moment Detection weighting.",tags:["clips","friday-stream"],subitems:[
    {id:"1a",title:"Clutch win at 1:23:45",platform:"TikTok",score:94,hook:"Chat said it was over. It wasn't.",caption:"Nobody expected that #clutch #gaming"},
    {id:"1b",title:"Live discovery — system breaks",platform:"YT Shorts",score:88,hook:"This wasn't supposed to happen.",caption:"When the experiment goes wrong #buildinginpublic"},
    {id:"1c",title:"Chat chaos reaction",platform:"TikTok+Reels",score:91,hook:"Chat called it before I did.",caption:"Chat had the RIGHT idea #twitchclips"},
  ]},
  {id:2,dept:"Content Studio",type:"YouTube Upload",priority:"high",title:"Experiment #14 VOD to YouTube",summary:"Long-Form Agent recommends uploading Monday Experiment Stream with auto-generated metadata.",deadline:"Tomorrow 12PM",deadlineTs:Date.now()+20*3600000,agent:"Long-Form Editor",feedbackLoop:"CTR and watch time will inform future VOD strategy.",tags:["youtube","long-form"],subitems:[
    {id:"2a",title:"Title",platform:"YouTube",content:"I Built a Live System That Broke On Stream (Experiment #14)"},
    {id:"2b",title:"Description",platform:"YouTube",content:"Full experiment stream — building a live automation system, breaking it, fixing it in real time.\n\n00:00 Intro\n08:20 Build Begins\n31:45 First Failure\n44:10 Debugging Live\n1:02:33 Recovery"},
  ]},
  {id:3,dept:"Monetization",type:"Outreach Draft",priority:"urgent",title:"SteelSeries Partnership Pitch",summary:"Deal Flow Agent identified SteelSeries as brand-fit sponsor (score 87/100). Draft outreach email generated.",deadline:"Today 9PM",deadlineTs:Date.now()+6*3600000,agent:"Deal Flow Agent",feedbackLoop:"Approval/rejection calibrates future brand fit scoring.",tags:["sponsorship","steelseries"],subitems:[
    {id:"3a",title:"Outreach Email",platform:"Email",content:"Hi,\n\nI am a live-stream creator focused on experiment-based content. 8.4K on Twitch (312 avg viewers), 22.8K on TikTok (+31%).\n\nAudience is 18-28, technically curious. SteelSeries products appear organically in my setup.\n\nHappy to share a media kit."},
  ]},
  {id:4,dept:"Platform Growth",type:"Strategy Memo",priority:"normal",title:"TikTok Format Shift Recommendation",summary:"TikTok Growth Agent detected 340% surge in experiment fail content. Recommends adapting 2 clips.",deadline:"This Week",deadlineTs:Date.now()+72*3600000,agent:"TikTok Growth Agent",feedbackLoop:"Performance of adapted clips validates the trend signal.",tags:["tiktok","strategy"],subitems:[
    {id:"4a",title:"Format Rec",platform:"TikTok",content:"Lead with the failure. Cut to 20-35s. Hook in first 2s must show the fail."},
  ]},
  {id:5,dept:"Community",type:"Engagement Pack",priority:"normal",title:"Friday Viewer Interaction Segment Pack",summary:"Engagement Agent prepared 3 interactive prompts and a viewer submission CTA for Friday stream.",deadline:"Friday 2PM",deadlineTs:Date.now()+96*3600000,agent:"Engagement Agent",feedbackLoop:"Engagement rates inform segment weighting in future stream briefs.",tags:["community","friday"],subitems:[
    {id:"5a",title:"Poll Prompt",platform:"Twitch",content:"What should I experiment with first?\n(A) Something I will definitely fail\n(B) Something chat thinks is impossible\n(C) Viewer challenge\n(D) Chaos wildcard"},
  ]},
  {id:6,dept:"Brand Strategy",type:"Quarterly Memo",priority:"low",title:"Q2 Brand Positioning Review",summary:"Positioning Agent completed quarterly competitive landscape analysis. 2 differentiation opportunities identified.",deadline:"Next Week",deadlineTs:Date.now()+168*3600000,agent:"Positioning Agent",feedbackLoop:"Approved changes update Brand Bible and inform Content Ideation.",tags:["brand","quarterly"],subitems:[
    {id:"6a",title:"Key Finding",platform:"Internal",content:"Building in Public underleveraged. Recommend 15% to 25% of output."},
  ]},
];
