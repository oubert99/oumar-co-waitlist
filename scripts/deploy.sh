#!/bin/sh
set -e
export DEVELOPER_DIR=/Library/Developer/CommandLineTools
GIT="${GIT:-/Library/Developer/CommandLineTools/usr/bin/git}"
cd "$(dirname "$0")/.."

$GIT add src/App.jsx src/index.css
if $GIT diff --cached --quiet; then
  echo "Nothing to deploy."
  exit 0
fi

$GIT commit -m "Update waitlist gallery"
$GIT push origin main
echo "Pushed. oumar.co will update in about 40 seconds."
