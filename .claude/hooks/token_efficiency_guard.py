#!/usr/bin/env python3
"""
PreToolUse hook: token-efficiency guard.

Blocks Bash commands that are likely to flood context with far more output
than needed, and tells Claude what to use instead — a real enforcement
mechanism, unlike a rules file the model can simply choose not to follow.

Registered in .claude/settings.json under hooks.PreToolUse. Exit codes:
  0 = allow the tool call to proceed
  2 = block; stderr is fed back to Claude as guidance for a better approach

Design choices:
- stdlib only (json, os, sys) — no extra dependency (e.g. uv) required beyond
  a plain python3 interpreter, to keep this system's complex tier portable.
- Never blocks on its own errors: any exception while parsing/inspecting the
  payload falls through to exit 0, so a bug in this script can't accidentally
  freeze the session.
- Only targets the Bash tool; other tools pass through untouched.
"""
import json
import os
import sys

# Matches the "large file" threshold used elsewhere in this system's guidance
# (.ai/rules/coding.md notes files are truncated for viewing beyond ~20KB).
LARGE_FILE_BYTES = 50_000


def warn(message: str) -> None:
    print(message, file=sys.stderr)
    sys.exit(2)


def check_bash(command: str) -> None:
    stripped = command.strip()
    if not stripped:
        return

    # `cat <file>` on a large file dumps the whole thing into context, where
    # a targeted read (head/grep/view with a line range) would do.
    if stripped.startswith("cat ") and "|" not in stripped:
        rest = stripped[len("cat "):].strip()
        target = rest.split()[0] if rest else ""
        if target and os.path.isfile(target):
            size = os.path.getsize(target)
            if size > LARGE_FILE_BYTES:
                warn(
                    f"'{target}' is {size // 1000}KB — cat'ing the whole file will "
                    f"flood context with mostly-irrelevant content. Use `head`, "
                    f"`grep`, or a targeted line range instead."
                )

    # `find` without -maxdepth (and without a narrow starting path) can return
    # far more paths than the task needs.
    if stripped.startswith("find ") and "-maxdepth" not in stripped:
        warn(
            "This `find` has no -maxdepth and may return far more paths than "
            "needed. Add -maxdepth, scope the search path more narrowly, or use "
            "the glob tool instead."
        )

    # Recursive ls floods context on large trees; glob is the targeted option.
    lowered = stripped.lower()
    if lowered.startswith("ls ") and ("-r" in lowered.split("ls ", 1)[1].split()):
        warn(
            "Recursive `ls -R` can return an enormous listing. Use the glob "
            "tool, or scope to a specific subdirectory instead."
        )


def main() -> None:
    try:
        payload = json.load(sys.stdin)
        tool_name = payload.get("tool_name", "")
        tool_input = payload.get("tool_input", {}) or {}

        if tool_name == "Bash":
            command = tool_input.get("command", "")
            if command:
                check_bash(command)
    except SystemExit:
        raise
    except Exception:
        # Never block the session on a bug in this hook itself.
        sys.exit(0)

    sys.exit(0)


if __name__ == "__main__":
    main()
