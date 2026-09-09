# Architecture Rules

Guidelines for structural and design decisions when an AI assistant proposes or
implements changes to this codebase.

## Principles
- Favor the simplest architecture that satisfies current requirements. Don't design
  for hypothetical future scale unless explicitly requested.
- Keep concerns separated: business logic, data access, and presentation/interface
  layers should not be tangled together.
- New modules/files should live alongside existing modules of the same kind — mirror
  the current folder structure rather than inventing a new one.
- Avoid introducing a new architectural pattern (e.g., new state management library,
  new ORM, new service layer style) without first checking whether the codebase
  already has an established pattern for this.

## When planning a non-trivial change
1. Identify all files/modules the change will touch.
2. Identify integration points (APIs, databases, external services) that could break.
3. Note any migrations (data, config, or API contract) required.
4. Flag any change that alters a public interface/contract — these need explicit
   callout in the implementation plan.

## Boundaries
- Don't cross architectural boundaries defined by the project (e.g., don't call the
  database directly from a UI component if the project enforces a service layer).
- Keep configuration and secrets out of source code — read from environment/config
  per the project's existing convention.

## Documentation
- If an architectural decision changes how the system is structured, capture the
  reasoning in `.ai/context/project.md` so future sessions have that context.
