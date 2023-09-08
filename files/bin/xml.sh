#!/usr/bin/env bash

# A generic script that retrieves XML files from mods, either upstream in remote endpoints, or
# locally from the downloaded mod directory

set -eE

ID=${1}

if ! [ -f ${FILES}/mods/${ID}/xml.env ]
then
	exit 0
fi

source ${FILES}/mods/${ID}/xml.env

# Iterate over the file names we can handle
for var in CFGEVENTSPAWNS CFGSPAWNABLETYPES EVENTS TYPES
do
  DIR="${WORKSHOP_DIR}/${ID}"
  OUT="${DIR}/${var,,}.xml"
  if echo ${!var} | grep -qE "^http"
  then
    echo "${var} is a URL, downloading to ${OUT}"
    curl -so ${OUT} ${!var}
  elif echo ${!var} | grep -qE "^local"
  then
    echo "${var} comes from mod integrations, copying to ${OUT}"
    cp -v "${FILES}/mods/${ID}/${var,,}.xml" "${OUT}"
  elif echo ${!var} | grep -qE "^\./"
  then
    echo "${var} comes from the mod as ${!var}, copying to ${OUT}"
    cp -v "${DIR}/${!var}" "${OUT}"
  fi
  if [ -f ${OUT} ]
  then
    xmllint --noout ${OUT} 2> /dev/null && (
      echo -e "${green}${OUT}.xml passes XML lint test!${default}"
    ) || (
      echo -e "${yellow}${OUT}.xml does not pass XML lint test!${default}"
    )
  fi
done
