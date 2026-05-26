import { useState, useRef, useEffect } from "react";
import { animate } from "animejs";

const PAGES = [
  {
    title: "A Letter to You",
    emoji: "💌",
    content: `If love had a beginning for me, it would look exactly like you.

From being two kids in the same school, sharing small moments without realising their weight, to meeting again years later when life somehow brought us back — it feels like destiny had been quietly writing our story all along.

You came back into my life when I least expected it, and suddenly ordinary days started feeling like something worth remembering. Every conversation, every smile, every moment with you became something I never wanted to let go of.

This book is not just pages filled with words. It's a small piece of my heart, written for the girl who made love feel real.`,
  },
  {
    title: "The Beginning",
    emoji: "🌱",
    content: `The first time I met you in Grade 5, I never imagined you would become this important to me one day. Back then, we were just school friends — same bus rides, small conversations, the kind of friendship that feels ordinary until you look back and realise it wasn't.

When you changed schools in Class 7, life moved on. But fate had different plans.

Meeting you again in 12th grade felt unreal — like a story getting a second chance. Talking to you on Instagram slowly became the best part of my day. Everything felt easy and natural with you, like we had never really lost time.

The day I confessed my feelings was one of the most nervous moments of my life. When you said yes — it honestly felt like the world stopped for a second. In the best way possible.`,
  },
  {
    title: "My Favourite Memories",
    emoji: "🎞️",
    content: `It's impossible to choose just one memory with you, because every moment somehow becomes special when you're in it.

From holding your hand for the first time, to sitting together on the school bus. From laughing at the most random things, to sharing my first kiss with you — every memory feels like a scene I never want to forget.

What I love most is how comfortable everything feels with you. Even the simplest moments become beautiful, simply because they're ours.

Sometimes I replay them in my head for no reason at all. Just because they make me smile.`,
  },
  {
    title: "What I Love About You",
    emoji: "🌹",
    content: `There are so many things I love about you that words honestly don't feel enough.

I love how confident you are, and the graceful way you carry yourself. I love your smile, your eyes, your voice — and the way your presence alone can turn my worst days into something lighter.

But more than anything, I love your heart.

The way you care for people — so purely, so genuinely — makes you feel less like a girlfriend and more like home. The warmth you carry within you is something rare, and I feel incredibly lucky to be someone you chose to share it with.`,
  },
  {
    title: "My Promises to You",
    emoji: "🕊️",
    content: `I promise to stand beside you, no matter what life brings our way.

I promise to support your dreams, respect your feelings, and always — always — make you feel valued and loved. Not just on the good days, but especially on the hard ones.

I want us to build something that feels peaceful, safe, and real. A life filled with understanding, laughter, and a love that grows quietly but deeply with every passing year.

You deserve that kind of love. And I intend to give it to you — every single day.`,
  },
  {
    title: "Our Forever",
    emoji: "✨",
    content: `When I think about my future, the picture always somehow has you in it.

I imagine us growing together — supporting each other through every phase, every storm, every beautiful ordinary Tuesday. Creating a home that feels warm, and a life that feels whole.

I want us to be not just lovers, but best friends. The kind that still make each other laugh after years, who still choose each other on the hard days.

And one day, when the time is right, I want to marry the same girl who once sat with me on a school bus — and unknowingly became my favourite person in the world.

You, always. 🌹`,
  },
];

