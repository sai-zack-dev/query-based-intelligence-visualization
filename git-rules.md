## 🔀 Git Workflow & Branching Rules

This project follows a clean and scalable Git strategy for solo development. It supports efficient feature isolation, bug tracking, and safe production releases.

### 🗂 Branch Structure

| Branch         | Purpose                                                              |
|----------------|----------------------------------------------------------------------|
| `main`         | Production-ready code only. Stable and deployable at all times.      |
| `dev`          | Active development branch. All features are merged here first.       |
| `feature/*`    | New feature branches (e.g., `feature/query-builder`).                |
| `bugfix/*`     | Bug fixes discovered during development.                             |
| `hotfix/*`     | Urgent fixes applied directly to `main` and merged back to `dev`.    |
| `docs/*`       | Documentation-related changes (e.g., `docs/readme-update`).          |

---

### 🔁 Git Workflow (Solo-Friendly)

1. **Start from `dev` branch**:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name

2. **Work and commit**:

   * Commit often with clear, descriptive messages.
   * Use Conventional Commits (see below).

3. **Push to remote**:

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Merge when complete**:

   ```bash
   git checkout dev
   git merge feature/your-feature-name
   git push origin dev
   ```

5. **Release**:

   * Merge `dev` into `main` only when production-ready.
   * Tag releases for version tracking:

     ```bash
     git checkout main
     git merge dev
     git tag -a v0.1.0 -m "Initial MVP release"
     git push origin main --tags
     ```

---

### ✍️ Commit Message Rules (Conventional Commits)

Use the format:

```
<type>(scope): short description
```

#### Types:

* `feat`: New feature
* `fix`: Bug fix
* `refactor`: Code refactor (no behavior change)
* `docs`: Documentation only
* `style`: Code style changes (formatting, spacing, etc.)
* `test`: Adding or fixing tests
* `chore`: Maintenance or tooling

#### Examples:

```bash
feat(query): add AI-assisted SQL query input
fix(auth): correct login redirect issue
refactor(chart): simplify chart rendering logic
docs(readme): add Git workflow instructions
style(button): adjust Tailwind padding
```

---

### 🧼 Best Practices

* Keep feature branches focused (one logical feature per branch).
* Delete branches after merging if no longer needed.
* Write meaningful commit messages.
* Sync `dev` often to avoid large merge conflicts.
* Tag releases with semantic versions (e.g., `v1.0.0`, `v1.1.0-beta`).

---

### 🧭 Example Branch Naming Conventions

| Type    | Example Branch Name        |
| ------- | -------------------------- |
| Feature | `feature/dashboard-layout` |
| Bugfix  | `bugfix/chart-label-crash` |
| Hotfix  | `hotfix/export-button-bug` |
| Docs    | `docs/api-guide`           |

---
