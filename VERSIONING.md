# Versioning Policy

Top Resume follows [Semantic Versioning 2.0.0](https://semver.org/).

## Version format: `MAJOR.MINOR.PATCH`

Given a version number `MAJOR.MINOR.PATCH`, we increment the:

- **MAJOR** version for incompatible or breaking changes — anything that could
  break an existing user's saved resume, a public API, or established behavior.
- **MINOR** version for new functionality added in a backward-compatible way
  (new themes, new editor controls, new export options, etc.).
- **PATCH** version for backward-compatible bug fixes and small internal
  improvements.

Pre-release versions may be suffixed (e.g. `1.2.0-beta.1`).

## Where the version lives

- The workspace version is tracked in the root and app `package.json` `version`
  fields.
- Tagged releases use a `v`-prefixed git tag, e.g. `v1.2.0`.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) to make
history readable and changelogs automatable:

| Prefix      | Meaning                                   | Version bump |
| ----------- | ----------------------------------------- | ------------ |
| `feat:`     | A new feature                             | MINOR        |
| `fix:`      | A bug fix                                 | PATCH        |
| `docs:`     | Documentation only                        | none         |
| `refactor:` | Code change that neither fixes nor adds   | none/PATCH   |
| `chore:`    | Tooling, deps, build, housekeeping        | none         |
| `test:`     | Adding or fixing tests                    | none         |

A commit with `BREAKING CHANGE:` in its body (or a `!` after the type, e.g.
`feat!:`) triggers a MAJOR bump.

## Resume data schema versioning

Saved resumes carry their own `version` number inside the persisted
`ResumeData` object (see `apps/web/lib/resume/`). This is **independent** of the
application's release version and exists so the app can migrate resumes stored
in `localStorage` when the data shape changes.

When you change the persisted data shape:

1. Increment the `version` field on the default state.
2. Add a migration path that upgrades older payloads to the new shape on load.
3. Never silently discard user data — migrate or preserve it.

## Release process

Releases are fully automated by [semantic-release](https://semantic-release.gitbook.io/)
(`.github/workflows/release.yml`). On every push to `main` it inspects the
commits since the last release, decides the version bump from the table
above, and — if one is warranted — updates `CHANGELOG.md` and both
`package.json` files, tags the commit (`vX.Y.Z`), and publishes a GitHub
Release. There's no manual version input and no release PR: if the pushed
commits don't warrant a release (e.g. only `docs:`/`chore:`), nothing happens.

This means commit message accuracy matters — use the prefixes above (and
`!`/`BREAKING CHANGE:` for breaking changes) so the automated bump is
correct.
