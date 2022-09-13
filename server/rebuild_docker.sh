#!bin/bash

export $(grep -v '^#' .env | xargs)

if [ ${MODE} == "development" ];
then
    docker-compose build --force-rm --no-cache
else
    docker-compose -f docker-compose.prod.yaml build --force-rm --no-cache
fi