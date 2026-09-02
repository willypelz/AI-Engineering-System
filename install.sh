#!/usr/bin/env bash
#
# install.sh — copy this AI engineering system scaffold into a target project.
#
# Usage:
#   ./install.sh /path/to/target/project
#   ./install.sh ../my-other-project --force
#   ./install.sh ../my-other-project --complex
#   ./install.sh ../my-other-project --complex --force
#
# Simple tier (always copied) — tool-agnostic, works with Claude Code and
# GitHub Copilot:
#   .ai/                          shared rules and context
#   CLAUDE.md                     Claude Code adapter
#   .github/copilot-instructions.md   GitHub Copilot adapter
#   .claude/skills/*/SKILL.md     shared Agent Skills (read natively by both
#                                 Claude Code and GitHub Copilot)
#
# Complex tier (only with --complex) — Claude Code-specific, does not work
# with GitHub Copilot. See .ai/rules/complexity.md for when to use it:
#   .claude/agents/*.md           subagents for isolated-context work
#   .claude/settings.json         enables experimental Agent Teams
#   .claude/workflows/*.js        Dynamic Workflow example
#
# MCP integration (always copied, opt-in to use) — connects Claude Code and
# GitHub Copilot to Linear. No secrets are stored; auth is interactive OAuth.
# See mcp-servers/linear.md for setup:
#   .mcp.json                    Claude Code MCP server registration
#   .vscode/mcp.json              VS Code / GitHub Copilot MCP server registration
#   mcp-servers/linear.md         setup + usage docs
#
# By default, existing files in the target are NOT overwritten. Pass --force to
# overwrite them. Flags can be given in any order.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  echo "Usage: $0 <target-project-dir> [--force] [--complex]"
  exit 1
}

if [[ $# -lt 1 ]]; then
  usage
fi

TARGET_DIR="$1"
shift

FORCE=false
COMPLEX=false
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=true ;;
    --complex) COMPLEX=true ;;
    *)
      echo "Error: unknown flag '$arg'" >&2
      usage
      ;;
  esac
done

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Error: target directory '$TARGET_DIR' does not exist." >&2
  exit 1
fi

TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

echo "Installing AI engineering system into: $TARGET_DIR"

copy_path() {
  local rel_path="$1"
  local src="$SCRIPT_DIR/$rel_path"
  local dest="$TARGET_DIR/$rel_path"

  if [[ ! -e "$src" ]]; then
    echo "  skip (missing in source): $rel_path"
    return
  fi

  mkdir -p "$(dirname "$dest")"

  if [[ -e "$dest" && "$FORCE" != "true" ]]; then
    echo "  skip (already exists, use --force to overwrite): $rel_path"
    return
  fi

  if [[ -d "$src" ]]; then
    mkdir -p "$dest"
    cp -R "$src/." "$dest/"
  else
    cp "$src" "$dest"
  fi
  echo "  installed: $rel_path"
}

copy_path ".ai"
copy_path "CLAUDE.md"
copy_path ".github/copilot-instructions.md"
copy_path ".claude/skills"
copy_path ".mcp.json"
copy_path ".vscode/mcp.json"
copy_path "mcp-servers"

if [[ "$COMPLEX" == "true" ]]; then
  echo ""
  echo "Installing complex tier (Claude Code-specific, not Copilot-compatible):"
  copy_path ".claude/agents"
  copy_path ".claude/settings.json"
  copy_path ".claude/workflows"
  copy_path ".claude/hooks"
fi

echo ""
echo "Done. Next steps:"
echo "  1. Fill in $TARGET_DIR/.ai/context/project.md with this project's stack,"
echo "     commands, and conventions."
echo "  2. Review CLAUDE.md and .github/copilot-instructions.md — adjust wording"
echo "     if this project needs project-specific overrides."
echo "  3. Read .ai/rules/complexity.md to decide which tier fits each task."
echo "  4. If this project uses Linear, see mcp-servers/linear.md to connect it"
echo "     (run /mcp in Claude Code, or MCP: List Servers in VS Code)."
echo "  5. Commit the new files to version control."
