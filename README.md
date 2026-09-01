# AI Engineering System

A tool-agnostic AI engineering system that works with both **Claude Code** and
**GitHub Copilot**, and scales dynamically — light-touch for simple tasks, full
multi-agent tooling for complex ones.

All the real engineering knowledge lives in `.ai/`. Claude Code and Copilot each
get a thin adapter file that points into it, so nothing has to be maintained
twice.

## How it's organized

```
ai-engineering-system/
├── install.sh                        # copies this scaffold into another project
├── CLAUDE.md                         # Claude Code adapter
├── .github/
│   └── copilot-instructions.md       # GitHub Copilot adapter
├── .ai/
│   ├── rules/                        # engineering standards, always in effect
│   │   ├── coding.md
│   │   ├── architecture.md
│   │   ├── security.md
│   │   ├── testing.md
│   │   ├── git.md
│   │   └── complexity.md             # how to size a task, simple vs complex
│   └── context/
│       └── project.md                # per-project facts you fill in
└── .claude/
    ├── skills/                       # simple tier — shared by Claude Code + Copilot
    │   ├── investigate/SKILL.md
    │   ├── plan/SKILL.md
    │   ├── implement/SKILL.md
    │   ├── test/SKILL.md
    │   ├── review/SKILL.md
    │   ├── security-review/SKILL.md
    │   └── pr/SKILL.md
    ├── agents/                       # complex tier — Claude Code only
    │   ├── investigator.md
    │   ├── code-reviewer.md
    │   ├── security-reviewer.md
    │   └── test-runner.md
    ├── settings.json                 # complex tier — enables Agent Teams
    └── workflows/                    # complex tier — Dynamic Workflow example
        └── codebase-review-audit.js
├── .mcp.json                          # Linear MCP registration for Claude Code
├── .vscode/
│   └── mcp.json                       # Linear MCP registration for GitHub Copilot
└── mcp-servers/
    └── linear.md                      # setup + usage docs for the Linear integration
```

## Installing into a project

From this repo:

```bash
./install.sh /path/to/your/project              # simple tier only
./install.sh /path/to/your/project --complex     # simple + complex tier
./install.sh /path/to/your/project --force       # overwrite existing files
```

Existing files in the target are skipped by default; add `--force` to
overwrite them. Flags can be combined in any order.

**After installing:**
1. Fill in `.ai/context/project.md` with the new project's stack, folder
   structure, and actual lint/build/test commands. This is the one file
   meant to be edited per-project — everything else stays generic.
2. Skim `CLAUDE.md` and `.github/copilot-instructions.md` and adjust wording
   only if the project needs a real override.
3. Commit the new files to version control.

You can re-run `install.sh --complex --force` later on a project that started
on the simple tier, to add the complex-tier files without touching anything
else.

## The simple tier (default, works with both tools)

This is everything under `.ai/rules/`, `.ai/context/`, and `.claude/skills/`.
Both Claude Code and GitHub Copilot read it natively:
- Claude Code reads `CLAUDE.md` every session, which points at `.ai/rules/`
  and lists the skills.
