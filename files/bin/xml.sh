#!/usr/bin/env bash

# A generic script that retrieves XML files from mods, either upstream in remote endpoints, or
# locally from the downloaded mod directory, or from project files.

set -eE

ID=${1}

if ! [ -f ${FILES}/mods/${ID}/xml.env ]
then
	exit 0
fi

source ${FILES}/mods/${ID}/xml.env

# Iterate over the file names we can handle
for i in cfgeventgroups.xml cfgenvironment.xml cfgeventspawns.xml cfggameplay.json cfgspawnabletypes.xml cfgweather.xml events.xml init.c types.xml
do
	FILE=$(echo ${i} | cut -d. -f1)
	TYPE=$(echo ${i} | cut -d. -f2)
	UP=${FILE^^}
	VAL=${!UP}
	DIR="${WORKSHOP_DIR}/${ID}"
	OUT="${DIR}/${i}"
	if echo ${VAL} | grep -qE "^http"
	then
		echo
		echo "${i} is a URL, downloading to ${OUT}"
		curl -so ${OUT} ${VAL}
	elif echo ${VAL} | grep -qE "^local"
	then
		echo
		echo "${i} comes from mod integration, copying to ${OUT}"
		echo -n "  "
		cp -v "${FILES}/mods/${ID}/${i}" "${OUT}"
	elif echo ${VAL} | grep -qE "^\./"
	then
		echo
		echo "${FILE} comes from the mod as ${VAL}, copying to ${OUT}"
		echo -n "  "
		cp -v "${DIR}/${VAL}" "${OUT}"
	fi
	if [ -f ${OUT} ]
	then
		if [[ ${TYPE} = "xml" ]]
		then
			xmllint --noout ${OUT} 2> /dev/null && (
				echo -e "  ${green}${OUT} passes XML lint test!${default}"
			) || (
				echo -e "  ${yellow}${OUT} does not pass XML lint test!${default}"
			)
			# TODO - validate against schema - https://github.com/rvost/DayZ-Central-Economy-Schema/tree/master
		elif [ "${TYPE}" == "json" ]
		then
			jq -e . ${OUT} > /dev/null || (
				echo -e "  ${yellow}${OUT} does not pass JSON lint test!${default}"
			) && (
				echo -e "  ${green}${OUT} passes JSON lint test!${default}"
			)
		fi
	fi
done

if [ -f "${FILES}/mods/${ID}/start.sh" ]
then
	echo
	echo "Copy ${FILES}/mods/${ID}/start.sh -> ${DIR}/start.sh"
	cp "${FILES}/mods/${ID}/start.sh" "${DIR}/start.sh"
	echo
fi
