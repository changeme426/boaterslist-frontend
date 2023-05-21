#!/bin/sh
# shellcheck disable=SC2181
# input environment variables: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
set -u

# we want a clean docker stop
trap 'exit 0' TERM

MYSQL_COMMAND="mariadb --host ${DB_HOST} --port ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD}"

set +ex
# wait for database to be up (print error after 15 seconds then after each minute - retry forever)
echo "Waiting for database..."
count=15
while true; do
  ${MYSQL_COMMAND} -e 'select 1' >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    break
  fi
  sleep 1
  count=$((count - 1))
  if [ "$count" -lt 0 ]; then
    echo
    count=5
    ${MYSQL_COMMAND} -e 'select 1'
    if [ $? -eq 0 ]; then
      break
    fi
  fi
done
echo "Database ready and initialized"

set +e
set -x
${MYSQL_COMMAND} -e "CREATE DATABASE IF NOT EXISTS boaterslist"
${MYSQL_COMMAND} boaterslist < data/boaters-dump.sql
${MYSQL_COMMAND} boaterslist --default-character-set=utf8 < .cicd/init-location-categories.sql
${MYSQL_COMMAND} boaterslist --default-character-set=utf8 < .cicd/update-users.sql
echo "Database setup done"
