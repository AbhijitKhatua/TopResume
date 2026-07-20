import { A4_HEIGHT_PX, A4_WIDTH_PX } from "@/lib/resume/page-layout"

export function ResumePage({
  margin,
  header,
  background,
  children,
}: {
  margin: number
  header?: React.ReactNode
  /** Theme page background (gradient/pattern/flat color). Defaults to white. */
  background?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      className="resume-page mx-auto overflow-hidden bg-white shadow-md print:shadow-none"
      style={{ width: A4_WIDTH_PX, minHeight: A4_HEIGHT_PX, ...background }}
    >
      {header}
      <div
        style={{
          padding: margin,
          paddingTop: header ? Math.round(margin * 0.6) : margin,
        }}
      >
        {children}
      </div>
    </div>
  )
}
