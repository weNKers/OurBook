---
title: "站点架构与内容质量实施计划"
description: "站点升级的内部设计和实施记录。"
contentType: internal
---

# Site Architecture and Content Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize every university under a geographic content tree, make parent navigation and page-aware email feedback reliable, restore missing images, and clean high-confidence content errors.

**Architecture:** A single JSON university directory maps region → city/province → school and drives routes, breadcrumbs, sidebars, and directory listings. VitePress layout slots render feedback and breadcrumbs; local, attributed image assets replace missing placeholders. Existing content is moved, internal links are rewritten, and old university URLs are not redirected.

**Tech Stack:** VitePress 1.6.4, Vue 3, TypeScript, Node.js 24, Markdown, existing Node site audits, Playwright CLI for browser verification.

**Spec:** `docs/superpowers/specs/2026-10-14-site-architecture-and-content-quality-design.md`

## Global Constraints

- “A redesign does not need to preserve current SEO URLs or add redirects for old routes.”
- “Do not rewrite historical first-person accounts or silently modernize time-sensitive claims.”
- “Replace all 62 unavailable school-logo markers with locally stored, correctly identified images sourced from official university sites or open-license repositories where the source and license can be recorded.”
- “If a suitable image cannot be verified, use a clean Chinese text fallback with correct accessible text; never retain mojibake or a generic filename such as `img` as the label.”
- “The GitHub Pages publishing target and custom domain remain unchanged.”
- “Design and implementation-plan documents under `docs/superpowers/` are repository-only working artifacts and must be excluded from the public site build and sitemap.”

## Review Focus

- Old relative links can silently point to a different file after moving school pages; Task 1 tests the whole strict internal-link audit and representative moved-page links.
- Registry entries can omit a school or assign it to the wrong city; Task 1 compares every existing school folder with exactly one registry entry and asserts page counts.
- Navigation can render correctly on desktop but hide parent links on mobile; Task 2 verifies desktop and mobile routes in a real browser.
- Mailto data can be correct in source but absent on SPA or home routes; Task 3 checks generated HTML for every layout and validates encoded title/URL/recipient.
- Remote image reachability can differ from browser display or logo identity; Task 4 verifies every local asset loads and checks source manifest coverage, while unmatched sources retain a legible fallback.

## File and Module Map

- Create `docs/.vitepress/university-directory.json` as the shared region/city/school registry consumed by Node-side route generation and client navigation.
- Modify `docs/.vitepress/sidebar.js` to generate directory and school sidebars from the registry.
- Modify `docs/.vitepress/config.mts` to set the new nav, clean routes, SEO paths, and exclude internal `docs/superpowers/**` artifacts.
- Modify `docs/.vitepress/theme/index.ts`; add focused Vue modules for global feedback and breadcrumb rendering; remove `theme/email-feedback.ts` polling.
- Move `docs/university/*.md` and each university root directory into `docs/universities/<region>/<city>/<school>/` while keeping numbered article filenames.
- Modify `scripts/tests/site-build.test.mjs` and add focused registry/content-image audit tests under `scripts/tests/`.
- Add local university logos only when a source and usage terms are verified; document unresolved text fallbacks in `research/content-quality-audit.md`.
- Fix reviewed Markdown issues in place after the content migration; record each edited file and issue category in `research/content-quality-audit.md`.

## Task 1: Build the registry and migrate university routes

**Files:** Create `docs/.vitepress/university-directory.json`; modify `scripts/tests/site-build.test.mjs`; move `docs/university/` and all school directories into `docs/universities/`. A temporary migration script was used and removed after the one-time move.

**Interfaces:**
- Produces: JSON entries `{ region, regionTitle, city, cityTitle, school, schoolTitle }[]`, with each current school slug represented exactly once.
- Consumes: existing `docs/.vitepress/area.js`, `constants/univ.js`, and links in `docs/university/*.md`.

- [x] Write a failing site-build test asserting the new Fudan route `/universities/east/shanghai/fudan/index.html`, its numbered article route, the regional and city indexes, no old root-level school route, and that all registry entries resolve to a school landing page.
- [x] Run `npm run test:site`; expect failure because the new routes and registry do not exist.
- [x] Build the validated registry from the existing city pages and region map; verify every school mapping is present exactly once.
- [x] Move school Markdown directories and geographic indexes, rewrite all internal links to the new tree, and keep the existing numbered article filenames and frontmatter titles.
- [x] Run `npm run test:site` and `npm run audit:links:strict`; expect all current routes and internal links to resolve under the new tree.
- [x] Commit the completed migration as part of the consolidated implementation commit.

## Task 2: Generate complete parent navigation for every university

**Files:** Modify `docs/.vitepress/sidebar.js`, `docs/.vitepress/config.mts`; create a reusable breadcrumb component and tests in `scripts/tests/site-build.test.mjs`.

**Interfaces:**
- Consumes: the directory registry from Task 1 and VitePress `useRoute`/`useData`.
- Produces: a `UniversityBreadcrumbs` component rendering linked ancestors and a registry-generated school sidebar with a parent-city link.

