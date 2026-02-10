import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// ─── Palette ─────────────────────────────────────────────────────
const P = {
  bg: "#09090B",
  card: "#131316",
  border: "#1E1E22",
  text: "#ECECEF",
  muted: "#71717A",
  red: "#EF4444",
  green: "#22C55E",
  accent: "#A78BFA",
  font: "Inter, system-ui, sans-serif",
};

// deterministic pseudo-random
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const PASS = new Set([7, 23, 41]);

// ─── Section 1 — The Board (0:00–0:05) ──────────────────────────
const Board: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TOTAL = 50;
  const COLS = 10;
  const W = 140;
  const H = 88;
  const GAP = 10;
  const gridW = COLS * (W + GAP) - GAP;

  const statProgress = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 30, stiffness: 120, mass: 1 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: P.bg }}>
      {/* Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", width: gridW, gap: GAP }}>
        {Array.from({ length: TOTAL }).map((_, i) => {
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          const pass = PASS.has(i);

          // stagger entry
          const enter = spring({
            frame: frame - (row * 1.5 + col * 0.8),
            fps,
            config: { damping: 28, stiffness: 180, mass: 0.8 },
          });

          // stamp reveal
          const stampFrame = 40 + rand(i) * 30;
          const stamp = spring({
            frame: Math.max(0, frame - stampFrame),
            fps,
            config: { damping: 20, stiffness: 200, mass: 0.6 },
          });

          const tint = interpolate(stamp, [0, 1], [0, 0.55]);
          const bar = `rgba(255,255,255,${0.04 + rand(i + 99) * 0.03})`;

          return (
            <div
              key={i}
              style={{
                width: W,
                height: H,
                borderRadius: 8,
                backgroundColor: P.card,
                border: `1px solid ${P.border}`,
                overflow: "hidden",
                position: "relative",
                opacity: enter,
                transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
              }}
            >
              {/* skeleton */}
              <div style={{ padding: 8 }}>
                <div style={{ width: "35%", height: 3, backgroundColor: bar, borderRadius: 2, marginBottom: 6 }} />
                <div style={{ width: "100%", height: 16, backgroundColor: bar, borderRadius: 4, marginBottom: 5 }} />
                <div style={{ width: "75%", height: 3, backgroundColor: bar, borderRadius: 2, marginBottom: 3 }} />
                <div style={{ width: "55%", height: 3, backgroundColor: bar, borderRadius: 2, marginBottom: 6 }} />
                <div style={{ width: "28%", height: 5, backgroundColor: bar, borderRadius: 3 }} />
              </div>

              {/* tint */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: pass ? P.green : P.red,
                  opacity: tint,
                  borderRadius: 8,
                }}
              />

              {/* stamp */}
              {stamp > 0.01 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${stamp}) rotate(${pass ? -6 : -10}deg)`,
                      border: `2px solid ${pass ? P.green : P.red}`,
                      borderRadius: 4,
                      padding: "3px 10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: P.font,
                        fontWeight: 800,
                        color: pass ? P.green : P.red,
                        letterSpacing: 2,
                      }}
                    >
                      {pass ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stat */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          opacity: statProgress,
          transform: `translateY(${interpolate(statProgress, [0, 1], [20, 0])}px)`,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <span style={{ fontSize: 72, fontFamily: P.font, fontWeight: 800, color: P.red, letterSpacing: -2 }}>
          94%
        </span>
        <span style={{ fontSize: 28, fontFamily: P.font, fontWeight: 400, color: P.muted }}>
          fail rate
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 2 — The Problem (0:05–0:10) ────────────────────────
const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEnter = spring({
    frame: frame - 5,
    fps,
    config: { damping: 26, stiffness: 100, mass: 1 },
  });

  const scrollY = interpolate(frame, [50, 100], [0, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scrollSmooth = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 40, stiffness: 60, mass: 2 },
  });

  const actualScroll = scrollY * scrollSmooth;

  // heat blobs fade in
  const heatIn = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 30, stiffness: 80, mass: 1 },
  });

  // label
  const labelIn = spring({
    frame: Math.max(0, frame - 110),
    fps,
    config: { damping: 24, stiffness: 120, mass: 0.8 },
  });

  // right text
  const textIn = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 26, stiffness: 100, mass: 1 },
  });

  const text2In = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 26, stiffness: 100, mass: 1 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: P.bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
        {/* Phone */}
        <div
          style={{
            width: 300,
            height: 560,
            borderRadius: 28,
            border: `1.5px solid ${P.border}`,
            backgroundColor: P.card,
            overflow: "hidden",
            position: "relative",
            opacity: phoneEnter,
            transform: `translateY(${interpolate(phoneEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* status bar */}
          <div style={{ height: 32, borderBottom: `1px solid ${P.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 60, height: 6, borderRadius: 3, backgroundColor: P.border }} />
          </div>

          {/* content */}
          <div style={{ padding: 20, transform: `translateY(-${actualScroll}px)` }}>
            {/* nav */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <div style={{ width: 48, height: 6, backgroundColor: "#1E1E22", borderRadius: 3 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 16, height: 6, backgroundColor: "#1E1E22", borderRadius: 3 }} />
                <div style={{ width: 16, height: 6, backgroundColor: "#1E1E22", borderRadius: 3 }} />
              </div>
            </div>

            {/* vague headline */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontFamily: P.font, fontWeight: 600, color: "#444" }}>
                Welcome to Our Brand
              </span>
            </div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 9, fontFamily: P.font, color: "#333", lineHeight: 1.6 }}>
                We are passionate about delivering excellence and innovation.
              </span>
            </div>

            {/* filler blocks */}
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
              <div key={idx} style={{ marginBottom: 16 }}>
                <div style={{ width: "100%", height: 36, backgroundColor: "#18181B", borderRadius: 6, marginBottom: 6 }} />
                <div style={{ width: "80%", height: 4, backgroundColor: "#18181B", borderRadius: 2, marginBottom: 4 }} />
                <div style={{ width: "60%", height: 4, backgroundColor: "#18181B", borderRadius: 2 }} />
              </div>
            ))}

            {/* buried button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <div style={{ padding: "6px 20px", backgroundColor: "#1E1E22", borderRadius: 6 }}>
                <span style={{ fontSize: 9, fontFamily: P.font, fontWeight: 600, color: "#555" }}>Buy Now</span>
              </div>
            </div>
          </div>

          {/* heat blobs */}
          <div style={{ position: "absolute", inset: 0, opacity: heatIn * 0.6, pointerEvents: "none" }}>
            {[
              { x: 40, y: 100, s: 70 },
              { x: 200, y: 160, s: 50 },
              { x: 80, y: 260, s: 55 },
              { x: 220, y: 340, s: 60 },
              { x: 130, y: 420, s: 50 },
              { x: 60, y: 490, s: 45 },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: b.x - b.s / 2,
                  top: b.y - b.s / 2,
                  width: b.s,
                  height: b.s,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(239,68,68,0.4), transparent 70%)`,
                }}
              />
            ))}
          </div>

          {/* friction label */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: `translateX(-50%) translateY(${interpolate(labelIn, [0, 1], [10, 0])}px)`,
              opacity: labelIn,
              backgroundColor: "rgba(239,68,68,0.1)",
              border: `1px solid rgba(239,68,68,0.3)`,
              borderRadius: 8,
              padding: "8px 20px",
            }}
          >
            <span style={{ fontSize: 11, fontFamily: P.font, fontWeight: 700, color: P.red, letterSpacing: 2 }}>
              FRICTION DETECTED
            </span>
          </div>
        </div>

        {/* Right text */}
        <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 40 }}>
          <div
            style={{
              opacity: textIn,
              transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
            }}
          >
            <span style={{ fontSize: 14, fontFamily: P.font, fontWeight: 500, color: P.muted, letterSpacing: 3, textTransform: "uppercase" }}>
              The Problem
            </span>
          </div>

          <div
            style={{
              opacity: textIn,
              transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
            }}
          >
            <span style={{ fontSize: 40, fontFamily: P.font, fontWeight: 300, color: P.text, lineHeight: 1.4 }}>
              Users scroll twice just to find what you sell.
            </span>
          </div>

          <div
            style={{
              opacity: text2In,
              transform: `translateY(${interpolate(text2In, [0, 1], [20, 0])}px)`,
            }}
          >
            <span style={{ fontSize: 20, fontFamily: P.font, fontWeight: 400, color: P.muted, lineHeight: 1.6 }}>
              The offer is buried. The headline says nothing. You&apos;ve already lost them.
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 3 — The Fix (0:10–0:17) ────────────────────────────
const Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    {
      num: "01",
      title: "Delete the vague headline",
      desc: '"Welcome to [Brand]" tells them nothing.',
      color: P.red,
    },
    {
      num: "02",
      title: "Replace with a clear benefit",
      desc: '"We Save You 10 Hours a Week."',
      color: P.green,
    },
    {
      num: "03",
      title: "Pin your CTA to the top",
      desc: "Visible 100% of the time. No scrolling.",
      color: P.accent,
    },
  ];

  // header
  const headerIn = spring({
    frame: frame - 5,
    fps,
    config: { damping: 26, stiffness: 100, mass: 1 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: P.bg }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 80 }}>
        {/* header */}
        <div
          style={{
            opacity: headerIn,
            transform: `translateY(${interpolate(headerIn, [0, 1], [20, 0])}px)`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 14, fontFamily: P.font, fontWeight: 500, color: P.muted, letterSpacing: 3, textTransform: "uppercase" }}>
            The Fix
          </span>
          <span style={{ fontSize: 48, fontFamily: P.font, fontWeight: 300, color: P.text }}>
            Three changes. Instant clarity.
          </span>
        </div>

        {/* 3 cards */}
        <div style={{ display: "flex", gap: 40 }}>
          {steps.map((step, i) => {
            const cardIn = spring({
              frame: Math.max(0, frame - 30 - i * 18),
              fps,
              config: { damping: 22, stiffness: 120, mass: 0.9 },
            });

            return (
              <div
                key={i}
                style={{
                  width: 360,
                  backgroundColor: P.card,
                  border: `1px solid ${P.border}`,
                  borderRadius: 16,
                  padding: 40,
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  opacity: cardIn,
                  transform: `translateY(${interpolate(cardIn, [0, 1], [30, 0])}px)`,
                }}
              >
                {/* number */}
                <span style={{ fontSize: 14, fontFamily: P.font, fontWeight: 600, color: step.color, letterSpacing: 2 }}>
                  {step.num}
                </span>

                {/* title */}
                <span style={{ fontSize: 24, fontFamily: P.font, fontWeight: 600, color: P.text, lineHeight: 1.3 }}>
                  {step.title}
                </span>

                {/* desc */}
                <span style={{ fontSize: 16, fontFamily: P.font, fontWeight: 400, color: P.muted, lineHeight: 1.6 }}>
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 4 — The Result (0:17–0:20) ─────────────────────────
const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentIn = spring({
    frame: frame - 5,
    fps,
    config: { damping: 26, stiffness: 100, mass: 1 },
  });

  const notifIn = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 20, stiffness: 140, mass: 0.7 },
  });

  const ctaIn = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 22, stiffness: 100, mass: 0.9 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: P.bg }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 60 }}>
        {/* Purchase notification */}
        <div
          style={{
            opacity: notifIn,
            transform: `translateY(${interpolate(notifIn, [0, 1], [15, 0])}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            backgroundColor: "rgba(34,197,94,0.08)",
            border: `1px solid rgba(34,197,94,0.2)`,
            borderRadius: 12,
            padding: "16px 32px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: P.green,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ color: "white", fontSize: 18, fontWeight: 700 }}>&#10003;</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 16, fontFamily: P.font, fontWeight: 600, color: P.green }}>
              Purchase Confirmed
            </span>
            <span style={{ fontSize: 12, fontFamily: P.font, color: P.muted }}>
              Order #4821
            </span>
          </div>
        </div>

        {/* Main text */}
        <div
          style={{
            opacity: contentIn,
            transform: `translateY(${interpolate(contentIn, [0, 1], [20, 0])}px)`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <span style={{ fontSize: 48, fontFamily: P.font, fontWeight: 300, color: P.text }}>
            The 3-Second Rule
          </span>
          <span style={{ fontSize: 20, fontFamily: P.font, fontWeight: 400, color: P.muted, maxWidth: 500, lineHeight: 1.6 }}>
            If they can&apos;t find your offer in 3 seconds, you&apos;ve already lost them.
          </span>
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: ctaIn,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [15, 0])}px)`,
            backgroundColor: P.card,
            border: `1px solid ${P.border}`,
            borderRadius: 14,
            padding: "28px 56px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 18, fontFamily: P.font, fontWeight: 400, color: P.muted }}>
            Comment
          </span>
          <span style={{ fontSize: 22, fontFamily: P.font, fontWeight: 700, color: P.accent }}>
            &apos;CHECKLIST&apos;
          </span>
          <span style={{ fontSize: 18, fontFamily: P.font, fontWeight: 400, color: P.muted }}>
            for the PDF
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composition ─────────────────────────────────────────────────
export const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: P.bg }}>
      {/* Board: 0:00–0:05 (150 frames) */}
      <Sequence from={0} durationInFrames={150}>
        <Board />
      </Sequence>

      {/* The Problem: 0:05–0:10 (150 frames) */}
      <Sequence from={150} durationInFrames={150}>
        <Problem />
      </Sequence>

      {/* The Fix: 0:10–0:17 (210 frames) */}
      <Sequence from={300} durationInFrames={210}>
        <Fix />
      </Sequence>

      {/* The Result: 0:17–0:20 (90 frames) */}
      <Sequence from={510} durationInFrames={90}>
        <Result />
      </Sequence>
    </AbsoluteFill>
  );
};
