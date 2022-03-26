# DayZDockerServer

A Linux DayZ server in a Docker container.

Edit docker-compose.yml and set the variables:

```
- STEAMLOGIN=yourSteamLogin
- SERVERNAME="DayZ on Linux for Linux"
```
The steam login is necessary as the server files require ownership
of the game.

Build the container, run it, tail the logs:
```
docker-compose build
docker-compose up -d
docker-compose logs -f dayzserver
```