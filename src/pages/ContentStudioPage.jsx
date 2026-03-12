import { useState } from "react";
import { C, momentColor } from "../constants";
import { CS_AGENTS } from "../data/agents";
import Chip from "../components/Chip";
import AgentChat from "../components/AgentChat";

const PLATFORMS = [
  {
    id: "youtube",
    label: "YouTube",
    icon: "🔴",
    accent: "#ff4444",
    bg: "#1a0a0a",
    border: "#ff444433",
    keys: ["youtube"],
    description: "Long-form VODs & full uploads"
  },
  {
    id: "youtube_shorts",
    label: "YouTube Shorts",
    icon: "🔴",
    accent: "#ff4444",
    bg: "#1a0a0a",
    border: "#ff444433",
    keys: ["youtube_shorts"],
    description: "Vertical short-form clips"
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "⬛",
    accent: "#69c9d0",
    bg: "#09171a",
    border: "#69c9d033",
    keys: ["tiktok"],
    description: "Short clips · max 60s · hook in 2s"
  },
  {
    id: "instagram_reels",
    label: "Instagram Reels",
    icon: "🟠",
    accent: "#f97316",
    bg: "#1a0f08",
    border: "#f9731633",
    keys: ["instagram_reels"],
    description: "Reels · 6–10 hashtags · first line is the hook"
  },
];

const STATUSES = [
  { key: "ready_for_review", label: "Review",   color: "#eab308" },
  { key: "approved",         label: "Approved", color: "#22c55e" },
  { key: "rejected",         label: "Rejected", color: "#ef4444" },
];

function ClipCard({ clip, accentColor }) {
  const sc = clip.clip_score;
  const scoreColor = sc >= 90 ? "#22c55e" : sc >= 80 ? "#eab308" : sc >= 70 ? "#f97316" : "#ef4444";
  return (
    <div style={{
      background: "#ffffff08",
      border: "1px solid " + accentColor + "22",
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, flex: 1, marginRight: 8, color: C.text, lineHeight: 1.4 }}>
          {clip.clip_summary.slice(0, 60)}...
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: scoreColor, flexShrink: 0 }}>{sc}</div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Chip label={clip.moment_type} color={momentColor(clip.moment_type)} sm />
        <Chip label={clip.content_pillar} color={C.purple} sm />
      </div>
    </div>
  );
}

function PlatformSection({ platform, clips }) {
  const platformClips = clips.filter(c =>
    platform.keys.some(k => c.platforms?.includes(k))
  );

  return (
    <div style={{
      background: platform.bg,
      border: "1px solid " + platform.border,
      borderRadius: 14,
      padding: "20px",
      marginBottom: 16,
    }}>
      {/* Platform Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{
          width: 36, height: 36,
          background: platform.accent + "22",
          border: "1px solid " + platform.accent + "55",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18
        }}>
          {platform.icon}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: platform.accent }}>{platform.label}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{platform.description}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {STATUSES.map(s => {
            const count = platformClips.filter(c => c.status === s.key).length;
            return count > 0 ? (
              <span key={s.key} style={{
                background: s.color + "22",
                color: s.color,
                borderRadius: 8,
                padding: "2px 8px",
                fontSize: 11,
                fontWeight: 700
              }}>
                {count} {s.label}
              </span>
            ) : null;
          })}
          {platformClips.length === 0 && (
            <span style={{ fontSize: 11, color: C.muted }}>No content yet</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid " + platform.accent + "22", margin: "14px 0" }} />

      {/* Status Columns */}
      {platformClips.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {STATUSES.map(s => {
            const group = platformClips.filter(c => c.status === s.key);
            return (
              <div key={s.key}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: 10
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {s.label}
                  </span>
                  <span style={{
                    background: s.color + "22", color: s.color,
                    borderRadius: 8, padding: "1px 7px",
                    fontSize: 10, fontWeight: 700
                  }}>{group.length}</span>
                </div>
                {group.length > 0
                  ? group.map(c => <ClipCard key={c.clip_id} clip={c} accentColor={platform.accent} />)
                  : <div style={{
                      border: "1px dashed " + platform.accent + "22",
                      borderRadius: 8, padding: "14px 0",
                      textAlign: "center", color: C.muted, fontSize: 11
                    }}>Empty</div>
                }
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          textAlign: "center", padding: "20px 0",
          color: C.muted, fontSize: 12
        }}>
          No clips routed to {platform.label} yet — deposit a VOD to get started
        </div>
      )}
    </div>
  );
}

export default function ContentStudioPage({ clips, setClips }) {
  const [chatAgent, setChatAgent] = useState(null);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>Content Studio</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            Clips routed by platform — ready for review, approval, or rejection
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {CS_AGENTS.map(a => (
            <button key={a.id} onClick={() => setChatAgent(a)} title={a.name}
              style={{ background: a.color + "15", border: "1px solid " + a.color + "33", borderRadius: 7, width: 30, height: 30, fontSize: 14, cursor: "pointer" }}>
              {a.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Sections */}
      {PLATFORMS.map(p => (
        <PlatformSection key={p.id} platform={p} clips={clips} />
      ))}

      {chatAgent && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
