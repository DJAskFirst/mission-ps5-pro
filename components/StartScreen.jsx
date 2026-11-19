import { CONFIG, inr } from "../app/config";

export default function StartScreen({ onStart }) {
  return (
    <section className="start">
      <p className="eyebrow">A family mission from {CONFIG.name}</p>
      <h1 className="title">
        MISSION:
        <br />
        <span className="glow">PS5 PRO</span>
      </h1>
      <div className="hero-img">
        <img src="/ps5pro.jpg" alt="PS5 Pro console, box and controller" />
      </div>
      <p className="lead">
        I need my family squad to unlock this one. Goal: <b>{inr(CONFIG.goal)}</b>.
      </p>
      <button className="btn btn-big pulse" onClick={onStart}>
        PRESS START
      </button>
      <p className="hint">4 quick levels · about 1 minute</p>
    </section>
  );
}
