# You, My Blue Note

A responsive single-page experience with narrative reveal, custom animations, and ambient audio. Built with vanilla HTML, CSS, and JavaScript—no frameworks or build step.

---

## Overview

Interactive narrative site with a full-screen intro, particle-style “fairy trail” animation, and progressive text reveal. Supports two letter flows with different background tracks and a clean, dim-light visual theme. Designed to be responsive and performant across devices.

---

## Tech Stack

| Area | Choice |
|------|--------|
| **Markup** | HTML5 (semantic structure) |
| **Styling** | CSS3 (custom properties, flexbox, keyframe animations) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Fonts** | Google Fonts (Cormorant Garamond, Montserrat) |
| **Deployment** | Static; suitable for GitHub Pages, Netlify, Vercel |

No dependencies, no bundler, no Node required to run locally.

---

## Features

- **Opening sequence** — Full-screen overlay with CTA; on click, a “fairy trail” animation (sparkles along a path) and centered dedication text, then transition to main content.
- **Progressive narrative** — Click/tap or keyboard (Space/Enter) to reveal sections; message box grows with content and uses smooth, eased transitions.
- **Dual letters** — Two full narratives; at the end of each, option to “Read the previous letter” / “Read the latest letter” with correct track and state.
- **Audio** — Separate tracks per letter (e.g. `background2.mp3` for current, `background.mp3` for previous), play/pause and volume control, optional autoplay after first interaction.
- **Ambient particles** — Continuous stream of blue roses (emoji + PNG) and music-note symbols with varied motion and timing.
- **Responsive & accessible** — Layout and typography scale; keyboard navigation; reduced-motion respected where applied.

---

## Project Structure

```
├── index.html          # Single-page structure, both letters
├── styles.css          # Layout, theme, animations
├── script.js           # Particles, reveal, letter switch, audio
├── assets/
│   ├── images/         # e.g. blue-rose.png
│   └── music/          # background.mp3, background2.mp3
└── README.md
```

---

## Run Locally

**Quick (file protocol):**  
Open `index.html` in a browser. Audio may be blocked until user interaction.

**With a local server (recommended for audio):**

```bash
# Python
python3 -m http.server 8000

# or Node (npx)
npx serve
```

Then visit `http://localhost:8000` (or the port shown).

---

## Deploy

- **GitHub Pages:** Push to a repo → Settings → Pages → Source: “Deploy from a branch” → branch `main`, folder `/ (root)`. Ensure `index.html` and assets are at repo root.
- **Netlify / Vercel:** Drag the project folder or connect the repo; no build step.

---

## Design Notes

- **Theme:** Deep blue palette, soft contrast, serif for body text. CSS variables in `styles.css` for quick theme tweaks.
- **Animations:** Keyframe-based (fairy trail, particle drift, section reveal); no heavy JS animation libraries.
- **State:** One “current” letter and one “previous”; section index and track source switch when changing letter.

---

## License

Personal project. Fonts: Cormorant Garamond and Montserrat (SIL OFL) via Google Fonts.
