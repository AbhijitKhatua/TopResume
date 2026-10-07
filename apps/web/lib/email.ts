const { RESEND_API_KEY } = process.env
// Tolerate values pasted with surrounding quotes/whitespace (e.g. in the Vercel
// dashboard, which stores quotes literally), which Resend rejects with a 422.
const EMAIL_FROM = process.env.EMAIL_FROM?.trim().replace(/^(["'])(.*)\1$/, "$2").trim() || undefined

type Email = { to: string; subject: string; text: string; html: string }

/**
 * Sends a transactional email via Resend's HTTP API (no SDK needed).
 *
 * Without RESEND_API_KEY (e.g. local dev) the email is logged to the server
 * console instead, so flows like password reset stay testable.
 */
export async function sendEmail({ to, subject, text, html }: Email) {
  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set; cannot send email.")
    }
    console.info(`[email] To: ${to}\nSubject: ${subject}\n\n${text}`)
    return
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: EMAIL_FROM ?? "Top Resume <onboarding@resend.dev>", to, subject, text, html }),
  })
  if (!res.ok) {
    throw new Error(`Resend request failed (${res.status}): ${await res.text()}`)
  }
}
