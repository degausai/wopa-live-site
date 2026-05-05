# wopa-live-site

The redesigned wopa.ro from the [WOPA Session 1 workshop](https://github.com/degausai/wopa-workshop), plus a `pages/` folder where workshop participants add their bio pages.

## During the session

Participants do everything inside Claude. They open Claude in any folder and tell it:

```
> clone github.com/degausai/wopa-live-site.git and follow the instructions inside
```

Claude clones, `cd`s in, reads `CLAUDE.md`, and runs the briefing inside it: quiz the participant for name + role + one weird thing + optional photo, generate `pages/<slug>.html` in the WOPA style, iterate locally until they're happy.

When the participant is ready, they tell Claude something like:

```
> submit my page with password wopa-dare
```

Claude runs `./submit.sh "<Their Name>"` (or `submit.ps1` on Windows) on their behalf, with `WORKSHOP_PASSWORD` set inline, and reports the PR URL the script printed back. The script POSTs the page to a small Cloud Run service that opens a PR (or updates an existing one) titled `add page: <name>`. The presenter merges PRs on stage.

## Presenter setup (running the team page)

`team.html` populates from `pages/manifest.json`, which is **not committed** to the repo (it would conflict on every parallel merge). Instead, run the tiny zero-dependency local server included here:

```bash
node serve.js
# wopa local server: http://localhost:8080
# team page:         http://localhost:8080/team.html
```

The server scans `pages/*.html` on every request to `/pages/manifest.json` and parses each page's role + name out of the HTML. After you merge a participant PR: `git pull && refresh the team page` → fresh card appears.

Participants don't need this server. They preview their own page directly with `open pages/<slug>.html` (Mac) or `start pages\<slug>.html` (Windows) — the page is a single self-contained HTML file with no fetches.

## Structure

- `index.html` + `assets-real/` — the redesigned WOPA site.
- `team.html` — gallery of participant pages, populated from the local server.
- `serve.js` — the local presenter server. Zero deps. `node serve.js`.
- `pages/` — participant bio pages, one per file (`pages/<slug>.html`).
- `server/` — the Cloud Run service that turns a `POST /` into a PR.
- `submit.sh`, `submit.ps1` — what Claude runs on the participant's behalf at submit time.

## Deploying the server

From `server/`:

```bash
gcloud run deploy wopa-submit \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars WORKSHOP_PASSWORD=<value> \
  --set-secrets GITHUB_TOKEN=wopa-submit-gh-token:latest
```

Secrets:

- `GITHUB_TOKEN`: a fine-grained PAT scoped to `degausai/wopa-live-site` with `contents:write` and `pull_requests:write`. Stored in Secret Manager as `wopa-submit-gh-token`.
- `WORKSHOP_PASSWORD`: any string; we tell the room on the day.

## After the workshop

Delete the Cloud Run service, revoke the PAT. The repo stays as a permanent record of what participants made.
