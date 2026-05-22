import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import HeartScene from "../components/HeartScene";
import LoveTimer from "./LoveTimer";

export default function YesPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // Animate the title letters

    if (titleRef.current) {
      const text = titleRef.current.textContent ?? "";
      titleRef.current.innerHTML = text
        .split("")
        .map(
          (ch) =>
            `<span style="display: inline-block; opacity:0;">${ch === " " ? "&nbsp;" : ch}</span>`,
        )
        .join("");
      animate(titleRef.current.querySelectorAll("span"), {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(60),
        ease: "outExpo",
        duration: 800,
      });

      if (subtitleRef.current) {
        animate(subtitleRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          delay: 1200,
          duration: 800,
          ease: "outExpo",
        });
      }
      if (emojiRef.current)
        animate(emojiRef.current, {
          opacity: [0, 1],
          translateY: [30, 0],
          delay: 1800,
          duration: 800,
          ease: "outExpo",
        });
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <HeartScene />

      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(8,2,5,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "4rem 2rem 8rem",
          gap: "2rem",
        }}
      >
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.9rem",
              letterSpacing: "0.25em",
              color: "#c8973a",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            — she said yes —
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <h1
              ref={titleRef}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 6vw, 4.5rem)",
                color: "#fff5f0",
                lineHeight: 1.1,
                marginBottom: "1rem",
              }}
            >
              My Girlfriend
            </h1>
            {/* Emoji animated separately */}
            <span
              ref={emojiRef}
              style={{
                fontSize: "clamp(1.8em, 4vw, 4.5rem)",
                opacity: 0,
                display: "inline-block",
                wordBreak: "keep-all",
                whiteSpace: "nowrap",
              }}
            >
              💝
            </span>
          </div>

          <p
            ref={subtitleRef}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              color: "#ff6b8a",
              fontStyle: "italic",
              opacity: 0,
            }}
          >
            And so our story begins... ♥
          </p>
        </div>

        {/* Love Timer */}
        <LoveTimer />

        {/* Book section coming soon */}
        <div
          style={{
            marginTop: "2rem",
            fontFamily: "'Cormorant Garamond', serif",
            color: "rgba(26, 19, 6, 0.5)",
            fontStyle: "italic",
            fontSize: "1rem",
            letterSpacing: "0.1em",
          }}
        >
          — more coming soon —
        </div>
      </div>
    </div>
  );
}
