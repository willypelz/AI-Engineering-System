# CLAUDE.md

This is a thin adapter file. The actual engineering rules for this project live in
`.ai/rules/` and are shared with GitHub Copilot (see
`.github/copilot-instructions.md`). The workflows live as **Agent Skills** in
`.claude/skills/`, a shared, open format (agentskills.io) that Copilot also reads
natively from the same path — no duplication needed.

## Rules (read before making any change)
- `.ai/rules/coding.md` — general coding standards
- `.ai/rules/architecture.md` — structural/design guidelines
- `.ai/rules/security.md` — security requirements
- `.ai/rules/testing.md` — testing expectations
- `.ai/rules/git.md` — version control conventions

## Skills / workflows
Each phase of the engineering workflow is an Agent Skill in `.claude/skills/`,
invocable with `/<name>` or auto-invoked when its description matches the task:
- `.claude/skills/investigate/` — understand a problem before planning/coding
- `.claude/skills/plan/` — turn investigation into an ordered implementation plan
- `.claude/skills/implement/` — execute an approved plan
- `.claude/skills/test/` — verify the implementation
- `.claude/skills/review/` — critical review of the change
- `.claude/skills/security-review/` — focused security-only review
- `.claude/skills/pr/` — prepare a pull request

## Project-specific context
- `.ai/context/project.md` — stack, structure, commands, and conventions specific
  to this project. Read this before assuming any build/test/lint command.

## Linear (issue tracker) integration
If `.mcp.json` is present, this project is connected to Linear via MCP — see
`mcp-servers/linear.md` for setup and usage. When a task references a ticket ID
(e.g. `ENG-123`), read it via the Linear MCP tools before investigating, rather
than asking the user to paste ticket contents.

## How to use this system
1. Read `.ai/rules/complexity.md` first to size the task (Tier 1–4) before
   deciding how much of the system to use.
2. For a small, well-scoped task, it's fine to skip straight to `implement` +
   `test`, but still follow the rules in `.ai/rules/`.
3. For a non-trivial task, follow the skill chain:
   `investigate → plan → implement → test → review → security-review → pr`.
4. If `.ai/context/project.md` is still a blank template, ask the user for the
   missing details (stack, commands, conventions) rather than guessing.

## Complex-tier extensions (this project only, Claude Code-specific)
These files are present because this project opted into the complex tier
(`install.sh --complex`). They do **not** work with GitHub Copilot — Copilot
always stays on the tool-agnostic skill chain above. See
`.ai/rules/complexity.md` for exactly when to reach for each:
- `.claude/agents/` — subagents (`investigator`, `code-reviewer`,
  `security-reviewer`, `test-runner`) for delegating context-heavy phases to
  an isolated context on large/complex changes.
- `.claude/settings.json` — enables experimental Agent Teams
  (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) and registers the token-efficiency
  guard hook.
- `.claude/hooks/token_efficiency_guard.py` — a `PreToolUse` hook that blocks
  (not just suggests) Bash commands likely to flood context (`cat` on large
  files, unscoped `find`, recursive `ls -R`), feeding a better alternative
  back automatically.
- `.claude/workflows/codebase-review-audit.js` — a Dynamic Workflow for
  large-scale, many-file audits against `.ai/rules/coding.md` and
  `.ai/rules/security.md`, with independent skeptic agents refuting each
  finding before it's reported. Run with `/codebase-review-audit`.

If these directories are absent, this project is on the simple tier — use only
`.ai/rules/` and `.claude/skills/`.
