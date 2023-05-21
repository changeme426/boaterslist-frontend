#!/bin/sh

set -eu
RIVER_TOML=$1
ES_HOST=$(sed -n 's/^es_addr = "\(.*\)"/\1/p' "${RIVER_TOML}")
ES_USER=$(sed -n 's/^es_user = "\(.*\)"/\1/p' "${RIVER_TOML}")
ES_PASSWORD=$(sed -n 's/^es_pass = "\(.*\)"/\1/p' "${RIVER_TOML}")

curl -sSX DELETE "https://${ES_HOST}/categories" -u "${ES_USER}:${ES_PASSWORD}" --insecure >/dev/null
curl -sSX DELETE "https://${ES_HOST}/subcategories" -u "${ES_USER}:${ES_PASSWORD}" --insecure >/dev/null
curl -sSX DELETE "https://${ES_HOST}/locations" -u "${ES_USER}:${ES_PASSWORD}" --insecure >/dev/null
curl -sSX DELETE "https://${ES_HOST}/useraction" -u "${ES_USER}:${ES_PASSWORD}" --insecure >/dev/null

curl -fsSX PUT "https://${ES_HOST}/categories" -H 'Content-Type: application/json' -u "${ES_USER}:${ES_PASSWORD}" --insecure -d '{
  "mappings": {
    "properties": {
      "active": { "type": "boolean" },
      "categoryId": { "type": "integer" },
      "categoryName": { "type": "keyword" },
      "categoryNumber": { "type": "integer" }
    }
  }
}'
curl -fsSX PUT "https://${ES_HOST}/subcategories" -H 'Content-Type: application/json' -u "${ES_USER}:${ES_PASSWORD}" --insecure -d '{
  "mappings": {
    "properties": {
      "active": { "type": "boolean" },
      "subCategoryId": { "type": "integer" },
      "subCategoryName": { "type": "keyword" },
      "subCategoryNumber": { "type": "integer" }
    }
  }
}'
curl -fsSX PUT "https://${ES_HOST}/locations" -H 'Content-Type: application/json' -u "${ES_USER}:${ES_PASSWORD}" --insecure -d '{
  "mappings": {
    "properties": {
      "active": {
        "type": "boolean"
      },
      "boatSize": {
        "type": "keyword"
      },
      "categories": {
        "type": "integer"
      },
      "coordinate": {
        "type": "geo_point",
        "store": true
      },
      "contactPhone": {
        "type": "keyword"
      },
      "createdByEmail": {
        "type": "keyword"
      },
      "createdByUserId": {
        "type": "integer"
      },
      "electricShorePower": {
        "type": "text"
      },
      "fuel": {
        "type": "text"
      },
      "gold": {
        "type": "boolean"
      },
      "isPrivate": {
        "type": "boolean"
      },
      "listed": {
        "type": "boolean"
      },
      "locationId": {
        "type": "keyword"
      },
      "membershipNeeded": {
        "type": "boolean"
      },
      "operatingDaysHoursJSON": {
        "type": "object",
        "properties": {
          "dayFrom": { "type": "keyword" },
          "timeFrom": { "type": "keyword" },
          "dayTo": { "type": "keyword" },
          "timeTo": { "type": "keyword" }
        }
      },
      "ownerAuthEmail": {
        "type": "keyword"
      },
      "parentLocationId": {
        "type": "keyword"
      },
      "peopleServiceMaxCount": {
        "type": "integer"
      },
      "platinum": {
        "type": "boolean"
      },
      "premiere": {
        "type": "boolean"
      },
      "priceRangeHigh": {
        "type": "double"
      },
      "priceRangeLow": {
        "type": "double"
      },
      "priceRangeString": {
        "type": "keyword"
      },
      "privacyMembershipString": {
        "type": "text"
      },
      "promotedSubCategories": {
        "type": "integer"
      },
      "promotedKeywords": {
        "type": "keyword"
      },
      "slips": {
        "type": "text"
      },
      "sponsoredBy": {
        "type": "keyword"
      },
      "subCategories": {
        "type": "integer"
      },
      "verified": {
        "type": "boolean"
      },
      "verifiedByEmail": {
        "type": "keyword"
      },
      "verifiedByUserId": {
        "type": "integer"
      }
    }
  }
}'

curl -fsSX PUT "https://${ES_HOST}/useraction" -H 'Content-Type: application/json' -u "${ES_USER}:${ES_PASSWORD}" --insecure -d '{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "action": { "type": "keyword" },
      "user": {
        "properties": {
          "coordinate": { "type": "geo_point" },
          "email": { "type": "keyword" },
          "email_verified": { "type": "boolean" },
          "name": { "type": "keyword" },
          "sub": { "type": "keyword" }
        }
      },
      "search": {
        "properties": {
          "q": { "type": "text" },
          "coordinate": { "type": "geo_point" },
          "categories": { "type": "integer" },
          "subCategories": { "type": "integer" },
          "skip": { "type": "integer" },
          "top": { "type": "integer" },
          "wide": { "type": "boolean" },
          "results": {
            "properties": {
              "count": { "type": "integer" },
              "promoted": { "type": "integer" },
              "total": { "type": "integer" }
            }
          }
        }
      }
    }
  }
}'

# claim updates
curl -fsSX PUT "https://${ES_HOST}/locations/_mapping" -H 'Content-Type: application/json' -u "${ES_USER}:${ES_PASSWORD}" --insecure -d '{
  "properties": {
    "claimedBy2": {
      "type": "keyword"
    },
    "claimedFromId2": {
      "type": "keyword"
    },
    "claimedOn2": {
      "type": "date"
    },
    "claimVerified2": {
      "type": "boolean"
    },
    "interestedIn2": {
      "type": "keyword"
    },
    "howYouHearAboutUs2": {
      "type": "keyword"
    }
  }
}'

echo
echo "Opensearch setup done"
