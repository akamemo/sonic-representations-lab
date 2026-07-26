# GitHub Repository Setup Guide

This guide assumes Windows, VS Code, Git, and a GitHub account.

## Part 1 — Create the Repository on GitHub

1. Sign in to GitHub.
2. Click the **+** button in the top-right corner.
3. Select **New repository**.
4. Use a temporary or final repository name, for example:
   `sonic-representations-lab`
5. Add a description:
   `Interactive analytical and artistic representations of sound for ACTAM.`
6. Set visibility to **Public**, unless the course requires otherwise.
7. Do **not** initialize with a README if you intend to upload this scaffold.
8. Click **Create repository**.
9. Keep the GitHub page open because it shows the repository URL.

## Part 2 — Place This Scaffold on Your Computer

1. Download and extract the repository scaffold.
2. Move the extracted folder to a stable location, for example:
   `Documents/University/ACTAM/sonic-representations-lab`
3. Open VS Code.
4. Select **File → Open Folder**.
5. Open the scaffold folder.

## Part 3 — Initialize Git

Open the VS Code terminal with **Terminal → New Terminal**.

Run:

```bash
git init
git branch -M main
git add .
git commit -m "docs: initialize project repository"
```

## Part 4 — Connect the Local Repository to GitHub

Copy the repository URL shown by GitHub. It will look similar to:

```text
https://github.com/YOUR-USERNAME/sonic-representations-lab.git
```

Then run:

```bash
git remote add origin https://github.com/YOUR-USERNAME/sonic-representations-lab.git
git push -u origin main
```

Refresh GitHub and verify the files are visible.

## Part 5 — Daily Git Workflow

Before starting work:

```bash
git pull
```

After completing one meaningful unit of work:

```bash
git status
git add .
git commit -m "type: concise description"
git push
```

Useful commit prefixes:

- `docs:` documentation changes
- `feat:` new functionality
- `fix:` bug correction
- `refactor:` internal restructuring
- `test:` tests or test data
- `style:` visual or formatting changes
- `chore:` configuration and maintenance

Examples:

```bash
git commit -m "feat: add audio file decoding"
git commit -m "feat: display waveform"
git commit -m "docs: explain spectral centroid mapping"
git commit -m "fix: reset playback when replacing track"
```

Avoid vague commits such as:

```text
update
changes
work
final
```

## Part 6 — Branching Strategy

For a two-week individual project, keep branching simple.

Use `main` for stable, working code.

For a risky feature:

```bash
git switch -c feature/spectrogram
```

After the feature works:

```bash
git switch main
git merge feature/spectrogram
git branch -d feature/spectrogram
git push
```

Do not create a branch for every tiny edit.

## Part 7 — Documentation Routine

At the end of each work session:

1. Update `ROADMAP.md`.
2. Add important decisions to `DESIGN_LOG.md`.
3. Update `DSP_NOTES.md` when algorithms or parameters change.
4. Save useful screenshots in `docs/screenshots/`.
5. Commit the documentation together with the related code.

## Part 8 — Working with Roo Code Safely

Before asking Roo Code to implement a feature:

1. Make sure the repository has no uncommitted work.
2. Give Roo Code one bounded task.
3. Ask it to explain changed files.
4. Review the diff in VS Code.
5. Run and test the application.
6. Commit only after the feature works.

Good request:

```text
Implement audio file selection and decoding only.
Use TypeScript.
Do not add visualization yet.
Handle unsupported files and expose duration, sample rate, and channel count.
Summarize every changed file.
```

Risky request:

```text
Build the entire application.
```

## Part 9 — GitHub Pages

GitHub Pages deployment should be configured after the Vite application exists.

The final workflow will likely use GitHub Actions. Record the deployed URL in `README.md`.

Before submission, verify:

- the URL works in a private browser window;
- assets load correctly;
- audio upload works;
- no API keys or private files are committed.

## Part 10 — Recovery Commands

See the current state:

```bash
git status
git log --oneline --decorate -10
```

Discard an uncommitted change in one file:

```bash
git restore path/to/file
```

Unstage a file without deleting changes:

```bash
git restore --staged path/to/file
```

Create a backup branch before a major change:

```bash
git branch backup-before-refactor
```

Do not use destructive commands copied from the internet unless you understand them.

## Repository Quality Checklist

- [ ] Clear README
- [ ] Public live demo link
- [ ] Project motivation
- [ ] Installation instructions
- [ ] MVP and exclusions
- [ ] Architecture diagram
- [ ] DSP explanations
- [ ] Design-decision history
- [ ] Testing evidence
- [ ] Screenshots
- [ ] Known limitations
- [ ] Meaningful commit history
- [ ] No secrets or large unnecessary files
