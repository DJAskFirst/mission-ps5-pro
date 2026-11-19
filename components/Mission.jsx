"use client";

import { useState } from "react";
import { CONFIG } from "../app/config";

export default function Mission({ onNext }) {
  const [open, setOpen] = useState(0);
  const unlocked = open >= CONFIG.reasons.length - 1;

  return (
    <section>
      <p className="eyebrow">Level 1</p>
      <h2 className="h2">Why you should join the squad</h2>
      <p className="sub">Tap each card to unlock the next reason.</p>

      <div className="reasons">
        {CONFIG.reasons.map((r, i) => {
          const isOpen = i <= open;
          return (
            <button
              key={r.title}
              className={"reason" + (isOpen ? " open" : " locked")}
              disabled={i > open + 1}
              onClick={() => setOpen(Math.max(open, i))}
            >
              <span className="reason-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="reason-body">
                <span className="reason-title">{isOpen ? r.title : "Locked — tap to unlock"}</span>
                {isOpen && <span className="reason-text">{r.text}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <button className="btn btn-big" disabled={!unlocked} onClick={onNext}>
        {unlocked ? "NEXT LEVEL →" : `Unlock all ${CONFIG.reasons.length} reasons`}
      </button>
    </section>
  );
}
