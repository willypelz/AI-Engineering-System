// Run with: /codebase-review-audit                       (audits this project's
//           default source directories from .ai/context/project.md)
//           /codebase-review-audit src/api src/services   (audit specific paths)
//
// Shape: one agent per target file/module reviews it against this project's own
// .ai/rules/coding.md and .ai/rules/security.md, then independent skeptic agents
// try to REFUTE each finding before it's reported. The refute-by-default framing
// keeps plausible-but-wrong findings out of the result — see .ai/rules/complexity.md
// (Tier 4) for when this workflow is actually worth reaching for (large-scale
// audits/migrations spanning dozens or hundreds of files), vs a single
// `code-reviewer` subagent for an ordinary-sized diff.

export const meta = {
  name: 'codebase-review-audit',
  description: "Audit many files/modules for coding-standard and security-rule violations, with independent skeptics refuting each finding before it's reported",
  phases: [
    { title: 'Scan', detail: 'one agent per file/module finds candidate issues' },
    { title: 'Verify', detail: 'independent skeptics try to refute each candidate issue' },
  ],
}

const DEFAULT_TARGETS = [
  'src',
]

const targets = Array.isArray(args) && args.length ? args : DEFAULT_TARGETS

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['issue', 'file', 'line', 'rule'],
        properties: {
          issue: { type: 'string', description: 'The candidate problem, described concretely' },
          file: { type: 'string', description: 'File path the issue was found in' },
          line: { type: 'integer', description: '1-indexed line the issue appears on' },
          rule: { type: 'string', description: 'Which .ai/rules/*.md rule this would violate' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['confirmed', 'reason'],
  properties: {
    confirmed: { type: 'boolean', description: 'True only if the issue is provably real, not a false positive' },
    reason: { type: 'string', description: 'Why this is (or is not) a real issue' },
    severity: { type: 'string', description: 'blocking | suggestion, only set if confirmed is true' },
    suggestedFix: { type: 'string', description: 'Concrete suggested fix, only set if confirmed is true' },
  },
}

phase('Scan')
log(`Auditing ${targets.length} target(s) against .ai/rules/coding.md and .ai/rules/security.md.`)

const results = await pipeline(
  targets,

  // Stage 1 — one agent per target scans for candidate issues. Kept broad on
  // purpose; the Verify stage is where false positives get filtered out.
  (_, target) => agent(
    `Read the files under ${target} in this repository. Compare them against the ` +
    `rules in .ai/rules/coding.md and .ai/rules/security.md. Report every candidate ` +
    `issue you find — it's fine to over-report here, the next stage will filter ` +
    `false positives. For each, quote the concrete problem, the file, the 1-indexed ` +
    `line, and which rule it would violate.`,
    { label: target, phase: 'Scan', schema: FINDINGS_SCHEMA },
  ),

  // Stage 2 — verify each candidate finding as soon as its target has been
  // scanned. No barrier: target B is still scanning while target A's findings
  // are being checked.
  (scan, target) => parallel(
    (scan?.findings ?? []).map(f => () =>
      agent(
        `Try to REFUTE this candidate code-quality/security issue found in ${target}:\n\n` +
        `File: ${f.file}\nLine: ${f.line}\nRule: ${f.rule}\nIssue: ${f.issue}\n\n` +
        `Read the actual file and surrounding context. Set confirmed:true ONLY if the ` +
        `issue is real and reachable, not a false positive from surrounding context you ` +
        `haven't seen. If you cannot confirm it's real, set confirmed:false — an ` +
        `unconfirmed finding is not a real finding, and a false report costs more than ` +
        `a missed one.`,
        { label: `${f.file}:${f.line}`, phase: 'Verify', schema: VERDICT_SCHEMA },
      ).then(v => ({ target, file: f.file, line: f.line, rule: f.rule, issue: f.issue, ...v })),
    ),
  ),
)

const checked = results.flat().filter(Boolean)
const confirmed = checked.filter(r => r.confirmed)

log(`${checked.length} candidate(s) verified · ${confirmed.length} confirmed real.`)

return {
  targetsAudited: targets.length,
  candidatesChecked: checked.length,
  confirmed: confirmed.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line),
}
