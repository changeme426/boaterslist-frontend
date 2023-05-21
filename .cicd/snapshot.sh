#!/bin/bash

ES_HOST=${BOATERSLIST_OPENSEARCH_HOST}
ES_USER=${BOATERSLIST_OPENSEARCH_USER}
ES_PASSWORD="${BOATERSLIST_OPENSEARCH_PASSWORD}"

set -eux
curl -fsSX PUT "https://${ES_HOST}/_snapshot/fsrepo" -H 'Content-Type: application/json' -u "${ES_USER}:${ES_PASSWORD}" --insecure -d '{
  "type": "fs",
  "settings": {
    "location": "/mnt/snapshots"
  }
}'

curl -fsSX PUT "https://${ES_HOST}/_snapshot/fsrepo/1" -H 'Content-Type: application/json' -u "${ES_USER}:${ES_PASSWORD}" --insecure -d '{
  "indices": "locations,categories,subcategories,.kibana_1",
  "ignore_unavailable": true,
  "include_global_state": false,
  "partial": false
}'
