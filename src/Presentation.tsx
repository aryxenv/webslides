import type { ComponentType } from "react";
import { useCallback, useEffect, useState } from "react";
import { AgentDrivenAuthoring } from "@/components/slides/agent-driven-authoring/main";
import { EmbeddedDemoWorkflow } from "@/components/slides/embedded-demo-workflow/main";
import { PickPolishCustomization } from "@/components/slides/pick-polish-customization/main";
import { WebslidesIntroduction } from "@/components/slides/webslides-introduction/main";
import type { SlideProps } from "@/components/slides/types";
import { Button } from "@/components/ui/button";
import { usePresentationNavigation } from "@/hooks/usePresentationNavigation";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import {
  isSpaceKey,
  shouldIgnorePresentationShortcut,
} from "@/lib/presentation-shortcuts";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    __hideAppLoader?: () => void;
  }
}

interface SlideDefinition {
  id: string;
  label: string;
  Component: ComponentType<SlideProps>;
  cycleItems: number;
}

const slides: SlideDefinition[] = [
  {
    id: "webslides-introduction",
    label: "Webslides introduction",
    Component: WebslidesIntroduction,
    cycleItems: 3,
  },
  {
    id: "agent-driven-authoring",
    label: "Agent-driven authoring",
    Component: AgentDrivenAuthoring,
    cycleItems: 4,
  },
  {
    id: "embedded-demo-workflow",
    label: "Embedded demo workflow",
    Component: EmbeddedDemoWorkflow,
    cycleItems: 4,
  },
  {
    id: "pick-polish-customization",
    label: "Pick and polish customization",
    Component: PickPolishCustomization,
    cycleItems: 3,
  },
];

const slideIds: readonly string[] = slides.map((slide) => slide.id);

interface CycleState {
  slideId: string;
  index: number;
}

export function Presentation() {
  const {
    activeIndex,
    canGoNext,
    canGoPrevious,
    nextSlide,
    previousSlide,
    progress,
  } = usePresentationNavigation(slideIds);
  const [cycleState, setCycleState] = useState<CycleState>({
    slideId: "",
    index: 0,
  });
  const activeSlide = slides[activeIndex];
  const activeSlideId = activeSlide?.id ?? "";
  const cycleCount = activeSlide?.cycleItems ?? 0;
  const activeCycleIndex =
    cycleState.slideId === activeSlideId ? cycleState.index : 0;

  const cycleActiveSlide = useCallback(() => {
    if (!activeSlide || cycleCount === 0) {
      return;
    }

    setCycleState((current) => {
      const currentIndex =
        current.slideId === activeSlide.id ? current.index : 0;

      return {
        slideId: activeSlide.id,
        index: (currentIndex + 1) % cycleCount,
      };
    });
  }, [activeSlide, cycleCount]);

  const selectCycle = useCallback(
    (index: number) => {
      if (!activeSlide || cycleCount === 0) {
        return;
      }

      const clamped = Math.min(Math.max(index, 0), cycleCount - 1);
      setCycleState({ slideId: activeSlide.id, index: clamped });
    },
    [activeSlide, cycleCount],
  );

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: nextSlide,
    onSwipeRight: previousSlide,
  });

  useEffect(() => {
    let raf = 0;
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        window.__hideAppLoader?.();
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!activeSlideId) {
      return;
    }

    setCycleState({ slideId: activeSlideId, index: 0 });
  }, [activeSlideId]);

  useEffect(() => {
    function handleSpacebar(event: KeyboardEvent) {
      if (
        !isSpaceKey(event) ||
        event.repeat ||
        shouldIgnorePresentationShortcut(event)
      ) {
        return;
      }

      if (cycleCount === 0) {
        return;
      }

      event.preventDefault();
      cycleActiveSlide();
    }

    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, [cycleActiveSlide, cycleCount]);

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div
        className="relative min-h-0 w-full flex-1 max-[900px]:touch-pan-y"
        {...swipeHandlers}
      >
        {slides.map(({ id, label, Component, cycleItems }, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={id}
              aria-hidden={!isActive}
              aria-label={label}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-in-out",
                isActive
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
              )}
              inert={!isActive}
            >
              <Component
                isActive={isActive}
                cycleIndex={isActive ? activeCycleIndex : 0}
                cycleCount={cycleItems}
                onSelectCycle={selectCycle}
              />
            </article>
          );
        })}
      </div>

      <footer className="z-10 shrink-0 border-t border-border bg-background px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="h-1 flex-1 rounded-sm bg-muted">
              <div
                className="h-1 rounded-sm bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="min-w-fit text-xs font-semibold text-muted-foreground">
              {activeIndex + 1} / {slides.length}
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex sm:justify-end">
            <Button
              disabled={!canGoPrevious}
              onClick={previousSlide}
              size="sm"
              type="button"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              disabled={!canGoNext}
              onClick={nextSlide}
              size="sm"
              type="button"
            >
              Next
            </Button>
          </div>
        </div>
      </footer>
    </main>
  );
}
