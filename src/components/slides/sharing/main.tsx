import type { SlideProps } from "@/components/slides/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SlideFrame } from "@/components/ui/slide-frame";
import { cn } from "@/lib/utils";

const collaborateTraits = ["Branches", "Pull requests", "Reviewable history"];

const exportChannels = [
  {
    name: "PDF",
    detail: "The quick readout that travels anywhere.",
    traits: ["Light", "Fast", "Reliable"],
  },
  {
    name: "PowerPoint",
    detail: "A traditional deck with the full Microsoft toolkit.",
    traits: ["Microsoft Integrated"],
  },
  {
    name: "GitHub Pages",
    detail: "A hosted, public demo for generic slides.",
    traits: ["Hosted", "Public", "No secrets"],
  },
  {
    name: "Azure",
    detail: "A hosted, public demo with a live server behind it.",
    traits: ["Hosted", "Public", "Server", "IaC"],
  },
];

export function Sharing({ cycleIndex, onSelectCycle }: SlideProps) {
  return (
    <SlideFrame
      eyebrow="Sharing"
      title="Choose the right door out of the deck."
    >
      <div className="grid grid-cols-1 gap-6 lg:min-h-full lg:content-center lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div className="flex min-w-0 flex-col justify-center gap-5">
          <Badge variant="outline" className="w-fit">
            Team story, audience artifact
          </Badge>
          <p className="text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
            One deck, two ways out: a workshop for makers and a package for
            everyone else.
          </p>
          <p className="text-base leading-7 text-muted-foreground">
            Use GitHub while the story is still changing. Reach for an export
            when it is ready to leave the room.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4">
          <Card
            onClick={() => onSelectCycle(0)}
            className={cn(
              "min-w-0 cursor-pointer border-2 p-5 transition-colors duration-300",
              cycleIndex === 0 ? "border-primary" : "border-border",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-semibold tracking-[-0.02em]">
                GitHub · the shared workshop
              </p>
              <Badge variant={cycleIndex === 0 ? "default" : "outline"}>
                Collaborate
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep the deck, demos, and edits in one place — for teams building
              the story together.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {collaborateTraits.map((trait) => (
                <Badge key={trait} variant="muted">
                  {trait}
                </Badge>
              ))}
            </div>
          </Card>

          <Card
            onClick={() => onSelectCycle(1)}
            className={cn(
              "min-w-0 cursor-pointer border-2 p-5 transition-colors duration-300",
              cycleIndex === 1 ? "border-primary" : "border-border",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-semibold tracking-[-0.02em]">
                Export · the channel picker
              </p>
              <Badge variant={cycleIndex === 1 ? "default" : "outline"}>
                Distribute
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pick the format that matches how the deck should travel — for
              sharing with everyone else.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {exportChannels.map((channel) => (
                <div
                  key={channel.name}
                  className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-background p-3"
                >
                  <p className="truncate text-sm font-semibold">
                    {channel.name}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {channel.detail}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {channel.traits.map((trait) => (
                      <Badge key={trait} variant="muted">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </SlideFrame>
  );
}
