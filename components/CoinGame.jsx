"use client";

import { useEffect, useRef, useState } from "react";
import { inr } from "../app/config";

const DURATION = 20; // seconds

export default function CoinGame({ onDone, onSkip }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("ready"); // ready | playing | over
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [best, setBest] = useState(0);

  // Size the canvas (and draw an idle frame) whenever not playing
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const size = () => {
      const W = wrapRef.current.clientWidth;
      const H = gameHeight(W, wrapRef.current);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBg(ctx, W, H, 0);
      drawWallet(ctx, W / 2, H - 34);
    };
    if (phase !== "playing") {
      size();
      window.addEventListener("resize", size);
      return () => window.removeEventListener("resize", size);
    }
  }, [phase]);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;
    const resize = () => {
      W = wrapRef.current.clientWidth;
      H = gameHeight(W, wrapRef.current);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const s = { px: W / 2, items: [], pops: [], score: 0, start: performance.now(), lastSpawn: 0, keys: {} };

    const setX = (clientX) => {
      const r = canvas.getBoundingClientRect();
      s.px = clamp(clientX - r.left, 44, W - 44);
    };
    const onPointer = (e) => setX(e.clientX);
    const onTouch = (e) => {
      if (e.touches[0]) {
        setX(e.touches[0].clientX);
        e.preventDefault();
      }
    };
    const onKey = (down) => (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        s.keys[e.key] = down;
        e.preventDefault();
      }
    };
    const kd = onKey(true);
    const ku = onKey(false);
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    let raf;
    let last = performance.now();

    const spawn = (elapsed) => {
      const bad = Math.random() < 0.2;
      const roll = Math.random();
      const value = bad ? -300 : roll < 0.6 ? 100 : roll < 0.9 ? 200 : 500;
      s.items.push({
        x: 30 + Math.random() * (W - 60),
        y: -30,
        r: value === 500 ? 24 : 20,
        vy: 150 + elapsed * 10 + Math.random() * 90,
        bad,
        value,
        wobble: Math.random() * 6,
      });
    };

    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const elapsed = (t - s.start) / 1000;
      const left = Math.max(0, DURATION - elapsed);

      if (s.keys.ArrowLeft) s.px = clamp(s.px - 560 * dt, 44, W - 44);
      if (s.keys.ArrowRight) s.px = clamp(s.px + 560 * dt, 44, W - 44);

      const interval = Math.max(280, 680 - elapsed * 22);
      if (t - s.lastSpawn > interval) {
        spawn(elapsed);
        s.lastSpawn = t;
      }

      const py = H - 34;
      for (const it of s.items) {
        it.y += it.vy * dt;
        it.wobble += dt * 5;
        const halfW = it.bad ? 46 : it.r;
        if (!it.hit && it.y + 14 > py - 18 && it.y - 14 < py + 10 && Math.abs(it.x - s.px) < 44 + halfW * 0.6) {
          it.hit = true;
          s.score = Math.max(0, s.score + it.value);
          s.pops.push({ x: it.x, y: py - 40, text: (it.value > 0 ? "+" : "−") + inr(Math.abs(it.value)), life: 0.9, bad: it.bad });
          if (navigator.vibrate) navigator.vibrate(it.bad ? 60 : 15);
        }
      }
      s.items = s.items.filter((it) => !it.hit && it.y < H + 40);
      s.pops.forEach((p) => {
        p.life -= dt;
        p.y -= 50 * dt;
      });
      s.pops = s.pops.filter((p) => p.life > 0);

      drawBg(ctx, W, H, elapsed);
      for (const it of s.items) (it.bad ? drawMaybeLater : drawCoin)(ctx, it);
      drawWallet(ctx, s.px, py);
      for (const p of s.pops) {
        ctx.globalAlpha = Math.max(0, p.life / 0.9);
        ctx.fillStyle = p.bad ? "#ff5d73" : "#ffd23f";
        ctx.font = "800 18px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.text, p.x, p.y);
        ctx.globalAlpha = 1;
      }

      setScore(s.score);
      setTimeLeft(Math.ceil(left));
      if (left <= 0) {
        setBest((b) => Math.max(b, s.score));
        setPhase("over");
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [phase]);

  const play = () => {
    setScore(0);
    setTimeLeft(DURATION);
    setPhase("playing");
  };

  return (
    <section className="level-game">
      <p className="eyebrow">Level 2</p>
      <h2 className="h2">Catch the coins!</h2>
      <p className="sub">
        Slide your finger to move the wallet. Grab the <b className="gold">₹ coins</b>, dodge the{" "}
        <b className="red">“Maybe later”</b> excuses.
      </p>

      <div className="game-stats">
        <span>
          Score <b>{inr(score)}</b>
        </span>
        <span>
          Time <b>{timeLeft}s</b>
        </span>
      </div>

      <div className="game" ref={wrapRef}>
        <canvas ref={canvasRef} className="game-canvas" />
        {phase === "ready" && (
          <div className="overlay">
            <p className="overlay-title">20 seconds. Go!</p>
            <button className="btn btn-big pulse" onClick={play}>
              PLAY
            </button>
          </div>
        )}
        {phase === "over" && (
          <div className="overlay">
            <p className="overlay-kicker">TIME UP</p>
            <p className="overlay-title">You caught {inr(score)}</p>
            <p className="overlay-sub">Nice! But game money can’t buy a PS5… real money can 😄</p>
            <button className="btn btn-big" onClick={() => onDone(Math.max(best, score))}>
              MAKE IT REAL →
            </button>
            <button className="btn-link" onClick={play}>
              Play again
            </button>
          </div>
        )}
      </div>

      {phase !== "over" && (
        <button className="btn-link center" onClick={onSkip}>
          Skip game
        </button>
      )}
    </section>
  );
}

