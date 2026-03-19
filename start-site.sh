#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-8000}"
URL="http://127.0.0.1:${PORT}/index.html"

cd "$ROOT_DIR"

if command -v lsof >/dev/null 2>&1 && lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} is already in use."
  echo "Open ${URL} in your browser."
  exit 0
fi

echo "Starting local server at ${URL}"

if command -v open >/dev/null 2>&1; then
  (sleep 1 && open "$URL") &
fi

python3 -m http.server "$PORT"
