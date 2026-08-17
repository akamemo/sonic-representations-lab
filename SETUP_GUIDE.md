# Setup and Repository Guide

This guide describes how to run, validate and commit the current Synesthesia project.

## Requirements

Recommended:

- Node.js with npm;
- Git;
- VS Code or another TypeScript-capable editor;
- a modern desktop browser.

The project is a Vite + React + TypeScript application.

## Clone and Install

```bash
git clone <repository-url>
cd sonic-representations-lab
npm install
```

`node_modules/` is intentionally ignored by Git and should not be copied between operating systems.

## Development Server

```bash
npm run dev
```

Open the local URL printed by Vite.

## Quality Checks

Before every presentation-ready commit:

```bash
npm run lint
npm run build
```

Both commands should complete without errors.

The production build is written to `dist/`, which is ignored by Git.

## Production Preview

After a successful build:

```bash
npm run preview
```

Use this to check the compiled production bundle locally.

## Main npm Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | start Vite development server |
| `npm run lint` | run ESLint over the project |
| `npm run build` | run TypeScript project build, then Vite production build |
| `npm run preview` | preview the production output |

## Audio Notes

The interface accepts:

- WAV
- MP3
- FLAC
- OGG
- M4A

The browser's `decodeAudioData` support remains the final authority. A listed extension may still fail if the current browser cannot decode that specific codec/container.

All audio is processed locally in the browser.

## Recommended Git Workflow

Before starting:

```bash
git status
git pull
```

After a meaningful unit of work:

```bash
npm run lint
npm run build
git status
git diff
git add .
git status
git commit -m "type: concise description"
git push
```

Useful prefixes:

- `feat:` functionality;
- `fix:` bug correction;
- `refactor:` internal restructuring without behavior change;
- `style:` visual/formatting change;
- `docs:` documentation;
- `test:` test code/evidence;
- `chore:` maintenance.

## Stabilization Commit Procedure

For the current MVP checkpoint:

1. Confirm no unintended files are present:

   ```bash
   git status
   ```

2. Review all changes:

   ```bash
   git diff
   ```

3. Confirm dead legacy files are intentionally deleted.
4. Confirm new analysis/DSP/view files are tracked.
5. Run:

   ```bash
   npm run lint
   npm run build
   ```

6. Run the manual release checklist in `TESTING.md`.
7. Stage the intended changes:

   ```bash
   git add .
   ```

8. Review staged content:

   ```bash
   git status
   git diff --cached
   ```

9. Commit, for example:

   ```bash
   git commit -m "feat: complete and stabilize Synesthesia MVP"
   ```

10. Push:

   ```bash
   git push
   ```

Do not commit `node_modules/`, `dist/`, editor caches or temporary ZIP files.

## Recovery

Inspect repository state:

```bash
git status
git log --oneline --decorate -10
```

Unstage without discarding changes:

```bash
git restore --staged path/to/file
```

Discard an uncommitted file change:

```bash
git restore path/to/file
```

Create a safety branch:

```bash
git branch backup-before-change
```

Avoid destructive Git commands unless their consequences are understood.

## GitHub Pages

Deployment is a remaining release task.

Before submission, verify the deployed version in a private/incognito browser window:

- page loads from the public URL;
- static assets load correctly;
- About dialog works;
- audio selection and decoding work;
- Laboratory opens successfully;
- playback works;
- all Microscope views work;
- all three Canvas presets switch;
- no console errors appear.

Record the final deployment URL in `README.md`.

## Repository Presentation Checklist

- [ ] `README.md` reflects the final MVP.
- [ ] `PROJECT.md` matches implemented scope.
- [ ] `ARCHITECTURE.md` matches the real source tree.
- [ ] `DSP_NOTES.md` documents actual algorithms and parameters.
- [ ] `DESIGN_LOG.md` captures the major decisions.
- [ ] `ROADMAP.md` distinguishes completed and deferred work.
- [ ] `TESTING.md` contains final validation evidence.
- [ ] screenshots are current.
- [ ] no secrets or unnecessary large files are tracked.
- [ ] build and lint pass.
