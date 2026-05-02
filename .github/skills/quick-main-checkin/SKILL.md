---
name: quick-main-checkin
description: 'Quickly create a safe check-in commit on the main branch. Use when the user says main brancha commit yap, checkin yap, hızlı commit al, quick commit, or commit this change to main.'
argument-hint: 'Optional: commit message and which files to include'
user-invocable: true
---

# Quick Main Check-in

Use this skill to create a focused commit directly on `main` without accidentally bundling unrelated working tree changes.

## When to Use

- The user asks for a quick commit on `main`
- The user says `main brancha checkin commit yap`
- The user wants a focused checkpoint commit for the current change
- There are unrelated local edits and only a subset should be committed

## Procedure

1. Check the current branch with `git branch --show-current`.
2. If the current branch is not `main`, stop and tell the user the current branch.
3. Inspect the working tree with `git status --short`.
4. Identify only the files relevant to the current task.
5. Never stage unrelated user changes.
6. Stage only the intended files with `git add <paths>`.
7. Create a non-interactive commit with `git commit -m "<message>"`.
8. Report the commit hash, commit message, and included files.

## Safety Rules

- Do not use `git add .` unless the user explicitly wants every tracked and untracked change.
- Do not revert unrelated edits.
- Do not amend an existing commit unless the user explicitly asks.
- If the correct commit scope is ambiguous, ask which files should be included.
- If there is nothing staged after filtering, stop and explain why.

## Commit Message Guidance

- Prefer short conventional messages such as `feat(...)`, `fix(...)`, `refactor(...)`, `docs(...)`.
- If the user gives a message, use it unless it is clearly misleading.
- If no message is provided, derive one from the actual files and behavior changed.

## Output Format

After committing, report:

- Current branch
- Commit hash
- Commit message
- Files included in the commit
- Whether unrelated local changes were intentionally left uncommitted

## Notes

- This skill creates a local commit only.
- If the user also wants the change pushed, handle that as a separate explicit step.