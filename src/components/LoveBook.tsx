import { useState, useRef, useEffect } from "react";
import { animate } from "animejs";

const PAGES = [
  {
    title: "A Letter to You",
    emoji: "💌",
    content: [
      "If love had a beginning for me, it would look exactly like you.",
      "From being two kids in the same school, sharing small moments without realising their weight, to meeting again years later when life somehow brought us back  it feels like destiny had been quietly writing our story all along.",
      "You came back into my life when I least expected it, and suddenly ordinary days started feeling like something worth remembering.",
      "This book is not just pages filled with words. It's a small piece of my heart, written for the girl who made love feel real.",
    ],
  },
  {
    title: "The Beginning",
    emoji: "🌱",
    content: [
      "The first time I met you in Grade 5, I never imagined you would become this important to me. Back then, we were just school friends  same bus rides, small conversations.",
      "When you changed schools in Class 7, life moved on. But fate had different plans.",
      "Meeting you again in 12th grade felt unreal  like a story getting a second chance. Talking to you on Instagram slowly became the best part of my day.",
      "The day I confessed my feelings was one of the most nervous moments of my life. When you said yes  it honestly felt like the world stopped for a second. In the best way possible.",
    ],
  },
  {
    title: "My Favourite Memories",
    emoji: "🎞️",
    content: [
      "It's impossible to choose just one memory with you, because every moment somehow becomes special when you're in it.",
      "From holding your hand for the first time, to sitting together on the school bus. From laughing at the most random things, to sharing my first kiss with you.",
      "What I love most is how comfortable everything feels with you. Even the simplest moments become beautiful, simply because they're ours.",
      "Sometimes I replay them in my head for no reason at all. Just because they make me smile.",
    ],
  },
  {
    title: "What I Love About You",
    emoji: "🌹",
    content: [
      "There are so many things I love about you that words honestly don't feel enough.",
      "I love how confident you are, and the graceful way you carry yourself. I love your smile, your eyes, your voice  and the way your presence alone can turn my worst days lighter.",
      "But more than anything, I love your heart.",
      "The way you care for people  so purely, so genuinely  makes you feel less like a girlfriend and more like home. I feel incredibly lucky to be someone you chose to share it with.",
    ],
  },
  {
    title: "My Promises to You",
    emoji: "🕊️",
    content: [
      "I promise to stand beside you, no matter what life brings our way.",
      "I promise to support your dreams, respect your feelings, and always make you feel valued and loved. Not just on the good days, but especially on the hard ones.",
      "I want us to build something that feels peaceful, safe, and real.",
      "You deserve that kind of love. And I intend to give it to you  every single day.",
    ],
  },
  {
    title: "Our Forever",
    emoji: "✨",
    content: [
      "When I think about my future, the picture always somehow has you in it.",
      "I imagine us growing together  supporting each other through every phase, every storm, every beautiful ordinary Tuesday.",
      "I want us to be not just lovers, but best friends. The kind that still make each other laugh after years, who still choose each other on the hard days.",
      "And one day, I want to marry the same girl who once sat with me on a school bus  and unknowingly became my favourite person in the world. You, always. 🌹",
    ],
  },
];

// Fixed book dimensions
const BOOK_W = 320;
const BOOK_H = 420;

