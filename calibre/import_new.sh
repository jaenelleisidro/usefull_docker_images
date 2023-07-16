set -e
calibredb add --automerge ignore -r $(pwd)/new
rm -r $(pwd)/new/*