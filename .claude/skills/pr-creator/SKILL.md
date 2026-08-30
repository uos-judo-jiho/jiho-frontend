---
name: pr-creator
description: Create a Pull Request (PR) by analyzing git diffs. Use when the user wants to submit their changes to a base branch (default: main). It follows the project's PR template.
---

# PR Creator Workflow

Submit high-quality Pull Requests with AI-generated titles and descriptions.

## 📋 Steps

1. **Identify Base Branch**: Ask the user for the target branch (e.g., `main`, `develop`). If not specified, default to `main`.
2. **Analyze Changes**:
   - Run `git status` to see modified files.
   - Run `git diff <base_branch>..HEAD` to understand the full scope of changes.
   - Run `git log <base_branch>..HEAD --oneline` to see commit history.
3. **Read PR Template**: Read `.github/pull_request_template.md` to ensure the generated description follows the project's standard.
4. **Draft PR Content (Korean)**:
   - **Title**: Create a concise, descriptive title (e.g., `feat: 로그인 유효성 검사 구현`).
   - **Body**: Fill in the template sections in **KOREAN** based on the code analysis. **Always use Korean for the content.**
5. **Present & Confirm**: Show the draft title and body to the user. Ask for confirmation or any specific edits.
6. **Submit Draft PR**:
   - If confirmed, run: `gh pr create --draft --base <base_branch> --title "<title>" --body "<body>"`.
   - **Always include the `--draft` flag.**
   - Provide the PR URL to the user.

## 💡 Best Practices

- **Language**: **Always write the PR title and body in KOREAN.**
- **Draft Mode**: **Always submit PRs as DRAFTS** to allow for final review on GitHub.
- **Reference Issues**: If a commit message mentions an issue (e.g., `#123`), include it in the PR description.
- **Verify Cleanliness**: Ensure there are no pending unstaged changes before submitting.
