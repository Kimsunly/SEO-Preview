# SEO Preview Studio

A real-time Search Engine Preview tool built with pure HTML, CSS, and JavaScript. Fill in your page details on the left and instantly see how your page would appear on Google and Bing — before you publish anything.

Built as a midterm project for **Web & Client-side Technologies II (WCT II)**.

---

## Live Demo

Open `index.html` directly in your browser — no installation or server needed.

---

## Features

### Editor Panel
- **Page Title** input with live character counter and color feedback
- **Meta Description** textarea with character counter
- **URL Slug** that auto-formats as you type (spaces → hyphens, lowercase)
- **Open Graph fields** for social sharing (Facebook, LinkedIn)
- **Canonical URL** setting to avoid duplicate content
- **Robots directive** dropdown (index/noindex control)

### Preview Panel
- **Google Desktop** search result preview
- **Bing Desktop** search result preview
- **Mobile preview** inside a realistic iPhone frame
- Toggle between **Desktop / Mobile** view
- Toggle between **Google / Bing** engine
- All preview content updates **live on every keystroke**

### SEO Tools
- **SEO Score (0–100)** — animated ring gauge scoring your title, description, slug, and social fields
- **SEO Checklist** — 5 checks with pass ✓ / warning ! / fail ✗ status
- **Generated HTML Meta Tags** — live syntax-highlighted code block
- **Copy to Clipboard** — copies all meta tags in one click
- **Export HTML File** — downloads a ready-to-use `.html` file

---

## Project Scope

This project covers both required scopes:

| Scope | Implementation |
|---|---|
| User can create a dynamic page | Editor panel lets users define all page SEO fields. Export button downloads a real `.html` file. |
| Real-time search preview while editing | Google and Bing preview updates instantly on every keystroke using JavaScript DOM manipulation. |

---

## File Structure

```
seo-preview-studio/
├── index.html      # Page structure and layout only
├── style.css       # All visual styling and dark theme
└── script.js       # All logic, state management, and interactivity
```

Each file has a single responsibility — this follows the **Separation of Concerns** principle, making the code easier to read, edit, and maintain.

---

## How It Works

```
User types → addEventListener fires → state object updates → update() runs → all previews re-render
```

1. Every input field has an `addEventListener('input')` attached in `script.js`
2. When the user types, the value is saved into a central `state` object
3. The `update()` function is called immediately
4. Four render functions run: `renderPreviews()`, `updateScore()`, `updateChecklist()`, `updateCodeBlock()`
5. The DOM updates instantly — no page refresh needed

---

## SEO Score Breakdown

| Condition | Points |
|---|---|
| Title is 30–60 characters (ideal) | 30 pts |
| Title exists but not ideal length | 10 pts |
| Description is 70–160 characters (ideal) | 30 pts |
| Description exists but not ideal length | 10 pts |
| URL slug is filled | 20 pts |
| OG title or description is filled | 10 pts |
| OG image URL is filled | 10 pts |
| **Maximum total** | **100 pts** |

---

## Key JavaScript Concepts Used

| Concept | Where it's used |
|---|---|
| `addEventListener('input')` | Detects every keystroke across all fields |
| DOM manipulation (`innerHTML`, `textContent`) | Updates preview, counters, checklist, code block |
| State object | Single source of truth for all form data |
| `slugify()` | Auto-formats URL slug on input |
| `truncate()` | Clips title at 60 chars and description at 160 chars |
| `escHtml()` | Escapes special characters to prevent XSS |
| SVG `strokeDashoffset` | Animates the SEO score ring |
| `navigator.clipboard.writeText()` | Copies meta tags to clipboard |
| `Blob` + `URL.createObjectURL()` | Generates and downloads the HTML export file |
| CSS Variables (`:root`) | Design tokens for consistent theming |
| `display: grid` | Two-column layout (editor + preview) |
| `@keyframes` | Entrance animations and score ring transitions |

---

## Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/your-username/seo-preview-studio.git
```

**2. Open the project**
```bash
cd seo-preview-studio
```

**3. Run it**

Open `index.html` in any modern browser. No build tools, no `npm install`, no server required.

---

## Built With

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Google Fonts — DM Sans, DM Mono, Fraunces

No frameworks. No libraries. No backend.

---

## Subject

**Course:** Web & Client-side Technologies II (WCT II)
**Type:** Midterm Project
**Year:** 2026

---

## License

This project is for educational purposes.
