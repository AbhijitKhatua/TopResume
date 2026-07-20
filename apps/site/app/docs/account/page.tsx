import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounts & sync",
  description: "Sign-in options, autosave, and photo storage.",
};

export default function DocsAccount() {
  return (
    <>
      <h1>Accounts &amp; sync</h1>
      <p>
        The builder is account-based: signing in is what lets your resume
        autosave and follow you between devices.
      </p>

      <h2>Signing in</h2>
      <ul>
        <li>
          <strong>Email &amp; password</strong> — create an account directly at{" "}
          <a href="https://app.topresume.me">app.topresume.me</a>.
        </li>
        <li>
          <strong>Google</strong> — one-click sign-in with your Google account.
        </li>
        <li>
          <strong>Apple</strong> — sign in with your Apple ID.
        </li>
      </ul>

      <h2>Autosave</h2>
      <p>
        There is no save button. Every edit — typing, reordering blocks,
        switching themes — is saved to your account automatically, with a save
        indicator in the sidebar showing the sync state. Open the builder on
        another device, sign in, and your resume is already there.
      </p>

      <h2>Photos</h2>
      <p>
        Profile photos are downscaled in your browser (to a maximum of
        500&nbsp;px, keeping the original JPEG/PNG/WebP format) before upload,
        so they stay lightweight. Storage is access-scoped to your account:
        photo URLs are namespaced per user, and the API rejects any attempt to
        read or delete another user&apos;s photo.
      </p>

      <h2>Your data</h2>
      <p>
        Resumes are stored per-account in a Postgres database. Your resume is
        yours: nothing on the free alpha plan is shared, sold, or used to train
        anything. Found a problem?{" "}
        <a
          href="https://github.com/AbhijitKhatua/TopResume/issues"
          target="_blank"
          rel="noreferrer"
        >
          Open an issue on GitHub
        </a>
        .
      </p>
    </>
  );
}
