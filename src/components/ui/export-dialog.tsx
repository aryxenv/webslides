import type { ReactNode } from "react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { describeServerError, exportPdf, exportPptx } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExportKind = "pdf" | "pptx" | "pages";
type ExportBadge = "Static" | "Private" | "Interactive" | "Public";

const pptxSyncPrompt =
  "Use the update-pptx-export-template skill to sync scripts/export-pptx.mjs with the current web deck before I download PowerPoint. Update only the static PPTX export template and leave exports/ uncommitted.";

const exportOptions: Array<{
  id: ExportKind;
  title: string;
  badges: ExportBadge[];
  info: string;
}> = [
  {
    id: "pdf",
    title: "PDF",
    badges: ["Static", "Private"],
    info: "Save a local PDF artifact to exports/webslides.pdf and download it.",
  },
  {
    id: "pptx",
    title: "PowerPoint",
    badges: ["Static", "Private"],
    info: "Save the hand-built static PowerPoint export to exports/webslides.pptx and download it.",
  },
  {
    id: "pages",
    title: "GitHub Pages",
    badges: ["Interactive", "Public"],
    info: "Publish the interactive deck with the existing GitHub Actions workflow.",
  },
];

function ExportIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8V5.75A1.75 1.75 0 0 1 9.75 4h8.5A1.75 1.75 0 0 1 20 5.75v8.5A1.75 1.75 0 0 1 18.25 16H16M5.75 8h8.5A1.75 1.75 0 0 1 16 9.75v8.5A1.75 1.75 0 0 1 14.25 20h-8.5A1.75 1.75 0 0 1 4 18.25v-8.5A1.75 1.75 0 0 1 5.75 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m5 12.5 4.25 4.25L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function InfoIcon({ className, info }: { className?: string; info: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "group/info relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] font-bold text-muted-foreground",
        className,
      )}
    >
      i
      <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 w-64 -translate-y-1/2 -translate-x-1 rounded-md border border-border bg-popover px-3 py-2 text-left text-xs font-medium leading-5 text-popover-foreground opacity-0 shadow-deck transition-all duration-150 group-hover/info:translate-x-0 group-hover/info:opacity-100">
        {info}
      </span>
    </span>
  );
}

