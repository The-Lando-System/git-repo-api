#!/bin/bash
if [ -z "$1" ]; then
  echo 'NO_REPO_PATH'
  exit 1
fi

if [ -z "$2" ]; then
  echo 'NO_REPO_ADDRESS'
  exit 1
fi

git clone $2 $1 > /dev/null

# Create an empty tmp file
touch $1/.tmp

./scripts/git_add.sh $1 "."
./scripts/git_commit.sh $1 "Initial commit"
./scripts/git_push.sh $1