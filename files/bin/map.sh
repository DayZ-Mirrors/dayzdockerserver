#!/usr/bin/env bash

set -eE

TERM="map"
if [[ ${1} =~ ^[0-9]+$ ]]
then
	TERM="mod id"
fi

if [ -f "/files/mods/${1}/map.env" ]
then
	source "/files/mods/${1}/map.env"
else
	echo "map.env not found for ${TERM} ${1}..."
	exit 1
fi

if [[ ${2} = "uninstall" ]]
then
	echo "Backing up, as uninstalling will remove the ${MAP} mpmissions directory"
	dz backup
	rm -rf "${SERVER_FILES}/mpmissions/${MPDIR}"
elif [[ ${2} = "update" ]] || [[ ${2} = "install" ]]
then
	cd /tmp
	if [ -d "${DIR}" ]
	then
		pushd "${DIR}" > /dev/null
		git pull
		popd > /dev/null
	else
		git clone "${REPO}"
	fi
	rm -rf "${SERVER_FILES}/mpmissions/${MPDIR}"
	cp -a "${DIR}/${MPDIR}" "${SERVER_FILES}/mpmissions"
fi
