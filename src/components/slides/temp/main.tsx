import type { SlideProps } from "@/components/slides/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SlideFrame } from "@/components/ui/slide-frame";

export function Temp(_props: SlideProps) {
  void _props;

  return (
    <SlideFrame eyebrow="Temp" title="Temporary export test slide">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="min-w-0 p-6">
          <Badge variant="default">Dynamic slide</Badge>
          <p className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em]">
            If this appears in PowerPoint, the editable export is reading the
            live React deck.
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            This slide was added after the converter replaced the old static
            PPTX template.
          </p>
        </Card>

        <Card className="min-w-0 p-6">
          <div className="grid gap-3">
            {[
              "Native text should export as editable PowerPoint text.",
              "Cards and badges should export as editable shapes.",
              "No manual PPTX sync should be required.",
            ].map((item, index) => (
              <div
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                key={item}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="min-w-0 text-sm leading-6 text-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SlideFrame>
  );
}
