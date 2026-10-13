"use client"

import type { ReactNode } from "react"

import { LinkListEditor } from "@/components/resume/link-list-editor"
import { PhotoUpload } from "@/components/resume/photo-upload"
import { useResumeDispatch, useResumeState } from "@/lib/resume/context"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

export function PersonalForm() {
  const { personal } = useResumeState()
  const dispatch = useResumeDispatch()

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start gap-4">
        <PhotoUpload className="shrink-0" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <Input
                type="text"
                value={personal.firstName}
                onChange={(e) => dispatch({ type: "SET_PERSONAL", patch: { firstName: e.target.value } })}
                placeholder="Jane"
              />
            </Field>
            <Field label="Last name">
              <Input
                type="text"
                value={personal.lastName}
                onChange={(e) => dispatch({ type: "SET_PERSONAL", patch: { lastName: e.target.value } })}
                placeholder="Doe"
              />
            </Field>
          </div>

          <Field label="Professional title">
            <Input
              type="text"
              value={personal.title}
              onChange={(e) => dispatch({ type: "SET_PERSONAL", patch: { title: e.target.value } })}
              placeholder="Senior Product Designer"
            />
          </Field>
        </div>
      </div>

      <Field label="Email">
        <Input
          type="email"
          value={personal.email}
          onChange={(e) => dispatch({ type: "SET_PERSONAL", patch: { email: e.target.value } })}
          placeholder="jane@example.com"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone">
          <Input
            type="tel"
            value={personal.phone}
            onChange={(e) => dispatch({ type: "SET_PERSONAL", patch: { phone: e.target.value } })}
            placeholder="+1 555 0100"
          />
        </Field>
        <Field label="Location">
          <Input
            type="text"
            value={personal.location}
            onChange={(e) => dispatch({ type: "SET_PERSONAL", patch: { location: e.target.value } })}
            placeholder="New York, NY"
          />
        </Field>
      </div>

      <Field label="Links">
        <LinkListEditor />
      </Field>

      <Field label="Summary">
        <Textarea
          value={personal.summary}
          onChange={(e) => dispatch({ type: "SET_PERSONAL", patch: { summary: e.target.value } })}
          placeholder="Short professional summary in 150 chars..."
          className="min-h-24 resize-none"
          maxLength={150}
        />
      </Field>
    </div>
  )
}

