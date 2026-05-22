import { useEffect, useRef, useState, useCallback } from "react";
import { FEATURED_SONGS, PLAYLIST_SONGS } from "../data/songs";

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          height: string;
          width: string;
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
  interface YTPlayer {
    playVideo(): void;
    pauseVideo(): void;
    unMute(): void;
    loadVideoById(id: string): void;
    cueVideoById(id: string): void;
    seekTo(s: number, a: boolean): void;
    setVolume(v: number): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): number;
    destroy(): void;
  }
}

/*   Queue setup                              
   One random featured song opens. Rest splice in after opener ends.    */
const _openerIdx = Math.floor(Math.random() * FEATURED_SONGS.length);
const _opener = FEATURED_SONGS[_openerIdx];
const _restFeat = FEATURED_SONGS.filter((_, i) => i !== _openerIdx);
const _initialQ = [_opener, ...PLAYLIST_SONGS];

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 600;

function getNextIndex(
  current: number,
  total: number,
  shuffle: boolean,
  history: number[],
): number {
  if (!shuffle) return (current + 1) % total;
  const excl = new Set(history.slice(-2));
  if (excl.size >= total) return (current + 1) % total;
  let next: number;
  do {
    next = Math.floor(Math.random() * total);
  } while (excl.has(next));
  return next;
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    zIndex: 1015,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.5rem",
    fontFamily: "'Cormorant Garamond',serif",
    maxWidth: "calc(100vw - 2rem)",
  },
  playlist: {
    width: "min(280px,calc(100vw - 2rem))",
    maxHeight: "260px",
    overflowY: "auto",
    background: "#120609",
    border: "1px solid rgba(200,151,58,0.3)",
    borderRadius: "16px",
    padding: "0.5rem 0",
    boxShadow: "0 8px 40px rgba(0,0,0,0.8)",
    scrollbarWidth: "thin" as const,
    scrollbarColor: "rgba(200,151,58,0.35) transparent",
  },
  pTitle: {
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "rgba(200,151,58,0.6)",
    padding: "0.5rem 1rem 0.75rem",
    fontFamily: "'Cormorant Garamond',serif",
  },
  pItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "8px",
    margin: "0 0.25rem",
  },
  pNum: {
    fontSize: "0.75rem",
    color: "rgba(255,245,240,0.3)",
    width: "18px",
    textAlign: "right" as const,
    flexShrink: 0,
    fontFamily: "'Cormorant Garamond',serif",
  },
  pInfo: { flex: 1, minWidth: 0 },
  pSong: {
    fontSize: "0.85rem",
    color: "#fff5f0",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "'Cormorant Garamond',serif",
  },
  pArtist: {
    fontSize: "0.72rem",
    color: "rgba(255,245,240,0.45)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "'Cormorant Garamond',serif",
  },
  card: {
    width: "min(300px,calc(100vw - 2rem))",
    background: "rgba(26,10,15,0.92)",
    border: "1px solid rgba(200,151,58,0.3)",
    borderRadius: "20px",
    backdropFilter: "blur(32px)",
    padding: "1rem",
    boxShadow:
      "0 4px 6px rgba(0,0,0,0.4),0 20px 50px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  pill: {
    padding: "0.6rem 1.1rem",
    borderRadius: "999px",
    background: "rgba(26,10,15,0.92)",
    border: "1px solid rgba(200,151,58,0.35)",
    backdropFilter: "blur(24px)",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(232,55,90,0.2)",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.9rem",
    marginBottom: "1rem",
  },
  meta: { flex: 1, minWidth: 0 },
  title: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#fff5f0",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "'Playfair Display',serif",
  },
  artist: {
    fontSize: "0.75rem",
    color: "rgba(200,151,58,0.85)",
    marginTop: "2px",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontStyle: "italic",
    fontFamily: "'Cormorant Garamond',serif",
  },
  progressWrap: { marginBottom: "0.85rem" },
  progressTrack: {
    width: "100%",
    height: "3px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "999px",
    cursor: "pointer",
    position: "relative" as const,
  },
  times: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "4px",
    fontSize: "0.68rem",
    color: "rgba(255,245,240,0.35)",
    fontFamily: "'Cormorant Garamond',serif",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,245,240,0.55)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  playBtn: {
    background: "linear-gradient(135deg,#e8375a,#b01840)",
    border: "none",
    borderRadius: "50%",
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(232,55,90,0.5)",
    flexShrink: 0,
  },
};

