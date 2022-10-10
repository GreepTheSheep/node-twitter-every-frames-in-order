#!/bin/bash

base=$(basename $(pwd))
port=$(grep -Po 'API_PORT=([0-9]+)' .env | cut -d= -f2)

docker stop fio-$base | true
docker rm -v $(docker ps -a -q -f status=exited) | true
docker build -t frameinorder-$base .
docker run --name fio-$base --restart unless-stopped -d -v $(pwd)/cache:/server/frameinorder/cache -p $port:$port frameinorder-$base