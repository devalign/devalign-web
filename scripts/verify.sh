#!/bin/bash
# Verify script wrapper - comprehensive project validation

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=========================================="
echo "Verification Suite"
echo "=========================================="
echo ""

echo "1. Linting..."
./scripts/lint.sh
echo ""

echo "2. Building..."
./scripts/build.sh
echo ""

echo "3. Testing..."
./scripts/test.sh
echo ""

echo "=========================================="
echo "✓ All verifications passed"
echo "=========================================="
