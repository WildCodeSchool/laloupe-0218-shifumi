#!/bin/bash

owner="$(cut -d'/' -f1 <<< ${TRAVIS_REPO_SLUG})"
repo="$(cut -d'/' -f2 <<< ${TRAVIS_REPO_SLUG})"

if [ -z "${TRAVIS_PULL_REQUEST}" -o "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  npm run build --prod --base-href "https://${owner}.github.io/${repo}/" angular-cli-ghpages
else
  npm run build --prod --base-href "https://${owner}.github.io/${repo}/pr/${TRAVIS_PULL_REQUEST}/" --dir "./pr/${TRAVIS_PULL_REQUEST}" angular-cli-ghpages
  npm run lh --score=80 https://${owner}.github.io/${repo}/pr/${TRAVIS_PULL_REQUEST}/
fi
