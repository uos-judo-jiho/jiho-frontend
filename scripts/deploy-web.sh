#!/bin/bash

set -euo pipefail

ENV_FILE=${ENV_FILE:-/opt/uos-judo/web/.env}
IMAGE=${IMAGE:-ghcr.io/uos-judo-jiho/jiho-frontend:latest}
CONTAINER=${CONTAINER:-uos-judo-web}
PORT=${PORT:-3000}

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

if [ -n "${GHCR_USERNAME:-}" ] && [ -n "${GHCR_TOKEN:-}" ]; then
  docker login ghcr.io -u "$GHCR_USERNAME" -p "$GHCR_TOKEN"
fi

docker pull "$IMAGE"

docker stop "$CONTAINER" || true
docker rm "$CONTAINER" || true

docker run -d --name "$CONTAINER" \
  -p "$PORT:$PORT" \
  --env-file "$ENV_FILE" \
  "$IMAGE"
