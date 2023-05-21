#!/bin/bash

. ../.env

ES_HOST=${BOATERSLIST_OPENSEARCH_HOST}
ES_HOST=localhost:9200
ES_USER=${BOATERSLIST_OPENSEARCH_USER}
ES_PASSWORD="${BOATERSLIST_OPENSEARCH_PASSWORD}"

set -ux
curl -fsSX PUT "https://${ES_HOST}/_snapshot/fsrepo" -H 'Content-Type: application/json' -u "${ES_USER}:${ES_PASSWORD}" --insecure -d '{
  "type": "fs",
  "settings": {
    "location": "/mnt/snapshots"
  }
}'
curl -fsSX GET "https://${ES_HOST}/_snapshot/fsrepo/_all" -u "${ES_USER}:${ES_PASSWORD}" --insecure
curl -fsSX POST "https://${ES_HOST}/locations/_close" -u "${ES_USER}:${ES_PASSWORD}" --insecure
curl -fsSX POST "https://${ES_HOST}/categories/_close" -u "${ES_USER}:${ES_PASSWORD}" --insecure
curl -fsSX POST "https://${ES_HOST}/subcategories/_close" -u "${ES_USER}:${ES_PASSWORD}" --insecure
curl -fsSX POST "https://${ES_HOST}/.kibana_1/_close" -u "${ES_USER}:${ES_PASSWORD}" --insecure
set -e
curl -fsSX POST "https://${ES_HOST}/_snapshot/fsrepo/1/_restore" -u "${ES_USER}:${ES_PASSWORD}" --insecure
curl -fsSX POST "https://${ES_HOST}/locations/_open" -u "${ES_USER}:${ES_PASSWORD}" --insecure
curl -fsSX POST "https://${ES_HOST}/categories/_open" -u "${ES_USER}:${ES_PASSWORD}" --insecure
curl -fsSX POST "https://${ES_HOST}/subcategories/_open" -u "${ES_USER}:${ES_PASSWORD}" --insecure
curl -fsSX POST "https://${ES_HOST}/.kibana_1/_open" -u "${ES_USER}:${ES_PASSWORD}" --insecure
