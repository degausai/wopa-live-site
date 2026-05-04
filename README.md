# wopa-live-site

The redesigned wopa.ro from the [WOPA Session 1 workshop](https://github.com/degausai/wopa-workshop), plus a `pages/` folder where workshop participants add their bio pages.

## During the session

Participants run, in Claude Code on their laptop:

```bash
git clone https://github.com/degausai/wopa-live-site.git
cd wopa-live-site
claude
```

Once Claude is open in the folder, it reads `CLAUDE.md` and knows the drill: ask for the participant's info, generate `pages/<slug>.html` in the WOPA style, then tell them which command to run to submit.

When the participant is ready to submit:

```bash
export WOPA_SUBMIT_URL="https://wopa-submit-167057116194.europe-west1.run.app"
export WORKSHOP_PASSWORD="wopa-dare"
./submit.sh "Andu"
```

`submit.sh` POSTs the page to a small Cloud Run service. The service opens a PR (or updates an existing one) titled `add page: <name>`. The presenter merges PRs on stage and previews each page in Chrome.

Windows: use `./submit.ps1 "Andu"` instead.

## Structure

- `index.html` + `assets-real/` — the redesigned WOPA site.
- `pages/` — participant bio pages, one per file (`pages/<slug>.html`). Empty until the workshop runs.
- `server/` — the Cloud Run service that turns a `POST /` into a PR.
- `submit.sh`, `submit.ps1` — what participants run.

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
