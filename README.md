# DayZDockerServer

A Linux DayZ server in a Docker container. Uses a modified version of https://github.com/thelastnoc/dayz-sa_linuxserver
for all the Steam management. More info here https://steamcommunity.com/sharedfiles/filedetails/?id=1517338673.
### Caveat Emptor
Uses a docker volume for the unprivileged user's home directory, which stores the DayZ server files plus SteamCMD, a 
utility used to manage Steam content from the command line. This volume can get quite large. Out of the box, as of this
writing, DayZ Experimental is at 1.17 and the volume comes to about 1.8G of disk space once all the files are downloaded.

### Setup, Build. and Configure

Edit `files/serverDZ.cfg` and set the server name (You don't really have to, but you should):

```
hostname = "Something other than Server Name";   // Server name
```
Optionally edit `files/beserver_x64.cfg` and set the rcon password:
```
RConPassword h4CKm3
```
If the above step is not performed, a random rcon password will be generated and output on the first run. It can also be
obtained later and reset.

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
docker-compose run --rm config
```
### Run
Launch the container into the background:
```
docker-compose up -d dayzserver
```
Tail the log:
```
docker-compose logs -f dayzserver
```
### Workshop (TODO)
* Update/Add/Remove workshop files
* Makage -mod= command line
### Maintenance (TODO)
* Update the server
* Restart the server
* Rcon to the server?
* List current rocn password
* Detect changes to config files and propagate them