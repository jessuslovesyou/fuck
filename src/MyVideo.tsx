import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// ─── Brand Tokens ────────────────────────────────────────────────
const B = {
  white: "#FAFAFA",
  black: "#0A0A0A",
  muted: "#B0B0B0",
  subtle: "#E2E2E2",
  gridDot: "rgba(0,0,0,0.06)",
  font: "Inter, system-ui, sans-serif",
};

// ─── Dot Grid Background ────────────────────────────────────────
const DotGrid: React.FC<{ opacity: number }> = ({ opacity }) => {
  const DOT = 2;
  const GAP = 28;
  const cols = Math.ceil(1080 / GAP);
  const rows = Math.ceil(1920 / GAP);

  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              position: "absolute",
              left: c * GAP + GAP / 2,
              top: r * GAP + GAP / 2,
              width: DOT,
              height: DOT,
              borderRadius: "50%",
              backgroundColor: B.gridDot,
            }}
          />
        ))
      )}
    </div>
  );
};

// ─── Browser Mockup ──────────────────────────────────────────────
const BrowserMockup: React.FC<{
  children: React.ReactNode;
  enter: number;
}> = ({ children, enter }) => {
  return (
    <div
      style={{
        width: 920,
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${B.subtle}`,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 24px 80px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 48,
          backgroundColor: "#F6F6F6",
          borderBottom: `1px solid ${B.subtle}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 8,
        }}
      >
        {/* Traffic lights */}
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5F57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FEBC2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28C840" }} />

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            marginLeft: 16,
            height: 28,
            borderRadius: 6,
            backgroundColor: "#ECECEC",
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
          }}
        >
          <span style={{ fontSize: 11, fontFamily: B.font, fontWeight: 400, color: "#999" }}>
            yourwebsite.com
          </span>
        </div>
      </div>

      {/* Content area */}
      <div style={{ position: "relative", height: 1300 }}>
        {children}
      </div>
    </div>
  );
};

// ─── Skeleton Website (bad site) ─────────────────────────────────
const SkeletonSite: React.FC<{ reveal: number }> = ({ reveal }) => {
  const bar = (w: string, h: number, mb: number) => (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: "#F0F0F0",
        borderRadius: h > 8 ? 8 : 4,
        marginBottom: mb,
      }}
    />
  );

  return (
    <div style={{ padding: 32, opacity: reveal }}>
      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "#E8E8E8" }} />
          <div style={{ width: 80, height: 8, borderRadius: 4, backgroundColor: "#E8E8E8" }} />
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[48, 40, 56, 36].map((w, i) => (
            <div key={i} style={{ width: w, height: 6, borderRadius: 3, backgroundColor: "#EBEBEB" }} />
          ))}
        </div>
      </div>

      {/* Hero area - vague */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        {bar("60%", 10, 16)}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {bar("40%", 10, 12)}
        </div>
        <div style={{ height: 16 }} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          {bar("25%", 6, 8)}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {bar("30%", 6, 0)}
        </div>
      </div>

      {/* Hero image placeholder */}
      <div
        style={{
          width: "100%",
          height: 320,
          borderRadius: 12,
          backgroundColor: "#F3F3F3",
          marginBottom: 48,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: "#E6E6E6" }} />
      </div>

      {/* Feature blocks */}
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: 24,
              borderRadius: 12,
              backgroundColor: "#F7F7F7",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#EBEBEB" }} />
            {bar("70%", 7, 0)}
            {bar("90%", 5, 0)}
            {bar("60%", 5, 0)}
          </div>
        ))}
      </div>

      {/* More filler */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {bar("50%", 8, 0)}
        {bar("70%", 5, 0)}
        {bar("65%", 5, 0)}
      </div>
    </div>
  );
};

// ─── Countdown Number ────────────────────────────────────────────
const CountdownNumber: React.FC<{
  num: number;
  frame: number;
  fps: number;
  enterAt: number;
  exitAt: number;
}> = ({ num, frame, fps, enterAt, exitAt }) => {
  const enter = spring({
    frame: Math.max(0, frame - enterAt),
    fps,
    config: { damping: 18, stiffness: 160, mass: 0.7 },
  });

  const exit = exitAt < 999
    ? spring({
        frame: Math.max(0, frame - exitAt),
        fps,
        config: { damping: 22, stiffness: 200, mass: 0.5 },
      })
    : 0;

  const scale = interpolate(enter, [0, 1], [0.6, 1]) * interpolate(exit, [0, 1], [1, 0.85]);
  const opacity = enter * (1 - exit);

  if (opacity < 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontSize: 280,
          fontFamily: B.font,
          fontWeight: 800,
          color: B.black,
          opacity,
          transform: `scale(${scale})`,
          letterSpacing: -8,
          lineHeight: 1,
        }}
      >
        {num}
      </span>
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────
export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dot grid fades in
  const gridIn = spring({
    frame,
    fps,
    config: { damping: 40, stiffness: 60, mass: 1.5 },
  });

  // Browser enters
  const browserIn = spring({
    frame: frame - 4,
    fps,
    config: { damping: 24, stiffness: 100, mass: 1 },
  });

  // Skeleton site reveals
  const siteReveal = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 30, stiffness: 80, mass: 1 },
  });

  // Countdown timing: 7 (frame 8-36), 6 (frame 36-64), 5 (frame 64-90)
  const BEATS = [
    { num: 7, enter: 8, exit: 30 },
    { num: 6, enter: 34, exit: 58 },
    { num: 5, enter: 62, exit: 999 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: B.white,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Dot grid */}
      <DotGrid opacity={gridIn * 0.5} />

      {/* Browser */}
      <BrowserMockup enter={browserIn}>
        <SkeletonSite reveal={siteReveal} />

        {/* Countdown overlay */}
        {BEATS.map((b) => (
          <CountdownNumber
            key={b.num}
            num={b.num}
            frame={frame}
            fps={fps}
            enterAt={b.enter}
            exitAt={b.exit}
          />
        ))}

        {/* Subtle scrim behind numbers */}
        {frame > 6 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.75)",
              opacity: interpolate(
                spring({
                  frame: Math.max(0, frame - 6),
                  fps,
                  config: { damping: 30, stiffness: 80, mass: 1 },
                }),
                [0, 1],
                [0, 1]
              ),
            }}
          />
        )}

        {/* Numbers on top of scrim */}
        {BEATS.map((b) => (
          <CountdownNumber
            key={`top-${b.num}`}
            num={b.num}
            frame={frame}
            fps={fps}
            enterAt={b.enter}
            exitAt={b.exit}
          />
        ))}
      </BrowserMockup>
    </AbsoluteFill>
  );
};
