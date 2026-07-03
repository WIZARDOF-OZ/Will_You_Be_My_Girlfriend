import { useEffect, useRef, useState, useMemo } from "react";
import { animate } from "animejs";
import { useNavigate } from "react-router-dom";
const MESSAGES = [
  "Will you be my girlfriend? 💕",
  "Are you sure? 🥺",
  "That's not it bestie 😭",
  "Why are you like this 😤",
  "babe please 🙏",
  "ok fine try again 😒",
  "YOU KEEP MISSING 💀",
  "I'm not giving up 😤",
  "Last warning... 👀",
  "The No button has left the chat 🤭",
];
const CONFETTI_PIECES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  width: `${8 + Math.random() * 8}px`,
  height: `${8 + Math.random() * 8}px`,
  bg: ["#e8375a", "#c8973a", "#ff6b8a", "#fff5f0", "#f48fb1", "#ffcc00"][
    Math.floor(Math.random() * 6)
  ],
  delay: `${Math.random() * 2}s`,
  duration: `${2 + Math.random() * 3}s`,
  borderRadius: `Math.random() > 0.5 ? "50%" : "2px"`,
}));

const BALLOONS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  emoji: ["🎈", "🎀", "💕", "🌹", "✨", "🎊", "💝", "🎉"][i],
  left: `${10 + i * 12}%`,
  duration: `${3 + Math.random() * 2}s`,
  delay: `${Math.random() * 1.5}s`,
}));
function CountdownRedirect() {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (count === 0) {
      navigate("/yes");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  return (
    <p
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1rem",
        color: "rgba(255,245,240,0.5)",
        fontStyle: "italic",
        zIndex: 1,
      }}
    >
      Redirecting in {count}...
    </p>
  );
}

export default function Envelope() {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<SVGGElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [saidYes, setSaidYes] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noGone, setNoGone] = useState(false);
  const [noBehind, setNoBehind] = useState(false);
  const [noStarted, setNoStarted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 200, y: 200 });

  const message = MESSAGES[Math.min(noAttempts, MESSAGES.length - 1)];
  // Floating loop
  useEffect(() => {
    if (!envelopeRef.current) return;

    const floatAnim = animate(envelopeRef.current, {
      translateY: [-6, 6],
      duration: 2200,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    return () => floatAnim.pause();
  }, []);

  const getRandomPos = () => {
    const btnW = noBtnRef.current?.offsetWidth ?? 100;
    const btnH = noBtnRef.current?.offsetHeight ?? 44;
    const pad = 24;
    const x = pad + Math.random() * (window.innerWidth - btnW - pad * 2);
    const y = pad + Math.random() * (window.innerHeight - btnH - pad * 2);
    return { x, y };
  };

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

  const handleNoClick = () => {
    if (noGone) return;

    const next = noAttempts + 1;
    setNoAttempts(next);

    if (next >= 9) {
      setNoGone(true);
      return;
    }

    if (next === 5) {
      setNoBehind(true);
    } else {
      setNoBehind(false);
    }

    // Set position FIRST then show flying button
    setNoPos(getRandomPos());
    setNoStarted(true);
  };

  const handleYes = () => {
    setSaidYes(true);
  };

  return (
    <>
      {/* YES Celebration */}
      {saidYes && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 2, 8, 0.97)",
            zIndex: 1040,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "1.5rem",
            overflow: "hidden",
          }}
        >
          {/* Confetti pieces */}
          {CONFETTI_PIECES.map((pieces) => (
            <div
              key={pieces.id}
              style={{
                position: "absolute",
                left: pieces.left,
                width: pieces.width,
                height: pieces.height,
                background: pieces.bg,
                animation: `floatUp ${pieces.duration} ease-in ${pieces.delay} infinite`,
                bottom: "-20px",
                borderRadius: pieces.borderRadius,
                opacity: 0,
              }}
            />
          ))}

          {/* Balloons */}
          {BALLOONS.map((balloon) => (
            <div
              key={`b${balloon.id}`}
              style={{
                position: "absolute",
                bottom: "-100px",
                left: balloon.left,
                fontSize: "3rem",
                animation: `floatUp ${balloon.duration} ease-in ${balloon.delay} infinite`,
                opacity: 0,
              }}
            >
              {balloon.emoji}
            </div>
          ))}

          <p style={{ fontSize: "4rem", zIndex: 1 }}>🎉💕🌹</p>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#fff5f0",
              zIndex: 1,
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
              zIndex: 1,
            }}
          >
            I knew you would, my love 🌹
          </p>

          {/* Countdown */}
          <CountdownRedirect />
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
          zIndex: 1020,
          boxShadow: "0 16px 60px rgba(232, 55, 90, 0.3)",
          textAlign: "center",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Gold line top */}
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

        {/* Dynamic message */}
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.15rem",
            color: "#e8375a",
            fontWeight: 700,
            marginBottom: "1rem",
            minHeight: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {message}
        </p>

        {/* Resistance is futile */}
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

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          {/* YES button */}
          <button
            ref={yesBtnRef}
            onClick={handleYes}
            style={{
              padding: "0.6rem 1.5rem",
              background: "#e8375a",
              border: "none",
              borderRadius: "3px",
              color: "#fff5f0",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: noGone ? "1.5rem" : "1.05rem",
              cursor: "pointer",
              transition: "all 0.4s ease",
              width: noGone ? "100%" : "auto",
            }}
          >
            Yes ♥
          </button>

          {/* NO button — shows inline until first click */}
          {!noStarted && !noGone && (
            <button
              ref={noBtnRef}
              onClick={handleNoClick}
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
          )}
        </div>

        {/* Gold line bottom */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "#c8973a",
            margin: "1rem auto 0",
          }}
        />
      </div>

      {/* NO button flying around screen after first click */}
      {noStarted && !noGone && (
        <button
          ref={noBtnRef}
          onClick={handleNoClick}
          style={{
            position: "fixed",
            left: `${noPos.x}px`,
            top: `${noPos.y}px`,
            padding: "0.6rem 1.5rem",
            background: "rgba(255,245,240,0.95)",
            border: "1px solid #e8375a",
            borderRadius: "3px",
            color: "#e8375a",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.05rem",
            cursor: "pointer",
            transition: "left 0.25s ease, top 0.25s ease",
            // At attempt 5 goes behind popup (zIndex 1019 < popup 1020)
            zIndex: noBehind ? 1019 : 1030,
            boxShadow: "0 4px 15px rgba(232,55,90,0.3)",
          }}
        >
          No
        </button>
      )}

      {/* Blur overlay — must sit above music player (z:1000) */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 2, 8, 0.6)",
            zIndex: 1010,
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
          paddingBottom: "6rem",
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
