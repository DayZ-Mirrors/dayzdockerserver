# Custom Server Changes

## No Food

For a more survival-oriented experience, one can remove all food items from mpmissions:

Go into the server container:

```shell
docker compose exec server bash
```

Make a new directory in /profiles/custom and go into it:

```shell
cd /profiles/custom
mkdir no-food
cd no-food
```

Generate the types.xml override file for your mpmissions type.xml:
```shell
xmlstarlet ed \
  -s / -t elem -n food \
  -m "/types/type[category[contains(@name, 'food')]]" "/food" \
  -d /types \
  -r /food -v /types \
  -u //nominal -v 0 \
  /serverfiles/mpmissions/dayzOffline.chernarusplus/db/types.xml \
  > types.xml
```

Explanation:
* Start xmlstarlet in edit mode
* Add a new XML node at the root named "food"
* Move all types nodes where <category name=... has the word "food" in it to the new /food node
* Delete the remaining /types root node
* Rename /food back to /types
* Set all remaining nodes to have nominal 0
* Do this for every mpmissions types.xml file
* Save it to a new types.xml file

This file will now serve as a types.xml override for all food items!

Every directory under /profiles/custom will be added as a new Economy Core entry when the server is started.

See https://community.bistudio.com/wiki/DayZ:Central_Economy_mission_files_modding for more details.

