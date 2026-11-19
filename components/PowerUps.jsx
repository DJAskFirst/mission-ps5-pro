"use client";

import { useState } from "react";
import { CONFIG, inr } from "../app/config";

export default function PowerUps({ gameScore, onPick }) {
  // Suggest the tier closest to the game score (if they played)
  const suggested =
    gameScore > 0
      ? CONFIG.tiers.reduce((a, b) => (Math.abs(b.amount - gameScore) < Math.abs(a.amount - gameScore) ? b : a))
          .amount
      : null;

  const [selected, setSelected] = useState(suggested ?? CONFIG.tiers[1].amount);
  const [custom, setCustom] = useState("");

  const amount = custom ? Math.floor(Number(custom)) || 0 : selected;
  const pct = ((amount / CONFIG.goal) * 100).toFixed(amount / CONFIG.goal < 0.1 ? 1 : 0);

  return (
    <section>
      <p className="eyebrow">Level 3</p>
      <h2 className="h2">Choose your power-up</h2>
      {gameScore > 0 ? (
        <p className="sub">
          You scored <b className="gold">{inr(gameScore)}</b> in the game — we picked the closest power-up for you.
        </p>
      ) : (
        <p className="sub">Every power-up moves the mission forward.</p>
      )}

      <div className="tiers">
        {CONFIG.tiers.map((t) => {
          const on = !custom && selected === t.amount;
          return (
            <button
              key={t.amount}
              className={"tier" + (on ? " on" : "")}
              onClick={() => {
                setCustom("");
                setSelected(t.amount);
              }}
            >
              <span className="tier-top">
                <span className="tier-name">{t.name}</span>
                <span className="tier-amt">{inr(t.amount)}</span>
              </span>
              <span className="tier-perk">Reward: {t.perk}</span>
              {suggested === t.amount && <span className="badge">Your score</span>}
            </button>
          );
        })}
      </div>

      <label className="custom">
        <span className="custom-label">Or your own amount</span>
        <span className="custom-input">
          <span>₹</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            placeholder="Enter amount"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        </span>
      </label>

      {amount > 0 && (
        <p className="impact">
          {inr(amount)} = <b>{pct}%</b> of the PS5 Pro
        </p>
      )}

      <button className="btn btn-big" disabled={!(amount > 0)} onClick={() => onPick(amount)}>
        {amount > 0 ? `LOCK IN ${inr(amount)} →` : "Pick an amount"}
      </button>
    </section>
  );
}
