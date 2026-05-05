# Briefing for Claude

You're being invoked inside a clone of the WOPA Session 1 workshop site. The participant who cloned this repo wants to add a personal bio page in the same style as the rest of the site, then submit it. You handle both steps.

## Context

This repo is the redesigned wopa.ro site, plus a `pages/` folder where each workshop participant adds one HTML page about themselves. The submit pipeline:

1. Participant tells you (in english) who they are.
2. You generate `pages/<slug>.html` matching the site's existing style and iterate with them locally until they're happy.
3. When the participant tells you to submit (e.g. "submit my page with password wopa-dare"), YOU run `./submit.sh "<Their Name>"` (or `submit.ps1` on Windows) on their behalf, with `WORKSHOP_PASSWORD` set inline. The script POSTs the page to a Cloud Run service that opens a pull request to the main repo.
4. You report the PR URL the script printed back to the participant. The presenter merges the PR on stage and projects the page.

Your job is steps 1, 2, and 3. The participant only tells you when to submit.

## When the participant gives you their info

Expect something casual: "I'm Andu, I'm a Creative Director, one weird thing about me is I collect vintage film cameras." Or just three answers to three questions you ask.

If they don't volunteer the info, ask in plain language: name, role, one thing a future colleague should know about them. Stop there. Don't ask for more.

## How to make the page

You work from a template. Do NOT design from scratch and do NOT read `index.html`. The template is your STARTING POINT, not a cage: fill in the four placeholders, and add one small custom flourish if it makes the page feel more like the participant. Stay inside the brand rails (see below).

1. **Read `pages/_template.html`.** It has the four placeholders you need to fill: `[ROLE]`, `[NAME]`, `[HEADLINE]`, `[BIO]`. It also has detailed instructions in its top comment block about what flourishes you can add and what's locked.
2. **Decide the slug.** Take the participant's name, lowercase it, replace any non-alphanumeric characters with `-`, strip leading/trailing dashes. "Andu Popescu" → `andu-popescu`. "Mária O'Brien" → `m-ria-o-brien` (or similar).
3. **Copy the template to `pages/<slug>.html`.** Use your file-write tool. The new file should be a copy of `_template.html`, with the placeholders replaced.
4. **Fill the placeholders thoughtfully:**
   - `[ROLE]` → uppercase role, e.g. `CREATIVE DIRECTOR`, `COPYWRITER`, `CFO`.
   - `[NAME]` → as the participant gave it, mixed case ok.
   - `[HEADLINE]` → 1 line, max ~10 words. Personal, punchy, specific. Pull it from what they told you about themselves. Use the existing `.pink` and `.outline` spans for visual interest if it fits (one phrase pink, one phrase outlined). Example: "I make `<span class='pink'>weird futures</span>` for `<span class='outline'>quiet brands</span>." Don't force it — if a flat headline lands harder, use a flat headline.
   - `[BIO]` → 1 to 3 sentences. The one-thing-they-told-you, expanded just enough to feel intentional. Specific over generic. No corporate filler. No "passionate about X."
5. **Optionally add one small custom flourish.** This is what gives each page its own fingerprint. Pick AT MOST ONE of:
   - Swap which spans get `.pink` vs `.outline` to land the headline rhythm.
   - Add a hover effect on the headline or the footer tag (e.g. tag rotates 2deg, headline letter-spacing tightens).
   - Add a subtle CSS animation (fade-in on load, an underline that grows, a blinking caret).
   - Tweak font-weight or letter-spacing on one element.
   - Add ONE new minimal decorative element (a quote line, a thin divider, a small text symbol like `→` or `··`). Keep it subtle.

   Don't go beyond one flourish; the goal is personality, not redesign.
6. **Show them the result locally.** Open it in their browser (`open pages/<slug>.html` on Mac, `start pages/<slug>.html` on Windows). Tell them they can refresh the tab any time to see updates.
7. **Iterate locally.** This is the most important part of the flow. The page is a draft until the participant says it's done. If they want the headline punchier, the bio shorter, the role title rephrased — make the edit, save the file, tell them to refresh. Repeat as many times as they want. Do NOT touch the CSS or HTML structure. If they ask for a layout change, gently push back: "the template's locked, but we can sharpen the headline / bio / role to land it better." If they really insist on visual changes, escalate to the presenter.

## Iterate locally, deploy on demand

This is the rhythm of this exercise:

- **You write to disk → they refresh the browser → they react → you adjust.** Loop until they're happy. None of this leaves their laptop.
- **Do NOT mention submitting early.** Don't bring it up until the participant signals they're done. Premature mentions make it feel like the page is one-shot, which kills the iteration loop.
- **Listen for done-signals.** When the participant says any of: "perfect", "looks good", "ship it", "send it", "submit it", "I'm done", "let's deploy", "post it" — that's your cue. Ask them for the submission password (it's `wopa-dare`, but let them be the one to give it to you so they feel in control).
- **Listen for not-yet-signals.** "Hmm", "make X different", "what about Y", "try Z" — they're still iterating. Just edit and save. Don't surface the submit step.

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

## When (and only when) the participant says they're done

The "deploy" is the PR. YOU run the submit script on the participant's behalf, with the password set inline. Use bash on Mac/Linux and PowerShell on Windows. Detect the platform from the working environment.

On Mac/Linux:

```bash
WORKSHOP_PASSWORD=wopa-dare ./submit.sh "Their Full Name"
```

On Windows:

```powershell
$env:WORKSHOP_PASSWORD = "wopa-dare"; .\submit.ps1 "Their Full Name"
```

The script prints a PR URL on success. Read it from the script output and tell the participant: *"Your PR is live at <URL>. The presenter will pull it up on the screen in a few minutes."*

Don't run submit before they've signalled they're ready. Don't run it if they're still iterating. The submit is one-and-done; iteration happens locally before that point.

## What you should not do

- Don't run any `git` command (`git add`, `git commit`, `git push`). The submit script handles the upload via the Cloud Run endpoint, and that script is the only thing you run.
- Don't edit `index.html`. The site already exists; participants add pages, they don't restyle the home page.
- Don't add JavaScript dependencies (`<script src="https://cdn...`). The page must work offline as a single file.
- Don't make multiple files. One HTML file at `pages/<slug>.html`. Nothing in `assets/` for the participant page (they don't have generated images).

## If the submit fails

- "bad password" → you ran the script without setting `WORKSHOP_PASSWORD=wopa-dare`. Re-run with the password set inline.
- "no page at pages/..." → the name you passed to `submit.sh` produces a slug that doesn't match the file you created. Pass the same name you used to derive the filename.
- Anything else → tell the participant to flag the presenter; the Cloud Run endpoint may need restarting.
