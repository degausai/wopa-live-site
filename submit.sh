#!/usr/bin/env bash
set -e

NAME="${1:?usage: ./submit.sh \"Your Name\"}"
ENDPOINT="${WOPA_SUBMIT_URL:-https://wopa-submit-167057116194.europe-west1.run.app}"
PASSWORD="${WORKSHOP_PASSWORD:-}"

if [ -z "$PASSWORD" ]; then echo "set WORKSHOP_PASSWORD (we'll tell you the value on the day)"; exit 1; fi

SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//;s/-$//')
FILE="pages/${SLUG}.html"

if [ ! -f "$FILE" ]; then
  echo "no page at $FILE"
  echo "ask Claude to make one: 'Make me a bio page that fits this site's style. My name is $NAME, my role is X, one thing about me is Y. Save it as $FILE.'"
  exit 1
fi

curl -sS -X POST "$ENDPOINT" \
  -F "name=$NAME" \
  -F "password=$PASSWORD" \
  -F "page=@$FILE"
echo
