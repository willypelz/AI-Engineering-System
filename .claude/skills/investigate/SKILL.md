---
description: Build grounded understanding of an issue or feature request before any plan or code is written. Use when asked to investigate, understand, look into, or diagnose a bug or feature request, before planning or implementing changes.
when_to_use: Trigger phrases include "investigate this issue", "why is this happening", "look into this bug", "understand how X works before we change it".
argument-hint: "[issue description, ticket, or area of the codebase to investigate]"
---

# Investigate

Purpose: build grounded understanding of an issue/feature request before any plan or
code is written. This is a **read-only** phase — no file edits.

## Steps
1. **Restate the problem** in your own words. If the request is ambiguous (unclear
   scope, missing acceptance criteria, multiple valid interpretations), ask the user
   clarifying questions before going further.
2. **Locate relevant code.** Search the repository for the files, modules, and tests
   related to the request. Prefer targeted search (grep/glob/symbol search) over
   reading the whole repo.
3. **Trace the relevant flow.** Follow the code path(s) involved end-to-end — entry
   point, business logic, data access, and any external integrations.
4. **Identify root cause (for bugs)** or **integration points (for features)** —
   don't stop at symptoms; explain *why* the bug happens or *where* the feature needs
   to hook in.
5. **Check existing tests** covering the affected area, and note any gaps.
6. **Summarize findings** in plain language:
   - What the current behavior is
   - Why it happens / what's missing
   - Which files will likely need to change
   - Any risks, edge cases, or unknowns

## Output
A concise investigation summary (not a full implementation plan yet) that the
`plan` skill will consume. Do not start editing files during this phase.

## Rules to follow
See `.ai/rules/coding.md` and `.ai/rules/architecture.md`.
