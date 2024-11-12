import { useProgress } from "@react-three/drei";
import { useEffect } from "react";

const Loader = (props) => {
  const { started, setStarted } = props;
  const { progress, total, loaded, item } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setStarted(true);
      }, 500);
    }
  }, [progress, total, loaded, item]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none
  flex flex-col items-center justify-center bg-zinc-950
  ${started ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-3xl md:text-5xl  font-Jedi4 text-red-600 relative">
        <div className=" overflow-hidden truncate text-clip transition-all duration-1000">
          {"Dark Side"}
        </div>
      </div>
      <div className="relative w-80 h-2 bg-gray-800 rounded-md overflow-hidden mt-4 shadow-lg shadow-red-400">
        {/* Glowing Progress */}
        <div
          className="h-full bg-red-600 rounded-md relative overflow-hidden transition-all duration-1000"
          style={{ width: `${progress}%` }}
        >
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-md blur-sm bg-red-500 opacity-40"></div>
        </div>
      </div>

      <p className="text-sm md:text-lg  text-red-600 mt-4 uppercase">Loading ...</p>
    </div>
  );
};

export default Loader;
