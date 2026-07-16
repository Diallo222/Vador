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
            setIsAudioPlaying(false);
          });
      }
    };

    const timer = setTimeout(attemptPlay, 1000);
    return () => clearTimeout(timer);
  }, [started, hasUserInteracted]);

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-label={isAudioPlaying ? "Mute ambient audio" : "Play ambient audio"}
      aria-pressed={isAudioPlaying}
      className="fixed top-5 right-5 md:top-8 md:right-8 z-30 flex items-center gap-3 pointer-events-auto group"
    >
      <span className="font-mono text-[10px] tracking-imperial uppercase text-steel group-hover:text-bone transition-colors">
        {isAudioPlaying ? "Audio" : "Muted"}
      </span>
      <span className="relative flex h-8 w-8 items-center justify-center border border-steel/40 group-hover:border-crimson transition-colors">
        {isAudioPlaying ? (
          <>
            <span className="absolute inset-0 border border-crimson/50 animate-pulse-ring" />
            <span className="flex gap-[3px] items-end h-3">
              <span className="w-[2px] h-2 bg-crimson animate-pulse" />
              <span className="w-[2px] h-3 bg-crimson animate-pulse [animation-delay:150ms]" />
              <span className="w-[2px] h-1.5 bg-crimson animate-pulse [animation-delay:300ms]" />
            </span>
          </>
        ) : (
          <span className="block w-3 h-[2px] bg-steel rotate-[-20deg]" />
        )}
      </span>
    </button>
  );
};

export default AudioControl;
