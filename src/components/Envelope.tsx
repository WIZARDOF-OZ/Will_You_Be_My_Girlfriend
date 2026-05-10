import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

export default function Envelope() {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<SVGGElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Floating loop — runs forever independently
  useEffect(() => {
    if (!envelopeRef.current) return;
    animate(envelopeRef.current, {
      translateY: [-6, 6],
      duration: 2200,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
  }, []);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    //adds a null check

    // Hide hint
    if (hintRef.current)
      animate(hintRef.current, {
        opacity: [0.8, 0],
        duration: 300,
        ease: "outExpo",
      });
    // Flap opens
    if (flapRef.current)
      animate(flapRef.current, {
        rotateX: [0, -180],
        duration: 700,
        ease: "outCubic",
      });
    // Letter popup appears in center of screen
    if (letterRef.current)
      animate(letterRef.current, {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 700,
        delay: 600,
        ease: "outExpo",
      });
  };

  const handleHover = () => {
    if (!isOpen && envelopeRef.current) {
      animate(envelopeRef.current, {
        rotate: [-2, 2, -2, 2, 0],
        duration: 500,
        ease: "inOutSine",
      });
    }
  };

  return (
    <>
      {/* Letter as fixed centered overlay */}
      <div
        ref={letterRef}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(320px, 90vw)",
          background: "#fff5f0",
          borderRadius: "6px",
          padding: "2rem 1.75rem",
          opacity: 0,
          zIndex: 100,
          boxShadow: "0 16px 60px rgba(232, 55, 90, 0.3)",
          textAlign: "center",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "#c8973a",
            margin: "0 auto 1.25rem",
          }}
        />

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.05rem",
            color: "#5a2030",
            fontStyle: "italic",
            lineHeight: 1.8,
            marginBottom: "1.25rem",
          }}
        >
          "I've been meaning to
          <br />
          ask you something..."
        </p>

        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.25rem",
            color: "#e8375a",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          Will you be my girlfriend? 💕
        </p>

        <div
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}
        >
          <button
            style={{
              padding: "0.6rem 1.5rem",
              background: "#e8375a",
              border: "none",
              borderRadius: "3px",
              color: "#fff5f0",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              cursor: "pointer",
            }}
          >
            Yes ♥
          </button>
          <button
            style={{
              padding: "0.6rem 1.5rem",
              background: "transparent",
              border: "1px solid #e8375a",
              borderRadius: "3px",
              color: "#e8375a",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>

        <div
          style={{
            width: "40px",
            height: "1px",
            background: "#c8973a",
            margin: "1.25rem auto 0",
          }}
        />
      </div>

      {/* Dim background overlay when letter is open */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 2, 8, 0.6)",
            zIndex: 99,
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* Envelope section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "3rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          ref={hintRef}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            color: "#c8973a",
            marginBottom: "1.5rem",
            fontStyle: "italic",
            opacity: 0.8,
            letterSpacing: "0.15em",
            pointerEvents: "none",
          }}
        >
          — a letter for you, tap to open —
        </p>

        <div ref={envelopeRef} style={{ width: "280px" }}>
          <svg
            viewBox="0 0 280 180"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              cursor: isOpen ? "default" : "pointer",
              filter: "drop-shadow(0 8px 20px rgba(232,55,90,0.2))",
            }}
            onClick={handleOpen}
            onMouseEnter={handleHover}
          >
            <rect x="0" y="40" width="280" height="140" rx="6" fill="#fff5f0" />
            <polygon points="0,180 140,108 280,180" fill="#f8bbd0" />
            <polygon points="0,42 0,180 108,111" fill="#fce4ec" />
            <polygon points="280,42 280,180 172,111" fill="#fce4ec" />
            <polygon points="0,42 140,128 280,42" fill="#fce4ec" />

            <g
              ref={flapRef}
              style={{ transformOrigin: "50% 0%", transformBox: "fill-box" }}
            >
              <polygon points="0,42 140,130 280,42" fill="#f48fb1" />
            </g>
            <circle cx="140" cy="120" r="24" fill="#8b0000" />
            <circle cx="140" cy="120" r="20" fill="#b01840" />
            <circle cx="140" cy="120" r="16" fill="#e8375a" />
            <g transform="translate(140, 123)">
              <path
                d="M0 6 C0 6 -10 0 -10 -5 C-10 -9 -7 -11 -4 -11 C-2 -11 0 -9.5 0 -9.5 C0 -9.5 2 -11 4 -11 C7 -11 10 -9 10 -5 C10 0 0 6 0 6Z"
                fill="white"
              />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
