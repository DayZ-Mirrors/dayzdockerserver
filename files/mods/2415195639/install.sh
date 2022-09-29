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
	rm -rf ${HOME}/serverfiles/mpmissions/
if echo ${0} | grep -q "update.sh"
then
	echo "Updating mpmissions directory..."
	echo
	cd ${HOME}/serverfiles/mpmissions
	git pull https://github.com/KubeloLive/Banov
else
	echo "Installing mpmissions directory..."
	echo
	cd ${HOME}/serverfiles/mpmissions
	git clone https://github.com/KubeloLive/Banov
fi
echo