const Prev = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
);
const Next = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const ShuffleIcon = ({ active }: { active: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={active ? "#e8375a" : "currentColor"}
  >
    <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  </svg>
);
// const MusicNote = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
//   </svg>
// );
// const MinimiseIcon = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M19 13H5v-2h14v2z" />
//   </svg>
// );
const VolumeIcon = ({ muted, volume }: { muted: boolean; volume: number }) => {
  if (muted || volume === 0)
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
      </svg>
    );
  if (volume < 50)
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
};

function VinylDisc({
  playing,
  size = 52,
}: {
  playing: boolean;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        position: "relative",
        animation: playing ? "mpSpinDisc 4s linear infinite" : "none",
        background: `radial-gradient(circle at 50% 50%,#fff5f0 0%,#fff5f0 14%,#c8973a 15%,#c8973a 17%,#1a0a0f 18%,#2a0f14 22%,#1a0a0f 26%,#2a0f14 30%,#1a0a0f 34%,#2a0f14 38%,#1a0a0f 42%,#2a0f14 46%,#1a0a0f 50%)`,
        boxShadow: playing
          ? "0 0 20px rgba(232,55,90,0.5),0 4px 12px rgba(0,0,0,0.6)"
          : "0 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#e8375a",
          transform: "translate(-50%,-50%)",
          boxShadow: "0 0 6px rgba(232,55,90,0.8)",
        }}
      />
    </div>
  );
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60)
    .toString()
    .padStart(2, "0")}`;
};

export default function MusicPlayer() {
  const [songs, setSongs] = useState(_initialQ);
  const songsRef = useRef(songs);
  const featuredAddedRef = useRef(false);
  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [autoplayPending, setAutoplayPending] = useState(true);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const prevVolRef = useRef(70);
  const historyRef = useRef<number[]>([0]);
  const playerRef = useRef<YTPlayer | null>(null);
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);
  const tickRef = useRef<number>(0);
  const indexRef = useRef(index);
  const shuffleRef = useRef(shuffle);
  const pendingPlayRef = useRef(false);
  const goNextRef = useRef<() => void>(() => {});
  const goToRef = useRef<(i: number) => void>(() => {});
  const startTickRef = useRef<() => void>(() => {});
  const stopTickRef = useRef<() => void>(() => {});

  const [mobile, setMobile] = useState(isMobile());
  useEffect(() => {
    const h = () => setMobile(isMobile());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  indexRef.current = index;
  shuffleRef.current = shuffle;

  const stopTick = useCallback(() => {
    if (tickRef.current) cancelAnimationFrame(tickRef.current);
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    const tick = () => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const t = p.getCurrentTime(),
          d = p.getDuration();
        setCurrent(t);
        setDuration(d);
        setProgress(d > 0 ? t / d : 0);
      } catch (_) {}
      tickRef.current = requestAnimationFrame(tick);
    };
    tickRef.current = requestAnimationFrame(tick);
  }, [stopTick]);

  const goTo = useCallback(
    (i: number) => {
      const idx =
        ((i % songsRef.current.length) + songsRef.current.length) %
        songsRef.current.length;
      historyRef.current.push(idx);
      if (historyRef.current.length > 10) historyRef.current.shift();
      setIndex(idx);
      setProgress(0);
      setCurrent(0);
      setDuration(0);
      playerRef.current?.loadVideoById(songsRef.current[idx].id);
      setPlaying(true);
      startTick();
    },
    [startTick],
  );

  const goNext = useCallback(() => {
    goTo(
      getNextIndex(
        indexRef.current,
        songsRef.current.length,
        shuffleRef.current,
        historyRef.current,
      ),
    );
  }, [goTo]);

  goNextRef.current = goNext;
  goToRef.current = goTo;
  startTickRef.current = startTick;
  stopTickRef.current = stopTick;

  /*   YouTube: imperative container, empty deps, mirror refs   */
  useEffect(() => {
    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;z-index:-1;";
    document.body.appendChild(container);
    iframeContainerRef.current = container;

    const init = () => {
      playerRef.current = new window.YT.Player(container, {
        height: "1",
        width: "1",
        videoId: _opener.id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          enablejsapi: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,
        },
        events: {
          onReady: () => {
            setReady(true);
            playerRef.current?.setVolume(70);
            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              playerRef.current?.playVideo();
            }
          },
          onStateChange: (e) => {
            const { PLAYING, PAUSED, ENDED } = window.YT.PlayerState;
            if (e.data === PLAYING) {
              setPlaying(true);
              startTickRef.current();
            } else if (e.data === PAUSED) {
              setPlaying(false);
              stopTickRef.current();
            } else if (e.data === ENDED) {
              if (
                !featuredAddedRef.current &&
                indexRef.current === 0 &&
                _restFeat.length > 0
              ) {
                featuredAddedRef.current = true;
                const ns = [
                  songsRef.current[0],
                  ..._restFeat,
                  ...songsRef.current.slice(1),
                ];
                songsRef.current = ns;
                setSongs(ns);
                setPlaying(false);
                stopTickRef.current();
                goToRef.current(1);
              } else {
                setPlaying(false);
                stopTickRef.current();
                goNextRef.current();
              }
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      window.onYouTubeIframeAPIReady = init;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
    return () => {
      stopTickRef.current();
      try {
        document.body.removeChild(container);
      } catch (_) {}
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) playerRef.current.setVolume(muted ? 0 : volume);
  }, [volume, muted]);

  const togglePlay = () => {
    if (!ready || !playerRef.current) return;
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };
  const goPrev = () => {
    if (current > 3) {
      playerRef.current?.seekTo(0, true);
      setCurrent(0);
      setProgress(0);
    } else goTo(indexRef.current - 1);
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return;
    const r = Math.max(
      0,
      Math.min(
        1,
        (e.clientX - e.currentTarget.getBoundingClientRect().left) /
          e.currentTarget.getBoundingClientRect().width,
      ),
    );
    playerRef.current.seekTo(r * duration, true);
    setCurrent(r * duration);
    setProgress(r);
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (v > 0 && muted) setMuted(false);
    if (v > 0) prevVolRef.current = v;
  };
  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolume(prevVolRef.current || 70);
    } else {
      prevVolRef.current = volume;
      setMuted(true);
    }
  };

  /*   startAutoplay: MUST call playVideo() synchronously in click handler   */
  const startAutoplay = () => {
    setAutoplayPending(false);
    if (playerRef.current && ready) {
      playerRef.current.setVolume(volume);
      playerRef.current.playVideo();
    } else {
      pendingPlayRef.current = true;
    }
  };

  const song = songs[index];
  const dv = muted ? 0 : volume;

  const css = `
    @keyframes mpSpinDisc { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes mpPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes mpOverlayPulse { 0%,100%{transform:scale(1);opacity:0.9} 50%{transform:scale(1.06);opacity:1} }
    .mp-vol { -webkit-appearance:none;appearance:none;width:100%;height:3px;border-radius:999px;outline:none;cursor:pointer;
      background:linear-gradient(to right,#e8375a 0%,#c8973a ${dv}%,rgba(255,255,255,0.12) ${dv}%,rgba(255,255,255,0.12) 100%); }
    .mp-vol::-webkit-slider-thumb { -webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:#fff5f0;box-shadow:0 0 6px rgba(232,55,90,0.7);cursor:pointer; }
    .mp-vol::-moz-range-thumb { width:10px;height:10px;border:none;border-radius:50%;background:#fff5f0;box-shadow:0 0 6px rgba(232,55,90,0.7);cursor:pointer; }
    .mp-pl::-webkit-scrollbar { width:4px; }
    .mp-pl::-webkit-scrollbar-track { background:transparent; }
    .mp-pl::-webkit-scrollbar-thumb { background:rgba(200,151,58,0.35);border-radius:999px; }
  `;

  const ProgressBar = ({
    onClick,
  }: {
    onClick: React.MouseEventHandler<HTMLDivElement>;
  }) => (
    <div
      style={{
        width: "100%",
        height: "3px",
        background: "rgba(255,255,255,0.08)",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg,#e8375a,#c8973a)",
          borderRadius: "0 999px 999px 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${progress * 100}%`,
          width: "9px",
          height: "9px",
          background: "#fff5f0",
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          boxShadow: "0 0 6px rgba(232,55,90,0.8)",
        }}
      />
    </div>
  );

  const VolumeRow = ({ compact }: { compact?: boolean }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? "0.4rem" : "0.5rem",
        marginTop: compact ? 0 : "0.85rem",
      }}
    >
      <button
        style={{
          ...S.iconBtn,
          padding: 0,
          flexShrink: 0,
          color: muted ? "rgba(255,245,240,0.3)" : "rgba(255,245,240,0.55)",
        }}
        onClick={toggleMute}
      >
        <VolumeIcon muted={muted} volume={volume} />
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={dv}
        onChange={handleVolumeChange}
        className="mp-vol"
        aria-label="Volume"
      />
    </div>
  );

  const PlaylistItems = ({ onSelect }: { onSelect: () => void }) => (
    <>
      <div style={S.pTitle}>♪ Playlist</div>
      {songs.map((s, i) => (
        <div
          key={`${s.id}-${i}`}
          style={{
            ...S.pItem,
            background: i === index ? "rgba(232,55,90,0.12)" : "transparent",
          }}
          onClick={() => {
            goTo(i);
            onSelect();
          }}
          onMouseEnter={(e) => {
            if (i !== index)
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            if (i !== index)
              (e.currentTarget as HTMLDivElement).style.background =
                "transparent";
          }}
        >
          <span
            style={{
              ...S.pNum,
              color: i === index ? "#e8375a" : "rgba(255,245,240,0.3)",
              animation:
                i === index && playing
                  ? "mpPulse 1.5s ease-in-out infinite"
                  : "none",
            }}
          >
            {i === index && playing ? "♪" : i + 1}
          </span>
          <div style={S.pInfo}>
            <div
              style={{
                ...S.pSong,
                color: i === index ? "#fff5f0" : "rgba(255,245,240,0.75)",
              }}
            >
              {s.title}
            </div>
            <div style={S.pArtist}>{s.artist}</div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      <style>{css}</style>

      {/*   Tap-to-play overlay: entire div is clickable on mobile   */}
      {autoplayPending && (
        <div
          onClick={startAutoplay}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,4,8,0.88)",
            backdropFilter: "blur(8px)",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#e8375a,#b01840)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 40px rgba(232,55,90,0.55),0 8px 24px rgba(0,0,0,0.6)",
              animation: "mpOverlayPulse 2s ease-in-out infinite",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "1.2rem",
                color: "#fff5f0",
                letterSpacing: "0.04em",
                marginBottom: "0.4rem",
              }}
            >
              Tap to play music
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "0.8rem",
                color: "rgba(200,151,58,0.7)",
                letterSpacing: "0.12em",
              }}
            >
              ♥ {_opener.title} — {_opener.artist}
            </div>
          </div>
        </div>
      )}

      {/* ══ MOBILE: slim bar with volume ══ */}
      {mobile && (
        <>
          {showPlaylist && (
            <div
              className="mp-pl"
              style={{
                position: "fixed",
                bottom: "80px",
                left: 0,
                right: 0,
                maxHeight: "45vh",
                overflowY: "auto",
                zIndex: 1016,
                background: "#120609",
                borderTop: "1px solid rgba(200,151,58,0.2)",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <PlaylistItems onSelect={() => setShowPlaylist(false)} />
            </div>
          )}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1015,
              background: "rgba(14,5,10,0.97)",
              borderTop: "1px solid rgba(200,151,58,0.28)",
              backdropFilter: "blur(28px)",
              boxShadow: "0 -2px 20px rgba(0,0,0,0.6)",
              paddingBottom: "env(safe-area-inset-bottom,0px)",
            }}
          >
            <ProgressBar onClick={seek} />
            {/* Main row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.45rem 0.9rem",
                gap: "0.6rem",
                height: "52px",
              }}
            >
              <VinylDisc playing={playing} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#fff5f0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: "'Playfair Display',serif",
                  }}
                >
                  {song.title}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "rgba(200,151,58,0.85)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontStyle: "italic",
                    fontFamily: "'Cormorant Garamond',serif",
                  }}
                >
                  {song.artist}
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <button
                  style={{ ...S.iconBtn, padding: "6px" }}
                  onClick={goPrev}
                >
                  <Prev />
                </button>
                <button
                  style={{
                    ...S.playBtn,
                    width: "36px",
                    height: "36px",
                    opacity: ready ? 1 : 0.5,
                  }}
                  onClick={togglePlay}
                  disabled={!ready}
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                  style={{ ...S.iconBtn, padding: "6px" }}
                  onClick={goNext}
                >
                  <Next />
                </button>
                <button
                  style={{
                    ...S.iconBtn,
                    padding: "6px",
                    color: showPlaylist ? "#c8973a" : "rgba(255,245,240,0.3)",
                  }}
                  onClick={() => setShowPlaylist((v) => !v)}
                >
                  <ListIcon />
                </button>
              </div>
            </div>
            {/* Volume row */}
            <div style={{ padding: "0 0.9rem 0.5rem" }}>
              <VolumeRow compact />
            </div>
          </div>
        </>
      )}

      {/* ══ DESKTOP FULL: floating card ══ */}
      {!mobile && (
        <div style={S.wrap}>
          {showPlaylist && (
            <div style={S.playlist} className="mp-pl">
              <PlaylistItems onSelect={() => setShowPlaylist(false)} />
            </div>
          )}
          <div style={S.card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.9rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(200,151,58,0.6)",
                  fontFamily: "'Cormorant Garamond',serif",
                }}
              >
                ♥ Now Playing
              </span>
            </div>
            <div style={S.topRow}>
              <VinylDisc playing={playing} size={56} />
              <div style={S.meta}>
                <div style={S.title}>{song.title}</div>
                <div style={S.artist}>{song.artist}</div>
              </div>
            </div>
            <div style={S.progressWrap}>
              <div
                style={{ ...S.progressTrack, overflow: "visible" }}
                onClick={seek}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "999px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg,#e8375a,#c8973a)",
                    borderRadius: "999px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${progress * 100}%`,
                    width: "10px",
                    height: "10px",
                    background: "#fff5f0",
                    borderRadius: "50%",
                    transform: "translate(-50%,-50%)",
                    boxShadow: "0 0 8px rgba(232,55,90,0.7)",
                  }}
                />
              </div>
              <div style={S.times}>
                <span>{fmt(current)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
            <div style={S.controls}>
              <button
                style={{
                  ...S.iconBtn,
                  color: shuffle ? "#e8375a" : "rgba(255,245,240,0.4)",
                }}
                onClick={() => setShuffle((s) => !s)}
              >
                <ShuffleIcon active={shuffle} />
              </button>
              <button
                style={{ ...S.iconBtn, color: "rgba(255,245,240,0.7)" }}
                onClick={goPrev}
              >
                <Prev />
              </button>
              <button
                style={{
                  ...S.playBtn,
                  boxShadow: playing
                    ? "0 4px 22px rgba(232,55,90,0.75)"
                    : "0 4px 16px rgba(232,55,90,0.4)",
                  opacity: ready ? 1 : 0.5,
                }}
                onClick={togglePlay}
                disabled={!ready}
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                style={{ ...S.iconBtn, color: "rgba(255,245,240,0.7)" }}
                onClick={goNext}
              >
                <Next />
              </button>
              <button
                style={{
                  ...S.iconBtn,
                  color: showPlaylist ? "#c8973a" : "rgba(255,245,240,0.4)",
                }}
                onClick={() => setShowPlaylist((v) => !v)}
              >
                <ListIcon />
              </button>
            </div>
            <VolumeRow />
            <div
              style={{
                textAlign: "center",
                marginTop: "0.65rem",
                fontSize: "0.65rem",
                color: "rgba(255,245,240,0.2)",
                fontFamily: "'Cormorant Garamond',serif",
                letterSpacing: "0.12em",
              }}
            >
              {index + 1} / {songs.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
