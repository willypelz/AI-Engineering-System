# Coding Rules

These rules apply to any AI assistant (Claude Code, GitHub Copilot, or other) working in
this repository. They are the default engineering standard unless a project-specific
override exists in `.ai/context/project.md`.

## General principles
- Make precise, surgical changes that fully address the task. Don't touch unrelated code.
- Prefer the smallest correct change over a large rewrite, unless the task explicitly
  calls for a refactor.
- Match the existing style, naming, and structure of the surrounding code before
  introducing new patterns.
- Don't add new dependencies, frameworks, or tools unless necessary for the task —
  prefer what's already used in the project.
- Remove dead code you introduce during iteration; don't leave commented-out blocks.
- Only comment code that needs clarification (non-obvious logic, tricky edge cases,
  "why" not "what"). Don't narrate obvious code with comments.

## Before making changes
- Read enough of the surrounding code/tests to understand conventions before writing.
- Check for existing utilities, helpers, or patterns that already solve part of the
  problem instead of reinventing them.

## After making changes
- Re-read the diff for correctness, unused variables, and leftover debug statements.
- Run the project's existing lint/build/test commands (see `.ai/context/project.md`)
  to confirm nothing broke.
- Update documentation only when it is directly tied to the change being made.

## Error handling
- Handle errors explicitly; don't swallow exceptions silently.
- Fail loudly in development, gracefully in production paths — follow whatever
  convention the codebase already uses.

## Language/framework specifics
- Defer to `.ai/context/project.md` for the project's language, framework, and
  package manager conventions. This file intentionally stays language-agnostic.
