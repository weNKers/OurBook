# OurBook Site Architecture and Content Quality Design

**Status:** Draft for user review  
**Date:** 2026-10-14

## Goal

Make the site easier to navigate and maintain across every university, provide reliable page-aware email feedback, repair missing imagery and obvious content corruption, and give the content tree an explicit geographic hierarchy.

## User decisions

- Apply the navigation and related fixes to all universities, not only Fudan University.
- A redesign does not need to preserve current SEO URLs or add redirects for old routes.
- Feedback remains email-based: open the visitor's mail application with the recipient, current page title, current URL, and feedback prompt prefilled.
- Do not rewrite historical first-person accounts or silently modernize time-sensitive claims.

## Current findings

- The repository contains 416 Markdown pages and a shared VitePress theme.
- On a Fudan article, the current mail link correctly includes the page title, current URL, and `ilovecqnk@163.com` recipient.
- The current link is inserted by a polling loop that waits for `.VPDoc`; the home page has no `.VPDoc`, so the loop never terminates. The home page has the top-level feedback navigation but no contextual mail link.
- A university sidebar lists only pages for that university. It does not show the geographic directory as a parent. The top navigation can reach the directory, but does not express the parent-child hierarchy.
- 62 unavailable-image markers appear across 18 geographic index pages; several marker labels contain mojibake. Existing image checks find 37 remote references and one local reference, but reference reachability does not fill the missing logos.
- A browser request for `/favicon.ico` returns 404. Existing favicon files live under `/icons/`.
- A deterministic text scan found two replacement characters in `docs/xmu/2.md`, repeated emphasis markers in 60 Markdown files, and garbled unavailable-image labels in eight regional files. These are candidates for review, not blanket authorization to rewrite prose.

## Information architecture

### Content tree and routes

Move university material into a geographic hierarchy while retaining the readable existing school slugs and numbered article slugs:

```text
docs/universities/
  index.md
  <region>/
    index.md
    <city-or-province>/
      index.md
      <school>/
        index.md
        1.md
        2.md
        ...
```

For example, Fudan University content will live under `docs/universities/east/shanghai/fudan/`, with the city directory at `docs/universities/east/shanghai/` and regional directory at `docs/universities/east/`.

The old `/fudan/` and `/university/shanghai.html` routes are not compatibility requirements and will not receive redirects. All site-owned links, navigation, edit links, search paths, sitemap entries, and canonical URLs must point to the new routes after the move. Existing external links may stop resolving. New routes must still have descriptive metadata and stable canonical URLs.

### Shared university registry

Create one typed or validated data source for region, city/province, university slug, display name, and logo path. Use it to generate regional/city listings, school breadcrumbs, school sidebars, and audit expectations. Do not duplicate the university-to-region mapping in multiple configuration files and Markdown lists.

### Navigation behavior

- Top-level `大学` opens the geographic directory.
- Regional and city pages show a breadcrumb to their parent directory.
- Every school landing page and article shows the hierarchy `大学 / 地区 / 城市或省 / 学校 / 当前文章` with each ancestor linked.
- A school sidebar includes a visible link back to its city/province directory before its school-specific pages.
- Desktop sidebar and mobile navigation expose the same parent route.

## Feedback behavior

- Replace DOM polling and imperative insertion with a VitePress theme slot and a reusable Vue feedback-link module.
- Render the page-aware `mailto:` link on home and document layouts, using the current route, page title, and URL. The dedicated feedback page keeps its prefilled form and does not show a duplicate prompt.
- Keep the site-wide feedback navigation as a second entry point.
- Add an automated generated-site check that every page route renders an email feedback entry with the configured recipient: a contextual mailto link on the home and document layouts, and the prefilled form on the dedicated feedback route. No route may depend on a polling timer.
- Do not attempt to send email from the static site or open a mail client during automated tests.

## Images and content quality

### Missing and existing images

- Replace all 62 unavailable school-logo markers with locally stored, correctly identified images sourced from official university sites or open-license repositories where the source and license can be recorded.
- Add a source manifest with institution, source URL, license or usage note, and local asset path.
- If a suitable image cannot be verified, use a clean Chinese text fallback with correct accessible text; never retain mojibake or a generic filename such as `img` as the label.
- Inspect all existing image references in the browser, including the 37 remote references. Repair empty, invisible, or misleading-image cases. Cache a remote image locally only when its source and reuse conditions are documented.
- Add a root favicon or configure the existing icon file explicitly so `/favicon.ico` no longer fails.

### Text review

- Review all 416 Markdown pages in manageable, recorded batches.
- Correct high-confidence encoding corruption, duplicated words, malformed headings/emphasis, broken links, and obvious typographical errors.
- Preserve author voice, historical dates, and reported experiences. Do not silently change admissions, employment, statistics, or other time-sensitive claims; flag these for a sourced update or label them as historical.
- Add or improve deterministic audits for replacement characters, mojibake in site-authored labels, unresolved image references, and malformed Markdown emphasis. Lint findings must be reviewable and must not auto-rewrite prose.

## SEO and publishing

Old routes do not need redirects or preservation. New routes must continue to emit canonical URLs, Open Graph metadata, structured data where applicable, `robots.txt`, and a sitemap containing only valid new routes. Search indexing and edit links must use the new route tree.

The GitHub Pages publishing target and custom domain remain unchanged.

Design and implementation-plan documents under `docs/superpowers/` are repository-only working artifacts and must be excluded from the public site build and sitemap.

## Verification

- Build all pages and assert the new geographic routes render.
- Assert every university article includes parent breadcrumbs and a visible parent-directory link.
- Assert every page route, including the homepage, renders the appropriate feedback entry; assert mailto links have the correct recipient and page context, and the feedback form renders its fields.
- Assert the sitemap and canonical links contain new routes and no deleted old university routes.
- Run strict content, asset, internal-link, and image audits.
- Use a real browser at desktop and mobile widths to inspect one route at each hierarchy level, navigate from an article to school/city/region directories, check the email link without launching a mail client, and verify image natural dimensions and console/network errors.
- Review content and image fixes in batches; test results do not substitute for human review of historical facts or visual image identity.

## Non-goals

- No backend email service, user account system, or comment platform.
- No wholesale rewrite of historical articles or unsourced modernization of claims.
- No redesign of the visual identity or replacement of the VitePress theme.
- No redirects or aliases for pre-redesign university routes.

