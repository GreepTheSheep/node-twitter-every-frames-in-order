FROM node:lts

WORKDIR /server/frameinorder

COPY ./src /server/frameinorder/src
COPY ./cache /server/frameinorder/cache
COPY ./package.json /server/frameinorder/package.json
COPY ./.env /server/frameinorder/.env

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm i --production

CMD node /server/frameinorder/src/index.js