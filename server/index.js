import express from "express";
import multer from "multer";

const REPO = "degausai/wopa-live-site";
const GH = "https://api.github.com";

const app = express();
const upload = multer({ limits: { fileSize: 1024 * 1024 } });

app.get("/", (_req, res) =>
  res.type("text/plain").send("wopa submit endpoint. POST a multipart form: name, password, page (file).\n")
);

app.post("/", upload.single("page"), async (req, res) => {
  try {
    if (req.body.password !== process.env.WORKSHOP_PASSWORD) return res.status(401).send("bad password\n");

    const name = (req.body.name || "").trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) return res.status(400).send("need a name\n");
    if (!req.file) return res.status(400).send("need a page file (multipart field 'page')\n");

    const html = req.file.buffer.toString("utf8");
    const branch = `participant/${slug}`;
    const path = `pages/${slug}.html`;

    const mainRef = await gh(`/repos/${REPO}/git/ref/heads/main`).then(j);
    const baseSha = mainRef.object.sha;

    const branchRefRes = await gh(`/repos/${REPO}/git/refs/heads/${branch}`);
    if (branchRefRes.status === 404) {
      await gh(`/repos/${REPO}/git/refs`, { method: "POST", body: { ref: `refs/heads/${branch}`, sha: baseSha } });
    } else {
      await gh(`/repos/${REPO}/git/refs/heads/${branch}`, { method: "PATCH", body: { sha: baseSha, force: true } });
    }

    const existing = await gh(`/repos/${REPO}/contents/${path}?ref=${branch}`);
    const sha = existing.ok ? (await existing.json()).sha : undefined;
    await gh(`/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      body: {
        message: `add page: ${name}`,
        content: Buffer.from(html, "utf8").toString("base64"),
        sha,
        branch,
      },
    });

    const open = await gh(`/repos/${REPO}/pulls?head=degausai:${branch}&state=open`).then(j);
    let prUrl;
    if (open.length) {
      prUrl = open[0].html_url;
    } else {
      const pr = await gh(`/repos/${REPO}/pulls`, {
        method: "POST",
        body: { title: `add page: ${name}`, head: branch, base: "main" },
      }).then(j);
      prUrl = pr.html_url;
    }

    res.type("text/plain").send(`Submitted. PR: ${prUrl}\n`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`error: ${err.message}\n`);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on :${port}`));

async function gh(path, init = {}) {
  const res = await fetch(`${GH}${path}`, {
    ...init,
    body: init.body ? JSON.stringify(init.body) : undefined,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "wopa-submit",
      "Content-Type": "application/json",
    },
  });
  return res;
}

function j(res) {
  if (!res.ok) throw new Error(`github ${res.status}: ${res.statusText}`);
  return res.json();
}
