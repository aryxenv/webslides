import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  describeServerError,
  EXPORT_HEALTH_STATUS,
  fetchHealth,
  SERVER_URL,
} from "@/lib/api";
import { isPresentationExportMode } from "@/lib/export-mode";
import { cn } from "@/lib/utils";

interface ServerHealthCardProps {
  isActive: boolean;
  onSelect: () => void;
}

/** Live demo: a slide calling the FastAPI server's GET /health route through
 * TanStack Query. This is a self-contained example of server-backed content. */
export function ServerHealthCard({
  isActive,
  onSelect,
}: ServerHealthCardProps) {
  const exportMode = isPresentationExportMode();
  const health = useQuery({
    queryKey: ["health"],
    queryFn: ({ signal }) => fetchHealth(signal),
    enabled: !exportMode,
  });

  const state: "loading" | "error" | "ok" = exportMode
    ? "ok"
    : health.isPending
      ? "loading"
      : health.isError
        ? "error"
        : "ok";

  const dot = {
    loading: "bg-muted-foreground animate-pulse",
    error: "bg-red-500",
    ok: "bg-foreground",
  }[state];

  const message = exportMode
    ? EXPORT_HEALTH_STATUS.status
    : state === "loading"
      ? "Calling /health…"
      : state === "error"
        ? describeServerError(health.error)
        : (health.data?.status ?? "No status returned");
  const isFetching = !exportMode && health.isFetching;

  return (
    <Card
      onClick={onSelect}
      aria-busy={state === "loading"}
      className={cn(
        "cursor-pointer border-2 p-5 transition-colors duration-300",
        isActive ? "border-primary" : "border-border",
      )}
      data-state={state}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Live server call</p>
        <Badge variant="muted">GET /health</Badge>
      </div>

      <div className="mt-3 flex items-start gap-2 font-mono text-xs">
        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot)} />
        <span
          className={cn(
            "min-w-0 break-words leading-5",
            state === "error" ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {message}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {SERVER_URL}
        </span>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            if (!exportMode) {
              health.refetch();
            }
          }}
          disabled={isFetching}
          size="sm"
          type="button"
          variant="outline"
        >
          {isFetching ? "Calling…" : "Call again"}
        </Button>
      </div>
    </Card>
  );
}
