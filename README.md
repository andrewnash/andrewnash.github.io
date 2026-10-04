# andrewnash.github.io

Resume-first personal site for Andrew Nash. SvelteKit 2 + mdsvex, prerendered to static HTML and served by GitHub Pages.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # type check
npm run build    # static site in build/
npm run preview  # serve build/ locally
```

## Where things live

- `src/lib/resume.ts`: all homepage content (roles, bullets, projects, publications, education). It mirrors `main.tex` in [AndrewNashCV](https://github.com/andrewnash/AndrewNashCV); update both together.
- `src/routes/<slug>/+page.md`: write-ups. Frontmatter (`title`, `created`, `image`, `tags`) feeds the Writing list and the ⌘K menu. Images for a post go in `static/<slug>/` and are referenced as `./image.png`.
- `static/Andrew_Nash_Resume.pdf`: copied in automatically by the `sync-resume-to-site` workflow in AndrewNashCV whenever `main.pdf` changes on its main branch.
- `static/sw.js`: removes the service worker the old Urara site installed, so returning visitors don't see cached pages.

## Deploy

Every push to `main` runs `.github/workflows/gh-pages.yml`: type check, build, then publish `build/` to the `gh-pages` branch.
