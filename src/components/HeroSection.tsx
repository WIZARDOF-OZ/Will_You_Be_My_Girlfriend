import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const text = titleRef.current.textContent ?? "";
      titleRef.current.innerHTML = text
        .split("")
        .map(
          (ch) =>
            `<span style="display:inline-block; opacity:0">${ch === " " ? "&nbsp;" : ch}</span>`,
        )
        .join("");

      // Animate title letters
      animate(titleRef.current.querySelectorAll("span"), {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(60),
        ease: "outExpo",
        duration: 800,
      });

      // Animate emoji after title finishes
      if (emojiRef.current)
        animate(emojiRef.current, {
          opacity: [0, 1],
          translateY: [40, 0],
          delay: 1400,
          ease: "outExpo",
          duration: 800,
        });
    }
  }, []);

  return (
    <section
      style={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem 1.5rem",
        position: "relative",
        zIndex: 1,
      }}
    >
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
          }}
        >
          For My Favourite Person
        </h1>
        {/* Emoji animated separately */}
        <span
          ref={emojiRef}
          style={{
            fontSize: "clamp(1.8rem, 4vw, 4.5rem)",
            opacity: 0,
            display: "inline-block",
            wordBreak: "keep-all",
            whiteSpace: "nowrap",
          }}
        >
          🌹
        </span>
      </div>

      {/* Line 1 */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(0.95rem, 2vw, 1.3rem)",
          color: "#fff5f0",
          marginTop: "2rem",
          fontStyle: "italic",
          opacity: 0.85,
          maxWidth: "560px",
          lineHeight: 1.7,
        }}
      >
        My love for you is as infinite as the hearts floating around — and this
        is just the beginning ♥
      </p>

      {/* Line 2 */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
          color: "#c8973a",
          marginTop: "1.2rem",
          fontStyle: "italic",
          opacity: 0.9,
        }}
      >
        This page is made just for you ♥
      </p>
    </section>
  );
}
