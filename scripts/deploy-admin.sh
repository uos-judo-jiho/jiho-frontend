#!/bin/bash

set -euo pipefail

DIST_DIR=${DIST_DIR:-apps/admin/dist}
S3_BUCKET=${S3_BUCKET:-}
S3_PREFIX=${S3_PREFIX:-}
CLOUDFRONT_DISTRIBUTION_ID=${CLOUDFRONT_DISTRIBUTION_ID:-}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-}

if [ -z "$S3_BUCKET" ]; then
  echo "Missing S3_BUCKET" >&2
  exit 1
fi

if [ ! -d "$DIST_DIR" ]; then
  echo "Missing $DIST_DIR. Run 'pnpm build:admin' first." >&2
  exit 1
fi

DESTINATION="s3://$S3_BUCKET"
if [ -n "$S3_PREFIX" ]; then
  DESTINATION="$DESTINATION/$S3_PREFIX"
fi

AWS_ENDPOINT_ARGS=()
if [ -n "$AWS_ENDPOINT_URL" ]; then
  AWS_ENDPOINT_ARGS+=(--endpoint-url "$AWS_ENDPOINT_URL")
fi

# Upload hashed assets with long cache, then upload index.html with no-cache.
aws s3 sync "$DIST_DIR" "$DESTINATION" "${AWS_ENDPOINT_ARGS[@]}" \
  --delete \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp "$DIST_DIR/index.html" "$DESTINATION/index.html" "${AWS_ENDPOINT_ARGS[@]}" \
  --cache-control "no-cache"

if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" >/dev/null
fi

echo "Admin deployed to $DESTINATION"
