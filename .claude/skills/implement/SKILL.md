---
description: Execute an approved implementation plan as precise, working code changes. Use when asked to implement, build, write the code for, or execute a plan that has already been agreed on.
when_to_use: Trigger phrases include "implement this plan", "go ahead and build it", "write the code for step N", "execute the plan".
argument-hint: "[the plan or task to implement, defaults to the most recent plan in this conversation]"
---

# Implement

Purpose: execute an approved plan (from the `plan` skill) as precise, working
code changes.

## Steps
1. **Re-read the plan** before starting. If the codebase has changed since the plan
   was written, re-verify assumptions.
2. **Work through steps in order**, respecting declared dependencies. Don't skip
   ahead to a later step if it depends on an earlier one being correct.
3. **Make surgical changes** — follow `.ai/rules/coding.md`. Don't refactor
   unrelated code while implementing a specific step.
4. **Verify incrementally.** After each meaningful step, run relevant
   lint/build/tests (per `.ai/rules/testing.md`) rather than waiting until the very
   end to discover a break.
5. **Handle surprises.** If the implementation reveals the plan was wrong or
   incomplete, stop and reconcile: either adjust the remaining plan steps
   transparently, or flag the discrepancy to the user if it changes scope.
6. **Don't commit automatically** unless the workflow or user explicitly asks for a
   commit — see `.ai/rules/git.md`.

## Output
Working code changes that satisfy the plan, ready for the `test` and `review`
skills.

## Rules to follow
See `.ai/rules/coding.md`, `.ai/rules/architecture.md`, and `.ai/rules/security.md`.
