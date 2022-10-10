#!/bin/bash

base=$(basename $(pwd))

docker stop fio-$($base)
docker build -t FrameInOrder-$($base) .
docker start --rm --name  fio-$($base) -d FrameInOrder-$($base)