# Linear MCP integration

This connects Claude Code and GitHub Copilot directly to your Linear workspace
via Linear's official remote MCP server, so `/investigate`, `/plan`, and `/pr`
can read and update real tickets instead of you copy-pasting them into chat.

No API key or secret is stored in this repo — Linear's hosted MCP server uses
an interactive OAuth flow, so the committed config files (`.mcp.json`,
`.vscode/mcp.json`) are safe to commit as-is. Each teammate authenticates with
their own Linear account the first time they use it.

## What's already set up

- **`.mcp.json`** (project root) — read by Claude Code. Registers the `linear`
  server at `https://mcp.linear.app/mcp` (read-write).
- **`.vscode/mcp.json`** — read by VS Code / GitHub Copilot. Same server, same
  URL, different config schema (`servers` key instead of `mcpServers`).

Both give **read-write** access by default (create/update issues and
comments). If you want a project to be read-only, change the URL in either
file to `https://mcp.linear.app/mcp/readonly`.

## First-time setup (per person, not per project)

### Claude Code
1. Open a Claude Code session in this project.
2. Run `/mcp` — Claude Code will detect the project-scoped `linear` server
   from `.mcp.json` and prompt you to approve it (first run only).
3. Approve, then complete the Linear OAuth login in your browser.
4. Confirm it worked: `claude mcp get linear` should show `✔ Connected`.

If you'd rather not use the committed `.mcp.json`, you can register it
yourself instead:
```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
```

### GitHub Copilot (VS Code)
1. Open this project in VS Code with the `.vscode/mcp.json` file present.
2. Open the Command Palette → **MCP: List Servers** → select **Linear** →
   **Start Server**.
3. Complete the Linear OAuth login when prompted.

## How it fits into the skill chain

- **`/investigate ENG-123`** — pulls the ticket description, comments, and
  linked issues from Linear before reading the codebase, so the investigation
  is grounded in what was actually asked for.
- **`/plan`** — can reference the ticket's acceptance criteria directly
  instead of you retyping them.
- **`/pr`** — can post a comment back to the Linear ticket linking the PR, or
  move the ticket to "In Review" once the PR is open, if you ask for it.

None of the skills call Linear automatically — you ask for it explicitly,
e.g. "investigate ENG-123" or "update the Linear ticket with a summary of
this fix." The MCP connection just makes those requests possible; it doesn't
change skill behavior on its own.

## Example prompts

- "Read Linear ticket ENG-123 and investigate the bug it describes."
- "Turn this planning doc into a Linear project with issues and milestones:
  [paste doc]."
- "Summarize today's standup notes and post them as comments on the matching
  Linear issues: [paste notes]."
- "Once this PR is merged, move ENG-123 to Done and add a comment linking the
  PR."

## Other clients

Linear's MCP server works with any MCP-compatible client using the same
Streamable HTTP endpoint. For clients other than Claude Code and VS Code
(Cursor, Windsurf, Zed, etc.), see
[linear.app/docs/mcp](https://linear.app/docs/mcp) for exact config syntax —
the endpoint (`https://mcp.linear.app/mcp`) and OAuth flow are the same
everywhere, only the config file shape differs.
