# source ./bootstrap.sh first to install base dependencies
.PHONY: all build builder clean install lint push-builder run run-builder

# load .env variables
ifneq ("$(wildcard .env)", "")
include .env
endif

KANIKO_VERSION=v1.7.0-debug
MEGA_LINTER_VERSION=v4.46.0

# Gitlab predefined variable defaults
ifneq ("$(wildcard .git)", "")
CI_COMMIT_SHORT_SHA ?= $(shell git rev-parse --short=8 HEAD)
endif
CI_COMMIT_SHORT_SHA ?= local
CI_PROJECT_DIR ?= /workspace
CI_PROJECT_URL ?= https://gitlab.com/boaterslist/frontend
CI_REGISTRY_IMAGE ?= registry.gitlab.com/boaterslist/frontend
CI_PROJECT_TITLE ?= "Boaterslist Frontend"

BUILDER_TAG := ${CI_REGISTRY_IMAGE}/builder:${CI_COMMIT_SHORT_SHA}

# export GitLab CI variables
export CI_COMMIT_SHORT_SHA CI_JOB_STARTED_AT CI_PROJECT_DIR CI_PROJECT_TITLE CI_PROJECT_URL CI_REGISTRY_IMAGE
export BOATERSLIST_DB_HOST BOATERSLIST_DB_PORT BOATERSLIST_DB_USER BOATERSLIST_DB_PASSWORD
export BOATERSLIST_OPENSEARCH_HOST BOATERSLIST_OPENSEARCH_USER BOATERSLIST_OPENSEARCH_PASSWORD

all: lint build

build:
	cd packages/web-app; make build
	cd packages/native-app; make build

build-docker:
	docker run -it -v ${PWD}:/work ${BUILDER_TAG} make build

build-builder:
	docker build -f .cicd/builder.Dockerfile -t ${BUILDER_TAG} .

push-builder-latest:
	docker build -f .cicd/builder.Dockerfile -t ${BUILDER_TAG} -t ${CI_REGISTRY_IMAGE}/builder:latest --cache-from ${CI_REGISTRY_IMAGE}/builder:latest .
	docker push ${CI_REGISTRY_IMAGE}/builder:latest

# build builder and push to docker registry
build-builder-kaniko:
	./.cicd/build-builder-opts.sh | xargs docker run -v "${PWD}:/workspace" -v ~/.docker/config.json:/kaniko/.docker/config.json gcr.io/kaniko-project/executor:${KANIKO_VERSION}

