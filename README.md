# DayZDockerServer

A Linux DayZ server in a Docker container.
The main script's functionality is derived from [this project](https://github.com/thelastnoc/dayz-sa_linuxserver).
That functionality is described [here](https://steamcommunity.com/sharedfiles/filedetails/?id=1517338673). The goal is
to reproduce all that functionality and add even more while keeping it all in Docker. 

## Caveat Emptor

As of DayZ release 1.15, a [Linux DayZ server](https://steamdb.info/app/1042420/) was made available in Dayz
Experimental. This has not been officially released, so this will only run a DayZ Experimental server at the
moment. Only the [DayZ Experimental client](https://dayz.fandom.com/wiki/Experimental) will be able to connect to it.

This process will create a docker volume for the unprivileged user's home directory, which stores the DayZ server files.
This volume can get quite large. It will require at least 2G of disk space for the default install. Much more with mods.

## Configure and Build

Edit `files/serverDZ.cfg` and set the values of any variables there. 
See the [documentation](https://forums.dayz.com/topic/239635-dayz-server-files-documentation/):

```
hostname = "Something other than Server Name";   // Server name
```
Optionally edit `files/beserver_x64.cfg` and set the RCON password (leaving the other lines intact):
```
RConPassword h4CKm3
```
If the above step is not performed, a random RCON password will be generated and output to the log on the first run. It 
can also be obtained and reset. See [Manage](#manage).

Build the Docker image:
```
docker-compose build
```

### Steam Integration

[SteamDMD](https://developer.valvesoftware.com/wiki/SteamCMD) is used to manage Steam downloads. A vanilla DayZ server
can be installed with the `anonymous` Steam user, but most mods cannot. If the goal is to add mods, a real Steam login
must be used. Login:
```
docker-compose run --rm main dayzserver login
```
Follow the prompts. Hit enter to accept the default, which is to use the `anonymous` user, otherwise use your real
username and keep following the prompts to add your password and Steam Guard code. With Steam Guard enabled on the Steam
account, entering the password will trigger the sending of an email with the code. This process will wait indefinitely
until the code is entered.

The credentials will be managed by [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) and stored in the
docker volume. All subsequent SteamCMD command will use the cached credentials. so this process does not need to be
repeated unless the session expires or the docker volume is deleted. 

Run the command again to manage the login. See [Manage](#manage). 

## Run
Launch the container into the background:
```
docker-compose up -d main
```
Tail the log:
```
docker-compose logs -f main
```
  
## Manage

### RCON
Show the current `beserver_x64.cfg` file:
```
docker-compose run --rm main rcon show
```
Reset the RCON password:
```
docker-compose run --rm main rcon reset
```
### Restart
```
docker-compose run --rm main restart
```
### Update the DayZ server files
```
docker-compose run --rm main update
```
### Workshop
WIP
```
docker-compose run --rm main workshop
```
* Makage -mod= command line

## TODO

* RCON to the server?
* List current rocn password
* Detect changes to config files and propagate them, with prompting.
