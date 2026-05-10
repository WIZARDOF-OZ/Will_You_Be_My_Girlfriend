import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

const MESSAGES = [
  "Are you sure? 🥺",
  "That's not it bestie 😭",
  "Why are you like this 😤",
  "babe please 🙏",
  "ok fine try again 😒",
  "YOU KEEP MISSING 💀",
  "I'm not giving up 😤",
  "Last warning... 👀",
  "The No button has left the chat 😚",
];

const NO_POSITIONS = [
  { x: "55%", y: "50%" },
  { x: "52%", y: "20%" },
  { x: "54%", y: "80%" },
  { x: "50%", y: "35%" },
  { x: "56%", y: "65%" },
  { x: "51%", y: "10%" },
  { x: "53%", y: "90%" },
];

export default function Envelope() {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<SVGGElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [saidYes, setSaidYes] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPos, setNoPos] = useState({ x: "55%", y: "50%" });
  const [noGone, setNoGone] = useState(false);
  const [message, setMessage] = useState("Will you be my girlfriend? 💕");

  // Floating loop
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

  // Grow Yes button when No disappears
  useEffect(() => {
    if (noGone && yesBtnRef.current) {
      animate(yesBtnRef.current, {
        scale: [1, 1.8],
        duration: 600,
        ease: "outBack",
      });
    }
  }, [noGone]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    if (hintRef.current)
      animate(hintRef.current, {
        opacity: [0.8, 0],
        duration: 300,
        ease: "outExpo",
      });

    if (flapRef.current)
      animate(flapRef.current, {
        rotateX: [0, -180],
        duration: 700,
        ease: "outCubic",
      });

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

  const handleNoHover = () => {
    if (noGone) return;

    const next = noAttempts + 1;
    setNoAttempts(next);
    setMessage(MESSAGES[Math.min(next - 1, MESSAGES.length - 1)]);

    if (next >= 9) {
      // No button disappears!
      setNoGone(true);
      return;
    }

    if (next === 5) {
      // Half overlap on Yes button
      setNoPos({ x: "22%", y: "0px" });
      return;
    }

    // Pick random position
    const available = NO_POSITIONS.filter((p) => p.x !== noPos.x);
    const next_pos = available[Math.floor(Math.random() * available.length)];
    setNoPos(next_pos);
  };

  const handleYes = () => {
    setSaidYes(true);
  };

  return (
    <>
      {/* YES Celebration screen */}
      {saidYes && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 2, 8, 0.97)",
            zIndex: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          <p style={{ fontSize: "4rem" }}>🎉💕🌹</p>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#fff5f0",
            }}
          >
            She said Yes! 💕
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              color: "#c8973a",
              fontStyle: "italic",
            }}
          >
            I knew you would, my love 🌹
          </p>
        </div>
      )}

      {/* Letter popup */}
      <div
        ref={letterRef}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(340px, 90vw)",
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

        {/* Message changes on each No attempt */}
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            color: "#e8375a",
            fontWeight: 700,
            marginBottom: "0.75rem",
            minHeight: "60px",
            transition: "all 0.3s ease",
          }}
        >
          {message}
        </p>

        {/* Resistance is futile text — shows when No is gone */}
        {noGone && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1rem",
              color: "#c8973a",
              fontStyle: "italic",
              marginBottom: "0.75rem",
            }}
          >
            Resistance is futile 💕
          </p>
        )}

        {/* Buttons area */}
        <div
          style={{
            position: "relative",
            height: "70px",
            width: "100%",
            marginBottom: "0.5rem",
          }}
        >
          {/* Yes button — always fixed on left */}
          <button
            ref={yesBtnRef}
            onClick={handleYes}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-120%, -50%)",
              padding: "0.6rem 1.5rem",
              background: "#e8375a",
              border: "none",
              borderRadius: "3px",
              color: "#fff5f0",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: noGone ? "1.6rem" : "1.05rem",
              cursor: "pointer",
              transition: "font-size 0.3s ease",
              zIndex: 2,
              whiteSpace: "nowrap",
            }}
          >
            Yes ♥
          </button>

          {/* No button — moves on CLICK */}
          {!noGone && (
            <button
              onClick={handleNoHover}
              style={{
                position: "absolute",
                left: noPos.x,
                top: noPos.y,
                transform: "translateY(-50%)",
                padding: "0.6rem 1.5rem",
                background: "transparent",
                border: "1px solid #e8375a",
                borderRadius: "3px",
                color: "#e8375a",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.05rem",
                cursor: "pointer",
                transition: "left 0.25s ease, top 0.25s ease",
                zIndex: noAttempts === 5 ? 1 : 3,
                whiteSpace: "nowrap",
              }}
            >
              No
            </button>
          )}
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

      {/* Blur overlay */}
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

      {/* Envelope */}
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
