import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function EnterFullscreenIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 3.75H4.5a.75.75 0 0 0-.75.75v3.75M15.75 3.75h3.75a.75.75 0 0 1 .75.75v3.75M15.75 20.25h3.75a.75.75 0 0 0 .75-.75v-3.75M8.25 20.25H4.5a.75.75 0 0 1-.75-.75v-3.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ExitFullscreenIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 8.25h3a.75.75 0 0 0 .75-.75v-3M19.5 8.25h-3a.75.75 0 0 1-.75-.75v-3M19.5 15.75h-3a.75.75 0 0 0-.75.75v3M4.5 15.75h3a.75.75 0 0 1 .75.75v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FullscreenToggle({ className }: { className?: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleChange);
    handleChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  };

  return (
    <Button
      aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
      aria-pressed={isFullscreen}
      className={cn("h-8 w-8 p-0", className)}
      onClick={toggleFullscreen}
      size="sm"
      type="button"
      variant="outline"
    >
      {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
    </Button>
  );
}