export default function LoveBook() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const candleFlameRef = useRef<HTMLDivElement>(null);
  const candleGlowRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pageContentRef = useRef<HTMLDivElement>(null);
  const flipLayerRef = useRef<HTMLDivElement>(null);

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

  // Hide hint after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const openBook = () => {
    if (!bookRef.current) return;
    setIsOpen(true);
    animate(bookRef.current, {
      rotateY: [0, 5],
      duration: 600,
      ease: "outExpo",
    });
  };

  const flipPage = (direction: "next" | "prev") => {
    if (isFlipping) return;
    if (direction === "next" && currentPage >= PAGES.length - 1) return;
    if (direction === "prev" && currentPage <= 0) return;

    setIsFlipping(true);

    if (!pageContentRef.current) return;

    // Animate content sliding out
    animate(pageContentRef.current, {
      opacity: [1, 0],
      translateX: direction === "next" ? [0, -30] : [0, 30],
      duration: 250,
      ease: "inExpo",
      onComplete: () => {
        setCurrentPage((p) => (direction === "next" ? p + 1 : p - 1));

        if (pageContentRef.current) {
          animate(pageContentRef.current, {
            opacity: [0, 1],
            translateX: direction === "next" ? [30, 0] : [-30, 0],
            duration: 350,
            ease: "outExpo",
            onComplete: () => setIsFlipping(false),
          });
        }
      },
    });
  };

  const page = PAGES[currentPage];

  return (
    <div className="flex flex-col items-center w-full px-4 pb-12 gap-6">
      {/* Candle */}
      <div className="flex flex-col items-center select-none">
        <div
          ref={candleFlameRef}
          className="relative flex flex-col items-center"
        >
          <div
            ref={candleGlowRef}
            className="absolute rounded-full"
            style={{
              width: "70px",
              height: "70px",
              background:
                "radial-gradient(circle, rgba(255,180,50,0.45) 0%, transparent 70%)",
              top: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
              filter: "blur(10px)",
            }}
          />
          <svg width="26" height="42" viewBox="0 0 26 42" fill="none">
            <path
              d="M13 42C5.8 42 1 35.5 1 28C1 19.5 8 13.5 10 8C11 5 12 2 13 0C14 2 15 5 16 8C18 13.5 25 19.5 25 28C25 35.5 20.2 42 13 42Z"
              fill="url(#fg)"
            />
            <path
              d="M13 37C9.5 37 7 33 7 28C7 23 10.5 19 12 15C13 18 16 22 16 28C16 33 14.5 37 13 37Z"
              fill="rgba(255,255,200,0.85)"
            />
            <defs>
              <linearGradient
                id="fg"
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
          <div className="w-px h-2" style={{ background: "#555" }} />
        </div>
        <div
          className="rounded-sm"
          style={{
            width: "26px",
            height: "72px",
            background:
              "linear-gradient(180deg, #fffbf0 0%, #fde68a 60%, #f5c842 100%)",
            boxShadow:
              "inset -3px 0 6px rgba(0,0,0,0.12), 0 2px 12px rgba(255,180,50,0.25)",
          }}
        />
        <div
          className="rounded-sm"
          style={{
            width: "34px",
            height: "7px",
            background: "linear-gradient(180deg, #f5c842, #c8973a)",
          }}
        />
        <div
          className="rounded-full mt-1"
          style={{
            width: "50px",
            height: "6px",
            background:
              "radial-gradient(ellipse, rgba(255,180,50,0.25) 0%, transparent 70%)",
            filter: "blur(3px)",
          }}
        />
      </div>

      {/* Book section */}
      <div className="relative flex flex-col items-center w-full max-w-xl">
        {/* Section label */}
        <p
          className="mb-4 text-xs tracking-widest uppercase text-center"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "rgba(200,151,58,0.6)",
          }}
        >
          — Our Journey —
        </p>

        {/* Hint popup */}
        {!isOpen && showHint && (
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm z-10 animate-bounce"
            style={{
              background: "rgba(200,151,58,0.15)",
              border: "1px solid rgba(200,151,58,0.3)",
              color: "rgba(200,151,58,0.9)",
              fontFamily: "'Cormorant Garamond', serif",
              whiteSpace: "nowrap",
            }}
          >
            ✨ Click the book to open
          </div>
        )}

        {/* Book wrapper */}
        <div
          ref={bookRef}
          className="relative w-full cursor-pointer"
          style={{ perspective: "1400px" }}
          onClick={!isOpen ? openBook : undefined}
        >
          {!isOpen ? (
            /* ─── CLOSED BOOK ─── */
            <div
              className="relative mx-auto rounded-r-lg overflow-hidden"
              style={{
                width: "min(320px, 85vw)",
                height: "clamp(360px, 55vw, 440px)",
                background:
                  "linear-gradient(135deg, #5c1a1a 0%, #7c2d12 40%, #6b1f1f 100%)",
                boxShadow:
                  "6px 6px 30px rgba(0,0,0,0.6), -2px 0 0 #3d0f0f, inset 0 0 40px rgba(0,0,0,0.2)",
              }}
            >
              {/* Spine */}
              <div
                className="absolute left-0 top-0 bottom-0"
                style={{
                  width: "22px",
                  background:
                    "linear-gradient(180deg, #3d0f0f, #5c1a1a, #3d0f0f)",
                  boxShadow: "inset -3px 0 8px rgba(0,0,0,0.4)",
                }}
              />

              {/* Cover texture lines */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)",
                }}
              />

              {/* Cover content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 ml-5">
                <div
                  className="w-16 h-px"
                  style={{ background: "rgba(200,151,58,0.5)" }}
                />
                <p className="text-2xl">📖</p>
                <h3
                  className="text-center px-4"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                    color: "rgba(255,245,220,0.9)",
                    lineHeight: 1.3,
                  }}
                >
                  Our Journey
                </h3>
                <p
                  className="text-center px-6 text-xs italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "rgba(200,151,58,0.7)",
                    letterSpacing: "0.1em",
                  }}
                >
                  A story written just for you
                </p>
                <div
                  className="w-16 h-px"
                  style={{ background: "rgba(200,151,58,0.5)" }}
                />
              </div>

              {/* Corner ornaments */}
              <div
                className="absolute top-4 left-8 text-xs"
                style={{ color: "rgba(200,151,58,0.4)" }}
              >
                ❧
              </div>
              <div
                className="absolute bottom-4 right-4 text-xs rotate-180"
                style={{ color: "rgba(200,151,58,0.4)" }}
              >
                ❧
              </div>
            </div>
          ) : (
            /* ─── OPEN BOOK ─── */
            <div
              className="relative mx-auto rounded-r-lg"
              style={{
                width: "min(580px, 96vw)",
                minHeight: "clamp(420px, 65vw, 520px)",
              }}
            >
              {/* Spine */}
              <div
                className="absolute left-0 top-0 bottom-0 rounded-l-sm z-10"
                style={{
                  width: "20px",
                  background:
                    "linear-gradient(180deg, #5c1a1a, #7c2d12, #5c1a1a)",
                  boxShadow:
                    "inset -3px 0 6px rgba(0,0,0,0.35), 2px 0 8px rgba(0,0,0,0.3)",
                }}
              />

              {/* Page */}
              <div
                className="ml-5 rounded-r-lg overflow-hidden"
                style={{
                  minHeight: "clamp(420px, 65vw, 520px)",
                  background:
                    "linear-gradient(135deg, #fdfaf4 0%, #fef9ee 60%, #fdf5e0 100%)",
                  boxShadow:
                    "4px 4px 24px rgba(0,0,0,0.35), inset 0 0 30px rgba(200,151,58,0.04)",
                }}
              >
                {/* Ruled lines */}
                <div
                  className="absolute inset-0 opacity-10 ml-5"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(transparent, transparent 31px, #c8973a 31px, #c8973a 32px)",
                    backgroundPosition: "0 52px",
                  }}
                />

                {/* Margin line */}
                <div
                  className="absolute top-0 bottom-0 z-10"
                  style={{
                    left: "72px",
                    width: "1px",
                    background: "rgba(220, 150, 150, 0.35)",
                  }}
                />

                {/* Animatable content */}
                <div
                  ref={pageContentRef}
                  className="relative z-10 flex flex-col"
                  style={{
                    padding: "clamp(1.25rem, 4vw, 2rem)",
                    paddingLeft: "clamp(2.5rem, 6vw, 3.5rem)",
                    minHeight: "clamp(420px, 65vw, 520px)",
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs tracking-widest uppercase"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "rgba(146,64,14,0.5)",
                      }}
                    >
                      {currentPage + 1} / {PAGES.length}
                    </span>
                    <span className="text-xl">{page.emoji}</span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-bold border-b pb-3 mb-4"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.15rem, 3.5vw, 1.5rem)",
                      color: "#7c2d12",
                      borderColor: "rgba(200,151,58,0.3)",
                    }}
                  >
                    {page.title}
                  </h2>

                  {/* Text content */}
                  <div
                    className="flex-1 overflow-y-auto pr-1"
                    style={{ maxHeight: "clamp(260px, 40vw, 360px)" }}
                  >
                    {page.content.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className="mb-4 last:mb-0 leading-loose"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "clamp(0.9rem, 2.2vw, 1.05rem)",
                          fontStyle: "italic",
                          color: "rgba(60,20,10,0.82)",
                          lineHeight: "1.95",
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Navigation — fixed at bottom */}
                  <div
                    className="flex items-center justify-between pt-4 mt-2"
                    style={{ borderTop: "1px solid rgba(200,151,58,0.2)" }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        flipPage("prev");
                      }}
                      disabled={currentPage === 0 || isFlipping}
                      className="transition-opacity disabled:opacity-20"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "0.9rem",
                        color: "#92400e",
                        background: "none",
                        border: "none",
                        cursor: currentPage === 0 ? "not-allowed" : "pointer",
                        minWidth: "80px",
                        textAlign: "left",
                      }}
                    >
                      ← Prev
                    </button>

                    {/* Dots */}
                    <div className="flex gap-1.5 items-center">
                      {PAGES.map((_, i) => (
                        <div
                          key={i}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === currentPage ? "18px" : "6px",
                            height: "6px",
                            background:
                              i === currentPage ? "#7c2d12" : "#d97706",
                            opacity: i === currentPage ? 1 : 0.35,
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        flipPage("next");
                      }}
                      disabled={currentPage === PAGES.length - 1 || isFlipping}
                      className="transition-opacity disabled:opacity-20"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "0.9rem",
                        color: "#92400e",
                        background: "none",
                        border: "none",
                        cursor:
                          currentPage === PAGES.length - 1
                            ? "not-allowed"
                            : "pointer",
                        minWidth: "80px",
                        textAlign: "right",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>

                {/* Page curl */}
                <div
                  className="absolute bottom-0 right-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    background:
                      "linear-gradient(225deg, #e8d5a3 45%, #fdf6e3 50%)",
                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Close hint when open */}
        {isOpen && (
          <p
            className="mt-4 text-xs italic text-center"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "rgba(200,151,58,0.45)",
              letterSpacing: "0.08em",
            }}
          >
            — tap the arrows to turn pages —
          </p>
        )}
      </div>
    </div>
  );
}
