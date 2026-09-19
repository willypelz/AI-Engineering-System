---
description: Critically review an implemented change for correctness, quality, and adherence to project rules, as if reviewing a colleague's pull request. Use when asked to review, critique, or double-check a diff or implementation.
when_to_use: Trigger phrases include "review this change", "does this look right", "critique this diff", "check this before I merge".
argument-hint: "[the diff, PR, or scope to review, defaults to the current change]"
allowed-tools: Read, Glob, Grep
---

# Review

Purpose: critically review the implemented change for correctness, quality, and
adherence to project rules — as if reviewing a colleague's pull request.

## Steps
1. **Diff the change** against the plan — does the implementation actually match
   what was planned? Note any deviations and whether they're justified.
2. **Check correctness**: logic errors, off-by-one mistakes, unhandled edge cases,
   incorrect assumptions about data shape or external behavior.
3. **Check style/quality**: does it match `.ai/rules/coding.md` and the existing
   codebase conventions? Any leftover debug code, dead code, or unnecessary
   complexity?
4. **Check architecture**: does it respect boundaries and patterns per
   `.ai/rules/architecture.md`?
5. **Check test coverage**: are the new/changed behaviors actually tested per
   `.ai/rules/testing.md`?
6. **Report findings** as a prioritized list: blocking issues first (bugs, broken
   contracts), then non-blocking suggestions. Only report high-confidence issues —
   don't nitpick style preferences that aren't codified in the rules.
7. **Do not silently fix issues found during review** — report them, and only fix
   after confirming with the user unless the fix is trivial and unambiguous.

## Output
A concise review report: what's solid, what must be fixed before merge, and what's
optional. Security-sensitive findings should be escalated to the
`security-review` skill rather than resolved inline.

## Rules to follow
See `.ai/rules/coding.md`, `.ai/rules/architecture.md`, and `.ai/rules/testing.md`.
