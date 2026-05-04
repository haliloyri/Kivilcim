---
name: push-to-main
description: 'Push current project state to GitHub main by running exactly four git commands in order.'
argument-hint: 'No arguments needed'
user-invocable: true
---

# Push To Main

Use this skill when the user wants to publish the current workspace changes to `origin/main` with a minimal flow.

## Procedure

Run only these four commands, in this exact order:

```powershell
git add .
git commit -m "Proje güncellemeleri ve düzenlemeler"
git remote -v
git push origin main
```

## Rules

- Do not run extra git commands unless the user explicitly asks.
- Stop and report if any command fails.
- If commit reports "nothing to commit", report it and ask whether to continue with push.

## Expected Result

- New commit is created on local `main`.
- `origin/main` is updated successfully.