export default function LoveBook() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [setFlipStage] = useState<"idle" | "out" | "in">("idle");

  const candleFlameRef = useRef<HTMLDivElement>(null);
  const candleGlowRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const flipPageRef = useRef<HTMLDivElement>(null);

  // Candle flicker
  useEffect(() => {
    if (!candleFlameRef.current || !candleGlowRef.current) return;
    animate(candleFlameRef.current, {
      scaleX: [1, 0.88, 1.1, 0.92, 1],
      scaleY: [1, 1.06, 0.96, 1.04, 1],
      translateX: [0, -1, 1, -1, 0],
      duration: 1600,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    animate(candleGlowRef.current, {
      opacity: [0.5, 0.85, 0.6, 0.95, 0.55],
      scale: [1, 1.1, 0.95, 1.08, 1],
      duration: 1600,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
  }, []);

  const openBook = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    if (!coverRef.current) return;

    // Cover flips open from right to left (like opening a book)
    animate(coverRef.current, {
      rotateY: [0, -160],
      duration: 900,
      ease: "outExpo",
      onComplete: () => {
        setIsOpen(true);
        setIsOpening(false);
      },
    });
  };

  const flipPage = (direction: "next" | "prev") => {
    if (isFlipping) return;
    if (direction === "next" && currentPage >= PAGES.length - 1) return;
    if (direction === "prev" && currentPage <= 0) return;
    if (!flipPageRef.current) return;

    setIsFlipping(true);
    setFlipStage("out");

    // Slide + fade out
    animate(flipPageRef.current, {
      opacity: [1, 0],
      translateX: direction === "next" ? [0, -40] : [0, 40],
      duration: 250,
      ease: "inCubic",
      onComplete: () => {
        setCurrentPage((p) => (direction === "next" ? p + 1 : p - 1));
        setFlipStage("in");

        if (flipPageRef.current) {
          animate(flipPageRef.current, {
            opacity: [0, 1],
            translateX: direction === "next" ? [40, 0] : [-40, 0],
            duration: 350,
            ease: "outCubic",
            onComplete: () => {
              setIsFlipping(false);
              setFlipStage("idle");
            },
          });
        }
      },
    });
  };

  const page = PAGES[currentPage];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "0 1rem 4rem",
        gap: "1.5rem",
      }}
    >
      {/* Candle */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <div
          ref={candleFlameRef}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            ref={candleGlowRef}
            style={{
              position: "absolute",
              width: "70px",
              height: "70px",
              background:
                "radial-gradient(circle, rgba(255,180,50,0.45) 0%, transparent 70%)",
              top: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
              filter: "blur(10px)",
              borderRadius: "50%",
            }}
          />
          <svg width="26" height="42" viewBox="0 0 26 42" fill="none">
            <path
              d="M13 42C5.8 42 1 35.5 1 28C1 19.5 8 13.5 10 8C11 5 12 2 13 0C14 2 15 5 16 8C18 13.5 25 19.5 25 28C25 35.5 20.2 42 13 42Z"
              fill="url(#fg3)"
            />
            <path
              d="M13 37C9.5 37 7 33 7 28C7 23 10.5 19 12 15C13 18 16 22 16 28C16 33 14.5 37 13 37Z"
              fill="rgba(255,255,200,0.85)"
            />
            <defs>
              <linearGradient
                id="fg3"
                x1="13"
                y1="0"
                x2="13"
                y2="42"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#fff9a0" />
                <stop offset="35%" stopColor="#ffaa00" />
                <stop offset="100%" stopColor="#ff3300" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ width: "1px", height: "8px", background: "#555" }} />
        </div>
        <div
          style={{
            width: "26px",
            height: "72px",
            background:
              "linear-gradient(180deg,#fffbf0 0%,#fde68a 60%,#f5c842 100%)",
            boxShadow: "inset -3px 0 6px rgba(0,0,0,0.12)",
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            width: "34px",
            height: "7px",
            background: "linear-gradient(180deg,#f5c842,#c8973a)",
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            width: "50px",
            height: "6px",
            marginTop: "4px",
            background:
              "radial-gradient(ellipse,rgba(255,180,50,0.25) 0%,transparent 70%)",
            filter: "blur(3px)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Label */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "0.75rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(200,151,58,0.6)",
          textAlign: "center",
        }}
      >
        Our Journey
      </p>

      {/*   BOOK   */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Hint */}
        {!isOpen && !isOpening && (
          <div
            style={{
              position: "absolute",
              top: "-77px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "0.4rem 2.1rem",
              borderRadius: "999px",
              background: "rgba(200,151,58,0.12)",
              border: "1px solid rgba(200,151,58,0.3)",
              color: "rgba(200,151,58,0.9)",
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            ✨ Click the book to open
          </div>
        )}

        {/* Book 3D container */}
        <div
          style={{
            width: `${BOOK_W}px`,
            height: `${BOOK_H}px`,
            position: "relative",
            perspective: "1400px",
          }}
        >
          {/*   BACK / PAGES STACK (always visible)   */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg,#fdfaf4,#fef9ee)",
              borderRadius: "0 8px 8px 0",
              boxShadow: "4px 4px 24px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            {/* Ruled lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.08,
                backgroundImage:
                  "repeating-linear-gradient(transparent,transparent 31px,#c8973a 31px,#c8973a 32px)",
                backgroundPosition: "0 56px",
              }}
            />
            {/* Red margin */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "52px",
                width: "1px",
                background: "rgba(220,100,100,0.3)",
              }}
            />

            {/* Page content  only shown when open */}
            {isOpen && (
              <div
                ref={flipPageRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  padding: "1.25rem 1.25rem 1rem 3.75rem",
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.6rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(146,64,14,0.5)",
                    }}
                  >
                    {currentPage + 1} / {PAGES.length}
                  </span>
                  <span style={{ fontSize: "1.4rem" }}>{page.emoji}</span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "clamp(1rem,3.5vw,1.3rem)",
                    color: "#7c2d12",
                    fontWeight: 700,
                    borderBottom: "1px solid rgba(200,151,58,0.3)",
                    paddingBottom: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {page.title}
                </h2>

                {/* Text  fixed height, scrollable */}
                <div
                  className="book-content"
                  style={{ flex: 1, overflowY: "auto", paddingRight: "0.4rem" }}
                >
                  {page.content.map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "clamp(0.88rem,2vw,1rem)",
                        fontStyle: "italic",
                        color: "rgba(50,15,5,0.8)",
                        lineHeight: "1.85",
                        marginBottom:
                          i < page.content.length - 1 ? "0.75rem" : 0,
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Nav  always at bottom, never moves */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(200,151,58,0.2)",
                    paddingTop: "0.6rem",
                    marginTop: "0.5rem",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => flipPage("prev")}
                    disabled={currentPage === 0 || isFlipping}
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "0.9rem",
                      color: "#92400e",
                      background: "none",
                      border: "none",
                      cursor: currentPage === 0 ? "not-allowed" : "pointer",
                      opacity: currentPage === 0 ? 0.25 : 1,
                      minWidth: "65px",
                      textAlign: "left",
                      padding: 0,
                    }}
                  >
                    ← Prev
                  </button>

                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    {PAGES.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          height: "5px",
                          borderRadius: "999px",
                          transition: "all 0.3s ease",
                          width: i === currentPage ? "16px" : "5px",
                          background: i === currentPage ? "#7c2d12" : "#d97706",
                          opacity: i === currentPage ? 1 : 0.35,
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => flipPage("next")}
                    disabled={currentPage === PAGES.length - 1 || isFlipping}
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "0.9rem",
                      color: "#92400e",
                      background: "none",
                      border: "none",
                      cursor:
                        currentPage === PAGES.length - 1
                          ? "not-allowed"
                          : "pointer",
                      opacity: currentPage === PAGES.length - 1 ? 0.25 : 1,
                      minWidth: "65px",
                      textAlign: "right",
                      padding: 0,
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Page curl */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "32px",
                height: "32px",
                background: "linear-gradient(225deg,#e0c88a 45%,#fdf6e3 50%)",
                clipPath: "polygon(100% 0,100% 100%,0 100%)",
                opacity: 0.5,
                pointerEvents: "none",
              }}
            />
          </div>

          {/*   SPINE   */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "20px",
              zIndex: 3,
              background: "linear-gradient(180deg,#5c1a1a,#7c2d12,#5c1a1a)",
              boxShadow:
                "inset -3px 0 6px rgba(0,0,0,0.35), 2px 0 8px rgba(0,0,0,0.3)",
              borderRadius: "4px 0 0 4px",
            }}
          />

          {/*   COVER (rotates open)   */}
          {!isOpen && (
            <div
              ref={coverRef}
              onClick={openBook}
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                zIndex: 2,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg,#5c1a1a 0%,#7c2d12 40%,#6b1f1f 100%)",
                  borderRadius: "0 8px 8px 0",
                  boxShadow:
                    "6px 6px 30px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.2)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.9rem",
                }}
              >
                {/* Texture */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.08,
                    backgroundImage:
                      "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.05) 3px,rgba(255,255,255,0.05) 4px)",
                  }}
                />
                {/* Cover content */}
                <div
                  style={{
                    paddingLeft: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.7rem",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "1px",
                      background: "rgba(200,151,58,0.5)",
                    }}
                  />
                  <span style={{ fontSize: "2rem" }}>📖</span>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "clamp(1.3rem,5vw,1.7rem)",
                      color: "rgba(255,245,220,0.95)",
                      textAlign: "center",
                      lineHeight: 1.3,
                      padding: "0 1rem",
                    }}
                  >
                    Our Journey
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "0.82rem",
                      fontStyle: "italic",
                      color: "rgba(200,151,58,0.7)",
                      letterSpacing: "0.08em",
                      textAlign: "center",
                      padding: "0 1.5rem",
                    }}
                  >
                    A story written just for you
                  </p>
                  <div
                    style={{
                      width: "56px",
                      height: "1px",
                      background: "rgba(200,151,58,0.5)",
                    }}
                  />
                </div>
                {/* Ornaments */}
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "28px",
                    color: "rgba(200,151,58,0.4)",
                    fontSize: "0.8rem",
                  }}
                >
                  ❧
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    color: "rgba(200,151,58,0.4)",
                    fontSize: "0.8rem",
                    transform: "rotate(180deg)",
                  }}
                >
                  ❧
                </span>
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <p
            style={{
              marginTop: "0.75rem",
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "0.78rem",
              fontStyle: "italic",
              color: "rgba(200,151,58,0.4)",
              letterSpacing: "0.08em",
              textAlign: "center",
            }}
          >
            tap the arrows to turn pages
          </p>
        )}
      </div>
    </div>
  );
}
