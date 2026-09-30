# Cynthia McCutcheon — Ward 2 Campaign Website

Production static website for **Cynthia McCutcheon**, candidate for Ward 2,
Sault Ste. Marie City Council.

**Live domain:** [2026itstime.com](https://2026itstime.com/)

**Campaign contact:** 2026itstime@gmail.com

## GitHub Pages structure

```text
/
├── .nojekyll
├── CNAME
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── COPYRIGHT.md
├── DEPLOYMENT.md
└── assets/
    ├── css/
    │   └── site.css
    ├── js/
    │   └── site.js
    ├── icons/
    │   ├── favicon-32.png
    │   ├── favicon-192.png
    │   ├── favicon-512.png
    │   └── apple-touch-icon.png
    └── images/
        ├── campaign-mark.png
        ├── cynthia-hero.jpg
        ├── campaign-lawn-sign.jpg
        └── og-share.jpg
```

The site is intentionally framework-free: no build step, package manager, database,
Jekyll theme or server runtime is required. GitHub Pages can publish the repository
directly from the `main` branch root.

See **DEPLOYMENT.md** for the exact GitHub Pages, DNS, HTTPS and form-activation steps.


## Interac e-Transfer contribution flow

The contribution form records the contributor's eligibility declaration and then displays
the campaign e-Transfer recipient email:

`2026itstime@gmail.com`

The donor can copy the recipient email and the selected contribution amount directly from
the confirmation dialog, then open their own financial institution's app or online banking
to send the Interac e-Transfer.

Interac e-Transfer payments themselves are initiated inside the donor's participating
financial institution; there is no universal browser URL that can securely initiate a
Canadian Interac e-Transfer on every bank or credit union.

## Launch QA

The repository includes a dependency-free GitHub Actions validator at
`.github/workflows/validate.yml`. It checks the custom domain file, canonical URL,
form endpoints, required site files, local asset paths, internal anchors and candidate-name consistency.

Use `GO_LIVE_CHECKLIST.md` for the final DNS, GitHub Pages, form and browser checks.

## Mobile readability fix

The contribution section was corrected on 2026-09-15 to prevent Interac helper text from overflowing its icon, increase mobile contribution-form readability, improve contrast in the Ontario contribution-limits card, and hide the fixed mobile CTA while the contribution section is being used.


## All-device contribution readability

The contribution section includes defensive wrapping, contrast and responsive-layout rules for desktop Windows display scaling, tablets and mobile devices. CSS/JavaScript references are versioned to force browsers to refresh the corrected assets after deployment.


See `FINAL_RELEASE_NOTES.md` for the final production corrections included in this build.


For Google/Bing indexing steps, see `SEARCH_ENGINE_SETUP.md`.
