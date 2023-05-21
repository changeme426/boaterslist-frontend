#!/bin/sh
# shellcheck disable=SC2086

set -eu
# sudo if not root
SUDO="sudo "
if [ "$(whoami)" = "root" ]; then
	SUDO=
fi
echo ${SUDO}
set -x

export DEBIAN_FRONTEND=noninteractive

if [ ! -f /etc/localtime ]; then
  # timezone not set - set to eastern timezone (needed for tzdata install)
  ${SUDO}ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime
fi

${SUDO}apt-get -q update
${SUDO}apt-get -q --assume-yes install curl tzdata vim
${SUDO}apt-get -q --assume-yes install build-essential git git-lfs jq libtinfo-dev make openssl software-properties-common sudo wget zip
