# Testing Rules

Testing expectations for any AI assistant working in this repository.

## Principles
- Only run linters, builds, and tests that already exist in the project. Don't
  introduce a new testing framework unless explicitly asked.
- Before making changes, run the existing test suite to establish a baseline.
- After making changes, run the relevant tests again to confirm nothing regressed.
- New behavior should come with new or updated tests covering the expected
  inputs/outputs, unless the project has no existing test infrastructure to extend.

## Test-driven workflow (preferred for well-specified changes)
1. Write tests based on expected inputs/outputs before writing implementation code.
2. Run the tests and confirm they fail for the right reason (no implementation yet).
3. Implement code until tests pass, iterating without changing the tests to fit
   broken behavior.
4. Re-run the full relevant test suite (not just the new tests) before considering
   the task done.

## Test quality
- Prefer tests that assert observable behavior over tests that assert implementation
  details (internal method calls, private state).
- Keep tests deterministic — avoid reliance on real time, network calls, or random
  values without seeding/mocking.
- Don't delete or weaken existing tests to make a change pass; fix the root cause.

## Commands
- See `.ai/context/project.md` for this project's actual lint/build/test commands
  once they've been filled in. Do not guess commands — verify them by checking
  package manifests (`package.json`, `Makefile`, `pyproject.toml`, etc.) if unlisted.
