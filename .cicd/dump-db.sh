#!/bin/sh
set -eu
. ./.env
mariadb-dump -h admin-prod-db-read.c04wxz99zho4.us-east-2.rds.amazonaws.com \
  -u nautical -p${AWS_RDS_PASSWORD} \
  --databases boaterslist \
  --single-transaction \
  --compress \
  --order-by-primary > db-20220408.sql
cp db-20220408.sql ../data/boaters-dump.sql
