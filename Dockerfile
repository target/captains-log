FROM node:10.4.1-alpine

COPY ./src/ /opt/src
COPY ./config/ /opt/config
COPY ./index.js /opt/index.js
COPY ./package.json /opt/package.json

WORKDIR /opt/

RUN yarn install

ENTRYPOINT ["node", "/opt/index.js"]
