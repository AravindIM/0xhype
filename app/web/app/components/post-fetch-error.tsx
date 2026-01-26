import { RotateCw, WifiOff } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { useAnimate, motion } from "motion/react";
import { useEffect } from "react";

interface PostFetchErrorProps extends React.ComponentProps<"div"> {
  onRetry: React.MouseEventHandler<HTMLButtonElement>;
}

export function AnimatedWifiOff({ ...props }: React.ComponentProps<"svg">) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "path, line",
      {
        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        opacity: [0, 1],
      },
      {
        duration: 0.4,
        ease: "easeInOut",
        delay: (i) => i * 0.02,
      },
    );
  }, [animate]);

  return (
    <motion.div ref={scope}>
      <WifiOff className="size-12" {...props} />
    </motion.div>
  );
}

export function PostFetchError({ onRetry, ...props }: PostFetchErrorProps) {
  const [scope, animate] = useAnimate();
  const animateRotate = (onComplete: () => void) => {
    animate(
      scope.current,
      { rotate: 270 },
      {
        duration: 0.1,
        ease: "easeInOut",
        onComplete: onComplete,
      },
    );
  };
  const animateReset = (onComplete: () => void) => {
    animate(
      scope.current,
      { rotate: 0 },
      {
        duration: 0,
        ease: "easeInOut",
        onComplete: onComplete,
      },
    );
  };
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    animateRotate(() => animateReset(() => onRetry(e)));
  };
  return (
    <div
      className="p-6 w-full flex flex-col justify-center items-center gap-3"
      {...props}
    >
      <AnimatedWifiOff className="size-12" />
      <div>
        <p className="text-center cursor-default">
          Yeah, okay, something broke. Either the matrix glitched, or you're
          offline.
        </p>
        <p className="text-center cursor-default">
          Let's confirm it before we begin to blame the universe!
        </p>
      </div>
      <Button
        onClick={handleClick}
        className="rounded-full cursor-pointer py-4! my-4 flex justify-between"
      >
        <motion.span ref={scope}>
          <RotateCw data-icon="inline-start" />
        </motion.span>
        <div className="px-2">Retry</div>
      </Button>
    </div>
  );
}
