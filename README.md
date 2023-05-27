# DayZDockerServer

A Linux [DayZ](https://dayz.com) server in a [Docker](https://docs.docker.com/) container. The main script's
functionality is derived from [this project](https://github.com/thelastnoc/dayz-sa_linuxserver). That functionality is
described [here](https://steamcommunity.com/sharedfiles/filedetails/?id=1517338673). The goal is to reproduce some of
that functionality but also add more features. 

## Caveat Emptor

As of DayZ release 1.15, a [Linux DayZ server](https://steamdb.info/app/1042420/) was made available in Dayz
Experimental. This has not been officially released, so this will only run a DayZ Experimental server at the
moment. Only the [DayZ Experimental client](https://dayz.fandom.com/wiki/Experimental) will be able to connect to it.
The goal is to have a working implementation once the Linux server is officially released, presumably
[here](https://steamdb.info/app/223350/).

This process will create a docker volume for the unprivileged user's home directory, which stores the DayZ server files.
This volume can get quite large. It will require at least 2G of disk space for the default install. Much more with mods.
Some map mods are as large as 10G. Make sure you have that much disk space in the location where docker stores its
volumes, usually `/var/lib/docker/volumes`.

## Goals

* Provide a turnkey DayZ server with mod support.

## Configure and Build

Ensure [Docker](https://docs.docker.com/engine/install/) and [Docker compose](https://docs.docker.com/compose/install/)
are properly installed. This means setting it up so it runs as your user. Make sure you're running these commands as
your user, in your home directory.

Clone the repo, and change into the newly created directory:

```
git clone https://ceregatti.org/git/daniel/dayzdockerserver.git
cd dayzdockerserver
```

Edit `files/serverDZ.cfg` and set the values of any variables there. 
See the [documentation](https://forums.dayz.com/topic/239635-dayz-server-files-documentation/):

```
hostname = "Something other than Server Name";   // Server name
```

Build the Docker image:

```
docker compose build
```

### Steam Integration

[SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) is used to manage Steam downloads. A vanilla DayZ server
can be installed with the `anonymous` Steam user, but most mods cannot. If the goal is to add mods, a real Steam login
must be used. Login:

```
docker compose run --rm main dayzserver login
```

Follow the prompts. Hit enter to accept the default, which is to use the `anonymous` user, otherwise use your real
username and keep following the prompts to add your password and Steam Guard code. With Steam Guard enabled on the Steam
account, entering the password will trigger the sending of an email with the code. This process will wait indefinitely
until the code is entered.

The credentials will be managed by [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD). How it encrypts or
otherwise obfuscates the credentials is beyond the scope of this document. Suffice to say that they are stored in the
docker volume. All subsequent SteamCMD commands will use the stored credentials. so this process does not need to be
repeated unless the session expires or the docker volume is deleted.

Run the command again to manage the login. See [Manage](#manage). 

## Install

The server files must be installed before the server can be run:
```
docker compose run --rm main dayzserver install
```
This process will download the several gigabyes of files required to run the server.

## Run

Launch the container into the background:

```
docker compose up -d
```

Tail the log:

```
docker compose logs -f
```
## Stop

To stop the DayZ server:
```
docker compose exec main dz stop
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
The dayzserver script manages what's necessary to configure and run it:

```
docker compose exec main dayzserver rcon
```

To reset the RCON password in the Battle Eye configuration file, simply delete it, and a random one will be generated
on the next server startup:

```
docker compose run --rm main rm serverfiles/battleye/baserver_x64_active*
```

### Update the DayZ server files

It's probably not a good idea to update the server files while it's running. Make sure it's down first:

```
docker compose down
```

Then run the command:

```
docker compose run --rm main dayzserver update
```

Don't forget to [bring it back up](#run).

### Stop the server

```
docker compose exec main dayzserver stop
```

The server doesn't always exit when stopping it (SIGINT). When this happens, it's necessary to force stop it (SIGKILL):

```
docker compose exec main dayzserver force
```

When the server exits cleanly, i.e. exit code 0, the container also stops. Otherwise, a crash is presumed, and the server will be restarted.

NOTE: As DayZ Experimental 1.19, the server is known to not exit upon SIGINT when mods are installed. This makes force stopping the server
required. This is not a clean exit, and will cause the server to restart. Manually take the server [down](#stop) to stop the container.

### Workshop - Add / List / Remove / Update mods

Interactive interface for managing mods. 

```
docker compose exec main dayzserver activate id | add id1 | deactivate id | list | modupdate | remove id
docker compose exec main dayzserver a id | add id1 | d id | l | m | r id
```

Look for mods in the [DayZ Workshop](https://steamcommunity.com/app/221100/workshop/). Browse to one. In its URL will be
an `id` parameter. Here is the URL to SimpleAutoRun: https://steamcommunity.com/sharedfiles/filedetails/?id=2264162971. To
add it:

```
docker compose exec main dayzserver add 2264162971
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
docker compose exec main bash
```

Or open a shell into a new container if the docker stack is not up:
```
docker compose run --rm main bash
```

All the files used by the server are in a docker volume. Any change made will be reflected upon the next container startup.

Use this shell cautiously.

## TODO

* Create some way to send messages to players on the server using RCON.
* Implement multiple ids for mod commands.
