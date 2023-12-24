# HypeTrain

## Reference

The files used to integrate the [HypeTrain mod](https://steamcommunity.com/sharedfiles/filedetails/?id=3115714092) came from 
[here](https://steamcommunity.com/workshop/filedetails/discussion/3115714092/4032475029247848861/).

## Mod Integration Files

5 files are required to run the mod. Two are map-specific and the rest are common to all maps:

These are map-specific. The ones included in this repository is for Chernarus.
* `cfgeventgroups.xml`
* `cfgeventspawns.xml`

These files are commong to all maps:

* `cfgspawnabletypes.xml`
* `events.xml`
* `types.xml`

The `start.sh` script is for doing extra stuff, but programatically. See the comments within it for details.

## Generic Mod Installation (Windows)

Using the [Central Economy](https://community.bistudio.com/wiki/DayZ:Central_Economy_mission_files_modding) method:

* Create a new folder in your mpmissions map folder. Name it HypeTrain.
* Put the 3 files common to the server in that folder

```
+C:\
 +DayZ Server
  +mpmissions
   +dayzOffline.chernarusplus
    +HypeTrain
     -cfgspawnabletypes.xml
     -events.xml
     -types.xml
```
Edit the server's `cfgeconomycore.xml` and add the following under `<economycore>`:

```
  <ce folder="HypeTrain">
    <file name="cfgspawnabletypes.xml" type="spawnabletypes"/>
    <file name="events.xml" type="events"/>
    <file name="types.xml" type="types"/>
  </ce>
```

The other two files must be manually merged to the mpmissions equivalents:
