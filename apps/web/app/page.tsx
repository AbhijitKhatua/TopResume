import { BuilderLayout } from "@/components/resume/builder-layout"
import { ResumeProvider } from "@/lib/resume/context"
import { ResumeSyncProvider } from "@/lib/resume/sync-context"

export default function Page() {
  return (
    <ResumeProvider>
      <ResumeSyncProvider>
        <BuilderLayout />
      </ResumeSyncProvider>
    </ResumeProvider>
  )
}
