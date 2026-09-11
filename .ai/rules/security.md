# Security Rules

Security expectations for any AI assistant making changes in this repository.

## Non-negotiables
- Never commit secrets, API keys, tokens, or credentials to source code or config
  files. Use environment variables or the project's existing secrets mechanism.
- Never log sensitive data (passwords, tokens, PII, payment details) even at debug
  level.
- Always validate and sanitize external input (user input, API responses, file
  uploads) before using it in queries, commands, file paths, or rendered output.
- Use parameterized queries / ORM methods for database access — never build SQL via
  string concatenation with untrusted input.
- Escape output rendered into HTML to prevent XSS; never disable a framework's
  built-in escaping without a documented, reviewed reason.
- Don't disable TLS/certificate verification, CORS protections, or authentication
  checks to "make something work" — fix the underlying issue instead.

## Dependency hygiene
- Don't add dependencies with known critical vulnerabilities or that are unmaintained,
  when a maintained alternative exists.
- Pin dependency versions consistent with the project's existing lockfile convention.

## When reviewing/implementing auth or permissions
- Default to least privilege. New endpoints/functions should require the same or
  stricter access control as comparable existing ones, never looser.
- Any change touching authentication, authorization, or session handling should be
  flagged for explicit human review — call this out in PR descriptions.

## Reporting
- If you discover an existing vulnerability while working on an unrelated task, flag
  it explicitly to the user rather than silently fixing or ignoring it, unless it's
  tightly coupled to the current change.
