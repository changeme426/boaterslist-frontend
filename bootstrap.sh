#!/bin/bash
# This file must be used with "source bin/activate-hermit" from bash or zsh.
# You cannot run it directly

# Tested on Ubuntu 20.04

set -eu
if [ "${BASH_SOURCE-}" = "$0" ]; then
  echo "You must source this script: \$ source $0" >&2
  exit 33
fi

./.cicd/install-build.sh
export PATH="${PWD}/bin:${PATH}"
hermit install
eval "$(hermit env --activate)"
hermit sync
