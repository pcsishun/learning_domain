# using node version 17 with alpine os
FROM node:17.8-alpine

# add tini & create app folder
# RUN apk add --no-cache tini && mkdir -p /usr/src/app

WORKDIR /

COPY package.json .
COPY package-lock.json .

RUN npm install && npm cache clean --force
COPY . .

EXPOSE 5555

CMD ["node", "index.js"]