#!/bin/bash
if [ -z "$1" ]; then
  echo 'NO_REPO_PATH'
  exit 1
fi

WORKING_DIR=$(pwd)

cd $1

git push -u origin master

cd $WORKING_DIR