#!/usr/bin/env bash

set -eE

cd "$(dirname ${0})"

D="${HOME}/serverfiles/mpmissions/dayzOffline.chernarusplus"

echo
if echo ${0} | grep -q "uninstall.sh"
then
	echo "Restoring original files and deleting extra file..."
	echo
	cp -v types.xml.orig ${D}/db/types.xml
else
	echo "Copying modified files to server missions directory..."
	echo
	head -n-1 types.xml.orig > /tmp/types.xml
	cat types.xml >> /tmp/types.xml
	cp -v /tmp/types.xml ${D}/db/types.xml
fi
echo
