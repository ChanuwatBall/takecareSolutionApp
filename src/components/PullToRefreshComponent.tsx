import React, { useState, useEffect, useRef, type ReactNode, useCallback } from 'react';

interface PullContettProp{children:ReactNode}


type Mode = "none" | "down" | "up";
const THRESHOLD = 80;
const SNAP = 60;
const MAX_PULL = 160;
const TRANSITION_MS = 280;
const TOP_BUFFER = 0;
const BOTTOM_BUFFER = 32; // more forgiving on mobile


const PullToRefreshComponent = ({children}:PullContettProp) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const maxScrollRef = useRef(0);
  const draggingRef = useRef(false);
  const modeRef = useRef<Mode>("none");

  const [pullDown, setPullDown] = useState(0);
  const [pullUp, setPullUp] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // debug HUD
  const [hud, setHud] = useState({ st: 0, ch: 0, sh: 0, mode: "none" });
  console.log("hud ",hud)
  const resist = (d: number) => {
    if (d <= 0) return 0;
    const limited = Math.min(d, MAX_PULL);
    return limited / (1 + limited / 150);
  };

  const nearTop = (el: HTMLDivElement) => el.scrollTop <= TOP_BUFFER;
  const nearBottom = (el: HTMLDivElement) =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - BOTTOM_BUFFER;

  const setDraggingTouchAction = (on: boolean) => {
    const el = containerRef.current;
    if (!el) return;
    // disable vertical pan only during an active pull so native scroll won't fight us
    el.style.touchAction = on ? "none" : "pan-x";
  };

  const animateTo = (down: number, up: number) => {
    setAnimating(true);
    setPullDown(down);
    setPullUp(up);
  };

  const resetGesture = () => {
    draggingRef.current = false;
    modeRef.current = "none";
    setDraggingTouchAction(false);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshing || isLoading) return;
    const el = containerRef.current;
    if (!el) return;

    draggingRef.current = true;
    modeRef.current = "none";
    setAnimating(false);

    startYRef.current = e.touches[0].clientY;
    startScrollTopRef.current = el.scrollTop;
    maxScrollRef.current = Math.max(0, el.scrollHeight - el.clientHeight);

    setHud({ st: el.scrollTop, ch: el.clientHeight, sh: el.scrollHeight, mode: "none" });
  }, [isRefreshing, isLoading]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!draggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const y = e.touches[0].clientY;
    const dy = y - startYRef.current;

    // Decide direction (lock) with generous bottom logic
    if (modeRef.current === "none") {
      const topOk = dy > 5 && nearTop(el);
      const bottomSnapshotOk =
        dy < -5 && startScrollTopRef.current >= maxScrollRef.current - BOTTOM_BUFFER;
      const bottomLiveOk = dy < -5 && nearBottom(el);

      if (topOk) modeRef.current = "down";
      else if (bottomSnapshotOk || bottomLiveOk) modeRef.current = "up";
      else {
        // not pulling; update HUD and let native scroll run
        setHud({ st: el.scrollTop, ch: el.clientHeight, sh: el.scrollHeight, mode: "none" });
        return;
      }
      // as soon as we lock, stop native vertical scrolling
      setDraggingTouchAction(true);
    }

    if (modeRef.current === "down") {
      if (dy > 0) {
        e.preventDefault();
        setPullUp(0);
        setPullDown(resist(dy));
      } else {
        setPullDown(0);
      }
    } else if (modeRef.current === "up") {
      if (dy < 0) {
        e.preventDefault();
        setPullDown(0);
        setPullUp(resist(-dy));
      } else {
        setPullUp(0);
      }
    }

    setHud({
      st: el.scrollTop,
      ch: el.clientHeight,
      sh: el.scrollHeight,
      mode: modeRef.current,
    });
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!draggingRef.current) return;
    const mode = modeRef.current;

    if (mode === "down") {
      if (pullDown >= THRESHOLD) {
        animateTo(SNAP, 0);
        setTimeout(async () => {
          setIsRefreshing(true);
          // TODO: real refresh
          await new Promise((r) => setTimeout(r, 1000));
          setIsRefreshing(false);
          animateTo(0, 0);
          setTimeout(() => setAnimating(false), TRANSITION_MS);
        }, TRANSITION_MS);
      } else {
        animateTo(0, 0);
        setTimeout(() => setAnimating(false), TRANSITION_MS);
      }
    } else if (mode === "up") {
      if (pullUp >= THRESHOLD) {
        animateTo(0, SNAP);
        setTimeout(async () => {
          setIsLoading(true);
          // TODO: real load more (append items)
          await new Promise((r) => setTimeout(r, 1000));
          setIsLoading(false);
          // close after items appended
          animateTo(0, 0);
          setTimeout(() => setAnimating(false), TRANSITION_MS);
        }, TRANSITION_MS);
      } else {
        animateTo(0, 0);
        setTimeout(() => setAnimating(false), TRANSITION_MS);
      }
    }

    resetGesture();
  }, [pullDown, pullUp]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use capture so we see events before children stop them.
    el.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true, capture: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart as any, true);
      el.removeEventListener("touchmove", handleTouchMove as any, true);
      el.removeEventListener("touchend", handleTouchEnd as any, true);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const translateY = pullDown - pullUp;

  const contentStyle: React.CSSProperties = {
    transform: `translateY(${translateY}px)`,
    transition: animating ? `transform ${TRANSITION_MS}ms cubic-bezier(.22,.61,.36,1)` : "none",
    willChange: "transform",
    minHeight: "100%",
    background: "linear-gradient(#fff, #f6f7fb)",
  };

  const indicatorBase: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    fontSize: 14,
  };

  return (
    <div
      ref={containerRef}
      style={{
        overflowY: "auto",
        height: "100vh",
        position: "relative",
        WebkitOverflowScrolling: "touch",
        // default while idle; we switch to none while dragging
        touchAction: "pan-x",
        overscrollBehaviorY: "contain",
        background: "#fff",
      }}
    >
      {/* Top indicator */}
      <div style={{ ...indicatorBase, top: 0, height: SNAP, opacity: Math.min(0.9, pullDown / THRESHOLD) }}>
        {isRefreshing ? "Refreshing…" : pullDown >= THRESHOLD ? "Release to refresh" : "Pull down to refresh"}
      </div>

      {/* Bottom indicator */}
      <div style={{ ...indicatorBase, bottom: 0, height: SNAP, opacity: Math.min(0.9, pullUp / THRESHOLD) }}>
        {isLoading ? "Loading more…" : pullUp >= THRESHOLD ? "Release to load more" : "Pull up to load more"}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {children}
      </div>

      {/* Debug HUD — remove in prod */}
      <div
        style={{
          position: "fixed",
          right: 8,
          bottom: 8,
          padding: "6px 8px", 
          color: "#fff",
          borderRadius: 6,
          fontSize: 12,
        }}
      >
        {/* st:{Math.round(hud.st)} ch:{hud.ch} sh:{hud.sh} mode:{hud.mode} */}
      </div>
    </div>
  );
};

export default PullToRefreshComponent;