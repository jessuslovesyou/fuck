import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f0f23",
      }}
    >
      <h1
        style={{
          fontSize: 100,
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: "#ffffff",
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        Hello Remotion
      </h1>
    </AbsoluteFill>
  );
};

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const translateY = interpolate(slideIn, [0, 1], [50, 0]);

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f0f23",
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 48,
            fontFamily: "sans-serif",
            color: "#7c7cff",
            marginBottom: 20,
          }}
        >
          Programmatic video creation
        </p>
        <p
          style={{
            fontSize: 32,
            fontFamily: "sans-serif",
            color: "#aaaaaa",
          }}
        >
          Built with React & TypeScript
        </p>
      </div>
    </AbsoluteFill>
  );
};

const AnimatedCircles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f0f23",
      }}
    >
      {colors.map((color, i) => {
        const delay = i * 5;
        const s = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 8, stiffness: 120, mass: 0.6 },
        });

        const rotation = interpolate(frame, [0, 60], [0, 360]);
        const radius = 200;
        const angle = (i / colors.length) * Math.PI * 2 + (rotation * Math.PI) / 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: color,
              transform: `translate(${x}px, ${y}px) scale(${s})`,
              boxShadow: `0 0 30px ${color}80`,
            }}
          />
        );
      })}
      <h2
        style={{
          fontSize: 60,
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: "#ffffff",
          zIndex: 10,
        }}
      >
        Animations
      </h2>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [25, 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f0f23",
        opacity: opacity * fadeOut + (1 - fadeOut) * opacity,
      }}
    >
      <h1
        style={{
          fontSize: 80,
          fontFamily: "sans-serif",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #7c7cff, #ff6b6b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity,
        }}
      >
        Made with Remotion
      </h1>
    </AbsoluteFill>
  );
};

export const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={45}>
        <Title />
      </Sequence>
      <Sequence from={45} durationInFrames={40}>
        <Subtitle />
      </Sequence>
      <Sequence from={85} durationInFrames={65}>
        <AnimatedCircles />
      </Sequence>
      <Sequence from={105} durationInFrames={45}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
