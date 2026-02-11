#!/bin/bash

set -euo pipefail

DIST_DIR=${DIST_DIR:-apps/admin/dist}
SSH_HOST=${SSH_HOST:-}
SSH_USER=${SSH_USER:-}
SSH_PORT=${SSH_PORT:-22}
SSH_KEY_PATH=${SSH_KEY_PATH:-}
REMOTE_DIR=${REMOTE_DIR:-/opt/uos-jiho-judo/admin}
REMOTE_TMP_DIR=${REMOTE_TMP_DIR:-/tmp/uos-jiho-judo-admin}

if [ ! -d "$DIST_DIR" ]; then
  echo "Missing $DIST_DIR. Run 'pnpm build:admin' first." >&2
  exit 1
fi

if [ -z "$SSH_HOST" ] || [ -z "$SSH_USER" ]; then
  echo "SSH_HOST and SSH_USER must be provided" >&2
  exit 1
fi

if [ -z "$SSH_KEY_PATH" ] || [ ! -f "$SSH_KEY_PATH" ]; then
  echo "SSH_KEY_PATH is missing or invalid" >&2
  exit 1
fi

echo "Uploading admin build to $SSH_USER@$SSH_HOST:$REMOTE_DIR"

RSYNC_SSH_OPTS=(-i "$SSH_KEY_PATH" -p "$SSH_PORT" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null)

rsync -az --delete -e "ssh ${RSYNC_SSH_OPTS[*]}" \
  "$DIST_DIR/" \
  "$SSH_USER@$SSH_HOST:$REMOTE_TMP_DIR/"

ssh "${RSYNC_SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST" <<EOF
set -euo pipefail
sudo mkdir -p "$REMOTE_DIR"
sudo rm -rf "$REMOTE_DIR"/*
sudo cp -R "$REMOTE_TMP_DIR"/. "$REMOTE_DIR"/
sudo rm -rf "$REMOTE_TMP_DIR"
EOF

echo "Admin deployed to $SSH_HOST:$REMOTE_DIR"
