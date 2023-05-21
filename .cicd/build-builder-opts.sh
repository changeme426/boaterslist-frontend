#!/bin/sh
set -eu
DESTINATIONS="${CI_REGISTRY_IMAGE}/builder:latest ${CI_REGISTRY_IMAGE}/builder:${CI_COMMIT_SHORT_SHA}"
echo "${DESTINATIONS}" | tr " " "\n" | sed -e 's/^/--destination /' | xargs echo
echo "--dockerfile=.cicd/builder.Dockerfile --context=${CI_PROJECT_DIR}\
  --cache=true --cache-copy-layers=true\
  --snapshotMode=redo\
  --label "org.opencontainers.image.title=$CI_PROJECT_TITLE"\
  --label "org.opencontainers.image.url=$CI_PROJECT_URL"\
  --label "org.opencontainers.image.revision=$CI_COMMIT_SHORT_SHA""