function VisibilityBadge({ label }: { label: ExportBadge }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground">
      {label}
    </span>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function ExportMenuOption({
  title,
  badges,
  info,
  onSelect,
}: {
  title: string;
  badges: ExportBadge[];
  info: string;
  onSelect: () => void;
}) {
  return (
    <button
      className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2.5 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
      onClick={onSelect}
      type="button"
    >
      <span className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {badges.map((badge) => (
          <VisibilityBadge key={badge} label={badge} />
        ))}
      </span>
      <InfoIcon className="shrink-0" info={info} />
    </button>
  );
}

function DialogShell({
  children,
  description,
  open,
  onOpenChange,
  title,
}: {
  children: ReactNode;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          data-capture-shortcuts
          className="export-dialog-content fixed left-1/2 top-1/2 z-50 max-h-[min(620px,calc(100dvh-2rem))] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-deck focus-visible:outline-none sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold tracking-[-0.02em]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm leading-6 text-muted-foreground">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                aria-label="Close export dialog"
                size="sm"
                type="button"
                variant="quiet"
              >
                Close
              </Button>
            </Dialog.Close>
          </div>
          <div className="mt-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FileExportDialogContent({
  buttonLabel,
  exportingLabel,
  filename,
  note,
  onExport,
  status,
  message,
}: {
  buttonLabel: string;
  exportingLabel: string;
  filename: string;
  note?: ReactNode;
  onExport: () => void;
  status: "idle" | "exporting" | "success" | "error";
  message: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
        Generates the full deck locally, saves it to{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
          exports/{filename}
        </code>
        , and downloads the same file.
      </div>
      {note ? (
        <div className="rounded-lg border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
          {note}
        </div>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Button
          disabled={status === "exporting"}
          onClick={onExport}
          size="sm"
          type="button"
        >
          {status === "exporting" ? exportingLabel : buttonLabel}
        </Button>
        {message ? (
          <p
            className={cn(
              "min-w-0 whitespace-pre-wrap text-xs leading-5",
              status === "error" ? "text-red-600" : "text-muted-foreground",
            )}
          >
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function PptxTemplateSyncNote() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  async function copyPrompt() {
    function resetStatus() {
      window.setTimeout(() => setCopyStatus("idle"), 1600);
    }

    if (!navigator.clipboard?.writeText) {
      setCopyStatus("error");
      resetStatus();
      return;
    }

    try {
      await navigator.clipboard.writeText(pptxSyncPrompt);
      setCopyStatus("copied");
      resetStatus();
    } catch {
      setCopyStatus("error");
      resetStatus();
    }
  }

  const copyLabel =
    copyStatus === "copied"
      ? "Prompt copied"
      : copyStatus === "error"
        ? "Copy failed"
        : "Copy PPTX sync prompt";

  return (
    <>
      <p className="font-semibold text-foreground">
        Static export-template step
      </p>
      <p className="mt-2">
        PowerPoint uses{" "}
        <code className="rounded bg-background px-1.5 py-0.5 text-foreground">
          scripts/export-pptx.mjs
        </code>
        , a curated static builder. Web slide edits do not automatically update
        it. When PPTX parity matters, ask Copilot to update the PowerPoint
        export template as a separate step.
      </p>
      <div className="mt-4 flex overflow-hidden rounded-md border border-border bg-background">
        <p className="min-w-0 flex-1 select-text px-3 py-2 font-mono text-xs leading-5 text-foreground">
          {pptxSyncPrompt}
        </p>
        <Button
          aria-label={copyLabel}
          className={cn(
            "min-h-10 w-10 shrink-0 rounded-none border-0 border-l border-border bg-card p-0 hover:bg-muted",
            copyStatus === "copied" && "text-green-600",
            copyStatus === "error" && "text-red-600",
          )}
          onClick={copyPrompt}
          size="sm"
          title={copyLabel}
          type="button"
          variant="outline"
        >
          <span
            className="inline-flex animate-in fade-in-0 zoom-in-75 duration-150"
            key={copyStatus}
          >
            {copyStatus === "copied" ? <CheckIcon /> : null}
            {copyStatus === "error" ? <XIcon /> : null}
            {copyStatus === "idle" ? <CopyIcon /> : null}
          </span>
        </Button>
      </div>
      {copyStatus === "error" ? (
        <p className="mt-2 text-xs leading-5 text-red-600">
          Copy failed. Select the prompt text and copy it manually.
        </p>
      ) : null}
    </>
  );
}

function PagesDialogContent() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
        GitHub Pages keeps the deck interactive, but the published URL is
        public. Use this only for decks with no customer-specific data or
        local-only demo dependencies.
      </div>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
        <li>
          In GitHub, set <strong>Settings → Pages</strong> source to{" "}
          <strong>GitHub Actions</strong>.
        </li>
        <li>Push changes to main so the existing Pages workflow runs.</li>
        <li>
          Share{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
            https://&lt;owner&gt;.github.io/&lt;repo&gt;/
          </code>
          .
        </li>
      </ol>
    </div>
  );
}

export function ExportDialog() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<ExportKind | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<
    "idle" | "exporting" | "success" | "error"
  >("idle");
  const [pdfMessage, setPdfMessage] = useState("");
  const [pptxStatus, setPptxStatus] = useState<
    "idle" | "exporting" | "success" | "error"
  >("idle");
  const [pptxMessage, setPptxMessage] = useState("");

  function selectDialog(dialog: ExportKind) {
    setMenuOpen(false);
    setActiveDialog(dialog);
    setDialogOpen(true);
  }

  async function handlePdfExport() {
    setPdfStatus("exporting");
    setPdfMessage("");

    try {
      const result = await exportPdf(window.location.origin);
      downloadBlob(result.blob, result.filename);
      setPdfStatus("success");
      setPdfMessage(`Saved and downloaded exports/${result.filename}`);
    } catch (error) {
      setPdfStatus("error");
      setPdfMessage(describeServerError(error));
    }
  }

  async function handlePptxExport() {
    setPptxStatus("exporting");
    setPptxMessage("");

    try {
      const result = await exportPptx(window.location.origin);
      downloadBlob(result.blob, result.filename);
      setPptxStatus("success");
      setPptxMessage(`Saved and downloaded exports/${result.filename}`);
    } catch (error) {
      setPptxStatus("error");
      setPptxMessage(describeServerError(error));
    }
  }

  const activeOption = exportOptions.find(
    (option) => option.id === activeDialog,
  );

  return (
    <>
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Popover.Trigger asChild>
          <Button
            aria-label="Open export options"
            className="h-8 w-8 p-0"
            size="sm"
            type="button"
            variant="outline"
          >
            <ExportIcon />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            className="z-30 w-[min(300px,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-deck data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1 data-[state=open]:zoom-in-95"
            side="top"
            sideOffset={10}
          >
            <div className="grid gap-1">
              {exportOptions.map((option) => (
                <ExportMenuOption
                  key={option.id}
                  badges={option.badges}
                  info={option.info}
                  onSelect={() => selectDialog(option.id)}
                  title={option.title}
                />
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <DialogShell
        description={
          activeOption
            ? `${activeOption.badges.join(" / ")}. ${activeOption.info}`
            : "Choose an export option."
        }
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        title={activeOption?.title ?? "Export"}
      >
        {activeDialog === "pdf" ? (
          <FileExportDialogContent
            buttonLabel="Download PDF"
            exportingLabel="Exporting PDF..."
            filename="webslides.pdf"
            message={pdfMessage}
            onExport={handlePdfExport}
            status={pdfStatus}
          />
        ) : null}
        {activeDialog === "pptx" ? (
          <FileExportDialogContent
            buttonLabel="Download PPTX"
            exportingLabel="Exporting PPTX..."
            filename="webslides.pptx"
            message={pptxMessage}
            note={<PptxTemplateSyncNote />}
            onExport={handlePptxExport}
            status={pptxStatus}
          />
        ) : null}
        {activeDialog === "pages" ? <PagesDialogContent /> : null}
      </DialogShell>
    </>
  );
}
