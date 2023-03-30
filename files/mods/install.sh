#!/usr/bin/env bash

set -eEx

source /files/mods/${1}/install.env

echo
if echo ${0} | grep -q "uninstall.sh"
then
	echo "Backing up, as uninstalling will remove the ${MAP} mpmissions directory"
	dayzserver backup
	echo "Uninstalling mpmissions..."
	echo
	rm -rf ${HOME}/serverfiles/mpmissions/${MPDIR}
elif echo ${0} | grep -q "update.sh"
then
	echo "Updating mpmissions directory..."
	echo
	cd /tmp
	git clone ${REPO} 2> /dev/null 1> /dev/null
	cp -a ${DIR}/${MPDIR} ${HOME}/serverfiles/mpmissions
	rm -rf ${DIR}
else
	echo "Installing mpmissions files..."
	echo
	cd /tmp
	git clone ${REPO} 2> /dev/null 1> /dev/null
	cp -a ${DIR}/${MPDIR} ${HOME}/serverfiles/mpmissions
	rm -rf ${DIR}
fi
