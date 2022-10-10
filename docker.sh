#!/bin/bash

base=$(basename $(pwd))

docker stop fio-$base
docker build -t frameinorder-$base .
docker run --rm --name fio-$base -d frameinorder-$base