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

You work from a template. Do NOT design from scratch and do NOT read `index.html`. The template enforces the visual style of participant pages so the gallery stays cohesive.

1. **Read `pages/_template.html`.** It has the four placeholders you need to fill: `[ROLE]`, `[NAME]`, `[HEADLINE]`, `[BIO]`. The CSS, color palette, layout, and structure are already correct. Don't redesign them.
2. **Decide the slug.** Take the participant's name, lowercase it, replace any non-alphanumeric characters with `-`, strip leading/trailing dashes. "Andu Popescu" → `andu-popescu`. "Mária O'Brien" → `m-ria-o-brien` (or similar).
3. **Copy the template to `pages/<slug>.html`.** Use your file-write tool. The new file should be a copy of `_template.html`, with the placeholders replaced.
4. **Fill the placeholders thoughtfully:**
   - `[ROLE]` → uppercase role, e.g. `CREATIVE DIRECTOR`, `COPYWRITER`, `CFO`.
   - `[NAME]` → as the participant gave it, mixed case ok.
   - `[HEADLINE]` → 1 line, max ~10 words. Personal, punchy, specific. Pull it from what they told you about themselves. Use the existing `.pink` and `.outline` spans for visual interest if it fits (one phrase pink, one phrase outlined). Example: "I make `<span class='pink'>weird futures</span>` for `<span class='outline'>quiet brands</span>." Don't force it — if a flat headline lands harder, use a flat headline.
   - `[BIO]` → 1 to 3 sentences. The one-thing-they-told-you, expanded just enough to feel intentional. Specific over generic. No corporate filler. No "passionate about X."
5. **Show them the result.** Open it in their browser (`open pages/<slug>.html` on Mac, `start pages/<slug>.html` on Windows).
6. **If they want changes**, iterate on the placeholders. Do NOT touch the CSS or HTML structure. If they ask for a layout change, gently push back: "the template's locked, but we can sharpen the headline / bio / role to land it better." If they really insist on visual changes, escalate to the presenter.

### What you can NOT do

- **Do not read or edit `index.html`** or anything in `assets-real/`. The home page is fixed.
- **Do not edit `pages/_template.html`.** It's the source of truth for everyone's page.
- **Do not edit any other `pages/*.html`.** Other participants' pages are theirs.
- **Do not add new files outside `pages/<slug>.html`.** No images, no extra CSS files, no JS.
- **Do not run `git add` / `git commit` / `git push`.** The submit script handles upload.

The whole exercise is one new file at `pages/<slug>.html`. That's the entire scope.

## Style guardrails (for the copy you write into placeholders)

- **No em-dashes** (`—`). Use periods, colons, parentheses, or middle dots (`·`) instead. The WOPA brand voice is punchy, not literary.
- **No corporate filler.** Don't write "passionate about X" or "results-driven Y". Specific, weird, true beats generic and polished.
- **No clichés.** If the participant tells you something boring, push for the weirder version. "I like coffee" → "what's your hill-to-die-on coffee opinion?"
- **Honor the brand voice.** The template handles the visual brand. Your job is the words: confident, sharp, Truth & Dare energy.

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
