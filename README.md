# Finance Dashboard UI

A polished fintech-style dashboard built with React, Tailwind CSS, Recharts, and Zustand.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Highlights

- Sidebar navigation for Dashboard, Transactions, and Insights
- Role-based admin and viewer flows
- Interactive balance chart and category breakdown
- Search, sort, filter, edit, delete, and CSV export for transactions
- Insight cards with monthly comparisons and smart observations
- Dark mode and persisted local state

## GitHub ready

Included repo hygiene files:

- `.gitignore` to exclude `node_modules`, `dist`, logs, editor files, and local env files
- `.gitattributes` to normalize line endings
- `.editorconfig` for consistent formatting defaults

Recommended before pushing:

```bash
git init
git add .
git commit -m "Initial finance dashboard"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

If this repo already has a remote, you can skip the `git init` and `git remote add origin` steps.
