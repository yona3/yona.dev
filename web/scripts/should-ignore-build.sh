#!/usr/bin/env bash
set -u

paths=(. ':(exclude)vercel.json')

skip_build() {
  echo "No deploy-relevant web changes detected. Skipping Vercel build."
  exit 0
}

continue_build() {
  echo "Deploy-relevant web changes detected. Continuing Vercel build."
  exit 1
}

has_range_changes() {
  local range_ref="$1"

  ! git diff --quiet "$range_ref" -- "${paths[@]}"
}

has_pair_changes() {
  local base_ref="$1"
  local head_ref="$2"

  ! git diff --quiet "$base_ref" "$head_ref" -- "${paths[@]}"
}

if [[ "${VERCEL_ENV:-}" == "preview" && -n "${VERCEL_GIT_PULL_REQUEST_ID:-}" ]]; then
  git fetch --no-tags --depth=100 origin main >/dev/null 2>&1 || true

  if git rev-parse --verify origin/main >/dev/null 2>&1 && git merge-base origin/main HEAD >/dev/null 2>&1; then
    if has_range_changes "origin/main...HEAD"; then
      continue_build
    fi

    skip_build
  fi

  echo "Could not compare preview branch with origin/main. Continuing Vercel build."
  exit 1
fi

if git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  if has_pair_changes "HEAD^" "HEAD"; then
    continue_build
  fi

  skip_build
fi

echo "Could not find a previous commit. Continuing Vercel build."
exit 1
