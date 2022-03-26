# DayZDockerServer

A Linux DayZ server in a Docker container.

Edit docker-compose.yml and set the variables:

```
- SERVERNAME="DayZ on Linux for Linux"
```
Build the container, run it, tail the logs:
```
docker-compose build
docker-compose up -d
docker-compose logs -f dayzserver
```