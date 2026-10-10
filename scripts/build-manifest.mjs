// Lists every image/video in the repo so the site can find files by NAME,
// wherever they were uploaded.  Run automatically by the GitHub Action.
//   node scripts/build-manifest.mjs [--seed]
import { readdirSync, writeFileSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const ROOT = process.cwd();
const SKIP = new Set([".git", ".github", "node_modules", "_site", "scripts", "css", "js"]);
const MEDIA = new Set([".webp", ".avif", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".mp4", ".webm"]);
const SKIP_FILES = new Set(["favicon.png", "apple-touch-icon.png"]);
const found = [];

(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (MEDIA.has(extname(name).toLowerCase()) && !SKIP_FILES.has(name.toLowerCase()))
      found.push(relative(ROOT, full).split(sep).join("/"));
  }
})(ROOT);

// files inside assets/ win over other folders, then shallower paths first
found.sort((a, b) => (b.startsWith("assets/") - a.startsWith("assets/")) || a.split("/").length - b.split("/").length || a.localeCompare(b));

const seed = process.argv.includes("--seed");
writeFileSync("assets-manifest.json", JSON.stringify({
  generatedBy: seed ? "seed" : "action",
  generated: new Date().toISOString(),
  files: found
}, null, 2) + "\n");
console.log(`assets-manifest.json: ${found.length} files`);
