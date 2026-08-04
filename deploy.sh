#!/usr/bin/env zsh
set -euo pipefail

if [[ ! -f dist/index.html ]]; then
  echo 'dist/index.html 不存在，请先运行 npm run build' >&2
  exit 1
fi

cd dist
echo "www.wenkers.cn" > CNAME

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:weNKers/OurBook.git master:gh-pages
