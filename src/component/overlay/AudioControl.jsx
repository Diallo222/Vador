import { useEffect, useState } from "react";
import { sounds } from "../../constants";

const AudioControl = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const toggleAudio = () => setIsAudioPlaying((prev) => !prev);

  useEffect(() => {
    if (isAudioPlaying) {
      sounds.background.play();
    } else {
      sounds.background.pause();
    }
    
    // Cleanup on unmount
    return () => sounds.background.pause();
  }, [isAudioPlaying]);

  return (
    <div className="w-full flex fixed top-10 z-20 items-center mx-auto">
      <button
        onClick={toggleAudio}
        className={`z-20 fixed right-10 p-1 ${isAudioPlaying ? "bg-black animate-pulse" : "bg-red-600"} hover:border-red-600`}
      >
        <p
          className={`font-Jedi4 ${isAudioPlaying ? "text-red-600" : "text-black"} text-base md:text-lg`}
        >
          🎶 Audio
        </p>
      </button>
    </div>
  );
};

export default AudioControl;
