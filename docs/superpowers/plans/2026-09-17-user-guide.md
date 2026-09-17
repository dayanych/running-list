# User Guide Implementation Plan

**Goal:** Help new users plan their first week and discover habit tracking

**Approved design:** A public reading page with a weekly planning introduction, first-task instructions, a status legend, next-week planning, a secondary habit-tracking example, and a short reference. Screenshots will be supplied later

**Architecture:** Lazy-load `/guide` under `BaseLayout`, outside `AuthInjector`. Use existing typography, colors, buttons, and status icons. Discover optional screenshots in the guide's asset directory at build time so missing screenshots produce no requests or empty frames

**Constraints:** English copy matching the application; no new dependencies; no authentication or account writes from the guide; preserve existing auth behavior

- [x] Create the guide page and optional screenshot component; document screenshot filenames and capture requirements
- [x] Add the public route and links from the auth layout and authenticated header; keep the header usable on small screens
- [x] Verify direct anonymous access, section links, native reference disclosures, navigation to sign-in, mobile layout, screenshot omission, and screenshot inclusion
- [x] Run lint, build, existing tests, and a focused review of the final diff
