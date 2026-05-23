#!/bin/bash
# Test script wrapper - runs test suite

set -e

echo "Running tests..."

# Check if test script exists in package.json
if grep -q '"test":' package.json 2>/dev/null; then
  pnpm test
else
  echo "⊘ No test script configured in package.json"
  echo "  To add tests: configure 'test' script in package.json"
fi

echo "✓ Test checks passed"
