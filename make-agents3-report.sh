#!/usr/bin/env bash
set -euo pipefail

OUT="agents3_audit_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUT"

{
  echo "# Repo audit"
  echo "- Generated (UTC): $(date -u +"%Y-%m-%d %H:%M:%S")"
  echo "- PWD: $(pwd)"
  echo "- OS: $(uname -a 2>/dev/null || true)"
} > "$OUT/meta.md"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "- Branch: $(git rev-parse --abbrev-ref HEAD)" >> "$OUT/meta.md"
  echo "- HEAD: $(git rev-parse HEAD)" >> "$OUT/meta.md"
  {
    echo ""
    echo "## Remotes"
    git remote -v || true
  } >> "$OUT/meta.md"

  git status -sb > "$OUT/git_status.txt" || true
  git log --oneline --decorate -n 80 > "$OUT/git_log_last80.txt" || true
  git ls-files --others --exclude-standard > "$OUT/untracked_files.txt" || true

  BASE=""
  for f in AGENTS2.md AGENTS.md; do
    if git ls-tree -r --name-only HEAD | grep -qx "$f"; then
      BASE="$(git rev-list -n 1 HEAD -- "$f" || true)"
      if [ -n "${BASE:-}" ]; then
        echo "$f baseline commit: $BASE" > "$OUT/baseline.txt"
        break
      fi
    fi
  done

  if [ -n "${BASE:-}" ]; then
    git log --oneline "$BASE"..HEAD > "$OUT/changes_since_baseline_commits.txt" || true
    git diff --name-status "$BASE"..HEAD > "$OUT/changes_since_baseline_files.txt" || true
    git diff "$BASE"..HEAD > "$OUT/changes_since_baseline.patch" || true
  else
    echo "No AGENTS*.md baseline found in git history." > "$OUT/baseline.txt"
  fi

  git diff > "$OUT/uncommitted_working_tree.diff" || true
  git diff --cached > "$OUT/staged.diff" || true

  find . -type f \
    -not -path '*/.git/*' \
    -not -path '*/node_modules/*' \
    -not -path '*/.next/*' \
    -not -path '*/dist/*' \
    -not -path '*/build/*' \
    -not -path '*/.vercel/*' \
    -not -path '*/.turbo/*' \
    -not -path '*/.cache/*' \
    -printf '%TY-%Tm-%Td %TH:%TM:%TS %p\n' 2>/dev/null \
    | sort -r | head -n 250 > "$OUT/recently_modified_files_top250.txt" || true

  find . -maxdepth 5 -type f \( \
      -name "vercel.json" -o -name ".vercelignore" \
      -o -name "netlify.toml" -o -name "firebase.json" \
      -o -name "Dockerfile" -o -name "docker-compose*.yml" \
      -o -name "*.tf" -o -name "*.tfvars" \
      -o -name "nginx.conf" \
    \) -not -path '*/node_modules/*' -not -path '*/.git/*' \
    2>/dev/null | sort > "$OUT/infra_and_ci_files.txt" || true

  find . -name ".github" -type d | head -5 >> "$OUT/infra_and_ci_files.txt" || true
fi

REPORT="$OUT/AGENTS3_REPORT.md"
{
  echo "# AGENTS3 Audit Report"
  echo ""
  echo "## Meta"
  cat "$OUT/meta.md" 2>/dev/null || true
  echo ""
  echo "## Git status"
  echo '```'
  cat "$OUT/git_status.txt" 2>/dev/null || echo "(none)"
  echo '```'
  echo ""
  echo "## Baseline"
  echo '```'
  cat "$OUT/baseline.txt" 2>/dev/null || echo "(none)"
  echo '```'
  echo ""
  echo "## Commits since baseline"
  echo '```'
  cat "$OUT/changes_since_baseline_commits.txt" 2>/dev/null || echo "(none)"
  echo '```'
  echo ""
  echo "## Files changed since baseline"
  echo '```'
  cat "$OUT/changes_since_baseline_files.txt" 2>/dev/null || echo "(none)"
  echo '```'
  echo ""
  echo "## Untracked files"
  echo '```'
  cat "$OUT/untracked_files.txt" 2>/dev/null || echo "(none)"
  echo '```'
  echo ""
  echo "## Recently modified files (top 250)"
  echo '```'
  cat "$OUT/recently_modified_files_top250.txt" 2>/dev/null || echo "(none)"
  echo '```'
  echo ""
  echo "## Infra / CI / deploy files"
  echo '```'
  cat "$OUT/infra_and_ci_files.txt" 2>/dev/null || echo "(none)"
  echo '```'
  echo ""
  echo "---"
  echo "## IMPORTANT: Redact any secrets before pasting this file."
} > "$REPORT"

echo ""
echo "✓ Done. Paste this file:"
echo "  $REPORT"
