import { useState, useRef } from "react";

export default function Cronometro() {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const pause = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      setRunning(false);
    }
  };

  const reset = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    setRunning(false);
  };

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  return (
    <div className="container">
      <h1>Cronômetro de Estudo</h1>

      <h2>{formatTime(time)}</h2>

      <div className="buttons">
        <button onClick={start}>Iniciar</button>
        <button onClick={pause}>Pausar</button>
        <button onClick={reset}>Resetar</button>
      </div>
    </div>
  );
}