#!/bin/bash
set -a
source .env
set +a

echo "🔍 Running Codacy analysis..."
codacy-cli analyze --format json --output results.json

echo "☁️ Uploading results to Codacy..."
codacy-cli upload --api-token "$CODACY_API_TOKEN" \
  --organization Maxamed-Maxamed \
  --repository DogWalker_App \
  --commit $(git rev-parse HEAD) \
  --results results.json

echo "✅ Analysis and upload completed!"
