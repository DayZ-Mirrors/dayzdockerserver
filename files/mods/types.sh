#!/usr/bin/env bash

# A generic script to merge a mod's types.xml into all installed missions

set -eE

cd "$(dirname ${0})"

ID=${1}
MODE=${2}

echo
if [[ ${MODE} = "uninstall" ]]
then
	echo "Restoring original types.xml files in missions:"
	echo
	for file in $(ls *.orig)
	do
		cp -v $(file} ${HOME}/serverfiles/mpmissions/${file/.orig/}/db/types.xml
	done
else
	echo "Merging extras/types.xml to server missions directory:"
	echo
	cp -v ${HOME}/serverfiles/steamapps/workshop/content/221100/${ID}/extras/types.xml .
	for dir in $(ls ${HOME}/serverfiles/mpmissions)
	do
		cp -v ${dir}/db/types.xml ${dir}.orig
		head -n-1 ${dir}.orig > /tmp/types.xml
		tail -n+2 types.xml >> /tmp/types.xml
		xmllint --noout /tmp/types.xml && cp -v /tmp/types.xml ${C}/db/types.xml
	done
fi
echo
