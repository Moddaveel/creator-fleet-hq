import { useState, useEffect, useRef } from "react";
import { C } from "../constants";

const DIALOGUE = {
  // Brand Strategy
  architect: [
    "I'm the Brand Architect — I define what this channel stands for.",
    "My job is doctrine. Everything should trace back to the brand.",
    "Archetype: Strategic Entertainer. Curious, analytical, ambitious.",
    "I ask: does this content reinforce who we are?",
    "If it doesn't serve the brand, it doesn't get published.",
    "I review the Brand Doctrine quarterly and flag drift.",
    "Think of me as the creative constitution for this channel.",
    "Every platform has its own rules — I make sure the brand voice survives all of them.",
    "Differentiation is my obsession. Generic content is the enemy.",
    "I flag when content feels off-brand before it reaches the audience.",
    "The creator's identity is the product. I protect it.",
    "I don't just describe the brand — I defend it.",
    "Positioning is everything. I own that layer.",
    "I cross-reference every approval against Brand Doctrine.",
  ],
  analyst: [
    "I'm the Audience Analyst — I turn numbers into decisions.",
    "Twitch 8.4K followers, +8.2% this week. Watching.",
    "TikTok is up 31%. That's not luck — that's signal.",
    "YouTube CTR at 6.8%. Room to improve thumbnails.",
    "I track retention, reach, saves, shares — the full picture.",
    "When a format spikes, I flag it before you miss the window.",
    "Instagram reach rate 11.2% — above average. Keep going.",
    "I surface patterns you wouldn't notice manually.",
    "Every data point tells a story. I translate it.",
    "I don't just report numbers — I recommend actions.",
    "My job is to make the algorithm work for you, not against you.",
    "I compare week-over-week so you always know the trend direction.",
    "Underperformers get flagged. Overperformers get replicated.",
    "Data without context is noise. I provide both.",
  ],
  positioning: [
    "I'm the Positioning Strategist — I own the market context layer.",
    "You're in the analytical-entertainment niche. That's rare. Protect it.",
    "I monitor competitors so you don't have to.",
    "Recommendation is my output — decision is always yours.",
    "I identify white space: topics no one else is covering well.",
    "Positioning isn't just what you say — it's what you don't say.",
    "I ask: who else could make this content? If the answer is 'anyone', we have a problem.",
    "The goal is to be the only creator in your specific intersection.",
    "I flag when trends shift your niche positioning.",
    "Strategic relevance is a moving target. I keep it in sight.",
    "I think in quarters, not clips.",
    "The live stream IS the content. That's a positioning advantage.",
    "I track where your audience migrates and why.",
    "Consistency + distinctiveness = brand moat. That's what I build.",
  ],
  pillar: [
    "I'm the Content Pillar Manager — I keep content balanced.",
    "The 4 pillars: Commentary, Live Interaction, Entertainment, Building in Public.",
    "If one pillar dominates too long, I flag the imbalance.",
    "Pillars are guardrails — they keep the channel recognizable.",
    "I make sure every piece of content maps to a pillar.",
    "Pillar alignment affects the Ralph Loop score weighting.",
    "Building in Public is underutilized. Big opportunity there.",
    "Live Interaction clips tend to perform well — keep feeding that pillar.",
    "I track pillar distribution weekly across all platforms.",
    "Commentary content drives watch time. I watch that closely.",
    "Entertainment is the hook. Pillars are the depth.",
    "No pillar should go dark for more than two weeks.",
    "I report pillar health in the daily briefing.",
    "Think of me as the editorial calendar brain.",
    "Variety isn't random — it's strategic. That's my job.",
  ],
  qa: [
    "I'm the Brand QA Agent — nothing ships without passing me.",
    "QA Rubric: Voice Alignment, Pillar Alignment, Tone Compliance, Platform Fit. 100pts total.",
    "Pass mark is 75. Below that, it goes back for revisions.",
    "I'm not here to kill content — I'm here to protect the channel.",
    "Voice check: does this sound like the creator? That's first.",
    "I catch banned phrases before they reach the audience.",
    "No 'INSANE', no 'UNBELIEVABLE', no 'Like and subscribe'.",
    "Platform fit matters — what works on TikTok might not belong on YouTube.",
    "I score every package before it hits the approval queue.",
    "Think of me as the last line of defence before publish.",
    "Consistency builds trust. I enforce consistency.",
    "Tone compliance is subtle but critical — I catch the small drifts.",
    "A 90+ score from me means it's genuinely ready.",
    "I flag anything that feels performative rather than authentic.",
    "My rubric evolves as the brand evolves.",
  ],
  // Content Studio
  director: [
    "I'm the Studio Director — I coordinate all studio agents.",
    "The studio produces and packages. It does not publish. That's a different layer.",
    "Every clip goes through me before it moves downstream.",
    "I assign tasks, track progress, and resolve agent conflicts.",
    "Be precise. Be action-oriented. That's the studio ethos.",
    "I manage the pipeline from raw VOD to approved clip package.",
    "If something is stuck in the pipeline, I unstick it.",
    "I route work to the right agent for the right task.",
    "Speed and quality aren't opposites here — I optimize for both.",
    "My job is to make the studio invisible — everything should just flow.",
    "I track what's drafted, what's in review, what's approved.",
    "Studio output feeds the publishing queue. That's the chain.",
    "I flag bottlenecks before they become backlogs.",
    "Think of me as the production floor manager.",
  ],
  clip_hunter: [
    "I'm the Clip Hunter — I find the gold in your streams.",
    "Score range: 0–100. 90+ is elite. 80–89 is strong. 70–79 is conditional.",
    "I detect moments by emotional impact, clarity, shareability, and pillar alignment.",
    "Every VOD I watch, I'm asking: would this make someone stop scrolling?",
    "I prioritize reaction moments — audiences love watching discovery in real time.",
    "High viewer count during a moment boosts my score.",
    "I look for the unexpected. Predictable clips don't perform.",
    "Chat engagement is a strong signal — I track it.",
    "I surface 5–10 candidates per stream. You approve the best.",
    "A clip that scores 94 usually has a clear emotional peak.",
    "I feed my findings into the Ralph Loop for score refinement.",
    "Building in Public moments are underscored by most — not by me.",
    "Discovery moments are my favourite. They age well.",
    "I never score based on topic alone — execution matters more.",
    "Think of me as the highlight reel brain.",
  ],
  hook: [
    "I'm the Hook Architect — I write the first 2 seconds.",
    "Hooks stop the scroll. That's the only job.",
    "Brand voice: curious, analytical, never hype.",
    "I produce 3–5 hook options ranked by strength.",
    "No 'You won't believe...' — that's not us.",
    "The hook should create a question the viewer needs answered.",
    "Pattern interrupt is the fastest way to earn attention.",
    "I study what performed last week before writing new hooks.",
    "Platform matters — TikTok hooks are different from YouTube hooks.",
    "I rewrite hooks until they feel effortless. Effort shows.",
    "Short is almost always better. Tight is better than long.",
    "I test multiple angles: curiosity, contrast, stakes, identity.",
    "A great hook makes the viewer feel seen before the clip even starts.",
    "I don't write clickbait — I write honest hooks that perform.",
    "The hook is a promise. The clip keeps it.",
  ],
  caption: [
    "I'm the Caption Strategist — I write what gets the click after the hook.",
    "Platform-specific captions. No copy-paste across platforms.",
    "TikTok: punchy, 2200 chars max, 4–6 hashtags.",
    "YouTube Shorts: under 100 chars. SEO title only. Vertical only.",
    "Instagram Reels: first line is the hook. 6–10 hashtags.",
    "I never write 'Like and subscribe' — ever.",
    "Captions should feel like the creator wrote them personally.",
    "Hashtag strategy is part of my output — not an afterthought.",
    "I check character limits before submission. Always.",
    "The caption carries the context the clip can't show.",
    "I adapt tone by platform — TikTok is looser, YouTube is more formal.",
    "I flag captions that feel generic or templated.",
    "A great caption makes the algorithm and the human both happy.",
    "I cross-check against banned phrases every time.",
  ],
  repurposer: [
    "I'm the Content Repurposer — I find second lives for approved content.",
    "Every approved clip is a potential compilation, thread, or carousel.",
    "I look for thematic clusters across sessions.",
    "Top 5 clips from a month? That's a compilation waiting to happen.",
    "I identify reuse opportunities the studio would otherwise miss.",
    "Repurposing isn't recycling — it's extending reach with existing quality.",
    "I track what's been repurposed so we don't duplicate.",
    "Clip series are a strong format — I build the connective tissue.",
    "I flag when a rejected clip could work in a different format.",
    "Long-form clips can become threads. I map that conversion.",
    "I feed reuse opportunities back to the Director for scheduling.",
    "Compilation clips often outperform originals. That's my leverage.",
    "I think in formats, not just platforms.",
    "Nothing good should be wasted. That's my philosophy.",
  ],
  // Monetization
  dealflow: [
    "I'm the Deal Flow Agent — I manage the sponsorship pipeline.",
    "From prospect to close — that's my entire world.",
    "Creator profile: Twitch 8.4K, YouTube 5.1K, TikTok 22.8K +31%.",
    "Target audience: 18–28, tech-curious builders. That's the pitch.",
    "I never say 'I love your brand' in outreach. Ever.",
    "Cold outreach under 150 words. Lead with audience data.",
    "SteelSeries scored 87/100 brand fit. That's a strong lead.",
    "I track every prospect: outreach drafted, interested, closed, declined.",
    "Audience match is the first filter. Everything else comes after.",
    "I draft the outreach. You review. We send together.",
    "Integration risk is part of my scoring — I protect brand credibility.",
    "Deals that misalign with the audience don't make the pipeline.",
    "I follow up twice. After that, I move on.",
    "Revenue without audience damage. That's the goal.",
  ],
  outreach: [
    "I'm the Outreach Drafter — I write the cold emails.",
    "Under 150 words. Always. Shorter is more respectful of their time.",
    "I lead with specific audience data — not flattery.",
    "Clear, low-friction ask. One ask per email.",
    "No 'I love your brand' — it reads as fake immediately.",
    "I personalize every draft to the brand being pitched.",
    "Subject lines are half the open rate. I obsess over them.",
    "I write like the creator, not like a PR agency.",
    "Follow-up templates are in my toolkit — two max per prospect.",
    "I flag when a draft sounds too salesy — that kills deals.",
    "The goal is a reply, not a yes. Get the conversation started.",
    "I track what language performs well in follow-ups.",
    "Authenticity converts better than polish. I lean into that.",
    "Every draft goes through tone check before it leaves my hands.",
  ],
  sponsorship: [
    "I'm the Sponsorship Agent — I score brand fit and build packages.",
    "Three filters: audience match, brand alignment, integration risk.",
    "A score above 80 is worth pursuing. Below 60, I pass.",
    "I build the sponsorship deck after scoring confirms fit.",
    "Integration risk is real — a bad fit damages trust faster than it builds revenue.",
    "I think about how the integration looks to the audience first.",
    "Mid-roll, pre-roll, dedicated — I recommend the right format per brand.",
    "I track active deals and flag upcoming deliverables.",
    "Rate card is dynamic — I adjust based on platform growth.",
    "I protect the creator's credibility. That's non-negotiable.",
    "A brand that scores 90+ on fit is worth a reduced rate to land.",
    "I brief the creator on every deal before integration.",
    "Authenticity in the integration is worth more than polish.",
    "I flag renewal opportunities 30 days before a deal expires.",
  ],
  funnel: [
    "I'm the Funnel Agent — I track every dollar in and out.",
    "Revenue streams: Twitch subs/bits, YouTube AdSense, sponsorships, digital products.",
    "I track funnel health week over week.",
    "If a stream type converts better, I surface that signal.",
    "Digital products are the highest-margin play. I watch that line.",
    "I flag when a revenue stream is underperforming relative to audience size.",
    "AdSense per 1K views is a key metric I never ignore.",
    "Sub conversion rate on Twitch tells me how engaged the live audience is.",
    "I model future revenue scenarios based on current growth rates.",
    "The goal is diversified revenue — no single stream should dominate.",
    "I feed funnel data back into the deal flow scoring.",
    "Bits and subs are leading indicators of community strength.",
    "I track sponsor deal value against audience size benchmarks.",
    "Revenue without retention is a ceiling. I track both.",
  ],
  // Publishing
  scheduler: [
    "I'm the Scheduling Agent — I optimize publish timing.",
    "TikTok peak: 7–9PM EST. That's when I schedule.",
    "YouTube Shorts: 12PM and 6PM. Tested and confirmed.",
    "Instagram Reels: 9–11AM or 7PM.",
    "YouTube VOD: Thu–Fri 12PM. Highest initial velocity window.",
    "Timing is a multiplier. A great clip at the wrong time underperforms.",
    "I never schedule two pieces on the same platform within 4 hours.",
    "I track timezone distribution of the audience and adjust.",
    "Platform algorithms reward consistency — I build that cadence.",
    "I flag scheduling conflicts before they happen.",
    "Weekend timing varies — I adjust based on historical data.",
    "I coordinate with the formatter to make sure copy is ready before scheduling.",
    "A missed window is a missed compound — I don't let that happen.",
    "I keep a 48-hour publishing calendar at all times.",
  ],
  formatter: [
    "I'm the Platform Formatter — I adapt copy to each platform's spec.",
    "TikTok: hook in 2s, 4–6 hashtags, 2200 char limit.",
    "YT Shorts: under 100 chars, SEO title only.",
    "Instagram Reels: first line is hook, 6–10 hashtags.",
    "YouTube VOD: title 60–70 chars, description with chapters, 8–10 tags.",
    "Copy that works everywhere works nowhere. I prevent that.",
    "I check character limits before every submission.",
    "Platform specs change — I track updates so you don't have to.",
    "I adapt tone per platform, not just format.",
    "Hashtag strategy is platform-specific. I don't cross-post blindly.",
    "I reformat approved captions — I never rewrite the creative.",
    "The thumbnail brief is part of my output for YouTube.",
    "I flag when a hook won't survive the format change.",
    "Precision here compounds — a small spec error tanks distribution.",
  ],
  copywriter: [
    "I'm the Final Copy Agent — last eyes before publish.",
    "Hook lands in 2 seconds? Check. Banned phrases? Clear. Char limit? Respected.",
    "I am the final checkpoint. Nothing ships past me broken.",
    "I read every piece of copy aloud in my head. If it stumbles, it gets fixed.",
    "Banned phrases list is always open on my desk.",
    "Platform character limits are non-negotiable. I enforce them.",
    "I check for voice drift — does this still sound like the creator?",
    "One pass is all I need if the upstream work is clean.",
    "I flag, I don't rewrite — revisions go back to the right agent.",
    "Copy that's technically correct but feels off still fails my check.",
    "Consistency in tone is as important as consistency in posting.",
    "I look for anything that could read as inauthentic.",
    "The last 10% of quality lives in this step. I take it seriously.",
    "I cross-check against the Brand Doctrine on every pass.",
  ],
  analytics: [
    "I'm the Post Analytics Agent — I close the loop.",
    "Flag overperformers at 2x average. Flag underperformers below 50% avg.",
    "My findings feed back into Clip Hunter's score weighting. That's the Ralph Loop.",
    "If a format consistently outperforms, I escalate it to the Director.",
    "I track first 24 hours, 72 hours, and 7-day performance.",
    "Engagement rate matters more than raw views at this stage.",
    "I identify which moment types drive the most saves and shares.",
    "Saves on Instagram signal evergreen value — I weight those heavily.",
    "TikTok completion rate is my leading indicator on that platform.",
    "I compare performance against platform benchmarks, not just internal history.",
    "The Ralph Loop only works if I feed it accurate signals. I do.",
    "Underperformers aren't failures — they're data. I treat them that way.",
    "I generate a weekly performance summary every Monday.",
    "Platform algorithm changes show up in my data first.",
    "My job is to make the next clip better than the last.",
  ],
  // Executive Office
  cosa: [
    "I'm the Chief of Staff — your primary interface for everything.",
    "I coordinate across all agents and departments.",
    "If you don't know which agent to ask, ask me first.",
    "I keep the big picture while everyone else goes deep.",
    "Daily priorities, urgent items, decisions needed — that's my briefing.",
    "I translate creator intent into agent tasks.",
    "Nothing falls through the cracks on my watch.",
    "I escalate what needs escalating. I handle what I can handle.",
    "Think of me as the operating system for the whole fleet.",
    "I track what's been decided and what's still open.",
    "Cross-department conflicts come to me for resolution.",
    "I protect your focus by absorbing the coordination overhead.",
    "Weekly review is mine to run. Monthly strategy too.",
    "I know every agent's current workload. Ask me anytime.",
    "My job is to make your job feel like less work.",
  ],
  briefing: [
    "I'm the Daily Briefing Agent — I start every day with signal, not noise.",
    "Four sections: urgent today, due this week, performing well, needs attention.",
    "I pull from every department before compiling.",
    "A good briefing takes 90 seconds to read. I optimize for that.",
    "I flag the two most time-sensitive items at the top. Always.",
    "I don't summarize everything — I surface what matters.",
    "The briefing is generated fresh every morning.",
    "I cross-reference approvals, analytics, and scheduling in every brief.",
    "If the KPI Tracker has a spike, it's in the briefing.",
    "Sponsor deadlines live in my output — I don't let them sneak up.",
    "I'm the first thing you should read, not the last.",
    "I keep it tight. Three sentences per item, max.",
    "The briefing adapts to what's happening — no template fill-in.",
    "If something's on fire, the briefing leads with it.",
    "I exist so you always know what to do next.",
  ],
  router: [
    "I'm the Task Router — I direct work to the right agent.",
    "Tell me what you need. I'll tell you who owns it.",
    "Routing errors waste time. I eliminate them.",
    "I know every agent's scope and current capacity.",
    "If a task spans departments, I coordinate the handoff.",
    "I prevent agents from doing work that isn't theirs.",
    "Think of me as the internal postmaster.",
    "Ambiguous tasks get clarified before I route them.",
    "I track task status from assignment to completion.",
    "I flag when an agent is overloaded and redistribute.",
    "Priority tasks jump the queue. I manage that order.",
    "I don't do the work — I make sure the right agent does.",
    "Nothing gets lost in my system.",
    "I route, I track, I confirm. That's the loop.",
  ],
  kpi: [
    "I'm the KPI Tracker — I own all performance data.",
    "Twitch: 8,420 followers, 312 avg viewers, 24.3K clip views.",
    "YouTube: 5,100 subs, 1.2K hrs watch time, 6.8% CTR.",
    "TikTok: 22,800 followers, 4,100 avg views, 890 shares. +31% this week.",
    "Instagram: 3,200 followers, 11.2% reach rate, 340 saves.",
    "I update every metric after every stream and publish event.",
    "I flag anomalies — a sudden drop or spike both need attention.",
    "CTR and retention are the two metrics I weight most heavily.",
    "I feed the Ralph Loop with weekly performance deltas.",
    "I never round numbers. Precision matters in performance tracking.",
    "Benchmark comparison is part of my weekly output.",
    "I track the metrics that move the business, not vanity stats.",
    "Growth rate is more important than raw numbers at this stage.",
    "I store historical data so trends are always visible.",
    "Ask me anything about performance. I have the answer.",
  ],
};

