#!/bin/bash

echo "🔧 Loading environment variables..."

# Prefer .env.local, fallback to .env
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
    echo "✓ Loaded .env.local"
elif [ -f ".env" ]; then
    set -a
    source .env
    set +a
    echo "✓ Loaded .env"
else
    echo "❌ No .env.local or .env file found. Cannot load CODACY_API_TOKEN."
    exit 1
fi

# Ensure token exists
if [ -z "$CODACY_API_TOKEN" ]; then
    echo "❌ CODACY_API_TOKEN is missing. Add it to .env.local or .env"
    exit 1
fi

echo "🔍 Running Codacy analysis (eslint + semgrep)..."
codacy-cli analyze --tool eslint --tool semgrep --format json --output results.json

if [ $? -ne 0 ]; then
    echo "❌ Analysis failed."
    exit 1
fi

echo "☁️ Uploading results to Codacy..."
codacy-cli upload \
  --api-token "$CODACY_API_TOKEN" \
  --owner Maxamed-Maxamed \
  --provider gh \
  --repository DogWalker_App \
  --commit-uuid "$(git rev-parse HEAD)" \
  --sarif-path results.json


if [ $? -ne 0 ]; then
    echo "❌ Upload failed."
    exit 1
fi

echo "✅ Analysis and upload completed successfully!"
