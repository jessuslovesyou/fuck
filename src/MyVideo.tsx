import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";

// ─── Constants ───────────────────────────────────────────────────
const C = {
  bg: "#0A0A0A",
  white: "#F5F5F5",
  grey: "#666666",
  greyLight: "#333333",
  red: "#FF3B3B",
  redDark: "#CC2222",
  green: "#2ECC71",
  greenDark: "#1B9E50",
  orange: "#FF6B35",
  hotPink: "#FF3CAC",
  blue: "#2B86C5",
  gradient: "linear-gradient(135deg, #FF6B35, #FF3CAC, #784BA0, #2B86C5)",
  font: "Inter, Helvetica, Arial, sans-serif",
};

// ─── Helpers ─────────────────────────────────────────────────────
// Deterministic pseudo-random based on index
const pseudoRandom = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Which 3 out of 50 pass (deterministic)
const PASS_INDICES = new Set([7, 23, 41]);

// ─── Scene 1: 50-Thumbnail Grid (0:00–0:03 = frames 0–89) ──────
const ThumbnailGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Grid appears (0–30)
  // Phase 2: Stamps appear (30–65)
  // Phase 3: "94% FAIL RATE" text (55–89)

  const TOTAL = 50;
  const COLS = 10;
  const ROWS = 5;
  const CELL_W = 152;
  const CELL_H = 100;
  const GAP = 8;
  const gridW = COLS * (CELL_W + GAP) - GAP;
  const gridH = ROWS * (CELL_H + GAP) - GAP;

  // Stat counter
  const failCount = Math.min(
    47,
    Math.floor(
      interpolate(frame, [30, 60], [0, 47], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  const statOpacity = interpolate(frame, [55, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const statScale = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: C.bg,
      }}
    >
      {/* Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: gridW,
          gap: GAP,
          position: "relative",
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => {
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          const delay = (row * 2 + col) * 0.6;
          const isPassing = PASS_INDICES.has(i);

          // Card appear
          const cardOpacity = interpolate(frame, [delay, delay + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const cardScale = interpolate(frame, [delay, delay + 8], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          // Stamp appear
          const stampDelay = 30 + pseudoRandom(i) * 25;
          const stampOpacity = interpolate(frame, [stampDelay, stampDelay + 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const stampScale = spring({
            frame: Math.max(0, frame - stampDelay),
            fps,
            config: { damping: 6, stiffness: 200, mass: 0.3 },
          });

          // Color tint
          const tintOpacity = interpolate(frame, [stampDelay, stampDelay + 6], [0, 0.7], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Fake website content bars
          const barColor = `rgba(255,255,255,${0.08 + pseudoRandom(i + 100) * 0.06})`;

          return (
            <div
              key={i}
              style={{
                width: CELL_W,
                height: CELL_H,
                borderRadius: 6,
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                position: "relative",
                overflow: "hidden",
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
              }}
            >
              {/* Fake website skeleton */}
              <div style={{ padding: 8 }}>
                {/* Nav bar */}
                <div
                  style={{
                    width: "40%",
                    height: 4,
                    backgroundColor: barColor,
                    borderRadius: 2,
                    marginBottom: 6,
                  }}
                />
                {/* Hero block */}
                <div
                  style={{
                    width: "100%",
                    height: 20,
                    backgroundColor: barColor,
                    borderRadius: 3,
                    marginBottom: 5,
                  }}
                />
                {/* Text lines */}
                <div style={{ width: "80%", height: 3, backgroundColor: barColor, borderRadius: 1, marginBottom: 3 }} />
                <div style={{ width: "60%", height: 3, backgroundColor: barColor, borderRadius: 1, marginBottom: 3 }} />
                <div style={{ width: "70%", height: 3, backgroundColor: barColor, borderRadius: 1, marginBottom: 5 }} />
                {/* Small button */}
                <div style={{ width: "30%", height: 6, backgroundColor: barColor, borderRadius: 2 }} />
              </div>

              {/* Red/Green tint overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: isPassing ? C.green : C.red,
                  opacity: tintOpacity,
                  borderRadius: 6,
                }}
              />

              {/* FAIL / PASS stamp */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: stampOpacity,
                }}
              >
                <div
                  style={{
                    transform: `scale(${stampScale}) rotate(${isPassing ? -8 : -12}deg)`,
                    border: `3px solid ${isPassing ? C.green : C.red}`,
                    borderRadius: 4,
                    padding: "4px 12px",
                    backgroundColor: isPassing ? "rgba(46,204,113,0.15)" : "rgba(255,59,59,0.15)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontFamily: C.font,
                      fontWeight: 900,
                      color: isPassing ? C.green : C.red,
                      letterSpacing: "3px",
                    }}
                  >
                    {isPassing ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 94% FAIL RATE overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          opacity: statOpacity,
          transform: `scale(${statScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            background: "rgba(10,10,10,0.9)",
            border: `2px solid ${C.red}`,
            borderRadius: 12,
            padding: "16px 48px",
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontFamily: C.font,
              fontWeight: 900,
              color: C.red,
            }}
          >
            94% FAIL RATE
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Heatmap Zoom (0:03–0:08 = frames 0–149) ──────────
const HeatmapZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Zoom into a mobile phone frame (0–20)
  // Phase 2: Heatmap overlay appears scattered (20–60)
  // Phase 3: Cursor scrolls down (60–110)
  // Phase 4: "FRICTION DETECTED" warning (100–149)

  const phoneScale = spring({
    frame: frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.6 },
  });

  // Heatmap blob opacity
  const heatOpacity = interpolate(frame, [20, 40], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scroll position (cursor/content moves down)
  const scrollY = interpolate(frame, [60, 110], [0, 280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Cursor position
  const cursorOpacity = interpolate(frame, [55, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Warning
  const warningOpacity = interpolate(frame, [100, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const warningScale = spring({
    frame: Math.max(0, frame - 100),
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.4 },
  });

  // Warning flash
  const flashIntensity = frame > 100 && frame < 130 ? (Math.sin(frame * 0.8) > 0 ? 1 : 0.7) : 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: C.bg,
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: 340,
          height: 620,
          borderRadius: 32,
          border: "3px solid #333",
          backgroundColor: "#111",
          overflow: "hidden",
          transform: `scale(${phoneScale})`,
          position: "relative",
        }}
      >
        {/* Phone notch */}
        <div
          style={{
            width: 120,
            height: 24,
            backgroundColor: "#111",
            borderRadius: "0 0 16px 16px",
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            border: "1px solid #333",
            borderTop: "none",
          }}
        />

        {/* Scrollable content area */}
        <div style={{ padding: "36px 16px 16px", transform: `translateY(-${scrollY}px)` }}>
          {/* Fake nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 60, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 20, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
              <div style={{ width: 20, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
              <div style={{ width: 20, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
            </div>
          </div>

          {/* Vague hero */}
          <div style={{ marginBottom: 16, padding: "20px 0" }}>
            <span style={{ fontSize: 16, fontFamily: C.font, fontWeight: 600, color: "#555" }}>
              Welcome to Our Brand
            </span>
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 10, fontFamily: C.font, color: "#444", lineHeight: 1.5 }}>
                We are passionate about delivering excellence and innovation to our valued customers.
              </span>
            </div>
          </div>

          {/* Filler content blocks */}
          {[1, 2, 3, 4, 5].map((_, idx) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <div style={{ width: "100%", height: 50, backgroundColor: "#1A1A1A", borderRadius: 6, marginBottom: 6 }} />
              <div style={{ width: "85%", height: 5, backgroundColor: "#1E1E1E", borderRadius: 2, marginBottom: 3 }} />
              <div style={{ width: "65%", height: 5, backgroundColor: "#1E1E1E", borderRadius: 2 }} />
            </div>
          ))}

          {/* Button buried way down */}
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                padding: "8px 24px",
                backgroundColor: "#2A2A2A",
                borderRadius: 6,
                border: "1px solid #444",
              }}
            >
              <span style={{ fontSize: 10, fontFamily: C.font, fontWeight: 600, color: "#888" }}>
                Buy Now
              </span>
            </div>
          </div>
        </div>

        {/* Heatmap overlay - scattered blobs */}
        <div style={{ position: "absolute", inset: 0, opacity: heatOpacity, pointerEvents: "none" }}>
          {/* Random scattered heat spots - confused user behavior */}
          {[
            { x: 20, y: 80, size: 80, color: "rgba(255,165,0,0.35)" },
            { x: 180, y: 150, size: 60, color: "rgba(255,100,0,0.25)" },
            { x: 70, y: 250, size: 50, color: "rgba(255,200,0,0.2)" },
            { x: 240, y: 320, size: 70, color: "rgba(255,130,0,0.3)" },
            { x: 140, y: 400, size: 55, color: "rgba(255,180,0,0.2)" },
            { x: 50, y: 480, size: 65, color: "rgba(255,80,0,0.25)" },
            { x: 200, y: 200, size: 40, color: "rgba(255,220,0,0.15)" },
          ].map((blob, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: blob.x - blob.size / 2,
                top: blob.y - blob.size / 2,
                width: blob.size,
                height: blob.size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
              }}
            />
          ))}
        </div>

        {/* Cursor hand */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 280 + scrollY * 0.3,
            opacity: cursorOpacity,
            fontSize: 28,
            zIndex: 15,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        >
          <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
            <path d="M5 2L5 18L9 14L13 22L16 20L12 12L18 12L5 2Z" fill="white" stroke="#333" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* FRICTION DETECTED warning */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          opacity: warningOpacity * flashIntensity,
          transform: `scale(${warningScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(255,59,59,0.1)",
            border: `2px solid ${C.red}`,
            borderRadius: 12,
            padding: "18px 40px",
          }}
        >
          <span style={{ fontSize: 36 }}>&#9888;&#65039;</span>
          <span
            style={{
              fontSize: 36,
              fontFamily: C.font,
              fontWeight: 800,
              color: C.red,
              letterSpacing: "3px",
            }}
          >
            FRICTION DETECTED
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: The Fix (0:08–0:15 = frames 0–209) ────────────────
const TheFix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Show the bad headline (0–30)
  // Phase 2: Strikethrough / delete animation (30–60)
  // Phase 3: New headline types in (60–100)
  // Phase 4: Button rips from footer to top (100–160)
  // Phase 5: Hold the final state (160–209)

  // Bad headline strike-through
  const strikeWidth = interpolate(frame, [30, 50], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const badOpacity = interpolate(frame, [50, 65], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // New headline appears
  const newHeadlineText = "We Save You 10 Hours a Week.";
  const charsToShow = Math.floor(
    interpolate(frame, [65, 100], [0, newHeadlineText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedText = newHeadlineText.slice(0, charsToShow);
  const showCursor = frame >= 65 && frame <= 110 && Math.floor(frame / 8) % 2 === 0;

  // New headline opacity
  const newHeadlineOpacity = interpolate(frame, [60, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button animation - rip from bottom to top
  const buttonInFooter = frame < 110;
  const buttonY = interpolate(frame, [110, 145], [400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  const buttonGlow = interpolate(frame, [145, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Step labels
  const step1Opacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const step2Opacity = interpolate(frame, [60, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const step3Opacity = interpolate(frame, [105, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Sticky header" label
  const stickyLabelOpacity = interpolate(frame, [150, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone scale in
  const phoneScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: C.bg,
      }}
    >
      {/* "THE FIX" header */}
      <div style={{ position: "absolute", top: 60, left: 80 }}>
        <span
          style={{
            fontSize: 18,
            fontFamily: C.font,
            fontWeight: 400,
            color: C.grey,
            letterSpacing: "6px",
            textTransform: "uppercase",
          }}
        >
          The Fix
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        {/* Phone mockup */}
        <div
          style={{
            width: 340,
            height: 620,
            borderRadius: 32,
            border: "3px solid #333",
            backgroundColor: "#111",
            overflow: "hidden",
            transform: `scale(${phoneScale})`,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Notch */}
          <div
            style={{
              width: 120,
              height: 24,
              backgroundColor: "#111",
              borderRadius: "0 0 16px 16px",
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              border: "1px solid #333",
              borderTop: "none",
            }}
          />

          {/* Sticky CTA button at top (after animation) */}
          {!buttonInFooter && (
            <div
              style={{
                position: "absolute",
                top: 30,
                left: 0,
                right: 0,
                zIndex: 15,
                display: "flex",
                justifyContent: "center",
                padding: "8px 16px",
                backgroundColor: "rgba(17,17,17,0.95)",
                transform: `translateY(${buttonY}px)`,
              }}
            >
              <div
                style={{
                  padding: "10px 40px",
                  background: C.gradient,
                  borderRadius: 8,
                  boxShadow: `0 0 ${buttonGlow * 30}px rgba(255,60,172,${buttonGlow * 0.5})`,
                }}
              >
                <span style={{ fontSize: 13, fontFamily: C.font, fontWeight: 700, color: "white", letterSpacing: "1px" }}>
                  BUY NOW
                </span>
              </div>
            </div>
          )}

          <div style={{ padding: "36px 16px 16px" }}>
            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 60, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 20, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
                <div style={{ width: 20, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
              </div>
            </div>

            {/* Hero section */}
            <div style={{ marginBottom: 16, padding: "16px 0", minHeight: 80 }}>
              {/* Old headline with strikethrough */}
              <div style={{ position: "relative", opacity: badOpacity, marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontFamily: C.font, fontWeight: 600, color: "#555" }}>
                  Welcome to Our Brand
                </span>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: `${strikeWidth}%`,
                    height: 3,
                    backgroundColor: C.red,
                    borderRadius: 2,
                  }}
                />
              </div>

              {/* New headline */}
              <div style={{ opacity: newHeadlineOpacity }}>
                <span style={{ fontSize: 18, fontFamily: C.font, fontWeight: 800, color: C.white }}>
                  {typedText}
                </span>
                {showCursor && (
                  <span style={{ fontSize: 18, fontFamily: C.font, fontWeight: 300, color: C.hotPink }}>|</span>
                )}
              </div>
            </div>

            {/* Filler content */}
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} style={{ marginBottom: 12 }}>
                <div style={{ width: "100%", height: 40, backgroundColor: "#1A1A1A", borderRadius: 6, marginBottom: 5 }} />
                <div style={{ width: "80%", height: 4, backgroundColor: "#1E1E1E", borderRadius: 2, marginBottom: 3 }} />
                <div style={{ width: "60%", height: 4, backgroundColor: "#1E1E1E", borderRadius: 2 }} />
              </div>
            ))}

            {/* Footer button (before it moves) */}
            {buttonInFooter && (
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    padding: "8px 24px",
                    backgroundColor: "#2A2A2A",
                    borderRadius: 6,
                    border: "1px solid #444",
                  }}
                >
                  <span style={{ fontSize: 10, fontFamily: C.font, fontWeight: 600, color: "#888" }}>
                    Buy Now
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Header label */}
          {stickyLabelOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                top: 32,
                right: -130,
                opacity: stickyLabelOpacity,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 20, height: 2, background: C.green }} />
              <span style={{ fontSize: 12, fontFamily: C.font, fontWeight: 600, color: C.green, letterSpacing: "1px" }}>
                STICKY HEADER
              </span>
            </div>
          )}
        </div>

        {/* Step indicators on the right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40, maxWidth: 500 }}>
          {/* Step 1 */}
          <div style={{ opacity: step1Opacity, display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: C.red,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14, fontFamily: C.font, fontWeight: 700, color: "white" }}>1</span>
            </div>
            <div>
              <span style={{ fontSize: 22, fontFamily: C.font, fontWeight: 700, color: C.white }}>
                Delete the vague headline
              </span>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 14, fontFamily: C.font, fontWeight: 400, color: C.grey }}>
                  &quot;Welcome to [Brand]&quot; says nothing
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ opacity: step2Opacity, display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: C.green,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14, fontFamily: C.font, fontWeight: 700, color: "white" }}>2</span>
            </div>
            <div>
              <span style={{ fontSize: 22, fontFamily: C.font, fontWeight: 700, color: C.white }}>
                Replace with a clear benefit
              </span>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 14, fontFamily: C.font, fontWeight: 400, color: C.grey }}>
                  &quot;We Save You 10 Hours a Week&quot;
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ opacity: step3Opacity, display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: C.gradient,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14, fontFamily: C.font, fontWeight: 700, color: "white" }}>3</span>
            </div>
            <div>
              <span style={{ fontSize: 22, fontFamily: C.font, fontWeight: 700, color: C.white }}>
                Pin the CTA button to the top
              </span>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 14, fontFamily: C.font, fontWeight: 400, color: C.grey }}>
                  Visible 100% of the time
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Result + CTA (0:15–0:20 = frames 0–149) ───────────
const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Phone with focused heatmap (0–40)
  // Phase 2: Purchase notification dings (40–70)
  // Phase 3: "COMMENT 'CHECKLIST'" CTA (70–149)

  const phoneScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.6 },
  });

  // Focused heatmap glow on button
  const heatFocus = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heatPulse = 1 + Math.sin(frame * 0.15) * 0.15;

  // Purchase notification
  const notifY = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.5 },
  });

  const notifOpacity = interpolate(frame, [40, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA text
  const ctaOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaScale = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  // "3-Second Rule" label
  const ruleOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: C.bg,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
        {/* Phone with focused heat */}
        <div
          style={{
            width: 340,
            height: 620,
            borderRadius: 32,
            border: "3px solid #333",
            backgroundColor: "#111",
            overflow: "hidden",
            transform: `scale(${phoneScale})`,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Notch */}
          <div
            style={{
              width: 120,
              height: 24,
              backgroundColor: "#111",
              borderRadius: "0 0 16px 16px",
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              border: "1px solid #333",
              borderTop: "none",
            }}
          />

          {/* Sticky CTA */}
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 0,
              right: 0,
              zIndex: 15,
              display: "flex",
              justifyContent: "center",
              padding: "8px 16px",
              backgroundColor: "rgba(17,17,17,0.95)",
            }}
          >
            <div
              style={{
                padding: "10px 40px",
                background: C.gradient,
                borderRadius: 8,
                boxShadow: `0 0 ${heatFocus * 40 * heatPulse}px rgba(255,60,172,${heatFocus * 0.6})`,
              }}
            >
              <span style={{ fontSize: 13, fontFamily: C.font, fontWeight: 700, color: "white", letterSpacing: "1px" }}>
                BUY NOW
              </span>
            </div>
          </div>

          <div style={{ padding: "36px 16px 16px" }}>
            {/* Nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 60, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 20, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
                <div style={{ width: 20, height: 8, backgroundColor: "#2A2A2A", borderRadius: 4 }} />
              </div>
            </div>

            {/* Good headline */}
            <div style={{ marginBottom: 16, padding: "16px 0" }}>
              <span style={{ fontSize: 18, fontFamily: C.font, fontWeight: 800, color: C.white }}>
                We Save You 10 Hours a Week.
              </span>
            </div>

            {/* Content */}
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} style={{ marginBottom: 12 }}>
                <div style={{ width: "100%", height: 40, backgroundColor: "#1A1A1A", borderRadius: 6, marginBottom: 5 }} />
                <div style={{ width: "80%", height: 4, backgroundColor: "#1E1E1E", borderRadius: 2 }} />
              </div>
            ))}
          </div>

          {/* Focused heatmap - concentrated on the button */}
          <div
            style={{
              position: "absolute",
              top: 25,
              left: "50%",
              transform: `translate(-50%, 0) scale(${heatPulse})`,
              width: 200,
              height: 80,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, rgba(255,40,40,${heatFocus * 0.6}), rgba(255,100,0,${heatFocus * 0.3}) 40%, transparent 70%)`,
              pointerEvents: "none",
              zIndex: 16,
            }}
          />

          {/* Purchase notification toast */}
          <div
            style={{
              position: "absolute",
              top: 70,
              left: 16,
              right: 16,
              opacity: notifOpacity,
              transform: `translateY(${interpolate(notifY, [0, 1], [-30, 0])}px)`,
              zIndex: 30,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                backgroundColor: "rgba(46,204,113,0.15)",
                border: `1px solid ${C.green}`,
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: C.green,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>&#10003;</span>
              </div>
              <div>
                <span style={{ fontSize: 12, fontFamily: C.font, fontWeight: 700, color: C.green }}>
                  Purchase Confirmed!
                </span>
                <div>
                  <span style={{ fontSize: 9, fontFamily: C.font, color: "#888" }}>
                    Order #4821 — just now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 520 }}>
          {/* 3-Second Rule */}
          <div style={{ opacity: ruleOpacity }}>
            <div
              style={{
                display: "inline-flex",
                padding: "8px 20px",
                border: `1px solid rgba(255,255,255,0.15)`,
                borderRadius: 50,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 14, fontFamily: C.font, fontWeight: 500, color: C.grey, letterSpacing: "2px" }}>
                THE 3-SECOND RULE
              </span>
            </div>
            <div>
              <span style={{ fontSize: 32, fontFamily: C.font, fontWeight: 300, color: C.white, lineHeight: 1.4 }}>
                If they can&apos;t find your offer in{" "}
              </span>
              <span style={{ fontSize: 32, fontFamily: C.font, fontWeight: 800, color: C.hotPink }}>
                3 seconds
              </span>
              <span style={{ fontSize: 32, fontFamily: C.font, fontWeight: 300, color: C.white }}>
                , you&apos;ve already lost them.
              </span>
            </div>
          </div>

          {/* COMMENT CHECKLIST CTA */}
          <div
            style={{
              opacity: ctaOpacity,
              transform: `scale(${ctaScale})`,
            }}
          >
            <div
              style={{
                padding: 4,
                background: C.gradient,
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  backgroundColor: C.bg,
                  borderRadius: 12,
                  padding: "28px 40px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontFamily: C.font,
                    fontWeight: 400,
                    color: C.grey,
                  }}
                >
                  COMMENT
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontFamily: C.font,
                    fontWeight: 900,
                    background: C.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  &apos;CHECKLIST&apos;
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontFamily: C.font,
                    fontWeight: 400,
                    color: C.grey,
                  }}
                >
                  FOR THE PDF
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition (20s = 600 frames @ 30fps) ─────────────────
export const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Scene 1: Thumbnail Grid (0:00–0:03) = 90 frames */}
      <Sequence from={0} durationInFrames={90}>
        <ThumbnailGrid />
      </Sequence>

      {/* Scene 2: Heatmap Zoom (0:03–0:08) = 150 frames */}
      <Sequence from={90} durationInFrames={150}>
        <HeatmapZoom />
      </Sequence>

      {/* Scene 3: The Fix (0:08–0:15) = 210 frames */}
      <Sequence from={240} durationInFrames={210}>
        <TheFix />
      </Sequence>

      {/* Scene 4: Result + CTA (0:15–0:20) = 150 frames */}
      <Sequence from={450} durationInFrames={150}>
        <ResultScene />
      </Sequence>
    </AbsoluteFill>
  );
};
