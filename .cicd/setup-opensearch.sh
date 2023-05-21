#!/bin/sh

set -eu
host=https://$1
url=$host/_cluster/health
tfile=$(mktemp)

# wait for opensearch to be up (print error after 30 seconds then after each minute - retry forever)
echo "Waiting for opensearch..."
count=30
set +e
while true; do
  curl -fsSo "$tfile" "$url" --insecure --user admin:admin > /dev/null
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

set -ex

curl -fsSX PUT "$host/locations/_doc/99999" -H 'Content-Type: application/json' -u "admin:admin" --insecure -d '{
  "subCategories": [1,2,3,4,5]
}'
exit 0



curl -sSX DELETE "$host/companies" -u 'admin:admin' --insecure >/dev/null
curl -sSX DELETE "$host/locations" -u 'admin:admin' --insecure >/dev/null
curl -fsSX PUT "$host/companies" -H 'Content-Type: application/json' -u 'admin:admin' --insecure -d '{
  "mappings": {
    "properties": {
      "coordinate": {
        "type": "geo_point"
      }
    }
  }
}'
curl -fsSX PUT "$host/locations" -H 'Content-Type: application/json' -u 'admin:admin' --insecure -d '{
  "mappings": {
    "properties": {
      "coordinate": {
        "type": "geo_point"
      },
      "subCategories": {
        "type": "integer"
      }
    }
  }
}'
echo "Opensearch setup done"
