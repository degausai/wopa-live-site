#!/usr/bin/env node
// Tiny zero-dependency local server for the WOPA workshop presenter.
//
//   node serve.js                # http://localhost:8080
//   PORT=9000 node serve.js
//
// Why this exists: team.html fetches /pages/manifest.json. We don't want to
// commit that manifest because every participant PR would touch the same
// file and 19 parallel branches would all conflict. Instead, this server
// scans pages/*.html on every request, parses .role and .name out of each,
// and returns JSON. Refresh the page after a merge — fresh data, no commits.

import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".ico":  "image/x-icon",
  ".pdf":  "application/pdf",
};

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

    if (path === "/pages/manifest.json") {
      const manifest = await buildManifest();
      res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      res.end(JSON.stringify(manifest, null, 2));
      return;
    }

    if (path === "/") path = "/index.html";
    if (path.endsWith("/")) path += "index.html";

    const filePath = normalize(join(ROOT, path));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end("forbidden");
      return;
    }

    const buf = await readFile(filePath);
    res.writeHead(200, { "content-type": TYPES[extname(filePath)] || "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404).end(`not found: ${req.url}`);
  }
}).listen(PORT, () => {
  console.log(`wopa local server: http://localhost:${PORT}`);
  console.log(`team page:         http://localhost:${PORT}/team.html`);
});

async function buildManifest() {
  const dir = join(ROOT, "pages");
  let files;
  try { files = await readdir(dir); } catch { return []; }

  const out = [];
  for (const f of files) {
    if (!f.endsWith(".html") || f === "_template.html") continue;
    const slug = f.replace(/\.html$/, "");
    const html = await readFile(join(dir, f), "utf8").catch(() => "");
    const role = parseTagText(html, "role");
    const name = parseTagText(html, "name");
    out.push({ slug, name, role });
  }
  out.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return out;
}

function parseTagText(html, cls) {
  const re = new RegExp(`<div[^>]*class=["'][^"']*\\b${cls}\\b[^"']*["'][^>]*>([\\s\\S]*?)</div>`, "i");
  const m = html.match(re);
  if (!m) return "";
  return m[1].replace(/<[^>]+>/g, "").trim();
}
