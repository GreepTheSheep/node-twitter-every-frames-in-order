#!/bin/bash

base=$(basename $(pwd))
port=$(grep -Po 'API_PORT=([0-9]+)' .env | cut -d= -f2)

docker stop fio-$base
docker build -t frameinorder-$base .
docker run --rm --name fio-$base -d -v $(pwd)/cache:/server/frameinorder/cache -p $port:$port frameinorder-$base