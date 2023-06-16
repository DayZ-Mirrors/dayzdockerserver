# DayZDockerServer

A Linux [DayZ](https://dayz.com) server in a [Docker](https://docs.docker.com/) container. The main script's functionality is derived from [this project](https://github.com/thelastnoc/dayz-sa_linuxserver). That functionality is described [here](https://steamcommunity.com/sharedfiles/filedetails/?id=1517338673). The goal is to reproduce some of that functionality but also add more features. 

The main goal is to provide a turnkey DayZ server with mod support that can be spun up with as little as a machine running Linux with Docker and Docker Compose installed. 

## TL;DR for setting up a release DayZ server with the "1.21 stable release":

```shell
git clone https://ceregatti.org/git/daniel/dayzdockerserver.git
cd dayzdockerserver
# Edit the config file and set the server name. It's the first line of the file.
nano files/serverDZ.cfg
# Build the docker images
docker compose up -d --build
# Go into the web container, login, and install the server files
docker compose exec main bash
# Use a real login if you want to install mods. Otherwise, use the anonymous user. You'll be limited to the vanilla Chernarus and Livonia maps.
dz login
dz install
# Download the "1.21 stable release" file.
cd /serverfiles
mv DayZServer DayZServer.release
wget https://cdn.discordapp.com/attachments/491622000935305217/1119206127750615101/DayZServer
chmod 755 DayZServer
# Copy the two shared object files are needed for the server to run. These come from the experimental server release, but are included here for convenience.
cp /files/tmp/* .  DayZ Experimental server files.
# Switch to the server container and start the server
exit
docker compose exec server bash
# Start the server. This will run a vanilla Chernarus server. To run Livonia, simply change files/serverDZ.cfg to use the Livonia map in the section at the bottom of the file.
dz start
```

## Caveat Emptor

As of DayZ release 1.15, a [Linux DayZ server](https://steamdb.info/app/1042420/) was made available in Dayz Experimental. This has not been officially released, so this will only run a DayZ Experimental server at the moment. Only the [DayZ Experimental client](https://dayz.fandom.com/wiki/Experimental) will be able to connect to it. The goal is to have a working implementation once the Linux server is officially released, presumably [here](https://steamdb.info/app/223350/).

This process will create several docker volumes for the following sets of files: 
* serverfiles: The base server files
* mpmissions: The mpmissions directory of the base server files.
* mods: All mods will be stored here
* homedir: The user home directory. Each container gets its own. Where [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) keeps its resource files.
* profiles: A running server's profile. A server container gets its own volume.
* servermpmissions: A running -server's mpmissions directory. A server container gets its own volume.

These volumes can get quite large. The `serverfiles` one will require at least 2.7G of disk space for the default install. The mods one can fill up very quickly, with some map mods being as large as 10G. Make sure you have that much disk space in the location where docker stores its volumes, usually `/var/lib/docker/volumes`.

## Configure and Build

Ensure [Docker](https://docs.docker.com/engine/install/) and [Docker compose](https://docs.docker.com/compose/install/) are properly installed. This means setting it up so it runs as your user. Make sure you're running these commands as your user, in your home directory.

Clone the repo, and change into the newly created directory:

```
git clone https://ceregatti.org/git/daniel/dayzdockerserver.git
cd dayzdockerserver
```

Build the Docker images:

```
docker compose build
```

### Steam Integration

[SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) is used to manage Steam downloads. A vanilla DayZ server can be installed with the `anonymous` Steam user, but most mods cannot. If the goal is to add mods, a real Steam login must be used. Login:

```
docker compose run --rm web dz login
```

Follow the prompts. Hit enter to accept the default, which is to use the `anonymous` user, otherwise use your real username and keep following the prompts to add your password and Steam Guard code. This process will wait indefinitely until the code is entered.

The credentials will be managed by [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD). How it encrypts or otherwise obfuscates the credentials is beyond the scope of this document. Suffice to say that they are stored in the docker volume. All subsequent SteamCMD commands will use the stored credentials. so this process does not need to be repeated unless the session expires or the docker volume is deleted.

To manage the login credentials, simply run the command again. See [Manage](#manage). 

## Install

The server files must be installed before the server can be run:
```
docker compose run --rm web dz install
```
This process will download the several gigabytes (about 2.7G) of files required to run the server.

## Run

Edit `files/serverDZ.cfg` and set the values of any variables there. See the [documentation](https://forums.dayz.com/topic/239635-dayz-server-files-documentation/):

```
hostname = "Something other than Server Name";   // Server name
```

Launch the server container into the background:

```
docker compose up -d server
```

Tail the log:

```
docker compose logs -f server
```
## Stop

To stop the DayZ server:
```
docker compose exec server dz stop
```

If it exits cleanly, the container will also stop. Otherwise the server will restart

To stop the container:
```
docker compose down
```

## Manage

The following management commands presume the server has been brought [up](#run).

### RCON

A terminal-based RCON client is included: https://github.com/indepth666/py3rcon.
The dz script manages what's necessary to configure and run it:

```
docker compose exec server dz rcon
```

To reset the RCON password in the Battle Eye configuration file, simply delete it, and a random one will be generated on the next server startup:

```
docker compose run --rm server rm serverfiles/battleye/baserver_x64_active*
```

### Update the DayZ server files

It's probably not a good idea to update the server files while it's running. Make sure it's down first:

```
docker compose down
```

Then run the command:

```
docker compose run --rm web dz update
```

Don't forget to [bring it back up](#run).

### Stop the server

```
docker compose exec server dz stop
```

The server doesn't always exit when stopping it (SIGINT). When this happens, it's necessary to force stop it (SIGKILL):

```
docker compose exec server dz force
```

When the server exits cleanly, i.e. exit code 0, the container also stops. Otherwise, a crash is presumed, and the server will be restarted.

NOTE: As DayZ Experimental 1.19, the server is known to not exit upon SIGINT when mods are installed. This makes force stopping the server
required. This is not a clean exit, and will cause the server to restart. Manually take the server [down](#stop) to stop the container.

### Workshop - Add / List / Remove / Update mods

Interactive interface for managing mods. 

```
docker compose exec server dz activate id | add id1 | deactivate id | list | modupdate | remove id
docker compose exec server dz a id | add id1 | d id | l | m | r id
```

Look for mods in the [DayZ Workshop](https://steamcommunity.com/app/221100/workshop/). Browse to one. In its URL will be
an `id` parameter. Here is the URL to SimpleAutoRun: https://steamcommunity.com/sharedfiles/filedetails/?id=2264162971. To
add it:

```
docker compose exec web dz add 2264162971
```

Adding and removing mods will add and remove their names from the `-mod=` parameter.

Optionally, to avoid re-downloading large mods, the `activate` and `deactivate` workshop commands will
simply disable the mod but keep its files. Keep in mind that mod updates will also update deactivated 
mods.

The above is a bad example, as SimpleAutorun depends on Community Framework, which must also be installed, as well as made to load first.

### Looking under the hood

All the server files persist in a docker volume that represents the container's unprivileged user's home directory. Open a bash shell in
the running container:

```
docker compose exec web bash
```

Or open a shell into a new container if the docker stack is not up:
```
docker compose run --rm web bash
```

All the files used by the server are in a docker volume. Any change made will be reflected upon the next container startup.

Use this shell cautiously.

## TODO

* Create some way to send messages to players on the server using RCON.
* Implement multiple ids for mod commands.
