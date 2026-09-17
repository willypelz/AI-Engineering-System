# Complexity Rules — Sizing a Task

This system is designed to scale dynamically: light-touch for simple work, full
multi-agent tooling for complex work. Use this file to decide which tier a task
needs before starting.

## Tier 1 — Simple
**Signals:** single file or a couple of closely related files; well-understood
change; no ambiguity in scope; low blast radius (nothing public-facing, no
security-sensitive code, no data migration).

**What to use:** `.claude/skills/implement/` + `.claude/skills/test/` directly.
Skip `investigate`/`plan`/`review` unless something surprises you mid-implementation.
Works identically in Claude Code and GitHub Copilot.

## Tier 2 — Moderate
**Signals:** multi-file feature or fix within one module/service; root cause or
approach isn't obvious yet; still no cross-cutting or security-sensitive concerns.

**What to use:** the full skill chain — `investigate` → `plan` → `implement` →
`test` → `review`. Still fully tool-agnostic (`.claude/skills/`).

## Tier 3 — Complex
**Signals:** cross-cutting change touching multiple modules/services; unclear or
disputed root cause; public interface/contract changes; anything touching auth,
secrets, or permissions; large diff that would flood a single context window.

**What unlocks (Claude Code only — see `.claude/agents/`, `.claude/settings.json`):**
- Delegate the noisy, read-heavy phases to **subagents** instead of doing them in
  the main session:
  - `investigator` for large-scope search/tracing (`investigate` phase)
  - `code-reviewer` for large diffs (`review` phase)
  - `security-reviewer` for security-sensitive changes (`security-review` phase)
  - `test-runner` for suites with heavy/verbose output (`test` phase)
- Use **Agent Teams** (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, set in
  `.claude/settings.json`) when the task genuinely needs multiple perspectives
  actively cross-checking each other — e.g. several competing hypotheses for a
  hard bug, or a full-stack feature needing frontend/backend/QA perspectives in
  the same loop. Don't reach for this on single-file or single-perspective work;
  start with 3–5 teammates, each owning a distinct, non-overlapping slice of
  files.
- Full chain still applies: `investigate` → `plan` → `implement` → `test` →
  `review` → `security-review` → `pr`, just with subagents/teammates handling
  the sub-parts that would otherwise flood context.

## Tier 4 — Large-scale
**Signals:** codebase-wide migration, audit, or refactor spanning dozens/hundreds
of files; the same check or transformation needs to run independently many times
and then be cross-verified.

**What unlocks:** a **Dynamic Workflow** (`.claude/workflows/*.js`) — a script
that orchestrates many agents in parallel with a convergence/refutation step,
so results are cross-checked before being reported, and your own context stays
clean throughout. See `.claude/workflows/codebase-review-audit.js` for a working
example built on this project's own `.ai/rules/`.

## Rule of thumb
Don't reach for Tier 3/4 tooling by default — it adds real overhead (separate
context windows, experimental features, background script runs). Start at the
lowest tier that plausibly fits, and escalate only when you hit a concrete
limitation (context flooding, need for adversarial cross-checking, or a scale
that a single session genuinely can't hold).

## GitHub Copilot note
Tiers 3–4's extra tooling (subagents, Agent Teams, Dynamic Workflows) are Claude
Code-specific surfaces. Under Copilot, stay within Tier 1–2's tool-agnostic
`.claude/skills/` chain regardless of task complexity.
