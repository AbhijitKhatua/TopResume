/**
 * Shown while the resume is being fetched from the database, instead of
 * flashing default/empty content. An indeterminate bar slides across the top
 * and a faint A4 sheet skeleton hints at the page that's loading.
 */
export function ResumeLoading() {
  return (
    <div className="relative flex flex-1 flex-col bg-muted/40" data-no-print>
      <div className="h-0.5 w-full overflow-hidden bg-primary/15">
        <div className="resume-loading-bar h-full rounded-full bg-primary" />
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="aspect-794/1123 w-full max-w-[794px] animate-pulse rounded-md bg-background/70 shadow-sm" />
      </div>
    </div>
  )
}
