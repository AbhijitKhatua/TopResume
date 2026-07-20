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

1. Ensure `bun run lint` and `bun typecheck` pass.
2. Update the version in `package.json` following the rules above.
3. Update the changelog / release notes.
4. Tag the release (`git tag vX.Y.Z`) and push tags.
