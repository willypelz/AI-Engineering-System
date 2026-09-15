# Git Rules

Version control conventions for any AI assistant working in this repository.

## General
- Never rewrite git history (no force-push, no `rebase` on shared/pushed branches)
  unless the user explicitly asks for it.
- Don't commit unless asked to, or unless the workflow you're following (e.g.
  `.ai/workflows/implement.md`) explicitly includes a commit step.
- Keep commits atomic and scoped to one logical change. Don't bundle unrelated
  changes into a single commit.
- Write clear, descriptive commit messages: a short summary line, then a body
  explaining the "why" if the change isn't self-evident.

## Branches
- Don't create or switch branches unless the task requires it or the user asks.
- If a naming convention for branches exists in `.ai/context/project.md`, follow it.

## Pull requests
- Follow `.ai/workflows/pr.md` when preparing a PR.
- PR descriptions should summarize what changed and why, call out any breaking
  changes, and note testing performed.
- Flag any change touching auth, permissions, or security-sensitive code explicitly
  in the PR description (see `.ai/rules/security.md`).

## Co-authorship
- When committing AI-assisted changes, include appropriate co-author attribution if
  the tool/user's workflow requires it (see tool-specific adapter files for exact
  trailer format).
