#!/usr/bin/env bash

set -eE

if [ -f /files/mods/${1}/map.env ]
then
	source /files/mods/${1}/map.env
else
	echo "map.env not found for mod id ${1}..."
	exit 1
fi

if [[ ${2} = "uninstall" ]]
then
	echo "Backing up, as uninstalling will remove the ${MAP} mpmissions directory"
	dz backup
	rm -rf ${SERVER_FILES}/mpmissions/${MPDIR}
elif [[ ${2} = "update" ]]
then
	cd /tmp
	git clone ${REPO} 2> /dev/null 1> /dev/null
	cp -a ${DIR}/${MPDIR} ${SERVER_FILES}/mpmissions
	rm -rf ${DIR}
elif [[ ${2} = "install" ]]
then
	cd /tmp
	git clone ${REPO} 2> /dev/null 1> /dev/null
	cp -a ${DIR}/${MPDIR} ${SERVER_FILES}/mpmissions
	rm -rf ${DIR}
fi
