import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
// Journey starts :)
const START_DATE = new Date("2025-05-14T00:00:00");

function getElapsed() {
  const diff = Date.now() - START_DATE.getTime();
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function TimerUnit({ value, label }: { value: number; label: string }) {
  const tensRef = useRef<HTMLSpanElement>(null);
  const onesRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(-1);

  useEffect(() => {
    // On first render just set the text, no animation
    if (prevValue.current === -1) {
      prevValue.current = value;
      if (tensRef.current)
        tensRef.current.textContent = String(Math.floor(value / 10));
      if (onesRef.current) onesRef.current.textContent = String(value % 10);
      return;
    }

    if (prevValue.current === value) return;

    const prevTens = Math.floor(prevValue.current / 10);
    const prevOnes = prevValue.current % 10;
    const newTens = Math.floor(value / 10);
    const newOnes = value % 10;
    prevValue.current = value;

    const animateDigit = (
      ref: React.RefObject<HTMLSpanElement>,
      newVal: number,
      changed: boolean,
    ) => {
      if (!changed || !ref.current) return;
      animate(ref.current, {
        translateY: [0, -20],
        opacity: [1, 0],
        duration: 400,
        ease: "inExpo",
        onComplete: () => {
          if (ref.current) {
            ref.current.textContent = String(newVal);
            animate(ref.current, {
              translateY: [20, 0],
              opacity: [0, 1],
              duration: 500,
              ease: "outExpo",
            });
          }
        },
      });
    };

    animateDigit(tensRef, newTens, newTens !== prevTens);
    animateDigit(onesRef, newOnes, newOnes !== prevOnes);
  }, [value]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          background: "rgba(26,10,15,0.8)",
          border: "1px solid rgba(200,151,58,0.3)",
          borderRadius: "12px",
          padding: "clamp(0.6rem, 2vw, 0.85rem) clamp(0.75rem, 2.5vw, 1.25rem)",
          minWidth: "clamp(60px, 15vw, 85px)",
          textAlign: "center",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 4px 20px rgba(232,55,90,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
          overflow: "hidden",
          position: "relative" as const,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(200,151,58,0.4), transparent)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* Empty spans — text set imperatively by useEffect */}
          <span
            ref={tensRef}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              color: "#fff5f0",
              fontWeight: 700,
              lineHeight: 1,
              display: "inline-block",
            }}
          />
          <span
            ref={onesRef}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              color: "#fff5f0",
              fontWeight: 700,
              lineHeight: 1,
              display: "inline-block",
            }}
          />
        </div>
      </div>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)",
          letterSpacing: "0.18em",
          color: "rgba(200,151,58,0.7)",
          textTransform: "uppercase" as const,
        }}
      >
        {label}
      </span>
    </div>
  );
}
export default function LoveTimer() {
  const [elapsed, setElapsed] = useState(getElapsed());
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(getElapsed()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!hasAnimated.current && wrapRef.current) {
      hasAnimated.current = true;

      animate(labelRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
        ease: "outExpo",
        delay: 200,
      });

      animate(wrapRef.current.querySelectorAll(".timer-unit"), {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.8, 1],
        delay: stagger(100, { start: 400 }),
        duration: 700,
        ease: "outExpo",
      });

      animate(captionRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
        ease: "outExpo",
        delay: 900,
      });
    }
  }, []);

  const units = [
    { label: "Days", value: elapsed.days },
    { label: "Hours", value: elapsed.hours },
    { label: "Minutes", value: elapsed.minutes },
    { label: "Seconds", value: elapsed.seconds },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        width: "100%",
      }}
    >
      {/* Label */}
      <p
        ref={labelRef}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
          letterSpacing: "0.2em",
          color: "rgba(200,151,58,0.75)",
          textTransform: "uppercase" as const,
          opacity: 0,
        }}
      >
        — together since May 14, 2025 —
      </p>

      {/* Timer units */}
      <div
        ref={wrapRef}
        style={{
          display: "flex",
          gap: "clamp(0.5rem, 3vw, 1.5rem)",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {units.map(({ label, value }) => (
          <div key={label} className="timer-unit" style={{ opacity: 0 }}>
            <TimerUnit value={value} label={label} />
          </div>
        ))}
      </div>

      {/* Caption */}
      <p
        ref={captionRef}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
          color: "#fff5f0",
          fontStyle: "italic",
          opacity: 0,
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        Every second with you is a gift 💕
      </p>
    </div>
  );
}
