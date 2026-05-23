#!/bin/bash
# Lint script wrapper - delegates to pnpm lint

set -e

echo "Running linter..."
pnpm lint

echo "✓ Lint checks passed"
