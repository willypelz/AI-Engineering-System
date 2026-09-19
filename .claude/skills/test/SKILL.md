---
description: Verify an implementation using the project's existing test tooling, run the full relevant suite, and add coverage for new behavior. Use when asked to test, verify, or check that a change works.
when_to_use: Trigger phrases include "run the tests", "verify this works", "make sure nothing broke", "add tests for this".
argument-hint: "[scope to test, defaults to the current change]"
---

# Test

Purpose: verify the implementation is correct using the project's existing test
tooling, per `.ai/rules/testing.md`.

## Steps
1. **Identify the project's test commands** (see `.ai/context/project.md`, or
   inspect `package.json`/`Makefile`/`pyproject.toml`/etc. if not documented yet).
2. **Run the full relevant test suite** — not just tests for the new change — to
   catch regressions.
3. **If tests fail:**
   - Determine whether the failure is caused by the new change or is pre-existing.
   - Fix the root cause; don't weaken or delete tests to force a pass.
   - Re-run until green, or until you've confirmed a failure is pre-existing and
     unrelated (flag this to the user rather than silently ignoring it).
4. **If the change lacks test coverage**, add tests covering the new behavior's
   expected inputs/outputs and edge cases, following the TDD workflow in
   `.ai/rules/testing.md` where practical.
5. **Report results concisely**: what passed, what was added, what (if anything)
   remains failing and why.

## Output
Confirmation that the change is verified, or a clear explanation of what's still
broken and why, ready for the `review` skill.

## Rules to follow
See `.ai/rules/testing.md`.