function gameHeight(W, wrap) {
  const h = clamp(W * 1.15, 380, 520);
  if (W <= 480) return Math.round(h); // phones: unchanged
  // Wide screens: also keep the canvas inside the viewport so it's playable without scrolling
  const top = wrap.getBoundingClientRect().top + window.scrollY;
  return Math.round(clamp(Math.min(h, window.innerHeight - top - 16), 380, 520));
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function drawBg(ctx, W, H, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0b1440");
  g.addColorStop(1, "#060a1f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let i = 0; i < 40; i++) {
    const x = (i * 97) % W;
    const y = ((i * 53 + t * (10 + (i % 5) * 6)) % H + H) % H;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.fillStyle = "rgba(47,123,255,0.25)";
  ctx.fillRect(0, H - 8, W, 8);
}

function drawCoin(ctx, it) {
  const squash = Math.abs(Math.cos(it.wobble)) * 0.35 + 0.65;
  ctx.save();
  ctx.translate(it.x, it.y);
  ctx.scale(squash, 1);
  ctx.beginPath();
  ctx.arc(0, 0, it.r, 0, Math.PI * 2);
  ctx.fillStyle = it.value === 500 ? "#ffb703" : "#ffd23f";
  ctx.shadowColor = "rgba(255,210,63,0.8)";
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#c98a00";
  ctx.stroke();
  ctx.fillStyle = "#7a4d00";
  ctx.font = `800 ${it.r}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("₹", 0, 1);
  ctx.restore();
  if (it.value === 500) {
    ctx.fillStyle = "#ffd23f";
    ctx.font = "800 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("500", it.x, it.y + it.r + 13);
  }
}

function drawMaybeLater(ctx, it) {
  const w = 96;
  const h = 30;
  ctx.save();
  ctx.translate(it.x, it.y);
  ctx.rotate(Math.sin(it.wobble) * 0.08);
  roundRect(ctx, -w / 2, -h / 2, w, h, 15);
  ctx.fillStyle = "#ff5d73";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 13px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Maybe later", 0, 1);
  ctx.restore();
}

function drawWallet(ctx, x, y) {
  const w = 88;
  const h = 34;
  ctx.save();
  ctx.translate(x, y);
  roundRect(ctx, -w / 2, -h / 2, w, h, 10);
  ctx.fillStyle = "#2f7bff";
  ctx.shadowColor = "rgba(47,123,255,0.9)";
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.shadowBlur = 0;
  roundRect(ctx, -w / 2 + 6, -h / 2 - 6, w - 12, 8, 4);
  ctx.fillStyle = "#9cc0ff";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 11px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("FAMILY FUND", 0, 2);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
