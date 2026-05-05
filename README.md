# wopa-live-site

The redesigned wopa.ro from the [WOPA Session 1 workshop](https://github.com/degausai/wopa-workshop), plus a `pages/` folder where workshop participants add their bio pages.

## During the session

Participants do everything inside Claude. They open Claude in any folder and tell it:

```
> clone github.com/degausai/wopa-live-site.git
```

Claude clones, `cd`s in, reads `CLAUDE.md`, and knows the drill: ask for the participant's info, generate `pages/<slug>.html` in the WOPA style, iterate on it locally with the participant.

When the participant is ready, they tell Claude something like:

```
> submit my page with password wopa-dare
```

Claude runs `./submit.sh "<Their Name>"` (or `submit.ps1` on Windows) on their behalf, with `WORKSHOP_PASSWORD` set inline, and reports the PR URL the script printed back. The script POSTs the page to a small Cloud Run service that opens a PR (or updates an existing one) titled `add page: <name>`. The presenter merges PRs on stage and previews each page in Chrome.

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
