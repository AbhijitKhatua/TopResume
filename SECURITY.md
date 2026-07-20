# Security Policy

Top Resume takes the security of its users' data seriously — including
account credentials, resume content, and uploaded photos. We appreciate the
efforts of security researchers who responsibly disclose vulnerabilities.

## Supported Versions

Top Resume is deployed continuously as a hosted service at
[app.topresume.me](https://app.topresume.me) and [topresume.me](https://topresume.me).
Only the latest deployed version is in scope for security reports — there is
no need to check a version number before reporting. See [VERSIONING.md](./VERSIONING.md)
for how releases are versioned.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, report it privately by emailing **security@topresume.me** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce, including any proof-of-concept code or requests
- The affected URL(s), endpoint(s), or component(s)
- Your assessment of severity, if you have one

If you believe the issue is sensitive or you'd like to encrypt your report,
say so in your initial email and we'll coordinate a secure channel.

### What to expect

- **Acknowledgment** within 3 business days of your report.
- **Initial assessment** (severity, validity, and next steps) within 7
  business days.
- **Status updates** at least every 2 weeks while a fix is in progress.
- **Credit** in the release notes/changelog, if you'd like it, once a fix
  ships.

We ask that you give us a reasonable amount of time to investigate and remediate
an issue before any public disclosure, and that you avoid privacy violations,
data destruction, or service disruption while testing.

## Scope

In scope:

- The web application at `app.topresume.me` and marketing/docs site at
  `topresume.me`
- Authentication and session handling (Better Auth)
- The resume data API and Postgres-backed persistence (Neon)
- Photo upload/storage handling (Vercel Blob)
- The `apps/`, `packages/` source in this repository

Out of scope:

- Vulnerabilities in third-party services we depend on (Vercel, Neon, Better
  Auth, Google/Apple OAuth, etc.) — please report those directly to the
  vendor
- Automated vulnerability scanner output without a demonstrated, exploitable
  impact
- Denial-of-service, spam, or social engineering against users or staff
- Missing security headers or best-practice suggestions with no demonstrated
  exploit
- Reports from testing against accounts or data that are not your own

## Disclosure Policy

We follow coordinated disclosure: once a reported vulnerability is fixed and
deployed, we're happy to publish or link to a description of the issue and
credit the reporter, with their permission. Please do not disclose the issue
publicly until we've confirmed a fix is live.

## Preferred Languages

We accept reports in English.
