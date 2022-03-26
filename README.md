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

## Setup, Build. and Configure

Edit `files/serverDZ.cfg` and set the values of any variables there. 
See the [documentation](https://forums.dayz.com/topic/239635-dayz-server-files-documentation/):

```
hostname = "Something other than Server Name";   // Server name
```
Optionally edit `files/beserver_x64.cfg` and set the RCON password:
```
RConPassword h4CKm3
```
If the above step is not performed, a random RCON password will be generated and output on the first run. It can also be
obtained and reset. (See [Management](#manage))

Add your Steam credentials. This step is necessary if you want to add mods. The vanilla server is installable by setting
the steamlogin to `anonymous`. Edit `files/steamlogin` and set the steam username.
```
steamlogin=your_real_steam_username_or_anonymous
```
If you choose not to be anonymous, then you must login using your credentials. This is an interactive process that will
prompt for the password and Steam Guard code. This only needs to be done once.

Either way, we must build the container fist:
```
docker-compose build
```
Now login:
```
docker-compose run --rm run manage login
```
## Run
Launch the container into the background:
```
docker-compose up -d run
```
Tail the log:
```
docker-compose logs -f run
```
  
## Manage

### Workshop
To add a workshop item, edit `files/workshop.cfg` and add the item's id after the comment. Each id should be on its own
line, after the comment, which should not be removed. Install them:
```
docker-compose run --rm manage
```
* Makage -mod= command line

## TODO

* Update the server
* Restart the server
* RCON to the server?
* List current rocn password
* Detect changes to config files and propagate them, with prompting.
