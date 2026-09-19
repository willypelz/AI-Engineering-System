---
description: A focused, read-only pass to find high-confidence, exploitable security issues in a change. Use only when explicitly asked for a security review or audit — not for general code review.
when_to_use: Trigger phrases include "security review", "check for vulnerabilities", "audit this for security issues", "is this exploitable".
argument-hint: "[the diff, PR, or scope to review, defaults to the current change]"
allowed-tools: Read, Glob, Grep
---

# Security Review

Purpose: a focused, read-only pass to find high-confidence, exploitable security
issues in the change (or in a specified scope). This is not a general code review —
see the `review` skill for that.

## Steps
1. **Scope the review**: the diff/PR being reviewed, or the specific area the user
   points at. Don't expand scope to the whole repository unless asked.
2. **Check for the non-negotiables in `.ai/rules/security.md`**:
   - Hardcoded secrets/credentials
   - Unsanitized input reaching queries, shell commands, file paths, or rendered
     output (SQL injection, command injection, path traversal, XSS)
   - Broken or bypassed authentication/authorization checks
   - Disabled TLS/certificate validation or weakened CORS
   - Sensitive data logged or exposed in error messages/responses
3. **Check dependency changes** for known-vulnerable or unmaintained packages.
4. **Assess exploitability**, not just theoretical risk — report only issues you're
   confident are real and reachable, with severity and confidence noted.
5. **Do not fix issues inline** during this workflow — report them clearly so the
   user/team can triage and decide remediation.

## Output
A report listing each finding with: location, description, severity, confidence,
and suggested remediation. If nothing high-confidence is found, say so explicitly
rather than inventing minor nitpicks.

## Rules to follow
See `.ai/rules/security.md`.
