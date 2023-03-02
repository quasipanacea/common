#!/usr/bin/env bash

file="$1"
tag_name='nightly'
remote=$(git remote show -n)

git tag -fa "$tag_name" -m ''
git push "$remote" ":refs/tags/$tag_name"
git push --tags
if [[ -n "$file" && -f "$file" ]]; then
	gh release upload "$tag_name" "$file" --clobber
fi
gh release edit --draft=false nightly
