import { useEffect, useState } from "react";
import { sounds } from "../../constants";

interface AudioControlProps {
  started: boolean;
}

const AudioControl = ({ started }: AudioControlProps) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const toggleAudio = () => {
    if (!hasUserInteracted) setHasUserInteracted(true);
    setIsAudioPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (!hasUserInteracted) return;

    const handlePlayback = async () => {
      if (isAudioPlaying) {
        if (!sounds.background.playing()) {
          await sounds.background.play();
        }
      } else {
        sounds.background.pause();
      }
    };

    handlePlayback().catch((error: unknown) => {
      console.error("Audio playback error:", error);
      setIsAudioPlaying(false);
    });

    return () => {
      sounds.background.pause();
    };
  }, [isAudioPlaying, hasUserInteracted]);

  useEffect(() => {
    const attemptPlay = () => {
      if (started && !hasUserInteracted) {
        const playResult = sounds.background.play();
        Promise.resolve(playResult)
          .then(() => setIsAudioPlaying(true))
          .catch(() => {
            console.log("Autoplay blocked, waiting for user interaction");
            setIsAudioPlaying(false);
          });
      }
    };

    const timer = setTimeout(attemptPlay, 1000);
    return () => clearTimeout(timer);
  }, [started, hasUserInteracted]);

  return (
    <div className="w-full flex fixed top-10 z-20 items-center mx-auto">
      <button
        onClick={toggleAudio}
        className={`z-20 fixed right-10 p-1 ${
          isAudioPlaying ? "bg-black animate-pulse" : "bg-red-600"
        } hover:border-red-600`}
      >
        <p
          className={`font-Jedi4 ${
            isAudioPlaying ? "text-red-600" : "text-black"
          } text-base md:text-lg`}
        >
          🎶 Audio
        </p>
      </button>
    </div>
  );
};

export default AudioControl;