clean:
	rm -rf .next
	rm -rf .hermit
	rm -rf data/*-dump.sql
	rm -rf node_modules packages/common/node_modules packages/native-app/node_modules packages/web-app/node_modules
	sudo rm -rf report
	cd packages/native-app; make clean
	cd packages/web-app; make clean

dev-install:
	oras pull -o data registry.gitlab.com/boaterslist/frontend/boaters-dump.sql:v1
	oras pull -o data registry.gitlab.com/boaterslist/frontend/boaterslist-users.csv:v1

# load test data in MariaDB
init-db: dev-install
	docker-compose up -d db
	docker-compose up init-db

# db admin: http://localhost:8090, opensearch admin: http://localhost:5601
restart-backend: dev-install
	docker-compose stop
	docker-compose up init-db db-admin db opensearch opensearch-admin -d
	cd .cicd; BOATERSLIST_OPENSEARCH_HOST=localhost:9200 ./wait-opensearch.sh

# db admin: http://localhost:8090, opensearch admin: http://localhost:5601
# start backend from saved snapshot
start-backend: dev-install
	docker-compose stop
	docker-compose rm -f
	cp opensearch.yml opensearch-tmp.yml
	gomplate -f river.toml.go.tpl -o river.toml
	BOATERSLIST_DB_HOST=127.0.0.1 BOATERSLIST_OPENSEARCH_HOST=127.0.0.1:9200 gomplate -f river.toml.go.tpl -o river.localhost.toml
	docker-compose up init-db db-admin db opensearch opensearch-admin -d
	cd .cicd; BOATERSLIST_OPENSEARCH_HOST=localhost:9200 ./wait-opensearch.sh; ./snapshot-load.sh

# migrate sql to opensearch
backend-migrate: dev-install
	docker-compose down --remove-orphans
	docker-compose rm -f
	cp opensearch.yml opensearch-tmp.yml
	gomplate -f river.toml.go.tpl -o river.toml
	BOATERSLIST_DB_HOST=127.0.0.1 BOATERSLIST_OPENSEARCH_HOST=127.0.0.1:9200 gomplate -f river.toml.go.tpl -o river.localhost.toml
	docker-compose up init-db db-admin db opensearch opensearch-admin -d
	docker-compose logs init-db -f
	docker-compose up sync
	cd .cicd; BOATERSLIST_OPENSEARCH_HOST=localhost:9200 ./wait-opensearch.sh; BOATERSLIST_OPENSEARCH_HOST=localhost:9200 ./index-update1.sh

load-snapshots:
	cd .cicd; BOATERSLIST_OPENSEARCH_HOST=localhost:9200 ./wait-opensearch.sh;\
	BOATERSLIST_OPENSEARCH_HOST=localhost:9200 ./snapshot-load.sh

save-snapshot:
	cd .cicd; BOATERSLIST_OPENSEARCH_HOST=localhost:9200 ./wait-opensearch.sh;\
	BOATERSLIST_OPENSEARCH_HOST=localhost:9200 ./snapshot.sh

stop-backend:
	docker-compose stop

start-opensearch:
	docker-compose up opensearch -d

clean-backend:
	docker-compose stop
	docker-compose rm -f

install:
	hermit install
	hermit shell-hooks --bash
ifeq ("$(wildcard .env)", "")
	gomplate -f .env.go.tpl -o .env
endif
	mkdir -p data
	npm install --global yarn
	yarn install
	cd packages/native-app; make install

install-deploy:
	yarn global add aws-cdk

pull:
	docker-compose pull

lint:
	docker run -it -v ${PWD}:/tmp/lint nvuillam/mega-linter:${MEGA_LINTER_VERSION}

push-dbdump:
	cd data;oras push --manifest-config /dev/null:application/vnd.oci.image.config.v1+json registry.gitlab.com/boaterslist/frontend/boaters-dump.sql:v1 boaters-dump.sql
	cd data;oras push --manifest-config /dev/null:application/vnd.oci.image.config.v1+json registry.gitlab.com/boaterslist/frontend/boaterslist-users.csv:v1 boaterslist-users.csv

run-builder:
	docker run -it -v ${PWD}:/work ${BUILDER_TAG}

# start it all up in dev mode
dev:
	docker-compose up opensearch -d
	cd packages/web-app; make dev > web-app.log &
	cd packages/native-app; make dev

db-client:
	mariadb --host 127.0.0.1 -u ${BOATERSLIST_DB_USER} -p${BOATERSLIST_DB_PASSWORD} -D boaterslist --default-character-set=utf8

sp:
	mariadb --host 127.0.0.1 -u ${BOATERSLIST_DB_USER} -p${BOATERSLIST_DB_PASSWORD} -D boaterslist < ./.cicd/init-location-categories.sql

usercsv:
	cd data; jq -r '[.Id, .Email] | @csv' boaterslist-users.json > boaterslist-users.csv


# deploy: --require-approval
deploy-dev:
	cd packages/deploy; cdk deploy dev/* --require-approval never --profile boaterslist-dev

deploy-staging:
	cd packages/deploy; cdk deploy staging/* --require-approval never --profile boaterslist-dev

deploy-prod:
	cd packages/deploy; cdk deploy prod/* --require-approval never --profile boaterslist-prod

test:
	cd packages/web-app; make test
