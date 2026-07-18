import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "~/lib/utils";

const IMAGE_MS = 1500;
const VIDEO_MS = 10000;
const UI_SETTLE_MS = 3000;
const PREARM_MARGIN = "800px 0px 800px 0px";

interface VideoPreviewProps {
  link: string;
}

export function VideoPreview({ link }: VideoPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const nearView = useInView(ref, { margin: PREARM_MARGIN });
  const inView = useInView(ref, { amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const [started, setStarted] = useState(false);
  const [settled, setSettled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [epoch, setEpoch] = useState(0);

  const saveData =
    typeof navigator !== "undefined" &&
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData === true;

  const cycling = armed && settled && inView;

  useEffect(() => {
    if (nearView) {
      setArmed(true);
      return;
    }
    setArmed(false);
    setStarted(false);
    setSettled(false);
    setVisible(false);
  }, [nearView]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => setSettled(true), UI_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [started]);

  useEffect(() => {
    if (!cycling) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      if (visible && playerRef.current) {
        playerRef.current.currentTime = 0;
      }
      setVisible(!visible);
    }, visible ? VIDEO_MS : IMAGE_MS);
    return () => clearTimeout(timer);
  }, [cycling, visible]);

  if (reducedMotion || saveData || failed) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {armed && (
        <div className="absolute top-1/2 left-1/2 aspect-video h-full min-w-full -translate-x-1/2 -translate-y-1/2">
          <ReactPlayer
            key={epoch}
            ref={playerRef}
            src={link}
            playing
            muted
            playsInline
            controls={false}
            width="100%"
            height="100%"
            config={{ vimeo: { background: true } }}
            onPlaying={() => setStarted(true)}
            onEnded={() => {
              setStarted(false);
              setSettled(false);
              setVisible(false);
              setEpoch((e) => e + 1);
            }}
            onError={() => setFailed(true)}
          />
        </div>
      )}
    </div>
  );
}
