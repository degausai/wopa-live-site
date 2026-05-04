# pages/

Each participant in the WOPA Session 1 workshop adds a bio page here. They're added via PR by the submit endpoint, then merged on stage by the presenter.

## Files in this folder

- **`_template.html`** — the style template. Every participant page is a copy of this with the four placeholders filled in. Don't edit this file.
- **`<slug>.html`** — one per participant, generated during the session.

## For participants

Don't edit anything here directly. Open Claude in the repo root (`claude`), tell it about yourself, it generates `pages/<slug>.html` from the template. Then run `./submit.sh "Your Name"`.

## For Claude

Read `pages/_template.html`, copy it, replace the four placeholders (`[ROLE]`, `[NAME]`, `[HEADLINE]`, `[BIO]`) with the participant's info, save as `pages/<slug>.html`. Don't redesign. The template is locked.
