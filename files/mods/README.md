# Mods

## Custom mod integrations

The goal is to provide the ability to quickly and easily integrate a mod's extra files:

* Custom map mods that require mission files to be installed.
* Mods that require extra files to be merged into mission files.
* Mods that require extra integration steps in the profiles directory.

### [Banov](https://steamcommunity.com/sharedfiles/filedetails/?id=2415195639)

A custom map mod. The integration script installs the mission files from their github.

### [Raptors](https://steamcommunity.com/sharedfiles/filedetails/?id=2684950452)

...

### [Red Falcon Flight System Heliz](https://steamcommunity.com/sharedfiles/filedetails/?id=2692979668)

A mod that adds helicopters. The integration merges `types.xml`, `events.xml`, `cfgspawnabletypes.xml`, and `cfgeventspawns.xml` into the mission files. This allows for configuring spawn points on all the [supported maps](https://github.com/RedFalconKen/RedFalconFlightSystem-Heliz/tree/main/Config%20Files/Event%20Spawn%20Config), what helicopters spawn, how many, their parts, etc..
