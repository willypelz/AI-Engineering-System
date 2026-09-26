# GitHub Copilot Instructions

This is a thin adapter file. The actual engineering rules for this project live in
`.ai/rules/` and are shared with Claude Code (see `CLAUDE.md`). The workflows live
as **Agent Skills** in `.claude/skills/` — Copilot reads project skills natively
from `.claude/skills`, `.github/skills`, or `.agents/skills`, so no duplication is
needed between tools.

## Rules (read before making any change)
- `.ai/rules/coding.md` — general coding standards
- `.ai/rules/architecture.md` — structural/design guidelines
- `.ai/rules/security.md` — security requirements
- `.ai/rules/testing.md` — testing expectations
- `.ai/rules/git.md` — version control conventions

## Skills / workflows
Each phase of the engineering workflow is an Agent Skill in `.claude/skills/`.
Reach for the matching one when a task fits its description:
- `.claude/skills/investigate/` — understand a problem before planning/coding
- `.claude/skills/plan/` — turn investigation into an ordered implementation plan
- `.claude/skills/implement/` — execute an approved plan
- `.claude/skills/test/` — verify the implementation
- `.claude/skills/review/` — critical review of a change
- `.claude/skills/security-review/` — focused security-only review
- `.claude/skills/pr/` — prepare a pull request

## Project-specific context
- `.ai/context/project.md` — stack, structure, commands, and conventions specific
  to this project. Read this before assuming any build/test/lint command.

## Linear (issue tracker) integration
If `.vscode/mcp.json` is present, this project is connected to Linear via MCP —
see `mcp-servers/linear.md` for setup and usage. When a task references a
ticket ID (e.g. `ENG-123`), read it via the Linear MCP tools before starting,
rather than asking the user to paste ticket contents.

## How to use this system
1. For any non-trivial task, mentally follow the skill chain:
   investigate → plan → implement → test → review → security-review → pr.
2. For a small, well-scoped task (e.g. "implement this function"), it's fine to
   go straight to `.claude/skills/implement/` + `.claude/skills/test/`, but still
   follow the rules in `.ai/rules/`.
3. If `.ai/context/project.md` is still a blank template, ask for the missing
   details (stack, commands, conventions) rather than guessing.