- [x] Add failing assertions for breadcrumbs on Fudan landing/article routes and another school in a different region; assert city and region ancestors link to their new index routes and the school sidebar links to the city index.
- [x] Run `npm run test:site`; expect the new ancestor assertions to fail.
- [x] Render breadcrumbs and parent sidebar links from the registry for every university route; use the same breadcrumb component for region and city indexes.
- [x] Run `npm run test:site` and check that every school slug in the registry renders parent navigation.
- [x] Use the in-app browser at a narrow viewport to navigate from a school article to its school, city, region, and all-universities parents; expect each ancestor link to reach its correct route.
- [x] Commit the navigation changes as part of the consolidated implementation commit.

## Task 3: Replace feedback polling with server-rendered layout links

**Files:** Modify `docs/.vitepress/theme/index.ts`; create `docs/.vitepress/theme/EmailFeedback.vue`; remove `docs/.vitepress/theme/email-feedback.ts`; modify `scripts/tests/site-build.test.mjs` and feedback copy as needed.

**Interfaces:**
- Consumes: VitePress `useRoute`, `useData`, and `FEEDBACK_EMAIL`.
- Produces: a reusable mailto feedback entry with URL-encoded current title, URL, and user prompt; a dedicated feedback form remains the feedback-page interaction.

- [x] Add failing generated-site assertions that the homepage and every non-feedback document page render the mailto entry with `ilovecqnk@163.com`, page title, and canonical route, and the feedback page renders its fields without a duplicate link.
- [x] Run `npm run test:site`; expect homepage and all-document feedback assertions to fail against the polling-only implementation.
- [x] Render the Vue entry through VitePress `layout-bottom` or the appropriate shared slot, exclude duplicate entry on `/feedback/`, and delete the unbounded `.VPDoc` polling loop.
- [x] Run `npm run test:site`; expect all generated-route feedback checks to pass and no built client bundle to contain the old polling implementation.
- [x] Use the in-app browser to inspect the homepage, Fudan article, a region index, and feedback form; verify mailto data without activating the mail link and verify no repeated DOM entries after SPA navigation.
- [x] Commit the feedback changes as part of the consolidated implementation commit.

## Task 4: Restore missing university images and fix image delivery

**Files:** Modify migrated geographic indexes; document the image review in `research/content-quality-audit.md`; extend site-build checks.

**Interfaces:**
- Consumes: the directory registry from Task 1 and the current image assets.
- Produces: one accurate, accessible local logo or Chinese text fallback per university listing; image attribution is recorded whenever an asset is added.

- [x] Add a failing site-build assertion that catches broken image markers, generic upload labels, and mojibake image labels.
- [x] Run the site-build test and observe a failure on an existing “正在上传...” label.
- [x] Replace all 62 broken school-logo markers with accessible school-name fallbacks and update four generic existing article-image descriptions; record why unverified logos were not added.
- [x] Add a root favicon link to an existing valid icon file and assert its URL is served.
- [x] Run the site-build label check, `npm run audit:assets`, and remote image audit; verify no broken local image references and 37/37 reachable external images on the final run.
- [x] Use browser inspection to verify the Fudan photo loads and the regional logo fallbacks have legible accessible labels.
- [x] Record the image audit and fallback decision in `research/content-quality-audit.md`.

## Task 5: Review and correct content quality across all pages

**Files:** Modify reviewed migrated Markdown pages; create `research/content-quality-audit.md`; extend tests under `scripts/tests/`.

**Interfaces:**
- Consumes: the new content tree and existing strict content/link/image audits.
- Produces: a recorded review summary and a testable image-label check; manual edits are limited to high-confidence corrections.

- [x] Add a failing test for generic or mojibake image labels in university content.
- [x] Run the site-build test and observe a failure for the Fudan “正在上传...” label before replacing it.
- [x] Scan all 426 resulting Markdown files for strict frontmatter, titles, encoding damage, broken image labels, and links. Correct the two high-confidence encoding errors; preserve legacy prose and time-sensitive claims.
- [x] Run the content checks and `npm run audit:content:strict`; verify all 426 Markdown files have frontmatter and headings.
- [x] Run `npm run audit:links:strict`; expect all migrated and edited content links to resolve.
- [x] Commit the content and image review as part of the consolidated implementation commit.

## Task 6: Final SEO/build/docs review and branch verification

**Files:** Modify `README.md`, `docs/guide/content-schema.md`, `docs/guide/version.md`, `docs/.vitepress/seo.mts`, and site tests as required.

**Interfaces:**
- Consumes: final new route tree, shared registry, image review, and feedback module.
- Produces: accurate site usage guidance, new route SEO metadata, and a publishable sitemap excluding internal design and plan documents.

- [x] Add failing assertions that canonical and Open Graph URLs use new routes, sitemap includes the new directory hierarchy and omits removed old routes and `docs/superpowers/**`, and internal plan/spec files are absent from published output.
- [x] Run `npm run test:site`; expect sitemap, exclusion, or route assertions to fail before the final configuration changes.
- [x] Update source documentation and changelog for the new hierarchy, feedback behavior, image source policy, and review date; exclude `superpowers/**` from the VitePress source and sitemap.
- [x] Run `npm run check`, `npm run audit:images:remote`, and `git diff --check`; verify all checks pass (the first remote image run timed out once and passed on rerun).
- [x] Inspect routes in the browser at the available narrow viewport in a real browser, verify navigation, feedback links, logos, favicon, console, and network responses.
- [x] Run the final read-only review against the spec and plan; add a regression test and fix the missing article links in school sidebars, then rerun verification.
- [ ] Push the finished branch and update the existing PR #25 with the completed redesign.
