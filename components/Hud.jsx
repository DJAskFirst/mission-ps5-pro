import { CONFIG, inr } from "../app/config";

export default function Hud({ level }) {
  const pct = Math.min(100, Math.round((CONFIG.raisedSoFar / CONFIG.goal) * 100));
  return (
    <header className="hud">
      <div className="hud-row">
        <span className="hud-title">MISSION: PS5 PRO</span>
        <span className="hud-level">LVL {level}/4</span>
      </div>
      <div className="bar" aria-label={`Raised ${inr(CONFIG.raisedSoFar)} of ${inr(CONFIG.goal)}`}>
        <div className="bar-fill" style={{ width: Math.max(pct, 2) + "%" }} />
      </div>
      <div className="hud-row small">
        <span>{inr(CONFIG.raisedSoFar)} raised</span>
        <span>Goal {inr(CONFIG.goal)}</span>
      </div>
    </header>
  );
}
