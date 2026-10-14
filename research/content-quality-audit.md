# Site content and image audit

**Review date:** 2026-10-14
**Scope:** 426 Markdown files after adding the new geographic indexes; all 66 university entries and the 18 populated city/province index pages (the empty overseas index was consolidated into its region page).

## Completed

- Migrated the 66 school directories and 19 geographic indexes to `docs/universities/<region>/<city>/<school>/` and `docs/universities/<region>/<city>/`.
- Replaced the 62 broken/missing school-logo markers with readable, accessible school-name fallbacks. Their original mojibake labels and filename-like alt text are gone.
- Updated four article image descriptions that said “正在上传...”. The Fudan image was checked in the browser and is a campus stone bearing the university name; the SYSU images are described in the context of the campus map and oral medicine article.
- Corrected two replacement characters in the Xiamen University article: one obscured punctuation and one obscured the word “课”.
- Checked local assets and internal links across the complete Markdown tree. The strict image URL audit found 37/37 remote references reachable on the final run; the audit can report a transient host timeout and should be rerun when one occurs.
- Added an automated site-build check that scans university content for broken image markers, generic “uploading” text, and mojibake image labels.

## Image source decision

The 62 missing school logos do not have verified source/license records in the repository. They now use accessible text fallbacks rather than speculative or incorrectly identified logos. Existing article images were retained where the remote audit passed. University logo artwork can be added later when a reliable official or openly licensed source is confirmed and recorded.

## Content review boundary

The existing prose and time-sensitive historical claims were preserved. Only the two clear encoding defects above and image descriptions were corrected. Repeated emphasis markers and standalone `****` lines occur in legacy authored articles; because those can encode intentional emphasis or horizontal rules, they were not mass-rewritten.
