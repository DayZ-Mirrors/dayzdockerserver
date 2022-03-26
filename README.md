# DayZDockerServer

A Linux DayZ server in a Docker container. Uses a modified version of https://github.com/thelastnoc/dayz-sa_linuxserver

### Setup

Edit `files/serverDZ.cfg` and set the server name:

```
hostname = "Something other than Server Name";   // Server name
```
Optionally edit `files/beserver_x64.cfg` and set the rcon password:
```
RConPassword h4CKm3
```
### Running
Build the container, run it, tail the logs:
```
docker-compose build
docker-compose up -d
docker-compose logs -f dayzserver
```