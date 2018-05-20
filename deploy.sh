#! /bin/zsh
cd ourbook
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:weNKers/OurBook.git master:gh-pages
