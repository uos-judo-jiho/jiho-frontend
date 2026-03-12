---
name: pr-gen
description: Generate a PR description body based on git diff and log. It saves the result to PR_BODY.md for easy copying. It follows the project's PR template.
---

# PR Body Generator Workflow

This skill analyzes your changes, generates a PR **Title** and **Description**, and saves them to a file.

## 📋 Steps

1. **Analyze Current Branch Status**:
   - Run `git status` and `git diff` to understand the full scope of changes.
   - Run `git log -n 5` to see recent commit messages for context.
2. **Read PR Template**: Read `.github/pull_request_template.md` to ensure the correct structure.
3. **Generate Content (Korean)**:
   - **PR Title**: Generate a concise, professional title in Korean (e.g., `feat(auth): 회원가입 로직 고도화`).
   - **PR Body**: Create a high-quality description in **KOREAN** following the template.
4. **Save to File**:
   - **Mandatory**: Use `write_file` to save the **Title and Body** to **`PR_BODY.md`** in the project root.
   - Format in file:

     ```
     추천 제목: <Generated Title>

     <Generated Body Content>
     ```

5. **Final Output**:
   - Show the generated title and body in a code block.
   - Provide the copy command: `cat PR_BODY.md | pbcopy`.

## 💡 Best Practices

- **Professional Tone**: Use professional Korean terminology.
- **Title Prefix**: Suggest prefixes like `feat`, `fix`, `refactor`, `docs`, etc., based on the changes.
- **Clean Copy**: Saving to a file ensures no terminal line numbers interfere with copying.
