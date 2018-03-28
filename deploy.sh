#!/bin/bash

owner="$(cut -d'/' -f1 <<< ${TRAVIS_REPO_SLUG})"
repo="$(cut -d'/' -f2 <<< ${TRAVIS_REPO_SLUG})"

if [ -z "${TRAVIS_PULL_REQUEST}" -o "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  npm run build --prod -- --base-href "https://${owner}.github.io/${repo}/" -dop false
  angular-cli-ghpages
else
  npm run build --prod -- --base-href "https://${owner}.github.io/${repo}/pr/${TRAVIS_PULL_REQUEST}/" -op "./dist/pr/${TRAVIS_PULL_REQUEST}" -dop false
  angular-cli-ghpages
  npm run lh --score=70 https://${owner}.github.io/${repo}/pr/${TRAVIS_PULL_REQUEST}/
fi
