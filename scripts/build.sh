#!/bin/bash
# Build script wrapper - delegates to pnpm build

set -e

echo "Building application..."
pnpm build

echo "✓ Build succeeded"
