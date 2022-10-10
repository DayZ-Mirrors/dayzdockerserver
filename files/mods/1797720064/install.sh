#!/usr/bin/env bash

set -eE

cd "$(dirname ${0})"

echo
if echo ${0} | grep -q "uninstall.sh"
then
	echo "Restoring original files and deleting extra file..."
	echo
	for file in $(ls *.orig)
	do
		cp -v $(file} ${HOME}/serverfiles/mpmissions/${file/.orig/}/db/types.xml
	done
else
	echo "Copying modified files to server missions directory..."
	echo
	cp -v ${HOME}/serverfiles/steamapps/workshop/content/221100/1797720064/extras/types.xml .
	for dir in $(ls ${HOME}/serverfiles/mpmissions)
	do
		cp -v ${dir}/db/types.xml ${dir}.orig
		head -n-1 ${dir}.orig > /tmp/types.xml
		tail -n+2 types.xml >> /tmp/types.xml
		xmllint --noout /tmp/types.xml && cp -v /tmp/types.xml ${C}/db/types.xml
	done
fi
echo
