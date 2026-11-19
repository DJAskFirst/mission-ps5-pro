"use client";

import { useEffect, useRef } from "react";
import { CONFIG, inr } from "../app/config";

export default function Victory({ amount, onRestart }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return confetti(canvasRef.current);
  }, []);

  const shareText = `I just powered up ${CONFIG.name}'s PS5 Pro mission 🎮 Your turn! `;
  const share = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    window.open("https://wa.me/?text=" + encodeURIComponent(shareText + url), "_blank");
  };

  return (
    <section className="victory">
      <canvas ref={canvasRef} className="confetti" aria-hidden="true" />
      <p className="eyebrow">Achievement unlocked</p>
      <h2 className="title small">
        <span className="glow">FAMILY LEGEND</span>
      </h2>
      <div className="trophy" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="88" height="88" fill="none" stroke="#ffd23f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
          <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
        </svg>
      </div>
      <p className="lead">
        Thank you for the {inr(amount)} power-up! {CONFIG.name} owes you one game night.
      </p>
      <p className="hint">If the payment didn’t go through, go back and try the QR.</p>

      <button className="btn btn-big btn-wa" onClick={share}>
        CHALLENGE THE NEXT FAMILY MEMBER
      </button>
      <button className="btn-link center" onClick={onRestart}>
        Play again
      </button>
    </section>
  );
}

function confetti(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = ["#ffd23f", "#2f7bff", "#ff5d73", "#7ee0a1", "#ffffff"];
  const parts = Array.from({ length: 160 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 60,
    y: H * 0.35,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 13 - 4,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    c: colors[(Math.random() * colors.length) | 0],
  }));
  let raf;
  let frames = 0;
  const tick = () => {
    frames++;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.3;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (frames < 260) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