export default function AgentButton({ agent, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const lines = DIALOGUE[agent.id] || [`I'm the ${agent.name}.`, agent.role];

  useEffect(() => {
    if (hovered) {
      setVisible(true);
      timerRef.current = setInterval(() => {
        setDialogueIdx(i => (i + 1) % lines.length);
      }, 5000);
    } else {
      clearInterval(timerRef.current);
      setTimeout(() => setVisible(false), 200);
    }
    return () => clearInterval(timerRef.current);
  }, [hovered, lines.length]);

  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={agent.name}
        style={{
          background: agent.color + "18",
          border: "1px solid " + agent.color + "44",
          borderRadius: 8,
          width: hovered ? 36 : 30,
          height: hovered ? 36 : 30,
          fontSize: hovered ? 17 : 14,
          cursor: "pointer",
          transition: "all 0.15s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {agent.icon}
      </button>

      {/* Thought bubble */}
      {visible && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: 220,
          background: "#1e1a2e",
          border: "1px solid " + agent.color + "55",
          borderRadius: 14,
          padding: "10px 13px",
          zIndex: 999,
          boxShadow: "0 4px 24px #00000066",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
        }}>
          {/* Agent name */}
          <div style={{ fontSize: 10, fontWeight: 800, color: agent.color, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {agent.icon} {agent.name}
          </div>
          {/* Dialogue */}
          <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.5, minHeight: 36 }}>
            "{lines[dialogueIdx]}"
          </div>
          {/* Dot indicators */}
          <div style={{ display: "flex", gap: 3, marginTop: 7, justifyContent: "center" }}>
            {lines.map((_, i) => (
              <div key={i} style={{
                width: i === dialogueIdx ? 12 : 4,
                height: 4,
                borderRadius: 2,
                background: i === dialogueIdx ? agent.color : agent.color + "33",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          {/* Bubble tail dots */}
          <div style={{ position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%)", display:"flex", gap:3, alignItems:"flex-end" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#1e1a2e", border:"1px solid "+agent.color+"44" }} />
            <div style={{ width:5, height:5, borderRadius:"50%", background:"#1e1a2e", border:"1px solid "+agent.color+"33", marginBottom:-2 }} />
            <div style={{ width:3, height:3, borderRadius:"50%", background:"#1e1a2e", border:"1px solid "+agent.color+"22", marginBottom:-4 }} />
          </div>
        </div>
      )}
    </div>
  );
}
