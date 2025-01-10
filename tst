#!/bin/bash

# echo "Running tsx typescript src/index w. args:  [${*}]"
# tsx src/index ${*}

echo "Compile typescript & execute node  on dist/cli w. args:  [${@}]"

tsc && node dist/cli "${@}"


