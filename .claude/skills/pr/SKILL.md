---
description: Prepare a pull request for a completed, tested, and reviewed change, including commits and PR description. Use when asked to open a PR, prepare a pull request, or ship a finished change.
when_to_use: Trigger phrases include "open a PR", "prepare a pull request", "ship this", "create the PR description".
argument-hint: "[scope of the change to PR, defaults to the current change]"
---

# PR

Purpose: prepare a pull request for a completed, tested, and reviewed change.

## Steps
1. **Confirm prerequisites**: the change has been implemented (`implement`), tested
   (`test`), and reviewed (`review`), with no outstanding blocking issues.
2. **Check git state**: verify the current branch is appropriate (see
   `.ai/rules/git.md`, and any branch naming convention in
   `.ai/context/project.md`). Don't create a PR from `main`/`master` unless the
   project workflow allows it.
3. **Write commits** if not already committed, following `.ai/rules/git.md` —
   atomic, well-described commits.
4. **Write the PR description**:
   - Summary of what changed and why
   - Key implementation decisions (especially any trade-offs from the `plan`
     skill)
   - Testing performed (link to `test` skill output)
   - Any breaking changes or migrations required, called out explicitly
   - Security-sensitive changes flagged explicitly (see `.ai/rules/security.md`)
5. **Open the PR** using the project's normal tooling (e.g. `gh pr create`) if the
   environment supports it, or produce the description for the user to submit
   manually if it doesn't.

## Output
An open PR (or a ready-to-submit PR description) summarizing a verified, reviewed
change.

## Rules to follow
See `.ai/rules/git.md`.
