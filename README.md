# Wine & Beer Georgia — Website

A professional, multilingual (EN / RU / KA) static B2B website for **Wine & Beer Georgia**
(winebeerge.com), a Georgian alcoholic-beverage export company.

Built with plain **HTML + CSS + vanilla JS** — no frameworks, no build step.
Ready to drop onto any static host (Vercel, Netlify, GitHub Pages, S3, …).

## Structure

```
winebeerge/
├── index.html            Home (hero, advantages, services, CTA)
├── products.html         Product categories (wine, chacha, vodka, cognac, whisky, beer)
├── how-it-works.html     7-step cooperation process
├── tours.html            Winery tour & tasting service
├── about.html            Company info, 40+ partners, mission, placeholders
├── contact.html          Contact form + WhatsApp / Telegram / email
├── css/
│   └── styles.css        Design system + all page styles (mobile-first)
└── js/
    ├── translations.js   All UI/page text, keyed by language (en/ru/ka)
    └── main.js           Language switching, scroll reveal, mobile nav, form
```

## Design

- **Palette:** burgundy `#6B1A2A` · gold `#C9A84C` · cream `#F5F0E8` · charcoal `#1C1C1C`
- **Fonts:** Playfair Display (headings), Inter (body), Noto Sans Georgian (KA) — via Google Fonts
- Responsive / mobile-first, sticky header, subtle fade-in-on-scroll animations
- Respects `prefers-reduced-motion`

## Languages (EN / RU / KA)

- Switcher lives in the sticky header: `EN | RU | KA`.
- Text is stored in `js/translations.js`, keyed by language and a dotted key
  (e.g. `home.hero.title`). Elements carry `data-i18n="<key>"`
  (`data-i18n-placeholder` for inputs).
- The chosen language is saved to `localStorage` (`wbg-lang`) and restored on load.
  Default is **EN**. Switching updates the page instantly, no reload.
- **English** and **Russian** are complete. **Georgian** has the client-approved
  key phrases (nav + "Request a Quote"); every other key falls back to
  `[KA: translation needed]` until the client provides full copy.

## Local preview

No server required — open `index.html` directly, or serve the folder:

```bash
cd winebeerge
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy

- **Netlify / Vercel:** drag-and-drop the `winebeerge` folder, or connect the repo.
  No build command; publish directory is the folder root.
- **GitHub Pages:** push the files and enable Pages on the branch root.

## TODO before going live

Search the codebase for `TODO` — the main items are:

- [ ] **Real photos** — the *featured wine* bottle shots are real (Utskinari,
      in `assets/wines/`). The product *category* tiles use verified-correct
      Unsplash photos; hero backgrounds and tour/cellar imagery are still
      Unsplash placeholders. Replace the latter with real brand photography.
- [ ] **Logo** — the header/footer still use the temporary "W" monogram. Drop
      the real wine&beer.ge logo into `assets/` and it will be wired in.
- [ ] **Contact info** — phone/WhatsApp `+995 500 00 00 00`, Telegram `@winebeerge`,
      email `info@winebeerge.com`, and the Tbilisi address are placeholders.
- [x] **Contact form** — submits via **Web3Forms** (emails the submission; no
      backend). A live access key is already set in `contact.html`. Tested OK.
      To restrict the key to the production domain, enable domain restriction in
      the Web3Forms dashboard once `winebeerge.com` is deployed.
- [ ] **Certificates & partner logos** — `about.html` has "coming soon" placeholders.
- [x] **Georgian translations** — the `ka` object in `js/translations.js` is now a
      full Georgian translation (AI-assisted; terminology cross-checked against
      Georgian winery sites). Recommend a native-speaker proofread before launch.
- [ ] **Wine catalogue** — 6 featured wines from partner winery *Utskinari* are live
      on `products.html`. Add featured positions for the other producers/categories
      (chacha, vodka, cognac, whisky, beer) as catalogues arrive.
```
