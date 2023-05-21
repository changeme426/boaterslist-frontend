#!/bin/sh

# we want a clean docker stop
trap 'exit 0' TERM

set -u
ES_HOST=${BOATERSLIST_OPENSEARCH_HOST}
ES_USER=${BOATERSLIST_OPENSEARCH_USER}
ES_PASSWORD=${BOATERSLIST_OPENSEARCH_PASSWORD}

url="https://${ES_HOST}/_cluster/health"
tfile=$(mktemp)

# wait for opensearch to be up (print error after 30 seconds then after each minute - retry forever)
echo "Waiting for opensearch..."
count=30
while true; do
  curl -fso "$tfile" "$url" --insecure --user "${ES_USER}:${ES_PASSWORD}" > /dev/null
  grep -E '"status":"(yellow|green)"' "$tfile" > /dev/null
  if [ $? -eq 0 ]; then
    break
  fi
  sleep 1
  count=$((count - 1))
  if [ "$count" -eq 0 ]; then
    count=60
    curl -fsSo "$tfile" "$url" --insecure --user admin:admin
    cat "$tfile"
    grep -E '"status":"(yellow|green)"' "$tfile" > /dev/null
    if [ $? -eq 0 ]; then
      break
    fi
  fi
done
echo "Opensearch ready"
