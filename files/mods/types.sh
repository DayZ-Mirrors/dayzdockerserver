#!/usr/bin/env bash

# A generic script to manage a mod's types.xml against all installed missions

set -eE

ID=${1}
MODE=${2}
TYPES_FILE="${workshopfolder}/${ID}/extras/types.xml"

if [[ ${3} != "" ]]
then
	TYPES_FILE="${3}"
fi

for file in $(find ${SERVER_FILES}/mpmissions -name types.xml -print -prune)
do
	if [[ ${MODE} = "uninstall" ]]
	then
		# Remove the lines that were added by the mod's extras/types.xml from
		# every db/types.xml in all mission directories

		# Chop the top tag from the source file
		tail -n+2 ${TYPES_FILE} > /tmp/types-tmp.xml

		# Chop the bottom tag from the source file
		head -n-1 /tmp/types-tmp.xml > /tmp/types-src.xml

		# Remove that content from the original file
		grep -qvxFf /tmp/types-src.xml ${file}
	else
		# Add the contents of extras/types.xml to every db/types.xml in all
		# mission directories
		xmllint --noout ${TYPES_FILE} && {
			echo -e "${green}${TYPES_FILE} passes XML lint test!"
			echo -e "Merging to $file...${default}"
			# Chop the bottom tag from the destination file
			head -n-1 ${file} > /tmp/types-dst.xml

			# Chop the top 2 tags, xml and types, from the source file
			tail -n+2 ${TYPES_FILE} > /tmp/types-src.xml

			# Concatenate the two files back into the source file
			cat /tmp/types-dst.xml /tmp/types-src.xml > /tmp/types.xml

			xmllint --noout /tmp/types.xml && {
				cp -v /tmp/types.xml ${file}
			} || {
				# Try again, but chop the top 3 tags, hopefully xml and types, from the source file...
				echo "First merge attempt failed, trying again..."
				tail -n+3 ${TYPES_FILE} > /tmp/types-src.xml

				# Concatenate the two files back into the source file
				cat /tmp/types-dst.xml /tmp/types-src.xml > /tmp/types.xml

				# And lint again. This should probably be a recursive function...
				xmllint --noout /tmp/types.xml && {
					cp -v /tmp/types.xml ${file}
				} || {
					echo "XML lint check after merge failed! No files changed!"
				}
			}
		} || {
			echo -e "${red}${TYPES_FILE} fails XML lint test!"
			echo -e "This will have to be merged by hand!${default}"
		}
	fi
done
