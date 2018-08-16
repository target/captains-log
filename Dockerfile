FROM node:10.4.1-alpine

RUN yarn

COPY ./src/ /opt/src
COPY ./config/ /opt/config
COPY ./index.js /opt/index.js
COPY ./node_modules/ /opt/node_modules
COPY ./package.json /opt/package.json

ENTRYPOINT ["node", "/opt/index.js"]
