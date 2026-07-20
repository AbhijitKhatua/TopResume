#!/usr/bin/env node
// Runs after `changeset version` in the release workflow.
//
// apps/web is the only Changesets-managed package (see .changeset/config.json
// — root isn't a workspace member so Changesets can't version it directly,
// and apps/site plus the internal packages/* are ignored). So `changeset
// version` writes its release notes into apps/web/CHANGELOG.md, in
// Changesets' own format ("## 0.5.0" / "### Minor Changes" / bullet list).
//
// This repo's canonical changelog lives at the repo root and follows Keep a
// Changelog ("## [0.5.0] - 2026-08-01" / "### Added" / "### Changed" /
// "### Fixed" / "### Security"). This script takes the section Changesets
// just wrote, reshapes it into that style, merges it into the root
// CHANGELOG.md, and deletes the disposable apps/web/CHANGELOG.md.
//
// Section is chosen by:
//   - the bump type as the default (major -> Changed, minor -> Added,
//     patch -> Fixed)
//   - an explicit `<!--category:x-->` marker (left by
//     .changeset/changelog-config.cjs) to override that default, e.g. for a
//     patch-level security fix

import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";

const SOURCE_PATH = "apps/web/CHANGELOG.md";
const TARGET_PATH = "CHANGELOG.md";
const REPO_URL = "https://github.com/AbhijitKhatua/TopResume";

const HEADING_TO_SECTION = {
  "Major Changes": "Changed",
  "Minor Changes": "Added",
  "Patch Changes": "Fixed",
};
const CATEGORY_TO_SECTION = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  security: "Security",
};
const SECTION_ORDER = ["Added", "Changed", "Fixed", "Security"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function findSectionBounds(lines) {
  const start = lines.findIndex((line) => line.startsWith("## "));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ") || /^\[[^\]]+\]:\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return { start, end };
}

function parseSection(lines) {
  const version = lines[0].replace(/^##\s*/, "").trim();
  const groups = [];
  let current = null;
  for (const line of lines.slice(1)) {
    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      current = { heading: heading[1].trim(), bullets: [] };
      groups.push(current);
      continue;
    }
    if (current && line.trim().startsWith("- ")) {
      current.bullets.push(line.trim());
    }
  }
  return { version, groups };
}

function bucketBullets(groups) {
  const sections = new Map();
  for (const { heading, bullets } of groups) {
    const defaultSection = HEADING_TO_SECTION[heading] ?? heading;
    for (const bullet of bullets) {
      const marker = bullet.match(/\s*<!--category:(\w+)-->\s*$/);
      const section = marker
        ? (CATEGORY_TO_SECTION[marker[1]] ?? defaultSection)
        : defaultSection;
      const text = marker ? bullet.slice(0, marker.index).trimEnd() : bullet;
      if (!sections.has(section)) sections.set(section, []);
      sections.get(section).push(text);
    }
  }
  return sections;
}

function renderSection(version, sections) {
  const orderedNames = [
    ...SECTION_ORDER.filter((name) => sections.has(name)),
    ...[...sections.keys()].filter((name) => !SECTION_ORDER.includes(name)),
  ];
  const body = orderedNames
    .map((name) => `### ${name}\n\n${sections.get(name).join("\n")}`)
    .join("\n\n");
  return `## [${version}] - ${todayISO()}\n\n${body}\n`;
}

function mergeIntoTarget(targetRaw, formatted, version) {
  const lines = targetRaw.split("\n");
  // Insert right before the first pre-existing "## [" entry, so the new
  // section lands after the file's intro/title paragraph. If there's no
  // existing entry yet (brand new CHANGELOG.md), append at the end instead.
  const firstEntryIdx = lines.findIndex((line) => line.startsWith("## ["));
  const insertAt = firstEntryIdx === -1 ? lines.length : firstEntryIdx;
  const before = lines.slice(0, insertAt).join("\n").replace(/\s*$/, "\n\n");
  const after = lines.slice(insertAt).join("\n");
  let merged = `${before}${formatted}\n${after}`.replace(/\n{3,}/g, "\n\n");

  const link = `[${version}]: ${REPO_URL}/releases/tag/v${version}`;
  if (!merged.includes(`\n${link}\n`) && !merged.endsWith(`\n${link}`)) {
    const mergedLines = merged.split("\n");
    const firstFooterIdx = mergedLines.findIndex((line) => /^\[[^\]]+\]:\s/.test(line));
    if (firstFooterIdx === -1) {
      merged = merged.replace(/\n*$/, "") + `\n\n${link}\n`;
    } else {
      mergedLines.splice(firstFooterIdx, 0, link);
      merged = mergedLines.join("\n");
    }
  }
  return merged.trimEnd() + "\n";
}

if (!existsSync(SOURCE_PATH)) {
  console.log("format-changelog: no apps/web/CHANGELOG.md from Changesets, nothing to do.");
  process.exit(0);
}

const sourceRaw = readFileSync(SOURCE_PATH, "utf8");
const bounds = findSectionBounds(sourceRaw.split("\n"));

if (!bounds) {
  console.log("format-changelog: no version section found in apps/web/CHANGELOG.md.");
  process.exit(0);
}

const sourceLines = sourceRaw.split("\n");
const { start, end } = bounds;
const { version, groups } = parseSection(sourceLines.slice(start, end));
const sections = bucketBullets(groups);
const formatted = renderSection(version, sections);

const targetRaw = readFileSync(TARGET_PATH, "utf8");
writeFileSync(TARGET_PATH, mergeIntoTarget(targetRaw, formatted, version));
unlinkSync(SOURCE_PATH);

console.log(`format-changelog: merged v${version} into ${TARGET_PATH}`);
