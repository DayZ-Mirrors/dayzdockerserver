#!/usr/bin/env bash

set -eE

cd "$(dirname ${0})"

D="../../serverfiles/mpmissions/dayzOffline.chernarusplus"

echo
if echo ${0} | grep -q "uninstall.sh"
then
	echo "Restoring original files and deleting extra file..."
	echo
	cp -v cfgenvironment.xml.orig ${D}/cfgenvironment.xml
	cp -v events.xml.orig ${D}/db/events.xml
	rm -fv ${D}/env/rap2and3_territories.xml
else
	echo "Copying modified files to server missions directory..."
	echo
	cp -v cfgenvironment.xml ${D}/
	cp -v events.xml ${D}/db/
	cp -v rap2and3_territories.xml ${D}/env/
fi
echo
