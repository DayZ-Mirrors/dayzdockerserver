#!/usr/bin/env bash

set -eE

cd "$(dirname ${0})"

echo
if echo ${0} | grep -q "uninstall.sh"
then
	echo "Backing up, as uninstalling will remove the Banov mpmissions directory"
	dayzserver backup
	echo "Uninstalling mpmissions..."
	echo
	rm -rf ${HOME}/serverfiles/mpmissions/empty.banov
elif echo ${0} | grep -q "update.sh"
then
	echo "Updating mpmissions directory..."
	echo
	cd /tmp
	git clone https://github.com/KubeloLive/Banov 2> /dev/null 1> /dev/null
	cp -a Banov/empty.banov ${HOME}/serverfiles/mpmissions
	rm -rf Banov
else
	echo "Installing mpmissions files..."
	echo
	cd /tmp
	git clone https://github.com/KubeloLive/Banov 2> /dev/null 1> /dev/null
	cp -a Banov/empty.banov ${HOME}/serverfiles/mpmissions
	rm -rf Banov
fi
