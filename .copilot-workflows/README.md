# Copilot Workflows

This folder contains command files (`.md`) and rule files (`.mdc`) that define project workflows and constraints for AI-assisted development (GitHub Copilot / Cursor agents).

## Purpose 🎯
- Keep small, focused human- and machine-readable workflows for common developer actions (TDD, refactor, rename, run tests).
- Allow Copilot Chat or other agents to follow team conventions by referencing these files.
- Validate the manifest mapping with `npm run validate:workflows` to ensure commands and rules remain consistent.

## Where files live
- `.copilot-workflows/commands/*.md`  — human-friendly command descriptions you can reference in prompts.
- `.copilot-workflows/rules/*.mdc`    — machine- and human-readable rules/constraints that the agent should enforce.
- `.copilot-workflows/manifest.json` — mapping between commands and rules (and optional `allowDifferentBasename` flag).

---

## How to use these files from GitHub Copilot / Copilot Chat ✅
Use an explicit prompt that references the command and the rule file(s) you want the agent to follow. Examples:

### 1) Create a new feature using strict TDD
Prompt:

```
Follow `.copilot-workflows/commands/tdd.md` and `.copilot-workflows/rules/tdd.mdc`.
Create the first failing test for `calculateTotal` (empty list case) in `src/core/calculateTotal.test.ts`, then implement the minimum production code to make that test compile and fail (RED step only). Explain the next steps.
```

Why: `tdd.md` describes the workflow and the rule `tdd.mdc` enforces the TPP (Transformation Priority Premise).

### 2) Suggest a rename following coding standards
Prompt:

```
Follow `.copilot-workflows/commands/rename.md` and `.copilot-workflows/rules/coding-standards.mdc`.
Propose a new name for `calcPrice` and update references across the repo. Run the test suite to ensure nothing breaks.
```

### 3) Run tests and report issues
Prompt:

```
Follow `.copilot-workflows/commands/tests.md` and `.copilot-workflows/rules/testing.mdc`.
Run the test suite and fix failing tests by changing implementation only (do not modify tests). List changes made and tests that failed/passed.
```

### 4) Keep prompts specific
- Always include the files to follow and the target file(s) to modify. Example: “Follow `tdd.md` and `tdd.mdc`. Edit `src/core/foo.ts` and add `src/tests/foo.test.ts`.”

---

## Prompt templates for all command-rule pairs 🧩
Use these short templates in your Copilot Chat prompts — replace `FEATURE`/`FILE`/`NAME` with context.

- tdd.md ↔ tdd.mdc (strict TDD):

```
Follow `.copilot-workflows/commands/tdd.md` and `.copilot-workflows/rules/tdd.mdc`.
Create the first failing test for `FEATURE` in `FILE.test.ts` (RED step), then implement the minimal production code to make it compile (RED only). List the next two steps (GREEN then REFACTOR) and reasons.
```

- tests.md ↔ testing.mdc (run tests & standards):

```
Follow `.copilot-workflows/commands/tests.md` and `.copilot-workflows/rules/testing.mdc`.
Run the full test suite. If failures appear, fix the implementation (not tests) in `FILE` and report which tests failed and how you fixed them.
```

- refactor.md ↔ coding-standards.mdc (refactor):

```
Follow `.copilot-workflows/commands/refactor.md` and `.copilot-workflows/rules/coding-standards.mdc`.
Apply a focused refactor to `FILE` improving names or extracting a function. Run tests and explain why the change respects the coding standards.
```

- rename.md ↔ coding-standards.mdc (rename):

```
Follow `.copilot-workflows/commands/rename.md` and `.copilot-workflows/rules/coding-standards.mdc`.
Propose a new name for `OLD_NAME` that follows standards and update all references. Run tests and show a short changelist.
```

- tpp.md ↔ tdd.mdc (TPP guidance):

```
Follow `.copilot-workflows/commands/tpp.md` and `.copilot-workflows/rules/tdd.mdc`.
You are jumping too big. Provide a sequence of smaller transformations (TPP) from simplest to next-to-simplest for `FILE` to satisfy failing tests; apply the first transformation only and run tests.
```

---

## Validation and CI ✅
- Locally: run `npm run validate:workflows` to verify that `manifest.json` pairs exist and that command-rule names are consistent (unless `allowDifferentBasename` is set for a pair).
- CI: a GitHub Action (`.github/workflows/validate-workflows.yml`) runs the validator on PRs that touch `.copilot-workflows/**`.

---

## Tips & FAQ 💡
- Q: How do I allow intentional mismatches (like `tpp.md` ↔ `tdd.mdc`)?
  - A: Add the flag `{ "command": "tpp.md", "rule": "tdd.mdc", "allowDifferentBasename": true }` in `manifest.json`.
- Q: Can Copilot Chat auto-load these files? 
  - A: Copilot Chat doesn’t automatically load repository files as rules, but explicitly referencing them in prompts (as shown above) instructs the assistant how to behave. Cursor-like agents may support more direct rule-loading via integrations.
- Q: Should I enforce this with CI?
  - A: Yes — we added a workflow to validate the manifest on PRs. Consider also adding tests that assert the agent's suggested changes follow rules (manual/automated review).

### Example: how you (or your team) will use it in practice
- Open Copilot Chat and paste the one-liner:
Follow `.copilot-workflows/AGENT_BOOTSTRAP.md` and the TDD command tdd.md. Create the first failing test for FEATURE...

- Or use the VS Code snippet that inserts the line automatically as the first line of the chat prompt so you don’t need to type it.

## How to use it (concrete steps) 🔧
- Insert bootstrap in Copilot Chat (recommended):
  - Use the VS Code snippet: type copilot-bootstrap and expand, or run:
    - npm run copy:agent-bootstrap (then paste in Copilot Chat), or
    - npm run show:agent-bootstrap (prints to stdout for quick copy)
  - Example first-line to paste in Chat:
    Follow AGENT_BOOTSTRAP.md and then: Create the first failing test for FEATURE...
- PR process:
  - If you used AI, check the PR template box and paste the bootstrap line in the PR description.

## Why this helps
- Short, high-priority rules are more likely to be honored by Copilot/agents when they appear first in prompts.
- Autogenerating the bootstrap from alwaysApply: true rules keeps the summary authoritative and up-to-date.
- The snippet and clipboard helper remove friction for developers.