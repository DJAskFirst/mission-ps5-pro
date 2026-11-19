"use client";

import { useState } from "react";
import Hud from "../components/Hud";
import StartScreen from "../components/StartScreen";
import Mission from "../components/Mission";
import CoinGame from "../components/CoinGame";
import PowerUps from "../components/PowerUps";
import PayScreen from "../components/PayScreen";
import Victory from "../components/Victory";

const LEVELS = { start: 0, mission: 1, game: 2, powerup: 3, pay: 4, done: 4 };

export default function Page() {
  const [screen, setScreen] = useState("start");
  const [gameScore, setGameScore] = useState(0);
  const [amount, setAmount] = useState(0);

  const go = (s) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="app">
      {screen !== "start" && <Hud level={LEVELS[screen]} />}

      <div className="screen" key={screen}>
        {screen === "start" && <StartScreen onStart={() => go("mission")} />}
        {screen === "mission" && <Mission onNext={() => go("game")} />}
        {screen === "game" && (
          <CoinGame
            onDone={(score) => {
              setGameScore(score);
              go("powerup");
            }}
            onSkip={() => go("powerup")}
          />
        )}
        {screen === "powerup" && (
          <PowerUps
            gameScore={gameScore}
            onPick={(a) => {
              setAmount(a);
              go("pay");
            }}
          />
        )}
        {screen === "pay" && (
          <PayScreen amount={amount} onBack={() => go("powerup")} onPaid={() => go("done")} />
        )}
        {screen === "done" && <Victory amount={amount} onRestart={() => go("start")} />}
      </div>
    </main>
  );
}
