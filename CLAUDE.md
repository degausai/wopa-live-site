# Briefing for Claude

You're being invoked inside a clone of the WOPA Session 1 workshop site. The participant who cloned this repo wants to add a personal bio page in the same style as the rest of the site, then submit it. You handle both steps.

## Context

This repo is the redesigned wopa.ro site, plus a `pages/` folder where each workshop participant adds one HTML page about themselves. The submit pipeline:

1. Participant tells you (in english) who they are.
2. You generate `pages/<slug>.html` matching the site's existing style.
3. The participant runs `./submit.sh "<Their Name>"` (or `submit.ps1` on Windows). This POSTs the page to a Cloud Run service that opens a pull request to the main repo.
4. The presenter merges the PR on stage and projects the page.

Your job is steps 1 and 2. The participant runs step 3 themselves.

## When the participant gives you their info

Expect something casual: "I'm Andu, I'm a Creative Director, one weird thing about me is I collect vintage film cameras." Or just three answers to three questions you ask.

If they don't volunteer the info, ask in plain language: name, role, one thing a future colleague should know about them. Stop there. Don't ask for more.

## How to make the page

1. **Read `index.html` first** to learn the existing style: typography, color palette (hot pink `#ff0080`, black `#000`, white), spacing, the bold headline aesthetic, the Truth & Dare voice.
2. **Optionally peek at any existing files in `pages/`** to see what other participants did. Don't copy them. Each page should feel different.
3. **Create `pages/<slug>.html`** where `<slug>` is the participant's name lowercased with non-alphanumeric replaced by `-` (e.g. "Andu Popescu" → `andu-popescu`).
4. **Style requirements:**
   - Single self-contained HTML file. Inline CSS in a `<style>` block. No external CDNs, no external fonts (system fonts only). No images unless the participant gave you a URL.
   - Match the WOPA visual identity: bold sans-serif typography, hot pink as the only accent color, black on white background.
   - The page is one viewport tall, centered, scannable in 5 seconds. Not a long form bio. Think poster, not resume.
   - Include: their name (huge headline), their role (small uppercase tag), and the one-thing-about-them as the body. Maybe a tagline or a number that matters to them. Use restraint.
   - Optional: a small interactive flourish (hover effect, a CSS animation) if it lands the personality.
5. **Show them the result.** Open it in their browser (`open pages/<slug>.html` on Mac, `start pages/<slug>.html` on Windows) so they can preview before submitting.
6. **If they want changes**, iterate. Don't ask "what do you want changed?" — just take their feedback and adjust.

## Style guardrails

- **No em-dashes** (`—`). Use periods, colons, parentheses, or middle dots (`·`) instead. The WOPA brand voice is punchy, not literary.
- **No corporate filler.** Don't write "passionate about X" or "results-driven Y". Specific, weird, true beats generic and polished.
- **No clichés.** If the participant tells you something boring, push for the weirder version. "I like coffee" → "what's your hill-to-die-on coffee opinion?"
- **Honor the brand.** Pink and black is non-negotiable. The bold headline aesthetic is non-negotiable.

## When the participant is ready to submit

Tell them to run, in this terminal:

```bash
export WOPA_SUBMIT_URL="https://wopa-submit-167057116194.europe-west1.run.app"
export WORKSHOP_PASSWORD="wopa-dare"
./submit.sh "Their Full Name"
```

(On Windows, `./submit.ps1 "Their Full Name"`.)

They'll see a PR URL printed. That's it. The presenter takes over from there.

## What you should not do

- Don't `git commit` or `git push`. The submit script handles the upload via the Cloud Run endpoint.
- Don't edit `index.html`. The site already exists; participants add pages, they don't restyle the home page.
- Don't add JavaScript dependencies (`<script src="https://cdn...`). The page must work offline as a single file.
- Don't make multiple files. One HTML file at `pages/<slug>.html`. Nothing in `assets/` for the participant page (they don't have generated images).

## If the submit fails

- "bad password" → they didn't `export WORKSHOP_PASSWORD=wopa-dare`.
- "no page at pages/..." → the slug they passed to `submit.sh` doesn't match the file you created. Either rename the file, or have them pass the matching name.
- Anything else → ask them to tell the presenter; the Cloud Run endpoint may need restarting.
