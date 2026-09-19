---
description: Turn investigation findings into a concrete, ordered implementation plan before writing code. Use when asked to plan a change, design an approach, or break down work before implementing.
when_to_use: Trigger phrases include "plan this out", "how should we implement this", "break this down into steps", "design the approach before coding".
argument-hint: "[investigation summary or task to plan, defaults to most recent investigation in this conversation]"
---

# Plan

Purpose: turn investigation findings into a concrete, ordered implementation plan.
This is a **read-only** phase for production code — the plan document itself may be
written to a scratch/planning location if the tool supports it.

## Steps
1. **Confirm scope** based on the `investigate` skill's findings. If scope is
   still ambiguous (which files are in/out, what edge cases matter, behavioral
   defaults), ask the user before finalizing.
2. **Break the work into ordered steps.** Each step should be small enough to verify
   independently. Note dependencies between steps.
3. **Call out decisions** where more than one valid implementation approach exists,
   and state which one you're choosing and why (or ask the user if it's a
   significant trade-off).
4. **Identify verification steps** for each part of the plan — which tests to run,
   what manual checks (if any) confirm correctness.
5. **Flag risk areas** explicitly: changes to public interfaces, security-sensitive
   code (see `.ai/rules/security.md`), or migrations.
6. **Write the plan** in plain language, as an ordered list of concrete steps with
   enough detail that another engineer (or another AI session) could execute it
   without re-deriving the investigation.

## Output
An implementation plan ready to hand to the `implement` skill. Do not begin
editing production code during this phase.

## Rules to follow
See `.ai/rules/coding.md` and `.ai/rules/architecture.md`.
