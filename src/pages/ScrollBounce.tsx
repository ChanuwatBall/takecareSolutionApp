import React, { useEffect, useRef, useState } from "react";

 
export default function ScrollBounce({
  // height = 520,
  max = 70,           // ระยะ overscroll สูงสุด (px)
  wheelFactor = 0.28, // ความต้านสำหรับ wheel
  touchFactor = 0.45, // ความต้านสำหรับ touch
  springK = 0.02,     // ค่าคงที่สปริง (ยิ่งมากยิ่งดีดแรง)
  damping = 0.12,     // หน่วงความเร็ว (ยิ่งมากยิ่งหยุดไว)
  children,
}: React.PropsWithChildren<{
  height?: number;
  max?: number;
  wheelFactor?: number;
  touchFactor?: number;
  springK?: number;
  damping?: number;
}>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // สถานะอยู่บนสุด/ล่างสุด (เพื่อรู้ว่าเริ่ม overscroll ได้เมื่อไหร่)
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  // ตัวแปรฟิสิกส์ของสปริง
  const yRef = useRef(0);      // ตำแหน่ง (px)
  const vRef = useRef(0);      // ความเร็ว
  const animRef = useRef<number | null>(null);

  // สำหรับ touch
  const touchStartY = useRef<number | null>(null);

  // อัปเดตขอบ
  const updateEdges = () => {
    const el = containerRef.current;
    if (!el) return;
    setAtTop(el.scrollTop <= 0);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
  };

  useEffect(() => { updateEdges(); }, []);

  // เรนเดอร์การแปลตำแหน่งและ glow
  const render = () => {
    const y = yRef.current;
    const content = contentRef.current;
    if (content) {
      content.style.transform = `translateY(${y}px)`;
    }
    // glow
    const topGlow = containerRef.current?.querySelector(
      ".bounce-glow.top"
    ) as HTMLDivElement | null;
    const bottomGlow = containerRef.current?.querySelector(
      ".bounce-glow.bottom"
    ) as HTMLDivElement | null;

    const topOpacity = y > 0 ? Math.min(1, y / max) : 0;
    const bottomOpacity = y < 0 ? Math.min(1, Math.abs(y) / max) : 0;
    if (topGlow) topGlow.style.opacity = String(topOpacity);
    if (bottomGlow) bottomGlow.style.opacity = String(bottomOpacity);
  };

  // สุ่มค่าเข้าสปริงจนกลับศูนย์
  const startSpringToZero = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const step = () => {
      const y = yRef.current;
      const v = vRef.current;

      // F = -k*x - c*v
      const a = -springK * y - damping * v;
      const nv = v + a * 16; // dt ~ 16ms ต่อเฟรม
      const ny = y + nv * 16;

      vRef.current = nv;
      yRef.current = Math.abs(ny) < 0.1 && Math.abs(nv) < 0.1 ? 0 : ny;

      render();

      if (yRef.current !== 0) {
        animRef.current = requestAnimationFrame(step);
      } else {
        animRef.current = null;
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  // ช่วยตั้งค่า y พร้อม clamp และเรนเดอร์
  const setOverscroll = (val: number) => {
    const clamped = Math.max(-max, Math.min(max, val));
    yRef.current = clamped;
    render();
  };

  // --- Wheel ---
  const wheelTimer = useRef<number | null>(null);
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const el = containerRef.current;
    if (!el) return;

    const dy = e.deltaY;

    if (atTop && dy < 0) {
      // เลื่อนขึ้นที่บนสุด => ดึงลง (y เพิ่ม)
      setOverscroll(yRef.current + -dy * wheelFactor);
      e.preventDefault();
    } else if (atBottom && dy > 0) {
      // เลื่อนลงที่ล่างสุด => ดันขึ้น (y ลบ)
      setOverscroll(yRef.current - dy * wheelFactor);
      e.preventDefault();
    }

    if (wheelTimer.current) window.clearTimeout(wheelTimer.current);
    wheelTimer.current = window.setTimeout(() => startSpringToZero(), 90);
  };

  useEffect(() => () => {
    if (wheelTimer.current) window.clearTimeout(wheelTimer.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  // --- Touch ---
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const el = containerRef.current;
    if (!el || touchStartY.current == null) return;

    const cur = e.touches[0].clientY;
    const dy = cur - touchStartY.current; // + ดึงลง, - ดันขึ้น

    if (atTop && dy > 0) {
      setOverscroll(dy * touchFactor);
      e.preventDefault();
    } else if (atBottom && dy < 0) {
      setOverscroll(dy * touchFactor);
      e.preventDefault();
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    touchStartY.current = null;
    startSpringToZero();
  };

  // อัปเดตสถานะขอบเมื่อสกอล์ปกติ
  const onScroll: React.UIEventHandler<HTMLDivElement> = () => updateEdges();

  // ปุ่มเลื่อนแบบ smooth
  // const smoothScrollTo = (top: number) => {
  //   const el = containerRef.current;
  //   if (!el) return;
  //   el.scrollTo({ top, behavior: "smooth" });
  // };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        gap: 12, 
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", sans-serif',
      }}
    > 
      <div
        ref={containerRef}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onScroll={onScroll}
        style={{
          position: "relative", 
          borderRadius: 12,
          overflow: "auto",
          height: "100%",
          background: "#fff",
          overscrollBehavior: "contain", // กัน body เด้งตาม
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Glow บน */}
        <div className="bounce-glow top" style={glowTop} />
        {/* Glow ล่าง */}
        <div className="bounce-glow bottom" style={glowBottom} />

        {/* เนื้อหาที่จะถูก translateY */}
        <div ref={contentRef}>
     
          {children}
        </div>
      </div>
 
    </div>
  );
}

// const btn: React.CSSProperties = {
//   padding: "8px 12px",
//   border: "1px solid #e5e7eb",
//   borderRadius: 10,
//   background: "#fff",
//   cursor: "pointer",
// };

const glowTop: React.CSSProperties = {
  position: "sticky",
  top: 0,
  height: 24,
  transform: "translateY(-12px)",
  background: "linear-gradient(180deg, rgba(59,130,246,.35), rgba(59,130,246,0))",
  opacity: 0,
  pointerEvents: "none",
};

const glowBottom: React.CSSProperties = {
  position: "sticky",
  bottom: 0,
  height: 24,
  transform: "translateY(12px)",
  background: "linear-gradient(0deg, rgba(16,185,129,.35), rgba(16,185,129,0))",
  opacity: 0,
  pointerEvents: "none",
};

// function ContentBlocks() {
//   const blocks = new Array(18).fill(0).map((_, i) => i + 1);
//   return (
//     <div style={{ padding: 16, display: "grid", gap: 12 }}>
//       {blocks.map((i) => (
//         <div key={i} style={card}>
//           <h4 style={{ margin: 0 }}>บล็อกเนื้อหา #{i}</h4>
//           <p style={{ margin: "6px 0 0", color: "#4b5563", lineHeight: 1.6 }}>
//             เนื้อหาตัวอย่างเพื่อทดสอบเลื่อนหน้าจอและเด้งนุ่ม ๆ เมื่อชนขอบบน/ล่าง
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "#ffffff",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};
