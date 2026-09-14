# Deployment — GitHub Pages + 2026itstime.com

This package is ready to publish as a plain static GitHub Pages site.

## Recommended repository

Create a repository named:

`2026itstime`

under the GitHub account:

`harmartim-oss`

Upload the **contents of this folder to the repository root** (not the containing folder).

The root should contain `index.html`, `CNAME`, `.nojekyll`, `404.html`,
`robots.txt`, `sitemap.xml`, `site.webmanifest`, and the `assets/` directory.

## Turn on GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**.
5. Save.
6. In **Custom domain**, enter exactly:

   `2026itstime.com`

7. Save the custom domain.
8. Once GitHub completes certificate provisioning, enable **Enforce HTTPS**.

The repository already contains a root-level `CNAME` file containing `2026itstime.com`.

## DNS records for 2026itstime.com

At the registrar/DNS provider, set the apex/root domain to GitHub Pages:

| Type | Host/Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | harmartim-oss.github.io |

GitHub also supports these IPv6 records if the DNS provider supports AAAA records:

| Type | Host/Name | Value |
| --- | --- | --- |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

The campaign's canonical address in this build is:

`https://2026itstime.com/`

`www.2026itstime.com` can be configured as the companion host and GitHub will redirect
between `www` and the apex domain when both are configured correctly.

Remove conflicting old A/AAAA/ALIAS/ANAME records at `@` and conflicting CNAME
records at `www` before relying on the GitHub configuration.

Do **not** use a wildcard DNS record such as `*.2026itstime.com`.

## Verify the domain in GitHub

For takeover protection:

1. In GitHub, open the profile menu → **Settings → Pages**.
2. Choose **Add a domain** and enter `2026itstime.com`.
3. GitHub will provide a TXT verification value.
4. Add the requested TXT record at the DNS provider. The record name will use:

   `_github-pages-challenge-harmartim-oss.2026itstime.com`

   (some DNS control panels expect only `_github-pages-challenge-harmartim-oss`).

5. Return to GitHub and complete verification.
6. Keep the verification TXT record in DNS.

## Forms

Both website forms submit to:

`https://formsubmit.co/2026itstime@gmail.com`

After the site is live, send a test submission through **each** form and approve
FormSubmit's one-time activation email at `2026itstime@gmail.com` before the site is
publicly promoted.

## Final live checks

After DNS and HTTPS are active:

- Open `https://2026itstime.com/` on desktop and mobile.
- Confirm the padlock/HTTPS certificate is valid.
- Test navigation and all internal anchors.
- Test the contact form.
- Test the contribution-information form.
- Confirm receipt at `2026itstime@gmail.com`.
- Test the LinkedIn and official City election links.
- Share the homepage in Facebook/iMessage/Messenger to confirm the social image.
- Open `https://2026itstime.com/does-not-exist` to confirm the custom 404 page.
- Confirm both `2026itstime.com` and `www.2026itstime.com` resolve as intended.

## Source visibility

GitHub Pages is a static host. The browser must receive the site's HTML, CSS,
JavaScript and public images. A public repository also exposes those source files
directly through GitHub. If repository-source visibility matters, use a private
repository only if the GitHub account/plan supports Pages from private repositories.
The deployed front-end remains publicly retrievable because browsers need it to render.


### Interac e-Transfer live test

After FormSubmit is activated, test the contribution flow using a small permitted test
contribution workflow:

1. Complete the contributor declaration on the live site.
2. Confirm the post-submit dialog displays `2026itstime@gmail.com`.
3. Confirm **Copy recipient email** copies the exact campaign email.
4. Confirm the selected amount appears correctly.
5. Open the sending financial institution separately and verify the recipient information
   it shows for `2026itstime@gmail.com` before sending.
6. Confirm the campaign receives both the declaration email and the actual bank transfer.
7. Confirm the campaign's receipt workflow is completed.

For the smoothest donor experience, the campaign should register `2026itstime@gmail.com` for
Interac e-Transfer Autodeposit to the campaign bank account, if the campaign's financial
institution supports it. Do not state on the website that Autodeposit is enabled until the
campaign has confirmed that configuration with its bank.

## Automated repository validation

This package includes `.github/workflows/validate.yml`. GitHub Actions will run a
lightweight static-site validation on pushes and pull requests to `main`. No third-party
packages are installed. A passing check confirms the expected CNAME, canonical domain,
campaign form endpoints, local assets, internal anchors and required deployment files.