- GitHub Copilot reads `.github/copilot-instructions.md`, and also reads
  `.claude/skills/*/SKILL.md` directly — Copilot supports the same open
  [Agent Skills](https://agentskills.io) standard Claude Code uses, so one
  set of skill files works for both tools with no duplication.

### The 7 skills

Each is a phase of the engineering workflow. In Claude Code, invoke them with
`/name` (or let Claude auto-invoke one when your request matches its
description). In Copilot, just describe the task in natural language —
Copilot matches it to the right skill automatically; you can also say "follow
the `review` skill" explicitly if it doesn't.

| Skill | When to use it |
|---|---|
| `investigate` | Understand a bug/feature before planning or coding. Read-only. |
| `plan` | Turn investigation findings into an ordered implementation plan. |
| `implement` | Execute an approved plan as working code changes. |
| `test` | Run the project's test suite, add coverage for new behavior. |
| `review` | Critically review a change for correctness and quality. |
| `security-review` | Focused, read-only pass for exploitable security issues. |
| `pr` | Prepare commits and a pull request for a finished, reviewed change. |

**Typical chain for a non-trivial task:**
```
investigate → plan → implement → test → review → security-review → pr
```
**Typical shortcut for a small, well-scoped task:**
```
implement → test
```

### The 5 rules (always in effect, regardless of tier)

| Rule file | Covers |
|---|---|
| `coding.md` | General coding standards — precision, style, comments, error handling |
| `architecture.md` | Structural boundaries, planning non-trivial changes |
| `security.md` | Non-negotiables: secrets, input sanitization, auth, dependency hygiene |
| `testing.md` | Test-driven workflow, coverage expectations, test quality |
| `git.md` | Commit hygiene, branches, PR conventions, co-authorship |

## Deciding simple vs complex — `.ai/rules/complexity.md`

Read this file first when starting a task. It defines 4 tiers:

| Tier | Signals | What to use |
|---|---|---|
| **1 — Simple** | One or two files, well-understood, low blast radius | `implement` + `test` directly |
| **2 — Moderate** | Multi-file, approach unclear, still no security/cross-cutting concerns | Full skill chain (`investigate` → `review`) |
| **3 — Complex** | Cross-cutting, disputed root cause, auth/secrets/permissions, large diff | Skill chain + subagents / Agent Teams (needs `--complex` install) |
| **4 — Large-scale** | Codebase-wide migration/audit across dozens–hundreds of files | Skill chain + a Dynamic Workflow (needs `--complex` install) |

**Rule of thumb:** start at the lowest tier that plausibly fits. Escalate only
when you hit a real limitation — context flooding, need for adversarial
cross-checking, or a scale a single session can't hold.

## The complex tier (`--complex` install, Claude Code only)

None of this works with GitHub Copilot — Copilot always stays on the skill
chain above, regardless of task complexity.

### Subagents (`.claude/agents/`)

Isolated-context specialists the main Claude Code session can delegate to, so
large/noisy work doesn't flood your main conversation. Each subagent runs in
its own context window and reports back only a distilled summary.

| Agent | Delegate to it for |
|---|---|
| `investigator` | Broad, read-only searches/tracing on large or unclear scopes |
| `code-reviewer` | Reviewing a large or multi-file diff |
| `security-reviewer` | Security audit of auth/secrets/input-handling changes |
| `test-runner` | Running a large/verbose test suite, reporting only pass/fail summary |

**How to use them.** No setup needed — just ask Claude directly, by name or by
describing the task:

```
Use the investigator agent to find every place this function is called
and trace how the data flows through it.

Use the code-reviewer agent to review the diff in src/payments/ — it's
too large to review in this conversation.

Use the security-reviewer agent to audit the auth changes we just made.

Use the test-runner agent to run the full suite and just tell me what failed.
```

Claude also delegates automatically when a task's description matches an
agent's `description` frontmatter — you don't have to name the agent every
time. You can spawn several at once too:

```
Spawn the investigator agent to check the frontend and the code-reviewer
agent to check the backend, in parallel, then summarize both.
```

`implement`, `plan`, and `pr` are deliberately **not** subagents — they need
synthesis and decisions that shouldn't happen in an isolated context away
from you.

### Agent Teams (`.claude/settings.json`)

Experimental multi-agent coordination — a lead session supervises several
**teammates** that can talk to each other and self-claim tasks from a shared
list. Already enabled for any project installed with `--complex` (the env
flag in `.claude/settings.json` turns it on automatically; no extra setup).

**When to reach for it.** Only when a task genuinely needs multiple
perspectives actively cross-checking each other — not for single-file or
single-perspective work, where plain subagents are cheaper and simpler.

**How to use it.** Describe the roles and, critically, tell them to interact —
that's what separates Agent Teams from subagents:

```
Spawn 3 agent teammates: one to investigate the frontend, one the backend
API, one the database layer. Have them report findings back so we can
figure out why login is failing intermittently.
```

The pattern that really justifies the overhead — teammates actively trying to
disprove each other, so a wrong theory doesn't anchor the investigation:

```
Spawn 5 agent teammates to investigate different hypotheses for why the
app disconnects after one message. Have them talk to each other and try
to disprove each other's theories, like a scientific debate. Update the
findings doc with whatever consensus emerges.
```

You can also staff a team using the subagent definitions you already have:

```
Spawn a teammate using the security-reviewer agent type to audit the auth
module, and another using the code-reviewer agent type to review the rest
of the diff.
```

**Monitoring.** Teammates appear in the agent panel below your prompt:
`↑`/`↓` to select one, `Enter` to open its transcript and message it
directly, `Esc` to interrupt, `Ctrl+T` for the shared task list.

**Rules of thumb:**
- Start with 3–5 teammates, ~5–6 tasks each — don't scale up before the work needs it.
- Give each teammate a distinct, non-overlapping slice of files — teammates
  don't get automatic worktree isolation, so two editing the same file is a
  straight overwrite.
- Put task specifics in the spawn prompt — teammates don't inherit your
  conversation history.
- To disable Agent Teams entirely, delete `.claude/settings.json` or remove
  the `env` block inside it.

### Token-efficiency guard hook (`.claude/hooks/token_efficiency_guard.py`)

Unlike everything else in this system, this is **enforced by code, not by
instruction** — a `PreToolUse` hook, registered in `.claude/settings.json`,
that runs automatically before every Bash tool call and can actually block
one, rather than just asking Claude nicely to be efficient.

It blocks (with a message fed back to Claude so it retries a better way):
- `cat` on a file over ~50KB — floods context; use `head`/`grep`/a line range instead
- `find` without `-maxdepth` — can return far more paths than needed
- `ls -R` — recursive listing on large trees; use the glob tool instead

It never blocks on its own errors (a bug in the hook always falls through to
allowing the call), and only inspects the `Bash` tool — everything else
passes through untouched. To disable it, remove the `hooks` block from
`.claude/settings.json` or delete the script.

**Why this one is a hook and not a rules file.** A markdown rule like "avoid
`cat`-ing large files" is guidance the model can simply forget to follow. A
hook is a script that runs on every matching tool call regardless — it's the
difference between a house rule and a lock on the door.

### Dynamic Workflow (`.claude/workflows/codebase-review-audit.js`)

A script-orchestrated audit for large-scale work — the script (not Claude's
turn-by-turn judgment) holds the plan, so it can coordinate far more agents
than a conversation could. One agent scans each target file/module against
`.ai/rules/coding.md` and `.ai/rules/security.md`, then independent skeptic
agents try to **refute** each finding before it's reported — keeping false
positives out of the result.

**How to use it.** Run it directly as a slash command:

```
/codebase-review-audit                       # audits ./src by default
/codebase-review-audit src/api src/services  # audit specific paths only
```

Claude will show the run's approval prompt, then you can track progress with
`/workflows` (phases, agent counts, live token spend). Start on one directory
before running it against the whole repo — cost scales with target count.

**When to reach for it vs. a subagent.** Use `code-reviewer` for an ordinary
diff. Reach for this workflow only at genuine scale — dozens to hundreds of
files, where you want every finding independently cross-checked before it's
reported to you.

**Writing your own.** Copy the pattern in `codebase-review-audit.js`: `agent()`
for a single AI call with a JSON schema for structured output, `pipeline()` to
chain stages per target without a hard barrier between them, `parallel()` to
fan out many calls at once, and `phase()`/`log()` for progress reporting.

## Linear integration (`mcp-servers/linear.md`)

Connects both Claude Code and GitHub Copilot to your Linear workspace via
Linear's official remote MCP server, so ticket data flows in and out of the
skill chain instead of being copy-pasted into chat.

**What's installed.** `.mcp.json` (Claude Code) and `.vscode/mcp.json`
(VS Code/Copilot) both point at `https://mcp.linear.app/mcp`. Neither file
contains a secret — Linear's hosted server uses interactive OAuth, so it's
safe to commit them and let each teammate authenticate with their own account.

**First-time setup (once per person):**
- Claude Code: open a session in the project, run `/mcp`, approve the
  `linear` server, complete the OAuth login in your browser.
- VS Code/Copilot: Command Palette → **MCP: List Servers** → **Linear** →
  **Start Server** → complete the OAuth login.

**How to use it.**
```
investigate ENG-123                     # pulls the ticket before reading code
Turn this planning doc into a Linear project with issues and milestones: ...
Summarize today's standup notes as comments on the matching Linear issues: ...
Move ENG-123 to Done and link this PR in a comment.
```
None of the skills call Linear automatically — you ask for it explicitly by
mentioning a ticket ID or Linear action, and the MCP connection makes that
request possible.

**Read-only mode.** Swap the URL in either config file to
`https://mcp.linear.app/mcp/readonly` if you want a project to only ever read
tickets, never write to them.

Full setup details, troubleshooting, and more example prompts are in
[`mcp-servers/linear.md`](mcp-servers/linear.md).

## Quick reference

```bash
# Install into a new project
./install.sh /path/to/project              # simple tier
./install.sh /path/to/project --complex    # simple + complex tier

# In Claude Code, inside the installed project
/investigate ...
/plan
/implement
/test
/review
/security-review
/pr
/codebase-review-audit        # complex tier only

# Delegating to subagents / Agent Teams (complex tier only, plain language)
"use the investigator agent to trace how X flows through the codebase"
"use the code-reviewer agent to review the diff in src/payments/"
"spawn 3 agent teammates to investigate the frontend, backend, and db layer"

# In GitHub Copilot Chat, inside the installed project
"investigate why this endpoint returns 500s"
"plan the implementation for X"
"implement the plan"
"review this diff"
```
