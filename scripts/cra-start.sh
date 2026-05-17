#!/usr/bin/env sh
# Clears preload env before Node starts; prefer real Windows Node when running under Git Bash.
export NODE_OPTIONS=
unset NODE_OPTIONS 2>/dev/null || true
unset NODE_PATH 2>/dev/null || true
cd "$(dirname "$0")/.." || exit 1

if [ -x "/c/Program Files/nodejs/node.exe" ]; then
  exec "/c/Program Files/nodejs/node.exe" scripts/run-react-scripts.cjs "$@"
fi
if [ -x "/c/Program Files (x86)/nodejs/node.exe" ]; then
  exec "/c/Program Files (x86)/nodejs/node.exe" scripts/run-react-scripts.cjs "$@"
fi

exec node scripts/run-react-scripts.cjs "$@"
