FROM node:10.11.0-alpine

COPY ./src/ /opt/src
COPY ./config/ /opt/config
COPY ./index.js /opt/index.js
COPY ./package.json /opt/package.json

WORKDIR /opt/

RUN yarn install

ENTRYPOINT ["node", "/opt/index.js"]
