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

// ─── Brand Constants ─────────────────────────────────────────────
const BRAND = {
  black: "#0A0A0A",
  white: "#F5F5F5",
  grey: "#888888",
  gradient: "linear-gradient(135deg, #FF6B35, #FF3CAC, #784BA0, #2B86C5)",
  gradientAlt: "linear-gradient(90deg, #FF3CAC, #784BA0, #2B86C5)",
  font: "Inter, Helvetica, Arial, sans-serif",
};

// ─── Scene 1: Logo Reveal ────────────────────────────────────────
const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Caret draws in first
  const caretScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.4 },
  });

  const caretOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Then "Sriracha" fades in
  const textOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textSlide = interpolate(frame, [18, 40], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "Creative" slides in after
  const creativeOpacity = interpolate(frame, [32, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const creativeSlide = interpolate(frame, [32, 50], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Gradient line sweep
  const lineWidth = interpolate(frame, [50, 75], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BRAND.black,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          <span
            style={{
              fontSize: 120,
              fontFamily: BRAND.font,
              fontWeight: 700,
              color: BRAND.white,
              opacity: textOpacity,
              transform: `translateX(${textSlide}px)`,
              letterSpacing: "-2px",
            }}
          >
            Sriracha
          </span>
          <span
            style={{
              fontSize: 120,
              fontFamily: BRAND.font,
              fontWeight: 700,
              background: BRAND.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: caretOpacity,
              transform: `scale(${caretScale})`,
              marginLeft: 4,
            }}
          >
            ^
          </span>
        </div>
        <span
          style={{
            fontSize: 42,
            fontFamily: BRAND.font,
            fontWeight: 300,
            color: BRAND.grey,
            letterSpacing: "16px",
            textTransform: "uppercase",
            opacity: creativeOpacity,
            transform: `translateY(${creativeSlide}px)`,
            marginTop: 8,
          }}
        >
          Creative
        </span>
        <div
          style={{
            width: lineWidth,
            height: 3,
            background: BRAND.gradient,
            marginTop: 30,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: The ^ Symbol ───────────────────────────────────────
const SymbolScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Large caret in background
  const bgCaretScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 60, mass: 1 },
  });

  const bgCaretRotation = interpolate(frame, [0, 90], [0, 5], {
    extrapolateRight: "clamp",
  });

  // Taglines appear sequentially
  const taglines = [
    { text: "we create", accent: "magic", delay: 15 },
    { text: "design", accent: "growth", delay: 35 },
    { text: "Sriracha", accent: "Creative", delay: 55 },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BRAND.black,
      }}
    >
      {/* Giant background caret */}
      <span
        style={{
          position: "absolute",
          fontSize: 800,
          fontFamily: BRAND.font,
          fontWeight: 900,
          background: BRAND.gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: 0.06,
          transform: `scale(${bgCaretScale}) rotate(${bgCaretRotation}deg)`,
        }}
      >
        ^
      </span>

      {/* Section title */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 120,
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontFamily: BRAND.font,
            fontWeight: 400,
            color: BRAND.grey,
            letterSpacing: "6px",
            textTransform: "uppercase",
          }}
        >
          01 — Symbol
        </span>
      </div>

      {/* Taglines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, zIndex: 2 }}>
        {taglines.map((tag, i) => {
          const tagOpacity = interpolate(frame, [tag.delay, tag.delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const tagSlide = interpolate(frame, [tag.delay, tag.delay + 15], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={i}
              style={{
                opacity: tagOpacity,
                transform: `translateY(${tagSlide}px)`,
                display: "flex",
                alignItems: "baseline",
                gap: 0,
              }}
            >
              <span
                style={{
                  fontSize: 72,
                  fontFamily: BRAND.font,
                  fontWeight: 300,
                  color: BRAND.white,
                }}
              >
                {tag.text}
              </span>
              <span
                style={{
                  fontSize: 72,
                  fontFamily: BRAND.font,
                  fontWeight: 700,
                  background: BRAND.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginLeft: 0,
                }}
              >
                ^
              </span>
              <span
                style={{
                  fontSize: 72,
                  fontFamily: BRAND.font,
                  fontWeight: 300,
                  color: BRAND.grey,
                  marginLeft: 16,
                }}
              >
                {tag.accent}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Safe Area / Logo System ────────────────────────────
const SafeAreaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  // Safe area box animates in
  const boxOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boxScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.7 },
  });

  // Measurement lines
  const measureOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BRAND.black,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 120,
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontFamily: BRAND.font,
            fontWeight: 400,
            color: BRAND.grey,
            letterSpacing: "6px",
            textTransform: "uppercase",
          }}
        >
          02 — Logo Safe Area
        </span>
      </div>

      {/* Logo centered */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${logoScale})`,
          position: "relative",
        }}
      >
        {/* Safe area border */}
        <div
          style={{
            position: "absolute",
            inset: -60,
            border: `2px dashed rgba(255,255,255,0.15)`,
            opacity: boxOpacity,
            transform: `scale(${boxScale})`,
          }}
        />

        {/* Corner marks */}
        {boxOpacity > 0 &&
          [
            { top: -60, left: -60, borderTop: "2px solid", borderLeft: "2px solid" },
            { top: -60, right: -60, borderTop: "2px solid", borderRight: "2px solid" },
            { bottom: -60, left: -60, borderBottom: "2px solid", borderLeft: "2px solid" },
            { bottom: -60, right: -60, borderBottom: "2px solid", borderRight: "2px solid" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                ...pos,
                borderColor: "rgba(255,60,172,0.6)",
                opacity: boxOpacity,
              } as React.CSSProperties}
            />
          ))}

        {/* "C" measurement label */}
        <div
          style={{
            position: "absolute",
            right: -110,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: measureOpacity,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ width: 30, height: 1, background: "rgba(255,60,172,0.5)" }} />
          <span
            style={{
              fontSize: 16,
              fontFamily: BRAND.font,
              color: "rgba(255,60,172,0.7)",
              fontWeight: 500,
            }}
          >
            C
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span
            style={{
              fontSize: 80,
              fontFamily: BRAND.font,
              fontWeight: 700,
              color: BRAND.white,
              letterSpacing: "-1px",
            }}
          >
            Sriracha
          </span>
          <span
            style={{
              fontSize: 80,
              fontFamily: BRAND.font,
              fontWeight: 700,
              background: BRAND.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ^
          </span>
        </div>
      </div>

      {/* Bottom note */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          opacity: measureOpacity,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontFamily: BRAND.font,
            fontWeight: 300,
            color: BRAND.grey,
          }}
        >
          Minimum clear space defined by caret height unit &quot;C&quot;
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Color Palette ──────────────────────────────────────
const ColorPalette: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const colors = [
    { name: "White", hex: "#F5F5F5", bg: "#F5F5F5", text: "#0A0A0A", delay: 10 },
    { name: "Black", hex: "#0A0A0A", bg: "#0A0A0A", text: "#F5F5F5", delay: 20 },
    { name: "Color Splash", hex: "gradient", bg: BRAND.gradient, text: "#FFFFFF", delay: 30 },
  ];

  // Gradient sweep across bottom
  const sweepWidth = interpolate(frame, [55, 85], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BRAND.black,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 120,
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontFamily: BRAND.font,
            fontWeight: 400,
            color: BRAND.grey,
            letterSpacing: "6px",
            textTransform: "uppercase",
          }}
        >
          03 — Color Palette
        </span>
      </div>

      {/* Color swatches */}
      <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
        {colors.map((color, i) => {
          const s = spring({
            frame: Math.max(0, frame - color.delay),
            fps,
            config: { damping: 12, stiffness: 100, mass: 0.5 },
          });

          const isGradient = color.hex === "gradient";

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                transform: `scale(${s})`,
                opacity: s,
              }}
            >
              <div
                style={{
                  width: isGradient ? 260 : 220,
                  height: isGradient ? 300 : 260,
                  borderRadius: 16,
                  background: color.bg,
                  border: color.name === "Black" ? "1px solid rgba(255,255,255,0.1)" : "none",
                  boxShadow: isGradient ? "0 20px 60px rgba(255,60,172,0.3)" : "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: isGradient ? 80 : 60,
                    fontFamily: BRAND.font,
                    fontWeight: 700,
                    color: color.text,
                  }}
                >
                  {isGradient ? "^" : "Aa"}
                </span>
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontFamily: BRAND.font,
                  fontWeight: 600,
                  color: BRAND.white,
                }}
              >
                {color.name}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: BRAND.font,
                  fontWeight: 400,
                  color: BRAND.grey,
                }}
              >
                {isGradient ? "Accent · Highlights · Focal Points" : color.hex}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gradient sweep bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${sweepWidth}%`,
          height: 4,
          background: BRAND.gradient,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 5: Typography System ──────────────────────────────────
const TypographyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // "Inter" font name reveal
  const fontNameScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.5 },
  });

  // Glitch effect: cycle through different font styles on the word "anything"
  const glitchFonts = [
    { family: "Georgia, serif", weight: 400, style: "italic" as const },
    { family: "Courier New, monospace", weight: 700, style: "normal" as const },
    { family: "Impact, sans-serif", weight: 400, style: "normal" as const },
    { family: "Inter, sans-serif", weight: 900, style: "normal" as const },
    { family: "Times New Roman, serif", weight: 400, style: "normal" as const },
  ];

  const glitchActive = frame >= 50 && frame <= 85;
  const glitchIndex = glitchActive ? Math.floor((frame - 50) / 3) % glitchFonts.length : 3;
  const currentGlitch = glitchFonts[glitchIndex];

  // After glitch, settle on Inter
  const settled = frame > 85;
  const settledOpacity = interpolate(frame, [85, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineSlide = interpolate(frame, [20, 38], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Weight specimens
  const weights = [
    { label: "Light", weight: 300, delay: 25 },
    { label: "Regular", weight: 400, delay: 30 },
    { label: "Medium", weight: 500, delay: 35 },
    { label: "Bold", weight: 700, delay: 40 },
    { label: "Black", weight: 900, delay: 45 },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BRAND.black,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 120,
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontFamily: BRAND.font,
            fontWeight: 400,
            color: BRAND.grey,
            letterSpacing: "6px",
            textTransform: "uppercase",
          }}
        >
          04 — Typography
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        {/* Font name */}
        <div style={{ transform: `scale(${fontNameScale})`, opacity: fontNameScale }}>
          <span
            style={{
              fontSize: 110,
              fontFamily: BRAND.font,
              fontWeight: 200,
              color: BRAND.white,
              letterSpacing: "-3px",
            }}
          >
            Inter
          </span>
        </div>

        {/* Weight specimens row */}
        <div style={{ display: "flex", gap: 40, opacity: taglineOpacity, transform: `translateY(${taglineSlide}px)` }}>
          {weights.map((w, i) => {
            const wOpacity = interpolate(frame, [w.delay, w.delay + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: wOpacity }}>
                <span style={{ fontSize: 36, fontFamily: BRAND.font, fontWeight: w.weight, color: BRAND.white }}>
                  Aa
                </span>
                <span style={{ fontSize: 12, fontFamily: BRAND.font, fontWeight: 400, color: BRAND.grey }}>
                  {w.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Glitch tagline */}
        <div style={{ marginTop: 20 }}>
          <span style={{ fontSize: 40, fontFamily: BRAND.font, fontWeight: 300, color: BRAND.grey }}>
            we can design{" "}
          </span>
          <span
            style={{
              fontSize: 40,
              fontFamily: settled ? BRAND.font : currentGlitch.family,
              fontWeight: settled ? 700 : currentGlitch.weight,
              fontStyle: settled ? "normal" : currentGlitch.style,
              color: glitchActive ? "#FF3CAC" : BRAND.white,
              opacity: settled ? settledOpacity : 1,
              transition: settled ? "all 0.3s" : "none",
            }}
          >
            anything^
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: Brand Personality ──────────────────────────────────
const BrandPersonality: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const traits = [
    { text: "Fluid", delay: 10 },
    { text: "Adaptive", delay: 18 },
    { text: "Experimental", delay: 26 },
    { text: "Controlled", delay: 34 },
  ];

  // Central tagline
  const taglineOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glitch flicker on the tagline
  const flickerOn = frame > 55 && frame < 70 ? (Math.sin(frame * 2.5) > 0 ? 1 : 0.7) : 1;

  // Pulsing gradient border
  const pulseScale = 1 + Math.sin(frame * 0.08) * 0.02;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BRAND.black,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 120,
          opacity: titleOpacity,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontFamily: BRAND.font,
            fontWeight: 400,
            color: BRAND.grey,
            letterSpacing: "6px",
            textTransform: "uppercase",
          }}
        >
          05 — Brand Personality
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        {/* Trait pills */}
        <div style={{ display: "flex", gap: 24 }}>
          {traits.map((trait, i) => {
            const s = spring({
              frame: Math.max(0, frame - trait.delay),
              fps,
              config: { damping: 10, stiffness: 100, mass: 0.5 },
            });
            return (
              <div
                key={i}
                style={{
                  padding: "14px 36px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 50,
                  transform: `scale(${s})`,
                  opacity: s,
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontFamily: BRAND.font,
                    fontWeight: 400,
                    color: BRAND.white,
                    letterSpacing: "2px",
                  }}
                >
                  {trait.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Central statement with gradient border */}
        <div
          style={{
            padding: 4,
            background: BRAND.gradient,
            borderRadius: 20,
            opacity: taglineOpacity * flickerOn,
            transform: `scale(${pulseScale})`,
          }}
        >
          <div
            style={{
              background: BRAND.black,
              borderRadius: 16,
              padding: "30px 60px",
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontFamily: BRAND.font,
                fontWeight: 700,
                color: BRAND.white,
              }}
            >
              Glitched
            </span>
            <span
              style={{
                fontSize: 52,
                fontFamily: BRAND.font,
                fontWeight: 200,
                color: BRAND.grey,
                marginLeft: 16,
              }}
            >
              but
            </span>
            <span
              style={{
                fontSize: 52,
                fontFamily: BRAND.font,
                fontWeight: 700,
                background: BRAND.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginLeft: 16,
              }}
            >
              Precise
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <span
          style={{
            fontSize: 20,
            fontFamily: BRAND.font,
            fontWeight: 300,
            color: BRAND.grey,
            opacity: taglineOpacity,
            letterSpacing: "1px",
          }}
        >
          A creative system, not a static agency
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: Outro / Logo Lockup ────────────────────────────────
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Everything fades in clean
  const mainOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
  });

  // Caret pulses gently
  const caretGlow = 0.3 + Math.sin(frame * 0.1) * 0.15;

  // Bottom line draws in
  const lineWidth = interpolate(frame, [30, 60], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fade to black at end
  const fadeOut = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BRAND.black,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: mainOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        {/* Logo mark */}
        <span
          style={{
            fontSize: 180,
            fontFamily: BRAND.font,
            fontWeight: 700,
            background: BRAND.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 ${caretGlow * 100}px rgba(255,60,172,0.4))`,
            lineHeight: 1,
          }}
        >
          ^
        </span>

        {/* Brand name */}
        <div style={{ display: "flex", alignItems: "baseline", marginTop: -10 }}>
          <span
            style={{
              fontSize: 64,
              fontFamily: BRAND.font,
              fontWeight: 700,
              color: BRAND.white,
              letterSpacing: "-1px",
            }}
          >
            Sriracha
          </span>
          <span
            style={{
              fontSize: 64,
              fontFamily: BRAND.font,
              fontWeight: 700,
              background: BRAND.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ^
          </span>
          <span
            style={{
              fontSize: 64,
              fontFamily: BRAND.font,
              fontWeight: 200,
              color: BRAND.grey,
              marginLeft: 12,
            }}
          >
            Creative
          </span>
        </div>

        {/* Line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: BRAND.gradient,
            marginTop: 24,
            borderRadius: 1,
          }}
        />

        {/* Tagline */}
        <span
          style={{
            fontSize: 18,
            fontFamily: BRAND.font,
            fontWeight: 300,
            color: BRAND.grey,
            letterSpacing: "8px",
            textTransform: "uppercase",
            marginTop: 20,
            opacity: interpolate(frame, [40, 55], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          We can design anything
        </span>
      </div>

      {/* Fade to black overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: BRAND.black,
          opacity: fadeOut,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────────────
export const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.black }}>
      {/* Scene 1: Logo Reveal (0–89) ~3s */}
      <Sequence from={0} durationInFrames={90}>
        <LogoReveal />
      </Sequence>

      {/* Scene 2: The ^ Symbol (90–179) ~3s */}
      <Sequence from={90} durationInFrames={90}>
        <SymbolScene />
      </Sequence>

      {/* Scene 3: Logo Safe Area (180–269) ~3s */}
      <Sequence from={180} durationInFrames={90}>
        <SafeAreaScene />
      </Sequence>

      {/* Scene 4: Color Palette (270–369) ~3.3s */}
      <Sequence from={270} durationInFrames={100}>
        <ColorPalette />
      </Sequence>

      {/* Scene 5: Typography (370–479) ~3.7s */}
      <Sequence from={370} durationInFrames={110}>
        <TypographyScene />
      </Sequence>

      {/* Scene 6: Brand Personality (480–569) ~3s */}
      <Sequence from={480} durationInFrames={90}>
        <BrandPersonality />
      </Sequence>

      {/* Scene 7: Outro (570–659) ~3s */}
      <Sequence from={570} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
