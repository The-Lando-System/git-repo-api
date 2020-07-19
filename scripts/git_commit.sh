#!/bin/bash
if [ -z "$1" ]; then
  echo 'NO_REPO_PATH'
  exit 1
fi

if [ -z "$2" ]; then
  echo 'NO_COMMIT_MESSAGE'
  exit 1
fi

WORKING_DIR=$(pwd)

cd $1

echo "Running git commit at location: `pwd`"

git commit -m "$2"

cd $WORKING_DIR

echo "Complete, back at location: `pwd`"