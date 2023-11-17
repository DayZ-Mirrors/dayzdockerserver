# Custom Server Changes

## These are the custom integrations possible with dayzdockerserver

### Lowered login/logout time

To lower the login/logout time from the default 15 seconds.

Go into the server container:

```shell
docker compose exec server bash
```

Make a new directory in /profiles/custom called login and go into it:

```shell
mkdir -p /profiles/custom/login
cd /profiles/custom/login
```

Generate a globals.xml with the changed values:

```shell
cat > globals.xml << EOF
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<variables>
    <var name="TimeLogin" type="0" value="1"/>
    <var name="TimeLogout" type="0" value="1"/>
</variables>
EOF
```

Restart the server.

### No food

For a more survival-oriented experience, one can prevent food from spawning in the world, forcing players to hunt and fish for food.

Food still spawns on the infected and in containers. Any other mod that adds food will also be unaffected.

Go into the server container:

```shell
docker compose exec server bash
```

Make a new directory in /profiles/custom called no-food and go into it:

```shell
mkdir -p /profiles/custom/no-food
cd /profiles/custom/no-food
```

Generate the types.xml override file from your current mpmissions type.xml (presumes dayzOffline.chernarusplus):

```shell
xmlstarlet ed \
  -s / -t elem -n food \
  -m "/types/type[category[contains(@name, 'food')]]" "/food" \
  -d /types \
  -r food -v types \
  -u //nominal -v 0 \
  /serverfiles/mpmissions/dayzOffline.chernarusplus/db/types.xml \
  > types.xml
```

Always lint any XML file that is created/merged (Any output from this command means there is a problem. No output means the XML file is valid):

```shell
xmllint --noout types.xml
```

Restart the server for the changes to take effect.

Explanation:
* Start xmlstarlet in edit mode
* Add a new XML node at the root named "food"
* Move all `<type>` nodes where `<category name="...` has the word "food" in it to the new /food node
* Delete the remaining `<types>` root node
* Rename `<food>` to `<types>`
* Set all remaining nodes to have `<nominal>0</nominal>`
* Do this for every mpmissions types.xml file (dayzOffline.chernarusplus shown here)
* Save it to a new types.xml file in the current directory, the one we made above.

This file will now serve as a types.xml override for all food items when the server starts!

Every directory under /profiles/custom will be added as a new Economy Core entry when the server is started.

### Change starting gear

To change player starting gear, using examples from [the BI DayZ Wiki](https://community.bistudio.com/wiki/DayZ:Spawning_Gear_Configuration):

Go into the server container:

```shell
docker compose exec server bash
```

Copy the custom integration directory:

```shell
cd /profiles/custom
cp -a /files/custom/starting-gear .
```

Restart the server.

### References

[BI DayZ Wiki - Spawning Gear Configuration](https://community.bistudio.com/wiki/DayZ:Spawning_Gear_Configuration)

[BI DayZ Wiki - Central Economy Mission Files Modding](ttps://community.bistudio.com/wiki/DayZ:Central_Economy_mission_files_modding)
