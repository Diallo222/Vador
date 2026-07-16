import { useProgress } from "@react-three/drei";
import { useEffect, useRef } from "react";

interface LoaderProps {
  started: boolean;
  setStarted: (started: boolean) => void;
}

const Loader = ({ started, setStarted }: LoaderProps) => {
  const { progress } = useProgress();
  const hasStarted = useRef(false);
  const pct = Math.min(100, Math.round(progress));

  useEffect(() => {
    if (progress !== 100 || hasStarted.current) return;

    const timer = setTimeout(() => {
      hasStarted.current = true;
      setStarted(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [progress, setStarted]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-void transition-opacity duration-1000 pointer-events-none
      ${started ? "opacity-0" : "opacity-100"}`}
      aria-hidden={started}
    >
      <p className="font-mono text-[10px] tracking-imperial text-steel uppercase mb-8">
        Imperial Archive // Boot
      </p>

      <h1 className="font-Jedi4 text-4xl md:text-6xl text-crimson tracking-wide">
        Dark Side
      </h1>

      <div className="mt-10 w-56 md:w-72">
        <div className="flex justify-between font-mono text-[10px] tracking-chapter text-steel mb-2">
          <span>SEQ</span>
          <span>{String(pct).padStart(3, "0")}%</span>
        </div>
        <div className="h-px w-full bg-steel/20 overflow-hidden">
          <div
            className="h-full bg-crimson transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="mt-6 font-mono text-[10px] tracking-imperial text-steel-dim uppercase">
        Loading sequence
      </p>
    </div>
  );
};

export default Loader;
