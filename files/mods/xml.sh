#!/usr/bin/env bash

# A generic script to manage merging mod XML files to mpmissions XML files

set -eE

ID=${1}

source ${FILES}/mods/${ID}/xml.env

# Iterate over the file names we can handle
for var in CFGEVENTSPAWNS CFGSPAWNABLETYPES EVENTS TYPES
do
  if echo ${!var} | grep -q http
  then
    OUT="${WORKSHOP_DIR}/${ID}/${var,,}.xml"
    echo "${var} is a URL, downloading to ${OUT}"
    curl -so ${OUT} ${!var}
    xmllint --noout ${OUT} 2> /dev/null || {
      echo -e "${red}${var,,}.xml does not pass XML lint test!${default}"
    } && {
      echo -e "${green}${var,,}.xml passes XML lint test!${default}"
    }
  fi
done
