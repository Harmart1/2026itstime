# Final corrected production release

Public domain: https://2026itstime.com/

This release incorporates the identified production fixes:

- Cynthia's public campaign name is `Cynthia McCutcheon`.
- All nine campaign priorities use bullets rather than inconsistent numbering.
- Desktop, Windows display-scaling, tablet portrait/landscape, and mobile readability fixes are included.
- The contribution/e-Transfer section has corrected wrapping, spacing, contrast, overflow handling, and responsive breakpoints.
- The Interac/e-Transfer icon no longer contains or leaks explanatory text.
- The contribution form records the eligibility declaration before showing the campaign e-Transfer recipient.
- Campaign e-Transfer recipient: `2026itstime@gmail.com`.
- General contact and contribution forms submit to `2026itstime@gmail.com` through FormSubmit.
- `site.js` has been rebuilt and syntax-checked.
- CSS and JavaScript use fresh cache-busting versions.
- The unverified Facebook text reference has been removed; no Facebook URL is published until an exact profile URL is verified.
- The verified LinkedIn link remains.
- GitHub Pages custom-domain files remain configured for `2026itstime.com`.
- Deployment documentation now references the actual GitHub account `Harmart1`.

- Removed the redundant `Ward 2 · It’s Time!` badge that overlaid the lower pink portion of the campaign lawn-sign image.

- Added search-optimized title, description, Open Graph and Twitter metadata.
- Added WebSite/WebPage/Person/ImageObject JSON-LD entity graph.
- Added image metadata to sitemap.xml.
- Added automatic IndexNow notification for Bing and other participating engines.
- Added a CI SEO audit.
- Cleaned duplicate HTML doctype declarations.
- Strengthened visible identity consistency for Cynthia McCutcheon, Ward 2, Sault Ste. Marie, 2026 and “It’s Time!” without keyword stuffing.

- Added a street-address/unit field to the volunteer/lawn-sign form. Street address and postal code become required automatically when `Requesting a lawn sign` is selected.

- September 29 visual/code cleanup: simplified responsive CSS, removed animation/device-detection dependencies, corrected mobile menu positioning, reduced excessive rounded cards/shadows, and simplified repeated template-style labels without changing campaign positions.

- Expanded lawn-sign requests to collect full placement information: street address, optional unit, city, province, postal code, phone number, optional placement notes, and permission confirmation.
- Full lawn-sign fields are shown and required only when `Requesting a lawn sign` is selected.
- General contact and lawn-sign submissions continue to post to `https://formsubmit.co/2026itstime@gmail.com`; a native POST fallback was added if AJAX submission is unavailable.
- Refined footer structure so campaign identity aligns to the left and contact/legal information aligns cleanly to the right on desktop, with a readable stacked layout on mobile.
