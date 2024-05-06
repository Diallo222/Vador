import { useEffect, useRef, useState, useMemo } from "react";

const AudioControl = (props) => {
  const [started, setStarted] = useState(false);
  const audio = useMemo(() => new Audio("/Darth.mp3"), []);

  const toggleAudio = () => setStarted(!started);

  useEffect(() => {
    if (started) {
      audio.loop = true;
      audio.play();
      audio.volume = 0.5;
      audio.playbackRate = 0.8;
    } else audio.pause();
  }, [started]);

  return (
    <div className="w-full flex fixed top-10 z-20 items-center mx-auto">
      <button
        onClick={toggleAudio}
        className={`z-20 fixed right-10 p-2 ${
         ! started ? "bg-red-600" : "bg-black"
        } hover:border-red-600`}
      >
        <p
          className={`font-Jedi4 ${
           ! started ? "text-black" : "text-red-600"
          } text-base md:text-lg`}
        >
        🎶  Audio
        </p>
      </button>
    </div>
  );
};

export default AudioControl;
