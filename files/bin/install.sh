#!/usr/bin/env bash

set -eE

source /files/mods/${1}/install.env

echo
if [[ ${2} = "uninstall" ]]
then
	echo "Backing up, as uninstalling will remove the ${MAP} mpmissions directory"
	dayzserver backup
	echo "Uninstalling mpmissions..."
	echo
	rm -rf ${SERVER_FILES}/mpmissions/${MPDIR}
elif [[ ${2} = "update" ]]
then
	echo "Updating mpmissions directory..."
	echo
	cd /tmp
	git clone ${REPO} 2> /dev/null 1> /dev/null
	cp -a ${DIR}/${MPDIR} ${SERVER_FILES}/mpmissions
	rm -rf ${DIR}
else
	echo "Installing mpmissions files..."
	echo
	cd /tmp
	git clone ${REPO} 2> /dev/null 1> /dev/null
	cp -a ${DIR}/${MPDIR} ${SERVER_FILES}/mpmissions
	rm -rf ${DIR}
fi
